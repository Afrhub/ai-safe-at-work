-- Reseller dashboard: customers (renewals) + commission statements. Applied to live project.
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  reseller_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  seats int not null default 0,
  renewal_date date,
  status text not null default 'active' check (status in ('active','churned')),
  created_at timestamptz not null default now()
);
create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  reseller_id uuid not null references profiles(id) on delete cascade,
  period text,
  amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','paid')),
  note text,
  created_at timestamptz not null default now()
);
alter table customers enable row level security;
alter table commissions enable row level security;
-- resellers manage their own customers
create policy customers_own on customers for all using (reseller_id = auth.uid()) with check (reseller_id = auth.uid());
-- resellers READ their commissions only; statements are issued by admin (service role), not self-created
create policy commissions_read on commissions for select using (reseller_id = auth.uid());
