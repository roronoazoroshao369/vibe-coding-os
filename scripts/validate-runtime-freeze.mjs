#!/usr/bin/env node
// validate-runtime-freeze.mjs — enforce ADR 0002 runtime scope freeze

import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RUNTIME_DIR = join(ROOT, 'runtime');
const SCRIPTS_DIR = join(ROOT, 'scripts');
const PKG_PATH = join(ROOT, 'package.json');
const ALLOWLIST_PATH = join(ROOT, 'registry', 'runtime-freeze-allowlist.json');

let failures = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  failures++;
}

function warn(msg) {
  console.log(`  ⚠️ ${msg}`);
  warnings++;
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

function parseList(value) {
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  return [];
}

async function loadAllowlist() {
  const text = await readFile(ALLOWLIST_PATH, 'utf8');
  const data = JSON.parse(text);
  return {
    allowedRuntimeTopLevelDirs: parseList(data.allowedRuntimeTopLevelDirs),
    allowedRuntimeScripts: parseList(data.allowedRuntimeScripts),
    allowedPackageScripts: parseList(data.allowedPackageScripts)
  };
}

async function listTopLevelEntries(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.map(entry => entry.name);
}

async function main() {
  console.log('=== Runtime Freeze Validation (ADR 0002) ===');
  console.log('');

  if (!existsSync(ALLOWLIST_PATH)) {
    fail(`Allowlist not found at ${ALLOWLIST_PATH}`);
    console.log('');
    console.log(`Overall: ${failures} failure(s), ${warnings} warning(s)`);
    process.exit(1);
  }

  const allowlist = await loadAllowlist();
  const pkg = JSON.parse(await readFile(PKG_PATH, 'utf8'));

  // runtime/* top-level entries
  const runtimeEntries = await listTopLevelEntries(RUNTIME_DIR);
  const runtimeViolations = runtimeEntries.filter(name => !allowlist.allowedRuntimeTopLevelDirs.includes(name));
  if (runtimeViolations.length === 0) {
    pass('runtime/ top-level entries are within the frozen allowlist');
  } else {
    for (const name of runtimeViolations) {
      fail(`runtime/${name} is not in the frozen allowlist`);
    }
  }

  // scripts/runtime-*.mjs
  const scriptEntries = existsSync(SCRIPTS_DIR)
    ? (await readdir(SCRIPTS_DIR, { withFileTypes: true }))
        .filter(entry => entry.isFile() && /^runtime-.*\.mjs$/.test(entry.name))
        .map(entry => entry.name)
    : [];
  const scriptViolations = scriptEntries.filter(name => !allowlist.allowedRuntimeScripts.includes(name));
  if (scriptViolations.length === 0) {
    pass('scripts/runtime-*.mjs are within the frozen allowlist');
  } else {
    for (const name of scriptViolations) {
      fail(`scripts/${name} is not in the frozen allowlist`);
    }
  }

  // package.json runtime scripts
  const pkgScriptNames = Object.keys(pkg.scripts ?? {}).filter(name => name.startsWith('runtime:'));
  const pkgViolations = pkgScriptNames.filter(name => !allowlist.allowedPackageScripts.includes(name));
  if (pkgViolations.length === 0) {
    pass('package.json runtime scripts are within the frozen allowlist');
  } else {
    for (const name of pkgViolations) {
      fail(`package.json script "${name}" is not in the frozen allowlist`);
    }
  }

  console.log('');
  console.log(`Overall: ${failures} failure(s), ${warnings} warning(s)`);
  if (failures > 0) process.exit(1);
}

await main();
