#!/usr/bin/env node
// smoke-test-adapters.mjs — Verify adapter files exist and are well-formed

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function readFile(rel) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

function dirEntries(rel) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) return [];
  return readdirSync(p);
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
  check('Install snippet references existing CLAUDE.md', (() => {
    const m = claudeReadme && claudeReadme.match(/cp\s+(?:~\/)?vibe-coding-os\/CLAUDE\.md\s+[^\n]+/);
    return m && existsSync(resolve(ROOT, 'CLAUDE.md'));
  })()),
  check('Install snippet references existing commands/', claudeReadme && /\bcommands\//.test(claudeReadme)),
  check('Install snippet references existing skills/', claudeReadme && /\bskills\//.test(claudeReadme)),
];

// ── Codex Adapter ────────────────────────────────────────────────────
const codexReadme = readFile('adapters/codex/README.md');
const codexChecks = [
  check('File exists', !!codexReadme),
  check('Has install/setup section', codexReadme && /(?:^|\n)## .*(?:setup|install)/im.test(codexReadme)),
  check('References AGENTS.md', codexReadme && /\bAGENTS\.md\b/.test(codexReadme)),
  check('References commands/ or skills/', codexReadme && /\b(?:commands\/|skills\/)/.test(codexReadme)),
  check('Install snippet references existing AGENTS.md', (() => {
    const m = codexReadme && codexReadme.match(/cp\s+(?:~\/)?vibe-coding-os\/AGENTS\.md\s+[^\n]+/);
    return m && existsSync(resolve(ROOT, 'AGENTS.md'));
  })()),
];

// ── Cursor Adapter ───────────────────────────────────────────────────
const cursorReadme = readFile('adapters/cursor/README.md');
const cursorChecks = [
  check('File exists', !!cursorReadme),
  check('Has install/setup section', cursorReadme && /(?:^|\n)## .*(?:setup|install)/im.test(cursorReadme)),
  check('References .cursorrules or rules', cursorReadme && /(?:\.cursorrules|\brules\b)/i.test(cursorReadme)),
  check('References commands/ or skills/', cursorReadme && /\b(?:commands\/|skills\/)/.test(cursorReadme)),
  check('Install snippet references existing repo instruction files', (() => {
    const m = cursorReadme && cursorReadme.match(/cp\s+(?:~\/)?vibe-coding-os\/(?:CLAUDE|AGENTS)\.md\s+[^\n]+/);
    return m && (existsSync(resolve(ROOT, 'AGENTS.md')) || existsSync(resolve(ROOT, 'CLAUDE.md')));
  })()),
  check('Consistent install path pattern', cursorReadme && /(?:vibe-coding-os\/CLAUDE\.md|vibe-coding-os\/AGENTS\.md)/.test(cursorReadme)),
];

// ── Gemini Adapter ───────────────────────────────────────────────────
const geminiReadme = readFile('adapters/gemini/README.md');
const geminiChecks = [
  check('File exists', !!geminiReadme),
  check('Has install/setup section', geminiReadme && /(?:^|\n)## .*(?:setup|install)/im.test(geminiReadme)),
  check('References GEMINI.md or AGENTS.md', geminiReadme && /(?:GEMINI\.md|AGENTS\.md)/.test(geminiReadme)),
  check('References commands/ or skills/', geminiReadme && /\b(?:commands\/|skills\/)/.test(geminiReadme)),
  check('Install snippet references existing file', (() => {
    const m = geminiReadme && geminiReadme.match(/cp\s+(?:~\/)?vibe-coding-os\/(?:AGENTS|CLAUDE|GEMINI)\.md\s+[^\n]+/);
    return m && (existsSync(resolve(ROOT, 'AGENTS.md')) || existsSync(resolve(ROOT, 'CLAUDE.md')));
  })()),
  check('Consistent with Cursor adapter pattern', existsSync(resolve(ROOT, 'adapters/cursor/README.md'))),
  check('Has multi-agent notes or setup section', geminiReadme && /(?:multi-agent|workflow|guardrails)/i.test(geminiReadme)),
];

// ── Memory Adapters ──────────────────────────────────────────────────
const memoryDir = dirEntries('adapters/memory');
const memoryChecks = [
  check('Memory adapter directory exists', memoryDir.length > 0),
  check('Supermemory adapter plan exists', memoryDir.includes('supermemory-adapter-plan.md')),
  check('Local memory adapter exists', memoryDir.includes('local-memory-adapter.md')),
  check('README exists', memoryDir.includes('README.md')),
  check('Claude-mem adapter plan exists', memoryDir.includes('claude-mem-adapter-plan.md')),
];

// ── Compatibility Matrix ─────────────────────────────────────────────
const matrix = readFile('adapters/compatibility-matrix.md');
const matrixChecks = [
  check('File exists', !!matrix),
  check('Entries for Claude Code, Codex, Cursor, Gemini, Memory', matrix &&
    /\bClaude Code\b/.test(matrix) &&
    /\bCodex\b/.test(matrix) &&
    /\bCursor\b/.test(matrix) &&
    /\bGemini\b/.test(matrix) &&
    /\bMemory\b/.test(matrix)),
  check('Contains tool comparison table', matrix && /\| Tool \|/.test(matrix)),
  check('References validation command', matrix && /npm run validate/.test(matrix)),
];

// ── Report ───────────────────────────────────────────────────────────
const adapters = [
  { label: 'Claude Code adapter', checks: claudeChecks },
  { label: 'Codex adapter', checks: codexChecks },
  { label: 'Cursor adapter', checks: cursorChecks },
  { label: 'Gemini adapter', checks: geminiChecks },
  { label: 'Memory adapters', checks: memoryChecks },
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
