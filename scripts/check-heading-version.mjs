#!/usr/bin/env node
// check-heading-version.mjs — Ensure README "What's new in vX.Y" heading aligns with package.json version.
//
// Rules:
//   - Reads version from package.json
//   - Reads "What's new in vX.Y" heading from README.md
//   - Major version must match
//   - Minor version may differ (e.g. heading can lag during a release cycle)
//   - Exit 0 on match, 1 on mismatch or missing heading

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function main() {
  const pkg = readJson(resolve(ROOT, 'package.json'));
  const pkgVersion = pkg.version;
  if (!pkgVersion) {
    console.error('ERROR: "version" field missing in package.json');
    process.exit(1);
  }

  const [pkgMajor] = pkgVersion.split('.').map(Number);

  const readme = readFileSync(resolve(ROOT, 'README.md'), 'utf8');

  // Match heading like: ## What's new in v1.1  or  ## What's new in v1.1.0
  const headingMatch = readme.match(/##\s+What's new in v(\d+\.\d+(?:\.\d+)?)/i);
  if (!headingMatch) {
    console.error('ERROR: No "What\'s new in vX.Y" heading found in README.md');
    process.exit(1);
  }

  const headingVersion = headingMatch[1];
  const headingParts = headingVersion.split('.').map(Number);
  const headingMajor = headingParts[0];

  console.log(`package.json version : ${pkgVersion}`);
  console.log(`README heading version: v${headingVersion}`);

  if (pkgMajor !== headingMajor) {
    console.error(`FAIL: Major version mismatch — package.json is v${pkgMajor}.x, heading is v${headingMajor}.x`);
    process.exit(1);
  }

  console.log(`OK: Major version ${pkgMajor} matches.`);
  process.exit(0);
}

main();
