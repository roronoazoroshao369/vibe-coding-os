#!/usr/bin/env node
// tests/commands/bypass-protocol.test.mjs
// v2.16.0 Wave B — Asserts vibe-bypass command and protocol skill are intact.

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

const checks = [
  ['commands/vibe-bypass.md', 'user-invocable bypass command'],
  ['skills/core/guard-bypass-protocol/SKILL.md', 'bypass protocol skill'],
  ['security/redact/redactor.mjs', 'redactor module'],
  ['security/defense/injection-counters.mjs', 'injection counters'],
  ['.claude/hooks/post-tool-use-secret-scan.mjs', 'secret scan hook'],
  ['.claude/hooks/user-prompt-submit-injection-scan.mjs', 'injection scan hook'],
];

let pass = 0, fail = 0;
for (const [path, desc] of checks) {
  const full = resolve(REPO, path);
  if (existsSync(full)) {
    pass++;
    console.log(`  ✅ ${desc}: ${path}`);
  } else {
    fail++;
    console.log(`  ❌ ${desc}: MISSING ${path}`);
  }
}

console.log(`\nbypass-protocol: ${pass} pass, ${fail} fail`);
if (fail > 0) process.exit(1);
