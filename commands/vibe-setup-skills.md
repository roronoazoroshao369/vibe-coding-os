---
description: "Set up per-repo Vibe Coding OS skills, context, and validation guidance."
---

# Command: Setup project agent skills

## When to use

Use when onboarding or refreshing a repo for Vibe Coding OS workflows.

## Required inputs

Repo path, target assistant/tool, setup scope, existing agent docs, issue tracker policy, validation commands.

## Step-by-step behavior

1. Inspect AGENTS/CLAUDE/README/registries.
2. Select the setup scope before writing files: `minimal`, `recommended`, `full`, `runtime`, or `team`. Use [`docs/setup-scope-guide.md`](../docs/setup-scope-guide.md) when the scope is unclear.
3. If using the setup CLI, prefer `vibe init <tool> --scope <scope> --project <path>` and add `--current-terminal` only when setup is intentionally scoped to the current terminal/session.
4. Select only relevant skills.
5. Update context/ADR/template guidance if needed.
6. Record validation and attribution requirements.
7. Ensure the project-local setup manifest (`.vibe/setup.json`) reflects the selected tool, scope, features, optional runtime/team intent, and `currentTerminal` flag.

## Outputs

Setup summary, files to update, selected scope, `.vibe/setup.json` manifest status, selected skills, quality gates.

## Stopping conditions

Stop before overwriting local conventions or inventing tracker config.

## Verification checklist

Local docs preserved; selected scope and skills justified; `.vibe/setup.json` checked when CLI setup is used; validation commands named.

## Ghi chú tiếng Việt

Thiết lập skill cho repo theo cách chọn lọc, không cài bừa mọi thứ.
