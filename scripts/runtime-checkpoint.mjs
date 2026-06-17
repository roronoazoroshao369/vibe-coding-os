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
if (cmd === 'create') console.log(JSON.stringify(await createCheckpoint(store, { type: flags.type, result: flags.result, subject: flags.subject, subjectType: flags.subjectType, subjectId: flags.subjectId, notes: flags.notes, status: flags.status, command: flags.command, phase: flags.phase, created_by: flags.created_by }), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listCheckpoints(store), null, 2));
else { console.error('usage: runtime-checkpoint <create|list> [--type --result --subject --subjectType --subjectId --notes --status --command --phase --created_by]'); process.exit(1); }
