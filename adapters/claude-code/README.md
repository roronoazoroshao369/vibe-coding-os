# Claude Code Adapter

Use `CLAUDE.md` as the main instruction file. Paste command prompts from `commands/` for workflow phases and attach specific `skills/*/*/SKILL.md` files when you need a focused operating procedure. For structural changes, run `npm run validate` before final response.

## Agent ownership

When using Claude Code subagents, give each subagent explicit file/module responsibility. State which files it may edit, which files are read-only context, and which shared files must be left for the main chat or a named integrator. Tell subagents not to revert edits made by other agents; they should adapt to current files or report a conflict.

## Handoff format

Ask every subagent to finish with:

```markdown
## Context
- Goal, constraints, and assumptions.

## Files touched
- Files/modules changed or inspected.

## Decisions
- Key choices and rationale.

## Risks
- Correctness, scope, attribution, sequencing, or verification concerns.

## Verification
- Exact checks run, results, and limitations.
```

## Parallelization rules

Use Claude Code subagents in parallel only when write scopes are separated. Good candidates are independent read-only exploration, separate implementation modules, or separate review/test lanes. Do not delegate a blocking critical-path task if the main chat cannot make progress until that result returns.

## Review gates

Reviewer subagents must check correctness, scope, attribution, and tests before recommending approval. Ask them to separate blockers from suggestions and to cite the diff/spec evidence behind each blocker.

## Conflict handling

If subagent outputs conflict, do not let one subagent overwrite another. The main Claude Code chat remains responsible for comparing handoffs, resolving incompatible assumptions, integrating edits, and running final verification.

## Tool-specific notes

- Claude Code subagents: pass role, ownership, handoff format, and verification expectations directly in the subagent prompt.
- Codex delegated agents/workers: when porting this workflow to Codex, use disjoint worker ownership and review worker changes before integration.
- Cursor manual chat workflows: when reproducing this process in Cursor, use separate chats manually and paste the structured handoff back into the main chat.
