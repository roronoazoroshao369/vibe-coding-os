# Continue.dev Adapter

Use this when your coding assistant is Continue.dev (VS Code or JetBrains).

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md), [Quality Shield](../quality-shield.md).

## Quick setup: via AGENTS.md

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./
```

## Quick setup: via config.json with slash commands

Create a `.continuerc.json` in your project root:

```bash
cp ~/vibe-coding-os/adapters/continue/config.example.json .continuerc.json
```

Then customize the slash commands and rules for your project.

## What files get created?

```text
AGENTS.md                # Injected as project context automatically
.continuerc.json         # (optional) Slash commands and rules
```

Continue.dev reads `AGENTS.md` from the workspace root and subdirectories as contextual instructions. The `.continuerc.json` adds custom slash commands.

## How do I open the tool?

From VS Code: open the Continue.dev sidebar panel (Ctrl+Shift+I / Cmd+Shift+I).
From JetBrains: open the Continue.dev tool window.

## First prompt to paste

```text
Run the /spec slash command to create a specification for: <describe your small change>
```

Or manually:

```text
Read AGENTS.md and follow the Vibe Coding OS workflow. Start with a feature spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

## How to verify setup loaded

Ask Continue:

```text
What project instructions did you load? Confirm whether you can see AGENTS.md and the /spec slash command.
```

Expected signal:
- It mentions Vibe Coding OS or the rules from `AGENTS.md`.
- It can run `/spec` if slash commands are configured.
- It knows the spec → plan → implement → review → verify loop.

## Common failure modes

- **`AGENTS.md` not being read:** make sure AGENTS.md is in the workspace root. Continue reads it per-directory, so subdirectory placement works but root is most reliable.
- **Slash commands not showing:** restart Continue or reload the VS Code window after creating `config.json` or `.continuerc.json`.
- **Context provider not finding files:** use `@files` explicitly to reference Vibe skill or command files.

## Slash Commands as Vibe Workflows

Continue's slash commands are the ideal surface for Vibe workflows. The example config provides `/spec`, `/plan`, `/implement`, `/review`, `/memory`, and `/validate` commands — each referencing the corresponding Vibe command file.
