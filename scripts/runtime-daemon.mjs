#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { runDaemon, stopDaemon, readStatus } from '../runtime/daemon/daemon.mjs';

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

const { positionals, flags } = parseArgs(process.argv.slice(2));
const store = createStore(process.cwd());
const cmd = positionals[0];

if (cmd === 'start') {
  const result = await runDaemon(store, {
    intervalMs: flags.interval ? Number(flags.interval) : undefined,
    maxIterations: flags.maxIterations ? Number(flags.maxIterations) : undefined
  });
  console.log(JSON.stringify(result, null, 2));
} else if (cmd === 'stop') {
  console.log(JSON.stringify(await stopDaemon(store), null, 2));
} else if (cmd === 'status') {
  console.log(JSON.stringify(await readStatus(store), null, 2));
} else {
  console.error('usage: runtime-daemon <start|stop|status> [--interval ms --maxIterations n]');
  process.exit(1);
}
