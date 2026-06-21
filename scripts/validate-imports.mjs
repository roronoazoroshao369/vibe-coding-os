#!/usr/bin/env node
// scripts/validate-imports.mjs
//
// Scans all .mjs files in skills/, runtime/, and scripts/ directories.
// Finds `import` statements and verifies each imported module path exists.
// Reports broken imports (path not found).
// Returns exit code 0 if all imports valid, 1 otherwise.
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

// Import regex: captures the module path from import statements.
// Matches:
//   import { x } from './foo.mjs'
//   import x from './foo.mjs'
//   import('./dynamic.mjs')
// Does NOT match examples in comments (because we strip JS comments first).
const IMPORT_RE = /import\s+(?:[\w*\s{},]+\s+from\s+)?['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const errors = [];
let totalFiles = 0;
let totalImports = 0;

function normalizePath(p) {
  return p.split('\\').join('/');
}

async function walkDir(dir, predicate) {
  if (!existsSync(dir)) return [];
  const results = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (EXCLUDE_SEGMENTS.some(seg => normalizePath(full).includes(seg))) continue;
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && predicate(entry.name, full)) {
        results.push(normalizePath(full));
      }
    }
  }
  await walk(dir);
  return results.sort();
}

/**
 * Strip JavaScript comments from content so regexes don't match examples in comments.
 */
function stripComments(content) {
  // Remove single-line comments (but preserve line structure)
  return content
    .replace(/\/\/.*$/gm, '')       // single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // multi-line comments
}

function resolveImportPath(sourceFile, importPath) {
  // Skip node: builtins
  if (importPath.startsWith('node:')) return null;

  // Skip bare specifiers (package imports like 'chalk', 'fs-extra')
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) return null;

  const sourceDir = dirname(sourceFile);

  const candidates = [
    importPath,
    importPath + '.mjs',
    importPath + '.js',
    importPath + '/index.mjs',
    importPath + '/index.js',
    join(importPath, 'index.mjs'),
    join(importPath, 'index.js'),
  ];

  for (const candidate of candidates) {
    const resolved = resolve(sourceDir, candidate);
    if (existsSync(resolved)) {
      return normalizePath(resolved);
    }
  }

  return null;
}

function extractImports(content) {
  const paths = new Set();
  let match;

  // Strip comments first to avoid matching examples
  const clean = stripComments(content);

  IMPORT_RE.lastIndex = 0;
  while ((match = IMPORT_RE.exec(clean)) !== null) {
    paths.add(match[1]);
  }

  DYNAMIC_IMPORT_RE.lastIndex = 0;
  while ((match = DYNAMIC_IMPORT_RE.exec(clean)) !== null) {
    paths.add(match[1]);
  }

  return [...paths];
}

// --- Main ---

const mjsFiles = [];

for (const dir of SCAN_DIRS) {
  const dirPath = join(REPO_ROOT, dir);
  const files = await walkDir(dirPath, (name) => name.endsWith('.mjs'));
  mjsFiles.push(...files);
}

for (const file of mjsFiles) {
  totalFiles++;
  const content = await readFile(file, 'utf8');
  const imports = extractImports(content);

  for (const importPath of imports) {
    totalImports++;
    const resolved = resolveImportPath(file, importPath);

    if (resolved === null) {
      if (importPath.startsWith('.')) {
        errors.push(`${file}: cannot resolve import "${importPath}"`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Import validation FAILED: ${errors.length} broken import(s) found:`);
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  process.exit(1);
}

console.log(
  `Import validation passed: ${totalFiles} .mjs files scanned, ` +
  `${totalImports} import(s) checked, 0 broken imports.`
);
process.exit(0);
