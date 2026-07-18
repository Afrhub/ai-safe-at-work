# Spec: Manager portal = artifact compliance platform (white/orange)

Source of truth: the published artifact (source captured at scratchpad/pw/art/artifact.html,
Playwright walk at scratchpad/pw/out/spec.json + per-tab screenshots).

## Objective
portal/manager.html replicates the artifact's nav, layout and *interactive functionality*
exactly — everything happens in-portal (no bouncing to template pages) — re-skinned to the
site's white/orange Sentinel tokens and Atkinson fonts, auth-guarded (manager role),
with data persisted per-manager in Supabase (table `governance_state`, key/value JSONB,
replacing the artifact's `window.storage`). Existing Team/Course/Templates/Updates panes
are preserved under a Manage nav group. Fixed-viewport app shell, no page scroll.

## Sections (verbatim from the artifact walk)

### —Dashboard  (tab `dashboard`)
- eyebrow: Tier 2 · Governance Toolkit
- headings: [Company Name] — AI Governance Dashboard
- subsections: Use Case Register, Vendor diligence, Steering group, Document pack — completion at a glance
- actions: Open Acceptable Use Policy →, Open register, Open vendors, Open RACI, Open
- table columns: #, Document, Status, 
- stat cards: DraftPolicy status (v1.0); 0%0 of 0 staff acknowledged; 0High / critical open risks; 0Open incidents

### 01Acceptable Use Policy  (tab `aup`)
- eyebrow: Document 01 · Tier 2
- headings: AI Acceptable Use Policy, Acceptable Use of AI Tools at [Company Name]
- subsections: Policy fields, Status, 1. Purpose, 2. Scope, 3. Approved tools, 4. Permitted uses, 5. Forbidden inputs, 6. Output handling
- actions: Print / Save PDF, Publish to staff, Save & regenerate

### 02Use Case Register  (tab `usecases`)
- eyebrow: Document 02 · Register
- headings: AI Use Case Register
- actions: Print / Export, + Add entry

### 04AI Risk Register  (tab `riskreg`)
- eyebrow: Document 04 · Register
- headings: AI Risk Register
- actions: Print / Export, + Add entry

### 03Risk Assessments  (tab `assessments`)
- eyebrow: Document 03
- headings: AI Risk Assessments
- actions: + New assessment

### 08Vendor Due Diligence  (tab `vendors`)
- eyebrow: Document 08
- headings: Vendor Due Diligence
- actions: + Add vendor

### 09Supplier Risk Score  (tab `supplierrisk`)
- eyebrow: Document 09
- headings: Supplier Risk Assessment
- actions: + New score

### 05Incident Reports  (tab `incidents`)
- eyebrow: Document 05
- headings: AI Incident Reports
- actions: + Log incident

### 06Roles Matrix (RACI)  (tab `raci`)
- eyebrow: Document 06
- headings: AI Governance Roles Matrix (RACI)
- subsections: Role columns, Decision matrix
- actions: Print / Export, Save changes
- table columns: Decision / Activity, DPO / Compliance, IT / Security, Procurement, Operations / Manager, CEO / Board

### 07Steering Group ToR  (tab `tor`)
- eyebrow: Document 07
- headings: AI Steering Group — Terms of Reference, AI Steering Group — Terms of Reference
- subsections: Group details, Membership, 1. Purpose, 2. Scope, 3. Membership, 4. Responsibilities, 5. Meetings, quorum and decisions, 6. Reporting
- actions: Print / Export, Save changes, + Add member
- table columns: Role, Held by

### 10Staff & Sign-off  (tab `staff`)
- eyebrow: Document 10 · Rollout
- headings: Staff & Policy Sign-off
- subsections: How "send to staff" works here, Staff roster, Acknowledge the policy
- actions: Copy announcement message, + Add staff member, I have read & accept the Acceptable Use Policy

## Definition of done (testable)
1. Playwright walk of /portal/manager.html finds all 11 artifact tabs (same grouped nav,
   same numbering) plus the Manage group (Team, Course, Templates, Updates).
2. Every artifact tab renders its section with matching headings and actions per the list above.
3. CRUD works in-portal: add a use case, a risk (matrix auto-rating), an assessment,
   a vendor (checklist scoring), a supplier risk score, an incident, a staff member;
   edit AUP fields and publish; edit RACI cells and ToR members; acknowledge as staff.
4. All writes survive a reload (Supabase governance_state; localStorage fallback offline).
5. White/orange scheme, Atkinson fonts, no page scroll, sign-out + back-to-website present.
6. No console errors on any tab.