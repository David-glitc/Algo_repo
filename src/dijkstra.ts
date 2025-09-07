// Dijkstra Shortest Path (priority queue minimal)
class MinHeap<T> {
  data: { key: number; val: T }[] = [];
  size() { return this.data.length; }
  push(key: number, val: T) {
    this.data.push({ key, val });
    let i = this.data.length - 1;
    while (i > 0) {
      const p = ((i - 1) >> 1);
      if (this.data[p].key <= this.data[i].key) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  pop(): { key: number; val: T } | null {
    if (this.data.length === 0) return null;
    const res = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2;
        let smallest = i;
        if (l < this.data.length && this.data[l].key < this.data[smallest].key) smallest = l;
        if (r < this.data.length && this.data[r].key < this.data[smallest].key) smallest = r;
        if (smallest === i) break;
        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      }
    }
    return res;
  }
}
export function dijkstra(adj: Array<Array<[number, number]>>, src: number): number[] {
  const n = adj.length;
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = new MinHeap<number>();
  pq.push(0, src);
  while (pq.size()) {
    const cur = pq.pop()!;
    const u = cur.val;
    const d = cur.key;
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (dist[v] > dist[u] + w) {
        dist[v] = dist[u] + w;
        pq.push(dist[v], v);
      }
    }
  }
  return dist;
}
