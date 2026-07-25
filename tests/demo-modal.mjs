// Demo links open the walkthrough first, then hand off to the live demo.
import { chromium } from "playwright";
const B="http://localhost:8765/";
const browser = await chromium.launch();
const ctx = await browser.newContext({viewport:{width:1400,height:900}});
const page = await ctx.newPage();
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};

await page.goto(B+"pricing.html",{waitUntil:"networkidle"}); await page.waitForTimeout(900);
ok(await page.$("#see-it-working") === null, "inline video section removed from Plans");

await page.click("a[href='portal/demo.html']"); await page.waitForTimeout(900);
ok(await page.$(".dmodal-bg") !== null, "demo link opens the modal instead of navigating");
ok(page.url().includes("pricing"), "did not navigate away");
const st = await page.evaluate(()=>{const v=document.querySelector(".dmodal-v");return {paused:v.paused, muted:v.muted, src:v.currentSrc.split("/").pop()};});
console.log("   video:", JSON.stringify(st));
ok(!st.paused, "starts playing on open");
ok(st.src.startsWith("platform-demo"), "plays the right file");
ok(await page.$(".dmodal-go") !== null, "offers a route into the demo");

// escape closes and records the skip
await page.keyboard.press("Escape"); await page.waitForTimeout(500);
ok(await page.$(".dmodal-bg") === null, "Escape closes it");
await page.click("a[href='portal/demo.html']"); await page.waitForTimeout(1200);
ok(page.url().includes("demo"), `second click goes straight to the demo (${page.url().split("/").pop()})`);

// other pages carry the same behaviour, in a fresh session
const p2 = await browser.newContext({viewport:{width:1400,height:900}}).then(c=>c.newPage());
for (const pg of ["plus-pack.html","solutions.html"]) {
  await p2.goto(B+pg,{waitUntil:"networkidle"}); await p2.waitForTimeout(700);
  await p2.click("a[href='portal/demo.html']"); await p2.waitForTimeout(800);
  ok(await p2.$(".dmodal-bg") !== null, `${pg} demo link opens the modal`);
  await p2.keyboard.press("Escape"); await p2.waitForTimeout(400);
  await p2.evaluate(()=>sessionStorage.removeItem("aisw-demo-skip"));
}
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
