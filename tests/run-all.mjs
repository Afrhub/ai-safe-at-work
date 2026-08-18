// Runs every suite that needs no browser and no install.
//
//   node tests/run-all.mjs                    against the live site
//   BASE_URL=https://deploy-preview--x.netlify.app node tests/run-all.mjs
//
// Optional, unlocks the authenticated half of the security suite:
//   TEST_MANAGER_EMAIL=... TEST_MANAGER_PASSWORD=... node tests/run-all.mjs
//
// Exit code is non zero if anything failed, so it can gate a deploy.

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const SUITES = [
  ["pricing logic", "tests/checkout-pricing.mjs"],
  ["webhook signature", "tests/stripe-webhook.sig.mjs"],
  ["manager nomination", "tests/checkout-nomination.mjs"],
  ["exposure and headers", "tests/suites/exposure.mjs"],
  ["public site", "tests/suites/public-site.mjs"],
  ["authorisation", "tests/suites/rls.mjs"],
  // Needs Playwright, resolved from a sibling project. Skipped automatically if absent.
  ["browser", "tests/suites/browser-site.mjs"],
  // The two journeys. Writes to the live project as the dedicated .env.e2e accounts,
  // and skips entirely without that file, so it is safe to leave in the default run.
  ["end to end journeys", "tests/suites/e2e-journeys.mjs"],
  // First-time onboarding: enrolment, MFA re-entry, course, roster. Resets its own
  // account's authenticator at the end so every run is first-time. Skips without .env.e2e.
  ["onboarding journey", "tests/suites/e2e-onboarding.mjs"],
  // Phase 2 proof: forgot-password email → link → new password. Skips until a mailbox
  // (E2E_IMAP_*) exists in .env.e2e and Supabase SMTP can send.
  ["password reset", "tests/suites/e2e-password-reset.mjs"],
];

let failed = 0;
const summary = [];

for (const [name, file] of SUITES) {
  process.stdout.write(`\n${"=".repeat(58)}\n${name}\n${"=".repeat(58)}\n`);
  try {
    const { stdout } = await run("node", [file], { env: process.env, maxBuffer: 8 << 20 });
    process.stdout.write(stdout);
    summary.push([name, "ok", (stdout.match(/(\d+) (?:checks )?passed/) || [, "?"])[1]]);
  } catch (err) {
    failed++;
    process.stdout.write((err.stdout || "") + (err.stderr || ""));
    summary.push([name, "FAILED", (String(err.stdout).match(/(\d+) (?:checks )?passed/) || [, "?"])[1]]);
  }
}

console.log(`\n${"=".repeat(58)}\nSUMMARY\n${"=".repeat(58)}`);
for (const [name, state, passed] of summary) {
  console.log(`  ${state === "ok" ? "ok    " : "FAILED"}  ${name.padEnd(24)} ${passed} passed`);
}
console.log(failed ? `\n${failed} suite(s) failed.` : "\nAll suites passed.");
process.exit(failed ? 1 : 0);
