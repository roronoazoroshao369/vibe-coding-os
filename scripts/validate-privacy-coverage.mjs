#!/usr/bin/env node
// scripts/validate-privacy-coverage.mjs
// Privacy coverage gate (v2.18.0).
//
// Ensures every runtime store that persists user-supplied free-text scrubs
// secrets via redactObject() before writing. Closes the "redaction applied
// inconsistently" finding from the v2.17.7 expert council review (§3.4).
//
// A store is "covered" if it imports redactObject from security/redact/redactor.mjs
// AND calls it. Stores listed in COVERED_STORES must satisfy both.
// Exit non-zero on any violation.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Stores that persist user free-text and MUST scrub secrets before writing.
const COVERED_STORES = [
  'runtime/tasks/task-store.mjs',
  'runtime/checkpoints/checkpoint-engine.mjs',
];

const IMPORT_RE = /import\s*\{[^}]*\bredactObject\b[^}]*\}\s*from\s*['"][^'"]*security\/redact\/redactor\.mjs['"]/;
const CALL_RE = /\bredactObject\s*\(/;

let failures = 0;
const results = [];

for (const rel of COVERED_STORES) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    results.push({ file: rel, status: 'FAIL', reason: 'file not found' });
    failures++;
    continue;
  }
  const src = readFileSync(abs, 'utf8');
  const hasImport = IMPORT_RE.test(src);
  const hasCall = CALL_RE.test(src);
  if (hasImport && hasCall) {
    results.push({ file: rel, status: 'PASS' });
  } else {
    const missing = [];
    if (!hasImport) missing.push('redactObject import');
    if (!hasCall) missing.push('redactObject() call');
    results.push({ file: rel, status: 'FAIL', reason: `missing ${missing.join(' + ')}` });
    failures++;
  }
}

const json = process.argv.includes('--json');
if (json) {
  console.log(JSON.stringify({ gate: 'privacy-coverage', failures, results }, null, 2));
} else {
  console.log('Privacy coverage gate');
  for (const r of results) {
    const icon = r.status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`  [${icon}] ${r.file}${r.reason ? ' — ' + r.reason : ''}`);
  }
  console.log(failures === 0
    ? `\nPASS — ${results.length}/${results.length} stores scrub secrets before write.`
    : `\nFAIL — ${failures} store(s) do not scrub secrets. Wire redactObject() before writing free-text.`);
}

process.exit(failures === 0 ? 0 : 1);
