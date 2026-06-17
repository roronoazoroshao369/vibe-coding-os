#!/usr/bin/env node
// test-event-store-v2.mjs — Tests for Event Store v2

import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createStore, ensureRuntime } from '../runtime/core/fs-store.mjs';
import {
  appendEventV2, listEventsV2, getEvent, getCorrelationChain,
  getCausalChain, eventStream, getEventMetadata,
} from '../runtime/core/event-store.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withStore(fn) {
  const root = await mkdtemp(path.join(tmpdir(), 'event-v2-'));
  const store = createStore(root);
  await ensureRuntime(store);
  try { return await fn(store); }
  finally { await rm(root, { recursive: true, force: true }); }
}

test('appendEventV2 assigns monotonic sequence numbers', async () => withStore(async (store) => {
  const e1 = await appendEventV2(store, 'task.created', { id: 't1' });
  const e2 = await appendEventV2(store, 'task.status', { id: 't1', status: 'in_progress' });
  assert.equal(e1.seq, 1);
  assert.equal(e2.seq, 2);
  assert.ok(e1.id.startsWith('evt_'));
}));

test('appendEventV2 stores correlation and causation ids', async () => withStore(async (store) => {
  const e1 = await appendEventV2(store, 'task.created', { id: 't1' }, { correlationId: 'corr-1' });
  const e2 = await appendEventV2(store, 'task.status', { id: 't1' }, { correlationId: 'corr-1', causationId: e1.id });
  assert.equal(e2.correlationId, 'corr-1');
  assert.equal(e2.causationId, e1.id);
}));

test('listEventsV2 filters by type', async () => withStore(async (store) => {
  await appendEventV2(store, 'task.created', {});
  await appendEventV2(store, 'task.status', {});
  await appendEventV2(store, 'task.status', {});
  const events = await listEventsV2(store, { type: 'task.status' });
  assert.equal(events.length, 2);
  assert.ok(events.every(e => e.type === 'task.status'));
}));

test('listEventsV2 filters by correlationId', async () => withStore(async (store) => {
  await appendEventV2(store, 'task.created', {}, { correlationId: 'a' });
  await appendEventV2(store, 'task.created', {}, { correlationId: 'b' });
  await appendEventV2(store, 'task.status', {}, { correlationId: 'a' });
  const events = await listEventsV2(store, { correlationId: 'a' });
  assert.equal(events.length, 2);
  assert.ok(events.every(e => e.correlationId === 'a'));
}));

test('listEventsV2 supports afterSeq and limit', async () => withStore(async (store) => {
  await appendEventV2(store, 'a', {});
  await appendEventV2(store, 'b', {});
  await appendEventV2(store, 'c', {});
  const events = await listEventsV2(store, { afterSeq: 1, limit: 1 });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'b');
}));

test('getEvent retrieves event by id', async () => withStore(async (store) => {
  const e = await appendEventV2(store, 'task.created', { id: 't1' });
  const found = await getEvent(store, e.id);
  assert.equal(found.id, e.id);
  assert.equal(found.type, 'task.created');
}));

test('getCorrelationChain returns matching events', async () => withStore(async (store) => {
  await appendEventV2(store, 'a', {}, { correlationId: 'chain' });
  await appendEventV2(store, 'b', {}, { correlationId: 'other' });
  await appendEventV2(store, 'c', {}, { correlationId: 'chain' });
  const chain = await getCorrelationChain(store, 'chain');
  assert.equal(chain.length, 2);
  assert.deepEqual(chain.map(e => e.type), ['a', 'c']);
}));

test('getCausalChain follows causation links backward', async () => withStore(async (store) => {
  const e1 = await appendEventV2(store, 'root', {});
  const e2 = await appendEventV2(store, 'child', {}, { causationId: e1.id });
  const e3 = await appendEventV2(store, 'grandchild', {}, { causationId: e2.id });
  const chain = await getCausalChain(store, e3.id);
  assert.deepEqual(chain.map(e => e.type), ['root', 'child', 'grandchild']);
}));

test('eventStream yields filtered events', async () => withStore(async (store) => {
  await appendEventV2(store, 'a', {});
  await appendEventV2(store, 'b', {});
  await appendEventV2(store, 'b', {});
  const seen = [];
  for await (const e of eventStream(store, { type: 'b' })) seen.push(e);
  assert.equal(seen.length, 2);
}));

test('getEventMetadata reports counts and file size', async () => withStore(async (store) => {
  await appendEventV2(store, 'task.created', {});
  await appendEventV2(store, 'task.status', {});
  const meta = await getEventMetadata(store);
  assert.equal(meta.totalEvents, 2);
  assert.equal(meta.nextSeq, 3);
  assert.ok(meta.fileSize > 0);
  assert.equal(meta.typeCounts['task.created'], 1);
}));

test('appendEventV2 deduplicates by idempotencyKey', async () => withStore(async (store) => {
  const e1 = await appendEventV2(store, 'task.created', { attempt: 1 }, { idempotencyKey: 'idem-1' });
  const e2 = await appendEventV2(store, 'task.created', { attempt: 2 }, { idempotencyKey: 'idem-1' });
  const events = await listEventsV2(store);
  assert.equal(e2.id, e1.id);
  assert.equal(events.length, 1);
  assert.equal(events[0].seq, 1);
}));

test('appendEventV2 concurrent appends have unique seq values', async () => withStore(async (store) => {
  const events = await Promise.all(Array.from({ length: 8 }, (_, i) => appendEventV2(store, 'concurrent', { i })));
  const seqs = events.map(e => e.seq).sort((a, b) => a - b);
  assert.deepEqual(seqs, [1, 2, 3, 4, 5, 6, 7, 8]);
  const meta = await getEventMetadata(store);
  assert.equal(meta.nextSeq, 9);
  assert.equal(meta.metadataConsistent, true);
}));

test('listEventsV2 tail returns newest events', async () => withStore(async (store) => {
  for (let i = 1; i <= 5; i++) await appendEventV2(store, `e${i}`, {});
  const events = await listEventsV2(store, { tail: true, limit: 2 });
  assert.deepEqual(events.map(e => e.type), ['e4', 'e5']);
}));

let failures = 0;
for (const { name, fn } of tests) {
  try { await fn(); console.log(`PASS ${name}`); }
  catch (err) { failures++; console.error(`FAIL ${name}`); console.error(err?.stack || err); }
}
console.log(`\nEvent Store v2 tests: ${tests.length - failures}/${tests.length} passed`);
process.exit(failures === 0 ? 0 : 1);
