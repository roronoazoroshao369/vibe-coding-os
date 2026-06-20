#!/usr/bin/env node
// tests/registry/registry-schemas.test.mjs
// v2.16.0 Wave B — Asserts registry schemas are valid JSON.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_DIR = resolve(__dirname, '../../registry');

let total = 0, pass = 0, fail = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.json')) {
      total++;
      try {
        JSON.parse(readFileSync(full, 'utf8'));
        pass++;
      } catch (e) {
        fail++;
        console.log(`  ❌ Invalid JSON: ${full} — ${e.message}`);
      }
    }
  }
}

walk(REGISTRY_DIR);

console.log(`\n=== Registry Schemas Test ===`);
console.log(`Total: ${total}, Valid: ${pass}, Invalid: ${fail}`);
if (fail > 0) process.exit(1);
console.log('All registry JSON files valid');
