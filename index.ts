// Entry point for algorithms package
export * from './src';

// Import all algorithms for benchmarking
import {
  binarySearch,
  kmpSearch,
  quickSort,
  mergeSort,
  convolution,
  dfs,
  bfs,
  topologicalSort,
  LCA,
  astarGrid,
  dijkstra,
  kruskal,
  binPow,
  knapsack,
  lcs,
  gcd,
  now,
  mean,
  median
} from './src';

/* ----------------------------
   Benchmark harness
   ----------------------------
   For each algorithm we run a representative input with multiple iterations and print average + median.
*/

type Benchmark = { name: string; fn: () => void; warmup?: number; iters?: number };

interface BenchmarkResult {
  name: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  iterations: number;
  totalTime: number;
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function printTable(results: BenchmarkResult[], totalTime: number) {
  console.log('\n' + '='.repeat(140));
  console.log('ALGORITHM BENCHMARK RESULTS');
  console.log('='.repeat(140));
  
  // Table header with proper spacing
  console.log('│ Algorithm'.padEnd(45) + '│ Mean'.padEnd(15) + '│ Median'.padEnd(15) + '│ Min'.padEnd(15) + '│ Max'.padEnd(15) + '│ Iterations'.padEnd(12) + '│ Total Time'.padEnd(15) + '│');
  console.log('├' + '─'.repeat(43) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(10) + '┼' + '─'.repeat(13) + '┤');
  
  // Table rows with proper spacing
  results.forEach(result => {
    const name = result.name.length > 42 ? result.name.substring(0, 39) + '...' : result.name;
    console.log(
      '│ ' + name.padEnd(43) + 
      '│ ' + formatTime(result.mean).padEnd(13) + 
      '│ ' + formatTime(result.median).padEnd(13) + 
      '│ ' + formatTime(result.min).padEnd(13) + 
      '│ ' + formatTime(result.max).padEnd(13) + 
      '│ ' + result.iterations.toString().padEnd(10) + 
      '│ ' + formatTime(result.totalTime).padEnd(13) + '│'
    );
  });
  
  console.log('└' + '─'.repeat(43) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(10) + '┴' + '─'.repeat(13) + '┘');
  console.log(`\nTotal benchmark time: ${formatTime(totalTime)}`);
  console.log(`Average time per algorithm: ${formatTime(totalTime / results.length)}`);
  console.log('='.repeat(140));
}

async function saveResultsToFile(results: BenchmarkResult[], totalTime: number, startTime: number) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonFilename = `benchmark-results-${timestamp}.json`;
  const csvFilename = `benchmark-results-${timestamp}.csv`;
  
  const report = {
    timestamp: new Date().toISOString(),
    totalBenchmarkTime: totalTime,
    startTime: startTime,
    endTime: Date.now(),
    environment: {
      nodeVersion: typeof process !== 'undefined' ? process.version : 'unknown',
      platform: typeof process !== 'undefined' ? process.platform : 'unknown',
      runtime: 'Bun/Deno/Node'
    },
    results: results.map(result => ({
      ...result,
      meanFormatted: formatTime(result.mean),
      medianFormatted: formatTime(result.median),
      minFormatted: formatTime(result.min),
      maxFormatted: formatTime(result.max),
      totalTimeFormatted: formatTime(result.totalTime)
    }))
  };
  
  try {
    // Try different file writing approaches based on runtime
    if (typeof Bun !== 'undefined') {
      // Bun runtime - use writeFileSync for compatibility
      const fs = require('fs');
      fs.writeFileSync(jsonFilename, JSON.stringify(report, null, 2));
      console.log(`\nJSON results saved to: ${jsonFilename}`);
      
      const csvHeader = 'Algorithm,Mean (ms),Median (ms),Min (ms),Max (ms),Iterations,Total Time (ms),Mean Formatted,Median Formatted,Min Formatted,Max Formatted,Total Time Formatted\n';
      const csvRows = results.map(result => 
        `"${result.name}",${result.mean.toFixed(3)},${result.median.toFixed(3)},${result.min.toFixed(3)},${result.max.toFixed(3)},${result.iterations},${result.totalTime.toFixed(3)},"${formatTime(result.mean)}","${formatTime(result.median)}","${formatTime(result.min)}","${formatTime(result.max)}","${formatTime(result.totalTime)}"`
      ).join('\n');
      
      fs.writeFileSync(csvFilename, csvHeader + csvRows);
      console.log(`CSV results saved to: ${csvFilename}`);
      
    } else if (typeof Deno !== 'undefined') {
      // Deno runtime
      await Deno.writeTextFile(jsonFilename, JSON.stringify(report, null, 2));
      console.log(`\nJSON results saved to: ${jsonFilename}`);
      
      const csvHeader = 'Algorithm,Mean (ms),Median (ms),Min (ms),Max (ms),Iterations,Total Time (ms),Mean Formatted,Median Formatted,Min Formatted,Max Formatted,Total Time Formatted\n';
      const csvRows = results.map(result => 
        `"${result.name}",${result.mean.toFixed(3)},${result.median.toFixed(3)},${result.min.toFixed(3)},${result.max.toFixed(3)},${result.iterations},${result.totalTime.toFixed(3)},"${formatTime(result.mean)}","${formatTime(result.median)}","${formatTime(result.min)}","${formatTime(result.max)}","${formatTime(result.totalTime)}"`
      ).join('\n');
      
      await Deno.writeTextFile(csvFilename, csvHeader + csvRows);
      console.log(`CSV results saved to: ${csvFilename}`);
      
    } else {
      // Node.js runtime
      const fs = require('fs');
      fs.writeFileSync(jsonFilename, JSON.stringify(report, null, 2));
      console.log(`\nJSON results saved to: ${jsonFilename}`);
      
      const csvHeader = 'Algorithm,Mean (ms),Median (ms),Min (ms),Max (ms),Iterations,Total Time (ms),Mean Formatted,Median Formatted,Min Formatted,Max Formatted,Total Time Formatted\n';
      const csvRows = results.map(result => 
        `"${result.name}",${result.mean.toFixed(3)},${result.median.toFixed(3)},${result.min.toFixed(3)},${result.max.toFixed(3)},${result.iterations},${result.totalTime.toFixed(3)},"${formatTime(result.mean)}","${formatTime(result.median)}","${formatTime(result.min)}","${formatTime(result.max)}","${formatTime(result.totalTime)}"`
      ).join('\n');
      
      fs.writeFileSync(csvFilename, csvHeader + csvRows);
      console.log(`CSV results saved to: ${csvFilename}`);
    }
    
  } catch (error) {
    console.log(`\n⚠️  Could not save results to file: ${error}`);
    console.log(`📋 Results summary:`);
    console.log(`   Total algorithms: ${results.length}`);
    console.log(`   Total time: ${formatTime(totalTime)}`);
    console.log(`   Average per algorithm: ${formatTime(totalTime / results.length)}`);
  }
}

async function runBenchmarks() {
  const startTime = Date.now();
  const benches: Benchmark[] = [];
  const results: BenchmarkResult[] = [];

  // Utility sample data
  const N = 200000; // size for sorts/searchable arrays (be conservative)
  const arr = Array.from({ length: N }, (_, i) => i);
  const shuffled = arr.slice().sort(() => Math.random() - 0.5);
  const searchTargets = [-1, arr[Math.floor(N * 0.1)], arr[Math.floor(N * 0.9)], N + 1];

  benches.push({
    name: "BinarySearch x1000",
    fn: () => {
      for (let t = 0; t < 1000; t++) {
        binarySearch(arr, Math.floor(Math.random() * N));
      }
    },
    iters: 5
  });

  benches.push({
    name: "KMP (text 1e5, pattern 1e3)",
    fn: () => {
      const text = Array.from({ length: 100_000 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 3))).join('');
      const pattern = text.slice(50000, 50100); // 100 chars
      kmpSearch(text, pattern);
    },
    iters: 3
  });

  benches.push({
    name: "QuickSort (100k)",
    fn: () => { quickSort(shuffled.slice(0, 100_000)); },
    iters: 3
  });

  benches.push({
    name: "MergeSort (100k)",
    fn: () => { mergeSort(shuffled.slice(0, 100_000)); },
    iters: 3
  });

  benches.push({
    name: "FFT convolution (n ~ 2^14)",
    fn: () => {
      const m = 1 << 14;
      const a = new Array(m / 2).fill(0).map(() => Math.floor(Math.random() * 10));
      const b = new Array(m / 2).fill(0).map(() => Math.floor(Math.random() * 10));
      convolution(a, b);
    },
    iters: 2
  });

  benches.push({
    name: "DFS (graph 50k edges)",
    fn: () => {
      const n = 5000;
      const adj: number[][] = Array.from({ length: n }, () => []);
      for (let i = 0; i < 50000; i++) {
        const u = Math.floor(Math.random() * n);
        const v = Math.floor(Math.random() * n);
        adj[u].push(v);
      }
      dfs(adj, 0);
    },
    iters: 3
  });

  benches.push({
    name: "BFS (graph 50k edges)",
    fn: () => {
      const n = 5000;
      const adj: number[][] = Array.from({ length: n }, () => []);
      for (let i = 0; i < 50000; i++) {
        const u = Math.floor(Math.random() * n);
        const v = Math.floor(Math.random() * n);
        adj[u].push(v);
      }
      bfs(adj, 0);
    },
    iters: 3
  });

  benches.push({
    name: "Topological Sort (DAG 10k edges)",
    fn: () => {
      const n = 2000;
      const adj: number[][] = Array.from({ length: n }, () => []);
      for (let u = 0; u < n; u++) {
        const v = (u + 1) % n;
        adj[u].push(v);
      }
      topologicalSort(adj);
    },
    iters: 5
  });

  benches.push({
    name: "LCA (tree depth 2000)",
    fn: () => {
      const n = 4096;
      const adj: number[][] = Array.from({ length: n }, () => []);
      for (let i = 1; i < n; i++) {
        const p = Math.floor((i - 1) / 2);
        adj[p].push(i);
        adj[i].push(p);
      }
      const lca = new LCA(adj, 0);
      lca.query(123, 345);
    },
    iters: 5
  });

  benches.push({
    name: "A* (grid 200x200)",
    fn: () => {
      const r = 200, c = 200;
      const grid = Array.from({ length: r }, () => new Array(c).fill(0));
      // random obstacles
      for (let k = 0; k < r * c * 0.05; k++) {
        grid[Math.floor(Math.random() * r)][Math.floor(Math.random() * c)] = 1;
      }
      astarGrid([0,0], [r-1,c-1], grid);
    },
    iters: 3
  });

  benches.push({
    name: "Dijkstra (sparse graph 5k nodes, 20k edges)",
    fn: () => {
      const n = 5000;
      const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
      for (let i = 0; i < 20000; i++) {
        const u = Math.floor(Math.random() * n);
        const v = Math.floor(Math.random() * n);
        const w = Math.floor(Math.random() * 10) + 1;
        adj[u].push([v, w]);
      }
      dijkstra(adj, 0);
    },
    iters: 2
  });

  benches.push({
    name: "Kruskal (MST edges 50k)",
    fn: () => {
      const n = 5000;
      const edges: Array<[number, number, number]> = [];
      for (let i = 0; i < 50000; i++) {
        edges.push([Math.floor(Math.random() * n), Math.floor(Math.random() * n), Math.floor(Math.random() * 100)]);
      }
      kruskal(n, edges);
    },
    iters: 2
  });

  benches.push({
    name: "Binary Power (exponent 1e4 via BigInt)",
    fn: () => {
      binPow(BigInt(2), 10_000);
    },
    iters: 2
  });

  benches.push({
    name: "Knapsack (n=200, W=5000)",
    fn: () => {
      const n = 200, W = 5000;
      const values = new Array(n).fill(0).map(() => Math.floor(Math.random() * 100));
      const weights = new Array(n).fill(0).map(() => Math.floor(Math.random() * 100) + 1);
      knapsack(values, weights, W);
    },
    iters: 3
  });

  benches.push({
    name: "LCS (strings 500 x 500)",
    fn: () => {
      const a = Array.from({ length: 500 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 4))).join('');
      const b = Array.from({ length: 500 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 4))).join('');
      lcs(a, b);
    },
    iters: 2
  });

  benches.push({
    name: "GCD (1e6 random pairs)",
    fn: () => {
      for (let i = 0; i < 1_000_000; i++) gcd(Math.floor(Math.random() * 1000000), Math.floor(Math.random() * 1000000));
    },
    iters: 1
  });

  // Run benchmarks
  console.log("Starting Algorithm Benchmark Suite...");
  console.log(`Running ${benches.length} benchmark tests...\n`);
  
  for (let i = 0; i < benches.length; i++) {
    const b = benches[i];
    const iters = b.iters ?? 5;
    const times: number[] = [];
    
    console.log(`[${i + 1}/${benches.length}] Running: ${b.name}`);
    
    // warmup
    if (b.warmup) {
      console.log(`   Warming up (${b.warmup} iterations)...`);
      for (let w = 0; w < b.warmup; w++) b.fn();
    }
    
    // benchmark iterations
    console.log(`   Benchmarking (${iters} iterations)...`);
    for (let j = 0; j < iters; j++) {
      const t0 = now();
      b.fn();
      const t1 = now();
      const duration = t1 - t0;
      times.push(duration);
      
      // Simple progress indicator
      const progress = ((j + 1) / iters * 100).toFixed(0);
      process.stdout.write(`\r   Progress: ${progress}% (${formatTime(duration)} per iteration)`);
      
      // yield to event loop for large tests
      if (typeof setTimeout !== "undefined") await new Promise(res => setTimeout(res, 0));
    }
    
    // Calculate statistics
    const sortedTimes = [...times].sort((a, b) => a - b);
    const result: BenchmarkResult = {
      name: b.name,
      mean: mean(times),
      median: median(times),
      min: Math.min(...times),
      max: Math.max(...times),
      iterations: iters,
      totalTime: times.reduce((sum, time) => sum + time, 0)
    };
    
    results.push(result);
    
    console.log(`\r   Completed: mean=${formatTime(result.mean)}, median=${formatTime(result.median)}`);
    console.log(`   Range: ${formatTime(result.min)} - ${formatTime(result.max)} (${iters} iterations)\n`);
  }
  
  const totalTime = Date.now() - startTime;
  
  // Print formatted table
  printTable(results, totalTime);
  
  // Save results to file
  await saveResultsToFile(results, totalTime, startTime);
  
  console.log("\nBenchmark suite completed successfully!");
}

// Auto-run when executed
if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].endsWith('index.ts')) {
  await runBenchmarks();
} else if (typeof import.meta !== 'undefined' && (import.meta as any).main) {
  await runBenchmarks();
}
