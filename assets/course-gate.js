// Paywall: this content needs a signed-in Attest AI portal session.
//
// The demo account USED to be excluded here. That exclusion existed because
// AUTH_DISABLED made every visitor the demo account, so letting demo read the course
// would have handed the paid content to the whole internet. A2 was actioned on
// 31 Jul 2026: auth is armed and the demo password is rotated and private, so the
// account is now only reachable by someone we gave the credential to. Exclusion removed
// so sales can show the actual course.
//
// Trade accepted: anyone handed the demo credential can read the whole course. Rotate it
// if it circulates. The public product demo (portal/demo.html) needs no account and is
// unaffected either way.
//
// ponytail: client-side check only; a static site cannot enforce server-side. Move
// content behind an edge function before this gates real revenue.
(function () {
  var to = (document.currentScript && document.currentScript.dataset.to) || "/course.html";
  function locked() { location.replace(to + "?locked=1"); }
  try {
    if (!localStorage.getItem("sb-hanjrsslhnuauaysbhun-auth-token")) return locked();
  } catch (e) { return locked(); }
})();
