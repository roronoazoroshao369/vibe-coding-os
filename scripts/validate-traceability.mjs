#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

// -----------------------------------------------------------------------------
// Vibe Coding OS traceability validator
//
// Cross-references the three portable inventories (commands, skills, templates)
// against the narrative markdown that links them together. It answers two
// long-term quality questions that the structural validator does not:
//
//   1. Are there BROKEN internal references? A doc/command/skill that points at
//      `commands/X.md`, `skills/.../SKILL.md`, or `templates/Y.md` which no
//      longer exists. These are ERRORS: a dead link silently misroutes an agent.
//
//   2. Are there ORPHAN inventory items? A command/skill/template that exists on
//      disk but is never linked from any narrative markdown. These are WARNINGS:
//      keyword-triggered skills can legitimately stand alone, so an orphan is a
//      signal to review, not a failure.
//
// Scope: every tracked markdown/json surface EXCEPT references/upstreams/, which
// holds vendored upstream clones whose internal links must not constrain us.
// The script never mutates anything.
// -----------------------------------------------------------------------------

const INVENTORY_DIRS = ['commands', 'skills', 'templates'];

// Narrative surfaces that may legitimately link inventory items.
const SCAN_DIRS = [
  'commands',
  'skills',
  'templates',
  'docs',
  'adapters',
  'examples',
  'references/sources',
  'references/features',
  'references/mappings'
];

// Root-level guidance files that also link inventory items.
const SCAN_ROOT_FILES = [
  'README.md',
  'README.vi.md',
  'CLAUDE.md',
  'AGENTS.md',
  'CONSTITUTION.md',
  'STANDARDS.md',
  'ROADMAP.md',
  'CONTEXT.md',
  'INSTALL.md'
];

// Matches `commands/foo.md`, `skills/core/bar/SKILL.md`, `templates/baz.md|json`.
const REF_PATTERN =
  /((?:commands|skills|templates)\/[A-Za-z0-9._/-]+\.(?:md|json))/g;

const errors = [];
const warnings = [];

function normalizePath(file) {
  return file.split(path.sep).join('/');
}

async function walkFiles(dir, predicate) {
  if (!existsSync(dir)) return [];
  const found = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && predicate(entry.name, full)) {
        found.push(normalizePath(full));
      }
    }
  }
  await walk(dir);
  return found.sort();
}

// --- Build inventories -------------------------------------------------------

const commandFiles = (await walkFiles('commands', (name) => name.endsWith('.md')))
  // commands/ is flat; ignore nested READMEs if any appear later.
  .filter((file) => file.split('/').length === 2);
const skillFiles = await walkFiles('skills', (name) => name === 'SKILL.md');
const templateFiles = await walkFiles(
  'templates',
  (name) => name.endsWith('.md') || name.endsWith('.json')
);

const inventoryOnDisk = new Set([
  ...commandFiles,
  ...skillFiles,
  ...templateFiles
]);

// --- Collect references from narrative surfaces ------------------------------

async function collectScanFiles() {
  const files = new Set();
  for (const dir of SCAN_DIRS) {
    const found = await walkFiles(
      dir,
      (name) => name.endsWith('.md') || name.endsWith('.json')
    );
    for (const file of found) files.add(file);
  }
  for (const file of SCAN_ROOT_FILES) {
    if (existsSync(file)) files.add(normalizePath(file));
  }
  return [...files].sort();
}

const scanFiles = await collectScanFiles();

// Map referenced inventory path -> set of files that reference it (excluding self).
const referencedBy = new Map();

for (const file of scanFiles) {
  const info = await stat(file);
  if (info.size === 0) continue;
  const content = await readFile(file, 'utf8');
  const seenInFile = new Set();
  let match;
  REF_PATTERN.lastIndex = 0;
  while ((match = REF_PATTERN.exec(content)) !== null) {
    const ref = normalizePath(match[1]);
    if (seenInFile.has(ref)) continue;
    seenInFile.add(ref);

    // ERROR: referenced inventory path that does not exist on disk.
    if (
      INVENTORY_DIRS.some((dir) => ref.startsWith(`${dir}/`)) &&
      !existsSync(ref)
    ) {
      errors.push(`${file} references a missing path: ${ref}`);
      continue;
    }

    if (ref === file) continue; // self-reference does not count as linkage
    if (!referencedBy.has(ref)) referencedBy.set(ref, new Set());
    referencedBy.get(ref).add(file);
  }
}

// --- Orphan detection (warnings) ---------------------------------------------

function reportOrphans(files, label) {
  const orphans = files.filter((file) => !referencedBy.has(file));
  for (const orphan of orphans) {
    warnings.push(`Orphan ${label} (no narrative markdown links to it): ${orphan}`);
  }
  return orphans.length;
}

const orphanCommands = reportOrphans(commandFiles, 'command');
const orphanSkills = reportOrphans(skillFiles, 'skill');
const orphanTemplates = reportOrphans(templateFiles, 'template');

// --- Report ------------------------------------------------------------------

if (warnings.length > 0) {
  console.warn('Vibe Coding OS traceability warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error('Vibe Coding OS traceability validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Traceability validation passed.');
console.log(
  `Checked ${commandFiles.length} commands, ${skillFiles.length} skills, ` +
    `${templateFiles.length} templates against ${scanFiles.length} narrative files. ` +
    `Broken references: 0. Orphans (warnings): ${orphanCommands} commands, ` +
    `${orphanSkills} skills, ${orphanTemplates} templates.`
);
