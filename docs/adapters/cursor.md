# Cursor Adapter

Use this when your coding assistant is Cursor.

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md).

## Quick setup: project-local file

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link

cd ~/your-project
vibe init cursor
vibe doctor --project .
```

## What command do I type?

```bash
cd ~/your-project
vibe init cursor
```

Manual equivalent — root `.cursorrules` file:

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./.cursorrules
```

Manual equivalent — Cursor project rules:

```bash
cd ~/your-project
mkdir -p .cursor/rules
cp ~/vibe-coding-os/AGENTS.md .cursor/rules/vibe-coding-os.md
```

## What file gets created?

Either:

```text
.cursorrules
```

or:

```text
<project>/.cursor/rules/vibe-coding-os.md
```

Check which option your Cursor version uses. Newer Cursor versions prefer the `.cursor/rules/` path.

## How do I open the tool?

Open your project folder in the Cursor app, then open the Cursor chat panel or Composer.

## First prompt to paste

```text
Read the project rules and follow the Vibe Coding OS workflow. Define a spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

Next phase:

```text
Follow the plan-driven execution skill. Create a file-oriented implementation plan based on the spec and list validation commands.
```

## How to verify setup loaded

Ask Cursor:

```text
What project rules did you load? Confirm whether you can see the Vibe Coding OS workflow, then list the first workflow step.
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

- **No rules file:** Cursor may not pick up rules if the file is in the wrong location. Check your Cursor version docs for where project rules are expected.
- **Rules overwritten:** if your project already has `.cursorrules`, merge the Vibe workflow guidance instead of replacing the whole file.
- **Rules too long:** keep project rules concise. Paste full command/skill content in chat only when needed.
- **`vibe` command not found:** run `npm link` from `~/vibe-coding-os`, or use the manual `cp` command.

## Plugin vs project-local

Cursor uses **project-local** setup. There is no global plugin path.

- **Project-local rules:** the recommended path. Instructions live in the repo and are reviewable via PR.
- **Manual paste:** useful for quick experiments or locked-down repos.
