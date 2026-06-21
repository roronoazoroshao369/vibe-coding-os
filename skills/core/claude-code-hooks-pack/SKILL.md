---
name: claude-code-hooks-pack
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Claude Code Hooks Pack

## Purpose

Provide a declarative pattern for authoring `.claude/settings.json` hooks (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `SessionEnd`) with matchers, guard rails, and short-circuit semantics. Fill the operational gap between our 136 planning-discipline skills and the day-to-day safety/observability needs of a Claude Code session.

## When to use

Use when adding safety guard rails (block `Bash` commands matching destructive patterns), observability (log every `Edit` to a structured audit file), or session lifecycle automation (load project context on `SessionStart`). Choose this skill when you need a documented hook recipe with explicit matcher syntax and a JSON template — not a hand-rolled shell script.

## Inputs

- Event type (one of `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `SessionEnd`).
- Matcher pattern (tool name regex or `*`).
- Hook type (`command`, `prompt`, or `agent`).
- Hook command or prompt body.
- Exit-code semantics (0 = allow, 2 = block, other = warn).
- Optional async flag and timeout in milliseconds.

## Workflow

1. Identify the trigger event and matcher pattern. Use the smallest matcher that still catches the target surface.
2. Author the hook command as a single shell line or script path. Keep it under 50 lines.
3. Declare exit-code semantics explicitly in a comment (`exit 0` = allow, `exit 2` = block).
4. Wire the hook into `.claude/settings.json` under the correct event key.
5. Test the hook in a sandbox session: trigger the matcher once, verify exit code, capture the structured output.
6. Document the hook in `templates/hooks-pack-template.md` with intent, matcher, command, exit code, and example trigger.

## Outputs

- One entry in `.claude/settings.json` under `hooks.<event>[].hooks[]`.
- One entry in `templates/hooks-pack-template.md` with intent, matcher, command, exit code, and example trigger.
- A short rationale comment in the JSON explaining why the hook exists.

## Failure modes

- Over-broad matcher (`*`) blocks legitimate work and trains users to disable the hook.
- Hook command exits 0 on error because the shell command's own exit was swallowed by `|| true`.
- Long-running hook (>5s) blocks the Claude Code UI without a timeout.
- Hook reads a file that does not exist (no fallback) and silently fails to apply the guard.
- Mistaking `PostToolUse` for `PreToolUse` — the tool already ran by the time the hook fires.

## Verification checklist

- [ ] Hook entry appears in `.claude/settings.json` under the correct event key.
- [ ] Matcher regex matches at least one real tool invocation per session (verified by trigger test).
- [ ] `exit 0` = allow path verified: hook runs, command succeeds, no block.
- [ ] `exit 2` = block path verified: hook runs, command is blocked, stderr captures reason.
- [ ] Hook runtime is < 5s in p95 (measured with `time` in a sandbox).
- [ ] Hook is documented in `templates/hooks-pack-template.md` with matcher, command, and exit code.

### Related skills

- `skills/core/threat-model-driven-security/SKILL.md` — STRIDE-driven hook placement (boundary → asset → adversary)
- `skills/core/verification-before-done/SKILL.md` — 5-axis verification for hook runtime
- [`commands/vibe-hooks-pack.md`](../../../commands/vibe-hooks-pack.md) — companion command that scaffolds a hook pack interactively.

## Attribution

Inspired by [RohitG00/awesome-claude-code-toolkit](https://github.com/RohitG00/awesome-claude-code-toolkit) (Apache-2.0). Adapted in original wording.
