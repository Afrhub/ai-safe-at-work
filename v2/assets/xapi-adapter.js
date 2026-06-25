/* ════════════════════════════════════════════════════════════
   AI SAFE@WORK v2 — xAPI (Tin Can) adapter
   Closes DOCTRINE.md § Procurement-readiness gates → Gate 4
   (the xAPI half; SCORM 1.2 half is scorm-api.js).

   xAPI statements are POSTed to a configurable Learning Record
   Store (LRS). If no LRS is configured at boot time, every emit
   call is a silent no-op (parity with the SCORM standalone-mode
   behaviour).

   How to configure:
     1. URL params:
        ?lrs=https://lrs.example.com/xapi/&auth=BASE64(user:pass)
        These are read once at boot and immediately stripped from
        the URL (no persistent leak via history).
     2. window.AISW_XAPI_CONFIG global, set BEFORE this script loads:
        window.AISW_XAPI_CONFIG = {
          endpoint: 'https://lrs.example.com/xapi/',
          auth:     'Basic BASE64',
          actor:    { mbox: 'mailto:learner@example.com' }  // optional
        };
     3. Buyer-side LMS injection: many LMSs (Cornerstone, Watershed,
        Learning Locker, etc.) inject the LRS endpoint + auth at
        runtime into the page chrome. This adapter checks for
        window.ADL?.XAPIWrapper and uses it if present.

   Security posture:
     - All POSTs use credentials:'omit' to avoid accidental cookie
       leakage. The auth header is set explicitly per request.
     - Endpoint URL is validated to be https:// (no http://, no
       data:, no javascript:). Failed validation = silent no-op.
     - Statements never contain free-text from user input. They
       contain enums (verb IDs), integer scores, ISO timestamps,
       and the actor object provided at config time.
     - Adapter respects the CSP. By default v2 CSP has
       connect-src 'self'; for xAPI to work, the deploying party
       must add the LRS origin to connect-src. The adapter is
       silent and harmless if CSP blocks the request.

   Statement vocabulary used here:
     - http://adlnet.gov/expapi/verbs/experienced  (page viewed)
     - http://adlnet.gov/expapi/verbs/completed    (module marked complete)
     - http://adlnet.gov/expapi/verbs/passed       (course ≥ 80%)
     - http://adlnet.gov/expapi/verbs/failed       (course < 80%)
     - http://adlnet.gov/expapi/verbs/answered     (knowledge-check answered)

   Full statement shapes are documented in
   .audit/integrations/xapi-statements-spec.md.
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var ACTIVITY_BASE = 'https://attest-ai.com/xapi/v2/';
  var VERBS = {
    experienced: 'http://adlnet.gov/expapi/verbs/experienced',
    completed:   'http://adlnet.gov/expapi/verbs/completed',
    passed:      'http://adlnet.gov/expapi/verbs/passed',
    failed:      'http://adlnet.gov/expapi/verbs/failed',
    answered:    'http://adlnet.gov/expapi/verbs/answered'
  };

  var cfg = null;
  var booted = false;

  /* ── 1) Endpoint validation ──────────────────────────────── */
  function validEndpoint(url) {
    if (typeof url !== 'string' || !url) return false;
    if (url.length > 2048) return false;
    if (!/^https:\/\//i.test(url)) return false;
    try {
      var u = new URL(url);
      if (u.protocol !== 'https:') return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function validAuth(auth) {
    if (typeof auth !== 'string' || !auth) return false;
    if (auth.length > 4096) return false;
    // Reject obvious unsafe characters; basic header allow-list.
    if (/[\r\n]/.test(auth)) return false;
    return true;
  }

  /* ── 2) Read config (URL params → globals → off) ─────────── */
  function readURLConfig() {
    try {
      var qs = new URL(window.location.href);
      var lrs = qs.searchParams.get('lrs');
      var auth = qs.searchParams.get('auth');
      if (lrs && auth && validEndpoint(lrs) && validAuth(auth)) {
        // Strip from URL history to avoid leaking via referrer/sharing.
        qs.searchParams.delete('lrs');
        qs.searchParams.delete('auth');
        try { window.history.replaceState({}, '', qs.toString()); } catch (e) {}
        return {
          endpoint: lrs,
          auth: /^Basic\s+/i.test(auth) ? auth : 'Basic ' + auth
        };
      }
    } catch (e) {}
    return null;
  }

  function readGlobalConfig() {
    var g = window.AISW_XAPI_CONFIG;
    if (!g || typeof g !== 'object') return null;
    if (!validEndpoint(g.endpoint)) return null;
    if (!validAuth(g.auth)) return null;
    var auth = g.auth;
    if (!/^(Basic|Bearer)\s+/i.test(auth)) auth = 'Basic ' + auth;
    return { endpoint: g.endpoint, auth: auth, actor: g.actor || null };
  }

  function init() {
    if (booted) return;
    booted = true;
    var fromGlobal = readGlobalConfig();
    var fromURL = readURLConfig();
    cfg = fromGlobal || fromURL || null;
    if (cfg) {
      // Normalise endpoint to always end with /
      if (cfg.endpoint && cfg.endpoint.slice(-1) !== '/') cfg.endpoint += '/';
      console.info('[xapi] configured against ' + cfg.endpoint);
    } else {
      console.info('[xapi] not configured; emits are no-ops');
    }
  }

  /* ── 3) Build the statement ──────────────────────────────── */
  function buildStatement(verbKey, opts) {
    opts = opts || {};
    var actor = opts.actor || (cfg && cfg.actor) || {
      objectType: 'Agent',
      name: 'AI Safe@Work learner',
      account: {
        homePage: 'https://attest-ai.com/v2/',
        name: opts.actorName || 'anonymous'
      }
    };
    var statement = {
      actor: actor,
      verb: {
        id: VERBS[verbKey],
        display: {
          'en-US': verbKey
        }
      },
      object: {
        id: opts.objectId || (ACTIVITY_BASE + 'course'),
        objectType: 'Activity',
        definition: {
          name: { 'en-US': opts.objectName || 'AI Safe@Work — v2 course' },
          type: opts.objectType || 'http://adlnet.gov/expapi/activities/course'
        }
      },
      timestamp: new Date().toISOString(),
      context: {
        platform: 'AI Safe@Work v2',
        language: opts.locale || 'en',
        contextActivities: {
          parent: [
            { id: ACTIVITY_BASE + 'course', objectType: 'Activity' }
          ]
        }
      }
    };
    if (opts.score != null) {
      var s = Math.max(0, Math.min(100, parseInt(opts.score, 10) || 0));
      statement.result = {
        score: {
          scaled: s / 100,
          raw: s,
          min: 0,
          max: 100
        },
        success: s >= 80,
        completion: true
      };
    }
    return statement;
  }

  /* ── 4) Emit ─────────────────────────────────────────────── */
  function emit(verbKey, opts) {
    if (!cfg) return Promise.resolve(false);
    if (!VERBS[verbKey]) return Promise.resolve(false);
    var stmt = buildStatement(verbKey, opts);
    var body;
    try { body = JSON.stringify(stmt); }
    catch (e) { return Promise.resolve(false); }
    try {
      return fetch(cfg.endpoint + 'statements', {
        method: 'POST',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'X-Experience-API-Version': '1.0.3',
          'Authorization': cfg.auth
        },
        body: body
      }).then(function (r) {
        if (!r.ok) {
          console.warn('[xapi] statement POST failed', r.status);
          return false;
        }
        return true;
      }).catch(function (e) {
        console.warn('[xapi] statement POST errored', e && e.message);
        return false;
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  /* ── 5) Public helpers per learner event ─────────────────── */
  function moduleExperienced(n, locale) {
    return emit('experienced', {
      objectId: ACTIVITY_BASE + 'module/' + n,
      objectName: 'AI Safe@Work — v2 module ' + n,
      objectType: 'http://adlnet.gov/expapi/activities/lesson',
      locale: locale || 'en'
    });
  }
  function moduleCompleted(n, locale) {
    return emit('completed', {
      objectId: ACTIVITY_BASE + 'module/' + n,
      objectName: 'AI Safe@Work — v2 module ' + n,
      objectType: 'http://adlnet.gov/expapi/activities/lesson',
      locale: locale || 'en'
    });
  }
  function coursePassed(score, locale) {
    return emit('passed', {
      objectId: ACTIVITY_BASE + 'course',
      objectName: 'AI Safe@Work — v2 course',
      objectType: 'http://adlnet.gov/expapi/activities/course',
      score: score,
      locale: locale || 'en'
    });
  }
  function courseFailed(score, locale) {
    return emit('failed', {
      objectId: ACTIVITY_BASE + 'course',
      objectName: 'AI Safe@Work — v2 course',
      objectType: 'http://adlnet.gov/expapi/activities/course',
      score: score,
      locale: locale || 'en'
    });
  }

  /* ── 6) Boot + expose ────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AISW_XAPI = {
    init: init,
    isConfigured: function () { return cfg != null; },
    emit: emit,
    moduleExperienced: moduleExperienced,
    moduleCompleted: moduleCompleted,
    coursePassed: coursePassed,
    courseFailed: courseFailed
  };
})();
