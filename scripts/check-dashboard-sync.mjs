#!/usr/bin/env node
// check-dashboard-sync.mjs — verify docs/DASHBOARD.md matches repo metadata.

import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDashboardSummary } from './dashboard-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function extractTableCell(dashboardText, metricName) {
  const rowRe = new RegExp(`^\\| ${metricName} \\|\\s*(.+?)\\s*\\|`, 'm');
  const match = dashboardText.match(rowRe);
  return match ? match[1].trim() : null;
}

function extractOrphanCount(dashboardText, orphanLabel) {
  const rowRe = new RegExp(`^\\| ${orphanLabel} \\|\\s*(\\d+)`, 'm');
  const match = dashboardText.match(rowRe);
  return match ? Number(match[1]) : null;
}

function extractValidationGateCount(dashboardText) {
  const section = dashboardText.match(/(?:^|\n)## Validation Gate[\s\S]*?(?=\n## |$)/)?.[0] ?? '';
  const match = section.match(/Overall:\s*(\d+)\/(\d+)\s*gates passed/i);
  return match ? Number(match[2]) : null;
}

function versionProgressIncludes(dashboardText, version) {
  const section = dashboardText.match(/(?:^|\n)## Version Progress[\s\S]*?(?=\n## |$)/)?.[0] ?? '';
  return section.includes(version) || section.includes(`v${version}`);
}

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

const live = await getDashboardSummary();
const dashboardText = await readFile(join(ROOT, 'docs', 'DASHBOARD.md'), 'utf8');

console.log('=== Dashboard Sync Check ===');
console.log('Source: scripts/repo-metadata.mjs via scripts/dashboard-data.mjs');
console.log('');

check('Version', live.version, extractTableCell(dashboardText, 'Version'));
check('Skills', live.counts.skills, Number(extractTableCell(dashboardText, 'Skills')));
check('Commands', live.counts.commands, Number(extractTableCell(dashboardText, 'Commands')));
check('Templates', live.counts.templates, Number(extractTableCell(dashboardText, 'Templates')));
check('Upstream sources', live.counts.upstreamSources, Number(extractTableCell(dashboardText, 'Upstream sources')));
check('Validation gate count', live.counts.validationGates, extractValidationGateCount(dashboardText));

if (live.traceability.orphanCommands !== null) {
  check('Orphan commands', live.traceability.orphanCommands, extractOrphanCount(dashboardText, 'Orphan commands'));
}
if (live.traceability.orphanSkills !== null) {
  check('Orphan skills', live.traceability.orphanSkills, extractOrphanCount(dashboardText, 'Orphan skills'));
}
if (live.traceability.orphanTemplates !== null) {
  check('Orphan templates', live.traceability.orphanTemplates, extractOrphanCount(dashboardText, 'Orphan templates'));
}

if (versionProgressIncludes(dashboardText, live.version)) {
  console.log(`PASS  Version ${live.version} appears in Version Progress table`);
} else {
  console.log(`FAIL  Version ${live.version} not found in Version Progress table`);
  failures++;
}

console.log('');
if (failures > 0) {
  console.log(`RESULT: FAIL — ${failures} mismatch(es). Run \`npm run dashboard:generate\` after updating metadata.`);
  process.exit(1);
}

console.log('RESULT: PASS — docs/DASHBOARD.md is in sync with repo metadata.');
