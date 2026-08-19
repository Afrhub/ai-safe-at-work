// Sign out after 10 minutes of inactivity. One file for every authenticated surface:
// the portal pages and the course-gated module/certificate pages at the site root.
//
// Sliding window: any pointer, key, scroll, touch or visibility return resets the clock,
// and the last-activity stamp lives in localStorage so activity in one tab keeps every
// tab alive. On expiry the page calls the sign-out handler it was given, or, on the
// course pages that carry no supabase-js, clears the session token itself and bounces
// to sign-in. Either way the next request from this browser is unauthenticated.
//
// Classic script, loaded with `defer`, no inline anything (CSP). Exposes window.AISW_IDLE.
// Pages with a proper sign-out (portal.js) register it: AISW_IDLE.onExpire(signOut).
//
// ponytail: 10 min is a fixed constant, not a per-tenant setting; make it configurable if
// a customer's policy ever names a different number.

(function () {
  'use strict';

  var LIMIT_MS = 10 * 60 * 1000;
  var KEY = 'aisw-last-activity';
  var TOKEN_KEY = 'sb-hanjrsslhnuauaysbhun-auth-token';
  var TICK_MS = 15 * 1000;
  var handler = null;
  var expired = false;

  function now() { return Date.now(); }
  function read() { try { return Number(localStorage.getItem(KEY)) || 0; } catch (e) { return 0; } }
  function touch() { try { localStorage.setItem(KEY, String(now())); } catch (e) {} }
  function hasSession() { try { return Boolean(localStorage.getItem(TOKEN_KEY)); } catch (e) { return false; } }

  function loginPath() {
    // Portal pages are siblings of login.html; root pages need the /portal/ prefix.
    return location.pathname.indexOf('/portal/') === 0 ? 'login.html' : '/portal/login.html';
  }

  function fallbackSignOut() {
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    location.replace(loginPath() + '?idle=1');
  }

  function expire() {
    if (expired) return;
    expired = true;
    try { localStorage.removeItem(KEY); } catch (e) {}
    if (typeof handler === 'function') {
      // A failed server sign-out must not leave the page open: fall back regardless.
      try { Promise.resolve(handler()).catch(fallbackSignOut); } catch (e) { fallbackSignOut(); }
    } else {
      fallbackSignOut();
    }
  }

  function check() {
    if (!hasSession()) return;            // signed out some other way; nothing to do
    var last = read();
    if (!last) { touch(); return; }       // first sight of this session
    if (now() - last >= LIMIT_MS) expire();
  }

  var events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart', 'wheel'];
  var throttled = false;
  function onActivity() {
    if (throttled || expired) return;
    throttled = true;
    setTimeout(function () { throttled = false; }, 1000);
    touch();
  }
  for (var i = 0; i < events.length; i++) {
    document.addEventListener(events[i], onActivity, { passive: true, capture: true });
  }
  document.addEventListener('visibilitychange', function () {
    // Coming back to a tab that has sat idle past the limit signs out at once.
    if (document.visibilityState === 'visible') check();
  });

  if (hasSession()) touch();
  setInterval(check, TICK_MS);

  window.AISW_IDLE = {
    LIMIT_MS: LIMIT_MS,
    onExpire: function (fn) { handler = fn; },
    touch: touch,
    // Test hook: force an expiry check against an injected last-activity time.
    _check: check
  };
})();
