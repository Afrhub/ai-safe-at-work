# Attest AI, open action items

Opened 31 Jul 2026. Everything below came out of the test-plan build, the automated
suites, or the self-review of that session's diff. Tick items off in place.

`🧑` = only Alastair can do it (money, domain, DNS, dashboards, accounts).
`🤖` = Claude can do it on request.

Lives in `docs/`, which `netlify.toml` 404s, because it names security defects.

---

## P0, must fix before Stripe takes real money

- [x] 🤖 **`stripe-webhook.mjs:79` `releaseEvent` cannot report its own failure.** `fetch`
      resolves on 4xx/5xx, so the `try/catch` only sees network errors. A failed DELETE
      leaves the event claimed, Stripe's retry sees a duplicate and skips, and the
      customer has paid for nothing with no error logged anywhere. Check `r.ok`.
- [x] 🤖 **`stripe-webhook.mjs:87` `findOrCreateUser` falls through on a failed lookup.**
      A transient Supabase 500 creates a duplicate account instead of failing. Throw on
      `!found.ok`.
- [x] 🤖 **`checkout-stripe.js:34` defaults a missing plan to Foundation.** If
      `checkout.js` fails to load, a Platform visitor takes the Foundation price path.
      Default to `""` and let the guard refuse. Fail closed, not to the cheaper plan.
- [ ] 🧑 **Decide VAT.** `VAT_RATE` is unset, so the advertised ex-VAT price is charged
      as-is. If VAT registered and this ships unset, you absorb the VAT on every sale.

## P1, revenue is leaking today

- [ ] 🧑 **Turn on Netlify form notifications.** Free, dashboard only, minutes. Nothing on
      the site tells anyone a form was submitted. Route `order`, `demo` and
      `partner-enquiry` to James@attest-ai.com. The new `demo.html` depends on this.
- [ ] 🧑 **Delete the orphaned forms** `tier1-order` and `foundation-order`. They still
      accept submissions nobody watches.
- [ ] 🧑 **Delete the test form submissions** made 25 Jul.
- [ ] 🧑 **Point `attest-ai.com` at Netlify.** Add the domain in Netlify FIRST, let the
      certificate provision, then add the records at 123-Reg, then set it primary.
      Until this happens every canonical, the sitemap, `robots.txt` and `llms.txt` all
      tell Google the real site lives on a parking page.
- [ ] 🤖 **Fix the `pricing.html` robots contradiction.** Meta says `index`, sitemap
      lists it, the header sends `noindex` and wins. The priced page cannot be found.
      Two tests fail on this (SEO-01, SEO-03). Needs a decision on which of the three
      changes.

## P2, blocks customers actually getting in

- [ ] 🧑 **Custom SMTP via Resend (AUTH-1).** No invite, magic link or password reset is
      delivered without it. Needs the domain above for SPF, DKIM and DMARC.
- [ ] 🧑 **Raise the Supabase auth email rate limit** once SMTP is live.
- [ ] 🧑 **Add the portal sign-in URL to the Supabase redirect allowlist.**
- [ ] 🧑 **JC McKenny: first sign-in.** Auth is armed, his password works. He must do the
      first sign-in himself, because it forces TOTP enrolment and whoever completes it
      holds the authenticator secret.
- [ ] 🧑 **Decide JC's seat credits.** Currently 0, so he can sign in but cannot invite.
- [ ] 🧑 **Stripe: create the account, verify the business, enable Bacs.** Days of
      waiting, so start early.
- [ ] 🧑 **Add the Netlify env vars**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
      `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
- [ ] 🧑 **Register the Stripe webhook** at `/.netlify/functions/stripe-webhook`,
      subscribed to `checkout.session.async_payment_succeeded` and
      `checkout.session.completed`.

## P3, defects found by the test suite

- [ ] 🤖 **The interactive risk figure is dead on all 18 module pages.** Inline script,
      blocked by `script-src 'self'`. Same root cause as the certificate bug. A teaching
      element in a paid course that has never worked.
- [ ] 🤖 **The standards-map coverage matrix is dead**, same cause.
- [ ] 🤖 **Skip link renders at `top: -85px` when focused** (NAV-08). It takes keyboard
      focus but is invisible, on a site selling accessibility compliance.
- [ ] 🤖 **Heading levels skip `h2 → h4`** in the footer on most pages (A11Y-04).
- [ ] 🤖 **Widen the CSP test to every page.** It samples 12, so 17 of the 18 broken
      module pages fail outside coverage. This is exactly how the certificate bug
      survived to production.

## P4, code review leftovers, not urgent

- [ ] 🤖 `stripe-webhook.mjs:41` non-numeric `t` makes the replay window `NaN`, which
      silently skips the check. HMAC still saves it. Add `Number.isFinite`.
- [x] 🤖 `stripe-webhook.mjs:16` comment still says `AUTH_DISABLED is still true`. It was
      flipped to false the same day.
- [ ] 🤖 Band keys duplicated between `stripe-webhook.mjs:24` and
      `create-checkout-session.mjs:18-19`. Add a band to one and checkout takes money
      that fulfilment throws on. Extract to one module.
- [ ] 🤖 `stripe-webhook.mjs:110-125` `grant_credits` is additive but the error path
      releases the event, so a retry re-runs it. Safe today because nothing throws after
      the grant. Any line added below it double-grants.
- [ ] 🤖 `stripe-webhook.mjs:120` `full_name` PATCH result unchecked.
- [ ] 🤖 `checkout.html` button says "Buy Foundation", copy above promises an invoice.
      Pick one story. The Over-50 band also says "Buy" but receives a quote.
- [ ] 🤖 `checkout-thanks.html` has two `<meta name="robots">` tags with different values.
- [ ] 🤖 CTA casing drift, "Book a Demo" vs "Book a demo".

## Known structural gaps, decisions not yet made

- [ ] 🤖 **`dbGet` swallows permission errors into `localStorage`.** An RLS mistake would
      quietly move a customer's governance data into their own browser and look like an
      empty register. Fix before anything depends on who can read what.
- [ ] 🤖 **`governance_state` is in no migration.** The entire manager portal lives in a
      table the repo cannot reproduce.
- [ ] 🤖 **`invite-seat` edge function source is not in the repo.**
- [ ] 🧑 **Which acknowledgement store is authoritative**, `governance_state` or
      `governance_acks`? They are unlinked, so a staff sign-off may never show on the
      manager roster.
- [ ] 🧑 **Staff cannot open the sign-off page at all**, `guard(["manager"])` bounces
      them. Inherited from the claude.ai artifact this screen was ported from.
- [ ] 🧑 **Platform plan has no online payment path.** Falls back to the invoice form by
      design. Decide whether to wire it (subscription mode, its own tests).

---

## Current test state

`node tests/run-all.mjs` — 110 checks. Browser suite needs Playwright resolved from
`~/projects/mlr`.

| Suite | State |
|---|---|
| pricing logic | 12 pass |
| webhook signature | 9 pass |
| exposure and headers | 26 pass |
| public site | 40 pass, 2 fail (pricing.html robots), 6 skip (destructive) |
| authorisation | 15 pass |
| browser | 65 pass, 4 fail |
