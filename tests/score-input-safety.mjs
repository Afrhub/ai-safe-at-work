// Score fields must not change value from a click or a stray scroll.
// READ-ONLY: opens a modal, scrolls/clicks, cancels. Nothing saved.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
await page.click(`#navlist button[data-tab="assessments"]`); await page.waitForTimeout(800);
await page.click("#main button:has-text('+ New assessment')"); await page.waitForTimeout(700);

await page.fill("#ra_l_0","3");
await page.click("#ra_l_0");                       // focus it, as a user would
ok(await page.inputValue("#ra_l_0") === "3", "clicking into the field leaves the value alone");

// stray trackpad scroll while focused
const box = await page.$eval("#ra_l_0", e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
await page.mouse.move(box.x, box.y);
for (const d of [-120, -120, 240, 120]) { await page.mouse.wheel(0, d); await page.waitForTimeout(80); }
ok(await page.inputValue("#ra_l_0") === "3", `scrolling over the focused field leaves it alone (got "${await page.inputValue("#ra_l_0")}")`);

// spinner arrows are gone, so a click near the edge cannot nudge it
const spin = await page.$eval("#ra_l_0", e=>getComputedStyle(e).appearance);
ok(spin === "textfield" || spin === "none", `spin buttons suppressed (appearance: ${spin})`);
await page.click("#ra_l_0", {position:{x:1,y:1}});
await page.waitForTimeout(150);
ok(await page.inputValue("#ra_l_0") === "3", "clicking the field edge does not nudge the value");

// typing and arrow keys must still work
await page.fill("#ra_l_0","2"); await page.keyboard.press("ArrowUp");
ok(await page.inputValue("#ra_l_0") === "3", "arrow keys still adjust deliberately");
await page.click("#modalCancel"); await page.waitForTimeout(300);
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
