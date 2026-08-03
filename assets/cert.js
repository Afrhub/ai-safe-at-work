// Certificate renderer, extracted from an inline <script> in cert.html on 31 Jul 2026.
//
// It had NEVER run on production. The live CSP is script-src 'self' with no
// unsafe-inline, no nonce and no hash, so the browser blocked the whole block and
// cert.html rendered an empty page for every learner who passed. Caught by
// CERT-RENDER in tests/suites/browser-site.mjs.
//
// Keep this external. Anything inline here is dead on arrival in production.

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

  function qs(name) {
    const m = new URLSearchParams(window.location.search).get(name);
    return m == null ? null : m;
  }

  const moduleNum = parseInt(qs('m') || '0', 10);
  const score = parseInt(qs('s') || '0', 10);
  const total = parseInt(qs('n') || '10', 10);
  const root = document.getElementById('cert-root');

  if (!moduleNum || moduleNum < 1 || moduleNum > 12) {
    // Certificate register: show pass status for all 11 modules on this device.
    // Module 11 (the 60-second checklist) is the gated finale and is not counted.
    const REGISTER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
    let rows = '';
    let passedCount = 0;
    for (const m of REGISTER) {
      let rec = null;
      try { rec = JSON.parse(localStorage.getItem('aisw-quiz-m' + m) || 'null'); } catch (e) { rec = null; }
      const passed = rec && rec.score >= rec.threshold;
      if (passed) passedCount++;
      const num = String(m).padStart(2, '0');
      const status = passed
        ? `<span style="color:var(--green);font-weight:700;">Passed · ${rec.score}/${rec.total || 10}</span>`
        : `<span style="color:var(--text3);">Not yet earned</span>`;
      const action = passed
        ? `<a href="cert.html?m=${m}" style="color:var(--accent);font-weight:700;">Open certificate →</a>`
        : `<a href="module-${m}.html" style="color:var(--text2);">Take the module →</a>`;
      rows += `
        <div style="display:grid;grid-template-columns:3rem 1fr auto auto;gap:1rem;align-items:baseline;
                    padding:0.75rem 0.4rem;border-bottom:1px dashed rgba(255,255,255,0.09);font-size:0.95rem;">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:0.78rem;letter-spacing:0.1em;">M${num}</span>
          <span style="color:var(--text);">${MODULE_TITLES[m]}</span>
          ${status}
          ${action}
        </div>`;
    }
    root.innerHTML = `
      <div class="cert-intro">
        <h1>Certificate <em>register</em>.</h1>
        <p>Each module issues a printable certificate when you pass its knowledge check.
      Results live in this browser only, nothing is sent anywhere. ${passedCount} of 11 earned on this device.</p>
      </div>
      <div style="max-width:860px;margin:2rem auto 0;background:var(--plate);border:1px solid var(--border);
                  border-radius:3px;padding:1.2rem 1.4rem;box-shadow:var(--shadow-card);">
        <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;letter-spacing:0.14em;
                    text-transform:uppercase;color:var(--accent);margin-bottom:0.6rem;">The 11 modules</div>
        ${rows}
        <p style="margin:1.1rem 0 0.2rem;font-size:0.9rem;color:var(--text3);">
     Pass mark is 8 of 10 on each knowledge check. Retake any quiz at any time, the certificate reissues with the new score.
          <a href="course.html" style="color:var(--accent);">Browse all modules →</a>
        </p>
      </div>`;
    return;
  }

  const lsKey = 'aisw-quiz-m' + moduleNum;
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(lsKey) || 'null'); } catch (e) { stored = null; }

  if (!stored || stored.score < stored.threshold) {
    root.innerHTML = `
      <div class="cert-error">
        <strong>No passing score recorded yet for Module ${moduleNum}.</strong>
        <p style="margin-top:0.5rem;">Pass the quiz at the bottom of <a href="module-${moduleNum}.html">Module ${moduleNum}</a> first. The result is stored on this device only.</p>
      </div>`;
    return;
  }

  let name = '';
  try { name = localStorage.getItem('aisw-username') || ''; } catch (e) {}

  const issueDate = new Date(stored.t || Date.now());
  const dateStr = issueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const certId  = makeCertId(moduleNum, stored.score, stored.t);

  root.innerHTML = `
    <div class="cert-intro">
      <h1>Your <em>certificate</em>.</h1>
   <p>Personal training record. Saved on this device only, printable for your file. Type your name below, then print or save as PDF.</p>
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
    Has completed <strong>Module ${pad2(moduleNum)}, ${escapeHtml(MODULE_TITLES[moduleNum] || '')}</strong>
        with a score of <strong>${stored.score} of ${total}</strong>
        (pass mark ${stored.threshold || 8}).
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
      Self-issued personal record. AI Safe@Work does not validate, sign or store this certificate; the score lives in your browser's
      <code style="background:rgba(201,212,227,0.1); padding:0 0.3rem; border-radius:3px;">localStorage</code>.
      Hand it to your manager, HR, or training file as one piece of literacy evidence. Reissue any time by retaking the quiz.
    </p>

    <div class="cert-actions">
      <a class="ghost" href="module-${moduleNum}.html">← Back to module</a>
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
  saveBtn.addEventListener('click', () => {
    const v = input.value.trim();
    if (!v) { input.focus(); return; }
    try { localStorage.setItem('aisw-username', v); } catch (e) {}
    saveBtn.textContent = 'Saved ✓';
    setTimeout(() => { saveBtn.textContent = 'Save name'; }, 1800);
  });
  printBtn.addEventListener('click', () => {
    const v = input.value.trim();
    if (!v) { input.focus(); return; }
    try { localStorage.setItem('aisw-username', v); } catch (e) {}
    window.print();
  });

  function makeCertId(m, s, iso) {
    const d = new Date(iso || Date.now());
    const stamp = d.getFullYear().toString().slice(-2)
      + pad2(d.getMonth() + 1)
      + pad2(d.getDate());
    const rand = Math.abs(hash(String(iso) + ':' + m + ':' + s)).toString(36).slice(0, 4).toUpperCase();
    return `AISW-M${pad2(m)}-${stamp}-${rand}`;
  }
  function hash(s) {
    let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return h;
  }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
})();
