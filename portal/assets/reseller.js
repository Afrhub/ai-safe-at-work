import { guard, sb, signOut } from "./portal.js";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const profile = await guard(["reseller"]);
if (profile) {
  document.getElementById("who").textContent = (profile.full_name || "") + " Â· Reseller";
  document.getElementById("out").addEventListener("click", signOut);

  async function loadDeals() {
    const { data: deals } = await sb.from("deal_registrations").select("*").order("created_at", { ascending: false });
    const list = deals || [];
    const open = list.filter(d => d.stage === "registered" || d.stage === "qualified");
    const pipe = open.reduce((s, d) => s + (Number(d.est_value) || 0), 0);
    document.getElementById("s-open").textContent = open.length;
    document.getElementById("s-value").textContent = pipe ? "Â£" + pipe.toLocaleString() : "Â£0";
    document.getElementById("s-won").textContent = list.filter(d => d.stage === "won").length;
    document.querySelector("#deals-t tbody").innerHTML = list.map(d =>
   `<tr><td>${esc(d.customer_name)}</td><td>${d.est_value ? "Â£"+Number(d.est_value).toLocaleString() : "—"}</td>
       <td><span class="chip ${d.stage}">${d.stage}</span></td><td>${new Date(d.created_at).toLocaleDateString()}</td></tr>`
    ).join("") || `<tr><td colspan="4" style="color:var(--text3)">No deals registered yet.</td></tr>`;
  }
  await loadDeals();

  async function loadCustomers() {
    const { data: cust } = await sb.from("customers").select("*").order("renewal_date", { ascending: true });
    document.querySelector("#cust-t tbody").innerHTML = (cust || []).map(c =>
   `<tr><td>${esc(c.name)}</td><td>${esc(c.seats)}</td><td>${esc(c.renewal_date || "—")}</td>
       <td><span class="chip ${c.status === "active" ? "won" : "lost"}">${c.status}</span></td></tr>`
    ).join("") || `<tr><td colspan="4" style="color:var(--text3)">No customers yet.</td></tr>`;
  }
  await loadCustomers();

  async function loadCommissions() {
    const { data: comm } = await sb.from("commissions").select("*").order("created_at", { ascending: false });
    const list = comm || [];
    const paid = list.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount || 0), 0);
    const pending = list.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.amount || 0), 0);
    document.getElementById("s-paid").textContent = "Â£" + paid.toLocaleString();
    document.getElementById("s-pending").textContent = "Â£" + pending.toLocaleString();
    document.querySelector("#comm-t tbody").innerHTML = list.map(c =>
   `<tr><td>${esc(c.period || "—")}</td><td>Â£${Number(c.amount||0).toLocaleString()}</td>
       <td><span class="chip ${c.status === "paid" ? "won" : "registered"}">${esc(c.status)}</span></td><td>${esc(c.note || "")}</td></tr>`
    ).join("") || `<tr><td colspan="4" style="color:var(--text3)">No statements yet.</td></tr>`;
  }
  await loadCommissions();

  document.getElementById("custform").addEventListener("submit", async (e) => {
    e.preventDefault();
    const cmsg = document.getElementById("cmsg");
    cmsg.textContent = "Savingâ¦"; cmsg.className = "auth-msg";
    const { data: { user } } = await sb.auth.getUser();
    const { error } = await sb.from("customers").insert({
      reseller_id: user.id,
      name: document.getElementById("cust-name").value.trim(),
      seats: Number(document.getElementById("cust-seats").value) || 0,
      renewal_date: document.getElementById("cust-renew").value || null,
    });
    if (error) { cmsg.textContent = error.message; cmsg.className = "auth-msg err"; return; }
    cmsg.textContent = "Customer added."; cmsg.className = "auth-msg ok";
    document.getElementById("custform").reset();
    loadCustomers();
  });

  document.getElementById("dealform").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dmsg = document.getElementById("dmsg");
    dmsg.textContent = "Registeringâ¦"; dmsg.className = "auth-msg";
    const { data: { user } } = await sb.auth.getUser();
    const { error } = await sb.from("deal_registrations").insert({
      reseller_id: user.id,
      customer_name: document.getElementById("cn").value.trim(),
      customer_contact: document.getElementById("cc").value.trim() || null,
      est_value: document.getElementById("ev").value || null,
      notes: document.getElementById("nt").value.trim() || null,
    });
    if (error) { dmsg.textContent = error.message; dmsg.className = "auth-msg err"; return; }
    dmsg.textContent = "Deal registered."; dmsg.className = "auth-msg ok";
    document.getElementById("dealform").reset();
    loadDeals();
  });
}
