// Page object for portal/end-user.html, where a staff member sees their own progress
// and acknowledges whatever their manager has published.

import { BASE } from "../lib/browser.mjs";

export class EndUserPage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    this.who = page.locator("#who");
    this.grid = page.locator("#grid");
    this.tiles = page.locator("#grid .tile");
    this.governance = page.locator("#gov");
    this.governanceLede = page.locator("#gov-lede");
    this.governanceBadge = page.locator("#gov-badge");
  }

  async open() {
    await this.page.goto(BASE + "/portal/end-user.html", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    await this.tiles.first().waitFor({ state: "visible", timeout: 20_000 });
    return this;
  }

  // { 2: true, 3: false, ... } — which module tiles report themselves done.
  doneByModule() {
    return this.page.evaluate(() => {
      const out = {};
      for (const tile of document.querySelectorAll("#grid .tile")) {
        const kicker = tile.querySelector(".k")?.textContent || "";
        const m = kicker.match(/Module (\d+)/);
        const n = m ? Number(m[1]) : kicker.includes("Finale") ? 11 : null;
        if (n) out[n] = kicker.includes("✓ done");
      }
      return out;
    });
  }

  pendingAcknowledgements() {
    return this.page.locator("#gov [data-ack]").count();
  }

  async acknowledgeAll() {
    let clicked = 0;
    for (let guard = 0; guard < 40; guard++) {
      const before = await this.pendingAcknowledgements();
      if (before === 0) break;
      await this.page.locator("#gov [data-ack]").first().click();
      await this.page.waitForFunction(
        (n) => document.querySelectorAll("#gov [data-ack]").length < n,
        before,
        { timeout: 15_000 }
      );
      clicked++;
    }
    return clicked;
  }
}
