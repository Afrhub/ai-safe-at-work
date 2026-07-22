# Weekly governance digest

## What exists now (working)

The manager dashboard composes a plain-text digest from the same rules that
drive the **Needs attention** list, plus a summary footer (policy version,
staff acknowledgement count, register totals).

Two buttons on the attention card:

- **Copy digest** — puts the text on the clipboard
- **Email digest** — opens a prefilled email in the user's mail client

Composed client-side in `portal/assets/aimp.js` → `digestText()`. No
infrastructure, no keys, works today. It is **pull, not push**: someone has to
open the platform and click.

## What is not built (the push)

Nothing on this site sends mail. There is no mail provider, no API key, no
scheduled job. A weekly digest that arrives on its own needs all three, and the
first two are account and billing actions that only the founder can take.

See the BLOCKER at the top of `HANDOFF.md` — this is the same gap that stops
order notifications arriving.

## To make it send automatically

In order. Steps 1 and 2 are yours.

1. **Mail provider.** Whatever is chosen for `hello@` and `James@` will do.
   For transactional send specifically, an API-based provider (Resend, Postmark,
   SendGrid) is easier than SMTP from a serverless function.
2. **Secrets in Netlify** (Site settings → Environment variables):
   - `MAIL_API_KEY` — from the provider
   - `DIGEST_TO` — where the digest goes
   - `SUPABASE_SERVICE_KEY` — needed to read `governance_state` outside a user
     session. **Service key, not the publishable one.** It bypasses RLS, so it
     belongs only in Netlify env, never in `portal/config.js` or any client file.
3. **Scheduled function.** `netlify/functions/weekly-digest.mts` with a
   schedule of `0 8 * * MON`. It should:
   - read `governance_state` for each manager
   - run the same rules as `attentionItems()`
   - skip managers with nothing outstanding (a digest that always arrives and
     always says "nothing" gets filtered within a month)
   - POST to the provider

**The rules must not be reimplemented.** They live in `attentionItems()` and
`digestText()`. Two copies of "what counts as overdue" will drift, and the
version a customer is emailed will stop matching the one on their dashboard.
Extract the shared logic into a module both import before writing the function.

## Design note

The digest deliberately reports exceptions, not activity. "3 use cases logged"
is a fact about the database; "1 use case has no assessment, 2 mitigations
overdue" is a to-do list. Nobody opens a weekly email of counts twice.
