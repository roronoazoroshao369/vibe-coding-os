# Aider Adapter

Aider is a terminal-based AI pair programming tool. It uses `CONVENTIONS.md` as the primary instruction file, placed in the repository root. Aider reads conventions on startup and applies them as system context for coding decisions.

See the [adapter compatibility matrix](../compatibility-matrix.md) for cross-tool setup details and limitations.

## Quick setup

### Via CONVENTIONS.md (recommended)

Aider reads `CONVENTIONS.md` from the repository root and injects it as coding conventions for every session:

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cat > CONVENTIONS.md << 'EOF'
# Vibe Coding OS Conventions for Aider

## Core workflow
- For non-trivial work: spec → plan → tasks → implement.
- Apply what-before-how: understand requirements before implementation.
- Keep changes small, correct, and reviewable.
- Run `npm run validate` for repository structure changes.
- Never claim success without verification.

## Reference intelligence
- Before using upstream inspiration, check `references/index.json`.
- Keep external attribution clean in `ATTRIBUTIONS.md` and `NOTICE.md`.
- After adding or removing a command/skill/template, run `npm run validate:traceability`.

## Verification
- Always run `npm run validate` before final response.
- Run `npm run test:e2e` for end-to-end workflow verification.
- Run `npm run validate:secrets` to prevent credential leaks.
EOF
```

### Via .aider.conf.yml

Add conventions path and other Vibe-friendly settings to `.aider.conf.yml`:

```yaml
# .aider.conf.yml — Vibe Coding OS configuration for Aider
conventions: CONVENTIONS.md
auto-commits: true
lint: true
lint-command: "npm run validate"
yes: false  # require confirmation before file edits
architect: true  # enable architect/editor mode
model: claude-sonnet-4  # or your preferred model
edit-format: diff  # use unified diff format
```

## Usage

- Run `aider` in your project directory. Aider reads `CONVENTIONS.md` and `.aider.conf.yml` automatically.
- For complex tasks, use **architect mode** (`/architect`): create a spec first, review it, then switch to `/code` for implementation.
- Use the `#` prefix to reference files: `#commands/vibe-spec.md` to let Aider read a Vibe command file.
- Run `/run npm run validate` inside Aider to trigger validation gates.

## Tool-specific notes

### Architect/Editor Mode

Aider's architect/editor workflow aligns naturally with Vibe Coding OS's spec-first approach:

| Mode | When to use | Vibe commands to reference |
|---|---|---|
| Architect | Planning, spec creation, design | `#commands/vibe-spec.md`, `#commands/vibe-plan.md` |
| Code | Implementation, testing, fixes | `#commands/vibe-implement.md`, `#commands/vibe-tasks.md` |

To activate, run:
```
# In Aider chat
/architect
```

### Repo Map

Aider's best-in-class repo map uses tree-sitter to build a compact codebase overview. This is automatically used when you add files to the chat context:

```
#commands/vibe-init.md    # Add Vibe init command to context
#skills/core/spec-first-development/SKILL.md  # Add a skill file
```

### Automatic Git Commits

Aider auto-commits changes with meaningful messages. For Vibe Coding OS work, run:

```
/git commit -m "feat(scope): description"
```

Use conventional commits aligned with Vibe conventions: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

### Linting Integration

Aider can run `npm run validate` as a lint step. Configure this in `.aider.conf.yml`:

```yaml
lint: true
lint-command: "npm run validate"
lint-format: "regex:^(❌|✅)"
```

Aider will automatically run validation after file edits and show results inline.

### Install snippet

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project

# Create CONVENTIONS.md as shown above
cat > CONVENTIONS.md << 'EOF'
# Vibe Coding OS Conventions
...
EOF

# Create Aider config
cat > .aider.conf.yml << 'EOF'
conventions: CONVENTIONS.md
auto-commits: true
lint: true
lint-command: "npm run validate"
architect: true
EOF
```
