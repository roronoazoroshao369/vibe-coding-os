#!/usr/bin/env node
/**
 * runtime-events.mjs — Event log management CLI
 *
 * Commands:
 *   list          List all events from the event log
 *   tail          Show the last N events (default: 10)
 *   clear         Clear the event log (destructive!)
 *   count         Count total events
 *   export        Export all events as JSON array to stdout
 */

import { existsSync } from 'node:fs';
import { createStore } from '../runtime/core/fs-store.mjs';
import { listEvents, clearEvents } from '../runtime/core/events.mjs';

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else {
      flags._positional = flags._positional || [];
      flags._positional.push(a);
    }
  }
  return flags;
}

function usage() {
  console.error('usage: node scripts/runtime-events.mjs <command> [options]');
  console.error();
  console.error('Commands:');
  console.error('  list            List all events from the event log');
  console.error('  tail [--last n] Show the last N events (default: 10)');
  console.error('  clear           Clear the event log (destructive!)');
  console.error('  count           Count total events');
  console.error('  export          Export all events as JSON array to stdout');
  process.exit(1);
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const cmd = flags._positional?.[0];
  if (!cmd || !['list', 'tail', 'clear', 'count', 'export'].includes(cmd)) usage();

  const store = createStore(process.cwd());

  switch (cmd) {
    case 'list': {
      const events = await listEvents(store);
      console.log(JSON.stringify(events, null, 2));
      return;
    }
    case 'tail': {
      const last = Number(flags.last) || 10;
      const events = await listEvents(store);
      const tail = events.slice(-last);
      console.log(JSON.stringify(tail, null, 2));
      return;
    }
    case 'clear': {
      await clearEvents(store);
      console.log(JSON.stringify({ ok: true, message: 'Event log cleared' }));
      return;
    }
    case 'count': {
      const events = await listEvents(store);
      console.log(JSON.stringify({ count: events.length }));
      return;
    }
    case 'export': {
      const events = await listEvents(store);
      // Output as newline-delimited JSON for easy piping
      for (const event of events) {
        console.log(JSON.stringify(event));
      }
      return;
    }
  }
}

main().catch((err) => {
  console.error('Events command failed:', err.message);
  process.exit(1);
});
