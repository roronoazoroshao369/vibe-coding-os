import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { redactText } from '../core/privacy.mjs';
import { assertString, CURRENT_SCHEMA_VERSION, createItemValidator } from '../core/validation.mjs';
import { Enforcement } from '../core/enforcement.mjs';

const itemSchema = createItemValidator('runtime-memory.schema.json');
const enforcement = new Enforcement(itemSchema);

const ALLOWED_MEMORY_INPUT_FIELDS = [
  'content', 'kind', 'scope', 'source', 'tags', 'freshness',
];

const FILE = 'memory.json';
export async function listMemory(store) { return (await readJson(store, FILE, emptyCollection('memory'))).items; }
async function save(store, items) {
  await writeJsonAtomic(store, FILE, { schemaVersion: CURRENT_SCHEMA_VERSION, kind: 'memory', items }, { enforcement, itemSchema, source: 'runtime-memory' });
}

export async function ingestMemory(store, input) {
  assertString(input.content, 'content');
  enforcement.assertKnownFields(input, ALLOWED_MEMORY_INPUT_FIELDS, 'memory input');
  return withLock(store, 'memory', async () => {
    const items = await listMemory(store);
    const item = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: makeId('mem'),
      content: redactText(input.content),
      kind: input.kind || 'observation',
      scope: input.scope || 'project',
      source: input.source || 'runtime-cli',
      tags: input.tags || [],
      freshness: input.freshness || { createdAt: nowIso(), staleness: 'fresh' },
      createdAt: nowIso()
    };
    items.push(item); await save(store, items); await appendEvent(store, 'memory.ingested', { id: item.id, scope: item.scope, source: item.source }); return item;
  });
}
