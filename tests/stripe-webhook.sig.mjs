// Runnable check for the one piece of the payment path that is pure logic and
// security-critical: Stripe webhook signature verification. If this breaks, anyone
// who finds the endpoint URL can POST fake JSON and grant themselves seat credits.
//
// Run: node tests/stripe-webhook.sig.mjs
// ponytail: assert + node, no framework. It needs no network, no Stripe and no keys.

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import handler, { verifySignature, sendWelcome } from "../netlify/functions/stripe-webhook.mjs";

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

// sendWelcome runs AFTER grant_credits, so it must never throw: a throw releases the
// event, Stripe retries, and the additive grant credits the manager twice.
process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SERVICE_KEY = "service-key";
const realFetch = globalThis.fetch;
let seen;
globalThis.fetch = async (url, init) => { seen = { url, init }; return new Response("{}", { status: 200 }); };
assert.equal(await sendWelcome("buyer@example.com"), true, "2xx not reported as sent");
assert.match(seen.url, /\/auth\/v1\/recover\?redirect_to=https%3A%2F%2Fattest-ai\.com%2Fportal%2Flogin\.html$/, "wrong endpoint or redirect");
assert.equal(JSON.parse(seen.init.body).email, "buyer@example.com", "email not in body");
assert.equal(seen.init.headers.apikey, "service-key", "service key not sent");

globalThis.fetch = async () => new Response("rate limited", { status: 429 });
assert.equal(await sendWelcome("buyer@example.com"), false, "non-2xx not reported");

globalThis.fetch = async () => { throw new Error("ECONNRESET"); };
assert.equal(await sendWelcome("buyer@example.com"), false, "network error escaped");
globalThis.fetch = realFetch;

console.log("stripe-webhook welcome email: 6 checks passed");

// ── Fulfilment is one transaction; a retry never grants twice ────────────────────────
// A mock of the database side: stripe_events as a Set, credits as a counter. The handler is
// driven twice with the same signed paid event, with the welcome send failing on the first
// delivery. The old code released the claim on that throw and the retry granted again.
process.env.STRIPE_WEBHOOK_SECRET = SECRET;
const db = { events: new Set(), grants: 0, rpcCalls: 0, lookups: 0, deletes: 0, welcomeFail: true, lookupFail: false, rpcFail: false };
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.includes("/rest/v1/profiles?email=")) {
    db.lookups++;
    return db.lookupFail ? new Response("boom", { status: 500 }) : new Response(JSON.stringify([{ id: "u1" }]), { status: 200 });
  }
  if (u.includes("/rest/v1/rpc/fulfil_stripe_event")) {
    db.rpcCalls++;
    if (db.rpcFail) return new Response("db down", { status: 500 });
    const b = JSON.parse(init.body);
    if (db.events.has(b.p_event_id)) return new Response(JSON.stringify({ duplicate: true }), { status: 200 });
    db.events.add(b.p_event_id); db.grants++;
    return new Response(JSON.stringify({ duplicate: false, credits: b.p_amount }), { status: 200 });
  }
  if (u.includes("/auth/v1/recover")) {
    if (db.welcomeFail) throw new Error("ECONNRESET");
    return new Response("{}", { status: 200 });
  }
  if (init.method === "DELETE") { db.deletes++; return new Response("[]", { status: 200 }); }
  throw new Error("unexpected fetch " + u);
};
const paid = JSON.stringify({ id: "evt_paid_1", type: "checkout.session.async_payment_succeeded",
  data: { object: { customer_email: "buyer@example.com", payment_status: "paid", metadata: { headcount_band: "1-25", contact: "Buyer Name" } } } });
const deliver = (body) => handler(new Request("https://attest-ai.com/.netlify/functions/stripe-webhook", {
  method: "POST", body, headers: { "stripe-signature": sign(body, SECRET, now()) } }));

let r = await deliver(paid);
assert.equal(r.status, 200, "first delivery should be 200 even though the welcome send failed");
assert.equal(db.grants, 1, "first delivery grants once");
db.welcomeFail = false;
r = await deliver(paid);
assert.equal(r.status, 200, "redelivery should be 200");
assert.equal(await r.text(), "duplicate", "redelivery should read as duplicate");
assert.equal(db.grants, 1, "REDELIVERY GRANTED AGAIN");
assert.equal(db.deletes, 0, "nothing should ever release a claim");

// Transaction failure: 500 so Stripe retries, and nothing was claimed.
db.rpcFail = true;
const paid2 = paid.replace("evt_paid_1", "evt_paid_2");
r = await deliver(paid2);
assert.equal(r.status, 500, "db failure should 500");
assert.equal(db.events.has("evt_paid_2"), false, "failed fulfilment must not leave a claim");
db.rpcFail = false;
r = await deliver(paid2);
assert.equal(r.status, 200); assert.equal(db.grants, 2, "retry after db failure grants exactly once");

// A failed profile lookup stops before any grant: no second account, no credits.
db.lookupFail = true; const before = db.rpcCalls;
r = await deliver(paid.replace("evt_paid_1", "evt_paid_3"));
assert.equal(r.status, 500); assert.equal(db.rpcCalls, before, "lookup failure must not reach fulfilment");
db.lookupFail = false;

// An unpaid completed session is ignored and touches nothing.
const unpaid = JSON.stringify({ id: "evt_unpaid", type: "checkout.session.completed", data: { object: { customer_email: "x@example.com", payment_status: "unpaid", metadata: { headcount_band: "1-25" } } } });
const lookupsBefore = db.lookups;
r = await deliver(unpaid);
assert.equal(r.status, 200); assert.equal(await r.text(), "ignored"); assert.equal(db.lookups, lookupsBefore, "unpaid event must not touch the database");

// A bad signature never reaches the database.
r = await handler(new Request("https://x/", { method: "POST", body: paid, headers: { "stripe-signature": `t=${now()},v1=${"0".repeat(64)}` } }));
assert.equal(r.status, 400); assert.equal(db.grants, 2, "forged event granted");
globalThis.fetch = realFetch;

console.log("stripe-webhook fulfilment: 16 checks passed");
