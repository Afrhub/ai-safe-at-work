// Score bounds: 1-5 fields must not accept out-of-range values.
// HTML min/max only constrain the spinner arrows, not typing, so without an
// explicit clamp a 1-5 field accepts 12 and the 25-point scale silently breaks.
// READ-ONLY: types into fields, asserts, cancels. Writes nothing.
//
// Run: node tests/score-bounds.mjs [url]   (needs playwright; AUTH_DISABLED)
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"});
await page.waitForTimeout(3500);

// --- assessment L/I grid ---
await page.click(`#navlist button[data-tab="assessments"]`); await page.waitForTimeout(700);
await page.click("#main button:has-text('+ New assessment')"); await page.waitForTimeout(600);

const type = async (sel, v) => { await page.fill(sel, v); await page.dispatchEvent(sel,"change"); await page.waitForTimeout(150); return page.inputValue(sel); };
ok(await type("#ra_l_0","12") === "5", "L: 12 clamps to 5");
ok(await type("#ra_i_0","99") === "5", "I: 99 clamps to 5");
ok(await type("#ra_l_1","0")  === "1", "L: 0 clamps up to 1");
ok(await type("#ra_i_1","-4") === "1", "I: negative clamps to 1");
ok(await type("#ra_l_2","02") === "2", "L: 02 normalises to 2");
ok(await type("#ra_i_2","3.7")=== "4", "I: 3.7 rounds to 4");
ok(await type("#ra_l_3","")   === "",  "blank stays blank (unscored is a real state)");
// score must reflect clamped values, not raw input
await page.fill("#ra_l_4","20"); await page.dispatchEvent("#ra_l_4","change");
await page.fill("#ra_i_4","20"); await page.dispatchEvent("#ra_i_4","change");
await page.waitForTimeout(200);
ok((await page.textContent("#ra_score_4")).trim() === "25", `max possible score is 25 (got ${(await page.textContent("#ra_score_4")).trim()})`);
await page.click("#modalCancel"); await page.waitForTimeout(300);

// --- vendor risk score grid ---
await page.click(`#navlist button[data-tab="supplierrisk"]`); await page.waitForTimeout(700);
await page.click("#main button:has-text('+ New score')"); await page.waitForTimeout(600);
const first = await page.$eval(".score-box input", e=>e.id);
ok(await type("#"+first,"9") === "5", `vendor score: 9 clamps to 5 (#${first})`);
await page.click("#modalCancel"); await page.waitForTimeout(300);

console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
