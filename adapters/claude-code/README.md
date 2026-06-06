# Claude Code Adapter

Use `CLAUDE.md` as the main instruction file. Paste command prompts from `commands/` for workflow phases and attach specific `skills/*/*/SKILL.md` files when you need a focused operating procedure. For structural changes, run `npm run validate` before final response.

## Multi-agent workflow guardrails

### Agent ownership

When using Claude Code subagents, give each subagent explicit file/module responsibility. State editable files, read-only context, and shared files reserved for the main chat or named integrator. Tell subagents not to revert edits made by other agents.

### Handoff format

Ask every subagent to finish with `Context`, `Files touched`, `Decisions`, `Risks`, and `Verification`.

### Parallelization rules

Use subagents in parallel only when write scopes are separated. Do not delegate a blocking critical-path task if the main chat cannot make progress until that result returns.

### Review gates

Reviewer subagents must check correctness, scope, attribution, and tests before recommending approval.

### Conflict handling

If subagent outputs conflict, the main Claude Code chat remains responsible for comparing handoffs, resolving incompatible assumptions, integrating edits, and running final verification.

### Tool-specific notes

- Claude Code subagents: pass role, ownership, handoff format, and verification expectations directly in the prompt.
- Codex delegated agents/workers: use disjoint worker ownership and review worker changes before integration.
- Cursor manual chat workflows: use separate chats manually and paste the structured handoff back into the main chat.
## Quick setup

- Copy or symlink the repository-level `CLAUDE.md` into the root of the project you want Claude Code to operate on.
- Keep `AGENTS.md` available only when you also want Codex-compatible guidance; Claude Code should treat `CLAUDE.md` as the primary local instruction surface.
- Copy or reference the workflow prompts from `commands/`, especially `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, `vibe-memory`, and `vibe-merge`.
- Attach skill files from `skills/core`, `skills/memory`, `skills/agents`, and `skills/prompts` only when the task needs that procedure.
- Copy templates from `templates/` into normal project files when you need persistent specs, plans, reviews, tasks, memory notes, or upstream audit records.

## Daily workflow

1. Start with `vibe-spec` for any task where requirements, acceptance criteria, or edge cases matter.
2. Use `vibe-plan` to convert the accepted spec into a small file-oriented plan.
3. Run `vibe-implement` while keeping edits narrow and checking the plan against the actual codebase.
4. Use `vibe-review` before considering the task complete, with blockers listed before suggestions.
5. Capture durable decisions with `vibe-memory` when the session teaches something future agents should reuse.
6. Finish with `vibe-merge` to confirm scope, validation, attribution, and follow-ups are ready.

## Skill usage

- Choose `skills/core` for the operating mode: clarify first, spec-first development, plan-driven execution, TDD, review-before-merge, verification, bootstrap, or upstream intelligence.
- Choose `skills/memory` when retrieving context, writing project memory, summarizing a session, or filtering private data out of notes.
- Choose `skills/agents` when you want Claude Code to simulate explicit architect, implementer, reviewer, or tester responsibilities in a complex task.
- Choose `skills/prompts` for lightweight behavior nudges such as avoiding overengineering, asking when confused, or applying concise coding guardrails.
- Do not load every skill by default. Pick the smallest set that matches the current phase so the Claude Code context stays focused.

## Validation

- Run `npm run validate` after changing repository structure, registries, adapters, commands, templates, skills, or references.
- Run `npm run validate:references` when the only changes are under `references/` or reference registries and you want the narrower reference check.
- Run `npm run references:clone` only when auditing upstream sources locally; never commit cloned upstream trees under `references/upstreams/`.
- If validation cannot run, record the exact command and limitation in the session summary and final response.

## Gotchas

- Claude Code reads `CLAUDE.md` as the tool-specific instruction file, so keep adapter guidance there instead of assuming `AGENTS.md` will be the active file.
- Large prompt bundles can crowd out code context. Prefer one workflow command plus one or two relevant skills over a full framework dump.
- Keep generated specs, plans, and memory notes in project files when they must survive beyond the chat.
- Do not paste upstream docs or third-party prompt packs into Claude Code unless attribution and license decisions are already recorded.

## Example session

For a non-trivial bug fix, ask Claude Code to run this flow:

1. Apply `vibe-spec` with `skills/core/clarify-before-code/SKILL.md` to define the failing behavior, expected behavior, and acceptance criteria.
2. Apply `vibe-plan` with `skills/core/plan-driven-execution/SKILL.md` to identify the likely files, tests, and rollback point.
3. Apply `vibe-implement` with the smallest relevant implementation skill or agent role.
4. Apply `vibe-review` with `skills/core/review-before-merge/SKILL.md` and, if useful, `skills/agents/reviewer-agent/SKILL.md`.
5. Run the project checks plus `npm run validate` if framework files changed.
6. Apply `vibe-memory` and `vibe-merge` to record decisions and confirm readiness.
