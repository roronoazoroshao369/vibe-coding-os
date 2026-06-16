# Runtime Getting Started Guide

> Optional JSON-first layer cho Vibe Coding OS — inspectable state dưới `.omc/runtime/`.

## Runtime Là Gì?

Runtime là **tùy chọn (opt-in)** — markdown vẫn là baseline. Runtime thêm:
- **JSON state** cho task, memory, checkpoint, team, session
- **MCP server** expose tools cho agent có hỗ trợ MCP
- **Tmux team runner** cho multi-agent orchestration
- **Daemon** background process

**Markdown vẫn chạy được nếu không có runtime.**

## Prerequisites

- Node.js 18+
- (Optional) tmux cho team runner
- (Optional) MCP-compatible agent

## Quick Start

```bash
# 1. Install runtime (idempotent)
npm run runtime:install

# 2. Initialize state
npm run runtime:init

# 3. Validate
npm run runtime:validate

# 4. Check state
ls -la .omc/runtime/
```

For markdown-first health checks before or after runtime setup, use `commands/vibe-doctor.md` to inspect repository wiring and validation readiness.

## Available Commands

| Command | Mô Tả | Output |
|---------|-------|--------|
| `npm run runtime:install` | Cài runtime dưới `.omc/runtime/` | Files + optional .mcp.json |
| `npm run runtime:init` | Initialize JSON state stores | task.json, memory.json, etc. |
| `npm run runtime:validate` | Validate runtime schema | Pass/fail report |
| `npm run runtime:task` | Task state management | CRUD operations on tasks |
| `npm run runtime:memory` | Local memory store | Store/retrieve memory entries |
| `npm run runtime:checkpoint` | Evidence checkpointing | Save verification evidence |
| `npm run runtime:team` | Team spec & state | Team roles, handoffs |
| `npm run runtime:session` | Session capture | Save/restore session state |
| `npm run runtime:daemon` | Background daemon | Long-running processes |
| `npm run runtime:mcp` | MCP stdio server | Expose tools via MCP |
| `npm run runtime:team-run` | Tmux team runner | Multi-agent orchestration |

## MCP Server Setup

MCP server được khai báo trong `.mcp.json`:

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

### MCP Tools Available

| Tool | Description |
|------|-------------|
| `vibe_task_list` | List all tasks |
| `vibe_task_create` | Create new task |
| `vibe_task_update` | Update task status |
| `vibe_memory_store` | Store memory entry |
| `vibe_memory_search` | Search memory |
| `vibe_checkpoint_save` | Save verification checkpoint |

## Runtime State Structure

```
.omc/runtime/
├── task.json          # Task state
├── memory.json        # Memory entries
├── checkpoint.json    # Verification evidence
├── team.json          # Team spec & roles
├── session.json       # Session captures
└── config.json        # Runtime config
```

## Usage Patterns

### Pattern 1: Simple (No Runtime)
```
Markdown only → commands → skills → templates
```

### Pattern 2: With Runtime
```
npm run runtime:init
npm run runtime:task → manage task state
npm run runtime:memory → store decisions
npm run runtime:checkpoint → save evidence
```

### Pattern 3: Multi-Agent
```
npm run runtime:team → define roles
npm run runtime:team-run → orchestrate via tmux
npm run runtime:session → capture per-agent state
```

When runtime state or long sessions risk overloading the agent, load `skills/meta/context-budget/SKILL.md` before injecting additional memory, task, or team context.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `runtime:install` fails | Check Node.js version (18+) |
| `.omc/runtime/` not created | Run `npm run runtime:init` first |
| MCP tools not found | Check `.mcp.json` exists and is valid |
| Team runner fails | Ensure tmux is installed (`brew install tmux`) |
| State corruption | Delete `.omc/runtime/` and re-init |

## Markdown vs Runtime

| Feature | Markdown Only | With Runtime |
|---------|---------------|--------------|
| Skills | ✅ | ✅ |
| Commands | ✅ | ✅ |
| Templates | ✅ | ✅ |
| Task state | Manual in markdown | JSON inspectable |
| Memory | Manual notes | Searchable store |
| Checkpoints | Manual verification | Auto evidence |
| MCP tools | ❌ | ✅ |
| Team runner | ❌ | ✅ |
