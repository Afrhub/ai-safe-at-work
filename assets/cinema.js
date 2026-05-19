/* ────────────────────────────────────────────────────────────
   cinema.js — ambient background + parallax + reveals + progress
   No dependencies. Loaded with `defer` from every page.
   Designed to do nothing harmful if anything fails — degrade to
   the static layout.
   ──────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  if (typeof document === 'undefined') return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── 1. Inject cinematic background + progress bar ──────────────────
  function injectCinema() {
    if (document.querySelector('.cinema-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'cinema-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = [
      '<div class="cinema-parallax" data-parallax-speed="0.05">',
        '<div class="cinema-aurora"></div>',
      '</div>',
      '<div class="cinema-parallax" data-parallax-speed="0.12">',
        '<div class="cinema-orbs">',
          '<div class="orb orb-1"></div>',
          '<div class="orb orb-2"></div>',
          '<div class="orb orb-3"></div>',
          '<div class="orb orb-4"></div>',
          '<div class="orb orb-5"></div>',
        '</div>',
      '</div>',
      '<div class="cinema-grid"></div>',
      '<div class="cinema-vignette"></div>'
    ].join('');
    document.body.insertBefore(bg, document.body.firstChild);

    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }

  // ─── 2. Reveal targets ───────────────────────────────────────────────
  // Selectors that get [data-reveal] auto-applied. We don't touch the
  // gate page (index.html) — its choices already have their own animation.
  var REVEAL_SELECTORS = [
    'main h1.page-title',
    'main p.lede',
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
        // Skip elements inside the gate page hero card grid
        if (el.closest('.gate')) return;
        el.setAttribute('data-reveal', '');
        // Stagger within the same parent (for module grids / lists)
        if (el.parentElement === lastParent) {
          seenInGroup++;
        } else {
          seenInGroup = 0;
          lastParent = el.parentElement;
        }
        if (seenInGroup > 0) {
          // Cap stagger at ~360ms total so it never feels slow
          var delay = Math.min(seenInGroup * 55, 360);
          el.style.transitionDelay = delay + 'ms';
        }
      });
    });
  }

  // ─── 3. IntersectionObserver to reveal as elements enter ─────────────
  function setupRevealObserver() {
    if (reduceMotion) {
      // Make sure everything is visible without animation
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      // No IO support — just reveal everything immediately
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

  // ─── 4. Parallax + reading progress on scroll ────────────────────────
  function setupScroll() {
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax-speed]'));
    var progressBar = document.querySelector('.reading-progress');
    var ticking = false;

    function readAndWrite() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      // Parallax — only if motion isn't reduced
      if (!reduceMotion) {
        for (var i = 0; i < parallaxEls.length; i++) {
          var el = parallaxEls[i];
          var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
          el.style.transform = 'translate3d(0,' + (y * speed * -1).toFixed(2) + 'px,0)';
        }
      }

      // Reading progress — always (subtle, not motion-sensitive)
      if (progressBar) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
        progressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(readAndWrite);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    readAndWrite();
  }

  // ─── 5. Cursor-following accent for the hero (gate page only) ────────
  // Subtle pointer-driven warmth on the gate page. Decorative only.
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
      // Smooth easing toward target
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
