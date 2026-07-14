import { guard, sb, signOut } from "./portal.js";
import { MODULES, TEMPLATES } from "./modules.js";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const profile = await guard(["manager"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " · Manager";
  document.getElementById("out").addEventListener("click", signOut);
  document.getElementById("credits").textContent = profile.credits_balance ?? 0;

  // Round doc icon, same look as the landing page's .inc-card .ico.
  const ico = t => t.ico ? `<span style="display:block;width:54px;height:54px;border-radius:50%;background:url('${t.ico}') center 30% / cover no-repeat;border:1px solid var(--border-bold);box-shadow:0 1px 4px rgba(16,24,40,0.18);margin-bottom:0.9rem"></span>` : "";
  document.getElementById("templates").innerHTML = TEMPLATES.map(t =>
    `<a class="tile" href="/templates/${t.f}"><span class="k">Template</span>${ico(t)}<h2>${t.t}</h2><span class="arrow">Open →</span></a>`).join("");
  document.getElementById("grid").innerHTML = MODULES.map(m =>
    `<a class="tile" href="/module-${m.n}.html"><span class="k">Module ${String(m.n).padStart(2,"0")}</span>${ico(m)}<h2>${m.t}</h2><span class="arrow">Open →</span></a>`).join("");

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

  // Invite a team member: spends one credit; the invite-seat Edge Function creates/invites
  // the account (magic-link email for new people) and seats them. No pre-existing account needed.
  document.getElementById("assign").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amsg = document.getElementById("amsg");
    const btn = e.target.querySelector("button[type=submit]");
    amsg.textContent = "Inviting…"; amsg.className = "auth-msg"; btn.disabled = true;
    const email = document.getElementById("eu").value.trim().toLowerCase();
    const { data, error } = await sb.functions.invoke("invite-seat", { body: { email } });
    btn.disabled = false;
    if (error) {
      let m = error.message || "Could not invite that person.";
      try { m = (await error.context.json()).error || m; } catch (_) { /* keep default */ }
      amsg.textContent = m; amsg.className = "auth-msg err"; return;
    }
    amsg.textContent = data?.invited
      ? "Invite sent. They'll get an email with a secure link to set up access."
      : "Existing account seated.";
    amsg.className = "auth-msg ok";
    document.getElementById("eu").value = "";
    await refreshCredits(); loadSeats();
  });
}
