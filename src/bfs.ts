// Breadth-First Search
export function bfs(adj: number[][], start: number): number[] {
  const n = adj.length;
  const visited = new Array(n).fill(false);
  const q: number[] = [];
  const out: number[] = [];
  visited[start] = true;
  q.push(start);
  while (q.length) {
    const u = q.shift()!;
    out.push(u);
    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
      }
    }
  }
  return out;
}
