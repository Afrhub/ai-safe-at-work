// Page object for portal/governance.html, the manager's governance dashboard.
//
// Five areas: the statistics strip, the register tiles, the AI document pack, the GDPR
// document pack, and the risk / incident / use case / vendor registers.

import { BASE } from "../lib/browser.mjs";

export const REGISTER_KINDS = ["risk", "incident", "use_case", "vendor"];

export class GovernancePage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    this.who = page.locator("#who");
    this.stats = page.locator("#stats .gv-stat");
    this.cards = page.locator("#cards .tile");
    this.aiDocRows = page.locator("#docs tbody tr");
    this.gdprDocRows = page.locator("#gdpr-docs tbody tr");
    this.tabs = page.locator("#gv-tabs button");
    this.itemTitle = page.locator("#gi-title");
    this.itemSeverity = page.locator("#gi-severity");
    this.itemStatus = page.locator("#gi-status");
    this.itemForm = page.locator("#gi-form");
    this.itemMessage = page.locator("#gi-msg");
    this.itemRows = page.locator("#gi-list tbody tr");
  }

  async open() {
    await this.page.goto(BASE + "/portal/governance.html", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    await this.aiDocRows.first().waitFor({ state: "visible", timeout: 25_000 });
    return this;
  }

  // [{ label, value, sub }] for the five headline numbers.
  statistics() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll("#stats .gv-stat")].map((s) => ({
        value: s.querySelector(".n")?.textContent.trim() || "",
        label: s.querySelector(".l")?.textContent.trim() || "",
        sub: s.querySelector(".sub")?.textContent.trim() || "",
      }))
    );
  }

  statistic(labelFragment) {
    return this.statistics().then((all) =>
      all.find((s) => s.label.toLowerCase().includes(labelFragment.toLowerCase())) || null
    );
  }

  documents(which = "docs") {
    return this.page.evaluate(
      (id) =>
        [...document.querySelectorAll(`#${id} tbody tr`)]
          .map((tr) => ({
            title: tr.querySelector("td")?.textContent.trim() || "",
            status: tr.querySelector(".pill")?.textContent.trim() || "",
          }))
          .filter((d) => d.title && !/no documents/i.test(d.title)),
      which
    );
  }

  // Draft → Ready → Live is a three-way cycle, so this clicks until the row reads Live
  // rather than clicking once. That makes a second run a no-op instead of a regression.
  async publishAll(which = "docs") {
    const rows = this.page.locator(`#${which} tbody tr`);
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const pill = rows.nth(i).locator(".pill");
        if ((await pill.textContent())?.trim() === "live") break;
        await pill.click();
        await this.page.waitForFunction(
          ([id, index]) => {
            const row = document.querySelectorAll(`#${id} tbody tr`)[index];
            const button = row && row.querySelector(".pill");
            return button && !button.disabled;
          },
          [which, i],
          { timeout: 20_000 }
        );
      }
    }
    return this.documents(which);
  }

  async selectRegister(kind) {
    await this.page.locator(`#gv-tabs button[data-kind="${kind}"]`).click();
    await this.page.waitForFunction(
      (k) => document.querySelector(`#gv-tabs button[data-kind="${k}"]`)?.classList.contains("on"),
      kind,
      { timeout: 10_000 }
    );
  }

  async addItem(kind, title, { status, severity } = {}) {
    await this.selectRegister(kind);
    await this.itemTitle.fill(title);
    if (status) await this.itemStatus.selectOption(status);
    if (severity && (await this.itemSeverity.isVisible())) {
      await this.itemSeverity.selectOption(severity);
    }
    await this.itemForm.locator("button[type=submit]").click();
    await this.page.waitForFunction(
      (t) => [...document.querySelectorAll("#gi-list tbody tr td:first-child")].some((td) => td.textContent.trim() === t),
      title,
      { timeout: 20_000 }
    );
  }

  items() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll("#gi-list tbody tr")]
        .map((tr) => [...tr.querySelectorAll("td")].map((td) => td.textContent.trim()))
        .filter((c) => c.length >= 3 && !/^No .* yet/i.test(c[0]))
        .map(([title, severity, status]) => ({ title, severity, status }))
    );
  }

  rowFor(title) {
    return this.page.locator("#gi-list tbody tr").filter({ has: this.page.locator(`td:text-is("${title}")`) });
  }

  async cycleStatus(title) {
    const row = this.rowFor(title);
    const before = (await row.locator(".pill").textContent())?.trim();
    await row.locator(".pill").click();
    await this.page.waitForFunction(
      ([t, prev]) =>
        [...document.querySelectorAll("#gi-list tbody tr")].some(
          (tr) =>
            tr.querySelector("td")?.textContent.trim() === t &&
            tr.querySelector(".pill")?.textContent.trim() !== prev
        ),
      [title, before],
      { timeout: 20_000 }
    );
    return { before, after: (await this.rowFor(title).locator(".pill").textContent())?.trim() };
  }

  async renameItem(title, newTitle) {
    await this.rowFor(title).locator("[data-edit]").click();
    const editing = this.page.locator("#gi-list tbody tr .gi-e-title");
    await editing.fill(newTitle);
    await this.page.locator("#gi-list tbody tr [data-save]").click();
    await this.page.waitForFunction(
      (t) => [...document.querySelectorAll("#gi-list tbody tr td:first-child")].some((td) => td.textContent.trim() === t),
      newTitle,
      { timeout: 20_000 }
    );
  }

  // The suite creates register rows, so it removes them again. Documents and progress
  // are left as they are: neither can be reset without the service key, and both are
  // written to be idempotent.
  async deleteItem(title) {
    const row = this.rowFor(title);
    if (!(await row.count())) return false;
    await row.locator("[data-del]").click();
    await this.page.waitForFunction(
      (t) => ![...document.querySelectorAll("#gi-list tbody tr td:first-child")].some((td) => td.textContent.trim() === t),
      title,
      { timeout: 20_000 }
    );
    return true;
  }
}
