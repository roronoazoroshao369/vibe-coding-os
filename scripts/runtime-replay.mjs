#!/usr/bin/env node
/**
 * runtime-replay.mjs — Event replay utility
 *
 * Reads events from the event store and rebuilds task state, session state,
 * and team state from the event log.  Also supports full replay of all three
 * stores simultaneously with snapshot-assisted recovery.
 *
 * Exports for programmatic use:
 *   rebuildTasks(eventStore, taskStore)     → Task[]
 *   rebuildSessions(eventStore, sessionStore) → Session[]
 *   rebuildTeams(eventStore, teamStore)     → Team[]
 *   fullReplay(stores)                       → { tasks, sessions, teams }
 */

import { existsSync } from 'node:fs';
import { createStore, readJson, emptyCollection } from '../runtime/core/fs-store.mjs';
import { listEvents, latestSnapshot, recoverFromSnapshot } from '../runtime/core/events.mjs';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';

// ── Helpers ────────────────────────────────────────────────────────────────

const TASK_DIRECT_EVENTS = new Set([
  'task.created', 'task.status', 'task.claim', 'task.release',
  'task.heartbeat', 'task.renew', 'task.expired-claims-released',
]);

const SESSION_DIRECT_EVENTS = new Set([
  'session.created',
]);

const TEAM_DIRECT_EVENTS = new Set([
  'team.imported',
]);

/**
 * Apply a single event to a running state map.
 * Returns true if the event was consumed (known event type).
 */
function applyTaskEvent(state, event) {
  const { type, payload } = event;
  switch (type) {
    case 'task.created': {
      if (!payload?.id) return false;
      state[payload.id] = state[payload.id] || {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        id: payload.id,
        title: payload.title || 'Unknown',
        status: 'pending',
        phase: 'implementation',
        priority: 'normal',
        dependsOn: [],
        subtaskIds: [],
        owner: null,
        ownerRef: null,
        claim: null,
        blockedReason: null,
        history: [],
        touchedPaths: [],
        createdAt: event.createdAt,
        updatedAt: event.createdAt,
        source: 'event-replay',
      };
      // Record creation in history
      state[payload.id].history.push({
        event: 'task.created',
        from: null,
        to: null,
        actor: event.actor?.type || 'system',
        timestamp: event.createdAt,
      });
      return true;
    }
    case 'task.status': {
      if (!payload?.id || !state[payload.id]) return false;
      const task = state[payload.id];
      const oldStatus = task.status;
      task.status = payload.status;
      task.updatedAt = event.createdAt;
      if (!Array.isArray(task.history)) task.history = [];
      task.history.push({
        event: 'status.changed',
        from: oldStatus,
        to: payload.status,
        actor: event.actor?.type || 'system',
        timestamp: event.createdAt,
      });
      return true;
    }
    case 'task.claim': {
      if (!payload?.id || !state[payload.id]) return false;
      const task = state[payload.id];
      task.claim = {
        claimedBy: payload.claimedBy || 'unknown',
        claimedAt: event.createdAt,
        expiresAt: payload.expiresAt || new Date(Date.now() + 300_000).toISOString(),
        heartbeat: event.createdAt,
      };
      if (!task.owner) task.owner = task.claim.claimedBy;
      if (task.status === 'pending' || task.status === 'blocked') {
        task.status = 'in_progress';
        if (!Array.isArray(task.history)) task.history = [];
        task.history.push({
          event: 'status.changed',
          from: task.status === 'in_progress' ? null : (task.history.length ? task.history.at(-1)?.to || 'pending' : 'pending'),
          to: 'in_progress',
          actor: event.actor?.type || 'system',
          timestamp: event.createdAt,
        });
      }
      task.updatedAt = event.createdAt;
      return true;
    }
    case 'task.release': {
      if (!payload?.id || !state[payload.id]) return false;
      const task = state[payload.id];
      const prevClaimer = task.claim?.claimedBy || 'unknown';
      task.claim = null;
      task.updatedAt = event.createdAt;
      if (!Array.isArray(task.history)) task.history = [];
      task.history.push({
        event: 'claim.released',
        from: prevClaimer,
        to: null,
        actor: event.actor?.type || 'system',
        timestamp: event.createdAt,
      });
      return true;
    }
    case 'task.heartbeat':
    case 'task.renew': {
      if (!payload?.id || !state[payload.id]) return false;
      const task = state[payload.id];
      if (task.claim) {
        task.claim.heartbeat = event.createdAt;
        if (payload.expiresAt) task.claim.expiresAt = payload.expiresAt;
        task.updatedAt = event.createdAt;
      }
      return true;
    }
    case 'task.expired-claims-released':
      // Counting event — we handle expiration via snapshot/current store only
      return true;
    default:
      return false;
  }
}

function applySessionEvent(state, event) {
  const { type, payload } = event;
  switch (type) {
    case 'session.created': {
      if (!payload?.id) return false;
      state[payload.id] = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        id: payload.id,
        goal: payload.goal || '',
        summary: '',
        status: 'active',
        participants: payload.participants || [],
        workflowRunIds: [],
        taskIds: [],
        memoryIds: [],
        checkpointIds: [],
        decisions: [],
        openQuestions: [],
        handoff: null,
        source: null,
        createdBy: null,
        trace: null,
        createdAt: event.createdAt,
        updatedAt: event.createdAt,
      };
      return true;
    }
    default:
      return false;
  }
}

function applyTeamEvent(state, event) {
  const { type, payload } = event;
  switch (type) {
    case 'team.imported': {
      if (!payload?.id) return false;
      state[payload.id] = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        id: payload.id,
        name: payload.name || 'Imported Team',
        pattern: payload.pattern || null,
        goal: payload.goal || '',
        roles: payload.roles || [],
        tasks: payload.tasks || [],
        orchestration_pattern: payload.orchestration_pattern || null,
        orchestration: payload.orchestration || null,
        reviewGates: payload.reviewGates || [],
        stop_conditions: payload.stop_conditions || [],
        source: payload.source || 'event-replay',
        createdBy: payload.createdBy || null,
        trace: payload.trace || null,
        createdAt: event.createdAt,
        metadata: payload.metadata || {},
        extensions: payload.extensions || {},
      };
      return true;
    }
    default:
      return false;
  }
}

// ── Exported rebuild functions ─────────────────────────────────────────────

/**
 * Rebuild all tasks from event log.
 * Optionally accepts a snapshot to start from a known state.
 */
async function rebuildTasks(eventStore, taskStore, options = {}) {
  const snapshot = options.snapshot || null;
  const events = snapshot?.lastEventId
    ? await listEvents(eventStore, { afterId: snapshot.lastEventId })
    : await listEvents(eventStore);

  const state = {};

  // Start from snapshot if available
  if (snapshot?.state?.tasks) {
    for (const task of Object.values(snapshot.state.tasks)) {
      state[task.id] = structuredClone(task);
    }
  } else {
    // Merge with current store for fields that events don't fully capture
    try {
      const currentItems = await readJson(taskStore, 'tasks.json', emptyCollection('tasks'));
      for (const item of currentItems.items) {
        state[item.id] = structuredClone(item);
      }
    } catch {
      // store may not exist — that's fine
    }
  }

  // Apply events in chronological order
  for (const event of events) {
    applyTaskEvent(state, event);
  }

  return Object.values(state).sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
}

/**
 * Rebuild sessions from event log.
 */
async function rebuildSessions(eventStore, sessionStore, options = {}) {
  const snapshot = options.snapshot || null;
  const events = snapshot?.lastEventId
    ? await listEvents(eventStore, { afterId: snapshot.lastEventId })
    : await listEvents(eventStore);

  const state = {};

  if (snapshot?.state?.sessions) {
    for (const session of Object.values(snapshot.state.sessions)) {
      state[session.id] = structuredClone(session);
    }
  } else {
    try {
      const currentItems = await readJson(sessionStore, 'sessions.json', emptyCollection('sessions'));
      for (const item of currentItems.items) {
        state[item.id] = structuredClone(item);
      }
    } catch { /* ok */ }
  }

  for (const event of events) {
    applySessionEvent(state, event);
  }

  return Object.values(state).sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
}

/**
 * Rebuild teams from event log.
 */
async function rebuildTeams(eventStore, teamStore, options = {}) {
  const snapshot = options.snapshot || null;
  const events = snapshot?.lastEventId
    ? await listEvents(eventStore, { afterId: snapshot.lastEventId })
    : await listEvents(eventStore);

  const state = {};

  if (snapshot?.state?.teams) {
    for (const team of Object.values(snapshot.state.teams)) {
      state[team.id] = structuredClone(team);
    }
  } else {
    try {
      const currentItems = await readJson(teamStore, 'teams.json', emptyCollection('teams'));
      for (const item of currentItems.items) {
        state[item.id] = structuredClone(item);
      }
    } catch { /* ok */ }
  }

  for (const event of events) {
    applyTeamEvent(state, event);
  }

  return Object.values(state).sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
}

/**
 * Full replay — rebuild all three stores from event log.
 * Returns { tasks, sessions, teams }.
 */
async function fullReplay(stores) {
  const { eventStore, taskStore, sessionStore, teamStore } = stores;
  const snapshot = await latestSnapshot(eventStore);

  const [tasks, sessions, teams] = await Promise.all([
    rebuildTasks(eventStore, taskStore, { snapshot }),
    rebuildSessions(eventStore, sessionStore, { snapshot }),
    rebuildTeams(eventStore, teamStore, { snapshot }),
  ]);

  return { tasks, sessions, teams };
}

// ── CLI ────────────────────────────────────────────────────────────────────

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
  console.error('usage: node scripts/runtime-replay.mjs <tasks|sessions|teams|full> [--snapshot <id>] [--compact]');
  console.error();
  console.error('  tasks       Rebuild tasks from event log');
  console.error('  sessions    Rebuild sessions from event log');
  console.error('  teams       Rebuild teams from event log');
  console.error('  full        Rebuild all three stores');
  console.error('  --snapshot <id>  Start from a specific snapshot');
  console.error('  --compact        Omit null/empty fields in output');
  process.exit(1);
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const cmd = flags._positional?.[0];
  if (!cmd || !['tasks', 'sessions', 'teams', 'full'].includes(cmd)) usage();

  const eventStore = createStore(process.cwd());
  const taskStore = createStore(process.cwd());
  const sessionStore = createStore(process.cwd());
  const teamStore = createStore(process.cwd());

  let snapshot = null;
  if (flags.snapshot) {
    const { readFile } = await import('node:fs/promises');
    const { resolve } = await import('node:path');
    const snapPath = resolve(process.cwd(), '.omc', 'runtime', 'snapshots', `${flags.snapshot}.json`);
    if (existsSync(snapPath)) {
      snapshot = JSON.parse(await readFile(snapPath, 'utf8'));
    } else {
      snapshot = { id: flags.snapshot, lastEventId: null, state: { tasks: {}, sessions: {}, teams: {} } };
    }
  }

  const compact = flags.compact === true;

  let result;
  if (cmd === 'tasks') {
    result = await rebuildTasks(eventStore, taskStore, { snapshot });
  } else if (cmd === 'sessions') {
    result = await rebuildSessions(eventStore, sessionStore, { snapshot });
  } else if (cmd === 'teams') {
    result = await rebuildTeams(eventStore, teamStore, { snapshot });
  } else {
    result = await fullReplay({ eventStore, taskStore, sessionStore, teamStore });
  }

  if (compact && Array.isArray(result)) {
    result = result.map(compactify);
  } else if (compact && typeof result === 'object' && !Array.isArray(result)) {
    for (const [key, val] of Object.entries(result)) {
      if (Array.isArray(val)) result[key] = val.map(compactify);
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

function compactify(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) continue;
    out[key] = value;
  }
  return out;
}

export {
  rebuildTasks,
  rebuildSessions,
  rebuildTeams,
  fullReplay,
};

const isMainScript = import.meta.url === `file://${process.argv[1]}`;
if (isMainScript) {
  main().catch((err) => {
    console.error('Replay failed:', err.message);
    process.exit(1);
  });
}
