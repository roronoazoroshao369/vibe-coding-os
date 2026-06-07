# Skill: Progressive Memory Disclosure

## Purpose

Load memory in layers so the active context receives only what is relevant and safe.

## When to use

Use at session start or before a complex task when memory may help but loading everything would waste context or increase privacy risk.

## Inputs

- Task question and scope.
- Available memory indexes, summaries, observations, and detailed artifacts.
- Context budget and privacy constraints.

## Workflow

1. Start with the smallest useful layer: project rules, active handoff, or index summary.
2. Search summaries before detailed entries.
3. Load detailed observations only for direct hits.
4. Apply privacy filter before injection.
5. Inject a compact bundle: fact, citation, confidence, staleness, and why it matters now.
6. Stop when additional memory would not change the task.

## Outputs

- Minimal context injection bundle.
- Deferred entries and reason they were not loaded.
- Missing-context note if search was insufficient.

## Failure modes

- Loading entire memory stores at session start.
- Omitting citations to save tokens.
- Ignoring context budget.
- Assuming absent memory means no prior decision exists.

## Verification checklist

- [ ] Memory was loaded in layers.
- [ ] Injected entries directly affect the task.
- [ ] Bundle includes citations, confidence, and stale labels.
- [ ] Context budget and privacy constraints were respected.

## Ghi chú tiếng Việt

Nạp bộ nhớ theo lớp: chỉ mục/tóm tắt trước, chi tiết sau. Chỉ đưa vào ngữ cảnh phần liên quan trực tiếp, có trích dẫn và nhãn độ tin cậy.
