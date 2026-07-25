# User flows

Three personas, plotted against what the build actually does today (24 Jul 2026).
Steps marked **[BLOCKED]** cannot complete on the live site right now; the cause
is named each time. Steps marked *(roadmap)* have no implementation yet.

Auth model, verified in `portal/assets/login.js`:

| Persona | Sign-in | MFA | Lands on |
|---|---|---|---|
| Reseller / Partner | Password | TOTP required | `portal/reseller.html` |
| Client — Manager | Password | TOTP required | `portal/manager.html` |
| Client — User (staff) | Passwordless magic link | None | `portal/end-user.html` |

Staff are deliberately low-privilege and passwordless: they read the policy,
acknowledge it, and take the course. Nothing they can reach is worth an MFA
prompt, and a password would depress completion.

---

## 1. Reseller / Partner

**Goal:** sell Foundation and Platform into their own client base, and get paid.

1. Finds `msp.html` ("Become a Partner") from the nav pill or footer.
2. Reads the programme: partner discount, volume rebates, free NFR licences,
   deal registration, co-brandable marketing, consultancy referral fee.
   Commercial figures are deliberately absent — they live behind the portal.
3. Submits the partner-enquiry form. **[BLOCKED]** The form records to Netlify
   but emails nobody. Nothing tells the founder an enquiry arrived.
   → HANDOFF blocker 0a.
4. Founder qualifies them, agrees terms offline, creates a `reseller` account.
   *(Manual by design for now — no self-serve partner signup.)*
5. Signs in, enrols TOTP, lands on the reseller portal.
6. Reads the rebate structure: tier table, wholesale per seat, Governance Pack
   margins, annual margin curve. **This is the only place those numbers exist.**
7. Takes the Partner / IT Admin track using NFR seats, self-certifies.
8. Registers a deal *(roadmap — the section is a preview; deals are tracked in a
   shared spreadsheet with the founder today).*
9. Sells to a client. Client is onboarded as a Manager (flow 2).
10. Rebate reconciled quarterly *(roadmap — manual today).*

**Weakest link:** steps 3 and 8. A partner who wants in cannot be detected, and
a partner who is in cannot self-serve a deal. Both are manual, which is fine at
low volume and fatal at scale.

---

## 2. Client — Manager

**Goal:** stand up AI governance, prove it, keep it current.

### Buy
1. Arrives on `index.html`, reads the three plan cards, clicks through to
   `pricing.html`.
2. Compares Foundation vs Platform. May click **Try the demo →** into
   `portal/demo.html` — the real platform, sandboxed to sessionStorage with
   seeded data.
3. Orders via `checkout.html` (Foundation) or contacts sales (Platform, 100+).
4. **[BLOCKED]** The `foundation-order` form emails nobody. An order sits in the
   Netlify dashboard until someone thinks to look. → HANDOFF blocker 0a.
5. Founder invoices manually, creates the `manager` account.
   **[BLOCKED]** No card payment path. → HANDOFF blocker 0b.

### Set up (first session, ~an hour)
6. Signs in, enrols TOTP, lands on the manager portal.
7. **Acceptable Use Policy** — fills the fields (each names the policy section it
   fills), saves. Draft version increments on every save.
8. Publishes the policy. Draft version is promoted to live; this is what makes
   staff acknowledgements count.
9. **Roles Matrix (RACI)** and **Steering Group ToR** — names who is accountable.
10. **Staff & Sign-off** — invites staff. Spends a credit per seat via the
    `invite-seat` Edge Function. **[BLOCKED]** Invites are magic-link emails and
    SMTP is unconfigured, so this is rate-limited to near-unusable.
    → HANDOFF item 5 (AUTH-1). *This blocks the entire staff flow below.*

### Onboard an AI tool (the loop that repeats)
11. **Vendor Due Diligence** — sends the 19-question checklist to the supplier.
12. **Vendor Risk Score** — scores seven areas when answers return, records
    go/no-go. Shows on the vendor row as Approve / with conditions / Reject.
13. **Use Case Register** — logs the approved tool as a use case.
14. **Risk Assessments** — assesses it: EU AI Act tier, five scored dimensions,
    mitigations, decision. **The rating flows back automatically** to the use
    case (worst score wins) and the register shows "from assessment".
15. **AI Risk Register** — logs anything that needs tracking, with an owner and
    a due date, optionally linked to the use case.

### Ongoing (monthly, ~30 min)
16. Opens the dashboard. Works the **Needs attention** list: unassessed use
    cases, overdue mitigations and reviews, vendors due re-assessment,
    unrecorded conditions, open incidents, unacknowledged staff, unapproved ToR.
17. **Copy digest / Email digest** to share with the steering group.
    *(Automatic weekly send is roadmap — `docs/weekly-digest.md`.)*
18. Logs **Incident Reports** as they occur.

### Quarterly
19. Steering group meets against the dashboard. Print/Export for the evidence
    pack. Policy edits bump the draft version; re-publishing asks everyone to
    acknowledge again.

---

## 3. Client — User (staff)

**Goal:** understand the rules, prove they understood, get back to work.
Total time ~90 minutes, once, then an annual refresher.

1. Receives a magic-link invite from their manager.
   **[BLOCKED]** SMTP unconfigured — see step 10 above. **This flow cannot start
   on the live site today.**
2. Clicks the link, signs in passwordless, no MFA, lands on `end-user.html`.
3. **Company governance** — reads the published policy. The nav shows a count of
   what is pending, so it is obvious what is outstanding.
4. Acknowledges it. Written to `governance_acks`, keyed to the policy version —
   which is why re-publishing asks for a fresh acknowledgement.
5. **Module Progress** — works through the AI Safe@Work course, eleven modules,
   quiz per module. Progress syncs via the `set_module_progress` RPC.
6. Optionally takes a **role track** (Manager, DPO, Copilot, Shadow AI,
   Procurement) or a **sector overlay**.
7. **Certificate** — generated on completion. This is a course completion
   certificate, *not* certification against any standard.
8. Manager sees completion on their dashboard; the acknowledgement count feeds
   the exception list.
9. Annual refresher.

---

## What this tells us about the next three roadmap items

**In-product guides (item 4).** The moments that need one are the moments above
where a first-time user has to know something the screen does not say:

- Manager step 7 — that fields fill numbered policy sections *(partly solved: the
  form now labels each group)*
- Manager step 8 — what publishing does to acknowledgements
- Manager steps 11→15 — that this is one sequence, not five unrelated screens.
  **This is the highest-value guide.** Nothing on screen says vendor diligence
  leads to a use case leads to an assessment.
- Manager step 14 — that the rating is derived and why the select is locked
- Staff step 4 — why acknowledging matters and what happens if the policy changes

**Onboarding automation (item 5).** Steps 3–5 of the Manager flow are entirely
manual and email-blocked. Automating them means, in order: a mail provider, a
payment path, then account provisioning on payment. The first two are the same
blockers as everything else — **there is no automation to build until mail and
payment exist.**

**Support model (item 6).** The questions a bot would field are the guide
moments above plus "how do I get my staff in?" — which today has the honest
answer "the founder does it by hand". Fix the blockers first or the bot's most
common answer is an apology.

---

## Summary of blockers, by flow

| Flow | Step | Blocker | HANDOFF ref |
|---|---|---|---|
| Reseller | Enquiry | Form emails nobody | 0a |
| Reseller | Deal registration | Not built, spreadsheet | roadmap |
| Manager | Order | Form emails nobody | 0a |
| Manager | Payment | No card path, manual invoice | 0b |
| Manager | Invite staff | SMTP unconfigured | item 5 |
| Staff | Everything | Depends on the invite above | item 5 |

One mail provider unblocks four of these six.
