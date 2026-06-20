#!/usr/bin/env node
// scripts/validate-trust-scorer.mjs
// v2.16.0 — Gate: trust-scorer-wired
// Asserts trust-scorer.mjs exists and has required exports per ADR 0004

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCORER_PATH = resolve(__dirname, '../security/defense/trust-scorer.mjs');

if (!existsSync(SCORER_PATH)) {
  console.error('FAIL: trust-scorer.mjs missing');
  process.exit(1);
}

const content = readFileSync(SCORER_PATH, 'utf8');
const required = [
  'export function scoreSource',
  'export function detectBypassLoop',
  'export function classifyLicense',
  'export function scoreAll',
  'TRUST_CLASSES',
  'HEURISTIC_PATTERNS',
  'LICENSE_CLASSES'
];

let pass = 0;
let fail = 0;
for (const term of required) {
  if (content.includes(term)) {
    pass++;
  } else {
    console.error(`FAIL: missing export: ${term}`);
    fail++;
  }
}

console.log(`trust-scorer-wired: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
console.log('trust-scorer-wired: PASS');
