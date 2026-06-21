# Feature: Agent Alignment

## Goal

Ensure agents align on intent, constraints, domain terms, decisions, and setup before doing substantial work.

## Reference sources

`mattpocock/skills` concepts: per-repo setup, grill-me, grill-with-docs, write-a-skill. Local sources: `references/sources/mattpocock-skills.md`.

## Local implementation

Implemented through `skills/core/grill-user-before-building/SKILL.md` (Phase 2 docs-aware subsumes the former `grill-with-docs`), `skills/meta/using-vibe-coding-os/SKILL.md`, `skills/meta/write-reusable-skill/SKILL.md`, and commands `vibe-setup-skills`, `vibe-grill-me`, `vibe-grill-with-docs`, `vibe-write-skill`.

## Must-have behavior

Ask targeted questions; preserve local conventions; update context/ADR candidates only when durable; stop before implementation when alignment is incomplete.

## Failure modes

Generic interrogation, invented assumptions, duplicate skills, or overwriting local project philosophy.

## Update signals

Upstream adds setup flow, grill behavior, or skill-writing structure.

## Evaluation ideas

Run a simulated ambiguous request and verify the output contains non-goals, assumptions, and next artifact.

## Ghi chú tiếng Việt

Repo upstream đáng học vì nhấn mạnh hỏi rõ trước khi làm và setup theo từng repo. Vibe Coding OS dùng các skill alignment, context và viết skill. File ảnh hưởng: skills/meta, skills/core/grill*, commands tương ứng. Khi upstream update, audit skill setup/grill rồi cập nhật mapping/changelog.
