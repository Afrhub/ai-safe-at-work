// The public demo must work without auth, carry sample data, sandbox all writes
// to sessionStorage, and never touch Supabase's governance_state.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/demo.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const sbWrites=[]; page.on("request",r=>{ if(/supabase\.co.*governance_state/.test(r.url()) && r.method()!=="GET") sbWrites.push(r.method()+" "+r.url().slice(0,80)); });
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
const mainText = () => page.evaluate(()=>document.getElementById("main").innerText);

const t = await mainText();
ok(t.includes("Needs attention") || t.includes("Nothing outstanding"), "demo dashboard renders without login");
ok((await page.textContent("#who")).includes("Demo"), "identified as a demo environment");
ok((await page.textContent("#out")).includes("Exit demo"), "sign out replaced with Exit demo");
const nav = await page.textContent("#navlist");
ok(!nav.includes("Team"), "Manage group hidden in demo");
ok((await page.textContent("body")).includes("resets when you close the tab"), "banner explains the sandbox");

// seeded data present and linked
await page.click(`#navlist button[data-tab="usecases"]`); await page.waitForTimeout(800);
const uc = await mainText();
ok(uc.includes("Customer email drafting in Copilot"), "seeded use case present");
ok(uc.includes("from assessment"), "seeded assessment drives the rating");
ok(uc.includes("Assessed"), "linkage story visible in the demo");

// edits work and stay local
await page.click("#main button:has-text('+ Add entry')"); await page.waitForTimeout(500);
await page.fill("#mf_name","Demo visitor entry");
await page.click("#modalSave"); await page.waitForTimeout(1200);
ok((await mainText()).includes("Demo visitor entry"), "a visitor can add data");
ok(sbWrites.length === 0, `no Supabase writes from the demo (${sbWrites.length})`);
const stored = await page.evaluate(()=>sessionStorage.getItem("aimp-demo-usecases")||"");
ok(stored.includes("Demo visitor entry"), "edits live in sessionStorage only");
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
