// The template pages' "Print / Save as PDF" button. It was an inline onclick, which the
// production CSP (script-src 'self', no inline) silently kills, so it never worked live
// on 28 templates (Codex audit, 9 Sep 2026; same defect as module 11's button in August).
document.addEventListener('click', function (e) {
  var b = e.target.closest('[data-print]');
  if (b) { e.preventDefault(); window.print(); }
});
