# Feature: Crash-Proof Planning & Session Recovery

## Goal

Define how Vibe Coding OS supports crash-proof planning as an original local capability:
persistent plan files with structured metadata and completion markers that survive context
resets, agent handoffs, and session interruptions, plus a recovery workflow that
re-establishes context from the plan file alone.

## Reference sources

- othmanadi/planning-with-files (primary — persistent plan format inspiration)
- github/spec-kit (composes with the spec → plan → tasks → implement flow)
- eyaltoledano/claude-task-master (composes with task-state tracking)

## Local implementation

- `skills/core/crash-proof-planning/SKILL.md` — Crash-proof planning skill
- `commands/vibe-session-catchup.md` — Session catchup recovery command
- `templates/crash-proof-plan-template.md` — Persistent plan template

## Applied upstream ideas

- Persistent plan format: plans stored as files with structured metadata.
- Completion markers: bracket-based step indicators that survive re-read.
- Checkpoint system: named labels recording the last known-good state.
- Recovery workflow: structured procedure for resuming after context loss.
- Recovery-attempt tracking: counter to detect repeated recovery loops.

## Not applied upstream ideas

- Any runtime plan engine, daemon, or watcher.
- Cloud-synced plan state or external plan storage.
- Upstream file format conventions or naming patterns.

## Must-have behavior

- Plan files have YAML frontmatter with `plan-id`, `created`, `status`, `checkpoint`,
  `total-steps`, and `recovery-count`.
- Each step uses one of five completion markers: `[ ]`, `[~]`, `[x]`, `[!]`, `[-]`.
- A checkpoint block at the end records the last known-good state.
- Recovery workflow (via `vibe-session-catchup` or manual) locates the plan, parses
  frontmatter, scans markers, checks workspace state, reports summary, and suggests
  next action.
- Recovery-count increments each time recovery runs, helping detect repeated loops.

## Design decisions

1. **YAML frontmatter over JSON**: YAML is more readable in markdown files, supports
   comments, and is already familiar from many static-site generators. JSON would require
   escaping and is less human-friendly for inline editing.

2. **Bracket markers over checkboxes**: Markdown `[x]` checkboxes are sometimes rendered
   as HTML checkboxes and can be lost during copy-paste. The bracket markers `[ ]`, `[~]`,
   `[x]`, `[!]`, `[-]` are plaintext only and survive any transformation.

3. **Checkpoint block separate from frontmatter**: The frontmatter holds metadata; the
   checkpoint block at the end of the plan is a human-readable summary that can be updated
   without touching YAML. Both should agree, but the checkpoint block is easier to scan
   visually.

4. **Recovery-count in frontmatter**: Incrementing this counter each time recovery runs
   helps humans and agents detect when a plan is in a repeated recovery loop (suggesting
   the plan or workspace has a fundamental issue).

5. **No runtime dependencies**: The plan format is pure markdown. Recovery can be done
   manually by reading the file, or automated via the `vibe-session-catchup` command.
   No daemon, watcher, or background process is required.

## Composition with existing features

Crash-proof planning composes with the existing spec → plan → tasks → implement flow:

- Spec (vibe-brief/specify) → Plan (vibe-plan-from-spec) → the plan can use the
  crash-proof-plan-template for resilience.
- Tasks (vibe-tasks) can reference the plan's step markers for state tracking.
- Task-state-tracking (skills/core/task-state-tracking) composes with step markers:
  a task in `in-progress` state corresponds to a `[~]` step; `done` → `[x]`.
- Agent handoff (skills/memory/agent-handoff) should mention the plan-id so the
  receiving agent can run `vibe-session-catchup` immediately.

## Failure modes

- Plan file is deleted. Mitigation: tell users to commit plan files to version control.
- Frontmatter is invalid. Mitigation: the session catchup command validates and reports.
- Markers are inconsistent with file state. Mitigation: recovery workflow flags mismatches.
- Multiple agents write conflicting markers. Mitigation: human must reconcile; recovery
  workflow audits all markers and flags collisions.

## Update signals

- Upstream changes the plan format significantly.
- Local users report that recovery workflow misses important context.
- A crash scenario is discovered that the current taxonomy does not cover.
- Integration with task-state-tracking or handoff workflow needs updating.

## Evaluation ideas

- Can an agent resume a multi-step feature after a simulated context reset and complete
  it without human re-explanation?
- Does recovery-count ever exceed 3 for the same plan? (Signal of a fundamental issue.)
- Can a human read a plan file and immediately know what is done and what to do next?
- Does the plan format compose cleanly with existing spec/plan/tasks templates?

## Ghi chú tiếng Việt

Tính năng lập kế hoạch chống sập: file plan bền vững với frontmatter YAML (`plan-id`,
`status`, `checkpoint`, `recovery-count`), marker dạng bracket (`[ ]`/`[~]`/`[x]`/`[!]`/`[-]`),
block checkpoint ghi trạng thái cuối. Phục hồi qua `vibe-session-catchup` hoặc thủ công. Kết
hợp với luồng spec → plan → tasks → implement. Học từ `othmanadi/planning-with-files`, viết
lại hoàn toàn nguyên bản. Không có runtime/dependency.
