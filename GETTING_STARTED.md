# Getting Started with Algorithms Study Repository

Welcome to the Algorithms Study Repository! This guide will help you get started with studying and using the algorithms in this collection.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun or Deno
- Basic understanding of TypeScript/JavaScript

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd algorithms-study-repo

# Install dependencies (if using Node.js)
npm install
```

### Running Examples
```bash
# Run the test suite to verify everything works
bun run test.ts
# or
deno run test.ts
# or
node --loader ts-node/esm test.ts

# Run practical examples
bun run examples.ts
# or
deno run examples.ts
# or
node --loader ts-node/esm examples.ts

# Run performance benchmarks
bun run benchmark
# or
deno run benchmark.ts
# or
node --loader ts-node/esm index.ts
```

## 📚 How to Study with This Repository

### 1. Start with the Basics
Begin with fundamental algorithms:
- **Binary Search** (`src/binarySearch.ts`) - Learn divide and conquer
- **Quick Sort** (`src/quickSort.ts`) - Understand sorting algorithms
- **DFS/BFS** (`src/dfs.ts`, `src/bfs.ts`) - Master graph traversal

### 2. Read the Code
Each algorithm file contains:
- Clear implementation with comments
- Time and space complexity information
- TypeScript types for better understanding

### 3. Run the Examples
The `examples.ts` file shows real-world applications:
- Binary search for phone directory lookup
- Graph algorithms for social networks
- Pathfinding for game AI
- And much more!

### 4. Experiment
Modify the examples to:
- Change input data
- Add new test cases
- Implement variations of algorithms

### 5. Benchmark Performance
Use the built-in benchmark suite to understand:
- How algorithms perform with different input sizes
- Time complexity in practice
- Memory usage patterns

## 🎯 Learning Path

### Beginner Level
1. **Searching & Sorting**
   - Binary Search
   - Quick Sort
   - Merge Sort

2. **Basic Graph Algorithms**
   - Depth-First Search (DFS)
   - Breadth-First Search (BFS)

3. **Mathematical Algorithms**
   - Greatest Common Divisor (GCD)
   - Binary Exponentiation

### Intermediate Level
1. **Advanced Graph Algorithms**
   - Dijkstra's Shortest Path
   - A* Pathfinding
   - Topological Sort
   - Minimum Spanning Tree (Kruskal)

2. **String Algorithms**
   - KMP String Search
   - Longest Common Subsequence (LCS)

3. **Dynamic Programming**
   - 0/1 Knapsack Problem

### Advanced Level
1. **Complex Algorithms**
   - Fast Fourier Transform (FFT)
   - Lowest Common Ancestor (LCA)

2. **Optimization**
   - Study the benchmark results
   - Implement your own optimizations
   - Compare different approaches

## 🛠️ Development Workflow

### Making Changes
1. **Edit Algorithm Files**: Modify implementations in `src/` directory
2. **Add Tests**: Update `test.ts` with new test cases
3. **Update Examples**: Add new examples to `examples.ts`
4. **Run Tests**: Verify your changes work correctly

### Adding New Algorithms
1. Create a new file in `src/` directory
2. Implement the algorithm with proper TypeScript types
3. Add exports to `src/index.ts`
4. Add test cases to `test.ts`
5. Add examples to `examples.ts`
6. Update benchmarks in `index.ts`

## 📊 Understanding Benchmarks

The benchmark suite measures:
- **Mean Time**: Average execution time
- **Median Time**: Middle execution time
- **Iterations**: Number of test runs

Example output:
```
BinarySearch x1000: mean=2.45ms median=2.30ms (n=5)
QuickSort (100k): mean=45.67ms median=44.20ms (n=3)
```

## 🔧 Troubleshooting

### Common Issues

**TypeScript Errors**
```bash
# Run type checking
npm run type-check
```

**Import Errors**
- Make sure you're using ES modules (`"type": "module"` in package.json)
- Use `.js` extensions in imports if needed

**Performance Issues**
- Start with smaller input sizes
- Use the benchmark suite to measure performance
- Consider algorithm complexity

### Getting Help
1. Check the README.md for detailed algorithm explanations
2. Look at the examples in `examples.ts`
3. Run the test suite to verify implementations
4. Study the benchmark results

## 🎓 Study Tips

### 1. Understand Before Implementing
- Read the algorithm description
- Trace through examples by hand
- Understand the time/space complexity

### 2. Practice Regularly
- Implement algorithms from scratch
- Solve related problems
- Compare different approaches

### 3. Use the Benchmark Suite
- Measure performance with different input sizes
- Understand how complexity affects real performance
- Optimize based on actual measurements

### 4. Build Projects
- Use these algorithms in real projects
- Combine multiple algorithms
- Solve competitive programming problems

## 📖 Additional Resources

- **Books**: "Introduction to Algorithms" by Cormen et al.
- **Online**: LeetCode, HackerRank, Codeforces
- **Videos**: MIT 6.006 Introduction to Algorithms
- **Practice**: Try implementing these algorithms in different languages

## 🤝 Contributing

Found a bug or want to add an algorithm?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and examples
5. Submit a pull request

---

**Happy Learning! 🎉**

Remember: The goal is not just to memorize algorithms, but to understand the underlying principles and be able to apply them to solve real problems.
