# Skill: Instinct Extraction

## Purpose

Distill reusable engineering instincts from a session: small trigger-action rules with confidence scores, evidence, and scope limits.

## When to use

Use after a session reveals a durable pattern such as a recurring failure mode, a decision shortcut that worked, a verification habit, or a project-specific convention that should influence future work.

Use this as a design/workflow step only. Enforcing instincts automatically would require a runtime or memory system outside this docs framework.

## Inputs

Conversation summary, repo context, decisions, mistakes avoided, failed attempts, successful fixes, verification output, and any existing related skills or memory notes.

## Workflow

1. Collect candidate instincts from the session:
   - repeated triggers;
   - actions that reliably improved outcomes;
   - pitfalls that changed the workflow;
   - checks that caught real issues.
2. Convert each candidate into a compact trigger-action rule:
   - Trigger: when to notice this situation.
   - Action: what to do next.
   - Scope: where it applies and where it does not.
3. Score confidence:
   - `high`: observed more than once or backed by strong verification.
   - `medium`: observed once with clear evidence and low downside.
   - `low`: plausible but unverified; store as a suggestion, not a rule.
4. Attach evidence: files, commands, outcomes, or decision notes that justify the score.
5. Decide placement: skill update, project-memory note, session handoff, or discard if too vague.
6. Re-check privacy and noise: remove secrets, personal data, raw transcripts, and temporary paths unless the path itself is essential.

## Output format

Use concise records:

```text
Instinct: <short name>
Trigger: <situation>
Action: <next move>
Scope: <where it applies / does not apply>
Confidence: high | medium | low
Evidence: <file/command/outcome summary>
Placement: skill update | memory note | handoff | discard
```

## Outputs

A list of confidence-scored instincts, placement recommendations, and any skill or memory updates that should be made later.

## Failure modes

Treating one lucky fix as a universal rule; storing sensitive context; writing vague advice with no trigger; marking low-evidence ideas as high confidence; implying automatic enforcement when only a manual workflow exists.

## Verification checklist

Each instinct has a trigger, action, scope, confidence, and evidence; low-confidence items are labeled as suggestions; private/noisy details are removed; any enforcement claim is explicitly avoided.

## Ghi chú tiếng Việt

Kỹ năng này rút “instinct” tái sử dụng từ phiên làm việc: tình huống kích hoạt → hành động → phạm vi → confidence → bằng chứng. Đây chỉ là workflow thiết kế/thủ công; muốn tự động áp dụng cần runtime hoặc hệ thống memory riêng. Không lưu secret, raw transcript, hoặc dữ liệu nhạy cảm.

## Nguồn cảm hứng / Inspiration

Pattern adapted as original wording from `affaan-m/ECC` (MIT, Affaan Mustafa) continuous-learning and instinct workflows. Inspiration only — no upstream runtime, scripts, or text copied.
