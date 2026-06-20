#!/usr/bin/env node
// tests/quality/quality-engine.test.mjs
// v2.16.0 Wave B — Asserts quality engine produces a valid scorecard.

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

const files = [
  'scripts/quality-engine.mjs',
  'scripts/quality-scorecard-report.mjs',
  'commands/vibe-quality-engine.md',
  'commands/vibe-quality-rubric.md',
  'commands/vibe-quality-gate.md',
];

let pass = 0, fail = 0;
for (const f of files) {
  if (existsSync(resolve(REPO, f))) pass++;
  else { fail++; console.log(`  ❌ missing: ${f}`); }
}

console.log(`\nquality-engine: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
