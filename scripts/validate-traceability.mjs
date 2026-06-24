#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

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
// Scope: active markdown/json surfaces EXCEPT references/upstreams/ and historical
// archive directories, whose internal links must not constrain active inventory.
// The script never mutates anything.
//
// v2.13.0 strict-new mode:
//   --strict-new --since=<git-tag>
//   Promotes orphan warnings to ERRORS for inventory items that did NOT exist
//   before <git-tag>. This catches newly-added orphans before they merge.
//   Usage:  node scripts/validate-traceability.mjs --strict-new --since=v2.12.0
// -----------------------------------------------------------------------------

const INVENTORY_DIRS = ['commands', 'skills', 'templates'];
const COMPAT_COMMAND_SHIMS = new Set([
  'commands/vibe-specify.md',
  'commands/vibe-parallel-explore.md'
]);
const HISTORICAL_SCAN_PREFIXES = [
  'docs/archive/',
  'docs/plans/historical/'
];

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

// Parse CLI args for strict-new mode
const args = process.argv.slice(2);
const strictNew = args.includes('--strict-new');
const sinceArg = args.find(a => a.startsWith('--since='));
const sinceTag = sinceArg ? sinceArg.split('=')[1] : null;

async function readActiveCommandFiles() {
  try {
    const manifest = JSON.parse(await readFile('commands/manifest.json', 'utf8'));
    if (Array.isArray(manifest.commands)) {
      return manifest.commands
        .map((command) => `commands/${command}.md`)
        .filter((file) => existsSync(file))
        .sort();
    }
  } catch {
    // Fall back to filesystem discovery below.
  }

  return (await walkFiles('commands', (name) => name.endsWith('.md')))
    // commands/ is flat; README.md is directory documentation, not a command.
    .filter((file) => file.split('/').length === 2 && file !== 'commands/README.md')
    .filter((file) => !COMPAT_COMMAND_SHIMS.has(file));
}

const commandFiles = await readActiveCommandFiles();
const skillFiles = await walkFiles('skills', (name) => name === 'SKILL.md');
const templateFiles = (await walkFiles(
  'templates',
  (name) => name.endsWith('.md') || name.endsWith('.json')
))
  // templates/README.md is directory documentation, not a reusable template.
  .filter((file) => file !== 'templates/README.md');

const inventoryOnDisk = new Set([
  ...commandFiles,
  ...skillFiles,
  ...templateFiles
]);

// --- Strict-new: identify files added since the given git tag --------------

let newSinceTag = new Set();
if (strictNew && sinceTag) {
  try {
    // Get list of inventory files added after sinceTag
    const output = execSync(
      `git log --diff-filter=A --name-only --pretty=format: ${sinceTag}..HEAD`,
      { encoding: 'utf8' }
    );
    for (const f of output.split('\n')) {
      const trimmed = f.trim();
      if (trimmed && inventoryOnDisk.has(trimmed)) {
        newSinceTag.add(trimmed);
      }
    }
    console.log(`[strict-new] Since tag '${sinceTag}': ${newSinceTag.size} inventory files added.`);
  } catch (e) {
    console.error(`[strict-new] WARNING: Could not determine files since ${sinceTag}: ${e.message}`);
    console.error('[strict-new] Falling back to non-strict mode.');
  }
}

// --- Collect references from narrative surfaces ------------------------------

function isHistoricalScanFile(file) {
  return HISTORICAL_SCAN_PREFIXES.some((prefix) => file.startsWith(prefix));
}

async function collectScanFiles() {
  const files = new Set();
  for (const dir of SCAN_DIRS) {
    const found = await walkFiles(
      dir,
      (name) => name.endsWith('.md') || name.endsWith('.json')
    );
    for (const file of found) {
      if (COMPAT_COMMAND_SHIMS.has(file)) continue;
      if (isHistoricalScanFile(file)) continue;
      files.add(file);
    }
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
    const isNew = newSinceTag.has(orphan);
    if (isNew && strictNew) {
      // Promote to ERROR in strict-new mode
      errors.push(`[strict-new] NEW orphan ${label} added since ${sinceTag} (must be linked from narrative markdown): ${orphan}`);
    } else {
      warnings.push(`Orphan ${label} (no narrative markdown links to it): ${orphan}`);
    }
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

const strictSuffix = strictNew && sinceTag ? ` (strict-new since ${sinceTag})` : '';
console.log(`Traceability validation passed${strictSuffix}.`);
console.log(
  `Checked ${commandFiles.length} commands, ${skillFiles.length} skills, ` +
    `${templateFiles.length} templates against ${scanFiles.length} narrative files. ` +
    `Broken references: 0. Orphans (warnings): ${orphanCommands} commands, ` +
    `${orphanSkills} skills, ${orphanTemplates} templates.`
);
if (strictNew && sinceTag) {
  console.log(`[strict-new] ${newSinceTag.size} new inventory files since ${sinceTag}; all linked.`);
}
