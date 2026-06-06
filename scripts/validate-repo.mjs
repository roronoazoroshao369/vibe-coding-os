#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'README.md',
  'LICENSE',
  'NOTICE.md',
  'ATTRIBUTIONS.md',
  'CLAUDE.md',
  'AGENTS.md',
  'registry/sources.json',
  'registry/skills.json',
  'registry/prompts.json',
  'registry/agents.json',
  'package.json'
];

const requiredCommands = [
  'vibe-init.md',
  'vibe-spec.md',
  'vibe-plan.md',
  'vibe-implement.md',
  'vibe-review.md',
  'vibe-memory.md',
  'vibe-merge.md',
  'vibe-doctor.md',
  'vibe-upstream-sync.md'
].map((file) => path.join('commands', file));

const requiredTemplates = [
  'spec-template.md',
  'plan-template.md',
  'task-template.md',
  'review-template.md',
  'memory-template.md',
  'upstream-audit-template.md'
].map((file) => path.join('templates', file));

const requiredExamples = [
  'feature-workflow/README.md',
  'bugfix-workflow/README.md'
].map((file) => path.join('examples', file));

const requiredSkillDirs = [
  'skills/core/vibe-bootstrap',
  'skills/core/upstream-intelligence-loop',
  'skills/core/clarify-before-code',
  'skills/core/spec-first-development',
  'skills/core/plan-driven-execution',
  'skills/core/test-driven-development',
  'skills/core/verification-before-done',
  'skills/core/review-before-merge',
  'skills/memory/project-memory',
  'skills/memory/session-summarizer',
  'skills/memory/context-retrieval',
  'skills/memory/privacy-filter',
  'skills/prompts/anti-overengineering',
  'skills/prompts/karpathy-guardrails',
  'skills/prompts/ask-when-confused',
  'skills/agents/architect-agent',
  'skills/agents/implementer-agent',
  'skills/agents/reviewer-agent',
  'skills/agents/tester-agent'
];

const errors = [];

function requireFile(file) {
  if (!existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const file of [...requiredFiles, ...requiredCommands, ...requiredTemplates, ...requiredExamples]) {
  requireFile(file);
}

for (const dir of requiredSkillDirs) {
  requireFile(path.join(dir, 'SKILL.md'));
}

async function findSkillDirs(root) {
  if (!existsSync(root)) return [];
  const found = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const hasSkill = entries.some((entry) => entry.isFile() && entry.name === 'SKILL.md');
    if (hasSkill) found.push(dir);
    for (const entry of entries) {
      if (entry.isDirectory()) await walk(path.join(dir, entry.name));
    }
  }
  await walk(root);
  return found;
}

for (const dir of await findSkillDirs('skills')) {
  const skillPath = path.join(dir, 'SKILL.md');
  const info = await stat(skillPath);
  if (info.size === 0) errors.push(`Empty skill file: ${skillPath}`);
}

for (const file of [
  'registry/sources.json',
  'registry/skills.json',
  'registry/prompts.json',
  'registry/agents.json'
]) {
  if (!existsSync(file)) continue;
  try {
    JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${file}: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error('Vibe Coding OS validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Vibe Coding OS validation passed.');
console.log(`Checked ${requiredFiles.length} required files, ${requiredSkillDirs.length} skills, ${requiredCommands.length} commands, ${requiredTemplates.length} templates, and ${requiredExamples.length} examples.`);
