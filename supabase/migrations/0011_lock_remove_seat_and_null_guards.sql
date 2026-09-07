-- 0011 — lock remove_seat and close the null-session guard in both seat functions.
--
-- Supabase's security advisor (7 Sep 2026) found remove_seat executable by anon:
-- 0005 revoked assign_seat from anon/public but never remove_seat, and the live function
-- carries PUBLIC EXECUTE. Both guards also read `role <> 'manager'`, which is NULL, not
-- true, when auth.uid() is null, so `if` does not raise for a signed-out caller. Today
-- nothing follows that would succeed (the delete matches no rows, the insert violates
-- not-null), but the guard should refuse, not rely on what comes after it.

revoke execute on function public.remove_seat(uuid) from anon, public;

create or replace function public.assign_seat(p_end_user uuid)
returns seats language plpgsql security definer set search_path = public as $$
declare s seats; v_owner uuid;
begin
  if (select role from profiles where id = auth.uid()) is distinct from 'manager' then
    raise exception 'only managers can assign seats';
  end if;
  if coalesce((select credits_balance from profiles where id = auth.uid()), 0) < 1 then
    raise exception 'no credits remaining';
  end if;
  select manager_id into v_owner from profiles where id = p_end_user;
  if not found then
    raise exception 'no such user';
  end if;
  if v_owner is not null and v_owner <> auth.uid() then
    raise exception 'user is managed by another account';
  end if;
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

create or replace function public.remove_seat(p_end_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_deleted int;
begin
  if (select role from profiles where id = auth.uid()) is distinct from 'manager' then
    raise exception 'only managers can remove seats';
  end if;
  delete from seats where manager_id = auth.uid() and end_user_id = p_end_user;
  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then raise exception 'no such seat'; end if;
  update profiles set credits_balance = credits_balance + 1 where id = auth.uid();
  update profiles set manager_id = null where id = p_end_user and manager_id = auth.uid();
end $$;
