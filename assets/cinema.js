/* ────────────────────────────────────────────────────────────
   cinema.js v7, "drafting field" background + parallax + reveals
   Audit-dossier visual language: blueprint grid, ledger rules,
   giant watermarked clause numbers. Scroll parallax + pointer
   depth. No dependencies. Degrades to static layout on failure.
   ──────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  if (typeof document === 'undefined') return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── 1. Inject drafting-field background + progress bar ─────────────
  function injectCinema() {
    if (document.querySelector('.cinema-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'cinema-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = [
      // deepest layer: warm wash (slowest)
      '<div class="cinema-parallax" data-parallax-speed="0.04" data-pointer-depth="6">',
        '<div class="cinema-wash"></div>',
      '</div>',
      // blueprint grid
      '<div class="cinema-parallax" data-parallax-speed="0.07" data-pointer-depth="10">',
        '<div class="cinema-grid"></div>',
      '</div>',
      // ledger rules
      '<div class="cinema-parallax" data-parallax-speed="0.12" data-pointer-depth="16">',
        '<div class="cinema-rules"></div>',
      '</div>',
      // diagonal light bands, fastest scroll layer, deepest pointer response
      '<div class="cinema-parallax" data-parallax-speed="0.24" data-pointer-depth="34">',
        '<div class="cinema-shade"></div>',
      '</div>',
      // watermark clauses (nearest, fastest)
      '<div class="cinema-parallax" data-parallax-speed="0.18" data-pointer-depth="24">',
        '<div class="cinema-marks">',
          '<span class="wm wm-1">§4</span>',
          '<span class="wm wm-2">42001</span>',
          '<span class="wm wm-3">Art.26</span>',
          '<span class="wm wm-mono wm-4">EU·AI·ACT·2024/1689</span>',
          '<span class="wm wm-mono wm-5">ISO/IEC·27001:2022·A.5.10</span>',
        '</div>',
      '</div>',
      '<div class="cinema-sheen"></div>',
      '<div class="cinema-vignette"></div>'
    ].join('');
    document.body.insertBefore(bg, document.body.firstChild);

    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }

  // ─── 2. Reveal targets ───────────────────────────────────────────────
  var REVEAL_SELECTORS = [
    'main h1.page-title',
    'main p.lede',
    '.module-banner',
    'main h2',
    'main h3',
    '.callout',
    '.compare',
    '.objectives',
    '.module-card',
    '.module-grid > *',
    '.standard-card',
    '.check-item',
    '.section-num',
    '.module-bottom-nav',
    '.print-row',
    // homepage (gate) hero + cards
    '.gate-eyebrow',
    '.gate h1',
    '.gate .lede',
    '.gate-hero .hero-ctas',
    '.gate-stats > div',
    '.aud-card',
    '.choice',
    '.gate-tertiary'
  ];

  function tagReveals() {
    if (reduceMotion) return;
    REVEAL_SELECTORS.forEach(function (sel) {
      var nodes = document.querySelectorAll(sel);
      var seenInGroup = 0;
      var lastParent = null;
      nodes.forEach(function (el) {
        if (el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal', '');
        if (el.parentElement === lastParent) {
          seenInGroup++;
        } else {
          seenInGroup = 0;
          lastParent = el.parentElement;
        }
        if (seenInGroup > 0) {
          var delay = Math.min(seenInGroup * 55, 360);
          el.style.transitionDelay = delay + 'ms';
        }
      });
    });
  }

  // ─── 3. IntersectionObserver to reveal as elements enter ─────────────
  function setupRevealObserver() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      io.observe(el);
    });
  }

  // ─── 4. Parallax (scroll + pointer depth) + reading progress ─────────
  function setupScroll() {
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax-speed]'));
    var progressBar = document.querySelector('.reading-progress');
    var ticking = false;

    // Pointer state: -0.5..0.5 from viewport centre, eased toward target.
    var px = 0, py = 0, tx = 0, ty = 0;
    var pointerActive = false;

    // Sheen chases the pointer in viewport px, eased separately (slower -
    // a light source should lag the hand, not stick to it).
    var sheen = document.querySelector('.cinema-sheen');
    var wash = document.querySelector('.cinema-wash');
    var sx = window.innerWidth * 0.3, sy = window.innerHeight * 0.25;
    var stx = sx, sty = sy;

    function readAndWrite() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (!reduceMotion) {
        // ease pointer toward target
        px += (tx - px) * 0.06;
        py += (ty - py) * 0.06;
        if (wash) {
          // Ambient light shifts hue as you travel the document -
          // ~3deg per 100px, full cycle over ~12k px. Paint cost is
          // limited to this one isolated, blurred layer.
          wash.style.filter = 'blur(34px) hue-rotate(' + ((y * 0.03) % 360).toFixed(1) + 'deg)';
        }
        if (sheen) {
          sx += (stx - sx) * 0.045;
          sy += (sty - sy) * 0.045;
          sheen.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
        }
        for (var i = 0; i < parallaxEls.length; i++) {
          var el = parallaxEls[i];
          var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
          var depth = parseFloat(el.getAttribute('data-pointer-depth')) || 0;
          var dx = (px * depth).toFixed(2);
          var dy = (y * speed * -1 + py * depth).toFixed(2);
          el.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
        }
      }

      if (progressBar) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
        progressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
      }

      // keep easing while the pointer hasn't settled
      if (!reduceMotion && (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001 ||
          (sheen && (Math.abs(stx - sx) > 0.5 || Math.abs(sty - sy) > 0.5)))) {
        window.requestAnimationFrame(readAndWrite);
        return;
      }
      ticking = false;
    }

    function schedule() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(readAndWrite);
      }
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // Pointer-depth only on fine pointers (desktop), never with reduced motion
    if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        tx = (e.clientX / window.innerWidth) - 0.5;
        ty = (e.clientY / window.innerHeight) - 0.5;
        stx = e.clientX;
        sty = e.clientY;
        pointerActive = true;
        schedule();
      }, { passive: true });
      window.addEventListener('pointerleave', function () {
        if (!pointerActive) return;
        tx = 0; ty = 0;
        schedule();
      }, { passive: true });
    }

    readAndWrite();
  }

  // ─── 5. Cursor-following accent for the hero (gate page only) ────────
  function setupGatePointer() {
    var gate = document.querySelector('main.gate');
    if (!gate || reduceMotion) return;
    var rafId = null;
    var targetX = 50, targetY = 30, currentX = 50, currentY = 30;

    gate.addEventListener('pointermove', function (e) {
      var rect = gate.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
      if (!rafId) tick();
    }, { passive: true });

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      gate.style.setProperty('--pointer-x', currentX.toFixed(2) + '%');
      gate.style.setProperty('--pointer-y', currentY.toFixed(2) + '%');
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
  }


  // ─── 5b. Theme toggle, pill switch in the topbar / gate header ──────
  function setupThemeToggle() {
    var host = document.querySelector('.topbar') || document.querySelector('.gate-header') || document.querySelector('.portal-top') || document.querySelector('.theme-toggle-host');
    if (!host || host.querySelector('.theme-toggle')) return;

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('type', 'button');
    btn.setAttribute('role', 'switch');
    btn.innerHTML =
      '<span class="tt-knob" aria-hidden="true">' +
        '<svg class="tt-moon" viewBox="0 0 24 24" fill="none" stroke="#0b0e14" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
        '<svg class="tt-sun" viewBox="0 0 24 24" fill="none" stroke="#f2f4f8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.8" y2="4.2"/></svg>' +
      '</span>';

    function syncA11y() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-checked', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#0b0d12' : '#ffffff');
    }

    btn.addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      try { localStorage.setItem('aisw-theme', dark ? 'light' : 'dark'); } catch (e) {}
      syncA11y();
    });

    syncA11y();
    host.appendChild(btn);

    // Re-apply the stored theme whenever this page is shown again.
    // Covers bfcache restores (back/forward navigation restores the old
    // DOM without re-running scripts) and keeps multiple tabs in sync.
    function applyStoredTheme() {
      var t = null;
      try { t = localStorage.getItem('aisw-theme'); } catch (e) {}
      if (t === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (t === 'light') {
        document.documentElement.removeAttribute('data-theme');
      }
      syncA11y();
    }
    window.addEventListener('pageshow', function () { applyStoredTheme(); });
    window.addEventListener('storage', function (ev) {
      if (!ev || ev.key === null || ev.key === 'aisw-theme') applyStoredTheme();
    });
  }

  // ─── 5c. Interior page hero band ─────────────────────────────────────
  // Wrap the leading page header (badge? + eyebrow? + page-title + lede?)
  // of non-homepage pages in a full-bleed .page-hero band, so every page
  // opens with the same hero format as the homepage. Pure DOM, no markup
  // edits. Skips the homepage (.gate) and any page without a page-title.
  function bandPageHero() {
    var main = document.querySelector('main');
    if (!main || main.classList.contains('gate')) return;
    if (main.querySelector('.page-hero')) return;
    var title = main.querySelector('h1.page-title');
    if (!title) return;
    var container = title.parentElement;            // main, or a leading <section>/<div>
    var kids = Array.prototype.slice.call(container.children);
    var i = kids.indexOf(title);
    if (i < 0) return;
    var start = i, end = i;
    var cls = function (n) { return ((n && n.className) || '').toString(); };
    // absorb preceding eyebrow / badges / banners
    while (start - 1 >= 0 && /\b(eyebrow|soon-badge|role-banner|sector-badge|kicker|tagline)\b/i.test(cls(kids[start - 1]))) {
      start--;
    }
    // absorb following sr-only headings, then the lede (stop after it)
    while (kids[end + 1]) {
      var nx = kids[end + 1];
      if (/\blede\b/.test(cls(nx))) { end++; break; }
      if (/\bsr-only\b/.test(cls(nx)) || nx.getAttribute('aria-hidden') === 'true') { end++; continue; }
      break;
    }
    var hero = document.createElement('header');
    hero.className = 'page-hero';
    var inner = document.createElement('div');
    inner.className = 'page-hero-inner';
    hero.appendChild(inner);
    container.insertBefore(hero, kids[start]);
    for (var j = start; j <= end; j++) { inner.appendChild(kids[j]); }
  }

  // ─── 5d. Stat count-up, Palo-Alto-style number counters ────────────
  // Animates the number inside stat elements from 0 to its value when it
  // scrolls into view. Animates only the text node that holds the number,
  // so surrounding text and coloured spans survive. Skips JS-driven portal
  // values (those carry an id), respects reduced-motion, preserves the
  // exact authored formatting (commas, +, %, decimals) at the end.
  function setupCounters() {
    if (reduceMotion || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;
    var els = Array.prototype.slice.call(document.querySelectorAll('.gate-stats .n, .stat > .n, [data-count]'))
      .filter(function (el) { return !el.id && !el.closest('.no-count') && /\d/.test(el.textContent); });
    if (!els.length) return;

    function pickNode(el) {                      // text node holding the largest number
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), best = null, bv = -Infinity, n;
      while ((n = w.nextNode())) {
        var m = n.nodeValue.match(/-?\d[\d,]*\.?\d*/);
        if (!m) continue;
        var v = parseFloat(m[0].replace(/,/g, ''));
        if (v > bv) { bv = v; best = n; }
      }
      return best;
    }
    function fmt(v, dec, comma) {
      var s = v.toFixed(dec);
      if (comma) { var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = p.join('.'); }
      return s;
    }
    function prep(el) {
      var node = pickNode(el); if (!node) return null;
      var m = node.nodeValue.match(/(-?\d[\d,]*\.?\d*)/), raw = m[0], i = m.index;
      return {
        node: node, prefix: node.nodeValue.slice(0, i), suffix: node.nodeValue.slice(i + raw.length),
        dec: (raw.split('.')[1] || '').length, comma: raw.indexOf(',') !== -1,
        target: parseFloat(raw.replace(/,/g, '')), raw: raw
      };
    }
    function animate(info) {
      var dur = 1100, t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        info.node.nodeValue = p < 1
          ? info.prefix + fmt(info.target * e, info.dec, info.comma) + info.suffix
          : info.prefix + info.raw + info.suffix;        // restore exact authored text
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var info = entry.target.__count;
        if (!info) return;
        if (document.hidden) { info.node.nodeValue = info.prefix + info.raw + info.suffix; return; }
        info.node.nodeValue = info.prefix + fmt(0, info.dec, info.comma) + info.suffix;
        animate(info);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { var info = prep(el); if (info) { el.__count = info; io.observe(el); } });
  }

  // ─── 6. Bootstrap ────────────────────────────────────────────────────
  function start() {
    injectCinema();
    bandPageHero();
    tagReveals();
    setupCounters();
    setupRevealObserver();
    setupScroll();
    setupGatePointer();
    setupThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
