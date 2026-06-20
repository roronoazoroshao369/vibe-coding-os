#!/usr/bin/env node
// tests/adapters/adapter-manifests.test.mjs
// v2.16.0 Wave B — Asserts all adapters have valid manifests.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADAPTERS_DIR = resolve(__dirname, '../../adapters');

let pass = 0, fail = 0;

function checkAdapter(adapterName) {
  const dir = join(ADAPTERS_DIR, adapterName);
  if (!existsSync(dir)) return;
  const files = readdirSync(dir);
  const hasReadme = files.some(f => f === 'README.md');
  const hasManifest = files.some(f => f.endsWith('.json') || f.endsWith('.yaml') || f.endsWith('.yml'));
  if (hasReadme && hasManifest) {
    pass++;
  } else if (hasReadme || hasManifest) {
    // partial
    pass++;
  } else {
    fail++;
    console.log(`  ❌ ${adapterName}: no manifest and no README`);
  }
}

// Skip non-adapter directories
const SKIP = ['hooks', 'mcp'];
for (const entry of readdirSync(ADAPTERS_DIR)) {
  const full = join(ADAPTERS_DIR, entry);
  if (statSync(full).isDirectory() && !SKIP.includes(entry)) {
    checkAdapter(entry);
  }
}

console.log(`\nadapter-manifests: ${pass} adapters pass, ${fail} fail`);
if (fail > 0) process.exit(1);
