# Architecture Decision Records

ADRs capture important technical decisions in Vibe Coding OS. Use them when a choice will matter after the current session: architecture structure, repository policy, dependency strategy, workflow rules, or reference-intake decisions.

Do not create fake ADRs for decisions that have not been made. Do not store secrets or private credentials in ADRs.

## How to create an ADR

1. Confirm the decision is durable enough for an ADR.
2. Copy `templates/adr-template.md` into `docs/adr/NNNN-short-title.md`.
3. Fill context, decision, options considered, consequences, verification, and related links.
4. Link important terms back to `CONTEXT.md` when needed.
5. If an ADR is superseded, update its status rather than deleting history.

## Template

Use `templates/adr-template.md`.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 0001 | Optional Runtime Layer | Accepted | 2026-06-19 |
| 0002 | Notification System | Accepted | 2026-06-19 |
| 0002 | Runtime Scope Freeze | Accepted | 2026-06-19 |
| 0003 | Defense in Depth (Security Architecture Pattern) | Accepted | 2026-06-20 |
| 0004 | Adaptive Trust Levels (Per-Source Risk Scoring) | Accepted | 2026-06-20 |

ADR 0003 introduces the 3-layer security pattern (Detect → Contain → Recover) that v2.14.0 implements across `security/defense/`, `security/redact/`, and `tests/security/`.

## Ghi chú tiếng Việt

ADR là nơi ghi quyết định quan trọng và lý do, không phải nhật ký mọi thay đổi. Dùng khi quyết định ảnh hưởng lâu dài đến kiến trúc, workflow hoặc policy. File liên quan: `CONTEXT.md`, `templates/adr-template.md`, các workflow domain/architecture. Khi upstream `mattpocock/skills` thay đổi cách dùng ADR, audit rồi cập nhật hướng dẫn này bằng ngôn ngữ riêng của Vibe Coding OS.
