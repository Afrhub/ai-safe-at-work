/* ════════════════════════════════════════════════════════════
   AI SAFE@WORK — Quiz + Classifier engine
   - Reads inline <script type="application/json" id="quiz-data">
   - Renders MCQ flow with feedback + scoring
   - Optional classifier widget for interactive practice
   - localStorage persistence (per-module score, attempts, timestamps)
   - Cert link unlocks at >= passThreshold
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const LS_PREFIX = 'aisw-quiz-m';
  const LS_NAME   = 'aisw-username';

  // ── Boot ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const dataEl = document.getElementById('quiz-data');
    if (!dataEl) return;
    let cfg;
    try { cfg = JSON.parse(dataEl.textContent); }
    catch (e) { console.error('quiz-data JSON parse error', e); return; }
    if (!cfg || !cfg.module) return;

    const classifierMount = document.getElementById('classifier-mount');
    if (classifierMount && cfg.classifier) {
      mountClassifier(classifierMount, cfg);
    }

    const quizMount = document.getElementById('quiz-mount');
    if (quizMount) {
      mountQuiz(quizMount, cfg);
    }
  });

  // ── MCQ ENGINE ────────────────────────────────────────────
  function mountQuiz(mount, cfg) {
    const state = {
      cfg,
      questions: cfg.questions || [],
      idx: 0,
      answers: [],   // {chosen, correct}
      phase: 'start' // start | question | feedback | end
    };
    render(mount, state);
  }

  function render(mount, state) {
    mount.innerHTML = '';
    const block = el('section', { class: 'quiz-block', 'aria-labelledby': 'quiz-h' });

    block.appendChild(el('span', { class: 'quiz-eyebrow' }, [`Knowledge check · Module ${pad2(state.cfg.module)}`]));
    block.appendChild(el('h2', { class: 'quiz-title', id: 'quiz-h' },
      htmlNodes(state.cfg.quizTitle || `Test your <em>understanding</em>.`)));
    block.appendChild(el('p', { class: 'quiz-lede' }, [state.cfg.quizLede ||
      `Ten questions drawn only from this module. Pass mark ${state.cfg.passThreshold}/10. You can retake as many times as you like.`]));

    if (state.phase === 'start') {
      block.appendChild(renderStart(state));
    } else if (state.phase === 'end') {
      block.appendChild(renderEnd(state));
    } else {
      block.appendChild(renderProgress(state));
      block.appendChild(renderQuestion(state, mount));
    }

    mount.appendChild(block);
  }

  function renderStart(state) {
    const wrap = el('div', { class: 'quiz-start' });
    const prev = loadResult(state.cfg.module);
    if (prev) {
      const ev = el('p', {}, [`Previous attempt: ${prev.score}/${state.questions.length} on ${formatDate(prev.t)}.`]);
      wrap.appendChild(ev);
    } else {
      wrap.appendChild(el('p', {}, [
        'Ten multiple-choice questions, five answers each, drawn only from this module. ',
        'You will see whether each answer is right or wrong as you go, plus a one-line explanation citing where in the module to look.'
      ]));
    }
    wrap.appendChild(el('ul', {}, [
      el('li', {}, [`Pass mark: ${state.cfg.passThreshold} of ${state.questions.length}.`]),
      el('li', {}, ['Pass once → printable certificate for your records and your EU AI Act Article 4 literacy evidence.']),
      el('li', {}, ['Retake any time. Your latest score replaces the previous one.'])
    ]));

    const controls = el('div', { class: 'quiz-controls' });
    const startBtn = el('button', { class: 'quiz-btn', type: 'button' }, ['Start the quiz →']);
    startBtn.addEventListener('click', () => {
      state.phase = 'question';
      state.idx = 0;
      state.answers = [];
      const mount = document.getElementById('quiz-mount');
      render(mount, state);
      scrollIntoView(mount);
    });
    controls.appendChild(startBtn);
    wrap.appendChild(controls);
    return wrap;
  }

  function renderProgress(state) {
    const wrap = el('div', { class: 'quiz-progress', 'aria-hidden': 'true' });
    for (let i = 0; i < state.questions.length; i++) {
      let cls = 'pip';
      if (i < state.idx) {
        cls += state.answers[i] && state.answers[i].correct ? ' correct' : ' wrong';
      } else if (i === state.idx) cls += ' current';
      wrap.appendChild(el('span', { class: cls }));
    }
    return wrap;
  }

  function renderQuestion(state, mount) {
    const q = state.questions[state.idx];
    const answered = state.answers[state.idx];
    const wrap = el('div', { class: 'quiz-question', role: 'group', 'aria-label': `Question ${state.idx + 1}` });

    wrap.appendChild(el('div', { class: 'quiz-counter' },
      [`Question ${state.idx + 1} of ${state.questions.length}`]));
    wrap.appendChild(el('h3', { class: 'quiz-q-text' }, [q.q]));

    const list = el('ul', { class: 'quiz-options', role: 'radiogroup', 'aria-label': 'Pick one answer' });
    const letters = ['A', 'B', 'C', 'D', 'E'];

    q.options.forEach((opt, i) => {
      const li = el('li');
      const btn = el('button', {
        type: 'button',
        class: 'quiz-option',
        role: 'radio',
        'aria-checked': answered && answered.chosen === i ? 'true' : 'false',
        'data-idx': i
      }, [
        el('span', { class: 'key', 'aria-hidden': 'true' }, [letters[i]]),
        el('span', { class: 'body' }, [opt])
      ]);
      if (answered) {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add('correct');
        else if (answered.chosen === i) btn.classList.add('wrong');
      } else {
        btn.addEventListener('click', () => pickAnswer(state, mount, i));
      }
      li.appendChild(btn);
      list.appendChild(li);
    });
    wrap.appendChild(list);

    if (answered) {
      const isRight = answered.correct;
      const fb = el('div', {
        class: 'quiz-feedback show ' + (isRight ? 'right' : 'wrong-fb'),
        role: 'status',
        'aria-live': 'polite'
      }, [
        el('span', { class: 'verdict' }, [isRight ? '✓ Correct' : '✗ Not quite']),
        el('div', {}, htmlNodes(q.why || '')),
        q.cite ? el('span', { class: 'cite' }, [`See: ${q.cite}`]) : null
      ].filter(Boolean));
      wrap.appendChild(fb);

      const controls = el('div', { class: 'quiz-controls' });
      const lastQ = state.idx === state.questions.length - 1;
      const next = el('button', { class: 'quiz-btn', type: 'button' },
        [lastQ ? 'See your score →' : `Next question (${state.idx + 2}/${state.questions.length}) →`]);
      next.addEventListener('click', () => {
        if (lastQ) finishQuiz(state, mount);
        else { state.idx += 1; render(mount, state); scrollIntoView(mount); }
      });
      controls.appendChild(next);
      wrap.appendChild(controls);
      setTimeout(() => next.focus(), 60);
    }

    return wrap;
  }

  function pickAnswer(state, mount, chosen) {
    const q = state.questions[state.idx];
    state.answers[state.idx] = { chosen, correct: chosen === q.correct };
    render(mount, state);
  }

  function finishQuiz(state, mount) {
    const score = state.answers.filter(a => a.correct).length;
    saveResult(state.cfg.module, {
      score,
      total: state.questions.length,
      threshold: state.cfg.passThreshold,
      t: new Date().toISOString()
    });
    state.phase = 'end';
    state.score = score;
    render(mount, state);
    scrollIntoView(mount);
  }

  function renderEnd(state) {
    const total = state.questions.length;
    const score = state.score;
    const pass = score >= state.cfg.passThreshold;
    const wrap = el('div', { class: 'quiz-end ' + (pass ? 'pass' : 'fail') });

    wrap.appendChild(el('div', { class: 'score-display' }, [
      el('span', { class: 'score-num' }, [String(score)]),
      el('span', { class: 'score-out' }, [`/ ${total}`])
    ]));

    wrap.appendChild(el('div', { class: 'verdict-line' }, [
      pass ? '✓ Pass — Article 4 literacy evidenced.'
           : `Below pass mark. You need ${state.cfg.passThreshold} of ${total} to pass.`
    ]));

    wrap.appendChild(el('p', { class: 'ev-note' }, htmlNodes(
      pass
        ? `Your score is saved locally on this device only (<code>localStorage</code>) — nothing is sent anywhere. Generate a printable certificate to keep in your training file.`
        : `Read the module sections you missed, then retake. Each attempt overwrites the previous one. No record leaves this device.`
    )));

    const controls = el('div', { class: 'quiz-controls' });
    const retry = el('button', { class: 'quiz-btn ghost', type: 'button' }, ['Retake the quiz']);
    retry.addEventListener('click', () => {
      state.idx = 0; state.answers = []; state.phase = 'question';
      render(document.getElementById('quiz-mount'), state);
      scrollIntoView(document.getElementById('quiz-mount'));
    });
    controls.appendChild(retry);
    if (pass) {
      const cert = el('a', {
        class: 'quiz-btn',
        href: `cert.html?m=${state.cfg.module}&s=${score}&n=${total}`
      }, ['Print my certificate →']);
      controls.appendChild(cert);
    }
    wrap.appendChild(controls);
    return wrap;
  }

  // ── CLASSIFIER ENGINE ─────────────────────────────────────
  function mountClassifier(mount, cfg) {
    const c = cfg.classifier;
    if (!c || !Array.isArray(c.items) || c.items.length === 0) return;

    const state = {
      items: shuffle(c.items.slice()),
      idx: 0,
      results: [],
      done: false
    };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'classifier-block', 'aria-labelledby': 'cls-h' });
      block.appendChild(el('span', { class: 'classifier-eyebrow' }, [c.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'classifier-title', id: 'cls-h' },
        htmlNodes(c.title || 'Classify the <em>data</em>.')));
      block.appendChild(el('p', { class: 'classifier-lede' }, [c.lede || '']));

      const stage = el('div', { class: 'classifier-stage' });

      // Left card — current item
      const left = el('div', { class: 'clip-card' });
      left.appendChild(clipboardSvg());
      left.appendChild(el('div', { class: 'clip-counter' },
        [state.done ? 'All items classified' : `Item ${state.idx + 1} of ${state.items.length}`]));

      const item = state.items[state.idx] || state.items[state.items.length - 1];
      left.appendChild(el('div', { class: 'clip-item' }, [item.label]));

      if (!state.done) {
        const actions = el('div', { class: 'clip-actions' });
        const safe = el('button', { type: 'button', class: 'clip-btn safe' }, [
          el('span', { class: 'glyph', 'aria-hidden': 'true' }, ['✓']),
          el('span', {}, ['Safe to paste'])
        ]);
        const never = el('button', { type: 'button', class: 'clip-btn never' }, [
          el('span', { class: 'glyph', 'aria-hidden': 'true' }, ['✗']),
          el('span', {}, ['Never paste'])
        ]);
        safe.addEventListener('click', () => answer('safe'));
        never.addEventListener('click', () => answer('never'));
        actions.appendChild(safe); actions.appendChild(never);
        left.appendChild(actions);
      }
      stage.appendChild(left);

      // Right card — verdict / idle / done
      const right = el('div');
      const lastResult = state.results[state.results.length - 1];
      if (state.done) {
        const correct = state.results.filter(r => r.right).length;
        right.className = 'clip-verdict ' + (correct === state.items.length ? 'right' : '');
        right.appendChild(el('span', { class: 'v-label' }, ['Result']));
        right.appendChild(el('div', { class: 'v-state' },
          [`${correct} of ${state.items.length} correct`]));
        right.appendChild(el('p', { class: 'v-why' }, [
          correct === state.items.length
            ? 'Perfect classification — you can spot the categories at speed. Take the knowledge check below.'
            : 'Re-read the items you missed in the module above, then try the knowledge check below. You can retry the classifier any time.'
        ]));
        const bar = el('div', { class: 'clip-bar' });
        state.results.forEach(r => bar.appendChild(el('span', { class: 'pip ' + (r.right ? 'right' : 'wrong') })));
        right.appendChild(bar);
      } else if (lastResult) {
        right.className = 'clip-verdict ' + (lastResult.right ? 'right' : 'wrong');
        right.appendChild(el('span', { class: 'v-label' }, [lastResult.right ? '✓ Correct' : '✗ Not quite']));
        right.appendChild(el('div', { class: 'v-state' }, [lastResult.right ? 'Good call.' : 'Have another read.']));
        right.appendChild(el('p', { class: 'v-why' }, [lastResult.why]));
        if (lastResult.cite) right.appendChild(el('span', { class: 'v-cite' }, [`See: ${lastResult.cite}`]));
        const bar = el('div', { class: 'clip-bar' });
        for (let i = 0; i < state.items.length; i++) {
          let cls = 'pip';
          if (state.results[i]) cls += state.results[i].right ? ' right' : ' wrong';
          bar.appendChild(el('span', { class: cls }));
        }
        right.appendChild(bar);
      } else {
        right.className = 'clip-verdict idle';
        right.appendChild(idleSvg());
        right.appendChild(el('div', { class: 'v-state' }, ['Pick safe or never. Feedback appears here.']));
      }
      stage.appendChild(right);

      block.appendChild(stage);

      if (state.done) {
        const restart = el('button', { class: 'quiz-btn ghost', type: 'button' }, ['↺ Reset classifier']);
        restart.addEventListener('click', () => {
          state.items = shuffle(c.items.slice());
          state.idx = 0;
          state.results = [];
          state.done = false;
          build();
        });
        const controls = el('div', { class: 'quiz-controls' });
        controls.appendChild(restart);
        block.appendChild(controls);
      }

      mount.appendChild(block);
    }

    function answer(choice) {
      const item = state.items[state.idx];
      const right = item.answer === choice;
      state.results.push({ right, why: item.why, cite: item.cite });
      if (state.idx + 1 >= state.items.length) {
        state.done = true;
      } else {
        state.idx += 1;
      }
      build();
    }

    build();
  }

  // ── PERSISTENCE ───────────────────────────────────────────
  function saveResult(module, result) {
    try { localStorage.setItem(LS_PREFIX + module, JSON.stringify(result)); }
    catch (e) { /* private mode */ }
  }
  function loadResult(module) {
    try {
      const raw = localStorage.getItem(LS_PREFIX + module);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  // ── HELPERS ───────────────────────────────────────────────
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (attrs[k] == null) continue;
        if (k === 'class') node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      children.forEach(c => {
        if (c == null) return;
        if (typeof c === 'string') node.appendChild(document.createTextNode(c));
        else node.appendChild(c);
      });
    }
    return node;
  }
  function htmlNodes(str) {
    // Very small parser: only honours <em></em>, <strong></strong>, <code></code>.
    const tmp = document.createElement('div');
    tmp.innerHTML = String(str)
      .replace(/&(?!#?\w+;)/g, '&amp;')
      .replace(/<(?!\/?(em|strong|code)\b)/g, '&lt;');
    return Array.from(tmp.childNodes);
  }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return iso; }
  }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function scrollIntoView(node) {
    if (!node) return;
    const r = node.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  function clipboardSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'clip-svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g fill="none" stroke="#91a2ff" stroke-width="3"><rect x="40" y="30" width="120" height="150" rx="10"/><rect x="70" y="20" width="60" height="22" rx="6"/><line x1="60" y1="70" x2="140" y2="70"/><line x1="60" y1="90" x2="120" y2="90"/><line x1="60" y1="110" x2="135" y2="110"/><line x1="60" y1="130" x2="100" y2="130"/><line x1="60" y1="150" x2="125" y2="150"/></g>';
    return svg;
  }
  function idleSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'v-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="50" cy="50" r="35"/><path d="M50 32 v22 l14 10"/></g>';
    return svg;
  }
})();
