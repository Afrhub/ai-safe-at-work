// The preview plays every time; the skip control is earned by watching once.
import { chromium } from "playwright";
const B="http://localhost:8765/pricing.html";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};

// one persistent profile, so localStorage survives between page loads
const ctx = await browser.newContext({viewport:{width:1400,height:950}});
const page = await ctx.newPage();
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const openDemo = async () => { await page.click("a[href='portal/demo.html']"); await page.waitForTimeout(1100); };
const close = async () => { await page.keyboard.press("Escape"); await page.waitForTimeout(500); };

await page.goto(B,{waitUntil:"networkidle"}); await page.waitForTimeout(800);

// 1st open: plays, no skip yet
await openDemo();
ok(await page.$(".dmodal-v") !== null, "1st click opens the preview");
ok(await page.$(".dmodal-skip") === null, "no Skip before it has ever been watched");
await close();

// 2nd open WITHOUT having watched: must still play (the old behaviour skipped it)
await openDemo();
ok(await page.$(".dmodal-v") !== null, "2nd click still opens it — no longer one-shot");
ok(await page.$(".dmodal-skip") === null, "still no Skip: closing early is not watching");
// now watch it through
await page.evaluate(()=>document.querySelector(".dmodal-v").dispatchEvent(new Event("ended")));
await page.waitForTimeout(600);
ok(await page.$(".dmodal-end") !== null, "end overlay shows Buy now");
await close();

// 3rd open: skip is now earned
await openDemo();
ok(await page.$(".dmodal-v") !== null, "3rd click opens it again");
const skip = await page.$(".dmodal-skip");
ok(skip !== null, "Skip appears once watched");
const href = await page.getAttribute(".dmodal-skip","href");
ok(/portal\/demo/.test(href), `Skip goes to the destination (${href})`);
// and it sits over the video, not buried below
const geo = await page.evaluate(()=>{const s=document.querySelector(".dmodal-skip").getBoundingClientRect(); const v=document.querySelector(".dmodal-v").getBoundingClientRect(); return {inside: s.top>=v.top-40 && s.top<v.bottom, right: Math.round(v.right-s.right)};});
ok(geo.inside, "Skip sits over the video");

// survives a full reload (localStorage, not session)
await close();
await page.reload({waitUntil:"networkidle"}); await page.waitForTimeout(900);
await openDemo();
ok(await page.$(".dmodal-skip") !== null, "Skip persists across a reload");

// the course preview is tracked separately
await close();
await page.click(".cta[data-course-preview]"); await page.waitForTimeout(1100);
ok(await page.$(".dmodal-v") !== null, "course preview opens");
ok(await page.$(".dmodal-skip") === null, "course Skip is separate — not inherited from the demo");
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
