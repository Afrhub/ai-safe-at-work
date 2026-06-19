-- AI Safe@Work portals — schema + RLS. Apply once the Supabase project exists.
-- Roles: end_user | manager | reseller. supabase-js client uses the anon key; RLS protects all rows.

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  role          text not null default 'end_user' check (role in ('end_user','manager','reseller')),
  manager_id    uuid references profiles(id),      -- end_user → their manager
  reseller_id   uuid references profiles(id),      -- manager → their reseller (optional)
  credits_balance int not null default 0,          -- managers only
  created_at    timestamptz not null default now()
);

create table if not exists seats (
  id            uuid primary key default gen_random_uuid(),
  manager_id    uuid not null references profiles(id) on delete cascade,
  end_user_id   uuid not null references profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (manager_id, end_user_id)
);

create table if not exists module_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  module        int  not null check (module between 1 and 12),
  status        text not null default 'done' check (status in ('done')),
  score         int,
  updated_at    timestamptz not null default now(),
  unique (user_id, module)
);

create table if not exists deal_registrations (
  id              uuid primary key default gen_random_uuid(),
  reseller_id     uuid not null references profiles(id) on delete cascade,
  customer_name   text not null,
  customer_contact text,
  est_value       numeric,
  stage           text not null default 'registered' check (stage in ('registered','qualified','won','lost')),
  notes           text,
  created_at      timestamptz not null default now()
);

-- New auth users get a profile row (default role end_user; admin promotes managers/resellers).
create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Atomic seat assignment: manager spends one credit to seat an existing end-user.
create or replace function assign_seat(p_end_user uuid) returns seats language plpgsql security definer as $$
declare s seats;
begin
  if (select role from profiles where id = auth.uid()) <> 'manager' then
    raise exception 'only managers can assign seats';
  end if;
  if (select credits_balance from profiles where id = auth.uid()) < 1 then
    raise exception 'no credits remaining';
  end if;
  update profiles set credits_balance = credits_balance - 1 where id = auth.uid();
  insert into seats (manager_id, end_user_id) values (auth.uid(), p_end_user)
    on conflict (manager_id, end_user_id) do nothing
    returning * into s;
  return s;
end $$;

-- ── RLS ──
alter table profiles enable row level security;
alter table seats enable row level security;
alter table module_progress enable row level security;
alter table deal_registrations enable row level security;

-- profiles: read own; managers read their seated end-users; update own name only.
create policy profiles_self_read on profiles for select using (id = auth.uid());
create policy profiles_mgr_read  on profiles for select using (
  id in (select end_user_id from seats where manager_id = auth.uid()));
create policy profiles_self_upd  on profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- seats: managers manage their own; end-users see their own.
create policy seats_mgr on seats for all using (manager_id = auth.uid()) with check (manager_id = auth.uid());
create policy seats_eu  on seats for select using (end_user_id = auth.uid());

-- module_progress: users own theirs; managers read their seated end-users'.
create policy mp_self on module_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy mp_mgr  on module_progress for select using (
  user_id in (select end_user_id from seats where manager_id = auth.uid()));

-- deal_registrations: resellers own theirs.
create policy deals_own on deal_registrations for all using (reseller_id = auth.uid()) with check (reseller_id = auth.uid());
