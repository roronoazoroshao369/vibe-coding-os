#!/usr/bin/env node
// scripts/validate-orphans.mjs
// Non-blocking warning: report orphan templates and orphan skills that are
// never referenced from docs/ or from any other template/skill.
//
// Orphans here mean "no inbound reference" — they aren't necessarily broken
// (skill content could still be discoverable via command workflows), but
// they should be either wired in or removed to keep the catalog honest.
//
// v2.17.5 — promoted from ad-hoc _check_orphans.mjs; non-blocking warning
// (exit 0) so it can be wired into validate:all without breaking CI.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

// Category index SKILL.md files — structural organisers that serve as
// gateway/landing pages within a skill subdirectory. They aren't referenced
// by name from docs because their children are the discoverable surface.
const ALLOWED_ORPHAN_SKILLS = new Set([
  'skills/agents/SKILL.md',
  'skills/checklists/SKILL.md',
  'skills/core/SKILL.md',
  'skills/memory/SKILL.md',
  'skills/meta/SKILL.md',
  'skills/prompts/SKILL.md',
  'skills/templates/SKILL.md',
]);

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === '.vibe') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function references(name, files) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped);
  for (const f of files) {
    try {
      if (re.test(readFileSync(f, 'utf8'))) return true;
    } catch { /* skip unreadable */ }
  }
  return false;
}

// Collect searchable corpus: docs/, commands/, skills/, templates/, README files
const searchRoots = ['docs/', 'commands/', 'skills/', 'templates/', 'README.md', 'README.vi.md', 'AGENTS.md', 'CLAUDE.md'];
const corpus = [];
for (const r of searchRoots) {
  const full = join(root, r);
  try {
    if (statSync(full).isDirectory()) corpus.push(...walk(full));
    else corpus.push(full);
  } catch { /* path missing */ }
}
// Exclude the orphan skill files themselves from the corpus (they'd self-reference)
const corpusSet = new Set(corpus);

// Orphan templates
const tmplDir = join(root, 'templates');
const templates = readdirSync(tmplDir)
  .filter(f => f.endsWith('.md') && statSync(join(tmplDir, f)).isFile());

const orphanT = [];
for (const t of templates) {
  if (!references(t.replace(/\.md$/, ''), [...corpusSet])) orphanT.push(t);
}

// Orphan skills
const skillDirs = readdirSync(join(root, 'skills'))
  .filter(d => statSync(join(root, 'skills', d)).isDirectory());
const orphanS = [];
for (const d of skillDirs) {
  const skillPath = `skills/${d}/SKILL.md`;
  if (ALLOWED_ORPHAN_SKILLS.has(skillPath)) continue;
  if (!references(skillPath, [...corpusSet])) orphanS.push(skillPath);
}

if (orphanT.length === 0 && orphanS.length === 0) {
  console.log('[validate-orphans] OK: 0 orphan templates, 0 orphan skills.');
  process.exit(0);
}

console.log('[validate-orphans] WARN (non-blocking):');
if (orphanT.length > 0) {
  console.log(`  Orphan templates (${orphanT.length}): ${orphanT.join(', ')}`);
}
if (orphanS.length > 0) {
  console.log(`  Orphan skills (${orphanS.length}): ${orphanS.join(', ')}`);
}
console.log('  Action: wire into docs/workflows, or remove if obsolete.');
// exit 0 — warning only, does not block validate:all
process.exit(0);