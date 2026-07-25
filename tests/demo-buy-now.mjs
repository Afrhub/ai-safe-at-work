// When the walkthrough ends, a Buy now button appears over the last frame.
import { chromium } from "playwright";
const B="http://localhost:8765/";
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1400,height:900}})).newPage();
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};

await page.goto(B+"pricing.html",{waitUntil:"networkidle"}); await page.waitForTimeout(900);
await page.click("a[href='portal/demo.html']"); await page.waitForTimeout(1200);
ok(await page.$(".dmodal-v") !== null, "modal open");
ok(await page.$(".dmodal-end") === null, "no Buy now before the video ends");

// fire 'ended' rather than waiting 60s
await page.evaluate(()=>document.querySelector(".dmodal-v").dispatchEvent(new Event("ended")));
await page.waitForTimeout(700);
ok(await page.$(".dmodal-end") !== null, "overlay appears when the video ends");
const t = await page.textContent(".dmodal-end");
ok(t.includes("Buy now"), "says 'Buy now'");
// the module-video CTA must not fire as well: two prompts at once is worse than either
ok(await page.$(".vcta-bg") === null, "the module-video 'Contact us now' popup does NOT also fire");

// it must sit INSIDE the video pane, not below it
const geo = await page.evaluate(()=>{
  const v=document.querySelector(".dmodal-v").getBoundingClientRect();
  const e=document.querySelector(".dmodal-end").getBoundingClientRect();
  return {vTop:Math.round(v.top), vBot:Math.round(v.bottom), eTop:Math.round(e.top), eBot:Math.round(e.bottom), eW:Math.round(e.width), vW:Math.round(v.width)};
});
console.log("   geometry:", JSON.stringify(geo));
ok(Math.abs(geo.eTop-geo.vTop)<4 && Math.abs(geo.eBot-geo.vBot)<8, "overlay covers the video pane");
ok(Math.abs(geo.eW-geo.vW)<4, "overlay matches video width");

// destination must be a real, reachable page — never a dead link
const href = await page.getAttribute(".dmodal-buy","href");
const res = await page.request.get(new URL(href, B).href);
ok(res.status()===200, `Buy now points somewhere live (${href} -> ${res.status()})`);

// replay must work, so nobody is stranded on the end card
await page.click(".dmodal-replay"); await page.waitForTimeout(600);
ok(await page.$(".dmodal-end") === null, "Watch again clears the overlay");
const playing = await page.evaluate(()=>!document.querySelector(".dmodal-v").paused);
ok(playing, "and restarts playback");
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
