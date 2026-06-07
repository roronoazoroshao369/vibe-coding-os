# Runtime MCP Server

An opt-in [Model Context Protocol](https://modelcontextprotocol.io) server that
exposes local runtime operations (tasks, memory, checkpoints) as stdio-based
MCP tools.

## Prerequisites

- Node.js >= 18
- `@modelcontextprotocol/sdk` — install via `npm install` (the maintainer
  must add it to `package.json` first — see [Setup](#setup) below).

## Setup

1. Add the SDK to `package.json` (pinned exact version):

   ```jsonc
   "dependencies": {
     "@modelcontextprotocol/sdk": "<latest-version>"  // pin exact
   }
   ```

2. Optionally add a convenience script:

   ```jsonc
   "scripts": {
     "runtime:mcp": "node scripts/runtime-mcp.mjs"
   }
   ```

3. Install: `npm install`

## Registering in `.mcp.json`

Add an entry to your project's `.mcp.json` (or `~/.claude/.mcp.json` for
global availability):

```json
{
  "mcpServers": {
    "vibe-runtime": {
      "command": "node",
      "args": ["scripts/runtime-mcp.mjs"]
    }
  }
}
```

Once registered, the MCP client (e.g. Claude Desktop, Claude Code) will start
the server alongside your session and the tools become available.

## Provided tools

| Tool | Description |
| ---- | ----------- |
| `task.list` | List all runtime tasks with status and dependencies. |
| `task.next` | Return the next ready task (pending + deps satisfied), or null. |
| `task.update` | Change a task's status. |
| `memory.search` | Substring-search runtime memory records by content/tags. |
| `memory.ingest` | Write a new memory record (content is privacy-redacted). |
| `checkpoint.create` | Record a checkpoint gate (readiness/done evidence). |

## Local testing

```bash
node scripts/runtime-mcp.mjs --help
node scripts/runtime-mcp.mjs --tools
node scripts/runtime-mcp.mjs           # start on stdio (requires SDK)
```

## Design

- Thin wrappers around `runtime/tasks/task-store.mjs`,
  `runtime/memory/memory-store.mjs`, `runtime/memory/retrieval.mjs`, and
  `runtime/checkpoints/checkpoint-engine.mjs`.
- The SDK is loaded via dynamic `import()` so that `--help` and `--tools`
  work even when the package is not installed.
- Tool schemas are plain JSON Schema — no Zod or code generation.
- All state mutations go through the existing atomic-JSON-store layer
  (locks, atomic writes).
