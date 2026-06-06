# Feature: Architecture Decision Records

## Goal

Capture durable technical choices and their consequences.

## Reference sources

Upstream ADR usage around grill-with-docs and architecture work; local ADR template.

## Local implementation

Implemented by `skills/core/architecture-decision-records/SKILL.md`, `docs/adr/README.md`, `templates/adr-template.md`, and workflow `domain-language-and-adrs`.

## Must-have behavior

Create ADRs only for real decisions; include options, rationale, consequences, status, and links.

## Failure modes

Fake ADRs, too many trivial ADRs, missing rejected options.

## Update signals

Upstream changes ADR format or decision triggers.

## Evaluation ideas

Take an architecture change and verify an ADR candidate is produced only when needed.

## Ghi chú tiếng Việt

ADR giúp giữ quyết định lâu dài. Vibe Coding OS dùng ADR template riêng. Upstream update thì kiểm tra trigger/format, không chép nội dung.
