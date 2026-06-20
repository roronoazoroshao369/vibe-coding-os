---
description: Author a Claude Code hooks pack (PreToolUse/PostToolUse/Stop) with declarative guard rails.
---

# vibe-hooks-pack

## What this command does

Generates a `.claude/settings.json` hooks pack with explicit matchers, exit-code semantics, and a documented intent per hook. Outputs a markdown table summarizing each hook.

## When to use

Run when you want to add safety guard rails (e.g., block destructive `Bash` commands), audit logging (log every `Edit` to JSONL), or session lifecycle automation (load project context on `SessionStart`). Use after adopting the `claude-code-hooks-pack` skill or when the team needs a documented hooks baseline.

## Inputs

- Event types to cover (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `SessionEnd`).
- Matchers per event (regex or `*`).
- Hook commands or script paths.
- Exit-code semantics per hook.
- Optional rationale per hook.

## Outputs

- One `.claude/settings.json` entry per event/hook.
- One row per hook in the output table (event, matcher, command, exit code, rationale).
- A diff against the previous `.claude/settings.json` (if any).

## Steps

1. Run `npm run vibe-hooks-pack -- --events=PreToolUse,PostToolUse --output=.claude/settings.json`.
2. Review the generated table for missing hooks or over-broad matchers.
3. Commit the change with a Conventional Commits `feat(claude):` prefix and `AI-Generated: yes` trailer.
4. Verify the hooks fire by triggering each matcher once in a sandbox session.
5. Document the hooks pack in `docs/integrations/claude-code-hooks.md`.

## Failure modes

- Over-broad matchers (`*`) that block legitimate work.
- Hook commands that swallow non-zero exit (`|| true`) and never block.
- Undocumented hooks — every hook needs an intent comment in the JSON.

## Verification checklist

- [ ] `.claude/settings.json` parses as JSON (use `jq . .claude/settings.json`).
- [ ] Each matcher has a documented trigger test.
- [ ] Each `PreToolUse` hook's `exit 2` path verified once.
- [ ] Each `PostToolUse` hook writes its audit log line within 1s of the tool firing.
- [ ] `docs/integrations/claude-code-hooks.md` lists every hook with intent, matcher, exit code.
