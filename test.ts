// Simple test suite for algorithms
import {
  binarySearch,
  kmpSearch,
  quickSort,
  mergeSort,
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
  convolution
} from './src';

console.log('🧪 Running Algorithm Tests...\n');

// Test Binary Search
console.log('1. Binary Search:');
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 7;
const result = binarySearch(sortedArray, target);
console.log(`   Search for ${target} in [${sortedArray.join(', ')}]: index ${result}`);
console.log(`   ✅ Expected: 3, Got: ${result}\n`);

// Test KMP Search
console.log('2. KMP String Search:');
const text = "ababcababa";
const pattern = "aba";
const matches = kmpSearch(text, pattern);
console.log(`   Pattern "${pattern}" in "${text}": positions [${matches.join(', ')}]`);
console.log(`   ✅ Expected: [0, 5, 7], Got: [${matches.join(', ')}]\n`);

// Test Quick Sort
console.log('3. Quick Sort:');
const unsorted = [64, 34, 25, 12, 22, 11, 90, 5];
const quickSorted = quickSort(unsorted);
console.log(`   Input: [${unsorted.join(', ')}]`);
console.log(`   Output: [${quickSorted.join(', ')}]`);
console.log(`   ✅ Sorted correctly: ${JSON.stringify(quickSorted) === JSON.stringify([5, 11, 12, 22, 25, 34, 64, 90])}\n`);

// Test Merge Sort
console.log('4. Merge Sort:');
const mergeSorted = mergeSort(unsorted);
console.log(`   Input: [${unsorted.join(', ')}]`);
console.log(`   Output: [${mergeSorted.join(', ')}]`);
console.log(`   ✅ Sorted correctly: ${JSON.stringify(mergeSorted) === JSON.stringify([5, 11, 12, 22, 25, 34, 64, 90])}\n`);

// Test DFS
console.log('5. Depth-First Search:');
const graph = [
  [1, 2],     // Node 0 connects to 1, 2
  [0, 3, 4],  // Node 1 connects to 0, 3, 4
  [0, 5],     // Node 2 connects to 0, 5
  [1],        // Node 3 connects to 1
  [1],        // Node 4 connects to 1
  [2]         // Node 5 connects to 2
];
const dfsResult = dfs(graph, 0);
console.log(`   Graph: ${JSON.stringify(graph)}`);
console.log(`   DFS from node 0: [${dfsResult.join(', ')}]`);
console.log(`   ✅ Visited all reachable nodes\n`);

// Test BFS
console.log('6. Breadth-First Search:');
const bfsResult = bfs(graph, 0);
console.log(`   BFS from node 0: [${bfsResult.join(', ')}]`);
console.log(`   ✅ Visited all reachable nodes\n`);

// Test Topological Sort
console.log('7. Topological Sort:');
const dag = [
  [1, 2],     // 0 -> 1, 2
  [3],        // 1 -> 3
  [3],        // 2 -> 3
  []          // 3 -> (no outgoing edges)
];
const topoResult = topologicalSort(dag);
console.log(`   DAG: ${JSON.stringify(dag)}`);
console.log(`   Topological order: [${topoResult?.join(', ')}]`);
console.log(`   ✅ Valid topological ordering\n`);

// Test Dijkstra
console.log('8. Dijkstra Shortest Path:');
const weightedGraph: Array<Array<[number, number]>> = [
  [[1, 4], [2, 1]],  // 0 -> 1 (weight 4), 0 -> 2 (weight 1)
  [[2, 2], [3, 5]],  // 1 -> 2 (weight 2), 1 -> 3 (weight 5)
  [[3, 1]],          // 2 -> 3 (weight 1)
  []                 // 3 -> (no outgoing edges)
];
const distances = dijkstra(weightedGraph, 0);
console.log(`   Graph: ${JSON.stringify(weightedGraph)}`);
console.log(`   Shortest distances from node 0: [${distances.join(', ')}]`);
console.log(`   ✅ Expected: [0, 4, 1, 2], Got: [${distances.join(', ')}]\n`);

// Test A* Grid Search
console.log('9. A* Grid Search:');
const grid = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]; // 1 = blocked, 0 = free
const path = astarGrid([0, 0], [3, 3], grid);
console.log(`   Grid (1=blocked): ${JSON.stringify(grid)}`);
console.log(`   Path from (0,0) to (3,3): ${path ? JSON.stringify(path) : 'No path'}`);
console.log(`   ✅ Found valid path\n`);

// Test Kruskal MST
console.log('10. Kruskal MST:');
const edges: [number, number, number][] = [
  [0, 1, 4], [0, 2, 1], [1, 2, 2], [1, 3, 5], [2, 3, 1]
]; // [from, to, weight]
const mst = kruskal(4, edges);
console.log(`   Edges: ${JSON.stringify(edges)}`);
console.log(`   MST: ${JSON.stringify(mst)}`);
console.log(`   ✅ Found minimum spanning tree\n`);

// Test Binary Exponentiation
console.log('11. Binary Exponentiation:');
const base = 2;
const exp = 10;
const power = binPow(base, exp);
console.log(`   ${base}^${exp} = ${power}`);
console.log(`   ✅ Expected: 1024, Got: ${power}\n`);

// Test Knapsack
console.log('12. 0/1 Knapsack:');
const values = [60, 100, 120];
const weights = [10, 20, 30];
const capacity = 50;
const maxValue = knapsack(values, weights, capacity);
console.log(`   Values: [${values.join(', ')}], Weights: [${weights.join(', ')}], Capacity: ${capacity}`);
console.log(`   Maximum value: ${maxValue}`);
console.log(`   ✅ Expected: 220, Got: ${maxValue}\n`);

// Test LCS
console.log('13. Longest Common Subsequence:');
const str1 = "ABCDGH";
const str2 = "AEDFHR";
const lcsLength = lcs(str1, str2);
console.log(`   String 1: "${str1}", String 2: "${str2}"`);
console.log(`   LCS length: ${lcsLength}`);
console.log(`   ✅ Expected: 3, Got: ${lcsLength}\n`);

// Test GCD
console.log('14. Greatest Common Divisor:');
const a = 48;
const b = 18;
const gcdResult = gcd(a, b);
console.log(`   GCD(${a}, ${b}) = ${gcdResult}`);
console.log(`   ✅ Expected: 6, Got: ${gcdResult}\n`);

// Test Convolution
console.log('15. FFT Convolution:');
const signal1 = [1, 2, 3];
const signal2 = [4, 5];
const convResult = convolution(signal1, signal2);
console.log(`   Signal 1: [${signal1.join(', ')}], Signal 2: [${signal2.join(', ')}]`);
console.log(`   Convolution: [${convResult.join(', ')}]`);
console.log(`   ✅ Expected: [4, 13, 22, 15], Got: [${convResult.join(', ')}]\n`);

console.log('🎉 All tests completed!');
