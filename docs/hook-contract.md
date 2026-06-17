# Portable Hook Contract v1.0

A cross-agent portable event and hook contract for Vibe Coding OS.

## Events
The following events are defined:

- **session_start**
  - When: At the beginning of an agent session.
  - Purpose: Load context, configuration, safety settings, and memory references.
  - Expected inputs: environment, session metadata, config paths.
  - Expected outputs: session context, loaded settings, optional diagnostics.

- **before_implementation**
  - When: After planning and before code or file changes are written.
  - Purpose: Gate implementation readiness, check assumptions, confirm safety.
  - Expected inputs: plan, affected files, task description, safety settings.
  - Expected outputs: go / no-go decision, warnings, blockers.

- **after_validation**
  - When: After tests or validation commands complete.
  - Purpose: Evaluate test results, summarize validation, and decide next action.
  - Expected inputs: test/validation output, commands run, expected results.
  - Expected outputs: pass/fail status, summary, remediation notes.

- **before_memory_store**
  - When: Before durable memory is written.
  - Purpose: Redact secrets, check sensitivity, and format metadata.
  - Expected inputs: proposed memory content, source references, session context.
  - Expected outputs: sanitized memory block, sensitivity label, staleness note.

- **handoff_created**
  - When: A session or context handoff is generated.
  - Purpose: Summarize state, decisions, follow-ups, and remaining risks.
  - Expected inputs: session summary, changed files, tests, unresolved issues.
  - Expected outputs: handoff document with scope, status, and next actions.

## Input/output format
- Input is a structured block with at least: event, timestamp, session id, environment hints, and event-specific payload.
- Output is a structured block with at least: status (ok/warn/block), summary, and payload specific to the event.
- Both input and output should be plain-text friendly, optionally JSON, and never include secrets or personal data.

## Failure behavior
- If a hook fails, it must not silently assume success.
- The default failure behavior is block the next phase and return a warning with the reason.
- Hooks may degrade gracefully only when explicitly configured to allow fallback.
- Failures should be logged with event name, cause, and affected artifact path if available.

## Configuration
- Hooks are configured per agent via adapter config, project config, or session metadata.
- A hook may be enabled, disabled, or set to warn-only for non-critical events.
- Each event may have multiple handlers; ordering should be documented and deterministic.
- Adapter adapters should declare the events they support and which are required vs optional.

## Compatibility
- This contract is adapter-agnostic and meant to work across Codex, Claude, Cursor, and similar agents.
- Agents that do not implement a hook should emit a diagnostic and proceed according to configured fallback behavior.
