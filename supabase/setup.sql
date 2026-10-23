-- Run once in the Supabase SQL Editor. No API secret is needed in the website.
begin;
create table if not exists public.game_saves (
 user_id uuid not null references auth.users(id) on delete cascade,
 game text not null check (game in ('stake','stack-up','lowball','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder')),
 data jsonb not null default '{}'::jsonb check (jsonb_typeof(data)='object' and octet_length(data::text)<=2000000),
 revision bigint not null default 1 check (revision>0),
 updated_at timestamptz not null default now(),
 primary key(user_id,game)
);
alter table public.game_saves drop constraint if exists game_saves_game_check;
alter table public.game_saves add constraint game_saves_game_check check (game in ('stake','stack-up','lowball','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder'));
alter table public.game_saves enable row level security;
revoke all on public.game_saves from public,anon,authenticated;
grant select on public.game_saves to authenticated;
drop policy if exists own_saves_read on public.game_saves;
create policy own_saves_read on public.game_saves for select to authenticated using ((select auth.uid())=user_id);

-- Only the authenticated user's own row is writable, through revision-checked RPC.
-- Concurrent devices receive a conflict and merge again, rather than losing a save.
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
commit;
