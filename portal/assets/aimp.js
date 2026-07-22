/* ============ STORAGE LAYER: Supabase per-manager KV (was window.storage) ============ */
import { guard, sb, signOut } from "./portal.js";
const PROFILE = await guard(["manager"]);
if (!PROFILE) throw new Error("unauthorised");
const CURRENT_UID = (await sb.auth.getUser()).data.user.id;
async function dbGet(key, fallback){
  try{
    const { data, error } = await sb.from("governance_state").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    return data ? data.value : fallback;
  }catch(e){
    try{ const r = localStorage.getItem("aimp-" + key); return r ? JSON.parse(r) : fallback; }catch(_){ return fallback; }
  }
}
async function dbSet(key, value){
  try{
    const { error } = await sb.from("governance_state").upsert({ manager_id: CURRENT_UID, key, value });
    if (error) throw error;
  }catch(e){
    try{ localStorage.setItem("aimp-" + key, JSON.stringify(value)); }catch(_){}
  }
  return value;
}
function uid(prefix){ return prefix + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function fmtDate(d){ if(!d) return '-'; try{ return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }catch(e){ return d; } }
function toast(msg){
  const root = document.getElementById('toast-root');
  const el = document.createElement('div'); el.className='toast'; el.textContent = msg;
  root.appendChild(el); setTimeout(()=>el.remove(), 2600);
}
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============================= APP STATE ============================= */
const DB = {
  org: null, aup: null, tor: null, raci: null,
  staff: [], acks: [],
  usecases: [], risks: [], assessments: [],
  vendors: [], supplierRisk: [], incidents: []
};

/* Prompt text belongs in the placeholder attribute, not the value. It used to be
   seeded as the value, so every field arrived pre-filled with "[DPO Name]" and had
   to be selected and deleted before typing. fieldVal() hides any bracketed prompt
   left in stored data, so records saved before this fix behave the same way.
   docVal() puts the bracket back when rendering the policy document itself, where
   a visible [Company Name] is the intended fill-me-in marker. */
const PLACEHOLDER_RE = /^\s*\[.*\]\s*$/;
function fieldVal(v){ return (v==null || PLACEHOLDER_RE.test(v)) ? '' : v; }
function docVal(v, prompt){ const x = fieldVal(v); return x || prompt; }

const DEFAULT_ORG = {
  companyName:'', owner:'', dpoName:'',
  effectiveDate: todayISO(), incidentContact:'security@example.com', logLocation:'Shared AI Use Register (spreadsheet)',
  trainingRef:'the AI Safe@Work course', approvedTools:'ChatGPT Enterprise (EU region)\nMicrosoft 365 Copilot',
  // Sections 4, 5, 6, 8 and 13 were hardcoded prose. They are editable now, seeded
  // with the wording they already had, so an existing policy reads identically
  // until someone deliberately changes it.
  permittedUses:'', forbiddenInputs:'', outputHandling:'', settingsConfig:'', consequences:'',
  vendorChanges:'', rolesResponsibilities:''
};
const AUP_SECTION_DEFAULTS = {
  permittedUses:'Drafting and editing work with human review; summarising appropriate material; translation and rephrasing; brainstorming and structuring thinking; explaining concepts; technical assistance on appropriate data.',
  forbiddenInputs:"Customer or contact personal data; special-category personal data; third-party contracts or legal drafts; source code we don't own or licence; non-public financial data; authentication secrets; documents classified Confidential or higher; HR records; anything held under a duty of confidence, must never be entered into a free or personal-tier AI tool.",
  outputHandling:'AI-generated content must be reviewed by a human before use. Claims affecting a decision must be independently verified. AI involvement in customer-facing material must be disclosed per EU AI Act Article 50. No decision affecting someone\'s livelihood or legal position may be made on AI output alone.',
  settingsConfig:"Training-data opt-out enabled wherever offered on a work account; retention follows the company's procurement contract; MFA is required on all work AI accounts.",
  consequences:'Breach may result in disciplinary action up to and including termination, with mandatory regulator notification where applicable.',
  vendorChanges:"Material changes to an approved tool's terms, data handling, sub-processors or model must be reviewed by {DPO} before continued use.",
  rolesResponsibilities:'Every member of staff complies with this policy. Managers apply oversight to AI-assisted work. {DPO} maintains assessments and vendor diligence. IT/Security administers tools and incident response.'
};
/* A section's text: what the customer wrote, else the wording it shipped with.
   {DPO} and {COMPANY} resolve to the header fields, so those names stay in one
   place even after someone rewrites the surrounding sentence. */
function sec(o, key){
  const raw = fieldVal(o[key]) || AUP_SECTION_DEFAULTS[key];
  return String(raw)
    .replace(/\{DPO\}/g, docVal(o.dpoName, '[DPO name]'))
    .replace(/\{COMPANY\}/g, docVal(o.companyName, '[Company Name]'));
}
const DEFAULT_TOR = {
  org:'', reportTo:'the board', chair:'',
  members:[{role:'Data protection / compliance', held:''},{role:'IT / security', held:''},
           {role:'Procurement / legal', held:''},{role:'Business / operations', held:''},
           {role:'Executive sponsor', held:''}],
  frequency:'Quarterly, plus on demand for urgent approvals', quorumN:'three',
  minutesDays:'five working days', approvedBy:'', approvedDate:''
};
const RACI_ROWS = ['Approve new AI tool for use','Review vendor DPA and contract terms','Conduct vendor security assessment',
  'Assess GDPR / EU AI Act compliance fit','Run DPIA on new tool use case','Update AI Acceptable Use Policy',
  'Maintain AI Tool Register','Maintain AI Risk Register','Track AI training completion',
  'Respond to AI incident (investigation)','Notify regulator of AI-related breach',
  'Quarterly governance review (steering committee)','Report to CEO on governance maturity'];
const RACI_COLS_DEFAULT = ['DPO / Compliance','IT / Security','Procurement','Operations / Manager','CEO / Board'];
const RACI_DEFAULT_CELLS = [
 ['R / A','C','C','C','I'],['R','C','A','I','I'],['C','R','I','I','I'],['R','C','I','I','I'],['R','C','I','C','I'],
 ['R','C','I','C','A'],['R','C','I','I','I'],['R','C','I','C','I'],['C','I','I','R','I'],['R','R','I','C','A'],
 ['R','C','I','I','A'],['A','R','C','C','I'],['R','C','I','I','A']];

const VENDOR_MUST_QUESTIONS = [
 'Legal entity name, registered address and corporate group structure confirmed',
 'AI tool / service and version/tier confirmed',
 'Underlying foundation models listed (first-party or third-party)',
 'Countries where customer data is processed and stored, listed',
 'EU-region-only processing option confirmed available',
 'Data retention (prompts, responses, metadata, embeddings) documented',
 'Confirmed contractually: customer data NOT used to train/fine-tune models',
 'Data deletion on request confirmed, including backups & sub-processors',
 'Full sub-processor list provided with change-notification mechanism',
 'Data Processing Agreement (DPA) provided, incl. SCCs for international transfers',
 'EU AI Act Art 26 deployer-facing instructions confirmed will be provided',
 'Current ISO/IEC 27001:2022 certificate & Statement of Applicability provided',
 'Authentication: SSO/SAML/OIDC, SCIM, MFA, RBAC confirmed',
 'Per-model provider, version, purpose & known limitations declared',
 'Confirmed whether any model is high-risk under EU AI Act Annex III',
 'Controls against sensitive-information disclosure (cross-tenant isolation) described',
 'Contractual SLA for personal-data breach notification (≤72h) confirmed',
 'Process for EU AI Act Art 73 serious-incident notification confirmed',
 'Advance-notice period before material model / ToS / sub-processor changes confirmed'
];

const RISK_MATRIX = { // likelihood -> impact -> rating
  'High':{'Low':'Medium','Medium':'High','High':'High','Critical':'Critical'},
  'Medium':{'Low':'Low','Medium':'Medium','High':'High','Critical':'Critical'},
  'Low':{'Low':'Low','Medium':'Low','High':'Medium','Critical':'High'},
  'Very low':{'Low':'Low','Medium':'Low','High':'Low','Critical':'Medium'}
};

const ASSESSMENT_RISK_ROWS = ['Wrong or made-up output used as fact','Confidential / personal data exposed to the tool',
  'Bias or unfair outcome for an affected group','No human check before the output is acted on','Vendor / supply-chain or availability failure'];

const SRA_AREAS = ['Data handling','Security','Sub-processors','Compliance','Transparency','Lock-in & exit','Viability'];

/* ============================= LOAD ============================= */
async function loadAll(){
  DB.org = await dbGet('org-config', DEFAULT_ORG);
  DB.aupStatus = await dbGet('aup-status', {published:false, version:'1.0', publishedDate:null});
  // draftVersion is what you are editing; version is what staff acknowledged.
  // Records written before the split get a draft equal to their version.
  if(!DB.aupStatus.draftVersion) DB.aupStatus.draftVersion = DB.aupStatus.version || '1.0';
  DB.tor = await dbGet('tor-config', DEFAULT_TOR);
  DB.raci = await dbGet('raci-matrix', {cols:RACI_COLS_DEFAULT, cells:RACI_DEFAULT_CELLS});
  DB.staff = await dbGet('staff', []);
  DB.acks = await dbGet('acks', []);
  DB.usecases = await dbGet('usecases', []);
  DB.risks = await dbGet('risks', []);
  DB.assessments = await dbGet('assessments', []);
  DB.vendors = await dbGet('vendors', []);
  DB.supplierRisk = await dbGet('supplierRisk', []);
  DB.incidents = await dbGet('incidents', []);
  await syncUseCaseRatings();   // catch up anything rated by hand before assessments drove it
}

/* ============================= NAV ============================= */
const TABS = [
  {grp:'Overview', items:[ {id:'dashboard', label:'Dashboard'} ]},
  {grp:'Policy', items:[ {id:'aup', label:'Acceptable Use Policy'} ]},
  {grp:'Registers', items:[
    {id:'usecases', label:'Use Case Register'},
    {id:'riskreg', label:'AI Risk Register'} ]},
  {grp:'Assessments', items:[
    {id:'assessments', label:'Risk Assessments'},
    {id:'vendors', label:'Vendor Due Diligence'},
    {id:'supplierrisk', label:'Vendor Risk Score'} ]},
  {grp:'Response', items:[ {id:'incidents', label:'Incident Reports'} ]},
  {grp:'Governance', items:[
    {id:'raci', label:'Roles Matrix (RACI)'},
    {id:'tor', label:'Steering Group ToR'} ]},
  {grp:'People', items:[ {id:'staff', label:'Staff &amp; Sign-off'} ]},
  {grp:'Manage', items:[ {id:'m-team', label:'Team'}, {id:'m-course', label:'Course'}, {id:'m-templates', label:'Templates'}, {id:'m-updates', label:'Updates'} ]}
];
let CURRENT = 'dashboard';

function renderNav(){
  const nav = document.getElementById('navlist');
  nav.innerHTML = TABS.map(g => `
    <div class="grp">${g.grp}</div>
    ${g.items.map(it => `<button class="tab ${it.id===CURRENT?'active':''}" data-tab="${it.id}">${it.label}</button>`).join('')}
  `).join('');
  nav.querySelectorAll('button.tab').forEach(b=>b.addEventListener('click', ()=>{ CURRENT=b.dataset.tab; renderNav(); renderMain(); }));
}

function renderMain(){
  const main = document.getElementById('main');
  const renderers = {
    dashboard: pageDashboard, aup: pageAUP, usecases: ()=>pageRegister('usecases'),
    riskreg: ()=>pageRegister('risks'), assessments: pageAssessments, vendors: pageVendors,
    supplierrisk: pageSupplierRisk, incidents: pageIncidents, raci: pageRACI, tor: pageTOR, staff: pageStaff,
    'm-team': ()=>pageStash('pane-team'), 'm-course': ()=>pageStash('pane-course'), 'm-templates': ()=>pageStash('pane-templates'), 'm-updates': ()=>pageStash('pane-updates')
  };
  main.innerHTML = '';
  (renderers[CURRENT] || pageDashboard)();
}

/* Exceptions, not counts. "1 use case logged" is a fact about the database;
   "1 use case has no assessment" is a job. Everything here is derived from data
   already stored, and each item links to the screen that clears it. */
function overdue(dateStr){
  if(!dateStr) return false;
  return dateStr < todayISO();
}
function attentionItems(){
  const out = [];
  const push = (sev, text, tab) => out.push({sev, text, tab});

  DB.usecases.filter(u=>!assessmentsFor(u).length).forEach(u=>
    push('high', `<b>${esc(u.name||u.id)}</b> has no risk assessment`, 'assessments'));

  DB.risks.filter(r=>r.status!=='Complete' && overdue(r.dueDate)).forEach(r=>
    push('high', `Mitigation overdue since ${esc(r.dueDate)}: <b>${esc(r.description||r.id)}</b>`, 'riskreg'));

  DB.assessments.filter(a=>overdue(a.reviewDate)).forEach(a=>
    push('med', `Assessment <b>${esc(a.id)}</b> was due for review on ${esc(a.reviewDate)}`, 'assessments'));

  DB.assessments.filter(a=>(a.decision||'').toLowerCase().includes('condition') && !(a.conditions||'').trim()).forEach(a=>
    push('med', `Assessment <b>${esc(a.id)}</b> was approved with conditions, but none are recorded`, 'assessments'));

  DB.supplierRisk.filter(sr=>overdue(sr.reassessBy)).forEach(sr=>
    push('med', `Vendor <b>${esc(vendorLabel(sr.vendorId, sr.supplier))}</b> was due re-assessment on ${esc(sr.reassessBy)}`, 'supplierrisk'));

  DB.vendors.filter(v=>!scoresFor(v).length && (v.checklist||[]).filter(Boolean).length === VENDOR_MUST_QUESTIONS.length).forEach(v=>
    push('med', `<b>${esc(v.name||v.id)}</b> finished diligence but has no risk score`, 'supplierrisk'));

  DB.incidents.filter(i=>i.status!=='Closed').forEach(i=>
    push('high', `Incident <b>${esc(i.id)}</b> is still open`, 'incidents'));

  if(DB.aupStatus.published){
    const acked = new Set(DB.acks.filter(a=>a.version===DB.aupStatus.version).map(a=>a.staffId));
    const waiting = DB.staff.filter(st=>!acked.has(st.id)).length;
    if(waiting) push('med', `${waiting} member(s) of staff have not acknowledged policy v${esc(DB.aupStatus.version)}`, 'staff');
  } else {
    push('high', 'The Acceptable Use Policy has not been published to staff', 'aup');
  }

  if(!DB.tor.approvedBy) push('low', 'Steering Group terms of reference are not approved', 'tor');

  const order = {high:0, med:1, low:2};
  return out.sort((a,b)=>order[a.sev]-order[b.sev]);
}

/* ============================= DASHBOARD ============================= */
function pageDashboard(){
  const main = document.getElementById('main');
  const ackCount = DB.acks.filter(a=>a.version===DB.aupStatus.version).length;
  const staffCount = DB.staff.length || 0;
  const ackPct = staffCount ? Math.round(100*ackCount/staffCount) : 0;
  const highRisks = DB.risks.filter(r=>computeRiskRating(r)==='High'||computeRiskRating(r)==='Critical').length;
  const openIncidents = DB.incidents.filter(i=>i.status!=='Closed').length;
  const vendorsAssessed = DB.supplierRisk.length;
  const ucHigh = DB.usecases.filter(u=>u.risk==='High').length;

  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Attest AI Platform</div>
      <h2>${esc(DB.org.companyName)}, AI Governance Dashboard</h2>
      <p>Live status across your governance documents, registers and staff sign-off, tracked in one place.</p></div>
      <div class="actions"><button class="btn gold" data-act="setTab" data-a1="aup">Open Acceptable Use Policy →</button></div>
    </div>

    ${(()=>{ const items = attentionItems();
      if(!items.length) return `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--teal);">
        <h3 style="margin:0 0 4px;">Nothing outstanding</h3>
        <p style="color:var(--ink-soft);margin:0;">Every use case is assessed, no mitigation or review is overdue, and staff sign-off is up to date.</p></div>`;
      const dot = sev => sev==='high' ? 'var(--rose)' : sev==='med' ? 'var(--amber)' : 'var(--ink-soft)';
      return `<div class="card" style="margin-bottom:20px;border-left:3px solid ${dot(items[0].sev)};">
        <h3 style="margin:0 0 10px;">Needs attention <span class="badge neutral">${items.length}</span></h3>
        <div class="tbl-wrap"><table>
          ${items.map(i=>`<tr>
            <td style="width:10px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dot(i.sev)};"></span></td>
            <td>${i.text}</td>
            <td style="width:1%;white-space:nowrap;"><button class="btn ghost sm" data-act="setTab" data-a1="${i.tab}">Open</button></td>
          </tr>`).join('')}
        </table></div></div>`; })()}

    <div class="grid cols-4" style="margin-bottom:20px;">
      <div class="stat"><div class="v">${DB.aupStatus.published?'Published':'Draft'}</div><div class="l">Policy status (v${esc(DB.aupStatus.version)})</div></div>
      <div class="stat"><div class="v">${ackPct}%</div><div class="l">${ackCount} of ${staffCount} staff acknowledged</div>
        <div class="bar"><i style="width:${ackPct}%"></i></div></div>
      <div class="stat"><div class="v" style="color:${highRisks?'var(--rose)':'var(--navy)'}">${highRisks}</div><div class="l">High / critical open risks</div></div>
      <div class="stat"><div class="v" style="color:${openIncidents?'var(--amber)':'var(--navy)'}">${openIncidents}</div><div class="l">Open incidents</div></div>
    </div>

    <div class="grid cols-3">
      <div class="card">
        <h3>Use Case Register</h3>
        <p style="color:var(--ink-soft);margin:0 0 10px;">${DB.usecases.length} use case(s) logged · ${ucHigh} rated High risk</p>
        <button class="btn ghost sm" data-act="setTab" data-a1="usecases">Open register</button>
      </div>
      <div class="card">
        <h3>Vendor diligence</h3>
        <p style="color:var(--ink-soft);margin:0 0 10px;">${DB.vendors.length} vendor(s) tracked · ${vendorsAssessed} risk-scored</p>
        <button class="btn ghost sm" data-act="setTab" data-a1="vendors">Open vendors</button>
      </div>
      <div class="card">
        <h3>Steering group</h3>
        <p style="color:var(--ink-soft);margin:0 0 10px;">${DB.raci.cols.length} roles defined · ToR ${DB.tor.approvedBy?'approved':'not yet approved'}</p>
        <button class="btn ghost sm" data-act="setTab" data-a1="raci">Open RACI</button>
      </div>
    </div>

    <div class="card">
      <h3>Document pack, completion at a glance</h3>
      <div class="tbl-wrap"><table>
        <tr><th>Document</th><th>Status</th><th></th></tr>
        ${[
          ['Acceptable Use Policy', DB.aupStatus.published?'<span class="badge active">Published</span>':'<span class="badge pending">Draft</span>', 'aup'],
          ['AI Use Case Register', DB.usecases.length?`<span class="badge active">${DB.usecases.length} entr${DB.usecases.length===1?'y':'ies'}</span>`:'<span class="badge neutral">Empty</span>', 'usecases'],
          ['AI Risk Assessments', DB.assessments.length?`<span class="badge active">${DB.assessments.length} entr${DB.assessments.length===1?'y':'ies'}</span>`:'<span class="badge neutral">Empty</span>', 'assessments'],
          ['AI Risk Register', DB.risks.length?`<span class="badge active">${DB.risks.length} entr${DB.risks.length===1?'y':'ies'}</span>`:'<span class="badge neutral">Empty</span>', 'riskreg'],
          ['Incident Forms', DB.incidents.length?`<span class="badge active">${DB.incidents.length} on file</span>`:'<span class="badge neutral">None logged</span>', 'incidents'],
          ['Governance Roles Matrix', '<span class="badge active">Configured</span>', 'raci'],
          ['Steering Group ToR', DB.tor.approvedBy?'<span class="badge active">Approved</span>':'<span class="badge pending">Draft</span>', 'tor'],
          ['Vendor Due Diligence', DB.vendors.length?`<span class="badge active">${DB.vendors.length} vendor${DB.vendors.length===1?'':'s'}</span>`:'<span class="badge neutral">Empty</span>', 'vendors'],
          ['Vendor Risk Score', DB.supplierRisk.length?`<span class="badge active">${DB.supplierRisk.length} scored</span>`:'<span class="badge neutral">Empty</span>', 'supplierrisk'],
        ].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><button class="btn ghost sm" data-act="setTab" data-a1="${r[2]}">Open</button></td></tr>`).join('')}
      </table></div>
    </div>
  `;
}
function setTab(t){ CURRENT=t; renderNav(); renderMain(); }

/* ============================= AUP ============================= */
function pageAUP(){
  const o = DB.org, st = DB.aupStatus;
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Policy</div><h2>AI Acceptable Use Policy</h2>
      <p>Edit the fields below, they fill the policy automatically. Publish it, then send it to staff for sign-off from the Staff tab.</p></div>
      <div class="actions">
        <button class="btn ghost" data-act="print">Print / Save PDF</button>
        <button class="btn ${st.published?'ghost':'gold'}" id="publishBtn">${st.published?'Unpublish':'Publish to staff'}</button>
      </div>
    </div>
    <div class="statusbar ${st.published && !hasUnpublishedChanges() ? 'ok' : 'draft'}">
      <div class="sb-main">
        <b>${st.published
          ? `Published as version ${esc(st.version)}`
          : `Draft, version ${esc(st.draftVersion)}`}</b>
        <span>${st.published
          ? `on ${fmtDate(st.publishedDate)}${hasUnpublishedChanges()?`, staff are still on v${esc(st.version)}`:', staff can acknowledge it'}`
          : 'not yet sent to staff'}</span>
      </div>
      ${hasUnpublishedChanges()
        ? `<div class="sb-note"><b>Unpublished changes.</b> Publishing makes v${esc(st.draftVersion)} live and asks everyone to acknowledge again.</div>`
        : `<div class="sb-note">Every save increments the draft version. Publishing makes it live and asks staff to acknowledge.</div>`}
    </div>

    <div class="aup-layout">
      <div class="card">
        <h3>Policy fields</h3>
        <p style="color:var(--ink-soft);font-size:12.5px;margin:0 0 14px;">Each field fills the numbered section it names in the policy below. Sections not listed here are standard wording that applies to every organisation.</p>

        <div class="secgrp"><span class="secnum">Header</span>
        <div class="field-row">
          <div><label>Company name</label><input id="f_companyName" type="text" value="${esc(fieldVal(o.companyName))}" placeholder="Your company name"></div>
          <div><label>Effective date</label><input id="f_effectiveDate" type="date" value="${esc(o.effectiveDate)}"></div>
        </div>
        <div class="field-row">
          <div><label>Policy owner (role)</label><input id="f_owner" type="text" value="${esc(fieldVal(o.owner))}" placeholder="Role, e.g. DPO / CISO / Head of IT"></div>
          <div><label>DPO / contact name</label><input id="f_dpoName" type="text" value="${esc(fieldVal(o.dpoName))}" placeholder="Name of your DPO or data contact"></div>
        </div>
        <p class="sechint">Fills sections 1 and 2, the policy title, and the names used in sections 3, 9 and 12.</p></div>

        <div class="secgrp"><span class="secnum">Section 3</span>
        <label>Approved tools (one per line)</label><textarea id="f_approvedTools" rows="4">${esc(o.approvedTools)}</textarea></div>

        <div class="secgrp"><span class="secnum">Section 4</span>
        <label>Permitted uses</label><textarea id="f_permittedUses" rows="3">${esc(sec(o,'permittedUses'))}</textarea></div>

        <div class="secgrp"><span class="secnum">Section 5</span>
        <label>Forbidden inputs</label><textarea id="f_forbiddenInputs" rows="4">${esc(sec(o,'forbiddenInputs'))}</textarea></div>

        <div class="secgrp"><span class="secnum">Section 6</span>
        <label>Output handling</label><textarea id="f_outputHandling" rows="3">${esc(sec(o,'outputHandling'))}</textarea></div>

        <div class="secgrp"><span class="secnum">Section 7</span>
        <label>AI use log location</label><input id="f_logLocation" type="text" value="${esc(o.logLocation)}"></div>

        <div class="secgrp"><span class="secnum">Section 8</span>
        <label>Settings and configuration</label><textarea id="f_settingsConfig" rows="3">${esc(sec(o,'settingsConfig'))}</textarea></div>

        <div class="secgrp"><span class="secnum">Section 9</span>
        <label>Vendor changes</label><textarea id="f_vendorChanges" rows="3">${esc(fieldVal(o.vendorChanges) || AUP_SECTION_DEFAULTS.vendorChanges)}</textarea>
        <p class="sechint">Write <code>{DPO}</code> to insert the DPO / contact name from the header.</p></div>

        <div class="secgrp"><span class="secnum">Section 10</span>
        <label>Incident contact</label><input id="f_incidentContact" type="text" value="${esc(o.incidentContact)}"></div>

        <div class="secgrp"><span class="secnum">Section 11</span>
        <label>Training reference</label><input id="f_trainingRef" type="text" value="${esc(o.trainingRef)}"></div>

        <div class="secgrp"><span class="secnum">Section 12</span>
        <label>Roles and responsibilities</label><textarea id="f_rolesResponsibilities" rows="3">${esc(fieldVal(o.rolesResponsibilities) || AUP_SECTION_DEFAULTS.rolesResponsibilities)}</textarea>
        <p class="sechint">Write <code>{DPO}</code> to insert the DPO / contact name from the header.</p></div>

        <div class="secgrp"><span class="secnum">Section 13</span>
        <label>Consequences of non-compliance</label><textarea id="f_consequences" rows="3">${esc(sec(o,'consequences'))}</textarea></div>

        <button class="btn" id="saveOrgBtn">Save &amp; regenerate</button>
      </div>
    </div>
    <div id="aupDoc"></div>
  `;
  document.getElementById('saveOrgBtn').onclick = saveOrgFields;
  document.getElementById('publishBtn').onclick = togglePublish;
  renderAupDoc();
}
async function saveOrgFields(){
  DB.org = {
    companyName: val('f_companyName'), effectiveDate: val('f_effectiveDate'), owner: val('f_owner'),
    dpoName: val('f_dpoName'), incidentContact: val('f_incidentContact'), trainingRef: val('f_trainingRef'),
    logLocation: val('f_logLocation'), approvedTools: val('f_approvedTools'),
    permittedUses: val('f_permittedUses'), forbiddenInputs: val('f_forbiddenInputs'),
    outputHandling: val('f_outputHandling'), settingsConfig: val('f_settingsConfig'),
    consequences: val('f_consequences'), vendorChanges: val('f_vendorChanges'),
    rolesResponsibilities: val('f_rolesResponsibilities')
  };
  await dbSet('org-config', DB.org);
  DB.aupStatus.draftVersion = bumpVersion(DB.aupStatus.draftVersion);
  await dbSet('aup-status', DB.aupStatus);
  pageAUP();
  toast(DB.aupStatus.published
    ? `Saved as draft v${DB.aupStatus.draftVersion}, publish to send it to staff`
    : `Saved as v${DB.aupStatus.draftVersion}`);
}
/* Editing bumps the DRAFT version, never the published one: a typo fix must not
   silently invalidate every staff acknowledgement. Publishing promotes the draft,
   and because acknowledgements are keyed to the version they were given against,
   that is what makes staff re-acknowledge. */
function bumpVersion(v){
  const m = String(v||'1.0').match(/^(\d+)\.(\d+)$/);
  if(!m) return '1.1';
  return `${m[1]}.${+m[2]+1}`;
}
function hasUnpublishedChanges(){
  const st = DB.aupStatus;
  return !!st.published && st.draftVersion !== st.version;
}
/* What the document header should show. */
function displayVersion(){
  const st = DB.aupStatus;
  return (!st.published || hasUnpublishedChanges()) ? st.draftVersion : st.version;
}

function val(id){ return document.getElementById(id).value; }
async function togglePublish(){
  if(DB.aupStatus.published){
    DB.aupStatus.published=false;
  } else {
    DB.aupStatus.published=true;
    DB.aupStatus.version = DB.aupStatus.draftVersion;   // promote; older acks stop counting
    DB.aupStatus.publishedDate = todayISO();
  }
  await dbSet('aup-status', DB.aupStatus);
  pageAUP();
  toast(DB.aupStatus.published ? `Published as v${DB.aupStatus.version}, staff can now acknowledge it` : 'Policy unpublished');
}
function renderAupDoc(){
  const o = DB.org;
  const tools = o.approvedTools.split('\n').filter(Boolean).map(t=>`<li>${esc(t)}</li>`).join('');
  document.getElementById('aupDoc').innerHTML = `
  <div class="doc">
    <h2>Acceptable Use of AI Tools at ${esc(docVal(o.companyName,'[Company Name]'))}</h2>
    <div class="meta"><b>Effective:</b> ${fmtDate(o.effectiveDate)} · <b>Version:</b> ${esc(displayVersion())}${hasUnpublishedChanges()||!DB.aupStatus.published?' (draft)':''} · <b>Owner:</b> ${esc(docVal(o.owner,'[Policy owner role]'))} · <b>Review cycle:</b> Quarterly</div>
    <h4>1. Purpose</h4><p>This policy describes how staff at ${esc(docVal(o.companyName,'[Company Name]'))} may use generative AI tools (such as ChatGPT, Microsoft Copilot, Claude, Gemini, Perplexity, or any other AI assistant) in the course of their work, setting out what is encouraged, what is permitted with conditions, and what is forbidden.</p>
    <h4>2. Scope</h4><p>Applies to all employees, contractors, interns and consultants performing work for ${esc(docVal(o.companyName,'[Company Name]'))}, on company-owned and personal devices used for work, covering all AI tools whether procured by the company or used personally.</p>
    <h4>3. Approved tools</h4><ul>${tools || '<li class="fill">No approved tools listed yet</li>'}</ul>
    <p>Other tools require explicit approval from ${esc(docVal(o.owner,'[Policy owner role]'))} before use. Free or personal-tier consumer AI tools are <b>not approved</b> for the data categories in Section 5.</p>
    <h4>4. Permitted uses</h4><p>${esc(sec(o,'permittedUses'))}</p>
    <h4>5. Forbidden inputs</h4><p>${esc(sec(o,'forbiddenInputs'))}</p>
    <h4>6. Output handling</h4><p>${esc(sec(o,'outputHandling'))}</p>
    <h4>7. Logging</h4><p>Significant AI-assisted work is logged in: <b>${esc(o.logLocation)}</b>. "Significant" means the use affected another person, represented the company externally, touched sensitive data, or supported an irreversible/expensive decision.</p>
    <h4>8. Settings and configuration</h4><p>${esc(sec(o,'settingsConfig'))}</p>
    <h4>9. Vendor changes</h4><p>${esc(sec(o,'vendorChanges'))}</p>
    <h4>10. Incidents</h4><p>Report within the hour to <b>${esc(o.incidentContact)}</b>: data pasted into the wrong tool, harmful AI output, an AI-powered scam, or a vendor security incident. Do not delete the evidence.</p>
    <h4>11. Training</h4><p>All staff complete ${esc(o.trainingRef)} within thirty days of joining and refresh annually.</p>
    <h4>12. Roles and responsibilities</h4><p>${esc(sec(o,'rolesResponsibilities'))}</p>
    <h4>13. Consequences of non-compliance</h4><p>${esc(sec(o,'consequences'))}</p>
    <h4>14. Standards referenced</h4><p>EU AI Act (Regulation (EU) 2024/1689) Art 4, 26 &amp; 50 · UK GDPR / EU GDPR Art 5, 6, 9, 22, 28, 32&ndash;35 (and the Data Protection Act 2018 in the UK) · ISO/IEC 42001:2023 Cl 5.2, 5.3, 7.2&ndash;7.3, Annex A.2 · ISO/IEC 27001:2022 A.5.10, A.5.13, A.5.19&ndash;A.5.21, A.5.23, A.5.34, A.6.3, A.8.12.</p>
    <div class="field-row" style="margin-top:24px;border-top:1px solid var(--line);padding-top:16px;">
      <div><b>Approved by</b><br>${esc(docVal(o.owner,'[Policy owner role]'))}</div>
      <div><b>Next review</b><br>${fmtDate(addMonths(o.effectiveDate,3))}</div>
    </div>
  </div>`;
}
function addMonths(dateStr, n){ const d = new Date(dateStr || todayISO()); d.setMonth(d.getMonth()+n); return d.toISOString().slice(0,10); }

/* ============================= GENERIC REGISTER (Use Cases / Risks) ============================= */
const REGISTER_SCHEMAS = {
  usecases: {
    title:'AI Use Case Register', idPrefix:'UC', desc:'Every approved AI use case: owner, data touched, risk tier and impact-assessment status.',
    cols:[
      {key:'name',label:'Use case name',type:'text'},
      {key:'purpose',label:'Purpose (one sentence)',type:'textarea'},
      {key:'tool',label:'AI tool(s) used',type:'text'},
      {key:'dataCategories',label:'Input data categories',type:'select',options:['Public data','Internal non-sensitive','Confidential business','Personal data (general)','Special-category data']},
      {key:'owner',label:'Use case owner',type:'text'},
      {key:'dpia',label:'DPIA required',type:'select',options:['Yes','No','Pending']},
      {key:'fria',label:'FRIA required',type:'select',options:['Yes','No','Pending']},
      {key:'risk',label:'Risk rating',type:'select',options:['Low','Medium','High']},
      {key:'status',label:'Status',type:'select',options:['Active','Paused','Discontinued']},
      {key:'notes',label:'Notes',type:'textarea'}
    ],
    listCols:['name','owner','dataCategories','dpia','fria','risk','assessed','status']
  },
  risks: {
    title:'AI Risk Register', idPrefix:'R', desc:'AI-specific risks: data leakage, hallucination, bias, vendor and compliance risk, with owners and mitigation.',
    cols:[
      // status first: it is the field you come back to change most often
      {key:'status',label:'Status',type:'select',options:['Open','In progress','Complete','Deferred']},
      {key:'category',label:'Risk category',type:'select',options:['Data leakage','Hallucination','Bias','Vendor risk','Compliance gap','Shadow AI','Operational']},
      {key:'relatedUseCase',label:'Related use case (optional)',type:'usecase'},
      {key:'description',label:'Risk description (be specific)',type:'textarea'},
      {key:'currentControls',label:'Current controls',type:'textarea'},
      {key:'likelihood',label:'Likelihood',type:'select',options:['Very low','Low','Medium','High']},
      {key:'impact',label:'Impact',type:'select',options:['Low','Medium','High','Critical']},
      {key:'owner',label:'Risk owner (named person)',type:'text'},
      {key:'mitigation',label:'Mitigation action',type:'textarea'},
      {key:'dueDate',label:'Mitigation due date',type:'date'}
    ],
    listCols:['description','category','relatedUseCase','likelihood','impact','rating','owner','status']
  }
};
/* Use-case linkage. Assessments and risks store the use case's ID, so the link
   survives a rename. Records created before the ID existed fall back to matching
   on the name they copied at the time. */
function vendorById(id){ return id ? DB.vendors.find(v=>v.id===id) : null; }
function vendorLabel(id, fallbackName){ const v = vendorById(id); return v ? v.name : (fallbackName || ''); }
function resolveVendorId(name){
  if(!name) return '';
  const hit = DB.vendors.find(v => (v.name||'').trim().toLowerCase() === name.trim().toLowerCase());
  return hit ? hit.id : '';
}
function scoresFor(vendor){
  return DB.supplierRisk.filter(sr =>
    sr.vendorId ? sr.vendorId === vendor.id
                : (sr.supplier && vendor.name && sr.supplier.trim().toLowerCase() === vendor.name.trim().toLowerCase()));
}
function ucById(id){ return id ? DB.usecases.find(u=>u.id===id) : null; }
function ucLabel(id, fallbackName){
  const u = ucById(id);
  return u ? u.name : (fallbackName || '');
}
/* The assessment is the evidence, so it owns the rating. Bands follow the guide
   printed on the assessment form: 1-6 low, 8-12 medium, 15-25 high. */
function assessmentTopScore(a){
  return Math.max(0, ...(a.risks||[]).map(r=>(+clampScore(r.l)||0)*(+clampScore(r.i)||0)));
}
function ratingFromScore(top){
  if(!top) return '';
  return top >= 15 ? 'High' : top >= 8 ? 'Medium' : 'Low';
}
/* The rating a use case's assessments justify, or '' when none scored yet.
   Worst case wins: two assessments, one High, the use case is High. */
function derivedRating(uc){
  const tops = assessmentsFor(uc).map(assessmentTopScore).filter(Boolean);
  return tops.length ? ratingFromScore(Math.max(...tops)) : '';
}
/* Push the derived rating onto any use case an assessment covers. Returns true
   if something actually changed, so the caller only writes when it must. */
async function syncUseCaseRatings(){
  let changed = false;
  DB.usecases.forEach(uc=>{
    const d = derivedRating(uc);
    if(d && uc.risk !== d){ uc.risk = d; changed = true; }
  });
  if(changed) await dbSet('usecases', DB.usecases);
  return changed;
}

function assessmentsFor(uc){
  return DB.assessments.filter(a =>
    a.useCaseId ? a.useCaseId === uc.id
                : (a.useCase && uc.name && a.useCase.trim().toLowerCase() === uc.name.trim().toLowerCase()));
}
function resolveUseCaseId(name){
  if(!name) return '';
  const hit = DB.usecases.find(u => (u.name||'').trim().toLowerCase() === name.trim().toLowerCase());
  return hit ? hit.id : '';
}

/* HTML min/max only constrain the spinner arrows, not typing, so a 1-5 score
   field will happily accept 12 and multiply it. Every score entry point clamps
   through here, on commit and again on save. Blank stays blank: unscored is a
   real state and must not silently become 1. */
function clampScore(v){
  if(v===''||v==null) return '';
  const n = Math.round(Number(v));
  if(!Number.isFinite(n)) return '';
  return String(Math.min(5, Math.max(1, n)));
}
function bindScoreClamp(el, after){
  if(!el) return;
  el.addEventListener('change', ()=>{ el.value = clampScore(el.value); if(after) after(); });
}

function computeRiskRating(r){ return (RISK_MATRIX[r.likelihood]||{})[r.impact] || '-'; }

function pageRegister(key){
  const schema = REGISTER_SCHEMAS[key];
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Register</div><h2>${schema.title}</h2><p>${schema.desc}</p></div>
      <div class="actions"><button class="btn ghost" data-act="print">Print / Export</button>
      <button class="btn gold" id="addBtn">+ Add entry</button></div>
    </div>
    <div class="card"><div class="toolbar">
        <div class="search"><input id="searchBox" type="text" placeholder="Search ${schema.title.toLowerCase()}…" style="margin:0;"></div>
        <div id="regCount" style="color:var(--ink-soft);font-size:12.5px;"></div>
      </div>
      <div id="regTableWrap"></div>
    </div>`;
  document.getElementById('addBtn').onclick = ()=>openRegisterModal(key, null);
  document.getElementById('searchBox').addEventListener('input', e=>renderRegisterTable(key, e.target.value));
  renderRegisterTable(key, '');
}
function renderRegisterTable(key, q){
  const schema = REGISTER_SCHEMAS[key];
  const rows = DB[key].filter(r => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  const wrap = document.getElementById('regTableWrap');
  // count lives here, not in the page shell: the shell renders once but this
  // runs on every add/edit/delete/search, so the number stays true
  const countEl = document.getElementById('regCount');
  if(countEl){
    const total = DB[key].length;
    countEl.textContent = q
      ? `${rows.length} of ${total} entr${total===1?'y':'ies'}`
      : `${total} entr${total===1?'y':'ies'}`;
  }
  if(!rows.length){ wrap.innerHTML = q
    ? `<div class="empty"><b>No matches</b>Nothing in this register matches "${esc(q)}".</div>`
    : `<div class="empty"><b>No entries yet</b>Add your first one to start the register.</div>`; return; }
  const cols = schema.listCols;
  wrap.innerHTML = `<div class="tbl-wrap"><table>
    <tr><th class="mono">ID</th>${cols.map(c=>`<th>${labelFor(schema,c)}</th>`).join('')}<th></th></tr>
    ${rows.map(r=>`<tr>
      <td class="mono">${esc(r.id)}</td>
      ${cols.map(c=>`<td>${renderCell(c, r)}</td>`).join('')}
      <td style="white-space:nowrap;">
        <button class="iconbtn" data-act="openRegisterModal" data-a1="${key}" data-a2="${r.id}">Edit</button>
        <button class="iconbtn" data-act="deleteRegisterRow" data-a1="${key}" data-a2="${r.id}">Delete</button>
      </td>
    </tr>`).join('')}
  </table></div>`;
}
function labelFor(schema,key){ if(key==='rating') return 'Rating'; if(key==='assessed') return 'Assessment'; const c = schema.cols.find(c=>c.key===key); return c?c.label.split('(')[0].trim():key; }
function renderCell(c, r){
  if(c==='rating'){ const rt = computeRiskRating(r); return `<span class="badge ${rt.toLowerCase()}">${rt}</span>`; }
  if(c==='risk'){
    const d = derivedRating(r);
    if(!d) return `<span class="badge neutral" title="No assessment has scored this yet">${esc(r.risk||'Not rated')}</span>`;
    return `<span class="badge ${d.toLowerCase()}">${esc(d)}</span> <span class="mono" style="font-size:11px;color:var(--ink-soft);" title="Set by the risk assessment, not entered by hand">from assessment</span>`;
  }
  if(c==='assessed'){
    const list = assessmentsFor(r);
    if(!list.length) return `<span class="badge neutral">Not assessed</span>`;
    const latest = list[list.length-1];
    return `<span class="badge active">Assessed</span> <span class="mono" style="font-size:11px;color:var(--ink-soft);">${esc(latest.id)}</span>`;
  }
  if(c==='relatedUseCase'){
    if(!r.relatedUseCase) return '<span style="color:var(--ink-soft);">-</span>';
    const u = ucById(r.relatedUseCase);
    return u ? `${esc(u.name)} <span class="mono" style="font-size:11px;color:var(--ink-soft);">${esc(u.id)}</span>`
             : `<span class="badge neutral">Deleted use case</span>`;
  }
  const v = r[c];
  if(['risk','dpia','fria','status','likelihood','impact'].includes(c) && v){
    const cls = String(v).toLowerCase().replace(/\s+/g,'');
    return `<span class="badge ${cls}">${esc(v)}</span>`;
  }
  if(!v) return '<span style="color:var(--ink-soft);">-</span>';
  return esc(String(v)).length>80 ? esc(String(v)).slice(0,80)+'…' : esc(v);
}
async function deleteRegisterRow(key, id){
  if(!confirm('Delete this entry? This cannot be undone.')) return;
  DB[key] = DB[key].filter(r=>r.id!==id);
  await dbSet(key, DB[key]);
  renderRegisterTable(key, document.getElementById('searchBox')?.value||'');
  renderNav();
  toast('Entry deleted');
}
function openRegisterModal(key, id){
  const schema = REGISTER_SCHEMAS[key];
  const existing = id ? DB[key].find(r=>r.id===id) : null;
  const data = existing || {id: uid(schema.idPrefix)};
  const derived = key==='usecases' ? derivedRating(data) : '';
  showModal(`${existing?'Edit':'New'} ${schema.title} entry`, `
    <div id="modalFields">
      ${schema.cols.map(c=>fieldHTML(c, data[c.key])).join('')}
    </div>
    ${derived ? `<p style="font-size:11.5px;color:var(--ink-soft);margin:8px 0 0;">Risk rating is set to <b>${esc(derived)}</b> by this use case's risk assessment and will be kept in step with it. Change the scores in the assessment to change the rating.</p>` : ''}
  `, async ()=>{
    schema.cols.forEach(c=>{ const el = document.getElementById('mf_'+c.key); if(el && !el.disabled) data[c.key] = el.value; });
    if(!existing) DB[key].push(data);
    else Object.assign(existing, data);
    await dbSet(key, DB[key]);
    closeModal(); renderRegisterTable(key, ''); renderNav();
    toast('Saved');
  });
  if(derived){ const el = document.getElementById('mf_risk'); if(el){ el.value = derived; el.disabled = true; } }
}
function fieldHTML(c, value){
  value = value==null?'':value;
  if(c.type==='usecase'){
    // stores the use case ID, not its name, so the link survives a rename
    const opts = DB.usecases.map(u=>`<option value="${esc(u.id)}" ${u.id===value?'selected':''}>${esc(u.name||u.id)}</option>`).join('');
    return `<label>${c.label}</label><select id="mf_${c.key}"><option value="">- none -</option>${opts}</select>`;
  }
  if(c.type==='select'){
    return `<label>${c.label}</label><select id="mf_${c.key}">${c.options.map(o=>`<option ${o===value?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  }
  if(c.type==='textarea'){
    return `<label>${c.label}</label><textarea id="mf_${c.key}">${esc(value)}</textarea>`;
  }
  return `<label>${c.label}</label><input id="mf_${c.key}" type="${c.type}" value="${esc(value)}">`;
}

/* ============================= MODAL ============================= */
function showModal(title, bodyHTML, onSave, wide){
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-bg" id="modalBg"><div class="modal" style="${wide?'max-width:880px;':''}">
    <h3>${title}</h3>${bodyHTML}
    <div class="modal-actions"><button class="btn ghost" id="modalCancel">Cancel</button><button class="btn gold" id="modalSave">Save</button></div>
  </div></div>`;
  /* A focused type=number input changes value when the wheel scrolls over it,
     which on a trackpad means a stray two-finger scroll silently rewrites a
     score. Numbers must only change when someone types or uses the arrow keys. */
  root.querySelectorAll('input[type="number"]').forEach(el=>{
    el.addEventListener('wheel', e=>{ if(document.activeElement===el) e.preventDefault(); }, {passive:false});
  });
  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('modalBg').addEventListener('click', e=>{ if(e.target.id==='modalBg') closeModal(); });
  document.getElementById('modalSave').onclick = onSave;
}
function closeModal(){ document.getElementById('modal-root').innerHTML=''; }

/* ============================= RISK ASSESSMENTS ============================= */
function pageAssessments(){
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Assessment</div><h2>AI Risk Assessments</h2><p>One assessment per AI use case: tier, scored risks, mitigations, and a decision. File each against an entry in the Use Case Register.</p></div>
      <div class="actions"><button class="btn gold" id="addAssess">+ New assessment</button></div>
    </div>
    <div class="card"><div id="assessList"></div></div>
  `;
  document.getElementById('addAssess').onclick = ()=>openAssessmentModal(null);
  renderAssessList();
}
function renderAssessList(){
  const wrap = document.getElementById('assessList');
  if(!DB.assessments.length){ wrap.innerHTML = `<div class="empty"><b>No assessments yet</b>Run one for each use case before approving it.</div>`; return; }
  wrap.innerHTML = `<div class="tbl-wrap"><table>
    <tr><th class="mono">ID</th><th>Use case</th><th>Tier</th><th>Top score</th><th>Decision</th><th></th></tr>
    ${DB.assessments.map(a=>{
      const top = Math.max(0, ...a.risks.map(r=>(+r.l||0)*(+r.i||0)));
      return `<tr>
        <td class="mono">${esc(a.id)}</td>
        <td>${esc(ucLabel(a.useCaseId, a.useCase))}${
            !a.useCaseId ? ` <span class="badge neutral" title="Not linked to an entry in the Use Case Register">Unlinked</span>`
          : !ucById(a.useCaseId) ? ` <span class="badge neutral" title="The use case this was filed against has been deleted">Deleted use case</span>`
          : ` <span class="mono" style="font-size:11px;color:var(--ink-soft);">${esc(a.useCaseId)}</span>`}</td>
        <td><span class="badge neutral">${esc(a.tier||'-')}</span></td>
        <td>${top || '-'} ${top? `<span class="badge ${top>=15?'high':top>=8?'medium':'low'}">${top>=15?'High':top>=8?'Medium':'Low'}</span>`:''}</td>
        <td>${a.decision?`<span class="badge ${a.decision.toLowerCase().includes('reject')?'reject':a.decision.toLowerCase().includes('condition')?'conditions':'approve'}">${esc(a.decision)}</span>`:'-'}</td>
        <td style="white-space:nowrap;"><button class="iconbtn" data-act="openAssessmentModal" data-a1="${a.id}">Edit</button>
        <button class="iconbtn" data-act="deleteAssessment" data-a1="${a.id}">Delete</button></td>
      </tr>`;
    }).join('')}
  </table></div>`;
}
async function deleteAssessment(id){
  if(!confirm('Delete this risk assessment?')) return;
  DB.assessments = DB.assessments.filter(a=>a.id!==id);
  await dbSet('assessments', DB.assessments); renderAssessList(); renderNav(); toast('Deleted');
}
function openAssessmentModal(id){
  const existing = id ? DB.assessments.find(a=>a.id===id) : null;
  const data = existing ? JSON.parse(JSON.stringify(existing)) : {
    id: uid('RA'), useCase:'', useCaseId:'', owner:'', date: todayISO(), dataInvolved:'', whoAffected:'',
    tier:'Minimal', risks: ASSESSMENT_RISK_ROWS.map(name=>({name,l:'',i:'',mitigation:'',mowner:''})),
    decision:'Approve', conditions:'', decidedBy:'', reviewDate:''
  };
  const ucOptions = DB.usecases.map(u=>u.name);
  showModal(`${existing?'Edit':'New'} Risk Assessment`, `
    <div class="field-row three">
      <div><label>Use case / tool</label>
        <input id="ra_useCase" list="ucList" value="${esc(ucLabel(data.useCaseId, data.useCase))}" placeholder="e.g. Drafting customer emails in Copilot">
        <p style="font-size:11px;color:var(--ink-soft);margin:4px 0 0;">Pick a registered use case to link this assessment to it. Free text is allowed for anything not yet in the register, but it will show as unlinked.</p>
        <datalist id="ucList">${ucOptions.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>
      </div>
      <div><label>Owner (name / role)</label><input id="ra_owner" type="text" value="${esc(data.owner)}"></div>
      <div><label>Decision</label><select id="ra_decision">${['Approve','Approve with conditions','Reject'].map(o=>`<option ${o===data.decision?'selected':''}>${o}</option>`).join('')}</select></div>
    </div>
    <div class="field-row three">
      <div><label>Assessment date</label><input id="ra_date" type="date" value="${esc(data.date)}"></div>
      <div><label>Data involved</label><input id="ra_dataInvolved" type="text" value="${esc(data.dataInvolved)}" placeholder="Personal / special category / confidential / none"></div>
      <div><label>Who is affected</label><input id="ra_whoAffected" type="text" value="${esc(data.whoAffected)}" placeholder="Staff / customers / public"></div>
    </div>
    <label>EU AI Act risk tier</label>
    <select id="ra_tier">${['Prohibited','High-risk','Limited (transparency)','Minimal'].map(o=>`<option ${o===data.tier?'selected':''}>${o}</option>`).join('')}</select>

    <label style="margin-top:6px;">Score the risks, Likelihood × Impact (1–5 each)</label>
    <div class="tbl-wrap"><table>
      <tr><th>Risk</th><th style="width:70px;">L (1-5)</th><th style="width:70px;">I (1-5)</th><th style="width:60px;">Score</th><th>Mitigation</th></tr>
      ${data.risks.map((r,idx)=>`<tr>
        <td style="font-size:12.5px;">${esc(r.name)}</td>
        <td><input id="ra_l_${idx}" type="number" min="1" max="5" step="1" inputmode="numeric" value="${esc(clampScore(r.l))}" style="margin:0;"></td>
        <td><input id="ra_i_${idx}" type="number" min="1" max="5" step="1" inputmode="numeric" value="${esc(clampScore(r.i))}" style="margin:0;"></td>
        <td class="mono" id="ra_score_${idx}">${(clampScore(r.l)&&clampScore(r.i))?clampScore(r.l)*clampScore(r.i):'–'}</td>
        <td><input id="ra_m_${idx}" type="text" value="${esc(r.mitigation)}" style="margin:0;" placeholder="What will you do about it"></td>
      </tr>`).join('')}
    </table></div>
    <p style="font-size:11.5px;color:var(--ink-soft);margin:6px 0 14px;">Rating guide: 1–6 low · 8–12 medium · 15–25 high.</p>

    <div class="field-row">
      <div><label>Decided by</label><input id="ra_decidedBy" type="text" value="${esc(data.decidedBy)}"></div>
      <div><label>Review date</label><input id="ra_reviewDate" type="date" value="${esc(data.reviewDate)}"></div>
    </div>
    <label>Conditions (if any)</label><textarea id="ra_conditions">${esc(data.conditions)}</textarea>
  `, async ()=>{
    data.useCase = val('ra_useCase');
    // resolve to the register entry so the link survives a later rename;
    // stays blank when the assessment covers something not yet registered
    data.useCaseId = resolveUseCaseId(data.useCase);
    data.owner = val('ra_owner'); data.date = val('ra_date');
    data.dataInvolved = val('ra_dataInvolved'); data.whoAffected = val('ra_whoAffected'); data.tier = val('ra_tier');
    data.risks = data.risks.map((r,idx)=>({ name:r.name, l: clampScore(document.getElementById('ra_l_'+idx).value), i: clampScore(document.getElementById('ra_i_'+idx).value), mitigation: document.getElementById('ra_m_'+idx).value }));
    data.decision = val('ra_decision'); data.decidedBy = val('ra_decidedBy'); data.reviewDate = val('ra_reviewDate'); data.conditions = val('ra_conditions');
    if(!existing) DB.assessments.push(data); else Object.assign(existing, data);
    await dbSet('assessments', DB.assessments);
    const rated = await syncUseCaseRatings();
    closeModal(); renderAssessList(); renderNav();
    toast(rated ? 'Assessment saved, use case rating updated' : 'Assessment saved');
  }, true);
  data.risks.forEach((r,idx)=>{
    const paint = ()=>{
      const l = +clampScore(document.getElementById('ra_l_'+idx).value) || 0;
      const i = +clampScore(document.getElementById('ra_i_'+idx).value) || 0;
      document.getElementById('ra_score_'+idx).textContent = (l&&i) ? l*i : '–';
    };
    ['ra_l_'+idx,'ra_i_'+idx].forEach(id=>{
      const el = document.getElementById(id);
      el.addEventListener('input', paint);   // preview as you type, from clamped values
      bindScoreClamp(el, paint);             // correct the field itself on commit
    });
  });
}

/* ============================= VENDORS ============================= */
function pageVendors(){
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Vendor diligence · step 1</div><h2>Vendor Due Diligence</h2><p>Track the must-answer questions for any AI vendor before procurement. 19 blocking questions, modelled on CSA CAIQ-AI.</p></div>
      <div class="actions"><button class="btn gold" id="addVendor">+ Add vendor</button></div>
    </div>
    <div class="card"><div id="vendorList"></div></div>
  `;
  document.getElementById('addVendor').onclick = ()=>openVendorModal(null);
  renderVendorList();
}
function renderVendorList(){
  const wrap = document.getElementById('vendorList');
  if(!DB.vendors.length){ wrap.innerHTML = `<div class="empty"><b>No vendors tracked yet</b>Add a vendor to start the diligence checklist.</div>`; return; }
  wrap.innerHTML = `<div class="tbl-wrap"><table>
    <tr><th>Vendor / product</th><th>Checklist progress</th><th>Status</th><th>Risk score</th><th></th></tr>
    ${DB.vendors.map(v=>{
      const done = (v.checklist||[]).filter(Boolean).length;
      const pct = Math.round(100*done/VENDOR_MUST_QUESTIONS.length);
      return `<tr><td><b>${esc(v.name)}</b><br><span style="color:var(--ink-soft);font-size:12px;">${esc(v.product||'')}</span></td>
      <td style="min-width:160px;">${done}/${VENDOR_MUST_QUESTIONS.length}<div class="bar"><i style="width:${pct}%;background:${pct===100?'var(--teal)':'var(--amber)'};"></i></div></td>
      <td><span class="badge ${pct===100?'active':'pending'}">${pct===100?'Diligence complete':'In progress'}</span></td>
      <td>${(()=>{ const sc = scoresFor(v); if(!sc.length) return '<span class="badge neutral">Not scored</span>';
        const latest = sc[sc.length-1];
        const d = latest.decision||'';
        const cls = d.toLowerCase().includes('reject')?'reject':d.toLowerCase().includes('condition')?'conditions':'approve';
        return `<span class="badge ${cls}">${esc(d||'Scored')}</span>`; })()}</td>
      <td style="white-space:nowrap;"><button class="iconbtn" data-act="openVendorModal" data-a1="${v.id}">Edit</button>
      <button class="iconbtn" data-act="deleteVendor" data-a1="${v.id}">Delete</button></td></tr>`;
    }).join('')}
  </table></div>`;
}
async function deleteVendor(id){
  if(!confirm('Delete this vendor record?')) return;
  DB.vendors = DB.vendors.filter(v=>v.id!==id);
  await dbSet('vendors', DB.vendors); renderVendorList(); renderNav(); toast('Deleted');
}
function openVendorModal(id){
  const existing = id ? DB.vendors.find(v=>v.id===id) : null;
  const data = existing ? JSON.parse(JSON.stringify(existing)) : {id: uid('V'), name:'', product:'', contact:'', checklist: VENDOR_MUST_QUESTIONS.map(()=>false), notes:''};
  showModal(`${existing?'Edit':'New'} Vendor`, `
    <div class="field-row">
      <div><label>Vendor name</label><input id="v_name" type="text" value="${esc(data.name)}"></div>
      <div><label>Product / tool</label><input id="v_product" type="text" value="${esc(data.product)}"></div>
    </div>
    <label>Vendor contact (name / email)</label><input id="v_contact" type="text" value="${esc(data.contact)}">
    <label>Diligence checklist, Must-answer questions</label>
    <div style="max-height:280px;overflow-y:auto;border:1px solid var(--line);border-radius:8px;padding:8px 12px;">
      ${VENDOR_MUST_QUESTIONS.map((q,idx)=>`<label style="display:flex;align-items:flex-start;gap:8px;text-transform:none;font-weight:400;font-size:13px;color:var(--ink);margin:7px 0;">
        <input type="checkbox" id="v_q_${idx}" ${data.checklist[idx]?'checked':''} style="width:auto;margin:2px 0 0;">
        <span>${esc(q)}</span></label>`).join('')}
    </div>
    <label style="margin-top:10px;">Notes</label><textarea id="v_notes">${esc(data.notes)}</textarea>
  `, async ()=>{
    data.name = val('v_name'); data.product = val('v_product'); data.contact = val('v_contact'); data.notes = val('v_notes');
    data.checklist = VENDOR_MUST_QUESTIONS.map((_,idx)=>document.getElementById('v_q_'+idx).checked);
    if(!existing) DB.vendors.push(data); else Object.assign(existing, data);
    await dbSet('vendors', DB.vendors);
    closeModal(); renderVendorList(); renderNav(); toast('Vendor saved');
  }, true);
}

/* ============================= SUPPLIER RISK SCORE ============================= */
function pageSupplierRisk(){
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Vendor diligence · step 2</div><h2>Vendor Risk Score</h2><p>Stage two of vendor diligence. Once the questionnaire in Vendor Due Diligence comes back, score the vendor across seven areas and record a go / no-go decision.</p></div>
      <div class="actions"><button class="btn gold" id="addSRA">+ New score</button></div>
    </div>
    <div class="card"><div id="sraList"></div></div>
  `;
  document.getElementById('addSRA').onclick = ()=>openSRAModal(null);
  renderSRAList();
}
function renderSRAList(){
  const wrap = document.getElementById('sraList');
  if(!DB.supplierRisk.length){ wrap.innerHTML = `<div class="empty"><b>No vendor scores yet</b>Score a vendor once their diligence questionnaire in Vendor Due Diligence is back.</div>`; return; }
  wrap.innerHTML = `<div class="tbl-wrap"><table>
    <tr><th>Vendor</th><th>Max score</th><th>Decision</th><th>Re-assess by</th><th></th></tr>
    ${DB.supplierRisk.map(s=>{
      const max = Math.max(0,...Object.values(s.scores||{}).map(Number));
      return `<tr><td>${esc(vendorLabel(s.vendorId, s.supplier))}${s.vendorId
        ? ` <span class="mono" style="font-size:11px;color:var(--ink-soft);">${esc(s.vendorId)}</span>`
        : ` <span class="badge neutral" title="Not linked to a vendor in Vendor Due Diligence">Unlinked</span>`}</td>
      <td><span class="badge ${max>=5?'high':max===4?'medium':'low'}">${max||'-'}/5</span></td>
      <td><span class="badge ${s.decision.toLowerCase().includes('reject')?'reject':s.decision.toLowerCase().includes('condition')?'conditions':'approve'}">${esc(s.decision)}</span></td>
      <td>${fmtDate(s.reassessBy)}</td>
      <td style="white-space:nowrap;"><button class="iconbtn" data-act="openSRAModal" data-a1="${s.id}">Edit</button>
      <button class="iconbtn" data-act="deleteSRA" data-a1="${s.id}">Delete</button></td></tr>`;
    }).join('')}
  </table></div>`;
}
async function deleteSRA(id){
  if(!confirm('Delete this vendor risk score?')) return;
  DB.supplierRisk = DB.supplierRisk.filter(s=>s.id!==id);
  await dbSet('supplierRisk', DB.supplierRisk); renderSRAList(); renderNav(); toast('Deleted');
}
function openSRAModal(id){
  const existing = id ? DB.supplierRisk.find(s=>s.id===id) : null;
  const data = existing ? JSON.parse(JSON.stringify(existing)) : {id: uid('SRA'), supplier:'', vendorId:'', useCase:'', dataShared:'', aiActRole:'Not in scope', assessedBy:'', date:todayISO(), scores:{}, conditions:'', decision:'Approve', decidedBy:'', reassessBy:''};
  const vendorOptions = DB.vendors.map(v=>v.name);
  showModal(`${existing?'Edit':'New'} Vendor Risk Score`, `
    <div class="field-row">
      <div><label>Vendor / product</label><input id="s_supplier" list="vList" value="${esc(vendorLabel(data.vendorId, data.supplier))}">
      <datalist id="vList">${vendorOptions.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>
      <p style="font-size:11px;color:var(--ink-soft);margin:4px 0 0;">Pick a vendor from Vendor Due Diligence to link this score to their questionnaire.</p></div>
      <div><label>What we use it for</label><input id="s_useCase" type="text" value="${esc(data.useCase)}"></div>
    </div>
    <div class="field-row three">
      <div><label>Data shared with them</label><input id="s_dataShared" type="text" value="${esc(data.dataShared)}"></div>
      <div><label>Their AI Act role</label><select id="s_aiActRole">${['Provider','Deployer','Not in scope'].map(o=>`<option ${o===data.aiActRole?'selected':''}>${o}</option>`).join('')}</select></div>
      <div><label>Assessed by / date</label><input id="s_assessedBy" type="text" value="${esc(data.assessedBy)}"></div>
    </div>
    <label>Score each area (1 low – 5 high)</label>
    <div class="score-grid">
      ${SRA_AREAS.map(a=>`<div class="score-box"><div class="lab">${a}</div><input id="s_score_${a.replace(/[^a-zA-Z]/g,'')}" type="number" min="1" max="5" step="1" inputmode="numeric" value="${esc(clampScore(data.scores[a]||''))}" style="margin:0;text-align:center;"></div>`).join('')}
    </div>
    <p style="font-size:11.5px;color:var(--ink-soft);margin:8px 0 14px;">Any single 5 is a red flag. A spread of 4s means conditions before proceeding.</p>
    <div class="field-row three">
      <div><label>Decision</label><select id="s_decision">${['Approve','Approve with conditions','Reject'].map(o=>`<option ${o===data.decision?'selected':''}>${o}</option>`).join('')}</select></div>
      <div><label>Decided by</label><input id="s_decidedBy" type="text" value="${esc(data.decidedBy)}"></div>
      <div><label>Re-assess by</label><input id="s_reassessBy" type="date" value="${esc(data.reassessBy)}"></div>
    </div>
    <label>Conditions to clear</label><textarea id="s_conditions">${esc(data.conditions)}</textarea>
  `, async ()=>{
    data.supplier = val('s_supplier');
    data.vendorId = resolveVendorId(data.supplier);
    data.useCase = val('s_useCase'); data.dataShared = val('s_dataShared');
    data.aiActRole = val('s_aiActRole'); data.assessedBy = val('s_assessedBy');
    data.scores = {}; SRA_AREAS.forEach(a=>{ const v = clampScore(document.getElementById('s_score_'+a.replace(/[^a-zA-Z]/g,'')).value); if(v) data.scores[a]=v; });
    data.decision = val('s_decision'); data.decidedBy = val('s_decidedBy'); data.reassessBy = val('s_reassessBy'); data.conditions = val('s_conditions');
    if(!existing) DB.supplierRisk.push(data); else Object.assign(existing, data);
    await dbSet('supplierRisk', DB.supplierRisk);
    closeModal(); renderSRAList(); renderNav(); toast('Score saved');
  }, true);
  SRA_AREAS.forEach(a=>bindScoreClamp(document.getElementById('s_score_'+a.replace(/[^a-zA-Z]/g,''))));
}

/* ============================= INCIDENTS ============================= */
function pageIncidents(){
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Response</div><h2>AI Incident Reports</h2><p>For any incident where AI was involved. Start filling it the moment you confirm an incident, notifications then containment then narrative.</p></div>
      <div class="actions"><button class="btn gold" id="addInc">+ Log incident</button></div>
    </div>
    <div class="card"><div id="incList"></div></div>
  `;
  document.getElementById('addInc').onclick = ()=>openIncidentModal(null);
  renderIncList();
}
function renderIncList(){
  const wrap = document.getElementById('incList');
  if(!DB.incidents.length){ wrap.innerHTML = `<div class="empty"><b>No incidents on file</b>That's a good thing. Use this form the moment one occurs.</div>`; return; }
  wrap.innerHTML = `<div class="tbl-wrap"><table>
    <tr><th class="mono">ID</th><th>Type</th><th>Severity</th><th>Discovered</th><th>Status</th><th></th></tr>
    ${DB.incidents.map(i=>`<tr><td class="mono">${esc(i.id)}</td><td>${esc(i.type)}</td>
      <td><span class="badge ${(i.severity||'').toLowerCase()}">${esc(i.severity)}</span></td>
      <td>${fmtDate(i.discovered)}</td>
      <td><span class="badge ${i.status==='Closed'?'active':i.status==='Contained'?'medium':'open'}">${esc(i.status)}</span></td>
      <td style="white-space:nowrap;"><button class="iconbtn" data-act="openIncidentModal" data-a1="${i.id}">Edit</button>
      <button class="iconbtn" data-act="deleteIncident" data-a1="${i.id}">Delete</button></td></tr>`).join('')}
  </table></div>`;
}
async function deleteIncident(id){
  if(!confirm('Delete this incident record? Incident records are normally retained 7 years, only delete test entries.')) return;
  DB.incidents = DB.incidents.filter(i=>i.id!==id);
  await dbSet('incidents', DB.incidents); renderIncList(); renderNav(); toast('Deleted');
}
function openIncidentModal(id){
  const existing = id ? DB.incidents.find(i=>i.id===id) : null;
  const data = existing ? JSON.parse(JSON.stringify(existing)) : {
    id: uid('INC'), reporter:'', discovered:'', type:'Data exposure', severity:'Medium', aiTool:'', channel:'',
    personalData:'None', summary:'', detection:'', containment:'', notifications:'', rootCause:'', lessons:'',
    status:'Open', closedDate:''
  };
  showModal(`${existing?'Edit':'New'} Incident Report`, `
    <div class="field-row three">
      <div><label>Reporter (name + role)</label><input id="i_reporter" type="text" value="${esc(data.reporter)}"></div>
      <div><label>Discovered</label><input id="i_discovered" type="date" value="${esc(data.discovered)}"></div>
      <div><label>Status</label><select id="i_status">${['Open','Contained','Closed'].map(o=>`<option ${o===data.status?'selected':''}>${o}</option>`).join('')}</select></div>
    </div>
    <div class="field-row three">
      <div><label>Type</label><select id="i_type">${['Data exposure','Harmful or hallucinated output','Governance breach','Unauthorised tool use','Sub-processor issue','Model abuse','Other'].map(o=>`<option ${o===data.type?'selected':''}>${o}</option>`).join('')}</select></div>
      <div><label>Severity</label><select id="i_severity">${['Low','Medium','High','Critical'].map(o=>`<option ${o===data.severity?'selected':''}>${o}</option>`).join('')}</select></div>
      <div><label>Personal data involved</label><select id="i_personalData">${['None','Standard','Special-category (Art 9)','Criminal-offence (Art 10)'].map(o=>`<option ${o===data.personalData?'selected':''}>${o}</option>`).join('')}</select></div>
    </div>
    <div class="field-row">
      <div><label>AI tool + version/tenant</label><input id="i_aiTool" type="text" value="${esc(data.aiTool)}"></div>
      <div><label>Channel</label><input id="i_channel" type="text" value="${esc(data.channel)}" placeholder="Web UI / API / extension / agent"></div>
    </div>
    <label>Factual summary (plain English, no speculation)</label><textarea id="i_summary" rows="3">${esc(data.summary)}</textarea>
    <label>Detection (how / by whom)</label><textarea id="i_detection">${esc(data.detection)}</textarea>
    <label>Containment actions taken</label><textarea id="i_containment">${esc(data.containment)}</textarea>
    <label>Notifications made (regulator / DPO / data subjects / vendor / insurer)</label><textarea id="i_notifications">${esc(data.notifications)}</textarea>
    <label>Root cause</label><textarea id="i_rootCause">${esc(data.rootCause)}</textarea>
    <label>Lessons and changes required</label><textarea id="i_lessons">${esc(data.lessons)}</textarea>
    ${data.status==='Closed'?`<label>Closed date</label><input id="i_closedDate" type="date" value="${esc(data.closedDate||todayISO())}">`:''}
    <div class="panel" style="margin-top:14px;"><b style="color:var(--navy);">Reporting deadlines reminder</b>
    <p style="margin:6px 0 0;font-size:12.5px;">GDPR Art 33 (authority): 72h from awareness · GDPR Art 34 (data subjects, high risk): without undue delay · EU AI Act Art 73: 15 days (2 if widespread/fatal) · NIS2 Art 23: 24h early warning, 72h notification.</p></div>
  `, async ()=>{
    data.reporter=val('i_reporter'); data.discovered=val('i_discovered'); data.status=val('i_status');
    data.type=val('i_type'); data.severity=val('i_severity'); data.personalData=val('i_personalData');
    data.aiTool=val('i_aiTool'); data.channel=val('i_channel'); data.summary=val('i_summary');
    data.detection=val('i_detection'); data.containment=val('i_containment'); data.notifications=val('i_notifications');
    data.rootCause=val('i_rootCause'); data.lessons=val('i_lessons');
    if(data.status==='Closed'){ const cd = document.getElementById('i_closedDate'); if(cd) data.closedDate = cd.value; }
    if(!existing) DB.incidents.push(data); else Object.assign(existing, data);
    await dbSet('incidents', DB.incidents);
    closeModal(); renderIncList(); renderNav(); toast('Incident saved');
  }, true);
}

/* ============================= RACI ============================= */
function pageRACI(){
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Governance</div><h2>AI Governance Roles Matrix (RACI)</h2><p>Who is Responsible, Accountable, Consulted, Informed for each AI decision. Edit role names and cells, then publish for the steering group.</p></div>
      <div class="actions"><button class="btn ghost" data-act="print">Print / Export</button><button class="btn gold" id="saveRaci">Save changes</button></div>
    </div>
    <div class="card">
      <h3>Role columns</h3>
      <div class="field-row three" id="raciCols">
        ${DB.raci.cols.map((c,idx)=>`<div><label>Column ${idx+1}</label><input id="rc_${idx}" type="text" value="${esc(c)}"></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <h3>Decision matrix</h3>
      <div class="tbl-wrap"><table>
        <tr><th>Decision / Activity</th>${DB.raci.cols.map((c,idx)=>`<th>${esc(c)}</th>`).join('')}</tr>
        ${RACI_ROWS.map((row,r)=>`<tr><td style="font-size:12.5px;">${esc(row)}</td>
          ${DB.raci.cols.map((_,c)=>`<td><input id="rcell_${r}_${c}" type="text" value="${esc((DB.raci.cells[r]||[])[c]||'')}" style="margin:0;text-align:center;width:60px;"></td>`).join('')}
        </tr>`).join('')}
      </table></div>
      <p style="font-size:11.5px;color:var(--ink-soft);margin-top:10px;">R = Responsible (does the work) · A = Accountable (final say) · C = Consulted (gives input) · I = Informed (told the outcome).</p>
    </div>
  `;
  document.getElementById('saveRaci').onclick = saveRaci;
}
async function saveRaci(){
  const cols = DB.raci.cols.map((_,idx)=>document.getElementById('rc_'+idx).value);
  const cells = RACI_ROWS.map((_,r)=>cols.map((_,c)=>document.getElementById(`rcell_${r}_${c}`).value));
  DB.raci = {cols, cells};
  await dbSet('raci-matrix', DB.raci);
  toast('RACI matrix saved'); pageRACI();
}

/* ============================= TOR ============================= */
function pageTOR(){
  const t = DB.tor;
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Governance</div><h2>AI Steering Group, Terms of Reference</h2><p>Stand up the group that owns AI governance. Fill the fields, approve at the first meeting.</p></div>
      <div class="actions"><button class="btn ghost" data-act="print">Print / Export</button><button class="btn gold" id="saveTor">Save changes</button></div>
    </div>
    <div class="grid cols-2">
      <div class="card">
        <h3>Group details</h3>
        <div class="field-row">
          <div><label>Organisation</label><input id="t_org" type="text" value="${esc(fieldVal(t.org))}" placeholder="Your organisation name"></div>
          <div><label>Reports to</label><input id="t_reportTo" type="text" value="${esc(t.reportTo)}"></div>
        </div>
        <div class="field-row">
          <div><label>Chair</label><input id="t_chair" type="text" value="${esc(fieldVal(t.chair))}" placeholder="Senior owner, e.g. COO / CISO"></div>
          <div><label>Meeting frequency</label><input id="t_frequency" type="text" value="${esc(t.frequency)}"></div>
        </div>
        <div class="field-row">
          <div><label>Quorum (number of members)</label><input id="t_quorumN" type="text" value="${esc(t.quorumN)}"></div>
          <div><label>Minutes circulated within</label><input id="t_minutesDays" type="text" value="${esc(t.minutesDays)}"></div>
        </div>
        <div class="field-row">
          <div><label>Approved by</label><input id="t_approvedBy" type="text" value="${esc(t.approvedBy)}"></div>
          <div><label>Date approved</label><input id="t_approvedDate" type="date" value="${esc(t.approvedDate)}"></div>
        </div>
      </div>
      <div class="card">
        <h3>Membership</h3>
        <div id="memberRows">
          ${t.members.map((m,idx)=>`<div class="field-row" style="align-items:end;">
            <div><label>Role</label><input id="m_role_${idx}" type="text" value="${esc(m.role)}"></div>
            <div><label>Held by</label><input id="m_held_${idx}" type="text" value="${esc(fieldVal(m.held))}" placeholder="Name / role"></div>
          </div>`).join('')}
        </div>
        <button class="btn ghost sm" id="addMember">+ Add member</button>
      </div>
    </div>
    <div id="torDoc"></div>
  `;
  document.getElementById('saveTor').onclick = saveTor;
  document.getElementById('addMember').onclick = ()=>{ t.members.push({role:'',held:''}); pageTOR(); };
  renderTorDoc();
}
async function saveTor(){
  const t = DB.tor;
  t.org = val('t_org'); t.reportTo = val('t_reportTo'); t.chair = val('t_chair'); t.frequency = val('t_frequency');
  t.quorumN = val('t_quorumN'); t.minutesDays = val('t_minutesDays'); t.approvedBy = val('t_approvedBy'); t.approvedDate = val('t_approvedDate');
  t.members = t.members.map((m,idx)=>({role: document.getElementById('m_role_'+idx).value, held: document.getElementById('m_held_'+idx).value}));
  await dbSet('tor-config', t);
  toast('Terms of Reference saved'); pageTOR(); renderNav();
}
function renderTorDoc(){
  const t = DB.tor;
  document.getElementById('torDoc').innerHTML = `
  <div class="doc">
    <h2>AI Steering Group, Terms of Reference</h2>
    <h4>1. Purpose</h4><p>The AI Steering Group is the body accountable for the safe, lawful and effective use of artificial intelligence across ${esc(docVal(t.org,'[Organisation]'))}. It owns the AI governance framework, approves AI use cases, oversees risk, and reports to ${esc(t.reportTo)}.</p>
    <h4>2. Scope</h4><p>All AI and generative-AI tools used by staff; all use cases touching personal data, customers, employment decisions or regulated activity; the policies, registers and assessments this platform tracks. Out of scope: day-to-day IT helpdesk support and individual HR matters.</p>
    <h4>3. Membership</h4>
    <table><tr><th>Role</th><th>Held by</th></tr><tr><td>Chair</td><td>${esc(docVal(t.chair,'[Chair]'))}</td></tr>
    ${t.members.map(m=>`<tr><td>${esc(m.role)}</td><td>${esc(docVal(m.held,'[Name / role]'))||'<span class="fill">unassigned</span>'}</td></tr>`).join('')}</table>
    <h4>4. Responsibilities</h4><p>Own the AI governance framework and AUP; approve, reject or condition AI use cases; oversee the registers; set and monitor training; review incidents and notification decisions; track EU AI Act and ISO/IEC 42001 obligations; report governance maturity quarterly.</p>
    <h4>5. Meetings, quorum and decisions</h4><p><b>Frequency:</b> ${esc(t.frequency)}. <b>Quorum:</b> the Chair plus at least ${esc(t.quorumN)} members, including data protection. <b>Decisions:</b> by consensus where possible, otherwise majority with the Chair holding the casting vote. <b>Minutes:</b> circulated within ${esc(t.minutesDays)}.</p>
    <h4>6. Reporting</h4><p>The Chair reports to ${esc(t.reportTo)} each quarter on use cases approved/rejected, open high risks, training completion, incidents, and progress against EU AI Act and ISO/IEC 42001 obligations.</p>
    <div class="field-row" style="margin-top:20px;border-top:1px solid var(--line);padding-top:14px;">
      <div><b>Approved by</b><br>${esc(t.approvedBy)||'<span class="fill">pending</span>'}</div>
      <div><b>Date approved</b><br>${t.approvedDate?fmtDate(t.approvedDate):'<span class="fill">pending</span>'}</div>
    </div>
  </div>`;
}

/* ============================= STAFF & SIGN-OFF ============================= */
function pageStaff(){
  const main = document.getElementById('main');
  const ackByStaff = {};
  DB.acks.forEach(a=>{ ackByStaff[a.staffId] = a; });
  main.innerHTML = `
    <div class="pagehead">
      <div><div class="eyebrow">Rollout</div><h2>Staff &amp; Policy Sign-off</h2><p>Maintain your staff roster, send the policy for acknowledgement, and track who has signed off, all in shared storage so this updates live for everyone using this platform link.</p></div>
      <div class="actions"><button class="btn ghost" id="copyMsg">Copy announcement message</button><button class="btn gold" id="addStaff">+ Add staff member</button></div>
    </div>

    <div class="card" style="background:var(--amber-bg);border-color:transparent;">
      <h3>How "send to staff" works here</h3>
      <p style="margin:0;">Share this artifact's link with your team (use the share / publish option above the conversation). Everyone who opens it sees the same live data. Add people to the roster below, then use <b>Copy announcement message</b> or the per-person <b>Email</b> button to notify them, each person opens the link, finds their name under "Acknowledge the policy", and signs off. Their acknowledgement appears here instantly for everyone.</p>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <h3>Staff roster</h3>
        <div id="staffTable"></div>
      </div>
      <div class="card">
        <h3>Acknowledge the policy</h3>
        <p style="color:var(--ink-soft);font-size:12.5px;margin-top:-4px;">Current version: <b>${esc(DB.aupStatus.version)}</b>, ${DB.aupStatus.published?'published '+fmtDate(DB.aupStatus.publishedDate):'<span style="color:var(--rose)">not yet published</span>'}</p>
        <label>Your name</label>
        <select id="ackSelect">
          <option value="">- select your name -</option>
          ${DB.staff.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}
        </select>
        <button class="btn" id="ackBtn" ${DB.aupStatus.published?'':'disabled'}>I have read &amp; accept the Acceptable Use Policy</button>
        ${!DB.aupStatus.published?'<p style="font-size:12px;color:var(--rose);margin-top:8px;">The policy must be published before staff can acknowledge it.</p>':''}
      </div>
    </div>
  `;
  document.getElementById('addStaff').onclick = ()=>openStaffModal(null);
  document.getElementById('ackBtn').onclick = recordAck;
  document.getElementById('copyMsg').onclick = copyAnnouncement;
  renderStaffTable(ackByStaff);
}
function renderStaffTable(ackByStaff){
  const wrap = document.getElementById('staffTable');
  if(!DB.staff.length){ wrap.innerHTML = `<div class="empty"><b>No staff added yet</b>Add your team to start tracking sign-off.</div>`; return; }
  wrap.innerHTML = `<div class="tbl-wrap"><table>
    <tr><th>Name</th><th>Email</th><th>Role</th><th>Policy ack</th><th></th></tr>
    ${DB.staff.map(s=>{
      const ack = ackByStaff[s.id];
      const acked = ack && ack.version===DB.aupStatus.version;
      const subj = encodeURIComponent(`Action needed: acknowledge the AI Acceptable Use Policy`);
      const body = encodeURIComponent(`Hi ${s.name},\n\nPlease open the Attest AI platform and acknowledge the AI Acceptable Use Policy (v${DB.aupStatus.version}).\n\nThanks,\n${DB.org.owner}`);
      return `<tr><td>${esc(s.name)}</td><td>${esc(s.email)}</td><td>${esc(s.role)}</td>
      <td>${acked?`<span class="badge active">Acknowledged ${fmtDate(ack.date)}</span>`:'<span class="badge open">Not yet</span>'}</td>
      <td style="white-space:nowrap;">
        ${!acked?`<a class="iconbtn" href="mailto:${esc(s.email)}?subject=${subj}&body=${body}">Email reminder</a>`:''}
        <button class="iconbtn" data-act="openStaffModal" data-a1="${s.id}">Edit</button>
        <button class="iconbtn" data-act="deleteStaff" data-a1="${s.id}">Remove</button>
      </td></tr>`;
    }).join('')}
  </table></div>`;
}
async function deleteStaff(id){
  if(!confirm('Remove this person from the roster?')) return;
  DB.staff = DB.staff.filter(s=>s.id!==id);
  await dbSet('staff', DB.staff); pageStaff(); renderNav(); toast('Removed');
}
function openStaffModal(id){
  const existing = id ? DB.staff.find(s=>s.id===id) : null;
  const data = existing || {id: uid('S'), name:'', email:'', role:''};
  showModal(`${existing?'Edit':'Add'} staff member`, `
    <div class="field-row three">
      <div><label>Name</label><input id="st_name" type="text" value="${esc(data.name)}"></div>
      <div><label>Email</label><input id="st_email" type="email" value="${esc(data.email)}"></div>
      <div><label>Role / department</label><input id="st_role" type="text" value="${esc(data.role)}"></div>
    </div>
  `, async ()=>{
    data.name = val('st_name'); data.email = val('st_email'); data.role = val('st_role');
    if(!existing) DB.staff.push(data); else Object.assign(existing, data);
    await dbSet('staff', DB.staff);
    closeModal(); pageStaff(); renderNav(); toast('Saved');
  });
}
async function recordAck(){
  const id = document.getElementById('ackSelect').value;
  if(!id){ toast('Select your name first'); return; }
  DB.acks = DB.acks.filter(a=>a.staffId!==id || a.version!==DB.aupStatus.version);
  DB.acks.push({staffId:id, version:DB.aupStatus.version, date: todayISO()});
  await dbSet('acks', DB.acks);
  pageStaff(); renderNav();
  toast('Acknowledged, thank you');
}
function copyAnnouncement(){
  const text = `AI Acceptable Use Policy (v${DB.aupStatus.version}) is now ${DB.aupStatus.published?'published':'in draft'} for ${DB.org.companyName}.\n\nPlease open the compliance platform link, find your name under "Acknowledge the policy", and confirm you've read it.\n\nQuestions to ${DB.org.dpoName} (${DB.org.incidentContact}).`;
  navigator.clipboard?.writeText(text).then(()=>toast('Announcement copied to clipboard')).catch(()=>toast('Could not copy, select and copy manually'));
}


/* ===== Manage panes: pre-bound live DOM nodes moved into #main ===== */
const STASH = {};
["pane-team","pane-course","pane-templates","pane-updates"].forEach(id => { STASH[id] = document.getElementById(id); });
function pageStash(id){
  const main = document.getElementById('main');
  const el = STASH[id];
  el.style.display = 'block';
  main.appendChild(el);
}



/* CSP-safe action dispatch: generated HTML uses data-act instead of inline onclick
   (the site CSP has script-src 'self', which blocks inline handlers). */
const ACTIONS = { setTab, openRegisterModal, deleteRegisterRow, openAssessmentModal, deleteAssessment,
  openVendorModal, deleteVendor, openSRAModal, deleteSRA, openIncidentModal, deleteIncident,
  openStaffModal, deleteStaff, print: () => window.print() };
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const fn = ACTIONS[el.dataset.act];
  if (!fn) return;
  const args = [];
  if (el.dataset.a1 !== undefined) args.push(el.dataset.a1);
  if (el.dataset.a2 !== undefined) args.push(el.dataset.a2);
  fn(...args);
});

/* ============================= INIT ============================= */
(async function init(){
  document.getElementById('who').textContent = (PROFILE.full_name || '') + ' · Manager';
  document.getElementById('out').addEventListener('click', signOut);
  await loadAll();
  renderNav();
  renderMain();
})();