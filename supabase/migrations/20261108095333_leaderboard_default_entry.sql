-- Apply after daily_leaderboards and codebreak_zero_persistent_practice.
-- Automatic entry uses a generated name, never private signup/Friends metadata.
-- Existing opt-outs, chosen names, moderation, scores and saves are preserved.
begin;
alter table br_leaderboard.profiles alter column enabled set default true;

create or replace function br_leaderboard.ensure_profile(who uuid)
returns void language plpgsql set search_path='' as $$
declare token uuid:=gen_random_uuid();
begin
 insert into br_leaderboard.profiles(user_id,public_id,name,enabled)
 values(who,token,'Player '||upper(left(replace(token::text,'-',''),10)),true)
 on conflict(user_id) do nothing;
end $$;

-- This private definer is a trigger only, not an API. It must work for Auth's
-- restricted insert role without giving that role access to leaderboard tables.
create or replace function br_leaderboard.on_account()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform br_leaderboard.ensure_profile(new.id);
 return new;
end $$;
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='br_leaderboard_enroll' and tgrelid='auth.users'::regclass) then
  create trigger br_leaderboard_enroll after insert on auth.users for each row execute function br_leaderboard.on_account();
 end if;
end $$;

create or replace function br_leaderboard.on_save()
returns trigger language plpgsql set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||new.user_id::text,0));
 perform br_leaderboard.ensure_profile(new.user_id);
 perform br_leaderboard.capture(new.user_id,new.game);
 return new;
end $$;

create or replace function br_leaderboard.profile(p_action text,p_name text,p_enabled boolean,p_expected_user uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare me uuid:=auth.uid();own br_leaderboard.profiles;g text;
begin
 if me is null then raise exception 'Please sign in to manage your public listing' using errcode='42501';end if;
 if p_action not in ('get','set') or p_action is null then raise exception 'Unknown leaderboard action';end if;
 if p_action='set' then
  if p_expected_user is distinct from me then raise exception 'Account changed. Please reload before changing your listing' using errcode='42501';end if;
  if p_enabled is null then raise exception 'Choose whether to publish your scores';end if;
  if p_enabled and (p_name is null or char_length(trim(p_name)) not between 2 and 30) then raise exception 'Use a leaderboard name of 2 to 30 characters';end if;
 end if;
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||me::text,0));
 perform br_leaderboard.ensure_profile(me);
 if p_action='set' then
  if p_enabled then update br_leaderboard.profiles set name=trim(p_name),enabled=true where user_id=me;
  else update br_leaderboard.profiles set enabled=false where user_id=me;end if;
 end if;
 foreach g in array array['shift-work','codebreak','seating-chart','clue-ladder','time-drop','lowball','stack-up','pack','laser','inner-clock'] loop
  perform br_leaderboard.capture(me,g);
 end loop;
 select * into own from br_leaderboard.profiles where user_id=me;
 return jsonb_build_object('name',own.name,'enabled',own.enabled,'suspended',own.suspended);
end $$;

-- Fill only missing profiles; a stored false is an explicit choice, not a default.
-- Capture today's eligible receipts without writing or regrading native saves.
do $$ declare who uuid;g text;begin
 for who in select id from auth.users order by id loop
  perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||who::text,0));
  perform br_leaderboard.ensure_profile(who);
  foreach g in array array['shift-work','codebreak','seating-chart','clue-ladder','time-drop','lowball','stack-up','pack','laser','inner-clock'] loop
   perform br_leaderboard.capture(who,g);
  end loop;
 end loop;
end $$;
revoke all on function br_leaderboard.ensure_profile(uuid),br_leaderboard.on_account(),br_leaderboard.on_save() from public,anon,authenticated;
-- CREATE OR REPLACE retains the existing narrow authenticated profile grant.
commit;
