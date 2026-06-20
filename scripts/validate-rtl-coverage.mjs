#!/usr/bin/env node
// scripts/validate-rtl-coverage.mjs
// v2.16.0 — Gate: rtl-coverage-100
// Asserts security regression coverage >= 100% on canary corpus

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASELINE = resolve(__dirname, '../tests/security/baseline.json');

if (!existsSync(BASELINE)) {
  console.error('FAIL: tests/security/baseline.json missing');
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
const coverage = parseFloat(baseline.coverage);

if (coverage < 100.0) {
  console.error(`FAIL: detection coverage ${coverage}% < 100% target`);
  process.exit(1);
}

const fpr = parseFloat(baseline.falsePositiveRate);
if (fpr > 0.0) {
  console.error(`FAIL: false positive rate ${fpr}% > 0% target`);
  process.exit(1);
}

console.log(`rtl-coverage-100: PASS (coverage=${coverage}%, FPR=${fpr}%, flagged=${baseline.flagged}/${baseline.total})`);
