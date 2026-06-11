/* ────────────────────────────────────────────────────────────
   cinema.js v4 — "drafting field" background + parallax + reveals
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
      // diagonal light bands — fastest scroll layer, deepest pointer response
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
    '.print-row'
  ];

  function tagReveals() {
    if (reduceMotion) return;
    REVEAL_SELECTORS.forEach(function (sel) {
      var nodes = document.querySelectorAll(sel);
      var seenInGroup = 0;
      var lastParent = null;
      nodes.forEach(function (el) {
        if (el.hasAttribute('data-reveal')) return;
        if (el.closest('.gate')) return;
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

    // Sheen chases the pointer in viewport px, eased separately (slower —
    // a light source should lag the hand, not stick to it).
    var sheen = document.querySelector('.cinema-sheen');
    var sx = window.innerWidth * 0.3, sy = window.innerHeight * 0.25;
    var stx = sx, sty = sy;

    function readAndWrite() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (!reduceMotion) {
        // ease pointer toward target
        px += (tx - px) * 0.06;
        py += (ty - py) * 0.06;
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

  // ─── 6. Bootstrap ────────────────────────────────────────────────────
  function start() {
    injectCinema();
    tagReveals();
    setupRevealObserver();
    setupScroll();
    setupGatePointer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
