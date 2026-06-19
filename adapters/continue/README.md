# Continue.dev Adapter

Continue.dev is an open-source AI coding assistant for VS Code and JetBrains. It uses `config.json` for global and project-level rules, and supports per-directory `AGENTS.md` files.

See the [adapter compatibility matrix](../compatibility-matrix.md) for cross-tool setup details and limitations.

## Quick setup

### Via AGENTS.md (recommended)

Continue.dev reads `AGENTS.md` files from the workspace root and subdirectories. Copy the Vibe Coding OS `AGENTS.md` to your project root:

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./
```

Continue will inject `AGENTS.md` context automatically when the workspace or relevant subdirectory is active.

### Via config.json rules

Add Vibe Coding OS rules to your project `.continuerc.json` or workspace `config.json`:

```json
{
  "rules": [
    "Inspect the repository before changing files.",
    "Prefer small, correct, reviewable changes over broad rewrites.",
    "Run `npm run validate` for repository structure changes before final response.",
    "Keep external attribution clean. Check `references/index.json` before using upstream inspiration.",
    "For non-trivial work: constitution → specify → plan → tasks → implement."
  ],
  "slashCommands": [
    {
      "name": "spec",
      "description": "Create or update a specification",
      "prompt": "Read {{ ~/vibe-coding-os/commands/vibe-spec.md }} and follow its steps to create a spec."
    },
    {
      "name": "plan",
      "description": "Create an implementation plan from a spec",
      "prompt": "Read {{ ~/vibe-coding-os/commands/vibe-plan.md }} and follow its steps to create a plan."
    },
    {
      "name": "implement",
      "description": "Implement from a plan",
      "prompt": "Read {{ ~/vibe-coding-os/commands/vibe-implement.md }} and follow its steps to implement."
    },
    {
      "name": "review",
      "description": "Request a code review",
      "prompt": "Read {{ ~/vibe-coding-os/commands/vibe-review.md }} and follow its steps to review."
    }
  ]
}
```

## Usage

- Use **slash commands** (`/spec`, `/plan`, `/implement`, `/review`) to trigger Vibe workflow phases.
- Use **context providers** to inject knowledge: `@files` for specific documents, `@codebase` for full context.
- Attach `skills/*/*/SKILL.md` files via `@file` mention when you need focused operating procedures.
- Run `npm run validate` in the integrated terminal for structural changes.

## Tool-specific notes

### Context Providers

Continue.dev has powerful context providers that complement Vibe Coding OS:

| Provider | Usage |
|---|---|
| `@files` | Attach Vibe skill or command files explicitly |
| `@codebase` | Provide full repo context for the AI to understand structure |
| `@web` | Search for documentation or packages |
| `@docs` | Reference documentation sites |
| `@terminal` | Run npm scripts and capture output |

### Slash Commands as Skills

Each slash command in Continue acts as an executable skill. You can define commands for any Vibe workflow phase or reference specific skills:

```json
{
  "slashCommands": [
    {
      "name": "memory-save",
      "description": "Save session decisions to memory",
      "prompt": "Read {{ ~/vibe-coding-os/commands/vibe-memory.md }} and save the key decisions from this session."
    },
    {
      "name": "brownfield",
      "description": "Enhance an existing codebase",
      "prompt": "Read {{ ~/vibe-coding-os/commands/vibe-brownfield-spec.md }} and create a brownfield enhancement spec."
    }
  ]
}
```

### Multi-agent coordination

When using Continue with multiple chat sessions (or VS Code workspaces), document handoffs explicitly:

- **Context:** Current state and key decisions
- **Files touched:** Absolute paths of changed files
- **Decisions:** Important trade-offs made
- **Risks:** Known issues or uncertainties
- **Verification:** How to verify the work

### IDE-specific notes

- **VS Code:** Use `Continue: Custom Slash Command` from the command palette to trigger defined slash commands.
- **JetBrains:** Continue plugin provides the same slash commands and context providers. `AGENTS.md` is read from the project root.

### Install snippet

```bash
# Via AGENTS.md (simplest)
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./

# Or via config.json with slash commands
cp ~/vibe-coding-os/adapters/continue/config.example.json .continuerc.json
```
