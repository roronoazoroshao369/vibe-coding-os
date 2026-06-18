#!/usr/bin/env node
// validate-roadmap-future-drift.mjs — warn if docs imply future versions are already complete

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FILE = resolve(ROOT, 'docs/ROADMAP-STATUS.md');

let content;
try {
  content = readFileSync(FILE, 'utf8');
} catch (error) {
  console.error(`❌ Cannot read ${FILE}: ${error.message}`);
  process.exit(1);
}

const version = (() => {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')).version ?? '';
  } catch {
    return '';
  }
})();

const versionPrefix = version.replace(/-.*$/, '');
const lines = content.split('\n');

let failures = 0;

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  failures++;
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

console.log('=== ROADMAP-STATUS future-drift validation ===');

let currentVersionHeading = null;
for (const line of lines) {
  const match = line.trim().match(/^##\s+(v\S+)/);
  if (!match) continue;

  const headingVersion = match[1].replace(/\*$/, '').trim();
  currentVersionHeading = headingVersion;

  const parsed = parseFloat(headingVersion);
  if (Number.isNaN(parsed)) continue;
  if (parsed <= parseFloat(versionPrefix)) continue;

  // Future version
  const idx = lines.indexOf(line);
  const sectionLines = [];
  for (let i = idx + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith('## ')) break;
    sectionLines.push(lines[i]);
  }

  const hasComplete = sectionLines.some(l => /(?:Status|Deliverable|Done|COMPLETE)/.test(l));
  if (hasComplete) {
    fail(`${headingVersion} appears to be marked complete while package.json is ${version}`);
  }
}

if (failures === 0) {
  pass('No future versions appear to be marked complete');
}

console.log('');
if (failures > 0) {
  process.exit(1);
}
