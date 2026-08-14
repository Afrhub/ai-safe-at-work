# Launch runbook — from demo-ready to taking money

Written 14 Aug 2026. Target chosen: **paying customers**. Everything below is 🧑 work —
dashboards, DNS and accounts only you can touch. Do the phases in order: each one's checks
must pass before the next starts. Times are working time, not elapsed; Stripe's Bacs
verification is days of *waiting*, so Phase 0 starts it first.

The code side is done and verified: 246 checks green across nine suites, three journeys
proven end to end against production. Nothing here needs a code change; where a value must
match the code, it is quoted exactly.

---

## Phase 0 — start the clocks (10 min, then days of waiting)

1. **Create the Stripe account** at dashboard.stripe.com → verify the business →
   **enable Bacs Direct Debit** (Settings → Payment methods). Verification takes days;
   nothing else blocks on it, so do this first and let it run.

## Phase 1 — the domain (20 min + certificate wait)

Order matters: **Netlify first**, then 123-Reg. Adding DNS records before Netlify knows
the domain leaves the cert unprovisioned and the site serving warnings.

2. Netlify → site `aisafework` → Domain management → **Add domain `attest-ai.com`**
   (+ `www.attest-ai.com`). Netlify shows the required records.
3. Wait for Netlify to show the domain as awaiting DNS, then at **123-Reg** replace the
   parking records with what Netlify listed — normally:
   - `A` apex `attest-ai.com` → `75.2.60.5`  *(use the value Netlify shows if different)*
   - `CNAME` `www` → `aisafework.netlify.app`
4. Back in Netlify: wait for the **HTTPS certificate** to provision (minutes to ~1 h
   after DNS propagates), then set `attest-ai.com` as **primary domain**.
5. ✅ Check: `https://attest-ai.com/` serves the site with a padlock, and
   `https://aisafework.netlify.app` redirects to it. Every canonical, the sitemap and
   robots.txt already point at attest-ai.com, so nothing else moves.

## Phase 2 — email (30 min, needs Phase 1)

6. **Resend**: add domain `attest-ai.com` → it lists SPF + DKIM records → add them at
   123-Reg → wait for Resend to show **Verified**. Add the DMARC record it suggests.
7. **Supabase** (`hanjrsslhnuauaysbhun`) → Authentication → SMTP: enable custom SMTP with
   Resend's credentials. Sender: `no-reply@attest-ai.com` (or similar on the domain).
8. Supabase → Authentication → **Rate limits**: raise the email rate limit from the
   default 2/hour (invites + resets share it).
9. Supabase → Authentication → **URL configuration**: add
   `https://attest-ai.com/portal/login.html` to the redirect allowlist
   (keep the aisafework.netlify.app one during transition).
10. ✅ Check: from the portal sign-in page, "Forgot your password?" on your own account
    delivers an email to an inbox you control, from your domain, and the link lands on
    the reset form.

## Phase 3 — Stripe wiring (20 min, needs Phase 0 verified)

11. Netlify → Site configuration → **Environment variables**, add all four:
    | Name | Value |
    |---|---|
    | `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys (live secret) |
    | `STRIPE_WEBHOOK_SECRET` | created at step 12, come back and fill it |
    | `SUPABASE_URL` | `https://hanjrsslhnuauaysbhun.supabase.co` |
    | `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role key |
12. Stripe → Developers → **Webhooks** → Add endpoint:
    - URL: `https://attest-ai.com/.netlify/functions/stripe-webhook`
    - Events, exactly these two: `checkout.session.completed`,
      `checkout.session.async_payment_succeeded`
    - Copy the signing secret into `STRIPE_WEBHOOK_SECRET` (step 11), then **redeploy**
      the site so the functions pick the variables up.
13. **Decide VAT before the first real charge** (deferred decision, recorded in
    ACTION-ITEMS): if VAT registered, say so and `VAT_RATE` goes in as a one-line change;
    unset means the advertised ex-VAT price is charged as-is and you absorb the VAT.
14. ✅ Check: a real £990 Foundation checkout with your own bank details in Stripe's
    test-then-live progression: Stripe session created (no 503), webhook fires,
    a manager account exists with 25 credits, fulfilment email arrives. Refund it.

## Phase 4 — the inbox actually watched (10 min)

15. Netlify → Forms → **notifications**: route `order`, `demo` and `partner-enquiry`
    to James@attest-ai.com.
16. Delete the orphaned forms `tier1-order` and `foundation-order`, and the seven test
    submissions from 25–31 Jul.
17. ✅ Check: submit the demo form yourself; the notification email arrives.

## Phase 5 — first real customer (JC) (15 min)

18. Supabase → decide and set **JC's seat credits** (currently 0: he can sign in but
    cannot invite staff).
19. JC does his **own first sign-in** — it forces TOTP enrolment and whoever completes
    it holds the authenticator secret, so it must be him, not you.
20. ✅ Check: JC invites one member of staff; the invite email arrives (Phase 2 made
    that real); the staff member enrols, completes a module, and JC sees the progress
    on his roster.

---

## Standing risks accepted at launch (decisions made 14 Aug 2026)

- **Role-track modules have no videos** and the copy implies every module has one.
  Decision: leave the copy, render videos later. Risk owner: sales calls.
- **Legal-currency review cadence** still undecided (P0c): the product promises staying
  current; the Omnibus caught the content out once already. Belongs in the audit pack
  cadence as a quarterly check.
- **Platform plan has no online payment path** (invoice form by design).

## What the tests cannot cover until this runbook is done

- Invite → email → first sign-in (needs Phase 2). The onboarding suite starts where the
  email lands a person; bolt a mailbox check on the front once SMTP exists.
- A real paid fulfilment end to end (needs Phase 3). The webhook, pricing and nomination
  logic are covered by 30 unit checks; the live wire needs one real transaction, step 14.
