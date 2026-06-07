# Runtime Vector Memory

Opt-in semantic/similarity memory search using a local deterministic embedding — no external dependencies, always works offline.

## Architecture

```
scripts/runtime-memory.mjs  (CLI — now accepts --semantic)
runtime/memory/memory-store.mjs  (ingest / list — unchanged)
runtime/memory/retrieval.mjs     (search — now supports { semantic: true })
runtime/memory/vector-store.mjs  (NEW — embed, buildIndex, semanticSearch)
runtime/core/privacy.mjs         (redactText is called before hashing tokens)
runtime/core/fs-store.mjs        (JSON file IO, locking)
```

### Index File

Vectors are stored sparsely under `.omc/runtime/indexes/memory-vectors.json`.

Only the vector store writes to this location; the original `memory.json` record remains the single source of truth.

## Embedding

### Default: `local-hash` (offline, deterministic)

- Tokenizes text on non-alphanumeric boundaries, filters single-character tokens.
- Applies FNV-1a hash (deterministic across restarts) to map each token into a 256-dimensional space.
- Term-frequency bag-of-words, L2-normalized so that dot product equals cosine similarity.
- `redactText()` from privacy.mjs runs before hashing — secrets never enter the vector index.
- Zero network calls, zero `package.json` additions, zero native dependencies.

### External provider (never default)

Configured via `.omc/runtime/config.json`:

```json
{
  "adapters": { "vector": true },
  "vectorProvider": { "type": "openai" }
}
```

The application code supplies the embedding function at call time (`embedFn`); the runtime itself ships no network embedding logic. Without `embedFn`, an explicit error is thrown.

## Search

`semanticSearch(store, query, options?)`:
1. Loads the vector index (auto-rebuilds if empty or stale relative to memory count).
2. Embeds the query using the same model.
3. Ranks all indexed vectors by cosine similarity, returns top-N (default 10) with `score` (0–1).

## CLI Usage

```bash
# Ingest some memories
node scripts/runtime-memory.mjs ingest --content="User prefers dark mode for the dashboard"
node scripts/runtime-memory.mjs ingest --content="API timeout set to 30 seconds for external calls"
node scripts/runtime-memory.mjs ingest --content="Deploy requires approval from the senior engineer"

# Keyword search (default, unchanged)
node scripts/runtime-memory.mjs search "dark mode"

# Semantic search with automatic index build
node scripts/runtime-memory.mjs search --semantic "UI theming preferences"
node scripts/runtime-memory.mjs search --semantic "timeout configuration" --limit 5

# Explicit reindex (also triggers automatically on stale index)
node scripts/runtime-memory.mjs reindex
```

## Privacy

`redactText()` runs **before** embedding, so Redacted tokens are hashed as literal `[REDACTED]`. The vector index never contains raw secrets.

## Programmatic Usage

```js
import { createStore } from '../runtime/core/fs-store.mjs';
import { semanticSearch, buildIndex } from '../runtime/memory/vector-store.mjs';

const store = createStore(process.cwd());

// Auto-rebuild + search
const results = await semanticSearch(store, 'some query', { limit: 5 });
console.log(results);

// Explicit reindex
await buildIndex(store);
```
