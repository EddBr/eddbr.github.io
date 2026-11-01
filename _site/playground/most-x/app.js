// app.js — the page around engine.js: pickers, run loop, readout, gallery.
import { createEngine } from './engine.js';

const tf = window.tf;
const E = createEngine(tf);
const $ = (id) => document.getElementById(id);

const MODELS = {
  objects: {
    name: 'Objects', meta: '1000 classes', lr: 0.12,
    desc: 'ImageNet. Adversarially robust, so it draws what it means.',
    network: 'ResNet-18, adversarially trained (Madry Lab, ℓ₂ ε = 3)', data: 'ImageNet-1k, 1.28M photos',
    chips: ['goldfish', 'tarantula', 'flamingo', 'pineapple', 'volcano', 'jellyfish'],
  },
  textures: {
    name: 'Textures', meta: '47 adjectives', lr: 0.1,
    desc: 'Describable textures: bubbly, cracked, paisley, zigzagged…',
    network: 'Linear probe on the robust backbone', data: 'Describable Textures Dataset, 5,640 images',
    chips: ['paisley', 'cobwebbed', 'marbled', 'bubbly', 'cracked', 'zigzagged'],
  },
  styles: {
    name: 'Art styles', meta: '27 movements', lr: 0.1,
    desc: 'Art movements, from Early Renaissance to Pop Art.',
    network: 'Linear probe on the robust backbone', data: 'WikiArt, ~4,300 paintings',
    chips: ['Ukiyo-e', 'Pointillism', 'Cubism', 'Baroque', 'Pop Art', 'Impressionism'],
  },
  scenes: {
    name: 'Scenes', meta: '365 places', lr: 0.15,
    desc: 'Places365. Normally trained, so expect dreamier, DeepDream-ish results.',
    network: 'ResNet-18, standard training (MIT CSAIL)', data: 'Places365, 1.8M scene photos',
    chips: ['lighthouse', 'bamboo forest', 'volcano', 'ice cream parlor', 'library / indoor', 'iceberg'],
  },
  beauty: {
    name: 'Beauty', meta: 'rating 1–10', lr: 0.15,
    desc: 'NIMA, a model of how people rate photos. Push the rating up or down.',
    network: 'MobileNet v1 + NIMA head (idealo)', data: 'AVA, ~255k photos with crowd ratings',
    chips: ['beautiful', 'ugly'],
  },
};
const MB = { objects: 23, textures: 23, styles: 23, scenes: 23, beauty: 6 };

const state = {
  model: 'objects', target: 'goldfish', seed: 1,
  running: false, session: null, labels: null, curve: [],
};

// ------------------------------------------------------------ labels/targets

function targetsFor(key) {
  return key === 'beauty' ? ['beautiful', 'ugly'] : state.labels[key];
}

function resolveTarget(key, text) {
  const list = targetsFor(key);
  const t = text.trim().toLowerCase();
  return list.find((l) => l.toLowerCase() === t)
    || list.find((l) => l.toLowerCase().startsWith(t))
    || list.find((l) => l.toLowerCase().includes(t))
    || null;
}

function setHeadline() {
  const h = document.querySelector('h1');
  const x = state.target;
  if (state.model === 'beauty') {
    h.innerHTML = x === 'ugly'
      ? 'The least <span class="x" id="headline-x">beautiful</span> image'
      : 'The most <span class="x" id="headline-x">beautiful</span> image';
  } else {
    h.innerHTML = `The most <span class="x" id="headline-x"></span> image`;
    $('headline-x').textContent = x;
  }
  document.title = `The Most ${state.model === 'beauty' ? (x === 'ugly' ? 'Ugly' : 'Beautiful') : x}`;
}

// --------------------------------------------------------------------- UI

function buildModels() {
  const box = $('models');
  for (const [key, m] of Object.entries(MODELS)) {
    const b = document.createElement('button');
    b.className = 'model'; b.type = 'button'; b.dataset.key = key;
    b.innerHTML = `<b></b><span class="meta"></span><span class="desc"></span>`;
    b.querySelector('b').textContent = m.name;
    b.querySelector('.meta').textContent = m.meta;
    b.querySelector('.desc').textContent = m.desc;
    b.addEventListener('click', () => selectModel(key));
    box.appendChild(b);
  }
  const tb = $('model-table');
  for (const [key, m] of Object.entries(MODELS)) {
    const tr = document.createElement('tr');
    const n = key === 'beauty' ? '10 rating buckets' : `${state.labels[key].length} classes`;
    for (const [v, cls] of [[m.name, ''], [m.network, ''], [m.data, ''], [n, 'num'],
      [key === 'textures' || key === 'styles' ? '+ 0.1 MB (shares Objects)' : `${MB[key]} MB`, 'num']]) {
      const td = document.createElement('td'); td.textContent = v; if (cls) td.className = cls; tr.appendChild(td);
    }
    tb.appendChild(tr);
  }
}

function selectModel(key, target) {
  stop();
  state.model = key;
  for (const b of document.querySelectorAll('.model')) b.setAttribute('aria-pressed', String(b.dataset.key === key));
  const m = MODELS[key];
  state.target = target || m.chips[0];
  $('target').value = state.target;
  $('lr').value = m.lr; syncKnobs();
  const chips = $('chips'); chips.innerHTML = '';
  for (const c of m.chips) {
    const b = document.createElement('button');
    b.className = 'chip'; b.type = 'button'; b.textContent = c;
    b.addEventListener('click', () => { setTarget(c); });
    chips.appendChild(b);
  }
  setHeadline();
  idleReadout();
}

function setTarget(t) {
  const r = resolveTarget(state.model, t);
  if (!r) { $('err').textContent = `"${t}" isn't one of this classifier's ${targetsFor(state.model).length} classes. Try the suggestions.`; return false; }
  $('err').textContent = '';
  state.target = r; $('target').value = r; closeSuggest(); setHeadline();
  return true;
}

// autocomplete
let sel = -1;
function openSuggest() {
  const q = $('target').value.trim().toLowerCase();
  const list = targetsFor(state.model);
  const hits = (q ? list.filter((l) => l.toLowerCase().includes(q)) : list).slice(0, 60);
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
  $('steps-out').textContent = $('steps').value;
  $('lr-out').textContent = (+$('lr').value).toFixed(2);
}

// ---------------------------------------------------------------- readout

function idleReadout() {
  state.curve = []; drawCurve();
  $('readout-title').textContent = state.model === 'beauty' ? 'Predicted rating distribution' : 'What the classifier sees';
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

async function updateReadout() {
  const lg = state.session.evaluate();
  const sm = tf.softmax(lg);
  const p = await sm.data(); sm.dispose(); lg.dispose();
  if (state.model === 'beauty') {
    const mean = p.reduce((s, v, i) => s + v * (i + 1), 0);
    state.curve.push(mean / 10);
    const rows = [{ name: `Mean rating`, frac: mean / 10, val: mean.toFixed(2), target: true }];
    for (let i = 9; i >= 0; i--) rows.push({ name: `${i + 1} / 10`, frac: p[i], val: `${(p[i] * 100).toFixed(0)}%` });
    renderBars(rows);
  } else {
    const labels = state.labels[state.model];
    const ti = labels.indexOf(state.target);
    state.curve.push(p[ti]);
    const top = Array.from(p).map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 5);
    if (!top.some(([, i]) => i === ti)) top[4] = [p[ti], ti];
    renderBars(top.map(([v, i]) => ({ name: labels[i], frac: v, val: `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`, target: i === ti })));
  }
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
  g.fillText(state.model === 'beauty' ? 'rating 10' : '100%', 4, 20);
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
const models = {};
async function getModel(key) {
  models[key] = models[key] || E.loadModel(key, read);
  return models[key];
}

// ----------------------------------------------------------------- run

function stop() {
  state.running = false;
}

async function generate() {
  if (state.running) { stop(); return; }
  if (!setTarget($('target').value)) return;
  $('err').textContent = '';
  state.running = true;
  $('go').textContent = 'Stop';
  const key = state.model, target = state.target;
  try {
    const model = await getModel(key);
    if (!state.running) return;
    const obj = key === 'beauty'
      ? E.nimaObjective(target === 'ugly' ? -1 : 1)
      : E.classObjective(state.labels[key].indexOf(target));
    state.session?.dispose();
    state.session = new E.Session(model, obj, { seed: state.seed, lr: +$('lr').value, robust: $('robust').checked });
    state.curve = [];
    $('caption').textContent = `${MODELS[key].name} · ${target} · seed ${state.seed}`;
    const steps = +$('steps').value;
    const t0 = performance.now();
    for (let i = 0; i < steps && state.running; i++) {
      state.session.step();
      if (i % 4 === 3 || i === steps - 1) {
        const img = state.session.image();
        await tf.browser.toPixels(img, $('plate'));
        img.dispose();
      }
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

function savePng() {
  $('plate').toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `most-${state.target.replace(/\W+/g, '-')}-${state.model}-seed${state.seed}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
}

// ---------------------------------------------------------------- gallery

function showOnPlate(src) {
  const img = new Image();
  img.onload = () => $('plate').getContext('2d').drawImage(img, 0, 0, 256, 256);
  img.src = src;
}

async function buildGallery() {
  let items = [];
  try { items = await (await fetch('gallery/gallery.json')).json(); } catch { return; }
  const box = $('gallery');
  for (const it of items) {
    const b = document.createElement('button'); b.className = 'specimen'; b.type = 'button';
    b.innerHTML = `<img alt="" loading="lazy"><span></span><small></small>`;
    b.querySelector('img').src = `gallery/${it.file}`;
    b.querySelector('img').alt = `${MODELS[it.model].name}: ${it.target}`;
    b.querySelector('span').textContent = it.model === 'beauty' ? (it.target === 'ugly' ? 'least beautiful' : 'most beautiful') : it.target;
    b.querySelector('small').textContent = `${MODELS[it.model].name} · ${it.robust === false ? 'jitter off' : `seed ${it.seed}`}`;
    b.addEventListener('click', () => {
      selectModel(it.model, it.target); state.seed = it.seed; $('lr').value = it.lr; $('robust').checked = it.robust !== false; syncKnobs();
      showOnPlate(`gallery/${it.file}`);
      $('caption').textContent = `Pre-rendered: ${MODELS[it.model].name} · ${it.target} · seed ${it.seed}${it.robust === false ? ' · jitter off' : ''}`;
      $('status').textContent = 'Press Generate to grow it live'; $('stepcount').textContent = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    box.appendChild(b);
  }
  const first = items.find((i) => i.model === state.model && i.target === state.target && i.robust !== false);
  if (first) showOnPlate(`gallery/${first.file}`);
}

// ------------------------------------------------------------------ boot

async function boot() {
  state.labels = await (await fetch('models/labels.json')).json();
  buildModels();
  selectModel('objects', 'goldfish');
  syncKnobs();
  buildGallery();

  $('go').addEventListener('click', generate);
  $('reseed').addEventListener('click', () => { state.seed = 1 + Math.floor(Math.random() * 1e6); stop(); setTimeout(generate, 0); });
  $('save').addEventListener('click', savePng);
  $('steps').addEventListener('input', syncKnobs);
  $('lr').addEventListener('input', syncKnobs);
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
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', drawCurve);

  try {
    await tf.setBackend('webgl');
    $('status').textContent = 'Ready';
  } catch {
    await tf.setBackend('cpu');
    $('status').textContent = 'No WebGL: this will be very slow';
  }
}

boot().catch((e) => { $('err').textContent = `Couldn't start: ${e.message}`; });
