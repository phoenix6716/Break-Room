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

-- Prior v1: five immutable earlier-event choices, scored from dated snapshots.
create or replace function public._friend_prior_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare p jsonb; e jsonb; i int; j int; n numeric; years int[]; ids text[]:='{}'; titles text[]; correct int:=0; pick int;
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or v->'round' is distinct from '4'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>5 or jsonb_typeof(v->'pairs') is distinct from 'array' or jsonb_array_length(v->'pairs')<>5 then return null;end if;
 for i in 0..4 loop
  p=v->'pairs'->i;if jsonb_typeof(p) is distinct from 'array' or jsonb_array_length(p)<>2 then return null;end if;years='{}';titles='{}';
  for j in 0..1 loop
   e=p->j;
   if jsonb_typeof(e->'id') is distinct from 'string' or char_length(e->>'id') not between 1 and 80 or jsonb_typeof(e->'title') is distinct from 'string' or char_length(e->>'title') not between 1 and 180 or jsonb_typeof(e->'category') is distinct from 'string' or char_length(e->>'category') not between 1 and 40 or jsonb_typeof(e->'fact') is distinct from 'string' or char_length(e->>'fact') not between 1 and 800 or jsonb_typeof(e->'source') is distinct from 'string' or char_length(e->>'source')>1000 or e->>'source' !~ '^[!-~]+$' or e->>'source' !~ '^https://[^[:space:]/]+/[^[:space:]]*$' or jsonb_typeof(e->'year') is distinct from 'number' then return null;end if;
   if e->>'id'=any(ids) or e->>'title'=any(titles) then return null;end if;ids=array_append(ids,e->>'id');titles=array_append(titles,e->>'title');
   n=(e->>'year')::numeric;if n<>trunc(n) or n<1 or n>2100 then return null;end if;years=array_append(years,n::int);
  end loop;
  if years[1]=years[2] or jsonb_typeof(v->'picks'->i) is distinct from 'number' then return null;end if;
  n=(v->'picks'->>i)::numeric;if n not in (0,1) then return null;end if;pick=n;
  if (pick=0 and years[1]<years[2]) or (pick=1 and years[2]<years[1]) then correct=correct+1;end if;
 end loop;
 return correct*20;
exception when others then return null;
end $$;
revoke all on function public._friend_prior_score(jsonb,date) from public,anon,authenticated;

-- Laser v1/v2: derive first-fire hits from board/mirror snapshots, never claimed scores.
create or replace function public._friend_laser_hit(b jsonb,p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare n int; lv int; cfg int[]; required int:=2; upgraded boolean; q jsonb; x numeric; rr int; cc int; ori text; coords text[]:='{}'; legal text[]:='{}'; mirrors jsonb:='{}'; walls text[]:='{}'; target text; k text; r int; c int:=-1; dx int:=1; dy int:=0; tmp int; seen text[]:='{}'; state text;
begin
 if jsonb_typeof(b) is distinct from 'object' or jsonb_typeof(b->'id') is distinct from 'string' or b->>'id' !~ '^(laser-v1-[0-3]-[0-9]+|laser-v2-3-[0-9]+)$' or char_length(b->>'id')>80 or jsonb_typeof(b->'level') is distinct from 'number' then return null;end if;
 x=(b->>'level')::numeric;if x<>trunc(x) or x not between 0 and 3 then return null;end if;lv=x;
 cfg=case lv when 0 then array[5,2,0] when 1 then array[6,3,0] when 2 then array[6,3,2] else array[7,4,3] end;upgraded=(b->>'id') like 'laser-v2-%';if upgraded then if lv<>3 then return null;end if;cfg=array[7,6,4];required=3;end if;n=cfg[1];
 if b->'n' is distinct from to_jsonb(n) or jsonb_typeof(b->'row') is distinct from 'number' then return null;end if;
 x=(b->>'row')::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;r=x;
 if jsonb_typeof(b->'t') is distinct from 'array' or jsonb_array_length(b->'t')<>2 or jsonb_typeof(b->'fx') is distinct from 'array' or jsonb_array_length(b->'fx')<>cfg[2] or jsonb_typeof(b->'w') is distinct from 'array' or jsonb_array_length(b->'w')<>cfg[3] or jsonb_typeof(p) is distinct from 'array' or jsonb_array_length(p)<>required then return null;end if;
 -- Validate disjoint layout coordinates before tracing.
 for q in select value from jsonb_array_elements(jsonb_build_array(b->'t')||(b->'fx')||(b->'w')) loop
  if jsonb_typeof(q) is distinct from 'array' or jsonb_array_length(q) not in (2,3) then return null;end if;
  if jsonb_typeof(q->0) is distinct from 'number' or jsonb_typeof(q->1) is distinct from 'number' then return null;end if;
  x=(q->>0)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;rr=x;
  x=(q->>1)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;cc=x;k=rr||','||cc;
  if k=any(coords) then return null;end if;coords=array_append(coords,k);
 end loop;
 target=((b->'t'->>0)::numeric::int)::text||','||((b->'t'->>1)::numeric::int)::text;
 for q in select value from jsonb_array_elements(b->'fx') loop
  if jsonb_array_length(q)<>3 or jsonb_typeof(q->2) is distinct from 'string' or q->>2 not in ('/',E'\\') then return null;end if;
  mirrors=jsonb_set(mirrors,array[((q->>0)::numeric::int)::text||','||((q->>1)::numeric::int)::text],q->2);
 end loop;
 for q in select value from jsonb_array_elements(b->'w') loop if jsonb_array_length(q)<>2 then return null;end if;walls=array_append(walls,((q->>0)::numeric::int)::text||','||((q->>1)::numeric::int)::text);end loop;
 for q in select value from jsonb_array_elements(p) loop
  if jsonb_typeof(q) is distinct from 'array' or jsonb_array_length(q)<>3 or jsonb_typeof(q->0) is distinct from 'number' or jsonb_typeof(q->1) is distinct from 'number' or jsonb_typeof(q->2) is distinct from 'string' or q->>2 not in ('/',E'\\') then return null;end if;
  x=(q->>0)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;rr=x;
  x=(q->>1)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;cc=x;k=rr||','||cc;
  if k=any(coords) or k=any(legal) then return null;end if;legal=array_append(legal,k);mirrors=jsonb_set(mirrors,array[k],q->2);
 end loop;
 loop
  c=c+dx;r=r+dy;if c<0 or r<0 or c>=n or r>=n then return false;end if;
  state=r||','||c||','||dx||','||dy;if state=any(seen) then return false;end if;seen=array_append(seen,state);
  k=r||','||c;if k=target then return true;end if;if k=any(walls) then return false;end if;
  ori=mirrors->>k;if ori='/' then tmp=dx;dx=-dy;dy=-tmp;elsif ori=E'\\' then tmp=dx;dx=dy;dy=tmp;end if;
 end loop;
exception when others then return null;
end $$;
create or replace function public._friend_laser_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare i int; b jsonb; hit boolean; solved int:=0; ids text[]:='{}';
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or jsonb_typeof(v->'edits') is distinct from 'number' or (v->>'edits')::numeric<0 or (v->>'edits')::numeric>1000000 or (v->>'edits')::numeric<>trunc((v->>'edits')::numeric) or v->'round' is distinct from '3'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'boards') is distinct from 'array' or jsonb_array_length(v->'boards')<>4 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>4 or v->'mirrors' is distinct from v->'picks'->3 then return null;end if;
 for i in 0..3 loop
  b=v->'boards'->i;if b->>'id'=any(ids) then return null;end if;ids=array_append(ids,b->>'id');
  hit=public._friend_laser_hit(b,v->'picks'->i);if hit is null then return null;end if;if hit then solved=solved+1;end if;
 end loop;
 return solved*25;
exception when others then return null;
end $$;
revoke all on function public._friend_laser_hit(jsonb,jsonb),public._friend_laser_score(jsonb,date) from public,anon,authenticated;

-- Alibi v1: validate snapshots, propagate acyclic statements for every possible culprit.
-- This intentionally differs from the browser's exhaustive truth-table solver.
create or replace function public._friend_alibi_v1_culprit(p jsonb) returns integer language plpgsql immutable set search_path='' as $$
declare n int; lv int; k int; x numeric; i int; j int; c int; pass int; a int; b int; ty text; s jsonb; v boolean; t boolean[]; marks text[]; names text[]:='{}'; statements text[]:='{}'; false_count int; winner int:=null; matches int:=0;
begin
 if jsonb_typeof(p) is distinct from 'object' or jsonb_typeof(p->'id') is distinct from 'string' or p->>'id' !~ '^alibi-v1-[0-3]-[0-9]+$' or char_length(p->>'id')>80 or jsonb_typeof(p->'level') is distinct from 'number' then return null;end if;
 x=(p->>'level')::numeric;if x<>trunc(x) or x not between 0 and 3 then return null;end if;lv=x;n=case when lv=3 then 5 else 4 end;
 if p->'n' is distinct from to_jsonb(n) or jsonb_typeof(p->'k') is distinct from 'number' then return null;end if;
 x=(p->>'k')::numeric;if x<>trunc(x) or x not between 1 and n-1 then return null;end if;k=x;
 foreach ty in array array['crime','detail','item'] loop
  if jsonb_typeof(p->ty) is distinct from 'string' or char_length(trim(p->>ty))<1 or char_length(p->>ty)>(case ty when 'crime' then 140 when 'detail' then 280 else 30 end) then return null;end if;
 end loop;
 if jsonb_typeof(p->'names') is distinct from 'array' or jsonb_array_length(p->'names')<>n or jsonb_typeof(p->'s') is distinct from 'array' or jsonb_array_length(p->'s')<>n then return null;end if;
 for i in 0..n-1 loop
  if jsonb_typeof(p->'names'->i) is distinct from 'string' or char_length(trim(p->'names'->>i))<1 or char_length(p->'names'->>i)>30 or p->'names'->>i=any(names) then return null;end if;names=array_append(names,p->'names'->>i);
  s=p->'s'->i;if jsonb_typeof(s) is distinct from 'array' or jsonb_array_length(s)<>3 or jsonb_typeof(s->0) is distinct from 'string' or coalesce(s->>0,'') not in ('is','not','tru','lie','either','both') then return null;end if;ty=s->>0;
  for j in 1..2 loop
   if jsonb_typeof(s->j) is distinct from 'number' then return null;end if;
   x=(s->>j)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;
  end loop;a=(s->>1)::numeric;b=(s->>2)::numeric;
  if ty not in ('is','not') and (a=i or (ty in ('either','both') and (b=i or a=b))) then return null;end if;
  -- Numeric equality also accepts JSON 0.0 like JavaScript.
  v=false;for j in 1..coalesce(array_length(statements,1),0) loop if (statements[j])::jsonb=s then v=true;end if;end loop;if v then return null;end if;statements=array_append(statements,s::text);
 end loop;
 for c in 0..n-1 loop
  t=array_fill(null::boolean,array[n]);
  for pass in 1..n loop
   for i in 0..n-1 loop
    if t[i+1] is not null then continue;end if;s=p->'s'->i;ty=s->>0;a=(s->>1)::numeric;b=(s->>2)::numeric;
    if ty='is' then t[i+1]=(c=a);elsif ty='not' then t[i+1]=(c<>a);
    elsif t[a+1] is not null then
     if ty='tru' then t[i+1]=t[a+1];elsif ty='lie' then t[i+1]=not t[a+1];
     elsif t[b+1] is not null then if ty='both' then t[i+1]=t[a+1] and t[b+1];else t[i+1]=t[a+1] or t[b+1];end if;end if;
    end if;
   end loop;
  end loop;
  if array_position(t,null::boolean) is not null then return null;end if;false_count=0;foreach v in array t loop if not v then false_count=false_count+1;end if;end loop;
  if false_count=k then matches=matches+1;winner=c;end if;
 end loop;
 if matches<>1 then return null;end if;return winner;
exception when others then return null;
end $$;
-- Scenario v2 predicates: positions are zero-based visit indices, independent of client scores.
create or replace function public._friend_alibi_visit_rule(p jsonb,s jsonb,positions int[]) returns boolean language plpgsql immutable set search_path='' as $$
declare a int; b int; gap int; ty text;
begin
 ty=s->>0;a=(s->>1)::numeric;b=(s->>2)::numeric;gap=(s->>3)::numeric;
 if ty='at' then return positions[a+1]=b;elsif ty='notat' then return positions[a+1]<>b;elsif ty='before' then return positions[a+1]<positions[b+1];elsif ty='after' then return positions[a+1]>positions[b+1];elsif ty='next' then return positions[a+1]=positions[b+1]+1;elsif ty='gap' then return (p->'times'->>positions[a+1])::numeric-(p->'times'->>positions[b+1])::numeric=gap;end if;return null;
exception when others then return null;
end $$;
create or replace function public._friend_alibi_scenario(p jsonb) returns int language plpgsql immutable set search_path='' as $$
declare n int; lv int; i int; j int; a int; b int; z int; x numeric; ty text; s jsonb; e jsonb; names text[]:='{}'; portrait_ids int[]:='{}'; rules text[]:='{}'; moment int:=-1; window_a int; window_b int; visit_times int[]:='{}'; portrait_id int; ordered int[]; positions int[]; who int; fits boolean; winners int:=0; winner int;
begin
 if jsonb_typeof(p) is distinct from 'object' or p->'version' is distinct from '2'::jsonb or jsonb_typeof(p->'id') is distinct from 'string' or p->>'id' !~ '^alibi-v2-[0-3]-[0-9]+$' or char_length(p->>'id')>80 or jsonb_typeof(p->'level') is distinct from 'number' then return null;end if;
 x=(p->>'level')::numeric;if x<>trunc(x) or x not between 0 and 3 then return null;end if;lv=x;n=case when lv=3 then 5 else 4 end;
 if p->'n' is distinct from to_jsonb(n) then return null;end if;
 foreach ty in array array['crime','detail','item','place','visit'] loop
  if jsonb_typeof(p->ty) is distinct from 'string' or char_length(trim(p->>ty))<1 or char_length(p->>ty)>(case ty when 'crime' then 140 when 'detail' then 500 when 'place' then 60 when 'visit' then 80 else 30 end) then return null;end if;
 end loop;
 foreach ty in array array['names','portraits','times','s'] loop if jsonb_typeof(p->ty) is distinct from 'array' or jsonb_array_length(p->ty)<>n then return null;end if;end loop;
 if jsonb_typeof(p->'window') is distinct from 'array' or jsonb_array_length(p->'window')<>2 or jsonb_typeof(p->'evidence') is distinct from 'array' or jsonb_array_length(p->'evidence') not between 1 and 4 then return null;end if;
 for i in 0..1 loop if jsonb_typeof(p->'window'->i) is distinct from 'number' then return null;end if;x=(p->'window'->>i)::numeric;if x<>trunc(x) or x not between 0 and 1439 then return null;end if;end loop;window_a=(p->'window'->>0)::numeric;window_b=(p->'window'->>1)::numeric;if window_a>=window_b then return null;end if;
 for i in 0..n-1 loop
  if jsonb_typeof(p->'names'->i) is distinct from 'string' or char_length(trim(p->'names'->>i))<1 or char_length(p->'names'->>i)>30 or p->'names'->>i=any(names) then return null;end if;names=array_append(names,p->'names'->>i);
  if jsonb_typeof(p->'portraits'->i) is distinct from 'number' or jsonb_typeof(p->'times'->i) is distinct from 'number' then return null;end if;
  x=(p->'portraits'->>i)::numeric;if x<>trunc(x) or x not between 0 and 7 then return null;end if;portrait_id=x;if portrait_id=any(portrait_ids) then return null;end if;portrait_ids=array_append(portrait_ids,portrait_id);
  x=(p->'times'->>i)::numeric;if x<>trunc(x) or x not between 0 and 1439 or (i>0 and x<=visit_times[i]+1) or x in (window_a,window_b) then return null;end if;visit_times=array_append(visit_times,x::int);
  if x>window_a and x<window_b then if moment<>-1 then return null;end if;moment=i;end if;
  if p->'s'->i->1 is distinct from to_jsonb(i) then return null;end if;
 end loop;
 if moment=-1 or visit_times[n]-visit_times[1]>60 then return null;end if;
 -- Validate every account and evidence predicate before enumerating any visit order.
 for s in select value from jsonb_array_elements(p->'s') union all select value->'rule' from jsonb_array_elements(p->'evidence') loop
  if jsonb_typeof(s) is distinct from 'array' or jsonb_array_length(s)<>4 or jsonb_typeof(s->0) is distinct from 'string' or coalesce(s->>0,'') not in ('at','notat','before','after','next','gap') then return null;end if;ty=s->>0;
  for j in 1..3 loop if jsonb_typeof(s->j) is distinct from 'number' then return null;end if;x=(s->>j)::numeric;if x<>trunc(x) or x<0 or x>(case when j=3 then 60 else n-1 end) then return null;end if;end loop;a=(s->>1)::numeric;b=(s->>2)::numeric;z=(s->>3)::numeric;
  if ty in ('at','notat') then if z<>0 then return null;end if;elsif a=b or (ty='gap' and z<1) or (ty<>'gap' and z<>0) then return null;end if;
 end loop;
 for e in select value from jsonb_array_elements(p->'evidence') loop
  if jsonb_typeof(e) is distinct from 'object' or jsonb_typeof(e->'title') is distinct from 'string' or char_length(trim(e->>'title'))<1 or char_length(e->>'title')>60 or jsonb_typeof(e->'detail') is distinct from 'string' or char_length(trim(e->>'detail'))<1 or char_length(e->>'detail')>280 then return null;end if;
  foreach ty in array rules loop if ty::jsonb=e->'rule' then return null;end if;end loop;rules=array_append(rules,(e->'rule')::text);
 end loop;
 -- SQL builds person orders recursively; the JS solver uses cached permutations.
 for ordered in with recursive arrangement(ord) as (select '{}'::int[] union all select ar.ord||g.person from arrangement ar cross join generate_series(0,n-1) as g(person) where cardinality(ar.ord)<n and not g.person=any(ar.ord)) select ord from arrangement where cardinality(ord)=n loop
  positions=array_fill(0,array[n]);for i in 1..n loop positions[ordered[i]+1]=i-1;end loop;who=ordered[moment+1];fits=true;
  for e in select value from jsonb_array_elements(p->'evidence') loop if public._friend_alibi_visit_rule(p,e->'rule',positions) is not true then fits=false;exit;end if;end loop;if not fits then continue;end if;
  for i in 0..n-1 loop if public._friend_alibi_visit_rule(p,p->'s'->i,positions) is distinct from (i<>who) then fits=false;exit;end if;end loop;
  if fits then winners=winners+1;winner=who;if winners>1 then return null;end if;end if;
 end loop;
 if winners<>1 then return null;end if;return winner;
exception when others then return null;
end $$;
create or replace function public._friend_alibi_culprit(p jsonb) returns int language plpgsql immutable set search_path='' as $$
begin
 if p->'version'='2'::jsonb then return public._friend_alibi_scenario(p);end if;return public._friend_alibi_v1_culprit(p);
end $$;
revoke all on function public._friend_alibi_v1_culprit(jsonb),public._friend_alibi_visit_rule(jsonb,jsonb,int[]),public._friend_alibi_scenario(jsonb),public._friend_alibi_culprit(jsonb) from public,anon,authenticated;

create or replace function public._friend_alibi_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare i int; j int; n int; x numeric; culprit int; correct int:=0; p jsonb; note jsonb; ids text[]:='{}';
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or v->'round' is distinct from '3'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'edits') is distinct from 'number' then return null;end if;
 x=(v->>'edits')::numeric;if x<>trunc(x) or x not between 0 and 1000000 then return null;end if;
 if jsonb_typeof(v->'cases') is distinct from 'array' or jsonb_array_length(v->'cases')<>4 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>4 or jsonb_typeof(v->'notes') is distinct from 'array' or jsonb_array_length(v->'notes')<>4 or v->'selection' is distinct from v->'picks'->3 then return null;end if;
 for i in 0..3 loop
  p=v->'cases'->i;culprit=public._friend_alibi_culprit(p);if culprit is null or p->>'id'=any(ids) then return null;end if;ids=array_append(ids,p->>'id');n=(p->>'n')::numeric;
  if jsonb_typeof(v->'picks'->i) is distinct from 'number' then return null;end if;x=(v->'picks'->>i)::numeric;if x<>trunc(x) or x not between 0 and n-1 then return null;end if;if x=culprit then correct=correct+1;end if;
  note=v->'notes'->i;if jsonb_typeof(note) is distinct from 'object' or jsonb_typeof(note->'truth') is distinct from 'array' or jsonb_array_length(note->'truth')<>n or jsonb_typeof(note->'excluded') is distinct from 'array' or jsonb_array_length(note->'excluded')<>n then return null;end if;
  for j in 0..n-1 loop if jsonb_typeof(note->'truth'->j) is distinct from 'number' or (note->'truth'->>j)::numeric not in (-1,0,1) or jsonb_typeof(note->'excluded'->j) is distinct from 'boolean' then return null;end if;end loop;
 end loop;
 return correct*25;
exception when others then return null;
end $$;
revoke all on function public._friend_alibi_culprit(jsonb),public._friend_alibi_score(jsonb,date) from public,anon,authenticated;

-- Bouncer: evaluate a bounded spelling-rule tree. NULL means malformed data, not OUT.
create or replace function public._friend_bouncer_eval(r jsonb,w text,depth int default 0) returns boolean language plpgsql immutable set search_path='' as $$
declare k text; a jsonb; arg text; x numeric; left_result boolean; right_result boolean; i int; count_vowels int;
begin
 if w is null or w !~ '^[a-z]{3,12}$' or jsonb_typeof(r) is distinct from 'array' or jsonb_array_length(r)<>2 or jsonb_typeof(r->0) is distinct from 'string' then return null;end if;
 k=r->>0;a=r->1;
 if k in ('and','or','xor') then
  if depth<>0 or jsonb_typeof(a) is distinct from 'array' or jsonb_array_length(a)<>2 or a->0=a->1 then return null;end if;
  left_result=public._friend_bouncer_eval(a->0,w,1);right_result=public._friend_bouncer_eval(a->1,w,1);
  if left_result is null or right_result is null then return null;end if;
  return case k when 'and' then left_result and right_result when 'or' then left_result or right_result else left_result<>right_result end;
 end if;
 if k in ('length','vowels') then
  if jsonb_typeof(a) is distinct from 'number' then return null;end if;x=a::text::numeric;
  if x<>trunc(x) or (k='length' and x not between 3 and 12) or (k='vowels' and x not between 0 and 6) then return null;end if;
  return case k when 'length' then char_length(w)=x else char_length(regexp_replace(w,'[^aeiou]','','g'))=x end;
 elsif k in ('contains','prefix','suffix') then
  if jsonb_typeof(a) is distinct from 'string' then return null;end if;arg=r->>1;if arg !~ '^[a-z]{1,3}$' then return null;end if;
  return case k when 'contains' then position(arg in w)>0 when 'prefix' then left(w,char_length(arg))=arg else right(w,char_length(arg))=arg end;
 end if;
 if a is distinct from '0'::jsonb then return null;end if;
 case k
 when 'double' then return w ~ '(.)\1';
 when 'unique' then return (select count(distinct letter)=char_length(w) from regexp_split_to_table(w,'') as letter);
 when 'palindrome' then return w=reverse(w);
 when 'sameEnds' then return left(w,1)=right(w,1);
 when 'vowelPair' then return w ~ '[aeiou]{2}';
 when 'startsVowel' then return w ~ '^[aeiou]';
 when 'endsVowel' then return w ~ '[aeiou]$';
 when 'forward' then for i in 2..char_length(w) loop if ascii(substr(w,i-1,1))>ascii(substr(w,i,1)) then return false;end if;end loop;return true;
 when 'backward' then for i in 2..char_length(w) loop if ascii(substr(w,i-1,1))<ascii(substr(w,i,1)) then return false;end if;end loop;return true;
 when 'firstBeforeLast' then return ascii(left(w,1))<ascii(right(w,1));
 when 'rare' then return w ~ '[jqxz]';
 else return null;
 end case;
exception when others then return null;
end $$;
create or replace function public._friend_bouncer_puzzle(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare all_words text[]:='{}'; item jsonb; group_words jsonb; w text; result boolean; positives int:=0; i int; j int; lv numeric;
begin
 if jsonb_typeof(p) is distinct from 'object' or jsonb_typeof(p->'id') is distinct from 'string' or p->>'id' !~ '^bouncer-v1-[0-3]-[0-9]+$' or char_length(p->>'id')>80 or jsonb_typeof(p->'level') is distinct from 'number' then return false;end if;
 lv=(p->>'level')::numeric;if lv<>trunc(lv) or lv not between 0 and 3 or split_part(p->>'id','-',3)<>lv::int::text then return false;end if;
 for i in 0..2 loop
  group_words=case i when 0 then p->'ins' when 1 then p->'outs' else p->'words' end;
  if jsonb_typeof(group_words) is distinct from 'array' or jsonb_array_length(group_words)<>(case when i=2 then 8 else 2 end) then return false;end if;
  for item in select value from jsonb_array_elements(group_words) loop
   if jsonb_typeof(item) is distinct from 'string' then return false;end if;w=item#>>'{}';if w !~ '^[a-z]{3,12}$' or w=any(all_words) then return false;end if;all_words=array_append(all_words,w);
   result=public._friend_bouncer_eval(p->'rule',w);if result is null or (i=0 and not result) or (i=1 and result) then return false;end if;
   if i=2 and result then positives=positives+1;end if;
  end loop;
 end loop;
 return positives between 3 and 5;
exception when others then return false;
end $$;
create or replace function public._friend_bouncer_score(v jsonb,d date) returns double precision language plpgsql immutable set search_path='' as $$
declare p jsonb; picks jsonb; probes jsonb; ids text[]:='{}'; seen int[]; i int; j int; item jsonb; x numeric; idx int; correct int:=0; tests int:=0; actual boolean;
begin
 if jsonb_typeof(v) is distinct from 'object' or v->'version' is distinct from '1'::jsonb or v->>'day' is distinct from d::text or jsonb_typeof(v->'edits') is distinct from 'number' or (v->>'edits')::numeric not between 0 and 1000000 or (v->>'edits')::numeric<>trunc((v->>'edits')::numeric) or v->'round' is distinct from '1'::jsonb or coalesce(v->>'phase','') not in ('review','summary') or jsonb_typeof(v->'doors') is distinct from 'array' or jsonb_array_length(v->'doors')<>2 or jsonb_typeof(v->'picks') is distinct from 'array' or jsonb_array_length(v->'picks')<>2 or jsonb_typeof(v->'probes') is distinct from 'array' or jsonb_array_length(v->'probes')<>2 or v->'answers' is distinct from v->'picks'->1 then return null;end if;
 for i in 0..1 loop
  p=v->'doors'->i;if not public._friend_bouncer_puzzle(p) or p->>'id'=any(ids) then return null;end if;ids=array_append(ids,p->>'id');
  picks=v->'picks'->i;probes=v->'probes'->i;
  if jsonb_typeof(picks) is distinct from 'array' or jsonb_array_length(picks)<>8 or jsonb_typeof(probes) is distinct from 'array' or jsonb_array_length(probes)>4 then return null;end if;
  for j in 0..7 loop
   if jsonb_typeof(picks->j) is distinct from 'boolean' then return null;end if;actual=public._friend_bouncer_eval(p->'rule',p->'words'->>j);
   if (picks->>j)::boolean=actual then correct=correct+1;end if;
  end loop;
  seen='{}';
  for item in select value from jsonb_array_elements(probes) loop
   if jsonb_typeof(item) is distinct from 'number' then return null;end if;x=item::text::numeric;if x<>trunc(x) or x not between 0 and 7 then return null;end if;idx=x;
   if idx=any(seen) or (picks->>idx)::boolean<>public._friend_bouncer_eval(p->'rule',p->'words'->>idx) then return null;end if;
   seen=array_append(seen,idx);tests=tests+1;
  end loop;
 end loop;
 return (correct-tests/2.0)::double precision/16*100;
exception when others then return null;
end $$;
revoke all on function public._friend_bouncer_eval(jsonb,text,int),public._friend_bouncer_puzzle(jsonb),public._friend_bouncer_score(jsonb,date) from public,anon,authenticated;

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
    if (game='stake' and entry.key !~ '^stake:d:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='bouncer' and entry.key !~ '^break-room:bouncer:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='alibi' and entry.key !~ '^break-room:alibi:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='laser' and entry.key !~ '^break-room:laser:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='prior' and entry.key !~ '^break-room:prior:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='pack' and entry.key !~ '^break-room:pack:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') or (game='stack-up' and entry.key !~ '^break-room:stack-up:daily:[0-9]{4}-[0-9]{2}-[0-9]{2}$') then continue;end if;
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
