// Register entry count: must track the rows on add AND on delete.
// Regression guard for the bug where the count was rendered once with the page
// shell, so it stayed frozen while rows were added and removed beneath it.
//
// Run: node tests/register-count.mjs [url]   (needs playwright; AUTH_DISABLED)
// Adds one risk row, asserts, deletes it again, and cleans up in finally.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror", e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const MARK = "PW COUNT CHECK";
const count = () => page.evaluate(()=>document.getElementById("regCount")?.textContent||"");
const rows  = () => page.$$eval("#main table tr", r=>r.length-1).catch(()=>0);
try{
  await page.goto(URL_,{waitUntil:"networkidle"});
  await page.waitForTimeout(3500);
  await page.click(`#navlist button[data-tab="riskreg"]`); await page.waitForTimeout(700);

  const c0 = await count(), r0 = await rows();
  console.log(`   before: count="${c0}" rows=${r0}`);
  ok(c0.startsWith(String(r0)), "count correct on load");

  // ADD
  await page.click("#main button:has-text('+ Add entry')"); await page.waitForTimeout(500);
  await page.fill("#mf_description", MARK);
  await page.click("#modalSave"); await page.waitForTimeout(1500);
  const c1 = await count(), r1 = await rows();
  console.log(`   after add: count="${c1}" rows=${r1}`);
  ok(r1 === r0+1, "row was added");
  ok(c1.startsWith(String(r1)), `count updated on ADD (got "${c1}", ${r1} rows)`);

  // DELETE
  page.once("dialog", d=>d.accept());
  await page.click(`#main tr:has-text("${MARK}") button:has-text("Delete")`);
  await page.waitForTimeout(1500);
  const c2 = await count(), r2 = await rows();
  console.log(`   after delete: count="${c2}" rows=${r2}`);
  ok(r2 === r0, "row was removed");
  ok(c2.startsWith(String(r2)), `count updated on DELETE (got "${c2}", ${r2} rows)`);
} finally {
  // belt and braces: make sure nothing of ours is left behind
  const left = await page.$(`#main tr:has-text("${MARK}") button:has-text("Delete")`).catch(()=>null);
  if(left){ page.once("dialog", d=>d.accept()); await left.click(); await page.waitForTimeout(1200); console.log("   cleaned up leftover row"); }
  console.log("PAGE ERRORS:", errors.length?errors:"none");
  console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
  await browser.close();
}
process.exit(fails.length?1:0);
