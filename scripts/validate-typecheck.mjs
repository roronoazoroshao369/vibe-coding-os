#!/usr/bin/env node
// scripts/validate-typecheck.mjs
//
// Simple static analysis validator for .mjs files.
// Checks for common issues that would cause runtime ReferenceErrors:
//   - Common misspelled function/identifier patterns
//   - Duplicate parameter names in the same function signature
//
// This is NOT a full type checker. It uses targeted regex pattern matching.
// Returns exit code 0 on success, warns only (no hard failures).
//
// v1.0.0 — Initial autopilot integration validator

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const SCAN_DIRS = ['skills', 'runtime', 'scripts'];
const EXCLUDE_SEGMENTS = ['node_modules', '.git', 'references/upstreams'];

// Known common misspellings in API calls (pattern -> suggestion)
// NOTE: We use string matching on lines to avoid false-positive self-matches.
// The 're' patterns are intentionally misspelled in the file we read — they
// are matched against OTHER files only. To prevent the scanner from flagging
// itself, we strip this script from its own scan via EXCLUDE_SELF.
const COMMON_MISSPELLINGS = [
  { name: 'readdFile',   suggestion: 'readFile',   re: /\breaddFile\b/g },
  { name: 'writFile',    suggestion: 'writeFile',  re: /\bwritFile\b/g },
  { name: 'makDir',      suggestion: 'mkdir',      re: /\bmakDir\b/g },
  { name: 'dirent',      suggestion: 'Dirent',     re: /\bdirent\b/g },
  { name: 'exsitsSync',  suggestion: 'existsSync', re: /\bexsitsSync\b/g },
  { name: 'proccessSync',suggestion: 'execSync',   re: /\bproccessSync\b/g },
];

const EXCLUDE_SELF = new Set([
  // This file itself contains the misspelling patterns (it documents them).
  normalizePath(new URL(import.meta.url).pathname)
]);

const warnings = [];
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
      } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
        const normalized = normalizePath(full);
        if (!EXCLUDE_SELF.has(normalized)) {
          results.push(normalized);
        }
      }
    }
  }
  await walk(dir);
  return results.sort();
}

/**
 * Strip JavaScript comments from content.
 */
function stripComments(content) {
  return content
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/`[\s\S]*?`/g, '``');
}

/**
 * Check a file for common issues.
 */
function checkFile(file, content) {
  const rel = file.replace(REPO_ROOT + '/', '');
  const clean = stripComments(content);
  const cleanLines = clean.split('\n');

  // 1. Common misspellings
  for (const { re, name, suggestion } of COMMON_MISSPELLINGS) {
    for (let i = 0; i < cleanLines.length; i++) {
      re.lastIndex = 0;
      if (re.test(cleanLines[i])) {
        warnings.push(`${rel}:${i + 1} — possible misspelling "${name}", did you mean "${suggestion}"?`);
      }
    }
  }

  // 2. Duplicate parameter names in function signatures
  const funcRe = /function\s+\w*\s*\(([^)]+)\)/g;
  for (let i = 0; i < cleanLines.length; i++) {
    funcRe.lastIndex = 0;
    const m = funcRe.exec(cleanLines[i]);
    if (m) {
      const paramStr = m[1];
      const paramNames = paramStr.split(',').map(p => p.trim().split(/[\s=]/)[0]).filter(Boolean);
      const seen = new Set();
      for (const p of paramNames) {
        if (seen.has(p)) {
          warnings.push(`${rel}:${i + 1} — duplicate parameter name "${p}" in function signature`);
        }
        seen.add(p);
      }
    }
  }
}

// --- Main ---

for (const dir of SCAN_DIRS) {
  const dirPath = join(REPO_ROOT, dir);
  const files = await walkDir(dirPath);
  for (const file of files) {
    totalFiles++;
    const content = await readFile(file, 'utf8');
    checkFile(file, content);
  }
}

if (warnings.length > 0) {
  console.log(`Type check completed: ${totalFiles} .mjs files scanned, ${warnings.length} warning(s):`);
  for (const w of warnings) {
    console.log(`  ⚠️  ${w}`);
  }
} else {
  console.log(`Type check passed: ${totalFiles} .mjs files scanned, 0 warnings.`);
}

process.exit(0);
