#!/usr/bin/env node
// smoke-test-adapters.mjs — Verify adapter files exist and are well-formed

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function readFile(rel) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

function check(name, condition, detail = '') {
  return { name, passed: !!condition, detail };
}

// ── Claude Code Adapter ──────────────────────────────────────────────
const claudeReadme = readFile('adapters/claude-code/README.md');
const claudeChecks = [
  check('File exists', !!claudeReadme),
  check('Has install/setup section', claudeReadme && /(?:^|\n)## .*(?:setup|install)/im.test(claudeReadme)),
  check('References CLAUDE.md', claudeReadme && /\bCLAUDE\.md\b/.test(claudeReadme)),
  check('References commands/ or skills/', claudeReadme && /\b(?:commands\/|skills\/)/.test(claudeReadme)),
];

// ── Codex Adapter ────────────────────────────────────────────────────
const codexReadme = readFile('adapters/codex/README.md');
const codexChecks = [
  check('File exists', !!codexReadme),
  check('Has install/setup section', codexReadme && /(?:^|\n)## .*(?:setup|install)/im.test(codexReadme)),
  check('References AGENTS.md', codexReadme && /\bAGENTS\.md\b/.test(codexReadme)),
  check('References commands/ or skills/', codexReadme && /\b(?:commands\/|skills\/)/.test(codexReadme)),
];

// ── Cursor Adapter ───────────────────────────────────────────────────
const cursorReadme = readFile('adapters/cursor/README.md');
const cursorChecks = [
  check('File exists', !!cursorReadme),
  check('Has install/setup section', cursorReadme && /(?:^|\n)## .*(?:setup|install)/im.test(cursorReadme)),
  check('References .cursorrules or rules', cursorReadme && /(?:\.cursorrules|\brules\b)/i.test(cursorReadme)),
  check('References commands/ or skills/', cursorReadme && /\b(?:commands\/|skills\/)/.test(cursorReadme)),
];

// ── Compatibility Matrix ─────────────────────────────────────────────
const matrix = readFile('adapters/compatibility-matrix.md');
const matrixChecks = [
  check('File exists', !!matrix),
  check('Entries for Claude Code, Codex, Cursor', matrix &&
    /\bClaude Code\b/.test(matrix) &&
    /\bCodex\b/.test(matrix) &&
    /\bCursor\b/.test(matrix)),
  check('Contains tool comparison table', matrix && /\| Tool \|/.test(matrix)),
];

// ── Report ───────────────────────────────────────────────────────────
const adapters = [
  { label: 'Claude Code adapter', checks: claudeChecks },
  { label: 'Codex adapter', checks: codexChecks },
  { label: 'Cursor adapter', checks: cursorChecks },
  { label: 'Compatibility matrix', checks: matrixChecks },
];

console.log('Adapter Smoke Tests');
console.log('===================');

let allPassed = true;

for (const { label, checks } of adapters) {
  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  const ok = passed === total;

  if (!ok) allPassed = false;

  const icon = ok ? '✅' : '❌';
  const status = ok ? 'OK' : 'FAILED';
  console.log(`${icon} ${label}: ${status} (${passed}/${total} checks passed)`);

  for (const c of checks) {
    if (!c.passed) {
      console.log(`   ✗ ${c.name}${c.detail ? ': ' + c.detail : ''}`);
    }
  }
}

const results = adapters.filter(a => a.checks.every(c => c.passed)).length;
console.log(`\nResults: ${results}/${adapters.length} adapters passed`);

process.exit(allPassed ? 0 : 1);
