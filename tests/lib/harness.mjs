// Zero dependency test harness.
//
// ponytail: this repo has no package.json and no build step on purpose. Pulling in a
// runner would add both. Node's assert plus ~60 lines gives grouping, skipping, timing,
// a summary and a non-zero exit code, which is all CI actually needs.
//
// Suites map to the sections of docs/Attest-AI-Test-Plan.pdf. Every check carries its
// test plan ID so a failure points straight at a documented expected result.

import assert from "node:assert/strict";

const results = [];
let current = "(ungrouped)";

export const group = (name) => { current = name; };

export async function check(id, title, fn) {
  const started = Date.now();
  try {
    await fn();
    results.push({ id, title, group: current, state: "pass", ms: Date.now() - started });
  } catch (err) {
    const state = err && err.__skip ? "skip" : "fail";
    results.push({
      id, title, group: current, state,
      ms: Date.now() - started,
      message: err && err.message ? err.message : String(err),
    });
  }
}

// Skip rather than fail when a precondition is genuinely absent (no credentials, a
// platform blocker from section 11). A skip is honest; a pass would be a lie.
export function skip(reason) {
  const e = new Error(reason);
  e.__skip = true;
  throw e;
}

export const eq = assert.equal;
export const ok = assert.ok;
export const match = assert.match;
export const deep = assert.deepEqual;

export function includes(haystack, needle, msg) {
  assert.ok(
    String(haystack).includes(needle),
    msg || `expected to find ${JSON.stringify(needle)}`
  );
}

export function excludes(haystack, needle, msg) {
  assert.ok(
    !String(haystack).includes(needle),
    msg || `expected NOT to find ${JSON.stringify(needle)}`
  );
}

export function report(suiteName) {
  const pass = results.filter((r) => r.state === "pass").length;
  const fail = results.filter((r) => r.state === "fail");
  const skipped = results.filter((r) => r.state === "skip");

  let lastGroup = null;
  for (const r of results) {
    if (r.group !== lastGroup) {
      console.log(`\n  ${r.group}`);
      lastGroup = r.group;
    }
    const mark = r.state === "pass" ? "PASS" : r.state === "skip" ? "SKIP" : "FAIL";
    console.log(`    ${mark}  ${r.id.padEnd(13)} ${r.title}`);
    if (r.state !== "pass") console.log(`          ${r.message}`);
  }

  console.log(
    `\n${suiteName}: ${pass} passed, ${fail.length} failed, ${skipped.length} skipped ` +
      `(${results.length} checks)`
  );
  return { pass, fail: fail.length, skip: skipped.length, total: results.length, failures: fail };
}

export const reset = () => { results.length = 0; };
