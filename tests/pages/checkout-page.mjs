// Page object for checkout.html, which serves both plans off one Netlify form
// (see assets/checkout.js). Nothing here submits: lib/browser.mjs aborts POSTs
// and leaves the Stripe function hanging, so a "submit" only ever proves which
// code path the page chose.

import { BASE } from "../lib/browser.mjs";
import { SitePage } from "./site-page.mjs";

export const BAND = {
  foundation1to25: "1 to 25 staff — £990 per year",
  foundation26to50: "26 to 50 staff — £1,750 per year",
  platform1to25: "1 to 25 staff — £249 per month",
  over50: "More than 50 staff — we will quote",
};

export class CheckoutPage extends SitePage {
  constructor(page, record) {
    super(page, record);
    this.form = page.locator('form[name="order"]');
    this.company = page.getByLabel("Company");
    this.fullName = page.getByLabel("Your name");
    this.email = page.getByLabel("Work email");
    this.headcount = page.getByLabel("How many staff?");
    this.submit = this.form.locator('button[type="submit"]');
    this.planField = this.form.locator('input[name="plan"]');
    // An h2 styled as h3 since the A11Y-04 fix; match either shape.
    this.priceHeading = page.locator(".module-card .h3-style, .module-card h3").first();
    this.priceNote = page.locator(".module-card p").first();
    this.payMessage = page.locator("#pay-msg");
  }

  // The plan is applied by checkout.js after DOMContentLoaded, so wait for the
  // hidden field it appends rather than assuming a paint has happened.
  async open(plan) {
    const qs = plan ? `?plan=${plan}` : "";
    await this.page.goto(`${BASE}/checkout.html${qs}`, { waitUntil: "domcontentloaded" });
    await this.planField.waitFor({ state: "attached" });
    return this;
  }

  submitLabel() {
    return this.submit.textContent().then((t) => t.trim());
  }

  plan() {
    return this.planField.inputValue();
  }

  bandLabels() {
    return this.headcount.locator("option").allTextContents();
  }

  async fillContact() {
    await this.company.fill("QA Test Co");
    await this.fullName.fill("QA Runner");
    await this.email.fill("qa-do-not-contact@example.com");
  }

  async chooseBand(label) {
    await this.headcount.selectOption({ label });
  }

  // One click. Returns once a POST has left the page, which is the observable
  // event either branch produces: the Stripe function, or the Netlify form.
  async attemptPurchase() {
    const posted = this.waitForAnyPost();
    await this.submit.click();
    return posted;
  }

  // NEG-CON-02. A genuine double click, not two scripted events.
  async doubleClickPurchase() {
    const posted = this.waitForAnyPost();
    await this.submit.dblclick();
    return posted;
  }

  // Both branches POST, so this is a condition and not a sleep. It resolves null
  // if nothing posts at all, which is itself a result worth asserting on.
  waitForAnyPost() {
    return this.page
      .waitForRequest((r) => r.method() === "POST", { timeout: 5000 })
      .catch(() => null);
  }

  submitDisabled() {
    return this.submit.isDisabled();
  }
}
