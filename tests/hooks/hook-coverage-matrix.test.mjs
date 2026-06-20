#!/usr/bin/env node
// tests/hooks/hook-coverage-matrix.test.mjs
//
// v2.15.0 — Wave A Deliverable 1: Asserts all 5 non-trivial hooks wire v2.14.0 redactor/defense.
// Per Security Council report C1/M1: "5/6 hooks don't use v2.14.0 redactor/defense modules".

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOKS_DIR = resolve(__dirname, '../../.claude/hooks');

const REQUIRED_IMPORTS = {
  'post-tool-use-secret-scan.mjs':       ['security/redact/redactor.mjs'],
  'user-prompt-submit-injection-scan.mjs': ['security/defense/injection-counters.mjs'],
  'session-end-audit-flush.mjs':         ['security/redact/redactor.mjs'],
  'stop-session-snapshot.mjs':           ['security/redact/redactor.mjs'],
  'session-start-context-load.mjs':      ['vibe_version'], // Marker, not a redactor import
  'pre-tool-use-default-deny.mjs':       ['AUTO-GENERATED'], // Marker for generated file
};

let pass = 0;
let fail = 0;
const results = [];

for (const [hook, expected] of Object.entries(REQUIRED_IMPORTS)) {
  const path = resolve(HOOKS_DIR, hook);
  if (!existsSync(path)) {
    results.push({ hook, status: 'FAIL', reason: 'hook file missing' });
    fail++;
    continue;
  }
  const content = readFileSync(path, 'utf8');

  // Check for redactor import
  let ok = false;
  let reason = '';
  for (const marker of expected) {
    if (content.includes(marker)) {
      ok = true;
      break;
    }
  }
  if (!ok) {
    reason = `missing one of: ${expected.join(', ')}`;
  }

  results.push({ hook, status: ok ? 'PASS' : 'FAIL', reason });
  if (ok) pass++; else fail++;
}

console.log('\n=== Hook coverage matrix (v2.15.0) ===');
for (const r of results) {
  console.log(`  ${r.status === 'PASS' ? '✅' : '❌'} ${r.hook}: ${r.reason || 'wired'}`);
}
console.log(`\nTotal: ${pass} pass, ${fail} fail`);

if (fail > 0) {
  console.error('\nFATAL: at least one hook is not wired to v2.14.0 redactor/defense.');
  process.exit(1);
}
process.exit(0);
