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
  ["exposure and headers", "tests/suites/exposure.mjs"],
  ["public site", "tests/suites/public-site.mjs"],
  ["authorisation", "tests/suites/rls.mjs"],
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
