-- 0009: capture the governance schema the repo could not reproduce, and remove the
-- function that made every completion record forgeable.
--
-- Found 11 Aug 2026 while specifying the end-to-end journeys (specs/e2e-scenarios.md).

-- ════════════════════════════════════════════════════════════════════════════
-- CRIT — set_module_progress defeats 0006
-- 0006 revoked insert, update and delete on module_progress and made
-- record_quiz_result the only write path, because the client must never state its
-- own score. set_module_progress(p_module, p_score) was added later, outside any
-- migration: SECURITY DEFINER, executable by anon AND authenticated, and it writes
-- whatever score it is handed with no answer checking. One REST call forges any
-- completion, which is also the record cert.html now prints and the manager's
-- roster reads.
--
-- It existed to bridge the old client-scored quizzes, which wrote to localStorage,
-- into module_progress. quiz.js has submitted answers to record_quiz_result since
-- 11 Aug, so the bridge has nothing left to carry. The caller in
-- portal/assets/end-user.js goes in the same commit.
-- ════════════════════════════════════════════════════════════════════════════
drop function if exists public.set_module_progress(integer, integer);

-- ════════════════════════════════════════════════════════════════════════════
-- The governance schema, transcribed from the live project
-- These four tables and ensure_governance_docs() were created by hand and exist in
-- no migration, so the repo could not rebuild the manager portal. Written with
-- create ... if not exists so applying this against the live project is a no-op and
-- a fresh project gets the same shape.
-- ════════════════════════════════════════════════════════════════════════════

-- The document pack. One row per manager per document, status draft -> ready -> live.
create table if not exists governance_docs (
  id         uuid primary key default gen_random_uuid(),
  manager_id uuid not null references profiles(id) on delete cascade,
  doc_key    text not null,
  title      text not null,
  href       text,
  category   text,
  status     text not null default 'draft' check (status in ('draft','ready','live')),
  domain     text not null default 'ai',
  updated_at timestamptz not null default now(),
  unique (manager_id, doc_key)
);
alter table governance_docs enable row level security;
drop policy if exists gd_own on governance_docs;
create policy gd_own on governance_docs for all
  using (manager_id = auth.uid()) with check (manager_id = auth.uid());
-- Staff read their own manager's pack, which is how end-user.html lists what to acknowledge.
drop policy if exists gd_seat_read on governance_docs;
create policy gd_seat_read on governance_docs for select
  using (manager_id in (select manager_id from seats where end_user_id = auth.uid()));

-- Risks, incidents, use cases and vendors behind the dashboard tiles.
create table if not exists governance_items (
  id         uuid primary key default gen_random_uuid(),
  manager_id uuid not null references profiles(id) on delete cascade,
  kind       text not null check (kind in ('risk','incident','use_case','vendor')),
  title      text,
  status     text,
  severity   text,
  created_at timestamptz not null default now()
);
alter table governance_items enable row level security;
drop policy if exists gi_own on governance_items;
create policy gi_own on governance_items for all
  using (manager_id = auth.uid()) with check (manager_id = auth.uid());

-- A staff member's acknowledgement of a published policy.
create table if not exists governance_acks (
  id              uuid primary key default gen_random_uuid(),
  manager_id      uuid not null references profiles(id) on delete cascade,
  doc_id          uuid not null references governance_docs(id) on delete cascade,
  end_user_id     uuid not null references profiles(id) on delete cascade,
  acknowledged_at timestamptz not null default now()
);
alter table governance_acks enable row level security;
drop policy if exists ga_read on governance_acks;
create policy ga_read on governance_acks for select
  using (end_user_id = auth.uid() or manager_id = auth.uid());
-- Staff may only record their own acknowledgement, and only to a manager who seats them.
drop policy if exists ga_staff_ins on governance_acks;
create policy ga_staff_ins on governance_acks for insert with check (
  end_user_id = auth.uid()
  and manager_id in (select manager_id from seats where end_user_id = auth.uid())
);
drop policy if exists ga_staff_del on governance_acks;
create policy ga_staff_del on governance_acks for delete using (end_user_id = auth.uid());

-- Free-form per-manager state for the Governance Centre screens.
create table if not exists governance_state (
  manager_id uuid not null references auth.users(id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (manager_id, key)
);
alter table governance_state enable row level security;
drop policy if exists gs_owner_all on governance_state;
create policy gs_owner_all on governance_state for all
  using (manager_id = auth.uid()) with check (manager_id = auth.uid());

create index if not exists idx_governance_docs_manager on governance_docs(manager_id);
create index if not exists idx_governance_items_manager on governance_items(manager_id);
create index if not exists idx_governance_acks_doc on governance_acks(doc_id);
create index if not exists idx_governance_acks_end_user on governance_acks(end_user_id);
create index if not exists idx_governance_acks_manager on governance_acks(manager_id);

-- Seeds a manager's 24-document pack on first visit to the dashboard. Idempotent.
create or replace function public.ensure_governance_docs()
  returns void language plpgsql security definer set search_path = public as $$
declare v_mgr uuid := auth.uid();
begin
  if (select role from profiles where id = v_mgr) <> 'manager' then return; end if;
  insert into governance_docs (manager_id, doc_key, title, href, category, status, domain) values
   -- AI governance
   (v_mgr,'aup','Acceptable Use Policy','/templates/aup-template.html','Policy','draft','ai'),
   (v_mgr,'charter','AI Governance Charter','/templates/ai-governance-charter.html','Policy','draft','ai'),
   (v_mgr,'ms-manual','AI Management System Manual','/templates/ai-management-system-manual.html','Policy','draft','ai'),
   (v_mgr,'use-case-register','AI Use Case Register','/templates/ai-use-case-register.html','Register','ready','ai'),
   (v_mgr,'tool-register','AI Tool Register','/templates/ai-tool-register.html','Register','ready','ai'),
   (v_mgr,'risk-register','AI Risk Register','/templates/ai-risk-register.html','Register','ready','ai'),
   (v_mgr,'training-register','Training Register','/templates/training-register.html','Register','draft','ai'),
   (v_mgr,'risk-assessment','AI Risk Assessment','/templates/ai-risk-assessment.html','Assessment','ready','ai'),
   (v_mgr,'vendor-dd','AI Vendor Due Diligence','/templates/vendor-questionnaire.html','Assessment','draft','ai'),
   (v_mgr,'supplier-risk','AI Supplier Risk Assessment','/templates/ai-supplier-risk-assessment.html','Assessment','draft','ai'),
   (v_mgr,'dpia','AI DPIA','/templates/dpia-template.html','Assessment','draft','ai'),
   (v_mgr,'roles-matrix','AI Governance Roles Matrix','/templates/ai-raci-matrix.html','Governance','draft','ai'),
   (v_mgr,'steering-tor','AI Steering Group ToR','/templates/ai-steering-group-tor.html','Governance','draft','ai'),
   (v_mgr,'incident-form','AI Incident Form','/templates/incident-form.html','Incident','draft','ai'),
   -- Data protection (GDPR), employee and staff personal data
   (v_mgr,'gdpr-emp-privacy','Employee Privacy Notice',null,'Notice · Art 13/14','draft','gdpr'),
   (v_mgr,'gdpr-dp-policy','Data Protection Policy',null,'Policy','draft','gdpr'),
   (v_mgr,'gdpr-lawful','Lawful Basis & Legitimate Interests Register',null,'Register · Art 6/9','draft','gdpr'),
   (v_mgr,'gdpr-special','Special Category (HR) Data Policy',null,'Policy · Art 9','draft','gdpr'),
   (v_mgr,'gdpr-retention','Data Retention Schedule',null,'Register · Art 5(1)(e)','draft','gdpr'),
   (v_mgr,'gdpr-dsar','Subject Access Request Procedure',null,'Procedure · Art 15','draft','gdpr'),
   (v_mgr,'gdpr-monitoring','Employee Monitoring Policy',null,'Policy','draft','gdpr'),
   (v_mgr,'gdpr-breach','Personal Data Breach Response Plan','/templates/incident-form.html','Procedure · Art 33/34','draft','gdpr'),
   (v_mgr,'gdpr-ropa','Records of Processing Activities (RoPA)',null,'Register · Art 30','draft','gdpr'),
   (v_mgr,'gdpr-transfers','International Data Transfer Policy',null,'Policy · Chapter V','draft','gdpr')
  on conflict (manager_id, doc_key) do nothing;
end $$;
revoke execute on function public.ensure_governance_docs() from anon;
