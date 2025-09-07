#!/usr/bin/env node

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
} from './src/index.ts';

interface CLIOptions {
  algorithm: string;
  input?: string;
  iterations?: number;
  help?: boolean;
  list?: boolean;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    algorithm: '',
    iterations: 1
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-a':
      case '--algorithm':
        options.algorithm = args[++i];
        break;
      case '-i':
      case '--input':
        options.input = args[++i];
        break;
      case '-n':
      case '--iterations':
        options.iterations = parseInt(args[++i]) || 1;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-l':
      case '--list':
        options.list = true;
        break;
      default:
        if (!options.algorithm && !arg.startsWith('-')) {
          options.algorithm = arg;
        } else if (arg.startsWith('-') && !['-a', '--algorithm', '-i', '--input', '-n', '--iterations', '-h', '--help', '-l', '--list'].includes(arg)) {
          // Unknown option, treat as algorithm name if no algorithm set
          if (!options.algorithm) {
            options.algorithm = arg;
          }
        }
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Algorithm CLI Tool
==================

Usage: node cli.js [options] <algorithm>

Options:
  -a, --algorithm <name>    Algorithm to run
  -i, --input <data>        Input data (JSON string or file path)
  -n, --iterations <num>    Number of iterations (default: 1)
  -l, --list               List available algorithms
  -h, --help               Show this help message

Examples:
  node cli.js --list
  node cli.js binarySearch -i "[1,2,3,4,5],3"
  node cli.js quickSort -i "[5,2,8,1,9]" -n 10
  node cli.js gcd -i "48,18"
  node cli.js knapsack -i "[60,100,120],[10,20,30],50"

Available Algorithms:
  - binarySearch: Binary search in sorted array
  - kmpSearch: KMP string pattern matching
  - quickSort: Quick sort algorithm
  - mergeSort: Merge sort algorithm
  - dfs: Depth-first search
  - bfs: Breadth-first search
  - topologicalSort: Topological sorting
  - lca: Lowest Common Ancestor
  - astarGrid: A* pathfinding on grid
  - dijkstra: Dijkstra's shortest path
  - kruskal: Kruskal's MST algorithm
  - binPow: Binary exponentiation
  - knapsack: 0/1 Knapsack problem
  - lcs: Longest Common Subsequence
  - gcd: Greatest Common Divisor
  - convolution: FFT-based convolution
`);
}

function listAlgorithms() {
  console.log(`
Available Algorithms:
====================

Searching & Sorting:
  binarySearch    - Binary search in sorted array
  kmpSearch       - KMP string pattern matching
  quickSort       - Quick sort algorithm
  mergeSort       - Merge sort algorithm

Graph Algorithms:
  dfs             - Depth-first search
  bfs             - Breadth-first search
  topologicalSort - Topological sorting
  lca             - Lowest Common Ancestor
  astarGrid       - A* pathfinding on grid
  dijkstra        - Dijkstra's shortest path
  kruskal         - Kruskal's MST algorithm

Mathematical:
  binPow          - Binary exponentiation
  gcd             - Greatest Common Divisor
  convolution     - FFT-based convolution

Dynamic Programming:
  knapsack        - 0/1 Knapsack problem
  lcs             - Longest Common Subsequence
`);
}

function parseInput(input: string, algorithm: string): any[] {
  try {
    // Handle comma-separated values, but be careful with JSON arrays
    let parts: string[];
    if (input.includes('],')) {
      // Handle case like "[1,2,3],5" - split on "]," but preserve the array
      const arrayEnd = input.indexOf('],');
      if (arrayEnd !== -1) {
        const arrayPart = input.substring(0, arrayEnd + 1);
        const remainingPart = input.substring(arrayEnd + 2);
        parts = [arrayPart, ...remainingPart.split(',').map(p => p.trim())];
      } else {
        parts = input.split(',').map(p => p.trim());
      }
    } else if (input.startsWith('[') && input.endsWith(']')) {
      // Single JSON array
      return [JSON.parse(input)];
    } else {
      parts = input.split(',').map(p => p.trim());
    }
    
    switch (algorithm) {
      case 'binarySearch':
        if (parts.length !== 2) throw new Error('Binary search needs array and target');
        return [JSON.parse(parts[0]), parseInt(parts[1])];
      
      case 'kmpSearch':
        if (parts.length !== 2) throw new Error('KMP search needs text and pattern');
        return [parts[0], parts[1]];
      
      case 'quickSort':
      case 'mergeSort':
        return [JSON.parse(parts[0])];
      
      case 'gcd':
        if (parts.length !== 2) throw new Error('GCD needs two numbers');
        return [parseInt(parts[0]), parseInt(parts[1])];
      
      case 'binPow':
        if (parts.length !== 2) throw new Error('Binary power needs base and exponent');
        return [BigInt(parts[0]), parseInt(parts[1])];
      
      case 'knapsack':
        if (parts.length !== 3) throw new Error('Knapsack needs values, weights, and capacity');
        return [JSON.parse(parts[0]), JSON.parse(parts[1]), parseInt(parts[2])];
      
      case 'lcs':
        if (parts.length !== 2) throw new Error('LCS needs two strings');
        return [parts[0], parts[1]];
      
      default:
        return parts.map(p => {
          const num = parseInt(p);
          return isNaN(num) ? p : num;
        });
    }
  } catch (error) {
    throw new Error(`Invalid input format: ${error}`);
  }
}

function runAlgorithm(algorithm: string, args: any[], iterations: number) {
  const startTime = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    switch (algorithm) {
      case 'binarySearch':
        console.log(`Result: ${binarySearch(args[0], args[1])}`);
        break;
      case 'kmpSearch':
        console.log(`Result: ${kmpSearch(args[0], args[1])}`);
        break;
      case 'quickSort':
        const qsResult = quickSort([...args[0]]);
        console.log(`Result: [${qsResult.slice(0, 10).join(', ')}${qsResult.length > 10 ? '...' : ''}]`);
        break;
      case 'mergeSort':
        const msResult = mergeSort([...args[0]]);
        console.log(`Result: [${msResult.slice(0, 10).join(', ')}${msResult.length > 10 ? '...' : ''}]`);
        break;
      case 'dfs':
        console.log(`Result: ${dfs(args[0], args[1] || 0)}`);
        break;
      case 'bfs':
        console.log(`Result: ${bfs(args[0], args[1] || 0)}`);
        break;
      case 'topologicalSort':
        console.log(`Result: [${topologicalSort(args[0]).join(', ')}]`);
        break;
      case 'lca':
        const lca = new LCA(args[0], args[1]);
        console.log(`Result: ${lca.query(args[2], args[3])}`);
        break;
      case 'astarGrid':
        console.log(`Result: ${astarGrid(args[0], args[1], args[2])}`);
        break;
      case 'dijkstra':
        console.log(`Result: [${dijkstra(args[0], args[1]).slice(0, 10).join(', ')}...]`);
        break;
      case 'kruskal':
        console.log(`Result: ${kruskal(args[0], args[1])}`);
        break;
      case 'binPow':
        console.log(`Result: ${binPow(args[0], args[1])}`);
        break;
      case 'knapsack':
        console.log(`Result: ${knapsack(args[0], args[1], args[2])}`);
        break;
      case 'lcs':
        console.log(`Result: ${lcs(args[0], args[1])}`);
        break;
      case 'gcd':
        console.log(`Result: ${gcd(args[0], args[1])}`);
        break;
      case 'convolution':
        console.log(`Result: [${convolution(args[0], args[1]).slice(0, 10).join(', ')}...]`);
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }
  
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
  
  console.log(`\nExecution time: ${duration.toFixed(3)}ms (${iterations} iteration${iterations > 1 ? 's' : ''})`);
  console.log(`Average time per iteration: ${(duration / iterations).toFixed(3)}ms`);
}

function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.list) {
    listAlgorithms();
    return;
  }
  
  if (!options.algorithm) {
    console.error('Error: Algorithm name is required');
    console.log('Use --help for usage information or --list to see available algorithms');
    process.exit(1);
  }
  
  if (!options.input) {
    console.error('Error: Input data is required');
    console.log('Use --help for usage information');
    process.exit(1);
  }
  
  try {
    const args = parseInput(options.input, options.algorithm);
    console.log(`Running ${options.algorithm} with input: ${options.input}`);
    console.log(`Iterations: ${options.iterations}\n`);
    
    runAlgorithm(options.algorithm, args, options.iterations || 1);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('cli.ts')) {
  main();
}
