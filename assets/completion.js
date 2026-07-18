/* ════════════════════════════════════════════════════════════
   AI SAFE@WORK, course completion tracking (localStorage)
   The numbered modules use a "Mark complete" button (quizzes are
   static knowledge-checks, not scored). The 60-second check unlocks
   once every numbered module is marked complete.
   ════════════════════════════════════════════════════════════ */
(function () {
  // Module 11 is the 60-second check (the gated reward), so it is NOT
  // in the list of things you must finish first.
  var NUMBERED = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  var DONE = 'aisw-done-m';

  function isDone(n) {
    try { return localStorage.getItem(DONE + n) === '1'; } catch (e) { return false; }
  }
  function setDone(n, v) {
    try {
      if (v) localStorage.setItem(DONE + n, '1');
      else localStorage.removeItem(DONE + n);
    } catch (e) {}
  }
  function doneCount() { return NUMBERED.filter(isDone).length; }
  function allDone() { return NUMBERED.every(isDone); }

  window.AISW = { NUMBERED: NUMBERED, isDone: isDone, setDone: setDone, doneCount: doneCount, allDone: allDone, total: NUMBERED.length };

  function applyUnlock() {
    var unlocked = allDone();
    var els = document.querySelectorAll('[data-locked-until-complete]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.classList.toggle('is-unlocked', unlocked);
      el.classList.toggle('is-locked', !unlocked);
      var href = el.getAttribute('data-unlock-href');
      if (unlocked && href && el.tagName === 'A') el.setAttribute('href', href);
      if (!unlocked && el.tagName === 'A') el.removeAttribute('href');
    }
    var counters = document.querySelectorAll('[data-progress-count]');
    for (var j = 0; j < counters.length; j++) {
      counters[j].textContent = doneCount() + ' / ' + NUMBERED.length;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Mark-complete buttons: <button data-mark-complete="N">
    var btns = document.querySelectorAll('[data-mark-complete]');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        var n = parseInt(btn.getAttribute('data-mark-complete'), 10);
        function sync() {
          var d = isDone(n);
          btn.classList.toggle('is-done', d);
          btn.textContent = d ? '✓ Module complete · tap to undo' : 'Mark this module complete';
        }
        btn.addEventListener('click', function () { setDone(n, !isDone(n)); sync(); applyUnlock(); });
        sync();
      })(btns[i]);
    }

    // Checklist gate page: element with [data-checklist-gate] is hidden
    // until all modules are complete; [data-checklist-locked] shows instead.
    var gate = document.querySelector('[data-checklist-gate]');
    var lockedMsg = document.querySelector('[data-checklist-locked]');
    if (gate || lockedMsg) {
      var ok = allDone();
      if (gate) gate.style.display = ok ? '' : 'none';
      if (lockedMsg) lockedMsg.style.display = ok ? 'none' : '';
    }

    applyUnlock();
  });
})();
