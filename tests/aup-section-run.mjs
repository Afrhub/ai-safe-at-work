// Every numbered policy section a customer can change must have a field, and
// the {DPO} token must still resolve. Writes one field, then restores it.
import { chromium } from "playwright";
const URL_ = process.argv[2] || "http://localhost:8765/portal/manager.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1500,height:950} });
const errors=[]; page.on("pageerror",e=>errors.push(e.message.slice(0,250)));
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
await page.goto(URL_,{waitUntil:"networkidle"}); await page.waitForTimeout(4000);
await page.click(`#navlist button[data-tab="aup"]`); await page.waitForTimeout(900);

const groups = await page.$$eval(".secnum", e=>e.map(x=>x.textContent.trim()));
console.log("   groups:", groups.join(" | "));
const nums = groups.filter(g=>g.startsWith("Section")).map(g=>+g.split(" ")[1]).sort((a,b)=>a-b);
ok(JSON.stringify(nums) === JSON.stringify([3,4,5,6,7,8,9,10,11,12,13]),
   `sections 3-13 all present with no gaps (${nums.join(",")})`);
ok(await page.isVisible("#f_rolesResponsibilities"), "section 12 has its own field");
ok(await page.isVisible("#f_vendorChanges"), "section 9 has its own field");

// {DPO} resolves in the rendered document
await page.fill("#f_dpoName","Dana Okafor");
await page.click("#saveOrgBtn"); await page.waitForTimeout(1500);
const all = await page.evaluate(()=>document.getElementById("main").innerText);
// the token is meant to be visible in the textarea; it is the rendered document
// below that must have resolved it
const doc = all.slice(all.indexOf("Acceptable Use of AI Tools at"));
ok(doc.includes("Dana Okafor"), "the DPO name reaches the policy");
ok(!doc.includes("{DPO}"), "no unresolved token in the rendered policy");
const twelve = doc.split("12. Roles and responsibilities")[1] || "";
ok(twelve.includes("Dana Okafor"), "section 12 still names the DPO after being made editable");
await page.fill("#f_dpoName",""); await page.click("#saveOrgBtn"); await page.waitForTimeout(1400);
console.log("PAGE ERRORS:", errors.length?errors:"none");
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
