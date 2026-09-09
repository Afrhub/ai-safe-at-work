// Session token for the course, certificate and completion scripts, which run on pages
// that carry no supabase-js. They used to read the stored access token as-is; it expires
// after an hour, so a learner who spent longer than that on the course pages got "could
// not mark" with no way back (Codex audit, 9 Sep 2026). This refreshes through the stored
// refresh token when the JWT is within a minute of expiry, and writes the new session back
// in supabase-js's own shape so the portal pages agree with it.
(function () {
  var URL_ = 'https://hanjrsslhnuauaysbhun.supabase.co';
  var ANON = 'sb_publishable_wtK-KC8ibXtA0EvVIJZGqA_oY8wx_6E';
  var KEY = 'sb-hanjrsslhnuauaysbhun-auth-token';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  var inflight = null;
  function token() {
    var s = read();
    if (!s || !s.access_token) return Promise.resolve('');
    var now = Math.floor(Date.now() / 1000);
    if (!s.expires_at || s.expires_at - now > 60 || !s.refresh_token) return Promise.resolve(s.access_token);
    if (inflight) return inflight;
    inflight = fetch(URL_ + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (n) {
      inflight = null;
      if (!n || !n.access_token) return s.access_token; // let the caller fail visibly
      var merged = Object.assign({}, s, n, { expires_at: n.expires_at || (now + (n.expires_in || 3600)) });
      try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch (e) {}
      return merged.access_token;
    }).catch(function () { inflight = null; return s.access_token; });
    return inflight;
  }
  // Identity comes from GoTrue, not from the stored JSON, which anyone can edit in devtools.
  var userCache = null;
  function user() {
    if (userCache) return Promise.resolve(userCache);
    return token().then(function (t) {
      if (!t) return null;
      return fetch(URL_ + '/auth/v1/user', { headers: { apikey: ANON, Authorization: 'Bearer ' + t } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (u) { userCache = u && u.id ? { id: u.id, aal: (u.aal || null) } : null; return userCache; });
    }).catch(function () { return null; });
  }
  window.AISW_SESSION = { url: URL_, anon: ANON, key: KEY, token: token, read: read, user: user };
})();
