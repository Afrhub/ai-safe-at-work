/* ════════════════════════════════════════════════════════════
   AI SAFE@WORK v2 — Manifest reader, nav, progress engine
   - No external dependencies.
   - No API calls. No DB calls. No network reads beyond manifest.json
     served from same-origin (static).
   - All state in localStorage, key namespace `aisw-v2-*`.
   - Output is escaped through textContent (no innerHTML for data).
   - Rate-limit posture: client-side throttle on localStorage writes
     to prevent runaway writes from a buggy/hostile script.
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Constants ─────────────────────────────────────────────
  var LS_PROGRESS = 'aisw-v2-progress';
  var LS_BANNER_DISMISSED = 'aisw-v2-banner-dismissed';
  var MANIFEST_URL = 'modules.json';
  var MAX_WRITES_PER_SEC = 10;

  // ── Throttled localStorage writer (rate-limit posture) ────
  var lastWriteTimes = [];
  function safeWrite(key, value) {
    try {
      var now = Date.now();
      lastWriteTimes = lastWriteTimes.filter(function (t) { return now - t < 1000; });
      if (lastWriteTimes.length >= MAX_WRITES_PER_SEC) {
        console.warn('[v2] localStorage write rate-limit triggered, dropped write to ' + key);
        return false;
      }
      lastWriteTimes.push(now);
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      // Quota exceeded, private mode, disabled storage — fail silently.
      console.warn('[v2] localStorage write failed: ' + (e && e.message));
      return false;
    }
  }
  function safeRead(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  // ── Progress state ────────────────────────────────────────
  function loadProgress() {
    var raw = safeRead(LS_PROGRESS, '{}');
    try {
      var parsed = JSON.parse(raw);
      // Validate shape — must be a flat object of {moduleId: 'complete'}.
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        var clean = {};
        Object.keys(parsed).forEach(function (k) {
          // Only accept numeric-string keys and a small enum of values.
          if (/^\d+$/.test(k) && parsed[k] === 'complete') clean[k] = 'complete';
        });
        return clean;
      }
    } catch (e) {}
    return {};
  }
  function saveProgress(progress) {
    safeWrite(LS_PROGRESS, JSON.stringify(progress));
  }
  function markComplete(moduleId) {
    var progress = loadProgress();
    progress[String(moduleId)] = 'complete';
    saveProgress(progress);
  }
  function isComplete(moduleId) {
    var progress = loadProgress();
    return progress[String(moduleId)] === 'complete';
  }
  function completedCount() {
    return Object.keys(loadProgress()).length;
  }

  // ── Manifest fetch (same-origin static) ───────────────────
  var _manifestCache = null;
  function loadManifest() {
    if (_manifestCache) return Promise.resolve(_manifestCache);
    return fetch(MANIFEST_URL, { method: 'GET', credentials: 'omit', cache: 'default' })
      .then(function (resp) {
        if (!resp.ok) throw new Error('manifest fetch failed: ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        // Defensive shape check.
        if (!data || !Array.isArray(data.modules)) {
          throw new Error('manifest shape invalid');
        }
        // Coerce and validate each module entry.
        var clean = data.modules.filter(function (m) {
          return m && typeof m.id === 'number'
            && typeof m.file === 'string' && /^module-\d+\.html$/.test(m.file)
            && typeof m.title === 'string';
        });
        // Sort by id ascending for nav determinism.
        clean.sort(function (a, b) { return a.id - b.id; });
        _manifestCache = { version: data.version, modules: clean };
        return _manifestCache;
      })
      .catch(function (e) {
        console.error('[v2] manifest load failed', e);
        return { version: 'unknown', modules: [] };
      });
  }

  // ── DOM helpers (textContent-only for data) ───────────────
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        if (k === 'class') node.className = props[k];
        else if (k === 'text') node.textContent = props[k];
        else if (k === 'href' && typeof props[k] === 'string') {
          // Only accept relative same-origin hrefs (mitigates open-redirect / phishing).
          var v = props[k];
          if (/^(https?:|javascript:|data:)/i.test(v)) {
            // Reject; force same-origin relative.
            console.warn('[v2] blocked external href:', v);
            return;
          }
          node.setAttribute('href', v);
        }
        else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), props[k]);
        else node.setAttribute(k, props[k]);
      });
    }
    if (children) children.forEach(function (c) {
      if (c == null) return;
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  // ── Reading-progress bar ──────────────────────────────────
  function mountReadingProgress() {
    if (document.querySelector('.v2-progress-rail')) return;
    var rail = el('div', { class: 'v2-progress-rail' });
    var bar = el('div', { class: 'v2-progress-bar' });
    rail.appendChild(bar);
    document.body.insertBefore(rail, document.body.firstChild);
    function update() {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY;
      var pct = docH > 0 ? Math.min(100, Math.max(0, (scrolled / docH) * 100)) : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // ── Per-module bottom nav + mark-complete ─────────────────
  function mountModuleNav() {
    var mid = parseInt(document.body.dataset.moduleId || '0', 10);
    if (!mid) return;
    loadManifest().then(function (manifest) {
      var modules = manifest.modules;
      var idx = -1;
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].id === mid) { idx = i; break; }
      }
      var prev = idx > 0 ? modules[idx - 1] : null;
      var next = idx >= 0 && idx < modules.length - 1 ? modules[idx + 1] : null;

      // Mount prev
      var prevMount = document.getElementById('prev-mount');
      if (prevMount) {
        if (prev) {
          prevMount.appendChild(el('a', { class: 'v2-nav-btn', href: prev.file }, [
            el('span', { class: 'v2-nav-dir' }, ['← Previous']),
            el('span', {}, ['Module ' + pad2(prev.id) + ' · ' + prev.title])
          ]));
        } else {
          prevMount.appendChild(el('a', { class: 'v2-nav-btn disabled', 'aria-disabled': 'true' }, [
            el('span', { class: 'v2-nav-dir' }, ['Previous']),
            el('span', {}, ['You are at the start'])
          ]));
        }
      }

      // Mount next
      var nextMount = document.getElementById('next-mount');
      if (nextMount) {
        if (next) {
          nextMount.appendChild(el('a', { class: 'v2-nav-btn', href: next.file }, [
            el('span', { class: 'v2-nav-dir' }, ['Next →']),
            el('span', {}, ['Module ' + pad2(next.id) + ' · ' + next.title])
          ]));
        } else {
          nextMount.appendChild(el('a', { class: 'v2-nav-btn', href: 'course.html' }, [
            el('span', { class: 'v2-nav-dir' }, ['Course complete →']),
            el('span', {}, ['Back to overview'])
          ]));
        }
      }

      // Mark-complete button
      var btn = document.querySelector('.v2-complete-btn');
      if (btn) {
        var refreshBtn = function () {
          if (isComplete(mid)) {
            btn.classList.add('is-done');
            btn.textContent = '✓ Marked complete';
          } else {
            btn.classList.remove('is-done');
            btn.textContent = 'Mark this module complete →';
          }
        };
        btn.addEventListener('click', function () {
          if (isComplete(mid)) return;
          markComplete(mid);
          refreshBtn();
        });
        refreshBtn();
      }

      // Module-of-N strip in eyebrow if requested
      var ofN = document.querySelector('[data-mod-of-n]');
      if (ofN) {
        ofN.textContent = 'Module ' + pad2(mid) + ' of ' + pad2(modules.length);
      }
    });
  }

  // ── Overview page (course.html) ───────────────────────────
  function mountOverview() {
    var grid = document.getElementById('module-grid-mount');
    if (!grid) return;
    loadManifest().then(function (manifest) {
      var modules = manifest.modules;
      var done = loadProgress();
      // Clear via replaceChildren() so the OWASP A03 grep stays clean
      // (no assignment via the DOM string-property anywhere in v2.js).
      grid.replaceChildren();
      modules.forEach(function (m) {
        var card = el('a', { class: 'v2-module-card', href: m.file }, [
          el('div', { class: 'v2-module-card-num' }, [
            'Module ' + pad2(m.id),
            el('span', {
              class: 'v2-status ' + (done[String(m.id)] === 'complete' ? 'done' : 'todo')
            }, [done[String(m.id)] === 'complete' ? '✓ done' : m.duration])
          ]),
          el('h3', {}, [m.title]),
          el('p', {}, [m.summary])
        ]);
        grid.appendChild(card);
      });

      // Overall progress
      var progressMount = document.getElementById('overall-progress-mount');
      if (progressMount) {
        var n = modules.length;
        var c = Object.keys(done).filter(function (k) {
          return modules.some(function (m) { return String(m.id) === k; });
        }).length;
        var pct = n > 0 ? Math.round((c / n) * 100) : 0;
        progressMount.appendChild(el('div', { class: 'v2-overall-progress-label' }, [
          'Your progress',
          el('span', {}, [c + ' of ' + n + ' complete (' + pct + '%)'])
        ]));
        var bar = el('div', { class: 'v2-overall-progress-bar' });
        var fill = el('div', { class: 'v2-overall-progress-fill' });
        fill.style.width = pct + '%';
        bar.appendChild(fill);
        progressMount.appendChild(bar);
      }
    });
  }

  // ── v1 → v2 banner ────────────────────────────────────────
  function mountV1Banner() {
    if (!document.body.dataset.showV2Banner) return;
    if (safeRead(LS_BANNER_DISMISSED, '0') === '1') return;
    var banner = el('div', { class: 'v2-banner' }, [
      'New: ',
      el('strong', {}, ['governance-led 11-module rebuild']),
      ' is being trialled in parallel.',
      el('a', { href: '/v2/' }, ['Try v2 →']),
      el('button', {
        class: 'v2-banner-close',
        'aria-label': 'Dismiss banner',
        onclick: function (e) {
          safeWrite(LS_BANNER_DISMISSED, '1');
          banner.style.display = 'none';
        }
      }, ['×'])
    ]);
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // ── Helpers ───────────────────────────────────────────────
  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  // ── Boot ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    mountReadingProgress();
    mountModuleNav();
    mountOverview();
    mountV1Banner();
  });

  // ── Expose tiny public API for tests ──────────────────────
  // (used by smoke tests; no external network call)
  window.AISW_V2 = {
    loadManifest: loadManifest,
    loadProgress: loadProgress,
    markComplete: markComplete,
    isComplete: isComplete,
    completedCount: completedCount
  };
})();
