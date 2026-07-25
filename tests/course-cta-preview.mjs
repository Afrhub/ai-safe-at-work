// The course page's Order button shows the course walkthrough first.
import { chromium } from "playwright";
const B="http://localhost:8765/";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const p = await (await browser.newContext({viewport:{width:1400,height:950}})).newPage();
const errors=[]; p.on("pageerror",e=>errors.push(e.message.slice(0,200)));

await p.goto(B+"course.html",{waitUntil:"networkidle"}); await p.waitForTimeout(900);
await p.click('.hero-cta.primary'); await p.waitForTimeout(1400);
ok(await p.$(".dmodal-v") !== null, "Order button opens a preview rather than navigating");
ok(p.url().includes("course"), "did not navigate straight to checkout");
const st = await p.evaluate(()=>({
  src: document.querySelector(".dmodal-v").currentSrc.split("/").pop(),
  go: document.querySelector(".dmodal-go").textContent.trim(),
  goHref: document.querySelector(".dmodal-go").getAttribute("href"),
  playing: !document.querySelector(".dmodal-v").paused
}));
console.log("   ", JSON.stringify(st));
ok(st.src.startsWith("course-module-1"), "plays the course walkthrough");
ok(st.playing, "starts playing");
ok(/Order Foundation/.test(st.go), `onward label matches the button (${st.go})`);
ok(st.goHref === "checkout.html", "onward goes to the order form");

// end card still sells Foundation
await p.evaluate(()=>document.querySelector(".dmodal-v").dispatchEvent(new Event("ended")));
await p.waitForTimeout(700);
const buy = await p.evaluate(()=>{const a=document.querySelector(".dmodal-buy"); return {href:a.getAttribute("href"), label:a.textContent.trim()};});
ok(/Foundation/.test(buy.label) && !/plan=platform/.test(buy.href), `end card sells Foundation (${JSON.stringify(buy)})`);

// pricing previews unaffected
const p2 = await (await browser.newContext({viewport:{width:1400,height:950}})).newPage();
await p2.goto(B+"pricing.html",{waitUntil:"networkidle"}); await p2.waitForTimeout(700);
await p2.click('.tier .cta-row a[href="portal/demo.html"]'); await p2.waitForTimeout(1200);
const d = await p2.evaluate(()=>({src:document.querySelector(".dmodal-v").currentSrc.split("/").pop(), go:document.querySelector(".dmodal-go").textContent.trim()}));
ok(d.src.startsWith("platform-demo") && /demo/i.test(d.go), `platform preview unchanged (${JSON.stringify(d)})`);
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
