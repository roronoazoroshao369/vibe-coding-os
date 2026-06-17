#!/usr/bin/env node
// test-runtime-doctor.mjs — Tests for runtime/core/doctor.mjs

import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runDoctor, formatDoctorReport } from '../runtime/core/doctor.mjs';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withRoot(fn) {
  const root = await mkdtemp(path.join(tmpdir(), 'doctor-'));
  try { return await fn(root); }
  finally { await rm(root, { recursive: true, force: true }); }
}

test('runDoctor reports healthy empty runtime', async () => withRoot(async (root) => {
  const report = await runDoctor(root);
  assert.equal(report.summary.error, 0);
  assert.equal(report.summary.operational, true);
  assert.equal(report.checks.length, 8);
  assert.ok(report.checks.find(c => c.name === 'runtime_directory'));
}));

test('runDoctor detects task store counts', async () => withRoot(async (root) => {
  const runtimeDir = path.join(root, '.omc', 'runtime');
  await mkdir(runtimeDir, { recursive: true });
  await writeFile(path.join(runtimeDir, 'tasks.json'), JSON.stringify({
    schemaVersion: 2,
    kind: 'tasks',
    items: [
      { id: 't1', status: 'pending' },
      { id: 't2', status: 'completed' },
    ],
  }));
  const report = await runDoctor(root);
  const taskCheck = report.checks.find(c => c.name === 'task_store');
  assert.equal(taskCheck.status, 'pass');
  assert.equal(taskCheck.data.count, 2);
  assert.equal(taskCheck.data.statusCounts.pending, 1);
}));

test('runDoctor warns on corrupted task store', async () => withRoot(async (root) => {
  const runtimeDir = path.join(root, '.omc', 'runtime');
  await mkdir(runtimeDir, { recursive: true });
  await writeFile(path.join(runtimeDir, 'tasks.json'), 'not json');
  const report = await runDoctor(root);
  const taskCheck = report.checks.find(c => c.name === 'task_store');
  assert.equal(taskCheck.status, 'warn');
}));

test('formatDoctorReport renders human-readable report', async () => withRoot(async (root) => {
  const report = await runDoctor(root);
  const text = formatDoctorReport(report);
  assert.match(text, /Runtime Health Check/);
  assert.match(text, /runtime_directory/);
  assert.match(text, /HEALTHY|ISSUES FOUND/);
}));

let failures = 0;
for (const { name, fn } of tests) {
  try { await fn(); console.log(`PASS ${name}`); }
  catch (err) { failures++; console.error(`FAIL ${name}`); console.error(err?.stack || err); }
}
console.log(`\nRuntime Doctor tests: ${tests.length - failures}/${tests.length} passed`);
process.exit(failures === 0 ? 0 : 1);
