// Front-page feed: AI governance, security and policy. Rendered from
// /.netlify/functions/news (same origin, so the CSP's connect-src 'self' allows it). The
// list in the HTML is the fallback and stays if the fetch fails, so the section is never
// empty and never shows an error to a visitor.
(function () {
  var list = document.getElementById('news-feed');
  var stamp = document.getElementById('news-stamp');
  if (!list) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); } catch (e) { return ''; }
  };
  fetch('/.netlify/functions/news', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.items || d.items.length < 3) return;
      list.innerHTML = d.items.map(function (i) {
        return '<li><a href="' + esc(i.link) + '" rel="noopener" target="_blank">' + esc(i.title) + '</a>' +
          '<span class="news-meta"><span class="news-src">' + esc(i.source) + '</span> · ' + esc(fmt(i.date)) + '</span></li>';
      }).join('');
      if (stamp) stamp.textContent = 'Updated ' + fmt(d.fetched) + ' · UK Government, European Commission, NCSC';
    })
    .catch(function () {});
})();
