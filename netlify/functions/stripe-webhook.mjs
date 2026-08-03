// Stripe → Supabase fulfilment (B3/B4). Provisions the buyer as a manager with
// the seat credits their band paid for.
//
// ponytail: no Stripe SDK, same reason as create-checkout-session.mjs. Signature
// verification is ~15 lines of node:crypto and is NOT optional: without it anyone
// who finds this URL can grant themselves credits by POSTing fake JSON.
//
// Netlify env needed:
//   STRIPE_WEBHOOK_SECRET  (whsec_... from the Stripe Dashboard endpoint)
//   SUPABASE_URL
//   SUPABASE_SERVICE_KEY   (the service-role key, bypasses RLS. Never expose to a browser.)
//
// ⚠️ TWO THINGS STILL BLOCK THE CUSTOMER ACTUALLY GETTING IN, both outside this file:
//   1. AUTH-1: no custom SMTP, so the account created here cannot be emailed a
//      sign-in link. Until that is configured, delivery of credentials is manual.
// (A2 was actioned on 31 Jul 2026: AUTH_DISABLED is now false and the demo credential
// is rotated, so a buyer is no longer dropped into the demo account. AUTH-1 remains.)
// This function provisions correctly; it does not make the buyer reachable.

import { createHmac, timingSafeEqual } from "node:crypto";

// Seats granted per band. Matches the headcount_band metadata that
// create-checkout-session.mjs writes.
const SEATS = { "1-25": 25, "26-50": 50 };

const TOLERANCE_SECONDS = 300; // reject replayed deliveries older than this

export function verifySignature(raw, header, secret) {
  if (!header) return false;
  let timestamp = null;
  const signatures = [];
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t") timestamp = v;
    else if (k === "v1") signatures.push(v); // a delivery can carry more than one
  }
  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  return signatures.some((s) => {
    const b = Buffer.from(s, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

const sb = (path, init = {}) =>
  fetch(`${process.env.SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

// Claim the event id. Returns false if this delivery was already processed.
async function claimEvent(id, type) {
  const r = await sb("/rest/v1/stripe_events", {
    method: "POST",
    headers: { Prefer: "return=representation,resolution=ignore-duplicates" },
    body: JSON.stringify({ id, type }),
  });
  if (!r.ok) throw new Error(`claim failed: ${r.status} ${await r.text()}`);
  const rows = await r.json();
  return rows.length > 0; // empty = the id was already there
}

// Claiming happens before provisioning so two concurrent deliveries cannot both
// provision. That means a failure after the claim has to hand the id back, or the
// Stripe retry would see a duplicate and skip the work permanently.
async function releaseEvent(id) {
  try {
    const r = await sb(`/rest/v1/stripe_events?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    // fetch RESOLVES on 4xx and 5xx, so the catch below only ever sees network errors.
    // Without this check a failed release is completely silent: the id stays claimed,
    // Stripe's retry sees a duplicate and skips, and a paying customer is never
    // provisioned with nothing logged anywhere.
    if (!r.ok) {
      console.error(
        `RELEASE FAILED for ${id}: ${r.status} ${await r.text()}. Stripe will retry and ` +
          `skip this event as a duplicate. Provision this customer by hand.`
      );
    }
  } catch (err) {
    console.error(`could not release event ${id}, retries will skip it:`, err.message);
  }
}

async function findOrCreateUser(email) {
  const found = await sb(`/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id`);
  // Do NOT fall through on a failed lookup. A transient 500 reads as "no such user" and
  // would create a second account for someone who already has one, splitting their
  // credits across two profiles.
  if (!found.ok) {
    throw new Error(`profile lookup failed: ${found.status} ${await found.text()}`);
  }
  const rows = await found.json();
  if (rows.length) return rows[0].id;
  // handle_new_user() creates the matching profiles row via trigger.
  const made = await sb("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, email_confirm: true }),
  });
  if (!made.ok) throw new Error(`create user failed: ${made.status} ${await made.text()}`);
  return (await made.json()).id;
}

async function provision(session) {
  const email = (session.customer_email || session.customer_details?.email || "").trim();
  const band = session.metadata?.headcount_band;
  const seats = SEATS[band];
  if (!email || !seats) throw new Error(`cannot provision: email=${!!email} band=${band}`);

  const userId = await findOrCreateUser(email);

  // grant_credits() adds the credits AND promotes end_user → manager in one go
  // (it deliberately leaves an existing reseller as a reseller).
  const granted = await sb("/rest/v1/rpc/grant_credits", {
    method: "POST",
    body: JSON.stringify({ p_manager: userId, p_amount: seats }),
  });
  if (!granted.ok) throw new Error(`grant_credits failed: ${granted.status} ${await granted.text()}`);

  const name = session.metadata?.contact;
  if (name) {
    await sb(`/rest/v1/profiles?id=eq.${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ full_name: name }),
    });
  }

  console.log(`provisioned ${email} as manager with ${seats} credits (band ${band})`);
  console.warn(
    `ACTION NEEDED: ${email} has no way to sign in yet. No SMTP (AUTH-1) means no ` +
      `invite email, and AUTH_DISABLED (A2) still auto-demos the portal. Contact them manually.`
  );
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.SUPABASE_SERVICE_KEY) {
    console.error("webhook not configured: missing STRIPE_WEBHOOK_SECRET or SUPABASE_SERVICE_KEY");
    return new Response("not configured", { status: 503 });
  }

  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("stripe-signature"), secret)) {
    return new Response("bad signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("bad payload", { status: 400 });
  }

  const session = event.data?.object;
  // Bacs settles days after checkout, so the money event is async_payment_succeeded,
  // NOT completed. checkout.session.completed arrives immediately with the payment
  // still unpaid; provisioning on it would hand over access before the funds clear.
  // completed is honoured only when payment_status is already paid, which is what a
  // card would do if cards are ever switched on.
  const isPaid =
    event.type === "checkout.session.async_payment_succeeded" ||
    (event.type === "checkout.session.completed" && session?.payment_status === "paid");

  if (!isPaid) {
    console.log(`ignoring ${event.type} (payment_status=${session?.payment_status})`);
    return new Response("ignored", { status: 200 });
  }

  let claimed = false;
  try {
    if (!(await claimEvent(event.id, event.type))) {
      console.log(`duplicate delivery ${event.id}, already processed`);
      return new Response("duplicate", { status: 200 });
    }
    claimed = true;
    await provision(session);
  } catch (err) {
    // 500 makes Stripe retry, which is what we want for a transient failure. Hand
    // the event id back first, otherwise the retry sees a duplicate and skips it.
    if (claimed) await releaseEvent(event.id);
    console.error("fulfilment failed:", err.message);
    return new Response("fulfilment failed", { status: 500 });
  }

  return new Response("ok", { status: 200 });
};
