---
name: setup-project-agent-skills
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
  - agents
status: stable
---

# Skill: Setup Project Agent Skills

## Purpose

Configure a repository so agents know its skills, commands, context docs, issue flow, and validation gates.

## When to use

Use when onboarding Vibe Coding OS to a repo, refreshing agent docs, or aligning per-repo workflow configuration.

## Inputs

Repo structure, target assistant/tool, setup scope, existing agent instructions, issue tracker, docs location, validation commands, and privacy constraints.

## Workflow

1. Inspect existing agent docs and registries.
2. Choose the setup scope before writing files: `minimal`, `recommended`, `full`, `runtime`, or `team`. Use [`../../../docs/setup-scope-guide.md`](../../../docs/setup-scope-guide.md) for the decision flow.
3. When using the CLI, prefer `vibe init <tool> --scope <scope> --project <path>`; add `--current-terminal` only for a deliberately current-terminal/session-scoped setup.
4. Identify applicable skills and commands.
5. Set up or update context, ADR, templates, and validation notes.
6. Record issue tracker and triage conventions if present.
7. Verify the project-local setup manifest (`.vibe/setup.json`) records the selected tool, scope, features, optional runtime/team intent, and `currentTerminal` flag.
8. Avoid overwriting local philosophy.

## Outputs

Setup summary, affected files, selected scope, `.vibe/setup.json` manifest status, recommended skills/commands, quality gates, and follow-up tasks.

## Failure modes

Blindly installing everything, overwriting local conventions, or creating fake tracker config.

## Verification checklist

Local instructions are preserved; selected scope and skills are justified; `.vibe/setup.json` is checked when CLI setup is used; validation commands are known; attribution is clean.

## Ghi chú tiếng Việt

Dùng để setup workflow agent cho từng repo. Không copy upstream setup; chỉ map ý tưởng vào cấu trúc Vibe Coding OS.
