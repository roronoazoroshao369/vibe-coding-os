# Skill: Hook-Based Memory

## Purpose

Describe optional hook moments for memory capture/retrieval without requiring a hook daemon or copying implementation scripts.

## When to use

Use when designing memory around lifecycle events: session start, before tool use, after validation, before compaction, handoff, or shutdown.

## Inputs

- Desired lifecycle event and trigger boundary.
- Candidate memory action: retrieve, filter, capture, summarize, evaluate, or hand off.
- Privacy constraints, failure behavior, and manual fallback.

## Workflow

1. Name the event in plain language and define when it fires.
2. Specify the memory action and owning skill.
3. Add privacy gate before any capture or external sharing.
4. Define failure behavior: skip, warn, degrade to manual note, or block.
5. Keep it prompt-portable: document the contract, not a daemon.
6. Provide a manual command/template fallback.

## Outputs

- Hook contract note.
- Manual fallback workflow.
- Privacy and failure-mode policy.

## Failure modes

- Promising automatic behavior this repo cannot enforce.
- Hiding memory capture from the user.
- Capturing secrets from env vars, logs, or tool output.
- Copying upstream hook scripts.

## Verification checklist

- [ ] Hook behavior is described as optional/design-level unless runtime exists.
- [ ] Manual fallback is available.
- [ ] Privacy gate precedes capture/share.
- [ ] Failure behavior is explicit.

## Ghi chú tiếng Việt

Chỉ mô tả hợp đồng hook và fallback thủ công. Đừng hứa tự động hóa runtime nếu repo chỉ là docs/prompts.
