---
sidebar_position: 2
---

# Quickstart Guides

Get up and running with Vibe Coding OS in under 10 minutes. This page covers **tool setup only**. After setup, run your first real workflow with [`FIRST-WORKFLOW.md`](first-workflow).

> Command location rule: framework validation commands run in the **Vibe Coding OS repo**. App commands run in your **target project**.

---

## Choose your path

Quick decision / chọn nhanh:

- **Want one setup for many Claude Code projects?** Use **Global scope** → [Claude Code plugin](#claude-code-plugin-recommended).
- **Want instructions committed and reviewed inside each project?** Use **Per-repo scope** → [Markdown adapters](#markdown-adapters) or `vibe init` from [Local CLI](#local-cli-workflow).
- **Want to try without changing project files?** Use **Manual scope** → paste prompts from `commands/` and relevant `skills/` from a local checkout.
- **Need `vibe` CLI, repo validation, or optional runtime?** Use **Local checkout scope** → [Local CLI](#local-cli-workflow).

Scope labels used below:

- **Global:** configured once in the assistant/tool; available across repos.
- **Per-repo:** instruction/rule files live in each target project.
- **Manual:** no install; paste/attach only what you need.
- **Runtime-local:** optional state in `.omc/runtime/` where initialized.

For full install details, see [`INSTALL.md`](install). For adapter-specific setup, see [`adapters/README.md`](adapters/README.md). For a deeper explanation, see [`setup-scope-guide.md`](setup-scope-guide.md).

---

## Claude Code plugin (recommended)

**Scope label:** **Global.** Best when you use Claude Code across multiple repositories and want `/vibe-*` commands without copying files.

In Claude Code, run:

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

After install:

```text
/plugin list
```

Then use `/vibe-*` commands and auto-triggered skills. Continue to [`FIRST-WORKFLOW.md`](first-workflow).

If plugin slash commands are unavailable, use the shell installer:

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

Restart Claude Code afterwards.

---

## Local CLI workflow

**Scope label:** **Local checkout + global CLI; target project setup is usually per-repo.** Use this path if you want to work from a repo checkout or use the `vibe` CLI.

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
npm run validate:all
```

> **Fallback:** If `npm link` is unavailable or the `vibe` command is not found, use `node scripts/vibe-cli.mjs <command>` instead (e.g., `node scripts/vibe-cli.mjs doctor`).

Then move to your target project:

```bash
cd ~/your-project
# Recommended project-local setup for the current terminal/session
vibe init --tool claude-code --scope recommended --current-terminal

# Preview only
vibe init --tool codex --scope minimal --current-terminal --dry-run

# Target a specific project directory
vibe init --tool cursor --scope full --project ~/your-project

vibe doctor --project .
```

Continue to [`FIRST-WORKFLOW.md`](first-workflow).

---

## Markdown adapters

**Scope label:** **Per-repo by default.** Vibe Coding OS is markdown-first. You can use it without runtime or CLI by copying/pasting instruction files into the target project.

Manual alternative: keep `~/vibe-coding-os` as a reference checkout and paste a specific `commands/*.md` prompt plus relevant `skills/*/SKILL.md` content when needed.

### Codex CLI

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

Paste a phase prompt from `~/vibe-coding-os/commands/` and attach relevant skills from `~/vibe-coding-os/skills/`. See [`adapters/codex.md`](adapters/codex.md).

### Gemini CLI

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md
```

Reference `commands/` and `skills/` paths as needed. See [`adapters/gemini.md`](adapters/gemini.md).

### Cursor / other assistants

Paste the contents of `CLAUDE.md` into project rules, then paste specific `commands/*.md` prompts per phase. See [`adapters/cursor.md`](adapters/cursor.md) and the adapter hub at [`adapters/README.md`](adapters/README.md).

---

## Optional runtime

**Scope label:** **Runtime-local.** Skip this unless you want local JSON task/memory/checkpoint/team/session state.

Run in the **Vibe Coding OS repo**:

```bash
npm run runtime:install
npm run runtime:init
npm run runtime:validate
```

The runtime is opt-in and never auto-starts. See [`RUNTIME-GUIDE.md`](RUNTIME-GUIDE.md).

---

## First useful workflow

Once your tool sees Vibe Coding OS instructions, run this loop in your **target project**:

```text
Use Vibe Coding OS.
Goal: <describe a small real change>.
Follow Intent → Spec → Plan → Implement → Test → Review → Memory → Merge.
Start by asking clarifying questions if anything is ambiguous.
```

For a guided version, continue to [`FIRST-WORKFLOW.md`](first-workflow).

---

## Validation cheat sheet

Run in **Vibe Coding OS repo**:

```bash
npm run validate        # core structural checks
npm run validate:all    # full 20-gate validation
```

Run in **target project**:

```bash
vibe doctor --project .
npm test               # or your app's test command
npm run lint           # if available
npm run typecheck      # if available
```
