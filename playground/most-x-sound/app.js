// app.js — the page around engine.js: picker, run loop, player, readout, gallery.
import { createEngine } from './engine.js';
import { spectrogramPixels, wavBytes } from './draw.js';

const tf = window.tf;
const E = createEngine(tf);
const $ = (id) => document.getElementById(id);

const CHIPS = [
  'Baby cry, infant cry', 'Applause', 'Siren', 'Speech', 'Laughter', 'Bark',
  'Snoring', 'Thunder', 'Church bell', 'Violin, fiddle', 'Heart sounds, heartbeat', 'Scary music',
];
// headline wording for the classes whose first name reads badly after "the most"
const SAY = {
  'Baby cry, infant cry': 'baby crying', 'Bark': 'barking', 'Heart sounds, heartbeat': 'heartbeat',
  'Crowing, cock-a-doodle-doo': 'cock-a-doodle-doo', 'Violin, fiddle': 'violin',
};
const say = (label) => SAY[label] || label.split(',')[0].replace(/\s*\(.*\)/, '').toLowerCase();
const short = (label) => label.split(',')[0];

const state = {
  target: 'Baby cry, infant cry', seed: 1,
  running: false, session: null, labels: null, curve: [], samples: null, sr: E.SR,
};

// ------------------------------------------------------------- targets

function resolveTarget(text) {
  const t = text.trim().toLowerCase();
  const L = state.labels;
  return L.find((l) => l.toLowerCase() === t)
    || L.find((l) => l.toLowerCase().split(',').some((p) => p.trim() === t))
    || L.find((l) => l.toLowerCase().startsWith(t))
    || L.find((l) => l.toLowerCase().includes(t))
    || null;
}

function setHeadline() {
  $('headline-x').textContent = say(state.target);
  document.title = `The Most ${short(state.target)} Sound | Eddie's Blog`;
}

function setTarget(t) {
  const r = resolveTarget(t);
  if (!r) { $('err').textContent = `"${t}" isn't one of YAMNet's 521 classes. Try the suggestions.`; return false; }
  $('err').textContent = '';
  state.target = r; $('target').value = r; closeSuggest(); setHeadline(); updateShare();
  return true;
}

function buildChips() {
  for (const c of CHIPS) {
    const b = document.createElement('button');
    b.className = 'chip'; b.type = 'button'; b.textContent = short(c);
    b.addEventListener('click', () => setTarget(c));
    $('chips').appendChild(b);
  }
}

// autocomplete
let sel = -1;
function openSuggest() {
  const q = $('target').value.trim().toLowerCase();
  const hits = (q ? state.labels.filter((l) => l.toLowerCase().includes(q)) : state.labels).slice(0, 80);
  const ul = $('suggest'); ul.innerHTML = ''; sel = -1;
  for (const h of hits) {
    const li = document.createElement('li'); li.textContent = h; li.setAttribute('role', 'option');
    li.addEventListener('mousedown', (e) => { e.preventDefault(); setTarget(h); });
    ul.appendChild(li);
  }
  ul.hidden = hits.length === 0; $('target').setAttribute('aria-expanded', String(!ul.hidden));
}
function closeSuggest() { $('suggest').hidden = true; $('target').setAttribute('aria-expanded', 'false'); }
function moveSel(d) {
  const items = [...$('suggest').children]; if (!items.length) return;
  sel = (sel + d + items.length) % items.length;
  items.forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
  items[sel].scrollIntoView({ block: 'nearest' });
}

function syncKnobs() {
  updateShare();
  $('steps-out').textContent = $('steps').value;
  $('lr-out').textContent = (+$('lr').value).toFixed(2);
  $('decay-out').textContent = (+$('decay').value) === 0 ? 'off' : `a = ${(+$('decay').value).toFixed(2)}`;
}

// ---------------------------------------------------------------- player
// One looping AudioBufferSourceNode. New audio (each few steps while
// generating, or a specimen) crossfades in at the same loop position.

const player = { ctx: null, master: null, src: null, voice: null, startedAt: 0, offset: 0, playing: false, dur: E.LEN / E.SR, owner: null };

function audioCtx() {
  if (!player.ctx) {
    player.ctx = new (window.AudioContext || window.webkitAudioContext)();
    player.master = player.ctx.createGain();
    player.master.gain.value = volume();
    player.master.connect(player.ctx.destination);
  }
  return player.ctx;
}
const volume = () => Math.pow(+$('volume').value, 2);
const position = () => player.playing
  ? (player.offset + player.ctx.currentTime - player.startedAt) % player.dur
  : player.offset;

function startVoice(fade) {
  const ctx = audioCtx();
  const buf = ctx.createBuffer(1, state.samples.length, state.sr);
  buf.copyToChannel(state.samples, 0);
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const g = ctx.createGain(); src.connect(g); g.connect(player.master);
  const at = position() % (state.samples.length / state.sr);
  const now = ctx.currentTime;
  if (fade) { g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(1, now + 0.08); }
  if (player.src) {
    const old = player.src, og = player.voice;
    og.gain.setValueAtTime(og.gain.value, now); og.gain.linearRampToValueAtTime(0, now + 0.08);
    old.stop(now + 0.1);
  }
  src.start(now, at);
  Object.assign(player, { src, voice: g, startedAt: now, offset: at, dur: state.samples.length / state.sr, playing: true });
}

function play() {
  if (!state.samples) return;
  audioCtx().resume();
  startVoice(true);
  setPlayButton();
  requestAnimationFrame(tickPlayhead);
}

function pause() {
  if (!player.playing) return;
  player.offset = position();
  const now = player.ctx.currentTime;
  player.voice.gain.setValueAtTime(player.voice.gain.value, now);
  player.voice.gain.linearRampToValueAtTime(0, now + 0.05);
  player.src.stop(now + 0.06);
  player.src = null; player.playing = false;
  setPlayButton();
}

// new samples arrived: swap them in if we're playing
function refreshAudio() { if (player.playing) startVoice(true); }

function setPlayButton() {
  $('play-label').textContent = player.playing ? 'Pause' : 'Play';
  $('play-icon').setAttribute('d', player.playing ? 'M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z' : 'M4 2.5v11l9.5-5.5z');
  $('playhead').style.display = player.playing ? 'block' : 'none';
  for (const s of document.querySelectorAll('.specimen')) {
    const on = player.playing && player.owner === s.dataset.file;
    s.classList.toggle('playing', on);
    s.querySelector('.badge path').setAttribute('d', on ? 'M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z' : 'M4 2.5v11l9.5-5.5z');
  }
}

function tickPlayhead() {
  if (!player.playing) return;
  $('playhead').style.left = `${(position() / player.dur) * 100}%`;
  requestAnimationFrame(tickPlayhead);
}

// ------------------------------------------------------------- drawing

function drawSpectrogram(mag, frames, bins) {
  const c = $('plate');
  const px = spectrogramPixels(mag, frames, bins, c.width, c.height);
  c.getContext('2d').putImageData(new ImageData(px, c.width, c.height), 0, 0);
}

async function pullSession() {
  const w = state.session.wave(), sp = state.session.spectrogram();
  const [samples, mag] = await Promise.all([w.data(), sp.data()]);
  drawSpectrogram(mag, sp.shape[0], sp.shape[1]);
  w.dispose(); sp.dispose();
  state.samples = samples; state.sr = E.SR; player.owner = null;
  refreshAudio(); setPlayButton();
}

// ---------------------------------------------------------------- readout

function idleReadout() {
  state.curve = []; drawCurve();
  $('bars').innerHTML = `<div class="bar"><span class="name" style="color:var(--muted)">Press Generate</span><span></span><span></span></div>`;
}

function renderBars(rows) {
  const box = $('bars'); box.innerHTML = '';
  for (const r of rows) {
    const d = document.createElement('div'); d.className = 'bar' + (r.target ? ' target' : '');
    d.innerHTML = `<span class="name"></span><span class="track"><span class="fill"></span></span><span class="val"></span>`;
    d.querySelector('.name').textContent = r.name; d.querySelector('.name').title = r.name;
    d.querySelector('.fill').style.width = `${Math.max(0.5, r.frac * 100)}%`;
    d.querySelector('.val').textContent = r.val;
    box.appendChild(d);
  }
}

const pct = (v) => `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`;

function showScores(p, ti) {
  const top = Array.from(p).map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 5);
  if (!top.some(([, i]) => i === ti)) top[4] = [p[ti], ti];
  renderBars(top.map(([v, i]) => ({ name: state.labels[i], frac: v, val: pct(v), target: i === ti })));
}

async function updateReadout() {
  const lg = state.session.evaluate();
  const sc = tf.tidy(() => tf.mean(tf.sigmoid(lg), 0));
  const p = await sc.data(); sc.dispose(); lg.dispose();
  const ti = state.labels.indexOf(state.target);
  state.curve.push(p[ti]);
  showScores(p, ti);
  drawCurve();
}

function drawCurve() {
  const c = $('curve'), g = c.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const W = c.width, H = c.height;
  g.clearRect(0, 0, W, H);
  g.strokeStyle = css.getPropertyValue('--rule'); g.lineWidth = 1;
  for (const y of [0.5, H / 2, H - 0.5]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.fillStyle = css.getPropertyValue('--muted'); g.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  g.fillText('100%', 4, 20);
  const pts = state.curve; if (pts.length < 2) return;
  const total = Math.max(pts.length, Math.ceil(+$('steps').value / 8));
  const xy = (v, i) => [i / (total - 1) * W, H - 2 - v * (H - 4)];
  const accent = css.getPropertyValue('--signal');
  g.beginPath(); pts.forEach((v, i) => { const [x, y] = xy(v, i); i ? g.lineTo(x, y) : g.moveTo(x, y); });
  g.strokeStyle = accent; g.lineWidth = 3; g.stroke();
  const [x, y] = xy(pts[pts.length - 1], pts.length - 1);
  g.fillStyle = accent; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
}

// --------------------------------------------------------------- weights

let loadedMB = 0;
async function read(f) {
  const r = await fetch(`models/${f}`);
  if (!r.ok) throw new Error(`Couldn't download models/${f} (HTTP ${r.status}).`);
  const b = await r.arrayBuffer();
  loadedMB += b.byteLength / 1e6;
  $('status').textContent = `Downloading weights · ${loadedMB.toFixed(0)} MB`;
  return b;
}
let model = null;
const getModel = () => (model = model || E.loadModel(read));

// ----------------------------------------------------------------- run

function stop() { state.running = false; }

async function generate() {
  if (state.running) { stop(); return; }
  if (!setTarget($('target').value)) return;
  $('err').textContent = '';
  state.running = true;
  $('go').textContent = 'Stop';
  // Generate is a user gesture, so this is the moment browsers allow audio to start
  audioCtx().resume();
  const target = state.target;
  try {
    const m = await getModel();
    if (!state.running) return;
    state.session?.dispose();
    state.session = new E.Session(m, E.classObjective(state.labels.indexOf(target)), {
      seed: state.seed, lr: +$('lr').value, robust: $('robust').checked,
      phase: $('phase').checked ? 'learned' : 'random', decay: +$('decay').value,
    });
    state.curve = [];
    const opts = [$('robust').checked ? '' : 'jitter off', $('phase').checked ? '' : 'random phase'].filter(Boolean);
    $('caption').textContent = `${state.note || ''}${short(target)} · seed ${state.seed} · a = ${$('decay').value}${opts.length ? ' · ' + opts.join(' · ') : ''}`;
    state.note = '';
    const steps = +$('steps').value;
    const t0 = performance.now();
    for (let i = 0; i < steps && state.running; i++) {
      state.session.step();
      if (i % 4 === 3 || i === steps - 1 || i === 0) await pullSession();
      if (i % 8 === 0 || i === steps - 1) await updateReadout();
      const ms = (performance.now() - t0) / (i + 1);
      $('status').textContent = i === 0 ? 'Compiling shaders…' : 'Climbing';
      $('stepcount').textContent = `step ${i + 1} / ${steps}`;
      $('speed').textContent = `${ms.toFixed(0)} ms/step`;
      await tf.nextFrame();
    }
    $('status').textContent = state.running ? 'Done' : 'Stopped';
  } catch (e) {
    console.error(e);
    $('err').textContent = `Something failed: ${e.message}`;
    $('status').textContent = 'Error';
  } finally {
    state.running = false;
    $('go').textContent = 'Generate';
  }
}

function saveWav() {
  if (!state.samples) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([wavBytes(state.samples, state.sr)], { type: 'audio/wav' }));
  a.download = `most-${short(state.target).toLowerCase().replace(/\W+/g, '-')}-seed${state.seed}.wav`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ------------------------------------------------------------------ share
// A link carries the settings, not the audio: the seed makes the same starting
// noise and the same jitter, so the recipient's GPU regrows (nearly) the same sound.

const DEFAULTS = { steps: '384', lr: '0.05', decay: '1.5' };

function shareURL() {
  const q = new URLSearchParams({ x: state.target, seed: String(state.seed) });
  for (const [k, d] of Object.entries(DEFAULTS)) if ($(k).value !== d) q.set(k, $(k).value);
  if (!$('robust').checked) q.set('jitter', '0');
  if (!$('phase').checked) q.set('phase', 'random');
  return `${location.origin}${location.pathname}?${q}`;
}
const shareText = () => `The most "${short(state.target)}" sound, according to an AI audio classifier. Hear it grow from static:`;

function updateShare() {
  const url = shareURL();
  $('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  $('share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(url)}`;
}

function flash(msg) {
  $('share-done').textContent = msg;
  clearTimeout(flash.t); flash.t = setTimeout(() => { $('share-done').textContent = ''; }, 2500);
}

async function copyLink() {
  try { await navigator.clipboard.writeText(shareURL()); flash('Link copied'); }
  catch { prompt('Copy this link:', shareURL()); }
}

async function shareNative() {
  const data = { title: `The Most ${short(state.target)} Sound`, text: shareText(), url: shareURL() };
  if (state.samples) {
    const file = new File([wavBytes(state.samples, state.sr)], `most-${short(state.target).toLowerCase().replace(/\W+/g, '-')}.wav`, { type: 'audio/wav' });
    if (navigator.canShare?.({ ...data, files: [file] })) data.files = [file];
  }
  try { await navigator.share(data); } catch (e) { if (e.name !== 'AbortError') copyLink(); }
}

// ?x=Siren&seed=42[&steps=&lr=&decay=&jitter=0&phase=random] -> settings; true if a sound was shared
function readShared() {
  const q = new URLSearchParams(location.search);
  if (!q.get('x') || !resolveTarget(q.get('x'))) return false;
  setTarget(q.get('x'));
  state.seed = Math.max(1, Math.floor(+q.get('seed') || 1));
  for (const k of Object.keys(DEFAULTS)) if (q.has(k)) $(k).value = q.get(k);
  $('robust').checked = q.get('jitter') !== '0';
  $('phase').checked = q.get('phase') !== 'random';
  syncKnobs();
  return true;
}

// ---------------------------------------------------------------- gallery

const decoded = {};
async function loadSpecimen(it) {
  // decode at the context's own rate; any AudioContext can do that
  decoded[it.file] = decoded[it.file] || fetch(`gallery/${it.file}.wav`).then((r) => r.arrayBuffer()).then((b) => audioCtx().decodeAudioData(b));
  const buf = await decoded[it.file];
  state.samples = buf.getChannelData(0).slice(0, Math.round(E.LEN / E.SR * buf.sampleRate));
  state.sr = buf.sampleRate;
  player.owner = it.file;
}

function showPng(src) {
  const img = new Image();
  img.onload = () => $('plate').getContext('2d').drawImage(img, 0, 0, $('plate').width, $('plate').height);
  img.src = src;
}

function showSpecimen(it, quiet = false) {
  stop();
  setTarget(it.target); state.seed = it.seed;
  $('lr').value = it.lr; $('decay').value = it.decay;
  $('robust').checked = it.robust; $('phase').checked = it.phase === 'learned';
  syncKnobs();
  showPng(`gallery/${it.file}.jpg`);
  const opts = [it.robust ? '' : 'jitter off', it.phase === 'learned' ? '' : 'random phase'].filter(Boolean);
  $('caption').textContent = `Pre-rendered: ${short(it.target)} · seed ${it.seed}${opts.length ? ' · ' + opts.join(' · ') : ''}`;
  if (!quiet) { $('status').textContent = 'Press Generate to grow it live'; $('stepcount').textContent = ''; }
  state.curve = []; drawCurve();
  showScores(Float32Array.from(it.scores), state.labels.indexOf(it.target));
}

async function buildGallery(shared = false) {
  let items = [];
  try { items = await (await fetch('gallery/gallery.json')).json(); } catch { return; }
  for (const it of items) it.scores = (() => { const s = new Array(state.labels.length).fill(0); for (const [i, v] of it.top) s[i] = v; return s; })();
  const box = $('gallery');
  for (const it of items) {
    const b = document.createElement('button'); b.className = 'specimen'; b.type = 'button'; b.dataset.file = it.file;
    b.innerHTML = `<div class="thumb"><img alt="" loading="lazy"><div class="badge"><svg viewBox="0 0 16 16"><path d="M4 2.5v11l9.5-5.5z"/></svg></div></div><span></span><small></small><small class="how"></small>`;
    b.querySelector('img').src = `gallery/${it.file}.jpg`;
    b.querySelector('img').alt = `Spectrogram of the most ${say(it.target)} sound`;
    b.querySelector('span').textContent = it.title || short(it.target);
    b.querySelector('small').textContent = `${pct(it.score)} sure`;
    b.querySelector('.how').textContent = `seed ${it.seed} · official model, after MP3: ${pct(it.refScore)}`;
    b.addEventListener('click', async () => {
      if (player.playing && player.owner === it.file) { pause(); return; }
      showSpecimen(it);
      try { await loadSpecimen(it); play(); } catch (e) { $('err').textContent = `Couldn't play that one: ${e.message}`; }
    });
    box.appendChild(b);
  }
  const first = items.find((i) => i.target === state.target && i.robust && i.phase === 'learned');
  if (first && !shared) {
    showSpecimen(first, true);
    // the play button plays this until a session exists; decode on first press
    state.pending = first;
  }
}

// ------------------------------------------------------------------ boot

async function boot() {
  state.labels = await (await fetch('models/labels.json')).json();
  buildChips();
  setTarget(state.target);
  syncKnobs();
  idleReadout();
  const shared = readShared();
  await buildGallery(shared);

  $('go').addEventListener('click', generate);
  $('reseed').addEventListener('click', () => { state.seed = 1 + Math.floor(Math.random() * 1e6); stop(); setTimeout(generate, 0); });
  $('save').addEventListener('click', saveWav);
  $('share-copy').addEventListener('click', copyLink);
  $('share-native').hidden = !navigator.share;
  $('share-native').addEventListener('click', shareNative);
  for (const k of ['robust', 'phase']) $(k).addEventListener('change', updateShare);
  $('play').addEventListener('click', async () => {
    if (player.playing) { pause(); return; }
    if (!state.samples && state.pending) {
      try { await loadSpecimen(state.pending); } catch (e) { $('err').textContent = `Couldn't play: ${e.message}`; return; }
    }
    play();
  });
  $('volume').addEventListener('input', () => { if (player.master) player.master.gain.setTargetAtTime(volume(), player.ctx.currentTime, 0.02); });
  for (const k of ['steps', 'lr', 'decay']) $(k).addEventListener('input', syncKnobs);
  const t = $('target');
  t.addEventListener('focus', openSuggest);
  t.addEventListener('input', openSuggest);
  t.addEventListener('blur', () => setTimeout(closeSuggest, 100));
  t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
    else if (e.key === 'Escape') closeSuggest();
    else if (e.key === 'Enter') {
      e.preventDefault();
      const items = [...$('suggest').children];
      if (setTarget(sel >= 0 && items[sel] ? items[sel].textContent : t.value)) generate();
    }
  });

  try {
    await tf.setBackend('webgl');
    $('status').textContent = 'Ready';
  } catch {
    await tf.setBackend('cpu');
    $('status').textContent = 'No WebGL: this will be very slow';
  }
  if (shared) {
    // browsers won't start audio without a click, so grow it now and let Play start the sound
    state.note = 'Shared with you. Press Play to hear it grow · ';
    generate();
  }
}

boot().catch((e) => { $('err').textContent = `Couldn't start: ${e.message}`; });
