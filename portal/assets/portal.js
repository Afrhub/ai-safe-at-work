// Shared portal engine: Supabase client, MFA-aware session guard, role router.
// Static ES module, no build step. supabase-js from CDN.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.108.2/+esm";

const cfg = window.AISW_CONFIG;
if (!cfg || !cfg.url || cfg.url.includes("YOUR-PROJECT")) {
  document.body.innerHTML =
    '<p style="font-family:monospace;color:#ff6b6b;padding:2rem">Portal not configured, copy portal/config.example.js to portal/config.js and add your Supabase URL + anon key.</p>';
  throw new Error("AISW_CONFIG missing");
}
export const sb = createClient(cfg.url, cfg.anon);

// Where each role lands after sign-in. Staff go straight into the course, which
// is what they signed in to do; their own progress, certificate and policy
// sign-off live on end-user.html, linked from the course page.
export const DASH = { end_user: "../course.html", manager: "manager.html", reseller: "reseller.html" };

// AUTH IS ARMED. The A2 tripwire fired on 30 Jul 2026 when the first real user was
// provisioned into this Supabase project, and was actioned on 31 Jul 2026:
//   (1) AUTH_DISABLED set to false, (2) the demo password rotated, (3) redeployed.
//
// Do NOT set this back to true. While it was true, every portal page silently signed
// itself in as the demo account, whose password sat in this file in a PUBLIC repo. That
// was acceptable only while the project held nothing but demo data. It now holds real
// accounts, so auto-signin would hand a customer's governance data to a world readable
// login, and would drop a real buyer into someone else's registers.
//
// The public product demo does not depend on any of this: portal/demo.html detects its
// own path and runs against sessionStorage with no account at all.
export const AUTH_DISABLED = false;

// Kept because login.js imports it, but deliberately unusable. The real demo password
// lives in the password manager, never in this repo. An empty secret here means that if
// anyone ever flips the flag above back to true, auto-signin FAILS rather than silently
// exposing an account.
export const DEMO = { email: "demo@attest-ai.com", password: "" };

// Signed in, and (for accounts with a TOTP factor) MFA satisfied. When AUTH_DISABLED,
// guard() auto-demos before this is reached, so the live MFA rule doesn't gate inspection.
export async function isAuthed() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return false;
  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") return false; // factor enrolled, not yet challenged
  return true;
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
  // Ten minutes idle signs out (assets/idle-logout.js, loaded by every authed page).
  // Registering the real signOut here means expiry ends the session server-side too,
  // rather than only clearing the local token.
  if (window.AISW_IDLE) window.AISW_IDLE.onExpire(() => idleSignOut());
  return profile;
}

async function idleSignOut() {
  try { await sb.auth.signOut(); } catch (e) {}
  location.replace("login.html?idle=1");
}

export async function signOut() {
  // Never strand a signed-in user on a dead button: end up at sign-in even if the
  // server call fails, the local session is cleared either way.
  try { await sb.auth.signOut(); } catch (e) {}
  location.replace("login.html");
}

// The Sign out button is static HTML, so it is shipped disabled and comes alive only
// when a page module attaches its handler. Before this, a click in the first moments
// after paint was silently lost — found by the onboarding journey test.
export function wireSignOut(btn, handler = signOut) {
  if (!btn) return;
  btn.addEventListener("click", handler);
  btn.disabled = false;
}
