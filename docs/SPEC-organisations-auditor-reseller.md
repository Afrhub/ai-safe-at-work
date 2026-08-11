# Spec: organisations, the auditor role, and reseller provisioning

Written 11 Aug 2026. **Not built.** Approved in principle on 11 Aug; this exists so the three
are designed as one migration rather than three passes over the same tables.

## Why these are one change, not three

All three were approved separately. They are not separable:

- **Multi-manager** requires credits to stop living on a manager row. That means an owning
  entity, which is the organisation.
- **The auditor role** must be scoped to *an organisation*, not to a manager. Scoping it to a
  manager would break the moment a second manager exists, which is the previous item.
- **Reseller provisioning** creates a customer. If organisations exist it creates one; if not
  it creates a manager row that the organisation migration then has to rewrite.

Building them in the order they were approved means writing reseller provisioning twice.

## Prerequisites, do not skip

Two existing defects make this migration dangerous, and both are cheap next to it:

1. **`dbGet` swallows permission errors into `localStorage`.** This migration changes every
   RLS policy that matters. A policy mistake would currently present as an empty register
   rather than an error, and quietly write a customer's governance data into their browser.
   Fix before touching RLS.
2. **`governance_state` is in no migration.** The entire manager portal lives in a table the
   repo cannot reproduce. Reshaping ownership around it without a definition is guesswork.
   Capture it in a migration first.

## Current state

```
profiles(id, role, manager_id, reseller_id, full_name, email, credits_balance, created_at)
  role in ('end_user','manager','reseller')
seats            -- created only via assign_seat(p_end_user)
deal_registrations(reseller_id, stage in ('registered','qualified','won','lost'))
commissions      -- read-only to resellers, issued by admin
```

Credits sit on the manager row. `manager_id` points at one manager. `reseller_id` is the only
grouping and it means something else.

## Target schema

```sql
create table organisations (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  credits_balance  integer not null default 0,
  reseller_id      uuid references profiles(id),
  created_at       timestamptz not null default now()
);

alter table profiles add column organisation_id uuid references organisations(id);
alter table profiles drop constraint profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('end_user','manager','reseller','auditor'));
alter table profiles add column access_expires_at timestamptz;  -- auditors only
```

`profiles.credits_balance` is **kept and ignored** during the transition, then dropped in a
later migration once nothing reads it. Dropping it in the same migration means an
irreversible step in the middle of a change with several moving parts.

### Back-fill

One organisation per existing manager, named from their `full_name` or email domain, credits
copied across, `organisation_id` set on the manager and on every end user seated under them.
Two managers exist today, so this is small; write it to be idempotent anyway.

## Function changes

| Function | Change |
|---|---|
| `grant_credits(p_manager, p_amount)` | Becomes `grant_credits(p_org uuid, p_amount int)`. Credits belong to the organisation. Keep a thin wrapper on the old signature for one release so the Stripe webhook is not a flag-day change. |
| `assign_seat(p_end_user)` | Checks and decrements the caller's **organisation** balance, not their own row. Cross-tenant refusal becomes cross-organisation. |
| `record_quiz_result` | Unchanged. |
| `audit()` | Unchanged, but every new privileged function must call it. Service-role actions still have a null actor; see the open question below. |

## RLS

Every policy that currently reads `manager_id = auth.uid()` becomes "same organisation".
The auditor is **read-only and time-boxed**:

```sql
create policy auditor_reads_org on <each governance table>
for select using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.role = 'auditor'
      and p.organisation_id = <table>.organisation_id
      and (p.access_expires_at is null or p.access_expires_at > now())
  )
);
```

The expiry check lives **in the policy**, not in the application. An expired auditor must be
unable to read even if some future screen forgets to check.

Auditors get `select` only. No insert, update or delete policy is written for them at all,
which is stronger than writing one that denies.

## Reseller provisioning

New privileged function, service-role or reseller-only:

```
provision_customer(p_org_name text, p_manager_email text, p_seats int) returns uuid
```

- Creates the organisation with `reseller_id` set to the calling reseller.
- Creates or finds the manager by email, attaches them, grants the seats.
- Writes an audit row naming the reseller.
- Refuses if the caller is not a reseller, or if the manager already belongs to another
  organisation. The second check is the one that stops a reseller quietly capturing another
  reseller's customer.

Called from the reseller portal when a deal moves to `won`. The deal row gains
`organisation_id` so the link survives.

## UI, minimum viable

- **Manager portal:** an Organisation pane showing name, credit balance, and the managers
  attached. Adding a second manager is an invite, same path as seating a user but with
  `role = 'manager'`.
- **Auditor invite:** in the Governance Centre, an "Invite an auditor" action taking an email
  and an expiry date, defaulting to 30 days. A list of current auditors with revoke.
- **Auditor view:** the Governance Centre in read-only, every control hidden rather than
  disabled, plus a banner naming the organisation and the expiry date.
- **Reseller portal:** on a won deal, "Provision this customer" collecting organisation name,
  manager email and seat count.

## Tests, written before the migration

Extend `tests/suites/rls.mjs`. These are the ones that must exist, because each is a way a
customer's governance data leaks:

| ID | Assertion |
|---|---|
| ORG-01 | A manager reads only their own organisation's registers |
| ORG-02 | Two managers in one organisation both read and write it |
| ORG-03 | Seating decrements the organisation balance, not a profile |
| ORG-04 | Credits cannot go negative through concurrent seating |
| AUD-01 | An auditor reads the assigned organisation |
| AUD-02 | An auditor reads **nothing** from any other organisation |
| AUD-03 | Every write by an auditor is refused, on every table |
| AUD-04 | An auditor past `access_expires_at` reads nothing, enforced by the policy |
| AUD-05 | An auditor cannot escalate their own role or expiry |
| RSL-01 | `provision_customer` refuses a non-reseller caller |
| RSL-02 | It refuses a manager who already belongs to another organisation |
| RSL-03 | A reseller reads only organisations they provisioned |

## Sequencing

1. Fix `dbGet`. Capture `governance_state` in a migration.
2. Write the RLS tests above against current behaviour, so the migration has a baseline.
3. Migration: `organisations`, `organisation_id`, widened role check, `access_expires_at`.
4. Back-fill, idempotent.
5. Change `grant_credits` and `assign_seat`, keeping the old `grant_credits` signature as a wrapper.
6. Repoint every RLS policy. Run the tests.
7. Auditor invite and read-only view.
8. `provision_customer` and the reseller UI.
9. Drop `profiles.credits_balance` in a separate later migration.

Steps 3 to 6 are one deploy. Splitting them leaves credits in two places.

## Open questions

- **The service-role operator has no identity.** `audit_log.actor` is null for anything done
  with the service key, so provisioning is not attributable to a person. Worth solving while
  the audit surface is being extended, and it matters more once an auditor can read the log.
- **What does an auditor actually want?** A login, or a signed expiring export? This spec
  builds the login because that was the decision, but the cheaper answer may be an evidence
  pack. Worth one conversation with a real auditor before step 7.
- **Organisation rename.** The webhook names it from the checkout company field. Managers
  will want to correct it. Trivial, but decide whether renaming is audited.
