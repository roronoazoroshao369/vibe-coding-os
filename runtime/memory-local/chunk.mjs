// chunk.mjs — source-aware chunking.
function byParagraph(text, max = 1200, overlap = 200) {
  const clean = String(text || '').replace(/\r\n/g, '\n');
  if (clean.length <= max) return clean.trim() ? [clean.trim()] : [];
  const chunks = [];
  let i = 0;
  while (i < clean.length) {
    let end = Math.min(i + max, clean.length);
    if (end < clean.length) {
      const nl = clean.lastIndexOf('\n', end);
      if (nl > i + max * 0.5) end = nl;
    }
    const piece = clean.slice(i, end).trim();
    if (piece) chunks.push(piece);
    if (end >= clean.length) break;
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks;
}

function byCode(text) {
  // split on top-level function/class boundaries, fallback to paragraph
  const lines = String(text || '').split('\n');
  const blocks = [];
  let cur = [];
  const boundary = /^(export\s+)?(async\s+)?(function|class|const|def|public|private|fn)\b/;
  for (const line of lines) {
    if (boundary.test(line) && cur.length > 0) {
      blocks.push(cur.join('\n'));
      cur = [];
    }
    cur.push(line);
  }
  if (cur.length) blocks.push(cur.join('\n'));
  const out = [];
  for (const b of blocks) out.push(...byParagraph(b, 1600, 100));
  return out.length ? out : byParagraph(text);
}

export function chunk(text, scope = 'doc') {
  if (scope === 'code') return byCode(text);
  return byParagraph(text);
}
