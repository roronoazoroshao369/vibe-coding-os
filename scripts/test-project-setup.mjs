#!/usr/bin/env node
// test-project-setup.mjs — regression tests for project-local setup CLI

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CLI = join(ROOT, 'scripts', 'vibe-cli.mjs');
const tempRoots = [];
const results = [];

function tempProject(name = 'vibe-project-setup-') {
  const dir = mkdtempSync(join(tmpdir(), name));
  tempRoots.push(dir);
  return dir;
}

function runCli(args, { cwd = tempProject(), expectedStatus = 0 } = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  assert.equal(result.status, expectedStatus, `vibe init ${args.join(' ')} exited ${result.status}, expected ${expectedStatus}\n${output}`);
  return { ...result, output, cwd };
}

function runInit(args, options = {}) {
  return runCli(['init', ...args], options);
}

function test(name, fn) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`✅ PASS ${name}`);
  } catch (error) {
    results.push({ name, passed: false, error });
    console.error(`❌ FAIL ${name}`);
    console.error(error.stack || error.message);
  }
}

try {
  test('init help documents onboarding flags', () => {
    const { output } = runCli(['init', '--help']);
    for (const flag of ['--tool', '--scope', '--current-terminal', '--project', '--dry-run', '--force']) {
      assert.match(output, new RegExp(flag), `${flag} should be documented`);
    }
    assert.match(output, /Examples:/);
  });

  test('dry-run writes no project files', () => {
    const cwd = tempProject();
    const { output } = runInit(['claude-code', '--dry-run'], { cwd });
    assert.match(output, /Dry run/i);
    assert.equal(existsSync(join(cwd, 'CLAUDE.md')), false, 'CLAUDE.md should not be written');
    assert.equal(existsSync(join(cwd, '.vibe', 'setup.json')), false, 'setup manifest should not be written');
  });

  test('recommended scope writes adapter file and project-local manifest', () => {
    const cwd = tempProject();
    runInit(['claude-code', '--scope', 'recommended'], { cwd });
    assert.equal(existsSync(join(cwd, 'CLAUDE.md')), true, 'CLAUDE.md should be written');
    const manifest = JSON.parse(readFileSync(join(cwd, '.vibe', 'setup.json'), 'utf8'));
    assert.equal(manifest.schemaVersion, 1);
    assert.equal(manifest.tool, 'claude-code');
    assert.equal(manifest.scope, 'recommended');
    assert.equal(manifest.projectLocal, true);
    assert.equal(manifest.globalSettingsModified, false);
    assert.deepEqual(manifest.features, ['adapter-instructions', 'setup-manifest']);
  });

  test('minimal scope manifest records minimal feature set', () => {
    const cwd = tempProject();
    runInit(['codex', '--scope=minimal'], { cwd });
    assert.equal(existsSync(join(cwd, 'AGENTS.md')), true, 'AGENTS.md should be written');
    const manifest = JSON.parse(readFileSync(join(cwd, '.vibe', 'setup.json'), 'utf8'));
    assert.equal(manifest.tool, 'codex');
    assert.equal(manifest.scope, 'minimal');
    assert.deepEqual(manifest.features, ['adapter-instructions']);
    assert.equal(manifest.optionalRuntime, false);
    assert.equal(manifest.teamWorkflows, false);
  });

  test('existing files are not overwritten without --force', () => {
    const cwd = tempProject();
    const claudePath = join(cwd, 'CLAUDE.md');
    const manifestPath = join(cwd, '.vibe', 'setup.json');
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(claudePath, 'existing instructions\n', 'utf8');
    writeFileSync(manifestPath, '{"existing":true}\n', 'utf8');
    runInit(['claude-code', '--scope', 'recommended'], { cwd });
    assert.equal(readFileSync(claudePath, 'utf8'), 'existing instructions\n');
    assert.equal(readFileSync(manifestPath, 'utf8'), '{"existing":true}\n');
  });

  test('--force overwrites existing files', () => {
    const cwd = tempProject();
    const claudePath = join(cwd, 'CLAUDE.md');
    const manifestPath = join(cwd, '.vibe', 'setup.json');
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(claudePath, 'existing instructions\n', 'utf8');
    writeFileSync(manifestPath, '{"existing":true}\n', 'utf8');
    runInit(['claude-code', '--scope', 'recommended', '--force'], { cwd });
    assert.notEqual(readFileSync(claudePath, 'utf8'), 'existing instructions\n');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.tool, 'claude-code');
    assert.equal(manifest.scope, 'recommended');
  });

  test('backwards-compatible init claude-code --dry-run succeeds', () => {
    const cwd = tempProject();
    runInit(['claude-code', '--dry-run'], { cwd });
  });

  test('invalid tool fails', () => {
    const cwd = tempProject();
    const { output } = runInit(['not-a-tool'], { cwd, expectedStatus: 1 });
    assert.match(output, /Unknown tool|Valid/i);
  });

  test('invalid scope fails', () => {
    const cwd = tempProject();
    const { output } = runInit(['claude-code', '--scope', 'nowhere'], { cwd, expectedStatus: 1 });
    assert.match(output, /Unknown scope|Valid/i);
  });

  test('doctor after init shows project guidance', () => {
    const cwd = tempProject();
    runInit(['claude-code', '--scope', 'recommended'], { cwd });
    const { output } = runCli(['doctor', '--project', cwd]);
    assert.match(output, /Next steps:/);
    assert.match(output, /Claude Code:/);
    assert.match(output, /Runtime:.*optional/s);
  });
} finally {
  for (const dir of tempRoots) rmSync(dir, { recursive: true, force: true });
}

const failed = results.filter((r) => !r.passed);
console.log(`\nProject setup tests: ${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
