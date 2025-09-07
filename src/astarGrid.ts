// A* Search (grid heuristic example)
type NodeKey = string;
function key(x: number, y: number) { return `${x},${y}`; }
export function astarGrid(start: [number, number], goal: [number, number], grid: number[][]) {
  const R = grid.length, C = grid[0].length;
  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < R && y < C;
  const h = (x: number, y: number) => Math.abs(x - goal[0]) + Math.abs(y - goal[1]); // manhattan
  const open = new Map<NodeKey, number>();
  const gScore = new Map<NodeKey, number>();
  const parent = new Map<NodeKey, NodeKey | null>();
  const startKey = key(start[0], start[1]);
  open.set(startKey, h(start[0], start[1]));
  gScore.set(startKey, 0);
  parent.set(startKey, null);
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (open.size) {
    let curKey: NodeKey | null = null;
    let curF = Infinity;
    for (const [k, f] of open) if (f < curF) { curF = f; curKey = k; }
    if (!curKey) break;
    open.delete(curKey);
    const [cx, cy] = curKey.split(',').map(Number);
    if (cx === goal[0] && cy === goal[1]) {
      const path: [number, number][] = [];
      let p: NodeKey | null = curKey;
      while (p) {
        const [px, py] = p.split(',').map(Number);
        path.push([px, py]);
        p = parent.get(p) ?? null;
      }
      path.reverse();
      return path;
    }
    const gCur = gScore.get(curKey)!;
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (!inBounds(nx, ny) || grid[nx][ny] === 1) continue;
      const nk = key(nx, ny);
      const tentativeG = gCur + 1;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        parent.set(nk, curKey);
        gScore.set(nk, tentativeG);
        open.set(nk, tentativeG + h(nx, ny));
      }
    }
  }
  return null;
}
