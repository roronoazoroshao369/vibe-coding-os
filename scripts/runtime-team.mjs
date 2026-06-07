#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { importTeamSpec, listTeams } from '../runtime/teams/team-store.mjs';
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
if (cmd === 'import') console.log(JSON.stringify(await importTeamSpec(store, positionals[1] || flags.file), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listTeams(store), null, 2));
else { console.error('usage: runtime-team <import|list> [path|--file]'); process.exit(1); }
