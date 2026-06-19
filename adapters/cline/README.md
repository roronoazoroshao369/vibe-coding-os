# Cline Adapter

Use `.clinerules` as the main instruction file. Cline reads `.clinerules` from the workspace root and injects it as system context for every conversation. You can also provide mode-specific rules via `.clinerules-architect`, `.clinerules-ask`, and `.clinerules-code`.

See the [adapter compatibility matrix](../compatibility-matrix.md) for cross-tool setup details and limitations.

## Quick setup

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md .clinerules
```

For mode-specific rules (optional), copy the file into mode-specific variants:

```bash
# Architect mode — focus on planning and design
cp ~/vibe-coding-os/AGENTS.md .clinerules-architect

# Ask mode — focused Q&A
cp ~/vibe-coding-os/AGENTS.md .clinerules-ask

# Code mode — implementation-focused
cp ~/vibe-coding-os/AGENTS.md .clinerules-code
```

Cline also supports `CLAUDE.md` for backward compatibility with Claude Code projects. If your project already has a `CLAUDE.md`, Cline reads both `.clinerules` and `CLAUDE.md`.

## Usage

- Paste relevant command prompts from `commands/` into Cline chat for workflow phases: `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, `vibe-memory`, or `vibe-merge`.
- Attach specific `skills/*/*/SKILL.md` files when you need a focused operating procedure.
- Use `templates/` to create durable specs, plans, reviews, task notes, memory notes, and upstream audit records.
- Run `npm run validate` for structural changes before final response.

## Tool-specific notes

### Cline Skills Directory

Cline supports a `.cline/skills/` directory where skills can be stored as markdown files. You can symlink or copy Vibe Coding OS skills there:

```bash
mkdir -p .cline/skills
ln -s ~/vibe-coding-os/skills .cline/skills/vibe-skills
```

Cline automatically reads `.cline/skills/` and makes them available as skills the agent can invoke.

### MCP Support

Cline has native MCP (Model Context Protocol) support. Use the Vibe Coding OS MCP-compatible tools:

```bash
# Add to your Cline MCP settings
# ~/.cline/mcp_settings.json or project-level
```

The Vibe Coding OS MCP adapter at `adapters/mcp/` provides tool patterns compatible with Cline's MCP integration.

### Multi-agent workflow

When using Cline with subagents or parallel conversations, give each agent explicit file/module ownership and state which files are shared. Finish each turn with:

- **Context:** Current state and key decisions
- **Files touched:** Absolute paths of changed files
- **Decisions:** Important trade-offs made
- **Risks:** Known issues or uncertainties
- **Verification:** How to verify the work

### Mode awareness

- **Architect mode (`-architect`):** Use for spec creation, planning, and design. Paste `commands/vibe-spec.md` and `commands/vibe-plan.md`. Read skills from `skills/core/spec-first-development/` and `skills/core/plan-driven-execution/`.
- **Code mode (`-code`):** Use for implementation and testing. Paste `commands/vibe-implement.md` and `skills/core/test-driven-development/`.
- **Ask mode (`-ask`):** Use for questions, code review, and analysis. Paste `commands/vibe-review.md` and `commands/vibe-analyze.md`.

### Install snippet

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md .clinerules
# Optional: mode-specific rules
cp ~/vibe-coding-os/AGENTS.md .clinerules-architect
cp ~/vibe-coding-os/AGENTS.md .clinerules-code
```

If `.clinerules` already exists, merge the Vibe workflow guidance into your existing rules rather than overwriting project-specific conventions.
