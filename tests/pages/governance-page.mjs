// Page object for the Governance Centre.
//
// Section C of the test plan is written for an authenticated manager, which the
// AUTH_DISABLED blocker makes untestable. portal/demo.html runs the SAME code
// (portal/assets/aimp.js, path-detected DEMO flag) with no auth and sessionStorage
// standing in for Supabase, so every C case that is really about behaviour rather
// than about RLS can be exercised here. Writes stay in the tab and die with it.

import { BASE } from "../lib/browser.mjs";

export const TAB = {
  dashboard: "dashboard",
  aup: "aup",
  tools: "tools",
  usecases: "usecases",
  risks: "riskreg",
  assessments: "assessments",
  vendors: "vendors",
  vendorRisk: "supplierrisk",
  incidents: "incidents",
  raci: "raci",
  tor: "tor",
  staff: "staff",
};

export class GovernancePage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    this.navList = page.locator("#navlist");
    this.tabs = this.navList.locator("button.tab");
    this.main = page.locator("#main");
    this.pageHeading = page.locator("#main .pagehead h2").first();
    this.modal = page.locator("#modal-root .modal");
    this.modalSave = page.locator("#modalSave");
    this.modalCancel = page.locator("#modalCancel");
    this.toast = page.locator("#toast-root .toast");

    // Governance Centre
    this.needsAttention = page.locator("#main table").first();
    this.addObjectiveBtn = page.locator('[data-act="objEdit"][data-a1="new"]');
    this.objectiveRows = page.locator("#main table tbody tr");

    // Registers
    this.addEntryBtn = page.locator("#addBtn");
    this.registerCount = page.locator("#regCount");
    this.registerTable = page.locator("#regTableWrap table");
    this.registerRows = page.locator("#regTableWrap table tr:not(:first-child)");

    // Policy
    this.publishBtn = page.locator("#publishBtn");
    this.saveOrgBtn = page.locator("#saveOrgBtn");
    this.policyDoc = page.locator("#aupDoc");

    // Staff
    this.addStaffBtn = page.locator("#addStaff");
    this.copyAnnouncementBtn = page.locator("#copyMsg");
    this.staffTable = page.locator("#main table").first();
    this.ackButton = page.locator("#ackBtn");
    this.ackSelect = page.locator("#ackSelect");
  }

  async open() {
    await this.page.goto(BASE + "/portal/demo.html", { waitUntil: "domcontentloaded" });
    await this.tabs.first().waitFor();
    await this.pageHeading.waitFor();
    return this;
  }

  async reload() {
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.tabs.first().waitFor();
    await this.pageHeading.waitFor();
  }

  tabLabels() {
    return this.tabs.evaluateAll((els) => els.map((e) => e.textContent.trim()));
  }

  navGroupLabels() {
    return this.navList.locator(".grp").allTextContents();
  }

  // Waits on the rendered heading, not on a clock: renderMain() replaces #main
  // wholesale, so the new heading appearing IS the completion signal.
  async goTo(tab) {
    await this.navList.locator(`button.tab[data-tab="${tab}"]`).click();
    await this.page.waitForFunction(
      (t) => {
        const active = document.querySelector("#navlist button.tab.active");
        const head = document.querySelector("#main .pagehead h2");
        return Boolean(active && active.dataset.tab === t && head && head.textContent.trim());
      },
      tab
    );
    await this.pageHeading.waitFor();
  }

  heading() {
    return this.pageHeading.textContent().then((t) => t.trim());
  }

  mainText() {
    return this.main.innerText();
  }

  // ---------------- modal ----------------

  async fillModal(values) {
    await this.modalSave.waitFor();
    for (const [id, value] of Object.entries(values)) {
      const field = this.page.locator(`#${id}`);
      const tag = await field.evaluate((el) => el.tagName.toLowerCase());
      if (tag === "select") await field.selectOption({ label: value }).catch(() => field.selectOption(value));
      else await field.fill(value);
    }
  }

  async saveModal() {
    await this.modalSave.click();
    await this.page.waitForFunction(() => document.getElementById("modal-root").children.length === 0);
  }

  modalFieldValue(id) {
    return this.page.locator(`#${id}`).inputValue();
  }

  modalOptionLabels(id) {
    return this.page.locator(`#${id} option`).allTextContents();
  }

  modalFieldDisabled(id) {
    return this.page.locator(`#${id}`).isDisabled();
  }

  // ---------------- registers ----------------

  async addRegisterEntry(values) {
    await this.addEntryBtn.click();
    await this.fillModal(values);
    await this.saveModal();
  }

  async openRegisterRow(index) {
    await this.registerRows.nth(index).locator('[data-act="openRegisterModal"]').click();
    await this.modalSave.waitFor();
  }

  async deleteRegisterRow(index) {
    this.page.once("dialog", (d) => d.accept());
    const before = await this.registerRows.count();
    await this.registerRows.nth(index).locator('[data-act="deleteRegisterRow"]').click();
    await this.page.waitForFunction(
      (n) => document.querySelectorAll("#regTableWrap table tr").length !== n + 1,
      before
    );
  }

  registerRowTexts() {
    return this.registerRows.evaluateAll((rows) =>
      rows.map((r) => [...r.children].map((c) => c.innerText.trim()))
    );
  }

  countText() {
    return this.registerCount.textContent().then((t) => t.trim());
  }

  // ---------------- policy ----------------

  async setPolicyField(id, value) {
    const field = this.page.locator(`#${id}`);
    await field.fill(value);
  }

  async saveAndRegenerate() {
    await this.saveOrgBtn.click();
    await this.toast.first().waitFor();
  }

  async togglePublish() {
    const before = (await this.publishBtn.textContent()).trim();
    await this.publishBtn.click();
    await this.page.waitForFunction(
      (t) => {
        const b = document.getElementById("publishBtn");
        return b && b.textContent.trim() !== t;
      },
      before
    );
  }

  publishButtonLabel() {
    return this.publishBtn.textContent().then((t) => t.trim());
  }

  // Section 3 is either a generated table or the typed fallback list; grab
  // everything between heading 3 and heading 4 without an XPath in the spec.
  approvedToolsSection() {
    return this.policyDoc.evaluate((doc) => {
      const heads = [...doc.querySelectorAll("h4")];
      const start = heads.find((h) => /^3\./.test(h.textContent));
      if (!start) return "";
      let out = "";
      for (let n = start.nextElementSibling; n && n.tagName !== "H4"; n = n.nextElementSibling) {
        out += n.innerText + "\n";
      }
      return out.trim();
    });
  }

  // ---------------- staff ----------------

  async addStaff({ name, email, role }) {
    await this.addStaffBtn.click();
    await this.fillModal({ st_name: name, st_email: email, st_role: role });
    await this.saveModal();
  }

  staffRowTexts() {
    return this.page
      .locator("#main table tbody tr, #main table tr")
      .evaluateAll((rows) => rows.map((r) => r.innerText.replace(/\s+/g, " ").trim()));
  }

  async editStaff(index, values) {
    await this.page.locator('[data-act="openStaffModal"]').nth(index).click();
    await this.fillModal(values);
    await this.saveModal();
  }

  async removeStaff(index) {
    this.page.once("dialog", (d) => d.accept());
    const before = await this.page.locator('[data-act="deleteStaff"]').count();
    await this.page.locator('[data-act="deleteStaff"]').nth(index).click();
    await this.page.waitForFunction(
      (n) => document.querySelectorAll('[data-act="deleteStaff"]').length < n,
      before
    );
  }

  async copyAnnouncement() {
    await this.copyAnnouncementBtn.click();
    await this.toast.first().waitFor();
    return this.page.evaluate(() => navigator.clipboard.readText());
  }

  reminderHrefs() {
    return this.page
      .locator('#main a[href^="mailto:"]')
      .evaluateAll((els) => els.map((e) => decodeURIComponent(e.getAttribute("href"))));
  }

  ackDisabled() {
    return this.ackButton.isDisabled();
  }

  // ---------------- objectives ----------------

  async addObjective({ text, owner, target, status }) {
    await this.addObjectiveBtn.click();
    await this.modalSave.waitFor();
    await this.page.locator("#ob_text").fill(text);
    if (owner) await this.page.locator("#ob_owner").fill(owner);
    if (target) await this.page.locator("#ob_target").fill(target);
    if (status) await this.page.locator("#ob_status").selectOption(status);
    await this.saveModal();
  }

  async editObjective(index, patch) {
    await this.page.locator(`[data-act="objEdit"][data-a1="${index}"]`).click();
    await this.modalSave.waitFor();
    if (patch.target !== undefined) await this.page.locator("#ob_target").fill(patch.target);
    if (patch.text !== undefined) await this.page.locator("#ob_text").fill(patch.text);
    await this.saveModal();
  }

  async deleteObjective(index) {
    this.page.once("dialog", (d) => d.accept());
    await this.page.locator(`[data-act="objDelete"][data-a1="${index}"]`).click();
    await this.page.waitForFunction(
      (i) => !document.querySelector(`[data-act="objDelete"][data-a1="${i}"]`),
      index
    );
  }

  objectiveText() {
    return this.page
      .locator("#main")
      .evaluate(() => {
        const head = [...document.querySelectorAll("#main h3")].find((h) =>
          /Business objectives/i.test(h.textContent)
        );
        if (!head) return "";
        const table = head.parentElement.querySelector("table") ||
          head.closest(".card")?.querySelector("table");
        return table ? table.innerText : head.parentElement.innerText;
      });
  }
}
