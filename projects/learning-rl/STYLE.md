# Learning RL: authoring guide

A 100-lesson interactive course on reinforcement learning. Each lesson is one idea, one or two
interactives, the maths, and a short quiz. Lessons 1–9 are the reference implementation.
**Read `5/index.html`, `6/index.html` and `8/index.html` before writing a lesson.**

## Files

```
projects/learning-rl/
  index.html            course home (built from lessons.js; don't edit per lesson)
  assets/lessons.js     titles, units and readings for all 100 lessons (source of truth)
  assets/course.js      shared engine: shell, quiz, maths, charts, grids, randomness
  assets/course.css     shared styles
  N/index.html          lesson N (N = 1..100), fully self-contained apart from the assets
  tools/check.mjs       automated checks (run before you finish)
```

The curriculum, including what each lesson's interactive and key equation should be, is in
`/rl-100-days.md` at the repo root. Its "Day" numbers are lesson numbers. Titles come from
`lessons.js`, not the plan.

## Page skeleton

Copy the `<head>`, the site `<header>`, and the hook elements exactly from `5/index.html`. Then:

- `<body data-lesson="N">`
- `<title>N. Title | Learning RL</title>` and a one-sentence `<meta name="description">`
- `<p id="crumbs"></p>`, `<h1>`, `<p class="lede">` (1–3 sentences)
- one or more `<section class="card">` with the interactive(s); use `<div class="sub">` for a second part
- `<section class="card maths"><h2>The maths</h2>…</section>`
- `<section class="card" id="quiz"></section>`
- `<p id="read"></p> <nav id="pager"></nav> <nav id="progress"></nav>`
- one `<script type="module">` at the end of `<body>`
- page-specific CSS in a `<style>` in the head; reuse course.css classes first

## The Course API (window.Course)

| Call | Use |
|---|---|
| `Course.quiz([...])` | builds the quiz. Each item: `{ q, answer, tol?, hint?, explain }` or `{ q, choices: [...], answer: index, explain }` |
| `Course.tex(el, src, display?)` | render TeX into an element (anything updated live) |
| `Course.renderMath(el)` | render `$...$` inside HTML you inserted |
| `Course.fmt(x, dp)` | number → string (integers stay integers) |
| `Course.slider('#id', format, onInput)` | wire a range input to its `<output>`; returns a getter |
| `Course.lineChart(canvas, {xLabel, yLabel, yMin, yMax, xMin, xMax})` | returns `{ draw(series, {hlines, vlines}) }`; series = `{data, color, label, dashed, width, dots}` |
| `Course.grid(el, rows, cols, paint)` | gridworld; returns `{ update(), cell(r,c), onClick(fn) }` |
| `Course.heat(v, max)` | value → green (+) / red (−) background |
| `Course.bandit(k)` | 10-armed testbed: `{ q, best, pull(a) }` |
| `Course.gauss() rand() randInt(n) choice(xs) shuffle(xs) sample(probs) argmax(xs) beta(a,b)` | randomness (argmax breaks ties randomly) |
| `Course.colors` | `green blue amber red purple grey`. Green = the agent / main quantity, amber = true values, blue = estimates/samples, grey = baselines |

Markup helpers in course.css: `.row`, `.spacer`, `.stats/.stat/.k/.v`, `.status`, `.note`,
`.world/.cell` (1-D worlds), `.bars/.bar/.axis` (div bar charts), `canvas.chart`, `table.data`,
`button.primary / .quiet / .on`, `label.slider`.

Static `$maths$` in the HTML is rendered automatically. Maths inserted by JS must go through
`Course.tex` or `Course.renderMath`. In JS strings, escape backslashes: `'$\\gamma$'`.

## Voice

This is a course, not a blog. No "I", no "we", no "let's". Address the reader as "you" only in
instructions for the interactive.

- Short sentences. Plain words. One idea per paragraph.
- Define every symbol the first time it appears.
- No filler or hype. Banned: "dive", "delve", "journey", "unlock", "powerful", "crucial",
  "fundamental", "it's important to note", "in essence", "simply put", "imagine a world",
  "game-changer", "magic", "beautiful", rhetorical questions as openers, exclamation marks.
- No em dashes. Use a colon, comma, full stop or brackets.
- Lede: what the idea is and why it matters, in 1–3 sentences. No preamble.
- Buttons are verbs: "Run", "Step", "Reset", "New bandit", "Run comparison".

## Interactives

- The reader should be able to *do* something within a second of landing: click, drag, step.
- Prefer direct manipulation (click cells, drag sliders) to forms.
- Show the maths live. When a number changes, show the equation with the numbers in it
  (see the update line in lesson 6 and the sums in lesson 2).
- Reuse the course's worlds so lessons connect: the corridor (L1), coin & gem (L2, L4),
  restaurants (L3), the 10-armed testbed (L5–9), gridworlds (from L18), tic-tac-toe (L42).
  Mention earlier lessons by number ("Lesson 7's step size").
- A "Run" button toggles to "Pause". Long simulations go inside `setTimeout(..., 30)` behind a
  button that reads "Running…" while busy (see L8's comparison).
- Where a classic textbook figure exists, reproduce it live and cite it ("S&B Figure 2.3").
- Everything must work at 390px wide with no horizontal page scroll. Wide equations sit in
  `$$...$$` (they scroll inside themselves). Use `aligned` to break long derivations.
- Light theme only (matches the site). No external libraries beyond KaTeX.

## Maths

- Use Sutton & Barto (2nd ed.) notation: $S_t, A_t, R_{t+1}, G_t, \gamma, \alpha, \varepsilon,
  \pi(a \mid s), v_\pi, q_\pi, v_*, q_*, Q, V, \theta, \mathbf{w}, \delta_t, \lambda$.
- Be correct. Derive results rather than assert them when a derivation fits in 2–4 lines.
- State assumptions (e.g. "with $\gamma < 1$").
- Every equation is followed by a plain-language sentence saying what it means.

## Quiz

- 3–4 questions. At least two must need a calculation with a numeric answer.
- Compute answers in JS (`answer: 5 * Math.pow(0.9, 3)`) rather than typing rounded decimals.
- Set `tol` when the answer is irrational or rounding is expected. Integers: `tol: 0` if exact.
- `explain` shows the working in one line. `hint` nudges without giving the answer.
- Conceptual questions use `choices`, with plausible wrong answers.
- Questions should be answerable by using the interactive or the maths card.

## Checking

With the site served (`bundle exec jekyll serve` from the repo root, port 4000):

```
node projects/learning-rl/tools/check.mjs 10 11 12 --shots /path/to/scratch/shots
```

Fix every FAIL. Then look at the phone and desktop screenshots yourself: layout, readability,
whether the interactive makes the idea obvious.
