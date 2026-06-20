#!/usr/bin/env node
// scripts/validate-licenses.mjs
//
// License-policy enforcement gate. Fails CI if any source in registry/sources.json
// has a non-permissive license with import_mode=inspiration/adapted.
//
// Permissive licenses accepted: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0.
// Non-permissive (rejected unless vendorable=yes): MIT+Commons-Clause, MIT-declared-incomplete, GPL, AGPL, LGPL, SSPL, BUSL, UNLICENSED.

import { readFileSync, existsSync } from 'node:fs';

const PERMISSIVE_LICENSES = new Set([
  'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0',
  'CC0-1.0', 'Unlicense', 'CC-BY-4.0'
]);

const NON_PERMISSIVE_PATTERNS = [
  'Commons-Clause', 'GPL', 'AGPL', 'LGPL', 'SSPL', 'BUSL',
  'UNLICENSED', '-incomplete', '-declared', 'unverifiable', 'unknown'
];

const REQUIRED_IMPORT_MODES = ['inspiration', 'adapted', 'vendorable-yes'];

const SOURCES_PATH = 'registry/sources.json';

if (!existsSync(SOURCES_PATH)) {
  console.error(`[validate-licenses] FATAL: ${SOURCES_PATH} not found`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(SOURCES_PATH, 'utf8'));
const sources = data.sources || [];

const errors = [];
const warnings = [];

for (const s of sources) {
  const license = s.license || 'unknown';
  const importMode = s.import_mode || 'unknown';
  const name = s.name || '(unnamed)';

  // Check if license is non-permissive
  const isNonPermissive = NON_PERMISSIVE_PATTERNS.some(p => license.includes(p));
  const isPermissive = PERMISSIVE_LICENSES.has(license);

  // Flag mismatches
  if (isNonPermissive && REQUIRED_IMPORT_MODES.includes(importMode)) {
    errors.push({
      source: name,
      license,
      import_mode: importMode,
      issue: 'non-permissive license with adaptation-mode import',
      fix: 'either change import_mode to "tracked_inspiration" (no closer adaptation) or set status="rejected"'
    });
  }

  if (!isPermissive && !isNonPermissive) {
    warnings.push({
      source: name,
      license,
      note: 'license not in permissive set; manual review recommended'
    });
  }

  // Require notes field for non-permissive
  if (isNonPermissive && (!s.notes || s.notes.length < 30)) {
    errors.push({
      source: name,
      issue: 'non-permissive license without sufficient notes field (must explain what is/is not vendored)'
    });
  }

  // Require notes field for inspiration/adapted
  if ((importMode === 'inspiration' || importMode === 'adapted') && (!s.notes || s.notes.length < 30)) {
    errors.push({
      source: name,
      issue: `import_mode=${importMode} without notes field (must explain what is/is not vendored)`
    });
  }
}

console.log(`[validate-licenses] Scanned ${sources.length} sources`);
console.log(`[validate-licenses] Permissive: ${sources.filter(s => PERMISSIVE_LICENSES.has(s.license)).length}`);
console.log(`[validate-licenses] Non-permissive: ${sources.filter(s => NON_PERMISSIVE_PATTERNS.some(p => (s.license || '').includes(p))).length}`);

if (warnings.length > 0) {
  console.log(`\n[validate-licenses] Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.log(`  ⚠️  ${w.source} [${w.license}]: ${w.note}`);
  }
}

if (errors.length > 0) {
  console.error(`\n[validate-licenses] FAILED: ${errors.length} license violation(s):`);
  for (const e of errors) {
    console.error(`  ❌ ${e.source || '(unnamed)'}: ${e.issue}`);
    if (e.license) console.error(`     license: ${e.license}`);
    if (e.import_mode) console.error(`     import_mode: ${e.import_mode}`);
    if (e.fix) console.error(`     fix: ${e.fix}`);
  }
  console.error('\n[validate-licenses] Policy: vibe-coding-os ships under MIT. Vendoring from non-permissive sources requires an explicit grant or a vendorable=yes opt-in.');
  process.exit(1);
}

console.log(`[validate-licenses] PASSED: all ${sources.length} sources comply with license policy`);
process.exit(0);
