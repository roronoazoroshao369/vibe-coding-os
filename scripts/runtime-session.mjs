#!/usr/bin/env node
import { parseArgs, packageVersion } from './cli-helpers.mjs';
import { createStore } from '../runtime/core/fs-store.mjs';
import { createSession, listSessions } from '../runtime/sessions/session-store.mjs';

const usage = 'usage: runtime-session <create|list> [--goal --summary --status]';
const { positionals, flags } = parseArgs(process.argv.slice(2));
if (flags.help || positionals[0] === 'help') { console.error(usage); process.exit(0); }
if (flags.version || flags.V) { console.log(packageVersion()); process.exit(0); }
const store = createStore(process.cwd());
const cmd = positionals[0];
if (cmd === 'create') console.log(JSON.stringify(await createSession(store, { goal: flags.goal, summary: flags.summary, status: flags.status || 'active' }), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listSessions(store), null, 2));
else { console.error(usage); process.exit(1); }
