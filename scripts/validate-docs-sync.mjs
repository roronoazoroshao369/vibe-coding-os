#!/usr/bin/env node
// validate-docs-sync.mjs — fail when release-facing docs drift from repo metadata.

import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRepoMetadata } from './repo-metadata.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const metadata = await getRepoMetadata();
const { version } = metadata;
const { skills, commands, templates, validationGates } = metadata.counts;

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

function requireContains(relPath, text, needle, label) {
  if (text.includes(needle)) pass(`${relPath}: ${label}`);
  else fail(`${relPath}: missing ${label} (${needle})`);
}

function extractDashboardCell(dashboardText, metricName) {
  const rowRe = new RegExp(`^\\| ${metricName} \\|\\s*(.+?)\\s*\\|`, 'm');
  const match = dashboardText.match(rowRe);
  return match ? match[1].trim() : null;
}

function extractDashboardGateCount(dashboardText) {
  const match = dashboardText.match(/Overall:\s*(\d+)\/(\d+)\s*gates passed/i);
  return match ? Number(match[2]) : null;
}

console.log('=== Docs Sync Validation ===');
console.log(`Source: repo-metadata.mjs -> package.json + active manifests`);
console.log(`Expected: v${version}, ${skills} skills, ${commands} commands, ${templates} templates, ${validationGates}/${validationGates} gates`);
console.log('');

const readme = await read('README.md');
requireContains('README.md', readme, `v${version}`, 'current version');
requireContains('README.md', readme, `${validationGates}/${validationGates} gates`, 'gate count');
requireContains('README.md', readme, `${skills} skills`, 'skill count');
requireContains('README.md', readme, `${commands} commands`, 'command count');
requireContains('README.md', readme, `${templates} templates`, 'template count');

const readmeVi = await read('README.vi.md');
requireContains('README.vi.md', readmeVi, `v${version}`, 'current version');
requireContains('README.vi.md', readmeVi, `${validationGates}/${validationGates} gates`, 'gate count');
requireContains('README.vi.md', readmeVi, `${skills} skills`, 'skill count');
requireContains('README.vi.md', readmeVi, `${commands} commands`, 'command count');
requireContains('README.vi.md', readmeVi, `${templates} templates`, 'template count');

const roadmap = await read('ROADMAP.md');
requireContains('ROADMAP.md', roadmap, `v${version}`, 'current version');
requireContains('ROADMAP.md', roadmap, 'docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md', 'canonical long-term plan link');

const roadmapStatus = await read('docs/ROADMAP-STATUS.md');
requireContains('docs/ROADMAP-STATUS.md', roadmapStatus, `v${version}`, 'current version');
requireContains('docs/ROADMAP-STATUS.md', roadmapStatus, `${validationGates}/${validationGates} gates`, 'gate count');
requireContains('docs/ROADMAP-STATUS.md', roadmapStatus, `${skills} skills`, 'skill count');
requireContains('docs/ROADMAP-STATUS.md', roadmapStatus, `${commands} commands`, 'command count');
requireContains('docs/ROADMAP-STATUS.md', roadmapStatus, `${templates} templates`, 'template count');

const dashboard = await read('docs/DASHBOARD.md');
const dashboardChecks = [
  ['Version', version],
  ['Skills', String(skills)],
  ['Commands', String(commands)],
  ['Templates', String(templates)]
];
for (const [metric, expected] of dashboardChecks) {
  const actual = extractDashboardCell(dashboard, metric);
  if (actual === expected) pass(`docs/DASHBOARD.md: ${metric} = ${expected}`);
  else fail(`docs/DASHBOARD.md: ${metric} expected ${expected}, found ${actual ?? 'missing'}`);
}
const dashboardGateCount = extractDashboardGateCount(dashboard);
if (dashboardGateCount === validationGates) pass(`docs/DASHBOARD.md: validation gate count = ${validationGates}`);
else fail(`docs/DASHBOARD.md: validation gate count expected ${validationGates}, found ${dashboardGateCount ?? 'missing'}`);
requireContains('docs/DASHBOARD.md', dashboard, `v${version}`, 'Version Progress entry');

const commandManifest = metadata.manifests.commands;
if (commandManifest.manifestCount === commandManifest.listCount) {
  pass(`commands/manifest.json: count matches command list (${commandManifest.listCount})`);
} else {
  fail(`commands/manifest.json: count ${commandManifest.manifestCount} does not match command list ${commandManifest.listCount}`);
}
if (commandManifest.count === commands) {
  pass(`commands/manifest.json: active headline count = ${commands}`);
} else {
  fail(`commands/manifest.json: active headline count expected ${commands}, found ${commandManifest.count}`);
}
if (commandManifest.releaseVersion === version) {
  pass(`commands/manifest.json: releaseVersion = ${version}`);
} else {
  fail(`commands/manifest.json: releaseVersion expected ${version}, found ${commandManifest.releaseVersion ?? 'missing'}`);
}

console.log('');
if (failures > 0) {
  console.error(`RESULT: FAIL — ${failures} docs/source-of-truth mismatch(es).`);
  process.exit(1);
}

console.log('RESULT: PASS — release-facing docs match repo metadata.');
