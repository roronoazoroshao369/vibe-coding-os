#!/usr/bin/env node
// tests/hooks/posttool-redactor-wiring.test.mjs
//
// v2.15.0 — Wave A Deliverable 1: Asserts post-tool-use-secret-scan catches what v2.14.0 redactor catches.

import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { redact } from '../../security/redact/redactor.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK = resolve(__dirname, '../../.claude/hooks/post-tool-use-secret-scan.mjs');

const TEST_CASES = [
  // (name, content, expectedPatternId)
  { name: 'AWS key',          content: ['AKIA', '12', '34', '56', '78', 'CDEF'].join(''), expected: 'aws-access-key' },
  { name: 'GitHub PAT new',   content: 'github_pat_' + 'A'.repeat(60), expected: 'github-pat-new' },
  { name: 'OpenAI key',       content: 'sk-' + 'A'.repeat(30), expected: 'openai-key' },
  { name: 'Anthropic key',    content: 'sk-ant-' + 'A'.repeat(30), expected: 'anthropic-key' },
  { name: 'Stripe live key',  content: 'sk_live_' + 'A'.repeat(30), expected: 'stripe-live' },
  { name: 'JWT token',        content: 'eyJ' + 'A'.repeat(20) + '.' + 'B'.repeat(20) + '.' + 'C'.repeat(20), expected: 'jwt' },
  { name: 'Google API key',   content: 'AIza' + 'A'.repeat(35), expected: 'google-api-key' },
  { name: 'Slack webhook',    content: ['https://', 'hooks.', 'slack.', 'com', '/services/T0/B0/'].join('') + 'A'.repeat(20), expected: 'slack-webhook' },
  { name: 'npm token',        content: 'npm_' + 'A'.repeat(40), expected: 'npm-token' },
  { name: 'PEM private key',  content: '-----BEGIN RSA PRIVATE KEY-----', expected: 'pem-private' },
];

let pass = 0;
let fail = 0;

for (const tc of TEST_CASES) {
  // First: redactor should catch it
  const redactorResult = redact(tc.content, { mode: 'postTool' });
  const redactorCaught = redactorResult.findings.some(f => f.pattern === tc.expected);

  // Second: hook should catch it
  const hookInput = JSON.stringify({ tool_name: 'Edit', tool_input: { content: tc.content } });
  const hookResult = spawnSync('node', [HOOK], { input: hookInput, encoding: 'utf8' });
  let hookCaught = false;
  try {
    const out = JSON.parse(hookResult.stdout);
    hookCaught = (out.warnings || []).length > 0;
  } catch { /* intentionally empty */ }

  const bothCaught = redactorCaught && hookCaught;
  const status = bothCaught ? '✅' : (redactorCaught !== hookCaught ? '❌' : '⚠️');
  if (bothCaught) pass++; else fail++;

  console.log(`  ${status} ${tc.name}: redactor=${redactorCaught}, hook=${hookCaught}`);
}

console.log(`\nTotal: ${pass} pass, ${fail} fail`);
if (fail > 0) {
  console.error('\nFATAL: hook is out of sync with redactor. Refactor needed.');
  process.exit(1);
}
process.exit(0);
