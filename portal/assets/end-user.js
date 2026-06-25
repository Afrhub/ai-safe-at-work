import { guard, sb, signOut } from "./portal.js";
import { MODULES } from "./modules.js";
const profile = await guard(["end_user"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " · Team";
  document.getElementById("out").addEventListener("click", signOut);
  const { data: { user } } = await sb.auth.getUser();
  const { data: prog } = await sb.from("module_progress").select("module,status").eq("user_id", user.id);
  const done = new Set((prog || []).filter(p => p.status === "done").map(p => p.module));
  document.getElementById("grid").innerHTML = MODULES.map(m => `
    <a class="tile" href="/module-${m.n}.html">
      <span class="k">Module ${String(m.n).padStart(2,"0")} ${done.has(m.n) ? "· ✓ done" : ""}</span>
      <h2>${m.t}</h2>
      <span class="arrow">${done.has(m.n) ? "Review →" : "Start →"}</span>
    </a>`).join("");
}
