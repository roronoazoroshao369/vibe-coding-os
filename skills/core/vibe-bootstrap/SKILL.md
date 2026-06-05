# Vibe Bootstrap

## Purpose

Start a new Vibe Coding OS session with the right context, workflow, and safety rails.

## When to use

Use at the beginning of a repo session, after a long pause, or when the assistant lacks context.

## Inputs

User goal, repository state, available instructions, known constraints.

## Workflow

1. Read top-level instructions and registries.
2. Summarize the current objective and repo state.
3. Identify the smallest safe next workflow phase.
4. List assumptions and open questions.
5. Select relevant skills or commands.

## Outputs

A brief session brief, selected workflow phase, assumptions, and next action.

## Failure modes

- Skipping repository inspection.
- Choosing too many skills for a simple task.
- Treating stale context as current truth.

## Verification checklist

- [ ] Repository instructions were read.
- [ ] Goal and next step are explicit.
- [ ] Assumptions are visible.
- [ ] No secrets or unrelated context were captured.
