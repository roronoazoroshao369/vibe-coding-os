#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'runtime-audit.mjs');

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withRuntime(fn) {
  const root = await mkdtemp(path.join(tmpdir(), 'runtime-audit-'));
  try {
    await mkdir(path.join(root, '.omc', 'runtime'), { recursive: true });
    return await fn(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function audit(root, ...args) {
  return spawnSync('node', [script, '--root', root, ...args], { encoding: 'utf8' });
}

test('Runtime audit returns correct summary with empty state', async () => withRuntime(async (root) => {
  const result = audit(root);
  assert.equal(result.status, 0, `exit ${result.status}: ${result.stderr}`);
  assert.match(result.stdout, /Tasks/);
  assert.match(result.stdout, /Approvals/);
  assert.match(result.stdout, /No active dangerous tasks/);
  assert.match(result.stdout, /No denied approvals/);
}));

test('Runtime audit --json returns valid JSON', async () => withRuntime(async (root) => {
  const result = audit(root, '--json');
  assert.equal(result.status, 0, `exit ${result.status}: ${result.stderr}`);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.summary.tasks.total, 0);
  assert.equal(parsed.summary.approvals.total, 0);
  assert.equal(parsed.summary.actions.total, 0);
  assert.equal(parsed.summary.events.total, 0);
  assert.ok(parsed.timestamp);
}));

test('Runtime audit counts tasks correctly', async () => withRuntime(async (root) => {
  const runtimeDir = path.join(root, '.omc', 'runtime');
  await writeFile(path.join(runtimeDir, 'tasks.json'), JSON.stringify({
    schemaVersion: 2,
    kind: 'tasks',
    items: [
      { id: 't1', title: 'completed task', status: 'completed' },
      { id: 't2', title: 'active task', status: 'active' },
      { id: 't3', title: 'dangerous task', status: 'active', risk: { level: 'dangerous' } },
      { id: 't4', title: 'blocked task', status: 'blocked' },
    ],
  }, null, 2) + '\n');

  const result = audit(root, '--json');
  assert.equal(result.status, 0, `exit ${result.status} (--json always exits 0): ${result.stderr}`);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.summary.tasks.total, 4);
  assert.equal(parsed.summary.tasks.statusCounts.completed, 1);
  assert.equal(parsed.summary.tasks.statusCounts.active, 2);
  assert.equal(parsed.summary.tasks.statusCounts.blocked, 1);
  assert.equal(parsed.dangerous.taskCount, 1);
  assert.equal(parsed.dangerous.activeCount, 1);
}));

test('Runtime audit counts approvals correctly', async () => withRuntime(async (root) => {
  const runtimeDir = path.join(root, '.omc', 'runtime');
  await writeFile(path.join(runtimeDir, 'approvals.json'), JSON.stringify({
    schemaVersion: 2,
    kind: 'approvals',
    items: [
      { id: 'a1', approval: { status: 'approved' }, metadata: { action: 'file.write' } },
      { id: 'a2', approval: { status: 'denied' }, metadata: { action: 'shell.cmd' } },
      { id: 'a3', approval: { status: 'required' }, metadata: { action: 'mcp.call' } },
    ],
  }, null, 2) + '\n');

  const result = audit(root, '--json');
  assert.equal(result.status, 0, `exit ${result.status}: ${result.stderr}`);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.summary.approvals.total, 3);
  assert.equal(parsed.summary.approvals.statusCounts.approved, 1);
  assert.equal(parsed.summary.approvals.statusCounts.denied, 1);
  assert.equal(parsed.summary.approvals.statusCounts.required, 1);
  assert.equal(parsed.denials.approvalCount, 1);
  assert.equal(parsed.denials.deniedApprovals.length, 1);
  assert.equal(parsed.pendingApprovals.length, 1);
}));

let failures = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (err) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(err?.stack || err);
  }
}
process.exit(failures === 0 ? 0 : 1);
