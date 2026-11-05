-- Codebreak v2: apply after codebreak.sql, before publishing the v2 frontend.
-- No player data or v1 code/score constants are rewritten.
begin;
create or replace function br_codebreak.valid_daily(v jsonb,d date) returns boolean language plpgsql immutable set search_path='' as $$
declare g jsonb;seen text[]:=array[]::text[];n int:=0;won boolean:=false;ended boolean;
begin
 if d is null or jsonb_typeof(v) is distinct from 'object' or (select count(*) from jsonb_object_keys(v))<>9 or not(v?&array['version','kind','day','id','code','guesses','draft','phase','edits']) then return false;end if;
 if v->'version' not in ('1'::jsonb,'2'::jsonb) or jsonb_typeof(v->'code') is distinct from 'string' or jsonb_typeof(v->'day') is distinct from 'string' or jsonb_typeof(v->'id') is distinct from 'string' or v->>'kind' is distinct from 'daily' or v->>'day' is distinct from to_char(d,'YYYY-MM-DD') or v->>'id' is distinct from v->>'day' or v->>'code' is distinct from br_codebreak.daily(d) or jsonb_typeof(v->'guesses') is distinct from 'array' or jsonb_array_length(v->'guesses')>8 or jsonb_typeof(v->'draft') is distinct from 'string' or v->>'draft'!~'^[1-6]{0,4}$' or jsonb_typeof(v->'phase') is distinct from 'string' or v->>'phase' not in ('play','complete') or jsonb_typeof(v->'edits') is distinct from 'number' then return false;end if;
 if (v->>'edits')::numeric<>trunc((v->>'edits')::numeric) or (v->>'edits')::numeric<jsonb_array_length(v->'guesses') or (v->>'edits')::numeric>1000000000 then return false;end if;
 for g in select value from jsonb_array_elements(v->'guesses') loop
  if won or jsonb_typeof(g) is distinct from 'string' or (g#>>'{}')!~'^[1-6]{4}$' or (g#>>'{}')=any(seen) then return false;end if;
  seen=array_append(seen,g#>>'{}');n=n+1;won=(g#>>'{}')=(v->>'code');
 end loop;
 ended=won or n=8;return (v->>'phase')=(case when ended then 'complete' else 'play' end) and (not ended or v->>'draft'='');
exception when others then return false;end $$;
create or replace function br_codebreak.score(v jsonb,d date) returns double precision language sql immutable set search_path='' as $$
 select case when br_codebreak.valid_daily(v,d) and v->>'phase'='complete' then case when v->'guesses'->>-1=v->>'code' then 100-10*greatest(0,jsonb_array_length(v->'guesses')-(case when v->'version'='2'::jsonb then 5 else 3 end)) else 0 end else null end::double precision
$$;
create or replace function br_codebreak.save(p_game text,p_data jsonb,p_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare who uuid:=auth.uid();stored public.codebreak_saves;k text;d date;v jsonb;
begin
 if who is null then raise exception 'Sign in required' using errcode='42501';end if;
 if p_game is distinct from 'codebreak' or p_revision is null or p_revision<0 or p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>2000000 or (select count(*) from jsonb_object_keys(p_data))>2000 then raise exception 'Invalid Codebreak save';end if;
 for k in select jsonb_object_keys(p_data) loop
  if k!~'^break-room:codebreak:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$' or jsonb_typeof(p_data->k)<>'string' or char_length(p_data->>k)>250000 then raise exception 'Unsupported Codebreak save entry';end if;
  d=public._friend_date(right(k,10));v=public._friend_json(p_data->>k);if not br_codebreak.valid_daily(v,d) then raise exception 'Invalid captured Codebreak state';end if;
 end loop;
 perform pg_advisory_xact_lock(hashtextextended(who::text||':codebreak',0));
 select * into stored from public.codebreak_saves where user_id=who and game='codebreak' for update;
 if coalesce(stored.revision,0)<>p_revision then return jsonb_build_object('conflict',true,'revision',coalesce(stored.revision,0));end if;
 if stored.user_id is not null then
  for k in select jsonb_object_keys(stored.data) loop
   v=public._friend_json(stored.data->>k);
   if br_codebreak.valid_daily(v,public._friend_date(right(k,10))) and (not(p_data?k) or (public._friend_json(p_data->>k)->'version') is distinct from (v->'version')) then raise exception 'Captured Codebreak rules are locked';end if;
   if br_codebreak.score(public._friend_json(stored.data->>k),public._friend_date(right(k,10))) is not null and p_data->k is distinct from stored.data->k then raise exception 'Completed Codebreak results are locked';end if;
  end loop;
 end if;
 insert into public.codebreak_saves(user_id,game,data,revision) values(who,'codebreak',p_data,1)
 on conflict(user_id,game) do update set data=excluded.data,revision=codebreak_saves.revision+1,updated_at=now() returning * into stored;
 return jsonb_build_object('conflict',false,'revision',stored.revision);
end $$;
revoke all on function br_codebreak.valid_daily(jsonb,date),br_codebreak.score(jsonb,date),br_codebreak.save(text,jsonb,bigint) from public,anon,authenticated;
grant execute on function br_codebreak.save(text,jsonb,bigint) to authenticated;
commit;
