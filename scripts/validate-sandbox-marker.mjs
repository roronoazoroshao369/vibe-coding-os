#!/usr/bin/env node
// scripts/validate-sandbox-marker.mjs
// v2.15.0 — Wave A Deliverable 2: Heuristic detection + non-fatal warnings
// v2.14.0 — Sandbox marker convention gate
//
// Policy (v2.15.0):
//   - Declared external_content:true without sandbox: block = FAIL (hard gate)
//   - Heuristic pattern match (fetch, http, marketplace, ...) = WARN (advisory)
//   - Hard gate enforces the convention; soft warnings surface undeclared candidates
//     for maintainer review.

import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SKILLS_DIR = resolve(REPO_ROOT, 'skills');

const VALID_LEVELS = new Set(['trusted', 'read-only', 'isolated']);

// Heuristic patterns that suggest a skill loads external content
const EXTERNAL_PATTERNS = [
  { name: 'WebFetch mention',  regex: /WebFetch/i },
  { name: 'fetch() call',       regex: /fetch\s*\(/m },
  { name: 'http.get call',      regex: /http\.get/i },
  { name: 'axios call',         regex: /axios\./i },
  { name: 'requests call',      regex: /requests\.(get|post)/i },
  { name: 'marketplace ref',    regex: /marketplace/i },
  { name: 'http(s):// URL',     regex: /https?:\/\/[a-z]/i },
  { name: 'CLAUDE.md read',     regex: /CLAUDE\.md/i },
  { name: 'pip install',        regex: /pip\s+install/i },
  { name: 'npm install -g',     regex: /npm\s+install\s+-g/i },
  { name: 'curl',               regex: /curl\s+/i },
];

async function findSkillFiles(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        results.push(...await findSkillFiles(full));
      } else if (e.name === 'SKILL.md') {
        results.push(full);
      }
    }
  } catch { /* intentionally empty */ }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return {};
  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentObj = null;
  for (const line of lines) {
    if (line.match(/^[a-zA-Z_-]+:/)) {
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      if (value === '' && line.endsWith(':')) {
        currentKey = key.trim();
        currentObj = {};
        fm[currentKey] = currentObj;
      } else {
        currentKey = key.trim();
        currentObj = null;
        fm[currentKey] = value;
      }
    } else if (currentObj && line.match(/^\s+-/)) {
      const item = line.replace(/^\s+-\s*/, '').trim().replace(/^["']|["']$/g, '');
      const m = currentKey.match(/^(\w+)_sources$/);
      const listKey = m ? 'content_sources' : (currentKey + '_list');
      if (!Array.isArray(currentObj[listKey])) currentObj[listKey] = [];
      currentObj[listKey].push(item);
    } else if (currentObj && line.match(/^\s+\w+:/)) {
      const [k, ...v] = line.split(':');
      currentObj[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  return fm;
}

console.log('Scanning skills/ for sandbox marker compliance...\n');

const skillFiles = await findSkillFiles(SKILLS_DIR);
let checked = 0, declared = 0, heuristic = 0, compliant = 0, nonCompliant = 0;
const issues = [];
const heuristicHits = [];

for (const file of skillFiles) {
  checked++;
  const content = await readFile(file, 'utf8');
  const fm = parseFrontmatter(content);
  const relPath = file.replace(REPO_ROOT + '/', '');

  // Check declared external_content (HARD gate)
  const hasDeclaredExternal =
    fm.external_content === true ||
    fm.external_content === 'true' ||
    fm.external_content === 'yes';

  // Heuristic detection (v2.15.0 — advisory only)
  const hits = EXTERNAL_PATTERNS.filter(p => p.regex.test(content));
  const hasHeuristicExternal = hits.length > 0;

  if (hasHeuristicExternal && !hasDeclaredExternal) {
    heuristic++;
    heuristicHits.push({ file: relPath, patterns: hits.map(h => h.name) });
  }

  // Hard gate: declared must have marker
  if (hasDeclaredExternal) {
    declared++;
    const sandbox = fm.sandbox;

    if (!sandbox) {
      nonCompliant++;
      issues.push({ file: relPath, issue: 'missing sandbox block' });
      continue;
    }
    const level = sandbox.level;
    if (!level) {
      nonCompliant++;
      issues.push({ file: relPath, issue: 'sandbox block missing level field' });
      continue;
    }
    if (!VALID_LEVELS.has(level)) {
      nonCompliant++;
      issues.push({ file: relPath, issue: `invalid level: "${level}" (must be one of: ${[...VALID_LEVELS].join(', ')})` });
      continue;
    }
    if (level === 'isolated' && !sandbox.isolation) {
      nonCompliant++;
      issues.push({ file: relPath, issue: 'isolated level requires isolation: policy' });
      continue;
    }
    compliant++;
  }
}

console.log(`Skills scanned: ${checked}`);
console.log(`Declared external_content: ${declared}`);
console.log(`Heuristic-detected (advisory): ${heuristic}`);
console.log(`Compliant: ${compliant}`);
console.log(`Non-compliant (hard gate): ${nonCompliant}`);

if (heuristicHits.length > 0) {
  console.log(`\nWARN: ${heuristicHits.length} skill(s) have external-content patterns but no declaration.`);
  console.log('  Consider adding frontmatter: external_content: true + sandbox: block');
  for (const h of heuristicHits.slice(0, 20)) {
    console.log(`  - ${h.file}: ${h.patterns.slice(0, 3).join(', ')}${h.patterns.length > 3 ? ', ...' : ''}`);
  }
  if (heuristicHits.length > 20) {
    console.log(`  ... and ${heuristicHits.length - 20} more`);
  }
}

if (issues.length > 0) {
  console.log('\nHARD GATE FAILURES:');
  for (const i of issues) {
    console.log(`  ${i.file}: ${i.issue}`);
  }
}

if (nonCompliant === 0) {
  console.log('\n✅ PASS: All declared external_content skills have valid sandbox markers');
  if (heuristic > 0) {
    console.log(`   (${heuristic} advisory hits — review above)`);
  }
  process.exit(0);
} else {
  console.error(`\n❌ FAIL: ${nonCompliant} skill(s) missing sandbox markers (hard gate)`);
  process.exit(1);
}
