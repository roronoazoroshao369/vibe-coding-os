#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const VERSION = readFileSync(join(__dirname, '..', 'package.json'), 'utf8').match(/"version"\s*:\s*"([^"]+)"/)?.[1] || '0.0.0';

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
if (flags.help || flags.h || positionals[0] === 'help') { console.error('usage: runtime-session <create|list> [--goal --summary --status]'); process.exit(0); }
if (flags.version || flags.V) { console.log(VERSION); process.exit(0); }
const store = createStore(process.cwd());
const cmd = positionals[0];
if (cmd === 'create') console.log(JSON.stringify(await createSession(store, { goal: flags.goal, summary: flags.summary, status: flags.status || 'active' }), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listSessions(store), null, 2));
else { console.error('usage: runtime-session <create|list> [--goal --summary --status]'); process.exit(1); }
