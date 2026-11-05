-- Add first-try Stack Up scoring; preserve all captured prior scores and other games.
begin;
-- Stack Up versions 3/4 share receipt validation; only version 4 removes speed/streak weighting.
create or replace function public._stack_average(v jsonb) returns double precision language plpgsql immutable set search_path='' as $$
declare i int;q jsonb;mistakes int;seconds int;streak int:=0;earned int;raw_total numeric:=0;credit double precision:=0;
begin
 if coalesce(v->'scoreVersion','null'::jsonb) not in ('3'::jsonb,'4'::jsonb) or jsonb_typeof(v->'results') is distinct from 'array' or jsonb_array_length(v->'results')<>5 then return null;end if;
 for i in 0..4 loop
  q=v->'results'->i;
  if jsonb_typeof(q->'correct') is distinct from 'boolean' or jsonb_typeof(q->'points') is distinct from 'number' or jsonb_typeof(q->'mistakes') is distinct from 'number' or jsonb_typeof(q->'seconds') is distinct from 'number' then return null;end if;
  if (q->>'mistakes')::numeric<>trunc((q->>'mistakes')::numeric) or (q->>'mistakes')::numeric not between 0 and 1000000 or (q->>'seconds')::numeric<>trunc((q->>'seconds')::numeric) or (q->>'seconds')::numeric not between 0 and 90 then return null;end if;
  mistakes=(q->>'mistakes')::int;seconds=(q->>'seconds')::int;if mistakes>0 then streak=0;end if;
  if (q->>'correct')::boolean then earned=100+5*seconds+35*streak;streak=streak+1;else if seconds<>0 then return null;end if;earned=-40;streak=0;end if;
  if (q->>'points')::numeric<>earned then return null;end if;
  raw_total=raw_total+earned-30*mistakes;
  credit=credit+case when (q->>'correct')::boolean then case when v->'scoreVersion'='4'::jsonb then greatest(0,100-20*mistakes) else greatest(0,least(100,(earned-30.0*mistakes)/(550+35*i)*100)) end else 0 end;
 end loop;
 if v->'score' is distinct from to_jsonb(raw_total) or v->'streak' is distinct from to_jsonb(streak) or v->'mistakes' is distinct from to_jsonb(mistakes) then return null;end if;
 return credit/5;
exception when others then return null;
end $$;
revoke all on function public._stack_average(jsonb) from public,anon,authenticated;
CREATE OR REPLACE FUNCTION public._friend_score(g text, v jsonb, d date)
 RETURNS double precision
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare i int; j int; n numeric; bet int; pick int; answer int; total int:=0; won int:=0; legacy int[]; q jsonb; c jsonb;
begin
 if jsonb_typeof(v) is distinct from 'object' then return null;end if;
 if g='stake' then
  if jsonb_typeof(v->'b')<>'array' or jsonb_typeof(v->'p')<>'array' or jsonb_array_length(v->'b')<>5 or jsonb_array_length(v->'p')<>5 then return null;end if;
  if v->>'rv' is not null and jsonb_typeof(v->'rv')<>'boolean' then return null;end if;
  if v->>'deadline' is not null and (jsonb_typeof(v->'deadline')<>'number' or (v->>'deadline')::numeric<=0) then return null;end if;
  if v->>'qs' is null then legacy=public._friend_legacy(d);
  elsif jsonb_typeof(v->'qs')<>'array' or jsonb_array_length(v->'qs')<>5 then return null;end if;
  for i in 0..4 loop
   if jsonb_typeof(v->'b'->i)<>'number' or jsonb_typeof(v->'p'->i)<>'number' then return null;end if;
   n=(v->'b'->>i)::numeric;if n<>trunc(n) or n<1 or n>3 then return null;end if;bet=n;
   n=(v->'p'->>i)::numeric;if n<>trunc(n) or n< -1 or n>2 then return null;end if;pick=n;
   if legacy is not null then answer=legacy[i+1];else
    q=v->'qs'->i;
    if jsonb_typeof(q->'q') is distinct from 'string' or jsonb_typeof(q->'c') is distinct from 'string' or jsonb_typeof(q->'f') is distinct from 'string' or jsonb_typeof(q->'o') is distinct from 'array' or jsonb_array_length(q->'o')<>3 or jsonb_typeof(q->'a') is distinct from 'number' then return null;end if;
    for j in 0..2 loop if jsonb_typeof(q->'o'->j)<>'string' then return null;end if;end loop;
    n=(q->>'a')::numeric;if n<>trunc(n) or n<0 or n>2 then return null;end if;answer=n;
   end if;
   total=total+bet;if pick=answer then won=won+bet;end if;
  end loop;return won::double precision/total*100;
 elsif g='seating-chart' then return public._friend_seating_chart_score(v,d);
 elsif g='clue-ladder' then return public._friend_clue_ladder_score(v,d);
 elsif g='time-drop' then return public._friend_time_drop_score(v,d);
 elsif g='inner-clock' then return public._friend_inner_clock_score(v,d);
 elsif g='bouncer' then return public._friend_bouncer_score(v,d);
 elsif g='alibi' then return public._friend_alibi_score(v,d);
 elsif g='laser' then return public._friend_laser_score(v,d);
 elsif g='prior' then return public._friend_prior_score(v,d);
 elsif g='pack' then return public._friend_pack_score(v,d);
 elsif g='stack-up' then
  if coalesce(v->>'version','') not in ('1','2') or v->>'day' is distinct from d::text or v->>'status' is distinct from 'complete' or v->'round' is distinct from '4'::jsonb then return null;end if;
  if jsonb_typeof(v->'version') is distinct from 'number' or jsonb_typeof(v->'score') is distinct from 'number' or jsonb_typeof(v->'deadline') is distinct from 'number' then return null;end if;
  foreach q in array array[v->'streak',v->'mistakes'] loop if jsonb_typeof(q) is distinct from 'number' or q::text::numeric<0 or q::text::numeric<>trunc(q::text::numeric) then return null;end if;end loop;
  if jsonb_typeof(v->'results') is distinct from 'array' or jsonb_array_length(v->'results')<>5 or jsonb_typeof(v->'order') is distinct from 'array' or jsonb_array_length(v->'order')<>5 then return null;end if;
  if (select count(distinct x) from jsonb_array_elements(v->'order') x where jsonb_typeof(x)='number' and x in ('1'::jsonb,'2'::jsonb,'3'::jsonb,'4'::jsonb,'5'::jsonb))<>5 then return null;end if;
  for i in 0..4 loop q=v->'results'->i;if jsonb_typeof(q->'correct') is distinct from 'boolean' or jsonb_typeof(q->'points') is distinct from 'number' or jsonb_typeof(q->'mistakes') is distinct from 'number' or (q->>'mistakes')::numeric<0 or (q->>'mistakes')::numeric<>trunc((q->>'mistakes')::numeric) then return null;end if;end loop;
  if not (v->>'version'='1' and v->>'stacks' is null) then
   if jsonb_typeof(v->'stacks') is distinct from 'array' or jsonb_array_length(v->'stacks')<>5 then return null;end if;
   for i in 0..4 loop q=v->'stacks'->i;
    if jsonb_typeof(q->'prompt') is distinct from 'string' or jsonb_typeof(q->'fact') is distinct from 'string' or jsonb_typeof(q->'ends') is distinct from 'array' or jsonb_array_length(q->'ends')<>2 or jsonb_typeof(q->'cards') is distinct from 'array' or jsonb_array_length(q->'cards')<>5 then return null;end if;
    for j in 0..4 loop c=q->'cards'->j;if jsonb_typeof(c->'name') is distinct from 'string' or c->'value' is distinct from to_jsonb(j+1) then return null;end if;end loop;
   end loop;
  end if;
  if v->'scoreVersion' in ('3'::jsonb,'4'::jsonb) then return public._stack_average(v);end if;
  if v ? 'scoreVersion' and v->'scoreVersion' not in ('1'::jsonb,'2'::jsonb) then return null;end if;
  return greatest(0,least(100,(v->>'score')::double precision/(case when v->'scoreVersion'='2'::jsonb then 3100 else 31000 end)*100));
 end if;return null;
exception when others then return null;
end $function$;

revoke all on function public._friend_score(text,jsonb,date) from public,anon,authenticated;
commit;

