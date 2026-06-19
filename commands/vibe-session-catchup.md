---
description: "Recover from context loss: read persistent plan, re-establish context, report completion state, suggest next action."
---

# vibe-session-catchup

## Purpose

Recover from a context reset, session timeout, or agent handoff by loading a crash-proof
plan file, re-establishing workspace context, reporting the current completion state, and
recommending the next concrete action.

## When to use

Use when resuming work after any interruption that causes context loss — a session timeout,
a tab close, a handoff to a different agent, or a workspace switch. Run this before any
other command when returning to an active plan.

## Required inputs

- A crash-proof plan file (YAML frontmatter + completion markers) either specified explicitly
  or found by search.
- Current workspace state (accessible via `git status`, file system).

## Step-by-step behavior

### 1. Locate the plan file

First, try the plan file at the given path. If no path is given, search for plan files:

- Look for `plans/*.md` or `*.plan.md` files in the workspace.
- Scan for files containing YAML frontmatter with `plan-id` field.
- If multiple are found, present a numbered list and ask the user to choose.
- If none are found, report "No crash-proof plan found" and suggest creating one.

### 2. Parse the frontmatter

Read the YAML frontmatter block between `---` delimiters. Extract:

- `plan-id`: unique identifier for this plan.
- `status`: one of `draft`, `in-progress`, `completed`, `abandoned`.
- `checkpoint`: the last completed checkpoint label.
- `total-steps`: total number of steps declared.
- `recovery-count`: number of times recovery has been run.
- `last-modified`: timestamp of last modification.
- `depends-on`: optional list of plan dependencies.

If frontmatter is missing or invalid, report an error and abort.

### 3. Scan completion markers

Walk every step line in the plan body (lines after frontmatter, before checkpoint block,
that start with `- [ ]`, `- [~]`, `- [x]`, `- [!]`, `- [-]`). Count each category:

```
State      Count
Complete   [x] 3
In-progress [~] 1
Not started [ ] 4
Blocked    [!] 0
Skipped    [-] 0
Total      8
```

### 4. Re-establish workspace context

Run these commands and capture output for the summary:

- `git status --short` — show uncommitted changes.
- `git log --oneline -3` — recent commit context.
- `ls <relevant-directories>` — verify file tree matches plan expectations.

If a step references a file, check that the file exists. Flag missing files.

### 5. Report completion state

Print a structured summary:

```
=== Session Catchup Report ===
Plan: PLAN-2026-06-19-crash-proof-batch
Status: in-progress
Checkpoint: step-3
Recovery: 1 (2nd session)
Completed: 3/8 steps (37%)
In-progress: step-4 (Feature design)
Blocked: none, Skipped: none
Workspace: 2 modified files, 0 untracked
Next action: Complete step 4 (Feature design) — files: feature-design.md
=== End Report ===
```

### 6. Suggest next action

Analyze the step markers to recommend a concrete next action:

- If a step is `[~]` (in-progress): "Verify and continue step {N}: {description}. Check
  that partial work in {files} is valid, then complete it."
- If all ready steps are `[ ]` and dependencies are `[x]`: "Start step {N}: {description}.
  Files to touch: {files}. Verification: {verification}."
- If a step is `[!]` (blocked): "Step {N} blocked by {reason}. Assess if blocker is
  resolved. If not, consider skipping or escalating."
- If checkpoint says one thing but markers say another: "Marker state and checkpoint
  disagree. Audit steps around checkpoint boundary and reconcile."

## Outputs

A session catchup report with plan identity, completion summary, workspace delta, and
next-action recommendation. The plan file's `recovery-count` is incremented and
`last-modified` is updated.

## Options

- `--plan <path>` — Specify the plan file explicitly instead of searching.
- `--dry-run` — Parse and report without modifying the plan file.
- `--skip-verify` — Skip workspace `git status` and file existence checks (for quick
  catchup in known-clean workspaces).

## Verification checklist

- [ ] Plan file exists and has valid frontmatter.
- [ ] Marker counts match plan body inspection.
- [ ] Workspace context is accurate and current.
- [ ] Next-action suggestion is actionable and concrete.
- [ ] `recovery-count` increment is correct (or `--dry-run` prevents writes).

## Related skills/templates

- `skills/core/crash-proof-planning/SKILL.md`
- `templates/crash-proof-plan-template.md`
- `skills/memory/agent-handoff/SKILL.md`
- `commands/vibe-session-summary.md`

## Ghi chú tiếng Việt

Phục hồi phiên làm việc sau khi mất ngữ cảnh: tìm file plan (YAML frontmatter + marker),
đọc trạng thái, chạy `git status`, báo cáo tiến độ (bao nhiêu bước xong / đang làm / chưa
làm), và gợi ý bước tiếp theo. Không thay đổi file plan trừ khi cập nhật `recovery-count`
và `last-modified`. Học ý tưởng từ `othmanadi/planning-with-files`, viết lại hoàn toàn
nguyên bản.
