import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { nowIso, makeId } from './ids.mjs';
import { redactObject } from './privacy.mjs';

export async function appendEvent(store, type, payload = {}) {
  const event = { schemaVersion: 1, id: makeId('evt'), type, createdAt: nowIso(), payload: redactObject(payload) };
  const file = path.join(store.runtimeDir, 'events.jsonl');
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(event)}\n`, 'utf8');
  return event;
}
