import { listMemory } from './memory-store.mjs';
import { semanticSearch } from './vector-store.mjs';

export async function searchMemory(store, query, options = {}) {
  if (options.semantic) return semanticSearch(store, query, options);
  const q = String(query || '').toLowerCase();
  return (await listMemory(store)).filter(m => m.content.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q))).map(m => ({ id: m.id, content: m.content, scope: m.scope, source: m.source, createdAt: m.createdAt }));
}
