# Algorithms — Implementations & Thorough Documentation

**Scope & deliverable**: This document contains for each requested algorithm (1) a concise technical overview, (2) origin / who created it and when, (3) the core idea and intuition, (4) a short formal / mathematical representation (recurrence relations, correctness invariants), (5) complexity bounds, (6) a TypeScript implementation compatible with **Deno / Bun**, and (7) pragmatic notes and usage guidance including common pitfalls.

> *Style*: rigorous, practical, production-minded. Use this as both a learning resource and a deliverable you can copy into a codebase or documentation portal.

---

## Table of contents

1. Binary Search
2. Knuth–Morris–Pratt (KMP)
3. Quick Sort
4. Merge Sort
5. Fast Fourier Transform (FFT)
6. Depth-First Search (DFS)
7. Breadth-First Search (BFS)
8. Topological Sort
9. Lowest Common Ancestor (LCA)
10. A\* Search
11. Dijkstra Shortest Path
12. Minimum Spanning Tree (Kruskal)
13. Binary Exponentiation
14. Knapsack (0/1) — Dynamic Programming
15. Longest Common Subsequence (LCS)
16. Greatest Common Divisor (GCD)

---

> **Notes on the code**: All TypeScript examples are written so they run on recent **Deno** or **Bun** builds. They avoid browser-only or Node-only APIs. Each implementation is intentionally idiomatic and clear rather than hyper-optimized; replace micro-structures (like heap) with highly-tuned libraries in production if you need raw throughput.

---

# 1) Binary Search

**Overview**
Binary search locates the position of a target value within a sorted array by repeatedly halving the search interval. It is the canonical example of logarithmic-time search.

**Origin**
Binary search is an old technique in algorithmic thinking; its first references in computing literature appear in early papers and textbooks. It was discussed in early computer literature (e.g., John Mauchly & early ACM-era texts) and formalized in modern algorithm textbooks (Knuth and others).

**Core idea**
Compare the target to the middle element; if equal, return; otherwise discard half of the array (where the target cannot be) and repeat.

**Mathematical representation / proof sketch**
If `n` elements remain, one comparison reduces the domain to at most `⌈n/2⌉`. The recurrence for cost `T(n)` (number of comparisons) is:

```
T(n) = T(n/2) + O(1)
```

Solving gives `T(n) = O(log n)`.

**Complexity**
Time: `O(log n)` worst/average, `O(1)` best (if found at mid)
Space: `O(1)` (iterative)

**Implementation (TypeScript — iterative)**

```ts
export function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = arr[mid];
    if (v === target) return mid;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

**Practical notes**

* Off-by-one errors are common; always choose consistent invariants (e.g., `[lo, hi]` inclusive vs `[lo, hi)` exclusive).
* For floating point or comparator-based search, the comparator must induce a strict weak ordering.

---

# 2) Knuth–Morris–Pratt (KMP) — string search

**Overview**
KMP finds all occurrences of a pattern `P` of length `m` in text `T` of length `n` in `O(n + m)` time by precomputing a failure table (prefix function) that tells how much the pattern can be shifted after a mismatch.

**Origin**
Published by Donald Knuth, James H. Morris, Jr., and Vaughan Pratt in 1977; known as the Knuth–Morris–Pratt algorithm.

**Core idea**
Precompute the longest proper prefix of the pattern that is also a suffix ending at each position. On mismatch, jump the pattern forward using that table rather than restarting from the beginning.

**Mathematical representation**
Define the prefix function `π[i]` as the length of the longest proper prefix of `P[0..i]` that is also a suffix. The computation of `π` runs in `O(m)`. The scan of text uses `π` to keep `j`, the current matched length, non-decreasing overall (across scans), yielding total `O(n)`.

**Complexity**
Time: `O(n + m)`
Space: `O(m)` for the prefix table

**Implementation**

```ts
export function kmpSearch(text: string, pattern: string): number[] {
  const n = text.length, m = pattern.length;
  if (m === 0) return [];
  const pi = new Array(m).fill(0);
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
    if (j === m) { results.push(i - m + 1); j = pi[j - 1]; }
  }
  return results;
}
```

**Practical notes**

* Works best when pattern is not tiny; for many very-short patterns, Boyer–Moore variants or simple memchr-like operations can be faster in practice.

---

# 3) Quick Sort

**Overview**
QuickSort is a divide-and-conquer sort that partitions around a pivot, then recursively sorts partitions.

**Origin**
Developed by C. A. R. (Tony) Hoare in 1959 and published in 1961.

**Core idea**
Select a pivot, partition the array so items < pivot are left and > pivot are right, recurse. Average cost `O(n log n)`; worst-case `O(n^2)` when partitions are highly unbalanced (e.g., sorted input with poor pivot choice).

**Mathematical representation**
Recurrence (average balanced split):

```
T(n) = 2 T(n/2) + O(n) => T(n) = O(n log n)
```

Worst-case (bad pivot):

```
T(n) = T(n-1) + O(n) => O(n^2)
```

**Complexity**
Time: average `O(n log n)`, worst `O(n^2)`.
Space: `O(log n)` auxiliary with good in-place partitioning.

**Implementation (randomized pivot; in-place)**

```ts
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
      if (i <= j) { [a[i], a[j]] = [a[j], a[i]]; i++; j--; }
    }
    if (l < j) qs(l, j);
    if (i < r) qs(i, r);
  }
  qs(0, a.length - 1);
  return a;
}
```

**Practical notes**

* Use randomized pivot or median-of-three to avoid worst-case on sorted inputs.
* If worst-case guarantees are required, use introsort (hybrid QuickSort + HeapSort).

---

# 4) Merge Sort

**Overview**
Merge Sort recursively splits the array, sorts halves, and merges them back. Stable by design.

**Origin**
Invented by John von Neumann in 1945.

**Core idea**
Divide the array into two halves, sort both halves recursively, then merge the sorted halves with a linear pass.

**Mathematical representation**
Recurrence: `T(n) = 2 T(n/2) + Θ(n)` ⇒ `T(n) = Θ(n log n)` (Master Theorem)

**Complexity**
Time: `O(n log n)` worst/average/best; Space: `O(n)` auxiliary (top-down). Can implement in-place variants but more complex.

**Implementation**

```ts
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr.slice();
  const mid = (arr.length / 2) | 0;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]); else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
```

**Practical notes**

* Stable sorting; use when preserving input order on ties matters.
* Useful for external sorting (merge phase fits I/O patterns).

---

# 5) Fast Fourier Transform (FFT)

**Overview**
FFT computes the Discrete Fourier Transform (DFT) of a sequence in `O(n log n)` time. The DFT transforms a sequence from time domain to frequency domain. FFT reduces naive `O(n^2)` DFT cost.

**Origin**
The Cooley–Tukey algorithm (the modern FFT) was published in 1965 by J. W. Cooley and John Tukey; earlier mathematicians (notably Gauss) had similar divide-and-conquer observations for special sizes.

**Core idea**
Factor the DFT of size `N = N1*N2` into smaller DFTs. The radix-2 Cooley–Tukey variant repeatedly splits even/odd indices and recombines using twiddle factors `ω = e^{-2π i / N}`. Complexity `O(N log N)`.

**Mathematical representation**
Discrete Fourier Transform (DFT):

$X_k = \sum_{n=0}^{N-1} x_n e^{-2\pi i k n / N}$

Cooley–Tukey radix-2 recurrence (N even):

$X_k = E_k + \omega_N^k \cdot O_k$
$X_{k+N/2} = E_k - \omega_N^k \cdot O_k$

where `E` and `O` are DFTs of even and odd indexed subsequences.

**Complexity**
Time: `O(N log N)` for highly composite N
Space: `O(N)` (typical implementations)

**Implementation (simple recursive complex class)**

```ts
class Complex { constructor(public re = 0, public im = 0) {} add(b: Complex) { return new Complex(this.re + b.re, this.im + b.im); } sub(b: Complex) { return new Complex(this.re - b.re, this.im - b.im); } mul(b: Complex) { return new Complex(this.re*b.re - this.im*b.im, this.re*b.im + this.im*b.re); } }
function isPowerOfTwo(n: number) { return (n & (n - 1)) === 0; }
export function fft(input: Complex[], invert = false): Complex[] {
  const n = input.length;
  if (!isPowerOfTwo(n)) throw new Error("FFT input length must be power of 2");
  if (n === 1) return [new Complex(input[0].re, input[0].im)];
  const even = fft(input.filter((_, i) => (i & 1) === 0), invert);
  const odd = fft(input.filter((_, i) => (i & 1) === 1), invert);
  const ang = (2 * Math.PI) / n * (invert ? -1 : 1);
  const out = new Array(n);
  for (let k = 0; k < n / 2; k++) {
    const w = new Complex(Math.cos(ang*k), Math.sin(ang*k));
    const t = w.mul(odd[k]);
    out[k] = even[k].add(t);
    out[k + n/2] = even[k].sub(t);
  }
  if (invert) for (let i = 0; i < n; i++) { out[i].re /= 2; out[i].im /= 2; }
  return out;
}
```

**Practical notes**

* Recursive FFT is easy to read; iterative in-place FFT with bit-reversal is faster and memory-friendlier for large `N`.
* For production DSP, use a library or a WebAssembly implementation.

---

# 6) Depth-First Search (DFS)

**Overview**
DFS explores as far as possible along each branch before backtracking. It is used for connected components, cycle detection, topological sorting (via finishing times), and many graph algorithms.

**Origin**
A DFS-like approach was used in maze-solving by Charles Pierre Trémaux in the 19th century; modern formalizations emerged in early CS literature.

**Core idea**
Recursively visit unvisited neighbors, marking nodes as visited; stack-based traversal equivalent.

**Mathematical representation**
DFS runs in `O(V + E)` where V = number of vertices and E = number of edges; each vertex and edge is processed at most a constant number of times in adjacency-list representation.

**Implementation (recursive)**

```ts
export function dfs(adj: number[][], start: number): number[] {
  const n = adj.length; const visited = new Array(n).fill(false); const out: number[] = [];
  function go(u: number) { visited[u] = true; out.push(u); for (const v of adj[u]) if (!visited[v]) go(v); }
  go(start);
  return out;
}
```

**Practical notes**

* For very deep graphs use iterative DFS to avoid call-stack overflow, or increase stack allowance if runtime supports it.

---

# 7) Breadth-First Search (BFS)

**Overview**
BFS explores vertices in layers by increasing distance from the start node. It gives shortest paths (in unweighted graphs) and runs in `O(V + E)`.

**Origin**
BFS concepts appear in early computing history (Konrad Zuse’s work 1940s) and rediscovered and popularized by Edward F. Moore in 1959.

**Core idea**
Use a queue; visit neighbors and enqueue them. Each step processes a node and its adjacency list.

**Implementation**

```ts
export function bfs(adj: number[][], start: number): number[] {
  const n = adj.length; const visited = new Array(n).fill(false); const q: number[] = []; const out: number[] = [];
  visited[start] = true; q.push(start);
  while (q.length) {
    const u = q.shift()!; out.push(u);
    for (const v of adj[u]) if (!visited[v]) { visited[v] = true; q.push(v); }
  }
  return out;
}
```

**Practical notes**

* For large graphs, using `shift()` may be O(n) in some JS runtimes; prefer a circular buffer queue for high-throughput needs.

---

# 8) Topological Sort

**Overview**
A topological order of a DAG is a linear ordering of vertices such that for every directed edge `u -> v`, `u` comes before `v`.

**Origin**
A standard algorithm using Kahn's method was described by Arthur B. Kahn (1962). DFS-based topological sorting (ordering by finishing times) is another classic approach.

**Core idea**
Kahn’s algorithm: repeatedly remove nodes with in-degree 0 and append to ordering; reduce indegrees of neighbors.

**Algorithmic invariants / correctness**
If the graph has a cycle, Kahn's algorithm cannot remove all nodes; the remaining nodes indicate a cycle.

**Implementation (Kahn)**

```ts
export function topologicalSort(adj: number[][]): number[] | null {
  const n = adj.length; const indeg = new Array(n).fill(0);
  for (let u = 0; u < n; u++) for (const v of adj[u]) indeg[v]++;
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!; order.push(u);
    for (const v of adj[u]) { indeg[v]--; if (indeg[v] === 0) q.push(v); }
  }
  if (order.length !== n) return null; // cycle
  return order;
}
```

**Complexity**
Time: `O(V + E)`

---

# 9) Lowest Common Ancestor (LCA)

**Overview**
Given a rooted tree, the LCA of nodes `u` and `v` is the deepest node that is ancestor to both. Efficient methods preprocess the tree to answer queries fast.

**Origin**
The problem statement was formalized by Aho, Hopcroft, and Ullman (1973). Optimal linear-time preprocessing with constant-time queries was achieved by Harel & Tarjan (1984) and later simplified by others; Tarjan (off-line LCA) produced an efficient offline algorithm in 1979.

**Core idea**
Binary lifting (sparse table) preprocesses parents `2^k` above each node so queries shift nodes to the same depth and then jump both upward by powers of two.

**Mathematical representation**
Precompute `up[k][v] = ancestor of v 2^k steps above` for `k` in `[0, log N)`. Then to raise a node by distance `d`, decompose `d` in binary and climb by `up[k]` accordingly.

**Complexity**
Preprocess: `O(N log N)` time and `O(N log N)` space. Query: `O(log N)`.

**Implementation (binary lifting)**

```ts
export class LCA {
  n: number; LOG: number; up: number[][]; depth: number[]; adj: number[][];
  constructor(adj: number[][], root = 0) {
    this.n = adj.length; this.adj = adj; this.LOG = Math.ceil(Math.log2(Math.max(2, this.n)));
    this.up = Array.from({ length: this.LOG }, () => new Array(this.n).fill(-1));
    this.depth = new Array(this.n).fill(0);
    this.dfs(root, root);
    for (let k = 1; k < this.LOG; k++) for (let v = 0; v < this.n; v++) {
      const mid = this.up[k - 1][v]; this.up[k][v] = mid === -1 ? -1 : this.up[k - 1][mid];
    }
  }
  private dfs(u: number, p: number) {
    this.up[0][u] = p;
    for (const v of this.adj[u]) if (v !== p) { this.depth[v] = this.depth[u] + 1; this.dfs(v, u); }
  }
  query(u: number, v: number): number {
    if (this.depth[u] < this.depth[v]) [u, v] = [v, u];
    let diff = this.depth[u] - this.depth[v];
    for (let k = 0; k < this.LOG; k++) if (diff & (1 << k)) u = this.up[k][u];
    if (u === v) return u;
    for (let k = this.LOG - 1; k >= 0; k--) {
      if (this.up[k][u] !== this.up[k][v]) { u = this.up[k][u]; v = this.up[k][v]; }
    }
    return this.up[0][u];
  }
}
```

**Practical notes**

* Binary lifting is straightforward and efficient for many use cases. Use Euler tour + RMQ or Farach–Colton & Bender for constant-time queries if you have high query volume and need faster answers.

---

# 10) A\* Search

**Overview**
A\* is a best-first search algorithm that uses `f(n) = g(n) + h(n)` to guide exploration, where `g(n)` is cost from start to node `n`, and `h(n)` is a heuristic estimate of cost from `n` to goal.

**Origin**
Published by Peter Hart, Nils Nilsson and Bertram Raphael (SRI) in 1968.

**Core idea**
If `h` is admissible (never overestimates true remaining cost), A\* returns an optimal path; the heuristic narrows exploration to promising nodes.

**Mathematical representation**
`f(n) = g(n) + h(n)`. For admissibility: `∀n, h(n) ≤ h*(n)` where `h*(n)` is true cost to goal.

**Implementation (grid, Manhattan heuristic)**

```ts
type NodeKey = string; function key(x: number, y: number) { return `${x},${y}`; }
export function astarGrid(start: [number, number], goal: [number, number], grid: number[][]) {
  const R = grid.length, C = grid[0].length;
  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < R && y < C;
  const h = (x: number, y: number) => Math.abs(x - goal[0]) + Math.abs(y - goal[1]);
  const open = new Map<NodeKey, number>(); const gScore = new Map<NodeKey, number>(); const parent = new Map<NodeKey, NodeKey | null>();
  const startKey = key(start[0], start[1]); open.set(startKey, h(start[0], start[1])); gScore.set(startKey, 0); parent.set(startKey, null);
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (open.size) {
    let curKey: NodeKey | null = null; let curF = Infinity;
    for (const [k, f] of open) if (f < curF) { curF = f; curKey = k; }
    if (!curKey) break;
    open.delete(curKey);
    const [cx, cy] = curKey.split(',').map(Number);
    if (cx === goal[0] && cy === goal[1]) { const path: [number, number][] = []; let p: NodeKey | null = curKey; while (p) { path.push(p.split(',').map(Number) as [number, number]); p = parent.get(p) ?? null; } path.reverse(); return path; }
    const gCur = gScore.get(curKey)!;
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (!inBounds(nx, ny) || grid[nx][ny] === 1) continue;
      const nk = key(nx, ny); const tentativeG = gCur + 1;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) { parent.set(nk, curKey); gScore.set(nk, tentativeG); open.set(nk, tentativeG + h(nx, ny)); }
    }
  }
  return null;
}
```

**Practical notes**

* The choice of heuristic is mission-critical: admissible + consistent heuristics give optimality and faster convergence.
* Implement open set as a binary heap (priority queue) for performance; using a Map and scanning min is simple but slow.

---

# 11) Dijkstra Shortest Path

**Overview**
Dijkstra finds shortest paths from a source to all nodes in a weighted graph with non-negative edge weights.

**Origin**
Conceived by Edsger W. Dijkstra in 1956; published in 1959.

**Core idea**
Greedy relaxation using a priority queue: pick the unsettled node with smallest tentative distance, relax its edges.

**Mathematical representation**
Correctness follows from the non-negativity of edge weights which guarantees that when a node is extracted from the priority queue, its shortest distance is finalized.

**Complexity**
With a binary heap: `O((V + E) log V)`. With Fibonacci heap: `O(V log V + E)`.

**Implementation (binary heap)**

```ts
class MinHeap<T> { data: { key: number; val: T }[] = [];
  size() { return this.data.length; }
  push(key: number, val: T) { this.data.push({ key, val }); let i = this.data.length - 1; while (i > 0) { const p = ((i - 1) >> 1); if (this.data[p].key <= this.data[i].key) break; [this.data[p], this.data[i]] = [this.data[i], this.data[p]]; i = p; } }
  pop(): { key:number; val:T } | null { if (!this.data.length) return null; const res = this.data[0]; const last = this.data.pop()!; if (this.data.length) { this.data[0] = last; let i = 0; while (true) { const l = i*2+1, r = i*2+2; let s = i; if (l < this.data.length && this.data[l].key < this.data[s].key) s = l; if (r < this.data.length && this.data[r].key < this.data[s].key) s = r; if (s === i) break; [this.data[i], this.data[s]] = [this.data[s], this.data[i]]; i = s; } } return res; } }

export function dijkstra(adj: Array<Array<[number, number]>>, src: number): number[] {
  const n = adj.length; const dist = new Array(n).fill(Infinity); dist[src] = 0; const pq = new MinHeap<number>(); pq.push(0, src);
  while (pq.size()) {
    const cur = pq.pop()!; const u = cur.val; const d = cur.key; if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) if (dist[v] > dist[u] + w) { dist[v] = dist[u] + w; pq.push(dist[v], v); }
  }
  return dist;
}
```

**Practical notes**

* Dijkstra requires non-negative weights. For negative weights, use Bellman–Ford or Johnson's algorithm for all-pairs.
* Use an indexed priority queue when you need `decrease-key` support for performance.

---

# 12) Minimum Spanning Tree — Kruskal

**Overview**
Kruskal builds an MST by sorting edges by weight and adding them unless they create a cycle (checked by union-find).

**Origin**
Published by Joseph Kruskal in 1956.

**Core idea**
Greedily take smallest edges that connect components; use disjoint-set (union-find) to detect cycles.

**Complexity**
Sorting edges `O(E log E)` dominates; union-find operations are nearly `O(1)` amortized (inverse-Ackermann).

**Implementation**

```ts
export function kruskal(n: number, edges: Array<[number, number, number]>) {
  edges = edges.slice().sort((a,b) => a[2] - b[2]);
  const parent = new Array(n).fill(0).map((_,i)=>i); const rank = new Array(n).fill(0);
  function find(a:number):number { if (parent[a] !== a) parent[a] = find(parent[a]); return parent[a]; }
  function unite(a:number,b:number){ a = find(a); b = find(b); if (a===b) return false; if (rank[a]<rank[b]) [a,b]=[b,a]; parent[b]=a; if (rank[a]===rank[b]) rank[a]++; return true; }
  const mst: Array<[number, number, number]> = [];
  for (const e of edges) if (unite(e[0], e[1])) mst.push(e);
  return mst;
}
```

**Practical notes**

* Kruskal is excellent for sparse graphs; Prim’s algorithm is often preferred for dense graphs (especially with fast adjacency / Fibonacci heap).

---

# 13) Binary Exponentiation (Exponentiation by Squaring)

**Overview**
Efficiently compute `a^n` in `O(log n)` multiplications by exponentiation by squaring.

**Origin**
A classical mathematical technique; in computing it’s called binary exponentiation (square-and-multiply). The idea is ancient in arithmetic; modern algorithmic formulation is standard.

**Mathematical representation**
Using binary expansion of `n`: if `n = sum b_k 2^k`, then `a^n = product over k with b_k=1 of a^{2^k}`. Recurrence:

```
pow(a, n): if n==0 return 1; t = pow(a, floor(n/2)); if n%2==0 return t*t else return t*t*a
```

**Implementation**

```ts
export function binPow(base: number | bigint, exp: number): number | bigint {
  let b = typeof base === 'bigint' ? base : BigInt(Math.floor(base));
  let e = BigInt(exp);
  let res = BigInt(1);
  while (e > 0) {
    if (e & BigInt(1)) res *= b;
    b *= b;
    e >>= BigInt(1);
  }
  if (typeof base === 'number') {
    const num = Number(res);
    if (Number.isFinite(num) && Math.abs(num) <= Number.MAX_SAFE_INTEGER) return num;
  }
  return res;
}
```

**Practical notes**

* Use modular reductions inside loops for modular exponentiation (modular exponentiation is central to cryptography). Use BigInt in JS/TS if exponents/results overflow 53-bit safe integers.

---

# 14) Knapsack Problem (0/1) — dynamic programming

**Overview**
Given `n` items with weights `w_i` and values `v_i`, choose subset with total weight ≤ `W` that maximizes total value.

**Origin**
A classical optimization / combinatorial problem; formalized in operations research and CS literature in the mid-20th century and widely studied as an NP-hard family (decision variant can be NP-complete). The dynamic programming pseudo-polynomial algorithm is classical.

**Mathematical representation**
DP recurrence for 0/1 knapsack:

```
DP[i][w] = max(DP[i-1][w], DP[i-1][w-w_i] + v_i)  (if w >= w_i)
```

Space-optimized: use one-dimensional `dp[w]` iterating items outer loop and weight inner loop in decreasing order.

**Implementation (1D DP)**

```ts
export function knapsack(values: number[], weights: number[], W: number) {
  const n = values.length; const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}
```

**Complexity**
Time: `O(nW)` pseudo-polynomial. Space: `O(W)` (1D DP).

**Practical notes**

* Use meet-in-the-middle, branch-and-bound, or approximate schemes for large `W` or `n`.

---

# 15) Longest Common Subsequence (LCS)

**Overview**
Find the longest subsequence present in two sequences. Classic dynamic programming problem with `O(nm)` DP solution.

**Origin**
A fundamental string problem in computer science; quadratic DP solution is taught in classic algorithm texts.

**Mathematical representation**
DP recurrence:

```
LCS[i][j] = 0 if i==0 or j==0
else if a[i-1]==b[j-1] LCS[i][j] = 1 + LCS[i-1][j-1]
else LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])
```

**Implementation**

```ts
export function lcs(a: string, b: string): number {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1; else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
  }
  return dp[n][m];
}
```

**Practical notes**

* LCS is quadratic and hard to beat in general; there are recent subquadratic approximations for special cases.

---

# 16) Greatest Common Divisor (GCD) — Euclidean algorithm

**Overview**
Compute the greatest common divisor `gcd(a, b)` via repeated remainder operations. Extremely efficient and ancient.

**Origin**
Described by Euclid in *Elements*, circa 300 BCE.

**Mathematical representation**
Euclidean recurrence:

```
gcd(a, b) = gcd(b, a mod b) with gcd(a, 0) = a
```

**Implementation**

```ts
export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) { const t = a % b; a = b; b = t; }
  return a;
}
```

**Practical notes**

* Extended Euclidean algorithm returns Bézout coefficients useful for modular inverses in cryptography.

---

# Appendix: Benchmark harness & integration notes

1. The suite includes a single-file harness (TS) that instantiates representative inputs and times runs using `performance.now()`.
2. For production benchmarking, add warmup rounds, CPU pinning, and repeated-run logging (CSV), and use system-level profilers if wall-clock precision matters.
3. Replace placeholder `Map`-based priority queues with an indexed heap for A\*/Dijkstra to achieve expected asymptotics.

---

# Final remarks

This deliverable is an actionable technical artifact. If you want I will:

* Output the entire TypeScript file for immediate execution with a comprehensive benchmark harness (the code shown in previous interaction is available and can be attached as a file).
* Replace recursive FFT with an iterative in-place FFT and provide microbenchmarks comparing both.
* Produce unit tests and a CI pipeline (Deno test + coverage) and a CSV export of benchmarks for ingestion.

Tell me which follow-up you want and I will produce the next artifact as an additional deliverable.
