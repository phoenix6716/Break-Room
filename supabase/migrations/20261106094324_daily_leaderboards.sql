-- Apply after all current game installers and score_integrity_guards.
-- Public participation is a NEW, independent opt-in. No existing players are enrolled.
begin;
do $$ begin
 if (select count(*) from pg_trigger where tgname='br_integrity_guard' and tgenabled='O' and not tgisinternal)<>3 then raise exception 'Install the active score-integrity guards first';end if;
end $$;
create schema if not exists br_leaderboard;
revoke all on schema br_leaderboard from public,anon,authenticated;
create table if not exists br_leaderboard.profiles(
 user_id uuid primary key references auth.users(id) on delete cascade,
 public_id uuid not null unique default gen_random_uuid(),
 name text not null check(char_length(trim(name)) between 2 and 30),
 enabled boolean not null default false,
 suspended boolean not null default false
);
create table if not exists br_leaderboard.entries(
 user_id uuid not null references br_leaderboard.profiles(user_id) on delete cascade,
 game text not null check(game in ('shift-work','codebreak','seating-chart','clue-ladder','time-drop','lowball','stack-up','pack','laser','inner-clock')),
 day date not null,
 rules text not null,
 score numeric(4,1) not null check(score between 0 and 100),
 primary key(user_id,game,day)
);
create index if not exists leaderboard_daily_scores on br_leaderboard.entries(day,game,score desc,user_id);
alter table br_leaderboard.profiles enable row level security;
alter table br_leaderboard.entries enable row level security;
revoke all on br_leaderboard.profiles,br_leaderboard.entries from public,anon,authenticated;

create or replace function br_leaderboard.rules(g text) returns text language sql immutable set search_path='' as $$
 select case g when 'codebreak' then '5' when 'stack-up' then '2:4' when 'seating-chart' then '2' when 'time-drop' then '2:1' when 'shift-work' then '1' when 'clue-ladder' then '1' when 'lowball' then '1' when 'pack' then '1' when 'laser' then '1' when 'inner-clock' then '1' end
$$;
create or replace function br_leaderboard.current_rules(g text,v jsonb) returns boolean language sql immutable set search_path='' as $$
 select coalesce(case g when 'lowball' then true when 'codebreak' then v->'version'='5'::jsonb when 'stack-up' then v->'version'='2'::jsonb and v->'scoreVersion'='4'::jsonb when 'seating-chart' then v->'version'='2'::jsonb when 'time-drop' then v->'version'='2'::jsonb and v->'scoreVersion'='1'::jsonb else br_leaderboard.rules(g)='1' and v->'version'='1'::jsonb end,false)
$$;

-- Read the one requested Daily from canonical private saves, never from RPC score arguments.
create or replace function br_leaderboard.result(who uuid,g text,d date)
returns jsonb language plpgsql stable set search_path='' as $$
declare saved jsonb;v jsonb;s double precision;k text;
begin
 if br_leaderboard.rules(g) is null then return jsonb_build_object('status','not_finished');end if;
 if g='codebreak' then select data into saved from public.codebreak_saves where user_id=who and game=g;
 elsif g='shift-work' then select data into saved from public.shift_work_saves where user_id=who and game=g;
 else select data into saved from public.game_saves where user_id=who and game=g;end if;
 if g='lowball' then
  v=br_integrity.low_results(saved)->((d-date '2026-10-01')::text);if jsonb_typeof(v)='number' then s=v::text::double precision;end if;
 else
  k='break-room:'||g||':daily:'||d::text;v=public._friend_json(saved->>k);s=br_integrity.completed_score(g,v,d);
 end if;
 if s is null then return jsonb_build_object('status','not_finished');end if;
 if not br_leaderboard.current_rules(g,v) then return jsonb_build_object('status','older_rules');end if;
 return jsonb_build_object('status','eligible','score',round(s::numeric,1));
end $$;
create or replace function br_leaderboard.capture(who uuid,g text) returns void language plpgsql set search_path='' as $$
declare d date:=timezone('Australia/Sydney',now())::date;r jsonb;
begin
 if not exists(select 1 from br_leaderboard.profiles where user_id=who and enabled and not suspended) then return;end if;
 if exists(select 1 from br_leaderboard.entries where user_id=who and game=g and day=d and rules=br_leaderboard.rules(g)) then return;end if;
 r=br_leaderboard.result(who,g,d);if r->>'status'<>'eligible' then return;end if;
 insert into br_leaderboard.entries(user_id,game,day,rules,score) values(who,g,d,br_leaderboard.rules(g),(r->>'score')::numeric)
 on conflict(user_id,game,day) do nothing;
end $$;
create or replace function br_leaderboard.on_save() returns trigger language plpgsql set search_path='' as $$
begin
 -- Serialize enrollment with publication; a completion racing opt-in must not
 -- miss both the backfill and its after-save capture. Native rows are only read.
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||new.user_id::text,0));
 perform br_leaderboard.capture(new.user_id,new.game);return new;
end $$;
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='br_leaderboard_capture' and tgrelid='public.game_saves'::regclass) then create trigger br_leaderboard_capture after insert or update on public.game_saves for each row execute function br_leaderboard.on_save();end if;
 if not exists(select 1 from pg_trigger where tgname='br_leaderboard_capture' and tgrelid='public.shift_work_saves'::regclass) then create trigger br_leaderboard_capture after insert or update on public.shift_work_saves for each row execute function br_leaderboard.on_save();end if;
 if not exists(select 1 from pg_trigger where tgname='br_leaderboard_capture' and tgrelid='public.codebreak_saves'::regclass) then create trigger br_leaderboard_capture after insert or update on public.codebreak_saves for each row execute function br_leaderboard.on_save();end if;
end $$;

create or replace function br_leaderboard.profile(p_action text,p_name text,p_enabled boolean,p_expected_user uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare me uuid:=auth.uid();own br_leaderboard.profiles;g text;
begin
 if me is null then raise exception 'Please sign in to manage your public listing' using errcode='42501';end if;
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||me::text,0));
 select * into own from br_leaderboard.profiles where user_id=me;
 if p_action='set' then
  if p_expected_user is distinct from me then raise exception 'Account changed. Please reload before changing your listing' using errcode='42501';end if;
  if p_enabled is null then raise exception 'Choose whether to publish your scores';end if;
  if p_enabled then
   if p_name is null or char_length(trim(p_name)) not between 2 and 30 then raise exception 'Use a leaderboard name of 2 to 30 characters';end if;
   insert into br_leaderboard.profiles(user_id,name,enabled) values(me,trim(p_name),true)
   on conflict(user_id) do update set name=excluded.name,enabled=true;
   foreach g in array array['shift-work','codebreak','seating-chart','clue-ladder','time-drop','lowball','stack-up','pack','laser','inner-clock'] loop perform br_leaderboard.capture(me,g);end loop;
  else update br_leaderboard.profiles set enabled=false where user_id=me;end if;
  select * into own from br_leaderboard.profiles where user_id=me;
 elsif p_action<>'get' or p_action is null then raise exception 'Unknown leaderboard action';end if;
 return jsonb_build_object('name',coalesce(own.name,''),'enabled',coalesce(own.enabled,false),'suspended',coalesce(own.suspended,false));
end $$;
create or replace function br_leaderboard.board(p_game text,p_offset integer,p_limit integer)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare d date:=timezone('Australia/Sydney',now())::date;me uuid:=auth.uid();payload jsonb;own br_leaderboard.profiles;own_status text;
begin
 if br_leaderboard.rules(p_game) is null or p_game is null then raise exception 'Choose one of the ten current games';end if;
 if p_offset is null or p_offset<0 or p_offset>10000 or p_limit is null or p_limit<1 or p_limit>25 then raise exception 'Invalid leaderboard page';end if;
 if me is not null then select * into own from br_leaderboard.profiles where user_id=me;end if;
 own_status=case when coalesce(own.suspended,false) then 'unavailable' when not coalesce(own.enabled,false) then 'not_joined' else br_leaderboard.result(me,p_game,d)->>'status' end;
 with ranked as materialized(
  select p.public_id as player,p.name,e.score,e.user_id=me as is_you,
   rank() over(order by e.score desc) as rank,
   row_number() over(order by e.score desc,p.public_id) as position
  from br_leaderboard.entries e join br_leaderboard.profiles p on p.user_id=e.user_id
  where e.day=d and e.game=p_game and e.rules=br_leaderboard.rules(p_game) and p.enabled and not p.suspended
 ), mine as(select * from ranked where is_you)
 select jsonb_build_object('day',d,'game',p_game,'total',(select count(*) from ranked),'offset',p_offset,'limit',p_limit,'status',own_status,
  'rows',coalesce((select jsonb_agg(jsonb_build_object('player',player,'name',name,'score',score,'rank',rank,'you',coalesce(is_you,false)) order by position) from ranked where position>p_offset and position<=p_offset+p_limit),'[]'::jsonb),
  'me',(select jsonb_build_object('player',player,'name',name,'score',score,'rank',rank,'you',true) from mine),
  'nearby',coalesce((select jsonb_agg(jsonb_build_object('player',player,'name',name,'score',score,'rank',rank,'you',coalesce(is_you,false)) order by position) from ranked where position between (select position-2 from mine) and (select position+2 from mine)),'[]'::jsonb)) into payload;
 return payload;
end $$;
create or replace function public.leaderboard_profile(p_action text default 'get',p_name text default null,p_enabled boolean default null,p_expected_user uuid default null)
returns jsonb language sql security invoker set search_path='' as $$ select br_leaderboard.profile(p_action,p_name,p_enabled,p_expected_user) $$;
create or replace function public.daily_leaderboard(p_game text,p_offset integer default 0,p_limit integer default 10)
returns jsonb language sql stable security invoker set search_path='' as $$ select br_leaderboard.board(p_game,p_offset,p_limit) $$;
revoke all on all functions in schema br_leaderboard from public,anon,authenticated;
revoke all on function public.leaderboard_profile(text,text,boolean,uuid),public.daily_leaderboard(text,integer,integer) from public,anon,authenticated;
grant usage on schema br_leaderboard to anon,authenticated;
grant execute on function br_leaderboard.board(text,integer,integer),public.daily_leaderboard(text,integer,integer) to anon,authenticated;
grant execute on function br_leaderboard.profile(text,text,boolean,uuid),public.leaderboard_profile(text,text,boolean,uuid) to authenticated;
commit;
