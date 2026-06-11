/* ════════════════════════════════════════════════════════════
   AI SAFE@WORK — Interactive widget engine
   Mounts into #widget-mount, reads `widget` key inside #quiz-data.
   Dispatches by cfg.widget.type:
     bucket | flowchart | multiselect | scenario | form | order | ticklist
   localStorage persists per-module per-widget score.
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const LS_PREFIX = 'aisw-widget-m';

  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('widget-mount');
    const dataEl = document.getElementById('quiz-data');
    if (!mount || !dataEl) return;
    let cfg;
    try { cfg = JSON.parse(dataEl.textContent); }
    catch (e) { console.error('widgets: quiz-data parse error', e); return; }
    if (!cfg || !cfg.widget) return;
    const m = cfg.module;
    const w = cfg.widget;
    try {
      switch (w.type) {
        case 'bucket':       mountBucket(mount, m, w); break;
        case 'flowchart':    mountFlowchart(mount, m, w); break;
        case 'multiselect':  mountMultiselect(mount, m, w); break;
        case 'scenario':     mountScenario(mount, m, w); break;
        case 'form':         mountForm(mount, m, w); break;
        case 'order':        mountOrder(mount, m, w); break;
        case 'ticklist':     mountTicklist(mount, m, w); break;
        default: console.warn('widgets: unknown type', w.type);
      }
    } catch (err) {
      console.error('widgets: mount error', err);
      mount.innerHTML = '<p style="color:#e03e3e">Interactive widget failed to load. The MCQ knowledge check below still works.</p>';
    }
  });

  /* ──────────────────────────────────────────────────────────
     BUCKET — n-way classifier (M2 tier-classify)
  ────────────────────────────────────────────────────────── */
  function mountBucket(mount, module, w) {
    const state = {
      items: shuffle(w.items.slice()),
      idx: 0,
      results: [],
      done: false
    };
    const buckets = w.buckets;

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block bucket-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Sort by <em>tier</em>.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      const stage = el('div', { class: 'bucket-stage' });
      const left = el('div', { class: 'bucket-item-card' });
      left.appendChild(bucketSvg());
      left.appendChild(el('div', { class: 'bucket-counter' },
        [state.done ? 'All items sorted' : `Item ${state.idx + 1} of ${state.items.length}`]));
      const item = state.items[state.idx] || state.items[state.items.length - 1];
      left.appendChild(el('div', { class: 'bucket-item-text' }, [item.label]));
      if (!state.done) {
        const grid = el('div', { class: 'bucket-grid' });
        buckets.forEach(b => {
          const btn = el('button', { type: 'button', class: 'bucket-btn', 'data-id': b.id }, [
            el('span', { class: 'bucket-btn-label' }, [b.label])
          ]);
          btn.addEventListener('click', () => answer(b.id));
          grid.appendChild(btn);
        });
        left.appendChild(grid);
      }
      stage.appendChild(left);

      const right = renderVerdict(state, w.items.length);
      stage.appendChild(right);
      block.appendChild(stage);

      if (state.done) {
        const restart = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Reset']);
        restart.addEventListener('click', reset);
        const controls = el('div', { class: 'widget-controls' });
        controls.appendChild(restart);
        block.appendChild(controls);
        saveScore(module, state.results.filter(r => r.right).length, w.items.length);
      }

      mount.appendChild(block);
    }

    function answer(chosenId) {
      const item = state.items[state.idx];
      const right = item.answer === chosenId;
      const chosenBucket = buckets.find(b => b.id === chosenId);
      const correctBucket = buckets.find(b => b.id === item.answer);
      state.results.push({
        right,
        why: item.why,
        cite: item.cite,
        chose: chosenBucket?.label,
        correct: correctBucket?.label
      });
      if (state.idx + 1 >= state.items.length) state.done = true;
      else state.idx += 1;
      build();
    }

    function reset() {
      state.items = shuffle(w.items.slice());
      state.idx = 0; state.results = []; state.done = false;
      build();
    }

    function renderVerdict(state, total) {
      const last = state.results[state.results.length - 1];
      const right = el('div', { class: 'widget-verdict-card' });
      if (state.done) {
        const correctCount = state.results.filter(r => r.right).length;
        right.className = 'widget-verdict-card ' + (correctCount === total ? 'right' : '');
        right.appendChild(el('span', { class: 'wv-label' }, ['Result']));
        right.appendChild(el('div', { class: 'wv-state' }, [`${correctCount} of ${total} correct`]));
        right.appendChild(el('p', { class: 'wv-why' }, [
          correctCount === total
            ? 'Perfect — you can place each feature into the right tier. Take the knowledge check below.'
            : 'Have another read above, then retry. The classifier is practice, not assessment.'
        ]));
        right.appendChild(pipBar(state.results, total));
      } else if (last) {
        right.className = 'widget-verdict-card ' + (last.right ? 'right' : 'wrong');
        right.appendChild(el('span', { class: 'wv-label' }, [last.right ? '✓ Correct tier' : '✗ Wrong tier']));
        right.appendChild(el('div', { class: 'wv-state' },
          [last.right ? `Yes — ${last.chose}.` : `You picked ${last.chose} · correct is ${last.correct}.`]));
        right.appendChild(el('p', { class: 'wv-why' }, [last.why]));
        if (last.cite) right.appendChild(el('span', { class: 'wv-cite' }, [`See: ${last.cite}`]));
        right.appendChild(pipBar(state.results, total));
      } else {
        right.className = 'widget-verdict-card idle';
        right.appendChild(idleSvg());
        right.appendChild(el('div', { class: 'wv-state' }, ['Pick a tier. Feedback appears here.']));
      }
      return right;
    }

    build();
  }

  /* ──────────────────────────────────────────────────────────
     FLOWCHART — branching decision tree (M4)
  ────────────────────────────────────────────────────────── */
  function mountFlowchart(mount, module, w) {
    const state = { current: w.start, path: [] };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block flow-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Run a task through the <em>decision flow</em>.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      // Breadcrumb path
      if (state.path.length) {
        const trail = el('div', { class: 'flow-trail' });
        state.path.forEach(p => {
          trail.appendChild(el('span', { class: 'flow-trail-step' }, [p.choice]));
        });
        block.appendChild(trail);
      }

      const node = w.nodes[state.current];
      if (!node) {
        block.appendChild(el('p', {}, ['Configuration error: missing node ' + state.current]));
        mount.appendChild(block); return;
      }

      const card = el('article', { class: 'flow-card ' + (node.leaf ? 'leaf ' + (node.outcome || '') : '') });
      if (node.leaf) {
        card.appendChild(flowLeafSvg(node.outcome));
        card.appendChild(el('span', { class: 'flow-leaf-label' }, [node.outcomeLabel || 'Recommended outcome']));
        card.appendChild(el('h3', { class: 'flow-leaf-h' }, [node.title]));
        card.appendChild(el('p', { class: 'flow-leaf-body' }, htmlNodes(node.body)));
        if (node.cite) card.appendChild(el('span', { class: 'flow-cite' }, [`See: ${node.cite}`]));
        const restart = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Start over']);
        restart.addEventListener('click', () => { state.current = w.start; state.path = []; build(); });
        const controls = el('div', { class: 'widget-controls' });
        controls.appendChild(restart);
        card.appendChild(controls);
        saveScore(module, state.path.length, state.path.length, 'flowchart-leaf-' + state.current);
      } else {
        card.appendChild(el('span', { class: 'flow-q-num' }, [`Question ${state.path.length + 1}`]));
        card.appendChild(el('h3', { class: 'flow-q-text' }, [node.q]));
        if (node.help) card.appendChild(el('p', { class: 'flow-q-help' }, [node.help]));
        const branches = el('div', { class: 'flow-branches' });
        node.branches.forEach(b => {
          const btn = el('button', { type: 'button', class: 'flow-branch-btn' }, [
            el('span', { class: 'flow-branch-label' }, [b.label]),
            b.hint ? el('span', { class: 'flow-branch-hint' }, [b.hint]) : null
          ].filter(Boolean));
          btn.addEventListener('click', () => {
            state.path.push({ from: state.current, choice: b.label });
            state.current = b.next;
            build();
          });
          branches.appendChild(btn);
        });
        card.appendChild(branches);
      }
      block.appendChild(card);
      mount.appendChild(block);
    }
    build();
  }

  /* ──────────────────────────────────────────────────────────
     MULTISELECT — pick N of K (M5 two-source rule)
  ────────────────────────────────────────────────────────── */
  function mountMultiselect(mount, module, w) {
    const state = { picked: new Set(), submitted: false };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block ms-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Pick the <em>real</em> sources.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      const claim = el('div', { class: 'ms-claim' });
      claim.appendChild(el('span', { class: 'ms-claim-label' }, ['The AI said:']));
      claim.appendChild(el('blockquote', { class: 'ms-claim-text' }, [w.claim]));
      block.appendChild(claim);

      const target = w.target || 2;
      block.appendChild(el('p', { class: 'ms-instruction' }, [`Pick the ${target} sources that count as real verification.`]));

      const list = el('ul', { class: 'ms-options', role: 'group', 'aria-label': 'Candidate sources' });
      w.options.forEach((opt, i) => {
        const li = el('li');
        const checked = state.picked.has(i);
        let cls = 'ms-option';
        if (state.submitted) {
          if (checked && opt.isCorrect) cls += ' correct';
          else if (checked && !opt.isCorrect) cls += ' wrong';
          else if (!checked && opt.isCorrect) cls += ' missed';
        } else if (checked) cls += ' picked';

        const btn = el('button', { type: 'button', class: cls, role: 'checkbox', 'aria-checked': checked ? 'true' : 'false' }, [
          el('span', { class: 'ms-tick', 'aria-hidden': 'true' }, [checked ? '✓' : '']),
          el('span', { class: 'ms-option-text' }, [opt.label]),
          state.submitted ? el('span', { class: 'ms-option-why' }, [opt.why]) : null
        ].filter(Boolean));
        if (!state.submitted) {
          btn.addEventListener('click', () => {
            if (checked) state.picked.delete(i);
            else if (state.picked.size < target) state.picked.add(i);
            build();
          });
        }
        li.appendChild(btn);
        list.appendChild(li);
      });
      block.appendChild(list);

      const controls = el('div', { class: 'widget-controls' });
      if (!state.submitted) {
        const submit = el('button', { class: 'widget-btn', type: 'button' }, [`Submit my ${target} sources →`]);
        submit.disabled = state.picked.size !== target;
        submit.addEventListener('click', () => {
          state.submitted = true;
          build();
          const totalCorrect = w.options.filter(o => o.isCorrect).length;
          const pickedCorrect = Array.from(state.picked).filter(i => w.options[i].isCorrect).length;
          saveScore(module, pickedCorrect, totalCorrect, 'multiselect');
        });
        controls.appendChild(submit);
      } else {
        const totalCorrect = w.options.filter(o => o.isCorrect).length;
        const pickedCorrect = Array.from(state.picked).filter(i => w.options[i].isCorrect).length;
        const verdict = el('div', { class: 'ms-verdict ' + (pickedCorrect === totalCorrect && state.picked.size === totalCorrect ? 'right' : 'wrong') });
        verdict.appendChild(el('span', { class: 'ms-verdict-label' }, [pickedCorrect === totalCorrect && state.picked.size === totalCorrect ? '✓ Both correct' : `✗ ${pickedCorrect} of ${totalCorrect} correct`]));
        verdict.appendChild(el('p', {}, [pickedCorrect === totalCorrect ? 'You picked the independent, primary-source verifiers. That is the two-source rule in practice.' : 'Re-read the green-card list of "counts as a real second source" in the module, then retry.']));
        controls.appendChild(verdict);
        const retry = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Try again']);
        retry.addEventListener('click', () => { state.picked = new Set(); state.submitted = false; build(); });
        controls.appendChild(retry);
      }
      block.appendChild(controls);
      mount.appendChild(block);
    }
    build();
  }

  /* ──────────────────────────────────────────────────────────
     SCENARIO — multi-step picker (M6 callback)
  ────────────────────────────────────────────────────────── */
  function mountScenario(mount, module, w) {
    const state = { step: 0, answers: [], done: false };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block sc-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Work the <em>scenario</em>.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      const intro = el('div', { class: 'sc-intro' });
      intro.appendChild(phoneSvg());
      intro.appendChild(el('div', { class: 'sc-intro-body' }, htmlNodes(w.intro || '')));
      block.appendChild(intro);

      if (state.done) {
        const score = state.answers.filter(a => a.right).length;
        const total = w.steps.length;
        const end = el('div', { class: 'sc-end ' + (score === total ? 'pass' : 'fail') });
        end.appendChild(el('div', { class: 'sc-score' }, [`${score} / ${total}`]));
        end.appendChild(el('p', {}, [score === total ? 'You walked the scenario by the callback principle. Now do that on a real Tuesday.' : 'Have another read of the callback principle above, then retry the scenario.']));
        const replay = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Replay scenario']);
        replay.addEventListener('click', () => { state.step = 0; state.answers = []; state.done = false; build(); });
        end.appendChild(replay);
        block.appendChild(end);
        saveScore(module, score, total, 'scenario');
      } else {
        const step = w.steps[state.step];
        const wrap = el('div', { class: 'sc-step' });
        wrap.appendChild(el('span', { class: 'sc-step-num' }, [`Step ${state.step + 1} of ${w.steps.length}`]));
        wrap.appendChild(el('div', { class: 'sc-step-prompt' }, htmlNodes(step.prompt)));

        const last = state.answers[state.step];
        const opts = el('div', { class: 'sc-options' });
        step.options.forEach((opt, i) => {
          let cls = 'sc-opt';
          if (last) {
            if (last.chosen === i && opt.correct) cls += ' right';
            else if (last.chosen === i && !opt.correct) cls += ' wrong';
            else if (opt.correct) cls += ' show-correct';
          }
          const btn = el('button', { type: 'button', class: cls }, [el('span', {}, [opt.label])]);
          if (last) btn.disabled = true;
          else btn.addEventListener('click', () => {
            state.answers[state.step] = { chosen: i, right: !!opt.correct };
            build();
          });
          opts.appendChild(btn);
        });
        wrap.appendChild(opts);

        if (last) {
          const opt = step.options[last.chosen];
          const fb = el('div', { class: 'sc-fb ' + (last.right ? 'right' : 'wrong') });
          fb.appendChild(el('span', { class: 'sc-fb-label' }, [last.right ? '✓ Correct response' : '✗ Risky response']));
          fb.appendChild(el('p', {}, htmlNodes(opt.why || '')));
          if (opt.cite) fb.appendChild(el('span', { class: 'sc-cite' }, [`See: ${opt.cite}`]));
          const lastStep = state.step === w.steps.length - 1;
          const next = el('button', { class: 'widget-btn', type: 'button' }, [lastStep ? 'See your score →' : `Continue → step ${state.step + 2}`]);
          next.addEventListener('click', () => {
            if (lastStep) { state.done = true; build(); }
            else { state.step += 1; build(); }
          });
          fb.appendChild(next);
          wrap.appendChild(fb);
        }
        block.appendChild(wrap);
      }
      mount.appendChild(block);
    }
    build();
  }

  /* ──────────────────────────────────────────────────────────
     FORM — fillable log card (M9)
  ────────────────────────────────────────────────────────── */
  function mountForm(mount, module, w) {
    const state = { values: {}, submitted: false };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block form-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Fill the <em>log card</em>.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      if (w.scenario) {
        const sc = el('div', { class: 'form-scenario' });
        sc.appendChild(el('span', { class: 'form-scenario-label' }, ['The scenario']));
        sc.appendChild(el('p', {}, htmlNodes(w.scenario)));
        block.appendChild(sc);
      }

      const card = el('div', { class: 'form-card' });
      card.appendChild(logCardSvg());
      const grid = el('div', { class: 'form-grid' });
      w.fields.forEach(f => {
        const wrap = el('label', { class: 'form-field', for: 'f-' + module + '-' + f.id });
        wrap.appendChild(el('span', { class: 'form-label' }, [
          el('span', {}, [f.label]),
          f.required ? el('span', { class: 'form-req' }, ['required']) : null
        ].filter(Boolean)));
        const input = f.multiline
          ? el('textarea', { id: 'f-' + module + '-' + f.id, rows: '2', placeholder: f.placeholder || '', 'aria-required': f.required ? 'true' : 'false' })
          : el('input', { id: 'f-' + module + '-' + f.id, type: 'text', placeholder: f.placeholder || '', 'aria-required': f.required ? 'true' : 'false' });
        input.value = state.values[f.id] || '';
        input.disabled = state.submitted;
        input.addEventListener('input', (e) => { state.values[f.id] = e.target.value; });
        const minLen = f.minLength || 3;
        if (state.submitted) {
          const v = (state.values[f.id] || '').trim();
          if (f.required && v.length < minLen) wrap.classList.add('missing');
          else wrap.classList.add('ok');
        }
        wrap.appendChild(input);
        grid.appendChild(wrap);
      });
      card.appendChild(grid);
      block.appendChild(card);

      const controls = el('div', { class: 'widget-controls' });
      if (!state.submitted) {
        const submit = el('button', { class: 'widget-btn', type: 'button' }, ['Submit log entry →']);
        submit.addEventListener('click', () => { state.submitted = true; build(); });
        controls.appendChild(submit);
      } else {
        const filled = w.fields.filter(f => {
          const v = (state.values[f.id] || '').trim();
          const minLen = f.minLength || 3;
          return v.length >= minLen;
        }).length;
        const total = w.fields.length;
        const verdict = el('div', { class: 'form-verdict ' + (filled === total ? 'right' : 'partial') });
        verdict.appendChild(el('span', { class: 'form-verdict-label' }, [filled === total ? '✓ Audit-ready' : `${filled} of ${total} fields filled`]));
        verdict.appendChild(el('p', {}, [filled === total ? 'That is the audit-ready minimum log entry the module describes. Save the format somewhere you can copy.' : 'Each required field is part of what an auditor or DPO will ask for. Fill the missing ones in red.']));
        controls.appendChild(verdict);
        const retry = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Reset']);
        retry.addEventListener('click', () => { state.values = {}; state.submitted = false; build(); });
        controls.appendChild(retry);
        saveScore(module, filled, total, 'form');
      }
      block.appendChild(controls);
      mount.appendChild(block);
    }
    build();
  }

  /* ──────────────────────────────────────────────────────────
     ORDER — reorder list (M10 72-hr timeline)
  ────────────────────────────────────────────────────────── */
  function mountOrder(mount, module, w) {
    // events come in canonical order; shuffle for display
    const shuffled = shuffle(w.events.map((e, i) => ({ ...e, _canonical: i })));
    const state = { order: shuffled, submitted: false };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block order-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Order the <em>72-hour clock</em>.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      if (w.intro) {
        const intro = el('div', { class: 'order-intro' });
        intro.appendChild(el('p', {}, htmlNodes(w.intro)));
        block.appendChild(intro);
      }

      const stage = el('ol', { class: 'order-list', 'aria-label': 'Reorder these events' });
      state.order.forEach((ev, i) => {
        let cls = 'order-item';
        if (state.submitted) cls += ev._canonical === i ? ' right' : ' wrong';
        const li = el('li', { class: cls });
        li.appendChild(el('span', { class: 'order-num' }, [String(i + 1)]));
        li.appendChild(el('span', { class: 'order-label' }, [ev.label]));
        if (!state.submitted) {
          const ctrls = el('span', { class: 'order-ctrls' });
          const up = el('button', { type: 'button', class: 'order-arrow', 'aria-label': 'Move up' }, ['↑']);
          const down = el('button', { type: 'button', class: 'order-arrow', 'aria-label': 'Move down' }, ['↓']);
          up.disabled = i === 0; down.disabled = i === state.order.length - 1;
          up.addEventListener('click', () => move(i, -1));
          down.addEventListener('click', () => move(i, +1));
          ctrls.appendChild(up); ctrls.appendChild(down);
          li.appendChild(ctrls);
        } else if (ev._canonical !== i) {
          li.appendChild(el('span', { class: 'order-correct-note' }, [`should be #${ev._canonical + 1}`]));
        }
        stage.appendChild(li);
      });
      block.appendChild(stage);

      const controls = el('div', { class: 'widget-controls' });
      if (!state.submitted) {
        const submit = el('button', { class: 'widget-btn', type: 'button' }, ['Check my order →']);
        submit.addEventListener('click', () => { state.submitted = true; build(); });
        controls.appendChild(submit);
      } else {
        const correct = state.order.filter((ev, i) => ev._canonical === i).length;
        const total = state.order.length;
        const verdict = el('div', { class: 'order-verdict ' + (correct === total ? 'right' : 'partial') });
        verdict.appendChild(el('span', { class: 'order-verdict-label' }, [correct === total ? '✓ Sequence correct' : `${correct} of ${total} in the right slot`]));
        verdict.appendChild(el('p', {}, [correct === total ? 'You walked the 72-hour clock in the right order. Save the sequence.' : 'Items above show where each should sit. Try again — sequence matters for the breach clock.']));
        controls.appendChild(verdict);
        const retry = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Reshuffle and retry']);
        retry.addEventListener('click', () => {
          state.order = shuffle(w.events.map((e, i) => ({ ...e, _canonical: i })));
          state.submitted = false; build();
        });
        controls.appendChild(retry);
        saveScore(module, correct, total, 'order');
      }
      block.appendChild(controls);
      mount.appendChild(block);
    }

    function move(i, dir) {
      const j = i + dir;
      if (j < 0 || j >= state.order.length) return;
      const arr = state.order.slice();
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      state.order = arr;
      build();
    }
    build();
  }

  /* ──────────────────────────────────────────────────────────
     TICKLIST — wallet-card style checks (M11)
  ────────────────────────────────────────────────────────── */
  function mountTicklist(mount, module, w) {
    const state = { ticked: new Set(), submitted: false };

    function build() {
      mount.innerHTML = '';
      const block = el('section', { class: 'widget-block tick-block', 'aria-labelledby': 'w-h-' + module });
      block.appendChild(el('span', { class: 'widget-eyebrow' }, [w.eyebrow || 'Interactive · Demonstrate understanding']));
      block.appendChild(el('h2', { class: 'widget-title', id: 'w-h-' + module }, htmlNodes(w.title || 'Tick the <em>wallet card</em>.')));
      if (w.lede) block.appendChild(el('p', { class: 'widget-lede' }, [w.lede]));

      if (w.scenario) {
        const sc = el('div', { class: 'tick-scenario' });
        sc.appendChild(el('span', { class: 'tick-scenario-label' }, ['The scenario']));
        sc.appendChild(el('p', {}, htmlNodes(w.scenario)));
        block.appendChild(sc);
      }

      const list = el('ul', { class: 'tick-list', role: 'group', 'aria-label': 'Pre-submit checklist' });
      w.checks.forEach((c, i) => {
        const ticked = state.ticked.has(i);
        let cls = 'tick-item';
        if (state.submitted) {
          const correct = ticked === c.shouldTick;
          cls += correct ? ' right' : ' wrong';
        } else if (ticked) cls += ' ticked';
        const li = el('li', { class: cls });
        const btn = el('button', { type: 'button', class: 'tick-btn', role: 'checkbox', 'aria-checked': ticked ? 'true' : 'false' }, [
          el('span', { class: 'tick-box', 'aria-hidden': 'true' }, [ticked ? '✓' : '']),
          el('div', { class: 'tick-body' }, [
            el('strong', {}, [c.label]),
            c.hint ? el('span', { class: 'tick-hint' }, [c.hint]) : null,
            state.submitted ? el('span', { class: 'tick-why' }, [c.why]) : null
          ].filter(Boolean))
        ]);
        if (!state.submitted) {
          btn.addEventListener('click', () => {
            if (ticked) state.ticked.delete(i);
            else state.ticked.add(i);
            build();
          });
        } else btn.disabled = true;
        li.appendChild(btn);
        list.appendChild(li);
      });
      block.appendChild(list);

      const controls = el('div', { class: 'widget-controls' });
      if (!state.submitted) {
        const submit = el('button', { class: 'widget-btn', type: 'button' }, ['Check my ticks →']);
        submit.addEventListener('click', () => { state.submitted = true; build(); });
        controls.appendChild(submit);
      } else {
        const correct = w.checks.filter((c, i) => state.ticked.has(i) === !!c.shouldTick).length;
        const total = w.checks.length;
        const verdict = el('div', { class: 'tick-verdict ' + (correct === total ? 'right' : 'partial') });
        verdict.appendChild(el('span', { class: 'tick-verdict-label' }, [correct === total ? '✓ All-six pass' : `${correct} of ${total} matched`]));
        verdict.appendChild(el('p', {}, [correct === total ? 'You walked the wallet card against a real scenario. Pin it next to your screen.' : 'Items above show where you disagreed with the checklist. Re-read those lines, then retry.']));
        controls.appendChild(verdict);
        const retry = el('button', { class: 'widget-btn ghost', type: 'button' }, ['↺ Reset and retry']);
        retry.addEventListener('click', () => { state.ticked = new Set(); state.submitted = false; build(); });
        controls.appendChild(retry);
        saveScore(module, correct, total, 'ticklist');
      }
      block.appendChild(controls);
      mount.appendChild(block);
    }
    build();
  }

  /* ──────────────────────────────────────────────────────────
     SHARED HELPERS
  ────────────────────────────────────────────────────────── */
  function saveScore(module, score, total, kind) {
    try {
      localStorage.setItem(LS_PREFIX + module, JSON.stringify({
        score, total, kind: kind || 'widget', t: new Date().toISOString()
      }));
    } catch (e) { /* private mode */ }
  }

  function pipBar(results, total) {
    const bar = el('div', { class: 'widget-bar' });
    for (let i = 0; i < total; i++) {
      let cls = 'pip';
      if (results[i]) cls += results[i].right ? ' right' : ' wrong';
      bar.appendChild(el('span', { class: cls }));
    }
    return bar;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (attrs[k] == null) continue;
      if (k === 'class') node.className = attrs[k];
      else if (k === 'value') node.value = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (children) children.forEach(c => {
      if (c == null) return;
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  function htmlNodes(str) {
    const tmp = document.createElement('div');
    tmp.innerHTML = String(str)
      .replace(/&(?!#?\w+;)/g, '&amp;')
      .replace(/<(?!\/?(em|strong|code|br)\b)/g, '&lt;');
    return Array.from(tmp.childNodes);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ── Inline SVGs ── */
  function bucketSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'widget-bg-svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g fill="none" stroke="#c9d4e3" stroke-width="2.5"><rect x="30" y="60" width="35" height="100" rx="3"/><rect x="75" y="80" width="35" height="80" rx="3"/><rect x="120" y="100" width="35" height="60" rx="3"/><rect x="165" y="120" width="35" height="40" rx="3"/></g>';
    return svg;
  }
  function flowLeafSvg(outcome) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'flow-leaf-svg');
    svg.setAttribute('viewBox', '0 0 64 64');
    svg.setAttribute('aria-hidden', 'true');
    const colour = outcome === 'green' ? '#1ab86a' : outcome === 'red' ? '#e03e3e' : '#c9d4e3';
    svg.innerHTML = `<g fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="26"/><path d="M20 32 l8 8 l16 -16"/></g>`;
    return svg;
  }
  function phoneSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'sc-icon-svg');
    svg.setAttribute('viewBox', '0 0 64 64');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g fill="none" stroke="#c9d4e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18 c0 -3 3 -6 6 -6 l4 0 c2 0 4 1 5 3 l4 7 c1 2 0 4 -1 5 l-3 3 c2 5 7 10 12 12 l3 -3 c1 -1 3 -2 5 -1 l7 4 c2 1 3 3 3 5 l0 4 c0 3 -3 6 -6 6 c-21 0 -39 -18 -39 -39 z"/></g>';
    return svg;
  }
  function logCardSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'widget-bg-svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g fill="none" stroke="#c9d4e3" stroke-width="2.5"><rect x="30" y="30" width="140" height="160" rx="6"/><line x1="50" y1="60" x2="150" y2="60"/><line x1="50" y1="85" x2="150" y2="85"/><line x1="50" y1="110" x2="150" y2="110"/><line x1="50" y1="135" x2="150" y2="135"/><line x1="50" y1="160" x2="120" y2="160"/></g>';
    return svg;
  }
  function idleSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wv-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="50" cy="50" r="35"/><path d="M50 32 v22 l14 10"/></g>';
    return svg;
  }
})();
