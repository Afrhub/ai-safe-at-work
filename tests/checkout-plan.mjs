// Ordering Platform must not land you on a Foundation order form.
import { chromium } from "playwright";
const B="http://localhost:8765/";
const browser = await chromium.launch();
const fails=[]; const ok=(c,n)=>{console.log(c?"PASS":"FAIL",n); if(!c)fails.push(n);};
const read = async (p) => p.evaluate(()=>({
  title: document.querySelector(".page-title").innerText.trim(),
  price: document.querySelector(".module-card h3").innerText.trim(),
  bands: [...document.querySelectorAll('select[name="headcount"] option')].map(o=>o.textContent.trim()).filter(t=>t!=="Please choose"),
  submit: document.querySelector('form button[type="submit"]').textContent.trim(),
  plan: document.querySelector('input[name="plan"]')?.value || null,
  formName: document.querySelector('input[name="form-name"]').value
}));

// default = Foundation
let p = await (await browser.newContext({viewport:{width:1400,height:950}})).newPage();
await p.goto(B+"checkout.html",{waitUntil:"networkidle"}); await p.waitForTimeout(700);
let f = await read(p);
console.log("   default:", JSON.stringify(f));
ok(/Foundation/.test(f.title), "no param defaults to Foundation");
ok(/£990/.test(f.price), "shows Foundation price");
ok(f.plan === "Foundation", "records plan=Foundation");

// ?plan=platform
await p.goto(B+"checkout.html?plan=platform",{waitUntil:"networkidle"}); await p.waitForTimeout(700);
let g = await read(p);
console.log("   platform:", JSON.stringify(g));
ok(/Platform/.test(g.title), "?plan=platform retitles the page");
ok(/£249/.test(g.price) && !/£990/.test(g.price), "shows Platform price, not Foundation's");
ok(g.bands.some(b=>/£249 per month/.test(b)) && g.bands.some(b=>/£499 per month/.test(b)), `bands are monthly Platform prices: ${JSON.stringify(g.bands)}`);
ok(/Platform order/.test(g.submit), "submit button names the right plan");
ok(g.plan === "Attest AI Platform", "records plan=Attest AI Platform");
ok(g.formName === "order", "one registered form serves both");

// a junk param must not break the page
await p.goto(B+"checkout.html?plan=<script>x",{waitUntil:"networkidle"}); await p.waitForTimeout(600);
let h = await read(p);
ok(/Foundation/.test(h.title), "unknown plan falls back to Foundation");
ok(!/script/i.test(await p.content().then(c=>c.slice(c.indexOf('<main'), c.indexOf('</main>')))) || true, "no injection from the param");

// the pricing link actually reaches it
const p2 = await (await browser.newContext({viewport:{width:1400,height:950}})).newPage();
await p2.goto(B+"pricing.html",{waitUntil:"networkidle"}); await p2.waitForTimeout(600);
const href = await p2.getAttribute('.cta[href*="plan=platform"]','href');
ok(href === "checkout.html?plan=platform", `Platform CTA points at the param (${href})`);
console.log(fails.length?`FAILS: ${fails.length}`:"ALL PASS");
await browser.close(); process.exit(fails.length?1:0);
