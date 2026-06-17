import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { makeId, nowIso } from '../core/ids.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { assertString, createItemValidator } from '../core/validation.mjs';
import { Enforcement } from '../core/enforcement.mjs';

const itemSchema = createItemValidator('runtime-task.schema.json');
const enforcement = new Enforcement(itemSchema);

const ALLOWED_TASK_INPUT_FIELDS = [
  'title', 'description', 'phase', 'priority', 'dependsOn',
  'parentTaskId', 'owner', 'ownerRef', 'acceptanceCriteria',
  'allowedPaths', 'risk', 'actor', 'createdBy', 'source', 'trace',
];

const FILE = 'tasks.json';
const STATUSES = new Set(['pending', 'in_progress', 'blocked', 'completed', 'cancelled']);

function withoutNullish(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null && value !== undefined));
}

export async function listTasks(store) { return (await readJson(store, FILE, emptyCollection('tasks'))).items; }
async function save(store, items) { await writeJsonAtomic(store, FILE, { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'tasks', items }, { enforcement, source: 'runtime-track', itemSchema }); }

export async function createTask(store, input) {
  assertString(input.title, 'title');
  enforcement.assertKnownFields(input, ALLOWED_TASK_INPUT_FIELDS, 'task input');
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const now = nowIso();
    const task = withoutNullish({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: makeId('task'),
      title: input.title.trim(),
      description: input.description || null,
      status: 'pending',
      phase: input.phase || 'implementation',
      priority: input.priority || 'normal',
      dependsOn: input.dependsOn || [],
      parentTaskId: input.parentTaskId || null,
      subtaskIds: [],
      owner: input.owner || null,
      ownerRef: input.ownerRef || null,
      claim: null,
      acceptanceCriteria: input.acceptanceCriteria || [],
      allowedPaths: input.allowedPaths || [],
      touchedPaths: [],
      blockedReason: null,
      risk: input.risk || null,
      verification: null,
      handoff: null,
      history: [{ event: 'task.created', from: null, to: 'pending', actor: input.actor || 'cli', timestamp: now }],
      createdBy: input.createdBy || null,
      source: input.source || 'runtime-cli',
      trace: input.trace || null,
      createdAt: now,
      updatedAt: now
    });
    items.push(task); await save(store, items); await appendEvent(store, 'task.created', { id: task.id, title: task.title }); return task;
  });
}

export async function updateTaskStatus(store, id, status, options = {}) {
  if (!STATUSES.has(status)) throw new Error(`invalid status: ${status}`);
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store); const task = items.find(t => t.id === id); if (!task) throw new Error(`task not found: ${id}`);
    const oldStatus = task.status;
    const actor = options.actor || 'cli';
    const now = nowIso();

    task.status = status;
    task.updatedAt = now;

    // Append history entry
    if (!Array.isArray(task.history)) task.history = [];
    const historyEntry = {
      event: 'status.changed',
      from: oldStatus,
      to: status,
      actor,
      timestamp: now
    };
    task.history.push(historyEntry);

    // Set blocked reason if status is blocked
    if (status === 'blocked' && options.blockedReason) {
      task.blockedReason = options.blockedReason;
    }

    // Auto-claim when moving blocked→in_progress or pending→in_progress
    if (status === 'in_progress' && (oldStatus === 'pending' || oldStatus === 'blocked')) {
      const ttl = options.ttl || 300;
      const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
      task.claim = {
        claimedBy: actor,
        claimedAt: now,
        expiresAt,
        heartbeat: now
      };
      if (!task.owner) task.owner = actor;
    }

    // Heartbeat update on any status change (refresh expiration for existing claims)
    if (task.claim && status !== oldStatus) {
      const ttl = options.ttl || 300;
      task.claim.heartbeat = now;
      task.claim.expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
    }

    await save(store, items); await appendEvent(store, 'task.status', { id, status }); return task;
  });
}

export async function nextReadyTask(store) {
  const items = await listTasks(store); const done = new Set(items.filter(t => t.status === 'completed').map(t => t.id));
  return items.find(t => t.status === 'pending' && (t.dependsOn || []).every(id => done.has(id))) || null;
}

export async function importTasksFromMarkdown(store, file) {
  if (!existsSync(file)) throw new Error(`markdown file not found: ${file}`);
  const text = await readFile(file, 'utf8');
  const titles = [...text.matchAll(/^\s*- \[\]\s+(.+)$/gm)].map(m => m[1].trim()).filter(Boolean);
  const created = [];
  for (const title of titles) created.push(await createTask(store, { title, source: file }));
  return created;
}

// ---------------------------------------------------------------------------
// Claim / Lease APIs (P1.4, P1.6)
// ---------------------------------------------------------------------------

/**
 * Claim a task: set owner + claim info + optionally promote status to in_progress.
 *
 * @param {object} store     - Data store handle
 * @param {string} id        - Task ID
 * @param {string} claimer   - Identity of the agent claiming the task
 * @param {object} [options] - Options
 * @param {string} [options.actor]              - Override for history actor (defaults to claimer)
 * @param {number} [options.ttl=300]            - Lease TTL in seconds (default 300 = 5 min)
 * @param {boolean}[options.force=false]        - Re-claim even if already owned by someone else
 * @returns {Promise<object>} The updated task
 */
export async function claimTask(store, id, claimer, options = {}) {
  assertString(claimer, 'claimer');
  const ttl = options.ttl ?? 300;
  const actor = options.actor || claimer;
  const force = options.force === true;

  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const task = items.find(t => t.id === id);
    if (!task) throw new Error(`task not found: ${id}`);

    const now = new Date();
    const nowIsoStr = now.toISOString();

    // --- Conflict resolution ---
    if (task.claim && !force) {
      const expiresAt = new Date(task.claim.expiresAt);
      const expired = now >= expiresAt;

      if (!expired && task.claim.claimedBy !== claimer) {
        const timeRemaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        const err = new Error(
          `task ${id} is already claimed by "${task.claim.claimedBy}" (expires at ${task.claim.expiresAt}, ${timeRemaining}s remaining)`
        );
        err.code = 'TASK_ALREADY_CLAIMED';
        err.details = { claimedBy: task.claim.claimedBy, expiresAt: task.claim.expiresAt, timeRemaining };
        throw err;
      }

      // If expired or same claimer, we proceed with re-claim below
    }

    // --- Set claim ---
    const expiresAt = new Date(now.getTime() + ttl * 1000).toISOString();
    task.claim = {
      claimedBy: claimer,
      claimedAt: nowIsoStr,
      expiresAt,
      heartbeat: nowIsoStr
    };

    // Update owner if not already set
    if (!task.owner) task.owner = claimer;

    // Promote status (pending/blocked → in_progress)
    if (task.status === 'pending' || task.status === 'blocked') {
      const oldStatus = task.status;
      task.status = 'in_progress';
      if (!Array.isArray(task.history)) task.history = [];
      task.history.push({
        event: 'status.changed',
        from: oldStatus,
        to: 'in_progress',
        actor,
        timestamp: nowIsoStr
      });
    }

    task.updatedAt = nowIsoStr;
    await save(store, items);
    await appendEvent(store, 'task.claim', { id, claimedBy: claimer, expiresAt });
    return task;
  });
}

/**
 * Release a task: clear the claim field, optionally revert status.
 *
 * @param {object}  store                    - Data store handle
 * @param {string}  id                       - Task ID
 * @param {object}  [options]                - Options
 * @param {boolean} [options.revertStatus=false] - If true, revert status to 'pending'
 * @param {string}  [options.actor]               - Actor for history (default 'cli')
 * @returns {Promise<object>} The updated task
 */
export async function releaseTask(store, id, options = {}) {
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const task = items.find(t => t.id === id);
    if (!task) throw new Error(`task not found: ${id}`);

    const now = nowIso();
    const actor = options.actor || 'cli';

    // Record the release in history
    if (task.claim) {
      if (!Array.isArray(task.history)) task.history = [];
      task.history.push({
        event: 'claim.released',
        from: task.claim.claimedBy,
        to: null,
        actor,
        timestamp: now
      });
    }

    task.claim = null;

    // Optionally revert status to pending
    if (options.revertStatus === true && task.status === 'in_progress') {
      const oldStatus = task.status;
      task.status = 'pending';
      if (!Array.isArray(task.history)) task.history = [];
      task.history.push({
        event: 'status.changed',
        from: oldStatus,
        to: 'pending',
        actor,
        timestamp: now
      });
    }

    task.updatedAt = now;
    await save(store, items);
    await appendEvent(store, 'task.release', { id });
    return task;
  });
}

/**
 * Heartbeat on a task: refresh the expiration timestamp.
 *
 * @param {object} store    - Data store handle
 * @param {string} id       - Task ID
 * @param {number} [ttl=300] - New TTL in seconds from now
 * @param {object} [options]
 * @param {string} [options.claimer] - Expected claimer (optional). If provided, throws if mismatch.
 * @returns {Promise<object>} The updated task
 */
export async function heartbeatTask(store, id, ttl = 300, options = {}) {
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const task = items.find(t => t.id === id);
    if (!task) throw new Error(`task not found: ${id}`);
    if (!task.claim) throw new Error(`task ${id} is not claimed`);

    const now = new Date();
    const nowIsoStr = now.toISOString();

    // Optional claimer check
    if (options.claimer && task.claim.claimedBy !== options.claimer) {
      throw new Error(
        `task ${id} is claimed by "${task.claim.claimedBy}", not "${options.claimer}"`
      );
    }

    task.claim.heartbeat = nowIsoStr;
    task.claim.expiresAt = new Date(now.getTime() + ttl * 1000).toISOString();
    task.updatedAt = nowIsoStr;

    await save(store, items);
    await appendEvent(store, 'task.heartbeat', { id, expiresAt: task.claim.expiresAt });
    return task;
  });
}

/**
 * Renew a lease: extend the current expiration by extraTtl seconds.
 *
 * @param {object} store        - Data store handle
 * @param {string} id           - Task ID
 * @param {number} [extraTtl=300] - Extra seconds to add
 * @returns {Promise<object>} The updated task
 */
export async function renewTaskLease(store, id, extraTtl = 300) {
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const task = items.find(t => t.id === id);
    if (!task) throw new Error(`task not found: ${id}`);
    if (!task.claim) throw new Error(`task ${id} is not claimed`);

    const now = new Date();
    const nowIsoStr = now.toISOString();
    const currentExpires = new Date(task.claim.expiresAt).getTime();
    // Extend from max(now, currentExpires) + extraTtl
    const base = Math.max(now.getTime(), currentExpires);
    task.claim.expiresAt = new Date(base + extraTtl * 1000).toISOString();
    task.claim.heartbeat = nowIsoStr;
    task.updatedAt = nowIsoStr;

    await save(store, items);
    await appendEvent(store, 'task.renew', { id, expiresAt: task.claim.expiresAt });
    return task;
  });
}

/**
 * List all tasks whose claims have expired.
 *
 * @param {object} store - Data store handle
 * @returns {Promise<object[]>} Array of expired tasks
 */
export async function listExpiredClaims(store) {
  const items = await listTasks(store);
  const now = new Date();
  return items.filter(t => t.claim && new Date(t.claim.expiresAt) <= now);
}

/**
 * Cancel (release) all expired claims.
 *
 * @param {object} store - Data store handle
 * @returns {Promise<number>} Number of expired claims released
 */
export async function cancelExpiredClaims(store) {
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const now = new Date();
    const nowIsoStr = now.toISOString();
    let count = 0;

    for (const task of items) {
      if (task.claim && new Date(task.claim.expiresAt) <= now) {
        const prevClaimer = task.claim.claimedBy || 'unknown';
        task.claim = null;
        task.updatedAt = nowIsoStr;
        if (!Array.isArray(task.history)) task.history = [];
        task.history.push({
          event: 'claim.expired',
          from: prevClaimer,
          to: null,
          actor: 'reaper',
          timestamp: nowIsoStr
        });
        count++;
      }
    }

    if (count > 0) {
      await save(store, items);
      await appendEvent(store, 'task.expired-claims-released', { count });
    }
    return count;
  });
}
