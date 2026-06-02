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
  var MAX_WRITES_PER_SEC = 10;

  // Manifest path is locale-aware: FR/DE pages live in /v2/{locale}/ so the
  // manifest is one level up. Computed at runtime — DEFAULT FALLBACK IS 'modules.json'
  // for the EN root pages.
  function manifestUrl() {
    var p = (window.location && window.location.pathname) || '/';
    if (p.indexOf('/v2/fr/') !== -1 || p.indexOf('/v2/de/') !== -1) {
      return '../modules.json';
    }
    return 'modules.json';
  }

  // Default UI string fallback (used if manifest.ui[locale] missing).
  var UI_FALLBACK = {
    previous: '← Previous',
    next: 'Next →',
    atStart: 'You are at the start',
    courseComplete: 'Course complete →',
    backToOverview: 'Back to overview',
    moduleOfN: 'Module {n} of {total}',
    markComplete: 'Mark this module complete →',
    marked: '✓ Marked complete',
    yourProgress: 'Your progress',
    ofComplete: '{c} of {n} complete ({pct}%)',
    done: '✓ done'
  };
  function fmt(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (_, k) {
      return vars && vars[k] != null ? String(vars[k]) : '';
    });
  }
  function getUi(manifest) {
    var loc = detectLocaleFromPath();
    if (manifest && manifest.ui && manifest.ui[loc]) {
      // Merge locale strings over fallback to tolerate partial localisation.
      var merged = {};
      Object.keys(UI_FALLBACK).forEach(function (k) { merged[k] = UI_FALLBACK[k]; });
      Object.keys(manifest.ui[loc]).forEach(function (k) { merged[k] = manifest.ui[loc][k]; });
      return merged;
    }
    return UI_FALLBACK;
  }
  // Localise a module record: prefer m.locales[loc].{title,summary,duration} when present.
  function localiseModule(m, loc) {
    if (loc !== 'en' && m && m.locales && m.locales[loc]) {
      var l = m.locales[loc];
      return {
        id: m.id,
        file: m.file,
        title: l.title || m.title,
        duration: l.duration || m.duration,
        summary: l.summary || m.summary
      };
    }
    return m;
  }

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
    // Fan out to SCORM + xAPI adapters if present. Both no-op if not connected.
    var n = parseInt(moduleId, 10);
    var completed = Object.keys(progress).map(function (k) { return parseInt(k, 10); }).filter(Boolean);
    var locale = detectLocaleFromPath();
    try {
      if (window.AISW_SCORM && window.AISW_SCORM.isConnected()) {
        window.AISW_SCORM.markModuleComplete(n, completed);
      }
      if (window.AISW_XAPI && window.AISW_XAPI.isConfigured()) {
        window.AISW_XAPI.moduleCompleted(n, locale);
      }
      // If this completion was the 11th module, push the course-completion signal too.
      if (completed.length >= 11) {
        var score = 100; // Self-assessment in module 11 caps at 100; real score
                        // captured per-question is a roadmap item (cmi.interactions).
        if (window.AISW_SCORM && window.AISW_SCORM.isConnected()) {
          window.AISW_SCORM.markCourseComplete(score);
        }
        if (window.AISW_XAPI && window.AISW_XAPI.isConfigured()) {
          window.AISW_XAPI.coursePassed(score, locale);
        }
      }
    } catch (e) {
      console.warn('[v2] SCORM/xAPI fan-out threw', e && e.message);
    }
  }
  function detectLocaleFromPath() {
    var p = (window.location && window.location.pathname) || '/';
    if (p.indexOf('/v2/fr/') !== -1) return 'fr';
    if (p.indexOf('/v2/de/') !== -1) return 'de';
    return 'en';
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
    return fetch(manifestUrl(), { method: 'GET', credentials: 'omit', cache: 'default' })
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
        _manifestCache = { version: data.version, modules: clean, ui: data.ui || null, i18n: data.i18n || null };
        return _manifestCache;
      })
      .catch(function (e) {
        console.error('[v2] manifest load failed', e);
        return { version: 'unknown', modules: [], ui: null, i18n: null };
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
      var loc = detectLocaleFromPath();
      var ui = getUi(manifest);
      var modules = manifest.modules.map(function (m) { return localiseModule(m, loc); });
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
            el('span', { class: 'v2-nav-dir' }, [ui.previous]),
            el('span', {}, ['Module ' + pad2(prev.id) + ' · ' + prev.title])
          ]));
        } else {
          prevMount.appendChild(el('a', { class: 'v2-nav-btn disabled', 'aria-disabled': 'true' }, [
            el('span', { class: 'v2-nav-dir' }, [ui.previous.replace(/^[← ]+/, '')]),
            el('span', {}, [ui.atStart])
          ]));
        }
      }

      // Mount next
      var nextMount = document.getElementById('next-mount');
      if (nextMount) {
        if (next) {
          nextMount.appendChild(el('a', { class: 'v2-nav-btn', href: next.file }, [
            el('span', { class: 'v2-nav-dir' }, [ui.next]),
            el('span', {}, ['Module ' + pad2(next.id) + ' · ' + next.title])
          ]));
        } else {
          nextMount.appendChild(el('a', { class: 'v2-nav-btn', href: 'course.html' }, [
            el('span', { class: 'v2-nav-dir' }, [ui.courseComplete]),
            el('span', {}, [ui.backToOverview])
          ]));
        }
      }

      // Mark-complete button
      var btn = document.querySelector('.v2-complete-btn');
      if (btn) {
        var refreshBtn = function () {
          if (isComplete(mid)) {
            btn.classList.add('is-done');
            btn.textContent = ui.marked;
          } else {
            btn.classList.remove('is-done');
            btn.textContent = ui.markComplete;
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
        ofN.textContent = fmt(ui.moduleOfN, { n: pad2(mid), total: pad2(modules.length) });
      }
    });
  }

  // ── Overview page (course.html) ───────────────────────────
  function mountOverview() {
    var grid = document.getElementById('module-grid-mount');
    if (!grid) return;
    loadManifest().then(function (manifest) {
      var loc = detectLocaleFromPath();
      var ui = getUi(manifest);
      var modules = manifest.modules.map(function (m) { return localiseModule(m, loc); });
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
            }, [done[String(m.id)] === 'complete' ? ui.done : m.duration])
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
          ui.yourProgress,
          el('span', {}, [fmt(ui.ofComplete, { c: c, n: n, pct: pct })])
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
