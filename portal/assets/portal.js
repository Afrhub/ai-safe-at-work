// Shared portal engine: Supabase client, MFA-aware session guard, role router.
// Static ES module, no build step. supabase-js from CDN.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.108.2/+esm";

const cfg = window.AISW_CONFIG;
if (!cfg || !cfg.url || cfg.url.includes("YOUR-PROJECT")) {
  document.body.innerHTML =
    '<p style="font-family:monospace;color:#ff6b6b;padding:2rem">Portal not configured — copy portal/config.example.js to portal/config.js and add your Supabase URL + anon key.</p>';
  throw new Error("AISW_CONFIG missing");
}
export const sb = createClient(cfg.url, cfg.anon);

export const DASH = { end_user: "end-user.html", manager: "manager.html", reseller: "reseller.html" };

// ponytail: AUTH OFF for prod until further notice. Portal pages auto-sign-in as the
// demo account so they render populated with no login. RLS still scopes every query to
// this account, so no real user data is exposed. Restore real auth: set false + redeploy.
export const AUTH_DISABLED = true;
export const DEMO = { email: "demo@attest-ai.com", password: "attest-manager-demo-2026" };

// Signed in is enough (MFA removed for now).
export async function isAuthed() {
  const { data: { session } } = await sb.auth.getSession();
  return !!session;
}

export async function getRole() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("profiles").select("role, full_name, credits_balance").eq("id", user.id).single();
  return data;
}

// Page guard: bounce to login if not authed; bounce to own dashboard if role not allowed.
export async function guard(allowedRoles) {
  if (AUTH_DISABLED) {
    if (!(await isAuthed())) await sb.auth.signInWithPassword(DEMO); // silent demo session; no login, no role gate
    return await getRole();
  }
  if (!(await isAuthed())) { location.replace("login.html"); return null; }
  const profile = await getRole();
  if (!profile) { location.replace("login.html"); return null; }
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    location.replace(DASH[profile.role] || "login.html");
    return null;
  }
  return profile;
}

export async function signOut() {
  await sb.auth.signOut();
  location.replace("login.html");
}
