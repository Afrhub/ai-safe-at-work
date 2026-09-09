-- 0016 — document audience, and content for the three staff-facing GDPR documents.
--
-- Nine GDPR documents in the seeded pack had no content (Codex, 9 Sep 2026). Three are
-- staff-facing and legally must be readable: the Employee Privacy Notice (UK GDPR Art 13),
-- the Data Protection Policy and the Employee Monitoring Policy; templates written 9 Sep.
-- The other six (lawful-basis register, RoPA, retention schedule, DSAR procedure,
-- special-category policy, transfers policy) are the manager's and the ICO's records and are
-- never acknowledged by staff: audience = 'internal', excluded from the staff portal and
-- from the acknowledgement denominator.

alter table governance_docs add column if not exists audience text not null default 'staff'
  check (audience in ('staff','internal'));

update governance_docs set audience = 'internal'
  where doc_key in ('gdpr-lawful','gdpr-ropa','gdpr-retention','gdpr-dsar','gdpr-special','gdpr-transfers');

update governance_docs set href = '/templates/employee-privacy-notice.html'  where doc_key = 'gdpr-emp-privacy' and href is null;
update governance_docs set href = '/templates/data-protection-policy.html'    where doc_key = 'gdpr-dp-policy'   and href is null;
update governance_docs set href = '/templates/employee-monitoring-policy.html' where doc_key = 'gdpr-monitoring' and href is null;

create or replace function public.ensure_governance_docs()
  returns void language plpgsql security definer set search_path = public as $$
declare v_mgr uuid := auth.uid();
begin
  if not is_aal2() then raise exception 'authenticator required'; end if;
  if (select role from profiles where id = v_mgr) is distinct from 'manager' then return; end if;
  insert into governance_docs (manager_id, doc_key, title, href, category, status, domain, audience) values
   (v_mgr,'aup','Acceptable Use Policy','/templates/aup-template.html','Policy','draft','ai','staff'),
   (v_mgr,'charter','AI Governance Charter','/templates/ai-governance-charter.html','Policy','draft','ai','staff'),
   (v_mgr,'ms-manual','AI Management System Manual','/templates/ai-management-system-manual.html','Policy','draft','ai','staff'),
   (v_mgr,'use-case-register','AI Use Case Register','/templates/ai-use-case-register.html','Register','ready','ai','staff'),
   (v_mgr,'tool-register','AI Tool Register','/templates/ai-tool-register.html','Register','ready','ai','staff'),
   (v_mgr,'risk-register','AI Risk Register','/templates/ai-risk-register.html','Register','ready','ai','staff'),
   (v_mgr,'training-register','Training Register','/templates/training-register.html','Register','draft','ai','staff'),
   (v_mgr,'risk-assessment','AI Risk Assessment','/templates/ai-risk-assessment.html','Assessment','ready','ai','staff'),
   (v_mgr,'vendor-dd','AI Vendor Due Diligence','/templates/vendor-questionnaire.html','Assessment','draft','ai','staff'),
   (v_mgr,'supplier-risk','AI Supplier Risk Assessment','/templates/ai-supplier-risk-assessment.html','Assessment','draft','ai','staff'),
   (v_mgr,'dpia','AI DPIA','/templates/dpia-template.html','Assessment','draft','ai','staff'),
   (v_mgr,'roles-matrix','AI Governance Roles Matrix','/templates/ai-raci-matrix.html','Governance','draft','ai','staff'),
   (v_mgr,'steering-tor','AI Steering Group ToR','/templates/ai-steering-group-tor.html','Governance','draft','ai','staff'),
   (v_mgr,'incident-form','AI Incident Form','/templates/incident-form.html','Incident','draft','ai','staff'),
   (v_mgr,'gdpr-emp-privacy','Employee Privacy Notice','/templates/employee-privacy-notice.html','Notice · Art 13/14','draft','gdpr','staff'),
   (v_mgr,'gdpr-dp-policy','Data Protection Policy','/templates/data-protection-policy.html','Policy','draft','gdpr','staff'),
   (v_mgr,'gdpr-lawful','Lawful Basis & Legitimate Interests Register',null,'Register · Art 6/9','draft','gdpr','internal'),
   (v_mgr,'gdpr-special','Special Category (HR) Data Policy',null,'Policy · Art 9','draft','gdpr','internal'),
   (v_mgr,'gdpr-retention','Data Retention Schedule',null,'Register · Art 5(1)(e)','draft','gdpr','internal'),
   (v_mgr,'gdpr-dsar','Subject Access Request Procedure',null,'Procedure · Art 15','draft','gdpr','internal'),
   (v_mgr,'gdpr-monitoring','Employee Monitoring Policy','/templates/employee-monitoring-policy.html','Policy','draft','gdpr','staff'),
   (v_mgr,'gdpr-breach','Personal Data Breach Response Plan','/templates/incident-form.html','Procedure · Art 33/34','draft','gdpr','staff'),
   (v_mgr,'gdpr-ropa','Records of Processing Activities (RoPA)',null,'Register · Art 30','draft','gdpr','internal'),
   (v_mgr,'gdpr-transfers','International Data Transfer Policy',null,'Policy · Chapter V','draft','gdpr','internal')
  on conflict (manager_id, doc_key) do nothing;
end $$;
