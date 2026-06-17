#!/usr/bin/env node
/**
 * runtime-snapshot.mjs — Manage event log snapshots
 *
 * Commands:
 *   create        Create a new snapshot from current event + store state
 *   list          List available snapshots
 *   latest        Show the most recent snapshot
 *   cleanup       Remove old snapshots and events
 *   remove-old    Remove snapshots beyond a keep count
 */

import { existsSync } from 'node:fs';
import { createStore, readJson, emptyCollection } from '../runtime/core/fs-store.mjs';
import {
  listEvents,
  createSnapshot,
  listSnapshots,
  latestSnapshot,
  cleanupEvents,
  removeSnapshots,
} from '../runtime/core/events.mjs';

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
  console.error('usage: node scripts/runtime-snapshot.mjs <command> [options]');
  console.error();
  console.error('Commands:');
  console.error('  create            Create a snapshot from current event log + store state');
  console.error('  list              List available snapshots');
  console.error('  latest            Show the most recent snapshot');
  console.error('  cleanup           Remove old events (preserves keep-last count)');
  console.error('  remove-old        Remove old snapshots (preserves keep-last count)');
  console.error();
  console.error('Options:');
  console.error('  --keep-last <n>   Number of snapshots/events to keep (default: 5 for snapshots, 1000 for events)');
  process.exit(1);
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const cmd = flags._positional?.[0];
  if (!cmd || !['create', 'list', 'latest', 'cleanup', 'remove-old'].includes(cmd)) usage();

  const store = createStore(process.cwd());
  const taskStore = createStore(process.cwd());
  const sessionStore = createStore(process.cwd());
  const teamStore = createStore(process.cwd());

  switch (cmd) {
    case 'create': {
      // Gather current state from all stores
      const tasks = (await readJson(taskStore, 'tasks.json', emptyCollection('tasks'))).items || [];
      const sessions = (await readJson(sessionStore, 'sessions.json', emptyCollection('sessions'))).items || [];
      const teams = (await readJson(teamStore, 'teams.json', emptyCollection('teams'))).items || [];

      const state = {
        tasks: Object.fromEntries(tasks.map((t) => [t.id, t])),
        sessions: Object.fromEntries(sessions.map((s) => [s.id, s])),
        teams: Object.fromEntries(teams.map((t) => [t.id, t])),
      };

      const snapshot = await createSnapshot(store, state);
      console.log(JSON.stringify({
        ok: true,
        snapshot: {
          id: snapshot.id,
          createdAt: snapshot.createdAt,
          lastEventId: snapshot.lastEventId,
          eventCount: snapshot.eventCount,
        },
      }, null, 2));
      return;
    }
    case 'list': {
      const snapshots = await listSnapshots(store);
      console.log(JSON.stringify(snapshots.map((s) => ({
        id: s.id,
        createdAt: s.createdAt,
        lastEventId: s.lastEventId,
        eventCount: s.eventCount,
      })), null, 2));
      return;
    }
    case 'latest': {
      const snapshot = await latestSnapshot(store);
      if (!snapshot) {
        console.log(JSON.stringify({ ok: true, snapshot: null }));
      } else {
        console.log(JSON.stringify({ ok: true, snapshot }, null, 2));
      }
      return;
    }
    case 'cleanup': {
      const keepLast = Number.isInteger(Number(flags['keep-last'])) ? Number(flags['keep-last']) : 1000;
      const result = await cleanupEvents(store, { keepLast });
      console.log(JSON.stringify({ ok: true, ...result }, null, 2));
      return;
    }
    case 'remove-old': {
      const keepLast = Number.isInteger(Number(flags['keep-last'])) ? Number(flags['keep-last']) : 5;
      const result = await removeSnapshots(store, { keepLast });
      console.log(JSON.stringify({ ok: true, ...result }, null, 2));
      return;
    }
  }
}

main().catch((err) => {
  console.error('Snapshot command failed:', err.message);
  process.exit(1);
});
