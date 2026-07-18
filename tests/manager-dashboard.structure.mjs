// /review: Playwright walk of the BUILT portal, compared against the artifact spec.
// Safety: page.evaluate runs our own fixed inspection script, not eval() of untrusted data.
import { chromium } from "playwright";
import fs from "fs";

const base = new URL(".", import.meta.url).pathname;
const SPEC = JSON.parse(fs.readFileSync(base + "out/spec.json", "utf8"));
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
const errors = [];
page.on("console", m => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
page.on("pageerror", e => errors.push("PAGEERROR " + e.message.slice(0, 160)));
await page.goto(URL_, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(3500); // guard + demo auto-signin + loadAll

const gaps = [];
const tabs = await page.$$eval("#navlist button.tab", els => els.map(e => ({ tab: e.dataset.tab, label: e.textContent.trim() }))).catch(() => []);
if (!tabs.length) { gaps.push("FATAL: no #navlist tabs rendered"); }

for (const s of SPEC) {
  const t = tabs.find(x => x.tab === s.tab);
  if (!t) { gaps.push(`missing tab: ${s.tab} (${s.label})`); continue; }
  await page.click(`#navlist button[data-tab="${s.tab}"]`);
  await page.waitForTimeout(500);
  const got = await page.evaluate(() => {
    const main = document.getElementById("main");
    return {
      h2: [...main.querySelectorAll("h2")].map(e => e.textContent.trim()),
      h34: [...main.querySelectorAll("h3,h4")].map(e => e.textContent.trim()),
      buttons: [...main.querySelectorAll("button")].map(e => e.textContent.trim().replace(/\s+/g, " ")),
      eyebrow: main.querySelector(".eyebrow")?.textContent.trim(),
      stats: [...main.querySelectorAll(".stat")].length,
      tables: [...main.querySelectorAll("table")].length,
    };
  });
  // compare essentials
  if (s.eyebrow && got.eyebrow !== s.eyebrow) gaps.push(`${s.tab}: eyebrow '${got.eyebrow}' != '${s.eyebrow}'`);
  for (const h of (s.h2 || []).slice(0, 2)) {
    // company name placeholder may differ; normalise
    const want = h.replace(/\[Company Name\]|\[Organisation\]/g, "").trim().slice(0, 25);
    if (!got.h2.some(g => g.includes(want))) gaps.push(`${s.tab}: missing h2 ~ '${h.slice(0, 50)}'`);
  }
  for (const b of (s.buttons || []).slice(0, 8)) {
    if (b && !got.buttons.some(g => g === b)) gaps.push(`${s.tab}: missing button '${b}'`);
  }
  if ((s.stats || []).length && got.stats < s.stats.length) gaps.push(`${s.tab}: stats ${got.stats} < ${s.stats.length}`);
}
// manage group present
for (const m of ["m-team", "m-course", "m-templates", "m-updates"]) {
  if (!tabs.find(x => x.tab === m)) gaps.push(`missing manage tab ${m}`);
}
// no page scroll
const scroll = await page.evaluate(() => getComputedStyle(document.body).overflow);
if (scroll !== "hidden") gaps.push("body scroll not hidden");

console.log("TABS:", tabs.map(t => t.tab).join(","));
console.log("CONSOLE ERRORS:", errors.length ? errors.slice(0, 8) : "none");
console.log("GAPS (" + gaps.length + "):");
gaps.forEach(g => console.log(" -", g));
await page.screenshot({ path: base + "out/built-dashboard.png" });
await browser.close();
process.exit(gaps.length || errors.length ? 1 : 0);
