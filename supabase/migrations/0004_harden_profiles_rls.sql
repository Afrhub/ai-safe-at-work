-- 0004: harden access control (security review 2026-06-23)
-- Fixes from .audit/security/owasp-security-review-2026-06-23.md:
--   CRIT-01  users could PATCH their own role/credits_balance (privilege escalation)
--   HIGH-01  managers could INSERT seats directly, bypassing assign_seat()'s credit check
--   HIGH-02  assign_seat() accepted arbitrary user ids (cross-tenant read)

-- ── CRIT-01: column-level lock on profiles ────────────────────────────────────
-- RLS already restricts the ROW (profiles_self_upd: id = auth.uid()).
-- Restrict the COLUMNS too: an authenticated user may only edit their own name.
-- role / credits_balance / manager_id / reseller_id are now service-role / SECURITY
-- DEFINER only (handle_new_user + assign_seat run as definer and are unaffected).
revoke update on profiles from authenticated, anon;
grant  update (full_name) on profiles to authenticated;

-- ── HIGH-01: seats are created ONLY via assign_seat() ─────────────────────────
-- Replace the permissive "for all" manager policy with read-only; block direct writes.
drop policy if exists seats_mgr on seats;
create policy seats_mgr_read on seats for select using (manager_id = auth.uid());
-- (seats_eu unchanged: end-users still read their own seat rows.)
revoke insert, update, delete on seats from authenticated, anon;

-- ── HIGH-02: assign_seat() — relationship check + charge-only-on-new-seat ──────
create or replace function assign_seat(p_end_user uuid) returns seats
  language plpgsql security definer set search_path = public as $$
declare s seats; v_owner uuid;
begin
  if (select role from profiles where id = auth.uid()) <> 'manager' then
    raise exception 'only managers can assign seats';
  end if;
  if (select credits_balance from profiles where id = auth.uid()) < 1 then
    raise exception 'no credits remaining';
  end if;
  -- target must exist and must not already belong to a different manager
  select manager_id into v_owner from profiles where id = p_end_user;
  if not found then
    raise exception 'no such user';
  end if;
  if v_owner is not null and v_owner <> auth.uid() then
    raise exception 'user is managed by another account';
  end if;
  -- create the seat first; only charge a credit when a NEW seat is actually created
  insert into seats (manager_id, end_user_id) values (auth.uid(), p_end_user)
    on conflict (manager_id, end_user_id) do nothing
    returning * into s;
  if s.id is null then
    raise exception 'seat already assigned';
  end if;
  update profiles set credits_balance = credits_balance - 1 where id = auth.uid();
  update profiles set manager_id = auth.uid() where id = p_end_user and manager_id is null;
  return s;
end $$;
