// Interactive risk-figure engine, one copy for all 21 module and sector pages.
//
// This lived as a near-identical inline <script> on every page, which production CSP
// (script-src 'self', no unsafe-inline) blocked silently — the figure shipped dead in a
// paid course from day one, the same failure that took out the certificate page and the
// theme bootstrap. The per-page data now sits in a JSON block the CSP has no opinion on:
//   <script type="application/json" class="risk-fig-data">{"fig":"risk-fig-2","dot":true,"data":{...}}</script>
// "dot" preserves each page's original caption punctuation ('title.' vs 'title').
//
// Keep this external. Anything inline is dead on arrival in production.

(function () {
  'use strict';

  function boot() {
    document.querySelectorAll('script.risk-fig-data').forEach(function (block) {
      var cfg;
      try { cfg = JSON.parse(block.textContent); } catch (e) { return; }
      var fig = document.getElementById(cfg.fig);
      if (!fig) return;
      var cap = fig.querySelector('.rd-cap');
      var nodes = fig.querySelectorAll('.rnode');
      function sel(k) {
        nodes.forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-k') === k); });
        var x = cfg.data[k]; if (!x || !cap) return;
        cap.innerHTML = '<strong>' + x.t + (cfg.dot ? '.' : '') + '</strong> ' + x.d +
          ' <span class="rd-m">' + x.m + '</span>';
      }
      nodes.forEach(function (n) {
        var k = n.getAttribute('data-k');
        n.addEventListener('click', function () { sel(k); });
        n.addEventListener('mouseenter', function () { sel(k); });
        n.addEventListener('focus', function () { sel(k); });
        n.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(k); }
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
