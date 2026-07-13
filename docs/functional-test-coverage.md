# Functional test coverage (Playwright)

End-to-end scenarios to automate **when Playwright is wired up** (it is not yet — no
`playwright.config`, no runner in `package.json`). This is the coverage backlog plus the
fixtures and gotchas each scenario needs. Keep it current as behaviour changes.

## Environment & fixtures

- **Site:** static HTML on Netlify (`https://aisafework.netlify.app`; canonical `attest-ai.com` when live). Portal under `/portal/*`.
- **Backend:** Supabase project `hanjrsslhnuauaysbhun` — auth, RLS, `invite-seat` Edge Function. Only the **public publishable key** ships in `portal/config.js`; never put the service-role key in tests committed to this **public** repo.
- **`AUTH_DISABLED` flag** (`portal/assets/portal.js`): while `true` (current, for inspection), portal pages **auto-sign-in the demo manager** and `login.html` skips the form. To E2E *real* auth flows, run against a deploy with `AUTH_DISABLED=false`, or drive `supabase-js` directly to set the session you want.
- **Roles & sign-in:** `manager`/`reseller` = password + TOTP MFA + self-serve reset; `end_user` (staff) = passwordless **magic link**. Provisioning: managers are admin/purchase-provisioned; staff are created by a manager's **invite-seat**.
- **Email is the automation crux.** Invite, magic-link, password-reset and any future publish notifications send via Supabase email, which needs **custom SMTP (AUTH-1, not yet configured)** and is otherwise rate-limited. Until then, tests must either:
  - provision/confirm accounts **directly in the DB** (bcrypt password + `email_confirmed_at` set) and assert the in-app result rather than the inbox; or
  - use the Supabase **admin `generateLink`** API to obtain the action URL without sending an email; or
  - use a mailbox service (Mailosaur / Mailslurp) once SMTP points somewhere testable.
- **Test data hygiene:** create disposable manager/staff rows via SQL; clean up by deleting the `auth.users` row (cascades `profiles`, `seats`, `module_progress`, `governance_acks`).

## Coverage backlog (detail as automated)

- FT-AUTH-01 — password sign-in + TOTP enrol/challenge (manager/reseller)
- FT-AUTH-02 — magic-link sign-in (staff)
- FT-AUTH-03 — password reset lands on the set-new-password form and stays (recovery race)
- FT-INVITE-01 — manager invites a seat (below)
- FT-GOV-ACK-01 — publish policy → staff acknowledges → manager % updates (below)
- FT-GOV-CRUD-01 — dashboard doc-pack status + risks/incidents/use-cases/vendors add/edit/delete
- FT-TRAIN-01 — module completion syncs to `module_progress` and the manager completion + AI-literacy tiles
- FT-DEMO-01 — Book-a-Demo form submits and records to Netlify Forms

---

## FT-INVITE-01 — Manager invites a seat; staff joins via the invite email

**What it proves:** a manager can bring a staff member in, and that is the **only** email in the staff journey (one invite, at the start).

**Actors:** Manager (authenticated, ≥1 credit) · new staff email.

**Preconditions:** a manager account with credits; `AUTH_DISABLED=false` on the target deploy (otherwise the invite Edge Function blocks the demo account by design); SMTP configured **or** the invite link captured via a mailbox service / `generateLink`.

**Steps:**
1. Sign in as the manager → open `/portal/manager.html`.
2. In **Invite your team**, enter a fresh staff email → **Invite team member**.
3. Assert the UI shows "Invite sent…" and the manager's **credits decrement by 1** and **Seats assigned increments by 1**.
4. Retrieve the invite email / action link (mailbox service or `generateLink`), open it.
5. Assert the staff lands authenticated on the staff portal (`/portal/end-user.html`).

**Expected:** staff account created + seated under the manager; exactly **one** email sent (the invite); staff can now reach their portal.

**Gotchas:** invite of an already-existing email takes the "existing user" branch (no email, still seats them → 200 `invited:false`). Duplicate invite → 409. Demo account is blocked from inviting (403) as anti-spam while `AUTH_DISABLED`.

---

## FT-GOV-ACK-01 — Publish a policy; staff sees it in-portal and acknowledges (no email on publish)

**What it proves:** policy delivery to staff is **pull, not push** — publishing a document to **Live** surfaces it in the staff portal on next visit, with **no email sent on publish**; acknowledging it feeds the manager's dashboard.

**Actors:** Manager · one seated staff member (from FT-INVITE-01, or provisioned + seated via SQL).

**Preconditions:** manager with ≥1 seated staff; a governance document in the manager's pack.

**Steps:**
1. **As manager** (`/portal/governance.html`): in the **Document pack** table, tap a document's status pill until it reads **Live** (Draft → Ready → Live). Note the **Staff acknowledgement** tile denominator now includes this live doc (e.g. `0/1 across 1 staff`, `0%`).
2. Assert **no outbound email** is triggered by publishing (no message to the staff address; nothing queued). Publishing is a pure DB status change.
3. **As the staff member** (sign in → `/portal/end-user.html`): in **Company governance**, assert the newly-live policy appears with a **Read →** link and an **Acknowledge** button, and did **not** require any email/notification to surface — it is present purely because status = Live and the staff member is seated (RLS `gd_seat_read`).
4. Click **Acknowledge**. Assert the card flips to **Acknowledged** (badge, no button).
5. **As manager** (reload `/portal/governance.html`): assert the **Staff acknowledgement** tile updates to reflect the acknowledgement (e.g. `1/1 across 1 staff`, `100%`).

**Expected:**
- Moving a doc to **Live** is the trigger that makes it visible to staff; Draft/Ready docs are **not** shown to staff.
- **Nothing is emailed on publish** — staff discover the policy only by opening their portal (the known gap; a future "notify staff on publish" depends on SMTP/AUTH-1).
- Acknowledgement is per staff member (`governance_acks` unique on `(doc_id, end_user_id)`); the manager metric = acks ÷ (seats × live docs).

**Gotchas:**
- Only **Live** docs appear to staff and count toward acknowledgement; toggling a doc back to Draft/Ready removes it from the staff view and the denominator.
- A staff member can only acknowledge their own manager's docs (RLS `ga_staff_ins` checks the seat) and only see/write their **own** acks.
- Under `AUTH_DISABLED`, the demo (manager) viewing `end-user.html` has no seat, so the Company-governance list is empty — use a genuinely seated staff session for this scenario.
