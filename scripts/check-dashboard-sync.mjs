#!/usr/bin/env node
// check-dashboard-sync.mjs — verify docs/DASHBOARD.md matches live dashboard data
// Uses only Node built-ins. Exits nonzero on any mismatch.

import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── helpers ──────────────────────────────────────────────────────────────────

/** Extract "| Metric | <value> |" from DASHBOARD.md and return value as string. */
function extractTableCell(dashboardText, metricName) {
  const rowRe = new RegExp(`^\\| ${metricName} \\|\\s*(.+?)\\s*\\|`, 'm');
  const match = dashboardText.match(rowRe);
  return match ? match[1].trim() : null;
}

/** Extract orphan rows from the Coverage Summary section (or Quick Status if not separate). */
function extractOrphanCount(dashboardText, orphanLabel) {
  // The orphans appear in the Coverage Summary section as "| Orphan <X> | <n> |"
  const rowRe = new RegExp(`^\\| ${orphanLabel} \\|\\s*(\\d+)`, 'm');
  const match = dashboardText.match(rowRe);
  return match ? Number(match[1]) : null;
}

// ── main ─────────────────────────────────────────────────────────────────────

let failures = 0;

function check(label, expected, actual) {
  if (actual === null) {
    console.log(`FAIL  ${label}: unable to parse from docs/DASHBOARD.md`);
    failures++;
    return;
  }
  if (expected === actual) {
    console.log(`PASS  ${label}: ${actual}`);
  } else {
    console.log(`FAIL  ${label}: expected ${expected}, found ${actual}`);
    failures++;
  }
}

// 1. Load live data via the dashboard-data module
const { getDashboardSummary } = await import(join(ROOT, 'scripts', 'dashboard-data.mjs'));
const live = await getDashboardSummary();

// 2. Load the committed DASHBOARD.md
const dashboardPath = join(ROOT, 'docs', 'DASHBOARD.md');
const dashboardText = await readFile(dashboardPath, 'utf8');

// 3. Load package.json for version
const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));

console.log('=== Dashboard Sync Check ===');
console.log('');

// Version (compare doc vs package.json)
const docVersion = extractTableCell(dashboardText, 'Version');
check('Version', pkg.version, docVersion);

// Counts
check('Skills', live.counts.skills, Number(extractTableCell(dashboardText, 'Skills')));
check('Commands', live.counts.commands, Number(extractTableCell(dashboardText, 'Commands')));
check('Templates', live.counts.templates, Number(extractTableCell(dashboardText, 'Templates')));
check('Narrative files', live.counts.narrativeFiles, Number(extractTableCell(dashboardText, 'Narrative files')));

// Orphans (from Coverage Summary section — only check if traceability produced numbers)
if (live.traceability.orphanCommands !== null) {
  check('Orphan commands', live.traceability.orphanCommands, extractOrphanCount(dashboardText, 'Orphan commands'));
}
if (live.traceability.orphanSkills !== null) {
  check('Orphan skills', live.traceability.orphanSkills, extractOrphanCount(dashboardText, 'Orphan skills'));
}
if (live.traceability.orphanTemplates !== null) {
  check('Orphan templates', live.traceability.orphanTemplates, extractOrphanCount(dashboardText, 'Orphan templates'));
}

console.log('');

if (failures > 0) {
  console.log(`RESULT: FAIL — ${failures} mismatch(es). Run \`npm run dashboard:generate\` to re-sync.`);
  process.exit(1);
} else {
  console.log('RESULT: PASS — docs/DASHBOARD.md is in sync with live data.');
}
