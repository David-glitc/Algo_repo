# 🚀 Algorithm Benchmark Guide

This guide explains how to use the comprehensive benchmarking system in this algorithm repository.

## 📊 Available Benchmark Commands

### 1. **Single Runtime Benchmarks**

```bash
# Run benchmarks on Bun (default)
bun run benchmark

# Run benchmarks on Deno
bun run benchmark:deno

# Run benchmarks on Node.js
bun run benchmark:node

# Run with enhanced output and file generation
bun run benchmark:full
```

### 2. **Cross-Runtime Comparison**

```bash
# Compare Bun vs Deno performance
bun run benchmark:compare

# Full cross-runtime comparison (Node.js, Bun, Deno)
bun run benchmark:cross
```

## 🎯 What Each Benchmark Does

### **Single Runtime Benchmark**
- Runs 16 different algorithms with various input sizes
- Measures execution time, memory usage, and performance statistics
- Generates beautiful formatted tables with progress indicators
- Saves results to JSON and CSV files with timestamps

### **Cross-Runtime Comparison**
- Runs the same benchmarks across multiple JavaScript runtimes
- Compares performance between Bun, Deno, and Node.js
- Shows which runtime is fastest for each algorithm
- Calculates speedup ratios and performance differences
- Generates comprehensive comparison reports

## 📈 Understanding the Results

### **Performance Metrics**
- **Mean**: Average execution time across all iterations
- **Median**: Middle execution time (less affected by outliers)
- **Min/Max**: Fastest and slowest execution times
- **Total Time**: Sum of all iterations for that algorithm
- **Speedup**: How much faster one runtime is compared to another

### **Time Formatting**
- **μs**: Microseconds (for very fast operations)
- **ms**: Milliseconds (most common)
- **s**: Seconds (for slower operations)

### **Sample Output**
```
🚀 CROSS-RUNTIME ALGORITHM BENCHMARK COMPARISON
========================================================================================================================
│ Algorithm                        │ Bun          │ Deno         │ Fastest      │ Speedup      │
├─────────────────────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ BinarySearch x1000               │ 2.35ms       │ 2.89ms       │ Bun          │ 1.23x        │
│ QuickSort (100k)                 │ 87.69ms      │ 96.79ms      │ Bun          │ 1.10x        │
│ MergeSort (100k)                 │ 283.49ms     │ 193.59ms     │ Deno         │ 1.46x        │
└─────────────────────────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

📊 RUNTIME PERFORMANCE SUMMARY:
   Bun: 24.01s (1.95x)
   Deno: 12.29s (1.00x)
   Overall fastest: Deno
```

## 📁 Generated Files

### **Single Runtime Files**
- `benchmark-results-YYYY-MM-DDTHH-MM-SS-sssZ.json` - Complete benchmark data
- `benchmark-results-YYYY-MM-DDTHH-MM-SS-sssZ.csv` - Spreadsheet-compatible data

### **Cross-Runtime Files**
- `bun-vs-deno-benchmark-YYYY-MM-DDTHH-MM-SS-sssZ.json` - Comparison data
- `bun-vs-deno-benchmark-YYYY-MM-DDTHH-MM-SS-sssZ.csv` - Comparison spreadsheet

## 🔧 Algorithm Benchmarks Included

| Algorithm | Input Size | Purpose |
|-----------|------------|---------|
| **Binary Search** | 1,000 iterations | Search performance |
| **KMP String Search** | 100k text, 1k pattern | String matching |
| **Quick Sort** | 100k elements | Sorting performance |
| **Merge Sort** | 100k elements | Stable sorting |
| **FFT Convolution** | 2^14 elements | Mathematical operations |
| **DFS** | 50k edges graph | Graph traversal |
| **BFS** | 50k edges graph | Breadth-first search |
| **Topological Sort** | 10k edges DAG | Graph ordering |
| **LCA** | 2000 depth tree | Tree algorithms |
| **A* Search** | 200x200 grid | Pathfinding |
| **Dijkstra** | 5k nodes, 20k edges | Shortest path |
| **Kruskal MST** | 50k edges | Minimum spanning tree |
| **Binary Exponentiation** | 10^4 exponent | Mathematical operations |
| **Knapsack** | 200 items, 5k capacity | Dynamic programming |
| **LCS** | 500x500 strings | String algorithms |
| **GCD** | 1M random pairs | Mathematical operations |

## 🎯 Performance Insights

### **Runtime Characteristics**

**Bun** 🚀
- Excellent for: String operations, graph algorithms, mathematical computations
- Strengths: Fast startup, efficient memory usage
- Best for: Development and testing

**Deno** 🦕
- Excellent for: Sorting algorithms, pathfinding, dynamic programming
- Strengths: Consistent performance, good for production
- Best for: Production deployments

**Node.js** 📦
- Good for: General-purpose applications
- Strengths: Mature ecosystem, extensive libraries
- Best for: Enterprise applications

### **Algorithm Performance Patterns**

1. **Sorting**: Deno often outperforms Bun for merge sort
2. **Graph Algorithms**: Bun typically faster for DFS/BFS
3. **String Operations**: Bun usually faster for KMP and string processing
4. **Mathematical**: Performance varies by algorithm complexity
5. **Pathfinding**: Deno often faster for A* and Dijkstra

## 🛠️ Customizing Benchmarks

### **Modifying Input Sizes**
Edit `index.ts` to change benchmark parameters:
```typescript
const N = 200000; // Change array size
const iterations = 5; // Change number of iterations
```

### **Adding New Algorithms**
1. Add your algorithm to the `src/` directory
2. Export it from `src/index.ts`
3. Add a benchmark test in `index.ts`
4. Update the cross-runtime parser if needed

### **Custom Runtime Comparison**
Modify `simple-cross-benchmark.ts` to:
- Add more runtimes
- Change comparison metrics
- Customize output format

## 📊 Using Results for Analysis

### **CSV Data Analysis**
Import CSV files into Excel, Google Sheets, or Python for:
- Performance trend analysis
- Statistical analysis
- Visualization creation
- Regression testing

### **JSON Data Analysis**
Use JSON files for:
- Programmatic analysis
- Integration with monitoring systems
- Automated performance regression detection
- CI/CD pipeline integration

## 🚨 Troubleshooting

### **Common Issues**

**Runtime Not Found**
```bash
# Install missing runtimes
npm install -g bun
curl -fsSL https://deno.land/install.sh | sh
```

**Permission Errors (Deno)**
```bash
# Grant necessary permissions
deno run --allow-read --allow-write index.ts
```

**Memory Issues**
- Reduce input sizes in benchmark configuration
- Increase system memory
- Use smaller iteration counts

### **Performance Tips**

1. **Warmup**: Benchmarks include warmup runs to ensure consistent results
2. **Multiple Iterations**: Each algorithm runs multiple times for statistical accuracy
3. **System Load**: Run benchmarks on idle systems for consistent results
4. **Background Processes**: Close unnecessary applications during benchmarking

## 🎉 Best Practices

### **For Development**
- Run `bun run benchmark:compare` regularly to track performance
- Use results to optimize slow algorithms
- Compare before/after performance when making changes

### **For Production**
- Run full cross-runtime benchmarks before deployment
- Monitor performance regressions
- Use results to choose optimal runtime for your use case

### **For Research**
- Export data for statistical analysis
- Compare with other algorithm implementations
- Document performance characteristics

---

**Happy Benchmarking! 🚀**

Use these tools to understand algorithm performance, optimize your code, and make informed decisions about runtime choices for your projects.
