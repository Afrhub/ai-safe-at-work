import { sb, DASH, getRole } from "./portal.js";

const $ = (id) => document.getElementById(id);
const msg = $("msg");
const show = (id) => ["step-login","step-enrol","step-mfa"].forEach(s => $(s).hidden = (s !== id));
const say = (t, cls="") => { msg.textContent = t; msg.className = "auth-msg " + cls; };

async function route() {
  const next = new URLSearchParams(location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return location.replace(next); // same-origin only
  const p = await getRole();
  location.replace((p && DASH[p.role]) || "end-user.html");
}

// If already fully authed, skip straight in.
(async () => {
  const { data:{ session } } = await sb.auth.getSession();
  if (session) {
    const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal.currentLevel === "aal2" || aal.nextLevel === "aal1") return route();
    return startMfa();
  }
})();

let mode = "in";
$("toggle").addEventListener("click", (e) => {
  e.preventDefault();
  mode = mode === "in" ? "up" : "in";
  $("login-title").textContent = mode === "in" ? "Sign in" : "Create account";
  $("login-btn").textContent = mode === "in" ? "Continue" : "Sign up";
  $("toggle-q").textContent = mode === "in" ? "No account?" : "Already have one?";
  $("toggle").textContent = mode === "in" ? "Create one" : "Sign in";
  say("");
});

$("step-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim(), password = $("pw").value;
  if (mode === "up") {
    say("Creating account…");
    // emailRedirectTo pins the confirm link to THIS origin (live site), not the
    // project's Site URL fallback (which was localhost). Landing back on login.html
    // lets supabase-js process the token hash and auto-route into MFA enrolment.
    const emailRedirectTo = new URL("login.html", location.href).href;
    const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo } });
    if (error) return say(error.message, "err");
    if (!data.session) return say("Account created. Check your email to confirm, then sign in.", "ok");
    return startMfa(); // confirmation disabled → straight to MFA setup
  }
  say("Signing in…");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return say(error.message, "err");
  startMfa();
});

async function startMfa() {
  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal.currentLevel === "aal2") return route();
  if (aal.nextLevel === "aal2") { say(""); return show("step-mfa"); }   // factor exists → challenge
  // no factor → enrol
  const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp" });
  if (error) return say(error.message, "err");
  $("qr").src = data.totp.qr_code;          // SVG data URI
  $("step-enrol").dataset.factor = data.id;
  say(""); show("step-enrol");
}

$("step-enrol").addEventListener("submit", async (e) => {
  e.preventDefault(); say("Verifying…");
  const factorId = $("step-enrol").dataset.factor;
  const ch = await sb.auth.mfa.challenge({ factorId });
  if (ch.error) return say(ch.error.message, "err");
  const v = await sb.auth.mfa.verify({ factorId, challengeId: ch.data.id, code: $("enrol-code").value.trim() });
  if (v.error) return say(v.error.message, "err");
  route();
});

$("step-mfa").addEventListener("submit", async (e) => {
  e.preventDefault(); say("Verifying…");
  const { data: factors } = await sb.auth.mfa.listFactors();
  const factor = (factors.totp || [])[0];
  if (!factor) return say("No authenticator enrolled.", "err");
  const ch = await sb.auth.mfa.challenge({ factorId: factor.id });
  if (ch.error) return say(ch.error.message, "err");
  const v = await sb.auth.mfa.verify({ factorId: factor.id, challengeId: ch.data.id, code: $("mfa-code").value.trim() });
  if (v.error) return say(v.error.message, "err");
  route();
});
