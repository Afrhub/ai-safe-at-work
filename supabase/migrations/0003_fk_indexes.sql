-- Indexes on the FK / lookup columns the RLS policies and portal queries hit.
-- Postgres does not auto-index foreign keys; without these, reseller/manager
-- reads seq-scan. Applied to the dev project; apply to prod before go-live.
create index if not exists idx_profiles_email        on profiles (email);
create index if not exists idx_profiles_manager_id   on profiles (manager_id);
create index if not exists idx_profiles_reseller_id  on profiles (reseller_id);
create index if not exists idx_deal_reg_reseller_id  on deal_registrations (reseller_id);
create index if not exists idx_customers_reseller_id on customers (reseller_id);
create index if not exists idx_commissions_reseller_id on commissions (reseller_id);
create index if not exists idx_seats_end_user_id     on seats (end_user_id);
