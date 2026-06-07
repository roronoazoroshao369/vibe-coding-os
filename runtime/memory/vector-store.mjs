import { readJson, writeJsonAtomic, withLock } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { redactText } from '../core/privacy.mjs';
import { nowIso } from '../core/ids.mjs';
import { listMemory } from './memory-store.mjs';

const INDEX_FILE = 'indexes/memory-vectors.json';
const LOCAL_MODEL = 'local-hash';
const DIMS = 256;

function emptyIndex() {
  return { schemaVersion: 1, kind: 'vector-index', model: LOCAL_MODEL, dims: DIMS, builtAt: null, items: [] };
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length > 1);
}

// Deterministic FNV-1a hash so the same token always maps to the same dimension, offline and reproducibly.
function hashToken(token) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash % DIMS;
}

// Local deterministic embedding: bag-of-words term frequency hashed into a fixed-dimension vector, L2-normalized for cosine.
function embedLocal(text) {
  const vector = new Array(DIMS).fill(0);
  for (const token of tokenize(text)) vector[hashToken(token)] += 1;
  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm);
  if (norm > 0) for (let i = 0; i < DIMS; i++) vector[i] /= norm;
  return vector;
}

function cosine(a, b) {
  let dot = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) dot += a[i] * b[i];
  return dot; // vectors are pre-normalized, so dot product is cosine similarity
}

// Embed text. Default is the offline local model. An external provider may be supplied only when the
// runtime config explicitly opts in; we ship the hook point but never make network calls by default.
async function embed(text, options = {}) {
  const safe = redactText(text);
  if (options.provider === 'local' || !options.provider) {
    return { model: LOCAL_MODEL, vector: embedLocal(safe) };
  }
  if (typeof options.embedFn === 'function') {
    const vector = await options.embedFn(safe);
    if (!Array.isArray(vector)) throw new Error('external embedFn must return a numeric array');
    return { model: options.provider, vector };
  }
  throw new Error(`external embedding provider "${options.provider}" requested but no embedFn supplied (offline runtime ships no network embedding code)`);
}

async function resolveProviderOptions(store, options = {}) {
  if (options.provider || options.embedFn) return options;
  const config = await readJson(store, 'config.json', {});
  const vectorCfg = config?.vectorProvider;
  // External provider only when the adapter flag AND an explicit provider type are both set in config.
  if (config?.adapters?.vector === true && vectorCfg?.type && vectorCfg.type !== 'local') {
    return { ...options, provider: vectorCfg.type };
  }
  return { ...options, provider: 'local' };
}

export async function buildIndex(store, options = {}) {
  const resolved = await resolveProviderOptions(store, options);
  return withLock(store, 'vector-index', async () => {
    const memories = await listMemory(store);
    const items = [];
    for (const memory of memories) {
      // Privacy filter runs before indexing; content is re-redacted defensively even though ingest already redacted it.
      const { model, vector } = await embed(memory.content, resolved);
      items.push({ id: memory.id, scope: memory.scope, source: memory.source, createdAt: memory.createdAt, model, vector });
    }
    const index = { ...emptyIndex(), model: resolved.provider === 'local' ? LOCAL_MODEL : resolved.provider, builtAt: nowIso(), items };
    await writeJsonAtomic(store, INDEX_FILE, index);
    await appendEvent(store, 'memory.indexed', { count: items.length, model: index.model });
    return { count: items.length, model: index.model, file: INDEX_FILE };
  });
}

async function loadIndex(store) {
  return readJson(store, INDEX_FILE, emptyIndex());
}

export async function semanticSearch(store, query, options = {}) {
  const resolved = await resolveProviderOptions(store, options);
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 10;
  let index = await loadIndex(store);
  // Rebuild if the index is empty or stale relative to current memory count, so search works without a manual reindex.
  const memories = await listMemory(store);
  if (!index.items.length || index.items.length !== memories.length) {
    await buildIndex(store, resolved);
    index = await loadIndex(store);
  }
  const { vector: queryVector } = await embed(query, resolved);
  const byId = new Map(memories.map(memory => [memory.id, memory]));
  return index.items
    .map(item => ({ item, score: cosine(queryVector, item.vector) }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item, score }) => {
      const memory = byId.get(item.id);
      return {
        id: item.id,
        content: memory ? memory.content : '',
        scope: item.scope,
        source: item.source,
        createdAt: item.createdAt,
        score: Number(score.toFixed(6))
      };
    });
}
