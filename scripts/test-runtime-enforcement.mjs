#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  Enforcement,
  applyItemDefaults,
  generateTrace,
} from '../runtime/core/enforcement.mjs';
import { createItemValidator } from '../runtime/core/validation.mjs';
import { createStore, writeJsonAtomic } from '../runtime/core/fs-store.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withTempDir(fn) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'runtime-enforcement-'));
  try { return await fn(dir); }
  finally { await rm(dir, { recursive: true, force: true }); }
}

test('Enforcement.assertValidItem passes valid items', () => {
  const enforcement = new Enforcement(() => ({ valid: true, errors: [] }));
  assert.doesNotThrow(() => enforcement.assertValidItem({ id: 'ok' }, { type: 'object' }, 'thing'));
});

test('Enforcement.assertValidItem throws on invalid items', () => {
  const enforcement = new Enforcement(() => ({ valid: false, errors: ['id is required'] }));
  assert.throws(
    () => enforcement.assertValidItem({}, { type: 'object' }, 'thing'),
    /thing: id is required/
  );
});

test('Enforcement.assertStrictCollection passes with allowed keys only', () => {
  const enforcement = new Enforcement();
  assert.doesNotThrow(() => enforcement.assertStrictCollection(
    { schemaVersion: 2, kind: 'tasks', items: [] },
    ['schemaVersion', 'kind', 'items']
  ));
});

test('Enforcement.assertStrictCollection throws on unknown keys', () => {
  const enforcement = new Enforcement();
  assert.throws(
    () => enforcement.assertStrictCollection(
      { schemaVersion: 2, kind: 'tasks', items: [], extra: true },
      ['schemaVersion', 'kind', 'items']
    ),
    /Strict collection: unknown fields: extra/
  );
});

test('Enforcement.assertKnownFields passes with known fields', () => {
  const enforcement = new Enforcement();
  assert.doesNotThrow(() => enforcement.assertKnownFields({ title: 'T', phase: 'test' }, ['title', 'phase'], 'task input'));
});

test('Enforcement.assertKnownFields throws on unknown fields', () => {
  const enforcement = new Enforcement();
  assert.throws(
    () => enforcement.assertKnownFields({ title: 'T', surprise: true }, ['title'], 'task input'),
    /task input: unknown fields: surprise/
  );
});

test('Enforcement.assertRiskWithin passes when risk level within limit', () => {
  const enforcement = new Enforcement();
  assert.doesNotThrow(() => enforcement.assertRiskWithin({ level: 'review' }, 'dangerous'));
});

test('Enforcement.assertRiskWithin throws when risk level exceeds limit', () => {
  const enforcement = new Enforcement();
  assert.throws(
    () => enforcement.assertRiskWithin({ level: 'blocked' }, 'dangerous'),
    /Risk level "blocked" exceeds max allowed "dangerous"/
  );
});

test('Enforcement.assertAction passes with allowed action', () => {
  const enforcement = new Enforcement();
  assert.doesNotThrow(() => enforcement.assertAction('read', ['read', 'write']));
});

test('Enforcement.assertAction throws with disallowed action', () => {
  const enforcement = new Enforcement();
  assert.throws(
    () => enforcement.assertAction('delete', ['read', 'write']),
    /Action "delete" not in allowed list/
  );
});

test('generateTrace returns trc_ prefix with 16 hex chars', () => {
  assert.match(generateTrace(), /^trc_[0-9a-f]{16}$/);
});

test('applyItemDefaults adds createdBy from env, trace, source when not set', async () => {
  await withTempDir(async () => {
    const item = { id: 'item_1' };
    applyItemDefaults(item, { createdBy: 'env-agent', source: 'unit-test' });
    assert.equal(item.createdBy, 'env-agent');
    assert.equal(item.source, 'unit-test');
    assert.match(item.trace, /^trc_[0-9a-f]{16}$/);
  });
});

test('applyItemDefaults does not overwrite existing values', () => {
  const item = { createdBy: 'existing', trace: 'trc_existing', source: 'existing-source' };
  applyItemDefaults(item, { createdBy: 'new', source: 'new-source' });
  assert.deepEqual(item, { createdBy: 'existing', trace: 'trc_existing', source: 'existing-source' });
});

test('applyItemDefaults skips non-objects and arrays', () => {
  const arr = [];
  assert.equal(applyItemDefaults(null), null);
  assert.equal(applyItemDefaults('x'), 'x');
  assert.equal(applyItemDefaults(arr), arr);
  assert.deepEqual(arr, []);
});

test('createItemValidator returns a working validator for runtime-task.schema.json', () => {
  const validate = createItemValidator('runtime-task.schema.json');
  const result = validate({ id: 'task_1', title: 'Test', status: 'pending', schemaVersion: 2 });
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('createItemValidator rejects items missing required fields', () => {
  const validate = createItemValidator('runtime-task.schema.json');
  const result = validate({ id: 'task_1' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('title')));
});

test('createItemValidator rejects items with wrong type', () => {
  const validate = createItemValidator('runtime-task.schema.json');
  const result = validate({ id: 123, title: 'Test', status: 'pending', schemaVersion: 2 });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('string')));
});

test('createItemValidator rejects unknown fields when additionalProperties: false', () => {
  const validate = createItemValidator('runtime-task.schema.json');
  const result = validate({ id: 'task_1', title: 'T', status: 'pending', surprise: true });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('unexpected fields')));
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
