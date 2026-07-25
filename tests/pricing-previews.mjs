// Both previews: demo behind demo links, course behind "Try the course".
import { chromium } from "playwright";
const B="http://localhost:8765/";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const fresh = async () => (await browser.newContext({viewport:{width:1400,height:950}})).newPage();

// pricing: two buttons per column
let p = await fresh();
await p.goto(B+"pricing.html",{waitUntil:"networkidle"}); await p.waitForTimeout(900);
const rows = await p.$$eval(".tier .cta-row", r=>r.map(x=>[...x.querySelectorAll(".cta")].map(a=>a.textContent.trim())));
console.log("   CTA rows:", JSON.stringify(rows));
ok(rows.length===2, `two columns have paired buttons (${rows.length})`);
ok(rows.every(r=>r.length===2), "each pair has exactly two buttons");
ok(rows[0].includes("Try the course") && rows[0].some(t=>/Order Foundation/.test(t)), "Foundation: Try the course + Order Foundation");
ok(rows[1].includes("Try the course") && rows[1].some(t=>/Order Attest AI Platform/.test(t)), "Platform: Try the course + Order Attest AI Platform");
// side by side, not stacked
const geo = await p.evaluate(()=>{const r=document.querySelector(".tier .cta-row"); const b=[...r.querySelectorAll(".cta")].map(x=>x.getBoundingClientRect()); return {sameRow: Math.abs(b[0].top-b[1].top)<3, n:b.length};});
ok(geo.sameRow, "buttons sit side by side");

// staff bands
const txt = await p.evaluate(()=>document.getElementById("main").innerText);
ok(/1 to 25 staff/.test(txt) && /26 to 50 staff/.test(txt) && /More than 50 staff/.test(txt), "bands read 1-25 / 26-50 / more than 50");
ok(!/up to 100|Over 100/i.test(txt), "no 100-staff band left");

// course preview opens
await p.click(".cta[data-course-preview]"); await p.waitForTimeout(1200);
ok(await p.$(".dmodal-v") !== null, "Try the course opens a preview");
const cs = await p.evaluate(()=>{const v=document.querySelector(".dmodal-v"); return {src:v.currentSrc.split("/").pop(), go:document.querySelector(".dmodal-go").textContent.trim()};});
console.log("   course modal:", JSON.stringify(cs));
ok(cs.src.startsWith("course-module-1"), "plays the module 1 walkthrough");
ok(/module 1/i.test(cs.go), "onward button points at module 1");

// demo preview still opens its own video, fresh session
let p2 = await fresh();
await p2.goto(B+"pricing.html",{waitUntil:"networkidle"}); await p2.waitForTimeout(800);
await p2.click("a[href='portal/demo.html']"); await p2.waitForTimeout(1200);
const ds = await p2.evaluate(()=>{const v=document.querySelector(".dmodal-v"); return {src:v.currentSrc.split("/").pop(), go:document.querySelector(".dmodal-go").textContent.trim()};});
console.log("   demo modal:", JSON.stringify(ds));
ok(ds.src.startsWith("platform-demo"), "demo link still plays the platform demo");
ok(/demo/i.test(ds.go), "onward button points at the demo");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
