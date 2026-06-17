#!/usr/bin/env node
import { createStore, ensureRuntime, readJson, writeJsonAtomic, emptyCollection } from '../runtime/core/fs-store.mjs';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';
function parseArgs(argv) {
  const positionals = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { flags.help = true; continue; }
    if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else positionals.push(a);
  }
  return { positionals, flags };
}
const USAGE = `workflow-status — manage workflow runs

Usage:
  workflow-status init [--id ID] [--workflow NAME]
  workflow-status status [--id ID]
  workflow-status advance [--id ID] [--actor ACTOR] [--phase PHASE] [--details JSON]
  workflow-status block  [--id ID] [--actor ACTOR] [--reason REASON]
  workflow-status complete [--id ID] [--actor ACTOR] [--result RESULT]
  workflow-status list
  workflow-status --help`;
const { positionals, flags } = parseArgs(process.argv.slice(2));
if (flags.help) { console.log(USAGE); process.exit(0); }
const store = createStore(process.cwd());
await ensureRuntime(store);
const cmd = positionals[0];
function now() { return new Date().toISOString(); }
async function loadWrapper() {
  let w = await readJson(store, 'workflow-runs.json', null);
  if (!w || !Array.isArray(w.items)) w = emptyCollection('workflow-runs');
  return w;
}
async function findRun(id) {
  const w = await loadWrapper();
  return w.items.find((r) => r.id === id) || null;
}
async function loadRuns() { return (await loadWrapper()).items; }
async function saveWrapper(w) { await writeJsonAtomic(store, 'workflow-runs.json', w); }
function record(item, event, actor, details) {
  if (!Array.isArray(item.history)) item.history = [];
  item.history.push({ event, timestamp: now(), actor: actor || 'cli', details: details || {} });
  item.updatedAt = now();
}
if (cmd === 'init') {
  const w = await loadWrapper();
  const id = flags.id || `wf-${Date.now()}`;
  const run = { id, workflow: flags.workflow || 'default', status: 'pending', phase: 'init', history: [], createdAt: now(), updatedAt: now(), schemaVersion: CURRENT_SCHEMA_VERSION };
  record(run, 'init', 'cli', { workflow: run.workflow });
  w.items.push(run);
  await saveWrapper(w);
  console.log(JSON.stringify(run, null, 2));
} else if (cmd === 'status') {
  if (!flags.id) { const runs = await loadRuns(); console.log(JSON.stringify(runs.map((r) => ({ id: r.id, status: r.status, phase: r.phase })), null, 2)); }
  else { const run = await findRun(flags.id); if (!run) { console.error(`Run ${flags.id} not found`); process.exit(1); } console.log(JSON.stringify(run, null, 2)); }
} else if (cmd === 'advance') {
  if (!flags.id) { console.error('--id required'); process.exit(1); }
  const w = await loadWrapper(); const idx = w.items.findIndex((r) => r.id === flags.id);
  if (idx === -1) { console.error(`Run ${flags.id} not found`); process.exit(1); }
  const run = w.items[idx]; run.status = 'running'; run.phase = flags.phase || run.phase;
  record(run, 'advance', flags.actor, flags.details ? JSON.parse(flags.details) : {});
  await saveWrapper(w); console.log(JSON.stringify(run, null, 2));
} else if (cmd === 'block') {
  if (!flags.id) { console.error('--id required'); process.exit(1); }
  const w = await loadWrapper(); const idx = w.items.findIndex((r) => r.id === flags.id);
  if (idx === -1) { console.error(`Run ${flags.id} not found`); process.exit(1); }
  const run = w.items[idx]; run.status = 'blocked';
  record(run, 'block', flags.actor, { reason: flags.reason || '' });
  await saveWrapper(w); console.log(JSON.stringify(run, null, 2));
} else if (cmd === 'complete') {
  if (!flags.id) { console.error('--id required'); process.exit(1); }
  const w = await loadWrapper(); const idx = w.items.findIndex((r) => r.id === flags.id);
  if (idx === -1) { console.error(`Run ${flags.id} not found`); process.exit(1); }
  const run = w.items[idx]; run.status = 'completed';
  record(run, 'complete', flags.actor, { result: flags.result || '' });
  await saveWrapper(w); console.log(JSON.stringify(run, null, 2));
} else if (cmd === 'list') {
  const runs = await loadRuns();
  console.log(JSON.stringify(runs.map((r) => ({ id: r.id, status: r.status, phase: r.phase })), null, 2));
} else { console.log(USAGE); process.exit(cmd ? 1 : 0); }
