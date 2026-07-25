// Each column's first button must open its own product's video.
import { chromium } from "playwright";
const B="http://localhost:8765/pricing.html";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const fresh = async () => (await browser.newContext({viewport:{width:1400,height:950}})).newPage();

let p = await fresh();
await p.goto(B,{waitUntil:"networkidle"}); await p.waitForTimeout(800);
const rows = await p.$$eval(".tier .cta-row", r=>r.map(x=>[...x.querySelectorAll(".cta")].map(a=>a.textContent.trim())));
console.log("   rows:", JSON.stringify(rows));
ok(JSON.stringify(rows[0])===JSON.stringify(["Try the course","Order Foundation"]), "Foundation: Try the course + Order Foundation");
ok(JSON.stringify(rows[1])===JSON.stringify(["Try the demo","Order Attest AI Platform"]), "Platform: Try the demo + Order Attest AI Platform");
ok(await p.$('a.accent[href="portal/demo.html"]') === null, "redundant text link removed");

// Foundation button -> course video
await p.click(".tier .cta-row .cta[data-course-preview]"); await p.waitForTimeout(1300);
let s1 = await p.evaluate(()=>({src:document.querySelector(".dmodal-v").currentSrc.split("/").pop(), go:document.querySelector(".dmodal-go").textContent.trim()}));
console.log("   Foundation ->", JSON.stringify(s1));
ok(s1.src.startsWith("course-module-1"), "Try the course opens the module 1 video");

// Platform button -> governance dashboard video
let p2 = await fresh();
await p2.goto(B,{waitUntil:"networkidle"}); await p2.waitForTimeout(800);
await p2.click('.tier .cta-row a[href="portal/demo.html"]'); await p2.waitForTimeout(1300);
let s2 = await p2.evaluate(()=>({src:document.querySelector(".dmodal-v").currentSrc.split("/").pop(), go:document.querySelector(".dmodal-go").textContent.trim()}));
console.log("   Platform   ->", JSON.stringify(s2));
ok(s2.src.startsWith("platform-demo"), "Try the demo opens the governance dashboard video");
ok(/demo/i.test(s2.go), "onward button offers the demo");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
