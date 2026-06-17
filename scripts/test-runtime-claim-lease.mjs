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
    // Claim t1 then manually backdate expiration via raw store write
    await claimTask(store, t1.id, 'agent-1', { ttl: 300 });
    await claimTask(store, t2.id, 'agent-2', { ttl: 3600 });
    const items = (await readJson(store, 'tasks.json')).items;
    const t1Data = items.find(t => t.id === t1.id);
    t1Data.claim.expiresAt = new Date(Date.now() - 10_000).toISOString(); // 10s ago
    await writeJsonAtomic(store, 'tasks.json', { schemaVersion: '2.0.0', kind: 'tasks', items }, { source: 'test-backdate' });
    const expired = await listExpiredClaims(store);
    assert.equal(expired.length, 1);
    assert.equal(expired[0].id, t1.id);
  });
});

test('cancelExpiredClaims releases only expired claims', async () => {
  await withStore(async (store) => {
    const t1 = await createTask(store, { title: 'Exp' });
    const t2 = await createTask(store, { title: 'Act' });
    await claimTask(store, t1.id, 'agent-1', { ttl: 300 });
    await claimTask(store, t2.id, 'agent-2', { ttl: 3600 });
    // Backdate t1 expiration manually
    const items = (await readJson(store, 'tasks.json')).items;
    const t1Data = items.find(t => t.id === t1.id);
    t1Data.claim.expiresAt = new Date(Date.now() - 10_000).toISOString();
    await writeJsonAtomic(store, 'tasks.json', { schemaVersion: '2.0.0', kind: 'tasks', items }, { source: 'test-backdate' });
    const count = await cancelExpiredClaims(store);
    assert.equal(count, 1);
    const updatedItems = (await readJson(store, 'tasks.json')).items;
    const active = updatedItems.find(t => t.id === t2.id);
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

test('claimTask rejects negative TTL', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Negative claim TTL' });
    await assert.rejects(
      () => claimTask(store, id, 'agent-1', { ttl: -1 }),
      /ttl must not be negative/
    );
  });
});

test('heartbeatTask rejects negative TTL', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Negative heartbeat TTL' });
    await claimTask(store, id, 'agent-1', { ttl: 300 });
    await assert.rejects(
      () => heartbeatTask(store, id, -1),
      /ttl must not be negative/
    );
  });
});

test('renewTaskLease rejects negative extraTtl', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Negative renew TTL' });
    await claimTask(store, id, 'agent-1', { ttl: 300 });
    await assert.rejects(
      () => renewTaskLease(store, id, -1),
      /extraTtl must not be negative/
    );
  });
});

test('claimTask TTL capped by config maxTaskLease', async () => {
  await withStore(async (store) => {
    const { writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    // Set a low maxTaskLease
    writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
      version: '2.0.0',
      runtime: { maxTaskLease: 30 },
    }), 'utf8');
    const { id } = await createTask(store, { title: 'Capped claim' });
    const claimed = await claimTask(store, id, 'agent-1', { ttl: 9999 });
    const expiresIn = (new Date(claimed.claim.expiresAt).getTime() - Date.now()) / 1000;
    assert.ok(expiresIn <= 35, `Expected lease <= 35s, got ${expiresIn}s`); // 30 + buffer
  });
});

test('heartbeatTask TTL capped by config maxTaskLease', async () => {
  await withStore(async (store) => {
    const { writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
      version: '2.0.0',
      runtime: { maxTaskLease: 30 },
    }), 'utf8');
    const { id } = await createTask(store, { title: 'HB capped' });
    await claimTask(store, id, 'agent-1', { ttl: 10 });
    const heartbeated = await heartbeatTask(store, id, 9999);
    const expiresIn = (new Date(heartbeated.claim.expiresAt).getTime() - Date.now()) / 1000;
    assert.ok(expiresIn <= 35, `Expected heartbeat lease <= 35s, got ${expiresIn}s`);
  });
});

test('renewTaskLease extraTtl capped by config maxTaskLease', async () => {
  await withStore(async (store) => {
    const { writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
      version: '2.0.0',
      runtime: { maxTaskLease: 30 },
    }), 'utf8');
    const { id } = await createTask(store, { title: 'Renew capped' });
    await claimTask(store, id, 'agent-1', { ttl: 10 });
    const renewed = await renewTaskLease(store, id, 9999);
    const expiresIn = (new Date(renewed.claim.expiresAt).getTime() - Date.now()) / 1000;
    assert.ok(expiresIn <= 45, `Expected renew lease <= 45s, got ${expiresIn}s`); // 10 initial + 30 max = 40 + buffer
  });
});

test('updateTaskStatus in_progress TTL capped by config maxTaskLease', async () => {
  await withStore(async (store) => {
    const { writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
      version: '2.0.0',
      runtime: { maxTaskLease: 30 },
    }), 'utf8');
    const { id } = await createTask(store, { title: 'Status TTL capped' });
    const updated = await updateTaskStatus(store, id, 'in_progress', { actor: 'dev', ttl: 9999 });
    const expiresIn = (new Date(updated.claim.expiresAt).getTime() - Date.now()) / 1000;
    assert.ok(expiresIn <= 35, `Expected status cap <= 35s, got ${expiresIn}s`);
  });
});

test('claimTask rejects terminal tasks', async () => {
  await withStore(async (store) => {
    const { id } = await createTask(store, { title: 'Terminal task' });
    await updateTaskStatus(store, id, 'in_progress', { actor: 'dev' });
    await updateTaskStatus(store, id, 'completed', { actor: 'dev' });
    await assert.rejects(
      () => claimTask(store, id, 'agent-1', { force: true }),
      /terminal state "completed"/
    );
    const stored = (await readJson(store, 'tasks.json')).items.find(t => t.id === id);
    assert.equal(stored.status, 'completed');
    assert.equal(stored.claim?.claimedBy, 'dev');
  });
});

test('renewTaskLease absolute expiration capped by config maxTaskLease', async () => {
  await withStore(async (store) => {
    const { writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
      version: '2.0.0',
      runtime: { maxTaskLease: 30 },
    }), 'utf8');
    const { id } = await createTask(store, { title: 'Absolute cap' });
    await claimTask(store, id, 'agent-1', { ttl: 30 });

    const data = await readJson(store, 'tasks.json');
    const task = data.items.find(t => t.id === id);
    task.claim.expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
    await writeJsonAtomic(store, 'tasks.json', data);

    const renewed = await renewTaskLease(store, id, 9999);
    const expiresIn = (new Date(renewed.claim.expiresAt).getTime() - Date.now()) / 1000;
    assert.ok(expiresIn <= 35, `Expected absolute renew lease <= 35s, got ${expiresIn}s`);
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
