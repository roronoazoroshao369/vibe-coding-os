#!/usr/bin/env node
/**
 * runtime-audit.mjs — Safety audit command (P1.9)
 *
 * Lists all actions/approvals with their outcomes, reports denied operations
 * and risk levels, and shows active dangerous tasks.
 *
 * Usage:
 *   node scripts/runtime-audit.mjs [--json] [--root <dir>]
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from '../runtime/core/fs-store.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolveProjectRoot(process.argv);

function resolveProjectRoot(argv) {
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) return argv[i + 1];
  }
  return process.cwd();
}

function parseJSON(p, fallback) {
  if (!existsSync(p)) return fallback;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fallback; }
}

function readLines(p) {
  if (!existsSync(p)) return [];
  try {
    return readFileSync(p, 'utf8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
}

const store = createStore(ROOT);
const runtimeDir = store.runtimeDir;

// ── Load data ──

const tasks = parseJSON(join(runtimeDir, 'tasks.json'), { items: [] });
const approvals = parseJSON(join(runtimeDir, 'approvals.json'), { items: [] });
const actions = parseJSON(join(runtimeDir, 'actions.json'), { items: [] });
const events = readLines(join(runtimeDir, 'events.jsonl'));

const taskItems = tasks.items || [];
const approvalItems = approvals.items || [];
const actionItems = actions.items || [];

// ── Summaries ──

const taskStatusCounts = {};
for (const t of taskItems) {
  const s = t.status || 'unknown';
  taskStatusCounts[s] = (taskStatusCounts[s] || 0) + 1;
}

const approvalStatusCounts = {};
for (const a of approvalItems) {
  const s = a.approval?.status || 'unknown';
  approvalStatusCounts[s] = (approvalStatusCounts[s] || 0) + 1;
}

const actionOutcomeCounts = {};
for (const a of actionItems) {
  const s = a.result?.status || 'unknown';
  actionOutcomeCounts[s] = (actionOutcomeCounts[s] || 0) + 1;
}

const riskLevelCounts = {};
for (const a of actionItems) {
  const r = a.risk?.level || a.risk_level || 'unknown';
  riskLevelCounts[r] = (riskLevelCounts[r] || 0) + 1;
}

// ── Dangerous tasks ──

const DANGEROUS_RISK = new Set(['dangerous', 'blocked']);
const dangerousTasks = taskItems.filter((t) => {
  const risk = t.risk?.level;
  if (!risk) return false;
  if (DANGEROUS_RISK.has(risk)) return true;
  return false;
});
const activeDangerousTasks = dangerousTasks.filter(
  (t) => t.status !== 'completed' && t.status !== 'cancelled'
);

// ── Denied approvals ──

const deniedApprovals = approvalItems.filter((a) => a.approval?.status === 'denied');
const pendingApprovals = approvalItems.filter((a) => a.approval?.status === 'required');

// ── Failed / denied actions ──

const failedActions = actionItems.filter(
  (a) => a.result?.status === 'failed' || a.result?.status === 'cancelled'
);
const dangerousActions = actionItems.filter((a) => {
  const r = a.risk?.level || a.risk_level;
  return DANGEROUS_RISK.has(r);
});

// ── Event counts by type ──

const eventTypeCounts = {};
for (const e of events) {
  const t = e.type || 'unknown';
  eventTypeCounts[t] = (eventTypeCounts[t] || 0) + 1;
}

// ── Output ──

const jsonOutput = process.argv.includes('--json');

const audit = {
  timestamp: new Date().toISOString(),
  runtimeDir,
  summary: {
    tasks: {
      total: taskItems.length,
      statusCounts: taskStatusCounts,
    },
    approvals: {
      total: approvalItems.length,
      statusCounts: approvalStatusCounts,
    },
    actions: {
      total: actionItems.length,
      outcomeCounts: actionOutcomeCounts,
      riskLevelCounts,
    },
    events: {
      total: events.length,
      typeCounts: eventTypeCounts,
    },
  },
  dangerous: {
    taskCount: dangerousTasks.length,
    activeCount: activeDangerousTasks.length,
    activeTasks: activeDangerousTasks.map((t) => ({
      id: t.id,
      title: t.title,
      risk: t.risk?.level,
      status: t.status,
    })),
    actionCount: dangerousActions.length,
    dangerousActions: dangerousActions.map((a) => ({
      id: a.id,
      tool: a.tool,
      risk: a.risk?.level || a.risk_level,
      status: a.result?.status,
      timestamp: a.timestamp,
    })),
  },
  denials: {
    approvalCount: deniedApprovals.length,
    deniedApprovals: deniedApprovals.map((a) => ({
      id: a.id,
      action: a.metadata?.action,
      reason: a.approval?.reason,
      createdAt: a.createdAt,
    })),
    actionCount: failedActions.length,
    failedActions: failedActions.map((a) => ({
      id: a.id,
      tool: a.tool,
      status: a.result?.status,
      error: a.result?.errorSnippet,
      timestamp: a.timestamp,
    })),
  },
  pendingApprovals: pendingApprovals.map((a) => ({
    id: a.id,
    action: a.metadata?.action,
    riskLevel: a.riskLevel?.level,
    createdAt: a.createdAt,
  })),
};

if (jsonOutput) {
  process.stdout.write(JSON.stringify(audit, null, 2) + '\n');
  process.exit(0);
}

// ── Human-readable output ──

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

console.log(`\n${c.bold}${c.cyan}Safety Audit Report${c.reset}`);
console.log(`${c.dim}Runtime: ${runtimeDir}${c.reset}`);
console.log(`${c.dim}Time:   ${audit.timestamp}${c.reset}\n`);

// Tasks
console.log(`${c.bold}── Tasks ──${c.reset}`);
console.log(`  Total: ${taskItems.length}`);
for (const [s, n] of Object.entries(taskStatusCounts)) {
  const color = s === 'completed' ? c.green : s === 'blocked' ? c.red : c.yellow;
  console.log(`  ${color}${String(n).padStart(4)}${c.reset} ${s}`);
}
console.log('');

// Approvals
console.log(`${c.bold}── Approvals ──${c.reset}`);
console.log(`  Total: ${approvalItems.length}`);
for (const [s, n] of Object.entries(approvalStatusCounts)) {
  const color = s === 'approved' ? c.green : s === 'denied' ? c.red : c.yellow;
  console.log(`  ${color}${String(n).padStart(4)}${c.reset} ${s}`);
}
if (pendingApprovals.length > 0) {
  console.log(`\n  ${c.yellow}Pending approvals:${c.reset}`);
  for (const a of pendingApprovals) {
    console.log(`    ${c.yellow}•${c.reset} ${a.id} — ${a.metadata?.action || 'unknown'} (risk: ${a.riskLevel?.level || 'unknown'})`);
  }
}
console.log('');

// Actions
console.log(`${c.bold}── Actions ──${c.reset}`);
console.log(`  Total: ${actionItems.length}`);
for (const [s, n] of Object.entries(actionOutcomeCounts)) {
  const color = s === 'succeeded' ? c.green : s === 'failed' ? c.red : c.yellow;
  console.log(`  ${color}${String(n).padStart(4)}${c.reset} ${s}`);
}
console.log(`  ${c.dim}Risk levels:${c.reset}`);
for (const [r, n] of Object.entries(riskLevelCounts)) {
  const color = DANGEROUS_RISK.has(r) ? c.red : c.green;
  console.log(`    ${color}${String(n).padStart(4)}${c.reset} ${r}`);
}
console.log('');

// Dangerous items
console.log(`${c.bold}${c.red}── Dangerous Items ──${c.reset}`);
if (activeDangerousTasks.length > 0) {
  console.log(`  ${c.red}Active dangerous tasks: ${activeDangerousTasks.length}${c.reset}`);
  for (const t of activeDangerousTasks) {
    console.log(`    ${c.red}✗${c.reset} [${t.id}] ${t.title} (risk: ${t.risk?.level}, status: ${t.status})`);
  }
} else {
  console.log(`  ${c.green}No active dangerous tasks${c.reset}`);
}
if (dangerousActions.length > 0) {
  console.log(`  ${c.red}Dangerous actions: ${dangerousActions.length}${c.reset}`);
  for (const a of dangerousActions) {
    console.log(`    ${c.red}✗${c.reset} [${a.id}] ${a.tool} (risk: ${a.risk?.level || a.risk_level}, status: ${a.result?.status || 'unknown'})`);
  }
}
console.log('');

// Denied operations
console.log(`${c.bold}${c.red}── Denied Operations ──${c.reset}`);
if (deniedApprovals.length > 0) {
  console.log(`  ${c.red}Denied approvals: ${deniedApprovals.length}${c.reset}`);
  for (const a of deniedApprovals) {
    console.log(`    ${c.red}✗${c.reset} [${a.id}] ${a.metadata?.action || 'unknown'} — ${a.approval?.reason || 'no reason'}`);
  }
} else {
  console.log(`  ${c.green}No denied approvals${c.reset}`);
}
if (failedActions.length > 0) {
  console.log(`  ${c.red}Failed/cancelled actions: ${failedActions.length}${c.reset}`);
  for (const a of failedActions) {
    const err = a.result?.errorSnippet ? ` — ${a.result.errorSnippet.slice(0, 80)}` : '';
    console.log(`    ${c.red}✗${c.reset} [${a.id}] ${a.tool} (${a.result?.status})${c.dim}${err}${c.reset}`);
  }
} else {
  console.log(`  ${c.green}No failed actions${c.reset}`);
}
console.log('');

// Events
console.log(`${c.bold}── Events ──${c.reset}`);
console.log(`  Total: ${events.length}`);
for (const [t, n] of Object.entries(eventTypeCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)} ${t}`);
}
console.log('');

// Exit code: 1 if dangerous tasks or denials exist
const exitCode = activeDangerousTasks.length > 0 || deniedApprovals.length > 0 ? 1 : 0;
process.exit(exitCode);
