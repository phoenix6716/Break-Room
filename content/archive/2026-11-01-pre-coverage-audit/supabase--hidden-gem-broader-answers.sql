-- Sleeper bounded rosters: private validation/matching only. Existing snapshots and ACLs are preserved.
begin;
create or replace function public._hg_distance(a text,b text) returns int language plpgsql immutable set search_path='' as $$
declare al int:=char_length(a);bl int:=char_length(b);d int[];i int;j int;cost int;
begin
if al>240 or bl>240 then return 241;end if;d=array_fill(0,array[al+1,bl+1],array[0,0]);
for i in 0..al loop d[i][0]=i;end loop;for j in 0..bl loop d[0][j]=j;end loop;
if al>0 and bl>0 then for i in 1..al loop for j in 1..bl loop
cost=case when substr(a,i,1)=substr(b,j,1) then 0 else 1 end;d[i][j]=least(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+cost);
if i>1 and j>1 and substr(a,i,1)=substr(b,j-1,1) and substr(a,i-1,1)=substr(b,j,1) then d[i][j]=least(d[i][j],d[i-2][j-2]+1);end if;
end loop;end loop;end if;return d[al][bl];end $$;
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
if ne=1 then return jsonb_build_object('answer',exact->'name','points',exact->'points','typo',false);elsif ne=0 and nc=1 then return jsonb_build_object('answer',nearby->'name','points',nearby->'points','typo',true);end if;return null;
exception when others then return null;end $$;
create or replace function public._friend_hidden_gem_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare q jsonb;p jsonb;a jsonb;i int;total int:=0;ids text[]:='{}';
begin
if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'kind' is distinct from 'daily' or v->>'day' is distinct from d::text or jsonb_typeof(v->'id') is distinct from 'string' or char_length(v->>'id')>100 or not public._hg_int(v->'edits',0,1000000) or not public._hg_int(v->'rejections',0,1000000) or v->'round' is distinct from '4'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or v->'deadline' is distinct from 'null'::jsonb or v->>'error' is distinct from '' or jsonb_typeof(v->'input') is distinct from 'string' or char_length(v->>'input')>240 then return null;end if;
if jsonb_typeof(v->'questions') is distinct from 'array' or jsonb_array_length(v->'questions')<>5 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>5 then return null;end if;
for i in 0..4 loop q=v->'questions'->i;p=v->'picks'->i;
if not public._hg_question(q) or q->>'id'=any(ids) then return null;end if;ids=array_append(ids,q->>'id');
if jsonb_typeof(p) is distinct from 'object' or jsonb_typeof(p->'timedOut') is distinct from 'boolean' or jsonb_typeof(p->'input') is distinct from 'string' or char_length(p->>'input')>240 or public._hg_trim(p->>'input') is distinct from p->>'input' then return null;end if;
a=public._hg_match(q,p->>'input');
if a is null then
if p->'timedOut' is distinct from 'true'::jsonb or p->'answer' is distinct from 'null'::jsonb or p->'points' is distinct from '0'::jsonb or p->'typo' is distinct from 'false'::jsonb or p->>'reason' is distinct from 'timeout' then return null;end if;
else
if p->'answer' is distinct from a->'answer' or p->'points' is distinct from a->'points' or p->'typo' is distinct from a->'typo' or p->>'reason' is distinct from 'accepted' then return null;end if;total=total+(a->>'points')::int;
end if;end loop;
if public._hg_trim(v->>'input') is distinct from v->'picks'->4->>'input' then return null;end if;
return total/5.0;exception when others then return null;end $$;
revoke all on function public._hg_int(jsonb,int,int),public._hg_trim(text),public._hg_normal(text),public._hg_distance(text,text),public._hg_question(jsonb),public._hg_match(jsonb,text),public._friend_hidden_gem_score(jsonb,date) from public,anon,authenticated;
commit;
