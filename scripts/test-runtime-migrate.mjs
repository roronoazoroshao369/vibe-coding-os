#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function withTempRuntime(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'runtime-migrate-test-'));
  try {
    // Initialize minimal runtime dir
    const runtimeDir = path.join(root, '.omc', 'runtime');
    await mkdir(runtimeDir, { recursive: true });
    // Create a v1 tasks collection
    const tasksV1 = {
      schemaVersion: 1,
      kind: 'tasks',
      items: [
        { id: 'task-1', title: 'Old Task', status: 'pending' },
      ],
    };
    await writeFile(path.join(runtimeDir, 'tasks.json'), JSON.stringify(tasksV1, null, 2) + '\n');

    // Create a v1 sessions collection
    const sessionsV1 = {
      schemaVersion: 1,
      kind: 'sessions',
      items: [
        { id: 'session-1', goal: 'Migrate me' },
      ],
    };
    await writeFile(path.join(runtimeDir, 'sessions.json'), JSON.stringify(sessionsV1, null, 2) + '\n');

    return await fn({ root, runtimeDir });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function runMigrate(args, cwd) {
  const script = path.resolve(__dirname, 'runtime-migrate.mjs');
  const result = spawnSync('node', [script, ...args], { cwd, encoding: 'utf8' });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status, error: result.error };
}

// For use in test modules that might be run from different dirs
const __dirname = path.dirname(new URL(import.meta.url).pathname);

test('runtime-migrate status reports current schema version', async () => {
  await withTempRuntime(async ({ root }) => {
    const { stdout } = runMigrate(['status'], root);
    const status = JSON.parse(stdout.trim());
    assert.equal(typeof status.schemaVersion, 'number');
    assert.equal(status.runtimeInitialized, true);
    assert.ok(status.collections.tasks);
    assert.equal(status.collections.tasks.schemaVersion, 1);
  });
});

test('runtime-migrate backup creates backup directory with collection files', async () => {
  await withTempRuntime(async ({ root }) => {
    const { stdout } = runMigrate(['backup'], root);
    assert.ok(stdout.includes('Backup created'));
    const backupId = stdout.match(/Backup ID: (.+?)(\n|$)/)?.[1]?.trim();
    assert.ok(backupId, `expected Backup ID in output: ${stdout}`);
    const backupDir = path.join(root, '.omc', 'runtime', 'backups', backupId);
    assert.ok(existsSync(path.join(backupDir, 'tasks.json')));
    assert.ok(existsSync(path.join(backupDir, 'backup.json')));
    const backupContent = JSON.parse(await readFile(path.join(backupDir, 'backup.json'), 'utf8'));
    assert.ok(backupContent.collections.tasks);
    assert.equal(backupContent.collections.tasks.items[0].id, 'task-1');
  });
});

test('runtime-migrate apply with version bump writes new schemaVersion', async () => {
  await withTempRuntime(async ({ root }) => {
    const { stdout, status } = runMigrate(['apply', '--from', '1', '--to', '2'], root);
    assert.equal(status, 0, `apply failed: ${stdout}`);
    // Check tasks.json updated
    const tasksJson = JSON.parse(await readFile(path.join(root, '.omc', 'runtime', 'tasks.json'), 'utf8'));
    assert.equal(tasksJson.schemaVersion, 2);
    assert.equal(tasksJson.items[0].schemaVersion, 2);
    assert.ok(tasksJson.items[0].metadata);
    assert.ok(tasksJson.items[0].extensions);
  });
});

test('runtime-migrate rollback restores from most recent backup', async () => {
  await withTempRuntime(async ({ root }) => {
    // Create backup first
    const { stdout: backupOut } = runMigrate(['backup'], root);
    assert.ok(backupOut);

    // Apply migration
    const { stdout: applyOut, status: applyStatus } = runMigrate(['apply', '--from', '1', '--to', '2'], root);
    assert.equal(applyStatus, 0);

    // Verify applied
    let tasksBeforeRollback = JSON.parse(await readFile(path.join(root, '.omc', 'runtime', 'tasks.json'), 'utf8'));
    assert.equal(tasksBeforeRollback.schemaVersion, 2);

    // Rollback
    const { stdout: rollbackOut, status: rollbackStatus } = runMigrate(['rollback'], root);
    assert.equal(rollbackStatus, 0, `rollback failed: ${rollbackOut}`);

    // Verify restored to v1
    const tasksAfterRollback = JSON.parse(await readFile(path.join(root, '.omc', 'runtime', 'tasks.json'), 'utf8'));
    assert.equal(tasksAfterRollback.schemaVersion, 1);
    assert.equal(tasksAfterRollback.items[0].id, 'task-1');
  });
});

test('runtime-migrate --from 1 --to 2 --dry-run reports dry-run without changes', async () => {
  await withTempRuntime(async ({ root }) => {
    const { stdout, stderr } = runMigrate(['dry-run', '--from', '1', '--to', '2'], root);
    assert.ok(stdout.includes('Dry-run') || stdout.includes('dry-run'), `Expected dry-run output: ${stdout}`);
    // Verify tasks.json was NOT modified
    const tasksJson = JSON.parse(await readFile(path.join(root, '.omc', 'runtime', 'tasks.json'), 'utf8'));
    assert.equal(tasksJson.schemaVersion, 1); // Still v1
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
