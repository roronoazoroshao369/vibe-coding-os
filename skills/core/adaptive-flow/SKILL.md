---
name: adaptive-flow
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Adaptive Flow

## Purpose

Pick the lightest useful version of the `Intent → Spec → Plan → Implement → Test → Review →
Memory → Merge` workflow for the task in front of you, so small work stays fast and risky
work stays safe. The assistant chooses a flow tier per task, skips steps that add no value,
and never skips the checks that protect correctness.

## When to use

Use at the start of any meaningful task, and again whenever the task's risk or scope changes
mid-flight (a "tiny" edit that uncovers a schema change, a "medium" feature that turns out to
touch auth). Triggers include "just fix this quickly", "what's the right process here", "do we
need a full spec", "this is risky", or any time you are about to start editing without having
decided how much process the work deserves.

## Inputs

The user request, the affected files and blast radius, reversibility of the change, whether
behavior changes, presence of tests, and any explicit user instruction about process depth.

## Tier rubric

Classify the task into one tier, then run that tier's flow. When signals straddle two tiers,
pick the heavier one. Re-classify if facts change.

| Tier | Signals | Flow |
| --- | --- | --- |
| **tiny** | One file, obvious fix, no behavior change, trivially reversible (typo, rename, comment, doc tweak). | Intent → Implement → quick verify. Skip spec, plan, tasks, brief. |
| **small** | 2–5 files, clear boundaries, low risk, behavior change is local and easy to test. | Intent → one-line spec note → Implement → targeted test → verify. |
| **medium** | Multi-file feature, unclear-but-bounded scope, user-visible behavior, needs ordering. | Spec → Plan → Tasks (with status) → Implement → review → memory. Implementation brief recommended. |
| **large** | Multi-system, new architecture, many files, parallelizable, hard to hold in one context. | Full lifecycle + ADR + parallel exploration + subagents + brief + review-before-merge. |
| **risky** | Touches auth, data, infra, money, security, or anything hard to reverse — at any size. | Large flow + brownfield characterization tests + rollback plan + security review + a separate reviewer pass. |

## Safe-skip rules

Skipping is the point of this skill, but only some steps are safe to drop.

- **Always allowed to skip when the tier says so:** standalone spec doc, written plan, task
  decomposition, implementation brief, ADR, parallel exploration, subagents.
- **Never skip, regardless of tier:** confirming intent, the smallest verification that proves
  the change works, and privacy/attribution hygiene. A change with zero verification is never
  "done".
- **Never skip for `risky`, even to save time:** rollback thinking, characterization tests
  before changing existing behavior, and a review pass by something other than the author's
  active context.
- **Skip lightweight, not silent.** When you drop a step, say which tier you chose and what you
  skipped, in one line, so the user can object before you proceed.

## Workflow

1. Read the request and gather the tier signals (files, blast radius, reversibility, behavior
   change, risk surface).
2. Classify into a tier using the rubric; when in doubt, round up.
3. State the chosen tier and the steps you will skip in one line.
4. Run that tier's flow, keeping each step as light as the tier allows.
5. If new facts raise the risk or scope, re-classify upward and add the steps the higher tier
   requires before continuing.
6. Run the non-skippable verification for the tier and report results honestly.

## Outputs

A named tier, a one-line statement of what is skipped and why, the executed flow at the right
weight, and verification evidence appropriate to the tier.

## Failure modes

- Under-classifying risky work as small to move faster (the costly mistake).
- Over-classifying trivial work as medium/large and drowning a typo in process.
- Skipping verification or privacy/attribution checks "because it's tiny".
- Skipping silently, so the user never gets a chance to push back.
- Locking the tier in and not re-classifying when the task grows.

## Verification checklist

- [ ] A tier is named before implementation starts.
- [ ] Skipped steps are stated, not silent.
- [ ] No non-skippable step (intent, minimal verification, privacy/attribution) was dropped.
- [ ] `risky` tasks include rollback, characterization tests, and a separate review pass.
- [ ] The tier was re-evaluated if scope or risk changed mid-task.

## Related skills/commands

- `commands/vibe-flow.md` — the command entry point for choosing and running a tier.
- `docs/workflows/adaptive-flow.md` — the flow diagram and worked examples.
- `skills/core/clarify-before-code/SKILL.md` — resolve ambiguity before classifying.
- `skills/prompts/anti-overengineering/SKILL.md` — keeps the chosen flow from bloating.
- `skills/core/verification-before-completion/SKILL.md` — the non-skippable verify step.

## Standards-mandated steps

Some standards in `STANDARDS.md` impose flow requirements that override the tier rubric.
When a standard is active for the current work, the flow must include the standard's mandatory
steps regardless of the tier.

| Standard in STANDARDS.md | Flow requirement | Triggered by |
| --- | --- | --- |
| Coding — smallest change | Always applies; no extra step | Any coding task |
| Testing — `npm run validate` | Run after structural changes | Template, registry, reference, skill, or command changes |
| Attribution — update references/index.json | Run after adapting tracked ideas | Any source adaptation |
| Attribution — update changelogs and mappings | Run after adapting tracked ideas | Any source adaptation |

If the tier says `skip spec` but a standard says `update index.json`, the standard wins —
add the index.json update as a step even though the tier would skip it. The flow must cite
the standard that forced the extra step when reporting the chosen tier.

## Constitution alignment

This skill operationalizes Principle 3 (simplicity beats cleverness) and Principle 4
(verification is part of done): take the lightest path that still proves the work, never the
lightest path that skips proof. It is original local guidance and vendors no upstream
template, prompt, or CLI.

## Ghi chú tiếng Việt

Chọn phiên bản nhẹ nhất nhưng đủ dùng của quy trình theo mức độ rủi ro/phạm vi của task:
tiny → chỉ intent + implement + verify nhanh; small → thêm ghi chú spec ngắn và test trọng
tâm; medium → spec + plan + tasks + review + memory; large → toàn bộ vòng đời + ADR +
song song + subagents; risky → như large cộng test đặc tả hệ thống cũ, kế hoạch rollback và
một lượt review riêng. Được phép bỏ qua spec/plan/tasks/brief khi mức độ cho phép, nhưng
KHÔNG BAO GIỜ bỏ xác nhận ý định, bước verify tối thiểu, và kiểm tra quyền riêng tư/ghi công.
Luôn nói rõ đã chọn mức nào và bỏ bước gì, đừng bỏ lặng lẽ. Đây là nội dung gốc của Vibe
Coding OS.
