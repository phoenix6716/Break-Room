-- Add Seating Chart after Clue Ladder; preserve all existing data.
-- Preserves every existing game's saves, RLS and friend relationships.
begin;
alter table public.game_saves drop constraint if exists game_saves_game_check;
alter table public.game_saves add constraint game_saves_game_check check (game in ('stake','stack-up','lowball','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder','seating-chart'));
create or replace function public.save_game(p_game text,p_data jsonb,p_revision bigint)
returns jsonb language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); stored public.game_saves; k text;
begin
 if owner_id is null then raise exception 'Sign in required' using errcode='42501'; end if;
 if p_game is null or p_game not in ('stake','stack-up','lowball','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder','seating-chart') or p_revision is null or p_revision<0 or p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>2000000 then raise exception 'Invalid save'; end if;
 for k in select jsonb_object_keys(p_data) loop
  if jsonb_typeof(p_data->k)<>'string' or not (
   (p_game='stake' and (k ~ '^stake:d:[0-9]{4}-[0-9]{2}-[0-9]{2}$' or k='stake:streak')) or
   (p_game='seating-chart' and k ~ '^break-room:seating-chart:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or
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
-- Seating Chart v1: private snapshot reconstruction; no client-supplied score is trusted.
create or replace function public._sc_int(v jsonb,lo int,hi int) returns boolean language sql immutable set search_path='' as $$
 select case when jsonb_typeof(v)='number' then (v#>>'{}')::numeric=trunc((v#>>'{}')::numeric) and (v#>>'{}')::numeric between lo and hi else false end;
$$;
create or replace function public._sc_order(v jsonb,g int,partial boolean default false) returns boolean language plpgsql immutable set search_path='' as $$
declare x jsonb; n int; seen int[]:='{}';
begin
 if jsonb_typeof(v) is distinct from 'array' or jsonb_array_length(v)<>g then return false;end if;
 for x in select value from jsonb_array_elements(v) loop
 if not public._sc_int(x,case when partial then -1 else 0 end,g-1) then return false;end if;n=(x#>>'{}')::int;
 if n>=0 then if n=any(seen) then return false;end if;seen=array_append(seen,n);end if;
 end loop;return true;
exception when others then return false;
end $$;
create or replace function public._sc_cost(t jsonb,o jsonb) returns int language plpgsql immutable set search_path='' as $$
declare g int:=(t->>'g')::int; positions int[]; i int; r jsonb; a int; b int; d int; typ text; drama int:=0;
begin
 positions=array_fill(0,array[g],array[0]);
 for i in 0..g-1 loop positions[(o->>i)::int]=i;end loop;
 for r in select value from jsonb_array_elements(t->'rules') loop
 a=(r->>'a')::int;b=(r->>'b')::int;d=abs(positions[a]-positions[b]);d=least(d,g-d);typ=r->>'type';
 if not (case typ when 'A' then d=1 when 'N' then d<>1 when 'D' then d=2 when 'O' then d*2=g else false end) then drama=drama+1;end if;
 end loop;return drama;
end $$;
create or replace function public._sc_table(t jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare g int; r jsonb; x jsonb; seen text[]:='{}'; k text; a int; b int;
begin
 if jsonb_typeof(t) is distinct from 'object' or jsonb_typeof(t->'id') is distinct from 'string' or t->>'id' !~ '^sc-[1-5]-[0-9]{3}$' or not public._sc_int(t->'tier',1,5) or not public._sc_int(t->'g',6,10) or not public._sc_int(t->'best',0,2) then return false;end if;g=(t->>'g')::int;
 if jsonb_typeof(t->'names') is distinct from 'array' or jsonb_array_length(t->'names')<>g then return false;end if;
 for x in select value from jsonb_array_elements(t->'names') loop
 if jsonb_typeof(x) is distinct from 'string' or (x#>>'{}') !~ '^[A-Za-z]{2,12}$' or (x#>>'{}')=any(seen) then return false;end if;seen=array_append(seen,x#>>'{}');
 end loop;seen='{}';
 if jsonb_typeof(t->'rules') is distinct from 'array' or jsonb_array_length(t->'rules') not between 3 and 12 then return false;end if;
 for r in select value from jsonb_array_elements(t->'rules') loop
 if jsonb_typeof(r) is distinct from 'object' or jsonb_typeof(r->'type') is distinct from 'string' or r->>'type' not in ('A','N','D','O') or not public._sc_int(r->'a',0,g-1) or not public._sc_int(r->'b',0,g-1) or r->'a'=r->'b' or (r->>'type'='O' and g%2<>0) or jsonb_typeof(r->'story') is distinct from 'string' or char_length(r->>'story')>180 then return false;end if;
 a=(r->>'a')::int;b=(r->>'b')::int;k=(r->>'type')||':'||least(a,b)||':'||greatest(a,b);if k=any(seen) then return false;end if;seen=array_append(seen,k);
 end loop;
 if jsonb_typeof(t->'conflict') is distinct from 'array' or (t->>'best'='0' and jsonb_array_length(t->'conflict')<>0) or (t->>'best'<>'0' and jsonb_array_length(t->'conflict')<2) then return false;end if;seen='{}';
 for x in select value from jsonb_array_elements(t->'conflict') loop
 if not public._sc_int(x,0,jsonb_array_length(t->'rules')-1) or (x#>>'{}')=any(seen) then return false;end if;seen=array_append(seen,x#>>'{}');end loop;
 if not public._sc_order(t->'solution',g) then return false;end if;
 return public._sc_cost(t,t->'solution')=(t->>'best')::int;
exception when others then return false;
end $$;
create or replace function public._friend_seating_chart_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare t jsonb; i int; g int; drama int; minimum int; points int:=0; ids text[]:='{}';
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or not public._sc_int(v->'edits',0,1000000) or v->'round' is distinct from '4'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or v->'selected' is distinct from '-1'::jsonb or v->'undo' is distinct from '[]'::jsonb then return null;end if;
 if jsonb_typeof(v->'tables') is distinct from 'array' or jsonb_array_length(v->'tables')<>5 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>5 or v->'seats' is distinct from v->'picks'->4 then return null;end if;
 for i in 0..4 loop
 t=v->'tables'->i;if not public._sc_table(t) or t->>'id'=any(ids) then return null;end if;ids=array_append(ids,t->>'id');g=(t->>'g')::int;
 if not public._sc_order(v->'picks'->i,g) then return null;end if;
 minimum=(t->>'best')::int;drama=public._sc_cost(t,v->'picks'->i);if drama<minimum then return null;end if;
 points=points+greatest(0,1000-200*(drama-minimum));
 end loop;return points/50.0;
exception when others then return null;
end $$;
revoke all on function public._sc_int(jsonb,int,int),public._sc_order(jsonb,int,boolean),public._sc_cost(jsonb,jsonb),public._sc_table(jsonb),public._friend_seating_chart_score(jsonb,date) from public,anon,authenticated;

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
    if (game='seating-chart' and entry.key !~ '^break-room:seating-chart:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='clue-ladder' and entry.key !~ '^break-room:clue-ladder:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='time-drop' and entry.key !~ '^break-room:time-drop:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='stake' and entry.key !~ '^stake:d:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='inner-clock' and entry.key !~ '^break-room:inner-clock:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='bouncer' and entry.key !~ '^break-room:bouncer:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='alibi' and entry.key !~ '^break-room:alibi:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='laser' and entry.key !~ '^break-room:laser:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='prior' and entry.key !~ '^break-room:prior:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='pack' and entry.key !~ '^break-room:pack:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='stack-up' and entry.key !~ '^break-room:stack-up:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') then continue;end if;
    d=public._friend_date(right(entry.key,10));if d is null or d<p_today-119 or d>p_today then continue;end if;
    v=public._friend_json(entry.value);score=public._friend_score(game,v,d);
    if score is not null then day=d;arcade_score=score;return next;end if;
   end loop;
  end if;
 end loop;
end $$;
revoke all on function public._friend_score(text,jsonb,date),public._friend_records(uuid,date) from public,anon,authenticated;
commit;
