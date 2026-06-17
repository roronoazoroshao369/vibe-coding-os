#!/usr/bin/env node
// runtime-behavior-tests.mjs — run all runtime behavioral integration tests and report summary

import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const testFiles = [
  'scripts/test-runtime-enforcement.mjs',
  'scripts/test-runtime-claim-lease.mjs',
  'scripts/test-runtime-collection-envelope.mjs',
  'scripts/test-runtime-approval-gate.mjs',
  'scripts/test-runtime-tool-contract.mjs',
  'scripts/test-task-state-machine.mjs',
  'scripts/test-runtime-config.mjs',
  'scripts/test-event-store-v2.mjs',
  'scripts/test-runtime-doctor.mjs',
  'scripts/test-cli-json-contracts.mjs',
  'scripts/test-runtime-audit.mjs',
  'scripts/test-runtime-replay.mjs',
  'scripts/test-runtime-snapshot.mjs',
  'scripts/test-runtime-migrate.mjs',
];

const results = [];

console.log('=== Runtime Behavioral Integration Tests ===');
console.log(`Started: ${new Date().toISOString()}`);
console.log('');

for (const file of testFiles) {
  const started = Date.now();
  const result = spawnSync('node', [file], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  const passed = result.status === 0;
  const duration = Date.now() - started;

  results.push({ file, passed, status: result.status ?? 1, duration, output });

  const shortFile = file.replace('scripts/', '');
  console.log(`${passed ? '✅' : '❌'} ${shortFile}: ${passed ? 'PASS' : 'FAIL'} (${duration}ms)`);
  if (!passed && output) {
    console.log('Last output:');
    console.log(`  ${output.split('\n').slice(-4).join('\n  ')}`);
  }
  console.log('');
}

const passedCount = results.filter((r) => r.passed).length;
console.log(`Overall: ${passedCount}/${results.length} runtime behavior tests passed`);

if (passedCount !== results.length) {
  process.exit(1);
}
