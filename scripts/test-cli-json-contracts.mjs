#!/usr/bin/env node
// test-cli-json-contracts.mjs — Tests that CLI --json flags emit valid JSON

import { strict as assert } from 'node:assert';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const CLI = new URL('../scripts/vibe-cli.mjs', import.meta.url).pathname;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; process.stdout.write(`  ${name} ✓\n`); }
  catch (err) { failed++; process.stdout.write(`  ${name} ✗ ${err.message}\n`); }
}

async function runCli(args, opts = {}) {
  const { stdout, stderr } = await exec(process.execPath, [CLI, ...args], {
    cwd: opts.cwd || process.cwd(),
    env: { ...process.env, FORCE_COLOR: '0' },
    timeout: 15000,
  });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

// ── events --json ──
console.log('\n--- CLI JSON contract tests ---');
console.log('Events JSON:');
const { stdout: eventsOut } = await runCli(['events', '--json']);
test('events --json exits 0', () => true);
test('events --json stdout is valid JSON', () => {
  const parsed = JSON.parse(eventsOut);
  assert.ok(parsed.meta, 'has meta');
  assert.ok(Array.isArray(parsed.events), 'has events array');
});

// ── events --limit=N --json ──
const { stdout: limitOut } = await runCli(['events', '--json', '--limit=2']);
test('events --limit=2 --json is valid JSON', () => {
  const parsed = JSON.parse(limitOut);
  assert.ok(parsed.events.length <= 2, 'events capped to limit');
});

// ── events --limit=invalid ──
const { stdout: invOut } = await runCli(['events', '--json', '--limit=abc']);
test('events --limit=abc falls back to default', () => {
  const parsed = JSON.parse(invOut);
  assert.ok(parsed.meta, 'still returns valid structure');
});

// ── doctor --json ──
console.log('Doctor JSON:');
const { stdout: docOut } = await runCli(['doctor', '--json']);
test('doctor --json exits 0', () => true);
test('doctor --json stdout is valid JSON', () => {
  const parsed = JSON.parse(docOut);
  assert.ok(parsed.checks, 'has checks array');
  assert.ok(typeof parsed.healthy === 'boolean', 'has healthy boolean');
});

// ── doctor --json does NOT contain human text ──
test('doctor --json stdout has no ANSI or banner text', () => {
  assert.ok(!docOut.includes('Vibe Coding OS'), 'no banner');
  assert.ok(!docOut.includes('✓'), 'no check marks');
  assert.ok(!docOut.includes('✗'), 'no cross marks');
});

// ── doctor --project <tmp> --json ──
console.log('Doctor project JSON:');
const tmpDir = await mkdtemp(join(tmpdir(), 'vibe-test-'));
try {
  const { stdout: projOut } = await runCli(['doctor', '--json', '--project', tmpDir]);
  test('doctor --project --json is valid JSON', () => {
    const parsed = JSON.parse(projOut);
    assert.ok(parsed.checks, 'has checks');
  });
  test('doctor --project --json has no human text', () => {
    assert.ok(!projOut.includes('Project Readiness'), 'no project banner');
  });
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

// ── Summary ──
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
