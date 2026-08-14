// Page object for portal/manager.html, where a manager reads their team's completion.
// This table is the audit evidence the product sells, so the journey suite ends here.

import { BASE } from "../lib/browser.mjs";

export class ManagerPage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    this.who = page.locator("#who");
    this.credits = page.locator("#credits");
    this.seated = page.locator("#seated");
    this.seatRows = page.locator("#seats tbody tr");
    // manager.html is the AIMP shell: every pane starts in a hidden #stash and aimp.js
    // moves the selected one into the main column. The completion table is on Team.
    this.teamTab = page.locator('button.tab[data-tab="m-team"]');
    this.inviteEmail = page.locator("#eu");
    this.inviteForm = page.locator("#assign");
    this.inviteMessage = page.locator("#amsg");
    this.exportButton = page.locator("#export-csv");
  }

  async open() {
    await this.page.goto(BASE + "/portal/manager.html", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    return this.openTeam();
  }

  async openTeam() {
    await this.teamTab.waitFor({ state: "visible", timeout: 20_000 });
    await this.teamTab.click();
    await this.seatRows.first().waitFor({ state: "visible", timeout: 20_000 });
    return this;
  }

  // [{ email, done, total, assigned }] — one entry per seated staff member.
  seats() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll("#seats tbody tr")]
        .map((tr) => [...tr.querySelectorAll("td")].map((td) => td.textContent.trim()))
        .filter((cells) => cells.length >= 3 && !/no seats/i.test(cells[0]))
        .map(([email, progress, assigned]) => {
          const m = progress.match(/(\d+)\s*\/\s*(\d+)/);
          return {
            email,
            done: m ? Number(m[1]) : null,
            total: m ? Number(m[2]) : null,
            assigned,
          };
        })
    );
  }

  async seatFor(email) {
    return (await this.seats()).find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
  }
}
