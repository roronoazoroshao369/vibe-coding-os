# Vibe Coding OS Project Context

This file is the shared-language document for Vibe Coding OS itself. It should stay concise, durable, and useful to humans and agents. Do not store secrets, private credentials, or unnecessary personal data here.

## Glossary

- **Vibe Coding OS**: A markdown-first operating system of skills, commands, templates, registries, optional local runtime state, and reference intelligence for disciplined AI-assisted software work.
- **Skill**: A reusable `SKILL.md` operating procedure with purpose, triggers, workflow, outputs, failure modes, and verification.
- **Command prompt**: A reusable prompt in `commands/` that invokes a workflow phase.
- **Reference Intelligence Layer**: The `references/` system that tracks upstream inspiration, feature mappings, changelogs, and update impact without vendoring upstream content.
- **Shared domain language**: The durable vocabulary in this file and related docs that keeps humans and agents aligned.
- **ADR**: Architecture Decision Record; a small document for important decisions and tradeoffs.

## Domain concepts

- Skills define reusable behavior; commands trigger behavior; templates capture artifacts; registries make files discoverable.
- References are inspiration sources, not vendored dependencies. Any adaptation must be original, attributed, and mapped to local files.
- Validation scripts protect repository structure and JSON registries.
- Optional runtime commands write inspectable JSON under `.omc/runtime/` for local task, memory, checkpoint, team, and session state; markdown remains the portable baseline.

## Local naming conventions

- Skill directories use kebab-case and contain `SKILL.md`.
- Commands use `commands/vibe-*.md`.
- Reference IDs use owner/name style normalized to kebab-case, for example `mattpocock-skills`.
- Feature docs use `references/features/*.md`; mappings live in `references/mappings/*.md`.

## Project philosophy

- Human intent stays sovereign.
- Small correct changes beat broad rewrites.
- Verification is part of done.
- Memory should be useful, current, and safe.
- Attribution and legal safety are first-class.

## Important non-goals

- Vibe Coding OS is not an agent runtime, wrapper, or product backend.
- It does not blindly copy upstream repositories.
- It does not store secrets or private credentials in memory/docs.
- It should not replace local project philosophy with a reference repo philosophy.

## Links to ADRs

- ADR index: `docs/adr/README.md`
- ADR template: `templates/adr-template.md`

## Ghi chú tiếng Việt

File này là “ngôn ngữ chung” cho Vibe Coding OS. Maintainer Việt Nam nên cập nhật khi có thuật ngữ, convention, hoặc quyết định dài hạn mới. Các ý tưởng học từ `mattpocock/skills` được dùng để làm rõ context, ADR, PRD, issue slicing, TDD/debug và handoff; không dùng để chép nội dung upstream. Khi upstream thay đổi, kiểm tra `references/sources/mattpocock-skills.md`, changelog và mappings trước khi sửa skill/command/template.
