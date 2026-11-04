-- Codebreak v1. Apply after the current setup/Friends/game/league scripts.
-- Existing game tables, receipts and save APIs are retained.
begin;
create schema if not exists br_codebreak;
revoke all on schema br_codebreak from public,anon,authenticated;
grant usage on schema br_codebreak to authenticated;
create or replace function br_codebreak.daily(d date) returns text language plpgsql immutable set search_path='' as $$
declare n int:=(((((d-date '2026-11-04')%1296)+1296)%1296)*487+293)%1296;outcode text:='';i int;
begin
 for i in 1..4 loop outcode=(n%6+1)::text||outcode;n=n/6;end loop;return outcode;
end $$;
create or replace function br_codebreak.valid_daily(v jsonb,d date) returns boolean language plpgsql immutable set search_path='' as $$
declare g jsonb;seen text[]:=array[]::text[];n int:=0;won boolean:=false;ended boolean;
begin
 if d is null or jsonb_typeof(v) is distinct from 'object' or (select count(*) from jsonb_object_keys(v))<>9 or not(v?&array['version','kind','day','id','code','guesses','draft','phase','edits']) then return false;end if;
 if v->'version' is distinct from '1'::jsonb or jsonb_typeof(v->'code') is distinct from 'string' or jsonb_typeof(v->'day') is distinct from 'string' or jsonb_typeof(v->'id') is distinct from 'string' or v->>'kind' is distinct from 'daily' or v->>'day' is distinct from to_char(d,'YYYY-MM-DD') or v->>'id' is distinct from v->>'day' or v->>'code' is distinct from br_codebreak.daily(d) or jsonb_typeof(v->'guesses') is distinct from 'array' or jsonb_array_length(v->'guesses')>8 or jsonb_typeof(v->'draft') is distinct from 'string' or v->>'draft'!~'^[1-6]{0,4}$' or jsonb_typeof(v->'phase') is distinct from 'string' or v->>'phase' not in ('play','complete') or jsonb_typeof(v->'edits') is distinct from 'number' then return false;end if;
 if (v->>'edits')::numeric<>trunc((v->>'edits')::numeric) or (v->>'edits')::numeric<jsonb_array_length(v->'guesses') or (v->>'edits')::numeric>1000000000 then return false;end if;
 for g in select value from jsonb_array_elements(v->'guesses') loop
  if won or jsonb_typeof(g) is distinct from 'string' or (g#>>'{}')!~'^[1-6]{4}$' or (g#>>'{}')=any(seen) then return false;end if;
  seen=array_append(seen,g#>>'{}');n=n+1;won=(g#>>'{}')=(v->>'code');
 end loop;
 ended=won or n=8;return (v->>'phase')=(case when ended then 'complete' else 'play' end) and (not ended or v->>'draft'='');
exception when others then return false;end $$;
create or replace function br_codebreak.score(v jsonb,d date) returns double precision language sql immutable set search_path='' as $$
 select case when br_codebreak.valid_daily(v,d) and v->>'phase'='complete' then case when v->'guesses'->>-1=v->>'code' then 100-10*greatest(0,jsonb_array_length(v->'guesses')-3) else 0 end else null end::double precision
$$;
create table if not exists public.codebreak_saves(
 user_id uuid not null references auth.users(id) on delete cascade,
 game text not null default 'codebreak' check(game='codebreak'),
 data jsonb not null default '{}'::jsonb check(jsonb_typeof(data)='object' and octet_length(data::text)<=2000000),
 revision bigint not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 primary key(user_id,game)
);
alter table public.codebreak_saves enable row level security;
revoke all on public.codebreak_saves from public,anon,authenticated;
grant select on public.codebreak_saves to authenticated;
drop policy if exists own_codebreak_read on public.codebreak_saves;
create policy own_codebreak_read on public.codebreak_saves for select to authenticated using((select auth.uid())=user_id);
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
   if br_codebreak.score(public._friend_json(stored.data->>k),public._friend_date(right(k,10))) is not null and p_data->k is distinct from stored.data->k then raise exception 'Completed Codebreak results are locked';end if;
  end loop;
 end if;
 insert into public.codebreak_saves(user_id,game,data,revision) values(who,'codebreak',p_data,1)
 on conflict(user_id,game) do update set data=excluded.data,revision=codebreak_saves.revision+1,updated_at=now() returning * into stored;
 return jsonb_build_object('conflict',false,'revision',stored.revision);
end $$;
create or replace function public.save_codebreak(p_game text,p_data jsonb,p_revision bigint)
returns jsonb language sql security invoker set search_path='' as $$ select br_codebreak.save(p_game,p_data,p_revision) $$;
create or replace function br_codebreak.records(who uuid,today date)
returns table(game text,day date,arcade_score double precision) language plpgsql stable set search_path='' as $$
declare rowdata record;e record;d date;s double precision;
begin
 for rowdata in select data from public.codebreak_saves where user_id=who loop
  for e in select * from jsonb_each_text(rowdata.data) loop
   if e.key!~'^break-room:codebreak:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$' then continue;end if;
   d=public._friend_date(right(e.key,10));if d is null or d<today-119 or d>today then continue;end if;
   s=br_codebreak.score(public._friend_json(e.value),d);if s is not null then game='codebreak';day=d;arcade_score=s;return next;end if;
  end loop;
 end loop;
end $$;
create or replace function br_codebreak.friend_scores()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare me uuid:=auth.uid();today date:=timezone('Australia/Sydney',now())::date;result jsonb;
begin
 if me is null then raise exception 'Sign in required' using errcode='42501';end if;
 if not exists(select 1 from public.friend_profiles where user_id=me) then return jsonb_build_object('today',today,'records','[]'::jsonb);end if;
 select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'game',r.game,'date',r.day,'arcadeScore',r.arcade_score) order by p.user_id,r.day),'[]'::jsonb) into result
 from public.friend_profiles p cross join lateral br_codebreak.records(p.user_id,today) r
 where p.user_id=me or (p.share_scores and exists(select 1 from public.friend_links f where f.status='accepted' and ((f.requester=me and f.recipient=p.user_id) or (f.recipient=me and f.requester=p.user_id))) and not exists(select 1 from public.friend_blocks b where (b.owner_id=me and b.target_id=p.user_id) or (b.owner_id=p.user_id and b.target_id=me)));
 return jsonb_build_object('today',today,'records',result);
end $$;
create or replace function public.codebreak_friend_scores()
returns jsonb language sql stable security invoker set search_path='' as $$ select br_codebreak.friend_scores() $$;
revoke all on function br_codebreak.daily(date),br_codebreak.valid_daily(jsonb,date),br_codebreak.score(jsonb,date),br_codebreak.records(uuid,date),br_codebreak.save(text,jsonb,bigint),br_codebreak.friend_scores(),public.save_codebreak(text,jsonb,bigint),public.codebreak_friend_scores() from public,anon,authenticated;
grant execute on function br_codebreak.save(text,jsonb,bigint),br_codebreak.friend_scores(),public.save_codebreak(text,jsonb,bigint),public.codebreak_friend_scores() to authenticated;

-- Ten launch games. Historical Sleeper weeks and the short nine-game period
-- retain their original metadata; this week's required pair is unchanged.
create or replace function br_league.games() returns text[] language sql immutable set search_path='' as $$
 select array['laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','stack-up','pack','lowball','inner-clock']::text[]
$$;
create or replace function br_league.games_on(d date) returns text[] language sql immutable set search_path='' as $$
 select case when d<date '2026-11-02' then array['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock']::text[]
 when d<date '2026-11-04' then array['laser','time-drop','clue-ladder','seating-chart','shift-work','stack-up','pack','lowball','inner-clock']::text[] else br_league.games() end
$$;
create or replace function br_league.required(d date) returns text[] language sql immutable set search_path='' as $$
 select array[g[1+i],g[1+(i+1)%cardinality(g)]] from
 (select g,(((br_league.week_start(d)-date '2026-10-26')/7*2%cardinality(g))+cardinality(g))%cardinality(g) i from (select br_league.games_on(d) g) groups) pairs
$$;
create or replace function br_league.records(who uuid,today date)
returns jsonb language plpgsql stable set search_path='' as $$
declare rowdata record;e record;v jsonb;d date;s double precision;outrows jsonb:='[]';startday date:=br_league.week_start(today);h jsonb;i int;
begin
 for rowdata in
  select game,data from public.game_saves where user_id=who and game=any(br_league.games_on(today))
  union all select game,data from public.hidden_gem_saves where user_id=who and today<date '2026-11-02'
  union all select game,data from public.shift_work_saves where user_id=who
  union all select game,data from public.codebreak_saves where user_id=who and 'codebreak'=any(br_league.games_on(today))
 loop
  if rowdata.game='lowball' then
   h=public._friend_json(rowdata.data->>'pc_history');
   for i in 0..6 loop
    d=startday+i;if d>today then continue;end if;
    v=h->((d-date '2026-10-01')::text);s=null;
    if jsonb_typeof(v)='number' and (v#>>'{}')::numeric between 0 and 100 then s=(v#>>'{}')::double precision;
    elsif public._friend_date(rowdata.data->>'pc_last')=d then
     v=public._friend_json(rowdata.data->>'pc_last_avg');
     if jsonb_typeof(v)='number' and (v#>>'{}')::numeric between 0 and 100 then s=(v#>>'{}')::double precision;end if;
    end if;
    if s is not null then outrows=outrows||jsonb_build_array(jsonb_build_object('game','lowball','date',d,'arcadeScore',s));end if;
   end loop;
  else
   for e in select key,value from jsonb_each_text(rowdata.data) loop
    d=public._friend_date(right(e.key,10));if d is null or d<startday or d>today then continue;end if;
    if e.key is distinct from (case when rowdata.game='codebreak' then 'break-room:codebreak:daily:' when rowdata.game='hidden-gem' then 'break-room:hidden-gem:daily:' when rowdata.game='shift-work' then 'break-room:shift-work:daily:' else 'break-room:'||rowdata.game||':daily:' end)||d::text then continue;end if;
    v=public._friend_json(e.value);
    s=case when rowdata.game='codebreak' then br_codebreak.score(v,d) when rowdata.game='hidden-gem' then public._friend_hidden_gem_score(v,d) when rowdata.game='shift-work' then public._friend_shift_work_score(v,d) else public._friend_score(rowdata.game,v,d) end;
    if s is not null then outrows=outrows||jsonb_build_array(jsonb_build_object('game',rowdata.game,'date',d,'arcadeScore',s));end if;
   end loop;
  end if;
 end loop;return outrows;
end $$;

revoke all on function br_league.games(),br_league.games_on(date),br_league.required(date),br_league.records(uuid,date) from public,anon,authenticated;
commit;
