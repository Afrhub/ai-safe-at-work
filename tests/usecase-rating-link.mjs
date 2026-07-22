// Use case rating is driven by its assessment, and the dashboard reports
// exceptions. Creates one use case + one assessment, asserts the rating flows
// through, then deletes both. Self-cleaning.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const MARK = "PW LINK CHECK";
const tab = t => page.click(`#navlist button[data-tab="${t}"]`).then(()=>page.waitForTimeout(800));
const mainText = () => page.evaluate(()=>document.getElementById("main").innerText);
try {
  await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);

  // --- dashboard leads with exceptions, not counts ---
  const dash = await mainText();
  ok(/Needs attention|Nothing outstanding/.test(dash), "dashboard leads with an exception list");

  // --- create a use case, rated Low by hand ---
  await tab("usecases");
  await page.click("#main button:has-text('+ Add entry')"); await page.waitForTimeout(500);
  await page.fill("#mf_name", MARK);
  await page.selectOption("#mf_risk","Low");
  await page.click("#modalSave"); await page.waitForTimeout(1400);
  ok((await mainText()).includes("Not assessed"), "new use case shows as unassessed");

  // it should now appear on the dashboard as needing an assessment
  await tab("dashboard");
  ok((await mainText()).includes(`${MARK} has no risk assessment`), "dashboard flags the unassessed use case");

  // --- assess it with a high score (5 x 5 = 25) ---
  await tab("assessments");
  await page.click("#main button:has-text('+ New assessment')"); await page.waitForTimeout(600);
  await page.fill("#ra_useCase", MARK);
  await page.fill("#ra_l_0","5"); await page.dispatchEvent("#ra_l_0","change");
  await page.fill("#ra_i_0","5"); await page.dispatchEvent("#ra_i_0","change");
  await page.click("#modalSave"); await page.waitForTimeout(1600);

  // --- the register must now say High, sourced from the assessment ---
  await tab("usecases");
  const uc = await mainText();
  ok(uc.includes("from assessment"), "rating is labelled as coming from the assessment");
  ok(/High[\s\S]{0,40}from assessment/.test(uc), `hand-entered Low was replaced by the assessed High`);
  ok(uc.includes("Assessed"), "assessment column updated");

  // --- and the manual select is locked so it cannot silently revert ---
  await page.click(`#main tr:has-text("${MARK}") button:has-text("Edit")`); await page.waitForTimeout(700);
  ok(await page.getAttribute("#mf_risk","disabled") !== null, "rating select is locked while an assessment owns it");
  ok(((await page.textContent(".modal"))||"").includes("set to"), "modal explains why it is locked");
  await page.click("#modalCancel"); await page.waitForTimeout(300);

  // --- dashboard no longer flags it ---
  await tab("dashboard");
  ok(!(await mainText()).includes(`${MARK} has no risk assessment`), "dashboard clears the item once assessed");
} finally {
  for (const [t, sel] of [["assessments",`#main tr:has-text("${MARK}") button:has-text("Delete")`],
                          ["usecases",   `#main tr:has-text("${MARK}") button:has-text("Delete")`]]) {
    await tab(t).catch(()=>{});
    const el = await page.$(sel).catch(()=>null);
    if (el) { page.once("dialog", d=>d.accept()); await el.click(); await page.waitForTimeout(1200); }
  }
  console.log("PAGE ERRORS:", errors.length?errors:"none");
  console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
  await browser.close(); process.exit(fails.length?1:0);
}
