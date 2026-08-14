// Fixtures for the journey suite: the accounts, and the quiz answer key.
//
// Accounts come from .env.e2e, which .gitignore covers. Absent, the suite skips with a
// reason rather than failing, the same posture as the Playwright resolution in
// browser.mjs. Nothing here belongs in the repo.
//
// The answer key comes from the migration that seeded quiz_keys. The browser cannot read
// that table (0006 revoked every grant), so a UI test that must click the right option
// reads the same rows the database was seeded from.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

// ── Accounts ──────────────────────────────────────────────────────────────────
function readEnvFile(path) {
  let raw;
  try { raw = readFileSync(path, "utf8"); } catch (e) { return {}; }
  const out = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...readEnvFile(join(ROOT, ".env.e2e")), ...process.env };

const account = (prefix) => {
  const email = env[`${prefix}_EMAIL`];
  const password = env[`${prefix}_PASSWORD`];
  const totpSecret = env[`${prefix}_TOTP_SECRET`];
  return email && password && totpSecret ? { email, password, totpSecret } : null;
};

export const MANAGER = account("E2E_MANAGER");
export const STAFF = account("E2E_STAFF");

export const missingAccountsReason =
  "no .env.e2e — set E2E_MANAGER_EMAIL/PASSWORD/TOTP_SECRET and E2E_STAFF_* " +
  "(see specs/e2e-scenarios.md). The suite refuses to invent credentials.";

// ── Answer key ────────────────────────────────────────────────────────────────
// Rows look like "  (2,1,3)," — module, question, correct option index.
export function quizKey() {
  const sql = readFileSync(join(ROOT, "supabase", "migrations", "0008_quiz_keys_seed.sql"), "utf8");
  const key = {};
  for (const m of sql.matchAll(/^\s*\((\d+),\s*(\d+),\s*(\d+)\)/gm)) {
    const [, mod, q, correct] = m.map(Number);
    (key[mod] ||= [])[q - 1] = correct;
  }
  return key;
}

// The eleven modules the course sells, matching portal/assets/modules.js, the manager's
// roster and the certificate register: 1 to 10 and 12. Module 11 is the 60-second finale,
// gated behind finishing those eleven, and is deliberately not one of them.
export const COURSE_MODULES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
export const FINALE_MODULE = 11;

if (import.meta.url === `file://${process.argv[1]}`) {
  const assert = (await import("node:assert/strict")).default;
  const key = quizKey();
  assert.equal(Object.keys(key).length, 12, "expected all 12 modules in the seed");
  for (const [mod, answers] of Object.entries(key)) {
    assert.equal(answers.length, 10, `module ${mod} should have 10 questions`);
    assert.ok(answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 4), `module ${mod} option out of range`);
  }
  console.log(`quiz key: 12 modules x 10 questions parsed`);
}
