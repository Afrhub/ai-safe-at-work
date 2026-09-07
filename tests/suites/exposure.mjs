// Section H2 of the test plan: headers, caching and repository exposure.
//
// This is the highest value suite per line in the whole plan. Netlify publishes the
// WHOLE repository, so every internal file that is not explicitly blocked ships. A
// sweep on 26 Jul found the migrations, the test suite, both Remotion projects, the
// MSP deck and a Word copy of the course content all returning 200.
//
// Run: node tests/suites/exposure.mjs [baseUrl]

import { group, check, eq, ok, includes, report, reset } from "../lib/harness.mjs";

const BASE = process.argv[2] || process.env.BASE_URL || "https://attest-ai.com";

const head = async (path) => {
  const r = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { status: r.status, headers: r.headers };
};

// Paths netlify.toml blocks by directory.
const BLOCKED_DIRS = [
  "/docs/test-plan.html",
  "/specs/manager-dashboard.md",
  "/supabase/migrations/0001_portals.sql",
  "/tests/lib/harness.mjs",
  "/scripts/",
  "/netlify/functions/create-checkout-session.mjs",
  "/.audit/",
  "/video-m1/",
  "/video-m2/",
];

// Files blocked by name.
const BLOCKED_FILES = [
  "/HANDOFF.md",
  "/SCOPE.md",
  "/DOCTRINE.md",
  "/README.md",
  "/skills-lock.json",
  "/AI-SafeWork-MSP-Partner-Deck.pptx",
  "/AI_SafeAtWork_Course_Content_v1_Word.docx",
];

// Public by explicit decision. If these break, a real feature broke.
const PUBLIC = ["/LICENSE", "/changelog.json", "/robots.txt", "/sitemap.xml"];

export async function run() {
  reset();

  group("EXP, internal directories must not be served");
  for (const path of BLOCKED_DIRS) {
    await check("EXP-01", `404 ${path}`, async () => {
      const { status } = await head(path);
      ok(status === 404 || status === 301, `got ${status}, this file is being served publicly`);
    });
  }

  group("EXP, internal files must not be served");
  for (const path of BLOCKED_FILES) {
    await check("EXP-02", `404 ${path}`, async () => {
      const { status } = await head(path);
      eq(status, 404, `got ${status}, this file is being served publicly`);
    });
  }

  group("EXP-03, function source hidden but endpoints live");
  await check("EXP-03", "webhook source 404s", async () => {
    const { status } = await head("/netlify/functions/stripe-webhook.mjs");
    eq(status, 404);
  });
  await check("EXP-03", "checkout endpoint responds", async () => {
    const r = await fetch(`${BASE}/.netlify/functions/create-checkout-session`, { method: "POST", body: "{}" });
    ok(r.status !== 404, "endpoint is missing, the functions directory is misconfigured");
  });
  await check("EXP-03", "webhook refuses a forged event, signed or not", async () => {
    // A fabricated paid session. 503 while unconfigured, 400 once keys exist; never 200.
    const forged = JSON.stringify({ id: "evt_forged", type: "checkout.session.async_payment_succeeded", data: { object: { customer_email: "attacker@example.com", metadata: { headcount_band: "1-25" } } } });
    const unsigned = await fetch(`${BASE}/.netlify/functions/stripe-webhook`, { method: "POST", body: forged });
    ok(unsigned.status !== 404, "endpoint is missing");
    ok([400, 503].includes(unsigned.status), `unsigned forged event answered ${unsigned.status}`);
    const t = Math.floor(Date.now() / 1000);
    const signed = await fetch(`${BASE}/.netlify/functions/stripe-webhook`, { method: "POST", body: forged, headers: { "stripe-signature": `t=${t},v1=${"0".repeat(64)}` } });
    ok([400, 503].includes(signed.status), `bogus-signature event answered ${signed.status}`);
  });

  group("EXP-05, deliberately public paths still work");
  for (const path of PUBLIC) {
    await check("EXP-05", `200 ${path}`, async () => {
      const { status } = await head(path);
      eq(status, 200);
    });
  }

  group("HDR, portal headers");
  await check("HDR-01", "portal is never cached", async () => {
    const { headers } = await head("/portal/login.html");
    const cc = headers.get("cache-control") || "";
    includes(cc, "no-store", `cache-control was "${cc}"`);
  });
  await check("HDR-02", "portal is not indexed", async () => {
    const { headers } = await head("/portal/login.html");
    const xr = headers.get("x-robots-tag") || "";
    includes(xr, "noindex", `x-robots-tag was "${xr}"`);
  });
  await check("HDR-03", "HSTS present", async () => {
    const { headers } = await head("/index.html");
    ok(headers.get("strict-transport-security"), "no HSTS header");
  });

  return report("exposure");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
