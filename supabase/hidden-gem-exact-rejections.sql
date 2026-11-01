-- Snapshot-owned exact exclusions prevent known wrong answers being treated as typos.
-- Old snapshots omit this optional field and retain their original matching and scores.
begin;
create or replace function public._hg_question(q jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare a jsonb;x jsonb;k text;
begin
if jsonb_typeof(q) is distinct from 'object' then return false;end if;
foreach k in array array['id','prompt','scope','topic','source'] loop if jsonb_typeof(q->k) is distinct from 'string' then return false;end if;end loop;
if char_length(q->>'id') not between 1 and 80 or char_length(q->>'prompt') not between 1 and 240 or char_length(q->>'scope')>400 or char_length(q->>'topic')>30 or char_length(q->>'source')>400 or left(q->>'source',8)<>'https://' then return false;end if;
if jsonb_typeof(q->'answers') is distinct from 'array' or jsonb_array_length(q->'answers') not between 2 and 512 then return false;end if;
for a in select value from jsonb_array_elements(q->'answers') loop
if jsonb_typeof(a->'name') is distinct from 'string' or char_length(a->>'name') not between 1 and 240 or char_length(public._hg_normal(a->>'name'))>240 or not public._hg_int(a->'points',1,100) or jsonb_typeof(a->'aliases') is distinct from 'array' or jsonb_array_length(a->'aliases')>32 then return false;end if;
for x in select value from jsonb_array_elements(a->'aliases') loop if jsonb_typeof(x) is distinct from 'string' or char_length(x#>>'{}') not between 1 and 240 or char_length(public._hg_normal(x#>>'{}'))>240 then return false;end if;end loop;
end loop;
if q ? 'inputMap' then
if jsonb_typeof(q->'inputMap') is distinct from 'object' then return false;end if;
if (select count(*) from jsonb_each(q->'inputMap'))>512 or (q ? 'inputMapCaseSensitive' and jsonb_typeof(q->'inputMapCaseSensitive') is distinct from 'boolean') then return false;end if;
for k,x in select key,value from jsonb_each(q->'inputMap') loop
if char_length(k) not between 1 and 240 or jsonb_typeof(x) is distinct from 'string' or not exists(select 1 from jsonb_array_elements(q->'answers') as entry(value) where entry.value->>'name'=(x#>>'{}')) then return false;end if;
end loop;end if;
if q ? 'exactRejections' then
if jsonb_typeof(q->'exactRejections') is distinct from 'array' or jsonb_array_length(q->'exactRejections')>512 then return false;end if;
for x in select value from jsonb_array_elements(q->'exactRejections') loop
if jsonb_typeof(x) is distinct from 'string' or char_length(x#>>'{}') not between 1 and 240 or char_length(public._hg_normal(x#>>'{}')) not between 1 and 240 then return false;end if;
end loop;end if;
return true;exception when others then return false;end $$;
create or replace function public._hg_match(q jsonb,input text) returns jsonb language plpgsql immutable set search_path='' as $$
declare n text;a jsonb;x text;target text;exact jsonb;nearby jsonb;ne int:=0;nc int:=0;hit boolean;close_hit boolean;
begin
if input is null or char_length(input)>240 or not public._hg_question(q) then return null;end if;
if q ? 'inputMap' then
n=public._hg_trim(input);if coalesce(q->>'inputMapCaseSensitive','false')<>'true' then n=lower(n);end if;
target=q->'inputMap'->>n;
if target is not null then
select value into exact from jsonb_array_elements(q->'answers') where value->>'name'=target limit 1;
if exact is not null then return jsonb_build_object('answer',exact->'name','points',exact->'points','typo',false);end if;end if;end if;
n=public._hg_normal(input);if n='' or char_length(n)>240 then return null;end if;
for a in select value from jsonb_array_elements(q->'answers') loop hit=false;close_hit=false;
for x in select a->>'name' union all select value from jsonb_array_elements_text(a->'aliases') loop target=public._hg_normal(x);if target=n then hit=true;end if;
if char_length(target)>=6 and abs(char_length(target)-char_length(n))<=1 and public._hg_distance(n,target)<=1 then close_hit=true;end if;end loop;
if hit then ne=ne+1;exact=a;end if;if close_hit then nc=nc+1;nearby=a;end if;end loop;
if ne=1 then return jsonb_build_object('answer',exact->'name','points',exact->'points','typo',false);elsif ne=0 and nc=1 and not exists(select 1 from jsonb_array_elements_text(coalesce(q->'exactRejections','[]'::jsonb)) as excluded(value) where public._hg_normal(excluded.value)=n) then return jsonb_build_object('answer',nearby->'name','points',nearby->'points','typo',true);end if;return null;
exception when others then return null;end $$;
revoke all on function public._hg_question(jsonb),public._hg_match(jsonb,text) from public,anon,authenticated;
commit;
