// Lowest Common Ancestor (binary lifting)
export class LCA {
  n: number;
  LOG: number;
  up: number[][];
  depth: number[];
  adj: number[][];
  constructor(adj: number[][], root = 0) {
    this.n = adj.length;
    this.adj = adj;
    this.LOG = Math.ceil(Math.log2(Math.max(2, this.n)));
    this.up = Array.from({ length: this.LOG }, () => new Array(this.n).fill(-1));
    this.depth = new Array(this.n).fill(0);
    this.dfs(root, root);
    for (let k = 1; k < this.LOG; k++) {
      for (let v = 0; v < this.n; v++) {
        const mid = this.up[k - 1][v];
        this.up[k][v] = mid === -1 ? -1 : this.up[k - 1][mid];
      }
    }
  }
  private dfs(u: number, p: number) {
    this.up[0][u] = p;
    for (const v of this.adj[u]) if (v !== p) {
      this.depth[v] = this.depth[u] + 1;
      this.dfs(v, u);
    }
  }
  query(u: number, v: number): number {
    if (this.depth[u] < this.depth[v]) [u, v] = [v, u];
    let diff = this.depth[u] - this.depth[v];
    for (let k = 0; k < this.LOG; k++) if (diff & (1 << k)) u = this.up[k][u];
    if (u === v) return u;
    for (let k = this.LOG - 1; k >= 0; k--) {
      if (this.up[k][u] !== this.up[k][v]) {
        u = this.up[k][u];
        v = this.up[k][v];
      }
    }
    return this.up[0][u];
  }
}
