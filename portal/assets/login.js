import { sb, DASH, getRole, AUTH_DISABLED, DEMO } from "./portal.js";

const $ = (id) => document.getElementById(id);
const msg = $("msg");
const say = (t, cls = "") => { msg.textContent = t; msg.className = "auth-msg " + cls; };
const show = (id) => ["step-login", "step-enrol", "step-mfa", "step-reset"].forEach(s => $(s).hidden = (s !== id));

async function route() {
  const next = new URLSearchParams(location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return location.replace(next); // same-origin only
  const p = await getRole();
  location.replace((p && DASH[p.role]) || "end-user.html");
}

// After any sign-in: managers/resellers must satisfy TOTP MFA (skipped during demo inspection);
// end-users are passwordless and low-privilege, so no MFA.
async function afterAuth() {
  if (AUTH_DISABLED) return route();               // inspection mode: no MFA friction
  const prof = await getRole();
  const privileged = prof && (prof.role === "manager" || prof.role === "reseller");
  if (!privileged) return route();
  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal.currentLevel === "aal2") return route();                 // already satisfied this session
  if (aal.nextLevel === "aal2") { say(""); return show("step-mfa"); } // factor exists -> challenge
  return startEnrol();                                             // no factor -> enrol
}

async function startEnrol() {
  const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp" });
  if (error) return say(error.message, "err");
  $("qr").src = data.totp.qr_code;
  $("step-enrol").dataset.factor = data.id;
  say(""); show("step-enrol");
}

// Password-reset landing: the emailed link returns here with a recovery token
// (implicit flow -> #type=recovery + #access_token; PKCE flow -> ?code=). A recovery
// establishes a session, so we must NOT let the auto-route below clobber the reset form.
const _p = new URLSearchParams(location.search);
const isRecovery = location.hash.includes("type=recovery") || _p.get("type") === "recovery";
const isAuthCallback = isRecovery || location.hash.includes("access_token") || _p.has("code");
let recovering = isRecovery;
let awaitingCallback = isAuthCallback;

sb.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    recovering = true; awaitingCallback = false;
    show("step-reset"); say("Choose a new password.");
  } else if (event === "SIGNED_IN" && awaitingCallback && !recovering) {
    awaitingCallback = false; afterAuth();          // magic-link sign-in completed
  }
});

// Already signed in (incl. a demo session from inspecting AIMP) -> continue.
(async () => {
  // AIMP inspection: the login workflow is bypassed while AUTH_DISABLED, drop straight
  // into the platform as the demo account, no form. (Removed automatically when auth is armed.)
  if (AUTH_DISABLED) {
    ["step-login", "step-enrol", "step-mfa", "step-reset"].forEach(s => { const e = $(s); if (e) e.hidden = true; });
    say("Opening the platform…");
    const { data: { session } } = await sb.auth.getSession();
    if (!session) await sb.auth.signInWithPassword(DEMO);
    return route();
  }
  if (isRecovery) { show("step-reset"); say("Choose a new password."); return; }
  if (isAuthCallback) return;   // recovery/magic-link still exchanging -> onAuthStateChange routes it
  const { data: { session } } = await sb.auth.getSession();
  if (session) afterAuth();
})();

// Password sign-in (managers / resellers)
$("step-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim().toLowerCase(), password = $("pw").value;
  if (!password) return say("Enter your password, or use the email-link option below.", "err");
  say("Signing in…");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return say(error.message, "err");
  afterAuth();
});

// Magic link (passwordless, team members). Only signs in existing accounts.
$("magic").addEventListener("click", async () => {
  const email = $("email").value.trim().toLowerCase();
  if (!email) return say("Enter your email first, then tap the link option.", "err");
  say("Sending a sign-in link…");
  const emailRedirectTo = new URL("login.html", location.href).href;
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo, shouldCreateUser: false } });
  if (error) return say(error.message, "err");
  say("Check your email for a sign-in link.", "ok");
});

// Forgot password: email a reset link (password accounts only; team members use the magic link)
$("forgot").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim().toLowerCase();
  if (!email) return say("Enter your email first, then tap reset.", "err");
  say("Sending a reset link…");
  const redirectTo = new URL("login.html", location.href).href;
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return say(error.message, "err");
  say("Check your email for a password-reset link.", "ok");
});

// Set the new password (after clicking the reset link)
$("step-reset").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = $("new-pw").value, pw2 = $("new-pw2").value;
  if (pw.length < 8) return say("Use at least 8 characters.", "err");
  if (pw !== pw2) return say("Those passwords do not match.", "err");
  say("Updating…");
  const { error } = await sb.auth.updateUser({ password: pw });
  if (error) return say(error.message, "err");
  say("Password updated. Signing you in…", "ok");
  afterAuth();
});

// MFA enrol (first time)
$("step-enrol").addEventListener("submit", async (e) => {
  e.preventDefault(); say("Verifying…");
  const factorId = $("step-enrol").dataset.factor;
  const ch = await sb.auth.mfa.challenge({ factorId });
  if (ch.error) return say(ch.error.message, "err");
  const v = await sb.auth.mfa.verify({ factorId, challengeId: ch.data.id, code: $("enrol-code").value.trim() });
  if (v.error) return say(v.error.message, "err");
  route();
});

// MFA challenge (returning)
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
