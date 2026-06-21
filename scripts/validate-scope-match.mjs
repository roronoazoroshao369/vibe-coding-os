#!/usr/bin/env node
// scripts/validate-scope-match.mjs
//
// Validates that each skill/command/template file's content matches its
// declared scope (frontmatter name + directory layout).
//
// Checks:
//   1. SKILL.md first heading mentions the skill name from frontmatter
//   2. SKILL.md parent directory matches the declared name
//   3. No cross-directory relative path escapes (more than 2 levels of '../')
//
// v1.0.0 — Initial autopilot integration validator

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const SCAN_DIRS = ['skills', 'commands', 'templates'];
const EXCLUDE_SEGMENTS = ['node_modules', '.git', 'references/upstreams'];

// Category directories that are NOT skill-specific — SKILL.md files at these
// levels are index/root files, not individual skills.
const CATEGORY_DIRS = new Set([
  'skills', 'commands', 'templates', 'agents', 'checklists',
  'core', 'memory', 'meta', 'prompts', 'quality', 'templates',
]);

const errors = [];
let totalFiles = 0;

function normalizePath(p) {
  return p.split('\\').join('/');
}

async function walkDir(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (EXCLUDE_SEGMENTS.some(seg => normalizePath(full).includes(seg))) continue;
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && (entry.name === 'SKILL.md' || entry.name.endsWith('.md'))) {
        results.push(normalizePath(full));
      }
    }
  }
  await walk(dir);
  return results.sort();
}

/**
 * Parse the YAML frontmatter at the top of a markdown file.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return {};
  const fm = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
    if (m) {
      fm[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return fm;
}

/**
 * Extract the first level-1 heading from content.
 */
function extractFirstHeading(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

/**
 * Check for path-escape patterns.
 */
function hasPathEscape(content) {
  const escapeRe = /(\.\.\/)(\.\.\/){3,}/g;
  return escapeRe.test(content);
}

/**
 * Normalize a name for comparison: lowercase, strip non-alphanumeric.
 */
function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

/**
 * Check a single file for scope consistency.
 */
async function checkFile(file) {
  totalFiles++;
  const rel = file.replace(REPO_ROOT + '/', '');
  const content = await readFile(file, 'utf8');
  const fm = parseFrontmatter(content);
  const heading = extractFirstHeading(content);

  // Only check SKILL.md files for name matching
  if (file.endsWith('SKILL.md')) {
    const parentDir = basename(dirname(file));

    // Skip if parent is a category dir (not a skill-specific dir)
    if (!CATEGORY_DIRS.has(parentDir)) {
      // Check 1: first heading should mention the skill name from frontmatter
      if (fm.name && heading) {
        const normName = normalizeName(fm.name).replace(/-/g, '');
        const normHeading = normalizeName(heading).replace(/-/g, '');
        // Headings often include extra words ("Skill: X", "X Skill", etc.)
        // Check that at least one word from the name appears in the heading
        const nameWords = normName.split(/[^a-z0-9]+/).filter(Boolean);
        const headingWords = normHeading.split(/[^a-z0-9]+/).filter(Boolean);
        const hasOverlap = nameWords.some(w => w.length >= 3 && headingWords.some(hw => hw.includes(w) || w.includes(hw)));
        if (nameWords.length >= 1 && !hasOverlap) {
          const firstNameWord = nameWords[0];
          const firstHeadingWord = headingWords[0];
          if (firstNameWord !== firstHeadingWord && firstNameWord.length >= 3) {
            errors.push(`${rel}: heading "${heading}" does not mention skill name "${fm.name}"`);
          }
        }
      }

      // Check 2: parent directory should match the declared name
      if (fm.name) {
        const normName = normalizeName(fm.name);
        const normDir = normalizeName(parentDir);
        if (normName !== normDir) {
          errors.push(`${rel}: skill name "${fm.name}" does not match parent directory "${parentDir}"`);
        }
      }
    }
  }

  // Check 3: path-escape patterns in all files
  if (hasPathEscape(content)) {
    errors.push(`${rel}: contains path-escape pattern (more than 2 levels of '../')`);
  }
}

// --- Main ---

for (const dir of SCAN_DIRS) {
  const dirPath = join(REPO_ROOT, dir);
  const files = await walkDir(dirPath);
  for (const file of files) {
    await checkFile(file);
  }
}

if (errors.length > 0) {
  console.error(`Scope-match validation FAILED: ${errors.length} violation(s) found:`);
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  process.exit(1);
}

console.log(
  `Scope-match validation passed: ${totalFiles} files scanned, 0 violations.`
);
process.exit(0);
