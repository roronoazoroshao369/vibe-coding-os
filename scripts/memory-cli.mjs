#!/usr/bin/env node
// memory-cli.mjs — CLI for the local Vibe memory appliance.
import { createStore } from '../runtime/memory-local/store.mjs';
import { search, contextPack } from '../runtime/memory-local/retrieve.mjs';
import { ingestRepo, ingestSessionSummaries, refreshStaleness } from '../runtime/memory-local/ingest.mjs';

const [cmd, ...rest] = process.argv.slice(2);
const root = process.cwd();
const store = createStore(root);

function flag(name, def) {
  const i = rest.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = rest[i + 1];
  return v && !v.startsWith('--') ? v : true;
}
const query = rest.filter((r) => !r.startsWith('--') && rest[rest.indexOf(r) - 1] !== '--scope').join(' ');

switch (cmd) {
  case 'init': store.ensure(); console.log(`Initialized ${store.paths.dir}`); break;
  case 'status': console.log(JSON.stringify(store.status(), null, 2)); break;
  case 'ingest-repo': console.log(JSON.stringify(ingestRepo(store, flag('path', root)), null, 2)); break;
  case 'ingest-sessions': console.log(JSON.stringify(ingestSessionSummaries(store, flag('dir', 'docs/sessions')), null, 2)); break;
  case 'refresh': console.log(JSON.stringify(refreshStaleness(store, root), null, 2)); break;
  case 'search': console.log(JSON.stringify(search(store, query, { scope: flag('scope', 'all'), k: Number(flag('k', 8)) }), null, 2)); break;
  case 'pack': console.log(contextPack(store, query, { budget: Number(flag('budget', 4000)) }).context); break;
  case 'forget': {
    const sp = flag('source', null), days = flag('older-than', null);
    const cutoff = days ? Date.now() - Number(days) * 86400000 : null;
    const n = store.forget((e) => (sp ? e.source.startsWith(sp) : false) || (cutoff ? new Date(e.created).getTime() < cutoff : false));
    console.log(`Forgot ${n} entries`); break;
  }
  default:
    console.log(`vibe memory CLI
Usage:
  memory-cli init
  memory-cli status
  memory-cli ingest-repo [--path DIR]
  memory-cli ingest-sessions [--dir DIR]
  memory-cli refresh
  memory-cli search <query> [--scope code|doc|session|all] [--k N]
  memory-cli pack <query> [--budget N]
  memory-cli forget [--source PREFIX] [--older-than DAYS]`);
}
