-- Trusted authoring data. One compressed row per immutable bank avoids millions
-- of repeated hash/name/index rows on the existing free database plan.
create table if not exists public.sleeper_banks(
 id text primary key check(id ~ '^[a-f0-9]{64}$'),
 question jsonb not null check(jsonb_typeof(question)='object'),
 answer_count integer not null check(answer_count between 300 and 250000),
 answer_data jsonb not null check(jsonb_typeof(answer_data)='array'),
 forms jsonb not null check(jsonb_typeof(forms)='object'),
 exact_rejections text[] not null default '{}'
);
alter table public.sleeper_banks enable row level security;
revoke all on public.sleeper_banks from public,anon,authenticated;
-- Prefer faster TOAST compression when the PostgreSQL build supports it.
do $$begin
begin
alter table public.sleeper_banks alter column answer_data set compression lz4;
alter table public.sleeper_banks alter column forms set compression lz4;
exception when feature_not_supported then null;end;
end $$;
create or replace function public._hg_immutable_bank() returns trigger language plpgsql set search_path='' as $$
begin raise exception 'Sleeper catalogue versions are immutable';end $$;
drop trigger if exists immutable_sleeper_bank on public.sleeper_banks;
create trigger immutable_sleeper_bank before update or delete on public.sleeper_banks for each row execute function public._hg_immutable_bank();
create or replace function public._hg_check_bank() returns trigger language plpgsql set search_path='' as $$
declare a jsonb;i int:=0;n text;v jsonb;k text;
begin
if jsonb_array_length(new.answer_data)<>new.answer_count or cardinality(new.exact_rejections)>512 then raise exception 'Sleeper catalogue answer count differs';end if;
foreach k in array array['id','topic','prompt','scope','source'] loop if jsonb_typeof(new.question->k) is distinct from 'string' then raise exception 'Invalid catalogue header';end if;end loop;
if char_length(new.question->>'id') not between 1 and 80 or char_length(new.question->>'prompt') not between 1 and 240 or char_length(new.question->>'topic') not between 1 and 30 or char_length(new.question->>'scope')>400 or char_length(new.question->>'source')>400 or left(new.question->>'source',8)<>'https://' then raise exception 'Invalid catalogue header';end if;
for a in select value from jsonb_array_elements(new.answer_data) loop
if jsonb_typeof(a) is distinct from 'array' or jsonb_array_length(a)<>2 or jsonb_typeof(a->0) is distinct from 'string' or char_length(a->>0) not between 1 and 240 or not public._hg_int(a->1,1,100) then raise exception 'Invalid catalogue answer';end if;
n=public._hg_normal(a->>0);if new.forms->n is distinct from to_jsonb(i) then raise exception 'Sleeper catalogue canonical form missing';end if;i=i+1;
end loop;
for n,v in select key,value from jsonb_each(new.forms) loop
if char_length(n) not between 1 and 240 or n<>public._hg_normal(n) or not public._hg_int(v,0,new.answer_count-1) or n=any(new.exact_rejections) then raise exception 'Sleeper catalogue invalid form or exclusion';end if;
end loop;
foreach n in array new.exact_rejections loop if n is null or char_length(n) not between 1 and 240 or n<>public._hg_normal(n) then raise exception 'Invalid catalogue exclusion';end if;end loop;
return new;end $$;
drop trigger if exists check_sleeper_bank on public.sleeper_banks;
create trigger check_sleeper_bank before insert on public.sleeper_banks for each row execute function public._hg_check_bank();
create or replace function public._hg_import_bank(raw text,expected_hash text) returns int language plpgsql set search_path='' as $$
declare doc jsonb;answers jsonb;forms jsonb;exclusions text[];ambiguous boolean;n int;a jsonb;x jsonb;
begin
if expected_hash !~ '^[a-f0-9]{64}$' or octet_length(raw)>64000000 or encode(sha256(convert_to(raw,'UTF8')),'hex') is distinct from expected_hash then raise exception 'Catalogue hash mismatch';end if;
select answer_count into n from public.sleeper_banks where id=expected_hash;if found then return n;end if;
doc=raw::jsonb;
if doc->>'format' is distinct from 'sleeper-bank-v1' or jsonb_typeof(doc->'question') is distinct from 'object' or jsonb_typeof(doc->'answers') is distinct from 'array' then raise exception 'Invalid catalogue document';end if;
n=jsonb_array_length(doc->'answers');if n not between 300 and 250000 then raise exception 'Invalid catalogue size';end if;
for a in select value from jsonb_array_elements(doc->'answers') loop
if jsonb_typeof(a->'name') is distinct from 'string' or not public._hg_int(a->'points',1,100) or jsonb_typeof(a->'aliases') is distinct from 'array' or jsonb_array_length(a->'aliases')>512 then raise exception 'Invalid catalogue answer';end if;
for x in select value from jsonb_array_elements(a->'aliases') loop if jsonb_typeof(x) is distinct from 'string' or char_length(x#>>'{}') not between 1 and 240 then raise exception 'Invalid catalogue alias';end if;end loop;
end loop;
select jsonb_agg(jsonb_build_array(item.entry->'name',item.entry->'points') order by item.position) into answers from jsonb_array_elements(doc->'answers') with ordinality as item(entry,position);
with entries as materialized(select item.entry,(item.position-1)::int as i from jsonb_array_elements(doc->'answers') with ordinality as item(entry,position)),
raw_forms as(select e.i,public._hg_normal(e.entry->>'name') as name from entries e union all select e.i,public._hg_normal(alias_value.input_form) from entries e cross join lateral jsonb_array_elements_text(e.entry->'aliases') alias_value(input_form)),
owners as(select name,min(i) as owner,count(distinct i) as count from raw_forms group by name)
select jsonb_object_agg(name,owner),bool_or(count>1) into forms,ambiguous from owners;
if ambiguous then raise exception 'Ambiguous catalogue aliases';end if;
if doc ? 'exactRejections' then
if jsonb_typeof(doc->'exactRejections') is distinct from 'array' or jsonb_array_length(doc->'exactRejections')>512 then raise exception 'Invalid catalogue exclusions';end if;
for x in select value from jsonb_array_elements(doc->'exactRejections') loop if jsonb_typeof(x) is distinct from 'string' or char_length(x#>>'{}') not between 1 and 240 then raise exception 'Invalid catalogue exclusion';end if;end loop;
end if;
select coalesce(array_agg(public._hg_normal(value)),'{}') into exclusions from jsonb_array_elements_text(coalesce(doc->'exactRejections','[]'::jsonb));
insert into public.sleeper_banks(id,question,answer_count,answer_data,forms,exact_rejections) values(expected_hash,doc->'question',n,answers,forms,exclusions);return n;
end $$;
create or replace function public._hg_question(q jsonb) returns boolean language plpgsql stable set search_path='' as $$
declare b public.sleeper_banks;k text;
begin
if not(q ? 'bankRef') then return public._hg_full_question(q);end if;
if jsonb_typeof(q) is distinct from 'object' or jsonb_typeof(q->'bankRef') is distinct from 'object' or (select count(*) from jsonb_object_keys(q->'bankRef'))<>2 or (q->'bankRef'->>'id') !~ '^[a-f0-9]{64}$' or not public._hg_int(q->'bankRef'->'count',300,250000) then return false;end if;
select * into b from public.sleeper_banks where id=q->'bankRef'->>'id';
if not found or b.answer_count<>(q->'bankRef'->>'count')::int then return false;end if;
foreach k in array array['id','topic','prompt','scope','source'] loop if q->k is distinct from b.question->k then return false;end if;end loop;
if exists(select 1 from jsonb_object_keys(q) as x(key) where x.key not in ('id','topic','prompt','scope','source','bankRef','receipt')) then return false;end if;
return true;exception when others then return false;end $$;
create or replace function public._hg_edits(n text) returns text[] language plpgsql immutable set search_path='' as $$
declare result text[]:='{}';i int;j int;alphabet text:='abcdefghijklmnopqrstuvwxyz0123456789 ';len int:=char_length(n);
begin
if len>241 then return result;end if;
if len>0 then for i in 1..len loop
result=array_append(result,left(n,i-1)||substr(n,i+1));
if i<len then result=array_append(result,left(n,i-1)||substr(n,i+1,1)||substr(n,i,1)||substr(n,i+2));end if;
for j in 1..37 loop result=array_append(result,left(n,i-1)||substr(alphabet,j,1)||substr(n,i+1));end loop;
end loop;end if;
for i in 0..len loop for j in 1..37 loop result=array_append(result,left(n,i)||substr(alphabet,j,1)||substr(n,i+1));end loop;end loop;
return result;end $$;
create or replace function public._hg_match(q jsonb,input text) returns jsonb language plpgsql stable set search_path='' as $$
declare b public.sleeper_banks;n text;a jsonb;index int;candidate int;target text;forms jsonb;
begin
if not(q ? 'bankRef') then return public._hg_full_match(q,input);end if;
if input is null or char_length(input)>240 or not public._hg_question(q) then return null;end if;
n=public._hg_normal(input);if n='' or char_length(n)>241 then return null;end if;
select * into b from public.sleeper_banks where id=q->'bankRef'->>'id';index=(b.forms->>n)::int;
if index is not null then a=b.answer_data->index;return jsonb_build_object('answer',a->0,'points',a->1,'typo',false);end if;
if n=any(b.exact_rejections) then return null;end if;
-- Materialise the compressed dictionary once for all typo-neighbour lookups.
forms=b.forms||'{}'::jsonb;
foreach target in array public._hg_edits(n) loop
if char_length(target)<6 then continue;end if;index=(forms->>target)::int;
if index is not null then if candidate is not null and candidate<>index then return null;end if;candidate=index;end if;
end loop;
if candidate is not null then a=b.answer_data->candidate;return jsonb_build_object('answer',a->0,'points',a->1,'typo',true);end if;return null;
exception when others then return null;end $$;
