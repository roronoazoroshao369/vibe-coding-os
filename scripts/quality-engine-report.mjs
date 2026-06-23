#!/usr/bin/env node
// quality-engine-report.mjs — generate a markdown report from quality engine JSON output.

import { mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = join(ROOT, 'docs', 'reports', 'quality-engine');

function parseArgs(argv) {
  const args = { outputJson: null, outputDir: DEFAULT_OUTPUT_DIR, stdin: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--output-json=')) args.outputJson = arg.slice('--output-json='.length);
    else if (arg === '--output-json' && argv[i + 1]) args.outputJson = argv[++i];
    else if (arg.startsWith('--output-dir=')) args.outputDir = arg.slice('--output-dir='.length);
    else if (arg === '--output-dir' && argv[i + 1]) args.outputDir = argv[++i];
    else if (arg === '--stdin') args.stdin = true;
  }
  return args;
}

function readStdin() {
  return new Promise((resolveData) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolveData(data));
  });
}

async function loadReportData(args) {
  // 1. If --output-json is a file path, read it
  if (args.outputJson && existsSync(args.outputJson)) {
    return JSON.parse(readFileSync(args.outputJson, 'utf8'));
  }
  // 2. If --output-json is inline JSON, parse it
  if (args.outputJson) {
    try { return JSON.parse(args.outputJson); } catch { /* intentionally empty */ }
  }
  // 3. If --stdin, read from stdin
  if (args.stdin) {
    const data = await readStdin();
    try { return JSON.parse(data); } catch { return null; }
  }
  // 4. Try to find latest report file in default output directory
  const latestFile = resolveLatestReport(ROOT);
  if (latestFile) {
    return JSON.parse(readFileSync(latestFile, 'utf8'));
  }
  return null;
}

function resolveLatestReport(directory) {
  const reportsDir = join(directory, 'docs', 'reports', 'quality-engine');
  if (!existsSync(reportsDir)) return null;
  const files = readdirSync(reportsDir).filter(name => name.endsWith('.json')).sort();
  if (files.length === 0) return null;
  return join(reportsDir, files[files.length - 1]);
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function asRuns(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.runs)) return data.runs;
  return [data];
}

function gateStatus(result) {
  return result.passed ? 'PASS' : result.timedOut ? 'TIMEOUT' : 'FAIL';
}

function generateMarkdown(data) {
  const runs = asRuns(data).filter(run => Array.isArray(run.results));
  const primary = runs[0] || data;
  const lines = [];
  const { engine, version } = primary;

  lines.push('# Quality Engine Report');
  lines.push('');
  lines.push(`- Engine: \`${engine || 'quality-engine'}\` v${version ?? 1}`);
  lines.push(`- Runs included: ${runs.length}`);
  lines.push('');

  if (runs.length > 1) {
    lines.push('## Profile Comparison');
    lines.push('');
    for (const run of runs) {
      lines.push(`- \`${run.profile || 'standard'}\` / \`${run.taskType || 'any'}\`: ${run.passed ? 'PASS' : 'FAIL'}, ${run.summary?.passed ?? 0}/${run.summary?.total ?? run.results.length} passed, ${run.summary?.criticalFailures ?? 0} critical failure(s), duration ${formatDuration(run.durationMs || 0)}`);
    }
    lines.push('');
    const allGateIds = [...new Set(runs.flatMap(run => (run.results || []).map(r => r.id)))].sort();
    lines.push('### Gate-by-gate comparison');
    lines.push('');
    for (const gateId of allGateIds) {
      const statuses = runs.map(run => {
        const result = (run.results || []).find(r => r.id === gateId);
        return `${run.profile || 'standard'}=${result ? gateStatus(result) : 'SKIPPED'}`;
      });
      lines.push(`- ${gateId}: ${statuses.join(', ')}`);
    }
    lines.push('');
  }

  for (const run of runs) {
    const { profile, taskType, startedAt, finishedAt, durationMs, totalTimeoutMs, summary, warnings, results, selected_gates, skipped_gates, residual_risks } = run;
    lines.push(`## Run: ${profile || 'standard'} / ${taskType || 'any'}`);
    lines.push('');
    lines.push(`- Started: ${startedAt || 'unknown'}`);
    lines.push(`- Finished: ${finishedAt || 'unknown'}`);
    lines.push(`- Duration: ${formatDuration(durationMs || 0)} (timeout: ${formatDuration(totalTimeoutMs || 0)})`);
    lines.push(`- Overall: ${run.passed ? 'PASS' : 'FAIL'}`);
    lines.push('');
    lines.push('### Summary');
    lines.push('');
    lines.push(`- Selected gates: ${(selected_gates || results.map(r => r.id)).join(', ') || 'none'}`);
    lines.push(`- Skipped gates: ${(skipped_gates || []).length}`);
    lines.push(`- Total gates run: ${summary?.total ?? results?.length ?? 0}`);
    lines.push(`- Passed: ${summary?.passed ?? 0}`);
    lines.push(`- Failed: ${summary?.failed ?? 0}`);
    lines.push(`- Critical failures: ${summary?.criticalFailures ?? 0}`);
    lines.push(`- Advisory failures: ${summary?.advisoryFailures ?? 0}`);
    lines.push('');
    if (warnings?.length) {
      lines.push('### Warnings');
      lines.push('');
      for (const warning of warnings) lines.push(`- ${warning}`);
      lines.push('');
    }
    lines.push('### Gate Results');
    lines.push('');
    for (const result of results || []) {
      const icon = result.passed ? '✅' : result.critical ? '❌' : '⚠️';
      const kind = result.critical ? 'critical' : 'advisory';
      const cat = result.category ? ` [${result.category}]` : '';
      lines.push(`- ${icon} **${result.name}**${cat} (${kind}): ${gateStatus(result)} (${formatDuration(result.durationMs || 0)})`);
      if (!result.passed && result.stderr) {
        const snippet = result.stderr.split('\n').filter(Boolean).slice(-3).map(l => l.trim()).filter(Boolean);
        for (const line of snippet) lines.push(`  - \`${line}\``);
      }
    }
    lines.push('');
    if ((skipped_gates || []).length) {
      lines.push('### Skipped Gates');
      lines.push('');
      for (const gate of skipped_gates) lines.push(`- ${gate.id}: ${gate.reason}`);
      lines.push('');
    }
    if ((residual_risks || []).length) {
      lines.push('### Residual Risks');
      lines.push('');
      for (const risk of residual_risks.slice(0, 25)) lines.push(`- ${risk.gate || 'engine'} [${risk.severity}]: ${risk.reason}`);
      if (residual_risks.length > 25) lines.push(`- ... ${residual_risks.length - 25} more risk item(s)`);
      lines.push('');
    }
    lines.push('### Recommendations');
    lines.push('');
    const criticalFailures = (results || []).filter(r => r.critical && !r.passed);
    const advisoryFailures = (results || []).filter(r => !r.critical && !r.passed);
    if (criticalFailures.length > 0) {
      lines.push(`- Resolve ${criticalFailures.length} critical gate failure(s) before release.`);
      for (const result of criticalFailures) lines.push(`  - ${result.name}`);
    }
    if (advisoryFailures.length > 0) {
      lines.push(`- Review ${advisoryFailures.length} advisory gate failure(s).`);
      for (const result of advisoryFailures) lines.push(`  - ${result.name}`);
    }
    if (criticalFailures.length === 0 && advisoryFailures.length === 0) {
      lines.push('- No action required for selected gates; review skipped-gate residual risks if this run is release-bound.');
    }
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  const data = await loadReportData(args);
  const runs = asRuns(data || {}).filter(run => Array.isArray(run.results));
  if (!data || runs.length === 0) {
    console.error('No quality engine results found. Run the quality engine first, or provide --output-json <path|json> or --stdin.');
    process.exit(1);
  }
  const outputDir = resolve(args.outputDir);
  mkdirSync(outputDir, { recursive: true });
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const markdownPath = join(outputDir, `quality-engine-${timestamp}.md`);
  const jsonPath = join(outputDir, `quality-engine-${timestamp}.json`);
  const markdown = generateMarkdown(data);
  writeFileSync(markdownPath, `${markdown}\n`, 'utf8');
  writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Wrote markdown report: ${markdownPath}`);
  console.log(`Wrote JSON report: ${jsonPath}`);
}

main();
