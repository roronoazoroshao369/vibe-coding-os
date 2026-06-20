---
name: goal-driven-execution
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Goal-Driven Execution

## Purpose

Turn an imperative instruction ("fix the bug", "make it faster", "add the export
button") into a verifiable goal: a stated success condition plus an ordered set of plan
steps, where every step carries its own check that proves the step landed. The point is to
make progress measurable so the agent can run, observe its own results, and self-correct
without a human re-explaining the target after each move.

## When to use

Use whenever a request tells you *what to do* but not *how you will know it worked* — most
"do X" prompts. Especially valuable before a long or autonomous run, before handing work to
a subagent, or any time the success condition lives only in the user's head. If you cannot
say in one sentence what observable result means "done", this skill comes first.

## Inputs

The imperative request, the current observable behavior, any acceptance criteria or
constraints, the available checks (tests, build, lint, manual observation), and the
reversibility/risk of the change.

## Workflow

1. Restate the request as a goal with an observable success condition: "X is done when
   [observable result] is true", not "do X". If the success condition is not observable,
   make it observable (a failing test, a measurable threshold, a visible output) before
   proceeding.
2. If the goal hides several outcomes, split it into sub-goals, each with its own success
   condition. Keep them independently checkable.
3. Write an ordered plan where each step names the action **and** the verify check that
   confirms it — the check is part of the step, not an afterthought. Prefer a check that can
   fail loudly (a test, an assertion, a diff, a command exit code) over "looks right".
4. For bug work, make the first step a reproduction that fails, so "fixed" has a concrete
   meaning: the same check now passes.
5. Execute one step, run its check, and read the actual result before moving on. If the check
   fails, correct and re-run that step rather than advancing on assumption.
6. Stop when every sub-goal's success condition is observably met. Report each goal against
   its evidence; if a check could not be run, say so and why instead of implying success.

## Outputs

A goal statement with an observable success condition, an ordered plan whose every step has a
paired verify check, and per-step evidence showing each check's result — enough that an
independent reader can confirm the goal was met without re-deriving it.

## Failure modes

- Restating the imperative as a goal without making "done" observable, so the loop has no
  stopping signal.
- Writing plan steps with no check, so progress is asserted rather than demonstrated.
- Treating a green build as proof of a behavior goal it never exercised.
- Declaring the goal met when only some sub-goals were verified.
- Advancing past a step whose check was never run, or was run and ignored.

## Verification checklist

- [ ] The goal has a single, observable success condition.
- [ ] Multi-outcome goals are split into independently checkable sub-goals.
- [ ] Every plan step names both an action and its verify check.
- [ ] Bug goals start from a failing reproduction that the fix flips to passing.
- [ ] Each step's check was actually run and its result read before advancing.
- [ ] Final status maps every sub-goal to evidence, with unrun checks called out.

## Related skills/commands

- `skills/core/adaptive-flow/SKILL.md` — choose how much process the goal deserves before
  writing the plan.
- `skills/core/task-state-tracking/SKILL.md` — track each goal/step state and pick the next
  eligible step.
- `skills/core/verification-before-completion/SKILL.md` — the evidence bar each success
  condition is checked against.
- `skills/core/test-driven-development/SKILL.md` — the failing-check-first pattern for
  behavior goals.
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — the think-first and
  surgical-change disciplines that pair with goal-driven verification.

## Constitution alignment

This skill operationalizes Principle 4 (verification is part of done): a goal is not complete
until its observable success condition is demonstrated, not asserted. It is original local
guidance, inspired at the idea level by Karpathy's public commentary on turning instructions
into verifiable goals (tracked via `multica-ai/andrej-karpathy-skills`, MIT declared in
metadata only). No upstream text is copied.

## Ghi chú tiếng Việt

Biến mệnh lệnh ("sửa bug", "làm nhanh hơn") thành mục tiêu kiểm chứng được: nêu điều kiện
thành công quan sát được, rồi viết kế hoạch theo bước mà mỗi bước kèm một check chứng minh
bước đó đạt. Với bug, bước đầu là tạo test tái hiện lỗi (đang fail) để "đã sửa" có nghĩa cụ
thể. Chạy từng bước, đọc kết quả check thật trước khi đi tiếp; chỉ "xong" khi mọi mục tiêu
con được chứng minh bằng bằng chứng. Nhờ vậy agent tự chạy và tự sửa mà không cần giải thích
lại mục tiêu. Nội dung gốc của Vibe Coding OS; lấy cảm hứng ý tưởng từ bình luận công khai
của Karpathy (qua `multica-ai/andrej-karpathy-skills`, MIT khai trong metadata, không có file
LICENSE), không sao chép văn bản upstream.
