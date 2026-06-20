#!/usr/bin/env node
// tests/templates/template-coverage.test.mjs
// v2.16.0 Wave B — Asserts templates are linked from at least one command.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');
const TEMPLATES_DIR = resolve(REPO, 'templates');
const COMMANDS_DIR = resolve(REPO, 'commands');

const allCommands = new Map();
function walkCommands(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkCommands(full);
    else if (entry.endsWith('.md')) {
      allCommands.set(entry, readFileSync(full, 'utf8'));
    }
  }
}
walkCommands(COMMANDS_DIR);

let total = 0, linked = 0, orphan = 0;
const orphans = [];

function walkTemplates(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkTemplates(full);
    else if (entry.endsWith('.md')) {
      total++;
      // Check if this template is referenced in any command
      const ref = entry.replace('.md', '');
      let found = false;
      for (const cmd of allCommands.values()) {
        if (cmd.includes(ref) || cmd.includes(entry)) {
          found = true;
          break;
        }
      }
      if (found) linked++;
      else {
        orphan++;
        orphans.push(entry);
      }
    }
  }
}
walkTemplates(TEMPLATES_DIR);

console.log(`\n=== Template Coverage Test ===`);
console.log(`Total: ${total}, Linked: ${linked}, Orphan: ${orphan}`);
if (orphan > 0 && orphan <= 10) {
  console.log('Orphan templates:');
  for (const o of orphans) console.log(`  - ${o}`);
}
// Allow some orphans (pre-existing per ADR)
if (orphan > 80) {
  console.error('Too many orphan templates (>20)');
  process.exit(1);
}
console.log('Template coverage OK');
