// Examples demonstrating how to use the algorithms
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

console.log('📚 Algorithm Usage Examples\n');

// Example 1: Binary Search - Finding a number in a sorted array
console.log('🔍 Example 1: Binary Search');
const phoneNumbers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const targetNumber = 500;
const index = binarySearch(phoneNumbers, targetNumber);
console.log(`Looking for ${targetNumber} in phone directory...`);
console.log(`Found at index: ${index}\n`);

// Example 2: String Search - Finding patterns in text
console.log('🔤 Example 2: KMP String Search');
const document = "The quick brown fox jumps over the lazy dog. The fox is quick.";
const searchTerm = "fox";
const positions = kmpSearch(document, searchTerm);
console.log(`Searching for "${searchTerm}" in document...`);
console.log(`Found at positions: ${positions.join(', ')}\n`);

// Example 3: Sorting - Organizing data
console.log('📊 Example 3: Sorting Algorithms');
const studentGrades = [85, 92, 78, 96, 88, 91, 83, 95, 89, 87];
console.log(`Original grades: [${studentGrades.join(', ')}]`);

const quickSorted = quickSort([...studentGrades]);
console.log(`Quick Sort: [${quickSorted.join(', ')}]`);

const mergeSorted = mergeSort([...studentGrades]);
console.log(`Merge Sort: [${mergeSorted.join(', ')}]\n`);

// Example 4: Graph Traversal - Social Network
console.log('👥 Example 4: Graph Traversal (Social Network)');
// Network: 0=Alice, 1=Bob, 2=Charlie, 3=Diana, 4=Eve
const socialNetwork = [
  [1, 2],     // Alice is friends with Bob and Charlie
  [0, 3],     // Bob is friends with Alice and Diana
  [0, 4],     // Charlie is friends with Alice and Eve
  [1],        // Diana is friends with Bob
  [2]         // Eve is friends with Charlie
];

console.log('DFS traversal starting from Alice:');
const dfsTraversal = dfs(socialNetwork, 0);
console.log(`Visited: ${dfsTraversal.join(' -> ')}`);

console.log('BFS traversal starting from Alice:');
const bfsTraversal = bfs(socialNetwork, 0);
console.log(`Visited: ${bfsTraversal.join(' -> ')}\n`);

// Example 5: Shortest Path - Navigation
console.log('🗺️ Example 5: Shortest Path (Navigation)');
// City connections: [destination, travel_time]
const cityNetwork: Array<Array<[number, number]>> = [
  [[1, 4], [2, 2]],  // From City 0: to City 1 (4 hours), to City 2 (2 hours)
  [[2, 1], [3, 5]],  // From City 1: to City 2 (1 hour), to City 3 (5 hours)
  [[3, 3]],          // From City 2: to City 3 (3 hours)
  []                 // From City 3: no outgoing connections
];

const travelTimes = dijkstra(cityNetwork, 0);
console.log('Travel times from City 0 to all cities:');
travelTimes.forEach((time, city) => {
  console.log(`  City ${city}: ${time === Infinity ? 'Unreachable' : time + ' hours'}`);
});
console.log();

// Example 6: Pathfinding - Game AI
console.log('🎮 Example 6: A* Pathfinding (Game AI)');
const gameMap = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],  // 1 = wall, 0 = walkable
  [0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0]
];

const path = astarGrid([0, 0], [4, 4], gameMap);
console.log('Finding path from top-left to bottom-right...');
if (path) {
  console.log('Path found:');
  path.forEach(([x, y], i) => {
    console.log(`  Step ${i + 1}: (${x}, ${y})`);
  });
} else {
  console.log('No path found!');
}
console.log();

// Example 7: Minimum Spanning Tree - Network Design
console.log('🌐 Example 7: Minimum Spanning Tree (Network Design)');
// Network cables: [building1, building2, cost]
const networkCables: Array<[number, number, number]> = [
  [0, 1, 10],  // Building 0 to Building 1: $10
  [0, 2, 6],   // Building 0 to Building 2: $6
  [1, 2, 4],   // Building 1 to Building 2: $4
  [1, 3, 8],   // Building 1 to Building 3: $8
  [2, 3, 2]    // Building 2 to Building 3: $2
];

const mst = kruskal(4, networkCables);
console.log('Minimum cost network design:');
let totalCost = 0;
mst.forEach(([from, to, cost]) => {
  console.log(`  Connect Building ${from} to Building ${to}: $${cost}`);
  totalCost += cost;
});
console.log(`Total cost: $${totalCost}\n`);

// Example 8: Binary Exponentiation - Cryptography
console.log('🔐 Example 8: Binary Exponentiation (Cryptography)');
const base = 7;
const exponent = 13;
const modulus = 1000;
const result = binPow(base, exponent);
console.log(`Computing ${base}^${exponent}...`);
console.log(`Result: ${result}`);
console.log(`Modular result: ${Number(result) % modulus}\n`);

// Example 9: Knapsack - Resource Allocation
console.log('🎒 Example 9: 0/1 Knapsack (Resource Allocation)');
const projects = {
  values: [100, 60, 120, 80],   // Project values (profit)
  weights: [20, 10, 30, 15],    // Project costs (time/effort)
  names: ['Website', 'Mobile App', 'AI System', 'Database']
};

const budget = 50;
const maxValue = knapsack(projects.values, projects.weights, budget);
console.log('Project selection with limited budget:');
console.log(`Budget: ${budget} units`);
console.log(`Maximum value achievable: ${maxValue}`);
console.log('Projects:');
projects.names.forEach((name, i) => {
  console.log(`  ${name}: Value ${projects.values[i]}, Cost ${projects.weights[i]}`);
});
console.log();

// Example 10: Longest Common Subsequence - DNA Analysis
console.log('🧬 Example 10: LCS (DNA Analysis)');
const dna1 = "ATCGATCG";
const dna2 = "ATCGGATC";
const lcsLength = lcs(dna1, dna2);
console.log(`DNA Sequence 1: ${dna1}`);
console.log(`DNA Sequence 2: ${dna2}`);
console.log(`Longest common subsequence length: ${lcsLength}`);
console.log(`Similarity: ${(lcsLength / Math.max(dna1.length, dna2.length) * 100).toFixed(1)}%\n`);

// Example 11: GCD - Fraction Simplification
console.log('🔢 Example 11: GCD (Fraction Simplification)');
const numerator = 48;
const denominator = 18;
const commonDivisor = gcd(numerator, denominator);
const simplifiedNum = numerator / commonDivisor;
const simplifiedDen = denominator / commonDivisor;
console.log(`Fraction: ${numerator}/${denominator}`);
console.log(`GCD: ${commonDivisor}`);
console.log(`Simplified: ${simplifiedNum}/${simplifiedDen}\n`);

// Example 12: Convolution - Signal Processing
console.log('📡 Example 12: Convolution (Signal Processing)');
const signal = [1, 2, 3, 4, 5];
const filter = [0.5, 0.5];  // Moving average filter
const filteredSignal = convolution(signal, filter);
console.log(`Original signal: [${signal.join(', ')}]`);
console.log(`Filter: [${filter.join(', ')}]`);
console.log(`Filtered signal: [${filteredSignal.join(', ')}]`);
console.log();

console.log('✨ All examples completed! These algorithms are fundamental building blocks for many applications.');
