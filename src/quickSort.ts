// Quick Sort (in-place randomized pivot)
export function quickSort(arr: number[]): number[] {
  const a = arr.slice();
  function qs(l: number, r: number) {
    if (l >= r) return;
    const pivotIdx = l + Math.floor(Math.random() * (r - l + 1));
    const pivot = a[pivotIdx];
    let i = l, j = r;
    while (i <= j) {
      while (a[i] < pivot) i++;
      while (a[j] > pivot) j--;
      if (i <= j) {
        const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        i++; j--;
      }
    }
    if (l < j) qs(l, j);
    if (i < r) qs(i, r);
  }
  qs(0, a.length - 1);
  return a;
}
