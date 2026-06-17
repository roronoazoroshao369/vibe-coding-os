import { appendFile, mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { nowIso, makeId } from './ids.mjs';
import { redactObject } from './privacy.mjs';
import { CURRENT_SCHEMA_VERSION } from './validation.mjs';

const EVENTS_FILE = 'events.jsonl';
const SNAPSHOT_DIR = 'snapshots';

export async function appendEvent(store, type, payload = {}) {
  const event = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: makeId('evt'),
    type,
    createdAt: nowIso(),
    actor: { type: 'system' },
    redaction: { applied: false },
    payload: redactObject(payload)
  };
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(event)}\n`, 'utf8');
  return event;
}

export async function listEvents(store, options = {}) {
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  if (!existsSync(file)) return [];
  const text = await readFile(file, 'utf8');
  const events = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const event = JSON.parse(trimmed);
      if (options.afterId && !events._seenAfter) {
        if (event.id === options.afterId) events._seenAfter = true;
        continue;
      }
      events.push(event);
    } catch (err) {
      if (options.strict) throw new Error(`invalid event JSON at line ${index + 1}: ${err.message}`);
    }
  }
  delete events._seenAfter;
  return events;
}

export async function clearEvents(store) {
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, '', 'utf8');
}

async function atomicWriteJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(tmp, file);
}

function snapshotPath(store, id) {
  return path.join(store.runtimeDir, SNAPSHOT_DIR, `${id}.json`);
}

export async function createSnapshot(store, state, options = {}) {
  const events = await listEvents(store);
  const lastEvent = events.at(-1) || null;
  const snapshot = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: makeId('snap'),
    createdAt: nowIso(),
    lastEventId: options.lastEventId || lastEvent?.id || null,
    lastEventCreatedAt: options.lastEventCreatedAt || lastEvent?.createdAt || null,
    eventCount: events.length,
    state: redactObject(state || {})
  };
  await atomicWriteJson(snapshotPath(store, snapshot.id), snapshot);
  return snapshot;
}

export async function listSnapshots(store) {
  const dir = path.join(store.runtimeDir, SNAPSHOT_DIR);
  if (!existsSync(dir)) return [];
  const { readdir } = await import('node:fs/promises');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  const snapshots = [];
  for (const file of files) {
    try { snapshots.push(JSON.parse(await readFile(path.join(dir, file), 'utf8'))); } catch { /* ignore bad snapshot */ }
  }
  return snapshots.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export async function latestSnapshot(store) {
  return (await listSnapshots(store)).at(-1) || null;
}

export async function recoverFromSnapshot(store, applyEvents, options = {}) {
  const snapshot = options.snapshot || await latestSnapshot(store);
  const events = snapshot?.lastEventId ? await listEvents(store, { afterId: snapshot.lastEventId }) : await listEvents(store);
  const initialState = structuredClone(snapshot?.state || options.initialState || {});
  return applyEvents(initialState, events, snapshot);
}

export async function cleanupEvents(store, options = {}) {
  const keepLast = Number.isInteger(options.keepLast) ? options.keepLast : 1000;
  const snapshot = options.snapshot || await latestSnapshot(store);
  const events = await listEvents(store);
  if (!snapshot && events.length <= keepLast) return { removed: 0, kept: events.length };

  let cutoffIndex = snapshot?.lastEventId ? events.findIndex((event) => event.id === snapshot.lastEventId) + 1 : 0;
  if (cutoffIndex < 0) cutoffIndex = 0;
  const maxRemovable = Math.max(0, events.length - keepLast);
  const removeCount = Math.min(cutoffIndex, maxRemovable);
  if (removeCount <= 0) return { removed: 0, kept: events.length };

  const kept = events.slice(removeCount);
  const file = path.join(store.runtimeDir, EVENTS_FILE);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, kept.map((event) => JSON.stringify(event)).join('\n') + (kept.length ? '\n' : ''), 'utf8');
  return { removed: removeCount, kept: kept.length };
}

export async function removeSnapshots(store, options = {}) {
  const keepLast = Number.isInteger(options.keepLast) ? options.keepLast : 5;
  const snapshots = await listSnapshots(store);
  const removable = snapshots.slice(0, Math.max(0, snapshots.length - keepLast));
  for (const snapshot of removable) await rm(snapshotPath(store, snapshot.id), { force: true });
  return { removed: removable.length, kept: snapshots.length - removable.length };
}
