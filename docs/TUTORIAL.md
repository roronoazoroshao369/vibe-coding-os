# Vibe Coding OS — 15-Minute Tutorial

> From zero to your first complete workflow in 15 minutes.

This tutorial walks you through the entire Vibe Coding OS pipeline — from cloning the repo to creating a spec, plan, tasks, running validation, and reviewing your work. You'll use the CLI tools that ship with the framework and end with a full working loop.

## Who Is This For

- **Solo developers** who want to use AI coding assistants with engineering discipline.
- **Engineers evaluating Vibe Coding OS** who want a hands-on first impression.
- **Contributors** who need to understand the workflow before submitting a PR.
- Anyone comfortable with the terminal, Git, and `npm`. No other dependencies are required.

> New to the project? Start with [QUICKSTART.md](QUICKSTART.md) for a tool-specific setup, then come here for the full workflow experience.

## Prerequisites

| Requirement | Minimum |
|-------------|---------|
| Node.js | 18+ |
| Git | any recent version |
| npm | ships with Node |
| An AI coding assistant (optional) | Claude Code, Codex CLI, Cursor, or similar |

> The framework is **markdown-first** — you can use it as plain instructions without any runtime. The CLI and optional runtime enhance the experience but are not required.

## Step 1 — Clone & Install (2 minutes)

```bash
# Clone the repo
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os

# Install dependencies (validates that Node works)
npm install

# Link the CLI so `vibe` is available globally
npm link
```

After linking, you have two ways to use the CLI:

```bash
# Option A — global (after npm link)
vibe doctor

# Option B — no linking needed
node scripts/vibe-cli.mjs doctor
```

## Step 2 — Health Check with `vibe doctor` (1 minute)

```bash
vibe doctor
```

You should see all checks passing:

```
🩺 Vibe Coding OS — Doctor

Checking repository structure...
  ✅ package.json found
  ✅ AGENTS.md found
  ✅ CHANGELOG.md found
  ✅ docs/ directory found
  ✅ skills/ directory found
  ✅ commands/ directory found
  ✅ templates/ directory found
  ✅ scripts/ directory found
  ✅ registry/ directory found
  ✅ references/ directory found

Checking validation scripts...
  ✅ scripts/validate-repo.mjs
  ✅ scripts/validate-references.mjs
  ✅ scripts/validate-traceability.mjs
  ✅ scripts/validate-injection.mjs

All checks passed! ✅
```

> **Tip:** Run `vibe doctor` at the start of every session and after pulling new changes.

## Step 3 — Run Full Validation (2 minutes)

```bash
npm run validate:all
```

This runs the full validation gate: repo structure, references, traceability, injection scanning, secrets detection, memory redaction, adapter smoke tests, and CLI smoke tests. All should pass green.

For a quick structural check, you can also use:

```bash
npm run validate
```

## Step 4 — Create a Spec (2 minutes)

The Vibe Coding OS workflow is: **Intent → Spec → Plan → Implement → Test → Review → Memory → Merge**.

Let's walk through it with a small example: adding a `--version` flag to the CLI.

```bash
vibe spec add-version-flag --copy
```

This creates a spec template at `docs/specs/add-version-flag.md`. Open it and fill in:

- **Goal:** Show the framework version when running `vibe --version`.
- **Non-goals:** No new dependencies; no changes to the build process.
- **Acceptance Criteria:**
  1. `vibe --version` prints the version from `package.json`.
  2. `vibe -v` works as a short alias.
  3. Existing commands are unaffected.
  4. `npm run validate` still passes.

## Step 5 — Create a Plan (2 minutes)

After the spec is ready:

```bash
vibe plan add-version-flag --copy
```

This creates `docs/plans/add-version-flag.md`. Fill in:

- **Files to touch:** `scripts/vibe-cli.mjs`
- **Steps:**
  1. Read version from `package.json` at startup.
  2. Add `--version` and `-v` flags to the argument parser.
  3. Print version and exit.
- **Verification:** `vibe --version` outputs the version string; `npm run validate` passes.

## Step 6 — Create a Task Breakdown (1 minute)

```bash
vibe task add-version-flag --copy
```

This creates `docs/tasks/add-version-flag.md`. Add ordered tasks:

1. **Task 1** — Import `readFileSync` and parse `package.json` for version. *(no dependencies)*
2. **Task 2** — Add `--version` / `-v` argument handling. *(depends on Task 1)*
3. **Task 3** — Run `vibe --version` and verify output. *(depends on Task 2)*
4. **Task 4** — Run `npm run validate` to confirm no regressions. *(depends on Task 3)*

## Step 7 — Create a Memory Entry (1 minute)

Before ending your work session (or during it), capture what you've decided:

```bash
vibe memory session-notes --copy
```

This creates a session notes file in `docs/memory/`. Fill in:

- **Decisions made:** Using `package.json` as the version source (single source of truth).
- **Gotchas:** None so far.
- **Follow-ups:** Consider adding `--help` output that includes the version.

## Step 8 — Run the Eval Report (2 minutes)

```bash
npm run eval:report
```

This runs a comprehensive evaluation: repo validation, secret scanning, memory redaction, and adapter smoke tests. The report is saved to `docs/reports/evaluation-report.md`.

```
════════════════════════════════════════════════════════
  Vibe Coding OS — Evaluation Report
════════════════════════════════════════════════════════

  1. Repo Validation .............. PASS ✅
  2. Secret Scanning .............. PASS ✅
  3. Memory Redaction (30/30) ..... PASS ✅
  4. Adapter Smoke Tests .......... PASS ✅

  Result: 4/4 checks passed ✅
════════════════════════════════════════════════════════
```

## Step 9 — Review & Merge Checklist (2 minutes)

Before merging, walk through this checklist (from the [core workflow contract](core-workflow-contract.md)):

- [ ] **Intent satisfied** — `vibe --version` does what the spec says.
- [ ] **Spec met** — all acceptance criteria pass.
- [ ] **Plan executed** — all steps completed.
- [ ] **Tests pass** — `npm run validate` exits 0.
- [ ] **Review complete** — diff inspected for correctness, simplicity, security.
- [ ] **Memory captured** — decisions and follow-ups recorded.
- [ ] **Merge ready** — no unresolved blockers.
- [ ] **Attribution clean** — no unlicensed content introduced.

```bash
# Final validation
npm run validate

# If everything passes, commit
git add -A
git commit -m "feat: add --version flag to CLI"
```

## Step 10 — What's Next

You've completed the full workflow loop. Here's where to go from here:

| Topic | Where to Look |
|-------|---------------|
| Tool-specific setup | [QUICKSTART.md](QUICKSTART.md) — Claude Code, Codex, Cursor |
| Runtime (JSON state, MCP, tmux) | [RUNTIME-GUIDE.md](RUNTIME-GUIDE.md) |
| Complete workflow examples | [`examples/`](../examples/) — feature, bugfix, legacy, refactor, multi-agent |
| Browse all CLI commands | [`examples/cli-workflows/README.md`](../examples/cli-workflows/README.md) |
| Skill decision guide | [skill-decision-guide.md](skill-decision-guide.md) |
| Vietnamese docs | [`docs/vi/index.md`](vi/index.md) |
| Contributing | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Vietnamese tutorial | [TUTORIAL.vi.md](vi/TUTORIAL.vi.md) |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `vibe` command not found | Run `npm link` again, or use `node scripts/vibe-cli.mjs <command>` |
| `npm run validate` fails | Check that all files are present — run `vibe doctor` first |
| Node.js version error | Upgrade to Node 18+: `nvm install 18` or download from nodejs.org |
| `vibe doctor` shows missing files | Run `git status` to check for uncommitted deletions; restore with `git checkout -- .` |
| Templates not created | Ensure you're running commands from the repo root (`~/vibe-coding-os`) |
| Eval report has failures | Read the detailed output in `docs/reports/evaluation-report.md` |
| Spec/plan/task templates are empty | You need to fill them in — they are starting points, not auto-generated code |
| Runtime install fails | Check Node.js 18+; runtime is optional, you can skip it |

## Quick Reference

| Command | Purpose | When |
|---------|---------|------|
| `vibe doctor` | Health check | Start of every session |
| `vibe spec <name> --copy` | Create spec template | Before non-trivial work |
| `vibe plan <name> --copy` | Create plan template | After spec approved |
| `vibe task <name> --copy` | Create task breakdown | After plan written |
| `vibe memory session-notes --copy` | Capture session notes | End of session |
| `vibe templates` | Browse templates | Start of any new task type |
| `npm run validate` | Structural validation | After structural changes |
| `npm run validate:all` | Full validation gate | Before release or major changes |
| `npm run eval:report` | Comprehensive evaluation | Before release |

---

*You've just completed the Vibe Coding OS workflow. The framework is designed to be lightweight — use as much or as little as your task requires.*
