# Session Summarizer

## Purpose

Compress a work session into useful handoff context.

## When to use

Use at the end of a session, before context reset, or before handing off to another agent.

## Inputs

Goal, changes made, commands run, decisions, blockers, follow-ups.

## Workflow

1. Summarize the original intent.
2. List completed changes and files touched.
3. Record verification results.
4. Capture decisions and unresolved questions.
5. Recommend the next action.

## Outputs

A short handoff summary suitable for project memory or a PR note.

## Failure modes

- Including too much transcript detail.
- Omitting failed checks.
- Confusing planned work with completed work.

## Verification checklist

- [ ] Completed vs pending work is clear.
- [ ] Commands and results are included.
- [ ] Next action is actionable.
- [ ] No secrets are included.
