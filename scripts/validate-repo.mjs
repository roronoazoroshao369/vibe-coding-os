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

const requiredSkillSections = [
  'Purpose',
  'When to use',
  'Inputs',
  'Workflow',
  'Outputs',
  'Failure modes',
  'Verification checklist'
];

const errors = [];
const registries = {};

function normalizePath(file) {
  return file.split(path.sep).join('/');
}

function requireFile(file) {
  if (!existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const file of [...requiredFiles, ...requiredCommands, ...requiredTemplates, ...requiredExamples]) {
  requireFile(file);
}

async function readJson(file) {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${file}: ${error.message}`);
    return null;
  }
}

function requireStringFields(record, fields, label) {
  for (const field of fields) {
    if (!isNonEmptyString(record?.[field])) {
      errors.push(`${label} is missing required string field: ${field}`);
    }
  }
}

function requireUniqueNames(records, label) {
  const seen = new Map();
  for (const [position, record] of records.entries()) {
    if (!isNonEmptyString(record?.name)) continue;
    if (seen.has(record.name)) {
      errors.push(`Duplicate ${label} name: ${record.name} at indexes ${seen.get(record.name)} and ${position}`);
    } else {
      seen.set(record.name, position);
    }
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

async function findSkillDirs(root) {
  const skillFiles = await findSkillFiles(root);
  return skillFiles.map((file) => normalizePath(path.dirname(file))).sort();
}

async function findSkillFiles(root) {
  if (!existsSync(root)) return [];
  const found = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const hasSkill = entries.some((entry) => entry.isFile() && entry.name === 'SKILL.md');
    if (hasSkill) found.push(normalizePath(path.join(dir, 'SKILL.md')));
    for (const entry of entries) {
      if (entry.isDirectory()) await walk(path.join(dir, entry.name));
    }
  }
  await walk(root);
  return found.sort();
}

async function findCommandFiles(root) {
  if (!existsSync(root)) return [];
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => normalizePath(path.join(root, entry.name)))
    .sort();
}

async function validateSkillFiles(skillDirs) {
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const requiredHeadingPattern = (section) => new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, 'm');

  for (const dir of skillDirs) {
    const skillPath = path.join(dir, 'SKILL.md');
    const info = await stat(skillPath);
    if (info.size === 0) {
      errors.push(`Empty skill file: ${skillPath}`);
      continue;
    }

    const content = await readFile(skillPath, 'utf8');
    for (const section of requiredSkillSections) {
      if (!requiredHeadingPattern(section).test(content)) {
        errors.push(`${normalizePath(skillPath)} is missing required section: ${section}`);
      }
    }
  }
}

function validateRegistryEntries(file, arrayName, requiredFields, label) {
  const registry = registries[file];
  if (!registry) return [];
  if (!Array.isArray(registry[arrayName])) {
    errors.push(`${file} must contain a ${arrayName} array.`);
    return [];
  }

  requireUniqueNames(registry[arrayName], label);
  for (const [position, entry] of registry[arrayName].entries()) {
    const entryLabel = `${file} ${label} at index ${position}`;
    requireStringFields(entry, requiredFields, entryLabel);
    if (isNonEmptyString(entry?.path) && !existsSync(entry.path)) {
      errors.push(`${entryLabel} path does not exist: ${entry.path}`);
    }
  }
  return registry[arrayName];
}

function validateRegistryCoverage(requiredPaths, entries, registryFile, arrayName, coveredType) {
  const registeredPaths = new Set(
    entries.filter((entry) => isNonEmptyString(entry.path)).map((entry) => normalizePath(entry.path))
  );
  for (const requiredPath of requiredPaths) {
    if (!registeredPaths.has(requiredPath)) {
      errors.push(`${registryFile} is missing a ${arrayName} entry for ${coveredType}: ${requiredPath}`);
    }
  }
}

const skillDirs = await findSkillDirs('skills');
await validateSkillFiles(skillDirs);

for (const file of [
  'registry/sources.json',
  'registry/skills.json',
  'registry/prompts.json',
  'registry/agents.json'
]) {
  if (!existsSync(file)) continue;
  try {
    registries[file] = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${file}: ${error.message}`);
  }

}

function validateRequiredRegistryCoverage(requiredPaths, entries, registryFile, arrayName, coveredType) {
  const registeredPaths = new Set(
    entries.filter((entry) => isNonEmptyString(entry.path)).map((entry) => normalizePath(entry.path))
  );
  for (const requiredPath of requiredPaths) {
    if (!registeredPaths.has(requiredPath)) {
      errors.push(`${registryFile} is missing a ${arrayName} entry for ${coveredType}: ${requiredPath}`);
    }
  }
}

async function validateSkillFileFormat(skillFiles) {
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const requiredHeadingPattern = (section) => new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, 'm');
  for (const skillPath of skillFiles) {
    const info = await stat(skillPath);
    if (info.size === 0) {
      errors.push(`Empty skill file: ${skillPath}`);
      continue;
    }

    const content = await readFile(skillPath, 'utf8');
    for (const section of requiredSkillSections) {
      if (!requiredHeadingPattern(section).test(content)) {
        errors.push(`${skillPath} is missing required section: ${section}`);
      }
    }
  }
}

for (const file of [...requiredFiles, ...requiredCommands, ...requiredTemplates]) {
  requireFile(file);
}

const skillEntries = validateRegistryEntries(
  'registry/skills.json',
  'skills',
  ['name', 'path', 'category', 'description'],
  'skill'
);
validateRegistryCoverage(
  skillDirs.map((dir) => normalizePath(path.join(dir, 'SKILL.md'))).sort(),
  skillEntries,
  'registry/skills.json',
  'skills',
  'skill file'
);

const promptEntries = validateRegistryEntries(
  'registry/prompts.json',
  'prompts',
  ['name', 'path', 'description'],
  'prompt'
);
validateRegistryCoverage(
  await findCommandFiles('commands'),
  promptEntries,
  'registry/prompts.json',
  'prompts',
  'command file'
);

validateRegistryEntries('registry/agents.json', 'agents', ['name', 'path'], 'agent');

if (errors.length > 0) {
  console.error('Vibe Coding OS validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Vibe Coding OS validation passed.');
console.log(`Checked ${requiredFiles.length} required files, ${requiredSkillDirs.length} skills, ${requiredCommands.length} commands, ${requiredTemplates.length} templates, and ${requiredExamples.length} examples.`);
