// Paired CTA labels must stay inside their buttons at every width.
import { chromium } from "playwright";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
for (const w of [1500, 1300, 1180, 1024, 820, 600, 390]) {
  const p = await (await browser.newContext({viewport:{width:w,height:1000}})).newPage();
  await p.goto("http://localhost:8765/pricing.html",{waitUntil:"networkidle"});
  await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll(".tier .cta-row .cta").forEach(a=>{
      const cs=getComputedStyle(a);
      // does the text overflow its own box?
      const overflowX = a.scrollWidth - a.clientWidth;
      const overflowY = a.scrollHeight - a.clientHeight;
      const rect=a.getBoundingClientRect();
      const parent=a.closest(".tier").getBoundingClientRect();
      out.push({
        t:a.textContent.trim().slice(0,26),
        ox:overflowX, oy:overflowY,
        escapesCard: rect.right > parent.right + 1 || rect.left < parent.left - 1,
        w:Math.round(rect.width)
      });
    });
    return out;
  });
  const bad = r.filter(x=>x.ox>1 || x.oy>1 || x.escapesCard);
  ok(bad.length===0, `${w}px — all labels contained` + (bad.length?": "+JSON.stringify(bad):""));
  await p.context().close();
}
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
