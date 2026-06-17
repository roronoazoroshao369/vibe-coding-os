#!/usr/bin/env node
// validate-all.mjs — full release validation gate for Vibe Coding OS

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const checks = [
  ['Repo structure', 'node', ['scripts/validate-repo.mjs']],
  ['References', 'node', ['scripts/validate-references.mjs']],
  ['Registry schemas', 'node', ['scripts/validate-schemas.mjs']],
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
  ['Markdown links', 'node', ['scripts/validate-markdown-links.mjs']]
];

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function lastMeaningfulLines(output, count = 8) {
  const lines = output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
  return lines.slice(-count);
}

function summarizeEvaluationReport(output) {
  const start = output.indexOf('=== Vibe Coding OS Evaluation Report ===');
  if (start === -1) return output;
  const summary = output.slice(start).split('\n').filter((line) => !line.startsWith('Markdown report written to'));
  return summary.join('\n').trim();
}

const results = [];

console.log('=== Vibe Coding OS Full Validation Gate ===');
console.log(`Started: ${new Date().toISOString()}`);
console.log('');

for (const [name, command, args] of checks) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  const passed = result.status === 0;
  const duration = Date.now() - started;

  results.push({ name, passed, status: result.status ?? 1, duration, output });

  console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASS' : 'FAIL'} (${formatDuration(duration)})`);

  if (name === 'Evaluation report' && output) {
    console.log(summarizeEvaluationReport(output));
  } else if (!passed && output) {
    console.log('Last output lines:');
    for (const line of lastMeaningfulLines(output)) console.log(`  ${line}`);
  }
  console.log('');
}

const passedCount = results.filter((result) => result.passed).length;
console.log(`Overall: ${passedCount}/${results.length} checks passed`);

if (passedCount !== results.length) {
  process.exit(1);
}
