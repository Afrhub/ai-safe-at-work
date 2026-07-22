// Form placeholders: prompt text must live in the placeholder attribute, never
// as a seeded value, or every field arrives pre-filled and has to be deleted
// before typing. Also guards the docVal() fallback that keeps the generated
// policy showing [Company Name] when the field is blank.
//
// Run: node tests/form-placeholders.mjs [url]   (needs playwright; AUTH_DISABLED)
// READ-ONLY: reads values/placeholders and types into one field. Does not save.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,200)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"});
await page.waitForTimeout(3500);

await page.click(`#navlist button[data-tab="aup"]`); await page.waitForTimeout(800);
for (const [id, ph] of [["f_companyName","company name"],["f_owner","DPO / CISO"],["f_dpoName","DPO or data contact"]]) {
  const v  = await page.inputValue("#"+id);
  const pl = await page.getAttribute("#"+id,"placeholder");
  ok(!/^\s*\[.*\]\s*$/.test(v), `#${id} value is not a bracketed prompt (got "${v}")`);
  ok((pl||"").includes(ph), `#${id} has a real placeholder ("${pl}")`);
}
// typing must not need a delete first
await page.click("#f_dpoName"); await page.keyboard.type("Jane Smith");
ok(await page.inputValue("#f_dpoName") === "Jane Smith", "typing into an empty field gives a clean value");

// the generated policy must still show a fill-me marker, not a blank
const doc = await page.evaluate(()=>document.getElementById("main").innerText);
ok(doc.includes("[Company Name]") || doc.includes("ally pally"), "policy document still shows a company marker or the saved name");

await page.click(`#navlist button[data-tab="tor"]`); await page.waitForTimeout(800);
for (const id of ["t_org","t_chair","m_held_0"]) {
  const v = await page.inputValue("#"+id);
  ok(!/^\s*\[.*\]\s*$/.test(v), `#${id} value is not a bracketed prompt (got "${v}")`);
  ok(!!(await page.getAttribute("#"+id,"placeholder")), `#${id} has a placeholder`);
}
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
