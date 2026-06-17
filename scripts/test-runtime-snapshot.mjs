#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createStore } from '../runtime/core/fs-store.mjs';
import { appendEvent, listEvents, createSnapshot, listSnapshots, latestSnapshot, recoverFromSnapshot, cleanupEvents, removeSnapshots } from '../runtime/core/events.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withTempRuntime(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'runtime-snapshot-test-'));
  try {
    const store = createStore(root);
    return await fn({ root, store });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('createSnapshot creates .omc/runtime/events/snapshots/ directory', async () => {
  await withTempRuntime(async ({ root, store }) => {
    await createSnapshot(store, { tasks: {}, sessions: {}, teams: {} });
    assert.equal(existsSync(path.join(root, '.omc', 'runtime', 'snapshots')), true);
  });
});

test('createSnapshot stores state and cursor', async () => {
  await withTempRuntime(async ({ store }) => {
    const first = await appendEvent(store, 'task.created', { id: 'task-1' });
    const snapshot = await createSnapshot(store, { tasks: { 'task-1': { title: 'Snap' } } });
    assert.equal(snapshot.eventCount, 1);
    assert.equal(snapshot.lastEventId, first.id);
    assert.deepEqual(snapshot.state.tasks['task-1'], { title: 'Snap' });
  });
});

test('listSnapshots returns all snapshots', async () => {
  await withTempRuntime(async ({ store }) => {
    await createSnapshot(store, { tasks: {}, sessions: {}, teams: {} });
    await appendEvent(store, 'task.created', { id: 'task-2' });
    await createSnapshot(store, { tasks: { 'task-2': {} }, sessions: {}, teams: {} });
    const snapshots = await listSnapshots(store);
    assert.equal(snapshots.length, 2);
    assert.ok(snapshots[0].createdAt <= snapshots[1].createdAt);
  });
});

test('latestSnapshot returns most recent snapshot', async () => {
  await withTempRuntime(async ({ store }) => {
    const first = await appendEvent(store, 'task.created', { id: 'task-1' });
    await createSnapshot(store, { tasks: {}, sessions: {}, teams: {} });
    await appendEvent(store, 'task.created', { id: 'task-2' });
    const second = await appendEvent(store, 'task.created', { id: 'task-3' });
    await createSnapshot(store, { tasks: {}, sessions: {}, teams: {} });
    const latest = await latestSnapshot(store);
    assert.equal(latest.lastEventId, second.id);
    assert.equal(latest.eventCount, 3);
  });
});

test('recoverFromSnapshot restores state from snapshot', async () => {
  await withTempRuntime(async ({ store }) => {
    const first = await appendEvent(store, 'task.created', { id: 'task-1' });
    const firstState = { tasks: { 'task-1': { title: 'Before snapshot' } }, sessions: {}, teams: {} };
    const snapshot = await createSnapshot(store, firstState);
    await appendEvent(store, 'task.status', { id: 'task-1', status: 'done' });
    const recovered = await recoverFromSnapshot(store, (initialState, events, snap) => {
      return { initialState, events, snap };
    });
    assert.deepEqual(recovered.initialState, firstState);
    assert.equal(recovered.events.length, 1);
    assert.equal(recovered.events[0].type, 'task.status');
    assert.equal(recovered.snap.id, snapshot.id);
  });
});

test('cleanupEvents removes old events beyond keepLast threshold', async () => {
  await withTempRuntime(async ({ store }) => {
    // Create events then a snapshot so cleanup knows safe cutoff point
    await appendEvent(store, 'task.created', { id: 'task-1' });
    await appendEvent(store, 'task.created', { id: 'task-2' });
    await appendEvent(store, 'task.created', { id: 'task-3' });
    await appendEvent(store, 'task.created', { id: 'task-4' });
    const allEvents = await listEvents(store);
    assert.equal(allEvents.length, 4);
    // Snapshot after all events — gives cleanup a safe cutoff reference
    await createSnapshot(store, { tasks: {}, sessions: {}, teams: {} });
    const result = await cleanupEvents(store, { keepLast: 2 });
    assert.equal(result.removed, 2);
    assert.equal(result.kept, 2);
    const remaining = await listEvents(store);
    assert.equal(remaining.length, 2);
    assert.deepEqual(remaining.map(e => e.id), [allEvents[2].id, allEvents[3].id]);
  });
});

test('removeSnapshots removes old snapshots beyond keepLast', async () => {
  await withTempRuntime(async ({ store }) => {
    for (let i = 0; i < 4; i++) await createSnapshot(store, { tasks: {}, sessions: {}, teams: {} });
    const before = await listSnapshots(store);
    assert.equal(before.length, 4);
    const result = await removeSnapshots(store, { keepLast: 1 });
    assert.equal(result.removed, 3);
    assert.equal(result.kept, 1);
    const after = await listSnapshots(store);
    assert.equal(after.length, 1);
    assert.equal(after[0].id, before[3].id);
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
process.exit(failures === 0 ? 0 : 1);
