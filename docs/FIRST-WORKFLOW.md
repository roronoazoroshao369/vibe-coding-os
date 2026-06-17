# Your First Workflow

> Get from zero to a working spec→plan→implement→verify loop in under 15 minutes.

**This doc is for first-time users.** If you already have the framework set up, this is your canonical onboarding workflow. For tool-specific setup only, see [`QUICKSTART.md`](QUICKSTART.md). For installation paths, see [`../INSTALL.md`](../INSTALL.md).

## Prerequisites

| Requirement | Minimum |
|-------------|---------|
| Node.js | 18+ |
| Git | any recent version |
| An AI coding assistant | Claude Code, Codex, Cursor, or Gemini (pick one) |

The framework itself is dependency-light. You only need Node and Git to get started.

## Step 1 — Clone and Link the Framework

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
```

After `npm link`, the `vibe` command is available globally. This is a one-time setup.

## Step 2 — Validate the Framework Installation

```bash
vibe doctor
```

You should see all checks pass. If something is missing, run `npm install` inside `~/vibe-coding-os`.

Then run the framework's own validation suite:

```bash
npm run validate:all
```

> **Note:** `npm run validate:all` validates the framework itself (20 gates). It is separate from your app's tests.

## Step 3 — Switch to Your Target Project

Now move to the project where you'll build features:

```bash
cd ~/your-project
```

If you don't have a project yet, create one:

```bash
mkdir ~/my-first-vibe-app && cd ~/my-first-vibe-app
npm init -y
```

## Step 4 — Initialize Your Tool Adapter

Choose the adapter that matches your coding assistant:

```bash
# Claude Code users
vibe init claude-code

# Cursor users
vibe init cursor

# Codex users
vibe init codex

# Gemini users
vibe init gemini
```

This copies the right instruction file (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, or `GEMINI.md`) into your target project directory.

## Step 5 — Check Project Readiness

```bash
vibe doctor --project .
```

This confirms your target project has the instruction file your AI assistant needs.

## Step 6 — Your First Workflow

Create the directories your spec and plan will live in:

```bash
mkdir -p docs/specs docs/plans
```

Now open your project in your AI coding assistant and follow the loop:

### 6a. Start with a Spec

```
Define a feature spec for a simple counter app with increment, decrement, and reset.
Include goals, non-goals, and acceptance criteria. Do not implement yet.
```

Save the output to `docs/specs/counter-app.md`.

### 6b. Create a Plan

```
Based on the spec at docs/specs/counter-app.md, create an implementation plan.
List the files to create, the steps to take, and the verification commands.
```

Save the output to `docs/plans/counter-app.md`.

### 6c. Implement

```
Implement the plan from docs/plans/counter-app.md.
Create the files one at a time and verify each step.
```

### 6d. Review

```
Review the implementation against the spec.
List any bugs, missing features, or security concerns.
Do not make changes — just report.
```

### 6e. Verify

Run whatever tests your project normally uses:

```bash
npm test        # or: npm run lint, npm run typecheck
```

Then also run the validation accessible from your project directory:

```bash
vibe doctor --project .
```

## Step 7 — What to Do Next

| Next step | Command or link |
|-----------|-----------------|
| Check available commands | `vibe list-commands` |
| Browse skills | `vibe list-skills` |
| See all templates | `vibe templates` |
| View repo stats | `vibe stats` |
| Read the full tutorial | [docs/TUTORIAL.md](TUTORIAL.md) |
| Read the quickstart for your tool | [docs/QUICKSTART.md](QUICKSTART.md) |
| View adapter docs | [adapters/](../adapters/) |
| Real-world React/Next.js example | [examples/react-nextjs-booking-workflow/](../examples/react-nextjs-booking-workflow/) |

## Tips

- **Start small.** A one-file feature is the best first workflow.
- **Don't skip the spec.** Even a 3-line spec saves time compared to jumping straight to code.
- **One skill at a time.** Paste the command, then optionally attach one matching skill.
- **Validate the framework, then validate your app.** Two separate steps, both important.
- **Save decisions to files.** Chat history fades; files persist.

## Complete Workflow Summary

```
Clone → npm link → vibe doctor → validate:all (in framework)
    → cd ~/your-project → vibe init <tool> → vibe doctor --project .
    → Spec → Plan → Implement → Review → Verify → Done
```

Want a more detailed example? Try the [React/Next.js booking workflow](../examples/react-nextjs-booking-workflow/README.md).

See [ROADMAP-STATUS.md](ROADMAP-STATUS.md) for the project roadmap and [SECURITY-MODEL.md](SECURITY-MODEL.md) for how the framework handles safety.
