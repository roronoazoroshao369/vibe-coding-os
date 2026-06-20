#!/usr/bin/env node
// scripts/validate-security-command-coverage.mjs
// v2.16.0 — Gate: security-command-coverage-100
// Asserts all 3 security commands have test coverage

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_PATH = resolve(__dirname, '../tests/security/security-commands.test.mjs');

if (!existsSync(TEST_PATH)) {
  console.error('FAIL: security-commands.test.mjs missing');
  process.exit(1);
}

const result = spawnSync('node', [TEST_PATH], { encoding: 'utf8' });
if (result.status !== 0) {
  console.error('FAIL: security-commands.test.mjs exited non-zero');
  console.error(result.stdout);
  console.error(result.stderr);
  process.exit(1);
}

if (!result.stdout.includes('All security command tests PASSED')) {
  console.error('FAIL: test output missing PASS marker');
  process.exit(1);
}

console.log('security-command-coverage-100: PASS (3 commands, 4 tests)');
