#!/usr/bin/env node
// validate-roadmap-status.mjs — checks docs/ROADMAP-STATUS.md integrity

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FILE = resolve(ROOT, 'docs/ROADMAP-STATUS.md');

const errors = [];

function fail(msg) {
  errors.push(msg);
  console.error(`  ❌ ${msg}`);
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

console.log('=== ROADMAP-STATUS.md validation ===');

// 1. File must exist and be readable
let content;
try {
  content = readFileSync(FILE, 'utf8');
  pass(`File exists (${content.length} chars, ${content.split('\n').length} lines)`);
} catch (e) {
  fail(`Cannot read file: ${e.message}`);
  process.exit(1);
}

// 2. First line must be H1
const lines = content.split('\n');
const firstLine = lines[0].trim();
if (!firstLine.startsWith('# ')) {
  fail('First line must start with "# " (H1 heading)');
} else {
  pass(`First line: ${firstLine}`);
}

// 3. No null bytes or control characters (raw tabs and newlines are fine)
let controlChars = 0;
for (let i = 0; i < content.length; i++) {
  const code = content.charCodeAt(i);
  if (code === 0) {
    controlChars++;
    fail(`Null byte at position ${i}`);
    break;
  }
}
if (controlChars === 0) pass('No null bytes detected');

// 4. All H2 lines should be version sections
const h2Lines = lines.filter(l => l.trim().startsWith('## '));
if (h2Lines.length === 0) {
  fail('No H2 headings found');
} else {
  const versionSections = h2Lines.filter(l => /^##\s+v\d+\.\d+(\.\d+)?/.test(l.trim()));
  if (versionSections.length === 0) {
    fail('No version sections found (expected ## vX.Y.Z syntax)');
  } else {
    pass(`${versionSections.length} version sections: ${versionSections.map(l => l.trim().replace(/^##\s+/, '')).join(', ')}`);
  }
}

// 5. Check table consistency — each table should have a separator row
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].trim().startsWith('|')) continue;
  if (i > 0 && lines[i - 1].trim().startsWith('|')) continue;
  // This is the first row of a table — next row should be separator
  const nextIdx = i + 1;
  if (nextIdx < lines.length && !/^\|[-:| ]+\|$/.test(lines[nextIdx].trim())) {
    fail(`Table at line ${i + 1} missing separator row`);
    break;
  }
}
if (errors.filter(e => e.includes('missing separator row')).length === 0) {
  pass('Table separator rows present');
}

// 6. Check the summary line at top
const summaryLine = lines.find(l => l.includes('Last updated'));
if (summaryLine) {
  pass('Has "Last updated" timestamp');
} else {
  fail('Missing "Last updated" timestamp at top');
}

// 7. Validate no unusually long lines (garbage indicators)
for (let i = 0; i < lines.length; i++) {
  if (lines[i].length > 500) {
    fail(`Suspiciously long line ${i + 1}: ${lines[i].length} chars (possible corruption)`);
    console.error(`    Content preview: ${lines[i].slice(0, 100)}...`);
  }
}

console.log(`\nOverall: ${errors.length === 0 ? 'PASS' : `${errors.length} issue(s) found`}`);
if (errors.length > 0) process.exit(1);
