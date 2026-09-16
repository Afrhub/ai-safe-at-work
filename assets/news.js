// AI policy pill strip under the hero. Rendered from /.netlify/functions/news?topic=policy
// (same origin, so the CSP's connect-src 'self' allows it). The pills in the HTML are the
// fallback and stay if the fetch fails, so the strip is never empty and never shows an error.
(function () {
  var list = document.getElementById('news-feed');
  var stamp = document.getElementById('news-stamp');
  if (!list) return;
  // Fallback pills loop too: duplicate what the HTML shipped until the fetch replaces it.
  if (list.children.length) {
    var copy = list.innerHTML.replace(/<li>/g, '<li aria-hidden="true">').replace(/<a /g, '<a tabindex="-1" ');
    list.innerHTML += copy; list.style.setProperty('--news-dur', (list.children.length * 6) + 's');
  }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); } catch (e) { return ''; }
  };
  fetch('/.netlify/functions/news?topic=policy', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.items || d.items.length < 2) return;
      var pill = function (i, hidden) {
        return '<li' + (hidden ? ' aria-hidden="true"' : '') + '><a class="news-pill" href="' + esc(i.link) + '" rel="noopener" target="_blank" title="' + esc(i.title) + '"' + (hidden ? ' tabindex="-1"' : '') + '>' +
          '<span class="news-src">' + esc(i.source) + '</span>' + esc(i.title) +
          '<span class="news-date">' + esc(fmt(i.date)) + '</span></a></li>';
      };
      // The list is rendered twice so the loop is seamless: the animation moves exactly one
      // copy's width (-50%) then restarts. The copy is hidden from assistive tech and Tab.
      list.innerHTML = d.items.map(function (i) { return pill(i, false); }).join('') +
                       d.items.map(function (i) { return pill(i, true); }).join('');
      // About 12 seconds per pill so headlines are readable; hover or focus pauses it.
      list.style.setProperty('--news-dur', (d.items.length * 12) + 's');
      if (stamp) { stamp.textContent = 'updated ' + fmt(d.fetched); }
    })
    .catch(function () {});
})();
