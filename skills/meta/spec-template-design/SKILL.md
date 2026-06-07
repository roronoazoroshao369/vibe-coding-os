# Spec Template Design

## Purpose

Guide the design and auditing of spec, plan, and tasks templates so they stay compact,
complete, and verifiable — enforcing required sections without becoming bureaucratic.

## When to use

Use when creating or revising a template (spec, plan, tasks, checkpoint, brownfield), or
when auditing existing specs for missing sections like non-goals, assumptions, or
verification gates.

## Inputs

The current templates, the project constitution, known recurring gaps in past specs, and
the spec-audit template.

## Workflow

1. List the required sections a high-quality artifact must contain.
2. For each section, define what "good" looks like and a failure example.
3. Keep templates short: every section must earn its place by preventing a real mistake.
4. Include placeholders, acceptance criteria, non-goals, assumptions, and verification
   gates.
5. Audit a sample of real specs against the template; note missing or weak sections.
6. Revise the template and record the rationale.

## Outputs

Revised templates and a spec-audit record (`templates/spec-audit-template.md`) listing
gaps and fixes.

## Failure modes

- Templates grow long and discourage use.
- Required sections exist but are routinely left empty.
- Templates omit non-goals, assumptions, or verification gates.
- Audits are not performed, so quality drifts.

## Verification checklist

- [ ] Required sections are defined with good/bad examples.
- [ ] Templates include non-goals, assumptions, and verification gates.
- [ ] Templates are as short as possible.
- [ ] A real spec was audited against the template.

## Applied / Not Applied

- Applied: spec template quality discipline (non-goals, assumptions, scenarios,
  verification gates) from `github/spec-kit`.
- Not applied: upstream template text or command names. Local templates are original.

## Ghi chú tiếng Việt

Thiết kế và audit template (spec/plan/tasks/checkpoint/brownfield) sao cho ngắn gọn nhưng
đủ: có non-goals, assumptions, tiêu chí chấp nhận, và cổng verification. Audit spec thật để
phát hiện mục thiếu. Liên kết: `templates/spec-audit-template.md`, `commands/vibe-spec-audit.md`.
