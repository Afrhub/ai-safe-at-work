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
      `<tr><td>${esc(s.profiles?.email || s.end_user_id)}</td><td>${counts[s.end_user_id]||0} / 11</td><td>${new Date(s.created_at).toLocaleDateString()}</td>`+
      `<td><button type="button" class="seat-remove" data-eu="${esc(s.end_user_id)}" data-email="${esc(s.profiles?.email || "this user")}">Remove</button></td></tr>`
    ).join("") || `<tr><td colspan="4" style="color:var(--text3)">No seats yet.</td></tr>`;
  }
  await loadSeats();

  async function refreshCredits() {
    const p = await (await import("./portal.js")).getRole();
    document.getElementById("credits").textContent = p.credits_balance ?? 0;
  }

  // Export the team's completion table as CSV — the manager's audit evidence record.
  document.getElementById("export-csv")?.addEventListener("click", () => {
    const out = [["Team member", "Modules done", "Assigned"]];
    document.querySelectorAll("#seats tbody tr").forEach(tr => {
      const c = [...tr.querySelectorAll("td")];
      if (c.length < 3 || /no seats/i.test(c[0].textContent)) return;
      out.push([c[0].textContent, c[1].textContent, c[2].textContent].map(v => v.trim()));
    });
    const csv = out.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "aimp-completion-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Remove a seat: frees it and returns the credit (server-side remove_seat RPC).
  document.querySelector("#seats tbody").addEventListener("click", async (e) => {
    const btn = e.target.closest(".seat-remove"); if (!btn) return;
    if (!confirm(`Remove ${btn.dataset.email}? Their seat is freed and the credit returned to your balance.`)) return;
    btn.disabled = true; btn.textContent = "Removing…";
    const { error } = await sb.rpc("remove_seat", { p_end_user: btn.dataset.eu });
    if (error) { btn.disabled = false; btn.textContent = "Remove"; alert(error.message); return; }
    await refreshCredits();
    await loadSeats();
  });

  document.getElementById("assign").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amsg = document.getElementById("amsg");
    amsg.textContent = "Assigning…"; amsg.className = "auth-msg";
    const email = document.getElementById("eu").value.trim().toLowerCase();
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
