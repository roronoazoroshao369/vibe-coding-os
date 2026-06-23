# Local Memory Appliance (vibe-memory)

A **local-first, zero-dependency** persistent memory layer for Vibe Coding OS.
It indexes every source of project context — code, docs, session summaries, chat
transcripts, tool/MCP logs, GitHub issues & PRs — into an on-disk store, and
serves the *right* context back to an AI assistant through hybrid retrieval and a
budget-aware context packer. Exposed to Claude Code as an opt-in MCP server.

> Solves the pain: "the assistant forgets context, a new session does not know
> what the last one did, and a large repo is too big to feed as context."

## Design principles

- **Local-first.** Everything lives under `<repo>/.vibe-memory/` on your disk
  (or an external SSD via a symlink). No cloud, no network, no API keys.
- **Zero dependencies.** Pure Node ESM. Embeddings are deterministic local
  n-gram hashes; no model download. Drop in a real embedding model later without
  changing the store or retrieval contract.
- **Privacy by construction.** Every record is passed through secret/PII
  redaction *before* it is written. Secrets never reach disk.
- **Freshness-aware.** Memory tied to a file is marked stale when that file
  changes; stale entries are excluded from retrieval by default.
- **Forgettable.** Hard-delete by source prefix or age. An append-only audit
  trail records every write, stale-mark, and delete.

## Storage layout

```
<root>/.vibe-memory/
  meta.json        store metadata + count
  entries.jsonl    one redacted memory record per line
  index.json       compact {id: {vector, scope, ...}} search index
  audit.jsonl      immutable audit trail (upsert / mark_stale / forget)
```

To put memory on an external drive: `ln -s /Volumes/SSD/vibe-memory <root>/.vibe-memory`.

## Components

| File | Role |
|---|---|
| `runtime/memory-local/embed.mjs` | Deterministic local embedding (256-dim, L2-normalized) + cosine |
| `runtime/memory-local/redact.mjs` | Secret/PII redaction (API keys, tokens, JWT, private keys, email) |
| `runtime/memory-local/chunk.mjs` | Source-aware chunking (paragraph for docs, function/class for code) |
| `runtime/memory-local/store.mjs` | On-disk append store: upsert, dedup, stale, forget, audit, status |
| `runtime/memory-local/retrieve.mjs` | Hybrid retrieval (vector + keyword, RRF fusion, freshness) + context packer |
| `runtime/memory-local/ingest.mjs` | Ingest repo files, session summaries, and arbitrary records |
| `runtime/mcp/memory-server.mjs` | Opt-in stdio MCP server (8 tools) |
| `scripts/memory-cli.mjs` | CLI: init, ingest, search, pack, refresh, forget, status |
| `tests/memory/verify.mjs` | Full verification suite (29 checks) |

## CLI quickstart

```bash
# from the repo root
node scripts/memory-cli.mjs init
node scripts/memory-cli.mjs ingest-repo
node scripts/memory-cli.mjs ingest-sessions --dir docs/sessions
node scripts/memory-cli.mjs search "where is auth middleware" --k 5
node scripts/memory-cli.mjs pack "token refresh bug" --budget 4000
node scripts/memory-cli.mjs refresh          # mark stale on changed files
node scripts/memory-cli.mjs forget --older-than 90
node scripts/memory-cli.mjs status
```

## MCP tools

The server exposes these tools (registered in `.mcp.json`):

| Tool | Purpose |
|---|---|
| `memory_status` | Store stats: count, stale, redactions, by-source |
| `memory_ingest_repo` | Index code + docs from the repo |
| `memory_ingest_sessions` | Index session summary markdown |
| `memory_ingest_records` | Index transcripts, tool logs, issues, PRs |
| `memory_search` | Hybrid search with scope/k filters |
| `memory_context_pack` | Compact cited context within a char budget |
| `memory_refresh` | Mark memory stale when its file changed |
| `memory_forget` | Delete by source prefix or age |

Inspect the surface without the SDK:

```bash
node runtime/mcp/memory-server.mjs --tools
```

The server **degrades cleanly**: if `@modelcontextprotocol/sdk` is not
installed it prints install guidance and exits 0 instead of crashing.

## Recommended automation (Claude Code hooks)

Wire the lifecycle into the existing hook surface in `.claude/settings.json`:

- `SessionStart` → `memory_context_pack` for the current branch/task.
- `PostToolUse` (Edit/Write) → `memory_ingest_records` with the diff summary.
- `Stop` / `SessionEnd` → ingest the session summary.
- periodically → `memory_refresh` to invalidate stale entries.

## Run the tests

```bash
node tests/memory/verify.mjs
# => 29 passed, 0 failed
```

## Upgrade path to a managed vector DB

The store and retrieval contracts are intentionally small. To move to a managed
vector DB (Qdrant local, or Pinecone/Weaviate cloud) later, swap `embed.mjs`
for a real model and back `store.mjs`/`retrieve.mjs` with the DB client — the
ingestion sources, redaction, freshness, and MCP tool surface stay unchanged.
