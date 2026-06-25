import { guard, sb, signOut } from "./portal.js";
import { MODULES, TEMPLATES } from "./modules.js";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const profile = await guard(["manager"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " · Manager";
  document.getElementById("out").addEventListener("click", signOut);
  document.getElementById("credits").textContent = profile.credits_balance ?? 0;

  document.getElementById("templates").innerHTML = TEMPLATES.map(t =>
    `<a class="tile" href="/templates/${t.f}"><span class="k">Template</span><h2>${t.t}</h2><span class="arrow">Open →</span></a>`).join("");
  document.getElementById("grid").innerHTML = MODULES.map(m =>
    `<a class="tile" href="/module-${m.n}.html"><span class="k">Module ${String(m.n).padStart(2,"0")}</span><h2>${m.t}</h2><span class="arrow">Open →</span></a>`).join("");

  async function loadSeats() {
    const { data: seats } = await sb.from("seats").select("end_user_id, created_at, profiles!seats_end_user_id_fkey(email)");
    const { data: prog } = await sb.from("module_progress").select("user_id, status");
    const counts = {};
    (prog || []).forEach(p => { if (p.status === "done") counts[p.user_id] = (counts[p.user_id]||0)+1; });
    document.getElementById("seated").textContent = (seats || []).length;
    document.querySelector("#seats tbody").innerHTML = (seats || []).map(s =>
      `<tr><td>${esc(s.profiles?.email || s.end_user_id)}</td><td>${counts[s.end_user_id]||0} / 11</td><td>${new Date(s.created_at).toLocaleDateString()}</td></tr>`
    ).join("") || `<tr><td colspan="3" style="color:var(--text3)">No seats yet.</td></tr>`;
  }
  await loadSeats();

  document.getElementById("assign").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amsg = document.getElementById("amsg");
    amsg.textContent = "Assigning…"; amsg.className = "auth-msg";
    const email = document.getElementById("eu").value.trim();
    const { data: eu } = await sb.from("profiles").select("id").eq("email", email).maybeSingle();
    if (!eu) { amsg.textContent = "No account found for that email. They need to sign up first."; amsg.className = "auth-msg err"; return; }
    const { error } = await sb.rpc("assign_seat", { p_end_user: eu.id });
    if (error) { amsg.textContent = error.message; amsg.className = "auth-msg err"; return; }
    amsg.textContent = "Seat assigned."; amsg.className = "auth-msg ok";
    document.getElementById("eu").value = "";
    const p = await (await import("./portal.js")).getRole();
    document.getElementById("credits").textContent = p.credits_balance ?? 0;
    loadSeats();
  });
}
