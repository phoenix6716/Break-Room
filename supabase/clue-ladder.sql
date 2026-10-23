-- Add Clue Ladder after current Time Drop; preserve all existing data.
-- Preserves every existing game's saves, RLS and friend relationships.
begin;
alter table public.game_saves drop constraint if exists game_saves_game_check;
alter table public.game_saves add constraint game_saves_game_check check (game in ('stake','stack-up','lowball','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder'));
create or replace function public.save_game(p_game text,p_data jsonb,p_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); stored public.game_saves; k text;
begin
 if owner_id is null then raise exception 'Sign in required' using errcode='42501'; end if;
 if p_game is null or p_game not in ('stake','stack-up','lowball','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder') or p_revision is null or p_revision<0 or p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>2000000 then raise exception 'Invalid save'; end if;
 for k in select jsonb_object_keys(p_data) loop
  if jsonb_typeof(p_data->k)<>'string' or not (
   (p_game='stake' and (k ~ '^stake:d:[0-9]{4}-[0-9]{2}-[0-9]{2}$' or k='stake:streak')) or
   (p_game='clue-ladder' and k ~ '^break-room:clue-ladder:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='time-drop' and k ~ '^break-room:time-drop:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='inner-clock' and k ~ '^break-room:inner-clock:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='bouncer' and k ~ '^break-room:bouncer:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='alibi' and k ~ '^break-room:alibi:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='laser' and k ~ '^break-room:laser:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='prior' and k ~ '^break-room:prior:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='pack' and k ~ '^break-room:pack:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='stack-up' and k ~ '^break-room:stack-up:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
   (p_game='lowball' and k=any(array['pc_history','pc_progress','pc_last','pc_last_avg','pc_last_share','pc_streak','pc_best','pc_played','pc_country']))
  ) then raise exception 'Unsupported save entry'; end if;
 end loop;
 -- Serialize first inserts as well as updates for this user/game.
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text||':'||p_game,0));
 select * into stored from public.game_saves where user_id=owner_id and game=p_game for update;
 if coalesce(stored.revision,0)<>p_revision then
  return jsonb_build_object('conflict',true,'revision',coalesce(stored.revision,0));
 end if;
 insert into public.game_saves(user_id,game,data,revision) values(owner_id,p_game,p_data,1)
 on conflict(user_id,game) do update set data=excluded.data,revision=game_saves.revision+1,updated_at=now()
 returning * into stored;
 return jsonb_build_object('conflict',false,'revision',stored.revision);
end $$;
revoke all on function public.save_game(text,jsonb,bigint) from public,anon;
grant execute on function public.save_game(text,jsonb,bigint) to authenticated;
-- Private reconstruction: never trust client-reported points.
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

CREATE OR REPLACE FUNCTION public._clue_norm(v text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
 select regexp_replace(trim(regexp_replace(regexp_replace(replace(lower(regexp_replace(normalize(v,NFKD),'[̀-ͯ]','','g')),'&',' and '),'[^a-z0-9 ]',' ','g'),' +',' ','g')),'^(the|a|an) ','');
$function$;

CREATE OR REPLACE FUNCTION public._clue_distance(a text, b text)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare n int:=length(a); k int:=length(b); m int[][]; i int; j int;
begin
 if n>80 or k>80 then return 81;end if;
 m=array_fill(0,array[n+1,k+1],array[0,0]);for i in 0..n loop m[i][0]=i;end loop;for j in 0..k loop m[0][j]=j;end loop;
 for i in 1..n loop for j in 1..k loop
 m[i][j]=least(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+case when substr(a,i,1)=substr(b,j,1) then 0 else 1 end);
 if i>1 and j>1 and substr(a,i,1)=substr(b,j-1,1) and substr(a,i-1,1)=substr(b,j,1) then m[i][j]=least(m[i][j],m[i-2][j-2]+1);end if;
 end loop;end loop;return m[n][k];
end $function$;

CREATE OR REPLACE FUNCTION public._clue_match(g text, p jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare n text:=public._clue_norm(g); a text; names text[]; r text;
begin
 if length(g)>80 or coalesce(n,'')='' then return false;end if;
 select array_agg(public._clue_norm(value)) into names from (select p->>'answer' value union all select jsonb_array_elements_text(p->'aliases')) s;
 if n=any(names) then return true;end if;
 for r in select jsonb_array_elements_text(p->'rejects') loop if public._clue_norm(r)=n then return false;end if;end loop;
 foreach a in array names loop if length(a)>=6 and abs(length(a)-length(n))<=1 and public._clue_distance(n,a)<=1 then return true;end if;end loop;return false;
end $function$;

CREATE OR REPLACE FUNCTION public._friend_clue_ladder_score(v jsonb, d date)
 RETURNS double precision
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare i int; j int; p jsonb; q jsonb; a jsonb; field text; s text; n numeric; ids text[]:='{}'; guesses text[]; solved boolean; points int:=0; sz int;
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or v->'round' is distinct from '4'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or v->'input' is distinct from '""'::jsonb or v->'attempts' is distinct from '[]'::jsonb then return null;end if;
 if jsonb_typeof(v->'edits') is distinct from 'number' then return null;end if;n=(v->>'edits')::numeric;if n<>trunc(n) or n<0 or n>1000000 then return null;end if;
 if jsonb_typeof(v->'puzzles') is distinct from 'array' or jsonb_array_length(v->'puzzles')<>5 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>5 then return null;end if;
 for i in 0..4 loop
 p=v->'puzzles'->i;
 if jsonb_typeof(p) is distinct from 'object' then return null;end if;
 foreach field in array array['id','answer','category','fact','source'] loop
 if jsonb_typeof(p->field) is distinct from 'string' or char_length(trim(p->>field))=0 or char_length(p->>field)>(case field when 'id' then 80 when 'answer' then 80 when 'category' then 40 when 'fact' then 800 else 2000 end) then return null;end if;end loop;
 if p->>'id' !~ '^[a-z0-9-]+$' or p->>'id'=any(ids) or p->>'source' !~ '^https://' or public._clue_norm(p->>'answer')='' or p->>'category' not in ('ANIMAL','PLACE','FOOD','SCIENCE','TECH','CULTURE','SPORT','EVERYDAY') then return null;end if;ids=array_append(ids,p->>'id');
 foreach field in array array['aliases','clues','rejects'] loop
 if jsonb_typeof(p->field) is distinct from 'array' then return null;end if;sz=jsonb_array_length(p->field);
 if (field='aliases' and sz>12) or (field='clues' and sz<>5) or (field='rejects' and sz>40) then return null;end if;
 for q in select value from jsonb_array_elements(p->field) loop
 if jsonb_typeof(q) is distinct from 'string' then return null;end if;s=q#>>'{}';
 if char_length(trim(s))=0 or char_length(s)>(case when field='clues' then 240 else 80 end) or (field='aliases' and public._clue_norm(s)='') then return null;end if;end loop;end loop;
 a=v->'picks'->i;if jsonb_typeof(a) is distinct from 'array' then return null;end if;sz=jsonb_array_length(a);if sz<1 or sz>5 then return null;end if;guesses='{}';solved=false;
 for j in 0..sz-1 loop q=a->j;
 if q='null'::jsonb then solved=false;
 elsif jsonb_typeof(q)='string' then s=q#>>'{}';if char_length(trim(s))=0 or char_length(s)>80 or public._clue_norm(s)='' or public._clue_norm(s)=any(guesses) then return null;end if;guesses=array_append(guesses,public._clue_norm(s));solved=public._clue_match(s,p);
 else return null;end if;
 if j<sz-1 and solved then return null;end if;
 end loop;
 if not solved and sz<>5 then return null;end if;if solved then points=points+1200-200*sz;end if;
 end loop;return points/50.0;
exception when others then return null;
end $function$;
revoke all on function public._clue_norm(text),public._clue_distance(text,text),public._clue_match(text,jsonb),public._friend_clue_ladder_score(jsonb,date) from public,anon,authenticated;

create or replace function public._friend_score(g text,v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
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
  if v ? 'scoreVersion' and v->'scoreVersion' not in ('1'::jsonb,'2'::jsonb) then return null;end if;
  return greatest(0,least(100,(v->>'score')::double precision/(case when v->'scoreVersion'='2'::jsonb then 3100 else 31000 end)*100));
 end if;return null;
exception when others then return null;
end $$;
create or replace function public._friend_records(p_user uuid,p_today date)
returns table(game text,day date,arcade_score double precision) language plpgsql stable set search_path='' as $$
declare rowdata record; entry record; data jsonb; v jsonb; h jsonb; d date; n numeric; score double precision; lastday date;
begin
 for rowdata in select s.game,s.data from public.game_saves s where s.user_id=p_user loop
  game=rowdata.game;data=rowdata.data;
  if game='lowball' then
   h=public._friend_json(data->>'pc_history');if jsonb_typeof(h) is distinct from 'object' then h='{}';end if;
   for entry in select * from jsonb_each(h) loop
    if length(entry.key)>10 or entry.key !~ '^-?[0-9]+$' or jsonb_typeof(entry.value)<>'number' then continue;end if;
    n=entry.key::numeric;if n<(p_today-119-date '2026-10-01') or n>(p_today-date '2026-10-01') then continue;end if;
    if entry.value::text::numeric<0 or entry.value::text::numeric>100 then continue;end if;score=entry.value::text::numeric::double precision;
    day=date '2026-10-01'+n::integer;arcade_score=score;return next;
   end loop;
   lastday=public._friend_date(data->>'pc_last');
   if lastday between p_today-119 and p_today and nullif(trim(data->>'pc_last_avg'),'') is not null then
    v=public._friend_json(data->>'pc_last_avg');
    if jsonb_typeof(v)='number' then
     if v::text::numeric<0 or v::text::numeric>100 then continue;end if;score=v::text::numeric::double precision;n=lastday-date '2026-10-01';
     if score between 0 and 100 and not (case when jsonb_typeof(h->n::text)='number' then (h->>n::text)::numeric between 0 and 100 else false end) then day=lastday;arcade_score=score;return next;end if;
    end if;
   end if;
  else
   for entry in select * from jsonb_each_text(data) loop
    if (game='clue-ladder' and entry.key !~ '^break-room:clue-ladder:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='time-drop' and entry.key !~ '^break-room:time-drop:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='stake' and entry.key !~ '^stake:d:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='inner-clock' and entry.key !~ '^break-room:inner-clock:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='bouncer' and entry.key !~ '^break-room:bouncer:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='alibi' and entry.key !~ '^break-room:alibi:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='laser' and entry.key !~ '^break-room:laser:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='prior' and entry.key !~ '^break-room:prior:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='pack' and entry.key !~ '^break-room:pack:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='stack-up' and entry.key !~ '^break-room:stack-up:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') then continue;end if;
    d=public._friend_date(right(entry.key,10));if d is null or d<p_today-119 or d>p_today then continue;end if;
    v=public._friend_json(entry.value);score=public._friend_score(game,v,d);
    if score is not null then day=d;arcade_score=score;return next;end if;
   end loop;
  end if;
 end loop;
end $$;
revoke all on function public._friend_score(text,jsonb,date),public._friend_records(uuid,date) from public,anon,authenticated;
commit;
