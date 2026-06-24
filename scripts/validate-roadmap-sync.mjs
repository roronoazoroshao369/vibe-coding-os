#!/usr/bin/env node
// validate-roadmap-sync.mjs — keep active roadmap/status surfaces aligned.
//
// This gate prevents old roadmap plans from remaining in the active docs tree and
// fails when ROADMAP.md and docs/ROADMAP-STATUS.md disagree on the active roadmap.

import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

let failures = 0;

function fail(message) {
  console.error(`❌ ${message}`);
  failures++;
}

function pass(message) {
  console.log(`✅ ${message}`);
}

async function read(relPath) {
  return readFile(join(ROOT, relPath), 'utf8');
}

async function listMarkdown(relDir) {
  const dir = join(ROOT, relDir);
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => `${relDir}/${entry.name}`.split('\\').join('/'))
    .sort();
}

function extractSection(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return null;

  const sectionLines = [];
  for (let i = start + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('## ')) break;
    sectionLines.push(lines[i]);
  }

  return sectionLines.join('\n').trim();
}

function extractTableRows(section) {
  if (!section) return [];
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !/^\|\s*-+/.test(line))
    .filter((line) => !/^\|\s*Priority\s*\|/i.test(line))
    .map((line) => line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 4);
}

function rowKey(row) {
  return row.slice(0, 4).join(' | ');
}

function compareActiveRoadmap(roadmapText, statusText) {
  const roadmapRows = extractTableRows(extractSection(roadmapText, 'Active roadmap')).map(rowKey);
  const statusRows = extractTableRows(extractSection(statusText, 'Active roadmap')).map(rowKey);

  if (roadmapRows.length === 0) {
    fail('ROADMAP.md: unable to parse Active roadmap table');
    return;
  }
  if (statusRows.length === 0) {
    fail('docs/ROADMAP-STATUS.md: unable to parse Active roadmap table');
    return;
  }

  const roadmapSet = new Set(roadmapRows);
  const statusSet = new Set(statusRows);

  for (const row of roadmapRows) {
    if (!statusSet.has(row)) fail(`ROADMAP.md active row missing/different in ROADMAP-STATUS: ${row}`);
  }
  for (const row of statusRows) {
    if (!roadmapSet.has(row)) fail(`ROADMAP-STATUS active row missing/different in ROADMAP.md: ${row}`);
  }

  if (roadmapRows.length === statusRows.length && failures === 0) {
    pass(`Active roadmap tables match (${roadmapRows.length} rows)`);
  }
}

async function validateHistoricalPlacement() {
  const rootRoadmaps = await listMarkdown('docs');
  const activeRootRoadmaps = rootRoadmaps.filter((file) => /^docs\/v\d+\.\d+-roadmap\.md$/.test(file));
  if (activeRootRoadmaps.length > 0) {
    fail(`Historical version roadmaps must live under docs/archive/roadmaps/: ${activeRootRoadmaps.join(', ')}`);
  } else {
    pass('No version-specific roadmap files remain in docs/ root');
  }

  const activePlanAllowlist = new Set([
    'docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md',
    'docs/plans/example-plan.md'
  ]);
  const planFiles = await listMarkdown('docs/plans');
  const strayPlans = planFiles.filter((file) => !activePlanAllowlist.has(file));
  if (strayPlans.length > 0) {
    fail(`Historical/superseded plans must live under docs/plans/historical/: ${strayPlans.join(', ')}`);
  } else {
    pass('Only current/allowed plans remain in docs/plans root');
  }

  if (existsSync(join(ROOT, 'docs', 'archive', 'roadmaps'))) {
    pass('Historical roadmap archive exists at docs/archive/roadmaps/');
  } else {
    fail('Missing docs/archive/roadmaps/ historical roadmap archive');
  }

  if (existsSync(join(ROOT, 'docs', 'plans', 'historical'))) {
    pass('Historical plan archive exists at docs/plans/historical/');
  } else {
    fail('Missing docs/plans/historical/ historical plan archive');
  }
}

console.log('=== Roadmap Sync Validation ===');

const roadmapText = await read('ROADMAP.md');
const statusText = await read('docs/ROADMAP-STATUS.md');
compareActiveRoadmap(roadmapText, statusText);
await validateHistoricalPlacement();

console.log('');
if (failures > 0) {
  console.error(`RESULT: FAIL — ${failures} roadmap sync issue(s).`);
  process.exit(1);
}

console.log('RESULT: PASS — active roadmap/status docs are synced and historical plans are archived.');
