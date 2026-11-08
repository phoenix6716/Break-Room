-- One account display name for all public leaderboards. No visibility or score changes.
begin;
create or replace function br_leaderboard.display_name(who uuid)
returns text language sql stable set search_path='' as $$
 select coalesce((select case when jsonb_typeof(raw_user_meta_data->'display_name')='string'
  and char_length(trim(raw_user_meta_data->>'display_name')) between 2 and 30
  then trim(raw_user_meta_data->>'display_name') else 'Player' end from auth.users where id=who),'Player')
$$;
create or replace function br_leaderboard.ensure_profile(who uuid)
returns void language plpgsql set search_path='' as $$
begin
 insert into br_leaderboard.profiles(user_id,name,enabled)
 values(who,br_leaderboard.display_name(who),true)
 on conflict(user_id) do update set name=excluded.name
 where br_leaderboard.profiles.name is distinct from excluded.name;
end $$;
create or replace function br_leaderboard.on_account()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||new.id::text,0));
 perform br_leaderboard.ensure_profile(new.id);
 return new;
end $$;
-- Insert enrollment already exists. Updates also synchronize immediately when
-- the official Auth API changes display_name; metadata is presentation, never authorization.
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='br_leaderboard_name' and tgrelid='auth.users'::regclass) then
  create trigger br_leaderboard_name after update of raw_user_meta_data on auth.users
  for each row when(old.raw_user_meta_data is distinct from new.raw_user_meta_data)
  execute function br_leaderboard.on_account();
 end if;
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
 end if;
 perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||me::text,0));
 perform br_leaderboard.ensure_profile(me);
 -- Keep p_name in the signature for older clients, but never accept it as a
 -- separate name or use it to change Auth. Settings edits the account via Auth.
 if p_action='set' then update br_leaderboard.profiles set enabled=p_enabled where user_id=me;end if;
 foreach g in array array['shift-work','codebreak','seating-chart','clue-ladder','time-drop','lowball','stack-up','pack','laser','inner-clock'] loop perform br_leaderboard.capture(me,g);end loop;
 select * into own from br_leaderboard.profiles where user_id=me;
 return jsonb_build_object('name',own.name,'enabled',own.enabled,'suspended',own.suspended);
end $$;
do $$ declare who uuid;begin
 for who in select id from auth.users order by id loop
  perform pg_advisory_xact_lock(hashtextextended('leaderboard:'||who::text,0));
  perform br_leaderboard.ensure_profile(who);
 end loop;
end $$;
revoke all on function br_leaderboard.display_name(uuid),br_leaderboard.ensure_profile(uuid),br_leaderboard.on_account() from public,anon,authenticated;
commit;
