# Hook Patterns — Feature Reference

## Source

This feature is inspired by general lifecycle hook patterns found in agentic coding frameworks. The specific inspiration for Vibe Coding OS hook patterns came from studying `shanraisshan/claude-code-best-practice` (58k★), which demonstrated structured hook usage for command lifecycle, session boundaries, and workflow phase transitions.

**Import mode:** Inspiration only. No upstream hook scripts, event bus code, or runtime engine is vendored. All Vibe Coding OS hook patterns are original taxonomy and wording.

## Why hook patterns matter

Without hooks, agent workflows are opaque: there is no standard point to observe state, capture context, run validation, or trigger follow-up actions. Each harness invents its own approach, making portable skills and commands impossible. A shared hook taxonomy lets:

- Skill authors declare when their skill should fire (`pre-command`, `phase-entry`, etc.) without depending on a particular runtime.
- Adapter authors map generic hook points to harness-specific mechanisms (Claude Code hooks, Codex lifecycle events, Cursor rules).
- Users configure which hooks are active, skipped, or replaced by manual fallback.
- Multi-agent teams coordinate through lifecycle events rather than ad-hoc signaling.

## Pattern taxonomy

### By trigger category

| Category | Definition | Example use |
|---|---|---|
| Command hooks | Fire before/after a named command | Validate inputs before `vibe-spec`, capture validation status after `vibe-implement` |
| Session hooks | Fire at session boundaries | Load context at `session-start`, compress observations at `session-end` |
| Workflow hooks | Fire at phase transitions | Validate spec output at `spec→plan` transition, run checkpoint gate at `plan→tasks` |
| Verification hooks | Fire at validation points | Run per-subtask gates, escalate on repeated failure |

### By timing

| Timing | When it fires |
|---|---|
| `pre-*` | Before the named event |
| `post-*` | After the named event |
| `*-entry` | Entering a lifecycle phase |
| `*-exit` | Exiting a lifecycle phase |
| `*-pass` | On successful validation |
| `*-fail` | On failed validation |

## Design rationale

1. **Category over granularity.** Four categories (command, session, workflow, verification) cover every lifecycle event without creating an unmanageable list of named hooks. Within a category, timing qualifiers (pre/post/entry/exit/pass/fail) provide precision.
2. **Manual fallback first.** Every hook has a documented manual equivalent. This prevents dependency on runtime enforcement and ensures the patterns work in any harness.
3. **Privacy gate required.** Hooks that capture data must filter secrets, credentials, and personal information before persistence or transmission. This is non-negotiable and documented in each hook contract.
4. **Failure-mode explicit.** Every hook contract documents what happens on error: skip (silently continue), warn (log but continue), degrade (fall back to manual), or block (halt the workflow).
5. **No runtime dependency.** Hooks are documented contracts, not executable code. This keeps Vibe Coding OS in the docs/prompts/skills layer and avoids the frozen runtime constraint violation.

## Local implementation

- **General taxonomy:** `docs/workflows/hook-patterns.md` — the complete hook pattern taxonomy with lifecycle table, contract format, and principles.
- **Memory specialization:** `adapters/hooks/memory-hooks-contract.md` — memory-specific hook contracts, built on the general taxonomy.
- **Memory hook skill:** `skills/memory/memory-ingestion/SKILL.md` — operating procedure for hook-based memory, now referencing the general architecture.
- **Orchestration hooks:** `skills/core/superagent-orchestration/SKILL.md` — lifecycle monitoring for subtasks uses hook-like state transitions.
- **Workflow hooks:** `docs/workflows/team-agent-orchestration.md` — phase transitions that can be instrumented with workflow hooks.
- **Verification hooks:** `skills/core/checkpoint-validation/SKILL.md` — checkpoint gates serve as implementation-readiness hooks.

## Future considerations

- If a harness adds native hook support (e.g., Claude Code `.claude/hooks/`), create an adapter doc in `adapters/hooks/` that maps the general taxonomy to the harness mechanism.
- If harnesses converge on a common hook interface, consider a `hooks.json` registry file mapping hook names to expected behaviors.
- If hooks prove valuable for non-memory domains (security, compliance, deployment), extend the taxonomy with domain-specific qualifiers.
