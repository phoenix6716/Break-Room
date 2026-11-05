-- Existing installation update: three-table v2 plus frozen five-table v1.
-- No player rows or shared write APIs change.
begin;
create or replace function public._friend_seating_chart_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare t jsonb; i int; g int; drama int; minimum int; points int:=0; ids text[]:='{}';n int;
begin
 n=case when v->'version'='1'::jsonb then 5 when v->'version'='2'::jsonb then 3 else null end;
 if n is null then return null;end if;
 if jsonb_typeof(v) is distinct from 'object' or v->>'day' is distinct from d::text or not public._sc_int(v->'edits',0,1000000) or v->'round' is distinct from to_jsonb(n-1) or coalesce(v->>'phase','') not in ('review','summary') or v->'selected' is distinct from '-1'::jsonb or v->'undo' is distinct from '[]'::jsonb then return null;end if;
 if jsonb_typeof(v->'tables') is distinct from 'array' or jsonb_array_length(v->'tables')<>n or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>n or v->'seats' is distinct from v->'picks'->(n-1) then return null;end if;
 for i in 0..n-1 loop
 t=v->'tables'->i;if n=3 and (t->'tier' is distinct from to_jsonb((array[1,3,5])[i+1]) or t->'g' is distinct from to_jsonb((array[6,8,10])[i+1])) then return null;end if;if not public._sc_table(t) or t->>'id'=any(ids) then return null;end if;ids=array_append(ids,t->>'id');g=(t->>'g')::int;
 if not public._sc_order(v->'picks'->i,g) then return null;end if;
 minimum=(t->>'best')::int;drama=public._sc_cost(t,v->'picks'->i);if drama<minimum then return null;end if;
 points=points+greatest(0,1000-200*(drama-minimum));
 end loop;return points/(10.0*n);
exception when others then return null;
end $$;
revoke all on function public._friend_seating_chart_score(jsonb,date) from public,anon,authenticated;
commit;
