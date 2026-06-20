---
name: issue-slicing
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Issue Slicing

## Purpose

Break a PRD or plan into small vertical issues that independent agents can grab safely.

## When to use

Use after a PRD, spec, or plan exists and the work is too large for one simple patch.

## Inputs

Approved PRD/spec, constraints, dependencies, acceptance criteria, risk areas, and issue tracker conventions.

## Workflow

1. Identify user-visible vertical slices.
2. Keep each issue independently reviewable and testable.
3. Name dependencies and sequencing.
4. Include acceptance criteria and verification commands.
5. Avoid splitting only by technical layer unless necessary.

## Outputs

Issue list with scope, owner-ready instructions, dependencies, validation, and done criteria.

## Failure modes

Creating vague tasks, layer-only slices, hidden dependencies, or issues too large for focused review.

## Verification checklist

Each issue has a clear outcome; dependencies are explicit; tests/checks are named; no issue requires unstated context.

## Ghi chú tiếng Việt

Issue slicing giúp nhiều agent/person làm việc độc lập. File liên quan: `templates/issue-slicing-template.md`, `commands/vibe-to-issues.md`, `skills/core/plan-driven-execution/SKILL.md`.
