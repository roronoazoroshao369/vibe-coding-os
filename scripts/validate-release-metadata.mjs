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

function firstLines(relativePath, count) {
  return readText(relativePath).split(/\r?\n/).slice(0, count).join('\n');
}

const pkg = JSON.parse(readText('package.json'));
const version = pkg.version;
const expectedVersion = `v${version}`;
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const readmeHead = firstLines('README.md', 20);
const readmeViHead = firstLines('README.vi.md', 20);
const dashboard = readText('docs/DASHBOARD.md');

check(
  readmeHead.includes(`Current release (${expectedVersion})`),
  `README.md current release banner does not match package.json version ${expectedVersion}`
);
check(
  !/Current release \(v0\.4\.0\)|Next: v1\.0 RC/.test(readmeHead),
  'README.md current release banner contains stale v0.4.0 or v1.0 RC messaging'
);
check(
  readmeViHead.includes(`Bản phát hành hiện tại (${expectedVersion})`),
  `README.vi.md current release banner does not match package.json version ${expectedVersion}`
);
check(
  !/Bản phát hành hiện tại \(v0\.4\.0\)|Tiếp theo: v1\.0 RC/.test(readmeViHead),
  'README.vi.md current release banner contains stale v0.4.0 or v1.0 RC messaging'
);
check(
  new RegExp(`\\| Version \\| ${version.replace(/\./g, '\\.')} \\|`).test(dashboard),
  `docs/DASHBOARD.md version row does not match package.json version ${version}`
);
check(
  !/\| Version \| 0\.4\.0 \||v0\.4\.0|v1\.0 RC|Final release pending signoff/.test(dashboard),
  'docs/DASHBOARD.md contains stale release/version messaging'
);

if (failures.length > 0) {
  console.error('❌ Release metadata validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`✅ Release metadata matches package.json version ${version}`);
