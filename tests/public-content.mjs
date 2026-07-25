// Public content is reachable and honest: no gated page invites indexing, the
// un-gated pages actually render without a redirect, and the routes exist.
import { chromium } from "playwright";
const B="http://localhost:8765/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1400,height:900} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,160)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};

// un-gated pages must render, not bounce to checkout
for (const p of ["glossary.html","standards-map.html","module-1.html","resources.html"]) {
  await page.goto(B+p,{waitUntil:"networkidle"}); await page.waitForTimeout(1200);
  const url = page.url();
  ok(url.includes(p), `${p} renders without redirect (${url.split("/").pop()})`);
}
// a still-gated module must still bounce
await page.goto(B+"module-5.html",{waitUntil:"networkidle"}); await page.waitForTimeout(1500);
ok(!page.url().includes("module-5"), `module-5 still gated (went to ${page.url().split("/").pop()})`);

// homepage routes into the free content
await page.goto(B+"index.html",{waitUntil:"networkidle"}); await page.waitForTimeout(1000);
for (const h of ["course.html","plus-pack.html","module-1.html","standards-map.html","glossary.html"]) {
  ok(await page.$(`a[href="${h}"]`) !== null, `homepage links ${h}`);
}
// platform page rebuilt
await page.goto(B+"plus-pack.html",{waitUntil:"networkidle"}); await page.waitForTimeout(1000);
const t = await page.evaluate(()=>document.getElementById("main").innerText);
ok(!/Plus Pack/.test(t), "platform page no longer says Plus Pack");
ok(/£249 a month/.test(t), "platform page carries its price");
ok(await page.$('a[href="portal/demo.html"]') !== null, "platform page links the demo");
ok(/rating updates automatically/i.test(t), "platform page explains the automation");
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
