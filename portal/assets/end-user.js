import { guard, sb, signOut } from "./portal.js";
import { MODULES } from "./modules.js";
const profile = await guard(["end_user"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " · Team";
  document.getElementById("out").addEventListener("click", signOut);
  const { data: { user } } = await sb.auth.getUser();

  // Bridge: quiz.js records passes to localStorage only. Module pages share this
  // origin, so read those passes here (where we have a session) and sync them to
  // module_progress via the set_module_progress RPC — this is what makes the
  // manager's completion view and cross-device records actually populate.
  const localDone = new Set();
  const syncs = [];
  for (let n = 1; n <= 12; n++) {
    let r; try { r = JSON.parse(localStorage.getItem("aisw-quiz-m" + n) || "null"); } catch (e) { r = null; }
    if (r && typeof r.score === "number" && r.score >= (r.threshold ?? 8)) {
      localDone.add(n);
      syncs.push(sb.rpc("set_module_progress", { p_module: n, p_score: r.score }));
    }
  }
  await Promise.all(syncs);

  const { data: prog } = await sb.from("module_progress").select("module,status").eq("user_id", user.id);
  const done = new Set((prog || []).filter(p => p.status === "done").map(p => p.module));
  localDone.forEach(n => done.add(n));   // show immediately even if a sync lagged
  const tiles = MODULES.map(m => `
    <a class="tile" href="/module-${m.n}.html">
      <span class="k">Module ${String(m.n).padStart(2,"0")} ${done.has(m.n) ? "· ✓ done" : ""}</span>
      <h2>${m.t}</h2>
      <span class="arrow">${done.has(m.n) ? "Review →" : "Start →"}</span>
    </a>`);
  // Module 11 is the gated finale — not counted in the 11, but still reachable here.
  tiles.push(`
    <a class="tile" href="/module-11.html">
      <span class="k">Finale ${done.has(11) ? "· ✓ done" : ""}</span>
      <h2>The 60-second pre-submit checklist</h2>
      <span class="arrow">${done.has(11) ? "Review →" : "Open →"}</span>
    </a>`);
  document.getElementById("grid").innerHTML = tiles.join("");
}
