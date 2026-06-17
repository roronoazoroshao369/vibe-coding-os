#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createStore } from '../runtime/core/fs-store.mjs';
import { listEvents } from '../runtime/core/events.mjs';
import {
  requiresApproval,
  createApproval,
  approveAction,
  denyAction,
  withApprovalGate,
} from '../runtime/core/approval-gate.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withTempStore(fn) {
  const root = await mkdtemp(path.join(tmpdir(), 'runtime-approval-gate-'));
  try {
    return await fn(createStore(root), root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function readApprovals(store) {
  const text = await readFile(path.join(store.runtimeDir, 'approvals.json'), 'utf8');
  return JSON.parse(text).items;
}

test('requiresApproval returns true for dangerous actions', async () => {
  assert.equal(requiresApproval('file.write'), true);
  assert.equal(requiresApproval('safe.action', { level: 'dangerous' }), true);
});

test('requiresApproval returns false for safe actions', async () => {
  assert.equal(requiresApproval('task.list', { level: 'safe' }), false);
  assert.equal(requiresApproval('unknown'), false);
});

test('requiresApproval with custom rules', async () => {
  assert.equal(requiresApproval('custom.safe', { level: 'safe', approvalRequired: true }), true);
});

test('createApproval creates pending record in approvals.json', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command', { actor: 'test' });
  const items = await readApprovals(store);
  assert.equal(items.length, 1);
  assert.equal(items[0].id, approval.id);
  assert.equal(items[0].approval.status, 'required');
}));

test('approveAction changes status from pending → approved', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command');
  const updated = await approveAction(store, approval.id, 'alice');
  assert.equal(updated.approval.status, 'approved');
}));

test('approveAction records approver and timestamp', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command');
  const updated = await approveAction(store, approval.id, 'alice');
  assert.equal(updated.approval.approvedBy, 'alice');
  assert.match(updated.approval.approvedAt, /^\d{4}-\d{2}-\d{2}T/);
}));

test('denyAction changes status from pending → denied', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command');
  const updated = await denyAction(store, approval.id, 'too risky', 'bob');
  assert.equal(updated.approval.status, 'denied');
}));

test('denyAction records denier and reason', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command');
  const updated = await denyAction(store, approval.id, 'too risky', 'bob');
  assert.equal(updated.approval.approvedBy, 'bob');
  assert.equal(updated.approval.reason, 'too risky');
}));

test('approveAction throws on non-existent approval', async () => withTempStore(async (store) => {
  await assert.rejects(() => approveAction(store, 'apr_missing', 'alice'), /approval not found/);
}));

test('denyAction throws on non-existent approval', async () => withTempStore(async (store) => {
  await assert.rejects(() => denyAction(store, 'apr_missing', 'no', 'bob'), /approval not found/);
}));

test('withApprovalGate blocks dangerous action without approval', async () => withTempStore(async (store) => {
  const handler = async () => 'executed';
  const gated = withApprovalGate(handler, store, 'shell.command');
  await assert.rejects(() => gated({ actor: 'test', risk: { level: 'dangerous' } }), /requires approval/);
  const items = await readApprovals(store);
  assert.equal(items.length, 1);
  assert.equal(items[0].approval.status, 'required');
}));

test('withApprovalGate passes after approval created and approved', async () => withTempStore(async (store) => {
  let calls = 0;
  const gated = withApprovalGate(async () => { calls += 1; return 'executed'; }, store, 'shell.command');
  await assert.rejects(() => gated({ actor: 'test', risk: { level: 'dangerous' } }), /requires approval/);
  const [approval] = await readApprovals(store);
  await approveAction(store, approval.id, 'alice');
  assert.equal(await gated({ actor: 'test', risk: { level: 'dangerous' } }), 'executed');
  assert.equal(calls, 1);
}));

test('createApproval generates audit event in events.jsonl', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command');
  const events = await listEvents(store);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'approval.created');
  assert.equal(events[0].payload.approvalId, approval.id);
}));

test('approveAction generates audit event', async () => withTempStore(async (store) => {
  const approval = await createApproval(store, 'shell.command');
  await approveAction(store, approval.id, 'alice');
  const events = await listEvents(store);
  assert.equal(events.at(-1).type, 'approval.approved');
  assert.equal(events.at(-1).payload.approvalId, approval.id);
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
