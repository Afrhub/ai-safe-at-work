// Tier 1 paywall: this content needs a signed-in AI Safe@Work portal session.
// ponytail: client-side presence check of the Supabase auth token only; a static
// site cannot enforce server-side. Move content behind an edge function before
// this gates real revenue.
(function () {
  var to = (document.currentScript && document.currentScript.dataset.to) || "/course.html";
  try {
    if (!localStorage.getItem("sb-hanjrsslhnuauaysbhun-auth-token")) location.replace(to + "?locked=1");
  } catch (e) { location.replace(to + "?locked=1"); }
})();
