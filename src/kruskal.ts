// Minimum Spanning Tree - Kruskal
export function kruskal(n: number, edges: Array<[number, number, number]>) {
  edges = edges.slice().sort((a, b) => a[2] - b[2]);
  const parent = new Array(n).fill(0).map((_, i) => i);
  const rank = new Array(n).fill(0);
  function find(a: number): number {
    if (parent[a] !== a) parent[a] = find(parent[a]);
    return parent[a];
  }
  function unite(a: number, b: number) {
    a = find(a); b = find(b);
    if (a === b) return false;
    if (rank[a] < rank[b]) [a, b] = [b, a];
    parent[b] = a;
    if (rank[a] === rank[b]) rank[a]++;
    return true;
  }
  const mst: Array<[number, number, number]> = [];
  for (const e of edges) {
    if (unite(e[0], e[1])) mst.push(e);
  }
  return mst;
}
