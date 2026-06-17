#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createStore } from '../runtime/core/fs-store.mjs';
import { appendEvent, listEvents, clearEvents, createSnapshot } from '../runtime/core/events.mjs';
import { fullReplay } from './runtime-replay.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withTempRuntime(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'runtime-replay-test-'));
  try {
    const store = createStore(root);
    return await fn({ root, store });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function stores(root) {
  const store = createStore(root);
  return { eventStore: store, taskStore: store, sessionStore: store, teamStore: store };
}

test('appendEvent creates .omc/runtime/events.jsonl file', async () => {
  await withTempRuntime(async ({ root, store }) => {
    await appendEvent(store, 'task.created', { id: 'task-1', title: 'First task' });
    assert.equal(existsSync(path.join(root, '.omc', 'runtime', 'events.jsonl')), true);
  });
});

test('listEvents returns all events in order', async () => {
  await withTempRuntime(async ({ store }) => {
    const first = await appendEvent(store, 'task.created', { id: 'task-1' });
    const second = await appendEvent(store, 'session.created', { id: 'session-1' });
    const events = await listEvents(store);
    assert.deepEqual(events.map((event) => event.id), [first.id, second.id]);
  });
});

test('listEvents with afterId cursor returns only later events', async () => {
  await withTempRuntime(async ({ store }) => {
    const first = await appendEvent(store, 'task.created', { id: 'task-1' });
    const second = await appendEvent(store, 'task.created', { id: 'task-2' });
    const third = await appendEvent(store, 'task.created', { id: 'task-3' });
    const events = await listEvents(store, { afterId: first.id });
    assert.deepEqual(events.map((event) => event.id), [second.id, third.id]);
  });
});

test('clearEvents empties the log', async () => {
  await withTempRuntime(async ({ store }) => {
    await appendEvent(store, 'task.created', { id: 'task-1' });
    await clearEvents(store);
    assert.deepEqual(await listEvents(store), []);
  });
});

test('fullReplay returns empty stores from empty event log', async () => {
  await withTempRuntime(async ({ root }) => {
    assert.deepEqual(await fullReplay(stores(root)), { tasks: [], sessions: [], teams: [] });
  });
});

test('fullReplay rebuilds tasks from task.created/task.status events', async () => {
  await withTempRuntime(async ({ root, store }) => {
    await appendEvent(store, 'task.created', { id: 'task-1', title: 'Replay me' });
    await appendEvent(store, 'task.status', { id: 'task-1', status: 'done' });
    const replayed = await fullReplay(stores(root));
    assert.equal(replayed.tasks.length, 1);
    assert.equal(replayed.tasks[0].id, 'task-1');
    assert.equal(replayed.tasks[0].title, 'Replay me');
    assert.equal(replayed.tasks[0].status, 'done');
  });
});

test('fullReplay rebuilds sessions from session.created events', async () => {
  await withTempRuntime(async ({ root, store }) => {
    await appendEvent(store, 'session.created', { id: 'session-1', goal: 'Coordinate' });
    const replayed = await fullReplay(stores(root));
    assert.equal(replayed.sessions.length, 1);
    assert.equal(replayed.sessions[0].id, 'session-1');
    assert.equal(replayed.sessions[0].goal, 'Coordinate');
  });
});

test('fullReplay rebuilds teams from team.imported events', async () => {
  await withTempRuntime(async ({ root, store }) => {
    await appendEvent(store, 'team.imported', { id: 'team-1', name: 'Runtime Team' });
    const replayed = await fullReplay(stores(root));
    assert.equal(replayed.teams.length, 1);
    assert.equal(replayed.teams[0].id, 'team-1');
    assert.equal(replayed.teams[0].name, 'Runtime Team');
  });
});

test('replay from snapshot recovers correct state', async () => {
  await withTempRuntime(async ({ root, store }) => {
    const first = await appendEvent(store, 'task.created', { id: 'task-1', title: 'Snapshot task' });
    const snapshotTask = { id: 'task-1', title: 'Snapshot task', status: 'pending', createdAt: first.createdAt, updatedAt: first.createdAt };
    await createSnapshot(store, { tasks: { 'task-1': snapshotTask }, sessions: {}, teams: {} });
    await appendEvent(store, 'task.status', { id: 'task-1', status: 'done' });
    const replayed = await fullReplay(stores(root));
    assert.equal(replayed.tasks.length, 1);
    assert.equal(replayed.tasks[0].id, 'task-1');
    assert.equal(replayed.tasks[0].status, 'done');
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
