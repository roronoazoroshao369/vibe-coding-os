#!/usr/bin/env node
// tests/security/trust-scorer.test.mjs
// v2.16.0 Wave B — Asserts Trust Scoring module behavior.

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCORER = resolve(__dirname, '../../security/defense/trust-scorer.mjs');

if (!existsSync(SCORER)) {
  console.error('trust-scorer.mjs missing');
  process.exit(1);
}

// Test 1: Module loads
try {
  const mod = await import(SCORER);
  let pass = 0, fail = 0;

  // Check required exports
  for (const fn of ['scoreSource', 'detectBypassLoop', 'classifyLicense']) {
    if (typeof mod[fn] === 'function') pass++;
    else { fail++; console.log(`  ❌ missing function: ${fn}`); }
  }

  // Check that scoreSource has trust classes built-in
  const result = mod.scoreSource('test content with https://example.com', 'any');
  if (result && result.trust_class && result.risk_score !== undefined) {
    pass++;
    console.log('  ✅ scoreSource returns {trust_class, risk_score}');
  } else {
    fail++;
    console.log('  ❌ scoreSource missing structure');
  }

  // Test requiresSandboxDeclaration
  if (typeof mod.requiresSandboxDeclaration === 'function') {
    const needs = mod.requiresSandboxDeclaration({ trust_class: 'isolated' });
    if (needs === true) pass++;
    else { fail++; console.log('  ❌ requiresSandboxDeclaration(isolated) should be true'); }
  }

  console.log(`\ntrust-scorer: ${pass} pass, ${fail} fail`);
  if (fail > 0) process.exit(1);
} catch (e) {
  console.error('Failed to load trust-scorer:', e.message);
  process.exit(1);
}
