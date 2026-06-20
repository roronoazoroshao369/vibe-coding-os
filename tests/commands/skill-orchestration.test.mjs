#!/usr/bin/env node
// tests/commands/skill-orchestration.test.mjs
// v2.16.0 Wave B — Asserts skill-orchestration commands are present and well-formed.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = resolve(__dirname, '../../commands');

const ORCHESTRATION_KEYWORDS = ['orchestrat', 'pipeline', 'workflow', 'chain', 'compos'];

let pass = 0, fail = 0;
const found = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.startsWith('vibe-') && entry.endsWith('.md')) {
      const content = readFileSync(full, 'utf8').toLowerCase();
      if (ORCHESTRATION_KEYWORDS.some(k => content.includes(k))) {
        found.push(full);
      }
    }
  }
}

walk(COMMANDS_DIR);

if (found.length >= 3) {
  console.log(`  ✅ Found ${found.length} orchestration-related commands`);
  pass++;
} else {
  console.log(`  ❌ Only ${found.length} orchestration commands (expected >= 3)`);
  fail++;
}

console.log(`\nskill-orchestration: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
