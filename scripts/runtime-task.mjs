#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import {
  createTask,
  listTasks,
  updateTaskStatus,
  nextReadyTask,
  importTasksFromMarkdown,
  claimTask,
  releaseTask,
  heartbeatTask,
  renewTaskLease,
  listExpiredClaims,
  cancelExpiredClaims
} from '../runtime/tasks/task-store.mjs';

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

function usage() {
  console.error('usage: runtime-task <create|list|status|next|import|claim|release|heartbeat|renew|list-expired|cancel-expired> [args] [--title --description --owner --phase --priority --dependsOn --parentTaskId --actor --id --to --reason --file --ttl --force]');
  console.error('  claim <task-id> [claimer] [--ttl 300] [--force]');
  console.error('  release <task-id>');
  console.error('  heartbeat <task-id> [ttl]');
  console.error('  renew <task-id> [extra-ttl]');
  console.error('  list-expired');
  console.error('  cancel-expired');
}

function requireArg(value, name) {
  if (!value) throw new Error(`missing required argument: ${name}`);
  return value;
}

function parsePositiveNumber(value, name, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} must be a positive number`);
  return n;
}

const { positionals, flags } = parseArgs(process.argv.slice(2));
const store = createStore(process.cwd());
const cmd = positionals[0];

try {
  if (cmd === 'create') console.log(JSON.stringify(await createTask(store, { title: flags.title, description: flags.description, owner: flags.owner, phase: flags.phase, priority: flags.priority, dependsOn: flags.dependsOn ? String(flags.dependsOn).split(',') : [], parentTaskId: flags.parentTaskId, actor: flags.actor }), null, 2));
  else if (cmd === 'list') console.log(JSON.stringify(await listTasks(store), null, 2));
  else if (cmd === 'status') {
    const actor = flags.actor || 'cli';
    const blockedReason = flags.reason || null;
    console.log(JSON.stringify(await updateTaskStatus(store, flags.id, flags.to, { actor, blockedReason }), null, 2));
  }
  else if (cmd === 'next') console.log(JSON.stringify(await nextReadyTask(store), null, 2));
  else if (cmd === 'import') console.log(JSON.stringify(await importTasksFromMarkdown(store, flags.file), null, 2));
  else if (cmd === 'claim') {
    const id = requireArg(positionals[1], 'task-id');
    const claimer = positionals[2] || flags.actor || 'cli';
    const ttl = parsePositiveNumber(flags.ttl, 'ttl', 300);
    console.log(JSON.stringify(await claimTask(store, id, claimer, { ttl, force: flags.force === true, actor: flags.actor || claimer }), null, 2));
  }
  else if (cmd === 'release') {
    const id = requireArg(positionals[1], 'task-id');
    console.log(JSON.stringify(await releaseTask(store, id, { actor: flags.actor || 'cli' }), null, 2));
  }
  else if (cmd === 'heartbeat') {
    const id = requireArg(positionals[1], 'task-id');
    const ttl = parsePositiveNumber(positionals[2], 'ttl', 300);
    console.log(JSON.stringify(await heartbeatTask(store, id, ttl), null, 2));
  }
  else if (cmd === 'renew') {
    const id = requireArg(positionals[1], 'task-id');
    const extraTtl = parsePositiveNumber(positionals[2], 'extra-ttl', 300);
    console.log(JSON.stringify(await renewTaskLease(store, id, extraTtl), null, 2));
  }
  else if (cmd === 'list-expired') console.log(JSON.stringify(await listExpiredClaims(store), null, 2));
  else if (cmd === 'cancel-expired') console.log(JSON.stringify(await cancelExpiredClaims(store), null, 2));
  else { usage(); process.exit(1); }
} catch (err) {
  console.error(JSON.stringify({ error: err.message, code: err.code, details: err.details }, null, 2));
  process.exit(1);
}
