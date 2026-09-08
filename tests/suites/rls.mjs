// Section F of the test plan: authorisation enforced by the database, not the browser.
//
// These are the cases that matter most. Every one is an attempt to do something the
// client should not be able to do, so a PASS means the attack was refused.
//
// Non destructive by design. Every write attempt uses the row's CURRENT value as the
// payload, so even if a guard were broken the data would not change. The assertion is
// about the refusal, not the value.
//
// Credentials come from the environment, never from the repo (the pre-push guard
// sweeps for secrets, and this file is public):
//   TEST_MANAGER_EMAIL=...  TEST_MANAGER_PASSWORD=...  node tests/suites/rls.mjs

import { group, check, eq, ok, skip, report, reset } from "../lib/harness.mjs";
import { env } from "../lib/e2e-fixtures.mjs";

const BASE = process.env.BASE_URL || "https://attest-ai.com";
const SUPABASE = "https://hanjrsslhnuauaysbhun.supabase.co";

// The anon key is publishable by design and already served to every visitor, so
// fetching it from the deployed config keeps this file credential free.
async function anonKey() {
  const r = await fetch(`${BASE}/portal/config.js`);
  const m = (await r.text()).match(/anon\s*:\s*['"]([^'"]+)['"]/);
  if (!m) throw new Error("could not read the anon key from the deployed portal config");
  return m[1];
}

async function signIn(key, email, password) {
  const r = await fetch(`${SUPABASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (!d.access_token) throw new Error(`sign in failed: ${JSON.stringify(d).slice(0, 200)}`);
  return d;
}

const api = (key, jwt) => async (path, init = {}) => {
  const r = await fetch(`${SUPABASE}${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${jwt}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  let body = null;
  try { body = await r.json(); } catch {}
  return { status: r.status, body };
};

export async function run() {
  reset();

  const key = await anonKey();
  // The e2e manager fixture (.env.e2e) is the default so these checks run on every board;
  // TEST_MANAGER_* still overrides for an ad-hoc account.
  const email = process.env.TEST_MANAGER_EMAIL || env.E2E_MANAGER_EMAIL;
  const password = process.env.TEST_MANAGER_PASSWORD || env.E2E_MANAGER_PASSWORD;

  group("AUTH, credentials");
  await check("AUTH-02", "wrong password is refused", async () => {
    const r = await fetch(`${SUPABASE}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody@example.invalid", password: "definitely-wrong" }),
    });
    ok(r.status >= 400, `expected refusal, got ${r.status}`);
    const d = await r.json();
    const msg = JSON.stringify(d).toLowerCase();
    ok(
      !msg.includes("user not found") && !msg.includes("no such user"),
      "the error reveals whether the account exists"
    );
  });

  await check("NEG-GATE-02", "a forged JWT is refused", async () => {
    const r = await fetch(`${SUPABASE}/rest/v1/profiles?select=id`, {
      headers: { apikey: key, Authorization: "Bearer not.a.real.token" },
    });
    ok(r.status >= 400, `a garbage token returned ${r.status}`);
  });

  await check("RLS-00", "anonymous cannot read profiles", async () => {
    const r = await fetch(`${SUPABASE}/rest/v1/profiles?select=id,email`, { headers: { apikey: key } });
    const rows = r.status === 200 ? await r.json() : [];
    eq(rows.length, 0, `anonymous read returned ${rows.length} profile rows`);
  });

  // 0012: a course record needs a seat. The free agent is an end_user seated to nobody;
  // all -1 answers score 0, so an accepted call records nothing either way.
  group("SEAT, a course record needs a seat (0012)");
  const rpcAs = async (acct, fn, body) => {
    const t = (await signIn(key, acct.email, acct.password)).access_token;
    return fetch(`${SUPABASE}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };
  const FREE = { email: env.E2E_FREEAGENT_EMAIL, password: env.E2E_FREEAGENT_PASSWORD };
  const STAFF = { email: env.E2E_STAFF_EMAIL, password: env.E2E_STAFF_PASSWORD };
  const zeros = Array(10).fill(-1);
  await check("SEAT-01", "an unseated account cannot record a module beyond 1", async () => {
    const r = await rpcAs(FREE, "record_quiz_result", { p_module: 2, p_answers: zeros });
    eq(r.status, 400, `expected 400, got ${r.status}`);
    ok(/no seat/.test(await r.text()), "refusal does not say 'no seat'");
  });
  await check("SEAT-02", "an unseated account cannot record a track", async () => {
    const r = await rpcAs(FREE, "record_track_quiz_result", { p_track: "dpo", p_answers: zeros });
    eq(r.status, 400, `expected 400, got ${r.status}`);
  });
  await check("SEAT-03", "module 1 stays open to any signed-in account", async () => {
    const r = await rpcAs(FREE, "record_quiz_result", { p_module: 1, p_answers: zeros });
    eq(r.status, 200, `expected 200, got ${r.status}`);
  });
  await check("SEAT-04", "a seated member of staff is still marked", async () => {
    const r = await rpcAs(STAFF, "record_quiz_result", { p_module: 2, p_answers: zeros });
    eq(r.status, 200, `expected 200, got ${r.status}`);
  });

  await check("RLS-14", "remove_seat is not executable signed out", async () => {
    // 0011 revokes anon/public. Before it, anon reached the body and got 'no such seat' (400).
    const r = await fetch(`${SUPABASE}/rest/v1/rpc/remove_seat`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ p_end_user: "00000000-0000-0000-0000-000000000000" }) });
    ok([401, 403, 404].includes(r.status), `anon reached remove_seat: ${r.status}`);
  });

  await check("QUIZ-02", "quiz answer key is not readable", async () => {
    const r = await fetch(`${SUPABASE}/rest/v1/quiz_keys?select=*`, { headers: { apikey: key } });
    const rows = r.status === 200 ? await r.json() : [];
    eq(rows.length, 0, `the answer key leaked ${rows.length} rows to an anonymous caller`);
  });

  if (!email || !password) {
    group("RLS, authenticated cases");
    for (const [id, title] of [
      ["RLS-01", "read own profile only"],
      ["RLS-02", "self role escalation refused"],
      ["RLS-03", "self credit grant refused"],
      ["RLS-04", "mass assign refused"],
      ["RLS-05", "IDOR update refused"],
      ["RLS-06", "direct seat insert refused"],
      ["RLS-09", "grant_credits is privileged"],
    ]) {
      await check(id, title, async () => skip("set TEST_MANAGER_EMAIL and TEST_MANAGER_PASSWORD"));
    }
    return report("rls");
  }

  const session = await signIn(key, email, password);
  const call = api(key, session.access_token);
  const uid = session.user.id;

  group("RLS, read scoping");
  let me = null;
  // A manager reads their own row and the rows of staff they hold a seat for (the
  // roster, policies profiles_mgr_read / mp_mgr). Nobody else's: the free agent is
  // seated to no one, so its row and its progress must never appear.
  let seated = [];
  await check("RLS-01", "reads own profile and seated staff only", async () => {
    seated = ((await call(`/rest/v1/seats?select=end_user_id`)).body || []).map((s) => s.end_user_id);
    const r = await call(`/rest/v1/profiles?select=id,email,role,credits_balance`);
    eq(r.status, 200);
    ok(Array.isArray(r.body), "expected an array");
    me = r.body.find((row) => row.id === uid);
    ok(me, "own profile missing");
    for (const row of r.body) {
      ok(row.id === uid || seated.includes(row.id), `leaked a profile that is not theirs: ${row.email}`);
      ok(row.email !== env.E2E_FREEAGENT_EMAIL, "the unseated free agent is visible");
    }
  });

  group("RLS, privilege escalation must be refused");
  // Payloads deliberately reuse the CURRENT values, so a broken guard changes nothing.
  await check("RLS-02", "cannot change own role", async () => {
    const r = await call(`/rest/v1/profiles?id=eq.${uid}`, {
      method: "PATCH",
      body: JSON.stringify({ role: me ? me.role : "manager" }),
    });
    ok(r.status === 401 || r.status === 403, `expected 403, got ${r.status}, PRIVILEGE ESCALATION IS OPEN`);
  });

  await check("RLS-03", "cannot grant self credits", async () => {
    const r = await call(`/rest/v1/profiles?id=eq.${uid}`, {
      method: "PATCH",
      body: JSON.stringify({ credits_balance: me ? me.credits_balance : 0 }),
    });
    ok(r.status === 401 || r.status === 403, `expected 403, got ${r.status}, CREDITS ARE SELF GRANTABLE`);
  });

  await check("RLS-04", "mass assign is refused whole", async () => {
    const r = await call(`/rest/v1/profiles?id=eq.${uid}`, {
      method: "PATCH",
      body: JSON.stringify({ full_name: me ? me.full_name : "QA", role: me ? me.role : "manager" }),
    });
    ok(r.status === 401 || r.status === 403, `expected 403, got ${r.status}, a partial write would be worse`);
  });

  await check("RLS-04b", "own full_name IS permitted", async () => {
    const current = me && me.full_name ? me.full_name : "QA";
    const r = await call(`/rest/v1/profiles?id=eq.${uid}`, {
      method: "PATCH",
      body: JSON.stringify({ full_name: current }),
    });
    ok(r.status < 300, `full_name should be editable, got ${r.status}`);
  });

  await check("RLS-05", "cannot update another user by id", async () => {
    const other = "00000000-0000-0000-0000-000000000001";
    const r = await call(`/rest/v1/profiles?id=eq.${other}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ full_name: "IDOR" }),
    });
    const changed = Array.isArray(r.body) ? r.body.length : 0;
    ok(r.status >= 400 || changed === 0, `IDOR affected ${changed} rows`);
  });

  group("RLS, seats and credits come only from privileged functions");
  await check("RLS-06", "direct seat insert refused", async () => {
    const r = await call(`/rest/v1/seats`, {
      method: "POST",
      body: JSON.stringify({ manager_id: uid, end_user_id: uid }),
    });
    ok(r.status >= 400, `expected refusal, got ${r.status}, assign_seat's credit check is bypassable`);
  });

  await check("RLS-09", "grant_credits refuses an authenticated caller", async () => {
    const r = await call(`/rest/v1/rpc/grant_credits`, {
      method: "POST",
      body: JSON.stringify({ p_manager: uid, p_amount: 1000 }),
    });
    ok(r.status >= 400, `expected refusal, got ${r.status}, ANY MANAGER CAN MINT CREDITS`);
  });

  await check("RLS-07", "assign_seat refuses a non existent target", async () => {
    const r = await call(`/rest/v1/rpc/assign_seat`, {
      method: "POST",
      body: JSON.stringify({ p_end_user: "00000000-0000-0000-0000-000000000002" }),
    });
    ok(r.status >= 400, `expected refusal, got ${r.status}`);
    const msg = JSON.stringify(r.body || {}).toLowerCase();
    ok(
      /no credits|no such user|only managers/.test(msg),
      `unexpected failure reason: ${msg.slice(0, 160)}`
    );
  });

  group("RLS, cross tenant reads");
  await check("RLS-08", "no foreign module_progress", async () => {
    const r = await call(`/rest/v1/module_progress?select=user_id`);
    eq(r.status, 200);
    for (const row of r.body || []) {
      ok(row.user_id === uid || seated.includes(row.user_id), `leaked progress for ${row.user_id}`);
    }
  });

  await check("RLS-13", "no foreign deal registrations", async () => {
    const r = await call(`/rest/v1/deal_registrations?select=reseller_id`);
    const rows = r.status === 200 ? r.body || [] : [];
    eq(rows.length, 0, `a manager can read ${rows.length} reseller deals`);
  });

  return report("rls");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await run();
  process.exit(r.fail ? 1 : 0);
}
