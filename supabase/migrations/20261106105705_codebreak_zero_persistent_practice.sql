-- Codebreak v6: zero digit and private validators; no native saves are rewritten.
begin;
create or replace function br_codebreak.daily_v6(d date) returns text language plpgsql immutable set search_path='' as $$
declare n int:=(((((d-date '2026-11-04')%10000)+10000)%10000)*487+293)%10000;
begin return lpad(n::text,4,'0');end $$;
create or replace function br_codebreak.valid_daily(v jsonb,d date) returns boolean language plpgsql immutable set search_path='' as $$
declare g jsonb;seen text[]:=array[]::text[];n int:=0;won boolean:=false;ended boolean;
begin
 if d is null or jsonb_typeof(v) is distinct from 'object' or (select count(*) from jsonb_object_keys(v))<>9 or not(v?&array['version','kind','day','id','code','guesses','draft','phase','edits']) then return false;end if;
 if v->'version' not in ('1'::jsonb,'2'::jsonb,'3'::jsonb,'4'::jsonb,'5'::jsonb,'6'::jsonb) or jsonb_typeof(v->'code') is distinct from 'string' or jsonb_typeof(v->'day') is distinct from 'string' or jsonb_typeof(v->'id') is distinct from 'string' or v->>'kind' is distinct from 'daily' or v->>'day' is distinct from to_char(d,'YYYY-MM-DD') or v->>'id' is distinct from v->>'day' or v->>'code' is distinct from (case when v->'version'='6'::jsonb then br_codebreak.daily_v6(d) when v->'version' in ('3'::jsonb,'4'::jsonb,'5'::jsonb) then br_codebreak.daily_v3(d) else br_codebreak.daily(d) end) or jsonb_typeof(v->'guesses') is distinct from 'array' or jsonb_array_length(v->'guesses')>8 or jsonb_typeof(v->'draft') is distinct from 'string' or v->>'draft'!~(case when v->'version'='6'::jsonb then '^[0-9]{0,4}$' when v->'version' in ('3'::jsonb,'4'::jsonb,'5'::jsonb) then '^[1-9]{0,4}$' else '^[1-6]{0,4}$' end) or jsonb_typeof(v->'phase') is distinct from 'string' or v->>'phase' not in ('play','complete') or jsonb_typeof(v->'edits') is distinct from 'number' then return false;end if;
 if (v->>'edits')::numeric<>trunc((v->>'edits')::numeric) or (v->>'edits')::numeric<jsonb_array_length(v->'guesses') or (v->>'edits')::numeric>1000000000 then return false;end if;
 for g in select value from jsonb_array_elements(v->'guesses') loop
  if won or jsonb_typeof(g) is distinct from 'string' or (g#>>'{}')!~(case when v->'version'='6'::jsonb then '^[0-9]{4}$' when v->'version' in ('3'::jsonb,'4'::jsonb,'5'::jsonb) then '^[1-9]{4}$' else '^[1-6]{4}$' end) or (g#>>'{}')=any(seen) then return false;end if;
  seen=array_append(seen,g#>>'{}');n=n+1;won=(g#>>'{}')=(v->>'code');
 end loop;
 ended=won or n=8;return (v->>'phase')=(case when ended then 'complete' else 'play' end) and (not ended or v->>'draft'='');
exception when others then return false;end $$;
create or replace function br_codebreak.score(v jsonb,d date) returns double precision language sql immutable set search_path='' as $$
 select case when br_codebreak.valid_daily(v,d) and v->>'phase'='complete' then case when v->'guesses'->>-1=v->>'code' then 100-(case when v->'version' in ('5'::jsonb,'6'::jsonb) then 20 else 10 end)*greatest(0,jsonb_array_length(v->'guesses')-(case when v->'version' in ('4'::jsonb,'5'::jsonb,'6'::jsonb) then 4 when v->'version' in ('2'::jsonb,'3'::jsonb) then 5 else 3 end)) else 0 end else null end::double precision
$$;
revoke all on function br_codebreak.daily_v6(date),br_codebreak.valid_daily(jsonb,date),br_codebreak.score(jsonb,date) from public,anon,authenticated;
do $upgrade$ begin
 if to_regnamespace('br_leaderboard') is not null then
 execute $functions$create or replace function br_leaderboard.rules(g text) returns text language sql immutable set search_path='' as $$
 select case g when 'codebreak' then '6' when 'stack-up' then '2:4' when 'seating-chart' then '2' when 'time-drop' then '2:1' when 'shift-work' then '1' when 'clue-ladder' then '1' when 'lowball' then '1' when 'pack' then '1' when 'laser' then '1' when 'inner-clock' then '1' end
$$;
$functions$;
 execute $functions$create or replace function br_leaderboard.current_rules(g text,v jsonb) returns boolean language sql immutable set search_path='' as $$
 select coalesce(case g when 'lowball' then true when 'codebreak' then v->'version'='6'::jsonb when 'stack-up' then v->'version'='2'::jsonb and v->'scoreVersion'='4'::jsonb when 'seating-chart' then v->'version'='2'::jsonb when 'time-drop' then v->'version'='2'::jsonb and v->'scoreVersion'='1'::jsonb else br_leaderboard.rules(g)='1' and v->'version'='1'::jsonb end,false)
$$;

$functions$;
 end if;end $upgrade$;
commit;
