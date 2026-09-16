// AI policy pill strip under the hero. Rendered from /.netlify/functions/news?topic=policy
// (same origin, so the CSP's connect-src 'self' allows it). The pills in the HTML are the
// fallback and stay if the fetch fails, so the strip is never empty and never shows an error.
(function () {
  var list = document.getElementById('news-feed');
  var stamp = document.getElementById('news-stamp');
  if (!list) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); } catch (e) { return ''; }
  };
  fetch('/.netlify/functions/news?topic=policy', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.items || d.items.length < 2) return;
      list.innerHTML = d.items.map(function (i) {
        return '<li><a class="news-pill" href="' + esc(i.link) + '" rel="noopener" target="_blank" title="' + esc(i.title) + '">' +
          '<span class="news-src">' + esc(i.source) + '</span>' + esc(i.title) +
          '<span class="news-date">' + esc(fmt(i.date)) + '</span></a></li>';
      }).join('');
      if (stamp) { stamp.textContent = 'updated ' + fmt(d.fetched); }
    })
    .catch(function () {});
})();
