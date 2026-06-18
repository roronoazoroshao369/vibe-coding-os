# Claude Code Adapter

Use this when your coding assistant is Claude Code.

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md).

## Quick setup: project-local file

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link

cd ~/your-project
vibe init claude-code
vibe doctor --project .
```

## What command do I type?

Preferred project-local setup:

```bash
cd ~/your-project
vibe init claude-code
```

Manual equivalent:

```bash
cd ~/your-project
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

Global plugin setup, if you want one install for many repos:

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

## What file gets created?

Project-local setup creates:

```text
CLAUDE.md
```

Claude Code reads this file from your project root as its project guidance.

## How do I open the tool?

From your target project:

```bash
cd ~/your-project
claude
```

Or open the project in Claude Code however you normally launch it.

## First prompt to paste

```text
Read CLAUDE.md and follow the Vibe Coding OS workflow. Start with a feature spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

If using the plugin, you can start with a command-style request:

```text
/vibe-spec <describe your small change>
```

## How to verify setup loaded

Ask Claude Code:

```text
What project instructions did you load? Confirm whether you can see CLAUDE.md or the Vibe Coding OS plugin commands, then list the first workflow step.
```

Expected signal:

- It mentions Vibe Coding OS.
- It knows the spec → plan → implement → review → verify loop.
- It can reference `/vibe-*` commands if the plugin is installed, or `CLAUDE.md` if project-local.

CLI check:

```bash
cd ~/your-project
vibe doctor --project .
```

## Common failure modes

- **`CLAUDE.md` is in the wrong directory:** run setup from the target project root, not from `~/vibe-coding-os`.
- **Claude Code was already open:** restart Claude Code or reload the project after creating `CLAUDE.md`.
- **Plugin installed but commands missing:** verify the marketplace URL, then reinstall with `/plugin install vibe-coding-os`.
- **Project-local and plugin guidance conflict:** keep project-specific constraints in `CLAUDE.md`; keep shared workflow behavior in the plugin.
- **`vibe` command not found:** run `npm link` from `~/vibe-coding-os`, or use the manual `cp` command.

## Plugin vs project-local

- **Plugin:** best for one-time Claude Code setup across many repositories. Commands and skills are available globally in Claude Code.
- **Project-local `CLAUDE.md`:** best when a team wants instructions versioned and reviewed inside each repository.
- **Both:** okay when `CLAUDE.md` only adds project-specific rules and does not duplicate broad workflow instructions.
