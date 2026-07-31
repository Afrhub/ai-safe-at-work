// Page object for any public marketing page. Everything the responsive,
// accessibility and CSP cases need lives here so the specs stay declarative.

import { BASE, settle } from "../lib/browser.mjs";

export class SitePage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    // Locators as properties. Role-first where the markup allows it.
    this.skipLink = page.getByRole("link", { name: "Skip to main content" });
    this.topbar = page.locator("header.topbar");
    this.nav = page.locator("nav.topbar-nav");
    this.themeToggle = page.locator("button.theme-toggle");
    this.main = page.locator("#main");
    this.h1 = page.getByRole("heading", { level: 1 });
  }

  async open(path) {
    const res = await this.page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    return res;
  }

  async resize(width, height = 800) {
    await this.page.setViewportSize({ width, height });
    await settle(this.page);
  }

  // RSP-01 / NAV-04 / NAV-05. The document, not the body: a wide child inside an
  // overflow:hidden wrapper is invisible here, which is the right answer.
  overflow() {
    return this.page.evaluate(() => {
      const de = document.documentElement;
      return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth };
    });
  }

  // The widest element that sticks out, for a failure message that names a culprit
  // rather than just a number.
  widestOverhang() {
    return this.page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      let worst = null;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.right <= limit + 1) continue;
        if (!worst || r.right > worst.right) {
          worst = {
            right: Math.round(r.right),
            tag: el.tagName.toLowerCase(),
            cls: (el.className && String(el.className).slice(0, 60)) || "",
          };
        }
      }
      return worst;
    });
  }

  // NAV-02. "Centred using the three column grid" is a layout fact, so read the
  // computed grid and check the outer columns match, then confirm the nav's own
  // centre line lands on the page's.
  navLayout() {
    return this.page.evaluate(() => {
      const bar = document.querySelector("header.topbar");
      const nav = document.querySelector("nav.topbar-nav");
      if (!bar || !nav) return null;
      const cs = getComputedStyle(bar);
      const cols = cs.gridTemplateColumns.split(" ").map((v) => parseFloat(v));
      const nr = nav.getBoundingClientRect();
      const br = bar.getBoundingClientRect();
      // one row of pills, or several: compare the nav box to its tallest child
      const kids = [...nav.children].map((c) => c.getBoundingClientRect());
      const tallest = kids.reduce((m, k) => Math.max(m, k.height), 0);
      return {
        display: cs.display,
        columns: cs.gridTemplateColumns,
        firstCol: cols[0],
        lastCol: cols[cols.length - 1],
        navCentre: nr.left + nr.width / 2,
        barCentre: br.left + br.width / 2,
        navTop: nr.top,
        barTop: br.top,
        rows: tallest ? Math.round(nr.height / tallest) : 0,
        clipped: kids.some((k) => k.width < 40 && k.height > 0),
      };
    });
  }

  // NAV-03. Below 901px the header stacks, so the nav sits on its own row under
  // the brand rather than beside it.
  async navIsOnItsOwnRow() {
    const l = await this.navLayout();
    if (!l) return false;
    const brand = await this.page.locator("header.topbar .brand").boundingBox();
    return Boolean(brand && l.navTop >= brand.y + brand.height - 2);
  }

  // A11Y-02. labels[] is the DOM's own answer to "is this programmatically
  // labelled", and it counts a wrapping <label> as well as for=/id.
  formControls() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll("input, select, textarea")]
        .filter((el) => el.type !== "hidden")
        .map((el) => ({
          name: el.name || el.id || el.tagName.toLowerCase(),
          labelled:
            (el.labels && el.labels.length > 0) ||
            Boolean(el.getAttribute("aria-label")) ||
            Boolean(el.getAttribute("aria-labelledby")) ||
            Boolean(el.getAttribute("title")),
          visible: Boolean(el.offsetParent) || el.type === "hidden",
        }))
    );
  }

  // A11Y-04. Footer column headings are part of the page, so they count.
  headingOutline() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => ({
        level: Number(h.tagName[1]),
        text: h.textContent.trim().slice(0, 50),
      }))
    );
  }

  // NAV-08. Tab once from a fresh load and describe whatever lands.
  async tabToSkipLink() {
    await this.page.locator("body").click({ position: { x: 2, y: 2 } }).catch(() => {});
    await this.page.evaluate(() => document.activeElement && document.activeElement.blur());
    await this.page.keyboard.press("Tab");
    await settle(this.page);
    return this.page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return {
        tag: a.tagName,
        text: (a.textContent || "").trim(),
        href: a.getAttribute("href"),
        top: r.top,
        bottom: r.bottom,
        onScreen: r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0,
        visible: cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0",
        outline: cs.outlineStyle,
      };
    });
  }

  // A11Y-01. Walk the real tab order and report what is reachable.
  async tabOrder(steps = 40) {
    await this.page.evaluate(() => document.activeElement && document.activeElement.blur());
    const seen = [];
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press("Tab");
      const el = await this.page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        return {
          tag: a.tagName.toLowerCase(),
          name: a.getAttribute("name") || "",
          type: a.getAttribute("type") || "",
          text: (a.textContent || "").trim().slice(0, 40),
          focusRing:
            getComputedStyle(a).outlineStyle !== "none" ||
            getComputedStyle(a).boxShadow !== "none",
        };
      });
      if (el) seen.push(el);
    }
    return seen;
  }

  // CSP-04. External <script src> is the thing script-src 'self' would kill.
  externalScripts() {
    return this.page.evaluate(() =>
      [...document.querySelectorAll("script[src]")]
        .map((s) => s.src)
        .filter((src) => src && new URL(src).origin !== location.origin)
    );
  }
}
