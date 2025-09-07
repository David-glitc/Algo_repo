// Cross-Runtime Benchmark Suite
// Runs the same benchmarks across Node.js, Bun, and Deno and compares results

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';

interface RuntimeResult {
  runtime: string;
  results: BenchmarkResult[];
  totalTime: number;
  timestamp: string;
  environment: {
    version: string;
    platform: string;
  };
}

interface BenchmarkResult {
  name: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  iterations: number;
  totalTime: number;
}

interface CrossRuntimeReport {
  timestamp: string;
  totalBenchmarkTime: number;
  runtimes: RuntimeResult[];
  comparison: {
    fastest: { [algorithm: string]: string };
    slowest: { [algorithm: string]: string };
    performanceRatio: { [algorithm: string]: { [runtime: string]: number } };
  };
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function printCrossRuntimeTable(runtimes: RuntimeResult[]) {
  console.log('\n' + '='.repeat(150));
  console.log('🚀 CROSS-RUNTIME ALGORITHM BENCHMARK COMPARISON');
  console.log('='.repeat(150));
  
  // Get all algorithm names
  const algorithms = runtimes[0]?.results.map(r => r.name) || [];
  
  // Table header
  const header = '│ Algorithm'.padEnd(35) + 
    '│ Node.js'.padEnd(15) + 
    '│ Bun'.padEnd(15) + 
    '│ Deno'.padEnd(15) + 
    '│ Fastest'.padEnd(15) + 
    '│ Ratio (Bun/Node)'.padEnd(18) + '│';
  console.log(header);
  console.log('├' + '─'.repeat(33) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(16) + '┤');
  
  // Table rows
  algorithms.forEach(algorithm => {
    const nodeResult = runtimes.find(r => r.runtime === 'Node.js')?.results.find(r => r.name === algorithm);
    const bunResult = runtimes.find(r => r.runtime === 'Bun')?.results.find(r => r.name === algorithm);
    const denoResult = runtimes.find(r => r.runtime === 'Deno')?.results.find(r => r.name === algorithm);
    
    const nodeTime = nodeResult ? formatTime(nodeResult.mean) : 'N/A';
    const bunTime = bunResult ? formatTime(bunResult.mean) : 'N/A';
    const denoTime = denoResult ? formatTime(denoResult.mean) : 'N/A';
    
    // Find fastest
    const times = [
      { runtime: 'Node.js', time: nodeResult?.mean || Infinity },
      { runtime: 'Bun', time: bunResult?.mean || Infinity },
      { runtime: 'Deno', time: denoResult?.mean || Infinity }
    ].filter(t => t.time !== Infinity);
    
    const fastest = times.length > 0 ? times.reduce((min, current) => 
      current.time < min.time ? current : min
    ).runtime : 'N/A';
    
    // Calculate ratio (Bun/Node)
    const ratio = (nodeResult && bunResult) ? 
      (bunResult.mean / nodeResult.mean).toFixed(2) + 'x' : 'N/A';
    
    const name = algorithm.length > 32 ? algorithm.substring(0, 29) + '...' : algorithm;
    console.log(
      '│ ' + name.padEnd(33) + 
      '│ ' + nodeTime.padEnd(13) + 
      '│ ' + bunTime.padEnd(13) + 
      '│ ' + denoTime.padEnd(13) + 
      '│ ' + fastest.padEnd(13) + 
      '│ ' + ratio.padEnd(16) + '│'
    );
  });
  
  console.log('└' + '─'.repeat(33) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(16) + '┘');
  
  // Summary statistics
  const totalTimes = runtimes.map(r => r.totalTime);
  const fastestTotal = Math.min(...totalTimes);
  const slowestTotal = Math.max(...totalTimes);
  
  console.log(`\n📊 RUNTIME PERFORMANCE SUMMARY:`);
  runtimes.forEach(runtime => {
    const speedup = (runtime.totalTime / fastestTotal).toFixed(2);
    console.log(`   ${runtime.runtime}: ${formatTime(runtime.totalTime)} (${speedup}x slower than fastest)`);
  });
  console.log('='.repeat(150));
}

async function runBenchmarkOnRuntime(runtime: string): Promise<RuntimeResult> {
  console.log(`\n🔄 Running benchmarks on ${runtime}...`);
  
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];
    
    switch (runtime) {
      case 'Node.js':
        command = 'npx';
        args = ['tsx', 'index.ts'];
        break;
      case 'Bun':
        command = 'bun';
        args = ['run', 'index.ts'];
        break;
      case 'Deno':
        command = 'deno';
        args = ['run', '--allow-read', '--allow-write', '--unstable-sloppy-imports', 'index.ts'];
        break;
      default:
        reject(new Error(`Unknown runtime: ${runtime}`));
        return;
    }
    
    const startTime = Date.now();
    const child = spawn(command, args, { 
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true 
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout?.on('data', (data) => {
      stdout += data.toString();
      // Show progress
      process.stdout.write(`   ${runtime}: ${data.toString().split('\n').pop() || ''}\r`);
    });
    
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', async (code) => {
      const endTime = Date.now();
      
      if (code !== 0) {
        console.log(`\n❌ ${runtime} failed with code ${code}`);
        console.log(`Error: ${stderr}`);
        reject(new Error(`${runtime} benchmark failed`));
        return;
      }
      
      try {
        // Parse the output to extract results
        const results = parseBenchmarkOutput(stdout);
        const totalTime = endTime - startTime;
        
        console.log(`\n✅ ${runtime} completed in ${formatTime(totalTime)}`);
        
        resolve({
          runtime,
          results,
          totalTime,
          timestamp: new Date().toISOString(),
          environment: {
            version: getRuntimeVersion(runtime, stdout),
            platform: process.platform
          }
        });
      } catch (error) {
        reject(new Error(`Failed to parse ${runtime} results: ${error}`));
      }
    });
    
    child.on('error', (error) => {
      console.log(`\n❌ Failed to start ${runtime}: ${error.message}`);
      reject(error);
    });
  });
}

function parseBenchmarkOutput(output: string): BenchmarkResult[] {
  const results: BenchmarkResult[] = [];
  const lines = output.split('\n');
  
  // Look for the table section
  let inTable = false;
  for (const line of lines) {
    if (line.includes('│ Algorithm')) {
      inTable = true;
      continue;
    }
    if (inTable && line.includes('└')) {
      break;
    }
    if (inTable && line.includes('│') && !line.includes('├') && !line.includes('└')) {
      const parts = line.split('│').map(p => p.trim()).filter(p => p);
      if (parts.length >= 7) {
        const name = parts[0];
        const mean = parseFloat(parts[1].replace(/[^\d.]/g, ''));
        const median = parseFloat(parts[2].replace(/[^\d.]/g, ''));
        const min = parseFloat(parts[3].replace(/[^\d.]/g, ''));
        const max = parseFloat(parts[4].replace(/[^\d.]/g, ''));
        const iterations = parseInt(parts[5]);
        const totalTime = parseFloat(parts[6].replace(/[^\d.]/g, ''));
        
        if (!isNaN(mean)) {
          results.push({
            name,
            mean,
            median,
            min,
            max,
            iterations,
            totalTime
          });
        }
      }
    }
  }
  
  return results;
}

function getRuntimeVersion(runtime: string, output: string): string {
  const lines = output.split('\n');
  for (const line of lines) {
    if (runtime === 'Node.js' && line.includes('nodeVersion')) {
      const match = line.match(/"nodeVersion":\s*"([^"]+)"/);
      return match ? match[1] : 'unknown';
    }
    if (runtime === 'Bun' && line.includes('Bun v')) {
      const match = line.match(/Bun v([\d.]+)/);
      return match ? match[1] : 'unknown';
    }
    if (runtime === 'Deno' && line.includes('deno ')) {
      const match = line.match(/deno ([\d.]+)/);
      return match ? match[1] : 'unknown';
    }
  }
  return 'unknown';
}

function calculateComparison(runtimes: RuntimeResult[]): CrossRuntimeReport['comparison'] {
  const algorithms = runtimes[0]?.results.map(r => r.name) || [];
  const fastest: { [algorithm: string]: string } = {};
  const slowest: { [algorithm: string]: string } = {};
  const performanceRatio: { [algorithm: string]: { [runtime: string]: number } } = {};
  
  algorithms.forEach(algorithm => {
    const algorithmResults = runtimes.map(r => ({
      runtime: r.runtime,
      result: r.results.find(res => res.name === algorithm)
    })).filter(r => r.result);
    
    if (algorithmResults.length > 0) {
      // Find fastest and slowest
      const sorted = algorithmResults.sort((a, b) => a.result!.mean - b.result!.mean);
      fastest[algorithm] = sorted[0].runtime;
      slowest[algorithm] = sorted[sorted.length - 1].runtime;
      
      // Calculate performance ratios
      const baseline = sorted[0].result!.mean;
      performanceRatio[algorithm] = {};
      algorithmResults.forEach(({ runtime, result }) => {
        performanceRatio[algorithm][runtime] = result!.mean / baseline;
      });
    }
  });
  
  return { fastest, slowest, performanceRatio };
}

async function saveCrossRuntimeReport(report: CrossRuntimeReport) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Create organized folder structure for cross-runtime comparisons
  const benchmarkDir = `benchmarks/cross-runtime`;
  const jsonFilename = `${benchmarkDir}/comparison-${date}-${timestamp}.json`;
  const csvFilename = `${benchmarkDir}/comparison-${date}-${timestamp}.csv`;
  
  try {
    // Ensure benchmark directory exists
    await fs.mkdir(benchmarkDir, { recursive: true });
    
    // Save JSON report
    await fs.writeFile(jsonFilename, JSON.stringify(report, null, 2));
    console.log(`\n💾 Cross-runtime JSON report saved to: ${jsonFilename}`);
    
    // Save CSV report
    const csvHeader = 'Algorithm,Node.js (ms),Bun (ms),Deno (ms),Fastest Runtime,Bun/Node Ratio,Deno/Node Ratio\n';
    const csvRows = report.runtimes[0]?.results.map(result => {
      const nodeResult = report.runtimes.find(r => r.runtime === 'Node.js')?.results.find(r => r.name === result.name);
      const bunResult = report.runtimes.find(r => r.runtime === 'Bun')?.results.find(r => r.name === result.name);
      const denoResult = report.runtimes.find(r => r.runtime === 'Deno')?.results.find(r => r.name === result.name);
      
      const fastest = report.comparison.fastest[result.name] || 'N/A';
      const bunRatio = (bunResult && nodeResult) ? (bunResult.mean / nodeResult.mean).toFixed(3) : 'N/A';
      const denoRatio = (denoResult && nodeResult) ? (denoResult.mean / nodeResult.mean).toFixed(3) : 'N/A';
      
      return `"${result.name}",${nodeResult?.mean.toFixed(3) || 'N/A'},${bunResult?.mean.toFixed(3) || 'N/A'},${denoResult?.mean.toFixed(3) || 'N/A'},"${fastest}",${bunRatio},${denoRatio}`;
    }).join('\n') || '';
    
    await fs.writeFile(csvFilename, csvHeader + csvRows);
    console.log(`📊 Cross-runtime CSV report saved to: ${csvFilename}`);
    
  } catch (error) {
    console.log(`\n⚠️  Could not save cross-runtime report: ${error}`);
  }
}

async function runCrossRuntimeBenchmark() {
  const startTime = Date.now();
  console.log('🚀 Starting Cross-Runtime Algorithm Benchmark Suite');
  console.log('📋 This will run benchmarks on Node.js, Bun, and Deno for comparison\n');
  
  const runtimes = ['Node.js', 'Bun', 'Deno'];
  const results: RuntimeResult[] = [];
  
  // Run benchmarks on each runtime
  for (const runtime of runtimes) {
    try {
      const result = await runBenchmarkOnRuntime(runtime);
      results.push(result);
    } catch (error) {
      console.log(`\n❌ Failed to run ${runtime} benchmarks: ${error}`);
      // Continue with other runtimes
    }
  }
  
  if (results.length === 0) {
    console.log('\n❌ No successful benchmark runs. Please check your runtime installations.');
    return;
  }
  
  const totalTime = Date.now() - startTime;
  
  // Print comparison table
  printCrossRuntimeTable(results);
  
  // Calculate comparison metrics
  const comparison = calculateComparison(results);
  
  // Create comprehensive report
  const report: CrossRuntimeReport = {
    timestamp: new Date().toISOString(),
    totalBenchmarkTime: totalTime,
    runtimes: results,
    comparison
  };
  
  // Save reports
  await saveCrossRuntimeReport(report);
  
  console.log(`\n🎉 Cross-runtime benchmark completed in ${formatTime(totalTime)}!`);
  console.log(`📊 Successfully tested ${results.length} runtimes with ${results[0]?.results.length || 0} algorithms each`);
}

// Run the cross-runtime benchmark
if (typeof import.meta !== 'undefined' && import.meta.main) {
  runCrossRuntimeBenchmark().catch(console.error);
} else if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].endsWith('cross-runtime-benchmark.ts')) {
  runCrossRuntimeBenchmark().catch(console.error);
}
