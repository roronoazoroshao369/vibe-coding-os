#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createStore, ensureRuntime, emptyCollection, readJson, writeJsonAtomic } from '../runtime/core/fs-store.mjs';
import { Enforcement } from '../runtime/core/enforcement.mjs';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withStore(fn) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'runtime-collection-envelope-'));
  const store = createStore(dir);
  await ensureRuntime(store);
  try { return await fn(store); }
  finally { await rm(dir, { recursive: true, force: true }); }
}

test('writeJsonAtomic with extra top-level keys + enforcement throws', async () => {
  await withStore(async (store) => {
    const enforcement = new Enforcement();
    await assert.rejects(
      () => writeJsonAtomic(
        store,
        'tasks.json',
        { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'tasks', items: [], unexpected: true },
        { enforcement }
      ),
      /Strict collection: unknown fields: unexpected/
    );
  });
});

test('writeJsonAtomic with valid collection succeeds', async () => {
  await withStore(async (store) => {
    const enforcement = new Enforcement();
    const value = { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'tasks', items: [] };
    await writeJsonAtomic(store, 'tasks.json', value, { enforcement });
    assert.deepEqual(await readJson(store, 'tasks.json'), value);
  });
});

test('emptyCollection produces correct shape', () => {
  assert.deepEqual(emptyCollection('tasks'), {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    kind: 'tasks',
    items: [],
  });
});

test('applyItemDefaults populates createdBy/trace/source on items array', async () => {
  await withStore(async (store) => {
    const enforcement = new Enforcement();
    await writeJsonAtomic(
      store,
      'tasks.json',
      { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'tasks', items: [{ id: 'item_1' }] },
      { enforcement, createdBy: 'collection-test', source: 'collection-source' }
    );
    const written = await readJson(store, 'tasks.json');
    const item = written.items[0];
    assert.equal(item.createdBy, 'collection-test');
    assert.equal(item.source, 'collection-source');
    assert.match(item.trace, /^trc_[0-9a-f]{16}$/);
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
