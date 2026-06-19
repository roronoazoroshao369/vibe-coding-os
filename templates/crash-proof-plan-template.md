# Plan: <title>

```yaml
---
plan-id: PLAN-YYYY-MM-DD-<slug>
created: YYYY-MM-DDTHH:MM:SSZ
author: <agent-or-human>
status: draft        # draft | in-progress | completed | abandoned
checkpoint: none     # label of last completed checkpoint
total-steps: <N>
recovery-count: 0
last-modified: YYYY-MM-DDTHH:MM:SSZ
depends-on: []       # optional plan dependencies
tags: []
---
```

## Context

What is this plan for? Link the spec, brief, or issue that drives this work.

## Steps

Use these completion markers before each step:

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — complete
- `[!]` — blocked (record reason in Notes)
- `[-]` — skipped (record reason in Notes)

Format per step:

```
[ ] Step N: <description>
    Files: <files-to-touch>
    Verification: <how-to-verify-this-step>
    Notes: <context, decisions, open-questions>
```

### Example

```
[x] Step 1: Assess current crash-points in workspace.
    Files: workspace-audit.md
    Verification: grep for existing plan files
    Notes: Found three active plan files.

[~] Step 2: Design plan format with frontmatter.
    Files: SKILL.md
    Verification: reviewed against crash scenarios
    Notes: Format handles context-loss, agent-handoff crashes.

[ ] Step 3: Implement recovery workflow.
    Files: commands/vibe-session-catchup.md
    Verification: dry-run recovery against mock plan
```

## Checkpoint

Record the last known-good state of the plan here. Update after every step completion.

```yaml
checkpoint: <step-label>   # e.g., step-2
completed-steps: [1, 2]
in-progress: step-3
blocked: none
skipped: none
next-action: Complete step 3 implementation then run verification
```

## Recovery Instructions

If context is lost before this plan is complete:

1. Run `commands/vibe-session-catchup.md` — it will locate this file, parse the
   frontmatter, scan completion markers, check workspace state, and suggest the next
   action.
2. If `vibe-session-catchup` is not available, follow this manual recovery:
   a. Read the frontmatter: note `plan-id`, `status`, `checkpoint`.
   b. Walk the Steps section: count `[x]`, `[~]`, `[ ]`, `[!]`, `[-]` markers.
   c. Run `git status` and `git log --oneline -3` for workspace context.
   d. Identify the next incomplete step whose dependencies are all `[x]`.
   e. Update `recovery-count` and `last-modified` in frontmatter.
   f. Begin work on the next step.

## Ghi chú tiếng Việt

Template kế hoạch chống sập: frontmatter YAML (`plan-id`, `status`, `checkpoint`,
`recovery-count`), các bước có marker (`[ ]`/`[~]`/`[x]`/`[!]`/`[-]`), block checkpoint,
và hướng dẫn phục hồi thủ công. Dùng với `skills/core/crash-proof-planning/SKILL.md` và
`commands/vibe-session-catchup.md`. Lấy cảm hứng từ `othmanadi/planning-with-files`,
viết lại hoàn toàn nguyên bản.
