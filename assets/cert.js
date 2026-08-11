// Certificate renderer, extracted from an inline <script> in cert.html on 31 Jul 2026.
//
// It had NEVER run on production. The live CSP is script-src 'self' with no
// unsafe-inline, no nonce and no hash, so the browser blocked the whole block and
// cert.html rendered an empty page for every learner who passed. Caught by
// CERT-RENDER in tests/suites/browser-site.mjs.
//
// Keep this external. Anything inline here is dead on arrival in production.
//
// Repointed at module_progress on 11 Aug 2026. Every value on the certificate, the
// score, the date and the reference, now comes from the row record_quiz_result wrote
// under the learner's own identity. Nothing is minted from the query string or from
// localStorage, so the certificate is the same record the manager roster reads and
// "training completion records you can hand to an auditor" is finally true.

(function () {
  'use strict';

  const MODULE_TITLES = {
    1: 'Why this course exists',
    2: 'What AI tools do with what you type',
    3: 'The never-paste list',
    4: 'Picking the right tool',
    5: 'Verifying what the AI tells you',
    6: 'AI-powered scams aimed at you',
    7: 'Bias, fairness, not embarrassing the business',
    8: 'Copyright, IP, and other people’s content',
    9: 'Logging and accountability',
    10: 'When something goes wrong',
    11: 'The 60-second pre-submit checklist',
    12: 'The standards behind this course'
  };

  // Certificated modules. Module 1 is the free ungated sample: it is scored in the
  // browser because a signed-out visitor has no session to score against, so it earns
  // no verified record and no certificate.
  const REGISTER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // ponytail: every module quiz is ten questions in quiz_keys and record_quiz_result
  // only writes a row at 80%, so a row means a pass at 8 or better. Read them from the
  // database if the shape ever varies by module.
  const TOTAL = 10;
  const PASS = 8;

  // Publishable key, public by design and already served in portal/config.js and
  // assets/quiz.js. RLS and the learner's own bearer token do the work.
  const SB_URL = 'https://hanjrsslhnuauaysbhun.supabase.co';
  const SB_ANON = 'sb_publishable_wtK-KC8ibXtA0EvVIJZGqA_oY8wx_6E';

  const root = document.getElementById('cert-root');
  const moduleNum = parseInt(qs('m') || '0', 10);

  const sess = session();
  if (!sess) {
    showError('Sign in to see your training record.',
      'Certificates are issued from the pass recorded against your account, so this page ' +
      'needs a signed-in session. <a href="portal/login.html">Sign in</a>, then come back.');
    return;
  }

  Promise.all([
    api('module_progress?select=module,score,updated_at'),
    api('profiles?select=full_name&id=eq.' + encodeURIComponent(sess.uid))
  ]).then(([rows, profile]) => {
    const name = ((profile && profile[0]) || {}).full_name || '';
    if (!moduleNum || moduleNum < 1 || moduleNum > 12) renderRegister(rows);
    else renderCertificate(moduleNum, rows.find(r => r.module === moduleNum), name);
  }).catch(() => {
    showError('Could not load your training record.',
      'Your record could not be read just now, so nothing is shown rather than something ' +
      'unverified. Try again in a moment, or <a href="portal/login.html">sign in again</a> ' +
      'if you have been away a while.');
  });

  // ── Views ─────────────────────────────────────────────────

  function renderRegister(rows) {
    const passed = new Map(rows.map(r => [r.module, r]));
    // quiz_keys holds module 1 too, so a learner who calls record_quiz_result directly can
    // hold a row for a module that issues no certificate. Count the register, not the rows.
    let earned = 0;
    let html = '';
    for (const m of REGISTER) {
      const rec = passed.get(m);
      if (rec) earned++;
      const status = rec
        ? `<span style="color:var(--green);font-weight:700;">Passed · ${rec.score}/${TOTAL}</span>`
        : `<span style="color:var(--text3);">Not yet earned</span>`;
      const action = rec
        ? `<a href="cert.html?m=${m}" style="color:var(--accent);font-weight:700;">Open certificate →</a>`
        : `<a href="module-${m}.html" style="color:var(--text2);">Take the module →</a>`;
      html += row(m, status, action);
    }
    // Module 1 is listed so its absence does not read as a missing record.
    html += row(1,
      `<span style="color:var(--text3);">Free sample</span>`,
      `<a href="module-1.html" style="color:var(--text2);">Open the module →</a>`);

    root.innerHTML = `
      <div class="cert-intro">
        <h1>Certificate <em>register</em>.</h1>
        <p>Each module issues a printable certificate when you pass its knowledge check.
      Results are held against your account and your manager sees the same record.
      ${earned} of ${REGISTER.length} earned.</p>
      </div>
      <div style="max-width:860px;margin:2rem auto 0;background:var(--plate);border:1px solid var(--border);
                  border-radius:3px;padding:1.2rem 1.4rem;box-shadow:var(--shadow-card);">
        <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;letter-spacing:0.14em;
                    text-transform:uppercase;color:var(--accent);margin-bottom:0.6rem;">The ${REGISTER.length} certificated modules</div>
        ${html}
        <p style="margin:1.1rem 0 0.2rem;font-size:0.9rem;color:var(--text3);">
     Pass mark is ${PASS} of ${TOTAL} on each knowledge check. Retake any quiz at any time; your best score stands.
     Module 1 is the free sample, scored in your browser, so it carries no certificate.
          <a href="course.html" style="color:var(--accent);">Browse all modules →</a>
        </p>
      </div>`;
  }

  function row(m, status, action) {
    return `
      <div style="display:grid;grid-template-columns:3rem 1fr auto auto;gap:1rem;align-items:baseline;
                  padding:0.75rem 0.4rem;border-bottom:1px dashed rgba(255,255,255,0.09);font-size:0.95rem;">
        <span style="font-family:var(--font-mono);color:var(--accent);font-size:0.78rem;letter-spacing:0.1em;">M${pad2(m)}</span>
        <span style="color:var(--text);">${escapeHtml(MODULE_TITLES[m])}</span>
        ${status}
        ${action}
      </div>`;
  }

  function renderCertificate(m, rec, name) {
    if (m === 1) {
      showError('Module 1 does not issue a certificate.',
        'It is the free sample and it is scored in your browser, so there is no verified ' +
        'record behind it. Modules 2 to 12 are scored on our side and do issue one. ' +
        '<a href="cert.html">See your register</a>.');
      return;
    }
    if (!rec) {
      showError(`No verified pass recorded for Module ${m}.`,
        `Pass the quiz at the bottom of <a href="module-${m}.html">Module ${m}</a> first. ` +
        `It is marked on our side, so the result appears here as soon as you pass.`);
      return;
    }

    const issued = new Date(rec.updated_at);
    const dateStr = issued.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const certId = makeCertId(m, rec.score, rec.updated_at);

    root.innerHTML = `
      <div class="cert-intro">
        <h1>Your <em>certificate</em>.</h1>
   <p>Issued from the pass recorded against your account. Check the name below matches your
      training file, then print or save as PDF.</p>
        <div class="cert-name-row">
          <label for="who">Your full name</label>
          <input id="who" type="text" placeholder="Your full name" autocomplete="name" value="${escapeHtml(name)}">
          <button type="button" id="save-name">Save name</button>
        </div>
      </div>

      <article class="cert-card" id="card">
        <div class="cert-brand">AI Safe@Work</div>

        <div>
          <div class="cert-eyebrow">Certificate of Module Completion</div>
          <h2 class="cert-h">AI literacy at <em>work</em>.</h2>
          <p class="cert-sub">This certificate evidences that the named individual has completed and passed the knowledge check for the following module. It is one of the records an employer may keep to demonstrate <strong>EU AI Act Article 4 AI literacy</strong> for staff using AI tools.</p>
        </div>

        <div class="cert-recipient" id="who-display">${escapeHtml(name) || 'Your name here'}</div>

        <p class="cert-module">
      Has completed <strong>Module ${pad2(m)}, ${escapeHtml(MODULE_TITLES[m] || '')}</strong>
          with a score of <strong>${rec.score} of ${TOTAL}</strong>
          (pass mark ${PASS}).
        </p>

        <div class="cert-meta">
          <div class="cert-meta-block">
            <span class="cert-meta-label">Issued</span>
            <span class="cert-meta-value">${dateStr}</span>
          </div>
          <div class="cert-meta-block">
            <span class="cert-meta-label">Reference</span>
            <span class="cert-meta-value">${certId}</span>
          </div>
          <div class="cert-meta-block">
            <span class="cert-meta-label">Standards</span>
            <span class="cert-meta-value">EU AI Act Art 4 · ISO 42001 · GDPR</span>
          </div>
        </div>

        <svg class="cert-watermark" viewBox="0 0 200 200" aria-hidden="true">
          <g fill="none" stroke="#46505e" stroke-width="2">
            <circle cx="100" cy="100" r="80"/>
            <circle cx="100" cy="100" r="55"/>
            <circle cx="100" cy="100" r="30"/>
            <path d="M100 20 L100 180 M20 100 L180 100"/>
          </g>
        </svg>
      </article>

      <p class="cert-fineprint">
        Issued from your training record, not from this browser. The score, the date and the
        reference are read back from the pass Attest AI recorded when you sat the quiz, and your
        manager's roster reads the same row. Reissue any time by retaking the quiz.
      </p>

      <div class="cert-actions">
        <a class="ghost" href="module-${m}.html">← Back to module</a>
        <button class="primary" type="button" id="print">Print or save as PDF →</button>
      </div>
    `;

    const input = document.getElementById('who');
    const display = document.getElementById('who-display');
    const saveBtn = document.getElementById('save-name');
    const printBtn = document.getElementById('print');

    input.addEventListener('input', () => {
      display.textContent = input.value.trim() || 'Your name here';
    });
    saveBtn.addEventListener('click', () => saveName(saveBtn, input.value.trim()));
    printBtn.addEventListener('click', async () => {
      const v = input.value.trim();
      if (!v) { input.focus(); return; }
      // The printed name has to be the name on the record, so save before printing.
      if (v !== name) { const saved = await saveName(saveBtn, v); if (!saved) return; }
      window.print();
    });
  }

  // The name goes to profiles.full_name, the one the manager roster shows, so the
  // certificate and the roster cannot disagree. profiles grants UPDATE on that column
  // only, and RLS restricts the row to the learner.
  async function saveName(btn, value) {
    if (!value) return false;
    btn.textContent = 'Saving…';
    try {
      await api('profiles?id=eq.' + encodeURIComponent(sess.uid), {
        method: 'PATCH',
        body: JSON.stringify({ full_name: value })
      });
      btn.textContent = 'Saved ✓';
      setTimeout(() => { btn.textContent = 'Save name'; }, 1800);
      return true;
    } catch (e) {
      btn.textContent = 'Could not save';
      setTimeout(() => { btn.textContent = 'Save name'; }, 2600);
      return false;
    }
  }

  // ── Plumbing ──────────────────────────────────────────────

  function session() {
    try {
      const s = JSON.parse(localStorage.getItem('sb-hanjrsslhnuauaysbhun-auth-token') || 'null');
      const uid = s && s.user && s.user.id;
      return s && s.access_token && uid ? { token: s.access_token, uid } : null;
    } catch (e) { return null; }
  }

  async function api(path, opts) {
    const res = await fetch(SB_URL + '/rest/v1/' + path, Object.assign({
      headers: {
        apikey: SB_ANON,
        Authorization: 'Bearer ' + sess.token,
        'Content-Type': 'application/json'
      }
    }, opts || {}));
    if (!res.ok) throw new Error(path + ' returned ' + res.status);
    return res.status === 204 ? null : res.json();
  }

  function showError(title, bodyHtml) {
    root.innerHTML = `
      <div class="cert-error">
        <strong>${title}</strong>
        <p style="margin-top:0.5rem;">${bodyHtml}</p>
      </div>`;
  }

  function qs(name) {
    const m = new URLSearchParams(window.location.search).get(name);
    return m == null ? null : m;
  }
  function makeCertId(m, s, iso) {
    const d = new Date(iso);
    const stamp = d.getFullYear().toString().slice(-2) + pad2(d.getMonth() + 1) + pad2(d.getDate());
    const rand = Math.abs(hash(String(iso) + ':' + m + ':' + s)).toString(36).slice(0, 4).toUpperCase();
    return `AISW-M${pad2(m)}-${stamp}-${rand}`;
  }
  function hash(s) {
    let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return h;
  }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
})();
