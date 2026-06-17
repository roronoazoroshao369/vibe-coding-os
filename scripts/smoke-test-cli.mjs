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
  { args: ['runtime-task', 'list'] },
  { args: ['runtime-task'], expectedStatus: 1 },
  { args: ['workflow', 'status'] },
  { args: ['invalid-command'], expectedStatus: 1 },
];

function formatCommand(args) {
  return ['node', 'scripts/vibe-cli.mjs', ...args].join(' ');
}

function formatRuntimeCommand(args) {
  return ['node', 'scripts/runtime-task.mjs', ...args].join(' ');
}

function runCmd(script, args, opts = {}) {
  const { cwd = ROOT, expectedStatus = 0, label } = opts;
  const result = spawnSync(process.execPath, [join(ROOT, 'scripts', script), ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });

  const passed = result.status === expectedStatus;
  results.push({ command: label || `node scripts/${script} ${args.join(' ')}`, passed, status: result.status ?? 1, expectedStatus });

  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} ${label || `node scripts/${script} ${args.join(' ')}`} (expected ${expectedStatus}, got ${result.status ?? 1})`);
  if (!passed) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    if (output) {
      console.log('Last output lines:');
      for (const line of output.split('\n').slice(-8)) console.log(`  ${line}`);
    }
  }
  return result;
}

const results = [];
const tmpCwd = mkdtempSync(join(tmpdir(), 'vibe-cli-smoke-'));

console.log('=== Vibe CLI Smoke Tests ===');
console.log(`Started: ${new Date().toISOString()}`);
console.log('');

// ── Static command tests ──
for (const commandSpec of commands) {
  const { args, expectedStatus = 0, cwd = ROOT } = commandSpec;
  runCmd('vibe-cli.mjs', args, {
    cwd: cwd === 'tmp' ? tmpCwd : cwd,
    expectedStatus,
    label: formatCommand(args),
  });
}

// ── Runtime task claim/lease lifecycle test ──
console.log('');
console.log('--- Runtime task claim/lease lifecycle ---');

// 1. Create a task
const createRes = runCmd('runtime-task.mjs', ['create', '--title', 'smoke-claim-test'], {
  expectedStatus: 0,
  label: formatRuntimeCommand(['create', '--title smoke-claim-test']),
});

let taskId = null;
try {
  const parsed = JSON.parse(createRes.stdout);
  taskId = parsed.id;
  console.log(`  → Created task: ${taskId}`);
} catch (e) {
  console.error('  ⚠ Could not parse task ID from create output, skipping lifecycle tests');
  taskId = null;
}

if (taskId) {
  // 2. Claim the task
  runCmd('runtime-task.mjs', ['claim', taskId, 'smoke-agent', '--ttl', '60'], {
    expectedStatus: 0,
    label: formatRuntimeCommand(['claim', taskId, 'smoke-agent --ttl 60']),
  });

  // 3. Heartbeat on claimed task
  runCmd('runtime-task.mjs', ['heartbeat', taskId, '120'], {
    expectedStatus: 0,
    label: formatRuntimeCommand(['heartbeat', taskId, '120']),
  });

  // 4. Renew the lease
  runCmd('runtime-task.mjs', ['renew', taskId, '300'], {
    expectedStatus: 0,
    label: formatRuntimeCommand(['renew', taskId, '300']),
  });

  // 5. List expired (should be empty - lease is fresh)
  const listExpiredRes = runCmd('runtime-task.mjs', ['list-expired'], {
    expectedStatus: 0,
    label: formatRuntimeCommand(['list-expired']),
  });
  try {
    const expired = JSON.parse(listExpiredRes.stdout);
    if (expired.length === 0) console.log('  → list-expired returned empty (expected)');
    else console.log(`  ⚠ list-expired returned ${expired.length} items (may overlap with other tasks)`);
  } catch {}

  // 6. Cancel expired (should be 0 for our fresh task)
  const cancelExpiredRes = runCmd('runtime-task.mjs', ['cancel-expired'], {
    expectedStatus: 0,
    label: formatRuntimeCommand(['cancel-expired']),
  });
  try {
    const count = JSON.parse(cancelExpiredRes.stdout);
    console.log(`  → cancel-expired released ${count} claims`);
  } catch {}

  // 7. Release the task
  runCmd('runtime-task.mjs', ['release', taskId], {
    expectedStatus: 0,
    label: formatRuntimeCommand(['release', taskId]),
  });

  // 8. Verify release: heartbeat should fail (no claim)
  runCmd('runtime-task.mjs', ['heartbeat', taskId], {
    expectedStatus: 1,
    label: formatRuntimeCommand(['heartbeat', taskId]) + ' (expect fail after release)',
  });
}

rmSync(tmpCwd, { recursive: true, force: true });

console.log('');
const passedCount = results.filter((result) => result.passed).length;
console.log(`Overall: ${passedCount}/${results.length} CLI commands passed`);

if (passedCount !== results.length) {
  process.exit(1);
}
