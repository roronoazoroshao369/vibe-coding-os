#!/usr/bin/env node
// scripts/validate-runtime-freeze.mjs
//
// ADR-0002 runtime-scope-freeze gate. Verifies that:
//  1. registry/runtime-freeze-allowlist.json has an `adr` field pointing to an
//     existing docs/adr/N-*.md file.
//  2. The runtime/ directory structure does not contain new top-level dirs that
//     are not on the allowlist.
//  3. The package.json scripts do not introduce new `runtime:*` commands not on
//     the allowlist.
//
// Exits 0 on success, 1 on any violation. Run as part of `npm run validate:all`.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ALLOWLIST_PATH = 'registry/runtime-freeze-allowlist.json';
const RUNTIME_DIR = 'runtime';
const PACKAGE_JSON = 'package.json';
const ADR_DIR = 'docs/adr';

function loadJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

function fail(msg) {
  errors.push(msg);
}

// 1. Allowlist has ADR field pointing to an existing file
if (!existsSync(ALLOWLIST_PATH)) {
  console.error(`[validate-runtime-freeze] FATAL: ${ALLOWLIST_PATH} not found`);
  process.exit(1);
}
const allowlist = loadJson(ALLOWLIST_PATH);
const errors = [];

if (!allowlist.adr) {
  fail(`${ALLOWLIST_PATH} missing 'adr' field — every allowlist must cite an ADR per Engineering Council G3`);
} else {
  const adrPath = allowlist.adr;
  if (!existsSync(adrPath)) {
    fail(`allowlist.adr points to ${adrPath} which does not exist`);
  } else {
    // Check the ADR file mentions the freeze policy
    const adrContent = readFileSync(adrPath, 'utf8');
    if (!/freeze/i.test(adrContent) || !/runtime/i.test(adrContent)) {
      fail(`allowlist.adr (${adrPath}) does not appear to address runtime freeze policy`);
    }
  }
}

// 2. runtime/ directory structure check
if (existsSync(RUNTIME_DIR)) {
  const actualDirs = readdirSync(RUNTIME_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);
  const allowedDirs = allowlist.allowedRuntimeTopLevelDirs || [];

  const violations = actualDirs.filter(d => !allowedDirs.includes(d));
  if (violations.length > 0) {
    fail(`runtime/ has new top-level directories not on ADR-0002 allowlist: ${violations.join(', ')}`);
    fail(`Fix: either (a) add to allowedRuntimeTopLevelDirs in ${ALLOWLIST_PATH}, or (b) move logic to portable core (skills/commands/templates)`);
  }
}

// 3. package.json scripts check
if (existsSync(PACKAGE_JSON)) {
  const pkg = loadJson(PACKAGE_JSON);
  const scripts = Object.keys(pkg.scripts || {});
  const runtimeScripts = scripts.filter(s => s.startsWith('runtime:'));
  const allowedPkgScripts = allowlist.allowedPackageScripts || [];

  const violations = runtimeScripts.filter(s => !allowedPkgScripts.includes(s));
  if (violations.length > 0) {
    fail(`package.json introduces new runtime:* scripts not on ADR-0002 allowlist: ${violations.join(', ')}`);
  }
}

// Report
if (errors.length > 0) {
  console.error(`[validate-runtime-freeze] FAILED: ${errors.length} violation(s):`);
  for (const e of errors) console.error(`  ❌ ${e}`);
  console.error('\n[validate-runtime-freeze] Policy: ADR 0002 freezes runtime scope. New runtime surface requires an ADR exception filed at docs/adr/.');
  process.exit(1);
}

console.log(`[validate-runtime-freeze] PASSED: ADR-0002 runtime-freeze policy upheld`);
console.log(`  - ADR reference: ${allowlist.adr}`);
console.log(`  - Allowed runtime dirs: ${(allowlist.allowedRuntimeTopLevelDirs || []).length}`);
console.log(`  - Allowed runtime scripts: ${(allowlist.allowedRuntimeScripts || []).length}`);
console.log(`  - Allowed package.json runtime:* scripts: ${(allowlist.allowedPackageScripts || []).length}`);
process.exit(0);
