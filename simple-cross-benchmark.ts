// Simple Cross-Runtime Benchmark Suite
// Runs benchmarks on Bun and Deno and compares results

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';

interface BenchmarkResult {
  name: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  iterations: number;
  totalTime: number;
}

interface RuntimeResult {
  runtime: string;
  results: BenchmarkResult[];
  totalTime: number;
  timestamp: string;
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function printComparisonTable(runtimes: RuntimeResult[]) {
  console.log('\n' + '='.repeat(120));
  console.log('🚀 CROSS-RUNTIME ALGORITHM BENCHMARK COMPARISON');
  console.log('='.repeat(120));
  
  const algorithms = runtimes[0]?.results.map(r => r.name) || [];
  
  // Table header
  const header = '│ Algorithm'.padEnd(35) + 
    '│ Bun'.padEnd(15) + 
    '│ Deno'.padEnd(15) + 
    '│ Fastest'.padEnd(15) + 
    '│ Speedup'.padEnd(15) + '│';
  console.log(header);
  console.log('├' + '─'.repeat(33) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┼' + '─'.repeat(13) + '┤');
  
  // Table rows
  algorithms.forEach(algorithm => {
    const bunResult = runtimes.find(r => r.runtime === 'Bun')?.results.find(r => r.name === algorithm);
    const denoResult = runtimes.find(r => r.runtime === 'Deno')?.results.find(r => r.name === algorithm);
    
    const bunTime = bunResult ? formatTime(bunResult.mean) : 'N/A';
    const denoTime = denoResult ? formatTime(denoResult.mean) : 'N/A';
    
    // Find fastest and calculate speedup
    let fastest = 'N/A';
    let speedup = 'N/A';
    
    if (bunResult && denoResult) {
      if (bunResult.mean < denoResult.mean) {
        fastest = 'Bun';
        speedup = `${(denoResult.mean / bunResult.mean).toFixed(2)}x`;
      } else {
        fastest = 'Deno';
        speedup = `${(bunResult.mean / denoResult.mean).toFixed(2)}x`;
      }
    }
    
    const name = algorithm.length > 32 ? algorithm.substring(0, 29) + '...' : algorithm;
    console.log(
      '│ ' + name.padEnd(33) + 
      '│ ' + bunTime.padEnd(13) + 
      '│ ' + denoTime.padEnd(13) + 
      '│ ' + fastest.padEnd(13) + 
      '│ ' + speedup.padEnd(13) + '│'
    );
  });
  
  console.log('└' + '─'.repeat(33) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┴' + '─'.repeat(13) + '┘');
  
  // Summary statistics
  const bunTotal = runtimes.find(r => r.runtime === 'Bun')?.totalTime || 0;
  const denoTotal = runtimes.find(r => r.runtime === 'Deno')?.totalTime || 0;
  const fastestTotal = Math.min(bunTotal, denoTotal);
  const slowestTotal = Math.max(bunTotal, denoTotal);
  
  console.log(`\n📊 RUNTIME PERFORMANCE SUMMARY:`);
  console.log(`   Bun: ${formatTime(bunTotal)} (${(bunTotal / fastestTotal).toFixed(2)}x)`);
  console.log(`   Deno: ${formatTime(denoTotal)} (${(denoTotal / fastestTotal).toFixed(2)}x)`);
  console.log(`   Overall fastest: ${bunTotal < denoTotal ? 'Bun' : 'Deno'}`);
  console.log('='.repeat(120));
}

async function runBenchmarkOnRuntime(runtime: string): Promise<RuntimeResult> {
  console.log(`\n🔄 Running benchmarks on ${runtime}...`);
  
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];
    
    switch (runtime) {
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
      const lines = data.toString().split('\n');
      const lastLine = lines[lines.length - 2] || lines[lines.length - 1];
      if (lastLine && lastLine.trim()) {
        process.stdout.write(`   ${runtime}: ${lastLine.trim()}\r`);
      }
    });
    
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', async (code) => {
      const endTime = Date.now();
      
      if (code !== 0) {
        console.log(`\n❌ ${runtime} failed with code ${code}`);
        if (stderr) console.log(`Error: ${stderr}`);
        reject(new Error(`${runtime} benchmark failed`));
        return;
      }
      
      try {
        const results = parseBenchmarkOutput(stdout);
        const totalTime = endTime - startTime;
        
        console.log(`\n✅ ${runtime} completed in ${formatTime(totalTime)}`);
        
        resolve({
          runtime,
          results,
          totalTime,
          timestamp: new Date().toISOString()
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

async function saveComparisonReport(runtimes: RuntimeResult[], totalTime: number) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonFilename = `bun-vs-deno-benchmark-${timestamp}.json`;
  const csvFilename = `bun-vs-deno-benchmark-${timestamp}.csv`;
  
  try {
    // Save JSON report
    const report = {
      timestamp: new Date().toISOString(),
      totalBenchmarkTime: totalTime,
      runtimes,
      summary: {
        bunTotalTime: runtimes.find(r => r.runtime === 'Bun')?.totalTime || 0,
        denoTotalTime: runtimes.find(r => r.runtime === 'Deno')?.totalTime || 0,
        fastestOverall: runtimes.find(r => r.runtime === 'Bun')?.totalTime < runtimes.find(r => r.runtime === 'Deno')?.totalTime ? 'Bun' : 'Deno'
      }
    };
    
    await fs.writeFile(jsonFilename, JSON.stringify(report, null, 2));
    console.log(`\n💾 Comparison JSON report saved to: ${jsonFilename}`);
    
    // Save CSV report
    const csvHeader = 'Algorithm,Bun (ms),Deno (ms),Fastest Runtime,Speedup\n';
    const csvRows = runtimes[0]?.results.map(result => {
      const bunResult = runtimes.find(r => r.runtime === 'Bun')?.results.find(r => r.name === result.name);
      const denoResult = runtimes.find(r => r.runtime === 'Deno')?.results.find(r => r.name === result.name);
      
      let fastest = 'N/A';
      let speedup = 'N/A';
      
      if (bunResult && denoResult) {
        if (bunResult.mean < denoResult.mean) {
          fastest = 'Bun';
          speedup = (denoResult.mean / bunResult.mean).toFixed(3);
        } else {
          fastest = 'Deno';
          speedup = (bunResult.mean / denoResult.mean).toFixed(3);
        }
      }
      
      return `"${result.name}",${bunResult?.mean.toFixed(3) || 'N/A'},${denoResult?.mean.toFixed(3) || 'N/A'},"${fastest}",${speedup}`;
    }).join('\n') || '';
    
    await fs.writeFile(csvFilename, csvHeader + csvRows);
    console.log(`📊 Comparison CSV report saved to: ${csvFilename}`);
    
  } catch (error) {
    console.log(`\n⚠️  Could not save comparison report: ${error}`);
  }
}

async function runSimpleCrossBenchmark() {
  const startTime = Date.now();
  console.log('🚀 Starting Bun vs Deno Algorithm Benchmark Comparison');
  console.log('📋 This will run benchmarks on both runtimes for direct comparison\n');
  
  const runtimes = ['Bun', 'Deno'];
  const results: RuntimeResult[] = [];
  
  // Run benchmarks on each runtime
  for (const runtime of runtimes) {
    try {
      const result = await runBenchmarkOnRuntime(runtime);
      results.push(result);
    } catch (error) {
      console.log(`\n❌ Failed to run ${runtime} benchmarks: ${error}`);
    }
  }
  
  if (results.length === 0) {
    console.log('\n❌ No successful benchmark runs. Please check your runtime installations.');
    return;
  }
  
  const totalTime = Date.now() - startTime;
  
  // Print comparison table
  printComparisonTable(results);
  
  // Save reports
  await saveComparisonReport(results, totalTime);
  
  console.log(`\n🎉 Cross-runtime benchmark completed in ${formatTime(totalTime)}!`);
  console.log(`📊 Successfully tested ${results.length} runtimes with ${results[0]?.results.length || 0} algorithms each`);
}

// Run the simple cross-runtime benchmark
if (typeof import.meta !== 'undefined' && import.meta.main) {
  runSimpleCrossBenchmark().catch(console.error);
} else if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].endsWith('simple-cross-benchmark.ts')) {
  runSimpleCrossBenchmark().catch(console.error);
}
