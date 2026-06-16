# Adapter Install Snippets

Copy these snippets into a terminal after cloning Vibe Coding OS. Replace `~/your-project` with the repository where you want the workflow available.

## Clone once

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os
npm install
node scripts/vibe-cli.mjs help
node scripts/vibe-cli.mjs doctor
```

## Claude Code

Claude Code uses `CLAUDE.md` as the primary instruction surface.

```bash
cd ~/your-project
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

Optional symlink instead of copy when you want local projects to track one shared checkout:

```bash
cd ~/your-project
ln -s ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
```

If you use the Claude Code plugin flow, this repository includes `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` manifests. Install from the marketplace/plugin commands documented in `docs/QUICKSTART.md`, or use the manual `CLAUDE.md` copy above when plugin installation is unavailable.

Validate the framework checkout and inspect helper commands:

```bash
cd ~/vibe-coding-os
node scripts/vibe-cli.mjs help
node scripts/vibe-cli.mjs list-commands
node scripts/vibe-cli.mjs doctor
npm run validate
```

Start a project workflow from `~/your-project` by launching Claude Code and asking for the relevant `/vibe-*` command, for example `/vibe-spec` followed by `/vibe-plan`.

## Codex

Codex uses `AGENTS.md` as the primary scoped instruction file.

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

Optional symlink:

```bash
cd ~/your-project
ln -s ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

Workflow start examples:

```bash
cd ~/your-project
codex
```

Then paste a focused prompt such as:

```text
Follow ~/vibe-coding-os/commands/vibe-spec.md. Define a spec for the requested change with goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

For the next phase:

```text
Follow ~/vibe-coding-os/commands/vibe-plan.md and skills/core/plan-driven-execution/SKILL.md. Create a file-oriented implementation plan and list validation commands.
```

Validate the framework checkout when you change framework files:

```bash
cd ~/vibe-coding-os
node scripts/vibe-cli.mjs doctor
npm run validate
```

## Cursor

Cursor setup depends on workspace rules. Use either a root `.cursorrules` file for older/manual setups or Cursor project rules if your Cursor version uses `.cursor/rules/`.

Root `.cursorrules` option:

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./.cursorrules
```

Project rules option:

```bash
cd ~/your-project
mkdir -p .cursor/rules
cp ~/vibe-coding-os/AGENTS.md .cursor/rules/vibe-coding-os.md
```

Keep rules concise if your project already has Cursor guidance: merge the Vibe workflow expectations instead of overwriting important local rules. In chat, paste or reference only the command and skills needed for the current phase, for example `commands/vibe-spec.md` plus `skills/core/spec-first-development/SKILL.md`.

Validate the framework checkout when you change framework files:

```bash
cd ~/vibe-coding-os
node scripts/vibe-cli.mjs doctor
npm run validate
```
