# Aider Adapter

Use this when your coding assistant is Aider (AI pair programming in the terminal).

Related: [setup scope guide](../setup-scope-guide.md), [first workflow](../FIRST-WORKFLOW.md), [Quality Shield](../quality-shield.md).

## Quick setup

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project

# Create CONVENTIONS.md with Vibe Coding OS guidance
cat >> CONVENTIONS.md << 'EOF'
# Vibe Coding OS Conventions

## Core workflow
- For non-trivial work: spec → plan → tasks → implement.
- Apply what-before-how: understand requirements before implementation.
- Keep changes small, correct, and reviewable.
- Run `npm run validate` for repository structure changes.
- Never claim success without verification.
EOF

# Optional: create Aider config
cat >> .aider.conf.yml << 'EOF'
conventions: CONVENTIONS.md
auto-commits: true
lint: true
lint-command: "npm run validate"
architect: true
edit-format: diff
EOF
```

## What files get created?

```text
CONVENTIONS.md           # Aider reads this as system conventions
.aider.conf.yml          # (optional) Aider configuration
```

## How do I open the tool?

```bash
cd ~/your-project
aider
```

Aider reads `CONVENTIONS.md` and `.aider.conf.yml` automatically on startup.

## First prompt to paste

```text
Read CONVENTIONS.md and follow the Vibe Coding OS workflow. Start with a feature spec for: <describe your small change>. Include goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

## How to verify setup loaded

Ask Aider:

```text
What conventions did you load? Confirm whether you can see CONVENTIONS.md and list the first workflow step.
```

Expected signal:
- It mentions Vibe Coding OS or the conventions from `CONVENTIONS.md`.
- It knows the spec → plan → implement → review → verify loop.

## Common failure modes

- **`CONVENTIONS.md` not read:** make sure Aider is launched from the directory containing `CONVENTIONS.md`.
- **Aider auto-commits undesired changes:** add `/no-commit` to bypass auto-commit, or set `auto-commits: false` in `.aider.conf.yml`.
- **Architect mode not working:** add `architect: true` to `.aider.conf.yml`, then use `/architect` and `/code` in chat.
- **Lint command failing:** verify `npm run validate` works standalone before relying on Aider's lint integration.

## Aider Features for Vibe Workflows

| Feature | How it helps Vibe |
|---|---|
| Architect/Editor mode | Spec in architect → implement in editor |
| `CONVENTIONS.md` | Vibe workflows as system conventions |
| `/run` command | Run npm scripts inside Aider |
| Repo map | Automatic context via tree-sitter analysis |
| Lint integration | Auto-validate after edits |
| Auto-commit | Conventional commit messages |