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
// Needs migration 0013 applied (fulfil_stripe_event, service role only) before the env vars
// exist; without it every paid event 500s and Stripe retries until it is.
//
// Since 2 Sep 2026 (runbook Phase 2) auth email delivers through Resend. After the
// grant, sendWelcome() asks GoTrue for a password-recovery email to the manager: same
// template and link as "Forgot your password?" on the sign-in page, which lands them on
// login.html to set a password and enrol an authenticator. If that send fails the
// manager still has the sign-in page's own reset button; it must never fail the event.

import { createHmac, timingSafeEqual } from "node:crypto";

// Seats granted per band, from the same table create-checkout-session prices from.
import { SEATS } from "./bands.mjs";

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
  // A non-numeric t made the window NaN, and NaN > x is false, which silently skipped
  // the replay check. The HMAC still failed such a header, but fail here, explicitly.
  if (!Number.isFinite(Number(timestamp))) return false;
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

// Who gets the manager account, which is often not who paid. create-checkout-session
// only writes manager_email when it is a valid address AND different from the payer, so
// its presence is already a deliberate nomination and needs no second-guessing here.
// Lowercased because Supabase stores auth emails lowercase, and findOrCreateUser matches
// on equality: a capitalised nomination would otherwise create a second account.
export function managerEmailFor(session) {
  const nominated = (session?.metadata?.manager_email || "").trim().toLowerCase();
  if (nominated) return nominated;
  return (session?.customer_email || session?.customer_details?.email || "").trim().toLowerCase();
}

// One transaction on the database side (migration 0013, fulfil_stripe_event): claim the
// event id, grant the credits, set the name. A redelivery answers duplicate:true and grants
// nothing. Nothing here claims before the grant or releases after it, so there is no window
// in which a crash or a network error can leave an event claimed-but-unfulfilled, or a retry
// grant twice. User creation runs before the call and is idempotent (find-or-create).
async function provision(session, event) {
  const email = managerEmailFor(session);
  const payer = (session.metadata?.payer_email || session.customer_email || "").trim().toLowerCase();
  const band = session.metadata?.headcount_band;
  const seats = SEATS[band];
  if (!email || !seats) throw new Error(`cannot provision: email=${!!email} band=${band}`);

  const userId = await findOrCreateUser(email);

  const r = await sb("/rest/v1/rpc/fulfil_stripe_event", {
    method: "POST",
    body: JSON.stringify({
      p_event_id: event.id,
      p_event_type: event.type,
      p_manager: userId,
      p_amount: seats,
      p_full_name: session.metadata?.contact || null,
    }),
  });
  if (!r.ok) throw new Error(`fulfil_stripe_event failed: ${r.status} ${await r.text()}`);
  const result = await r.json();
  if (result.duplicate) {
    console.log(`duplicate delivery ${event.id}, already fulfilled`);
    return "duplicate";
  }

  console.log(
    `provisioned ${email} as manager with ${seats} credits (band ${band}, balance ${result.credits})` +
      (payer && payer !== email ? `, nominated by payer ${payer}` : "")
  );

  // Below the grant nothing may throw: it would 500, Stripe would retry, and although the
  // retry is now a duplicate (no second grant), the customer would read as unfulfilled in
  // Stripe. sendWelcome swallows its own failures.
  await sendWelcome(email);
  return "ok";
}

// The recovery link lands on the sign-in page, which handles the set-password step.
const WELCOME_REDIRECT = "https://attest-ai.com/portal/login.html";

// Ask GoTrue to email the manager a recovery link. Resolves true on 2xx, false otherwise,
// and never throws (see the note above the call). GoTrue answers 200 for unknown
// addresses too, so true means "accepted", not "delivered".
export async function sendWelcome(email) {
  try {
    const r = await sb(`/auth/v1/recover?redirect_to=${encodeURIComponent(WELCOME_REDIRECT)}`, {
      method: "POST",
      body: JSON.stringify({ email, gotrue_meta_security: {} }),
    });
    if (!r.ok) {
      console.error(`welcome email NOT sent to ${email}: ${r.status} ${await r.text()}. They can use "Forgot your password?" on the sign-in page.`);
      return false;
    }
    console.log(`welcome (recovery) email requested for ${email}`);
    return true;
  } catch (err) {
    console.error(`welcome email NOT sent to ${email}: ${err.message}. They can use "Forgot your password?" on the sign-in page.`);
    return false;
  }
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

  try {
    const outcome = await provision(session, event);
    return new Response(outcome, { status: 200 });
  } catch (err) {
    // 500 makes Stripe retry. Nothing was claimed unless the whole transaction committed,
    // so the retry starts clean.
    console.error("fulfilment failed:", err.message);
    return new Response("fulfilment failed", { status: 500 });
  }
};
