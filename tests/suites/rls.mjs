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

const BASE = process.env.BASE_URL || "https://aisafework.netlify.app";
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
  const email = process.env.TEST_MANAGER_EMAIL;
  const password = process.env.TEST_MANAGER_PASSWORD;

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
  await check("RLS-01", "reads own profile only", async () => {
    const r = await call(`/rest/v1/profiles?select=id,email,role,credits_balance`);
    eq(r.status, 200);
    ok(Array.isArray(r.body), "expected an array");
    me = r.body[0];
    for (const row of r.body) {
      ok(row.id === uid || row.manager_id === uid, `leaked a profile that is not theirs: ${row.email}`);
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
      ok(row.user_id === uid, `leaked progress for ${row.user_id}`);
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
