-- 0006: close MED-03 (forgeable completion) + MED-05 (no audit log).
-- From .audit/security/owasp-security-review-2026-06-23.md.

-- ════════════════════════════════════════════════════════════════════════════
-- MED-03 — completion is write-locked and graded SERVER-SIDE
-- Root cause: module_progress was client-writable (mp_self "for all") and quizzes
-- were graded in the browser, so a user could fabricate "done" rows via the API.
-- Fix: clients can only READ module_progress; the single write path is a SECURITY
-- DEFINER RPC that grades submitted answers against keys the client cannot read.
-- ════════════════════════════════════════════════════════════════════════════

-- Answer keys live server-side. RLS on + no policies + revoked grants = the client
-- can never read them (only SECURITY DEFINER functions can). q and answers are
-- 1-indexed by question number; `correct` is the right option index.
create table if not exists quiz_keys (
  module  int not null check (module between 1 and 12),
  q       int not null,
  correct int not null,
  primary key (module, q)
);
alter table quiz_keys enable row level security;
revoke all on quiz_keys from anon, authenticated;

-- Lock module_progress to read-only for clients; writes go through record_quiz_result().
drop policy if exists mp_self on module_progress;
create policy mp_self_read on module_progress for select using (user_id = auth.uid());
-- (mp_mgr unchanged: managers still read their seated end-users' progress.)
revoke insert, update, delete on module_progress from authenticated, anon;

-- Server-graded completion. The client submits ANSWERS (never a score).
-- p_answers[i] = chosen option index for question i (1-based). Pass mark 80%.
create or replace function record_quiz_result(p_module int, p_answers int[])
  returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_module < 1 or p_module > 12 then raise exception 'invalid module'; end if;
  select count(*) into v_total from quiz_keys where module = p_module;
  if v_total = 0 then raise exception 'no answer key for module %', p_module; end if;
  select count(*) into v_score from quiz_keys k
    where k.module = p_module and k.correct = p_answers[k.q];
  v_pass := (v_score * 100 / v_total) >= 80;
  if v_pass then
    insert into module_progress (user_id, module, status, score)
      values (auth.uid(), p_module, 'done', v_score)
      on conflict (user_id, module)
      do update set score = greatest(module_progress.score, excluded.score), updated_at = now();
    perform audit('module_completed', auth.uid(), jsonb_build_object('module', p_module, 'score', v_score, 'total', v_total));
  end if;
  return jsonb_build_object('module', p_module, 'score', v_score, 'total', v_total, 'passed', v_pass);
end $$;
revoke execute on function record_quiz_result(int, int[]) from anon, public;

-- ════════════════════════════════════════════════════════════════════════════
-- MED-05 — append-only audit log of privileged actions
-- Immutable + invisible to clients (RLS on, no policies, grants revoked); only the
-- service role / SECURITY DEFINER triggers write. Covers seat assignment, profile
-- privilege changes (role/credits/manager/reseller), and deal lifecycle.
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists audit_log (
  id     bigint generated always as identity primary key,
  at     timestamptz not null default now(),
  actor  uuid,
  action text not null,
  target uuid,
  detail jsonb
);
alter table audit_log enable row level security;
revoke all on audit_log from anon, authenticated;

create or replace function audit(p_action text, p_target uuid, p_detail jsonb)
  returns void language plpgsql security definer set search_path = public as $$
begin
  insert into audit_log (actor, action, target, detail) values (auth.uid(), p_action, p_target, p_detail);
end $$;
revoke execute on function audit(text, uuid, jsonb) from anon, authenticated, public;

create or replace function tg_audit_seat() returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform audit('seat_assigned', new.end_user_id, jsonb_build_object('manager', new.manager_id, 'seat', new.id));
  return new;
end $$;
drop trigger if exists audit_seat on seats;
create trigger audit_seat after insert on seats for each row execute function tg_audit_seat();

create or replace function tg_audit_profile() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role
     or new.credits_balance is distinct from old.credits_balance
     or new.manager_id is distinct from old.manager_id
     or new.reseller_id is distinct from old.reseller_id then
    perform audit('profile_privileged_change', new.id, jsonb_build_object(
      'role',        jsonb_build_object('old', old.role,            'new', new.role),
      'credits',     jsonb_build_object('old', old.credits_balance, 'new', new.credits_balance),
      'manager_id',  jsonb_build_object('old', old.manager_id,      'new', new.manager_id),
      'reseller_id', jsonb_build_object('old', old.reseller_id,     'new', new.reseller_id)));
  end if;
  return new;
end $$;
drop trigger if exists audit_profile on profiles;
create trigger audit_profile after update on profiles for each row execute function tg_audit_profile();

create or replace function tg_audit_deal() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform audit('deal_registered', new.id, jsonb_build_object('reseller', new.reseller_id, 'customer', new.customer_name, 'stage', new.stage));
  elsif new.stage is distinct from old.stage then
    perform audit('deal_stage_change', new.id, jsonb_build_object('old', old.stage, 'new', new.stage));
  end if;
  return new;
end $$;
drop trigger if exists audit_deal on deal_registrations;
create trigger audit_deal after insert or update on deal_registrations for each row execute function tg_audit_deal();

-- Trigger functions are not meant to be called via the REST API (they fire on the
-- table event regardless of these grants). Revoke EXECUTE to clear advisor WARNs.
revoke execute on function tg_audit_seat()    from anon, authenticated, public;
revoke execute on function tg_audit_profile() from anon, authenticated, public;
revoke execute on function tg_audit_deal()    from anon, authenticated, public;
