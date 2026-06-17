import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { makeId, nowIso } from '../core/ids.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { assertString } from '../core/validation.mjs';

const FILE = 'tasks.json';
const STATUSES = new Set(['pending', 'in_progress', 'blocked', 'completed', 'cancelled']);

function withoutNullish(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null && value !== undefined));
}

export async function listTasks(store) { return (await readJson(store, FILE, emptyCollection('tasks'))).items; }
async function save(store, items) { await writeJsonAtomic(store, FILE, { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'tasks', items }); }

export async function createTask(store, input) {
  assertString(input.title, 'title');
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
    task.status = status;
    task.updatedAt = nowIso();
    // Append history entry
    if (!Array.isArray(task.history)) task.history = [];
    const historyEntry = {
      event: 'status.changed',
      from: oldStatus,
      to: status,
      actor: options.actor || 'cli',
      timestamp: nowIso()
    };
    task.history.push(historyEntry);
    // Set blocked reason if status is blocked
    if (status === 'blocked' && options.blockedReason) {
      task.blockedReason = options.blockedReason;
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
