// retrieve.mjs — hybrid retrieval (vector + keyword) with RRF fusion,
// freshness/scope weighting, and a context packer with a token budget.
import { embed, cosine } from './embed.mjs';

function keywordScore(query, text) {
  const q = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (!q.length) return 0;
  const t = text.toLowerCase();
  let hits = 0;
  for (const w of q) if (t.includes(w)) hits++;
  return hits / q.length;
}

function freshnessWeight(created, now = Date.now()) {
  const ageDays = (now - new Date(created).getTime()) / 86400000;
  if (ageDays < 7) return 1.0;
  if (ageDays < 30) return 0.85;
  if (ageDays < 90) return 0.7;
  return 0.5;
}

// store: createStore() instance; opts: {scope, source, includeStale, k}
export function search(store, query, opts = {}) {
  const { scope = 'all', source = null, includeStale = false, k = 8 } = opts;
  const idx = store.loadIndex();
  const qv = embed(query);
  const ids = Object.keys(idx);
  if (!ids.length) return [];

  const entriesById = {};
  for (const e of store.readEntries()) entriesById[e.id] = e;

  const candidates = [];
  for (const id of ids) {
    const meta = idx[id];
    const e = entriesById[id];
    if (!e) continue;
    if (!includeStale && e.stale) continue;
    if (scope !== 'all' && e.scope !== scope) continue;
    if (source && e.source !== source) continue;
    const vec = cosine(qv, meta.vector);
    const kw = keywordScore(query, e.text);
    candidates.push({ id, e, vec, kw });
  }
  if (!candidates.length) return [];

  // rank lists for RRF
  const byVec = [...candidates].sort((a, b) => b.vec - a.vec);
  const byKw = [...candidates].sort((a, b) => b.kw - a.kw);
  const rank = (list) => { const m = {}; list.forEach((c, i) => (m[c.id] = i + 1)); return m; };
  const rv = rank(byVec), rk = rank(byKw);
  const RRF_K = 60;

  for (const c of candidates) {
    const rrf = 1 / (RRF_K + rv[c.id]) + 1 / (RRF_K + rk[c.id]);
    const fresh = freshnessWeight(c.e.created);
    c.score = rrf * fresh;
    c.freshness = fresh;
    c.relevance = c.vec >= 0.5 ? 'high' : c.vec >= 0.25 ? 'medium' : 'low';
  }
  return candidates.sort((a, b) => b.score - a.score).slice(0, k)
    .map((c) => ({ id: c.id, source: c.e.source, scope: c.e.scope, created: c.e.created,
                   text: c.e.text, vec: Number(c.vec.toFixed(4)), kw: Number(c.kw.toFixed(3)),
                   relevance: c.relevance, freshness: c.freshness, score: Number(c.score.toFixed(5)) }));
}

// Build a compact, cited context pack within a char budget.
export function contextPack(store, query, opts = {}) {
  const { budget = 4000, k = 12, minRelevance = 'low' } = opts;
  const order = { low: 0, medium: 1, high: 2 };
  const hits = search(store, query, { ...opts, k }).filter((h) => order[h.relevance] >= order[minRelevance]);
  const lines = [];
  let used = 0;
  const picked = [];
  for (const h of hits) {
    const snippet = h.text.length > 600 ? h.text.slice(0, 600) + '…' : h.text;
    const block = `[#${picked.length + 1}] (${h.source} | ${h.scope} | ${h.relevance} | ${h.created.slice(0,10)})\n${snippet}`;
    if (used + block.length > budget && picked.length) break;
    lines.push(block);
    used += block.length;
    picked.push(h);
  }
  return {
    query,
    used_chars: used,
    budget,
    entries: picked.map((p) => ({ id: p.id, source: p.source, relevance: p.relevance, score: p.score })),
    context: lines.join('\n\n') || '(no relevant memory found)',
  };
}
