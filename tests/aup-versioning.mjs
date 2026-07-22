// Saving must increment the version shown under the policy title, without
// invalidating staff acknowledgements until you actually publish.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const docVersion = async () => {
  const t = await page.evaluate(()=>document.getElementById("main").innerText);
  const m = t.slice(t.indexOf("Acceptable Use of AI Tools at")).match(/Version:\s*([0-9.]+)/);
  return m ? m[1] : null;
};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
await page.click(`#navlist button[data-tab="aup"]`); await page.waitForTimeout(900);

const v0 = await docVersion();
await page.click("#saveOrgBtn"); await page.waitForTimeout(1500);
const v1 = await docVersion();
ok(v1 !== v0, `save increments the version (${v0} -> ${v1})`);
await page.click("#saveOrgBtn"); await page.waitForTimeout(1500);
const v2 = await docVersion();
ok(v2 !== v1, `and again on the next save (${v1} -> ${v2})`);
ok(+v2.split(".")[1] === +v1.split(".")[1] + 1, "minor increments by one, major untouched");

const shown = await page.evaluate(()=>document.getElementById("main").innerText);
ok(shown.includes("draft"), "an unpublished document is marked as draft");
ok(shown.includes(`draft at version`) || shown.includes("Unpublished changes"),
   "status card names the draft version");
console.log("   version now:", v2);
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
