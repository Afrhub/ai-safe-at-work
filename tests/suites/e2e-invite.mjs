// Runbook Phase 5, the repeatable half: a manager seats a team member through the
// portal's invite form, the roster shows them, and removing the seat returns the credit.
//
// Run: node tests/suites/e2e-invite.mjs [baseUrl]
//
// Uses the existing-account path of invite-seat (no email is sent), with the dedicated
// e2e-newstarter account. It starts by removing that account's seat so the invite has
// something to do, and ends by leaving it seated again — the state every other suite
// expects. The new-email path (invite email actually sent through Resend) was proven once
// against production on 2 Sep 2026 with a throwaway address; see specs/phase-5-*.md.

import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage } from "../lib/browser.mjs";
import { MANAGER, missingAccountsReason } from "../lib/e2e-fixtures.mjs";
import { PortalLoginPage } from "../pages/portal-login-page.mjs";
import { ManagerPage } from "../pages/manager-page.mjs";
import { env } from "../lib/e2e-fixtures.mjs";

const SUPABASE_POSTS = { allowPosts: ["supabase.co"] };
const INVITEE = env.E2E_NEWSTARTER_EMAIL;

export async function run() {
  reset();
  group("INV, a manager seats a team member");

  if (!available()) { await check("INV", "playwright available", async () => skip(unavailableReason())); return report("e2e-invite"); }
  if (!MANAGER || !INVITEE) { await check("INV", "accounts configured", async () => skip(missingAccountsReason)); return report("e2e-invite"); }

  const browser = await launch();
  const session = await newPage(browser, SUPABASE_POSTS);
  const { page, record } = session;
  let creditsBefore = null;

  await check("INV-01", "manager signs in and reads the roster", async () => {
    await new PortalLoginPage(page, record).signIn(MANAGER);
    const portal = await new ManagerPage(page, record).open();
    creditsBefore = Number((await portal.credits.textContent()).trim());
    ok(Number.isInteger(creditsBefore), "credits did not read as a number");
  });

  await check("INV-02", "removing the seat frees it and returns the credit", async () => {
    const portal = new ManagerPage(page, record);
    const seat = await portal.seatFor(INVITEE);
    if (seat) {
      page.once("dialog", (d) => d.accept());
      await page.locator(`#seats tbody tr:has-text("${INVITEE}") .seat-remove`).click();
      await page.waitForFunction((e) => ![...document.querySelectorAll("#seats tbody tr")].some((tr) => tr.textContent.includes(e)), INVITEE, { timeout: 20_000 });
      await page.waitForFunction((n) => Number(document.getElementById("credits").textContent) === n + 1, creditsBefore, { timeout: 20_000 });
      creditsBefore += 1;
    }
    ok(!(await portal.seatFor(INVITEE)), "seat still on the roster after removal");
  });

  await check("INV-03", "inviting an existing account seats it and spends one credit", async () => {
    const portal = new ManagerPage(page, record);
    await portal.inviteEmail.fill(INVITEE);
    await portal.inviteForm.locator("button[type=submit]").click();
    await page.waitForFunction(() => {
      const m = document.getElementById("amsg");
      return m && (m.classList.contains("ok") || m.classList.contains("err"));
    }, { timeout: 30_000 });
    const msg = (await portal.inviteMessage.textContent()).trim();
    ok(/seated|invite sent/i.test(msg), `portal said: ${msg}`);
    await page.waitForFunction((e) => [...document.querySelectorAll("#seats tbody tr")].some((tr) => tr.textContent.includes(e)), INVITEE, { timeout: 20_000 });
    const seat = await portal.seatFor(INVITEE);
    ok(seat, "seated account is not on the roster");
    eq(seat.total, 11, `roster counts out of ${seat.total}`);
    await page.waitForFunction((n) => Number(document.getElementById("credits").textContent) === n - 1, creditsBefore, { timeout: 20_000 });
  });

  await check("INV-04", "the seat survives a reload and progress shows", async () => {
    const portal = await new ManagerPage(page, record).open();
    const seat = await portal.seatFor(INVITEE);
    ok(seat, "seat gone after reload");
    ok(seat.done >= 0 && seat.done <= 11, `progress reads ${seat.done}`);
  });

  await check("INV-05", "no console, page or CSP errors", async () => {
    const noise = [];
    if (record.csp.length) noise.push(`CSP: ${record.csp.join(" | ")}`);
    if (record.pageErrors.length) noise.push(`page errors: ${record.pageErrors.join(" | ")}`);
    const consoleErrors = record.console.filter((c) => c.startsWith("error:") && !c.includes("406"));
    if (consoleErrors.length) noise.push(`console: ${consoleErrors.join(" | ")}`);
    eq(noise.length, 0, noise.join(" || "));
  });

  await session.close();
  await browser.close();
  return report("e2e-invite");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`invite journey against ${BASE}`);
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
