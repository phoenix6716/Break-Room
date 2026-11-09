-- Additive sandbox billing only; never touches native saves or live entitlements.
create table br_billing.sandbox_customers (
 user_id uuid primary key references auth.users(id) on delete cascade,
 customer_id text not null unique check (customer_id ~ '^cus_[A-Za-z0-9]+$'),
 lease_token uuid, lease_until timestamptz,
 unique(user_id,customer_id)
);
create table br_billing.sandbox_sessions (
 session_id text primary key check (session_id like 'cs_test_%'),
 user_id uuid not null,
 customer_id text not null,
 item text not null check (item in ('monthly','laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','stack-up','pack','lowball','inner-clock')),
 price_id text not null,
 created_at timestamptz not null default now(),
 state text not null default 'pending' check (state in ('pending','active','inactive')),
 paid_through timestamptz,
 cancel_at_period_end boolean not null default false,
 foreign key(user_id,customer_id) references br_billing.sandbox_customers(user_id,customer_id) on delete cascade
);
create index sandbox_sessions_owner on br_billing.sandbox_sessions(user_id);
create table br_billing.sandbox_settings (key text primary key, value text not null);
revoke all on br_billing.sandbox_customers,br_billing.sandbox_sessions,br_billing.sandbox_settings from public,anon,authenticated;
alter table br_billing.sandbox_customers enable row level security;
alter table br_billing.sandbox_sessions enable row level security;
alter table br_billing.sandbox_settings enable row level security;
grant select,insert,update on br_billing.sandbox_customers,br_billing.sandbox_sessions,br_billing.sandbox_settings to service_role;

-- Service-only dispatcher: browser roles have neither EXECUTE nor private table access.
create function public.billing_sandbox_server(p_action text,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare c br_billing.sandbox_customers; uid uuid; token uuid; result jsonb; row jsonb;
begin
 if p_action='customer_lookup' then
  select * into c from br_billing.sandbox_customers where customer_id=p_data->>'customer_id';
  return case when c.user_id is null then null else to_jsonb(c) end;
 elsif p_action='setting_get' then
  return (select to_jsonb(value) from br_billing.sandbox_settings where key=p_data->>'key');
 elsif p_action='setting_set' then
  insert into br_billing.sandbox_settings values(p_data->>'key',p_data->>'value') on conflict(key) do nothing;
  return (select to_jsonb(value) from br_billing.sandbox_settings where key=p_data->>'key');
 elsif p_action='event_done' then
  update br_billing.sandbox_events set processed_at=now() where event_id=p_data->>'event_id';
  return 'true';
 end if;
 uid:=(p_data->>'user_id')::uuid;
 if uid is null then raise exception 'Account required'; end if;
 if p_action='customer_set' then
  insert into br_billing.sandbox_customers(user_id,customer_id) values(uid,p_data->>'customer_id') on conflict(user_id) do nothing;
 end if;
 select * into c from br_billing.sandbox_customers where user_id=uid;
 if p_action in ('customer_get','customer_set') then return case when c.user_id is null then null else to_jsonb(c) end; end if;
 if c.user_id is null then raise exception 'Customer required'; end if;
 token:=(p_data->>'token')::uuid;
 if p_action='lock' then
  if token is null then raise exception 'Lock token required'; end if;
  update br_billing.sandbox_customers set lease_token=token,lease_until=now()+interval '120 seconds'
  where user_id=uid and (lease_until is null or lease_until<now());
  if not found then raise exception 'Billing busy; retry shortly'; end if;
  return 'true';
 elsif p_action='unlock' then
  update br_billing.sandbox_customers set lease_token=null,lease_until=null where user_id=uid and lease_token=token;
  return 'true';
 end if;
 -- Row lock plus token/expiry fences all snapshot writes and checkout creation.
 select * into c from br_billing.sandbox_customers where user_id=uid for update;
 if token is null or c.lease_token is distinct from token or c.lease_until is null or c.lease_until<=now() then raise exception 'Billing lease expired'; end if;
 if p_action='sessions' then
  return coalesce((select jsonb_agg(to_jsonb(s) order by s.created_at) from br_billing.sandbox_sessions s where s.user_id=uid),'[]');
 elsif p_action='session_add' then
  if (select count(*) from br_billing.sandbox_sessions where user_id=uid)>=100 then raise exception 'Sandbox session limit reached'; end if;
  insert into br_billing.sandbox_sessions(session_id,user_id,customer_id,item,price_id)
  values(p_data->>'session_id',uid,c.customer_id,p_data->>'item',p_data->>'price_id') on conflict(session_id) do nothing;
  if not exists(select 1 from br_billing.sandbox_sessions where session_id=p_data->>'session_id' and user_id=uid and item=p_data->>'item' and price_id=p_data->>'price_id') then raise exception 'Session mismatch'; end if;
  return 'true';
 elsif p_action='snapshot' then
  if coalesce(jsonb_typeof(p_data->'rows'),'')<>'array' then raise exception 'Snapshot required'; end if;
  if jsonb_array_length(p_data->'rows')<>(select count(*) from br_billing.sandbox_sessions where user_id=uid) then raise exception 'Incomplete snapshot'; end if;
  if (select count(distinct value->>'session_id') from jsonb_array_elements(p_data->'rows'))<>jsonb_array_length(p_data->'rows') then raise exception 'Duplicate snapshot session'; end if;
  for row in select value from jsonb_array_elements(p_data->'rows') loop
   update br_billing.sandbox_sessions set state=row->>'state',paid_through=(row->>'paid_through')::timestamptz,cancel_at_period_end=coalesce((row->>'cancel_at_period_end')::boolean,false)
   where session_id=row->>'session_id' and user_id=uid;
   if not found then raise exception 'Session mismatch'; end if;
  end loop;
  return 'true';
 else raise exception 'Unknown sandbox operation';
 end if;
end $$;
revoke all on function public.billing_sandbox_server(text,jsonb) from public,anon,authenticated;
grant execute on function public.billing_sandbox_server(text,jsonb) to service_role;
