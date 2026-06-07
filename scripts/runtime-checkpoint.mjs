#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { createCheckpoint, listCheckpoints } from '../runtime/checkpoints/checkpoint-engine.mjs';
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
if (cmd === 'create') console.log(JSON.stringify(await createCheckpoint(store, { type: flags.type, result: flags.result, subject: flags.subject, notes: flags.notes }), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listCheckpoints(store), null, 2));
else { console.error('usage: runtime-checkpoint <create|list> [--type --result --subject --notes]'); process.exit(1); }
