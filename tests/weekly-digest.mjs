// The digest must contain the same outstanding items the dashboard shows.
// READ-ONLY: reads the composed text, does not open a mail client.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1500,height:950}, permissions:["clipboard-read","clipboard-write"] });
const page = await ctx.newPage();
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);

ok(await page.isVisible("button[data-act='copyDigest']"), "Copy digest button present");
ok(await page.isVisible("button[data-act='emailDigest']"), "Email digest button present");

await page.click("button[data-act='copyDigest']"); await page.waitForTimeout(600);
const text = await page.evaluate(()=>navigator.clipboard.readText());
console.log("--- digest ---\n" + text + "\n--------------");
ok(text.includes("AI governance digest"), "digest has a title");
ok(/Policy: (published|draft)/.test(text), "digest reports policy version state");
ok(/Staff acknowledged: \d+ of \d+/.test(text), "digest reports acknowledgement count");
ok(/Use cases: \d+/.test(text), "digest reports register totals");
ok(!/<[a-z]/i.test(text), "digest is plain text, no markup leaked from the dashboard");

// every dashboard item must appear in the digest
// scope to the attention card, not the document-pack table further down
const items = await page.evaluate(()=>{
  const card = Array.from(document.querySelectorAll("#main .card"))
    .find(c => /Needs attention/.test(c.querySelector("h3")?.textContent || ""));
  if(!card) return [];
  return Array.from(card.querySelectorAll("table tr td:nth-child(2)")).map(t=>t.innerText.trim());
});
if (items.length) {
  const missing = items.filter(i => !text.includes(i.slice(0, 30)));
  ok(missing.length === 0, `all ${items.length} dashboard item(s) appear in the digest${missing.length?": missing "+missing.join(" | "):""}`);
} else {
  ok(text.includes("Nothing outstanding"), "empty state reads 'Nothing outstanding'");
}
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
