# Feature: Triage Workflow

## Goal

Route issues into states with missing evidence and next actions visible.

## Reference sources

Upstream triage role concept; local triage template.

## Local implementation

Implemented by `skills/core/triage-workflow/SKILL.md`, `commands/vibe-triage.md`, and `templates/triage-template.md`.

## Must-have behavior

Classify, label/state, ask for missing evidence, identify next owner/action.

## Failure modes

Implementing during triage, label-only thinking, unclear closure rationale.

## Update signals

Upstream changes triage labels or state machine.

## Evaluation ideas

Evaluate a mixed issue list and verify each has a rationale and next action.

## Ghi chú tiếng Việt

Triage là phân luồng công việc. File ảnh hưởng: triage skill/command/template và mappings.
