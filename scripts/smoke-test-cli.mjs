#!/usr/bin/env node
// smoke-test-cli.mjs — smoke tests for read-only vibe CLI commands

import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const commands = [
  ['help'],
  ['--help'],
  ['-h'],
  ['stats'],
  ['templates'],
  ['spec'],
  ['plan'],
  ['memory'],
  ['task']
];

function formatCommand(args) {
  return ['node', 'scripts/vibe-cli.mjs', ...args].join(' ');
}

const results = [];

console.log('=== Vibe CLI Smoke Tests ===');
console.log(`Started: ${new Date().toISOString()}`);
console.log('');

for (const args of commands) {
  const result = spawnSync(process.execPath, [join(ROOT, 'scripts', 'vibe-cli.mjs'), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024
  });

  const passed = result.status === 0;
  const command = formatCommand(args);
  results.push({ command, passed, status: result.status ?? 1 });

  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} ${command}`);
  if (!passed) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    if (output) {
      console.log('Last output lines:');
      for (const line of output.split('\n').slice(-8)) console.log(`  ${line}`);
    }
  }
}

console.log('');
const passedCount = results.filter((result) => result.passed).length;
console.log(`Overall: ${passedCount}/${results.length} CLI commands passed`);

if (passedCount !== results.length) {
  process.exit(1);
}
