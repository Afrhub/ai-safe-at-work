// First-time user onboarding, end to end through the real UI:
//
//   sign in for the first time -> forced TOTP enrolment (the "sign-up" moment)
//   -> sign out -> sign back in against the MFA challenge with that authenticator
//   -> complete the course -> the manager sees the completion.
//
// Run: node tests/suites/e2e-onboarding.mjs [baseUrl]
//
// The account, e2e-newstarter@attest-ai.com, is dedicated to this suite. Its TOTP
// factor is un-enrolled again at the end of every run, so the enrolment flow is
// genuinely first-time on each run. The secret is never stored ahead of time: the
// suite captures it from the enrolment response in the browser, exactly the moment
// a real user scans the QR, and persists it to .env.e2e.onboarding (gitignored via
// .env.*) purely so a crashed run can recover and un-enrol next time.
//
// True self-serve arrival (the invite-seat magic-link email) is untestable until
// custom SMTP exists; this starts where that email lands a person: an account that
// exists, signing in for the first time, owning no authenticator.

import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { BASE, available, unavailableReason, launch, newPage } from "../lib/browser.mjs";
import { quizKey, COURSE_MODULES } from "../lib/e2e-fixtures.mjs";
import { totp, nextFreshCode } from "../lib/totp.mjs";
import { PortalLoginPage } from "../pages/portal-login-page.mjs";
import { ModuleQuizPage } from "../pages/module-quiz-page.mjs";
import { EndUserPage } from "../pages/end-user-page.mjs";
import { ManagerPage } from "../pages/manager-page.mjs";

const SUPABASE_POSTS = { allowPosts: ["supabase.co"] };
const SB_URL = "https://hanjrsslhnuauaysbhun.supabase.co";
const SB_ANON = "sb_publishable_wtK-KC8ibXtA0EvVIJZGqA_oY8wx_6E";
const STATE_FILE = new URL("../../.env.e2e.onboarding", import.meta.url).pathname;

// ── Account and manager credentials, same .env.e2e as the journey suite ──────
function readEnvFile(path) {
  let raw;
  try { raw = readFileSync(path, "utf8"); } catch (e) { return {}; }
  const out = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = { ...readEnvFile(new URL("../../.env.e2e", import.meta.url).pathname), ...process.env };
const NEWSTARTER = env.E2E_NEWSTARTER_EMAIL && env.E2E_NEWSTARTER_PASSWORD
  ? { email: env.E2E_NEWSTARTER_EMAIL, password: env.E2E_NEWSTARTER_PASSWORD }
  : null;
const MANAGER = env.E2E_MANAGER_EMAIL && env.E2E_MANAGER_PASSWORD && env.E2E_MANAGER_TOTP_SECRET
  ? { email: env.E2E_MANAGER_EMAIL, password: env.E2E_MANAGER_PASSWORD, totpSecret: env.E2E_MANAGER_TOTP_SECRET }
  : null;

// ── REST plumbing for reset: put the account back to "never enrolled" ────────
const api = async (path, { method = "POST", token, body } = {}) => {
  const res = await fetch(SB_URL + path, {
    method,
    headers: {
      apikey: SB_ANON,
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
};

// Un-enrol every verified factor. Needs aal2, which needs the factor's own secret —
// the price of testing real MFA with no service key.
async function unenrolAll(account, secret) {
  const auth = await api("/auth/v1/token?grant_type=password", {
    body: { email: account.email, password: account.password },
  });
  let token = auth.access_token;
  // Factors are listed on the user object; GET /factors is not a GoTrue user endpoint
  // (it answers 200 with an empty body, which read as "no factors" and stranded one).
  const user = await api("/auth/v1/user", { method: "GET", token });
  const verified = (user.factors || []).filter((f) => f.status === "verified");
  if (!verified.length) return 0;
  if (!secret) throw new Error("a verified factor exists but no secret is known");
  const f = verified[0];
  const ch = await api(`/auth/v1/factors/${f.id}/challenge`, { token });
  const v = await api(`/auth/v1/factors/${f.id}/verify`, {
    token,
    body: { challenge_id: ch.id, code: totp(secret) },
  });
  token = v.access_token || token;
  for (const factor of verified) {
    await api(`/auth/v1/factors/${factor.id}`, { method: "DELETE", token });
  }
  return verified.length;
}

export async function run() {
  reset();

  if (!available()) {
    group("onboarding");
    await check("ONB", "playwright available", async () => skip(unavailableReason()));
    return report("e2e-onboarding");
  }
  if (!NEWSTARTER || !MANAGER) {
    group("onboarding");
    await check("ONB", "accounts configured", async () =>
      skip("need E2E_NEWSTARTER_EMAIL/PASSWORD and E2E_MANAGER_* in .env.e2e"));
    return report("e2e-onboarding");
  }

  group("onboarding, precondition");

  let resetOk = false;
  await check("ONB-00", "the account starts with no authenticator enrolled", async () => {
    const prior = readEnvFile(STATE_FILE).E2E_NEWSTARTER_TOTP_SECRET || null;
    const removed = await unenrolAll(NEWSTARTER, prior);
    try { rmSync(STATE_FILE); } catch (e) {}
    resetOk = true;
    ok(true, `removed ${removed} stale factor(s)`);
  });
  if (!resetOk) return report("e2e-onboarding");

  const browser = await launch();
  const key = quizKey();
  let secret = null;

  // ── The first-time session: enrol, then complete the course ────────────────
  const session = await newPage(browser, SUPABASE_POSTS);
  const { page, record } = session;

  // The enrolment response carries the TOTP secret, the same payload the QR encodes.
  page.on("response", async (res) => {
    if (secret || !res.url().endsWith("/auth/v1/factors") || res.request().method() !== "POST") return;
    try {
      const body = await res.json();
      if (body && body.totp && body.totp.secret) {
        secret = body.totp.secret;
        writeFileSync(STATE_FILE, `E2E_NEWSTARTER_TOTP_SECRET=${secret}\n`);
      }
    } catch (e) {}
  });

  group("onboarding, first sign-in enrols an authenticator");

  const login = new PortalLoginPage(page, record);

  await check("ONB-01", "first sign-in is met by TOTP enrolment, QR shown", async () => {
    await login.open();
    await login.email.fill(NEWSTARTER.email);
    await login.password.fill(NEWSTARTER.password);
    await login.submit.click();
    await login.enrolStep.waitFor({ state: "visible", timeout: 30_000 });
    const qrSrc = await page.locator("#qr").getAttribute("src");
    ok(qrSrc && qrSrc.length > 100, "no QR code rendered for the authenticator app");
    ok(secret, "the enrolment secret was not captured from the response");
  });

  await check("ONB-02", "the 6-digit code completes enrolment and reaches the course", async () => {
    await page.locator("#enrol-code").fill(totp(secret));
    await login.enrolStep.locator("button[type=submit]").click();
    await page.waitForURL((u) => !u.pathname.endsWith("login.html"), { timeout: 30_000 });
    eq(new URL(page.url()).pathname, "/course.html", `landed on ${new URL(page.url()).pathname}`);
  });

  group("onboarding, signing back in uses the authenticator");

  await check("ONB-03", "sign out from the portal returns to sign-in", async () => {
    // Wait for the module grid, not just the button: #out is static HTML, visible
    // before end-user.js attaches its listener, and a click in that window is lost.
    await new EndUserPage(page, record).open();
    await page.locator("#out").click();
    await page.waitForURL((u) => u.pathname.endsWith("login.html"), { timeout: 20_000 });
    ok(true);
  });

  let lastCode = null;
  await check("ONB-04", "sign-in now challenges for MFA, not enrolment, and the code works", async () => {
    await login.open();
    await login.email.fill(NEWSTARTER.email);
    await login.password.fill(NEWSTARTER.password);
    await login.submit.click();
    await login.mfaStep.waitFor({ state: "visible", timeout: 30_000 });
    ok(!(await login.enrolStep.isVisible()), "enrolment offered again to an enrolled user");
    // The enrolment already consumed the current 30-second window's code.
    lastCode = await nextFreshCode(secret, totp(secret));
    await login.mfaCode.fill(lastCode);
    await login.mfaStep.locator("button[type=submit]").click();
    await page.waitForURL((u) => !u.pathname.endsWith("login.html"), { timeout: 30_000 });
    eq(new URL(page.url()).pathname, "/course.html", `landed on ${new URL(page.url()).pathname}`);
  });

  group("onboarding, the course and the record");

  await check("ONB-05", "all eleven modules pass, marked by the server", async () => {
    const quiz = new ModuleQuizPage(page, record);
    const failures = [];
    for (const moduleNumber of COURSE_MODULES) {
      await quiz.open(moduleNumber);
      const result = await quiz.completeWith(key[moduleNumber]);
      if (!result.passed || result.score !== 10) {
        failures.push(`module ${moduleNumber}: ${result.score}/10 (${result.verdict})`);
      }
    }
    eq(failures.length, 0, failures.join("; "));
  });

  await check("ONB-06", "the new starter's own portal shows every module done", async () => {
    const portal = await new EndUserPage(page, record).open();
    const done = await portal.doneByModule();
    const missing = COURSE_MODULES.filter((m) => !done[m]);
    eq(missing.length, 0, `not marked done: ${missing.join(", ")}`);
  });

  await check("ONB-07", "no console, page or CSP errors across the whole journey", async () => {
    const noise = [];
    if (record.csp.length) noise.push(`CSP: ${record.csp.join(" | ")}`);
    if (record.pageErrors.length) noise.push(`page errors: ${record.pageErrors.join(" | ")}`);
    const consoleErrors = record.console.filter((c) => c.startsWith("error:") && !c.includes("406"));
    if (consoleErrors.length) noise.push(`console: ${consoleErrors.join(" | ")}`);
    eq(noise.length, 0, noise.join(" || "));
  });

  await session.close();

  group("onboarding, the manager sees it");

  await check("ONB-08", "the manager's roster shows the new starter at 11 / 11", async () => {
    const mgrSession = await newPage(browser, SUPABASE_POSTS);
    try {
      const mgrLogin = new PortalLoginPage(mgrSession.page, mgrSession.record);
      await mgrLogin.signIn(MANAGER);
      const portal = await new ManagerPage(mgrSession.page, mgrSession.record).open();
      const seat = await portal.seatFor(NEWSTARTER.email);
      ok(seat, `${NEWSTARTER.email} is not on the roster`);
      eq(seat.done, 11, `roster shows ${seat.done}/${seat.total}`);
      eq(seat.total, 11, `roster counts out of ${seat.total}`);
    } finally {
      await mgrSession.close();
    }
  });

  group("onboarding, reset for the next run");

  await check("ONB-09", "the authenticator is un-enrolled so the next run is first-time again", async () => {
    const removed = await unenrolAll(NEWSTARTER, secret);
    eq(removed, 1, `expected to remove exactly the factor this run enrolled, removed ${removed}`);
    // Only forget the secret once the factor is truly gone; a kept file is the recovery
    // path, a deleted one plus a live factor is a locked account.
    rmSync(STATE_FILE);
  });

  await browser.close();
  return report("e2e-onboarding");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`onboarding journey against ${BASE}`);
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
