-- Sandbox inbox only. No entitlement or native game data is changed.
create schema if not exists br_billing;
revoke all on schema br_billing from public, anon, authenticated;
grant usage on schema br_billing to service_role;
create table br_billing.sandbox_events (
  event_id text primary key check (event_id ~ '^evt_[A-Za-z0-9]+$'),
  event_type text not null,
  object_id text not null,
  stripe_created bigint not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table br_billing.sandbox_events enable row level security;
revoke all on br_billing.sandbox_events from public, anon, authenticated;
grant select, insert, update on br_billing.sandbox_events to service_role;
create function public.billing_receive_sandbox_event(p_event_id text, p_event_type text, p_object_id text, p_created bigint)
returns void language sql security invoker set search_path = '' as $$
  insert into br_billing.sandbox_events(event_id,event_type,object_id,stripe_created)
  values(p_event_id,p_event_type,p_object_id,p_created)
  on conflict(event_id) do nothing;
$$;
revoke all on function public.billing_receive_sandbox_event(text,text,text,bigint) from public, anon, authenticated;
grant execute on function public.billing_receive_sandbox_event(text,text,text,bigint) to service_role;
