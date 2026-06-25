-- 0005: tighten EXECUTE on SECURITY DEFINER functions (clears Supabase advisor WARNs).
-- handle_new_user is a trigger function — it must NOT be callable via the REST API at all
-- (the trigger still fires on auth.users insert regardless of these grants).
revoke execute on function handle_new_user() from anon, authenticated, public;

-- assign_seat is for signed-in managers only; anon never needs it.
revoke execute on function assign_seat(uuid) from anon, public;
-- (authenticated keeps EXECUTE; the function itself enforces role = 'manager'.)
