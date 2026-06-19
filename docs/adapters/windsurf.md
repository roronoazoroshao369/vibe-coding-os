# Windsurf Adapter

Use this when your coding assistant is Windsurf (Codeium's AI IDE).

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md), [Quality Shield](../quality-shield.md).

## Quick setup

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md .windsurfrules
```

Legacy compatibility with Cursor's `.cursorrules`:

```bash
cp ~/vibe-coding-os/AGENTS.md .cursorrules
```

## What file gets created?

```text
.windsurfrules           # Windsurf reads this as Cascade agent instructions
```

Windsurf reads `.windsurfrules` from the workspace root as its Cascade system instructions.

## How do I open the tool?

Open your project in Windsurf IDE. The Cascade agent is available from the sidebar.

## First prompt to paste

```text
Read .windsurfrules and follow the Vibe Coding OS workflow. Start with a feature spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

You can also create a **Flow** in Windsurf's Cascade interface:
1. Open Flows panel
2. Create steps: Spec → Plan → Implement → Verify
3. Each step references the corresponding Vibe command file

## How to verify setup loaded

Ask Cascade:

```text
What project instructions did you load? Confirm whether you can see .windsurfrules and list the first workflow step.
```

Expected signal:
- It mentions Vibe Coding OS.
- It knows the spec → plan → implement → review → verify loop.

## Common failure modes

- **`.windsurfrules` not in workspace root:** Windsurf reads rules from the workspace root. Make sure the file is at the top level.
- **Windsurf not picking up rules:** restart Windsurf or reload the workspace after creating `.windsurfrules`.
- **Using `.cursorrules` instead:** Windsurf reads `.cursorrules` as fallback. If both exist, `.windsurfrules` takes priority.
- **Flow not saving:** make sure you name each step clearly and save the flow before exiting Cascade.

## Windsurf Features for Vibe Workflows

| Feature | How it helps Vibe |
|---|---|
| Cascade agent | Autonomous multi-file editing following Vibe rules |
| Supercomplete | Whole-repo context-aware completions |
| Deep Context | Automatic context from full codebase |
| Flows | Multi-step prompt chains equivalent to Vibe workflows |
| Terminal integration | Run npm scripts directly in Cascade |
| Legacy .cursorrules | Easy migration from Cursor to Windsurf |