// /review round 2: functional CRUD + persistence against the built portal.
// Safety: page.evaluate runs our own fixed test script, not eval() of untrusted data.
import { chromium } from "playwright";

const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message.slice(0, 140)));
const fails = [];
const ok = (cond, name) => { console.log((cond ? "PASS" : "FAIL"), name); if (!cond) fails.push(name); };

await page.goto(URL_, { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
const tab = t => page.click(`#navlist button[data-tab="${t}"]`).then(() => page.waitForTimeout(500));
const mainText = () => page.evaluate(() => document.getElementById("main").innerText);

// 1. Use case CRUD via modal
await tab("usecases");
await page.click("#main button:has-text('+ Add entry')");
await page.waitForTimeout(400);
await page.fill(".modal input", "PW Test Use Case").catch(() => {});
// fill first text input; leave selects at defaults
await page.click(".modal .btn:not(.ghost)");
await page.waitForTimeout(800);
ok((await mainText()).includes("PW Test Use Case"), "use case added");
// regression: the count used to render once with the page shell, so it stayed
// at "0 entries" while rows were visible below it
const ucCount = await page.evaluate(() => document.getElementById("regCount")?.textContent || "");
ok(/^[1-9]\d* entr/.test(ucCount), `entry count reflects rows, got "${ucCount}"`);

// 2. Risk with matrix rating
await tab("riskreg");
await page.click("#main button:has-text('+ Add entry')");
await page.waitForTimeout(400);
await page.fill(".modal input", "PW Test Risk").catch(() => {});
await page.click(".modal .btn:not(.ghost)");
await page.waitForTimeout(800);
ok((await mainText()).includes("PW Test Risk"), "risk added");

// 2b. Use case <-> assessment traceability
// the register should say "Not assessed" until an assessment is filed against it
await tab("usecases");
ok((await mainText()).includes("Not assessed"), "new use case starts unassessed");

await tab("assessments");
await page.click("#main button:has-text('+ New assessment')");
await page.waitForTimeout(400);
await page.fill("#ra_useCase", "PW Test Use Case");
await page.click(".modal .btn:not(.ghost)");
await page.waitForTimeout(800);
const assessText = await mainText();
ok(assessText.includes("UC-") && !assessText.includes("Unlinked"),
   "assessment linked to the use case by ID, not left unlinked");

await tab("usecases");
ok((await mainText()).includes("Assessed"), "use case register reflects the filed assessment");

// 3. Incident (table shows INC id/type/severity, not reporter)
await tab("incidents");
const incBefore = await page.$$eval("#main tbody tr", r => r.length).catch(() => 0);
await page.click("#main button:has-text('+ Log incident')");
await page.waitForTimeout(400);
await page.fill(".modal input", "PW Tester (QA)").catch(() => {});
await page.click(".modal .btn:not(.ghost)");
await page.waitForTimeout(800);
const incAfter = await page.$$eval("#main tbody tr", r => r.length).catch(() => 0);
ok(incAfter === incBefore + 1 && (await mainText()).includes("INC-"), "incident logged");

// 4. Staff member
await tab("staff");
await page.click("#main button:has-text('+ Add staff member')");
await page.waitForTimeout(400);
await page.fill(".modal input", "PW Tester").catch(() => {});
await page.click(".modal .btn:not(.ghost)");
await page.waitForTimeout(800);
ok((await mainText()).includes("PW Tester"), "staff added");

// 5. AUP save + publish reflects on dashboard
await tab("aup");
await page.fill("#main input", "Playwright Ltd").catch(() => {});
await page.click("#main button:has-text('Save & regenerate')").catch(() => {});
await page.waitForTimeout(600);
await page.click("#main button:has-text('Publish to staff')").catch(() => {});
await page.waitForTimeout(800);
await tab("dashboard");
const dashTxt = await mainText();
ok(/Published|v1\.0/i.test(dashTxt), "AUP publish visible on dashboard");
ok(dashTxt.includes("Playwright Ltd"), "company name from AUP fields on dashboard");

// 6. PERSISTENCE: reload and re-check
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(3500);
await tab("usecases"); ok((await mainText()).includes("PW Test Use Case"), "use case persisted after reload");
await tab("riskreg"); ok((await mainText()).includes("PW Test Risk"), "risk persisted");
await tab("incidents"); ok((await mainText()).includes("INC-"), "incident persisted");
await tab("staff"); ok((await mainText()).includes("PW Tester"), "staff persisted");

// 7. Manage panes still functional (invite form + modules grid)
await tab("m-team");
ok(await page.isVisible("#assign"), "team invite form present");
ok((await page.textContent("#credits"))?.trim() !== "-", "credits loaded");
await tab("m-course");
ok((await page.$$eval("#grid .tile", e => e.length)) === 11, "course grid 11 tiles");

// 8. cleanup test data via UI delete buttons where present
for (const [t, name] of [["usecases", "PW Test Use Case"], ["riskreg", "PW Test Risk"], ["incidents", "INC-"], ["staff", "PW Tester"]]) {
  await tab(t);
  page.once("dialog", d => d.accept());
  const del = await page.$(`#main tr:has-text("${name}") .iconbtn:has-text("✕"), #main tr:has-text("${name}") button:has-text("Delete"), #main tr:has-text("${name}") button:has-text("✕")`);
  if (del) { await del.click(); await page.waitForTimeout(600); }
}
console.log("ERRORS:", errors.length ? errors : "none");
console.log(fails.length ? `FAILS: ${fails.length}` : "ALL PASS");
await browser.close();
process.exit(fails.length ? 1 : 0);
