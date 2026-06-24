#!/usr/bin/env node
// scripts/validate-no-deprecated-commands.mjs
// Fails CI if any non-deprecation file references deprecated/orphan command names.
//
// Deprecated: vibe-specify (replaced by vibe-spec)
// Orphan:     vibe-parallel-explore (replaced by vibe-flow)
//
// Whitelisted files (where the deprecated/orphan name is EXPECTED):
//   - the deprecation shim files themselves (vibe-specify.md, vibe-parallel-explore.md)
//   - historical changelogs
//   - historical council reports
//
// v2.17.4 — added to prevent recurrence of T1.2 stale-reference class

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, relative, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

const DEPRECATED = ['vibe-specify', 'vibe-parallel-explore'];
const SHIM_FILES = new Set([
  'commands/vibe-specify.md',
  'commands/vibe-parallel-explore.md',
]);
// Paths where deprecated names are LEGITIMATE (historical records)
const ALLOWLIST_DIRS = [
  'docs/reports/council/',         // historical council reports
  'docs/reports/audits/',          // audit reports
  'docs/archive/',                 // historical roadmap/release snapshots
  'docs/plans/historical/',        // superseded implementation plans
  'CHANGELOG.md',                  // changelog history
  '.vibe/',                        // runtime state (gitignored anyway)
  'node_modules/',
];
// The deprecated name in registry/prompts.json is OK as a tagged-deprecation marker
const ALLOWLIST_FILES = [
  'registry/prompts.json',
  'README.md',          // line 34 documents the deprecation in v2.17.0 release notes (historical)
];

import { readdir, stat } from 'node:fs/promises';

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.name === 'node_modules' || e.name === '.git' || e.name === '.vibe') continue;
    if (e.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const targets = ['commands/', 'skills/', '.claude-plugin/', 'CLAUDE.md', 'README.md', 'README.vi.md', 'AGENTS.md', 'templates/manifest.json', 'commands/manifest.json', 'docs/'];

let findings = [];

for (const target of targets) {
  const full = join(root, target);
  let files = [];
  try {
    const s = await stat(full);
    if (s.isDirectory()) {
      for await (const f of walk(full)) {
        if (f.endsWith('.md') || f.endsWith('.json') || f === join(root, 'CLAUDE.md') || f === join(root, 'README.md') || f === join(root, 'README.vi.md') || f === join(root, 'AGENTS.md')) {
          files.push(f);
        }
      }
    } else {
      files.push(full);
    }
  } catch {
    continue; // path doesn't exist
  }

  for (const file of files) {
    const rel = relative(root, file);
    if (SHIM_FILES.has(rel)) continue;
    if (ALLOWLIST_DIRS.some(d => rel.startsWith(d))) continue;
    if (ALLOWLIST_FILES.includes(rel)) continue;

    const content = await readFile(file, 'utf8');
    for (const dep of DEPRECATED) {
      // Match the deprecated name as a command reference: backtick-wrapped, "vibe-X" pattern, or in a handoff list
      const patterns = [
        new RegExp('`' + dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`', 'g'),
        new RegExp('commands/' + dep + '\\.md', 'g'),
        new RegExp('"' + dep + '"', 'g'),
      ];
      for (const re of patterns) {
        const matches = content.match(re);
        if (matches) {
          findings.push({ file: rel, name: dep, count: matches.length });
        }
      }
    }
  }
}

if (findings.length === 0) {
  console.log('[validate-no-deprecated-commands] PASSED: 0 stale references to deprecated/orphan command names.');
  process.exit(0);
}

console.log('[validate-no-deprecated-commands] FAILED:');
for (const f of findings) {
  console.log(`  ${f.file}: ${f.count}× reference to ${f.name}`);
}
console.log(`\nTotal: ${findings.length} stale references.`);
console.log('Fix: replace deprecated names with their replacements:');
console.log('  vibe-specify        → vibe-spec');
console.log('  vibe-parallel-explore → vibe-flow');
console.log('Or add the file to ALLOWLIST_FILES / ALLOWLIST_DIRS if the reference is intentional.');
process.exit(1);
