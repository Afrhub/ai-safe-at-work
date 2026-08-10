// Sections B, G, H4 and I of the test plan: the cases that only a real browser
// can settle. Everything here was already unprovable over HTTP —
// tests/suites/public-site.mjs can show that the gate script is on the page, but
// only a browser can show that the redirect fires; it can show that a price string
// exists, but only a browser can show what the submit button says after
// checkout.js has rewritten it.
//
// Run: node tests/suites/browser-site.mjs [baseUrl]
//
// NON-DESTRUCTIVE. lib/browser.mjs aborts every POST and leaves the Stripe
// function hanging, so no Netlify submission and no Stripe session is created.

import { group, check, eq, ok, includes, excludes, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage, signedInContext } from "../lib/browser.mjs";
import { SitePage } from "../pages/site-page.mjs";
import { CheckoutPage, BAND } from "../pages/checkout-page.mjs";
import { CertPage } from "../pages/cert-page.mjs";

// RSP-01 asks for ten pages. These are the ten with the most layout in them.
const RESPONSIVE_PAGES = [
  "/index.html", "/pricing.html", "/course.html", "/checkout.html",
  "/who-we-help.html", "/plus-pack.html", "/consultancy.html",
  "/faq.html", "/module-1.html", "/solutions.html",
];

const WIDTHS = [320, 390, 768, 900, 1280, 1440];

// CSP-01 says "every page". Twelve is the spread that covers every script bundle
// the site ships: marketing, course, checkout, module, portal shell and demo.
const CSP_PAGES = [
  "/index.html", "/pricing.html", "/course.html", "/checkout.html",
  "/checkout.html?plan=platform", "/who-we-help.html", "/module-1.html",
  "/glossary.html", "/standards-map.html", "/resources.html",
  "/portal/login.html", "/portal/demo.html",
];

const GATED_TO_COURSE = ["/module-2.html", "/module-6.html", "/module-12.html", "/cert.html"];
const GATED_TO_CHECKOUT = [
  "/module-manager.html", "/module-dpo.html", "/module-procurement.html",
  "/module-msp-admin.html", "/module-copilot.html", "/module-shadow-ai.html",
  "/sector-healthcare.html", "/sector-financial-services.html", "/sector-public-sector.html",
];

export async function run() {
  reset();

  if (!available()) {
    group("browser suite");
    await check("BROWSER", "playwright available", async () => skip(unavailableReason()));
    return report("browser-site");
  }

  const browser = await launch();
  const withPage = async (fn, opts) => {
    const session = await newPage(browser, opts);
    try {
      return await fn(session);
    } finally {
      await session.close();
    }
  };

  // ─────────────────────────── NAV and RSP ───────────────────────────

  group("RSP-01, no horizontal scroll");
  for (const path of RESPONSIVE_PAGES) {
    await check("RSP-01", `no overflow on ${path}`, async () => {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        const problems = [];
        for (const w of WIDTHS) {
          await p.resize(w);
          const { scrollWidth, clientWidth } = await p.overflow();
          if (scrollWidth > clientWidth) {
            const worst = await p.widestOverhang();
            problems.push(
              `${w}px needs ${scrollWidth}px` +
                (worst ? ` (widest: <${worst.tag} class="${worst.cls}"> ends at ${worst.right}px)` : "")
            );
          }
        }
        ok(problems.length === 0, problems.join("; "));
      });
    });
  }

  group("NAV, responsive top bar");
  await check("NAV-02", "nav centred on the three column grid at 1280px", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/index.html");
      await p.resize(1280);
      const l = await p.navLayout();
      eq(l.display, "grid", `header is ${l.display} at 1280px, not the three column grid`);
      ok(
        Math.abs(l.firstCol - l.lastCol) < 2,
        `outer grid columns are ${l.columns}, so the nav cannot be centred`
      );
      ok(
        Math.abs(l.navCentre - l.barCentre) < 3,
        `nav centre is ${Math.round(l.navCentre)}px, page centre is ${Math.round(l.barCentre)}px`
      );
      eq(l.rows, 1, `nav occupies ${l.rows} rows at 1280px, expected one`);
    });
  });

  // Was "nav wraps to a second row at 900px". That encoded a six-item nav: it had to drop
  // below the brand to fit. The nav is four items since 3 Aug 2026 and fits beside the
  // brand at every width tested, so requiring the wrap would fail a nav that is working.
  // What actually matters is unchanged: nothing clipped, and no horizontal overflow.
  await check("NAV-03", "900px fits with nothing clipped", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/index.html");
      await p.resize(900);
      const l = await p.navLayout();
      ok(l.crushed.length === 0, `nav pill(s) clipped or crushed: ${l.crushed.join(", ")}`);
      const { scrollWidth, clientWidth } = await p.overflow();
      ok(scrollWidth <= clientWidth, `900px viewport needs ${scrollWidth}px`);
    });
  });

  await check("NAV-04", "390px fits, theme toggle on screen", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/index.html");
      await p.resize(390);
      const { scrollWidth, clientWidth } = await p.overflow();
      ok(scrollWidth <= clientWidth, `390px viewport needs ${scrollWidth}px (regressed at 457px once)`);
      const box = await p.themeToggle.boundingBox();
      ok(box, "no theme toggle rendered at 390px");
      ok(box.x >= 0 && box.x + box.width <= 390 + 1, `theme toggle spans ${box.x}..${box.x + box.width}`);
    });
  });

  await check("NAV-05", "768px fits and every nav pill is reachable", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/index.html");
      await p.resize(768);
      const { scrollWidth, clientWidth } = await p.overflow();
      ok(scrollWidth <= clientWidth, `768px viewport needs ${scrollWidth}px`);
      for (const label of ["Products", "Who We Help", "Plans", "Sign in", "Book a Demo", "Become a Partner"]) {
        const link = page.getByRole("link", { name: label, exact: true }).first();
        const box = await link.boundingBox();
        ok(box && box.width > 0 && box.height > 0, `"${label}" is not laid out at 768px`);
        ok(box.x >= 0 && box.x + box.width <= 768 + 1, `"${label}" runs off the 768px viewport`);
      }
    });
  });

  group("RSP-02, module grid reflow");
  await check("RSP-02", "the 300px grid floor does not force overflow", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/course.html");
      const problems = [];
      for (const w of [320, 390, 768]) {
        await p.resize(w);
        const grid = await page.locator(".module-grid").first().boundingBox();
        if (grid && grid.x + grid.width > w + 1) problems.push(`${w}px: grid ends at ${Math.round(grid.x + grid.width)}px`);
        const { scrollWidth, clientWidth } = await p.overflow();
        if (scrollWidth > clientWidth) problems.push(`${w}px: document needs ${scrollWidth}px`);
      }
      ok(problems.length === 0, problems.join("; "));
    });
  });

  // ─────────────────────────── CSP ───────────────────────────

  group("CSP-01, zero violations on the deployed site");
  for (const path of CSP_PAGES) {
    await check("CSP-01", `no CSP violation on ${path}`, async () => {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        ok(
          record.csp.length === 0,
          `${record.csp.length} violation(s): ${record.csp.join(" | ")}`
        );
      });
    });
  }

  group("CSP-01b, no uncaught page errors");
  for (const path of CSP_PAGES) {
    await check("CSP-01", `no page errors on ${path}`, async () => {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        ok(record.pageErrors.length === 0, record.pageErrors.join(" | "));
      });
    });
  }

  group("CSP-02 and CSP-04, shipped markup");
  await check("CSP-02", "no inline event handlers in shipped HTML", async () => {
    const offenders = [];
    for (const path of CSP_PAGES) {
      const body = await (await fetch(BASE + path)).text();
      const hits = [...body.matchAll(/\son(click|change|submit|input|load|error)\s*=/gi)];
      if (hits.length) offenders.push(`${path}: ${hits.length} × on${hits[0][1]}=`);
    }
    ok(offenders.length === 0, offenders.join("; "));
  });

  await check("CSP-04", "no external scripts outside the portal", async () => {
    const offenders = [];
    for (const path of CSP_PAGES.filter((p) => !p.startsWith("/portal/"))) {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        const ext = await p.externalScripts();
        if (ext.length) offenders.push(`${path}: ${ext.join(", ")}`);
      });
    }
    ok(offenders.length === 0, offenders.join("; "));
  });

  // ─────────────────────────── content gating ───────────────────────────

  group("CRS, the gate actually redirects");
  await check("CRS-04", "module 1 loads signed out", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/module-1.html");
      eq(new URL(page.url()).pathname, "/module-1.html", `module 1 redirected to ${page.url()}`);
      ok((await p.h1.count()) > 0, "module 1 rendered no h1");
    });
  });

  for (const path of GATED_TO_COURSE) {
    await check("CRS-05", `${path} redirects to course.html?locked=1`, async () => {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        eq(page.url(), `${BASE}/course.html?locked=1`, `landed on ${page.url()}`);
      });
    });
  }

  for (const path of GATED_TO_CHECKOUT) {
    const id = path.startsWith("/sector-") ? "CRS-07" : "CRS-06";
    await check(id, `${path} redirects to checkout.html`, async () => {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        includes(page.url(), "/checkout.html", `landed on ${page.url()}`);
      });
    });
  }

  // Inverted on 31 Jul 2026. The demo account was excluded from paid content while
  // AUTH_DISABLED made every visitor the demo account. Auth is now armed and the demo
  // credential is private, so demo is a normal signed-in session and SHOULD reach the
  // course. Sales needs to show it.
  await check("NEG-GATE-03", "the demo account can read paid content", async () => {
    await withPage(
      async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open("/module-2.html");
        eq(page.url(), `${BASE}/module-2.html`, `demo account was bounced to ${page.url()}`);
      },
      { context: signedInContext("demo@attest-ai.com") }
    );
  });

  await check("CRS-05b", "a signed in session does reach a gated module", async () => {
    await withPage(
      async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open("/module-2.html");
        eq(new URL(page.url()).pathname, "/module-2.html", `signed in user was bounced to ${page.url()}`);
      },
      { context: signedInContext() }
    );
  });

  // ─────────────────────────── checkout ───────────────────────────

  group("PAY and NEG-CON, checkout behaviour");
  await check("PAY-03a", "Foundation renders as Foundation", async () => {
    await withPage(async ({ page, record }) => {
      const c = new CheckoutPage(page, record);
      await c.open();
      eq(await c.submitLabel(), "Buy Foundation →");
      eq(await c.plan(), "Foundation");
      const bands = await c.bandLabels();
      includes(bands.join(" | "), "£990");
      includes(bands.join(" | "), "£1,750");
    });
  });

  await check("PAY-04a", "?plan=platform renders Platform bands and records the plan", async () => {
    await withPage(async ({ page, record }) => {
      const c = new CheckoutPage(page, record);
      await c.open("platform");
      eq(await c.plan(), "Attest AI Platform", "the hidden plan field would file this as the wrong product");
      const bands = (await c.bandLabels()).join(" | ");
      includes(bands, "£249");
      includes(bands, "£499");
      excludes(bands, "£990", "Platform is offering the Foundation price");
      includes(await c.priceHeading.textContent(), "Attest AI Platform");
      includes(await c.submitLabel(), "Platform");
    });
  });

  await check("PAY-04", "Platform 1 to 25 creates no Stripe session", async () => {
    await withPage(async ({ page, record }) => {
      const c = new CheckoutPage(page, record);
      await c.open("platform");
      await c.fillContact();
      await c.chooseBand(BAND.platform1to25);
      await c.attemptPurchase();
      eq(record.stripeCalls.length, 0, `Platform called Stripe with ${record.stripeCalls[0]}`);
      ok(record.blockedWrites.length > 0, "Platform neither called Stripe nor submitted the order form");
    });
  });

  await check("PAY-03", "Over 50 falls through to the Netlify order form", async () => {
    await withPage(async ({ page, record }) => {
      const c = new CheckoutPage(page, record);
      await c.open();
      await c.fillContact();
      await c.chooseBand(BAND.over50);
      await c.attemptPurchase();
      eq(record.stripeCalls.length, 0, "the quote band opened a Stripe session");
      ok(
        record.blockedWrites.some((w) => /Over\+50|Over%2050|Over 50/.test(w.body || "")),
        `expected the order form to post the quote band, saw: ${JSON.stringify(record.blockedWrites).slice(0, 200)}`
      );
    });
  });

  await check("NEG-CON-02", "double click creates one session and disables the button", async () => {
    await withPage(async ({ page, record }) => {
      const c = new CheckoutPage(page, record);
      await c.open();
      await c.fillContact();
      await c.chooseBand(BAND.foundation1to25);
      await c.doubleClickPurchase();
      await page.waitForFunction(() =>
        document.querySelector('form[name="order"] button[type="submit"]').disabled
      );
      ok(await c.submitDisabled(), "the button stayed live after the first click");
      eq(record.stripeCalls.length, 1, `${record.stripeCalls.length} Stripe sessions from one double click`);
      eq(record.blockedWrites.length, 0, "the order form also submitted alongside the Stripe call");
    });
  });

  // ─────────────────────────── accessibility ───────────────────────────

  group("A11Y and NAV-08");
  await check("NAV-08", "skip link takes first tab and jumps to #main", async () => {
    await withPage(async ({ page, record }) => {
      const p = new SitePage(page, record);
      await p.open("/index.html");
      const focused = await p.tabToSkipLink();
      ok(focused, "one Tab from page load focused nothing");
      eq(focused.text, "Skip to main content", `first tab stop is "${focused.text}"`);
      eq(focused.href, "#main");
      ok(focused.visible, "the skip link is focused but not rendered");
      ok(
        focused.onScreen,
        `the skip link is focused but sits at top ${Math.round(focused.top)}px, ` +
          `bottom ${Math.round(focused.bottom)}px, so it is not fully on screen`
      );
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => location.hash === "#main");
      eq(new URL(page.url()).hash, "#main");
    });
  });

  await check("A11Y-01", "the checkout form is completable by keyboard alone", async () => {
    await withPage(async ({ page, record }) => {
      const c = new CheckoutPage(page, record);
      await c.open();
      const order = await c.tabOrder(45);
      const names = order.map((e) => e.name).filter(Boolean);
      for (const field of ["company", "name", "email", "headcount"]) {
        ok(names.includes(field), `"${field}" is not reachable by Tab; reached: ${names.join(", ")}`);
      }
      ok(
        order.some((e) => e.tag === "button" && /Buy Foundation/.test(e.text)),
        "the submit button is not reachable by Tab"
      );
      const noRing = order.filter((e) => !e.focusRing).map((e) => e.name || e.text);
      ok(noRing.length === 0, `no visible focus indicator on: ${noRing.join(", ")}`);
    });
  });

  await check("A11Y-02", "every visible input has a programmatic label", async () => {
    const offenders = [];
    for (const path of ["/checkout.html", "/checkout.html?plan=platform", "/about.html", "/msp.html"]) {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        for (const c of await p.formControls()) {
          if (c.visible && !c.labelled) offenders.push(`${path}: ${c.name}`);
        }
      });
    }
    ok(offenders.length === 0, offenders.join("; "));
  });

  await check("A11Y-04", "one h1 per page and no skipped heading levels", async () => {
    const offenders = [];
    for (const path of ["/index.html", "/pricing.html", "/checkout.html", "/course.html", "/who-we-help.html", "/faq.html"]) {
      await withPage(async ({ page, record }) => {
        const p = new SitePage(page, record);
        await p.open(path);
        const outline = await p.headingOutline();
        const h1s = outline.filter((h) => h.level === 1);
        if (h1s.length !== 1) offenders.push(`${path}: ${h1s.length} h1`);
        let prev = 0;
        for (const h of outline) {
          if (prev && h.level > prev + 1) {
            offenders.push(`${path}: h${prev} → h${h.level} at "${h.text}"`);
            break;
          }
          prev = h.level;
        }
      });
    }
    ok(offenders.length === 0, offenders.join("; "));
  });

  // ─────────────────────────── certificate forgery ───────────────────────────

  group("NEG-CERT-01, certificate forgery");
  await check("NEG-CERT-01", "cert.html?m=1&s=99&n=100 mints nothing signed out", async () => {
    await withPage(async ({ page, record }) => {
      const cert = new CertPage(page, record);
      await cert.openForged(1, 99, 100);
      const o = await cert.observe();
      ok(
        !o.hasCertCard,
        `a certificate rendered from query parameters alone at ${o.url}: ${o.mainText.slice(0, 200)}`
      );
      ok(
        o.url.startsWith("/course.html?locked=1") || o.hasErrorBox,
        `expected a refusal or an "unverified" marker, observed: url ${o.url}, ` +
          `cert card ${o.hasCertCard}, error box ${o.hasErrorBox}, text ${JSON.stringify(o.mainText.slice(0, 200))}`
      );
    });
  });

  await check("NEG-CERT-01b", "no forged certificate for a signed in learner either", async () => {
    await withPage(
      async ({ page, record }) => {
        const cert = new CertPage(page, record);
        await cert.openForged(1, 99, 100);
        const o = await cert.observe();
        ok(
          !o.hasCertCard,
          `signed in, the query string alone produced a certificate: ${o.mainText.slice(0, 300)}`
        );
      },
      { context: signedInContext() }
    );
  });

  // The interesting half: does the page work at all for someone who really passed?
  await check("CERT-RENDER", "cert.html renders for a genuine stored pass", async () => {
    await withPage(
      async ({ page, record }) => {
        const cert = new CertPage(page, record);
        await cert.openForged(1, 9, 10);
        await cert.seedGenuinePass(1, 9);
        await cert.openForged(1, 9, 10);
        const o = await cert.observe();
        ok(
          o.hasCertCard,
          `a learner with a stored pass sees nothing: #cert-root is ${o.rootHtmlLength} chars, ` +
            `main text ${JSON.stringify(o.mainText.slice(0, 160))}, CSP violations ${record.csp.length}`
        );
      },
      { context: signedInContext() }
    );
  });

  await browser.close();
  return report("browser-site");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
