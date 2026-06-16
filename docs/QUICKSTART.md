# Quickstart Guides

Get up and running with Vibe Coding OS in under 10 minutes. Choose the guide for your tool.

---

## Claude Code — 10 Minutes

### Prerequisites
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and running

### Step 1: Clone the Repository

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
```

### Step 2: Install the Plugin

Open Claude Code and run these two commands **one at a time** (do not paste both at once):

```
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
```

Then:

```
/plugin install vibe-coding-os
```

Skills will auto-activate by trigger. Commands are available as `/vibe-*`.

### Step 3: (Alternative) Manual Setup

If you prefer not to use the plugin:

```bash
cd ~/your-project
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

### Step 4: Run Your First Workflow

Start Claude Code in your project directory:

```bash
cd ~/your-project
claude
```

Then give Claude Code a task. For example, to spec out a new feature:

```
Use /vibe-spec to define a user authentication feature with login, logout, and session management. Include acceptance criteria.
```

### Step 5: Follow the Full Workflow

```text
/vibe-spec       → Define what to build and why
/vibe-plan       → Break it into concrete steps and files
/vibe-implement  → Make the changes
/vibe-review     → Check correctness, simplicity, security
/vibe-memory     → Record durable decisions
/vibe-merge      → Confirm readiness to ship
```

### Step 6: Validate

```bash
npm run validate
```

**Done!** You're now using Vibe Coding OS with Claude Code. See [`adapters/claude-code/README.md`](../adapters/claude-code/README.md) for advanced usage.

---

## Codex CLI — 10 Minutes

### Prerequisites
- [Codex CLI](https://github.com/openai/codex) installed and running

### Step 1: Clone the Repository

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
```

### Step 2: Copy AGENTS.md to Your Project

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

Codex reads `AGENTS.md` as its instruction surface. This file tells Codex to follow the Vibe Coding OS workflow.

### Step 3: Run Your First Command

Start Codex in your project:

```bash
codex
```

Paste the content of a command prompt to start. For example, paste the content of `~/vibe-coding-os/commands/vibe-spec.md`:

```
Define a feature spec for a user authentication system. Include goals, non-goals, constraints, and acceptance criteria. Do not implement yet.
```

### Step 4: Follow the Full Workflow

Copy and paste each command prompt as you progress:

```text
vibe-spec.md       → Define what to build
vibe-plan.md       → Plan the implementation
vibe-implement.md  → Execute the plan
vibe-review.md     → Review the changes
vibe-memory.md     → Record decisions
vibe-merge.md      → Confirm merge readiness
```

### Step 5: Attach Skills When Needed

For a complex task, attach a relevant skill to the conversation. For example:

```
Before coding, follow the procedure in skills/core/spec-first-development/SKILL.md
```

### Step 6: Validate

```bash
npm run validate
```

**Done!** You're now using Vibe Coding OS with Codex CLI. See [`adapters/codex/README.md`](../adapters/codex/README.md) for advanced usage.

---

## Cursor — 10 Minutes

### Prerequisites
- [Cursor](https://cursor.sh/) installed and running

### Step 1: Clone the Repository

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
```

### Step 2: Set Up Project Rules

Create or update `.cursorrules` in your project root. Copy the contents of `CLAUDE.md` or `AGENTS.md` into `.cursorrules`:

```bash
cd ~/your-project
cp ~/vibe-coding-os/CLAUDE.md ./.cursorrules
```

This tells Cursor to follow the Vibe Coding OS workflow in every chat.

### Step 3: Run Your First Command

Open Cursor and start a new chat. Paste the content of a command prompt. For example, paste `~/vibe-coding-os/commands/vibe-spec.md`:

```
I want to build a file upload feature. Please create a spec with goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

### Step 4: Follow the Full Workflow

Open a new chat or thread for each phase and paste the corresponding command:

```text
vibe-spec.md       → Define requirements
vibe-plan.md       → Create implementation plan
vibe-implement.md  → Make changes
vibe-review.md     → Review the diff
vibe-memory.md     → Save durable notes
vibe-merge.md      → Verify readiness
```

### Step 5: Attach Skills When Needed

Add skill content to chat context for focused procedures:

```
Follow skills/core/review-before-merge/SKILL.md for this review pass.
```

### Step 6: Validate

```bash
npm run validate
```

**Done!** You're now using Vibe Coding OS with Cursor. See [`adapters/cursor/README.md`](../adapters/cursor/README.md) for advanced usage.

---

## Next Steps

After completing your first workflow:

- Browse [adapter install snippets](adapter-install-snippets.md) for copy-paste setup per adapter
- Explore the [full skills library](../skills/) for discipline-specific procedures
- Browse [examples](../examples/) for complete end-to-end workflows
- Check the [Vietnamese documentation](vi/index.md) for localized guides (`docs/vi/`)
- Read the [strategy and roadmap](vi/strategy-and-roadmap.md) to see where the project is headed
- Set up the [optional runtime layer](../scripts/runtime-install.mjs) for JSON state, checkpoints, and team orchestration
