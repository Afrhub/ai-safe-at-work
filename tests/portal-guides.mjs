// Each platform screen carries a dismissible guide; dismissal sticks per screen.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
const tab = t => page.click(`#navlist button[data-tab="${t}"]`).then(()=>page.waitForTimeout(700));

let seen = 0;
for (const t of ["dashboard","aup","vendors","supplierrisk","usecases","assessments","riskreg","incidents","raci","tor","staff"]) {
  await tab(t);
  if (await page.$(".guide")) seen++;
  else ok(false, `${t} has no guide`);
}
ok(seen === 11, `all 11 screens carry a guide (${seen})`);

// the sequence is spelled out where the UI cannot show it
await tab("vendors");
ok((await page.textContent(".guide")).includes("Step 1"), "vendor diligence names itself step 1");
await tab("supplierrisk");
ok((await page.textContent(".guide")).includes("Step 2"), "vendor score names itself step 2");
await tab("usecases");
ok(/rating is set by/.test(await page.textContent(".guide")), "register explains the derived rating");

// dismissal sticks, and only for that screen
await tab("assessments");
await page.click(".guide-x"); await page.waitForTimeout(300);
ok(await page.$(".guide") === null, "guide dismisses");
await tab("riskreg");
ok(await page.$(".guide") !== null, "dismissal is per screen, others survive");
await tab("assessments");
ok(await page.$(".guide") === null, "stays dismissed on return");
await page.reload({waitUntil:"networkidle"}); await page.waitForTimeout(4000);
await tab("assessments");
ok(await page.$(".guide") === null, "stays dismissed after reload");
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
