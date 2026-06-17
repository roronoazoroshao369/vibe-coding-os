#!/usr/bin/env node
/**
 * runtime-log.mjs — CLI for execution trace logging
 *
 * Commands:
 *   log <id> <tool> <timestamp>  Append an action to .omc/runtime/actions.json
 *   list [--limit N]             Show recent actions
 *   clear                        Reset actions collection
 *
 * Options:
 *   --help                       Show usage information
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createStore, ensureRuntime, writeJsonAtomic, emptyCollection } from '../runtime/core/fs-store.mjs';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';

function parseArgs(argv) {
  const positionals = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help') { flags.help = true; }
    else if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else positionals.push(a);
  }
  return { positionals, flags };
}

function usage() {
  console.log(`
Usage: runtime-log <command> [options]

Commands:
  log <id> <tool> <timestamp>     Append an action to the trace log
  list [--limit N]                Show recent actions (default: 10)
  clear                           Reset the actions collection

Options:
  --help                          Show this message
`.trim());
}

const { positionals, flags } = parseArgs(process.argv.slice(2));

if (flags.help || positionals.length === 0) {
  usage();
  process.exit(0);
}

const cmd = positionals[0];
const store = createStore(process.cwd());
const actionsFile = 'actions.json';

async function readActions() {
  const fp = path.join(store.runtimeDir, actionsFile);
  if (!existsSync(fp)) return emptyCollection('actions');
  try {
    const raw = await readFile(fp, 'utf8');
    const data = JSON.parse(raw);
    if (data && data.kind === 'actions' && Array.isArray(data.items)) return data;
    return emptyCollection('actions');
  } catch {
    return emptyCollection('actions');
  }
}

if (cmd === 'log') {
  if (positionals.length < 4) {
    console.error('Usage: runtime-log log <id> <tool> <timestamp>');
    process.exit(1);
  }
  const [, id, tool, timestamp] = positionals;
  const action = { id, tool, timestamp };
  if (flags.command) action.command = flags.command;
  if (flags.cwd) action.cwd = flags.cwd;
  if (flags.exitCode !== undefined) action.exit_code = Number(flags.exitCode);
  if (flags.riskLevel) action.risk_level = flags.riskLevel;
  if (flags.sessionId) action.session_id = flags.sessionId;
  if (flags.outputSnippet) action.output_snippet = flags.outputSnippet;
  if (flags.metadata) {
    try { action.metadata = JSON.parse(flags.metadata); } catch { action.metadata = {}; }
  }

  await ensureRuntime(store);
  const coll = await readActions();
  coll.items.push(action);
  await writeJsonAtomic(store, actionsFile, coll);
  console.log(`Logged action ${id}`);
} else if (cmd === 'list') {
  const coll = await readActions();
  const limit = Number(flags.limit) || 10;
  const items = coll.items.slice(-limit).reverse();
  if (items.length === 0) {
    console.log('No actions logged.');
  } else {
    for (const a of items) {
      const line = [a.timestamp, a.tool, a.id].filter(Boolean).join(' | ');
      console.log(`  ${line}`);
    }
  }
} else if (cmd === 'clear') {
  await ensureRuntime(store);
  await writeJsonAtomic(store, actionsFile, emptyCollection('actions'));
  console.log('Actions collection cleared.');
} else {
  console.error(`Unknown command: ${cmd}`);
  usage();
  process.exit(1);
}
