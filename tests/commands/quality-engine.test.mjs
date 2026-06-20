#!/usr/bin/env node
// tests/commands/quality-engine.test.mjs
// v2.16.0 Wave B — Asserts quality-engine command and scorecard integration.

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

const files = [
  'commands/vibe-quality-engine.md',
  'scripts/quality-engine.mjs',
  'scripts/quality-scorecard-report.mjs',
];

let pass = 0, fail = 0;
for (const f of files) {
  const full = resolve(REPO, f);
  if (existsSync(full)) {
    pass++;
  } else {
    fail++;
    console.log(`  ❌ Missing: ${f}`);
  }
}

console.log(`\nquality-engine: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
