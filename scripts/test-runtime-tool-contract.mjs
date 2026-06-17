#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  getAllowedTools,
  assertToolAllowed,
  defaultContracts,
} from '../runtime/core/tool-contract.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test('getAllowedTools returns correct tool list for known adapter', () => {
  const mcp = getAllowedTools('mcp');
  assert.deepEqual(mcp, ['task.list', 'task.next', 'task.update', 'memory.search', 'memory.ingest', 'checkpoint.create']);

  const hermes = getAllowedTools('hermes');
  assert.deepEqual(hermes, mcp);

  const ai = getAllowedTools('ai-assistant');
  assert.deepEqual(ai, mcp);

  const native = getAllowedTools('native');
  assert.deepEqual(native, []);

  const tmux = getAllowedTools('tmux');
  assert.deepEqual(tmux, []);

  const daemon = getAllowedTools('daemon');
  assert.deepEqual(daemon, []);
});

test('getAllowedTools returns empty for unknown adapter (fail-closed)', () => {
  const unknown = getAllowedTools('unknown-adapter');
  assert.deepEqual(unknown, []);
});

test('assertToolAllowed passes with allowed tool', () => {
  assertToolAllowed('task.list', 'mcp');
  assertToolAllowed('memory.search', 'hermes');
  assertToolAllowed('checkpoint.create', 'ai-assistant');
});

test('assertToolAllowed throws with disallowed tool', () => {
  assert.throws(() => assertToolAllowed('file.write', 'mcp'), /not allowed/);
  assert.throws(() => assertToolAllowed('shell.command', 'hermes'), /not allowed/);
  assert.throws(() => assertToolAllowed('task.list', 'native'), /not allowed/);
});

test('assertToolAllowed throws for unknown adapter', () => {
  assert.throws(() => assertToolAllowed('task.list', 'nonexistent'), /not allowed/);
});

test('defaultContracts contains expected adapters', () => {
  assert.ok('native' in defaultContracts);
  assert.ok('mcp' in defaultContracts);
  assert.ok('tmux' in defaultContracts);
  assert.ok('daemon' in defaultContracts);
  assert.ok('hermes' in defaultContracts);
  assert.ok('ai-assistant' in defaultContracts);
  assert.equal(Object.keys(defaultContracts).length, 6);
});

test('assertToolAllowed with custom contracts overrides defaults', () => {
  const custom = { 'my-adapter': ['custom.tool', 'another.tool'] };
  assertToolAllowed('custom.tool', 'my-adapter', custom);
  assertToolAllowed('another.tool', 'my-adapter', custom);
  assert.throws(() => assertToolAllowed('task.list', 'my-adapter', custom), /not allowed/);
  assert.throws(() => assertToolAllowed('custom.tool', 'unknown', custom), /not allowed/);
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (err) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(err?.stack || err);
  }
}
process.exit(failures === 0 ? 0 : 1);
