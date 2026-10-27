-- Expand only Sleeper's snapshot answer bound; preserve scoring, ownership and ACLs.
begin;
create or replace function public._hg_question(q jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare a jsonb;x jsonb;k text;
begin
if jsonb_typeof(q) is distinct from 'object' then return false;end if;
foreach k in array array['id','prompt','scope','topic','source'] loop if jsonb_typeof(q->k) is distinct from 'string' then return false;end if;end loop;
if char_length(q->>'id') not between 1 and 80 or char_length(q->>'prompt') not between 1 and 240 or char_length(q->>'scope')>400 or char_length(q->>'topic')>30 or char_length(q->>'source')>400 or left(q->>'source',8)<>'https://' then return false;end if;
if jsonb_typeof(q->'answers') is distinct from 'array' or jsonb_array_length(q->'answers') not between 2 and 160 then return false;end if;
for a in select value from jsonb_array_elements(q->'answers') loop
if jsonb_typeof(a->'name') is distinct from 'string' or char_length(a->>'name') not between 1 and 100 or char_length(public._hg_normal(a->>'name'))>100 or not public._hg_int(a->'points',1,100) or jsonb_typeof(a->'aliases') is distinct from 'array' or jsonb_array_length(a->'aliases')>12 then return false;end if;
for x in select value from jsonb_array_elements(a->'aliases') loop if jsonb_typeof(x) is distinct from 'string' or char_length(x#>>'{}') not between 1 and 100 or char_length(public._hg_normal(x#>>'{}'))>100 then return false;end if;end loop;
end loop;return true;exception when others then return false;end $$;
revoke all on function public._hg_question(jsonb) from public,anon,authenticated;
commit;
