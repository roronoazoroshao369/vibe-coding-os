# Skill: Setup Project Agent Skills

## Purpose

Configure a repository so agents know its skills, commands, context docs, issue flow, and validation gates.

## When to use

Use when onboarding Vibe Coding OS to a repo, refreshing agent docs, or aligning per-repo workflow configuration.

## Inputs

Repo structure, existing agent instructions, issue tracker, docs location, validation commands, and privacy constraints.

## Workflow

1. Inspect existing agent docs and registries.
2. Identify applicable skills and commands.
3. Set up or update context, ADR, templates, and validation notes.
4. Record issue tracker and triage conventions if present.
5. Avoid overwriting local philosophy.

## Outputs

Setup summary, affected files, recommended skills/commands, quality gates, and follow-up tasks.

## Failure modes

Blindly installing everything, overwriting local conventions, or creating fake tracker config.

## Verification checklist

Local instructions are preserved; selected skills are justified; validation commands are known; attribution is clean.

## Ghi chú tiếng Việt

Dùng để setup workflow agent cho từng repo. Không copy upstream setup; chỉ map ý tưởng vào cấu trúc Vibe Coding OS.
