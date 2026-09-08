-- 0013 — Stripe fulfilment in one transaction; grant_credits captured in the repo.
--
-- Codex audit, 8 Sep 2026, findings 1, 2 and 10. The webhook used to claim the event id
-- (insert into stripe_events), then call grant_credits, then PATCH full_name, then release the
-- claim on any throw. Two failure shapes: a network error on the PATCH released an event whose
-- credits were already granted, so Stripe's retry granted them twice; and a hard crash between
-- claim and grant left the event marked processed and the customer unprovisioned.
-- fulfil_stripe_event does claim, grant and name in one transaction: either all of it commits
-- or none of it does, and a redelivery reads as a duplicate. Service role only.
--
-- grant_credits existed only on the live project (0007 referenced it); its live definition is
-- captured here unchanged so a fresh database can fulfil a payment.

create or replace function public.grant_credits(p_manager uuid, p_amount integer)
returns integer language plpgsql security definer set search_path = public as $$
declare v_new int;
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  update profiles
    set credits_balance = credits_balance + p_amount,
        role = case when role = 'reseller' then 'reseller' else 'manager' end
    where id = p_manager
    returning credits_balance into v_new;
  if not found then
    raise exception 'no such user';
  end if;
  return v_new;
end $$;
-- The service role keeps EXECUTE through Supabase's default privileges (as in 0005); only
-- the browser-facing roles are revoked. (The pre-push guard forbids naming that role here.)
revoke execute on function public.grant_credits(uuid, integer) from anon, public, authenticated;

create or replace function public.fulfil_stripe_event(
  p_event_id text, p_event_type text, p_manager uuid, p_amount integer, p_full_name text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_new int;
begin
  insert into stripe_events (id, type) values (p_event_id, p_event_type)
    on conflict (id) do nothing;
  if not found then
    return jsonb_build_object('duplicate', true);
  end if;
  -- Any raise below rolls the claim back with it, so a retry starts clean.
  v_new := grant_credits(p_manager, p_amount);
  if p_full_name is not null and length(trim(p_full_name)) > 0 then
    update profiles set full_name = p_full_name where id = p_manager;
  end if;
  return jsonb_build_object('duplicate', false, 'credits', v_new);
end $$;
revoke execute on function public.fulfil_stripe_event(text, text, uuid, integer, text) from anon, public, authenticated;
