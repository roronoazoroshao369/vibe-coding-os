#!/usr/bin/env node
import { parseArgs, packageVersion } from './cli-helpers.mjs';
import { createStore } from '../runtime/core/fs-store.mjs';
import { importTeamSpec, listTeams } from '../runtime/teams/team-store.mjs';

const usage = 'usage: runtime-team <import|list> [path|--file]';
const { positionals, flags } = parseArgs(process.argv.slice(2));
if (flags.help || positionals[0] === 'help') { console.error(usage); process.exit(0); }
if (flags.version || flags.V) { console.log(packageVersion()); process.exit(0); }
const store = createStore(process.cwd());
const cmd = positionals[0];
if (cmd === 'import') console.log(JSON.stringify(await importTeamSpec(store, positionals[1] || flags.file), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listTeams(store), null, 2));
else { console.error(usage); process.exit(1); }
