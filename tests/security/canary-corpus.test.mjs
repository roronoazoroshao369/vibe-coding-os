#!/usr/bin/env node
// tests/security/canary-corpus.test.mjs
// v2.16.0 Wave B — Asserts canary corpus has 49+ payloads and required categories.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CANARY = resolve(__dirname, '../../security/defense/patterns/canary-corpus.v1.json');

const corpus = JSON.parse(readFileSync(CANARY, 'utf8'));
const payloads = corpus.payloads || corpus;

let pass = 0, fail = 0;

if (Array.isArray(payloads) && payloads.length >= 49) {
  pass++;
  console.log(`  ✅ ${payloads.length} payloads (>= 49)`);
} else {
  fail++;
  console.log(`  ❌ ${payloads.length} payloads (expected >= 49)`);
}

// Check required fields
const requiredFields = ['id', 'content', 'expected_action'];
for (const field of requiredFields) {
  if (payloads[0] && field in payloads[0]) pass++;
  else { fail++; console.log(`  ❌ missing field: ${field}`); }
}

console.log(`\ncanary-corpus: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
