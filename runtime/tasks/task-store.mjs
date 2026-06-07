import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { assertString } from '../core/validation.mjs';

const FILE = 'tasks.json';
const STATUSES = new Set(['pending', 'in_progress', 'blocked', 'completed', 'cancelled']);

export async function listTasks(store) { return (await readJson(store, FILE, emptyCollection('tasks'))).items; }
async function save(store, items) { await writeJsonAtomic(store, FILE, { schemaVersion: 1, kind: 'tasks', items }); }

export async function createTask(store, input) {
  assertString(input.title, 'title');
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store);
    const task = { schemaVersion: 1, id: makeId('task'), title: input.title.trim(), status: 'pending', dependsOn: input.dependsOn || [], owner: input.owner || null, createdAt: nowIso(), updatedAt: nowIso(), source: input.source || 'runtime-cli' };
    items.push(task); await save(store, items); await appendEvent(store, 'task.created', { id: task.id, title: task.title }); return task;
  });
}

export async function updateTaskStatus(store, id, status) {
  if (!STATUSES.has(status)) throw new Error(`invalid status: ${status}`);
  return withLock(store, 'tasks', async () => {
    const items = await listTasks(store); const task = items.find(t => t.id === id); if (!task) throw new Error(`task not found: ${id}`);
    task.status = status; task.updatedAt = nowIso(); await save(store, items); await appendEvent(store, 'task.status', { id, status }); return task;
  });
}

export async function nextReadyTask(store) {
  const items = await listTasks(store); const done = new Set(items.filter(t => t.status === 'completed').map(t => t.id));
  return items.find(t => t.status === 'pending' && (t.dependsOn || []).every(id => done.has(id))) || null;
}

export async function importTasksFromMarkdown(store, file) {
  if (!existsSync(file)) throw new Error(`markdown file not found: ${file}`);
  const text = await readFile(file, 'utf8');
  const titles = [...text.matchAll(/^\s*- \[ \]\s+(.+)$/gm)].map(m => m[1].trim()).filter(Boolean);
  const created = [];
  for (const title of titles) created.push(await createTask(store, { title, source: file }));
  return created;
}
