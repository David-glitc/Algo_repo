// Binary Exponentiation (power)
export function binPow(base: number | bigint, exp: number): number | bigint {
  let b = typeof base === "bigint" ? base : BigInt(Math.floor(base));
  let e = BigInt(exp);
  let res = BigInt(1);
  while (e > 0) {
    if (e & BigInt(1)) res *= b;
    b *= b;
    e >>= BigInt(1);
  }
  if (typeof base === "number") {
    const num = Number(res);
    if (Number.isFinite(num) && Math.abs(num) <= Number.MAX_SAFE_INTEGER) return num;
  }
  return res;
}
