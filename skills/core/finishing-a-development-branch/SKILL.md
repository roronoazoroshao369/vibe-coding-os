# Skill: Finishing a Development Branch

## Purpose

Close a branch cleanly with verified status, review readiness, attribution hygiene, memory notes, and clear next actions.

## When to use

Use at the end of a feature/bugfix/reference-integration branch before PR, merge, handoff, or cleanup.

## Inputs

Branch name, diff summary, spec/plan, validation output, review state, attribution obligations, memory/follow-up needs, and cleanup constraints.

## Workflow

1. Inspect `git status`, branch name, and recent commits.
2. Confirm the diff matches the accepted scope and no generated or upstream clone artifacts are staged accidentally.
3. Run or summarize final validation and note exact failures/limitations.
4. Ensure review feedback is handled or explicitly deferred.
5. Update memory, changelog, attribution, or reference notes when the work created durable knowledge.
6. Prepare a final handoff or PR summary with changed files, checks, risks, assumptions, and cleanup tasks.

## Outputs

A branch-finish report or PR-ready summary with clean status, validation evidence, review state, attribution state, and follow-ups.

## Failure modes

- Finishing with unreviewed unrelated changes.
- Claiming completion while validation is unknown.
- Forgetting attribution or reference changelog updates.
- Leaving branch/worktree cleanup ambiguous.

## Verification checklist

- [ ] Working tree and branch status are known.
- [ ] Diff matches scope.
- [ ] Final checks are reported honestly.
- [ ] Review, attribution, and memory obligations are addressed.
