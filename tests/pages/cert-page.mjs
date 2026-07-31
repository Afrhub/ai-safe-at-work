// Page object for cert.html. NEG-CERT-01 asks what a query-string-driven
// certificate actually does, so this object reports rather than asserts: it
// returns the landing URL and the rendered text and lets the spec judge.

import { BASE } from "../lib/browser.mjs";
import { SitePage } from "./site-page.mjs";

export class CertPage extends SitePage {
  constructor(page, record) {
    super(page, record);
    this.root = page.locator("#cert-root");
    this.card = page.locator(".cert-card");
    this.errorBox = page.locator(".cert-error");
    this.nameInput = page.getByLabel("Your full name");
  }

  async openForged(module = 1, score = 99, total = 100) {
    await this.page.goto(`${BASE}/cert.html?m=${module}&s=${score}&n=${total}`, {
      waitUntil: "domcontentloaded",
    });
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  // Pretend the learner really passed, so the difference between "the gate
  // stopped me" and "the page cannot render at all" is visible.
  async seedGenuinePass(module = 1, score = 9) {
    await this.page.evaluate(
      ([m, s]) =>
        localStorage.setItem(
          "aisw-quiz-m" + m,
          JSON.stringify({ score: s, threshold: 8, total: 10, t: Date.now() })
        ),
      [module, score]
    );
  }

  landedOn() {
    return this.page.url().replace(BASE, "");
  }

  async observe() {
    const url = this.landedOn();
    const onCert = url.startsWith("/cert.html");
    return {
      url,
      onCert,
      rootHtmlLength: onCert ? (await this.root.count()) ? (await this.root.innerHTML()).length : -1 : -1,
      mainText: onCert ? (await this.page.locator("main").innerText()).trim() : "",
      hasCertCard: onCert ? (await this.card.count()) > 0 : false,
      hasErrorBox: onCert ? (await this.errorBox.count()) > 0 : false,
    };
  }
}
