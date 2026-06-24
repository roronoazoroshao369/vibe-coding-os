#!/usr/bin/env node
// validate-roadmap-future-drift.mjs — fail if roadmap status implies future releases are complete.

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

const packageVersion = (() => {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')).version ?? '';
  } catch {
    return '';
  }
})();

function parseVersion(value) {
  const match = String(value).match(/v?(\d+)\.(\d+)\.(\d+)|v?(\d+)\.(\d+)/);
  if (!match) return null;
  if (match[1] !== undefined) {
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  return [Number(match[4]), Number(match[5]), 0];
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return 0;
}

const currentVersion = parseVersion(packageVersion);
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
console.log(`Current package version: v${packageVersion}`);

if (!currentVersion) {
  fail(`Unable to parse package.json version: ${packageVersion || 'missing'}`);
} else {
  for (let idx = 0; idx < lines.length; idx++) {
    const heading = lines[idx].trim().match(/^##\s+(v\d+\.\d+(?:\.\d+)?(?:\S*)?)/);
    if (!heading) continue;

    const headingVersion = heading[1].replace(/\*$/, '').trim();
    const parsedHeading = parseVersion(headingVersion);
    if (!parsedHeading) continue;
    if (compareVersions(parsedHeading, currentVersion) <= 0) continue;

    const sectionLines = [];
    for (let i = idx + 1; i < lines.length; i++) {
      if (lines[i].trim().startsWith('## ')) break;
      sectionLines.push(lines[i]);
    }

    const section = sectionLines.join('\n');
    const impliesComplete = /(?:Status\s*:\s*✅|✅\s*Complete|\bDone\b|\bCOMPLETE\b|\bComplete\b)/i.test(section);
    const explicitlyPlanned = /\bPlanned\b|\bDeferred\b|\bActive roadmap\b/i.test(section);

    if (impliesComplete && !explicitlyPlanned) {
      fail(`${headingVersion} appears complete while package.json is v${packageVersion}`);
    }
  }
}

if (failures === 0) {
  pass('No future version section is marked complete');
}

console.log('');
if (failures > 0) {
  process.exit(1);
}
