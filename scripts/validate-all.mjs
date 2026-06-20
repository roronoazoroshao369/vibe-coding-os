#!/usr/bin/env node
// validate-all.mjs — full release validation gate for Vibe Coding OS

import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const checks = [
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
  ['Bilingual README sync', 'node', ['scripts/validate-bilingual-sync.mjs']],
  ['Markdown links', 'node', ['scripts/validate-markdown-links.mjs']],
  ['README heading version', 'node', ['scripts/check-heading-version.mjs']],
  ['ROADMAP-STATUS integrity', 'node', ['scripts/validate-roadmap-status.mjs']],
  ['ROADMAP future-drift', 'node', ['scripts/validate-roadmap-future-drift.mjs']],
  ['Runtime freeze guard', 'node', ['scripts/validate-runtime-freeze.mjs']],
  ['License policy', 'node', ['scripts/validate-licenses.mjs']],
  ['Traceability strict-new', 'node', ['scripts/validate-traceability.mjs', '--strict-new', '--since=v2.12.0']],
  ['Runtime behavioral tests', 'node', ['scripts/runtime-behavior-tests.mjs']],
  ['Quality diff audit', 'node', ['scripts/validate-quality-diff.mjs']],
  ['Provenance gate', 'node', ['scripts/validate-provenance.mjs']],
  ['Skill quality gate', 'node', ['scripts/validate-skill-quality.mjs']],
  ['Security regression', 'node', ['scripts/validate-security-regression.mjs']],
  ['Redaction validation', 'node', ['scripts/validate-redact.mjs']],
  ['Sandbox marker compliance', 'node', ['scripts/validate-sandbox-marker.mjs']],
  ['Quality scorecard report', 'node', ['scripts/quality-scorecard-report.mjs']],
  ['Quality engine', 'node', ['scripts/quality-engine.mjs', '--profile=lean', '--output-json']],
  ['Quality engine integration tests', 'node', ['scripts/test-quality-engine.mjs', '--lean']],
  ['Trust scorer wired (v2.16.0)', 'node', ['scripts/validate-trust-scorer.mjs']],
  ['RTL coverage 100% (v2.16.0)', 'node', ['scripts/validate-rtl-coverage.mjs']],
  ['Evaluation report', 'node', ['scripts/evaluation-report.mjs']],
  ['Property tests ≥80% pass (v2.16.0)', 'node', ['scripts/validate-property-tests.mjs']],
  ['Security command coverage (v2.16.0)', 'node', ['scripts/validate-security-command-coverage.mjs']],
  ['No orphan TODOs (v2.16.0)', 'node', ['scripts/validate-no-orphan-todos.mjs']]
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

await (async () => {

// v2.16.0 Wave B — Parallelize validation: run independent checks concurrently
// Group checks into batches of 6 to balance speed vs resource usage
// All parallel - no batching
const allResults = [];

const batchResults = await Promise.all(checks.map(([name, command, args]) => {
    const started = Date.now();
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 50 * 1024 * 1024
      });
      let output = '';
      child.stdout.on('data', d => output += d);
      child.stderr.on('data', d => output += d);
      child.on('close', (status) => {
        const duration = Date.now() - started;
        resolve({ name, passed: status === 0, status: status ?? 1, duration, output });
      });
  });
}));

for (const r of batchResults) {
  results.push(r);
  console.log(`${r.passed ? '✅' : '❌'} ${r.name}: ${r.passed ? 'PASS' : 'FAIL'} (${formatDuration(r.duration)})`);
  if (r.name === 'Evaluation report' && r.output) {
    console.log(summarizeEvaluationReport(r.output));
  } else if (!r.passed && r.output) {
    console.log('Last output lines:');
    for (const line of lastMeaningfulLines(r.output)) console.log(`  ${line}`);
  }
  console.log('');
}

const passedCount = results.filter((result) => result.passed).length;
console.log(`Overall: ${passedCount}/${results.length} checks passed`);

if (passedCount !== results.length) {
  process.exit(1);
}

})();
