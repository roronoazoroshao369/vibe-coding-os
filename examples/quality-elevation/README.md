# Golden Example Library: Quality Elevation

## Purpose

This library gives coding agents concrete before/after examples for raising implementation quality. Average and mid-tier models often learn more reliably from specific examples than from abstract rules alone. These examples show what weak output looks like, what stronger output looks like, and why the difference matters.

Use this library to calibrate work toward evidence-based, minimal, context-aware engineering.

## How to use

When coding, consult these examples to calibrate your output quality:

1. Identify which pattern matches the current task.
2. Read the weak example and notice the failure mode.
3. Read the strong example and copy the discipline, not necessarily the exact code.
4. Apply the lesson: gather context, define acceptance criteria, make the smallest correct change, test it, and report honestly.

## Available examples

- [Bad vs Good Agent Output](./before-after-bad-vs-good.md): shows the difference between unsupported completion claims and verified work.
- [Weak Spec vs Strong Spec](./weak-spec-vs-strong-spec.md): shows how clear acceptance criteria improve implementation quality.
- [Overengineering vs Minimal](./overengineering-vs-minimal.md): shows how to avoid unnecessary abstractions for simple problems.
- [Hallucination Correction](./hallucination-correction.md): shows how inspecting project context prevents invented APIs.

## Growing library

This starter library will grow over time with more patterns. Add examples whenever the team sees a repeatable quality failure that can be taught through a clear before/after pair.
