# Skill: Hook-Based Memory

## Purpose

Describe optional hook moments for memory capture/retrieval without requiring a hook daemon or copying implementation scripts.

The general hook architecture in `docs/workflows/hook-patterns.md` defines a portable taxonomy of four hook categories (command, session, workflow, verification) with lifecycle timing, contract format, and manual fallback patterns. This skill narrows that general architecture to memory-specific hook moments: session start/end for context retrieval and compression, post-command/post-tool for observation capture, phase-exit for summary compression, and verification hooks for privacy-filtered context injection. When designing a new memory hook, first consult the general taxonomy to classify it, then specialize the contract format to memory-specific fields (observation IDs, privacy constraints, retention policy).

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
