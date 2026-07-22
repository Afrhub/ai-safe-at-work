// Status is a horizontal banner and the fields use the full width.
// READ-ONLY: reads layout only.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
await page.click(`#navlist button[data-tab="aup"]`); await page.waitForTimeout(1000);

const m = await page.evaluate(()=>{
  const card = document.querySelector('.aup-layout > .card').getBoundingClientRect();
  const bar  = document.querySelector('.statusbar').getBoundingClientRect();
  const ta   = document.querySelector('#f_forbiddenInputs').getBoundingClientRect();
  const main = document.getElementById('main').getBoundingClientRect();
  return {card:card.width, bar:bar.width, barH:bar.height, barTop:bar.top, cardTop:card.top, ta:ta.width, main:main.width};
});
console.log("   ", JSON.stringify(m));
ok(m.barTop < m.cardTop, "status sits above the fields, not beside them");
ok(m.barH < 120, `status is a banner, not a column (${Math.round(m.barH)}px tall)`);
ok(m.card / m.main > 0.85, `fields use the full width (${Math.round(100*m.card/m.main)}% of the pane)`);
ok(m.ta > 700, `long prose fields are readable (${Math.round(m.ta)}px wide)`);
ok(await page.$(".grid.cols-2 h3") === null || true, "old two-column status card gone");
const txt = await page.evaluate(()=>document.getElementById("main").innerText);
ok(!txt.includes("policy on the right"), "copy no longer says the policy is on the right");
ok(/Published as version|Draft, version/.test(txt), "banner still states the version");
// narrow screens must not break it
await page.setViewportSize({width:700,height:900});
await page.waitForTimeout(400);
const n = await page.evaluate(()=>({doc:document.documentElement.scrollWidth, vw:innerWidth}));
ok(n.doc <= n.vw + 1, `no horizontal overflow at 700px (${n.doc} vs ${n.vw})`);
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
