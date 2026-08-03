// Marketing site pre-paint theme boot. Restores a saved dark choice before the browser
// paints, so a dark-mode visitor never sees a white flash. Extracted from an inline
// <script> in the head of 77 pages on 31 Jul 2026.
//
// It had never run in production: the live CSP is script-src 'self' with no
// unsafe-inline, no nonce and no hash, so the browser blocked it on every page load.
// Same root cause as the certificate page, which rendered blank for the same reason.
//
// NOT the same as assets/theme.js, which the PORTAL uses and which is deliberately
// inverted: the portal is dark by default and stores an opt-in to light, the marketing
// site is light by default and stores an opt-in to dark. Two conventions, two files.
// Do not merge them without changing one of the two designs first.
//
// MUST stay a blocking script in <head>. No defer, no async, no type="module": all
// three postpone execution until after parsing, which is exactly when the flash has
// already happened. The opposite of cert.js, where defer is correct.
//
// The toggle itself lives in cinema.js. This only replays the stored choice.
try {
  if (localStorage.getItem("aisw-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
} catch (e) {
  // Private mode or storage blocked. Light is the correct fallback for this site.
}
