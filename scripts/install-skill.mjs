#!/usr/bin/env node
// scripts/install-skill.mjs
// Wave C1 Move 2 — Install a skill/command/template from the registry.
// v2.14.0 — supports local install, dry-run, force, list modes.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

// Load skills registry
function loadRegistry() {
  const skillsPath = join(ROOT, 'registry/skills.json');
  if (!existsSync(skillsPath)) return { skills: [] };
  return JSON.parse(readFileSync(skillsPath, 'utf8'));
}

// Find skill by name
function findSkill(name) {
  const registry = loadRegistry();
  return registry.skills.find(s => s.name === name);
}

// Install a single skill to a target directory
function installSkill(skill, targetDir, options = {}) {
  const srcPath = join(ROOT, skill.path);
  if (!existsSync(srcPath)) {
    return { ok: false, error: `Source not found: ${skill.path}` };
  }

  const dstPath = join(targetDir, skill.path);
  const dstDir = dirname(dstPath);

  if (!existsSync(dstDir)) {
    if (!options.dryRun) mkdirSync(dstDir, { recursive: true });
  }

  if (existsSync(dstPath) && !options.force) {
    return { ok: false, error: `Already exists at ${relative(ROOT, dstPath)} (use --force to overwrite)` };
  }

  if (!options.dryRun) {
    copyFileSync(srcPath, dstPath);
  }

  return {
    ok: true,
    installed: relative(ROOT, dstPath),
    source: skill.path,
    name: skill.name,
    description: skill.description
  };
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const listMode = args.includes('--list') || args.length === 0;

if (listMode) {
  const registry = loadRegistry();
  console.log(`Available skills (${registry.skills.length}):\n`);
  // Group by category
  const byCategory = {};
  for (const s of registry.skills) {
    const cat = s.category || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(s);
  }
  for (const [cat, skills] of Object.entries(byCategory).sort()) {
    console.log(`  [${cat}] (${skills.length} skills)`);
    for (const s of skills.slice(0, 5)) {
      console.log(`    ${s.name} — ${s.description.slice(0, 80)}${s.description.length > 80 ? '...' : ''}`);
    }
    if (skills.length > 5) {
      console.log(`    ... and ${skills.length - 5} more`);
    }
  }
  console.log('\nUsage: node scripts/install-skill.mjs <skill-name> [--dry-run] [--force] [--target=<dir>]');
  process.exit(0);
}

const skillName = args.find(a => !a.startsWith('--'));
const targetArg = args.find(a => a.startsWith('--target='));
const targetDir = targetArg ? targetArg.split('=')[1] : ROOT;

if (!skillName) {
  console.error('Usage: node scripts/install-skill.mjs <skill-name> [--dry-run] [--force] [--target=<dir>]');
  process.exit(1);
}

const skill = findSkill(skillName);
if (!skill) {
  console.error(`Skill "${skillName}" not found. Run with --list to see all skills.`);
  process.exit(1);
}

const result = installSkill(skill, targetDir, { dryRun, force });
if (!result.ok) {
  console.error(`✗ ${result.error}`);
  process.exit(1);
}

console.log(dryRun ? '🔍 DRY RUN — would install:' : '✓ Installed:');
console.log(`  Name:        ${result.name}`);
console.log(`  Description: ${result.description}`);
console.log(`  Source:      ${result.source}`);
console.log(`  Installed to: ${result.installed}`);
process.exit(0);
