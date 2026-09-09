-- 0015 — Codex re-review of 0014 (9 Sep 2026): two SECURITY DEFINER functions were left
-- callable at aal1. ensure_governance_docs writes (seeds the caller's own pack) and
-- has_course_access answers about the caller; both now require the authenticator, so
-- "every definer function refuses a password-only token" is true rather than nearly true.

create or replace function public.has_course_access()
returns boolean language sql stable security definer set search_path = public as $$
  select is_aal2() and (
       exists (select 1 from profiles where id = auth.uid() and role in ('manager','reseller'))
    or exists (select 1 from seats where end_user_id = auth.uid()));
$$;

create or replace function public.ensure_governance_docs()
  returns void language plpgsql security definer set search_path = public as $$
declare v_mgr uuid := auth.uid();
begin
  if not is_aal2() then raise exception 'authenticator required'; end if;
  if (select role from profiles where id = v_mgr) is distinct from 'manager' then return; end if;
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
