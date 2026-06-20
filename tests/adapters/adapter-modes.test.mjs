#!/usr/bin/env node
// tests/adapters/adapter-modes.test.mjs
// v2.16.0 Wave B — Asserts compatibility matrix lists all adapters.

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

const matrixPath = resolve(REPO, 'adapters/compatibility-matrix.md');
if (!existsSync(matrixPath)) {
  console.error('compatibility-matrix.md missing');
  process.exit(1);
}

const content = readFileSync(matrixPath, 'utf8');
const ADAPTERS = ['Claude Code', 'Codex', 'Cursor', 'Gemini', 'Cline', 'Aider', 'Windsurf', 'Memory'];

let pass = 0, fail = 0;
for (const a of ADAPTERS) {
  if (content.toLowerCase().includes(a.toLowerCase())) pass++;
  else {
    fail++;
    console.log(`  ❌ adapter ${a} not in compatibility matrix`);
  }
}

console.log(`\nadapter-modes: ${pass}/${ADAPTERS.length} adapters listed`);
if (fail > 0) process.exit(1);
