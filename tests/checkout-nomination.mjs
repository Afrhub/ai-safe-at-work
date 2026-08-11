// Who ends up holding the manager account. Worth its own check because getting this
// wrong hands a customer's governance portal to the wrong person, and the failure is
// silent: both addresses are real, both belong to the customer, and the account simply
// lands on the wrong desk.
//
// Run: node tests/checkout-nomination.mjs

import assert from "node:assert/strict";
import { managerEmailFor } from "../netlify/functions/stripe-webhook.mjs";

const session = (extra = {}) => ({
  customer_email: "finance@acme.co.uk",
  metadata: { payer_email: "finance@acme.co.uk" },
  ...extra,
});

// No nomination: the payer manages the account. The old behaviour, still the common case.
assert.equal(managerEmailFor(session()), "finance@acme.co.uk", "payer should manage when nobody is nominated");

// Nominated: the nominee wins, not the payer. This is the whole point.
assert.equal(
  managerEmailFor(session({ metadata: { payer_email: "finance@acme.co.uk", manager_email: "dpo@acme.co.uk" } })),
  "dpo@acme.co.uk",
  "the nominated manager should win over the payer"
);

// Case is normalised. Supabase stores auth emails lowercase and findOrCreateUser matches
// on equality, so a capitalised nomination would otherwise create a SECOND account and
// split the customer's credits across two profiles.
assert.equal(
  managerEmailFor(session({ metadata: { manager_email: "DPO@Acme.co.uk" } })),
  "dpo@acme.co.uk",
  "nominated address should be lowercased"
);
assert.equal(
  managerEmailFor({ customer_email: "Finance@Acme.co.uk" }),
  "finance@acme.co.uk",
  "payer address should be lowercased"
);

// Whitespace from a pasted address must not create a distinct account either.
assert.equal(
  managerEmailFor(session({ metadata: { manager_email: "  dpo@acme.co.uk  " } })),
  "dpo@acme.co.uk",
  "nominated address should be trimmed"
);

// Stripe fills customer_details when the address is collected on its own page rather
// than passed in, so that fallback has to keep working.
assert.equal(
  managerEmailFor({ customer_details: { email: "owner@acme.co.uk" } }),
  "owner@acme.co.uk",
  "customer_details fallback broke"
);

// An empty nomination must not blank the manager out. Someone tabbing through the
// optional field leaves "", and that has to fall back to the payer, not to nobody.
assert.equal(
  managerEmailFor(session({ metadata: { payer_email: "finance@acme.co.uk", manager_email: "" } })),
  "finance@acme.co.uk",
  "an empty nomination should fall back to the payer"
);

// Missing everything returns empty rather than throwing. provision() checks for this and
// refuses, which is better than a crash mid-fulfilment.
assert.equal(managerEmailFor({}), "", "an empty session should return empty, not throw");
assert.equal(managerEmailFor(undefined), "", "an undefined session should return empty, not throw");

console.log("checkout nomination: 9 checks passed");
