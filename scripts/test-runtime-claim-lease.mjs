#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createStore, ensureRuntime, readJson, writeJsonAtomic } from '../runtime/core/fs-store.mjs';
import {
  createTask,
  claimTask,
  releaseTask,
  heartbeatTask,
  renewTaskLease,
  listExpiredClaims,
  cancelExpiredClaims,
  updateTaskStatus,
} from '../runtime/tasks/task-store.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withStore(fn) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'runtime-claim-lease-'));
  const store = createStore(dir);
  await ensureRuntime(store);
  try { return await fn(store); }
  finally { await rm(dir, { recursive: true, force: true }); }
}

test('createTask produces valid task with expected fields', async () => {
  await withStore(async (store) => {
    const task = await createTask(store, { title: 'Implement feature' });
    assert.ok(task.id.startsWith('task_'));
    assert.equal(task.title, 'Implement feature');
    assert.equal(task.status, 'pending');
    assert.equal(task.claim, undefined);
    assert.ok(Array.isArray(task.history));
  });
});

test('createTask with unknown fields throws', async () => {
  await withStore(async (store) => {
    await assert.rejects(
      () => createTask(store, { title: 'T', unknownField: 'x' }),
      /unknown fields: unknownField/
    );
  });
});

test('claimTask succeeds on unclaimed task', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Claim me' });
    const claimed = await claimTask(store, id, 'agent-1', { ttl: 300 });
    assert.equal(claimed.claim.claimedBy, 'agent-1');
    assert.equal(claimed.status, 'in_progress');
    assert.ok(claimed.owner);
  });
});

test('claimTask throws TASK_ALREADY_CLAIMED when another agent holds claim', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Contested' });
    await claimTask(store, id, 'agent-1', { ttl: 3600 });
    await assert.rejects(
      () => claimTask(store, id, 'agent-2'),
      (err) => {
        assert.equal(err.code, 'TASK_ALREADY_CLAIMED');
        return true;
      }
    );
  });
});

test('claimTask with force=true overrides existing claim', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Override' });
    await claimTask(store, id, 'agent-1');
    const forced = await claimTask(store, id, 'agent-2', { force: true });
    assert.equal(forced.claim.claimedBy, 'agent-2');
  });
});

test('releaseTask clears claim fields', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Release' });
    await claimTask(store, id, 'agent-1');
    const released = await releaseTask(store, id);
    assert.equal(released.claim, null);
  });
});

test('heartbeatTask updates expiresAt', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'HB' });
    await claimTask(store, id, 'agent-1', { ttl: 1 });
    const before = (await readJson(store, 'tasks.json')).items.find(t => t.id === id).claim.expiresAt;
    const heartbeated = await heartbeatTask(store, id, 300);
    assert.ok(new Date(heartbeated.claim.expiresAt) > new Date(before));
  });
});

test('heartbeatTask throws if no claim exists', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'No claim' });
    await assert.rejects(() => heartbeatTask(store, id), /not claimed/);
  });
});

test('renewTaskLease extends expiration', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Renew' });
    await claimTask(store, id, 'agent-1', { ttl: 10 });
    const before = (await readJson(store, 'tasks.json')).items.find(t => t.id === id).claim.expiresAt;
    const renewed = await renewTaskLease(store, id, 600);
    assert.ok(new Date(renewed.claim.expiresAt) > new Date(before));
  });
});

test('listExpiredClaims returns only expired claims', async () => {
  await withStore(async (store) => {
    const t1 = await createTask(store, { title: 'Expired' });
    const t2 = await createTask(store, { title: 'Active' });
    await claimTask(store, t1.id, 'agent-1', { ttl: -1 });
    await claimTask(store, t2.id, 'agent-2', { ttl: 3600 });
    const expired = await listExpiredClaims(store);
    assert.equal(expired.length, 1);
    assert.equal(expired[0].id, t1.id);
  });
});

test('cancelExpiredClaims releases only expired claims', async () => {
  await withStore(async (store) => {
    const t1 = await createTask(store, { title: 'Exp' });
    const t2 = await createTask(store, { title: 'Act' });
    await claimTask(store, t1.id, 'agent-1', { ttl: -1 });
    await claimTask(store, t2.id, 'agent-2', { ttl: 3600 });
    const count = await cancelExpiredClaims(store);
    assert.equal(count, 1);
    const items = (await readJson(store, 'tasks.json')).items;
    const active = items.find(t => t.id === t2.id);
    assert.ok(active.claim, 'Active claim should remain');
  });
});

test('updateTaskStatus from pending to in_progress auto-claims', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Auto claim' });
    const updated = await updateTaskStatus(store, id, 'in_progress', { actor: 'dev', ttl: 120 });
    assert.equal(updated.status, 'in_progress');
    assert.equal(updated.claim.claimedBy, 'dev');
  });
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (err) {
    failures++;
    console.error(`FAIL ${name}`);
    console.error(err?.stack || err);
  }
}

process.exitCode = failures === 0 ? 0 : 1;
