-- 0014 — Codex audits of 8 and 9 Sep 2026, database half.
--
-- 1. aal2 everywhere a record is read or written. TOTP was enforced by the browser only; a
--    password-only token reached PostgREST and every RPC. Identity bootstrap (own profile
--    read/update) stays at aal1 because the enrolment step needs it; everything else needs
--    the authenticator.
-- 2. profiles.email follows an Auth email change (it was set once at creation, so invites
--    and fulfilment could match a stale address and create a second account).
-- 3. One acknowledgement per learner per document, and only of a live document owned by the
--    manager named on the row.
-- 4. assign_seat is atomic: the target profile is locked, the credit is spent only where one
--    exists, a person holds at most one seat, and a balance can never go negative.
-- 5. Governance mutations are audited: documents, register items, acknowledgements.

-- 1. aal2 ---------------------------------------------------------------------------------
create or replace function public.is_aal2()
returns boolean language sql stable as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2';
$$;

drop policy if exists profiles_mgr_read on profiles;
create policy profiles_mgr_read on profiles for select using (
  is_aal2() and id in (select end_user_id from seats where manager_id = auth.uid()));

drop policy if exists seats_mgr on seats;
create policy seats_mgr on seats for all
  using (is_aal2() and manager_id = auth.uid()) with check (is_aal2() and manager_id = auth.uid());
drop policy if exists seats_mgr_read on seats;
create policy seats_mgr_read on seats for select using (is_aal2() and manager_id = auth.uid());
drop policy if exists seats_eu on seats;
create policy seats_eu on seats for select using (is_aal2() and end_user_id = auth.uid());

drop policy if exists mp_self on module_progress;
drop policy if exists mp_self_read on module_progress;
create policy mp_self_read on module_progress for select using (is_aal2() and user_id = auth.uid());
drop policy if exists mp_mgr on module_progress;
create policy mp_mgr on module_progress for select using (
  is_aal2() and user_id in (select end_user_id from seats where manager_id = auth.uid()));

drop policy if exists tp_self_read on track_progress;
create policy tp_self_read on track_progress for select using (is_aal2() and user_id = auth.uid());
drop policy if exists tp_mgr_read on track_progress;
create policy tp_mgr_read on track_progress for select using (
  is_aal2() and user_id in (select end_user_id from seats where manager_id = auth.uid()));

drop policy if exists gd_own on governance_docs;
create policy gd_own on governance_docs for all
  using (is_aal2() and manager_id = auth.uid()) with check (is_aal2() and manager_id = auth.uid());
drop policy if exists gd_seat_read on governance_docs;
create policy gd_seat_read on governance_docs for select
  using (is_aal2() and manager_id in (select manager_id from seats where end_user_id = auth.uid()));

drop policy if exists gi_own on governance_items;
create policy gi_own on governance_items for all
  using (is_aal2() and manager_id = auth.uid()) with check (is_aal2() and manager_id = auth.uid());

drop policy if exists gs_owner_all on governance_state;
create policy gs_owner_all on governance_state for all
  using (is_aal2() and manager_id = auth.uid()) with check (is_aal2() and manager_id = auth.uid());

-- 3. acknowledgements ---------------------------------------------------------------------
delete from governance_acks a using governance_acks b
  where a.doc_id = b.doc_id and a.end_user_id = b.end_user_id and a.id > b.id;
create unique index if not exists governance_acks_one_per_doc on governance_acks (doc_id, end_user_id);

drop policy if exists ga_read on governance_acks;
create policy ga_read on governance_acks for select
  using (is_aal2() and (end_user_id = auth.uid() or manager_id = auth.uid()));
drop policy if exists ga_staff_ins on governance_acks;
create policy ga_staff_ins on governance_acks for insert with check (
  is_aal2()
  and end_user_id = auth.uid()
  and manager_id in (select manager_id from seats where end_user_id = auth.uid())
  and doc_id in (select id from governance_docs d where d.manager_id = governance_acks.manager_id and d.status = 'live')
);
drop policy if exists ga_staff_del on governance_acks;
create policy ga_staff_del on governance_acks for delete using (is_aal2() and end_user_id = auth.uid());

-- 2. email sync ---------------------------------------------------------------------------
create or replace function public.handle_user_email_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email is distinct from old.email then
    update profiles set email = new.email where id = new.id;
  end if;
  return new;
end $$;
drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- 4. seats --------------------------------------------------------------------------------
create unique index if not exists seats_one_per_person on seats (end_user_id);
alter table profiles drop constraint if exists profiles_credits_nonnegative;
alter table profiles add constraint profiles_credits_nonnegative check (credits_balance >= 0);

create or replace function public.assign_seat(p_end_user uuid)
returns seats language plpgsql security definer set search_path = public as $$
declare s seats; v_owner uuid;
begin
  if not is_aal2() then raise exception 'authenticator required'; end if;
  if (select role from profiles where id = auth.uid()) is distinct from 'manager' then
    raise exception 'only managers can assign seats';
  end if;
  -- Lock the target so two managers cannot both pass the ownership check.
  select manager_id into v_owner from profiles where id = p_end_user for update;
  if not found then
    raise exception 'no such user';
  end if;
  if v_owner is not null and v_owner <> auth.uid() then
    raise exception 'user is managed by another account';
  end if;
  -- Spend the credit only where one exists: the check and the decrement are one statement.
  update profiles set credits_balance = credits_balance - 1
    where id = auth.uid() and credits_balance > 0;
  if not found then
    raise exception 'no credits remaining';
  end if;
  insert into seats (manager_id, end_user_id) values (auth.uid(), p_end_user)
    on conflict (manager_id, end_user_id) do nothing
    returning * into s;
  if s.id is null then
    raise exception 'seat already assigned';
  end if;
  update profiles set manager_id = auth.uid() where id = p_end_user and manager_id is null;
  return s;
end $$;

create or replace function public.remove_seat(p_end_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_deleted int;
begin
  if not is_aal2() then raise exception 'authenticator required'; end if;
  if (select role from profiles where id = auth.uid()) is distinct from 'manager' then
    raise exception 'only managers can remove seats';
  end if;
  delete from seats where manager_id = auth.uid() and end_user_id = p_end_user;
  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then raise exception 'no such seat'; end if;
  update profiles set credits_balance = credits_balance + 1 where id = auth.uid();
  update profiles set manager_id = null where id = p_end_user and manager_id = auth.uid();
end $$;

-- record_* keep their bodies (0012); the aal2 gate is added at the top of each.
create or replace function public.record_quiz_result(p_module integer, p_answers integer[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean; v_results jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not is_aal2() then raise exception 'authenticator required'; end if;
  if p_module < 1 or p_module > 12 then raise exception 'invalid module'; end if;
  if p_module <> 1 and not has_course_access() then
    raise exception 'no seat: this account is not on a team yet. Ask your manager for a seat.';
  end if;
  select count(*) into v_total from quiz_keys where module = p_module;
  if v_total = 0 then raise exception 'no answer key for module %', p_module; end if;
  select count(*) into v_score from quiz_keys k
    where k.module = p_module and k.correct = p_answers[k.q];
  select jsonb_agg(jsonb_build_object('q', k.q, 'correct', k.correct = p_answers[k.q]) order by k.q)
    into v_results from quiz_keys k where k.module = p_module;
  v_pass := (v_score * 100 / v_total) >= 80;
  if v_pass then
    insert into module_progress (user_id, module, status, score)
      values (auth.uid(), p_module, 'done', v_score)
      on conflict (user_id, module)
      do update set score = greatest(module_progress.score, excluded.score), updated_at = now();
    perform audit('module_completed', auth.uid(),
      jsonb_build_object('module', p_module, 'score', v_score, 'total', v_total));
  end if;
  return jsonb_build_object('module', p_module, 'score', v_score, 'total', v_total,
                            'passed', v_pass, 'results', v_results);
end $$;

create or replace function public.record_track_quiz_result(p_track text, p_answers integer[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean; v_results jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not is_aal2() then raise exception 'authenticator required'; end if;
  if not has_course_access() then
    raise exception 'no seat: this account is not on a team yet. Ask your manager for a seat.';
  end if;
  select count(*) into v_total from track_keys where track = p_track;
  if v_total = 0 then raise exception 'no answer key for track %', p_track; end if;
  select count(*) into v_score from track_keys k
    where k.track = p_track and k.correct = p_answers[k.q];
  select jsonb_agg(jsonb_build_object('q', k.q, 'correct', k.correct = p_answers[k.q]) order by k.q)
    into v_results from track_keys k where k.track = p_track;
  v_pass := (v_score * 100 / v_total) >= 80;
  if v_pass then
    insert into track_progress (user_id, track, status, score)
      values (auth.uid(), p_track, 'done', v_score)
      on conflict (user_id, track)
      do update set score = greatest(track_progress.score, excluded.score), updated_at = now();
    perform audit('track_completed', auth.uid(),
      jsonb_build_object('track', p_track, 'score', v_score, 'total', v_total));
  end if;
  return jsonb_build_object('track', p_track, 'score', v_score, 'total', v_total,
                            'passed', v_pass, 'results', v_results);
end $$;

-- 5. governance audit ---------------------------------------------------------------------
create or replace function public.tg_audit_governance() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform audit('governance_' || lower(tg_op) || '_' || tg_table_name,
    coalesce(new.id, old.id),
    jsonb_build_object('old', case when tg_op = 'INSERT' then null else to_jsonb(old) end,
                       'new', case when tg_op = 'DELETE' then null else to_jsonb(new) end));
  return coalesce(new, old);
end $$;
drop trigger if exists audit_governance_docs on governance_docs;
create trigger audit_governance_docs after update or delete on governance_docs
  for each row execute function public.tg_audit_governance();
drop trigger if exists audit_governance_items on governance_items;
create trigger audit_governance_items after insert or update or delete on governance_items
  for each row execute function public.tg_audit_governance();
drop trigger if exists audit_governance_acks on governance_acks;
create trigger audit_governance_acks after insert or delete on governance_acks
  for each row execute function public.tg_audit_governance();
