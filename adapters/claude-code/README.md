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
