-- Apply AFTER setup.sql. Adds private social metadata; never grants access to game_saves.
begin;
create table if not exists public.friend_profiles(
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(char_length(display_name) between 2 and 30),
 friend_code text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,16)),
 share_scores boolean not null default false
);
create table if not exists public.friend_links(
 requester uuid not null references public.friend_profiles(user_id) on delete cascade,
 recipient uuid not null references public.friend_profiles(user_id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted')),
 created_at timestamptz not null default now(),
 check(requester<>recipient),primary key(requester,recipient)
);
create unique index if not exists friend_pair on public.friend_links(least(requester,recipient),greatest(requester,recipient));
create table if not exists public.friend_blocks(
 owner_id uuid not null references public.friend_profiles(user_id) on delete cascade,
 target_id uuid not null references public.friend_profiles(user_id) on delete cascade,
 check(owner_id<>target_id),primary key(owner_id,target_id)
);
alter table public.friend_profiles enable row level security;
alter table public.friend_links enable row level security;
alter table public.friend_blocks enable row level security;
revoke all on public.friend_profiles,public.friend_links,public.friend_blocks from public,anon,authenticated;

-- All writes and safe directory reads go through authenticated operations.
create or replace function public.friend_hub(p_action text default 'list',p_code text default null,p_target uuid default null,p_name text default null,p_share boolean default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare me uuid:=auth.uid(); other uuid; own public.friend_profiles; payload jsonb;
begin
 if me is null then raise exception 'Sign in required' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended('friends-global',0));
 if p_action='enable' then
  if p_name is null or char_length(trim(p_name)) not between 2 and 30 then raise exception 'Use a display name of 2 to 30 characters'; end if;
  insert into public.friend_profiles(user_id,display_name,share_scores) values(me,trim(p_name),coalesce(p_share,false)) on conflict(user_id) do nothing;
 end if;
 select * into own from public.friend_profiles where user_id=me;
 if own.user_id is null then
  if p_action<>'list' then raise exception 'Create your friend code first'; end if;
  return jsonb_build_object('me',null,'incoming','[]'::jsonb,'outgoing','[]'::jsonb,'friends','[]'::jsonb,'blocked','[]'::jsonb);
 end if;
 if p_action='settings' then
  if p_name is null or char_length(trim(p_name)) not between 2 and 30 or p_share is null then raise exception 'Check your display name and sharing setting'; end if;
  update public.friend_profiles set display_name=trim(p_name),share_scores=p_share where user_id=me;
 elsif p_action='request' then
  select user_id into other from public.friend_profiles where friend_code=upper(regexp_replace(coalesce(p_code,''),'[[:space:]-]','','g'));
  if other is null or other=me or exists(select 1 from public.friend_blocks where (owner_id=me and target_id=other) or (owner_id=other and target_id=me)) then raise exception 'That friend code is unavailable'; end if;
  if exists(select 1 from public.friend_links where (requester=me and recipient=other) or (requester=other and recipient=me)) then raise exception 'A request or friendship already exists. Check your lists below'; end if;
  if (select count(*) from public.friend_links where requester=me and status='pending')>=20 then raise exception 'You have 20 pending requests. Cancel one before sending another'; end if;
  if (select count(*) from public.friend_links where (requester=me or recipient=me) and status='accepted')>=100 then raise exception 'Your friends list is full'; end if;
  insert into public.friend_links(requester,recipient) values(me,other);
 elsif p_action='accept' then
  if (select count(*) from public.friend_links where (requester=me or recipient=me) and status='accepted')>=100 or (select count(*) from public.friend_links where (requester=p_target or recipient=p_target) and status='accepted')>=100 then raise exception 'A friends list is full'; end if;
  update public.friend_links set status='accepted' where requester=p_target and recipient=me and status='pending';
  if not found then raise exception 'This request is no longer available'; end if;
 elsif p_action='decline' then
  delete from public.friend_links where requester=p_target and recipient=me and status='pending';
 elsif p_action='cancel' then
  delete from public.friend_links where requester=me and recipient=p_target and status='pending';
 elsif p_action='remove' then
  delete from public.friend_links where ((requester=me and recipient=p_target) or (requester=p_target and recipient=me)) and status='accepted';
 elsif p_action='block' then
  if p_target is null or p_target=me or not exists(select 1 from public.friend_links where (requester=me and recipient=p_target) or (requester=p_target and recipient=me)) then raise exception 'Choose a person from your requests or friends'; end if;
  insert into public.friend_blocks(owner_id,target_id) values(me,p_target) on conflict do nothing;
  delete from public.friend_links where (requester=me and recipient=p_target) or (requester=p_target and recipient=me);
 elsif p_action='unblock' then
  delete from public.friend_blocks where owner_id=me and target_id=p_target;
 elsif p_action not in ('list','enable','settings') then raise exception 'Unknown friend action';
 end if;
 select * into own from public.friend_profiles where user_id=me;
 payload=jsonb_build_object('me',jsonb_build_object('id',me,'name',own.display_name,'code',own.friend_code,'sharing',own.share_scores));
 return payload || jsonb_build_object(
  'incoming',coalesce((select jsonb_agg(jsonb_build_object('id',p.user_id,'name',p.display_name) order by f.created_at) from public.friend_links f join public.friend_profiles p on p.user_id=f.requester where f.recipient=me and f.status='pending'),'[]'::jsonb),
  'outgoing',coalesce((select jsonb_agg(jsonb_build_object('id',p.user_id,'name',p.display_name) order by f.created_at) from public.friend_links f join public.friend_profiles p on p.user_id=f.recipient where f.requester=me and f.status='pending'),'[]'::jsonb),
  'friends',coalesce((select jsonb_agg(jsonb_build_object('id',p.user_id,'name',p.display_name,'sharing',p.share_scores) order by p.display_name) from public.friend_links f join public.friend_profiles p on p.user_id=case when f.requester=me then f.recipient else f.requester end where (f.requester=me or f.recipient=me) and f.status='accepted'),'[]'::jsonb),
  'blocked',coalesce((select jsonb_agg(jsonb_build_object('id',p.user_id,'name',p.display_name) order by p.display_name) from public.friend_blocks b join public.friend_profiles p on p.user_id=b.target_id where b.owner_id=me),'[]'::jsonb));
end $$;
revoke all on function public.friend_hub(text,text,uuid,text,boolean) from public,anon;
grant execute on function public.friend_hub(text,text,uuid,text,boolean) to authenticated;

-- Internal parsers and v1 scoring. No API grants; the public wrapper returns scores only.
create or replace function public._friend_json(s text) returns jsonb language plpgsql immutable set search_path='' as $$ begin return s::jsonb; exception when others then return null; end $$;
create or replace function public._friend_date(s text) returns date language plpgsql immutable set search_path='' as $$ begin if s !~ '^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$' then return null; end if;return s::date; exception when others then return null; end $$;
create or replace function public._friend_mul(a bigint,b bigint) returns bigint language sql immutable set search_path='' as $$ select mod(a::numeric*b,4294967296)::bigint $$;
create or replace function public._friend_legacy(d date) returns integer[] language plpgsql immutable set search_path='' as $$
declare s text:='stake:'||d::text; h bigint:=1779033703 # length(s); seed bigint; t bigint; r double precision; n int; i int; j int; temp int; pm int[]; answers int[]:='{}';
begin
 for n in 1..length(s) loop h=public._friend_mul(h # ascii(substr(s,n,1)),3432918353);h=((h<<13)|(h>>19)) & 4294967295;end loop;
 h=public._friend_mul(h # (h>>16),2246822507) # public._friend_mul(h # (h>>13),3266489909);seed=(h # (h>>16)) & 4294967295;
 for n in 1..173 loop
  seed=(seed+1831565813) & 4294967295;t=public._friend_mul(seed # (seed>>15),seed|1);
  t=(t # ((t+public._friend_mul(t # (t>>7),t|61)) & 4294967295)) & 4294967295;r=((t # (t>>14)) & 4294967295)::double precision/4294967296;
  if n>163 then
   if (n-164)%2=0 then pm=array[0,1,2];end if;i=2-((n-164)%2);j=floor(r*(i+1));temp=pm[i+1];pm[i+1]=pm[j+1];pm[j+1]=temp;
   if i=1 then answers=array_append(answers,array_position(pm,0)-1);end if;
  end if;
 end loop;return answers;
end $$;
-- Pack v1: independently solve snapshot bags; never trust client score fields.
create or replace function public._friend_pack_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare b jsonb; item jsonb; n numeric; i int; j int; mask int; chosen int; cap int; weight int; points int; best int; ways int; earned int:=0; maximum int:=0; weights int[]; values int[]; names text[]; name text; count_items int;
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or v->'round' is distinct from '2'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>3 or jsonb_typeof(v->'bags') is distinct from 'array' or jsonb_array_length(v->'bags')<>3 then return null;end if;
 for i in 0..2 loop
  b=v->'bags'->i;
  if jsonb_typeof(b->'id') is distinct from 'string' or jsonb_typeof(b->'title') is distinct from 'string' or jsonb_typeof(b->'description') is distinct from 'string' or coalesce(b->>'difficulty','') not in ('easy','medium','hard') or jsonb_typeof(b->'limit') is distinct from 'number' or jsonb_typeof(b->'items') is distinct from 'array' then return null;end if;
  n=(b->>'limit')::numeric;if n<>trunc(n) or n<1 or n>10000 then return null;end if;cap=n;
  count_items=jsonb_array_length(b->'items');if count_items<5 or count_items>10 then return null;end if;
  weights='{}';values='{}';names='{}';
  for j in 0..count_items-1 loop
   item=b->'items'->j;
   if jsonb_typeof(item->'name') is distinct from 'string' or jsonb_typeof(item->'icon') is distinct from 'string' or jsonb_typeof(item->'weight') is distinct from 'number' or jsonb_typeof(item->'points') is distinct from 'number' then return null;end if;
   name=item->>'name';if name=any(names) then return null;end if;names=array_append(names,name);
   n=(item->>'weight')::numeric;if n<>trunc(n) or n<1 or n>cap then return null;end if;weights=array_append(weights,n::int);
   n=(item->>'points')::numeric;if n<>trunc(n) or n<1 or n>20 then return null;end if;values=array_append(values,n::int);
  end loop;
  if jsonb_typeof(v->'picks'->i) is distinct from 'number' then return null;end if;
  n=(v->'picks'->>i)::numeric;if n<>trunc(n) or n<=0 or n>=(1<<count_items) then return null;end if;chosen=n;
  weight=0;points=0;for j in 1..count_items loop if (chosen & (1<<(j-1)))<>0 then weight=weight+weights[j];points=points+values[j];end if;end loop;
  if weight>cap then return null;end if;earned=earned+points;best=-1;ways=0;
  for mask in 1..(1<<count_items)-1 loop
   weight=0;points=0;for j in 1..count_items loop if (mask & (1<<(j-1)))<>0 then weight=weight+weights[j];points=points+values[j];end if;end loop;
   if weight<=cap then if points>best then best=points;ways=1;elsif points=best then ways=ways+1;end if;end if;
  end loop;
  if ways<>1 then return null;end if;maximum=maximum+best;
 end loop;
 if jsonb_typeof(v->'selection') is distinct from 'number' then return null;end if;
 n=(v->>'selection')::numeric;if n<>trunc(n) or n<0 or n>=(1<<count_items) then return null;end if;
 return earned::double precision/maximum*100;
exception when others then return null;
end $$;
revoke all on function public._friend_pack_score(jsonb,date) from public,anon,authenticated;

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
  return greatest(0,least(100,(v->>'score')::double precision/31000*100));
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
    if (game='stake' and entry.key !~ '^stake:d:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='pack' and entry.key !~ '^break-room:pack:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='stack-up' and entry.key !~ '^break-room:stack-up:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') then continue;end if;
    d=public._friend_date(right(entry.key,10));if d is null or d<p_today-119 or d>p_today then continue;end if;
    v=public._friend_json(entry.value);score=public._friend_score(game,v,d);
    if score is not null then day=d;arcade_score=score;return next;end if;
   end loop;
  end if;
 end loop;
end $$;

create or replace function public.friend_scores() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare me uuid:=auth.uid(); today date:=timezone('Australia/Sydney',now())::date; result jsonb;
begin
 if me is null then raise exception 'Sign in required' using errcode='42501';end if;
 if not exists(select 1 from public.friend_profiles where user_id=me) then return jsonb_build_object('today',today,'records','[]'::jsonb);end if;
 select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'game',r.game,'date',r.day,'arcadeScore',r.arcade_score) order by p.user_id,r.day,r.game),'[]'::jsonb) into result
 from public.friend_profiles p cross join lateral public._friend_records(p.user_id,today) r
 where p.user_id=me or (p.share_scores and exists(select 1 from public.friend_links f where f.status='accepted' and ((f.requester=me and f.recipient=p.user_id) or (f.recipient=me and f.requester=p.user_id))) and not exists(select 1 from public.friend_blocks b where (b.owner_id=me and b.target_id=p.user_id) or (b.owner_id=p.user_id and b.target_id=me)));
 return jsonb_build_object('today',today,'records',result);
end $$;
revoke all on function public._friend_json(text),public._friend_date(text),public._friend_mul(bigint,bigint),public._friend_legacy(date),public._friend_score(text,jsonb,date),public._friend_records(uuid,date),public.friend_scores() from public,anon,authenticated;
grant execute on function public.friend_scores() to authenticated;
commit;
