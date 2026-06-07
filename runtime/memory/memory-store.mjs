import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { redactText } from '../core/privacy.mjs';
import { assertString } from '../core/validation.mjs';

const FILE = 'memory.json';
export async function listMemory(store) { return (await readJson(store, FILE, emptyCollection('memory'))).items; }
async function save(store, items) { await writeJsonAtomic(store, FILE, { schemaVersion: 1, kind: 'memory', items }); }
export async function ingestMemory(store, input) {
  assertString(input.content, 'content');
  return withLock(store, 'memory', async () => {
    const items = await listMemory(store);
    const item = { schemaVersion: 1, id: makeId('mem'), content: redactText(input.content), scope: input.scope || 'project', source: input.source || 'runtime-cli', tags: input.tags || [], createdAt: nowIso() };
    items.push(item); await save(store, items); await appendEvent(store, 'memory.ingested', { id: item.id, scope: item.scope, source: item.source }); return item;
  });
}
