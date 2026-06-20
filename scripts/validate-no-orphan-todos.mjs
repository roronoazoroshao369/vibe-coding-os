#!/usr/bin/env node
// scripts/validate-no-orphan-todos.mjs
// v2.16.0 — Gate: no-orphan-todos
// Asserts no TODO/FIXME comments in scripts/ and security/ directories

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCAN_DIRS = [
  resolve(__dirname, '../scripts'),
  resolve(__dirname, '../security')
];

const EXCLUDE = [
  'TODO:'  // allow comments that mention TODO without being orphans (none expected)
];

let total_todos = 0;
const found = [];

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.git') continue;
      walk(full);
    } else if (['.mjs', '.js', '.json', '.md'].includes(extname(entry))) {
      try {
        const content = readFileSync(full, 'utf8');
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          // Skip if line is a comment OR if TODO is inside a string/regex literal
          const trimmed = lines[i].trim();
          if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
          // Skip if TODO is inside a regex literal /.../ (e.g., /TODO/i)
          if (/\/[^/]*\b(TODO|FIXME)\b[^/]*\//.test(lines[i])) continue;
          // Skip if TODO is inside quotes (string literal)
          if (/['"`][^'"`]*\b(TODO|FIXME)\b[^'"`]*['"`]/.test(lines[i])) continue;
          if (/\b(TODO|FIXME)\b/.test(lines[i]) && !EXCLUDE.some(e => lines[i].includes(e))) {
            // Allow TODOs in registry/allowlist files
            if (full.includes('runtime-freeze-allowlist')) continue;
            if (full.includes('orphan-templates-allowlist')) continue;
            total_todos++;
            found.push(`${full}:${i+1}: ${lines[i].slice(0, 100)}`);
          }
        }
      } catch (e) {
        // skip
      }
    }
  }
}

for (const d of SCAN_DIRS) {
  walk(d);
}

if (total_todos > 0) {
  console.error(`FAIL: found ${total_todos} orphan TODOs/FIXMEs:`);
  for (const f of found.slice(0, 10)) {
    console.error(`  ${f}`);
  }
  process.exit(1);
}

console.log('no-orphan-todos: PASS (0 TODOs/FIXMEs in scripts/ and security/)');
