// course.js: the shared shell for every Learning RL page.
//
// Load order (all in <head>, all `defer`): katex, auto-render, lessons.js, course.js.
// Lesson scripts are inline `<script type="module">` at the end of <body>, so they
// run after this file and can use `Course` directly.
//
// A lesson page sets <body data-lesson="N"> and leaves these empty hooks:
//   #crumbs  #read  #quiz  #pager  #progress
// This file fills them, renders all static $maths$, and exposes `window.Course`.

(function () {
  const LESSONS = window.RL_LESSONS;
  const UNITS = window.RL_UNITS;
  const ROOT = '/projects/learning-rl/';
  const LIVE = window.RL_LIVE ?? LESSONS.length;
  const STORE = 'learning-rl:done';
  const $ = (sel, el = document) => el.querySelector(sel);

  // ---------------------------------------------------------------- progress

  function loadDone() {
    try { return new Set(JSON.parse(localStorage.getItem(STORE) || '[]')); }
    catch { return new Set(); }
  }
  function markDone(n) {
    const done = loadDone();
    done.add(n);
    try { localStorage.setItem(STORE, JSON.stringify([...done])); } catch { /* private mode */ }
    renderProgress(n);
  }

  // ---------------------------------------------------------------- maths

  function renderMath(el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
  }

  // Render TeX into an element. Use this for anything a lesson updates live.
  function tex(el, src, display = false) {
    if (window.katex) katex.render(src, el, { throwOnError: false, displayMode: display });
    else el.textContent = src;
  }

  // Format a number for display: integers stay integers, others get `dp` decimals.
  function fmt(x, dp = 2) {
    if (!isFinite(x)) return x > 0 ? '\\infty' : x < 0 ? '-\\infty' : '?';
    return Number.isInteger(x) ? String(x) : x.toFixed(dp);
  }

  // ---------------------------------------------------------------- shell

  const lessonUrl = (n) => `${ROOT}${n}/`;
  const unitOf = (n) => UNITS.find((u) => u.n === LESSONS.find((l) => l.n === n).unit);

  function renderShell(n) {
    const lesson = LESSONS.find((l) => l.n === n);
    const unit = unitOf(n);
    document.title = `${lesson.n}. ${lesson.title} | Learning RL`;

    const crumbs = $('#crumbs');
    if (crumbs) {
      crumbs.innerHTML = `<a href="${ROOT}">Learning RL</a> · Unit ${unit.n}: ${unit.title} · Lesson ${n} of ${LESSONS.length}`;
    }

    const read = $('#read');
    if (read) read.innerHTML = `<b>Further reading:</b> ${lesson.read}`;

    const pager = $('#pager');
    if (pager) {
      const prev = LESSONS.find((l) => l.n === n - 1);
      const next = LESSONS.find((l) => l.n === n + 1 && l.n <= LIVE);
      pager.innerHTML =
        (prev ? `<a href="${lessonUrl(prev.n)}"><small>← Lesson ${prev.n}</small>${prev.title}</a>` : '<span></span>') +
        (next ? `<a class="next" href="${lessonUrl(next.n)}"><small>Lesson ${next.n} →</small>${next.title}</a>` : '<span></span>');
    }
    renderProgress(n);
  }

  // A strip of 100 squares in 20 groups of 5: done, current, or to do.
  function renderProgress(current) {
    const el = $('#progress');
    if (!el) return;
    const done = loadDone();
    el.innerHTML = UNITS.map((u) => {
      const sq = LESSONS.filter((l) => l.unit === u.n).map((l) => {
        const cls = ['sq', done.has(l.n) && 'done', l.n === current && 'current'].filter(Boolean).join(' ');
        return l.n <= LIVE
          ? `<a class="${cls}" href="${lessonUrl(l.n)}" title="${l.n}. ${l.title}"></a>`
          : `<span class="${cls} soon" title="${l.n}. ${l.title} (coming soon)"></span>`;
      }).join('');
      return `<span class="unit" title="Unit ${u.n}: ${u.title}">${sq}</span>`;
    }).join('');
    const count = LESSONS.filter((l) => done.has(l.n)).length;
    el.insertAdjacentHTML('beforeend', `<span class="count">${count} / ${LESSONS.length} complete</span>`);
  }

  // ---------------------------------------------------------------- quiz
  //
  // Course.quiz([
  //   { q: 'What is $\\gamma^2$ when $\\gamma = 0.5$?', answer: 0.25, tol: 0.001,
  //     explain: '$0.5 \\times 0.5 = 0.25$.' },
  //   { q: 'Which is greedy?', choices: ['A', 'B'], answer: 1, explain: '...' },
  // ])
  //
  // Numeric answers accept decimals, fractions (1/3) and simple arithmetic (5*0.9^3).
  // `tol` defaults to 1% of the answer (min 0.01). Solving every question marks the lesson done.

  function parseNumber(s) {
    s = String(s).trim().replace(/×/g, '*').replace(/−/g, '-').replace(/\^/g, '**');
    if (!s || !/^[\d\s.+\-*/()e]+$/i.test(s)) return NaN;
    try { return Function(`"use strict"; return (${s});`)(); } catch { return NaN; }
  }

  function quiz(questions, el = $('#quiz')) {
    if (!el) return;
    const n = Number(document.body.dataset.lesson);
    const solved = new Array(questions.length).fill(false);
    quiz.questions = questions;   // read by tools/check.mjs

    el.innerHTML = '<h2>Check yourself</h2>';
    questions.forEach((item, i) => {
      const box = document.createElement('div');
      box.className = 'q';
      const id = `q${i}`;
      let input;
      if (item.choices) {
        input = item.choices.map((c, j) =>
          `<label class="choice"><input type="radio" name="${id}" value="${j}"> <span>${c}</span></label>`).join('');
      } else {
        input = `<input class="num" type="text" inputmode="decimal" autocomplete="off" placeholder="Your answer" aria-label="Answer to question ${i + 1}">`;
      }
      box.innerHTML = `
        <p class="qtext"><span class="qn">${i + 1}</span>${item.q}</p>
        <div class="qinput${item.choices ? ' choices' : ''}">${input}${item.choices ? '</div><div class="qinput">' : ''}<div class="row"><button class="check">Check</button><button class="quiet reveal" hidden>Show answer</button></div></div>
        <p class="feedback" aria-live="polite"></p>`;
      el.appendChild(box);

      const feedback = $('.feedback', box);
      const reveal = $('.reveal', box);

      function correctText() {
        return item.choices ? item.choices[item.answer] : fmt(item.answer, 3);
      }
      function show(ok, msg) {
        feedback.className = 'feedback ' + (ok ? 'ok' : 'no');
        feedback.innerHTML = msg;
        renderMath(feedback);
      }

      $('.check', box).addEventListener('click', () => {
        let ok;
        if (item.choices) {
          const picked = $(`input[name="${id}"]:checked`, box);
          if (!picked) return show(false, 'Pick an answer first.');
          ok = Number(picked.value) === item.answer;
        } else {
          const v = parseNumber($('.num', box).value);
          if (isNaN(v)) return show(false, 'Enter a number. Fractions like 1/3 work too.');
          const tol = item.tol ?? Math.max(0.01, Math.abs(item.answer) * 0.01);
          ok = Math.abs(v - item.answer) <= tol;
        }
        if (ok) {
          show(true, `✓ Correct. ${item.explain || ''}`);
          reveal.hidden = true;
          solved[i] = true;
          if (solved.every(Boolean)) {
            markDone(n);
            el.querySelector('.complete')?.remove();
            el.insertAdjacentHTML('beforeend', '<p class="complete">Lesson complete ✓</p>');
          }
        } else {
          show(false, `Not quite. ${item.hint || 'Try again, or use the interactive above to check.'}`);
          reveal.hidden = false;
        }
      });

      reveal.addEventListener('click', () => {
        show(true, `Answer: ${correctText()}. ${item.explain || ''}`);
        reveal.hidden = true;
      });

      $('.num', box)?.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('.check', box).click(); });
    });
    renderMath(el);
  }

  // ---------------------------------------------------------------- randomness

  const rand = Math.random;
  // Standard normal via Box–Muller.
  function gauss() { return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand()); }
  function randInt(n) { return Math.floor(rand() * n); }
  function choice(xs) { return xs[randInt(xs.length)]; }
  function shuffle(xs) {
    const a = xs.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = randInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  // Sample an index from a probability vector.
  function sample(probs) {
    let u = rand(), i = 0;
    for (; i < probs.length - 1; i++) { u -= probs[i]; if (u < 0) return i; }
    return i;
  }
  // argmax with random tie-breaking.
  function argmax(xs) {
    const top = Math.max(...xs);
    return choice(xs.map((x, i) => [x, i]).filter(([x]) => x === top).map(([, i]) => i));
  }
  // Gamma(k, 1) by Marsaglia–Tsang, then Beta(a, b) = X / (X + Y).
  function gamma(k) {
    if (k < 1) return gamma(k + 1) * Math.pow(rand(), 1 / k);
    const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (;;) {
      let x, v;
      do { x = gauss(); v = 1 + c * x; } while (v <= 0);
      v = v * v * v;
      const u = rand();
      if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
    }
  }
  function beta(a, b) { const x = gamma(a); return x / (x + gamma(b)); }

  // The k-armed testbed (S&B §2.3): true values q*(a) ~ N(0, 1), rewards ~ N(q*(a), 1).
  function bandit(k = 10) {
    const q = Array.from({ length: k }, gauss);
    return { k, q, best: q.indexOf(Math.max(...q)), pull: (a) => q[a] + gauss() };
  }

  // ---------------------------------------------------------------- colour

  const colors = {
    green: '#059669', blue: '#2a7ae2', amber: '#d97706', red: '#dc2626', purple: '#7c3aed', grey: '#9ca3af',
  };
  const series = [colors.green, colors.blue, colors.amber, colors.purple, colors.red, colors.grey];

  // Value → background colour. Positive is green, negative is red, 0 is white.
  // `max` is the magnitude that maps to full colour.
  function heat(v, max = 1) {
    const t = Math.max(-1, Math.min(1, v / (max || 1)));
    const mix = (a, b) => Math.round(255 + (a - 255) * Math.abs(t));
    return t >= 0 ? `rgb(${mix(5)},${mix(150)},${mix(105)})` : `rgb(${mix(220)},${mix(38)},${mix(38)})`;
  }

  // ---------------------------------------------------------------- charts
  //
  // const chart = Course.lineChart(canvas, { xLabel, yLabel, yMin, yMax, xMin, xMax });
  // chart.draw([{ data: [y0, y1, ...] or [[x, y], ...], color, label, dashed, width }],
  //            { hlines: [{ y, label, color }], vlines: [{ x, label, color }] });
  // Axes auto-fit to the data unless you pass min/max. Redraws on resize.

  function lineChart(canvas, opts = {}) {
    const ctx = canvas.getContext('2d');
    let last = null;

    function niceTicks(lo, hi, count = 5) {
      const span = hi - lo || 1;
      const step0 = span / count;
      const mag = Math.pow(10, Math.floor(Math.log10(step0)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) || 10 * mag;
      const ticks = [];
      for (let t = Math.ceil(lo / step) * step; t <= hi + step * 1e-9; t += step) ticks.push(+t.toFixed(10));
      return ticks;
    }

    function draw(lines, extra = {}) {
      last = [lines, extra];
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const pts = lines.map((l) => l.data.map((p, i) => (Array.isArray(p) ? p : [i, p])));
      const xs = pts.flat().map((p) => p[0]), ys = pts.flat().map((p) => p[1]).filter(isFinite);
      (extra.hlines || []).forEach((h) => ys.push(h.y));
      let x0 = opts.xMin ?? Math.min(...xs), x1 = opts.xMax ?? Math.max(...xs);
      let y0 = opts.yMin ?? Math.min(...ys), y1 = opts.yMax ?? Math.max(...ys);
      if (!isFinite(x0)) { x0 = 0; x1 = 1; }
      if (!isFinite(y0)) { y0 = 0; y1 = 1; }
      if (x1 === x0) x1 = x0 + 1;
      if (y1 === y0) { y0 -= 0.5; y1 += 0.5; }
      if (opts.yMin === undefined && opts.yMax === undefined) {
        const pad = (y1 - y0) * 0.08; y0 -= pad; y1 += pad;
      }

      const m = { l: 46, r: 12, t: 12, b: opts.xLabel ? 40 : 26 };
      const X = (x) => m.l + ((x - x0) / (x1 - x0)) * (W - m.l - m.r);
      const Y = (y) => H - m.b - ((y - y0) / (y1 - y0)) * (H - m.t - m.b);

      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#6b7280'; ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      niceTicks(y0, y1).forEach((t) => {
        ctx.beginPath(); ctx.moveTo(m.l, Y(t)); ctx.lineTo(W - m.r, Y(t)); ctx.stroke();
        ctx.fillText(+t.toPrecision(4), m.l - 6, Y(t));
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      niceTicks(x0, x1, Math.max(3, Math.floor(W / 80))).forEach((t) => ctx.fillText(+t.toPrecision(4), X(t), H - m.b + 6));
      if (opts.xLabel) ctx.fillText(opts.xLabel, (m.l + W - m.r) / 2, H - 14);
      if (opts.yLabel) {
        ctx.save(); ctx.translate(11, (m.t + H - m.b) / 2); ctx.rotate(-Math.PI / 2);
        ctx.textBaseline = 'middle'; ctx.fillText(opts.yLabel, 0, 0); ctx.restore();
      }

      ctx.save();
      ctx.beginPath(); ctx.rect(m.l, m.t, W - m.l - m.r, H - m.t - m.b); ctx.clip();
      (extra.hlines || []).forEach((h) => {
        ctx.strokeStyle = h.color || '#9ca3af'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(m.l, Y(h.y)); ctx.lineTo(W - m.r, Y(h.y)); ctx.stroke();
        if (h.label) { ctx.fillStyle = h.color || '#6b7280'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(h.label, W - m.r - 4, Y(h.y) - 2); }
      });
      (extra.vlines || []).forEach((v) => {
        ctx.strokeStyle = v.color || '#9ca3af'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(X(v.x), m.t); ctx.lineTo(X(v.x), H - m.b); ctx.stroke();
        if (v.label) { ctx.fillStyle = v.color || '#6b7280'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(v.label, X(v.x) + 4, m.t + 2); }
      });
      ctx.setLineDash([]);
      lines.forEach((l, k) => {
        const p = pts[k];
        ctx.strokeStyle = l.color || series[k % series.length];
        ctx.lineWidth = l.width || 2;
        ctx.setLineDash(l.dashed ? [6, 4] : []);
        ctx.beginPath();
        let pen = false;
        p.forEach(([x, y]) => {
          if (!isFinite(y)) { pen = false; return; }
          pen ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y));
          pen = true;
        });
        ctx.stroke();
        if (l.dots) {
          ctx.fillStyle = ctx.strokeStyle;
          p.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 3, 0, 2 * Math.PI); ctx.fill(); });
        }
      });
      ctx.restore();

      const labelled = lines.filter((l) => l.label);
      if (labelled.length) {
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        let lx = m.l + 8;
        lines.forEach((l, k) => {
          if (!l.label) return;
          ctx.fillStyle = l.color || series[k % series.length];
          ctx.fillRect(lx, m.t + 6, 12, 3);
          ctx.fillStyle = '#374151';
          ctx.fillText(l.label, lx + 16, m.t + 8);
          lx += 28 + ctx.measureText(l.label).width;
        });
      }
    }

    new ResizeObserver(() => last && draw(...last)).observe(canvas);
    return { draw };
  }

  // ---------------------------------------------------------------- gridworld
  //
  // const g = Course.grid(el, rows, cols, (r, c, cell) => { cell.textContent = ...; cell.style.background = ...; });
  // g.update();             re-run the painter for every cell
  // g.cell(r, c)            the cell's element
  // Cells are square, size with the container, and are clickable via g.onClick((r, c) => ...).

  function grid(el, rows, cols, paint) {
    el.classList.add('grid');
    el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    el.style.maxWidth = `${Math.min(cols * 64, 560)}px`;
    el.innerHTML = '';
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = document.createElement('div');
        d.className = 'gcell';
        d.dataset.r = r; d.dataset.c = c;
        el.appendChild(d);
        cells.push(d);
      }
    }
    let click = null;
    el.addEventListener('click', (e) => {
      const d = e.target.closest('.gcell');
      if (d && click) click(+d.dataset.r, +d.dataset.c);
    });
    const api = {
      cell: (r, c) => cells[r * cols + c],
      update() { cells.forEach((d) => { d.className = 'gcell'; d.removeAttribute('style'); paint(+d.dataset.r, +d.dataset.c, d); }); },
      onClick(fn) { click = fn; el.classList.add('clickable'); },
    };
    api.update();
    return api;
  }

  // ---------------------------------------------------------------- slider binding
  //
  // const read = Course.slider('#gamma', v => v.toFixed(2), update);
  // Wires an <input type=range> to the <output> next to it and calls `onInput` on change.
  // Returns a function that reads the current value as a number.

  function slider(sel, format = (v) => String(v), onInput = () => {}) {
    const input = typeof sel === 'string' ? $(sel) : sel;
    const out = input.parentElement.querySelector('output');
    const sync = () => { if (out) out.textContent = format(+input.value); };
    input.addEventListener('input', () => { sync(); onInput(+input.value); });
    sync();
    return () => +input.value;
  }

  // ---------------------------------------------------------------- boot

  window.Course = {
    lessons: LESSONS, units: UNITS, root: ROOT, live: LIVE,
    tex, fmt, renderMath, quiz, markDone, loadDone, renderProgress,
    rand, gauss, randInt, choice, shuffle, sample, argmax, beta, bandit,
    colors, series, heat, lineChart, grid, slider,
  };

  const n = Number(document.body.dataset.lesson);
  if (n) renderShell(n);
  renderMath(document.body);
})();
