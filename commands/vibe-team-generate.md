# vibe-team-generate

## Purpose

Generate reviewable team-agent scaffold files from a deterministic JSON spec.

## When to use

Use when a planned team workflow needs reusable local agent definitions and a written handoff plan before execution.

## Required inputs

A JSON spec based on `templates/team-spec-template.json`; selected team pattern; roles or permission to use built-in defaults; output location; overwrite decision.

## Step-by-step behavior

1. Confirm this is scaffold generation only, not a runtime launch.
2. Choose one pattern: Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor, or Hierarchical Delegation.
3. Fill or review the JSON spec.
4. Dry run: `npm run team:scaffold:dry -- <spec.json>`.
5. Inspect planned `.claude/agents/`, `.omc/plans/`, and optional routing outputs.
6. Generate only after review: `npm run team:scaffold -- <spec.json>`; add `-- --force` only when overwriting is intentional.
7. Run the work through Claude Code native Team / OMC if available, or manual subagent invocation.

## Outputs

Generated project-local agent definitions, generated team plan, optional role routing snippet, and dry-run/generation evidence.

## Verification or stopping conditions

Stop if the spec is ambiguous, the output would overwrite user files unexpectedly, write scopes overlap without serialization, or the user expects a daemon/runtime instead of scaffold files.
