// Runnable check for the price resolution in create-checkout-session.mjs.
//
// This exists because of a real bug: checkout.js reuses the band keys "1-25" and
// "26-50" for BOTH plans at different prices, so matching on the band alone sent a
// Platform buyer (£2,490/yr) to Stripe at the Foundation price of £990. Caught
// before any Stripe key existed, so no money moved, but nothing here is theoretical.
//
// Run: node tests/checkout-pricing.mjs
// ponytail: assert + node, no framework, no network, no keys.

import assert from "node:assert/strict";
import { resolveBand } from "../netlify/functions/create-checkout-session.mjs";

// ── Foundation: the two priced bands resolve, at the advertised ex-VAT price ──
assert.equal(resolveBand("Foundation", "1-25 (£990/yr)").pence, 99000, "Foundation 1-25 wrong price");
assert.equal(resolveBand("Foundation", "26-50 (£1,750/yr)").pence, 175000, "Foundation 26-50 wrong price");

// ── Over 50 is quoted on headcount, never sold online ──
assert.equal(resolveBand("Foundation", "Over 50 (quote)"), null, "Over 50 should not be sold online");

// ── THE BUG: Platform bands share the Foundation band keys ──
// These must NOT resolve. If any of them returns a band, a Platform buyer is being
// charged a Foundation price.
assert.equal(
  resolveBand("Attest AI Platform", "1-25 (£249/mo, £2,490/yr)"),
  null,
  "Platform 1-25 resolved to a Foundation price"
);
assert.equal(
  resolveBand("Attest AI Platform", "26-50 (£499/mo, £4,990/yr)"),
  null,
  "Platform 26-50 resolved to a Foundation price"
);
assert.equal(resolveBand("Attest AI Platform", "Over 50 (quote)"), null, "Platform Over 50 resolved");

// ── Anything unrecognised or missing is refused rather than guessed ──
assert.equal(resolveBand("", "1-25 (£990/yr)"), null, "missing plan resolved");
assert.equal(resolveBand(null, "1-25 (£990/yr)"), null, "null plan resolved");
assert.equal(resolveBand("foundation", "1-25 (£990/yr)"), null, "plan match should be exact");
assert.equal(resolveBand("Foundation", ""), null, "empty headcount resolved");
assert.equal(resolveBand("Foundation", "nonsense"), null, "unknown band resolved");

// ── Band matching survives the labels being reworded, which is why it is a prefix ──
assert.equal(resolveBand("Foundation", "1-25 (£1,100/yr inc VAT)").pence, 99000, "prefix match broke");

console.log("checkout pricing: 12 checks passed");
