#!/usr/bin/env node
/**
 * generate-skills-index.mjs — v2.16.0 Wave B
 *
 * Auto-generate skills/core/INDEX.md from SKILL.md frontmatter + Purpose sections.
 * Groups skills into 8 lifecycle categories by name heuristics.
 *
 * Usage: node scripts/generate-skills-index.mjs
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CORE_DIR = join(ROOT, 'skills', 'core');
const OUT = join(CORE_DIR, 'INDEX.md');

function categorize(name) {
  const n = name.toLowerCase();
  if (['debug', 'fix', 'diagnos', 'systematic', 'disciplined'].some(kw => n.includes(kw))) return 'Debug & Fix';
  if (['test', 'review', 'verify', 'quality', 'check', 'critique', 'audit', 'adversarial'].some(kw => n.includes(kw))) return 'Test & Review';
  if (['plan', 'spec', 'criteria', 'context', 'architecture', 'requirement', 'brainstorm', 'clarify', 'preflight'].some(kw => n.includes(kw))) return 'Plan & Specify';
  if (['build', 'implement', 'code', 'subagent', 'adaptive', 'orchestrat', 'parallel', 'flow'].some(kw => n.includes(kw))) return 'Build & Implement';
  if (['deploy', 'release', 'ship', 'cicd', 'precommit', 'hook', 'commit', 'git-'].some(kw => n.includes(kw))) return 'Deploy & Operate';
  if (['migrate', 'deprecat', 'refactor', 'clean', 'document', 'author', 'docs'].some(kw => n.includes(kw))) return 'Maintain & Evolve';
  if (['skill', 'learning', 'lesson', 'instinct', 'memory', 'forge', 'doubt', 'grill', 'goal', 'task-state', 'quality-execution', 'setup', 'external'].some(kw => n.includes(kw))) return 'Meta (Skills & Process)';
  return 'Other';
}

const skills = [];
for (const d of readdirSync(CORE_DIR)) {
  const skillPath = join(CORE_DIR, d, 'SKILL.md');
  if (!existsSync(skillPath)) continue;
  const content = readFileSync(skillPath, 'utf8');
  const purposeMatch = content.match(/## Purpose\n+([^\n]+)/);
  const purpose = purposeMatch ? purposeMatch[1].slice(0, 120) : '';
  skills.push({ name: d, purpose, category: categorize(d) });
}

const groups = {};
for (const s of skills) {
  if (!groups[s.category]) groups[s.category] = [];
  groups[s.category].push(s);
}

const ORDER = ['Plan & Specify', 'Build & Implement', 'Test & Review', 'Debug & Fix', 'Deploy & Operate', 'Maintain & Evolve', 'Meta (Skills & Process)', 'Other'];
const TITLES = {
  'Plan & Specify': 'Plan & Specify',
  'Build & Implement': 'Build & Implement',
  'Test & Review': 'Test & Review',
  'Debug & Fix': 'Debug & Fix',
  'Deploy & Operate': 'Deploy & Operate',
  'Maintain & Evolve': 'Maintain & Evolve',
  'Meta (Skills & Process)': 'Meta (Skills & Process)',
  'Other': 'Other / Cross-cutting',
};

let md = `---
name: skills-core-index
version: 1.0.0
introduced_in: v2.16.0
last_reviewed: ${new Date().toISOString().slice(0, 10)}
category: meta
tags:
  - index
  - navigation
status: stable
---

# Skills Index — \`skills/core/\`

The \`skills/core/\` directory contains **${skills.length} reusable skills** organized by lifecycle stage.
This index groups them by purpose to help you find the right skill quickly.

> **Count**: ${skills.length} skills in ${Object.keys(groups).length} lifecycle groups. Use \`node scripts/skill-content-search.mjs <keyword>\` to find by capability.

---

`;

for (const cat of ORDER) {
  if (!groups[cat]) continue;
  md += `## ${TITLES[cat]} (${groups[cat].length} skills)\n\n`;
  for (const s of groups[cat].sort((a, b) => a.name.localeCompare(b.name))) {
    md += `- **${s.name}** — ${s.purpose}\n`;
  }
  md += '\n';
}

md += `---

## How to use this index

1. **Find a skill by stage**: scroll to the section that matches your current task.
2. **Find by capability**: use \`node scripts/skill-content-search.mjs <keyword>\`.
3. **Find by dependency**: use the skill-deps-graph skill to see how skills connect.

## Why ${skills.length} skills?

Vibe Coding OS is a **meta-framework**: each skill is a reusable pattern for a specific
quality or workflow concern. The breadth reflects the variety of failure modes AI agents
encounter — not duplication. If you find skills that overlap, propose a merge via a PR
that updates this index.

## Maintenance

This index is auto-generated from SKILL.md frontmatter and Purpose sections.
Re-generate with \`node scripts/generate-skills-index.mjs\` (see v2.16.0).
`;

writeFileSync(OUT, md);
console.log(`✅ Generated ${OUT} (${skills.length} skills in ${Object.keys(groups).length} groups)`);
