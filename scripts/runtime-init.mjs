#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createStore, ensureRuntime, writeJsonAtomic, emptyCollection } from '../runtime/core/fs-store.mjs';
import { appendEvent } from '../runtime/core/events.mjs';
function parseArgs(argv) {
  const positionals = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else positionals.push(a);
  }
  return { positionals, flags };
}

const { flags } = parseArgs(process.argv.slice(2));
const store = createStore(process.cwd());
await ensureRuntime(store);
const collections = ['tasks', 'memory', 'checkpoints', 'teams', 'sessions', 'workflow-runs', 'actions'];
for (const kind of collections) {
  const file = `${kind}.json`;
  if (!existsSync(path.join(store.runtimeDir, file)) || flags.force) {
    await writeJsonAtomic(store, file, emptyCollection(kind));
  }
}
const configTemplate = path.join(process.cwd(), 'templates', 'runtime-config-template.json');
const configTarget = path.join(store.runtimeDir, 'config.json');
if ((!existsSync(configTarget) || flags.force) && existsSync(configTemplate)) {
  await writeFile(configTarget, await readFile(configTemplate, 'utf8'), 'utf8');
}
await appendEvent(store, 'runtime.init', { force: Boolean(flags.force) });
console.log(`Runtime initialized at ${path.relative(process.cwd(), store.runtimeDir)}`);
