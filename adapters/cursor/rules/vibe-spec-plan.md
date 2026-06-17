# Vibe Spec and Plan Rules for Cursor

Use this file when the user asks for a spec, plan, task list, or pre-implementation design.

## Input format
- Start from the explicit request, constraints, and scope boundaries.
- Capture unknowns, risks, affected files, and acceptance criteria.
- If the user provides links, examples, snippets, or test expectations, quote the relevant parts.
- If the request is ambiguous, ask a short clarifying question before planning.

## Required outputs
### Spec
- Problem statement
- What changes and why
- Non-goals or explicit scope exclusions
- Acceptance criteria
- Affected files and components
- Assumptions and unresolved questions
- Test approach

### Plan
- Ordered steps
- Files touched per step
- Verification command(s) per step
- Risks and rollback notes
- Minimum evidence required to call the step done

## File locations
- Use repo convention first. Prefer `docs/plans/`, `docs/specs/`, or `templates/` when appropriate.
- If no obvious location exists, use:
  - `docs/plans/<short-name>.md` for plans
  - `docs/specs/<short-name>.md` for specs
- Reference the plan/spec in commit messages, implementation notes, or final output.

## Validation requirements
- Validate assumptions against the actual repository before finalizing.
- For non-trivial work, include the validation commands the agent should run after implementation.
- End the plan with a readiness gate checklist:
  - Spec exists
  - Scope is bounded
  - Acceptance criteria are testable
  - Files to touch are identified
  - Validation commands are defined
  - Risks and rollbacks are noted
