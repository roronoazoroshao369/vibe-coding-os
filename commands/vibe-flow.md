---
description: "Choose the lightest useful Vibe Coding OS workflow tier for a task."
---

# vibe-flow

## Purpose

Choose and run the lightest useful workflow for a task. This command sits in front of the
other `vibe-*` commands: it classifies the work into a tier and routes to the right amount of
process, so tiny edits stay fast and risky work stays safe.

## When to use

Use it first, whenever you are unsure how much process a task deserves, or when a task changes
shape mid-flight. If you already know the work is, say, a clear multi-file feature, you can go
straight to `commands/vibe-spec.md`; `vibe-flow` exists for the common case where the right
weight is not obvious.

## Required inputs

- The user request.
- The affected files and blast radius (what breaks if this is wrong).
- Whether behavior changes and whether it is easily reversible.
- Any explicit user instruction about process depth ("just do it", "be careful here").

## Step-by-step workflow

1. Resolve obvious ambiguity first with `skills/core/clarify-before-code/SKILL.md`; do not
   classify a request you do not understand.
2. Gather tier signals: file count, blast radius, reversibility, behavior change, risk surface
   (auth/data/infra/money/security).
3. Classify into one tier using the rubric in `skills/core/adaptive-flow/SKILL.md`
   (tiny / small / medium / large / risky). When signals straddle two tiers, pick the heavier.
4. State the chosen tier and what you will skip, in one line, before editing.
5. Route to the tier's flow:
   - **tiny** → implement directly, then run the smallest verification.
   - **small** → record a one-line spec note, implement, run a targeted test, verify.
   - **medium** → `commands/vibe-spec.md` → `commands/vibe-plan.md` →
     `commands/vibe-tasks.md` → implement → review → memory.
   - **large** → the medium flow plus an ADR, parallel exploration, subagents, an
     implementation brief, and `skills/core/review-before-merge/SKILL.md`.
   - **risky** → the large flow plus brownfield characterization tests, a rollback plan in the
     plan, a security review, and a separate reviewer pass.
6. Re-classify upward if new facts raise scope or risk, and add the missing steps before
   continuing.
7. Run the tier's non-skippable verification and report results honestly.

## Output format

- **Tier**: tiny / small / medium / large / risky.
- **Skipped**: the steps dropped for this tier, in one line.
- **Flow**: the ordered steps actually being run.
- **Verification**: the checks that must pass before "done".

## Verification expectation

Every tier ends with proof appropriate to its weight: at minimum the smallest check that the
change works, up to full validation plus security review and a separate reviewer pass for
risky work. Never report "done" without the tier's required verification. For repository
structure changes, run `npm run validate`.

## Stop/ask-clarifying-question condition

Stop and ask when the request is too ambiguous to classify, when a "tiny" task turns out to
touch a risky surface, when the user asked for a lighter flow than the risk safely allows, or
when required decisions for the chosen tier are unresolved.

## Related skills/templates

- `skills/core/adaptive-flow/SKILL.md` — the tier rubric and safe-skip rules.
- `docs/workflows/adaptive-flow.md` — flow diagram and worked examples.
- `skills/core/clarify-before-code/SKILL.md`, `skills/prompts/anti-overengineering/SKILL.md`.
- `commands/vibe-spec.md`, `commands/vibe-plan.md`, `commands/vibe-tasks.md`.

## Handoffs / next-step suggestion

- Tier is tiny or small → implement and verify directly; no further routing needed.
- Tier is medium or larger → hand off to `commands/vibe-spec.md` to start the spec.
- Risk raised mid-task → re-run this command, choose the higher tier, and add the missing
  steps before continuing.

## Ghi chú tiếng Việt

Dùng `vibe-flow` trước tiên để chọn mức quy trình nhẹ nhất nhưng đủ an toàn: phân loại task
thành tiny/small/medium/large/risky theo rubric trong `skills/core/adaptive-flow/SKILL.md`,
nói rõ chọn mức nào và bỏ bước gì, rồi định tuyến sang các lệnh `vibe-*` tương ứng. Luôn chạy
bước verify tối thiểu của mức đó; task risky bắt buộc có rollback, test đặc tả và một lượt
review riêng. Nội dung gốc của Vibe Coding OS, không copy CLI/template upstream.
