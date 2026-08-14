// Page object for portal/login.html, the only way into anything authenticated.
//
// Sign-in is two steps for every role: password, then a TOTP challenge, because
// portal.js treats a session without aal2 as signed out.

import { BASE } from "../lib/browser.mjs";
import { nextFreshCode } from "../lib/totp.mjs";

export class PortalLoginPage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    this.email = page.locator("#email");
    this.password = page.locator("#pw");
    this.submit = page.locator("#login-btn");
    this.message = page.locator("#msg");
    this.loginStep = page.locator("#step-login");
    this.mfaStep = page.locator("#step-mfa");
    this.mfaCode = page.locator("#mfa-code");
    this.enrolStep = page.locator("#step-enrol");
  }

  async open() {
    await this.page.goto(BASE + "/portal/login.html", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  // Signs in and returns the path the portal routed to. Throws with the page's own
  // message on failure, so a wrong password reads as a wrong password.
  async signIn({ email, password, totpSecret }) {
    await this.open();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();

    await this.page
      .waitForFunction(() => {
        const mfa = document.getElementById("step-mfa");
        const enrol = document.getElementById("step-enrol");
        const msg = document.getElementById("msg");
        return (
          (mfa && !mfa.hidden) ||
          (enrol && !enrol.hidden) ||
          (msg && msg.classList.contains("err")) ||
          !location.pathname.endsWith("login.html")
        );
      }, { timeout: 30_000 })
      .catch(() => {});

    if (await this.enrolStep.isVisible().catch(() => false)) {
      throw new Error(
        "this account has no TOTP factor yet, so login is asking to enrol one. " +
          "Run scripts/e2e-enrol-totp.mjs for it and put the secret in .env.e2e."
      );
    }
    if (await this.mfaStep.isVisible().catch(() => false)) {
      await this.enterCode(totpSecret);
    }

    await this.page.waitForURL((u) => !u.pathname.endsWith("login.html"), { timeout: 30_000 });
    await this.page.waitForLoadState("networkidle");
    return new URL(this.page.url()).pathname;
  }

  // Supabase refuses a code it has already burned, so a retry waits for a new window
  // rather than resending the same six digits.
  async enterCode(totpSecret, lastCode = null) {
    const code = await nextFreshCode(totpSecret, lastCode);
    await this.mfaCode.fill(code);
    await this.mfaStep.locator("button[type=submit]").click();
    await this.page
      .waitForFunction(
        () => {
          const msg = document.getElementById("msg");
          return (msg && msg.classList.contains("err")) || !location.pathname.endsWith("login.html");
        },
        { timeout: 30_000 }
      )
      .catch(() => {});
    if (await this.message.evaluate((el) => el.classList.contains("err")).catch(() => false)) {
      const text = (await this.message.textContent()) || "";
      if (/invalid|expired/i.test(text) && !lastCode) return this.enterCode(totpSecret, code);
      throw new Error(`MFA rejected: ${text.trim()}`);
    }
    return code;
  }

  errorText() {
    return this.message.textContent();
  }
}
