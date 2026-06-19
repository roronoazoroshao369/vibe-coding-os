---
sidebar_position: 3
---

# Install Vibe Coding OS

**Portable-first, Runtime optional.** The core is markdown-first and works with **zero runtime and zero dependencies**: skills, commands, templates, and docs are plain instructions. The optional runtime adds local automation and is fully opt-in via `npm run runtime:*`.

Pick the path that fits you. If you are unsure, start with the quick scope decision below or read [`docs/setup-scope-guide.md`](setup-scope-guide.md).

- **Path A — Claude Code plugin (Scope: global for Claude Code)**. Recommended. One command, no clone, available across repos.
- **Path B — Core only (Scope: local checkout + manual/per-repo use)**. Clone and use skills/commands/templates/docs. No runtime, no deps.
- **Path C — Optional runtime (Scope: local checkout/runtime state)**. Opt in to local task/memory/checkpoint/team/session/MCP automation.

## Quick scope decision / Chọn scope nhanh

- **Dùng Claude Code cho nhiều repo?** Chọn **Path A — global plugin**.
- **Muốn instruction được commit/review trong từng repo?** Chọn **per-repo adapter copy** from Path B, e.g. copy `CLAUDE.md`, `AGENTS.md`, or adapter rules into the target project.
- **Chỉ thử nhanh hoặc không muốn ghi file vào repo?** Chọn **manual** from Path B: paste prompts from `commands/` and attach relevant `skills/`.
- **Cần CLI, validate scripts, hoặc runtime?** Clone repo first (Path B), then optionally enable Path C.

## Prerequisites

- **Claude Code** — for the plugin and `/vibe-*` commands.
- **Node.js** — required by `install.sh` to merge Claude Code `settings.json` safely, by `npm run validate`, and by the optional runtime scripts (`"type": "module"`, ESM `.mjs`).
- **git** — for Path B/C (cloning the repo).
- **tmux** — only if you use the optional runtime team runner (`npm run runtime:team-run`).

## Path A — Use as a Claude Code plugin

**Scope label:** **Global for Claude Code.** Once enabled, the plugin is available to Claude Code across repositories without copying Vibe Coding OS files into each project.

The one-command installer registers the Vibe Coding OS marketplace and enables the plugin in your Claude Code settings. It uses the HTTPS-backed `github` plugin source, so no SSH key is required. Re-running is safe (idempotent).

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

What the installer actually does:

1. Uses `${CLAUDE_CONFIG_DIR:-$HOME/.claude}` as the Claude config dir.
2. Creates `settings.json` if missing.
3. Requires `node` so it can parse and merge JSON safely.
4. Adds this marketplace:

   ```json
   "extraKnownMarketplaces": {
     "vibe-coding-os": {
       "source": { "source": "github", "repo": "roronoazoroshao369/vibe-coding-os" }
     }
   }
   ```

5. Enables this plugin:

   ```json
   "enabledPlugins": {
     "vibe-coding-os@vibe-coding-os": true
   }
   ```

6. Writes a backup at `settings.json.bak`.
7. Prompts you to restart Claude Code. Claude Code will ask you to trust and install the plugin.

After restart, check:

```bash
claude plugin list
```

## Path B — Core only (no runtime, no deps)

**Scope label:** **Local checkout, then per-repo or manual use.** The checkout is your source of truth; your target projects only use it if you copy adapter files into them or paste/attach prompts manually.

Clone the repo and use it directly. Nothing to install, no `npm install`.

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git
cd vibe-coding-os
```

Then:

- Read `CLAUDE.md` (Claude Code) or `AGENTS.md` (Codex/Gemini) as the instruction surface.
- Use prompts in `commands/`, operating procedures in `skills/`, and artifacts in `templates/`.
- For other assistants, see `adapters/` and `adapters/compatibility-matrix.md`.

Common scope choices:

- **Per-repo:** copy `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, or adapter rules into each target project that should use the framework.
- **Manual:** do not copy files; paste a `commands/*.md` prompt and relevant `skills/*/SKILL.md` content into your assistant when needed.
- **Global-ish CLI:** run `npm link` from this checkout if you want the `vibe` CLI available globally; project instructions still remain per-repo unless you use the Claude Code plugin.

Core uses no daemon, database, MCP server, or tmux session.

## Path C — Optional runtime (opt-in)

**Scope label:** **Local runtime state.** Runtime state lives under `.omc/runtime/` in the checkout/project where you initialize it. It is not required for normal markdown-first usage.

The runtime adds local JSON state for tasks, memory, checkpoints, teams, sessions, daemon workflows, MCP tools, vector search, and a tmux team runner. Use it only when you want inspectable state or local automation.

`package.json` currently declares **no runtime dependencies**, so `npm install` is only needed if you opt into the MCP server (see below).

```bash
# Optional — only required for the MCP server path:
npm install

# Initialize runtime files in .omc/runtime/:
npm run runtime:init
```

Runtime scripts (real names from `package.json`):

| Script | Purpose |
| --- | --- |
| `npm run runtime:init` | Create/update `.omc/runtime/` JSON collections and config. |
| `npm run runtime:validate` | Validate runtime state. |
| `npm run runtime:task` | Manage runtime tasks. |
| `npm run runtime:memory` | Manage runtime memory. |
| `npm run runtime:checkpoint` | Manage checkpoint evidence. |
| `npm run runtime:team` | Manage runtime teams. |
| `npm run runtime:session` | Manage runtime sessions. |
| `npm run runtime:daemon` | Run daemon-related runtime operations. |
| `npm run runtime:mcp` | Start/list/help for the runtime MCP server wrapper. |
| `npm run runtime:team-run` | Run runtime team workflows; requires `tmux`. |
| `npm run runtime:install` | Bootstrap runtime assets; supports `--dry-run`, `--force`, `--mcp`. |

Suggested first checks:

```bash
npm run runtime:validate
npm run runtime:task -- create --title "First task"
npm run runtime:task -- next
```

### MCP server registration

The plugin ships `.mcp.json`:

```json
{
  "mcpServers": {
    "vibe-coding-os-runtime": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/scripts/runtime-mcp.mjs"]
    }
  }
}
```

For a project-local checkout, register the server in `.mcp.json` like:

```json
{
  "mcpServers": {
    "vibe-coding-os-runtime": {
      "command": "node",
      "args": ["scripts/runtime-mcp.mjs"]
    }
  }
}
```

Or let the runtime installer plan/write MCP registration:

```bash
npm run runtime:install -- --dry-run --mcp
npm run runtime:install -- --mcp
```

`@modelcontextprotocol/sdk` is intentionally **lazy/opt-in**: `runtime/mcp/server.mjs` dynamically imports it, so `--help`/`--tools` work without the package. To actually start the stdio server, add a pinned `@modelcontextprotocol/sdk` dependency, run `npm install`, then start/register `node scripts/runtime-mcp.mjs`. The server exposes `task.list`, `task.next`, `task.update`, `memory.search`, `memory.ingest`, and `checkpoint.create`. See `docs/workflows/runtime-mcp-server.md`.

## Verify install

From a repo checkout:

```bash
npm run validate
```

This runs:

```bash
node scripts/validate-repo.mjs && node scripts/validate-references.mjs
```

You can also run them separately: `npm run validate:repo` and `npm run validate:references`.

## Uninstall / cleanup

**Plugin (Path A):** edit `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/settings.json` and remove:

```json
"enabledPlugins": {
  "vibe-coding-os@vibe-coding-os": true
}
```

and, if no longer needed:

```json
"extraKnownMarketplaces": {
  "vibe-coding-os": {
    "source": { "source": "github", "repo": "roronoazoroshao369/vibe-coding-os" }
  }
}
```

**MCP:** remove the `vibe-coding-os-runtime` entry from `.mcp.json` (or your global MCP config) and restart the MCP client.

**Runtime state:** remove `.omc/runtime/` when you no longer need it. Back it up first if it holds tasks, memory, checkpoints, teams, or sessions you want to keep.

## Troubleshooting

- **`error: node is required` from `install.sh`** — install Node.js, then re-run. The installer needs `node` to merge `settings.json` safely.
- **Plugin not appearing after install** — restart Claude Code; it prompts to trust and install. Confirm with `claude plugin list`.
- **`tmux: command not found`** — only the runtime team runner (`npm run runtime:team-run`) needs tmux. Install tmux or skip that script.
- **MCP server won't start / SDK missing** — `@modelcontextprotocol/sdk` is opt-in. Run `npm run runtime:mcp -- --help` or `-- --tools` to confirm wiring without the SDK; add the pinned dependency and `npm install` to start the stdio server.
- **`npm run validate` fails** — run `npm run validate:repo` and `npm run validate:references` separately to isolate which check failed.
