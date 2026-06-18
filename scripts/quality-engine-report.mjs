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
    try { return JSON.parse(args.outputJson); } catch {}
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

function generateMarkdown(data) {
  const lines = [];
  const { engine, version, profile, startedAt, finishedAt, durationMs, totalTimeoutMs, summary, warnings, results } = data;

  lines.push('# Quality Engine Report');
  lines.push('');
  lines.push(`- Engine: \`${engine || 'quality-engine'}\` v${version ?? 1}`);
  lines.push(`- Profile: \`${profile || 'standard'}\``);
  lines.push(`- Started: ${startedAt || 'unknown'}`);
  lines.push(`- Finished: ${finishedAt || 'unknown'}`);
  lines.push(`- Duration: ${formatDuration(durationMs || 0)} (timeout: ${formatDuration(totalTimeoutMs || 0)})`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total gates: ${summary?.total ?? results?.length ?? 0}`);
  lines.push(`- Passed: ${summary?.passed ?? 0}`);
  lines.push(`- Failed: ${summary?.failed ?? 0}`);
  lines.push(`- Critical failures: ${summary?.criticalFailures ?? 0}`);
  lines.push(`- Advisory failures: ${summary?.advisoryFailures ?? 0}`);
  lines.push('');
  if (warnings?.length) {
    lines.push('## Warnings');
    lines.push('');
    for (const warning of warnings) lines.push(`- ${warning}`);
    lines.push('');
  }
  lines.push('## Gate Results');
  lines.push('');
  for (const result of results || []) {
    const icon = result.passed ? '✅' : result.critical ? '❌' : '⚠️';
    const kind = result.critical ? 'critical' : 'advisory';
    const cat = result.category ? ` [${result.category}]` : '';
    lines.push(`- ${icon} **${result.name}**${cat} (${kind}): ${result.passed ? 'PASS' : result.timedOut ? 'TIMEOUT' : 'FAIL'} (${formatDuration(result.durationMs || 0)})`);
    if (!result.passed && result.stderr) {
      const snippet = result.stderr.split('\n').filter(Boolean).slice(-3).map(l => l.trim()).filter(Boolean);
      for (const line of snippet) lines.push(`  - \`${line}\``);
    }
  }
  lines.push('');
  lines.push('## Recommendations');
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
    lines.push('- No action required; all selected gates passed.');
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  const data = await loadReportData(args);
  if (!data || !Array.isArray(data.results)) {
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
