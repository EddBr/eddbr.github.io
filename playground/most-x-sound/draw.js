// draw.js — spectrogram picture, shared by the page and tools/render.mjs.

// magma, sampled at 9 stops
const STOPS = [
  [0, 0, 4], [28, 16, 68], [79, 18, 123], [129, 37, 129], [181, 54, 122],
  [229, 80, 100], [251, 135, 97], [254, 194, 135], [252, 253, 191],
];
const LUT = new Uint8Array(256 * 3);
for (let i = 0; i < 256; i++) {
  const x = i / 255 * (STOPS.length - 1), j = Math.min(Math.floor(x), STOPS.length - 2), f = x - j;
  for (let c = 0; c < 3; c++) LUT[i * 3 + c] = Math.round(STOPS[j][c] * (1 - f) + STOPS[j + 1][c] * f);
}

// mag: Float32Array [frames × bins] |STFT| (bins span 0…8 kHz).
// Returns RGBA pixels W×H, time left→right, frequency on a mel axis bottom→top,
// 70 dB of range below the loudest cell.
export function spectrogramPixels(mag, frames, bins, W, H, { range = 70 } = {}) {
  const mel = (hz) => 1127 * Math.log(1 + hz / 700);
  const top = mel(8000);
  const db = new Float32Array(mag.length);
  let peak = -Infinity;
  for (let i = 0; i < mag.length; i++) { db[i] = 20 * Math.log10(mag[i] + 1e-9); if (db[i] > peak) peak = db[i]; }
  const rowBin = new Float32Array(H);
  for (let y = 0; y < H; y++) {
    const m = (1 - (y + 0.5) / H) * top;
    rowBin[y] = 700 * (Math.exp(m / 1127) - 1) / 8000 * (bins - 1);
  }
  const px = new Uint8ClampedArray(W * H * 4);
  for (let x = 0; x < W; x++) {
    const t0 = Math.floor(x * frames / W), t1 = Math.max(t0 + 1, Math.floor((x + 1) * frames / W));
    for (let y = 0; y < H; y++) {
      const b = rowBin[y], b0 = Math.floor(b), f = b - b0, b1 = Math.min(b0 + 1, bins - 1);
      let v = -Infinity;
      for (let t = t0; t < t1; t++) v = Math.max(v, db[t * bins + b0] * (1 - f) + db[t * bins + b1] * f);
      const i = Math.max(0, Math.min(255, Math.round((v - peak + range) / range * 255)));
      const o = (y * W + x) * 4;
      px[o] = LUT[i * 3]; px[o + 1] = LUT[i * 3 + 1]; px[o + 2] = LUT[i * 3 + 2]; px[o + 3] = 255;
    }
  }
  return px;
}

// Float32 mono -> 16-bit PCM WAV bytes
export function wavBytes(samples, sr) {
  const buf = new ArrayBuffer(44 + samples.length * 2), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 32767, true);
  return new Uint8Array(buf);
}
