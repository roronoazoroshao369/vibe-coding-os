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

/** Extract the "Overall: N/N gates passed" count from the Validation Gate section. */
function extractValidationGateCount(dashboardText) {
  const section = dashboardText.match(/(?:^|\n)## Validation Gate[\s\S]*?(?=\n## |$)/)?.[0] ?? '';
  const match = section.match(/Overall:\s*(\d+)\/(\d+)\s*gates passed/i);
  return match ? Number(match[2]) : null;
}

/** Extract Version Progress section and verify a version string appears in it. */
function versionProgressIncludes(dashboardText, version) {
  const section = dashboardText.match(/(?:^|\n)## Version Progress[\s\S]*?(?=\n## |$)/)?.[0] ?? '';
  return section.includes(version) || section.includes(`v${version}`);
}

/** Count the validation checks declared in scripts/validate-all.mjs. */
function countValidateAllChecks(validateAllText) {
  const checksBlock = validateAllText.match(/const checks = \[([\s\S]*?)\n\];/);
  if (!checksBlock) return null;
  const checkRows = checksBlock[1].match(/^\s*\[/gm);
  return checkRows ? checkRows.length : 0;
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

// ── Validation gate count check ────────────────────────────────────────────
const validateAllPath = join(ROOT, 'scripts', 'validate-all.mjs');
const validateAllText = await readFile(validateAllPath, 'utf8');
const actualGateCount = countValidateAllChecks(validateAllText);
const docGateCount = extractValidationGateCount(dashboardText);

if (actualGateCount === null) {
  console.log(`FAIL  Validation gate count: unable to parse validate-all.mjs checks array`);
  failures++;
} else if (docGateCount === null) {
  console.log(`FAIL  Validation gate count: unable to parse "Overall: N/N gates passed" from docs/DASHBOARD.md`);
  failures++;
} else {
  check('Validation gate count', actualGateCount, docGateCount);
}

// ── Latest version presence in Version Progress table ──────────────────────
if (versionProgressIncludes(dashboardText, pkg.version)) {
  console.log(`PASS  Version ${pkg.version} appears in Version Progress table`);
} else {
  console.log(`FAIL  Version ${pkg.version} not found in Version Progress table`);
  failures++;
}

console.log('');

if (failures > 0) {
  console.log(`RESULT: FAIL — ${failures} mismatch(es). Run \`npm run dashboard:generate\` to re-sync.`);
  process.exit(1);
} else {
  console.log('RESULT: PASS — docs/DASHBOARD.md is in sync with live data.');
}
