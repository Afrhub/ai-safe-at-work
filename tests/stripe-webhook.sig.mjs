// Runnable check for the one piece of the payment path that is pure logic and
// security-critical: Stripe webhook signature verification. If this breaks, anyone
// who finds the endpoint URL can POST fake JSON and grant themselves seat credits.
//
// Run: node tests/stripe-webhook.sig.mjs
// ponytail: assert + node, no framework. It needs no network, no Stripe and no keys.

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifySignature } from "../netlify/functions/stripe-webhook.mjs";

const SECRET = "whsec_test_not_a_real_secret";
const BODY = JSON.stringify({ id: "evt_1", type: "checkout.session.async_payment_succeeded" });

const sign = (body, secret, t) =>
  `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

const now = () => Math.floor(Date.now() / 1000);

// A genuine, current signature is accepted.
assert.equal(verifySignature(BODY, sign(BODY, SECRET, now()), SECRET), true, "valid signature rejected");

// A tampered body is rejected: this is the actual attack, a forged payment event.
const tampered = JSON.stringify({ id: "evt_1", type: "checkout.session.async_payment_succeeded", extra: 1 });
assert.equal(verifySignature(tampered, sign(BODY, SECRET, now()), SECRET), false, "tampered body accepted");

// Wrong secret is rejected.
assert.equal(verifySignature(BODY, sign(BODY, "whsec_wrong", now()), SECRET), false, "wrong secret accepted");

// Replay of an old-but-genuine delivery is rejected (5 minute tolerance).
assert.equal(verifySignature(BODY, sign(BODY, SECRET, now() - 600), SECRET), false, "replay accepted");

// A delivery carrying several v1 signatures passes if any one matches, which is how
// Stripe presents a secret mid-rotation.
const t = now();
const multi = `${sign(BODY, "whsec_old", t)},v1=${createHmac("sha256", SECRET).update(`${t}.${BODY}`).digest("hex")}`;
assert.equal(verifySignature(BODY, multi, SECRET), true, "rotation signature rejected");

// Malformed and missing headers are rejected rather than throwing.
assert.equal(verifySignature(BODY, "", SECRET), false, "empty header accepted");
assert.equal(verifySignature(BODY, null, SECRET), false, "null header accepted");
assert.equal(verifySignature(BODY, "garbage", SECRET), false, "garbage header accepted");
assert.equal(verifySignature(BODY, `t=${now()}`, SECRET), false, "header with no v1 accepted");

console.log("stripe-webhook signature: 9 checks passed");
