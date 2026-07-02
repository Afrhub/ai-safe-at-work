import { sb, DASH, getRole } from "./portal.js";

const $ = (id) => document.getElementById(id);
const msg = $("msg");
const say = (t, cls="") => { msg.textContent = t; msg.className = "auth-msg " + cls; };

async function route() {
  const next = new URLSearchParams(location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return location.replace(next); // same-origin only
  const p = await getRole();
  location.replace((p && DASH[p.role]) || "end-user.html");
}

// Already signed in → straight in. (MFA removed — a session is enough for now.)
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) route();
})();

let mode = "in";
$("toggle").addEventListener("click", (e) => {
  e.preventDefault();
  mode = mode === "in" ? "up" : "in";
  $("login-title").textContent = mode === "in" ? "Sign in" : "Create account";
  $("login-btn").textContent  = mode === "in" ? "Continue" : "Sign up";
  $("toggle-q").textContent   = mode === "in" ? "No account?" : "Already have one?";
  $("toggle").textContent     = mode === "in" ? "Create one" : "Sign in";
  say("");
});

$("step-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim(), password = $("pw").value;
  if (mode === "up") {
    say("Creating account…");
    // confirm link lands back here on the live origin, not the project's localhost Site URL
    const emailRedirectTo = new URL("login.html", location.href).href;
    const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo } });
    if (error) return say(error.message, "err");
    if (!data.session) return say("Account created. Check your email to confirm, then sign in.", "ok");
    return route();
  }
  say("Signing in…");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return say(error.message, "err");
  route();
});
