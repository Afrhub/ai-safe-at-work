# Production readiness — AI Safe@Work

How to take the platform from the current single-environment dev setup to a
hardened production deployment that comfortably serves 50,000 users.

**TL;DR:** the architecture does not change for production. It is a static
frontend on a CDN plus Supabase (managed Postgres + auth) on AWS London. For
50k users you do not need a hand-managed server. You need an isolated prod
environment, a sized compute tier, custom email, the indexes, backups and
monitoring. Everything below is configuration and hygiene, not a rewrite.

---

## 1. Architecture (recap)

```
Browser (static HTML + supabase-js)
   ├─ static assets ───────────►  CDN (Netlify / Cloudflare Pages)
   └─ auth + data (HTTPS) ──────►  Supabase  (AWS eu-west-2, London)
                                     ├─ GoTrue     email+password + TOTP MFA (AAL2)
                                     ├─ PostgREST  auto REST over Postgres (pooled HTTP)
                                     └─ Postgres + Row-Level Security
```

There is no application server to operate. RLS is the security boundary; the
browser only ever holds the publishable (anon) key.

Why not a self-managed VM: a raw EC2 / Azure VM means you own OS patching,
Postgres upgrades, pooling, failover, backups, auth, email, autoscaling and
CI/CD. That rebuilds what Supabase + the CDN already provide, for higher cost
and permanent ops load, with no benefit below the hundreds-of-thousands range.
Supabase already runs on AWS, so you are on AWS without operating it.

---

## 2. Environments

Keep dev and prod fully separate. Never point the live domain at the dev
Supabase project.

| | Dev (today) | Prod (to create) |
|---|---|---|
| Supabase project | `aisafework-portals` (`hanjrsslhnuauaysbhun`) | new project, EU/London |
| Frontend | `aisafework.netlify.app` | real domain (e.g. `app.attest-ai.com`) |
| Plan | small / current | Pro + sized compute |
| Config | `portal/config.js` (dev keys) | prod `config.js` (prod publishable key) |

Promotion path: merge to `main` → deploy to the dev site → smoke test →
promote the same build to the prod site. Keep the two `config.js` values out of
each other's deploys (separate Netlify sites or a build-time env swap).

---

## 3. Provision the prod Supabase project

1. Create a new Supabase project in **eu-west-2 (London)** for UK/EU data
   residency. Choose **Pro** plan; size compute to Small or Medium to start
   (compute is a slider, raise it later without downtime concerns).
2. Apply the schema in order: `supabase/migrations/0001` → `0002` → `0003`.
3. Confirm RLS is enabled on every table and the policies match dev.
4. Copy the **publishable** key into the prod `portal/config.js`.
   The **service-role** key must never appear in the repo, the frontend, or
   any committed file. It stays in Supabase and any server-side admin tooling
   only.

---

## 4. Database

The data is small at 50k users (~50k `profiles`, ~550k `module_progress`
rows). Postgres handles this easily. The work is indexes and backups.

- **Indexes** — applied in `0003_fk_indexes.sql` (already live on dev). They
  cover the FK / lookup columns the RLS policies and portal queries use
  (`profiles.email/manager_id/reseller_id`, `deal_registrations.reseller_id`,
  `customers.reseller_id`, `commissions.reseller_id`, `seats.end_user_id`).
  Apply the same migration to prod.
- **Backups** — enable daily backups and **Point-in-Time Recovery** (Pro
  feature). Test a restore once before launch.
- **Pooling** — use the Supabase connection pooler (PgBouncer, transaction
  mode) for any server-side/admin connections. The browser path already goes
  through PostgREST, which pools.

---

## 5. Auth hardening

- **Custom SMTP (do this before any real rollout).** Supabase's built-in email
  is rate-limited to a few messages an hour. At 50k users, confirmation and
  MFA emails will throttle and onboarding stalls. Wire Resend, Amazon SES or
  SendGrid in Supabase Auth settings. This is the single most important
  scaling item after indexes.
- **Email confirmation** — keep ON for prod. Decide the redirect URLs.
- **MFA** — TOTP enrolment to AAL2 is already enforced in `login.html`. Keep it.
- **Leaked-password protection + min length** — Auth → Providers (Email): turn ON
  "Prevent use of leaked passwords" (HaveIBeenPwned; Pro-plan feature, and the org
  is on Pro) and set minimum length ≥ 10. Cheapest real anti-credential-stuffing win.
- **CAPTCHA on auth endpoints** — add Cloudflare Turnstile or hCaptcha on
  sign-up/sign-in (both tracker-free, WCAG-friendly). This is the genuine bot /
  credential-stuffing control; rate limits alone do not stop IP-rotating botnets.
- **Redirect allowlist** — set the prod site URL as the only allowed redirect.

### Auth rate limits — target values for 50k scale

At 50k users the risk is setting these **too low**, not too high. Two traps:
(1) several limits are **global per-project** (email/SMS sending), so they must
scale with the user base; (2) corporate users share one IP (NAT) — a 200-person
customer office logging in at 9am looks like 200 requests from one address, so a
tight per-IP sign-in limit locks out a whole customer on onboarding day.

Read the **unit + scope** shown next to each field (Supabase has shifted these
between per-5-min / per-hour and per-IP / global across versions); treat the
below as magnitudes, not exact strings.

| Setting | Scope | Target | Rationale |
|---|---|---|---|
| Sign-ups & sign-ins | per IP | ~150–300 / hour | Must clear a big NAT'd office onboarding at once. Default (~360/hr) is fine — don't lower it. |
| Token verification (OTP/MFA) | per IP | ≥ sign-in value | Fires on every login; same office-behind-one-IP burst. |
| Token refresh | per IP | leave default / high | Every active session refreshes ~hourly; never the throttle you want. |
| Email sending | **global** | as high as your SMTP allows (100s–1000s/hr) | The real 50k bottleneck — gated on custom SMTP below. |
| Anonymous sign-ins | per IP | low / off | Anonymous auth is unused. |

**Dependencies / order of operations:**
1. **Custom SMTP first** (see top of this section) — built-in email (~3–4/hr,
   global) throttles onboarding immediately; raise the email rate limit only
   after wiring Resend / SES / SendGrid.
2. The genuine credential-stuffing defences are **MFA (done) + leaked-password
   protection + CAPTCHA**, not the rate numbers. Tune rate limits as abuse
   guardrails, not as the primary control.

---

## 6. Frontend hosting

- Netlify (current) or Cloudflare Pages both serve the static site globally and
  scale past 50k trivially. Either is fine; Cloudflare adds a free WAF/bot layer.
- Put the prod site on the real domain with automatic HTTPS.
- Keep the per-path headers from `_headers`, especially the **portal CSP**
  (allows inline module scripts, `cdn.jsdelivr.net`, and `*.supabase.co`) and
  the strict CSP everywhere else. Update the `connect-src` to the **prod**
  Supabase project domain.
- Cache buster discipline stays (`style.css?v=`, `cinema.js?v=`).

---

## 7. Security checklist

- [ ] Service-role key absent from repo and frontend (publishable key only).
- [ ] RLS enabled + policy-reviewed on all tables; `assign_seat` is the only
      privileged write path and is manager-scoped.
- [ ] Portal CSP points at the prod Supabase domain.
- [ ] `/portal/*` served `private, no-store`; `noindex` on portal + drafts.
- [ ] Course gate: today it is a client-side localStorage funnel gate, not hard
      enforcement. If paid access must be *enforced* (not just nudged), gate the
      module content server-side (signed URLs or an edge function checking a
      seat) before charging for it.
- [ ] Dependency pinning: pin `supabase-js` to a fixed major (e.g. `@2`) — done.

---

## 8. Monitoring & DR

- Uptime check on the prod domain and `/portal/login.html`.
- Supabase database health alerts (CPU, memory, disk, connection saturation).
- Error visibility on the frontend (even a lightweight logger) for auth failures.
- Documented restore procedure from PITR; test it once pre-launch.

---

## 9. Scaling to 50k (and the levers beyond)

| Concern | Status / lever |
|---|---|
| Static frontend | CDN — effectively unlimited |
| Data volume | Tiny at 50k; Postgres unbothered |
| Read performance | **Indexes (done)** — the main fix |
| DB throughput | **Compute slider** — vertical scale, no re-architecture |
| Onboarding email | **Custom SMTP** — the real bottleneck |
| Connections | PostgREST pools; use the pooler for admin paths |
| Beyond ~100k+ | Read replicas, partition `module_progress` if ever needed |

50k users is well inside this stack's comfort zone. None of the levers above is
a rewrite; they are settings and one migration.

---

## 10. When a different stack is actually justified

Move to a managed PaaS on a specific hyperscaler **only** if an external
requirement forces it:

- A customer/procurement contract mandates AWS or Azure specifically.
- A data-residency/sovereignty clause Supabase cannot satisfy (it satisfies
  UK/EU via the London region today).
- Self-hosting is contractually required.

In those cases use the *managed* equivalents, never a raw VM:

- **AWS:** CloudFront/S3 or Amplify (static) + Cognito (auth) + Aurora/RDS
  Postgres + Lambda/API Gateway. Or self-host Supabase on AWS.
- **Azure:** Static Web Apps + Entra External ID (auth) + Postgres Flexible
  Server + Functions.

Each of these means rebuilding auth + the RLS/API layer, i.e. weeks of work.
Do not take it on without one of the requirements above.

---

## 11. Go-live checklist

1. [ ] Prod Supabase project created (London, Pro, sized compute).
2. [ ] Migrations `0001`–`0003` applied; RLS verified.
3. [ ] Custom SMTP configured and a test email delivered.
4. [ ] Prod `config.js` wired with the prod publishable key.
5. [ ] Portal CSP `connect-src` updated to the prod Supabase domain.
6. [ ] Prod Netlify/Cloudflare site on the real domain, HTTPS live.
7. [ ] Daily backups + PITR on; a restore tested.
8. [ ] Uptime + DB alerts configured.
9. [ ] Founder/admin account created and promoted; sample data seeded.
10. [ ] End-to-end smoke test: sign up → confirm email → MFA → land on the
        correct dashboard → register a deal / assign a seat → see it persist.
11. [ ] Service-role key confirmed absent from the repo.
