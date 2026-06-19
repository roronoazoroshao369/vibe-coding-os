# Hook Patterns in Vibe Coding OS

## Purpose

Define a portable, runtime-free taxonomy of hook patterns for lifecycle automation in Vibe Coding OS. Hooks are named points in a workflow where an agent can observe state, capture context, run validation, or trigger follow-up actions — all using plain markdown contracts, not daemons or server processes.

## Principles

1. **Contract over implementation.** Hooks are documented expectations, not executable code. Any harness can honor them; none is required to.
2. **Portable across harnesses.** Hook patterns must work in Claude Code, Codex, Cursor, Gemini CLI, or any agent reading markdown instructions.
3. **Safe by default.** Hooks must never capture or transmit sensitive data without explicit privacy gates.
4. **Disableable and auditable.** Every hook should have a documented skip mechanism and an audit trail.
5. **Manual fallback.** For every automatic hook, there must be a documented manual equivalent (a command or template).

## Hook taxonomy

### Command hooks (pre/post)

Fired before or after a named command executes.

- **pre-command:** Inspect prerequisites, validate input arguments, confirm the user's intent, or load required context before a command runs.
- **post-command:** Capture output, validate results against expectations, record a durable observation, or trigger downstream work.

Example applications:
- `pre-vibe-spec`: Load project constitution and existing specs for context.
- `post-vibe-implement`: Run the verification checklist and capture validation status.
- `pre-vibe-finish-branch`: Check that all acceptance criteria are met before branch close.

### Session hooks (start/end)

Fired at session boundaries.

- **session-start:** Retrieve scoped context for the task, load relevant skills, orient the agent with `vibe-init`.
- **session-end:** Compress observations into a durable handoff summary, record next steps, run final validation.

Example applications:
- Run `vibe-init` automatically at session start.
- Run `vibe-handoff` at session end to produce a continuation-ready summary.
- Capture a privacy-filtered session observation before closing.

### Workflow hooks (phase transitions)

Fired when work moves between phases of a multi-phase workflow (spec-driven development, subagent orchestration, team-agent workflow).

- **phase-entry:** Load relevant skills, validate prerequisites, load context from the previous phase.
- **phase-exit:** Validate phase outputs, record phase completion, hand off context to the next phase.

Example applications:
- **Spec → Plan transition:** Validate that the spec has observable acceptance criteria before planning begins.
- **Plan → Tasks transition:** Confirm the plan has ordered steps, target files, and validation commands before decomposition.
- **Tasks → Implement transition (checkpoint gate):** Run the implementation-readiness gate from `skills/core/checkpoint-validation/SKILL.md`.

### Verification hooks

Fired at validation points to run checks and report status.

- **pre-verification:** Load the acceptance criteria and expected outcomes.
- **verification-pass:** Record successful validation, update status, proceed to next step.
- **verification-fail:** Log failure details, roll back changes, escalate to the user.

Example applications:
- Run per-subtask gates after each subagent delivers output.
- Run cross-subtask integration validation after all subagents complete.
- Escalate to a human reviewer when verification fails twice for the same subtask.

## Hook lifecycle table

| Hook point | Timing | Typical action | Manual fallback |
|---|---|---|---|
| `pre-command` | Before any registered command | Validate inputs, load context | Run the validation command manually |
| `post-command` | After any registered command | Capture output, record observation | Run `vibe-session-capture` |
| `session-start` | At session initialization | Load context, orient agent | Run `vibe-init` |
| `session-end` | Before session close | Compress observations, handoff | Run `vibe-handoff` |
| `phase-entry` | Entering a workflow phase | Load relevant skills | Load skills manually from registry |
| `phase-exit` | Exiting a workflow phase | Validate outputs, record completion | Run phase-specific validation command |
| `pre-verification` | Before running checks | Load criteria and expected outcomes | Read the acceptance criteria document |
| `verification-pass` | Checks pass | Record success, proceed | Manual confirmation |
| `verification-fail` | Checks fail | Log failure, roll back, escalate | Manual rollback and investigation |

## Hook contract format

Each hook contract should be documented in a markdown file with the following sections:

```markdown
# Hook: <hook-name>

## Trigger
When this hook fires, in plain language.

## Prerequisites
What must be true for this hook to execute safely.

## Actions
Ordered list of what the hook does.

## Privacy gate
What data is filtered before any capture or external action.

## Failure behavior
What happens if the hook errors: skip, warn, degrade, or block.

## Manual fallback
How to achieve the same effect without the hook.
```

## Runtime non-goal

Vibe Coding OS documents hook contracts and patterns. It does not implement a hook runtime engine, daemon, event bus, or WebSocket listener. Hooks are honored by agent harnesses that read and follow the markdown contracts. No hook script is vendored, installed, or executed by this repository.

## Related resources

- `adapters/hooks/memory-hooks-contract.md` — memory-specific hook contracts, built on this general taxonomy.
- `skills/memory/hook-based-memory/SKILL.md` — hook-based memory skill that references the general hook architecture.
- `references/features/hook-patterns.md` — pattern taxonomy rationale and design decisions.
- `skills/core/superagent-orchestration/SKILL.md` — uses lifecycle monitoring hooks for subtask state transitions.
- `docs/workflows/team-agent-orchestration.md` — uses workflow hooks for phase transitions in multi-agent teams.
