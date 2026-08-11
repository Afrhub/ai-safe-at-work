// Sections B and H3 of the test plan: navigation, pricing integrity, content gating
// and the robots posture. Everything here is checkable over HTTP without a browser.
//
// Run: node tests/suites/public-site.mjs [baseUrl]

import { group, check, eq, ok, includes, excludes, skip, report, reset } from "../lib/harness.mjs";

const BASE = process.argv[2] || process.env.BASE_URL || "https://aisafework.netlify.app";

const cache = new Map();
async function page(path) {
  if (!cache.has(path)) {
    const r = await fetch(`${BASE}${path}`);
    cache.set(path, { status: r.status, body: r.status === 200 ? await r.text() : "" });
  }
  return cache.get(path);
}

// Cut to three sections plus Sign in on 3 Aug 2026. Who We Help, Plans, Book a Demo and
// Become a Partner moved to the footer Explore column, checked separately below.
const NAV_ITEMS = [
  ["Products", "index.html#how-we-help"],
  ["Course", "course.html"],
  ["Governance", "governance.html"],
  ["Sign in", "portal/login.html"],
];

// Displaced from the nav. If these ever stop being reachable, the streamline silently
// buried the pricing page and both revenue CTAs.
const FOOTER_EXPLORE = [
  ["Who We Help", "who-we-help.html"],
  ["Plans", "pricing.html"],
  ["Book a Demo", "demo.html"],
  ["Become a Partner", "msp.html"],
];

// A representative spread rather than all 50, so the suite stays fast enough to run
// on every deploy. Widen if a nav regression ever slips through.
const NAV_SAMPLE = [
  "/index.html", "/pricing.html", "/who-we-help.html", "/course.html",
  "/checkout.html", "/about.html", "/faq.html", "/consultancy.html",
  "/solutions.html", "/plus-pack.html", "/glossary.html", "/resources.html",
];

// Paid content. These must carry the gate script. The gate itself is client side, so
// a server check cannot prove the redirect, but it does prove a page has not shipped
// ungated, which is the regression that actually costs money.
const GATED = [
  "/module-2.html", "/module-6.html", "/module-12.html",
  "/module-manager.html", "/module-dpo.html", "/module-procurement.html",
  "/module-msp-admin.html", "/module-copilot.html", "/module-shadow-ai.html",
  "/sector-healthcare.html", "/sector-financial-services.html", "/sector-public-sector.html",
  "/cert.html",
];

const PUBLIC_BY_DESIGN = ["/module-1.html", "/glossary.html", "/standards-map.html", "/resources.html"];

const PRICES = ["£990", "£1,750", "£249", "£499", "£2,490", "£4,990"];

export async function run() {
  reset();

  group("NAV, navigation present site wide");
  for (const path of NAV_SAMPLE) {
    await check("NAV-01", `nav complete on ${path}`, async () => {
      const p = await page(path);
      eq(p.status, 200);
      for (const [label] of NAV_ITEMS) includes(p.body, label, `${path} is missing the "${label}" nav item`);
    });
  }

  group("NAV-06, every nav target resolves");
  for (const [label, target] of NAV_ITEMS) {
    await check("NAV-06", `${label} resolves`, async () => {
      const p = await page("/" + target.split("#")[0]);
      eq(p.status, 200, `${label} points at a ${p.status}`);
    });
  }

  group("NAV-12, links displaced from the nav are still reachable");
  for (const [label, target] of FOOTER_EXPLORE) {
    await check("NAV-12", `${label} in the footer`, async () => {
      const p = await page("/index.html");
      includes(p.body, `>${label}</a>`, `${label} lost its nav slot and is not in the footer either`);
      const t = await page("/" + target);
      eq(t.status, 200, `${label} points at a ${t.status}`);
    });
  }

  group("HOME, structured data");
  await check("HOME-03", "all JSON-LD parses", async () => {
    for (const path of ["/index.html", "/pricing.html", "/faq.html", "/course.html"]) {
      const p = await page(path);
      const blocks = [...p.body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
      ok(blocks.length > 0 || path === "/course.html", `${path} has no JSON-LD`);
      for (const [, json] of blocks) {
        try { JSON.parse(json); } catch (e) { throw new Error(`${path}: ${e.message}`); }
      }
    }
  });

  group("PRC, pricing integrity");
  await check("PRC-01/02", "all six prices present on pricing.html", async () => {
    const p = await page("/pricing.html");
    for (const price of PRICES) includes(p.body, price, `pricing.html is missing ${price}`);
  });
  await check("PRC-03", "VAT exclusion stated", async () => {
    const p = await page("/pricing.html");
    ok(/exclude[s]? VAT|ex VAT|excluding VAT/i.test(p.body), "no VAT exclusion statement");
  });
  await check("PRC-06", "retired tier numbering absent", async () => {
    for (const path of ["/pricing.html", "/index.html", "/who-we-help.html"]) {
      const p = await page(path);
      excludes(p.body, "Tier 1", `${path} still says Tier 1`);
      excludes(p.body, "Tier 2", `${path} still says Tier 2`);
    }
  });
  await check("WWH-03", "Who We Help price parity", async () => {
    const w = await page("/who-we-help.html");
    for (const price of ["£990", "£249"]) {
      includes(w.body, price, `who-we-help.html disagrees with pricing.html on ${price}`);
    }
  });
  await check("PRC-05", "Offer schema matches visible prices", async () => {
    const p = await page("/pricing.html");
    const blocks = [...p.body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    const found = [];
    const walk = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(walk);
      if (node.price !== undefined) found.push(String(node.price));
      Object.values(node).forEach(walk);
    };
    for (const [, json] of blocks) { try { walk(JSON.parse(json)); } catch {} }
    if (!found.length) skip("no Offer price values in the schema yet, B2 is still open");
    for (const price of found) {
      ok(/^\d+(\.\d+)?$/.test(price), `Offer price "${price}" is not a bare number`);
      const visible = price.replace(/\.00$/, "");
      const withComma = Number(visible).toLocaleString("en-GB");
      ok(
        p.body.includes(`£${visible}`) || p.body.includes(`£${withComma}`),
        `Offer schema says ${price} but no matching visible price, search would misprice the product`
      );
    }
  });

  group("CRS, content gating");
  for (const path of GATED) {
    await check("CRS-05", `gate script present on ${path}`, async () => {
      const p = await page(path);
      eq(p.status, 200);
      includes(p.body, "course-gate.js", `${path} has shipped WITHOUT the paywall`);
    });
  }
  for (const path of PUBLIC_BY_DESIGN) {
    await check("CRS-08", `${path} is public`, async () => {
      const p = await page(path);
      eq(p.status, 200);
      excludes(p.body, "course-gate.js", `${path} is gated but should be public`);
    });
  }

  group("CRS-03, the course page offers exactly one free module");
  await check("CRS-03", "only Module 1 is listed, and it links to the free page", async () => {
    const p = await page("/course.html");
    const cards = (p.body.match(/class="module-card"/g) || []).length;
    eq(cards, 1, `expected one module card, found ${cards}`);
    includes(p.body, 'class="module-card" href="module-1.html"', "the Module 1 card is not a link");
    const m1 = await page("/module-1.html");
    eq(m1.status, 200);
    excludes(m1.body, "course-gate.js", "module 1 is gated, but the course page calls it free to read");
  });

  group("SEO, sitemap and robots posture");
  await check("SEO-01", "every sitemap URL is 200 and indexable", async () => {
    const sm = await page("/sitemap.xml");
    eq(sm.status, 200);
    const urls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    ok(urls.length > 0, "sitemap is empty");
    const problems = [];
    for (const url of urls) {
      const path = new URL(url).pathname;
      const r = await fetch(`${BASE}${path}`);
      if (r.status !== 200) { problems.push(`${path} is ${r.status}`); continue; }
      const xr = r.headers.get("x-robots-tag") || "";
      if (/noindex/i.test(xr)) problems.push(`${path} is in the sitemap but sent X-Robots-Tag: ${xr}`);
      const body = await r.text();
      const meta = body.match(/<meta name="robots" content="([^"]+)"/i);
      if (meta && /noindex/i.test(meta[1])) problems.push(`${path} is in the sitemap but its meta says ${meta[1]}`);
    }
    ok(problems.length === 0, problems.join("; "));
  });
  await check("SEO-03", "meta and header agree on pricing.html", async () => {
    const r = await fetch(`${BASE}/pricing.html`);
    const xr = r.headers.get("x-robots-tag") || "";
    const body = await r.text();
    const meta = (body.match(/<meta name="robots" content="([^"]+)"/i) || [])[1] || "";
    const headerNo = /noindex/i.test(xr);
    const metaNo = /noindex/i.test(meta);
    ok(
      headerNo === metaNo,
      `contradiction: header "${xr}" vs meta "${meta}". The header wins, so the page is invisible to search while the sitemap keeps submitting it`
    );
  });

  group("FRM, Netlify forms");
  const postForm = async (name) => {
    const body = new URLSearchParams({ "form-name": name, email: "qa@example.com", name: "QA", company: "QA" });
    const r = await fetch(`${BASE}/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return r.status;
  };
  const destructive = process.env.RUN_FORM_POSTS === "1";
  for (const name of ["order", "demo", "partner-enquiry"]) {
    await check("FRM-01", `${name} accepts submissions`, async () => {
      if (!destructive) skip("writes a real submission, set RUN_FORM_POSTS=1 to run");
      eq(await postForm(name), 200);
    });
  }
  for (const name of ["tier1-order", "foundation-order"]) {
    await check("FRM-03", `orphaned form ${name} is gone`, async () => {
      if (!destructive) skip("writes a real submission, set RUN_FORM_POSTS=1 to run");
      eq(await postForm(name), 404, `${name} still accepts orders nobody watches`);
    });
  }

  return report("public-site");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
