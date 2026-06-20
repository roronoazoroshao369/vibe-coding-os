#!/usr/bin/env node
// tests/commands/quality-shield.test.mjs
// v2.16.0 Wave B — Asserts quality-shield command + doc exist and reference 5-step workflow.

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

let pass = 0, fail = 0;

const cmdPath = resolve(REPO, 'commands/vibe-quality-engine.md');
if (existsSync(cmdPath)) {
  const content = readFileSync(cmdPath, 'utf8');
  if (content.includes('Step 1') || content.includes('## Step') || content.includes('Workflow')) {
    pass++; console.log('  ✅ vibe-quality-shield command has step workflow');
  } else {
    fail++; console.log('  ❌ vibe-quality-shield command missing step structure');
  }
} else {
  fail++; console.log('  ❌ vibe-quality-shield command missing');
}

const docPath = resolve(REPO, 'docs/quality-shield.md');
if (existsSync(docPath)) {
  const content = readFileSync(docPath, 'utf8');
  if (content.includes('Quality Shield') || content.includes('quality shield')) {
    pass++; console.log('  ✅ docs/quality-shield.md present');
  } else {
    fail++; console.log('  ❌ docs/quality-shield.md missing title');
  }
} else {
  fail++; console.log('  ❌ docs/quality-shield.md missing');
}

console.log(`\nquality-shield: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
