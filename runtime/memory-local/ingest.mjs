// ingest.mjs — pull all sources into the local memory store.
// Sources: repo files (code/docs), session summaries, chat transcripts,
// tool/MCP logs, GitHub issues/PRs (from local JSON exports — offline-safe).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { execSync } from 'node:child_process';
import { chunk } from './chunk.mjs';

const CODE_EXT = new Set(['.js','.mjs','.ts','.tsx','.jsx','.py','.go','.rs','.java','.rb','.c','.h','.cpp']);
const DOC_EXT = new Set(['.md','.mdx','.txt','.rst']);
const SKIP_DIR = new Set(['node_modules','.git','.vibe-memory','dist','build','.next','coverage']);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = join(dir, name);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function gitSha(root) {
  try { return execSync('git rev-parse HEAD', { cwd: root, stdio: ['ignore','pipe','ignore'] }).toString().trim(); }
  catch { return null; }
}

export function ingestRepo(store, root, { maxBytes = 200_000 } = {}) {
  const files = walk(root);
  const sha = gitSha(root);
  let added = 0, skipped = 0;
  for (const f of files) {
    const ext = extname(f);
    const isCode = CODE_EXT.has(ext);
    const isDoc = DOC_EXT.has(ext);
    if (!isCode && !isDoc) { skipped++; continue; }
    let raw; try { raw = readFileSync(f, 'utf8'); } catch { continue; }
    if (raw.length > maxBytes) { skipped++; continue; }
    const rel = relative(root, f);
    const scope = isCode ? 'code' : 'doc';
    for (const c of chunk(raw, scope)) {
      const res = store.upsert({ text: c, source: `repo:${rel}`, scope, metadata: { git_sha: sha, path: rel } });
      if (res.status === 'added') added++;
    }
  }
  return { added, skipped, files: files.length, git_sha: sha };
}

// generic JSONL/JSON loader for sessions, transcripts, logs, issues, PRs
export function ingestRecords(store, records, { source = 'records', scope = 'doc', textKey = 'text' } = {}) {
  let added = 0;
  for (const rec of records) {
    const text = typeof rec === 'string' ? rec : (rec[textKey] || JSON.stringify(rec));
    const src = (rec && rec.source) || source;
    const res = store.upsert({ text, source: src, scope, metadata: rec.metadata || {} });
    if (res.status === 'added') added++;
  }
  return { added, total: records.length };
}

export function ingestSessionSummaries(store, dir) {
  if (!existsSync(dir)) return { added: 0, total: 0 };
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  let added = 0;
  for (const f of files) {
    const text = readFileSync(join(dir, f), 'utf8');
    for (const c of chunk(text, 'doc')) {
      const res = store.upsert({ text: c, source: `session:${f}`, scope: 'session' });
      if (res.status === 'added') added++;
    }
  }
  return { added, total: files.length };
}

// Freshness: mark code memory stale when its file changed since indexing.
export function refreshStaleness(store, root) {
  const sha = gitSha(root);
  if (!sha) return { checked: 0, staled: 0 };
  let changed = new Set();
  try {
    const out = execSync('git diff --name-only HEAD~1 HEAD', { cwd: root, stdio: ['ignore','pipe','ignore'] }).toString();
    changed = new Set(out.split('\n').filter(Boolean));
  } catch { /* no prior commit */ }
  let staled = 0;
  if (changed.size) {
    staled = store.markStale((e) => e.metadata && e.metadata.path && changed.has(e.metadata.path));
  }
  return { checked: changed.size, staled, git_sha: sha };
}
