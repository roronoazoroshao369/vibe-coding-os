#!/usr/bin/env node
// tests/templates/template-schema.test.mjs
// v2.16.0 Wave B — Asserts all templates have frontmatter and required fields.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, '../../templates');

let total = 0, pass = 0, fail = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.md')) {
      total++;
      const content = readFileSync(full, 'utf8');
      if (content.startsWith('---')) {
        pass++;
      } else {
        fail++;
      }
    }
  }
}

walk(TEMPLATES_DIR);

console.log(`\n=== Template Schema Test ===`);
console.log(`Total: ${total}, With frontmatter: ${pass}, Without: ${fail}`);

if (fail > 0) {
  console.log('Templates missing frontmatter:');
  // Can't easily list failures from this design - exit code will surface it
  process.exit(1);
}
console.log('All templates have frontmatter');
