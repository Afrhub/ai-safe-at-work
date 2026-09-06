// A new manager's first day, and a teammate's, end to end through the real UI against
// production. Every proof point is screenshotted into tests/evidence/<run>/.
//
// Scenario 1 — the manager:
//
//   first sign-in -> forced authenticator enrolment -> lands on the manager portal
//   -> governance dashboard seeds its 24-document pack for the new account
//   -> every statistic is driven from another section (the cross-section dependencies):
//        seat a trained member of staff   -> "AI literacy trained" 0% -> 100%
//        publish a policy live            -> "Staff acknowledgement" gains an obligation
//        that staff member acknowledges   -> "Staff acknowledgement" 0% -> 100%
//        log a risk and an incident       -> "Open risks" / "Open incidents" count them
//   -> back to the manager dashboard: the seat, the 11/11, the spent credit.
//
// Scenario 2 — a teammate on the same team:
//   manager adds them from the manager dashboard -> their first sign-in forces
//   authenticator enrolment -> they complete every module -> the manager confirms
//   11/11 on the manager dashboard.
//
// Run: node tests/suites/e2e-manager-onboarding.mjs [baseUrl]
//
// There is no self-serve manager signup: managers are created by purchase (or by hand),
// so this starts where a purchase leaves them — an account that exists and has never
// signed in. Dedicated fixtures: e2e-newmanager@ (manager, no authenticator; the suite
// un-enrols at the end so every run is first-time) and e2e-freeagent@ (end_user with the
// course already complete, seated to nobody, so seating them proves the training stat).
// Every write is undone at the end: seat removed (credit returned), items deleted,
// document back to draft, acknowledgement deleted.

import { readFileSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { SB_URL as SB, SB_ANON as KEY } from "../lib/supabase.mjs";
import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage } from "../lib/browser.mjs";
import { totp, nextFreshCode } from "../lib/totp.mjs";
import { PortalLoginPage } from "../pages/portal-login-page.mjs";
import { ManagerPage } from "../pages/manager-page.mjs";
import { GovernancePage } from "../pages/governance-page.mjs";
import { EndUserPage } from "../pages/end-user-page.mjs";
import { ModuleQuizPage } from "../pages/module-quiz-page.mjs";
import { quizKey, COURSE_MODULES } from "../lib/e2e-fixtures.mjs";
import { readEnvFile as readEnv, env } from "../lib/e2e-fixtures.mjs";

// Evidence: one full-page screenshot per proof point, under tests/evidence/<run>/
// (gitignored). The run directory is printed at the end.
const EVIDENCE = new URL(`../evidence/${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}/`, import.meta.url).pathname;
mkdirSync(EVIDENCE, { recursive: true });
let shot = 0;
const snap = async (page, name) => { await page.screenshot({ path: `${EVIDENCE}${String(++shot).padStart(2, "0")}-${name}.png`, fullPage: true }); };

const SUPABASE_POSTS = { allowPosts: ["supabase.co"] };
const STATE_FILE = new URL("../../.env.e2e.newmanager", import.meta.url).pathname;
const MATE_STATE = new URL("../../.env.e2e.teammate", import.meta.url).pathname;

const NEWMANAGER = env.E2E_NEWMANAGER_EMAIL && env.E2E_NEWMANAGER_PASSWORD ? { email: env.E2E_NEWMANAGER_EMAIL, password: env.E2E_NEWMANAGER_PASSWORD } : null;
const TEAMMATE = env.E2E_TEAMMATE_EMAIL && env.E2E_TEAMMATE_PASSWORD ? { email: env.E2E_TEAMMATE_EMAIL, password: env.E2E_TEAMMATE_PASSWORD } : null;
const FREEAGENT = env.E2E_FREEAGENT_EMAIL && env.E2E_FREEAGENT_PASSWORD && env.E2E_FREEAGENT_TOTP_SECRET
  ? { email: env.E2E_FREEAGENT_EMAIL, password: env.E2E_FREEAGENT_PASSWORD, totpSecret: env.E2E_FREEAGENT_TOTP_SECRET } : null;

// ── REST plumbing (reset + cleanup the UI has no control for) ─────────────────
const api = async (path, { method = "POST", token, body } = {}) => {
  const r = await fetch(SB + path, { method, headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=representation", ...(token ? { Authorization: "Bearer " + token } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const t = await r.text(); if (!r.ok) throw new Error(`${method} ${path} -> ${r.status} ${t.slice(0, 200)}`);
  return t ? JSON.parse(t) : null;
};
async function aal2Token(account) {
  const a = await api("/auth/v1/token?grant_type=password", { body: { email: account.email, password: account.password } });
  const me = await api("/auth/v1/user", { method: "GET", token: a.access_token });
  const f = (me.factors || []).find((x) => x.status === "verified");
  if (!f) return { token: a.access_token, factor: null };
  const ch = await api(`/auth/v1/factors/${f.id}/challenge`, { token: a.access_token });
  const v = await api(`/auth/v1/factors/${f.id}/verify`, { token: a.access_token, body: { challenge_id: ch.id, code: totp(account.totpSecret) } });
  return { token: v.access_token, factor: f };
}
async function unenrol(account, secret) {
  const { token, factor } = await aal2Token({ ...account, totpSecret: secret });
  if (!factor) return 0;
  await api(`/auth/v1/factors/${factor.id}`, { method: "DELETE", token });
  return 1;
}

const DOC_TITLE = "Acceptable Use Policy";

// Leftovers from an interrupted run (MGR-09 never reached) break MGR-02..05 and MGR-08:
// a seat still counted, the policy still live, E2E items still open. Undo them all as
// the accounts themselves under RLS, exactly as MGR-09 would have. Idempotent.
async function cleanSlate() {
  const t = (await api("/auth/v1/token?grant_type=password", { body: { email: NEWMANAGER.email, password: NEWMANAGER.password } })).access_token;
  const items = await api("/rest/v1/governance_items?title=like.E2E*", { method: "DELETE", token: t });
  const docs = await api(`/rest/v1/governance_docs?title=eq.${encodeURIComponent(DOC_TITLE)}&status=neq.draft`, { method: "PATCH", token: t, body: { status: "draft" } });
  const seats = await api("/rest/v1/seats?select=end_user_id", { method: "GET", token: t });
  for (const s of seats) await api("/rest/v1/rpc/remove_seat", { token: t, body: { p_end_user: s.end_user_id } });
  const staff = await aal2Token(FREEAGENT);
  const acks = await api("/rest/v1/governance_acks?select=id", { method: "GET", token: staff.token });
  for (const a of acks) await api(`/rest/v1/governance_acks?id=eq.${a.id}`, { method: "DELETE", token: staff.token });
  return `${items.length} item(s), ${docs.length} doc(s), ${seats.length} seat(s), ${acks.length} ack(s)`;
}

const noise = (record) => {
  const out = [];
  if (record.csp.length) out.push(`CSP: ${record.csp.join(" | ")}`);
  if (record.pageErrors.length) out.push(`page errors: ${record.pageErrors.join(" | ")}`);
  const c = record.console.filter((x) => x.startsWith("error:") && !x.includes("406"));
  if (c.length) out.push(`console: ${c.join(" | ")}`);
  return out;
};

export async function run() {
  reset();
  group("MGR, precondition");
  if (!available()) { await check("MGR", "playwright available", async () => skip(unavailableReason())); return report("e2e-manager-onboarding"); }
  if (!NEWMANAGER || !FREEAGENT || !TEAMMATE) { await check("MGR", "fixtures configured", async () => skip("need E2E_NEWMANAGER_*, E2E_FREEAGENT_* and E2E_TEAMMATE_* in .env.e2e")); return report("e2e-manager-onboarding"); }

  let resetOk = false;
  await check("MGR-00", "the new manager starts clean: no seats, items, live policy, acks or authenticator", async () => {
    const swept = await cleanSlate();
    const prior = readEnv(STATE_FILE).E2E_NEWMANAGER_TOTP_SECRET || null;
    const removed = await unenrol(NEWMANAGER, prior).catch((e) => { if (!prior) throw new Error(`a factor exists but no secret is known — reset the account (${e.message})`); throw e; });
    try { rmSync(STATE_FILE); } catch (e) {}
    const mateSecret = readEnv(MATE_STATE).E2E_TEAMMATE_TOTP_SECRET || null;
    const removedMate = await unenrol(TEAMMATE, mateSecret).catch((e) => { if (!mateSecret) throw new Error(`teammate has a factor but no secret is known — reset the account (${e.message})`); throw e; });
    try { rmSync(MATE_STATE); } catch (e) {}
    resetOk = true; ok(true, `swept ${swept}; removed ${removed} + ${removedMate} stale factor(s)`);
  });
  if (!resetOk) return report("e2e-manager-onboarding");

  const browser = await launch();
  const m = await newPage(browser, SUPABASE_POSTS);
  let secret = null;
  m.page.on("response", async (res) => {
    if (secret || !res.url().endsWith("/auth/v1/factors") || res.request().method() !== "POST") return;
    try { const b = await res.json(); if (b?.totp?.secret) { secret = b.totp.secret; writeFileSync(STATE_FILE, `E2E_NEWMANAGER_TOTP_SECRET=${secret}\n`); } } catch (e) {}
  });
  const login = new PortalLoginPage(m.page, m.record);
  const RISK = `E2E risk ${Date.now()}`, INCIDENT = `E2E incident ${Date.now()}`;

  group("MGR, first sign-in");
  await check("MGR-01", "first sign-in forces authenticator enrolment and lands on the manager portal", async () => {
    await login.open();
    await login.email.fill(NEWMANAGER.email); await login.password.fill(NEWMANAGER.password); await login.submit.click();
    await login.enrolStep.waitFor({ state: "visible", timeout: 30_000 });
    ok(secret, "enrolment secret not captured");
    await snap(m.page, "s1-manager-first-signin-mfa-enrolment");
    await m.page.locator("#enrol-code").fill(totp(secret));
    await login.enrolStep.locator("button[type=submit]").click();
    await m.page.waitForURL((u) => /\/portal\/manager(\.html)?$/.test(u.pathname), { timeout: 30_000 });
    // Let the portal finish its own guard()/getRole() before navigating on. Leaving
    // within milliseconds aborts that fetch, which supabase-js logs as an error — a
    // test artefact, not something a person can do.
    await m.page.waitForFunction(() => /Manager/.test(document.getElementById("who")?.textContent || ""), null, { timeout: 20_000 });
    await snap(m.page, "s1-manager-portal-after-enrolment");
  });

  group("MGR, governance dashboard, cross-section dependencies");
  const dash = new GovernancePage(m.page, m.record);
  let baseline = null;

  await check("MGR-02", "the dashboard seeds the 24-document pack for a brand-new manager", async () => {
    await dash.open();
    eq((await dash.documents("docs")).length, 14); eq((await dash.documents("gdpr-docs")).length, 10);
    baseline = Object.fromEntries((await dash.statistics()).map((s) => [s.label, s]));
    ok(baseline["Documents ready or live"], "no documents statistic");
    ok(/no staff seated yet/i.test(baseline["AI literacy trained"].sub), `training stat before any seat: ${baseline["AI literacy trained"].sub}`);
    ok(/no live policies yet/i.test(baseline["Staff acknowledgement"].sub), `ack stat before any live doc: ${baseline["Staff acknowledgement"].sub}`);
    await snap(m.page, "s1-governance-dashboard-seeded-baseline");
  });

  await check("MGR-03", "seating a trained member of staff flips AI literacy trained 0% -> 100%", async () => {
    const portal = await new ManagerPage(m.page, m.record).open();
    const credits = Number((await portal.credits.textContent()).trim());
    await portal.inviteEmail.fill(FREEAGENT.email);
    await portal.inviteForm.locator("button[type=submit]").click();
    await m.page.waitForFunction((e) => [...document.querySelectorAll("#seats tbody tr")].some((tr) => tr.textContent.includes(e)), FREEAGENT.email, { timeout: 30_000 });
    const seat = await portal.seatFor(FREEAGENT.email);
    eq(seat.done, 11, `freeagent shows ${seat.done}/11, the fixture should be fully trained`);
    await m.page.waitForFunction((n) => Number(document.getElementById("credits").textContent) === n - 1, credits, { timeout: 20_000 });
    await snap(m.page, "s1-roster-after-seating-trained-staff");
    await dash.open();
    const t = await dash.statistic("AI literacy trained");
    eq(t.value, "100%", `trained stat reads ${t.value} (${t.sub})`);
    ok(/1\/1 completed/.test(t.sub), t.sub);
    await snap(m.page, "s1-dashboard-trained-100pct-from-seat");
  });

  await check("MGR-04", "publishing a policy live creates one acknowledgement obligation for that staff member", async () => {
    const rows = m.page.locator("#docs tbody tr").filter({ hasText: DOC_TITLE });
    for (let i = 0; i < 3; i++) {
      if ((await rows.locator(".pill").textContent()).trim() === "live") break;
      await rows.locator(".pill").click();
      await m.page.waitForFunction((t) => { const r = [...document.querySelectorAll("#docs tbody tr")].find((x) => x.textContent.includes(t)); return r && !r.querySelector(".pill").disabled; }, DOC_TITLE, { timeout: 20_000 });
    }
    await dash.open();
    const a = await dash.statistic("Staff acknowledgement");
    eq(a.value, "0%", `ack stat reads ${a.value}`);
    ok(/0\/1 across 1 staff/.test(a.sub), `ack sub reads: ${a.sub}`);
    await snap(m.page, "s1-dashboard-policy-live-creates-ack-obligation");
  });

  await check("MGR-05", "a risk and an incident logged in the registers are counted on the dashboard", async () => {
    await dash.addItem("risk", RISK, { status: "open", severity: "high" });
    await dash.addItem("incident", INCIDENT, { status: "open" });
    await dash.open();
    eq((await dash.statistic("Open risks")).value, "1");
    eq((await dash.statistic("Open incidents")).value, "1");
    await snap(m.page, "s1-dashboard-risk-and-incident-counted");
  });

  await check("MGR-06", "the staff member acknowledges the live policy and the manager's stat goes to 100%", async () => {
    const s = await newPage(browser, SUPABASE_POSTS);
    try {
      await new PortalLoginPage(s.page, s.record).signIn(FREEAGENT);
      const portal = await new EndUserPage(s.page, s.record).open();
      eq(await portal.pendingAcknowledgements(), 1, "staff should see exactly one policy awaiting acknowledgement");
      await snap(s.page, "s1-staff-portal-policy-awaiting-acknowledgement");
      eq(await portal.acknowledgeAll(), 1);
      await snap(s.page, "s1-staff-portal-policy-acknowledged");
    } finally { await s.close(); }
    await dash.open();
    const a = await dash.statistic("Staff acknowledgement");
    eq(a.value, "100%", `ack stat reads ${a.value} (${a.sub})`);
    await snap(m.page, "s1-dashboard-acknowledgement-100pct");
  });

  group("MGR, manager dashboard");
  await check("MGR-07", "the manager dashboard shows the seat at 11/11", async () => {
    const portal = await new ManagerPage(m.page, m.record).open();
    const seat = await portal.seatFor(FREEAGENT.email);
    ok(seat, "seat missing"); eq(seat.done, 11); eq(seat.total, 11);
    await snap(m.page, "s1-manager-dashboard-seat-11-of-11");
  });

  await check("MGR-08", "no console, page or CSP errors across the manager's first day", async () => {
    const n = noise(m.record); eq(n.length, 0, n.join(" || "));
  });

  group("TEAM, a new teammate on the same team");
  let mateSecret = null;
  await check("TEAM-01", "the manager adds the teammate to the team from the manager dashboard", async () => {
    const portal = await new ManagerPage(m.page, m.record).open();
    await portal.inviteEmail.fill(TEAMMATE.email);
    await portal.inviteForm.locator("button[type=submit]").click();
    await m.page.waitForFunction((e) => [...document.querySelectorAll("#seats tbody tr")].some((tr) => tr.textContent.includes(e)), TEAMMATE.email, { timeout: 30_000 });
    const seat = await portal.seatFor(TEAMMATE.email);
    ok(seat, "teammate not on the roster after invite");
    await snap(m.page, "s2-manager-adds-teammate-to-team");
  });

  const t = await newPage(browser, SUPABASE_POSTS);
  t.page.on("response", async (res) => {
    if (mateSecret || !res.url().endsWith("/auth/v1/factors") || res.request().method() !== "POST") return;
    try { const b = await res.json(); if (b?.totp?.secret) { mateSecret = b.totp.secret; writeFileSync(MATE_STATE, `E2E_TEAMMATE_TOTP_SECRET=${mateSecret}\n`); } } catch (e) {}
  });
  const tLogin = new PortalLoginPage(t.page, t.record);

  await check("TEAM-02", "the teammate's first sign-in forces authenticator enrolment and lands on the course", async () => {
    await tLogin.open();
    await tLogin.email.fill(TEAMMATE.email); await tLogin.password.fill(TEAMMATE.password); await tLogin.submit.click();
    await tLogin.enrolStep.waitFor({ state: "visible", timeout: 30_000 });
    ok(mateSecret, "teammate enrolment secret not captured");
    await snap(t.page, "s2-teammate-first-signin-mfa-enrolment");
    await t.page.locator("#enrol-code").fill(totp(mateSecret));
    await tLogin.enrolStep.locator("button[type=submit]").click();
    await t.page.waitForURL((u) => /\/course(\.html)?$/.test(u.pathname), { timeout: 30_000 });
    await snap(t.page, "s2-teammate-landed-on-course");
  });

  await check("TEAM-03", "the teammate completes every module of the course, marked by the server", async () => {
    const key = quizKey();
    const quiz = new ModuleQuizPage(t.page, t.record);
    const failures = [];
    for (const n of COURSE_MODULES) {
      await quiz.open(n);
      const r = await quiz.completeWith(key[n]);
      if (!r.passed) failures.push(`module ${n}: ${r.score}/10`);
      if (n === 12) await snap(t.page, "s2-teammate-final-module-passed");
    }
    eq(failures.length, 0, failures.join("; "));
    const portal = await new EndUserPage(t.page, t.record).open();
    const done = await portal.doneByModule();
    eq(COURSE_MODULES.filter((n) => !done[n]).length, 0, "modules not marked done in the teammate's portal");
    await snap(t.page, "s2-teammate-portal-all-modules-done");
  });

  await check("TEAM-04", "the manager confirms the teammate's progress on the manager dashboard", async () => {
    const portal = await new ManagerPage(m.page, m.record).open();
    const seat = await portal.seatFor(TEAMMATE.email);
    ok(seat, "teammate missing from the roster");
    eq(seat.done, 11, `roster shows ${seat.done}/11 for the teammate`);
    await snap(m.page, "s2-manager-dashboard-confirms-teammate-11-of-11");
  });

  await check("TEAM-05", "no console, page or CSP errors across the teammate's journey", async () => {
    const n = noise(t.record); eq(n.length, 0, n.join(" || "));
  });
  await t.close();

  group("MGR, leave it as found");
  await check("MGR-09", "every write is undone: items, ack, document, seat, authenticator", async () => {
    await dash.open(); await dash.selectRegister("risk"); await dash.deleteItem(RISK);
    await dash.selectRegister("incident"); await dash.deleteItem(INCIDENT);
    // staff removes their own acknowledgement (RLS: ga_staff_del)
    const staff = await aal2Token(FREEAGENT);
    const acks = await api("/rest/v1/governance_acks?select=id", { method: "GET", token: staff.token });
    for (const a of acks) await api(`/rest/v1/governance_acks?id=eq.${a.id}`, { method: "DELETE", token: staff.token });
    // document back to draft (live -> draft is the next pill state)
    const row = m.page.locator("#docs tbody tr").filter({ hasText: DOC_TITLE });
    if ((await row.locator(".pill").textContent()).trim() === "live") { await row.locator(".pill").click(); await m.page.waitForTimeout(1500); }
    // seat off, credit back
    const portal = await new ManagerPage(m.page, m.record).open();
    m.page.once("dialog", (d) => d.accept());
    await m.page.locator(`#seats tbody tr:has-text("${FREEAGENT.email}") .seat-remove`).click();
    await m.page.waitForFunction((e) => ![...document.querySelectorAll("#seats tbody tr")].some((tr) => tr.textContent.includes(e)), FREEAGENT.email, { timeout: 20_000 });
    ok(!(await portal.seatFor(FREEAGENT.email)), "seat still present");
    m.page.once("dialog", (d) => d.accept());
    await m.page.locator(`#seats tbody tr:has-text("${TEAMMATE.email}") .seat-remove`).click();
    await m.page.waitForFunction((e) => ![...document.querySelectorAll("#seats tbody tr")].some((tr) => tr.textContent.includes(e)), TEAMMATE.email, { timeout: 20_000 });
    eq(await unenrol(TEAMMATE, mateSecret), 1, "the teammate's factor should be removed");
    rmSync(MATE_STATE);
    eq(await unenrol(NEWMANAGER, secret), 1, "the factor enrolled this run should be removed");
    rmSync(STATE_FILE);
    console.log(`\n  evidence: ${EVIDENCE}`);
  });

  await m.close(); await browser.close();
  return report("e2e-manager-onboarding");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`manager onboarding against ${BASE}`);
  const r = await run(); process.exit(r.fail ? 1 : 0);
}
