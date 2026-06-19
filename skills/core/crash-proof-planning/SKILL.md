# Skill: Crash-Proof Planning & Session Recovery

## Purpose

Ensure plans survive context resets, agent handoffs, and session interruptions by using a
persistent plan format with YAML frontmatter, explicit checkpoint markers, and a structured
recovery workflow that restores context from the plan file alone.

## When to use

Use whenever work spans multiple sessions, involves multiple agents, or carries enough risk
that losing planning context would cause significant rework. Use proactively before starting
a multi-file or multi-day feature, and reactively when resuming work after a context reset.

## Inputs

- A persistent plan file following `templates/crash-proof-plan-template.md`.
- Current workspace state (file tree, git status, open changes).
- Optional: previous session summary or handoff notes.

## Persistent Plan Format

Every crash-proof plan has three sections:

### 1. YAML Frontmatter

The frontmatter carries all metadata needed to identify, version, and track the plan across
sessions:

```yaml
---
plan-id: PLAN-2026-06-19-crash-proof-batch
created: 2026-06-19T10:00:00Z
author: agent-session-alpha
status: in-progress
checkpoint: step-3   # last completed checkpoint label
total-steps: 7
recovery-count: 0     # incremented each time recovery runs
last-modified: 2026-06-19T11:30:00Z
depends-on: []        # optional plan dependencies
tags: [feature, crash-proof]
---
```

Mandatory fields: `plan-id`, `created`, `status`, `checkpoint`, `total-steps`.
Optional fields: `author`, `recovery-count`, `last-modified`, `depends-on`, `tags`.

### 2. Body with Completion Markers

Each step in the plan body carries a completion marker that is unambiguous regardless of
formatting or whitespace changes. The marker system uses bracket prefixes on step lines:

- `[ ]` — not started. The step has not been worked on.
- `[~]` — in progress. Work has begun but is not complete.
- `[x]` — complete. All verification for this step passes.
- `[!]` — blocked. A named blocker prevents progress; recorded in step notes.
- `[-]` — skipped. Explicit decision to skip, with reason in step notes.

Markers survive re-read because they are part of the markdown source, not derived state.
Example:

```
## Steps

[x] Step 1: Assess current crash-points in workspace.
    Files: workspace-audit.md
    Verification: grep for existing plan files
    Notes: Found three active plan files, none with recovery markers.

[~] Step 2: Design plan format with frontmatter.
    Files: SKILL.md
    Verification: reviewed against 8 crash scenarios
    Notes: Format handles context-loss, partial-completion, agent-handoff crashes.

[ ] Step 3: Implement recovery workflow.
    Files: commands/vibe-session-catchup.md
    Verification: dry-run recovery against mock plan
```

### 3. Checkpoint Block

At the end of the plan body, a checkpoint block records the last known-good state:

```
## Checkpoint

Current: step-3 (Step 2 verified green)
Completed steps: 1, 2
In-progress: step-3
Blocked: none
Next action: Complete step 3 implementation then verify
```

## Workflow

1. **Create plan** — Use `templates/crash-proof-plan-template.md` to initialize a plan with YAML frontmatter, completion markers, and checkpoint block.
2. **Execute steps** — Work through each step, updating completion markers (`[ ]`, `[~]`, `[x]`, `[!]`, `[-]`) as progress advances.
3. **Update checkpoint** — After each step, update the checkpoint block with current status, completed steps, and next action.
4. **Save plan** — Commit or save the plan file; the frontmatter `last-modified` timestamp tracks freshness.
5. **Recover on context loss** — When context is reset, run the recovery workflow to re-establish from the plan file alone.

### Recovery Workflow

When context is lost (session reset, agent handoff, crash), the recovery workflow re-establishes
planning context from the plan file alone:

1. **Locate plan file** — Search for the most recent crash-proof plan by `plan-id` or by
   glob pattern `*plan*` with YAML frontmatter. If multiple exist, present choices.

2. **Parse frontmatter** — Read `status`, `checkpoint`, `total-steps`, `recovery-count`.
   Increment `recovery-count` (soft increment; the human or next agent verifies the update).

3. **Scan completion markers** — Walk each step in the body, collect counts per marker type:

   | Marker | Meaning | Action |
   |--------|---------|--------|
   | `[x]` | Complete | Skip; do not redo |
   | `[~]` | In progress | Verify partial work; resume or restart step |
   | `[!]` | Blocked | Assess if blocker resolved; unblock or abandon |
   | `[-]` | Skipped | Respect skip unless context changed |
   | `[ ]` | Not started | Available for work |

4. **Re-establish workspace context** — Run `git status`, `git log --oneline -5`, `ls -la`
   on relevant directories to confirm file tree matches plan expectations.

5. **Report completion state** — Print a summary:

   ```
   PLAN-2026-06-19-crash-proof-batch
   Status: in-progress | Checkpoint: step-3 | Recovery: 1
   Completed: 2/7 steps (28%)
   In-progress: step-3
   Blocked: none
   Next: Complete step 3 implementation then verify
   ```

6. **Suggest next action** — Based on current step status, recommend the concrete next
   command or edit. For `[~]` steps, verify partial work before continuing. For `[ ]` steps
   with `[x]` dependencies, start the step. For `[!]` steps, check blocker resolution.

7. **Update plan frontmatter** — Set `last-modified` to current timestamp and save.

## Crash Scenarios

| Scenario | How plan survives |
|----------|-------------------|
| Session timeout / context reset | Plan file remains on disk; recovery workflow loads and reports |
| Agent handoff to different agent | Plan frontmatter identifies author; recovery workflow re-establishes |
| Partial completion between sessions | Completion markers preserve partial state unambiguously |
| Git stash or branch switch | Plan file is tracked or referenced in task list; recovery finds it |
| File rename or workspace move | Plan file path should be stable (`plans/` directory); recovery searches by content |
| Multi-agent conflict on same plan | Recovery workflow audits markers; human reconciles conflicts |
| Verification failure mid-step | Step stays `[~]` until re-verified; recovery re-scans markers |
| Human deletes plan file | Recovery workflow reports plan missing; suggests re-creation from template |

## Outputs

- A readable completion summary showing step status, checkpoint, and next action.
- An updated plan file with correct `last-modified` and (if applicable) incremented
  `recovery-count`.
- A context report that the next agent or human can act on immediately.

## Failure modes

- Plan file is missing and no backup exists. Mitigation: commit plan files to version control;
  recovery workflow suggests template-based re-creation from memory or handoff notes.
- Completion markers are inconsistent with actual file state. Mitigation: verify step state
  against file system before reporting; flag mismatches explicitly.
- Recovery runs before the plan is saved. Mitigation: recovery workflow checks for frontmatter
  before attempting recovery; aborts with clear message if format is invalid.
- Multiple agents write competing markers. Mitigation: human must reconcile conflicts;
  recovery workflow audits all markers and flags collisions.

## Verification checklist

- [ ] Plan file has valid YAML frontmatter with all mandatory fields.
- [ ] Every step has a completion marker (`[ ]`, `[~]`, `[x]`, `[!]`, or `[-]`).
- [ ] Checkpoint block matches the actual markdown state.
- [ ] Recovery workflow produces a correct summary from a mock plan file.
- [ ] Recovery-count increments, recovery-count survives re-read.
- [ ] Partial plan (some steps done, some in-progress) is recovered correctly.

## Applied / Not Applied

- Applied: persistent plan format with YAML frontmatter, bracket completion markers,
  checkpoint block, structured recovery workflow, crash scenario taxonomy.
- Not applied: runtime plan engine, plan daemon, auto-save hooks, inotify watchers,
  cloud-synced plan state, or any external runtime dependency.

## Ghi chú tiếng Việt

Kế hoạch chống sập: YAML frontmatter (`plan-id`, `checkpoint`, `status`), đánh dấu bước
(`[ ]` chưa làm, `[~]` đang làm, `[x]` xong, `[!]` bị chặn, `[-]` bỏ qua), block checkpoint
ghi trạng thái cuối. Khi mất ngữ cảnh, quy trình phục hồi tìm file plan, đọc frontmatter và
marker, chạy `git status`, báo cáo, và gợi ý bước tiếp theo. Không có runtime engine hay
daemon. Lấy cảm hứng từ `othmanadi/planning-with-files`, viết lại hoàn toàn nguyên bản.
