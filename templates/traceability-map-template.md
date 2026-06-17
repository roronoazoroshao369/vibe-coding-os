# Traceability Map Template

Copy this into a plan, issue, or docs note when one piece of work spans a spec, tasks, and verification checkpoints.

## Purpose
Map acceptance criteria → plan steps → tasks → files → tests → checkpoints so the work is auditable and completion is verifiable.

## Header
- **Spec:** `<path or link>`
- **Plan:** `<path or link>`
- **Owner:** `<person or agent>`
- **Status:** `planning | in-progress | review | done`
- **Last updated:** `<YYYY-MM-DD>`

## Human-readable traceability

- Acceptance criterion AC-01
  - Plan step: step 1 — create adapter rules
  - Task: task-01
  - Files: `adapters/cursor/rules/vibe-core.md`
  - Tests: `npm run validate`
  - Checkpoint: adapter rule file exists and passes validation
- Acceptance criterion AC-02
  - Plan step: step 2 — add Codex response templates
  - Task: task-02
  - Files: `templates/codex-response-minimal.md`, `templates/codex-response-research.md`
  - Tests: `npm run validate`
  - Checkpoint: templates render correctly and validate

## Rules
- Every criterion should trace forward to at least one task.
- Every task should trace back to at least one criterion.
- Each file should map to a task and checkpoint.
- Each checkpoint should have a reproducible verification command or review note.

## Coverage checklist
- [ ] Every acceptance criterion has a plan step and task.
- [ ] Every task lists affected files.
- [ ] Every file has a checkpoint and test/validation command.
- [ ] Uncovered criteria are noted explicitly.

## Machine-readable section
```json
{
  "map_id": "trace-001",
  "status": "planning",
  "last_updated": "2026-06-17",
  "spec": "docs/specs/example-spec.md",
  "plan": "docs/plans/example-plan.md",
  "criteria": [
    {
      "id": "AC-01",
      "title": "Cursor rules exist",
      "tasks": ["task-01"],
      "files": ["adapters/cursor/rules/vibe-core.md"],
      "tests": ["npm run validate"],
      "checkpoints": ["rule-file-present"]
    },
    {
      "id": "AC-02",
      "title": "Codex response templates exist",
      "tasks": ["task-02"],
      "files": ["templates/codex-response-minimal.md", "templates/codex-response-research.md"],
      "tests": ["npm run validate"],
      "checkpoints": ["template-files-present"]
    }
  ],
  "coverage_notes": "Fill in actual IDs, tasks, files, and verification commands during planning."
}
```
