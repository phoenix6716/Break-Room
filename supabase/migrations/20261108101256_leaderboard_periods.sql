-- Add period totals without changing any native save, captured rules or scores.
begin;
create or replace function br_leaderboard.period_window(p_period text,p_day date)
returns table(starts date,ends date) language plpgsql immutable set search_path='' as $$
begin
 if p_day is null or p_period is null or p_period not in ('daily','weekly','monthly','all-time') then raise exception 'Choose a leaderboard period';end if;
 if p_period='daily' then starts=p_day;ends=p_day;
 elsif p_period='weekly' then starts=p_day-(extract(isodow from p_day)::integer-1);ends=starts+6;
 elsif p_period='monthly' then starts=date_trunc('month',p_day::timestamp)::date;ends=(starts+interval '1 month'-interval '1 day')::date;
 else starts=null;ends=p_day;end if;
 return next;
end $$;

create or replace function br_leaderboard.capture_day(who uuid,g text,d date)
returns void language plpgsql set search_path='' as $$
declare r jsonb;
begin
 if d is null or d<date '2026-10-01' or d>timezone('Australia/Sydney',now())::date or br_leaderboard.rules(g) is null then return;end if;
 if not exists(select 1 from br_leaderboard.profiles where user_id=who and enabled and not suspended) then return;end if;
 if exists(select 1 from br_leaderboard.entries where user_id=who and game=g and day=d) then return;end if;
 r=br_leaderboard.result(who,g,d);if r->>'status'<>'eligible' then return;end if;
 insert into br_leaderboard.entries(user_id,game,day,rules,score) values(who,g,d,br_leaderboard.rules(g),(r->>'score')::numeric)
 on conflict(user_id,game,day) do nothing;
end $$;

-- Only canonical dated receipts are candidates. Score derivation still reads
-- validated private native saves; history keys never supply a client score.
create or replace function br_leaderboard.capture_saved(who uuid,g text,saved jsonb)
returns void language plpgsql set search_path='' as $$
declare k text;d date;prefix text:='break-room:'||g||':daily:';suffix text;
begin
 if jsonb_typeof(saved)<>'object' or br_leaderboard.rules(g) is null then return;end if;
 if not exists(select 1 from br_leaderboard.profiles where user_id=who and enabled and not suspended) then return;end if;
 if g='lowball' then
  for k in select jsonb_object_keys(br_integrity.low_results(saved)) loop
   d=date '2026-10-01'+k::integer;perform br_leaderboard.capture_day(who,g,d);
  end loop;
 else
  for k in select jsonb_object_keys(saved) loop
   if left(k,length(prefix))<>prefix then continue;end if;suffix=substring(k from length(prefix)+1);
   if suffix !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then continue;end if;
   begin d=suffix::date;exception when datetime_field_overflow or invalid_datetime_format then continue;end;
   if d::text<>suffix then continue;end if;
   perform br_leaderboard.capture_day(who,g,d);
  end loop;
 end if;
end $$;
create or replace function br_leaderboard.capture(who uuid,g text)
returns void language plpgsql set search_path='' as $$
declare saved jsonb;
begin
 if g='codebreak' then select data into saved from public.codebreak_saves where user_id=who and game=g;
 elsif g='shift-work' then select data into saved from public.shift_work_saves where user_id=who and game=g;
 else select data into saved from public.game_saves where user_id=who and game=g;end if;
 perform br_leaderboard.capture_saved(who,g,saved);
end $$;
create or replace function br_leaderboard.on_save()
returns trigger language plpgsql set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||new.user_id::text,0));
 perform br_leaderboard.ensure_profile(new.user_id);
 perform br_leaderboard.capture_saved(new.user_id,new.game,new.data);
 return new;
end $$;

create or replace function br_leaderboard.standings(p_game text,p_period text,p_offset integer,p_limit integer)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare today date:=timezone('Australia/Sydney',now())::date;lo date;hi date;me uuid:=auth.uid();own br_leaderboard.profiles;own_status text;payload jsonb;maximum integer;target integer;
begin
 if p_game is null or (p_game<>'overall' and br_leaderboard.rules(p_game) is null) then raise exception 'Choose Overall or one of the ten current games';end if;
 if p_offset is null or p_offset<0 or p_offset>10000 or p_limit is null or p_limit<1 or p_limit>25 then raise exception 'Invalid leaderboard page';end if;
 select starts,ends into lo,hi from br_leaderboard.period_window(p_period,today);
 target=(hi-lo+1)*case when p_game='overall' then 10 else 1 end;maximum=target*100;
 if me is not null then select * into own from br_leaderboard.profiles where user_id=me;end if;
 own_status=case when coalesce(own.suspended,false) then 'unavailable' when not coalesce(own.enabled,false) then 'not_joined' when p_period='daily' and p_game<>'overall' then br_leaderboard.result(me,p_game,today)->>'status' else 'not_finished' end;
 with totals as materialized(
  select p.public_id as player,p.name,e.user_id=me as is_you,sum(e.score) as score,count(*) as completed
  from br_leaderboard.entries e join br_leaderboard.profiles p on p.user_id=e.user_id
  where (lo is null or e.day>=lo) and e.day<=least(hi,today) and (p_game='overall' or e.game=p_game)
   and e.rules=br_leaderboard.rules(e.game) and p.enabled and not p.suspended
  group by p.public_id,p.name,e.user_id
 ), ranked as materialized(
  select *,rank() over(order by score desc) as rank,row_number() over(order by score desc,player) as position from totals
 ), mine as(select * from ranked where is_you)
 select jsonb_build_object('day',today,'game',p_game,'period',p_period,'start',lo,'end',hi,'maximum',maximum,'completion_target',target,
  'scale',coalesce(maximum,(select greatest(max(score),1) from totals),1),'total',(select count(*) from ranked),'offset',p_offset,'limit',p_limit,
  'status',case when exists(select 1 from mine) then 'eligible' else own_status end,
  'rows',coalesce((select jsonb_agg(jsonb_build_object('player',player,'name',name,'score',score,'completed',completed,'rank',rank,'you',coalesce(is_you,false)) order by position) from ranked where position>p_offset and position<=p_offset+p_limit),'[]'::jsonb),
  'me',(select jsonb_build_object('player',player,'name',name,'score',score,'completed',completed,'rank',rank,'you',true) from mine),
  'nearby',coalesce((select jsonb_agg(jsonb_build_object('player',player,'name',name,'score',score,'completed',completed,'rank',rank,'you',coalesce(is_you,false)) order by position) from ranked where position between (select position-2 from mine) and (select position+2 from mine)),'[]'::jsonb)) into payload;
 return payload;
end $$;
create or replace function public.leaderboard_standings(p_game text default 'overall',p_period text default 'daily',p_offset integer default 0,p_limit integer default 10)
returns jsonb language sql stable security invoker set search_path='' as $$ select br_leaderboard.standings(p_game,p_period,p_offset,p_limit) $$;
revoke all on function br_leaderboard.period_window(text,date),br_leaderboard.capture_day(uuid,text,date),br_leaderboard.capture_saved(uuid,text,jsonb),br_leaderboard.standings(text,text,integer,integer),public.leaderboard_standings(text,text,integer,integer) from public,anon,authenticated;
grant execute on function br_leaderboard.standings(text,text,integer,integer),public.leaderboard_standings(text,text,integer,integer) to anon,authenticated;
-- Backfill retained eligible history once. Cache entries are immutable and private;
-- repeat application cannot duplicate scores or rewrite saves/visibility choices.
do $$ declare who uuid;g text;begin
 for who in select user_id from br_leaderboard.profiles where enabled and not suspended order by user_id loop
  perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||who::text,0));
  foreach g in array array['shift-work','codebreak','seating-chart','clue-ladder','time-drop','lowball','stack-up','pack','laser','inner-clock'] loop perform br_leaderboard.capture(who,g);end loop;
 end loop;
end $$;
commit;
