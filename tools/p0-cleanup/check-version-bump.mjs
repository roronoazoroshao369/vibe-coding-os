#!/usr/bin/env node
/**
 * check-version-bump.mjs — Version-freeze guard (P0).
 *
 * Fails (exit 1) if package.json "version" changed in the working diff
 * against a base ref, UNLESS at least one user-facing path also changed.
 *
 * User-facing paths that justify a bump:
 *   skills/ commands/ adapters/ schemas/ runtime/ registry/ packs/
 *
 * Usage:
 *   node tools/p0-cleanup/check-version-bump.mjs [baseRef]
 *   baseRef defaults to "origin/main" then "HEAD~1".
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const USER_FACING = [
  'skills/', 'commands/', 'adapters/', 'schemas/',
  'runtime/', 'registry/', 'packs/',
];

function sh(cmd) {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); }
  catch { return ''; }
}

function resolveBase(arg) {
  if (arg) return arg;
  if (sh('git rev-parse --verify origin/main 2>/dev/null')) return 'origin/main';
  return 'HEAD~1';
}

const base = resolveBase(process.argv[2]);
const changed = sh(`git diff --name-only ${base}...HEAD`).split('\n').filter(Boolean);

if (changed.length === 0) {
  console.log('version-freeze: no changes vs', base, '- OK');
  process.exit(0);
}

// Did package.json version change?
let versionChanged = false;
try {
  const oldPkg = JSON.parse(sh(`git show ${base}:package.json`) || '{}');
  const newPkg = JSON.parse(readFileSync('package.json', 'utf8'));
  versionChanged = oldPkg.version !== newPkg.version;
} catch { /* if package.json unreadable at base, treat as no change */ }

if (!versionChanged) {
  console.log('version-freeze: version unchanged - OK');
  process.exit(0);
}

const hasUserFacing = changed.some((f) => USER_FACING.some((p) => f.startsWith(p)));

if (hasUserFacing) {
  console.log('version-freeze: version bumped with user-facing changes - OK');
  process.exit(0);
}

console.error('version-freeze: FAIL');
console.error('  package.json version changed, but no user-facing files changed.');
console.error('  Cleanup/docs/CI commits must NOT bump the version.');
console.error('  Changed files:');
for (const f of changed) console.error('    ' + f);
process.exit(1);
