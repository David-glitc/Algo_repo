// KMP (Knuth-Morris-Pratt) string search
// Build prefix-function (pi) to skip comparisons. O(n + m).
export function kmpSearch(text: string, pattern: string): number[] {
  const n = text.length, m = pattern.length;
  if (m === 0) return [];
  const pi = new Array<number>(m).fill(0);
  for (let i = 1; i < m; i++) {
    let j = pi[i - 1];
    while (j > 0 && pattern[i] !== pattern[j]) j = pi[j - 1];
    if (pattern[i] === pattern[j]) j++;
    pi[i] = j;
  }
  const results: number[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = pi[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === m) {
      results.push(i - m + 1);
      j = pi[j - 1];
    }
  }
  return results;
}
