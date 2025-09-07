// Depth-First Search
export function dfs(adj: number[][], start: number): number[] {
  const n = adj.length;
  const visited = new Array(n).fill(false);
  const out: number[] = [];
  function go(u: number) {
    visited[u] = true;
    out.push(u);
    for (const v of adj[u]) if (!visited[v]) go(v);
  }
  go(start);
  return out;
}
