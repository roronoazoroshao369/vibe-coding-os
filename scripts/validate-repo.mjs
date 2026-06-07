#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

// -----------------------------------------------------------------------------
// Vibe Coding OS structural validator
//
// Design: skills, commands, and templates are discovered DYNAMICALLY from disk.
// There are no hardcoded inventory lists for those three families, so adding or
// removing a skill/command/template never requires editing this script. Root
// files and the small fixed example set are still checked explicitly because
// they are structural invariants of the repo, not a growing inventory.
//
// Registries (skills.json / prompts.json) are owned elsewhere; this script only
// CROSS-CHECKS them against disk and reports drift. It never mutates a registry.
// -----------------------------------------------------------------------------

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

const requiredExamples = [
  'feature-workflow/README.md',
  'bugfix-workflow/README.md'
].map((file) => path.join('examples', file));

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
const warnings = [];
const registries = {};

function normalizePath(file) {
  return file.split(path.sep).join('/');
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function requireFile(file) {
  if (!existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  }
}

// --- Dynamic disk discovery --------------------------------------------------

async function findSkillFiles(root) {
  if (!existsSync(root)) return [];
  const found = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name === 'SKILL.md') {
        found.push(normalizePath(full));
      }
    }
  }
  await walk(root);
  return found.sort();
}

async function findMarkdownFiles(root) {
  if (!existsSync(root)) return [];
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => normalizePath(path.join(root, entry.name)))
    .sort();
}

// --- SKILL.md structural checks ---------------------------------------------

async function validateSkillFiles(skillFiles) {
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const requiredHeadingPattern = (section) =>
    new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, 'm');

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

async function validateMarkdownNonEmpty(files, label) {
  for (const file of files) {
    const info = await stat(file);
    if (info.size === 0) {
      errors.push(`Empty ${label} file: ${file}`);
    }
  }
}

// --- Registry validation -----------------------------------------------------

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
      errors.push(
        `Duplicate ${label} name: ${record.name} at indexes ${seen.get(record.name)} and ${position}`
      );
    } else {
      seen.set(record.name, position);
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

// Bidirectional drift check between disk inventory and registry entries.
// - disk-not-in-registry => missing entry (registry owner must add)
// - registry-not-on-disk => stale/extra entry (registry owner must remove)
function crossCheckRegistry(diskPaths, entries, registryFile, arrayName, coveredType) {
  const diskSet = new Set(diskPaths.map(normalizePath));
  const registeredPaths = entries
    .filter((entry) => isNonEmptyString(entry.path))
    .map((entry) => normalizePath(entry.path));
  const registeredSet = new Set(registeredPaths);

  for (const diskPath of diskSet) {
    if (!registeredSet.has(diskPath)) {
      errors.push(
        `${registryFile} is missing a ${arrayName} entry for ${coveredType}: ${diskPath}`
      );
    }
  }
  for (const registeredPath of registeredSet) {
    if (!diskSet.has(registeredPath)) {
      errors.push(
        `${registryFile} has a stale ${arrayName} entry (path not on disk): ${registeredPath}`
      );
    }
  }
}

// --- Run ---------------------------------------------------------------------

for (const file of [...requiredFiles, ...requiredExamples]) {
  requireFile(file);
}

// Discover inventories dynamically.
const skillFiles = await findSkillFiles('skills');
const commandFiles = await findMarkdownFiles('commands');
const templateFiles = await findMarkdownFiles('templates');

await validateSkillFiles(skillFiles);
await validateMarkdownNonEmpty(commandFiles, 'command');
await validateMarkdownNonEmpty(templateFiles, 'template');

// Load registries (JSON validity).
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

const skillEntries = validateRegistryEntries(
  'registry/skills.json',
  'skills',
  ['name', 'path', 'category', 'description'],
  'skill'
);
crossCheckRegistry(skillFiles, skillEntries, 'registry/skills.json', 'skills', 'skill file');

const promptEntries = validateRegistryEntries(
  'registry/prompts.json',
  'prompts',
  ['name', 'path', 'description'],
  'prompt'
);
crossCheckRegistry(commandFiles, promptEntries, 'registry/prompts.json', 'prompts', 'command file');

validateRegistryEntries('registry/agents.json', 'agents', ['name', 'path'], 'agent');

if (warnings.length > 0) {
  console.warn('Vibe Coding OS validation warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error('Vibe Coding OS validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Vibe Coding OS validation passed.');
console.log(
  `Checked ${requiredFiles.length} required files, ${skillFiles.length} skills, ` +
    `${commandFiles.length} commands, ${templateFiles.length} templates, and ` +
    `${requiredExamples.length} examples (skills/commands/templates discovered dynamically).`
);
