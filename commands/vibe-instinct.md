---
description: "Extract, review, or apply engineering instincts from sessions using the continuous-learning workflow."
---

# vibe-instinct

## When to use

Use to extract instincts from a completed work session (`--extract`), review the instinct store for stale or unverified entries (`--review`), apply relevant instincts before starting a task (`--apply`), or list the current instinct catalog (`--list`). Run this as part of session completion or session preparation.

## Required inputs

- Current session summary or conversation transcript (for `--extract`).
- Instinct store location (`references/instincts/` by default).
- Relevant local memory skills, workflows, and templates.
- Target task description or spec (for `--apply`).

## Usage

```
vibe-instinct --extract [--session <session-summary-file>]
  Extract instincts from the current session.
  Reads session context, formulates instinct candidates,
  scores confidence, and writes to the instinct store.

vibe-instinct --review [--stale-only] [--expired-only]
  Review the instinct store for quality, staleness, or expiry.
  With --stale-only, only show entries past their review date.
  With --expired-only, only show entries past their expiry date.

vibe-instinct --apply <task-description>
  Load instincts whose triggers match the task description.
  Injects matching instincts into working context as advisory guidance.
  Reports confidence scores and scope limits for each loaded instinct.

vibe-instinct --list [--confidence <min>] [--tag <tag>]
  List all instincts in the store, optionally filtered by
  minimum confidence score or tag/category.

vibe-instinct --archive <instinct-name>
  Move an instinct to the archived store (references/instincts/archived/).
  Requires confirmation if the instinct has high confidence (>7).

vibe-instinct --promote <instinct-name> [--skill-name <name>]
  Promote a verified instinct to a formal skill.
  Generates a SKILL.md scaffold and updates the skill registry.
```

## Step-by-step behavior

1. Locate the instinct store at `references/instincts/`. Create it if it does not exist.
2. For `--extract`: read the session summary, scan for repeated patterns, formulate instinct candidates using the extraction skill, score each 1-10, set scope and expiry, write structured markdown files.
3. For `--review`: walk the store, validate each entry against the instinct template, flag expired/overdue entries, report duplicates or contradictions.
4. For `--apply`: parse the task description for trigger keywords, match against instinct triggers, load matching instincts with their confidence scores and scope notes into working context.
5. For `--list`: read the store index or scan files, apply optional filters, display a compact table or bullet list.
6. Re-check privacy and noise before writing any new entry.

## Outputs

- New instinct file(s) in `references/instincts/` (for `--extract`).
- A review report summarizing stale, expired, or problematic instincts (for `--review`).
- A context injection block with matched instincts (for `--apply`).
- A filtered list of instinct records (for `--list`).
- Updated/archived instinct files (for `--archive` or `--promote`).

## Stopping conditions

Stop if the session summary is empty or unavailable (nothing to extract from). Stop if the instinct store is unreachable or locked. Stop if the task description is too vague to match triggers meaningfully (ask for more detail). Stop if sensitive data would be written to the store without redaction.

## Verification checklist

- [ ] Instinct store was located and is writable.
- [ ] For --extract: each new instinct has trigger, action, scope, confidence (1-10), evidence, and expiry.
- [ ] For --review: each flagged entry has a reason and a recommended action.
- [ ] For --apply: loaded instincts are tagged with confidence and scope.
- [ ] Privacy check completed before writing any new entries.
- [ ] No upstream runtime or scripts were copied.

## Works with

- `skills/meta/context-budget/SKILL.md` — the extraction workflow this command automates.
- `skills/meta/context-budget/SKILL.md` — instinct store entries should respect context budgets.
- `templates/instinct-template.md` — structured format for instinct records.
- `commands/vibe-session-capture.md` — session observations that feed instinct extraction.

## Ghi chú tiếng Việt

Lệnh này giúp rút instinct từ phiên làm việc (`--extract`), rà soát kho instinct (`--review`), nạp instinct phù hợp trước khi làm việc (`--apply`), hoặc liệt kê (`--list`). Kho instinct mặc định là `references/instincts/`. Mỗi instinct có trigger, action, scope, điểm tin cậy 1-10, bằng chứng và hạn dùng. Lọc bí mật trước khi ghi.
