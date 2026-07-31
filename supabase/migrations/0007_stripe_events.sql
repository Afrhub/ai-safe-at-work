-- 0007: idempotency ledger for Stripe webhook delivery (B3/B4).
--
-- Stripe retries on any non-2xx and can legitimately deliver the same event more
-- than once. grant_credits() is additive, so a duplicate delivery would silently
-- double a customer's seat allowance. The webhook claims the event id here first
-- and stops if the row already existed.
--
-- Deliberately no RLS policies: the service-role key bypasses RLS, and no browser
-- client has any business reading this.

create table if not exists stripe_events (
  id          text primary key,           -- Stripe event id, evt_...
  type        text not null,
  received_at timestamptz not null default now()
);

alter table stripe_events enable row level security;
