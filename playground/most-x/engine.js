// engine.js — activation maximization in the browser.
//
// Freeze a classifier, then run gradient ascent on the *input image* until it
// maximally excites one output. Everything here is plain TensorFlow.js ops so
// tf's autodiff gives us d(score)/d(image) for free on the visitor's GPU.
//
// Three pieces, each a known trick from "Feature Visualization"
// (Olah, Mordvintsev & Schubert, Distill 2017):
//   1. Spectral canvas: the image lives as Fourier coefficients scaled by 1/f,
//      colour-decorrelated, so smooth structure is cheap and static is costly.
//   2. Transform robustness: every step the model sees a randomly zoomed,
//      stretched, shifted view, so the pattern can't be a one-alignment trick.
//   3. The networks, rebuilt op-for-op from folded weights (see tools/nets.py).

export function createEngine(tf) {
  const INPUT = 224;

  // ------------------------------------------------------------- weights

  function halfToFloat(u16) {
    const out = new Float32Array(u16.length);
    for (let i = 0; i < u16.length; i++) {
      const h = u16[i];
      const s = h & 0x8000 ? -1 : 1;
      const e = (h >> 10) & 0x1f;
      const m = h & 0x3ff;
      out[i] = e === 0 ? s * m * 5.960464477539063e-8
        : e === 31 ? (m ? NaN : s * Infinity)
        : s * (1 + m / 1024) * Math.pow(2, e - 15);
    }
    return out;
  }

  // read(path) -> Promise<ArrayBuffer>; returns {name: tf.Tensor}
  async function loadWeights(read, name) {
    const manifest = JSON.parse(new TextDecoder().decode(await read(`${name}.json`)));
    const parts = await Promise.all(manifest.shards.map((f) => read(f)));
    const bytes = new Uint8Array(parts.reduce((n, p) => n + p.byteLength, 0));
    parts.reduce((o, p) => (bytes.set(new Uint8Array(p), o), o + p.byteLength), 0);
    const all = halfToFloat(new Uint16Array(bytes.buffer));
    const W = {};
    for (const t of manifest.tensors) {
      const n = t.shape.reduce((a, b) => a * b, 1);
      W[t.name] = tf.tensor(all.subarray(t.offset, t.offset + n), t.shape);
    }
    return W;
  }

  // ------------------------------------------------------------ networks
  // All take x: [B,224,224,3] already preprocessed, return pooled features.

  // Numeric padding is torch-style symmetric zero padding. Applied with an
  // explicit tf.pad because not every tfjs backend accepts numeric `pad`.
  const zpad = (x, p) => (p ? tf.pad(x, [[0, 0], [p, p], [p, p], [0, 0]]) : x);
  const conv = (x, W, name, stride, pad, act = 'linear') =>
    tf.fused.conv2d({
      x: typeof pad === 'number' ? zpad(x, pad) : x, filter: W[`${name}.w`], bias: W[`${name}.b`],
      strides: stride, pad: typeof pad === 'number' ? 'valid' : pad, activation: act,
    });

  function resnet18(W, x) {
    x = conv(x, W, 'stem', 2, 3, 'relu');
    x = tf.maxPool(zpad(x, 1), 3, 2, 'valid');   // post-ReLU, so zero pad == -inf pad
    for (let l = 1; l <= 4; l++) {
      for (let b = 0; b < 2; b++) {
        const p = `l${l}b${b}`;
        const s = l > 1 && b === 0 ? 2 : 1;
        let y = conv(x, W, `${p}c1`, s, 1, 'relu');
        y = conv(y, W, `${p}c2`, 1, 1);
        if (W[`${p}ds.w`]) x = conv(x, W, `${p}ds`, s, 0);
        x = tf.relu(tf.add(x, y));
      }
    }
    return tf.mean(x, [1, 2]);
  }

  const MOBILENET_S2 = new Set([2, 4, 6, 12]);
  function mobilenet(W, x) {
    x = tf.relu6(conv(x, W, 'stem', 2, 'same'));
    for (let i = 1; i <= 13; i++) {
      const s = MOBILENET_S2.has(i) ? 2 : 1;
      x = tf.relu6(tf.add(tf.depthwiseConv2d(s === 2 ? x : zpad(x, 1), W[`dw${i}.w`], s, s === 2 ? 'same' : 'valid'), W[`dw${i}.b`]));
      x = tf.relu6(conv(x, W, `pw${i}`, 1, 0));
    }
    return tf.mean(x, [1, 2]);
  }

  const dense = (f, W) => tf.add(tf.matMul(f, W['fc.w']), W['fc.b']);

  const MEAN = tf.tensor1d([0.485, 0.456, 0.406]), STD = tf.tensor1d([0.229, 0.224, 0.225]);
  const imagenetNorm = (x) => tf.div(tf.sub(x, MEAN), STD);

  // Model registry. `files` are weight bundles; the first is the backbone.
  const MODELS = {
    objects:  { files: ['robust18'],                    arch: resnet18, pre: imagenetNorm },
    textures: { files: ['robust18', 'head_textures'],   arch: resnet18, pre: imagenetNorm },
    styles:   { files: ['robust18', 'head_styles'],     arch: resnet18, pre: imagenetNorm },
    scenes:   { files: ['places18'],                    arch: resnet18, pre: imagenetNorm },
    beauty:   { files: ['nima'],                        arch: mobilenet, pre: (x) => tf.sub(tf.mul(x, 2), 1) },
  };

  const cache = {};
  async function loadModel(key, read) {
    const spec = MODELS[key];
    const parts = [];
    for (const f of spec.files) {
      cache[f] = cache[f] || loadWeights(read, f);
      parts.push(await cache[f]);
    }
    const W = Object.assign({}, ...parts);   // a head's fc.* overrides the backbone's
    return {
      key,
      logits: (img01) => dense(spec.arch(W, spec.pre(img01)), W),
    };
  }

  // -------------------------------------------------------------- canvas

  // Seeded RNG so a (model, class, seed) triple always draws the same picture.
  function rng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.normal = () => Math.sqrt(-2 * Math.log(1 - next())) * Math.cos(2 * Math.PI * next());
    return next;
  }

  // sqrt of ImageNet RGB covariance (lucid), normalised.
  const COLOR = [[0.26, 0.09, 0.02], [0.27, 0.00, -0.05], [0.27, -0.09, 0.03]].map(r => r.map(v => v / 4.10));

  // A real-valued irfft2 written as matmuls, so it is differentiable with no FFT kernel:
  //   img = Cy·(R·Cx − I·Sx) − Sy·(R·Sx + I·Cx)
  // where R, I are the real/imag rfft2 coefficients. Matches torch.fft.irfft2(norm="backward").
  class SpectralCanvas {
    constructor(n, seed, { sd = 0.01, decay = 1 } = {}) {
      const K = n / 2 + 1;
      this.n = n;
      const r = rng(seed);
      const init = () => {
        const t = tf.tensor3d(Float32Array.from({ length: 3 * n * K }, () => sd * r.normal()), [3, n, K]);
        const v = tf.variable(t);   // shares t's data, so t's handle can go
        t.dispose();
        return v;
      };
      this.re = init();
      this.im = init();

      const scale = new Float32Array(n * K);
      for (let y = 0; y < n; y++) {
        const fy = (y < n / 2 ? y : y - n) / n;
        for (let k = 0; k < K; k++) {
          const f = Math.max(Math.hypot(fy, k / n), 1 / n);
          scale[y * K + k] = n / Math.pow(f, decay);
        }
      }
      const Cy = new Float32Array(n * n), Sy = new Float32Array(n * n);
      for (let y = 0; y < n; y++) for (let k = 0; k < n; k++) {
        const a = 2 * Math.PI * k * y / n;
        Cy[y * n + k] = Math.cos(a); Sy[y * n + k] = Math.sin(a);
      }
      const Cx = new Float32Array(K * n), Sx = new Float32Array(K * n);
      for (let k = 0; k < K; k++) {
        const c = (k === 0 || k === n / 2 ? 1 : 2) / (n * n);
        for (let x = 0; x < n; x++) {
          const a = 2 * Math.PI * k * x / n;
          Cx[k * n + x] = c * Math.cos(a); Sx[k * n + x] = c * Math.sin(a);
        }
      }
      const b3 = (arr, r_, c_) => tf.tidy(() => tf.tile(tf.tensor3d(arr, [1, r_, c_]), [3, 1, 1]));
      this.scale = tf.tensor3d(scale, [1, n, K]);
      this.Cy = b3(Cy, n, n); this.Sy = b3(Sy, n, n);
      this.Cx = b3(Cx, K, n); this.Sx = b3(Sx, K, n);
      this.color = tf.tidy(() => tf.tensor2d(COLOR).transpose());
    }

    get variables() { return [this.re, this.im]; }

    // -> [n, n, 3] in [0,1]
    image() {
      return tf.tidy(() => {
        const R = tf.mul(this.re, this.scale), I = tf.mul(this.im, this.scale);
        const A = tf.sub(tf.matMul(R, this.Cx), tf.matMul(I, this.Sx));
        const B = tf.add(tf.matMul(R, this.Sx), tf.matMul(I, this.Cx));
        const sp = tf.div(tf.sub(tf.matMul(this.Cy, A), tf.matMul(this.Sy, B)), 4);
        const hwc = tf.transpose(sp, [1, 2, 0]).reshape([-1, 3]);
        return tf.sigmoid(tf.matMul(hwc, this.color)).reshape([this.n, this.n, 3]);
      });
    }

    dispose() {
      for (const t of [this.re, this.im, this.scale, this.Cy, this.Sy, this.Cx, this.Sx, this.color]) t.dispose();
    }
  }

  // ---------------------------------------------------------- transforms

  // One random zoom + shift of the canvas, bilinearly resampled into a
  // 224×224 view with mirror padding at the edges. Zoom and shift are
  // separable, so the warp is two small interpolation-matrix matmuls,
  //   view = Ry · canvas · Rxᵀ,
  // which differentiate cheaply on any backend. (A gather-based warp that
  // also rotates is far slower: its gradient is a scatter-add, and tfjs's WebGL
  // scatter scales with pixels × pixels.)
  function axisMatrix(n, z, t) {
    const M = new Float32Array(INPUT * n);
    const refl = (i) => { i = i < 0 ? -i - 1 : i; i = i >= n ? 2 * n - 1 - i : i; return Math.min(Math.max(i, 0), n - 1); };
    const mid = (n - 1) / 2, half = (INPUT - 1) / 2;
    for (let d = 0; d < INPUT; d++) {
      const src = mid + t + (d - half) / z;
      const i0 = Math.floor(src), f = src - i0;
      M[d * n + refl(i0)] += 1 - f;
      M[d * n + refl(i0 + 1)] += f;
    }
    return M;
  }

  function viewMatrices(n, views, r, { robust = true, zoom = [0.9, 1.15], slack = 16 } = {}) {
    const out = [];
    for (let v = 0; v < views; v++) {
      if (!robust) { const M = axisMatrix(n, INPUT / n, 0); out.push({ ry: M, rx: M }); continue; }
      // independent zoom per axis = a little anisotropic stretch, which stands in for rotation
      const zy = zoom[0] + r() * (zoom[1] - zoom[0]);
      const zx = zy * (0.95 + 0.1 * r());
      const shift = (z) => (r() * 2 - 1) * (Math.max(0, n / 2 - INPUT / (2 * z)) + slack);
      out.push({ ry: axisMatrix(n, zy, shift(zy)), rx: axisMatrix(n, zx, shift(zx)) });
    }
    return out;
  }

  // img [n,n,3] -> [views,224,224,3]
  function sampleViews(img, n, mats) {
    const chw = tf.transpose(img, [2, 0, 1]);                              // [3,n,n]
    const vs = mats.map(({ ry, rx }) => {
      const Ry = tf.tile(tf.tensor3d(ry, [1, INPUT, n]), [3, 1, 1]);
      const Rx = tf.tile(tf.tensor3d(rx, [1, INPUT, n]), [3, 1, 1]);
      return tf.matMul(tf.matMul(Ry, chw), Rx, false, true);               // [3,224,224]
    });
    return tf.transpose(tf.stack(vs), [0, 2, 3, 1]);
  }

  // ---------------------------------------------------------- objectives

  // Logit, not probability: once softmax saturates its gradient vanishes, the
  // logit keeps climbing. `avoid` subtracts a second class ("X but not Y").
  function classObjective(index, avoid = null) {
    return (logits) => {
      let s = tf.mean(logits.slice([0, index], [-1, 1]));
      if (avoid !== null) s = tf.sub(s, tf.mean(logits.slice([0, avoid], [-1, 1])));
      return s;
    };
  }

  // NIMA predicts a distribution over 1..10 ratings; its score is the mean.
  // sign = +1 for "most beautiful", -1 for "least".
  const BUCKETS = tf.range(1, 11).reshape([10, 1]);
  function nimaObjective(sign = 1) {
    return (logits) => tf.mul(sign, tf.mean(tf.matMul(tf.softmax(logits), BUCKETS)));
  }

  function nimaScore(logits) {
    return tf.tidy(() => tf.matMul(tf.softmax(logits), BUCKETS).dataSync()[0]);
  }

  // ------------------------------------------------------------- session

  class Session {
    constructor(model, objective, { size = 256, seed = 1, lr = 0.05, views = 1, robust = true } = {}) {
      this.model = model;
      this.objective = objective;
      this.canvas = new SpectralCanvas(size, seed);
      this.opt = tf.train.adam(lr);
      this.r = rng(seed * 7919 + 1);
      this.views = views;
      this.robust = robust;
      this.steps = 0;
    }

    // One ascent step; returns the objective value.
    step() {
      const { n } = this.canvas;
      const mats = viewMatrices(n, this.views, this.r, { robust: this.robust });
      const cost = this.opt.minimize(() => {
        const img = this.canvas.image();
        const x = sampleViews(img, n, mats);
        return tf.neg(this.objective(this.model.logits(x)));
      }, true, this.canvas.variables);
      const v = -cost.dataSync()[0];
      cost.dispose();
      this.steps++;
      return v;
    }

    // Logits of the whole canvas, as the model would see it un-jittered.
    evaluate() {
      return tf.tidy(() => {
        const img = this.canvas.image();
        const x = tf.image.resizeBilinear(img.expandDims(0), [INPUT, INPUT], false, true);
        return this.model.logits(x);
      });
    }

    image() { return this.canvas.image(); }

    dispose() { this.canvas.dispose(); this.opt.dispose(); }
  }

  return {
    INPUT, MODELS, loadModel, loadWeights, SpectralCanvas, Session, rng,
    viewMatrices, sampleViews, classObjective, nimaObjective, nimaScore, resnet18, mobilenet,
  };
}
