# Your First Workflow

> Get from zero to a working spec→plan→implement→verify loop in under 15 minutes.

## Prerequisites

| Requirement | Minimum |
|-------------|---------|
| Node.js | 18+ |
| Git | any recent version |
| An AI coding assistant | Claude Code, Codex, Cursor, or Gemini (pick one) |

No npm install required for the framework itself. You only need Node and Git.

## Step 1 — Clone and Link

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
```

After `npm link`, the `vibe` command is available globally.

## Step 2 — Health Check

```bash
vibe doctor
```

You should see all checks pass. If something is missing, run `npm install` inside the vibe-coding-os directory.

## Step 3 — Pick Your Tool

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

This copies the right instruction file to your current directory.

## Step 4 — Run Validation

```bash
npm run validate:all
```

All 19 gates should pass. This confirms the framework is healthy before you start building.

## Step 5 — Your First Workflow

### 5a. Start with a Spec

Open your project in your AI coding assistant. Tell it:

```
Define a feature spec for a simple counter app with increment, decrement, and reset.
Include goals, non-goals, and acceptance criteria. Do not implement yet.
```

Save the output to `docs/specs/counter-app.md`.

### 5b. Create a Plan

```
Based on the spec at docs/specs/counter-app.md, create an implementation plan.
List the files to create, the steps to take, and the verification commands.
```

Save the output to `docs/plans/counter-app.md`.

### 5c. Implement

```
Implement the plan from docs/plans/counter-app.md.
Create the files one at a time and verify each step.
```

### 5d. Review

```
Review the implementation against the spec.
List any bugs, missing features, or security concerns.
Do not make changes — just report.
```

### 5e. Verify

Run whatever tests or validation your assistant produced. Then run:

```bash
npm run validate
```

## Step 6 — What to Do Next

| Next step | Command or link |
|-----------|-----------------|
| Check available commands | `vibe list-commands` |
| Browse skills | `vibe list-skills` |
| See all templates | `vibe templates` |
| View repo stats | `vibe stats` |
| Read the full tutorial | [docs/TUTORIAL.md](TUTORIAL.md) |
| Read the quickstart for your tool | [docs/QUICKSTART.md](QUICKSTART.md) |
| View adapter docs | [adapters/](../adapters/) |

## Tips

- **Start small.** A one-file feature is the best first workflow.
- **Don't skip the spec.** Even a 3-line spec saves time compared to jumping straight to code.
- **One skill at a time.** Paste the command, then optionally attach one matching skill.
- **Validate often.** `npm run validate` catches structural problems early.
- **Save decisions to files.** Chat history fades; files persist.

## Complete Workflow Summary

```
Clone → npm link → vibe doctor → vibe init <tool> → validate:all
    → Spec → Plan → Implement → Review → Verify → Done
```

See [ROADMAP-STATUS.md](ROADMAP-STATUS.md) for the project roadmap and [SECURITY-MODEL.md](SECURITY-MODEL.md) for how the framework handles safety.
