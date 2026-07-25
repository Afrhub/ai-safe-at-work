// Walk every platform screen, confirm it renders and log any page errors.
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto("http://localhost:8765/portal/manager.html",{waitUntil:"networkidle"});
await page.waitForTimeout(4000);
const tabs = await page.$$eval("#navlist button[data-tab]", b=>b.map(x=>({id:x.dataset.tab,label:x.textContent.trim()})));
for (const t of tabs) {
  await page.click(`#navlist button[data-tab="${t.id}"]`); await page.waitForTimeout(700);
  const txt = await page.evaluate(()=>document.getElementById("main").innerText);
  ok(txt.trim().length > 40, `${t.label} renders (${txt.trim().length} chars)`);
  if (/undefined|NaN|\[object/.test(txt)) ok(false, `${t.label} shows a broken value`);
}
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
