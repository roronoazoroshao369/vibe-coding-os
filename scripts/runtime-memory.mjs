#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { ingestMemory, listMemory } from '../runtime/memory/memory-store.mjs';
import { searchMemory } from '../runtime/memory/retrieval.mjs';
import { buildIndex } from '../runtime/memory/vector-store.mjs';
function parseArgs(argv) {
  const positionals = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else positionals.push(a);
  }
  return { positionals, flags };
}

const { positionals, flags } = parseArgs(process.argv.slice(2));
const store = createStore(process.cwd());
const cmd = positionals[0];
if (cmd === 'ingest') console.log(JSON.stringify(await ingestMemory(store, { content: flags.content, scope: flags.scope, source: flags.source, tags: flags.tags ? String(flags.tags).split(',') : [] }), null, 2));
else if (cmd === 'search') {
  const isSemantic = flags.semantic !== undefined;
  const query = positionals.slice(1).join(' ') || flags.query || (typeof flags.semantic === 'string' ? flags.semantic : '') || '';
  console.log(JSON.stringify(await searchMemory(store, query.trim(), { semantic: isSemantic, limit: flags.limit }), null, 2));
}
else if (cmd === 'reindex') console.log(JSON.stringify(await buildIndex(store), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listMemory(store), null, 2));
else { console.error('usage: runtime-memory <ingest|search|reindex|list> [--content --scope --source --tags --query --semantic --limit]'); process.exit(1); }
