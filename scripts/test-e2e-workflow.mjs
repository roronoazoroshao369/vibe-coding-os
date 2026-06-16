#!/usr/bin/env node
// test-e2e-workflow.mjs — end-to-end CLI workflow integration test
// Uses Node built-ins only and writes only to a temporary directory.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CLI = join(ROOT, 'scripts', 'vibe-cli.mjs');
const tmpRoot = mkdtempSync(join(tmpdir(), 'vibe-e2e-'));

const results = [];

function runStep(name, fn) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`✅ PASS ${name}`);
  } catch (error) {
    results.push({ name, passed: false, error });
    console.log(`❌ FAIL ${name}`);
    console.log(`   ${error.message}`);
  }
}

function runCli(args, options = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    cwd: options.cwd ?? ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024
  });

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  if (result.status !== 0) {
    throw new Error(`Command failed (${result.status}): node scripts/vibe-cli.mjs ${args.join(' ')}\n${output.trim()}`);
  }
  return output;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFileContains(filePath, snippets) {
  assert(existsSync(filePath), `Expected file to exist: ${filePath}`);
  const content = readFileSync(filePath, 'utf8');
  for (const snippet of snippets) {
    assert(content.includes(snippet), `Expected ${filePath} to contain: ${snippet}`);
  }
}

console.log('=== Vibe CLI E2E Workflow Test ===');
console.log(`Started: ${new Date().toISOString()}`);
console.log(`Temp dir: ${tmpRoot}`);
console.log('');

try {
  runStep('copy spec template', () => {
    const output = runCli(['spec', 'e2e-demo', '--copy'], { cwd: tmpRoot });
    assert(output.includes('Vibe Spec'), 'Expected spec command heading in output');
    assertFileContains(join(tmpRoot, 'SPEC.md'), ['# Spec:', '## Intent', '## Acceptance criteria']);
  });

  runStep('copy plan template', () => {
    const output = runCli(['plan', 'e2e-demo', '--copy'], { cwd: tmpRoot });
    assert(output.includes('Vibe Plan'), 'Expected plan command heading in output');
    assertFileContains(join(tmpRoot, 'PLAN.md'), ['# Plan:', '## Technical context', '## Verification']);
  });

  runStep('copy task template', () => {
    const output = runCli(['task', 'e2e-demo', '--copy'], { cwd: tmpRoot });
    assert(output.includes('Vibe Task'), 'Expected task command heading in output');
    assertFileContains(join(tmpRoot, 'TASK.md'), ['# Task:', '## Objective', '## Done when']);
  });

  runStep('copy memory template', () => {
    const output = runCli(['memory', 'e2e-demo', '--copy'], { cwd: tmpRoot });
    assert(output.includes('Vibe Memory'), 'Expected memory command heading in output');
    assertFileContains(join(tmpRoot, 'MEMORY.md'), ['# Memory Entry Template', '## Purpose', '## Do not store secrets checklist']);
  });

  runStep('smoke read-only CLI commands', () => {
    const commands = [
      { args: ['help'], expected: 'Vibe Coding OS CLI' },
      { args: ['stats'], expected: 'Repository Stats' },
      { args: ['templates'], expected: 'Available Templates' }
    ];
    for (const command of commands) {
      const output = runCli(command.args);
      assert(output.includes(command.expected), `Expected ${command.args.join(' ')} output to include ${command.expected}`);
    }
  });
} finally {
  if (process.env.DEBUG_E2E === '1') {
    console.log(`DEBUG_E2E=1 set; keeping temp dir: ${tmpRoot}`);
  } else {
    rmSync(tmpRoot, { recursive: true, force: true });
  }
}

console.log('');
const passed = results.filter((result) => result.passed).length;
console.log(`Overall: ${passed}/${results.length} E2E workflow checks passed`);

if (passed !== results.length) {
  console.log('E2E workflow test FAILED');
  process.exit(1);
}

console.log('E2E workflow test PASSED');
