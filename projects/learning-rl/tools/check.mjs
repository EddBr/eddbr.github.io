// check.mjs: automated checks for Learning RL lesson pages.
//
//   node projects/learning-rl/tools/check.mjs 5 6 7            # check lessons 5–7
//   node projects/learning-rl/tools/check.mjs 5 --shots DIR    # also save phone + desktop screenshots
//
// Needs the site served at http://localhost:4000 (bundle exec jekyll serve) and Google Chrome.
// For each lesson, at phone width (390px) and desktop width (1000px):
//   - no uncaught exceptions, console errors, failed requests or KaTeX errors
//   - the shell hooks are filled (#crumbs, #pager, #progress, #read) and the quiz has questions
//   - no horizontal page overflow on the phone
//   - every non-quiz button can be clicked without an exception
//   - every quiz question accepts its own stored answer, and the lesson then marks itself complete
// Exits non-zero if anything fails.

import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const shotsAt = args.indexOf('--shots');
const shotsDir = shotsAt >= 0 ? args.splice(shotsAt, 2)[1] : null;
const lessons = args.map(Number).filter(Boolean);
const BASE = process.env.BASE || 'http://localhost:4000/projects/learning-rl/';
const PORT = 9300 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PROFILE = mkdtempSync(join(tmpdir(), 'rlcheck-'));
const chrome = spawn('google-chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, 'about:blank',
], { stdio: 'ignore' });
// Chrome profiles are ~45 MB each: always remove ours, however we exit.
const cleanup = () => { try { chrome.kill(); } catch {} try { rmSync(PROFILE, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('Chrome did not start');
}

const ws = new WebSocket(await connect());
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else listeners.forEach((f) => f(m));
});
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id;
  pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
  ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

await send('Runtime.enable');
await send('Log.enable');
await send('Page.enable');
await send('Network.enable');

let problems = [];
listeners.push((m) => {
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails;
    problems.push(`exception: ${d.exception?.description?.split('\n')[0] || d.text}`);
  }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    problems.push(`console.error: ${m.params.args.map((a) => a.value ?? a.description).join(' ')}`);
  }
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url || '')) {
    problems.push(`log: ${m.params.entry.text} ${m.params.entry.url || ''}`);
  }
});

async function load(url, width) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
  const loaded = new Promise((r) => { const f = (m) => { if (m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(f), 1); r(); } }; listeners.push(f); });
  await send('Page.navigate', { url });
  await loaded;
  await sleep(700);
}

async function screenshot(file, width) {
  const h = await evaluate('document.documentElement.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width, height: Math.min(h, 6000), deviceScaleFactor: 1, mobile: width < 500 });
  await sleep(400);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(file, Buffer.from(data, 'base64'));
}

let failed = 0;
for (const n of lessons) {
  const url = `${BASE}${n}/`;
  const report = [];
  for (const width of [390, 1000]) {
    problems = [];
    await load(url, width);
    // Clear progress so the completion check is meaningful.
    await evaluate('try { localStorage.clear() } catch {} ; 1');

    const shell = await evaluate(`({
      crumbs: !!document.querySelector('#crumbs')?.textContent.trim(),
      pager: !!document.querySelector('#pager a'),
      progress: document.querySelectorAll('#progress .sq').length,
      read: !!document.querySelector('#read')?.textContent.trim(),
      questions: document.querySelectorAll('#quiz .q').length,
      katexErrors: document.querySelectorAll('.katex-error').length,
      rawDollars: [...document.querySelectorAll('main p, main li, main td, main th, main span, main div')]
        .filter(e => e.children.length === 0 && /\\$[^$]+\\$/.test(e.textContent)).length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      wide: [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && !e.closest('.katex-display, .logwrap, [style*="overflow"]'))
        .slice(0, 3).map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')).join(', '),
      title: document.title,
    })`);
    if (!shell.crumbs) report.push(`${width}px: #crumbs empty`);
    if (!shell.pager) report.push(`${width}px: #pager empty`);
    if (shell.progress !== 100) report.push(`${width}px: progress strip has ${shell.progress} squares`);
    if (!shell.read) report.push(`${width}px: #read empty`);
    if (shell.questions < 2) report.push(`${width}px: only ${shell.questions} quiz questions`);
    if (shell.katexErrors) report.push(`${width}px: ${shell.katexErrors} KaTeX errors`);
    if (shell.rawDollars) report.push(`${width}px: ${shell.rawDollars} elements show unrendered $maths$`);
    if (width < 500 && shell.overflow > 1) report.push(`${width}px: page overflows horizontally by ${shell.overflow}px (${shell.wide})`);

    if (shotsDir && width < 500) {
      mkdirSync(shotsDir, { recursive: true });
      await screenshot(join(shotsDir, `${n}-phone.png`), 390);
    }

    // Click every non-quiz button, twice (start then stop for toggles).
    const clicked = await evaluate(`(async () => {
      const bs = [...document.querySelectorAll('main button')].filter(b => !b.closest('#quiz'));
      for (const b of bs) { if (!b.disabled) { b.click(); await new Promise(r => setTimeout(r, 250)); } }
      await new Promise(r => setTimeout(r, 1200));
      for (const b of bs) { if (!b.disabled && /pause|stop/i.test(b.textContent)) b.click(); }
      return bs.length;
    })()`);

    // Answer every question with its stored answer.
    const quiz = await evaluate(`(async () => {
      const qs = Course.quiz.questions || [];
      const boxes = [...document.querySelectorAll('#quiz .q')];
      const out = [];
      boxes.forEach((box, i) => {
        const q = qs[i];
        if (q.choices) box.querySelector('input[value="' + q.answer + '"]').checked = true;
        else box.querySelector('.num').value = String(q.answer);
        box.querySelector('.check').click();
        out.push(box.querySelector('.feedback').classList.contains('ok'));
      });
      return { ok: out, complete: !!document.querySelector('#quiz .complete'), stored: Course.loadDone().has(${n}) };
    })()`);
    quiz.ok.forEach((ok, i) => { if (!ok) report.push(`${width}px: question ${i + 1} rejects its own answer`); });
    if (!quiz.complete) report.push(`${width}px: lesson not marked complete after all answers`);

    if (shotsDir && width >= 500) {
      await screenshot(join(shotsDir, `${n}-desktop.png`), 1000);
    }

    await sleep(300);
    problems.forEach((p) => report.push(`${width}px: ${p}`));
    if (width === 1000) report.unshift(`(${clicked} buttons clicked, ${quiz.ok.length} questions)`);
  }
  const bad = report.filter((r) => !r.startsWith('('));
  if (bad.length) failed++;
  console.log(`${bad.length ? 'FAIL' : 'ok  '} lesson ${n} ${report.join('\n       ')}`);
}

ws.close();
chrome.kill();
await sleep(500);   // let Chrome release the profile before it is deleted
process.exit(failed ? 1 : 0);
