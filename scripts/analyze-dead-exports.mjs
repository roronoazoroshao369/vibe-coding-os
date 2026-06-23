#!/usr/bin/env node
// scripts/analyze-dead-exports.mjs
// Finds exports in .mjs files that are never imported by any other file.
// Helps catch AI "artifact" exports left behind after refactoring.
//
// Exit 0 with report, never blocks (advisory gate).

import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const IGNORE_DIRS = [
  'node_modules',
  '.git',
  'coverage',
  'docs/reports/council',
  'references/upstreams',
];
// Only scan scripts/ and adapters/ — runtime/ exports are API surfaces for external consumers.
const SCAN_PREFIXES = ['scripts/', 'adapters/'];

function listFiles() {
  const raw = execSync('git ls-files -z -- "*.mjs" "*.js"', {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  return raw.split('\0').filter(Boolean).filter((f) =>
    !IGNORE_DIRS.some((d) => f.startsWith(d + '/') || f.includes('/' + d + '/'))
  ).filter((f) => SCAN_PREFIXES.some((p) => f.startsWith(p)));
}

async function extractExports(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const exports = [];
    // Named exports: export const/function/class/name
    const namedRe = /export\s+(?:const|let|var|function|class|async\s+function)\s+(\w+)/g;
    let m;
    while ((m = namedRe.exec(content)) !== null) {
      exports.push({ name: m[1], type: 'named' });
    }
    // Re-exports: export { name } or export { name as alias }
    const reExportRe = /export\s+\{([^}]+)\}/g;
    while ((m = reExportRe.exec(content)) !== null) {
      const items = m[1].split(',').map((s) => {
        const parts = s.trim().split(/\s+as\s+/);
        return { name: (parts[1] || parts[0]).trim(), type: 're-export' };
      });
      exports.push(...items);
    }
    // Default export: export default function/class/var
    if (/export\s+default\s/.test(content)) {
      exports.push({ name: 'default', type: 'default' });
    }
    return exports;
  } catch {
    return [];
  }
}

async function extractImports(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const imports = [];
    // import { name } from '...'
    const importRe = /import\s+(?:\{([^}]+)\}|(\w+))(?:\s*,\s*\{([^}]+)\})?\s+from\s+['"][^'"]+['"]/g;
    let m;
    while ((m = importRe.exec(content)) !== null) {
      if (m[1]) {
        m[1].split(',').forEach((s) => {
          const name = s.trim().split(/\s+as\s+/).pop().trim();
          if (name) imports.push(name);
        });
      }
      if (m[2]) imports.push(m[2]);
      if (m[3]) {
        m[3].split(',').forEach((s) => {
          const name = s.trim().split(/\s+as\s+/).pop().trim();
          if (name) imports.push(name);
        });
      }
    }
    // Dynamic imports: const X = await import('...')
    const dynamicRe = /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?import\(/g;
    while ((m = dynamicRe.exec(content)) !== null) {
      imports.push(m[1]);
    }
    return new Set(imports);
  } catch {
    return new Set();
  }
}

async function main() {
  const files = listFiles();
  if (files.length === 0) {
    console.log('No .mjs/.js files found.');
    return;
  }

  // Collect all exports and imports
  const exportMap = new Map(); // { filePath: [{ name, type }] }
  const importMap = new Map(); // { filePath: Set<names> }

  await Promise.all(
    files.map(async (f) => {
      exportMap.set(f, await extractExports(f));
      importMap.set(f, await extractImports(f));
    })
  );

  // Build global import set (all names imported across all files)
  const allImports = new Set();
  for (const names of importMap.values()) {
    for (const n of names) allImports.add(n);
  }

  // Find dead exports: exported but never imported anywhere
  const deadExports = [];
  for (const [file, exports] of exportMap) {
    for (const { name, type } of exports) {
      if (type === 'default') continue; // skip default (hard to track)
      if (!allImports.has(name)) {
        deadExports.push({ file, name, type });
      }
    }
  }

  if (deadExports.length === 0) {
    console.log(`Dead export check passed: ${files.length} files scanned, 0 dead exports.`);
    return;
  }

  console.log(`Dead export check: ${deadExports.length} potentially unused export(s) in ${files.length} files:`);
  console.log('');
  const byFile = new Map();
  for (const { file, name, type } of deadExports) {
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push({ name, type });
  }
  for (const [file, exports] of byFile) {
    console.log(`  ${file}:`);
    for (const { name, type } of exports) {
      console.log(`    - ${name} (${type})`);
    }
  }
  console.log('');
  console.log('These are exported but never imported by any file in the repo.');
  console.log('They may be legitimate (re-exported via dynamic imports, used by external consumers).');
}

main();
