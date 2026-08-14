import { guard, sb, wireSignOut } from "./portal.js";
import { MODULES } from "./modules.js";
const profile = await guard(["end_user"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " · Team";
  wireSignOut(document.getElementById("out"));
  const { data: { user } } = await sb.auth.getUser();

  // There used to be a bridge here: read each module's localStorage pass and push it to
  // module_progress through set_module_progress. That RPC took the score from the client,
  // so anyone could POST themselves a completed course, which is the record cert.html
  // prints and the manager's roster reads. Dropped in migration 0009 along with this
  // caller. quiz.js submits answers to record_quiz_result, which grades them server-side,
  // so progress arrives without a bridge. Module 1 stays client-scored and therefore never
  // appears here: it is the free ungated sample and there is no session to score it.
  const { data: prog } = await sb.from("module_progress").select("module,status").eq("user_id", user.id);
  const done = new Set((prog || []).filter(p => p.status === "done").map(p => p.module));
  const tiles = MODULES.map(m => `
    <a class="tile" href="/module-${m.n}.html">
      <span class="k">Module ${String(m.n).padStart(2,"0")} ${done.has(m.n) ? "· ✓ done" : ""}</span>
      <h2>${m.t}</h2>
      <span class="arrow">${done.has(m.n) ? "Review →" : "Start →"}</span>
    </a>`);
  // Module 11 is the gated finale, not counted in the 11, but still reachable here.
  tiles.push(`
    <a class="tile" href="/module-11.html">
      <span class="k">Finale ${done.has(11) ? "· ✓ done" : ""}</span>
      <h2>The 60-second pre-submit checklist</h2>
      <span class="arrow">${done.has(11) ? "Review →" : "Open →"}</span>
    </a>`);
  document.getElementById("grid").innerHTML = tiles.join("");

  // ---- Company governance: read + acknowledge the org's published (live) policies ----
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const gov = document.getElementById("gov");
  const { data: liveDocs } = await sb.from("governance_docs")
    .select("id,title,href,category,manager_id").eq("status", "live").order("title");
  const { data: myAcks } = await sb.from("governance_acks").select("doc_id");
  const acked = new Set((myAcks || []).map(a => a.doc_id));

  function renderGov() {
    // In-portal nudge: how many live policies still need this staff member's acknowledgement.
    const pending = (liveDocs || []).filter(d => !acked.has(d.id)).length;
    const badge = document.getElementById("gov-badge");
    badge.hidden = pending === 0;
    badge.textContent = pending ? `${pending} awaiting` : "";
    document.getElementById("gov-nav").textContent = "Company governance" + (pending ? ` (${pending})` : "");
    document.getElementById("gov-lede").textContent = pending
      ? `You have ${pending} ${pending === 1 ? "policy" : "policies"} awaiting your acknowledgement.`
      : ((liveDocs || []).length ? "You're up to date. All published policies acknowledged." : "Policies your organisation publishes will appear here.");

    gov.innerHTML = (liveDocs || []).map(d => {
      const done = acked.has(d.id);
      return `<div class="tile" style="min-height:auto">
        <span class="k">${esc(d.category || "Policy")}${done ? " · ✓ acknowledged" : ""}</span>
        <h2 style="font-size:1.2rem">${esc(d.title)}</h2>
        <div style="display:flex;gap:0.7rem;margin-top:0.7rem;align-items:center">
          ${d.href ? `<a href="${esc(d.href)}" class="arrow">Read →</a>` : ""}
          ${done
            ? `<span style="font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--green);border:1px solid rgba(52,211,153,0.5);border-radius:999px;padding:0.24rem 0.62rem">Acknowledged</span>`
            : `<button type="button" class="btn-primary" style="width:auto;padding:0.45rem 0.95rem;font-size:0.8rem" data-ack="${esc(d.id)}" data-mgr="${esc(d.manager_id)}">Acknowledge</button>`}
        </div>
      </div>`;
    }).join("") || `<p class="lede" style="color:var(--text3)">No published policies yet. Your organisation will publish them here.</p>`;
  }
  renderGov();

  gov.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-ack]"); if (!btn) return;
    btn.disabled = true; btn.textContent = "Saving…";
    const { error } = await sb.from("governance_acks")
      .insert({ doc_id: btn.dataset.ack, manager_id: btn.dataset.mgr, end_user_id: user.id });
    if (error) { btn.disabled = false; btn.textContent = "Acknowledge"; alert(error.message); return; }
    acked.add(btn.dataset.ack); renderGov();
  });
}
