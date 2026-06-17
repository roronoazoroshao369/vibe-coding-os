# Quickstart Guides

Get up and running with Vibe Coding OS in under 10 minutes. This page covers **tool setup only**. After setup, run your first real workflow with [`FIRST-WORKFLOW.md`](FIRST-WORKFLOW.md).

> Command location rule: framework validation commands run in the **Vibe Coding OS repo**. App commands run in your **target project**.

---

## Choose your path

| Path | Best for | Start with |
|---|---|---|
| Claude Code plugin | Fastest setup, slash commands | [Claude Code plugin](#claude-code-plugin-recommended) |
| Local checkout / CLI | Maintainers or users who want `vibe` CLI | [Local CLI](#local-cli-workflow) |
| Codex / Gemini / Cursor | Any assistant that reads markdown instructions | [Markdown adapters](#markdown-adapters) |
| Optional runtime | Local JSON task/memory/checkpoint state | [Optional runtime](#optional-runtime) |

For full install details, see [`../INSTALL.md`](../INSTALL.md).

---

## Claude Code plugin (recommended)

In Claude Code, run:

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

After install:

```text
/plugin list
```

Then use `/vibe-*` commands and auto-triggered skills. Continue to [`FIRST-WORKFLOW.md`](FIRST-WORKFLOW.md).

If plugin slash commands are unavailable, use the shell installer:

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

Restart Claude Code afterwards.

---

## Local CLI workflow

Use this path if you want to work from a repo checkout or use the `vibe` CLI.

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm link
npm run validate:all
```

Then move to your target project:

```bash
cd ~/your-project
vibe init claude   # or: codex, cursor, generic
vibe doctor --project .
```

Continue to [`FIRST-WORKFLOW.md`](FIRST-WORKFLOW.md).

---

## Markdown adapters

Vibe Coding OS is markdown-first. You can use it without runtime or CLI.

### Codex CLI

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

Paste a phase prompt from `~/vibe-coding-os/commands/` and attach relevant skills from `~/vibe-coding-os/skills/`. See [`../adapters/codex/README.md`](../adapters/codex/README.md).

### Gemini CLI

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md
```

Reference `commands/` and `skills/` paths as needed.

### Cursor / other assistants

Paste the contents of `CLAUDE.md` into project rules, then paste specific `commands/*.md` prompts per phase. See [`../adapters/cursor/README.md`](../adapters/cursor/README.md) and [`../adapters/compatibility-matrix.md`](../adapters/compatibility-matrix.md).

---

## Optional runtime

Skip this unless you want local JSON task/memory/checkpoint/team/session state.

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

For a guided version, continue to [`FIRST-WORKFLOW.md`](FIRST-WORKFLOW.md).

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
