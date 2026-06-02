/* ════════════════════════════════════════════════════════════
   AI SAFE@WORK v2 — SCORM 1.2 API wrapper
   Closes DOCTRINE.md § Procurement-readiness gates → Gate 4.

   Single-SCO model: the entire 11-module course runs as one SCO.
   v2.js drives navigation in-page; this wrapper reports progress
   + completion + score to the parent LMS via the standard
   SCORM 1.2 API window discovery pattern.

   When no API is found (e.g. standalone playback at
   aisafework.netlify.app/v2/), every call returns false and the
   course continues with localStorage-only state.

   Security posture:
   - No outbound network calls beyond the SCORM API set on
     window.API (which is itself a browser-local object provided
     by the LMS host frame). connect-src 'self' in CSP unchanged.
   - All localStorage writes still pass through the v2.js
     safeWrite() throttle (10 writes/sec cap).
   - No PII is read or written by this wrapper. The student ID is
     read-only and consumed only to be echoed back to the LMS in
     subsequent SetValue calls.

   Public API (exposed on window.AISW_SCORM):
     init()                       → boot the wrapper, discover API
     isConnected()                → true if an LMS API was found
     markModuleComplete(n)        → push lesson_location + suspend_data
     markCourseComplete(score)    → push completion + score, then commit
     finish()                     → LMSFinish + cleanup (called on
                                    beforeunload)
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var state = {
    api: null,
    initialised: false,
    studentId: '',
    studentName: '',
    sessionStart: 0,
    suspend: null
  };

  /* ── 1) Discover the LMS API ─────────────────────────────── */
  // SCORM 1.2 spec recommends:
  //   1. Look on current window.
  //   2. Walk up parent chain (window.parent.parent...) up to 7 levels.
  //   3. Look on window.opener.
  function findAPI(win) {
    var hops = 0;
    var cur = win;
    while (cur && hops < 8) {
      if (cur.API) return cur.API;
      if (cur.parent && cur.parent !== cur) {
        cur = cur.parent;
      } else {
        break;
      }
      hops++;
    }
    return null;
  }

  function discoverAPI() {
    var api = findAPI(window);
    if (!api && window.opener) {
      api = findAPI(window.opener);
    }
    return api || null;
  }

  /* ── 2) Init + Finish ────────────────────────────────────── */
  function init() {
    if (state.initialised) return state.api != null;
    state.api = discoverAPI();
    if (!state.api) {
      // No LMS — silent fallback.
      console.info('[scorm] no API found, running in standalone mode');
      state.initialised = true;
      return false;
    }
    try {
      var ok = String(state.api.LMSInitialize('')) === 'true';
      if (!ok) {
        console.warn('[scorm] LMSInitialize returned false; running standalone');
        state.api = null;
        state.initialised = true;
        return false;
      }
      state.studentId = String(state.api.LMSGetValue('cmi.core.student_id') || '');
      state.studentName = String(state.api.LMSGetValue('cmi.core.student_name') || '');
      // Restore suspend_data if the learner is resuming.
      var raw = String(state.api.LMSGetValue('cmi.suspend_data') || '');
      if (raw) {
        try { state.suspend = JSON.parse(raw); }
        catch (e) { state.suspend = null; }
      }
      // Mark session start so we can report cmi.core.session_time on finish.
      state.sessionStart = (new Date()).getTime();
      // First-touch status: incomplete unless we already finished.
      var status = String(state.api.LMSGetValue('cmi.core.lesson_status') || 'not attempted');
      if (status === 'not attempted' || status === '') {
        state.api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
        state.api.LMSCommit('');
      }
      state.initialised = true;
      return true;
    } catch (e) {
      console.warn('[scorm] init threw; running standalone', e);
      state.api = null;
      state.initialised = true;
      return false;
    }
  }

  function finish() {
    if (!state.api) return;
    try {
      // Push session_time for this session window.
      var ms = (new Date()).getTime() - (state.sessionStart || (new Date()).getTime());
      state.api.LMSSetValue('cmi.core.session_time', msToHMS(ms));
      state.api.LMSCommit('');
      state.api.LMSFinish('');
    } catch (e) {
      console.warn('[scorm] finish threw', e);
    }
    state.api = null;
  }

  /* ── 3) Module completion + course completion ───────────── */
  function markModuleComplete(moduleId, completedSet) {
    if (!state.api) return;
    var n = parseInt(moduleId, 10);
    if (!n || n < 1 || n > 11) return;
    try {
      state.api.LMSSetValue('cmi.core.lesson_location', String(n));
      var suspend = {
        version: 1,
        completed: Array.isArray(completedSet)
          ? completedSet.slice().sort(function (a, b) { return a - b; })
          : [n],
        locale: detectLocale(),
        ts: (new Date()).toISOString()
      };
      state.api.LMSSetValue('cmi.suspend_data', JSON.stringify(suspend));
      state.api.LMSSetValue('cmi.core.exit', 'suspend');
      state.api.LMSCommit('');
    } catch (e) {
      console.warn('[scorm] markModuleComplete threw', e);
    }
  }

  function markCourseComplete(score) {
    if (!state.api) return;
    var s = clamp(parseInt(score, 10) || 0, 0, 100);
    var passed = s >= 80;
    try {
      state.api.LMSSetValue('cmi.core.score.raw', String(s));
      state.api.LMSSetValue('cmi.core.score.min', '0');
      state.api.LMSSetValue('cmi.core.score.max', '100');
      state.api.LMSSetValue('cmi.core.lesson_status', passed ? 'passed' : 'failed');
      // Empty exit signals the SCO is finished, not suspended.
      state.api.LMSSetValue('cmi.core.exit', '');
      state.api.LMSCommit('');
    } catch (e) {
      console.warn('[scorm] markCourseComplete threw', e);
    }
  }

  /* ── 4) Helpers ──────────────────────────────────────────── */
  function isConnected() { return state.api != null; }
  function getStudent() { return { id: state.studentId, name: state.studentName }; }
  function getSuspend() { return state.suspend; }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function msToHMS(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return pad(h) + ':' + pad(m) + ':' + pad(sec);
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function detectLocale() {
    var path = (window.location && window.location.pathname) || '/';
    if (path.indexOf('/v2/fr/') !== -1 || path.indexOf('/v2/fr.html') !== -1) return 'fr';
    if (path.indexOf('/v2/de/') !== -1 || path.indexOf('/v2/de.html') !== -1) return 'de';
    return 'en';
  }

  /* ── 5) Boot + lifecycle ─────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Push a final commit + LMSFinish when the learner closes the tab.
  // pagehide is more reliable than unload across mobile + Safari.
  window.addEventListener('pagehide', finish, { capture: true });

  /* ── 6) Expose ───────────────────────────────────────────── */
  window.AISW_SCORM = {
    init: init,
    finish: finish,
    isConnected: isConnected,
    markModuleComplete: markModuleComplete,
    markCourseComplete: markCourseComplete,
    getStudent: getStudent,
    getSuspend: getSuspend
  };
})();
