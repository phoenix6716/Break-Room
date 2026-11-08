-- Additive validation only: no save rows, scoring formula or visibility changes.
begin;
create or replace function public._sc_cost(t jsonb,o jsonb) returns int language plpgsql immutable set search_path='' as $$
declare g int:=(t->>'g')::int; positions int[]; i int; r jsonb; a int; b int; d int; typ text; drama int:=0;
begin
 positions=array_fill(0,array[g],array[0]);
 for i in 0..g-1 loop positions[(o->>i)::int]=i;end loop;
 for r in select value from jsonb_array_elements(t->'rules') loop
 a=(r->>'a')::int;b=(r->>'b')::int;d=abs(positions[a]-positions[b]);d=least(d,g-d);typ=r->>'type';
 if not (case typ when 'A' then d=1 when 'N' then d<>1 when 'D' then d=2 when 'O' then d*2=g when 'E' then d=1 or least(abs(positions[a]-positions[(r->>'c')::int]),g-abs(positions[a]-positions[(r->>'c')::int]))=1 when 'S' then (r->'seats') @> to_jsonb(positions[a]) else false end) then drama=drama+1;end if;
 end loop;return drama;
end $$;
create or replace function public._sc_table(t jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare g int; r jsonb; x jsonb; seen text[]:='{}'; k text; a int; b int;
begin
 if jsonb_typeof(t) is distinct from 'object' or jsonb_typeof(t->'id') is distinct from 'string' or t->>'id' !~ '^sc-(v3-)?[1-5]-[0-9]{3}$' or not public._sc_int(t->'tier',1,5) or not public._sc_int(t->'g',6,10) or not public._sc_int(t->'best',0,2) then return false;end if;g=(t->>'g')::int;
 if jsonb_typeof(t->'names') is distinct from 'array' or jsonb_array_length(t->'names')<>g then return false;end if;
 for x in select value from jsonb_array_elements(t->'names') loop
 if jsonb_typeof(x) is distinct from 'string' or (x#>>'{}') !~ '^[A-Za-z]{2,12}$' or (x#>>'{}')=any(seen) then return false;end if;seen=array_append(seen,x#>>'{}');
 end loop;seen='{}';
 if jsonb_typeof(t->'rules') is distinct from 'array' or jsonb_array_length(t->'rules') not between 3 and 12 then return false;end if;
 for r in select value from jsonb_array_elements(t->'rules') loop
 if jsonb_typeof(r) is distinct from 'object' or jsonb_typeof(r->'type') is distinct from 'string' or r->>'type' not in ('A','N','D','O','E','S') or not public._sc_int(r->'a',0,g-1) or not public._sc_int(r->'b',0,g-1) or r->'a'=r->'b' or (r->>'type'='O' and g%2<>0) or jsonb_typeof(r->'story') is distinct from 'string' or char_length(r->>'story')>180 then return false;end if;
 if r->>'type' in ('E','S') and t->>'id' not like 'sc-v3-%' then return false;end if;
 if r->>'type'='E' and (not public._sc_int(r->'c',0,g-1) or r->'c'=r->'a' or r->'c'=r->'b') then return false;end if;
 if r->>'type'='S' then
 if jsonb_typeof(r->'seats') is distinct from 'array' or jsonb_array_length(r->'seats')<>2 or r->'seats'->0=r->'seats'->1 or not public._sc_int(r->'seats'->0,0,g-1) or not public._sc_int(r->'seats'->1,0,g-1) then return false;end if;end if;
 a=(r->>'a')::int;b=(r->>'b')::int;k=(r->>'type')||':'||least(a,b)||':'||greatest(a,b);if k=any(seen) then return false;end if;seen=array_append(seen,k);
 end loop;
 if jsonb_typeof(t->'conflict') is distinct from 'array' or (t->>'best'='0' and jsonb_array_length(t->'conflict')<>0) or (t->>'best'<>'0' and jsonb_array_length(t->'conflict')<2) then return false;end if;seen='{}';
 for x in select value from jsonb_array_elements(t->'conflict') loop
 if not public._sc_int(x,0,jsonb_array_length(t->'rules')-1) or (x#>>'{}')=any(seen) then return false;end if;seen=array_append(seen,x#>>'{}');end loop;
 if not public._sc_order(t->'solution',g) then return false;end if;
 return public._sc_cost(t,t->'solution')=(t->>'best')::int;
exception when others then return false;
end $$;
create or replace function public._friend_shift_work_score(v jsonb,p_day date) returns double precision language plpgsql immutable set search_path='' as $$
declare b jsonb;r jsonb;trace jsonb;last_trace jsonb;s numeric:=0;expected int:=(((p_day-date '2026-10-25')%40)+40)%40+1;i int;rating int;mn int;h int;pool text;
begin
if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'kind' is distinct from 'daily' or v->>'day' is distinct from p_day::text or jsonb_typeof(v->'id') is distinct from 'string' or char_length(v->>'id')>100 or not public._sw_int(v->'edits',0,1000000000) or v->'round' is distinct from '2'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'boards') is distinct from 'array' or jsonb_array_length(v->'boards')<>3 or jsonb_typeof(v->'results') is distinct from 'array' or jsonb_array_length(v->'results')<>3 then return null;end if;
for i in 0..2 loop b=v->'boards'->i;r=v->'results'->i;pool=case i when 0 then 'low' when 1 then 'mid' else 'high' end;
if p_day>=date '2026-11-10' and v->'boards'->0->>'pool'='mid' then pool=case i when 0 then 'mid' when 1 then 'high' else 'hard' end;end if;
if b->>'id' is distinct from 'sw-v1-'||pool||'-'||lpad(expected::text,3,'0') or not public._sw_board(b) or r->>'id' is distinct from b->>'id' or r->'min' is distinct from b->'min' or not public._sw_int(r->'hints',0,10000) then return null;end if;
trace=public._sw_replay(b,r->'actions');if trace is null or trace->'solved' is distinct from 'true'::jsonb or r->'moves' is distinct from trace->'moves' then return null;end if;
mn=(b->>'min')::int;h=(r->>'hints')::int;rating=round(least(case when h>0 then 75 else 100 end,100.0*mn/greatest(mn,(trace->>'moves')::int)));
if r->'score' is distinct from to_jsonb(rating) then return null;end if;s=s+rating;last_trace=trace;
end loop;
if v->'pos' is distinct from last_trace->'pos' or v->'undo' is distinct from last_trace->'undo' or v->'moves' is distinct from last_trace->'moves' or v->'hints' is distinct from v->'results'->2->'hints' or v->'actions' is distinct from v->'results'->2->'actions' then return null;end if;
return round(s/3)::double precision;
exception when others then return null;end $$;
revoke all on function public._sc_cost(jsonb,jsonb),public._sc_table(jsonb),public._friend_shift_work_score(jsonb,date) from public,anon,authenticated;
commit;
