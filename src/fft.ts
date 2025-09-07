// FFT (Cooley-Tukey recursive). Real + Imag pair implementation.
// Explanation: transforms complex vector length power of two. O(n log n).

export class Complex {
  re: number;
  im: number;
  constructor(re = 0, im = 0) { this.re = re; this.im = im; }
  add(b: Complex) { return new Complex(this.re + b.re, this.im + b.im); }
  sub(b: Complex) { return new Complex(this.re - b.re, this.im - b.im); }
  mul(b: Complex) {
    return new Complex(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re);
  }
}

function isPowerOfTwo(n: number) {
  return (n & (n - 1)) === 0;
}

export function fft(input: Complex[], invert = false): Complex[] {
  const n = input.length;
  if (!isPowerOfTwo(n)) throw new Error("FFT input length must be power of 2");
  if (n === 1) return [new Complex(input[0].re, input[0].im)];
  const even = fft(input.filter((_, i) => (i & 1) === 0), invert);
  const odd = fft(input.filter((_, i) => (i & 1) === 1), invert);
  const ang = (2 * Math.PI) / n * (invert ? -1 : 1);
  const out = new Array(n);
  for (let k = 0; k < n / 2; k++) {
    const w = new Complex(Math.cos(ang * k), Math.sin(ang * k));
    const t = w.mul(odd[k]);
    out[k] = even[k].add(t);
    out[k + n / 2] = even[k].sub(t);
  }
  if (invert) {
    for (let i = 0; i < n; i++) {
      out[i].re /= 2;
      out[i].im /= 2;
    }
  }
  return out;
}

// Convolution example helper (real arrays)
export function convolution(a: number[], b: number[]): number[] {
  let n = 1;
  while (n < a.length + b.length) n <<= 1;
  const fa: Complex[] = new Array(n).fill(null).map(() => new Complex(0, 0));
  const fb: Complex[] = new Array(n).fill(null).map(() => new Complex(0, 0));
  for (let i = 0; i < a.length; i++) fa[i] = new Complex(a[i], 0);
  for (let i = 0; i < b.length; i++) fb[i] = new Complex(b[i], 0);
  const faF = fft(fa);
  const fbF = fft(fb);
  const fc = new Array(n);
  for (let i = 0; i < n; i++) fc[i] = faF[i].mul(fbF[i]);
  // inverse FFT via repeated application and normalization
  // naive: use FFT with invert flag true
  const inv = fft(fc, true);
  return inv.slice(0, a.length + b.length - 1).map(c => Math.round(c.re));
}
