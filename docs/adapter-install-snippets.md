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

## Gemini

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md
```

Then launch Gemini CLI:

```bash
cd ~/your-project
gemini
```

## Cline

Cline uses `.clinerules` as the primary instruction surface.

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./.clinerules
```

Optional mode-specific rules:

```bash
cp ~/vibe-coding-os/AGENTS.md ./.clinerules-architect
cp ~/vibe-coding-os/AGENTS.md ./.clinerules-code
cp ~/vibe-coding-os/AGENTS.md ./.clinerules-ask
```

Workflow start: open the project in VS Code with the Cline extension and start Cascade (or architect/ask/code mode).

## Continue.dev

Continue.dev uses `AGENTS.md` for per-directory context and `config.json` for slash commands.

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./
cp ~/vibe-coding-os/adapters/continue/config.example.json ./.continuerc.json
```

Then open the Continue.dev sidebar in VS Code (Ctrl+Shift+I) or JetBrains.

## Aider

Aider uses `CONVENTIONS.md` as the primary instruction surface.

```bash
cd ~/your-project
cat >> CONVENTIONS.md << 'EOF'
# Vibe Coding OS Conventions

## Core workflow
- For non-trivial work: spec → plan → tasks → implement.
- Apply what-before-how: understand requirements before implementation.
- Keep changes small, correct, and reviewable.
- Run `npm run validate` for repository structure changes.
EOF

cat >> .aider.conf.yml << 'EOF'
conventions: CONVENTIONS.md
auto-commits: true
lint: true
lint-command: "npm run validate"
architect: true
EOF
```

Then launch Aider:

```bash
cd ~/your-project
aider
```

Use `/architect` for spec/planning and `/code` for implementation.

## Windsurf

Windsurf uses `.windsurfrules` as the primary instruction surface.

```bash
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./.windsurfrules
```

Legacy Cursor compatibility:

```bash
cp ~/vibe-coding-os/AGENTS.md ./.cursorrules
```

Then open the project in Windsurf IDE. The Cascade agent reads `.windsurfrules` automatically.
