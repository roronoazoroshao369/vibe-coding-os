// embed.mjs — zero-dependency local embedding.
// Deterministic char n-gram hashing into a fixed-dim L2-normalized vector.
// Offline, no model download. Good enough for hybrid retrieval re-ranking.

export const EMBED_DIM = 256;

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9_\s./-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// 32-bit FNV-1a
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function embed(text, dim = EMBED_DIM) {
  const v = new Float64Array(dim);
  const tokens = tokenize(text);
  for (const tok of tokens) {
    // unigram
    v[fnv1a(tok) % dim] += 1;
    // char trigrams for subword robustness
    const padded = `^${tok}$`;
    for (let i = 0; i + 3 <= padded.length; i++) {
      const g = padded.slice(i, i + 3);
      v[fnv1a(g) % dim] += 0.5;
    }
  }
  // L2 normalize
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < dim; i++) v[i] /= norm;
  return Array.from(v);
}

export function cosine(a, b) {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot; // both are L2-normalized
}
