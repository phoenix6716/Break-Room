-- Apply LAST after the current ten-game installers and score-version updates.
-- Guard writes, not historical rows: no player data is migrated or regraded.
begin;
create schema if not exists br_integrity;
revoke all on schema br_integrity from public,anon,authenticated;

create or replace function br_integrity.completed_score(g text,v jsonb,d date)
returns double precision language plpgsql immutable set search_path='' as $$
begin
 if d is null then return null;end if;
 if g='codebreak' then return br_codebreak.score(v,d);
 elsif g='shift-work' then return public._friend_shift_work_score(v,d);
 else return public._friend_score(g,v,d);end if;
end $$;

-- Match Lowball's server reader, including unpadded legacy dates and last-score
-- fallback. Canonical day keys prevent alternate numeric spellings bypassing locks.
create or replace function br_integrity.low_results(data jsonb)
returns jsonb language plpgsql immutable set search_path='' as $$
declare h jsonb:=public._friend_json(data->>'pc_history');outdata jsonb:='{}';e record;n numeric;d date;v jsonb;
begin
 if jsonb_typeof(h)='object' then
  for e in select * from jsonb_each(h) loop
   if e.key !~ '^-?[0-9]+$' or length(e.key)>10 or jsonb_typeof(e.value)<>'number' then continue;end if;
   n=e.key::numeric;if n< -365000 or n>2900000 or (e.value::text)::numeric not between 0 and 100 then continue;end if;
   outdata=outdata||jsonb_build_object(n::integer::text,e.value);
  end loop;
 end if;
 d=public._friend_date(data->>'pc_last');v=public._friend_json(data->>'pc_last_avg');
 if d is not null and jsonb_typeof(v)='number' and v::text::numeric between 0 and 100 and not(outdata?((d-date '2026-10-01')::text)) then
  outdata=outdata||jsonb_build_object((d-date '2026-10-01')::text,v);
 end if;
 return outdata;
end $$;

create or replace function br_integrity.guard_save()
returns trigger language plpgsql set search_path='' as $$
declare prior jsonb:='{}';g text:=new.game;today date:=timezone('Australia/Sydney',now())::date;
 k text;d date;before_run jsonb;after_run jsonb;old_score double precision;new_score double precision;
 fields text[];field text;before_low jsonb;after_low jsonb;entry record;legacy_stack boolean;history jsonb;prior_history jsonb;
begin
 if g not in ('codebreak','shift-work','seating-chart','clue-ladder','time-drop','inner-clock','laser','pack','stack-up','lowball') then return new;end if;
 if tg_op='UPDATE' then prior=old.data;
 else
  -- UPSERT invokes BEFORE INSERT even for an existing row. Compare against the
  -- indexed current row here too, so unchanged legacy captures still sync.
  if tg_table_name='game_saves' then select data into prior from public.game_saves where user_id=new.user_id and game=g;
  elsif tg_table_name='shift_work_saves' then select data into prior from public.shift_work_saves where user_id=new.user_id and game=g;
  else select data into prior from public.codebreak_saves where user_id=new.user_id and game=g;end if;
  prior=coalesce(prior,'{}');
 end if;
 if g='lowball' then
  history=public._friend_json(new.data->>'pc_history');prior_history=public._friend_json(prior->>'pc_history');
  if jsonb_typeof(history)='object' then
   for entry in select * from jsonb_each(history) loop
    if prior_history->entry.key is not distinct from entry.value then continue;end if;
    if entry.key !~ '^-?(0|[1-9][0-9]*)$' or entry.key='-0' or length(entry.key)>10 then raise exception 'Invalid Lowball history day' using errcode='23514';end if;
   end loop;
  end if;
  before_low=br_integrity.low_results(prior);after_low=br_integrity.low_results(new.data);
  for entry in select * from jsonb_each(before_low) loop
   if after_low->entry.key is distinct from entry.value then raise exception 'Completed Daily results are locked' using errcode='23514';end if;
  end loop;
  for entry in select * from jsonb_each(after_low) loop
   if not(before_low?entry.key) and entry.key::integer>(today-date '2026-10-01') then raise exception 'Future Daily saves are not available yet. Check your device date.' using errcode='23514';end if;
  end loop;
  if new.data->'pc_progress' is distinct from prior->'pc_progress' then
   d=public._friend_date(public._friend_json(new.data->>'pc_progress')->>'day');
   if d>today then raise exception 'Future Daily saves are not available yet. Check your device date.' using errcode='23514';end if;
  end if;
  return new;
 end if;
 for k in select jsonb_object_keys(new.data) loop
  if new.data->k is not distinct from prior->k then continue;end if;
  d=public._friend_date(right(k,10));
  if d>today then raise exception 'Future Daily saves are not available yet. Check your device date.' using errcode='23514';end if;
 end loop;
 fields=array['version','scoreVersion','day','kind','id']||case g
  when 'codebreak' then array['code','guesses']
  when 'shift-work' then array['boards','results']
  when 'seating-chart' then array['tables','picks']
  when 'clue-ladder' then array['puzzles','picks']
  when 'time-drop' then array['events','picks']
  when 'inner-clock' then array['targets','picks']
  when 'laser' then array['boards','picks']
  when 'pack' then array['bags','picks']
  when 'stack-up' then array['stacks','results','score'] end;
 for k in select jsonb_object_keys(prior) loop
  if new.data->k is not distinct from prior->k then continue;end if;
  d=public._friend_date(right(k,10));before_run=public._friend_json(prior->>k);
  old_score=br_integrity.completed_score(g,before_run,d);if old_score is null then continue;end if;
  after_run=public._friend_json(new.data->>k);new_score=br_integrity.completed_score(g,after_run,d);
  if new_score is distinct from old_score then raise exception 'Completed Daily results are locked' using errcode='23514';end if;
  -- The native Stack Up loader adds frozen stacks when upgrading a v1 capture.
  legacy_stack=g='stack-up' and before_run->'version'='1'::jsonb and not(before_run?'stacks') and after_run->'version'='2'::jsonb;
  foreach field in array fields loop
   if field='version' and legacy_stack then continue;end if;
   if before_run?field and after_run->field is distinct from before_run->field then raise exception 'Completed Daily results are locked' using errcode='23514';end if;
  end loop;
 end loop;
 return new;
end $$;

revoke all on function br_integrity.completed_score(text,jsonb,date),br_integrity.low_results(jsonb),br_integrity.guard_save() from public,anon,authenticated;
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='br_integrity_guard' and tgrelid='public.game_saves'::regclass and not tgisinternal) then
  create trigger br_integrity_guard before insert or update on public.game_saves for each row execute function br_integrity.guard_save();
 end if;
end $$;
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='br_integrity_guard' and tgrelid='public.shift_work_saves'::regclass and not tgisinternal) then
  create trigger br_integrity_guard before insert or update on public.shift_work_saves for each row execute function br_integrity.guard_save();
 end if;
end $$;
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='br_integrity_guard' and tgrelid='public.codebreak_saves'::regclass and not tgisinternal) then
  create trigger br_integrity_guard before insert or update on public.codebreak_saves for each row execute function br_integrity.guard_save();
 end if;
end $$;
commit;
