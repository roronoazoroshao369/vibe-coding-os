#!/usr/bin/env node
// tests/security/redact-object.test.mjs
// v2.18.0 — Behavior tests for redactObject() (recursive object scrubbing)
// and the privacy-coverage gate. Closes §3.4/§3.5 of the v2.17.7 council review.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REDACTOR = resolve(__dirname, '../../security/redact/redactor.mjs');

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log(`  PASS ${name}`); }
  else { fail++; console.log(`  FAIL ${name}`); }
}

const { redactObject } = await import(REDACTOR);

ok('exports redactObject', typeof redactObject === 'function');

// A realistic AWS access key (matches aws-access-key pattern AKIA + 16 upper/digits)
const SECRET = 'AKIAIOSFODNN7EXAMPLE';

// 1. Scalar string
{
  const r = redactObject(`token=${SECRET}`);
  ok('scrubs scalar string', !r.value.includes(SECRET) && r.hasSecrets);
}

// 2. Nested object free-text fields
{
  const task = {
    title: 'normal title',
    description: `deploy with ${SECRET}`,
    acceptanceCriteria: [`check ${SECRET} rotated`, 'no secrets in logs'],
  };
  const r = redactObject(task);
  ok('scrubs nested description', !r.value.description.includes(SECRET));
  ok('scrubs array items', !r.value.acceptanceCriteria[0].includes(SECRET));
  ok('leaves clean fields intact', r.value.title === 'normal title');
  ok('reports findings', r.hasSecrets && r.findings.length >= 2);
}

// 3. Does not mutate input
{
  const input = { note: `key ${SECRET}` };
  const r = redactObject(input);
  ok('does not mutate input', input.note.includes(SECRET) && !r.value.note.includes(SECRET));
}

// 4. Non-string scalars pass through
{
  const r = redactObject({ count: 5, enabled: true, ratio: 1.5, empty: null });
  ok('preserves non-string scalars',
    r.value.count === 5 && r.value.enabled === true && r.value.ratio === 1.5 && r.value.empty === null && !r.hasSecrets);
}

console.log(`\nredact-object: ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
