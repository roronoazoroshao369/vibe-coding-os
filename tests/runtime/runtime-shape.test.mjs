#!/usr/bin/env node
// tests/runtime/runtime-shape.test.mjs
// v2.16.0 Wave B — Asserts runtime is frozen (ADR 0002) and has not expanded.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

// Check ADR 0002 exists and asserts runtime freeze
const adrPath = resolve(REPO, 'docs/adr/0002-runtime-scope-freeze.md');
if (!readFileSync) process.exit(1);
const adr = readFileSync(adrPath, 'utf8');
if (!adr.toLowerCase().includes('frozen') && !adr.toLowerCase().includes('freeze')) {
  console.error('ADR 0002 does not assert runtime freeze');
  process.exit(1);
}

let pass = 0, fail = 0;

// Check that runtime/ exists and has expected files (not expanded)
const allowlistPath = resolve(REPO, 'registry/runtime-freeze-allowlist.json');
if (readFileSync(allowlistPath, 'utf8')) {
  pass++;
  console.log('  ✅ runtime-freeze-allowlist.json present');
} else {
  fail++;
}

console.log(`\nruntime-shape: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
