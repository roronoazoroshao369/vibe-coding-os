---
name: skillify-from-session
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Skillify From Session

## Purpose

Turn a workflow discovered during the current conversation into a reusable Vibe Coding OS skill, instead of losing the hard-won process after the session ends.

## When to use

Use after a session uncovered a repeatable workflow, a recurring project-specific decision path, a verification pattern, or a trap that future agents should avoid.

Do not use for generic snippets, one-off fixes, or knowledge someone could rediscover in a few minutes from public docs.

## Inputs

Conversation summary, files touched, decisions made, failed attempts, successful workflow steps, verification evidence, and the target skill category.

## Workflow

1. Test whether the workflow deserves a skill:
   - Is it repeatable?
   - Is it specific to this repo or operating model?
   - Did it require non-trivial debugging, design, review, or coordination?
2. Extract the reusable shape: trigger, inputs, ordered steps, outputs, failure modes, and verification checklist.
3. Separate stable practice from session noise: keep constraints, decisions, pitfalls, and evidence; discard timestamps, chat phrasing, private context, and temporary tool output.
4. Choose the target location:
   - `skills/core/` for coding workflow fundamentals.
   - `skills/meta/` for framework authoring or process improvement.
   - `skills/agents/` for role behavior.
   - docs only if it is not action-oriented enough for a skill.
5. Draft the skill using the local `SKILL.md` schema and concise original wording.
6. Add a Vietnamese footer and, when upstream inspiration contributed to the pattern, cite the source repo and license.
7. Verify the skill: clear trigger, narrow scope, no duplicate existing skill, actionable workflow, practical failure modes.

## Outputs

A proposed skill name, target path, extracted workflow outline, complete draft when ready, and open questions if the pattern is still too fuzzy to encode safely.

## Failure modes

Skillifying a one-off incident; copying session transcript into a skill; preserving private or noisy details; duplicating an existing skill; drafting a broad policy doc instead of a reusable workflow.

## Verification checklist

The quality gate passed; the skill has the required headings; wording is original; private/session-only details are removed; the trigger is searchable and narrow; related skills are linked instead of duplicated.

## Ghi chú tiếng Việt

Dùng kỹ năng này sau một phiên làm việc có quy trình lặp lại đáng lưu thành skill. Chỉ giữ phần tái sử dụng được: trigger, input, bước làm, output, failure modes, verification. Không chép transcript, không lưu dữ liệu nhạy cảm, không tạo skill cho việc chỉ xảy ra một lần. File liên quan: `skills/meta/write-reusable-skill/SKILL.md`, `skills/meta/writing-skills/SKILL.md`.

## Nguồn cảm hứng / Inspiration

Workflow adapted as original wording from `yeachan-heo/oh-my-claudecode` (MIT, Yeachan Heo) skillify pattern. Inspiration only — no upstream text copied.
