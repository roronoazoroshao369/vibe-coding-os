#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { createSession, listSessions } from '../runtime/sessions/session-store.mjs';
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
if (cmd === 'create') console.log(JSON.stringify(await createSession(store, { goal: flags.goal, summary: flags.summary, status: flags.status || 'active' }), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listSessions(store), null, 2));
else { console.error('usage: runtime-session <create|list> [--goal --summary --status]'); process.exit(1); }
