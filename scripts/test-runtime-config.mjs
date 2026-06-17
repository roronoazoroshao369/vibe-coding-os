#!/usr/bin/env node
// test-runtime-config.mjs — Tests for runtime/core/config.mjs

import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createStore, ensureRuntime } from '../runtime/core/fs-store.mjs';
import {
  loadConfig, getConfigValue, validateRiskLevel, isToolAllowed, getConfig, DEFAULT_CONFIG,
} from '../runtime/core/config.mjs';

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`PASS ${name}`); }
  catch (err) { failed++; console.error(`FAIL ${name}: ${err.message}`); }
}

const tmp = mkdtempSync(join(tmpdir(), 'cfg-'));
const store = createStore(tmp);
await ensureRuntime(store);

// --- loadConfig ---

test('loadConfig returns defaults when no config.json exists', () => {
  const cfg = loadConfig(store);
  assert.equal(cfg._source, 'defaults');
  assert.equal(cfg.runtime.maxRiskLevel, 'review');
  assert.equal(cfg.runtime.requireApproval, true);
  assert.equal(cfg.tools.allowed.length, 0);
  assert.equal(cfg.tools.denied.length, 0);
  assert.equal(cfg.policies.requireTrace, true);
});

test('loadConfig merges config.json with defaults', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    version: '2.0.0',
    runtime: { maxRiskLevel: 'dangerous' },
  }), 'utf8');
  const cfg = loadConfig(store);
  assert.equal(cfg._source, 'config.json');
  assert.equal(cfg.version, '2.0.0');
  assert.equal(cfg.runtime.maxRiskLevel, 'dangerous');
  // Defaults preserved
  assert.equal(cfg.runtime.requireApproval, true);
  assert.equal(cfg.policies.requireTrace, true);
});

test('loadConfig returns defaults on invalid JSON', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), 'NOT JSON!!!', 'utf8');
  const cfg = loadConfig(store);
  assert.equal(cfg._source, 'defaults (config parse error)');
  assert.ok(cfg._error);
});

test('loadConfig handles deeply nested overrides', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    policies: { maxItemsPerStore: 500 },
  }), 'utf8');
  const cfg = loadConfig(store);
  assert.equal(cfg.policies.maxItemsPerStore, 500);
  assert.equal(cfg.policies.requireTrace, true);
});

// --- getConfigValue ---

test('getConfigValue returns nested value', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    runtime: { maxRiskLevel: 'blocked' },
  }), 'utf8');
  assert.equal(getConfigValue(store, 'runtime.maxRiskLevel'), 'blocked');
});

test('getConfigValue returns fallback for missing path', () => {
  assert.equal(getConfigValue(store, 'nonexistent.path', 'default'), 'default');
});

// --- validateRiskLevel ---

test('validateRiskLevel accepts safe within review max', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    runtime: { maxRiskLevel: 'review' },
  }), 'utf8');
  const result = validateRiskLevel(store, 'safe');
  assert.equal(result.valid, true);
});

test('validateRiskLevel rejects dangerous within review max', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    runtime: { maxRiskLevel: 'review' },
  }), 'utf8');
  const result = validateRiskLevel(store, 'dangerous');
  assert.equal(result.valid, false);
  assert.ok(result.reason.includes('exceeds'));
});

test('validateRiskLevel accepts dangerous within dangerous max', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    runtime: { maxRiskLevel: 'dangerous' },
  }), 'utf8');
  const result = validateRiskLevel(store, 'dangerous');
  assert.equal(result.valid, true);
});

test('validateRiskLevel rejects unknown risk level', () => {
  const result = validateRiskLevel(store, 'banana');
  assert.equal(result.valid, false);
  assert.ok(result.reason.includes('Unknown'));
});

// --- isToolAllowed ---

test('isToolAllowed returns true when allow list is empty', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), '{}'), 'utf8';
  const result = isToolAllowed(store, 'anything');
  assert.equal(result.allowed, true);
});

test('isToolAllowed rejects denied tool', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    tools: { allowed: [], denied: ['computer_use'] },
  }), 'utf8');
  const result = isToolAllowed(store, 'computer_use');
  assert.equal(result.allowed, false);
  assert.ok(result.reason.includes('denied'));
});

test('isToolAllowed rejects tool not in allow list', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    tools: { allowed: ['terminal', 'file'], denied: [] },
  }), 'utf8');
  const result = isToolAllowed(store, 'browser');
  assert.equal(result.allowed, false);
  assert.ok(result.reason.includes('not in the allowed list'));
});

test('isToolAllowed accepts tool in allow list', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), JSON.stringify({
    tools: { allowed: ['terminal', 'file'], denied: [] },
  }), 'utf8');
  const result = isToolAllowed(store, 'terminal');
  assert.equal(result.allowed, true);
});

// --- getConfig ---

test('getConfig includes diagnostics', () => {
  writeFileSync(join(store.runtimeDir, 'config.json'), '{}'), 'utf8';
  const cfg = getConfig(store);
  assert.ok(cfg._diagnostics);
  assert.equal(cfg._diagnostics.hasConfigFile, true);
  assert.ok(Array.isArray(cfg._diagnostics.riskLevels));
});

// Cleanup
rmSync(tmp, { recursive: true, force: true });

console.log(`\nConfig tests: ${passed}/${passed + failed} passed`);
process.exit(failed > 0 ? 1 : 0);
