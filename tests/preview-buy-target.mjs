// The buy button after each video must sell the product that was just shown.
import { chromium } from "playwright";
const B="http://localhost:8765/pricing.html";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const fresh = async () => (await browser.newContext({viewport:{width:1400,height:950}})).newPage();

async function endOf(sel) {
  const p = await fresh();
  await p.goto(B,{waitUntil:"networkidle"}); await p.waitForTimeout(800);
  await p.click(sel); await p.waitForTimeout(1200);
  const src = await p.evaluate(()=>document.querySelector(".dmodal-v").currentSrc.split("/").pop());
  await p.evaluate(()=>document.querySelector(".dmodal-v").dispatchEvent(new Event("ended")));
  await p.waitForTimeout(700);
  const buy = await p.evaluate(()=>{const a=document.querySelector(".dmodal-buy"); return a?{href:a.getAttribute("href"), label:a.textContent.trim()}:null;});
  return {p, src, buy};
}

// platform demo -> must buy the platform
const d = await endOf('.tier .cta-row a[href="portal/demo.html"]');
console.log("   platform video ->", JSON.stringify(d.buy), "| clip:", d.src);
ok(d.src.startsWith("platform-demo"), "platform button played the platform video");
ok(d.buy && /plan=platform/.test(d.buy.href), `buy goes to the Platform order (${d.buy && d.buy.href})`);
ok(d.buy && /Platform/.test(d.buy.label), `label names the product (${d.buy && d.buy.label})`);
// and the destination actually renders as Platform
await d.p.goto("http://localhost:8765"+d.buy.href,{waitUntil:"networkidle"}); await d.p.waitForTimeout(700);
const t1 = await d.p.evaluate(()=>document.querySelector(".module-card h3").innerText);
ok(/£249/.test(t1), `lands on Platform pricing (${t1.slice(0,40)})`);

// course video -> must buy Foundation
const c = await endOf('.tier .cta-row .cta[data-course-preview]');
console.log("   course video   ->", JSON.stringify(c.buy), "| clip:", c.src);
ok(c.src.startsWith("course-module-1"), "course button played the module video");
ok(c.buy && !/plan=platform/.test(c.buy.href), "buy goes to the Foundation order");
ok(c.buy && /Foundation/.test(c.buy.label), `label names the product (${c.buy && c.buy.label})`);
await c.p.goto("http://localhost:8765"+c.buy.href,{waitUntil:"networkidle"}); await c.p.waitForTimeout(700);
const t2 = await c.p.evaluate(()=>document.querySelector(".module-card h3").innerText);
ok(/£990/.test(t2), `lands on Foundation pricing (${t2.slice(0,40)})`);
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
