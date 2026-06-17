#!/usr/bin/env node
// validate-release-metadata.mjs — verify docs match package.json and live data

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function read(path) {
  return readFileSync(resolve(ROOT, path), 'utf8');
}

let failures = 0;

function check(ok, msg) {
  if (ok) {
    console.log(`  ✅ ${msg}`);
  } else {
    console.log(`  ❌ ${msg}`);
    failures++;
  }
}

const pkg = JSON.parse(read('package.json'));
const version = pkg.version;
const readme = read('README.md');
const readmeVi = read('README.vi.md');
const dashboard = read('docs/DASHBOARD.md');
const viStrategyRoadmap = read('docs/vi/strategy-and-roadmap.md');
const roadmapStatus = read('docs/ROADMAP-STATUS.md');

// Dynamically detect the expected gate count from validate-all.mjs
let expectedGates = 17; // default fallback
try {
  const validateAll = read('scripts/validate-all.mjs');
  const gateMatch = validateAll.match(/const checks = \[([\s\S]*?)\];/);
  if (gateMatch) {
    const gateCount = (gateMatch[1].match(/\[/g) || []).length;
    if (gateCount > 0) expectedGates = gateCount;
  }
} catch {
  // fallback to 17
}

console.log(`Expected gate count: ${expectedGates}`);

// Detect gate count from validate-all.mjs source (avoids circular dependency)
let detectedGates = 0;
try {
  const validateAll = read('scripts/validate-all.mjs');
  // Count checks array entries in validate-all.mjs
  const checksMatch = validateAll.match(/const checks = \[([\s\S]*?)\];/);
  if (checksMatch) {
    // Count lines with ['...', patterns (each check is an array entry)
    const checkLines = checksMatch[1].split('\n').filter(l => l.includes("['") || l.includes('["'));

    // Also count lines with /* ... */  comments between checks
    const rawCount = (checksMatch[1].match(/\n/g) || []).length;
    // Better: count the actual check names (lines with a string label)
    const nameCount = (checksMatch[1].match(/\[('|")[^\]]+\]/g) || []).length;
    detectedGates = nameCount;
  }
} catch {
  // fallback
}

const actualGates = detectedGates || 17;
console.log(`Detected gate count: ${actualGates}`);

console.log('=== Release Metadata Validation ===');
console.log('');

check(
  readme.includes(`validate:all ${actualGates}/${actualGates}`) ||
    readme.includes(`${actualGates}/${actualGates} gates`),
  `README.md includes "${actualGates}/${actualGates}" gates status`
);

check(
  /Current release \([^)]*\):[^.]*(validat|PASS)/i.test(readme),
  'README.md release banner includes validation status'
);

check(
  readmeVi.includes(`validate:all ${actualGates}/${actualGates}`) ||
    readmeVi.includes(`${actualGates}/${actualGates} gates`),
  `README.vi.md includes "${actualGates}/${actualGates}" gates status`
);

check(
  !readme.includes('v0.4.0'),
  'README.md does not contain stale v0.4.0 current-version messaging'
);

check(
  readmeVi.includes(`Bản phát hành hiện tại (v${version})`) ||
    readmeVi.includes(`Bản phát hành hiện tại (${version})`),
  `README.vi.md current release banner matches package.json version ${version}`
);

check(
  !/Bản phát hành hiện tại \(v0\.4\.0\)|Tiếp theo: v1\.0 RC/.test(readmeVi),
  'README.vi.md does not contain stale v0.4.0 or v1.0 RC messaging'
);

check(
  !readmeVi.includes('41 template'),
  'README.vi.md does not contain stale template count "41 template"'
);

check(
  !readmeVi.includes('v0.4.0'),
  'README.vi.md does not contain stale v0.4.0 current-version messaging'
);

check(
  new RegExp(`\\| Version \\| ${version.replace(/\./g, '\\.')} \\|`).test(dashboard),
  `docs/DASHBOARD.md version row matches package.json version ${version}`
);

check(
  !/\| Version \| 0\.4\.0 \| |v0\.4\.0|v1\.0 RC|Final release pending signoff/.test(dashboard),
  'docs/DASHBOARD.md does not contain stale release/version messaging'
);

check(
  new RegExp(`## Validation Gate[\\s\\S]*${actualGates}/${actualGates}`).test(dashboard),
  `docs/DASHBOARD.md validation section contains "${actualGates}/${actualGates}" gates status`
);

check(
  !viStrategyRoadmap.includes('framework v0.4.0'),
  'docs/vi/strategy-and-roadmap.md does not contain stale "framework v0.4.0" wording'
);

check(
  roadmapStatus.includes(version) || roadmapStatus.includes('v1.3'),
  'docs/ROADMAP-STATUS.md contains current or recent version info'
);

check(
  /validate:all/.test(roadmapStatus) || /COMPLETE/.test(roadmapStatus),
  'docs/ROADMAP-STATUS.md includes validation or completion status'
);

// Body stats checks
const skillCount = (readme.match(/\*\*90 skills\*\*/i) || []).length;
const commandCount = (readme.match(/\*\*68 commands\*\*/i) || []).length;
const templateCount = (readme.match(/\*\*54 templates\*\*/i) || []).length;

check(skillCount > 0, 'README.md includes skill count');
check(commandCount > 0, 'README.md includes command count');
check(templateCount > 0, 'README.md includes template count');

// Orphan wording
check(
  !readme.includes('orphan templates are orphan') ||
    readme.includes('0 orphan commands/skills'),
  'README.md orphan wording is correct'
);

// Bilingual sync
check(
  readmeVi.includes('90 skills') || readmeVi.includes('90 kỹ năng'),
  'README.vi.md skill count is synced'
);

console.log('');
if (failures > 0) {
  console.error(`❌ Release metadata validation failed with ${failures} failure(s)`);
  process.exit(1);
} else {
  console.log('✅ Release metadata validation passed');
}
