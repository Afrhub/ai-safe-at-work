// Every editable policy section has a field, and edits reach the document.
// Writes one field then restores it.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
await page.click(`#navlist button[data-tab="aup"]`); await page.waitForTimeout(900);

for (const id of ["f_permittedUses","f_forbiddenInputs","f_outputHandling","f_settingsConfig","f_consequences"]) {
  ok(await page.isVisible("#"+id), `${id} exists`);
  const v = await page.inputValue("#"+id);
  ok(v.length > 20, `${id} is seeded with its existing wording (${v.length} chars)`);
}
const labels = await page.$$eval(".secnum", e=>e.map(x=>x.textContent.trim()));
console.log("   groups:", labels.join(" | "));
ok(labels.length >= 9, `fields grouped by policy section (${labels.length} groups)`);

// an edit must reach the rendered document
const orig = await page.inputValue("#f_consequences");
await page.fill("#f_consequences","PW EDIT MARKER for section 13.");
await page.click("#saveOrgBtn"); await page.waitForTimeout(1400);
ok((await page.evaluate(()=>document.getElementById("main").innerText)).includes("PW EDIT MARKER"),
   "editing a section field changes the generated policy");
await page.fill("#f_consequences", orig);
await page.click("#saveOrgBtn"); await page.waitForTimeout(1400);
ok(!(await page.evaluate(()=>document.getElementById("main").innerText)).includes("PW EDIT MARKER"), "restored");
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
