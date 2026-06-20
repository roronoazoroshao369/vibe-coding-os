# Windsurf Adapter

Windsurf is Codeium's AI-powered IDE. It uses `.windsurfrules` as the primary instruction file in the workspace root, and is backward-compatible with `.cursorrules` for legacy projects.

See the [adapter compatibility matrix](../compatibility-matrix.md) for cross-tool setup details and limitations.

## Quick setup

### Via `.windsurfrules` (recommended)

Windsurf reads `.windsurfrules` from the workspace root and applies it as system instructions for the Cascade agent:

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md .windsurfrules
# Or use the dedicated Windsurf template (recommended for Windsurf-specific rules):
cp ~/vibe-coding-os/adapters/windsurf/.windsurfrules.template .windsurfrules
```

### Legacy `.cursorrules` compatibility

Windsurf also reads `.cursorrules` if `.windsurfrules` does not exist. If you previously used Vibe Coding OS with Cursor, your existing `.cursorrules` will work with Windsurf:

```bash
cp ~/vibe-coding-os/AGENTS.md .cursorrules
```

## Files in this adapter

| File | Purpose |
| ---- | ------- |
| `README.md` | This file — primary adapter doc. |
| `.windsurfrules.template` | Drop-in `.windsurfrules` content with Vibe + Cascade-specific rules. |
| `windsurf.json` | Machine-readable adapter metadata (used by `plugins/manifest.json` and the marketplace). |
| `TROUBLESHOOTING.md` | Common Cascade failures and the canonical fix for each. |

### Legacy .cursorrules compatibility

Windsurf also reads `.cursorrules` if `.windsurfrules` does not exist. If you previously used Vibe Coding OS with Cursor, your existing `.cursorrules` will work with Windsurf:

```bash
cp ~/vibe-coding-os/AGENTS.md .cursorrules
```

## Usage

- The **Cascade agent** in Windsurf reads `.windsurfrules` automatically and follows Vibe workflows.
- Use **Flows** for complex multi-step sequences. Define a Vibe workflow as a Flow:
  1. Spec creation → 2. Plan creation → 3. Implementation → 4. Review
- Paste relevant command prompts from `commands/` for workflow phases.
- Attach specific `skills/*/*/SKILL.md` files when you need a focused operating procedure.
- Use the integrated terminal to run `npm run validate` for structural changes.
- Use **Supercomplete** to get whole-repo context-aware completions while coding.

## Tool-specific notes

### Cascade Agent

Windsurf's Cascade agent is the primary interface for AI interaction. It supports:
- **Autonomous multi-file editing** — Cascade can create, modify, and delete files across the repository.
- **Terminal integration** — Cascade can run shell commands and capture output.
- **Deep Context** — Automatically analyzes the full workspace for relevant code.

To use Vibe Coding OS with Cascade:
1. Copy `AGENTS.md` to `.windsurfrules`
2. Cascade reads the rules on startup and applies Vibe workflows
3. For complex tasks, Cascade follows the spec → plan → implement → review flow

### Flows (Reusable Prompt Chains)

Flows are Windsurf's closest equivalent to Vibe Coding OS skills. A Flow is a multi-step prompt chain that automates a workflow.

To create a Vibe-compatible Flow in Windsurf:
1. Open Windsurf → Cascade → Flows
2. Define steps:
   - Step 1: "Read commands/vibe-spec.md and create a spec"
   - Step 2: "Read commands/vibe-plan.md and create a plan"
   - Step 3: "Implement changes following the plan"
   - Step 4: "Run npm run validate and fix any failures"

### Context Management

Windsurf manages context automatically through **Deep Context**. It analyzes the full workspace for relevant snippets. To help Deep Context work well:
- Keep Vibe files well-structured with clear section headers
- Use consistent naming in skill and command files
- Reference templates by name when creating artifacts

### Cascade Rules

For fine-grained Cascade behavior, you can extend `.windsurfrules` with Windsurf-specific directives:

```bash
# Append Windsurf-specific rules
cat >> .windsurfrules << 'EOF'

## Cascade-specific rules
- For pull requests, run `npm run validate:all` and `npm run quality:scorecard:report` before submission.
- Keep specs in `docs/specs/` with `.md` extension.
- Use `templates/` for creating new artifacts.
- Always verify file paths before suggesting edits.
EOF
```

### Install snippet

```bash
# Via .windsurfrules (recommended)
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md .windsurfrules

# Or for legacy Cursor compatibility
cp ~/vibe-coding-os/AGENTS.md .cursorrules
```

If `.windsurfrules` or `.cursorrules` already exists, merge the Vibe workflow guidance rather than overwriting project-specific conventions.
