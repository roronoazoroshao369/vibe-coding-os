#!/usr/bin/env node
// smoke-test-cli.mjs — smoke tests for vibe CLI commands

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const commands = [
  { args: ['help'] },
  { args: ['--help'] },
  { args: ['-h'] },
  { args: ['stats'] },
  { args: ['templates'] },
  { args: ['spec'] },
  { args: ['plan'] },
  { args: ['memory'] },
  { args: ['task'] },
  { args: ['doctor'] },
  { args: ['list-skills'] },
  { args: ['list-skills', 'memory'] },
  { args: ['list-commands'] },
  { args: ['init', 'claude-code'], cwd: 'tmp' },
  { args: ['init', 'codex'], cwd: 'tmp' },
  { args: ['init', 'cursor'], cwd: 'tmp' },
  { args: ['init', 'gemini'], cwd: 'tmp' },
  { args: ['spec', '--copy'], cwd: 'tmp' },
  { args: ['workflow', 'status'] },
  { args: ['invalid-command'], expectedStatus: 1 },
];

function formatCommand(args) {
  return ['node', 'scripts/vibe-cli.mjs', ...args].join(' ');
}

const results = [];
const tmpCwd = mkdtempSync(join(tmpdir(), 'vibe-cli-smoke-'));

console.log('=== Vibe CLI Smoke Tests ===');
console.log(`Started: ${new Date().toISOString()}`);
console.log('');

for (const commandSpec of commands) {
  const { args, expectedStatus = 0, cwd = ROOT } = commandSpec;
  const result = spawnSync(process.execPath, [join(ROOT, 'scripts', 'vibe-cli.mjs'), ...args], {
    cwd: cwd === 'tmp' ? tmpCwd : cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024
  });

  const passed = result.status === expectedStatus;
  const command = formatCommand(args);
  results.push({ command, passed, status: result.status ?? 1, expectedStatus });

  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} ${command} (expected ${expectedStatus}, got ${result.status ?? 1})`);
  if (!passed) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    if (output) {
      console.log('Last output lines:');
      for (const line of output.split('\n').slice(-8)) console.log(`  ${line}`);
    }
  }
}

rmSync(tmpCwd, { recursive: true, force: true });

console.log('');
const passedCount = results.filter((result) => result.passed).length;
console.log(`Overall: ${passedCount}/${results.length} CLI commands passed`);

if (passedCount !== results.length) {
  process.exit(1);
}
