#!/usr/bin/env node
// benchmark-validation-gates.mjs — run each validation gate individually,
// measure execution time (ms), pass/fail status, and log results to JSON report.
// Output: benchmark-report.json with per-gate timings.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BENCH_DIR = join(ROOT, 'docs', 'reports', 'benchmarks');
const DEFAULT_OUTPUT = join(BENCH_DIR, 'benchmark-report.json');
const HISTORY_DIR = join(BENCH_DIR, 'history');

// All 26 validation gates exactly matching validate-all.mjs
const GATES = [
  ['Repo structure', 'node', ['scripts/validate-repo.mjs']],
  ['References', 'node', ['scripts/validate-references.mjs']],
  ['Registry schemas', 'node', ['scripts/validate-schemas.mjs']],
  ['Pack schemas', 'node', ['scripts/validate-pack-schemas.mjs']],
  ['Traceability', 'node', ['scripts/validate-traceability.mjs']],
  ['Injection scan', 'node', ['scripts/validate-injection.mjs']],
  ['Secret scan', 'node', ['scripts/validate-secrets.mjs']],
  ['Memory redaction', 'node', ['scripts/verify-memory-redaction.mjs']],
  ['Adapter smoke tests', 'node', ['scripts/smoke-test-adapters.mjs']],
  ['CLI smoke tests', 'node', ['scripts/smoke-test-cli.mjs']],
  ['E2E workflow', 'node', ['scripts/test-e2e-workflow.mjs']],
  ['Dashboard data', 'node', ['scripts/dashboard-data.mjs']],
  ['Dashboard sync check', 'node', ['scripts/check-dashboard-sync.mjs']],
  ['Release metadata', 'node', ['scripts/validate-release-metadata.mjs']],
  ['Evaluation report', 'node', ['scripts/evaluation-report.mjs']],
  ['Bilingual README sync', 'node', ['scripts/validate-bilingual-sync.mjs']],
  ['Markdown links', 'node', ['scripts/validate-markdown-links.mjs']],
  ['README heading version', 'node', ['scripts/check-heading-version.mjs']],
  ['ROADMAP-STATUS integrity', 'node', ['scripts/validate-roadmap-status.mjs']],
  ['ROADMAP future-drift', 'node', ['scripts/validate-roadmap-future-drift.mjs']],
  ['Runtime freeze guard', 'node', ['scripts/validate-runtime-freeze.mjs']],
  ['Runtime behavioral tests', 'node', ['scripts/runtime-behavior-tests.mjs']],
  ['Quality diff audit', 'node', ['scripts/validate-quality-diff.mjs']],
  ['Quality scorecard report', 'node', ['scripts/quality-scorecard-report.mjs']],
  ['Quality engine', 'node', ['scripts/quality-engine.mjs', '--profile=lean', '--output-json']],
  ['Quality engine integration tests', 'node', ['scripts/test-quality-engine.mjs', '--lean']]
];

function parseArgs(argv) {
  const args = { output: DEFAULT_OUTPUT, warmup: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--output' && argv[i + 1]) args.output = resolve(ROOT, argv[++i]);
    else if (a.startsWith('--output=')) args.output = resolve(ROOT, a.slice('--output='.length));
    else if (a === '--warmup') args.warmup = true;
    else if (a === '--verbose') args.verbose = true;
  }
  return args;
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function runGate(name, command, args, options) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024
  });
  const duration = Date.now() - started;
  const passed = result.status === 0;
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();

  if (options.verbose) {
    console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASS' : 'FAIL'} (${formatDuration(duration)})`);
    if (!passed && output) {
      const lines = output.split('\n').filter(l => l.trim()).slice(-5);
      for (const line of lines) console.log(`  ${line}`);
    }
  }

  return {
    name,
    passed,
    status: result.status ?? 1,
    duration,
    durationMs: duration,
    timestamp: new Date().toISOString(),
    outputLength: output.length,
    command: `${command} ${args.join(' ')}`
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  // Ensure output directory exists
  if (!existsSync(BENCH_DIR)) mkdirSync(BENCH_DIR, { recursive: true });
  if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true });

  console.log('=== Vibe Coding OS — Validation Gate Benchmark ===');
  console.log(`Started: ${new Date().toISOString()}`);
  console.log(`Total gates: ${GATES.length}`);
  console.log('');

  // Optional warmup run (cold-start caches, fs buffers, etc.)
  if (options.warmup) {
    console.log('Warmup phase...');
    for (const [name, command, args] of GATES.slice(0, 3)) {
      spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', stdio: 'ignore' });
    }
    console.log('Warmup complete.\n');
  }

  const results = [];
  for (const [name, command, args] of GATES) {
    const entry = runGate(name, command, args, options);
    results.push(entry);
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const fastest = [...results].sort((a, b) => a.duration - b.duration)[0];
  const slowest = [...results].sort((a, b) => b.duration - a.duration)[0];

  const report = {
    meta: {
      version: '2.7.0',
      tool: 'benchmark-validation-gates',
      gatesCount: GATES.length,
      passedCount,
      failedCount: GATES.length - passedCount,
      totalDurationMs: totalDuration,
      averageDurationMs: Math.round(totalDuration / GATES.length),
      fastestGate: { name: fastest.name, durationMs: fastest.duration },
      slowestGate: { name: slowest.name, durationMs: slowest.duration },
      timestamp: new Date().toISOString(),
      ci: process.env.CI === 'true',
      nodeVersion: process.version,
      platform: process.platform
    },
    gates: results
  };

  // Write report
  writeFileSync(options.output, JSON.stringify(report, null, 2), 'utf8');

  // Archive to history with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const historyFile = join(HISTORY_DIR, `benchmark-${timestamp}.json`);
  writeFileSync(historyFile, JSON.stringify(report, null, 2), 'utf8');

  console.log('');
  console.log('=== Benchmark Summary ===');
  console.log(`Passed: ${passedCount}/${GATES.length}`);
  console.log(`Failed: ${GATES.length - passedCount}/${GATES.length}`);
  console.log(`Total duration: ${formatDuration(totalDuration)}`);
  console.log(`Average per gate: ${formatDuration(Math.round(totalDuration / GATES.length))}`);
  console.log(`Fastest: ${fastest.name} (${formatDuration(fastest.duration)})`);
  console.log(`Slowest: ${slowest.name} (${formatDuration(slowest.duration)})`);
  console.log('');
  console.log(`Report written to: ${options.output}`);
  console.log(`History archived to: ${historyFile}`);

  // Always exit 0 — benchmark measures even when gates fail
  process.exit(0);
}

main().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
