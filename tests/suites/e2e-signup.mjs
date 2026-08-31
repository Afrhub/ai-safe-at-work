// The front door: landing page fades in, leads with a big Sign up, and the sign-up form
// stands ready. Repeatable-every-run checks only: a REAL signup burns the 2/hour
// built-in email budget and leaves an account behind, so the full journey
// (sign up -> confirm -> authenticator -> landing -> sign in -> course) was proven
// end to end against production on 30 Aug 2026 with a throwaway account, and the
// account deleted after. Re-prove it the same way after any auth change.
//
// Run: node tests/suites/e2e-signup.mjs [baseUrl]

import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage } from "../lib/browser.mjs";

export async function run() {
  reset();
  group("SGN, the self-serve front door");

  if (!available()) {
    await check("SGN", "playwright available", async () => skip(unavailableReason()));
    return report("e2e-signup");
  }

  const browser = await launch();
  const withPage = async (fn, opts) => {
    const s = await newPage(browser, opts);
    try { return await fn(s); } finally { await s.close(); }
  };

  await check("SGN-01", "the landing page fades in and honours reduced motion", async () => {
    await withPage(async ({ page }) => {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
      const fade = await page.evaluate(() => getComputedStyle(document.body).animationName);
      eq(fade, "gate-fade", `body animation is ${fade}`);
    });
    await withPage(async ({ page, context }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
      const fade = await page.evaluate(() => getComputedStyle(document.body).animationName);
      eq(fade, "none", "reduced-motion visitors still get the animation");
    });
  });

  await check("SGN-02", "a big Sign up leads the hero", async () => {
    await withPage(async ({ page }) => {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
      const cta = page.locator(".hero-cta.primary.xl");
      eq((await cta.textContent()).trim(), "Sign up →");
      const box = await cta.boundingBox();
      ok(box && box.height >= 56 && box.width >= 150,
        `CTA is ${box && Math.round(box.width)}x${box && Math.round(box.height)}px, not big`);
    });
  });

  await check("SGN-03", "Sign up opens the create-account form", async () => {
    await withPage(async ({ page }) => {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
      await page.locator(".hero-cta.primary.xl").click();
      // Netlify serves pretty URLs, so match with and without .html.
      await page.waitForFunction(() => /\/portal\/login(\.html)?$/.test(location.pathname), null, { timeout: 30_000 });
      await page.locator("#step-signup").waitFor({ state: "visible", timeout: 30_000 });
      ok(await page.locator("#su-email").isVisible(), "no email field on the signup form");
      // Buttons ship disabled until wired (a pre-wire click used to native-submit).
      await page.waitForFunction(
        () => !document.querySelector("#step-signup button[type=submit]").disabled,
        null, { timeout: 15_000 }
      );
    });
  });

  await check("SGN-04", "mismatched passwords are refused client-side, no account made", async () => {
    await withPage(async ({ page, record }) => {
      await page.goto(BASE + "/portal/login.html?signup=1", { waitUntil: "domcontentloaded" });
      await page.locator("#step-signup").waitFor({ state: "visible", timeout: 30_000 });
      await page.waitForFunction(
        () => !document.querySelector("#step-signup button[type=submit]").disabled,
        null, { timeout: 15_000 }
      );
      await page.locator("#su-email").fill("sgn-04-never-created@attest-ai.com");
      await page.locator("#su-pw").fill("one-password-8");
      await page.locator("#su-pw2").fill("other-password-8");
      await page.locator("#step-signup button[type=submit]").click();
      await page.waitForFunction(() => document.getElementById("msg").classList.contains("err"), null, { timeout: 15_000 });
      const msg = (await page.locator("#msg").textContent()).trim();
      ok(/do not match/i.test(msg), `unexpected message: ${msg}`);
    }, { allowPosts: [] }); // any POST would be a bug; the default guard blocks and records it
  });

  await browser.close();
  return report("e2e-signup");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`signup front door against ${BASE}`);
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
