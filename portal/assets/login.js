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

// Already signed in (including a demo session from inspecting AIMP) → go straight in.
// Otherwise show the sign-in form. Sign-up is gated: accounts are provisioned, not self-serve.
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) route();
})();

$("step-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim().toLowerCase(), password = $("pw").value;
  say("Signing in…");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return say(error.message, "err");
  route();
});
