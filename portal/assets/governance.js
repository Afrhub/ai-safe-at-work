import { guard, sb, signOut } from "./portal.js";

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cap = s => s ? s[0].toUpperCase() + s.slice(1).replace(/_/g, " ") : s;
const DOC_NEXT = { draft: "ready", ready: "live", live: "draft" };

// Per-kind config for the risks/incidents/use-cases/vendors manager.
const KINDS = {
  risk:     { label: "Risks",     noun: "risk",       statuses: ["open", "mitigated", "closed"],     severity: ["low", "medium", "high"] },
  incident: { label: "Incidents", noun: "incident",   statuses: ["open", "investigating", "closed"], severity: null },
  use_case: { label: "Use cases", noun: "use case",   statuses: ["proposed", "approved", "rejected"], severity: ["low", "medium", "high"] },
  vendor:   { label: "Vendors",   noun: "vendor",     statuses: ["pending", "assessed", "rejected"], severity: ["green", "amber", "red"] },
};

const profile = await guard(["manager"]);
if (profile) {
  $("who").textContent = (profile.full_name || "") + " · Manager";
  $("out").addEventListener("click", signOut);

  const { data: { user } } = await sb.auth.getUser();
  const myId = user.id;
  let activeKind = "risk";
  let allItems = [];

  await sb.rpc("ensure_governance_docs");

  async function load() {
    const [{ data: docs }, { data: items }] = await Promise.all([
      sb.from("governance_docs").select("*").order("category", { ascending: true }).order("title", { ascending: true }),
      sb.from("governance_items").select("*").order("created_at", { ascending: false }),
    ]);
    allItems = items || [];
    renderDashboard(docs || [], allItems);
    renderItems();
  }

  function renderDashboard(docs, items) {
    const total = docs.length, done = docs.filter(d => d.status !== "draft").length, draft = total - done;
    const count = k => items.filter(i => i.kind === k).length;
    const openRisks = items.filter(i => i.kind === "risk" && i.status !== "closed" && i.status !== "mitigated").length;
    const openIncidents = items.filter(i => i.kind === "incident" && i.status !== "closed").length;

    $("stats").innerHTML = `
      <div class="gv-stat"><div class="n">${done}/${total}</div><div class="l">Documents ready or live</div><div class="sub">${draft} still in draft</div></div>
      <div class="gv-stat"><div class="n">${total ? Math.round(done / total * 100) : 0}%</div><div class="l">Pack completion</div><div class="sub">Across the governance set</div></div>
      <div class="gv-stat"><div class="n">${openRisks}</div><div class="l">Open risks</div><div class="sub">${count("risk")} on the register</div></div>
      <div class="gv-stat"><div class="n">${openIncidents}</div><div class="l">Open incidents</div><div class="sub">In progress</div></div>`;

    $("cards").innerHTML = `
      <a class="tile" href="/templates/ai-use-case-register.html"><span class="k">Register</span><h2>Use cases</h2><p>${count("use_case")} logged. Track every AI use across the business.</p><span class="arrow">Open register →</span></a>
      <a class="tile" href="/templates/vendor-questionnaire.html"><span class="k">Diligence</span><h2>Vendors</h2><p>${count("vendor")} tracked. Score AI suppliers before you buy.</p><span class="arrow">Open diligence →</span></a>
      <a class="tile" href="/templates/ai-steering-group-tor.html"><span class="k">Oversight</span><h2>Steering group</h2><p>Define the group that owns AI governance and signs it off.</p><span class="arrow">Open ToR →</span></a>`;

    $("docs").querySelector("tbody").innerHTML = docs.map(d => `
      <tr><td>${esc(d.title)}</td><td>${esc(d.category || "")}</td>
      <td><button type="button" class="pill ${esc(d.status)}" data-id="${esc(d.id)}" data-status="${esc(d.status)}">${esc(d.status)}</button></td>
      <td>${d.href ? `<a href="${esc(d.href)}">Open →</a>` : ""}</td></tr>`).join("")
      || `<tr><td colspan="4" style="color:var(--text3)">No documents yet.</td></tr>`;
  }

  // ---- Risks / incidents / use cases / vendors manager ----
  function renderTabs() {
    $("gv-tabs").innerHTML = Object.entries(KINDS).map(([k, c]) =>
      `<button type="button" data-kind="${k}" class="${k === activeKind ? "on" : ""}">${c.label} (${allItems.filter(i => i.kind === k).length})</button>`).join("");
  }

  function renderForm() {
    const cfg = KINDS[activeKind];
    $("gi-title-label").textContent = cap(cfg.noun) + " title";
    const sevWrap = $("gi-sev-wrap");
    if (cfg.severity) { sevWrap.style.display = ""; $("gi-severity").innerHTML = cfg.severity.map(s => `<option value="${s}">${cap(s)}</option>`).join(""); }
    else sevWrap.style.display = "none";
    $("gi-status").innerHTML = cfg.statuses.map(s => `<option value="${s}">${cap(s)}</option>`).join("");
  }

  function renderItems() {
    renderTabs();
    const rows = allItems.filter(i => i.kind === activeKind);
    $("gi-list").querySelector("tbody").innerHTML = rows.map(i => `
      <tr>
        <td>${esc(i.title || "(untitled)")}</td>
        <td>${i.severity ? `<span class="gv-sev">${esc(i.severity)}</span>` : ""}</td>
        <td><button type="button" class="pill" data-id="${esc(i.id)}" data-status="${esc(i.status || "")}">${esc(i.status || "set")}</button></td>
        <td><button type="button" class="gi-del" data-del="${esc(i.id)}" aria-label="Remove">✕</button></td>
      </tr>`).join("") || `<tr><td colspan="4" style="color:var(--text3)">No ${esc(KINDS[activeKind].noun)}s yet. Add one above.</td></tr>`;
  }

  $("gv-tabs").addEventListener("click", e => {
    const b = e.target.closest("button[data-kind]"); if (!b) return;
    activeKind = b.dataset.kind; renderForm(); renderItems();
  });

  $("gi-form").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = $("gi-msg");
    const title = $("gi-title").value.trim();
    if (!title) return;
    const cfg = KINDS[activeKind];
    const row = { manager_id: myId, kind: activeKind, title, status: $("gi-status").value };
    if (cfg.severity) row.severity = $("gi-severity").value;
    msg.textContent = "Adding…"; msg.className = "auth-msg";
    const { error } = await sb.from("governance_items").insert(row);
    if (error) { msg.textContent = error.message; msg.className = "auth-msg err"; return; }
    $("gi-title").value = ""; msg.textContent = "";
    await load();
  });

  // Cycle an item's status through its kind's list; delete on ✕.
  $("gi-list").querySelector("tbody").addEventListener("click", async e => {
    const del = e.target.closest("[data-del]");
    const pill = e.target.closest(".pill");
    if (del) {
      del.disabled = true;
      const { error } = await sb.from("governance_items").delete().eq("id", del.dataset.del);
      if (error) { del.disabled = false; alert(error.message); return; }
      return load();
    }
    if (pill) {
      const list = KINDS[activeKind].statuses;
      const next = list[(list.indexOf(pill.dataset.status) + 1) % list.length];
      pill.disabled = true;
      const { error } = await sb.from("governance_items").update({ status: next }).eq("id", pill.dataset.id);
      if (error) { pill.disabled = false; alert(error.message); return; }
      return load();
    }
  });

  // Document-pack status pills (Draft -> Ready -> Live).
  $("docs").querySelector("tbody").addEventListener("click", async e => {
    const btn = e.target.closest(".pill"); if (!btn) return;
    btn.disabled = true;
    const { error } = await sb.from("governance_docs")
      .update({ status: DOC_NEXT[btn.dataset.status] || "draft", updated_at: new Date().toISOString() })
      .eq("id", btn.dataset.id);
    if (error) { btn.disabled = false; alert(error.message); return; }
    load();
  });

  renderForm();
  load();
}
