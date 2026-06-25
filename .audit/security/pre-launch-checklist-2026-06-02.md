# Pre-launch security checklist — compliance log

> Date: 2026-06-02
> Scope: full AI Safe@Work platform (v1 reference + v2 MVP).
> Source: external "Ship Products, Not Liabilities" checklist for vibe coders shipping with Cursor, GPT, Bolt, Replit. Adopted verbatim into `DOCTRINE.md § Pre-launch security checklist`.
> Posture: this file is the **evidence log**; the doctrine section is the rule. Re-run every quarter and on every commit that touches a surface listed under § Procurement-readiness gates.

---

## How to read this file

| Column | Meaning |
|---|---|
| **Status** | PASS — green and verified · N/A — not applicable due to current architecture, with the trigger that would flip it to required · FIX-DEFERRED — known gap with named owner + due date · FIX-REQUIRED — blocking, must close before next commit ships |
| **Evidence** | Exact file path, grep command, header value, or screenshot reference that proves compliance |

---

## 01 — Legal & privacy

| # | Item | Status | Evidence |
|---|---|---|---|
| 1.1 | Privacy policy published | PASS | `privacy.html` at site root, 4646 bytes, last reviewed 2026-05-27. Lists every data category collected (current answer: none) in plain English. |
| 1.2 | Data storage location known | PASS | Zero user data collected by the site. Browser-local `localStorage` only (`aisw-quiz-mN`, `aisw-widget-mN`, `aisw-v2-progress`, `aisw-username`, `aisw-v2-banner-dismissed`); never transmitted. Documented in `.audit/privacy/ropa.md` and `privacy.html`. |
| 1.3 | GDPR / data-law obligations understood | PASS | Full audit pack in `.audit/privacy/`: `ropa.md`, `sub-processors.md`, `dpia-own-ai-use.md`, `breach-response-plan.md`, `retention-schedule.md`. Cookie consent N/A (no cookies set). Right-to-deletion N/A (no data held). UK + EU GDPR posture covered. |
| 1.4 | Minimal data collection | PASS | Zero collection. Adding any new collected field requires (a) RoPA update before commit and (b) explicit founder sign-off per doctrine § Audit-readiness. |
| 1.5 | Terms of service published | PASS | `terms.html` at site root, 5146 bytes, last reviewed 2026-05-27. Commercial-tier Terms extension is a launch blocker (procurement gate 18) before `pricing.html` lifts to commerce. |

---

## 02 — Security basics

| # | Item | Status | Evidence |
|---|---|---|---|
| 2.1 | OWASP Top 10 scan | PASS | `.audit/security/owasp-top10-v2-2026-05-31.md` covers all 10 items for v2 with grep-verifiable checks. v1 inherits the same posture except `'unsafe-inline'` is permitted in v1 `style-src` to keep the legacy design tokens; this is acceptable because v1 has no inline-script paths. |
| 2.2 | Security headers present | PASS | `_headers` ships, per Netlify deploy: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-XSS-Protection: 0`. `/v2/*` block adds stricter CSP + `Referrer-Policy: no-referrer`. Verification: `curl -I https://aisafework.netlify.app/v2/` (run pre-launch on canonical-domain move). |
| 2.3 | SQL injection — every input tested | N/A → triggered by first DB | No database. Trigger: introducing Supabase, Postgres, Firestore, KV, SQLite or any other persistent store. Doctrine: parameterised statements only, never string concatenation. |
| 2.4 | XSS — every input tested | PASS | `v2/assets/v2.js` uses `createTextNode` + `setAttribute` exclusively. Zero hits for `grep -nE "innerHTML\s*=" v2/assets/v2.js`. CSP `script-src 'self'` + `object-src 'none'` + `frame-ancestors 'none'` enforces. `cert.html` user-name input passes through `escapeHtml()` before display. |
| 2.5 | Auth + session handling | N/A → triggered by first account / login | No authentication anywhere. Trigger: introducing any login, magic-link, OAuth, SSO or session cookie. Doctrine: device-bound MFA, httpOnly+SameSite=Strict cookies for refresh tokens, short-TTL access tokens, refresh-token rotation, lockout-after-N-failures on every auth endpoint. |

---

## 03 — Secrets & API keys

| # | Item | Status | Evidence |
|---|---|---|---|
| 3.1 | `.env` in `.gitignore` | PASS | `.gitignore` block (lines 60–66): `.env`, `.env.*`, `!.env.example`, `*.pem`, `*.key`, `secrets/`. Confirmed nothing tracked: `git ls-files \| grep -E "\.env\|secret\|\.pem\|\.key$"` returns empty. |
| 3.2 | No keys in frontend code | PASS | No API keys exist in the project. Verified: `grep -rE "sk-[a-zA-Z0-9]{20,}"` returns zero tracked-file hits. Verified: `grep -rE "(API_KEY\|SECRET\|TOKEN)\s*=\s*['\"][a-zA-Z0-9_-]{16,}['\"]"` returns one hit in `promo-video/scripts/preflight.ts` which (a) is `.gitignore`d and (b) is the placeholder literal `sk_your_key_here` inside an instructional error message — not a real secret. Documented as false-positive. |
| 3.3 | API responses checked for leaks | N/A → triggered by first API endpoint | No API endpoints. Trigger: introducing any `/api/*` route, Netlify function, edge function, Vercel function, Lambda, or third-party API gateway. Doctrine: payment intents, customer IDs, internal record IDs and vendor-side reference numbers stay server-side. |
| 3.4 | Secrets removed from logs | PASS | Only logging is `console.warn` / `console.error` in `v2.js`. Messages: rate-limit triggers and manifest-load failures. No user input is logged. Server-side logging doctrine: never log full request bodies on paths that may carry tokens or PII; allow-listed field set only; PII redaction filter mandatory. |
| 3.5 | Keys server-side or behind proxy | N/A → triggered by first vendor API call | No third-party AI vendor is called from the site. Trigger: introducing any third-party call (OpenAI, Anthropic, Resend, Stripe, etc.) from the client. Doctrine: route through own backend, vendor key never leaves server-side env. |

---

## 04 — Abuse prevention

| # | Item | Status | Evidence |
|---|---|---|---|
| 4.1 | Rate limiting on API endpoints | N/A → triggered by first API endpoint | No API endpoints. Posture documented at `.audit/security/v2-rate-limiting-posture.md`. Client-side: `MAX_WRITES_PER_SEC = 10` defensive throttle on `localStorage` writes in `v2.js`. Edge: `Cache-Control: public, max-age=300` absorbs read bursts. |
| 4.2 | Spend alerts + hard caps on paid APIs | N/A → triggered by first paid-vendor integration | No paid APIs are called. Doctrine for when one ships: vendor-side hard cap **and** independent budget alert at 50% / 75% / 90%. Hard cap set below the founder's monthly burn tolerance. Spend dashboards reviewed weekly. |
| 4.3 | Input validation on every user-facing field | PASS | Only user-facing input today is the `cert.html` user-name field. Validated: non-empty + length-capped + `escapeHtml()` on display. `localStorage` reads (`v2.js`): regex (`/^\d+$/` on keys) + enum check on values (`'complete'` only); malformed entries dropped silently. |
| 4.4 | Basic bot protection | N/A → triggered by first signup / login / public form | No signup, no login, no public form submission. Doctrine for when one ships: Cloudflare Turnstile or hCaptcha **and** honeypot field **and** rate-limited POST per IP **and** email verification before account is usable. |
| 4.5 | Plan for abuse scenarios | PASS | Existing audit-pack files: `.audit/security/incident-log.md`, `.audit/privacy/breach-response-plan.md`, `.audit/ai/ai-incident-log.md`. Each lists the specific incident classes anticipated. A surface-specific abuse plan is required (doctrine) before any new commerce / account / upload / API surface ships. |

---

## 05 — Copy-paste security prompts (verbatim from source)

These five prompts are to be pasted into the AI assistant of choice (Claude, Cursor, ChatGPT, etc.) as the **first** action on any quarterly refresh that touches a § Procurement-readiness gate, or on any commit that introduces accounts, APIs, DBs, file uploads, or paid surfaces.

### Full security audit

> Review my app as a security specialist. Check for SQL injection, XSS, CSRF, broken authentication, and insecure direct object references. List every vulnerability with severity and fix.

### Environment & secrets check

> Scan my entire codebase for hardcoded API keys, tokens, passwords, and secrets. Check if .env files are gitignored. Check if any sensitive values are exposed in frontend code or API responses.

### Security headers

> Review my app's HTTP security headers. Make sure I have Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, and Referrer-Policy properly configured.

### Rate limiting

> Add rate limiting to all my API endpoints. Implement IP-based and user-based limits. Add exponential backoff for auth endpoints to prevent brute force attacks.

### Privacy & GDPR check

> Review my app for GDPR compliance. Check what user data I collect, where it's stored, if I have a privacy policy, cookie consent, data deletion capability, and if I'm logging any PII.

---

## Pro-tip verification — terminal grep sweep

Run pre-launch on every meaningful commit:

```bash
# OpenAI keys hiding in tracked source
grep -rnE "sk-[a-zA-Z0-9]{20,}" --include='*.js' --include='*.ts' --include='*.py' --include='*.html' --include='*.json' --include='*.md' .

# Generic secret literal assignments
grep -rnE "(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY)\s*=\s*['\"][a-zA-Z0-9_/=+-]{16,}['\"]" \
  --include='*.js' --include='*.ts' --include='*.py' --include='*.html' --include='*.json' .

# Verify nothing dangerous is tracked
git ls-files | grep -E "\.env$|\.env\.|secret|\.pem$|\.key$"

# Verify v2 has no client-side string-property HTML injection
grep -nE "innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML\(|document\.write\(|eval\(|new Function\(|setTimeout\(\s*['\"]" v2/assets/

# Verify same-origin fetch only
grep -nE "fetch\(['\"]https?://" v2/assets/

# Defensive throttle still present
grep -n "MAX_WRITES_PER_SEC = 10" v2/assets/v2.js
```

All commands must return zero hits (or, for the last one, the expected line). Recorded in this file on every quarterly run.

---

## Quarterly run-log

| Date | Run by | Result | Notes |
|---|---|---|---|
| 2026-06-02 | Founder | All applicable items PASS. All others N/A with documented trigger. No fixes required. | Initial adoption of the checklist; baseline. |
| 2026-06-02 (eve) | Founder | All applicable items PASS. Gate-bearing change: SCORM 1.2 + xAPI + i18n shell shipped. | Re-run triggered by new surface set (SCORM packaging, xAPI POST emitter, FR + DE locale subdirectories). See § Gate-bearing change log below. |
| TBD (Q3 2026) | Founder | — | Re-run on canonical-domain move + Cloudflare Pages migration. Expect at least the `Cache-Control` defaults to need re-verifying. |
| TBD (Q4 2026) | Founder | — | Re-run before any paid surface lifts from `noindex`. Will flip several N/A items to required. |

---

## Gate-bearing change log — 2026-06-02 evening

Per `DOCTRINE.md § Pre-launch security checklist`: any commit introducing a new surface / endpoint / form / dependency / third-party integration MUST log an evidence row before merge.

### Change set

1. **SCORM 1.2 packaging surface** — `v2/scorm/imsmanifest.xml`, `v2/scorm/metadata.xml`, `v2/scorm/README.md`, `v2/assets/scorm-api.js`, `scripts/build-scorm.py`, `dist/ai-safe-at-work-scorm-v2-en.zip`.
2. **xAPI (Tin Can) emitter surface** — `v2/assets/xapi-adapter.js`, `.audit/integrations/xapi-statements-spec.md`, `.audit/integrations/xapi-config-template.json`.
3. **i18n locale subdirectories** — `v2/fr/` (13 files), `v2/de/` (13 files), `v2/modules.json` extended with `ui` + `locales` blocks, `v2/assets/v2.js` extended with locale-aware manifest path + UI string lookup.

### Evidence rows

| Item | Status | Evidence |
|---|---|---|
| 1.1 Privacy policy still covers new surfaces | PASS | SCORM + xAPI fire only when buyer-side LMS / LRS is detected. Default state on attest-ai.com: both silent. No data collection added to the public site. `privacy.html` unchanged; new surfaces do not collect on the public origin. |
| 1.2 Data storage location | PASS | SCORM `cmi.*` data resides on the buyer's LMS. xAPI statements go to the buyer-configured LRS endpoint, never to our origin. `localStorage` progress unchanged. Documented in `.audit/integrations/xapi-statements-spec.md`. |
| 1.4 Minimal data collection | PASS | xAPI actor defaults to anonymous (`mbox: mailto:anonymous@attest-ai.com`) unless buyer supplies their own. No identifier captured by us. |
| 2.2 Security headers — new surfaces | PASS | xAPI POSTs use `credentials: 'omit'`. CSP `connect-src 'self'` continues to block xAPI by default; buyer-side requirement to add LRS origin is documented in `.audit/integrations/xapi-statements-spec.md` § CSP. |
| 2.4 XSS — new surfaces | PASS | `v2/assets/scorm-api.js` + `v2/assets/xapi-adapter.js` use no `innerHTML`, no `document.write`, no `eval`. Grep verified: `grep -nE "innerHTML\s*=\|document\.write\(\|eval\(" v2/assets/scorm-api.js v2/assets/xapi-adapter.js` returns zero hits. v2.js i18n extension uses `textContent` exclusively. |
| 3.2 No keys in frontend | PASS | xAPI auth header read from URL params (`?lrs=&auth=`) or `window.AISW_XAPI_CONFIG` global. Stripped from URL history after read via `history.replaceState`. No defaults committed. |
| 4.3 Input validation — new surfaces | PASS | xAPI endpoint must be `https://`; rejected otherwise. SCORM API discovery walks parent chain up to 7 levels then `window.opener`; bounded. Locale detection: pathname substring check, fixed enum `{en, fr, de}`. Module ID still validated `/^\d+$/`. |
| New: same-origin manifest fetch from locale subdirs | PASS | `manifestUrl()` in `v2.js` returns `'../modules.json'` only for paths containing `/v2/fr/` or `/v2/de/`; root pages still get `'modules.json'`. No cross-origin requests introduced. Smoke confirmed 2026-06-02 against `http://127.0.0.1:8765` — manifest 200 from both `/v2/` and `/v2/fr/` contexts. |

### Verification grep

```bash
# No new HTML-string injection in any of the new surfaces
grep -nE "innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML\(|document\.write\(|eval\(|new Function\(|setTimeout\(\s*['\"]" \
  v2/assets/scorm-api.js v2/assets/xapi-adapter.js v2/assets/v2.js

# xAPI POST is HTTPS-gated
grep -nE "endpoint.*http:" v2/assets/xapi-adapter.js  # expect zero (only the https check matches)

# SCORM zip-slip guard
grep -n "_safe_arcname" scripts/build-scorm.py

# Locale routing only via pathname substring (no untrusted URL parameter sets locale)
grep -n "detectLocaleFromPath" v2/assets/v2.js
```

### Smoke test — 2026-06-02 evening

| URL | Status | Notes |
|---|---|---|
| `/v2/index.html` | 200 | EN root landing |
| `/v2/course.html` | 200 | EN overview, grid populated from `modules.json` |
| `/v2/modules.json` | 200 | Manifest, 11 modules, locales `[en, fr, de]` |
| `/v2/fr/index.html`, `/v2/fr/course.html`, `/v2/fr/module-1.html`, `/v2/fr/module-11.html` | 200 each | FR shell, banner present, `data-module-id` preserved |
| `/v2/de/index.html`, `/v2/de/course.html`, `/v2/de/module-1.html`, `/v2/de/module-11.html` | 200 each | DE shell, banner present, `data-module-id` preserved |
| `/v2/assets/{v2.js, scorm-api.js, xapi-adapter.js}` | 200 each | Adapters served at correct path |
| `/v2/scorm/imsmanifest.xml` | 200 | SCORM CAM v1.2 manifest reachable |
| Manifest fetch from `/v2/fr/` context (`'../modules.json'`) | 200 | Locale-aware routing works |
| FR M1 title via manifest | "Pourquoi la gouvernance de l'IA compte" | Locale string lookup wired |
| DE M1 title via manifest | "Warum KI-Governance wichtig ist" | Locale string lookup wired |
| FR `markComplete` UI string | "Marquer ce module comme terminé →" | UI dictionary picked correctly |
| DE `markComplete` UI string | "Modul als abgeschlossen markieren →" | UI dictionary picked correctly |
| `dist/ai-safe-at-work-scorm-v2-en.zip` | 61227 bytes | SCORM package builds reproducibly |

### Open follow-ups (do not block this commit)

- **Native FR + DE review.** Banner declares machine-translation status on every locale page. Gate 5 closes only after native review.
- **Locale switcher polish.** Currently appears only in the topbar nav. Acceptable for MVP.
- **DE SCORM + FR SCORM packages.** `scripts/build-scorm.py --locale all` exists; per-locale zips ship when each locale gates native review.

### Sign-off (gate-bearing change)

| Role | Name | Date |
|---|---|---|
| Auditor | Founder (self-audit) | 2026-06-02 (evening) |
| Verdict | **PASS — SCORM + xAPI + i18n shell production-ready. FR + DE flagged as machine-translation pending native review on every page.** | — |

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Auditor | Founder (self-audit) | 2026-06-02 |
| Verdict | **PASS — production-ready as of this commit. Every N/A row has a documented trigger that promotes it to required the moment the architecture changes.** | — |
| Next review | Q3 2026 quarterly refresh, OR any commit that introduces a new surface listed under § Procurement-readiness gates, whichever is sooner. | — |
