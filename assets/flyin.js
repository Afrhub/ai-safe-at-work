/* ── arrival ──────────────────────────────────────────────────────────
   A reader coming from the JAR Designs wall has just flown through the
   Attest AI card and watched its words come apart around them. The hero
   assembles itself the same way in reverse — same orange, same easing —
   so the two sites read as one movement rather than a navigation.

   Nothing here runs on an ordinary visit: it is gated on the referrer,
   off under reduced motion, and the class removes itself after three
   seconds no matter what, so a failure shows the page rather than hides
   it.

   This is a file rather than an inline block because the site's CSP is
   script-src 'self'; inline scripts are blocked in production and pass
   silently in local preview, which is exactly how the first version of
   this shipped dead. Loaded blocking in the head, like theme-boot.js,
   so the hiding class is on the element before first paint. */
(function () {
  var html = document.documentElement;

  try {
    var from = document.referrer ? new URL(document.referrer).hostname : '';
    if (!/(^|\.)jardesigns/.test(from) && location.search.indexOf('flyin') < 0) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    html.classList.add('flyin');
  } catch (e) { return; }

  /* The hero comes back together out of the flight: each line starts where
     the card's matching line was thrown — out to one side and up close to
     the eye — and settles into place, top down. The whole thing is
     cancelled the moment it lands, because a finished animation left
     filling forwards would keep a transform on the sticky topbar for the
     rest of the visit. */
  var PARTS = [                    /* selector, sideways, vertical */
    ['.topbar',             -0.55, -0.85],
    ['.gate-eyebrow',       -0.80, -0.45],
    ['.gate-stage h1',       0.62, -0.15],
    ['.gate-stage .lede',   -0.75,  0.20],
    ['.hero-ctas',           0.70,  0.55]
  ];

  /* The failsafe and the finish share one landing, and it runs at most once.
     They are not interchangeable: a backgrounded tab does not advance
     animations at all, so `finished` never resolves there while timers keep
     running — a failsafe that only dropped the class would leave the hero
     pinned at opacity 0 by an animation frozen at time zero. */
  var anims = [], els = [], landed = false;
  function land() {
    if (landed) return;
    landed = true;
    html.classList.remove('flyin');            /* first, or the parts blink out */
    /* mark them revealed before letting go: a [data-reveal] element the
       site's own observer hasn't reached yet would drop back to opacity 0 */
    els.forEach(function (el) { el.classList.add('is-revealed'); });
    anims.forEach(function (a) { a.cancel(); });
  }
  setTimeout(land, 3000);

  addEventListener('DOMContentLoaded', function () {
    if (landed || !html.classList.contains('flyin')) return;

    /* Nothing to fly through in a tab the reader is not looking at, and the
       animations would not run anyway — show the page as it normally loads. */
    if (document.hidden) { els = [].slice.call(document.querySelectorAll(PARTS.map(function (p) { return p[0]; }).join(','))); return land(); }

    var last = null;
    PARTS.forEach(function (p, i) {
      var el = document.querySelector(p[0]);
      if (!el) return;
      els.push(el);
      var a = el.animate([
        { transform: 'perspective(900px) translate3d(' + (p[1] * 280).toFixed(0) + 'px,' +
                     (p[2] * 220).toFixed(0) + 'px,460px) rotate(' + (p[1] * 6).toFixed(1) + 'deg)',
          opacity: 0 },
        { transform: 'none', opacity: 1 }
      ], { duration: 820, delay: 60 + i * 85, easing: 'cubic-bezier(0.23,1,0.32,1)', fill: 'both' });
      anims.push(a);
      last = a;
    });

    if (!last) return land();

    last.finished.then(land).catch(land);
    /* A tab hidden mid-flight freezes the animations where they stand; the
       timeline only resumes on return, so land it now rather than leave a
       half-assembled page waiting. */
    document.addEventListener('visibilitychange', function () { if (document.hidden) land(); });
  });
})();
