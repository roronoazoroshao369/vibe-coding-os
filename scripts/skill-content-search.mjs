#!/usr/bin/env node
// scripts/skill-content-search.mjs
// Wave B1 Move 1 — Search across all SKILL.md files in the repo
// Returns matching skills with line numbers and content snippets.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { existsSync } from 'node:fs';

const ROOT = process.cwd();
const SCAN_DIRS = ['skills', 'commands', 'templates', 'docs'];
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS || '50', 10);
const CASE_INSENSITIVE = !process.argv.includes('--case-sensitive');
const REGEX_MODE = process.argv.includes('--regex');

function listFiles(dir, exts) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...listFiles(full, exts));
    } else if (exts.some(ext => entry.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function searchInFile(file, pattern) {
  const matches = [];
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch (e) {
    return matches;
  }
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const matchesLine = REGEX_MODE
      ? pattern.test(line)
      : (CASE_INSENSITIVE
          ? line.toLowerCase().includes(pattern.toLowerCase())
          : line.includes(pattern));
    if (matchesLine) {
      matches.push({
        file: relative(ROOT, file),
        line: idx + 1,
        text: line.trim().slice(0, 200)
      });
    }
  });
  return matches;
}

const pattern = process.argv[2];
if (!pattern) {
  console.error('Usage: node scripts/skill-content-search.mjs <pattern> [--regex] [--case-sensitive]');
  console.error('Env: MAX_RESULTS=50');
  process.exit(1);
}

const compiledPattern = REGEX_MODE ? new RegExp(pattern, 'gi') : pattern;

const allFiles = [];
for (const dir of SCAN_DIRS) {
  const exts = dir === 'skills' ? ['SKILL.md'] :
               dir === 'commands' ? ['.md'] :
               dir === 'templates' ? ['.md'] :
               ['.md', '.txt'];
  allFiles.push(...listFiles(join(ROOT, dir), exts));
}

const results = [];
for (const file of allFiles) {
  const fileMatches = searchInFile(file, REGEX_MODE ? compiledPattern : pattern);
  results.push(...fileMatches);
  if (results.length >= MAX_RESULTS) break;
}

console.log(`Search: "${pattern}" (${REGEX_MODE ? 'regex' : 'literal'}, ${CASE_INSENSITIVE ? 'case-insensitive' : 'case-sensitive'})`);
console.log(`Scanned: ${allFiles.length} files in ${SCAN_DIRS.join(', ')}/`);
console.log(`Matches: ${results.length}${results.length >= MAX_RESULTS ? ` (capped at MAX_RESULTS=${MAX_RESULTS})` : ''}\n`);

if (results.length === 0) {
  console.log('No matches found.');
  process.exit(0);
}

for (const r of results) {
  console.log(`  ${r.file}:${r.line}`);
  console.log(`    ${r.text}`);
}

process.exit(results.length > 0 ? 0 : 1);
