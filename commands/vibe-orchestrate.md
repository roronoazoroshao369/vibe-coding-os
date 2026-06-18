---
description: "Run or inspect a stage-gated multi-agent orchestration workflow."
arguments:
  --workflow <path>: "Workflow definition file to execute."
  --list-templates: "Show available workflow templates."
  --dry-run: "Show what would run without executing gates."
  --output-json: "Emit JSON workflow results."
---

# vibe-orchestrate

## Purpose

Execute a multi-stage orchestration workflow with explicit agent roles, artifacts, and quality gates.

## Usage

- `vibe-orchestrate --list-templates`
- `vibe-orchestrate --workflow templates/workflow-simple-feature.json --dry-run`
- `vibe-orchestrate --workflow templates/workflow-security-audit.json --output-json`

## Behavior

1. If `--list-templates` is provided, list available `templates/workflow-*.json` workflow templates.
2. Read the workflow file passed with `--workflow <path>`.
3. Run stages sequentially in the declared order.
4. Check each stage gate and block advancement when a required gate fails.
5. Write the final summary to `docs/reports/orchestration/<workflowId>-<timestamp>.md`.
6. If `--dry-run` is set, show the planned stages and gate commands without executing them.
7. If `--output-json` is set, return structured JSON in addition to the markdown report.

## Implementation

Use the dependency-free runner:

```bash
node scripts/orchestrate-workflow.mjs --workflow <path> [--dry-run] [--output-json]
```
