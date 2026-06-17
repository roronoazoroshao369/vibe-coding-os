#!/usr/bin/env node
/**
 * smoke-test-runtime.mjs — quick sanity check of runtime-init + schema validation
 *
 * Runs in a temp directory to avoid touching the repo's .omc/runtime.
 * Creates one item of each type, runs runtime-validate, corrupts one item
 * and asserts validation fails.
 */
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';

const exec = promisify(execFile);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

async function run(cmd, args, cwd) {
  try {
    const { stdout, stderr } = await exec(cmd, args, { cwd, env: { ...process.env, NODE_OPTIONS: '' } });
    return { ok: true, stdout, stderr };
  } catch (e) {
    return { ok: false, stdout: e.stdout || '', stderr: e.stderr || e.message };
  }
}

const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'vibe-smoke-'));
try {
  // Init runtime
  const init = await run('node', [path.join(ROOT, 'scripts', 'runtime-init.mjs'), '--force'], tmpDir);
  if (!init.ok) { console.error('runtime:init failed:', init.stderr); process.exit(1); }

  // Add one task via direct JSON write
  const tasksFile = path.join(tmpDir, '.omc', 'runtime', 'tasks.json');
  const tasks = JSON.parse(await readFile(tasksFile, 'utf8'));
  tasks.items.push({ id: 'smoke-task-1', title: 'Smoke test task', status: 'pending', createdAt: new Date().toISOString() });
  await writeFile(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');

  // Add one memory entry
  const memFile = path.join(tmpDir, '.omc', 'runtime', 'memory.json');
  const mem = JSON.parse(await readFile(memFile, 'utf8'));
  mem.items.push({ id: 'smoke-mem-1', content: 'Smoke memory', scope: 'test', createdAt: new Date().toISOString() });
  await writeFile(memFile, JSON.stringify(mem, null, 2), 'utf8');

  // Add one checkpoint
  const chkFile = path.join(tmpDir, '.omc', 'runtime', 'checkpoints.json');
  const chk = JSON.parse(await readFile(chkFile, 'utf8'));
  chk.items.push({ id: 'smoke-chk-1', type: 'gate', result: 'passed', createdAt: new Date().toISOString() });
  await writeFile(chkFile, JSON.stringify(chk, null, 2), 'utf8');

  // Add one team
  const teamFile = path.join(tmpDir, '.omc', 'runtime', 'teams.json');
  const team = JSON.parse(await readFile(teamFile, 'utf8'));
  team.items.push({ id: 'smoke-team-1', name: 'Smoke team', roles: [{ name: 'dev', purpose: 'Develop', owned_paths: ['.'], tools: ['node'], validation: 'validate', handoff_fields: ['summary'] }] });
  await writeFile(teamFile, JSON.stringify(team, null, 2), 'utf8');

  // Add one workflow-run via CLI
  const wfInit = await run('node', [path.join(ROOT, 'scripts', 'workflow-status.mjs'), 'init', '--id', 'smoke-wf-1', '--workflow', 'test'], tmpDir);
  if (!wfInit.ok) { console.error('workflow-status init failed:', wfInit.stderr); process.exit(1); }

  // Validation should pass
  const valid = await run('node', [path.join(ROOT, 'scripts', 'runtime-validate.mjs')], tmpDir);
  if (!valid.ok) {
    console.error('Expected runtime validation to pass but it failed:');
    console.error(valid.stderr || valid.stdout);
    process.exit(1);
  }
  console.log('✅ Smoke test: valid items pass validation');

  // Corrupt a task item (remove required id)
  tasks.items[0] = { title: 'bad task', status: 'pending' };
  await writeFile(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');

  const invalid = await run('node', [path.join(ROOT, 'scripts', 'runtime-validate.mjs')], tmpDir);
  if (invalid.ok) {
    console.error('Expected runtime validation to fail but it passed');
    process.exit(1);
  }
  console.log('✅ Smoke test: corrupted item correctly fails validation');
  console.log('✅ All smoke tests passed');
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}
