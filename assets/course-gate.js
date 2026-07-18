// Tier 1 paywall: this content needs a signed-in AI Safe@Work portal session.
// The public demo account (AUTH_DISABLED auto-signin) does NOT pass: it exists to
// preview the portal, not the paid content.
// ponytail: client-side check only; a static site cannot enforce server-side.
// Move content behind an edge function before this gates real revenue.
(function () {
  var to = (document.currentScript && document.currentScript.dataset.to) || "/course.html";
  function locked() { location.replace(to + "?locked=1"); }
  try {
    var raw = localStorage.getItem("sb-hanjrsslhnuauaysbhun-auth-token");
    if (!raw) return locked();
    var email = "";
    try { var tok = JSON.parse(raw); email = (tok.user && tok.user.email) || ""; } catch (e) {}
    if (email === "demo@attest-ai.com") return locked();
  } catch (e) { return locked(); }
})();
