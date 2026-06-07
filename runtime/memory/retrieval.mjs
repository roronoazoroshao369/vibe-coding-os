import { listMemory } from './memory-store.mjs';
export async function searchMemory(store, query) {
  const q = String(query || '').toLowerCase();
  return (await listMemory(store)).filter(m => m.content.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q))).map(m => ({ id: m.id, content: m.content, scope: m.scope, source: m.source, createdAt: m.createdAt }));
}
