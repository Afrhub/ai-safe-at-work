// Shared portal engine: Supabase client, MFA-aware session guard, role router.
// Static ES module, no build step. supabase-js from CDN.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const cfg = window.AISW_CONFIG;
if (!cfg || !cfg.url || cfg.url.includes("YOUR-PROJECT")) {
  document.body.innerHTML =
    '<p style="font-family:monospace;color:#ff6b6b;padding:2rem">Portal not configured — copy portal/config.example.js to portal/config.js and add your Supabase URL + anon key.</p>';
  throw new Error("AISW_CONFIG missing");
}
export const sb = createClient(cfg.url, cfg.anon);

export const DASH = { end_user: "end-user.html", manager: "manager.html", reseller: "reseller.html" };

// True only when signed in AND MFA satisfied (AAL2 if a factor is enrolled).
export async function isAuthed() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return false;
  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  // nextLevel aal2 means a factor exists; currentLevel must reach it.
  if (aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") return false;
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
