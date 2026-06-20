---
name: write-reusable-skill
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Write Reusable Skill

## Purpose

Create small reusable skills with clear triggers, workflow, outputs, failure modes, and verification.

## When to use

Use when a repeated workflow deserves a skill or an existing skill needs maintenance.

## Inputs

Workflow goal, trigger conditions, inputs, expected outputs, examples of misuse, target category, and related commands/templates.

## Workflow

1. Confirm the workflow is repeated enough to justify a skill.
2. Keep scope narrow and composable.
3. Use the required Vibe Coding OS skill headings.
4. Link related skills instead of duplicating.
5. Add registry entries and validation coverage.

## Outputs

A skill file, registry update, related command/template links, and maintenance notes.

## Failure modes

Writing a giant policy doc, duplicating existing skills, missing verification, or copying upstream skill text.

## Verification checklist

Skill has all required headings; trigger is clear; failure modes are practical; registry validates.

## Ghi chú tiếng Việt

Dùng khi viết skill mới. Ưu tiên nhỏ, dùng lại được, có checklist. File liên quan: `skills/meta/writing-skills/SKILL.md`, `commands/vibe-write-skill.md`.
