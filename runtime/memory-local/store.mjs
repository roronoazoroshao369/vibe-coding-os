// store.mjs — local-first append store on disk. Zero deps.
// Layout under <root>/.vibe-memory/
//   meta.json           store metadata
//   entries.jsonl       one redacted memory record per line
//   index.json          {id: {vector, tokens, ...}} compact index for search
//   audit.jsonl         immutable audit trail
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { embed } from './embed.mjs';
import { redact } from './redact.mjs';

export function memoryDir(root) { return join(root, '.vibe-memory'); }

export function createStore(root) {
  const dir = memoryDir(root);
  const paths = {
    dir,
    meta: join(dir, 'meta.json'),
    entries: join(dir, 'entries.jsonl'),
    index: join(dir, 'index.json'),
    audit: join(dir, 'audit.jsonl'),
  };

  function ensure() {
    mkdirSync(dir, { recursive: true });
    if (!existsSync(paths.meta)) {
      writeFileSync(paths.meta, JSON.stringify({ version: 1, created: new Date().toISOString(), count: 0 }, null, 2));
    }
    if (!existsSync(paths.index)) writeFileSync(paths.index, '{}');
    if (!existsSync(paths.entries)) writeFileSync(paths.entries, '');
    if (!existsSync(paths.audit)) writeFileSync(paths.audit, '');
  }

  function loadIndex() {
    ensure();
    try { return JSON.parse(readFileSync(paths.index, 'utf8')); } catch { return {}; }
  }
  function saveIndex(idx) { writeFileSync(paths.index, JSON.stringify(idx)); }

  function audit(action, detail) {
    ensure();
    appendFileSync(paths.audit, JSON.stringify({ ts: new Date().toISOString(), action, ...detail }) + '\n');
  }

  function idFor(source, text) {
    return createHash('sha256').update(`${source}::${text}`).digest('hex').slice(0, 16);
  }

  // upsert a single record. Returns {id, status:'added'|'duplicate'|'blocked'}
  function upsert({ text, source = 'unknown', scope = 'doc', metadata = {} }) {
    ensure();
    const r = redact(text);
    const clean = r.text;
    if (!clean.trim()) return { status: 'empty' };
    const id = idFor(source, clean);
    const idx = loadIndex();
    if (idx[id]) {
      audit('upsert', { id, status: 'duplicate', source });
      return { id, status: 'duplicate' };
    }
    const rec = {
      id, source, scope,
      text: clean,
      redactions: r.redactions,
      created: new Date().toISOString(),
      stale: false,
      metadata,
    };
    appendFileSync(paths.entries, JSON.stringify(rec) + '\n');
    idx[id] = { vector: embed(clean), source, scope, created: rec.created, stale: false, len: clean.length, metadata };
    saveIndex(idx);
    const meta = JSON.parse(readFileSync(paths.meta, 'utf8'));
    meta.count = (meta.count || 0) + 1;
    writeFileSync(paths.meta, JSON.stringify(meta, null, 2));
    audit('upsert', { id, status: 'added', source, redactions: r.redactions });
    return { id, status: 'added', redactions: r.redactions };
  }

  function readEntries() {
    ensure();
    const lines = readFileSync(paths.entries, 'utf8').split('\n').filter(Boolean);
    return lines.map((l) => JSON.parse(l));
  }

  function getText(id) {
    for (const e of readEntries()) if (e.id === id) return e.text;
    return null;
  }

  // mark entries stale by predicate
  function markStale(pred) {
    const entries = readEntries();
    const idx = loadIndex();
    let n = 0;
    const kept = entries.map((e) => {
      if (pred(e) && !e.stale) { e.stale = true; if (idx[e.id]) idx[e.id].stale = true; n++; }
      return e;
    });
    writeFileSync(paths.entries, kept.map((e) => JSON.stringify(e)).join('\n') + (kept.length ? '\n' : ''));
    saveIndex(idx);
    if (n) audit('mark_stale', { count: n });
    return n;
  }

  // forget entries by predicate -> hard delete
  function forget(pred) {
    const entries = readEntries();
    const idx = loadIndex();
    const kept = [];
    let removed = 0;
    for (const e of entries) {
      if (pred(e)) { delete idx[e.id]; removed++; }
      else kept.push(e);
    }
    writeFileSync(paths.entries, kept.map((e) => JSON.stringify(e)).join('\n') + (kept.length ? '\n' : ''));
    saveIndex(idx);
    const meta = JSON.parse(readFileSync(paths.meta, 'utf8'));
    meta.count = kept.length;
    writeFileSync(paths.meta, JSON.stringify(meta, null, 2));
    if (removed) audit('forget', { count: removed });
    return removed;
  }

  function status() {
    ensure();
    const meta = JSON.parse(readFileSync(paths.meta, 'utf8'));
    const entries = readEntries();
    const stale = entries.filter((e) => e.stale).length;
    const redactions = entries.reduce((s, e) => s + (e.redactions || 0), 0);
    const bySource = {};
    for (const e of entries) bySource[e.source] = (bySource[e.source] || 0) + 1;
    return { dir, count: entries.length, stale, redactions_applied: redactions, by_source: bySource, created: meta.created };
  }

  return { paths, ensure, upsert, readEntries, getText, loadIndex, markStale, forget, status, audit, idFor };
}
