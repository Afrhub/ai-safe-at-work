import { guard, sb, signOut } from "./portal.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const NEXT = { draft: "ready", ready: "live", live: "draft" };

const profile = await guard(["manager"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " · Manager";
  document.getElementById("out").addEventListener("click", signOut);

  // Seed this manager's document pack from the templates library on first visit.
  await sb.rpc("ensure_governance_docs");

  async function load() {
    const [{ data: docs }, { data: items }] = await Promise.all([
      sb.from("governance_docs").select("*").order("category", { ascending: true }).order("title", { ascending: true }),
      sb.from("governance_items").select("kind,status"),
    ]);
    render(docs || [], items || []);
  }

  function render(docs, items) {
    const total = docs.length;
    const done = docs.filter(d => d.status !== "draft").length;
    const draft = total - done;
    const count = k => items.filter(i => i.kind === k).length;
    const openIncidents = items.filter(i => i.kind === "incident" && i.status !== "closed").length;

    document.getElementById("stats").innerHTML = `
      <div class="gv-stat"><div class="n">${done}/${total}</div><div class="l">Documents ready or live</div><div class="sub">${draft} still in draft</div></div>
      <div class="gv-stat"><div class="n">${total ? Math.round(done / total * 100) : 0}%</div><div class="l">Pack completion</div><div class="sub">Across the governance set</div></div>
      <div class="gv-stat"><div class="n">${count("risk")}</div><div class="l">Open risks</div><div class="sub">On the risk register</div></div>
      <div class="gv-stat"><div class="n">${openIncidents}</div><div class="l">Open incidents</div><div class="sub">In progress</div></div>`;

    document.getElementById("cards").innerHTML = `
      <a class="tile" href="/templates/ai-use-case-register.html"><span class="k">Register</span><h2>Use cases</h2><p>${count("use_case")} logged. Track every AI use across the business.</p><span class="arrow">Open register →</span></a>
      <a class="tile" href="/templates/vendor-questionnaire.html"><span class="k">Diligence</span><h2>Vendors</h2><p>${count("vendor")} tracked. Score AI suppliers before you buy.</p><span class="arrow">Open diligence →</span></a>
      <a class="tile" href="/templates/ai-steering-group-tor.html"><span class="k">Oversight</span><h2>Steering group</h2><p>Define the group that owns AI governance and signs it off.</p><span class="arrow">Open ToR →</span></a>`;

    document.querySelector("#docs tbody").innerHTML = docs.map(d => `
      <tr>
        <td>${esc(d.title)}</td>
        <td>${esc(d.category || "")}</td>
        <td><button type="button" class="pill ${esc(d.status)}" data-id="${esc(d.id)}" data-status="${esc(d.status)}">${esc(d.status)}</button></td>
        <td>${d.href ? `<a href="${esc(d.href)}">Open →</a>` : ""}</td>
      </tr>`).join("") || `<tr><td colspan="4" style="color:var(--text3)">No documents yet.</td></tr>`;
  }

  // Cycle a document's status Draft -> Ready -> Live (manager updates own rows via RLS).
  document.querySelector("#docs tbody").addEventListener("click", async (e) => {
    const btn = e.target.closest(".pill"); if (!btn) return;
    const next = NEXT[btn.dataset.status] || "draft";
    btn.disabled = true;
    const { error } = await sb.from("governance_docs")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("id", btn.dataset.id);
    if (error) { btn.disabled = false; alert(error.message); return; }
    load();
  });

  load();
}
