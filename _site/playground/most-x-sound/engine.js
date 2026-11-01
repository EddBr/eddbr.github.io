// engine.js — activation maximization for sound, in the browser.
//
// Freeze YAMNet (AudioSet, 521 classes), then run gradient ascent on a sound
// until it maximally excites one output. As in ../mostx, everything is plain
// TensorFlow.js ops so tf's autodiff gives d(score)/d(sound) on the GPU.
//
//   1. Spectrogram canvas: the sound lives as a log-magnitude spectrogram
//      whose own 2-D Fourier coefficients are scaled by 1/f (the image trick,
//      applied to time × frequency), plus a free phase per STFT cell. An
//      inverse STFT written as matmuls turns that into a 4 s looping waveform.
//   2. YAMNet's frontend, differentiable: 25 ms Hann STFT -> 64 mel bands ->
//      log, also written as matmuls, framed into 0.96 s patches.
//   3. MobileNet v1, rebuilt op-for-op from folded weights (tools/export.py).
//   4. Robustness: each step hears the loop from a random point, at a random
//      level, with a little noise, so the result can't hinge on one alignment.

export function createEngine(tf) {
  const SR = 16000;
  const WIN = 400, HOP = 160, NFFT = 512, BINS = NFFT / 2 + 1;   // YAMNet's STFT
  const MELS = 64, PATCH = 96;

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

  // ------------------------------------------------------------ frontend

  // tf.signal.linear_to_mel_weight_matrix(64, 257, 16000, 125, 7500): HTK mel,
  // triangles on the mel axis, DC row zeroed.
  function melMatrix() {
    const mel = (hz) => 1127 * Math.log(1 + hz / 700);
    const lo = mel(125), hi = mel(7500);
    const edges = Array.from({ length: MELS + 2 }, (_, i) => lo + (hi - lo) * i / (MELS + 1));
    const M = new Float32Array(BINS * MELS);
    for (let k = 1; k < BINS; k++) {
      const m = mel(k * (SR / 2) / (BINS - 1));
      for (let b = 0; b < MELS; b++) {
        const up = (m - edges[b]) / (edges[b + 1] - edges[b]);
        const down = (edges[b + 2] - m) / (edges[b + 2] - edges[b + 1]);
        M[k * MELS + b] = Math.max(0, Math.min(up, down));
      }
    }
    return tf.tensor2d(M, [BINS, MELS]);
  }

  // Each 400-sample frame starts on a 160-sample block boundary, so a frame is
  // three consecutive blocks (480 samples) with the last 80 weighted zero.
  // Periodic Hann is folded into the DFT matrices.
  function analysisMatrices() {
    const C = new Float32Array(3 * HOP * BINS), S = new Float32Array(3 * HOP * BINS);
    for (let n = 0; n < WIN; n++) {
      const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * n / WIN);
      for (let k = 0; k < BINS; k++) {
        const a = 2 * Math.PI * n * k / NFFT;
        C[n * BINS + k] = w * Math.cos(a); S[n * BINS + k] = -w * Math.sin(a);
      }
    }
    return [tf.tensor2d(C, [3 * HOP, BINS]), tf.tensor2d(S, [3 * HOP, BINS])];
  }

  const MEL = melMatrix();
  const [AC, AS] = analysisMatrices();

  // wave [L] (L a multiple of 160) -> |STFT| [L/160 - 2, 257], the frames tf.signal.stft gives.
  function stftMag(wave) {
    const B = wave.reshape([-1, HOP]);
    const T = B.shape[0] - 2;
    const fr = tf.concat([B.slice([0, 0], [T, HOP]), B.slice([1, 0], [T, HOP]), B.slice([2, 0], [T, HOP])], 1);
    const re = tf.matMul(fr, AC), im = tf.matMul(fr, AS);
    return tf.sqrt(tf.add(tf.add(tf.square(re), tf.square(im)), 1e-12));
  }

  const logMel = (wave) => tf.log(tf.add(tf.matMul(stftMag(wave), MEL), 0.001));

  // logmel [T,64], starts -> [P,96,64,1]
  const patches = (lm, starts) => tf.stack(starts.map((s) => lm.slice([s, 0], [PATCH, MELS]))).expandDims(3);

  // ------------------------------------------------------------- network

  const S2 = new Set([2, 4, 6, 12]);
  function yamnet(W, x) {
    x = tf.fused.conv2d({ x, filter: W['stem.w'], bias: W['stem.b'], strides: 2, pad: 'same', activation: 'relu' });
    for (let i = 1; i <= 13; i++) {
      const s = S2.has(i) ? 2 : 1;
      x = tf.fused.depthwiseConv2d({ x, filter: W[`dw${i}.w`], bias: W[`dw${i}.b`], strides: s, pad: 'same', activation: 'relu' });
      x = tf.fused.conv2d({ x, filter: W[`pw${i}.w`], bias: W[`pw${i}.b`], strides: 1, pad: 'same', activation: 'relu' });
    }
    return tf.add(tf.matMul(tf.mean(x, [1, 2]), W['fc.w']), W['fc.b']);
  }

  let weights = null;
  async function loadModel(read) {
    weights = weights || loadWeights(read, 'yamnet');
    const W = await weights;
    return { logits: (x) => yamnet(W, x) };   // x: [P,96,64,1] log-mel patches -> [P,521]
  }

  // Exactly what YAMNet does to a clip: pad to whole patches, hop 0.48 s.
  function patchStarts(T) {
    const out = [];
    for (let s = 0; s + PATCH <= T; s += PATCH / 2) out.push(s);
    return out;
  }

  // ------------------------------------------------------------- canvas

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

  // Synthesis STFT: 512-sample sqrt-Hann frames every 128 samples, circular,
  // so the 4 s clip is a seamless loop. 500 frames × 128 = 64000 samples, which
  // is also a whole number of YAMNet hops.
  const SYN = 512, SHOP = 128, FRAMES = 500, LEN = FRAMES * SHOP;

  // Inverse real DFT with the synthesis window folded in; [257, 512] each.
  function synthesisMatrices() {
    const C = new Float32Array(BINS * SYN), S = new Float32Array(BINS * SYN);
    for (let k = 0; k < BINS; k++) {
      const c = (k === 0 || k === SYN / 2 ? 1 : 2) / SYN;
      for (let n = 0; n < SYN; n++) {
        const w = Math.sqrt(0.5 - 0.5 * Math.cos(2 * Math.PI * n / SYN)) / Math.sqrt(1.5);
        const a = 2 * Math.PI * k * n / SYN;
        C[k * SYN + n] = w * c * Math.cos(a); S[k * SYN + n] = w * c * Math.sin(a);
      }
    }
    return [tf.tensor2d(C, [BINS, SYN]), tf.tensor2d(S, [BINS, SYN])];
  }

  // The log-magnitude spectrogram is an "image" FRAMES tall and 256 bins
  // wide (DC is held at zero), stored as its rfft2 coefficients scaled by 1/f,
  // exactly like ../mostx's SpectralCanvas but one channel and not square.
  class SpectrogramCanvas {
    constructor(seed, { sd = 0.01, decay = 1.5, range = 2.5, phase = 'learned' } = {}) {
      const H = FRAMES, Wd = BINS - 1, K = Wd / 2 + 1;
      this.range = range;
      const r = rng(seed);
      const variable = (vals, shape) => {
        const t = tf.tensor(vals, shape);
        const v = tf.variable(t);
        t.dispose();
        return v;
      };
      this.re = variable(Float32Array.from({ length: H * K }, () => sd * r.normal()), [H, K]);
      this.im = variable(Float32Array.from({ length: H * K }, () => sd * r.normal()), [H, K]);
      const ph = Float32Array.from({ length: H * BINS }, () => 2 * Math.PI * r());
      this.phase = phase === 'learned' ? variable(ph, [H, BINS]) : tf.tensor2d(ph, [H, BINS]);
      this.learnPhase = phase === 'learned';

      const scale = new Float32Array(H * K);
      for (let y = 0; y < H; y++) {
        const fy = (y < H / 2 ? y : y - H) / H;
        for (let k = 0; k < K; k++) {
          const f = Math.max(Math.hypot(fy, k / Wd), 1 / Math.max(H, Wd));
          scale[y * K + k] = 1 / Math.pow(f, decay);
        }
      }
      // normalise so a unit-variance coefficient field gives a ~unit-variance image
      const norm = Math.sqrt(scale.reduce((s, v) => s + v * v, 0) * 2) / (H * Wd);
      this.scale = tf.tensor2d(scale.map((v) => v / norm), [H, K]);

      const mats = (n, m, fn) => {
        const C = new Float32Array(n * m), S = new Float32Array(n * m);
        for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
          const [c, s] = fn(i, j); C[i * m + j] = c; S[i * m + j] = s;
        }
        return [tf.tensor2d(C, [n, m]), tf.tensor2d(S, [n, m])];
      };
      [this.Cy, this.Sy] = mats(H, H, (y, k) => { const a = 2 * Math.PI * k * y / H; return [Math.cos(a), Math.sin(a)]; });
      [this.Cx, this.Sx] = mats(K, Wd, (k, x) => {
        const c = (k === 0 || k === Wd / 2 ? 1 : 2) / (H * Wd), a = 2 * Math.PI * k * x / Wd;
        return [c * Math.cos(a), c * Math.sin(a)];
      });
      [this.IC, this.IS] = synthesisMatrices();
    }

    get variables() { return this.learnPhase ? [this.re, this.im, this.phase] : [this.re, this.im]; }

    // -> [FRAMES, 257] natural-log magnitude, DC bin pinned low
    logMag() {
      return tf.tidy(() => {
        const R = tf.mul(this.re, this.scale), I = tf.mul(this.im, this.scale);
        const A = tf.sub(tf.matMul(R, this.Cx), tf.matMul(I, this.Sx));
        const B = tf.add(tf.matMul(R, this.Sx), tf.matMul(I, this.Cx));
        const img = tf.sub(tf.matMul(this.Cy, A), tf.matMul(this.Sy, B));
        return tf.concat([tf.fill([FRAMES, 1], -8), tf.mul(img, this.range)], 1);
      });
    }

    // -> [LEN] waveform at 16 kHz, RMS-normalised to 0.1 (−20 dBFS)
    wave() {
      return tf.tidy(() => {
        const mag = tf.exp(this.logMag());
        const re = tf.mul(mag, tf.cos(this.phase)), im = tf.mul(mag, tf.sin(this.phase));
        const fr = tf.sub(tf.matMul(re, this.IC), tf.matMul(im, this.IS)).reshape([FRAMES, SYN / SHOP, SHOP]);
        // circular overlap-add: frame t's q-th quarter lands on hop t + q
        let out = null;
        for (let q = 0; q < SYN / SHOP; q++) {
          let part = fr.slice([0, q, 0], [FRAMES, 1, SHOP]).reshape([FRAMES, SHOP]);
          if (q) part = tf.concat([part.slice([FRAMES - q, 0], [q, SHOP]), part.slice([0, 0], [FRAMES - q, SHOP])], 0);
          out = out ? tf.add(out, part) : part;
        }
        const w = out.reshape([LEN]);
        return tf.mul(w, tf.div(0.1, tf.sqrt(tf.add(tf.mean(tf.square(w)), 1e-12))));
      });
    }

    dispose() {
      for (const t of [this.re, this.im, this.phase, this.scale, this.Cy, this.Sy, this.Cx, this.Sx, this.IC, this.IS]) t.dispose();
    }
  }

  // The loop, from `offset`, wrapped round enough to give `frames` STFT frames.
  function rolled(wave, offset, frames) {
    const need = (frames + 2) * HOP;
    const parts = [];
    for (let at = offset, left = need; left > 0;) {
      const n = Math.min(left, LEN - at);
      parts.push(wave.slice([at], [n]));
      left -= n; at = 0;
    }
    return parts.length > 1 ? tf.concat(parts) : parts[0];
  }

  // ---------------------------------------------------------- objectives

  // Logit, not sigmoid score: once the sigmoid saturates its gradient vanishes.
  function classObjective(index, avoid = null) {
    return (logits) => {
      let s = tf.mean(logits.slice([0, index], [-1, 1]));
      if (avoid !== null) s = tf.sub(s, tf.mean(logits.slice([0, avoid], [-1, 1])));
      return s;
    };
  }

  // ------------------------------------------------------------- session

  const LOOP_FRAMES = LEN / HOP;   // 400 YAMNet frames go once round the loop

  class Session {
    constructor(model, objective, { seed = 1, lr = 0.05, patches: P = 4, robust = true, phase = 'learned', decay = 1.5, range = 2.5 } = {}) {
      this.model = model;
      this.objective = objective;
      this.canvas = new SpectrogramCanvas(seed, { phase, decay, range });
      this.opt = tf.train.adam(lr);
      this.r = rng(seed * 7919 + 1);
      this.P = P;
      this.robust = robust;
      this.steps = 0;
    }

    step() {
      const r = this.r;
      const offset = this.robust ? Math.floor(r() * LEN) : 0;
      const T = PATCH + 48 * (this.P - 1);
      const starts = Array.from({ length: this.P }, (_, i) => i * 48);
      const gain = this.robust ? Math.pow(10, (r() * 12 - 9) / 20) : 1;   // −9…+3 dB
      const noise = this.robust ? tf.randomNormal([(T + 2) * HOP], 0, 0.003, 'float32', Math.floor(r() * 1e9)) : null;
      const cost = this.opt.minimize(() => {
        let w = tf.mul(rolled(this.canvas.wave(), offset, T), gain);
        if (noise) w = tf.add(w, noise);
        return tf.neg(this.objective(this.model.logits(patches(logMel(w), starts))));
      }, true, this.canvas.variables);
      noise?.dispose();
      const v = -cost.dataSync()[0];
      cost.dispose();
      this.steps++;
      return v;
    }

    // Logits for every patch once round the loop, un-jittered.
    evaluate() {
      return tf.tidy(() => {
        const lm = logMel(rolled(this.canvas.wave(), 0, LOOP_FRAMES + PATCH));
        return this.model.logits(patches(lm, patchStarts(LOOP_FRAMES + PATCH).filter((s) => s < LOOP_FRAMES)));
      });
    }

    wave() { return this.canvas.wave(); }

    // |STFT| of what you hear, YAMNet's resolution, once round: [400, 257]
    spectrogram() { return tf.tidy(() => stftMag(rolled(this.canvas.wave(), 0, LOOP_FRAMES))); }

    dispose() { this.canvas.dispose(); this.opt.dispose(); }
  }

  return {
    SR, LEN, MELS, PATCH, BINS, loadModel, loadWeights, Session, SpectrogramCanvas, rng,
    stftMag, logMel, patches, patchStarts, classObjective, yamnet, melMatrix,
  };
}
