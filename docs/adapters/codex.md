# Codex Adapter

Use this when your coding assistant is Codex.

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md), [Quality Shield](../quality-shield.md).

## Quick setup: project-local file

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link

cd ~/your-project
vibe init codex
vibe doctor --project .
```

## What command do I type?

```bash
cd ~/your-project
vibe init codex
```

Manual equivalent:

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

## What file gets created?

```text
AGENTS.md
```

Codex reads this file from the project root as its scoped instruction file.

## How do I open the tool?

```bash
cd ~/your-project
codex
```

## First prompt to paste

```text
Read AGENTS.md and follow the Vibe Coding OS workflow. Define a spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

Next phase:

```text
Follow the plan-driven execution skill. Create a file-oriented implementation plan based on the spec and list validation commands.
```

## How to verify setup loaded?

Ask Codex:

```text
What project instructions did you load? Confirm whether you can see AGENTS.md or the Vibe Coding OS workflow, then list the first workflow step.
```

Expected signal:

- It mentions Vibe Coding OS.
- It knows the spec → plan → implement → review → verify loop.
- It can reference commands from `commands/` and skills from `skills/`.

CLI check:

```bash
cd ~/your-project
vibe doctor --project .
```

## Common failure modes

- **`AGENTS.md` is in the wrong directory:** run setup from the project root.
- **`AGENTS.md` missing or overwritten:** re-run `vibe init codex` or the manual copy.
- **Codex ignores the file:** some Codex setups expect `AGENTS.md` in the project root, not a subdirectory.
- **`vibe` command not found:** run `npm link` from `~/vibe-coding-os`, or use the manual `cp` command.

## Plugin vs project-local

Codex uses **project-local** setup. There is no global plugin path.

- **Project-local `AGENTS.md`:** the recommended path. Instructions live in the repo and are reviewable via PR.
- **Manual paste:** useful for quick experiments or locked-down repos where you cannot write new files.
