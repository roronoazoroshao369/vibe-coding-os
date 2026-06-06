# Feature: Shared Domain Language

## Goal

Keep a compact project vocabulary so code, docs, and agents speak consistently.

## Reference sources

Upstream project context idea and domain-language guidance; local `CONTEXT.md` and project context template.

## Local implementation

Implemented by `skills/core/shared-domain-language/SKILL.md`, `CONTEXT.md`, `templates/project-context-template.md`, and `docs/workflows/domain-language-and-adrs.md`.

## Must-have behavior

Define terms, avoid ambiguous aliases, link affected files, and keep secrets out.

## Failure modes

Glossary sprawl, renaming without code follow-through, or storing private data.

## Update signals

Upstream changes context format or domain documentation practice.

## Evaluation ideas

Review a feature request and check whether new terms are added or existing terms reused.

## Ghi chú tiếng Việt

Điểm đáng học là dùng language chung để agent không hiểu sai. Vibe Coding OS dùng `CONTEXT.md` và template context. Khi upstream đổi CONTEXT, cập nhật source doc, mappings, và skill shared-domain-language.
