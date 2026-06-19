# Cline Adapter

Use this when your coding assistant is Cline (formerly Claude Dev).

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md), [Quality Shield](../quality-shield.md).

## Quick setup: project-local file

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md .clinerules
```

## What file gets created?

```text
.clinerules
```

Cline reads `.clinerules` from your project root as its system instructions.

## How do I open the tool?

Open your project in VS Code with the Cline extension installed, then open Cline from the sidebar.

## First prompt to paste

```text
Read .clinerules and follow the Vibe Coding OS workflow. Start with a feature spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

## How to verify setup loaded

Ask Cline:

```text
What project instructions did you load? Confirm whether you can see .clinerules and list the first workflow step.
```

Expected signal:
- It mentions Vibe Coding OS.
- It knows the spec → plan → implement → review → verify loop.

## Common failure modes

- **`.clinerules` is in the wrong directory:** run from the target project root, not from `~/vibe-coding-os`.
- **Cline was already open:** restart Cline or reload the project after creating `.clinerules`.
- **Mode-specific rules not loading:** make sure you named the files correctly (`.clinerules-architect`, `.clinerules-ask`, `.clinerules-code`).

## Mode-specific setup

Cline supports mode-specific rule files for different workflows:

| Mode | File | Best for |
|---|---|---|
| Architect | `.clinerules-architect` | Spec creation, planning, design |
| Ask | `.clinerules-ask` | Q&A, code review, analysis |
| Code | `.clinerules-code` | Implementation, testing, bug fixes |

Copy `AGENTS.md` to each mode file as needed, or create customized versions for each mode.
