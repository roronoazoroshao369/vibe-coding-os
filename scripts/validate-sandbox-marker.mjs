#!/usr/bin/env node
// scripts/validate-sandbox-marker.mjs
// v2.14.0 — Sandbox marker convention gate
// Asserts skills with external_content:true have sandbox: block with level.

import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SKILLS_DIR = resolve(REPO_ROOT, 'skills');

const VALID_LEVELS = new Set(['trusted', 'read-only', 'isolated']);

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
  } catch {}
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
      const item = line.replace(/^\s+-\s*/, '').trim().replace(/^["\']|["\']$/g, '');
      const m = currentKey.match(/^(\w+)_sources$/);
      const listKey = m ? 'content_sources' : (currentKey + '_list');
      if (!Array.isArray(currentObj[listKey])) currentObj[listKey] = [];
      currentObj[listKey].push(item);
    } else if (currentObj && line.match(/^\s+\w+:/)) {
      const [k, ...v] = line.split(':');
      currentObj[k.trim()] = v.join(':').trim().replace(/^["\']|["\']$/g, '');
    }
  }
  return fm;
}

console.log('Scanning skills/ for sandbox marker compliance...\n');

const skillFiles = await findSkillFiles(SKILLS_DIR);
let checked = 0, withExternal = 0, compliant = 0, nonCompliant = 0;
const issues = [];

for (const file of skillFiles) {
  checked++;
  const content = await readFile(file, 'utf8');
  const fm = parseFrontmatter(content);
  
  // Check if skill declares external_content
  const hasExternal = 
    fm.external_content === true || 
    fm.external_content === 'true' ||
    fm.external_content === 'yes';
  
  if (!hasExternal) continue;
  
  withExternal++;
  const sandbox = fm.sandbox;
  const relPath = file.replace(REPO_ROOT + '/', '');
  
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

console.log(`Skills scanned: ${checked}`);
console.log(`With external_content: ${withExternal}`);
console.log(`Compliant: ${compliant}`);
console.log(`Non-compliant: ${nonCompliant}`);

if (issues.length > 0) {
  console.log('\nIssues:');
  for (const i of issues) {
    console.log(`  ${i.file}: ${i.issue}`);
  }
}

if (nonCompliant === 0) {
  console.log('\n✅ PASS: All skills with external_content have valid sandbox markers');
  process.exit(0);
} else {
  console.error(`\n❌ FAIL: ${nonCompliant} skill(s) missing sandbox markers`);
  process.exit(1);
}
