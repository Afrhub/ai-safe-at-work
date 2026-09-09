import { MODULES } from "./modules.js";
import { guard, sb, wireSignOut, esc } from "./portal.js";

const $ = id => document.getElementById(id);
const cap = s => s ? s[0].toUpperCase() + s.slice(1).replace(/_/g, " ") : s;
const DOC_NEXT = { draft: "ready", ready: "live", live: "draft" };

const KINDS = {
  risk:     { label: "Risks",     noun: "risk",     statuses: ["open", "mitigated", "closed"],     severity: ["low", "medium", "high"] },
  incident: { label: "Incidents", noun: "incident", statuses: ["open", "investigating", "closed"], severity: null },
  use_case: { label: "Use cases", noun: "use case", statuses: ["proposed", "approved", "rejected"], severity: ["low", "medium", "high"] },
  vendor:   { label: "Vendors",   noun: "vendor",   statuses: ["pending", "assessed", "rejected"], severity: ["green", "amber", "red"] },
};

const profile = await guard(["manager"]);
if (profile) {
  $("who").textContent = (profile.full_name || "") + " · Manager";
  wireSignOut($("out"));

  const { data: { user } } = await sb.auth.getUser();
  const myId = user.id;
  let activeKind = "risk";
  let allItems = [];
  let editingId = null;

  await sb.rpc("ensure_governance_docs");

  // PostgREST answers at most 1,000 rows per request. Acknowledgements are staff x live
  // documents (50 staff x 24 docs = 1,200), so every list is paged to the end.
  async function all(build) {
    const out = []; const page = 1000;
    for (let from = 0; ; from += page) {
      const { data, error } = await build().range(from, from + page - 1);
      if (error) throw error;
      out.push(...(data || []));
      if (!data || data.length < page) return out;
    }
  }
  let lastDocs = [];
  async function load() {
    let docs, items, seats, acks, progress, centre;
    try {
      [docs, items, seats, acks, progress, centre] = await Promise.all([
        all(() => sb.from("governance_docs").select("*").order("category", { ascending: true }).order("title", { ascending: true })),
        all(() => sb.from("governance_items").select("*").order("created_at", { ascending: false })),
        all(() => sb.from("seats").select("end_user_id")),
        all(() => sb.from("governance_acks").select("doc_id,end_user_id")),
        all(() => sb.from("module_progress").select("user_id,module,status")),   // seated staff, via mp_mgr RLS
        // The Governance Centre keeps its risk and incident registers in governance_state;
        // the totals here must count them too, or the two screens disagree (Codex, 9 Sep).
        all(() => sb.from("governance_state").select("key,value").in("key", ["risks", "incidents"])),
      ]);
    } catch (e) {
      // An outage must not read as "0 open incidents" or "no policies live".
      $("stats").innerHTML = `<div class="gv-stat" role="alert"><div class="n">–</div><div class="l">Dashboard unavailable</div><div class="sub">Your records could not be loaded (${esc(e.message || "network")}). Reload; nothing has been lost.</div></div>`;
      return;
    }
    lastDocs = docs; allItems = items;
    const centreOpen = (k) => (((centre || []).find(r => r.key === k) || {}).value || [])
      .filter(x => !/closed|resolved|treated|accepted|retired/i.test(String(x.status || ""))).length;
    renderDashboard(docs, allItems, seats, acks, progress, { risks: centreOpen("risks"), incidents: centreOpen("incidents") });
    renderItems();
  }

  function renderDashboard(docs, items, seats, acks, progress, centre = { risks: 0, incidents: 0 }) {
    const total = docs.length, done = docs.filter(d => d.status !== "draft").length, draft = total - done;
    // Acknowledgement is owed only for staff-facing documents; internal records are
    // ready/live for the manager's own tracking and never counted against staff (0016).
    const liveDocs = docs.filter(d => d.status === "live" && (d.audience || "staff") === "staff");
    const seatIds = new Set(seats.map(s => s.end_user_id));
    const liveIds = new Set(liveDocs.map(d => d.id));
    const validAcks = acks.filter(a => liveIds.has(a.doc_id) && seatIds.has(a.end_user_id)).length;
    const required = seatIds.size * liveDocs.length;
    const ackPct = required ? Math.round(validAcks / required * 100) : 0;
    const count = k => items.filter(i => i.kind === k).length;
    const openRisks = items.filter(i => i.kind === "risk" && i.status === "open").length + centre.risks;
    const openIncidents = items.filter(i => i.kind === "incident" && i.status !== "closed").length + centre.incidents;

    // AI literacy training (EU AI Act Art 4): staff who completed the AI Safe@Work course.
    // The eleven sold modules from modules.js (1 to 10 and 12), not any eleven rows: the
    // finale (11) is not one of them and must not stand in for a missing module.
    const COURSE = new Set(MODULES.map(m => m.n));
    const doneByUser = {};
    progress.forEach(p => { if (p.status === "done" && COURSE.has(p.module)) (doneByUser[p.user_id] ||= new Set()).add(p.module); });
    const trained = seats.filter(s => (doneByUser[s.end_user_id]?.size || 0) >= COURSE.size).length;
    const trainPct = seatIds.size ? Math.round(trained / seatIds.size * 100) : 0;

    $("stats").innerHTML = `
      <div class="gv-stat"><div class="n">${done}/${total}</div><div class="l">Documents ready or live</div><div class="sub">${total ? Math.round(done / total * 100) : 0}% of the pack</div></div>
      <div class="gv-stat"><div class="n">${trainPct}%</div><div class="l">AI literacy trained</div><div class="sub">${seatIds.size ? `${trained}/${seatIds.size} completed the course · Art 4` : "no staff seated yet"}</div></div>
      <div class="gv-stat"><div class="n">${ackPct}%</div><div class="l">Staff acknowledgement</div><div class="sub">${required ? `${validAcks}/${required} across ${seatIds.size} staff` : "no live policies yet"}</div></div>
      <div class="gv-stat"><div class="n">${openRisks}</div><div class="l">Open risks</div><div class="sub">${count("risk")} on the register</div></div>
      <div class="gv-stat"><div class="n">${openIncidents}</div><div class="l">Open incidents</div><div class="sub">In progress</div></div>`;

    // Round doc icon, same look as the manager portal's template tiles.
    const ico = src => `<span style="display:block;width:54px;height:54px;border-radius:50%;background:url('${src}') center 30% / cover no-repeat;border:1px solid var(--border-bold);box-shadow:0 1px 4px rgba(16,24,40,0.18);margin-bottom:0.9rem"></span>`;
    $("cards").innerHTML = `
      <a class="tile" href="/templates/ai-use-case-register.html"><span class="k">Register</span>${ico("/assets/hero-use-case-register.jpg?v=1")}<h2>Use cases</h2><p>${count("use_case")} logged. Track every AI use across the business.</p><span class="arrow">Open register →</span></a>
      <a class="tile" href="/templates/vendor-questionnaire.html"><span class="k">Diligence</span>${ico("/assets/hero-vendor-dd.jpg?v=1")}<h2>Vendors</h2><p>${count("vendor")} tracked. Score AI suppliers before you buy.</p><span class="arrow">Open diligence →</span></a>
      <a class="tile" href="/templates/ai-steering-group-tor.html"><span class="k">Oversight</span>${ico("/assets/hero-tor.jpg?v=1")}<h2>Steering group</h2><p>Define the group that owns AI governance and signs it off.</p><span class="arrow">Open ToR →</span></a>`;

    const docRow = d => `<tr><td>${esc(d.title)}</td><td>${esc(d.category || "")}${(d.audience || "staff") === "internal" ? ' <span style="color:var(--text3)">· internal record, not acknowledged by staff</span>' : ""}</td>`
      + `<td><button type="button" class="pill ${esc(d.status)}" data-id="${esc(d.id)}" data-status="${esc(d.status)}">${esc(d.status)}</button></td>`
      + `<td>${d.href ? `<a href="${esc(d.href)}">Open →</a>` : ""}</td></tr>`;
    const fillDocs = (id, rows) => { $(id).querySelector("tbody").innerHTML = rows.map(docRow).join("") || `<tr><td colspan="4" style="color:var(--text3)">No documents yet.</td></tr>`; };
    fillDocs("docs", docs.filter(d => (d.domain || "ai") === "ai"));
    fillDocs("gdpr-docs", docs.filter(d => d.domain === "gdpr"));
  }

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
    const cfg = KINDS[activeKind];
    const rows = allItems.filter(i => i.kind === activeKind);
    $("gi-list").querySelector("tbody").innerHTML = rows.map(i => {
      if (i.id === editingId) {
        const sev = cfg.severity ? `<select class="gi-e-sev">${cfg.severity.map(s => `<option value="${s}" ${s === i.severity ? "selected" : ""}>${cap(s)}</option>`).join("")}</select>` : "";
        return `<tr data-row="${esc(i.id)}">
          <td><input class="gi-e-title" type="text" value="${esc(i.title || "")}" /></td>
          <td>${sev}</td>
          <td><button type="button" class="pill">${esc(i.status || "")}</button></td>
          <td><button type="button" class="btn-primary" style="width:auto;padding:0.3rem 0.7rem;font-size:0.75rem" data-save="${esc(i.id)}">Save</button> <button type="button" class="gi-del" data-cancel="1">✕</button></td>
        </tr>`;
      }
      return `<tr>
        <td>${esc(i.title || "(untitled)")}</td>
        <td>${i.severity ? `<span class="gv-sev">${esc(i.severity)}</span>` : ""}</td>
        <td><button type="button" class="pill" data-id="${esc(i.id)}" data-status="${esc(i.status || "")}">${esc(i.status || "set")}</button></td>
        <td><button type="button" class="gi-del" data-edit="${esc(i.id)}" aria-label="Edit" style="margin-right:0.3rem">✎</button><button type="button" class="gi-del" data-del="${esc(i.id)}" aria-label="Remove">✕</button></td>
      </tr>`;
    }).join("") || `<tr><td colspan="4" style="color:var(--text3)">No ${esc(cfg.noun)}s yet. Add one above.</td></tr>`;
  }

  $("gv-tabs").addEventListener("click", e => {
    const b = e.target.closest("button[data-kind]"); if (!b) return;
    activeKind = b.dataset.kind; editingId = null; renderForm(); renderItems();
  });

  $("gi-form").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = $("gi-msg"), title = $("gi-title").value.trim();
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

  $("gi-list").querySelector("tbody").addEventListener("click", async e => {
    const edit = e.target.closest("[data-edit]");
    const save = e.target.closest("[data-save]");
    const cancel = e.target.closest("[data-cancel]");
    const del = e.target.closest("[data-del]");
    const pill = e.target.closest(".pill");
    if (edit) { editingId = edit.dataset.edit; return renderItems(); }
    if (cancel) { editingId = null; return renderItems(); }
    if (save) {
      const tr = save.closest("tr");
      const patch = { title: tr.querySelector(".gi-e-title").value.trim() || "(untitled)" };
      const sevEl = tr.querySelector(".gi-e-sev"); if (sevEl) patch.severity = sevEl.value;
      save.disabled = true;
      const { error } = await sb.from("governance_items").update(patch).eq("id", save.dataset.save);
      if (error) { save.disabled = false; alert(error.message); return; }
      editingId = null; return load();
    }
    if (del) {
      del.disabled = true;
      const { error } = await sb.from("governance_items").delete().eq("id", del.dataset.del);
      if (error) { del.disabled = false; alert(error.message); return; }
      return load();
    }
    if (pill && pill.dataset.id) {
      const list = KINDS[activeKind].statuses;
      const next = list[(list.indexOf(pill.dataset.status) + 1) % list.length];
      pill.disabled = true;
      const { error } = await sb.from("governance_items").update({ status: next }).eq("id", pill.dataset.id);
      if (error) { pill.disabled = false; alert(error.message); return; }
      return load();
    }
  });

  async function docPill(e) {
    const btn = e.target.closest(".pill"); if (!btn) return;
    // Nine GDPR documents ship with no content link yet. Staff cannot acknowledge what they
    // cannot read, so a document without one stops at "ready".
    const doc = lastDocs.find(d => d.id === btn.dataset.id);
    if (doc && !doc.href && (doc.audience || "staff") === "staff" && DOC_NEXT[btn.dataset.status] === "live") {
      alert("This document has no content yet, so it cannot go live. Add the document first.");
      return;
    }
    btn.disabled = true;
    const { error } = await sb.from("governance_docs")
      .update({ status: DOC_NEXT[btn.dataset.status] || "draft", updated_at: new Date().toISOString() })
      .eq("id", btn.dataset.id);
    if (error) { btn.disabled = false; alert(error.message); return; }
    load();
  }
  $("docs").querySelector("tbody").addEventListener("click", docPill);
  $("gdpr-docs").querySelector("tbody").addEventListener("click", docPill);

  renderForm();
  load();
}
