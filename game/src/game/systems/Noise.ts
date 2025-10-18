export class PRNG {
  private state: number;
  constructor(seed: number) {
    this.state = seed >>> 0;
  }
  next(): number {
    // Mulberry32
    let t = (this.state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export function hashStringToSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

export class ValueNoise2D {
  private prng: PRNG;
  private perm: Uint16Array;
  constructor(seed: number) {
    this.prng = new PRNG(seed);
    const p: number[] = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(this.prng.next() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = new Uint16Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
  private randGrid(ix: number, iy: number): number {
    const idx = this.perm[(ix + this.perm[iy & 255]) & 255];
    return idx / 255; // [0,1]
  }

  sample(x: number, y: number): number {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const xf = x - x0, yf = y - y0;
    const v00 = this.randGrid(x0, y0);
    const v10 = this.randGrid(x0 + 1, y0);
    const v01 = this.randGrid(x0, y0 + 1);
    const v11 = this.randGrid(x0 + 1, y0 + 1);
    const u = this.fade(xf);
    const v = this.fade(yf);
    const nx0 = this.lerp(v00, v10, u);
    const nx1 = this.lerp(v01, v11, u);
    return this.lerp(nx0, nx1, v) * 2 - 1; // [-1,1]
  }

  fbm(x: number, y: number, octaves = 4, lacunarity = 2, gain = 0.5): number {
    let amp = 0.5, freq = 1, sum = 0, norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += amp * this.sample(x * freq, y * freq);
      norm += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return sum / norm;
  }
}
