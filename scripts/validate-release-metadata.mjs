#!/usr/bin/env node
// validate-release-metadata.mjs — ensure release-facing docs match package.json version

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function readText(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), 'utf8');
}

const pkg = JSON.parse(readText('package.json'));
const version = pkg.version;
const expectedVersion = `v${version}`;
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const readme = readText('README.md');
const readmeVi = readText('README.vi.md');
const dashboard = readText('docs/DASHBOARD.md');
const viStrategyRoadmap = readText('docs/vi/strategy-and-roadmap.md');

check(
  readme.includes(`Current release (${expectedVersion})`),
  `README.md current release banner does not match package.json version ${expectedVersion}`
);
check(
  !/Current release \(v0\.4\.0\)|Next: v1\.0 RC/.test(readme),
  'README.md contains stale current-release v0.4.0 or v1.0 RC messaging'
);
check(
  !readme.includes('41 templates'),
  'README.md contains stale template count "41 templates"'
);
check(
  !readme.includes('v0.4.0'),
  'README.md contains stale v0.4.0 current-version messaging'
);
check(
  /Current release \([^)]*\):[^\n]*(16\/16)[^\n]*(gates?)/i.test(readme),
  'README.md release banner does not include "16/16" gates status'
);
check(
  readmeVi.includes(`Bản phát hành hiện tại (${expectedVersion})`),
  `README.vi.md current release banner does not match package.json version ${expectedVersion}`
);
check(
  !/Bản phát hành hiện tại \(v0\.4\.0\)|Tiếp theo: v1\.0 RC/.test(readmeVi),
  'README.vi.md contains stale current-release v0.4.0 or v1.0 RC messaging'
);
check(
  !readmeVi.includes('41 template'),
  'README.vi.md contains stale template count "41 template"'
);
check(
  !readmeVi.includes('v0.4.0'),
  'README.vi.md contains stale v0.4.0 current-version messaging'
);
check(
  new RegExp(`\\| Version \\| ${version.replace(/\./g, '\\.')} \\|`).test(dashboard),
  `docs/DASHBOARD.md version row does not match package.json version ${version}`
);
check(
  !/\| Version \| 0\.4\.0 \||v0\.4\.0|v1\.0 RC|Final release pending signoff/.test(dashboard),
  'docs/DASHBOARD.md contains stale release/version messaging'
);
check(
  /## Validation Gate[\s\S]*16\/16/.test(dashboard),
  'docs/DASHBOARD.md validation section does not contain "16/16" gates status'
);
check(
  !viStrategyRoadmap.includes('framework v0.4.0'),
  'docs/vi/strategy-and-roadmap.md contains stale "framework v0.4.0" wording'
);
check(
  viStrategyRoadmap.includes('v1.1'),
  'docs/vi/strategy-and-roadmap.md does not mention v1.1 current release/status'
);

if (failures.length > 0) {
  console.error('❌ Release metadata validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`✅ Release metadata matches package.json version ${version}`);
