#!/usr/bin/env node
/**
 * validate-property-tests.mjs — v2.16.0 Wave B Quality Hardening gate
 *
 * Runs property-test-runner.mjs and asserts >=80% pass rate.
 * This is a blocking gate: high failure rate indicates broken/messy docs.
 *
 * Usage:
 *   node scripts/validate-property-tests.mjs
 */

import { execSync } from 'node:child_process';
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');

const OUTPUT = '/tmp/property-test-result.json';
const PASS_THRESHOLD = 0.80;  // 80% pass rate required

console.log('Running property-test-runner.mjs...');
let stdout, stderr;
try {
  const result = execSync('node scripts/property-test-runner.mjs > ' + OUTPUT + ' 2>&1', {
    cwd: REPO,
    encoding: 'utf8',
    timeout: 240000,
  });
} catch (e) {
  // Non-zero exit OK if file written
}

if (!existsSync(OUTPUT)) {
  console.error('❌ FAIL: Property test output missing');
  process.exit(1);
}

const content = readFileSync(OUTPUT, 'utf8');
let data;
try {
  data = JSON.parse(content);
} catch (e) {
  console.error('❌ FAIL: Property test output is not valid JSON');
  process.exit(1);
}

const total = data.tests_run || 0;
const failures = data.failures || 0;
const passed = total - failures;
const passRate = total > 0 ? passed / total : 0;

console.log(`\n=== Property Tests Gate ===`);
console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failures}`);
console.log(`Pass rate: ${(passRate * 100).toFixed(1)}% (threshold: ${(PASS_THRESHOLD * 100).toFixed(0)}%)`);

if (passRate >= PASS_THRESHOLD) {
  console.log('✅ PASS: Property test pass rate meets threshold');
  process.exit(0);
} else {
  console.error(`❌ FAIL: Property test pass rate below ${PASS_THRESHOLD * 100}%`);
  process.exit(1);
}
