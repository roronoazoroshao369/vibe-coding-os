# Gemini Adapter

Use this when your coding assistant is Gemini.

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md), [Quality Shield](../quality-shield.md).

## Quick setup: project-local file

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link

cd ~/your-project
vibe init gemini
vibe doctor --project .
```

## What command do I type?

```bash
cd ~/your-project
vibe init gemini
```

Manual equivalent:

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md
```

## What file gets created?

```text
GEMINI.md
```

Gemini reads this file from the project root as its scoped instruction file.

## How do I open the tool?

Open your project in Gemini Code Assist, or launch Gemini CLI from your project directory if you are using the CLI path.

## First prompt to paste

```text
Read GEMINI.md and follow the Vibe Coding OS workflow. Define a spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

Next phase:

```text
Follow the plan-driven execution skill. Create a file-oriented implementation plan based on the spec and list validation commands.
```

## How to verify setup loaded

Ask Gemini:

```text
What project instructions did you load? Confirm whether you can see GEMINI.md or the Vibe Coding OS workflow, then list the first workflow step.
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

- **`GEMINI.md` is in the wrong directory:** run setup from the project root.
- **Gemini CLI expects `AGENTS.md`:** some versions look for `AGENTS.md` instead. If `GEMINI.md` is not loaded, copy `AGENTS.md` into the project root and test again.
- **`vibe` command not found:** run `npm link` from `~/vibe-coding-os`, or use the manual `cp` command.

## Plugin vs project-local

Gemini uses **project-local** setup. There is no global plugin path.

- **Project-local `GEMINI.md`:** the recommended path. Instructions live in the repo and are reviewable via PR.
- **Manual paste:** useful for quick experiments or locked-down repos.
