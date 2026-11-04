-- Shelve Sleeper for the nine-game launch. No player rows are changed.
-- Apply after leagues.sql. Past league weeks retain their original game set.
begin;
create or replace function br_league.games() returns text[] language sql immutable set search_path='' as $$
 select array['laser','time-drop','clue-ladder','seating-chart','shift-work','stack-up','pack','lowball','inner-clock']::text[]
$$;

create or replace function br_league.games_on(d date) returns text[] language sql immutable set search_path='' as $$
 select case when d<date '2026-11-02' then array['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock']::text[] else br_league.games() end
$$;

create or replace function br_league.required(d date) returns text[] language sql immutable set search_path='' as $$
 select array[g[1+i],g[1+(i+1)%cardinality(g)]]
 from (select br_league.games_on(d) g,case when d<date '2026-11-02'
 then (((br_league.week_start(d)-date '2026-10-26')/7%5)+5)%5*2
 else (((br_league.week_start(d)-date '2026-10-26')/7*2%9)+9)%9 end i) s
$$;

create or replace function br_league.rollup(records jsonb,today date) returns jsonb language sql stable set search_path='' as $$
 with days as (select generate_series(0,6)::int n),
 valid as (
  select x->>'game' game,(x->>'date')::date d,max((x->>'arcadeScore')::numeric) score
  from jsonb_array_elements(records) x
  where x->>'game'=any(br_league.games_on(today))
   and (x->>'date')::date between br_league.week_start(today) and today
   and (x->>'arcadeScore')::numeric between 0 and 100
  group by 1,2
 ), per_game as (
  select g,coalesce(sum(v.score),0) total,count(v.score)::int completed,
   coalesce(jsonb_agg(v.score order by days.n),'[]'::jsonb) scores,
   g=any(br_league.required(today)) required
  from unnest(br_league.games_on(today)) g cross join days
  left join valid v on v.game=g and v.d=br_league.week_start(today)+days.n
  group by g
 ), optional as (
  select g from per_game where not required and completed>0 order by total desc,g limit 1
 ), selected as (
  select *,required or g=(select g from optional) chosen from per_game
 )
 select jsonb_build_object(
  'total',(select coalesce(sum(total),0) from selected where chosen),
  'completed',(select coalesce(sum(completed),0) from selected where chosen),
  'optional',(select g from optional),
  'games',(select jsonb_agg(jsonb_build_object('game',g,'total',total,'completed',completed,'scores',scores,'required',required,'counted',coalesce(chosen,false)) order by array_position(br_league.games_on(today),g)) from selected))
$$;

create or replace function br_league.records(who uuid,today date)
returns jsonb language plpgsql stable set search_path='' as $$
declare rowdata record;e record;v jsonb;d date;s double precision;outrows jsonb:='[]';startday date:=br_league.week_start(today);h jsonb;i int;
begin
 for rowdata in
  select game,data from public.game_saves where user_id=who and game=any(br_league.games_on(today))
  union all select game,data from public.hidden_gem_saves where user_id=who and today<date '2026-11-02'
  union all select game,data from public.shift_work_saves where user_id=who
 loop
  if rowdata.game='lowball' then
   h=public._friend_json(rowdata.data->>'pc_history');
   for i in 0..6 loop
    d=startday+i;if d>today then continue;end if;
    v=h->((d-date '2026-10-01')::text);s=null;
    if jsonb_typeof(v)='number' and (v#>>'{}')::numeric between 0 and 100 then s=(v#>>'{}')::double precision;
    elsif public._friend_date(rowdata.data->>'pc_last')=d then
     v=public._friend_json(rowdata.data->>'pc_last_avg');
     if jsonb_typeof(v)='number' and (v#>>'{}')::numeric between 0 and 100 then s=(v#>>'{}')::double precision;end if;
    end if;
    if s is not null then outrows=outrows||jsonb_build_array(jsonb_build_object('game','lowball','date',d,'arcadeScore',s));end if;
   end loop;
  else
   for e in select key,value from jsonb_each_text(rowdata.data) loop
    d=public._friend_date(right(e.key,10));if d is null or d<startday or d>today then continue;end if;
    if e.key is distinct from (case when rowdata.game='hidden-gem' then 'break-room:hidden-gem:daily:' when rowdata.game='shift-work' then 'break-room:shift-work:daily:' else 'break-room:'||rowdata.game||':daily:' end)||d::text then continue;end if;
    v=public._friend_json(e.value);
    s=case when rowdata.game='hidden-gem' then public._friend_hidden_gem_score(v,d) when rowdata.game='shift-work' then public._friend_shift_work_score(v,d) else public._friend_score(rowdata.game,v,d) end;
    if s is not null then outrows=outrows||jsonb_build_array(jsonb_build_object('game',rowdata.game,'date',d,'arcadeScore',s));end if;
   end loop;
  end if;
 end loop;return outrows;
end $$;
revoke all on function br_league.games(),br_league.games_on(date),br_league.required(date),br_league.rollup(jsonb,date),br_league.records(uuid,date) from public,anon,authenticated;
commit;
