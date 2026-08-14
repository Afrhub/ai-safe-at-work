// End-to-end journeys, the two the product is actually sold on.
//
//   S1  a staff member signs in, completes the course, and their manager sees it
//   S2  a manager signs in and completes every area of the governance dashboard
//
// Run: node tests/suites/e2e-journeys.mjs [baseUrl]
//
// DESTRUCTIVE BY DESIGN, unlike every other suite here. These journeys write to the
// live Supabase project: quiz passes, document statuses and register rows. They run
// only as the dedicated accounts in .env.e2e and skip entirely without it, so they
// can never touch a customer's data. Register rows are deleted again; quiz passes and
// document statuses are not, because no client may delete them — the checks are
// written to be idempotent instead (see specs/e2e-scenarios.md).

import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage } from "../lib/browser.mjs";
import {
  MANAGER, STAFF, missingAccountsReason, quizKey, COURSE_MODULES, FINALE_MODULE,
} from "../lib/e2e-fixtures.mjs";
import { PortalLoginPage } from "../pages/portal-login-page.mjs";
import { ModuleQuizPage } from "../pages/module-quiz-page.mjs";
import { EndUserPage } from "../pages/end-user-page.mjs";
import { ManagerPage } from "../pages/manager-page.mjs";
import { GovernancePage, REGISTER_KINDS } from "../pages/governance-page.mjs";

// Sign-in, scoring and every register write are POSTs to Supabase. The default context
// aborts POSTs so a test can never file a Netlify order; this opens that one origin and
// leaves the rest shut.
const SUPABASE_POSTS = { allowPosts: ["supabase.co"] };

const SEVERITY = { risk: "high", use_case: "medium", vendor: "amber" };
const STATUS = { risk: "open", incident: "open", use_case: "proposed", vendor: "pending" };

const noiseFrom = (record) => {
  const noise = [];
  if (record.csp.length) noise.push(`CSP: ${record.csp.join(" | ")}`);
  if (record.pageErrors.length) noise.push(`page errors: ${record.pageErrors.join(" | ")}`);
  // supabase-js logs a 406 as a console error on an empty .single(), which is noise the
  // application handles. Anything else is a real error.
  const consoleErrors = record.console.filter((c) => c.startsWith("error:") && !c.includes("406"));
  if (consoleErrors.length) noise.push(`console: ${consoleErrors.join(" | ")}`);
  return noise;
};

export async function run() {
  reset();

  if (!available()) {
    group("end to end journeys");
    await check("E2E", "playwright available", async () => skip(unavailableReason()));
    return report("e2e-journeys");
  }
  if (!MANAGER || !STAFF) {
    group("end to end journeys");
    await check("E2E", "test accounts configured", async () => skip(missingAccountsReason));
    return report("e2e-journeys");
  }

  const browser = await launch();
  const key = quizKey();
  const runId = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);

  // ══════════════════ S1, staff completes the course ══════════════════
  group("S1, a staff member completes the course");

  const staffSession = await newPage(browser, SUPABASE_POSTS);
  const staffTitles = [];

  await check("E2E-01", "staff sign in with password and TOTP reaches the course", async () => {
    const login = new PortalLoginPage(staffSession.page, staffSession.record);
    const landed = await login.signIn(STAFF);
    eq(landed, "/course.html", `expected the course, landed on ${landed}`);
  });

  await check("E2E-02", "every certificated module is passed and marked by the server", async () => {
    const quiz = new ModuleQuizPage(staffSession.page, staffSession.record);
    const failures = [];
    for (const moduleNumber of COURSE_MODULES) {
      await quiz.open(moduleNumber);
      const answers = key[moduleNumber];
      ok(answers && answers.length === 10, `no seeded key for module ${moduleNumber}`);
      const result = await quiz.completeWith(answers);
      staffTitles.push(`M${moduleNumber}:${result.score}`);
      if (!result.passed || result.score !== 10) {
        failures.push(`module ${moduleNumber} scored ${result.score}/10 (${result.verdict})`);
      }
    }
    eq(failures.length, 0, failures.join("; "));
  });

  await check("E2E-03", "the staff portal shows every module done", async () => {
    const portal = await new EndUserPage(staffSession.page, staffSession.record).open();
    const done = await portal.doneByModule();
    const missing = COURSE_MODULES.filter((m) => !done[m]);
    eq(missing.length, 0, `modules still not marked done: ${missing.join(", ")}`);
  });

  await check("E2E-04", "passing the eleven unlocks the module 11 finale", async () => {
    const quiz = new ModuleQuizPage(staffSession.page, staffSession.record);
    await quiz.open(FINALE_MODULE);
    await quiz.startButton.waitFor({ state: "visible", timeout: 20_000 });
    ok(
      await quiz.startButton.isVisible(),
      "the finale is still locked after passing every module that gates it"
    );
  });

  await check("E2E-05", "the staff journey raised no console, page or CSP errors", async () => {
    const noise = noiseFrom(staffSession.record);
    eq(noise.length, 0, noise.join(" || "));
  });

  await staffSession.close();

  // ══════════════════ S1 continued, the manager reads the record ══════════════════
  group("S1, the manager sees that completion");

  const managerSession = await newPage(browser, SUPABASE_POSTS);

  await check("E2E-06", "manager sign in reaches the team admin portal", async () => {
    const login = new PortalLoginPage(managerSession.page, managerSession.record);
    const landed = await login.signIn(MANAGER);
    eq(landed, "/portal/manager.html", `expected the manager portal, landed on ${landed}`);
  });

  await check("E2E-07", "the seat row reads 11 / 11 for that staff member", async () => {
    const portal = await new ManagerPage(managerSession.page, managerSession.record).open();
    const seat = await portal.seatFor(STAFF.email);
    ok(seat, `${STAFF.email} is not seated to this manager; seats: ${JSON.stringify(await portal.seats())}`);
    eq(seat.total, 11, `the roster counts out of ${seat.total}, expected 11`);
    eq(seat.done, 11, `the roster shows ${seat.done} of ${seat.total} after a full course`);
  });

  // ══════════════════ S2, the governance dashboard ══════════════════
  group("S2, a manager completes the governance dashboard");

  await check("E2E-08", "the dashboard loads with both document packs seeded", async () => {
    const dash = await new GovernancePage(managerSession.page, managerSession.record).open();
    const ai = await dash.documents("docs");
    const gdpr = await dash.documents("gdpr-docs");
    eq(ai.length, 14, `AI pack has ${ai.length} documents, expected 14`);
    eq(gdpr.length, 10, `GDPR pack has ${gdpr.length} documents, expected 10`);
    eq((await dash.stats.count()), 5, "expected five headline statistics");
  });

  await check("E2E-09", "every document in both packs can be published live", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    const ai = await dash.publishAll("docs");
    const gdpr = await dash.publishAll("gdpr-docs");
    const stuck = [...ai, ...gdpr].filter((d) => d.status !== "live");
    eq(stuck.length, 0, `not live: ${stuck.map((d) => `${d.title} (${d.status})`).join(", ")}`);
  });

  await check("E2E-10", "the documents statistic agrees with the table", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    const stat = await dash.statistic("Documents ready or live");
    ok(stat, "no documents statistic on the dashboard");
    eq(stat.value, "24/24", `the statistic reads ${stat.value} with every document live`);
  });

  await check("E2E-11", "an item can be logged in all four registers", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    for (const kind of REGISTER_KINDS) {
      const title = `E2E ${kind} ${runId}`;
      await dash.addItem(kind, title, { status: STATUS[kind], severity: SEVERITY[kind] });
      const rows = await dash.items();
      const row = rows.find((r) => r.title === title);
      ok(row, `${kind} row did not appear after adding it`);
      eq(row.status, STATUS[kind], `${kind} saved with status ${row.status}`);
    }
  });

  await check("E2E-12", "a register status cycles and the change survives a reload", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    const title = `E2E risk ${runId}`;
    await dash.selectRegister("risk");
    const moved = await dash.cycleStatus(title);
    eq(moved.before, "open", `risk started at ${moved.before}`);
    eq(moved.after, "mitigated", `open should cycle to mitigated, went to ${moved.after}`);
    await dash.open();
    await dash.selectRegister("risk");
    const after = (await dash.items()).find((r) => r.title === title);
    eq(after && after.status, "mitigated", "the status did not survive a reload");
  });

  await check("E2E-13", "a register item can be renamed and the change persists", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    const from = `E2E incident ${runId}`;
    const to = `E2E incident ${runId} renamed`;
    await dash.selectRegister("incident");
    await dash.renameItem(from, to);
    await dash.open();
    await dash.selectRegister("incident");
    ok(
      (await dash.items()).some((r) => r.title === to),
      "the renamed incident is not there after a reload"
    );
  });

  await check("E2E-14", "the open risk and incident statistics track the registers", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    await dash.open();
    const risks = await dash.statistic("Open risks");
    const incidents = await dash.statistic("Open incidents");
    ok(risks && incidents, "the dashboard is missing a risk or incident statistic");
    ok(Number.isInteger(Number(incidents.value)), `open incidents reads ${incidents.value}`);
    ok(Number(incidents.value) >= 1, "the incident just logged is not counted as open");
  });

  await check("E2E-15", "the suite removes the register rows it created", async () => {
    const dash = new GovernancePage(managerSession.page, managerSession.record);
    const left = [];
    for (const kind of REGISTER_KINDS) {
      await dash.selectRegister(kind);
      for (const title of [`E2E ${kind} ${runId}`, `E2E ${kind} ${runId} renamed`]) {
        await dash.deleteItem(title);
      }
      const remaining = (await dash.items()).filter((r) => r.title.includes(runId));
      left.push(...remaining.map((r) => r.title));
    }
    eq(left.length, 0, `left behind: ${left.join(", ")}`);
  });

  await check("E2E-16", "the manager journey raised no console, page or CSP errors", async () => {
    const noise = noiseFrom(managerSession.record);
    eq(noise.length, 0, noise.join(" || "));
  });

  await managerSession.close();
  await browser.close();
  return report("e2e-journeys");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`e2e journeys against ${BASE}`);
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
