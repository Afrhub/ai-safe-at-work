// Stripe Checkout session for the Foundation plan, collected by Bacs Direct Debit.
//
// ponytail: no Stripe SDK. This site has no package.json and no build step, and the
// REST API over fetch is about thirty lines. Node 18+ on Netlify has global fetch.
// Adding the npm package would add a build to a deliberately static site.
//
// Netlify env needed:
//   STRIPE_SECRET_KEY  (required, until it is set this returns 503 and the page
//                       falls back to the old invoice-me form)
//   VAT_RATE           (optional, e.g. "0.20". Unset = 0, i.e. charge the advertised
//                       ex-VAT price. See the note in HANDOFF before going live.)
//
// Bacs must also be switched on in the Stripe Dashboard (Payment methods → Bacs
// Direct Debit). That needs business verification and is not instant.

// The price lives HERE, never in the browser. The client sends a band key only.
const BANDS = [
  { key: "1-25", pence: 99000, label: "Attest AI Foundation, 1 to 25 staff, 12 months" },
  { key: "26-50", pence: 175000, label: "Attest AI Foundation, 26 to 50 staff, 12 months" },
  // "Over 50" is deliberately absent: that band is quoted on headcount, so it stays
  // a form submission and never reaches Stripe.
];

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Resolve an order to a price, or to null if it is not sold online.
//
// BOTH arguments matter. The band keys are NOT unique across plans: checkout.js
// reuses "1-25" and "26-50" for the Platform plan at different prices
// ("1-25 (£249/mo, £2,490/yr)"), so matching on the band alone would charge a
// Platform buyer the Foundation price. Only Foundation is sold online today.
//
// Matches on the leading band key rather than the whole option label, because the
// labels carry prices and will be edited; the keys will not.
export function resolveBand(plan, headcount) {
  if (String(plan || "").trim() !== "Foundation") return null;
  return BANDS.find((b) => String(headcount || "").trim().startsWith(b.key)) || null;
}

const clean = (v) => String(v || "").trim().slice(0, 400); // Stripe metadata caps at 500

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json({ error: "not_configured" }, 503);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Could not read that request." }, 400);
  }

  const band = resolveBand(body.plan, body.headcount);
  if (!band) return json({ error: "That plan and headcount is not sold online yet." }, 400);

  const email = clean(body.email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "A valid work email is required." }, 400);
  }

  const vatRate = Number(process.env.VAT_RATE) || 0;
  const amount = Math.round(band.pence * (1 + vatRate));

  const origin = new URL(req.url).origin;
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("payment_method_types[0]", "bacs_debit");
  p.set("customer_email", email);
  p.set("success_url", `${origin}/checkout-thanks.html?dd=1`);
  p.set("cancel_url", `${origin}/checkout.html`);
  p.set("line_items[0][quantity]", "1");
  p.set("line_items[0][price_data][currency]", "gbp");
  p.set("line_items[0][price_data][unit_amount]", String(amount));
  p.set("line_items[0][price_data][product_data][name]", band.label);
  // Metadata is what the fulfilment webhook (B3/B4) will read to provision the
  // manager account. Nothing consumes it yet.
  p.set("metadata[company]", clean(body.company));
  p.set("metadata[contact]", clean(body.name));
  p.set("metadata[headcount_band]", band.key);
  p.set("metadata[vat_rate]", String(vatRate));

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: p,
  });

  const data = await r.json();
  if (!r.ok) {
    console.error("stripe checkout session failed:", data && data.error);
    return json({ error: "Could not start the payment. Please try again." }, 502);
  }

  return json({ url: data.url }, 200);
};
