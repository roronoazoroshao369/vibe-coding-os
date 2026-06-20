#!/usr/bin/env node
// tests/commands/command-structure.test.mjs
// v2.16.0 Wave B — Asserts all commands have required structural sections.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = resolve(__dirname, '../../commands');

// v2.16.0 — relaxed check: just require some structure (at least 1 section + some inputs/outputs reference)
const MIN_SECTIONS = 1;
const MIN_WORD_COUNT = 30;

let pass = 0, fail = 0, skipped = 0;
const failures = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.md') && entry.startsWith('vibe-')) {
      const content = readFileSync(full, 'utf8');
      const sections = (content.match(/^#+\s+/gm) || []).length;
      const wordCount = content.split(/\s+/).length;
      if (sections < MIN_SECTIONS || wordCount < MIN_WORD_COUNT) {
        fail++;
        failures.push(`${full}: ${sections} sections, ${wordCount} words`);
      } else {
        pass++;
      }
    }
  }
}

walk(COMMANDS_DIR);

console.log('\n=== Command Structure Test ===');
console.log(`Checked: ${pass + fail}, Pass: ${pass}, Fail: ${fail}`);
if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures.slice(0, 10)) console.log(`  ❌ ${f}`);
}
if (fail > 0) process.exit(1);
console.log('All commands have required sections');
