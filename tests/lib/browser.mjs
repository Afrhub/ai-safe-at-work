// Browser plumbing for the Playwright half of the test plan.
//
// This repo has no package.json on purpose (see lib/harness.mjs). Playwright is
// resolved out of the sibling ~/projects/mlr install rather than added here, so
// nothing about this repo's zero-dependency posture changes. If that project ever
// goes away, every browser suite skips with a clear reason instead of failing.
//
// Two rules are enforced here rather than in each suite, because forgetting either
// one writes to production:
//   * every context aborts POST requests. checkout.html is a live Netlify form, so
//     a stray submit files a real order. Aborted POSTs are recorded so a test can
//     still assert "the Netlify form was the thing that tried to submit".
//   * the Stripe function is intercepted and left hanging. Fulfilling it either
//     navigates to Stripe (on 200) or trips the fallback, which calls form.submit()
//     — both reach production. Hanging lets a test count the call and stop there.

const LIVE_ORIGIN = "https://aisafework.netlify.app";

export const BASE = (process.argv[2] || process.env.BASE_URL || LIVE_ORIGIN).replace(/\/$/, "");

export const STRIPE_FN = "/.netlify/functions/create-checkout-session";

let playwright = null;
let loadError = null;
try {
  const { createRequire } = await import("node:module");
  const require = createRequire(process.env.PLAYWRIGHT_FROM || "/Users/alastair/projects/mlr/");
  playwright = require("playwright");
} catch (e) {
  loadError = e;
}

export const available = () => playwright !== null;
export const unavailableReason = () =>
  `playwright could not be resolved (${loadError && loadError.message}). ` +
  `Set PLAYWRIGHT_FROM to a directory that has it installed.`;

export async function launch() {
  return playwright.chromium.launch();
}

// One isolated context per test. `record` accumulates everything worth asserting on:
// console errors, page errors, CSP violations, blocked writes and Stripe calls.
export async function newPage(browser, opts = {}) {
  const context = await browser.newContext(opts.context || {});
  const record = {
    console: [],
    pageErrors: [],
    csp: [],
    badResponses: [],
    blockedWrites: [],
    stripeCalls: [],
  };

  // Non-destructive guard. Runs before the Stripe route below because Playwright
  // matches the most recently added handler first, so the Stripe one still wins.
  //
  // opts.allowPosts is a list of URL fragments whose POSTs may proceed. The journey
  // suite passes the Supabase origin, because signing in, scoring a quiz and inserting
  // a register row are all POSTs and the whole point is to exercise them. The Netlify
  // forms stay blocked either way: nothing in that list matches this origin.
  const allowPosts = opts.allowPosts || [];
  await context.route("**/*", (route) => {
    const req = route.request();
    const url = req.url();
    const allowed =
      url.includes("create-checkout-session") || allowPosts.some((frag) => url.includes(frag));
    if (req.method() === "POST" && !allowed) {
      record.blockedWrites.push({ url, body: req.postData() });
      return route.abort();
    }
    return route.fallback();
  });

  await context.route(`**${STRIPE_FN}`, (route) => {
    record.stripeCalls.push(route.request().postData());
    // deliberately never fulfilled, see header note
  });

  // The console message truncates and never says WHICH script was blocked. The
  // securitypolicyviolation event carries the file, the line and a sample of the
  // offending source, which is the difference between "CSP is angry" and "the
  // theme bootstrap on line 8 is dead".
  await context.exposeFunction("__cspViolation", (v) => record.csp.push(v));
  await context.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      const where = e.sourceFile ? `${e.sourceFile.split("/").pop()}:${e.lineNumber}` : "(inline)";
      window.__cspViolation(
        `${e.violatedDirective} blocked ${e.blockedURI || "inline"} at ${where} — ${(e.sample || "").slice(0, 90)}`
      );
    });
  });

  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() !== "error" && m.type() !== "warning") return;
    record.console.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => record.pageErrors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.request().method() !== "POST") {
      record.badResponses.push(`${r.status()} ${r.url()}`);
    }
  });

  return { context, page, record, close: () => context.close() };
}

// A context that looks signed in to the client-side paywall. course-gate.js only
// reads this key, so this is enough to get past it without touching Supabase.
export const signedInContext = (email = "qa@example.com") => ({
  storageState: {
    cookies: [],
    origins: [
      {
        origin: BASE,
        localStorage: [
          {
            name: "sb-hanjrsslhnuauaysbhun-auth-token",
            value: JSON.stringify({ user: { email } }),
          },
        ],
      },
    ],
  },
});

// Layout has settled when two animation frames have passed. Condition, not a timer.
export const settle = (page) =>
  page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
