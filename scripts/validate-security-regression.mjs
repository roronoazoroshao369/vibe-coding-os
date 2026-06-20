#!/usr/bin/env node
// scripts/validate-security-regression.mjs
// v2.14.0 — Security regression gate
// Runs tests/security/regression.mjs and asserts coverage targets.

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const baselinePath = resolve(REPO_ROOT, 'tests/security/baseline.json');
const corpusPath = resolve(REPO_ROOT, 'security/defense/patterns/canary-corpus.v1.json');

if (!existsSync(corpusPath)) {
  console.error('❌ FAIL: canary corpus not found at ' + corpusPath);
  process.exit(1);
}

// Run regression test
console.log('Running security regression test...');
const result = spawnSync('node', ['tests/security/regression.mjs'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
  stdio: 'pipe'
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';

// Parse coverage from output
const coverageMatch = stdout.match(/Detection coverage:\s*([\d.]+)%/);
const fpMatch = stdout.match(/False positive rate:\s*([\d.]+)%/);

if (!coverageMatch || !fpMatch) {
  console.error('❌ FAIL: Could not parse regression output');
  console.error('STDOUT:', stdout.slice(-500));
  console.error('STDERR:', stderr.slice(-500));
  process.exit(1);
}

const coverage = parseFloat(coverageMatch[1]);
const fpRate = parseFloat(fpMatch[1]);

console.log(`\n=== Security Regression Gate ===`);
console.log(`Detection coverage: ${coverage}% (target >= 95%)`);
console.log(`False positive rate: ${fpRate}% (target < 2%)`);

// Check baseline regression
if (existsSync(baselinePath)) {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  console.log(`\nBaseline: ${baseline.coverage}% (updated ${baseline.updated})`);
  if (coverage < parseFloat(baseline.coverage)) {
    console.error(`❌ FAIL: Coverage regressed from ${baseline.coverage}% to ${coverage}%`);
    process.exit(1);
  }
}

// Gate criteria
if (coverage >= 95 && fpRate < 2) {
  console.log(`\n✅ PASS: coverage and FP rate within target`);
  process.exit(0);
} else if (coverage >= 90) {
  console.log(`\n⚠️  WARN: Coverage ${coverage}% below 95% target but above 90% floor`);
  process.exit(0);
} else {
  console.error(`\n❌ FAIL: Coverage ${coverage}% below 90% floor`);
  process.exit(1);
}
