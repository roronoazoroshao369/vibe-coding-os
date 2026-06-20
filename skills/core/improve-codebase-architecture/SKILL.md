---
name: improve-codebase-architecture
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Improve Codebase Architecture

## Purpose

Improve architecture deliberately by finding high-leverage seams, simplifying concepts, and preserving behavior.

## When to use

Use for planned architecture improvement, repeated pain, deep module confusion, or code that blocks future work.

## Inputs

System context, pain points, domain language, ADRs, tests, constraints, and target quality attributes.

## Workflow

1. Zoom out and read context/ADRs.
2. Identify architecture smells and the domain concepts behind them.
3. Propose small safe improvements with tradeoffs.
4. Prefer behavior-preserving refactors with tests.
5. Capture significant decisions as ADRs.

## Outputs

Architecture review, prioritized improvements, risks, test plan, ADR candidates, and follow-up slices.

## Failure modes

Big-bang rewrites, aesthetic refactors without user value, ignoring tests, or changing domain terms casually.

## Verification checklist

Improvement has a clear driver; behavior is protected; slices are reviewable; ADR/context updates are identified.

## Ghi chú tiếng Việt

Cải thiện kiến trúc phải có lý do và kiểm chứng. File liên quan: `templates/architecture-review-template.md`, workflow architecture, ADR/context.
