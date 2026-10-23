-- Five-round Time Drop v2; preserve ten-round v1 saves and private score reconstruction.
begin;
create or replace function public._friend_time_drop_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare n int; i int; e jsonb; x numeric; field text; ids text[]:='{}'; y int; lo int; hi int; g int; a int; b int; error int; allowance int; points int:=0;
begin
 n=case when v->'version'='1'::jsonb then 10 when v->'version'='2'::jsonb then 5 else 0 end;
 if n=0 then return null;end if;
 if jsonb_typeof(v) is distinct from 'object' or v->'scoreVersion' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or v->'round' is distinct from to_jsonb(n-1) or coalesce(v->>'phase','') not in ('review','summary') then return null;end if;
 if jsonb_typeof(v->'edits') is distinct from 'number' then return null;end if;x=(v->>'edits')::numeric;if x<>trunc(x) or x<0 or x>1000000 then return null;end if;
 if jsonb_typeof(v->'events') is distinct from 'array' or jsonb_array_length(v->'events')<>n or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>n or v->'guess' is distinct from v->'picks'->(n-1) then return null;end if;
 for i in 0..n-1 loop
  e=v->'events'->i;
  if jsonb_typeof(e) is distinct from 'object' then return null;end if;
  foreach field in array array['id','title','fact','category','source'] loop
   if jsonb_typeof(e->field) is distinct from 'string' or char_length(trim(e->>field))=0 or char_length(e->>field)>(case field when 'id' then 100 when 'title' then 180 when 'fact' then 1000 when 'category' then 40 else 2000 end) then return null;end if;
  end loop;
  if e->>'id' !~ '^[a-z0-9-]+$' or e->>'source' !~ '^https://' or e->>'id'=any(ids) then return null;end if;ids=array_append(ids,e->>'id');
  foreach field in array array['year','earliest','latest'] loop
   if jsonb_typeof(e->field) is distinct from 'number' then return null;end if;x=(e->>field)::numeric;if x<>trunc(x) or x=0 or x< -4000 or x>2100 then return null;end if;
  end loop;
  y=(e->>'year')::int;lo=(e->>'earliest')::int;hi=(e->>'latest')::int;
  if lo>y or y>hi or (hi-case when hi>0 then 1 else 0 end)-(lo-case when lo>0 then 1 else 0 end)>200 then return null;end if;
  if jsonb_typeof(v->'picks'->i) is distinct from 'number' then return null;end if;x=(v->'picks'->>i)::numeric;if x<>trunc(x) or x=0 or x< -4000 or x>2100 then return null;end if;g=x;
  error=0;if g<lo then a=lo;b=g;elsif g>hi then a=g;b=hi;else a=0;b=0;end if;
  if a<>0 then error=(a-case when a>0 then 1 else 0 end)-(b-case when b>0 then 1 else 0 end);end if;
  allowance=case when y<0 then 500 when y<1000 then 250 when y<1700 then 150 when y<1900 then 100 else 50 end;
  points=points+greatest(0,round(1000*(1-error::numeric/allowance))::int);
 end loop;
 return points/(n*10.0);
exception when others then return null;
end $$;
revoke all on function public._friend_time_drop_score(jsonb,date) from public,anon,authenticated;

commit;
