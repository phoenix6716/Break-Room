-- Apply after setup.sql, friends.sql, hidden-gem.sql and shift-work.sql.
-- Private leagues are independent of Friends sharing; membership is explicit consent.
begin;
create schema if not exists br_league;
revoke all on schema br_league from public,anon,authenticated;
grant usage on schema br_league to authenticated;
create table if not exists br_league.leagues(
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 2 and 40),
 owner_id uuid not null references auth.users(id) on delete cascade,
 invite_hash text unique,
 created_at timestamptz not null default now(),
 active boolean not null default true
);
create index if not exists leagues_owner on br_league.leagues(owner_id);
create table if not exists br_league.members(
 league_id uuid not null references br_league.leagues(id) on delete cascade,
 user_id uuid not null references public.friend_profiles(user_id) on delete cascade,
 joined_at timestamptz not null default now(),
 active boolean not null default true,
 removed boolean not null default false,
 primary key(league_id,user_id)
);
create index if not exists league_member_user on br_league.members(user_id) where active;
alter table br_league.leagues enable row level security;
alter table br_league.members enable row level security;
revoke all on br_league.leagues,br_league.members from public,anon,authenticated;
create or replace function br_league.games() returns text[] language sql immutable set search_path='' as $$
 select array['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock']::text[]
$$;
create or replace function br_league.week_start(d date) returns date language sql immutable set search_path='' as $$
 select d-(extract(isodow from d)::int-1)
$$;
create or replace function br_league.required(d date) returns text[] language sql immutable set search_path='' as $$
 select array[(br_league.games())[1+i*2],(br_league.games())[2+i*2]]
 from (select (((br_league.week_start(d)-date '2026-10-26')/7%5)+5)%5 i) s
$$;
-- Input is server-derived normalized records, never accepted as a public RPC parameter.
create or replace function br_league.rollup(records jsonb,today date) returns jsonb language sql stable set search_path='' as $$
 with days as (select generate_series(0,6)::int n),
 valid as (
  select x->>'game' game,(x->>'date')::date d,max((x->>'arcadeScore')::numeric) score
  from jsonb_array_elements(records) x
  where x->>'game'=any(br_league.games())
   and (x->>'date')::date between br_league.week_start(today) and today
   and (x->>'arcadeScore')::numeric between 0 and 100
  group by 1,2
 ), per_game as (
  select g,coalesce(sum(v.score),0) total,count(v.score)::int completed,
   coalesce(jsonb_agg(v.score order by days.n),'[]'::jsonb) scores,
   g=any(br_league.required(today)) required
  from unnest(br_league.games()) g cross join days
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
  'games',(select jsonb_agg(jsonb_build_object('game',g,'total',total,'completed',completed,'scores',scores,'required',required,'counted',coalesce(chosen,false)) order by array_position(br_league.games(),g)) from selected))
$$;
-- Only decode this week's snapshots. Reuse the established private native scorers.
create or replace function br_league.records(who uuid,today date)
returns jsonb language plpgsql stable set search_path='' as $$
declare rowdata record;e record;v jsonb;d date;s double precision;outrows jsonb:='[]';startday date:=br_league.week_start(today);h jsonb;i int;
begin
 for rowdata in
  select game,data from public.game_saves where user_id=who and game=any(br_league.games())
  union all select game,data from public.hidden_gem_saves where user_id=who
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
create or replace function br_league.api(p_action text,p_league uuid,p_token text,p_name text,p_display_name text,p_consent boolean,p_target uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare me uuid:=auth.uid();today date:=timezone('Australia/Sydney',now())::date;l br_league.leagues;token text;payload jsonb;rowsjson jsonb;mine jsonb;nextowner uuid;
begin
 if me is null then raise exception 'Sign in to use leagues' using errcode='42501';end if;
 if p_action not in ('list','create','join','view','invite','leave','remove') or p_action is null then raise exception 'Unknown league action';end if;
 -- Serialize membership changes, limits and owner transfer, without locking reads.
 if p_action not in ('list','view') then perform pg_advisory_xact_lock(hashtextextended('break-room-leagues',0));end if;
 if p_action in ('create','join') then
  if p_consent is distinct from true then raise exception 'Confirm league score sharing before joining';end if;
  if not exists(select 1 from public.friend_profiles where user_id=me) then
   if p_display_name is null or char_length(btrim(p_display_name)) not between 2 and 30 then raise exception 'Choose a display name of 2 to 30 characters';end if;
   insert into public.friend_profiles(user_id,display_name) values(me,btrim(p_display_name));
  end if;
  if (select count(*) from br_league.members m join br_league.leagues a on a.id=m.league_id where m.user_id=me and m.active and a.active)>=10 then raise exception 'You can join up to 10 leagues. Leave one first';end if;
 end if;
 if p_action='create' then
  if p_name is null or char_length(btrim(p_name)) not between 2 and 40 then raise exception 'Use a league name of 2 to 40 characters';end if;
  if (select count(*) from br_league.leagues where owner_id=me and active)>=3 then raise exception 'You can own up to three leagues';end if;
  token=replace(gen_random_uuid()::text,'-','');
  insert into br_league.leagues(name,owner_id,invite_hash) values(btrim(p_name),me,md5(token)) returning * into l;
  insert into br_league.members(league_id,user_id) values(l.id,me);
 elsif p_action='join' then
  if p_token is null or p_token !~ '^[a-f0-9]{32}$' then raise exception 'This invite is unavailable. Ask for a fresh link';end if;
  select * into l from br_league.leagues where invite_hash=md5(p_token) and active;
  if l.id is null or exists(select 1 from br_league.members where league_id=l.id and user_id=me and removed)
   or exists(select 1 from br_league.members m join public.friend_blocks b on (b.owner_id=me and b.target_id=m.user_id) or (b.target_id=me and b.owner_id=m.user_id) where m.league_id=l.id and m.active)
   then raise exception 'This invite is unavailable. Ask for a fresh link';end if;
  if not exists(select 1 from br_league.members where league_id=l.id and user_id=me and active) and (select count(*) from br_league.members where league_id=l.id and active)>=30 then raise exception 'This league has reached its 30-player limit';end if;
  insert into br_league.members(league_id,user_id) values(l.id,me) on conflict(league_id,user_id) do update set active=true,joined_at=now();
 elsif p_action not in ('list') then
  select * into l from br_league.leagues a where a.id=p_league and a.active and exists(select 1 from br_league.members m where m.league_id=a.id and m.user_id=me and m.active);
  if l.id is null then raise exception 'This league is unavailable' using errcode='42501';end if;
  if p_action='invite' then
   if l.owner_id<>me then raise exception 'Only the league owner can create invite links' using errcode='42501';end if;
   token=replace(gen_random_uuid()::text,'-','');update br_league.leagues set invite_hash=md5(token) where id=l.id;
  elsif p_action='remove' then
   if l.owner_id<>me or p_target is null or p_target=me then raise exception 'Only the owner can remove another player' using errcode='42501';end if;
   update br_league.members set active=false,removed=true where league_id=l.id and user_id=p_target and active;
   if not found then raise exception 'That member is no longer in this league';end if;
  elsif p_action='leave' then
   update br_league.members set active=false where league_id=l.id and user_id=me;
   if l.owner_id=me then
    select user_id into nextowner from br_league.members where league_id=l.id and active order by joined_at,user_id limit 1;
    if nextowner is null then update br_league.leagues set active=false,invite_hash=null where id=l.id;
    else update br_league.leagues set owner_id=nextowner,invite_hash=null where id=l.id;end if;
   end if;
   l=null;
  end if;
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'name',a.name,'owner',a.owner_id=me) order by a.created_at,a.id),'[]'::jsonb) into mine
 from br_league.leagues a join br_league.members m on m.league_id=a.id and m.user_id=me and m.active where a.active;
 payload=jsonb_build_object('today',today,'week',br_league.week_start(today),'end',br_league.week_start(today)+6,'required',br_league.required(today),'leagues',mine,
  'me',(select jsonb_build_object('id',me,'name',display_name) from public.friend_profiles where user_id=me),'selected',null,'invite',token);
 if l.id is not null then
  select coalesce(jsonb_agg(x.obj||jsonb_build_object('rank',x.rank) order by x.total desc,x.name,x.uid),'[]'::jsonb) into rowsjson from (
   select uid,name,total,obj,rank() over(order by total desc) rank from (
    select m.user_id uid,p.display_name name,(s.score->>'total')::numeric total,
     jsonb_build_object('id',m.user_id,'name',p.display_name,'self',m.user_id=me,'owner',m.user_id=l.owner_id)||s.score obj
    from br_league.members m join public.friend_profiles p on p.user_id=m.user_id
    cross join lateral (select br_league.rollup(br_league.records(m.user_id,today),today) score) s
    where m.league_id=l.id and m.active and not exists(select 1 from public.friend_blocks b where (b.owner_id=me and b.target_id=m.user_id) or (b.target_id=me and b.owner_id=m.user_id))
   ) ranked
  ) x;
  payload=payload||jsonb_build_object('selected',jsonb_build_object('id',l.id,'name',l.name,'owner',l.owner_id=me,'rows',rowsjson));
 end if;
 return payload;
end $$;
-- No privileged function is exposed in the public API schema.
create or replace function public.league_hub(p_action text default 'list',p_league uuid default null,p_token text default null,p_name text default null,p_display_name text default null,p_consent boolean default false,p_target uuid default null)
returns jsonb language sql security invoker set search_path='' as $$
 select br_league.api(p_action,p_league,p_token,p_name,p_display_name,p_consent,p_target)
$$;
revoke all on function br_league.games(),br_league.week_start(date),br_league.required(date),br_league.rollup(jsonb,date),br_league.records(uuid,date),br_league.api(text,uuid,text,text,text,boolean,uuid),public.league_hub(text,uuid,text,text,text,boolean,uuid) from public,anon,authenticated;
grant execute on function br_league.api(text,uuid,text,text,text,boolean,uuid),public.league_hub(text,uuid,text,text,text,boolean,uuid) to authenticated;
commit;
