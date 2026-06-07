# Vibe Coding OS Constitution

> This is a template constitution for a project that adopts Vibe Coding OS. Copy it into
> your own repository and adapt the principles. Keep it short, testable, and current.
> Học ý tưởng hiến chương từ `github/spec-kit`; nội dung dưới đây là bản gốc của Vibe
> Coding OS, không copy template upstream.

## Purpose

These principles govern how work is specified, planned, decomposed, implemented, and
verified in this project. They are the highest-priority constraint: when a spec, plan, or
implementation conflicts with a principle, the principle wins unless explicitly overridden
with a recorded trade-off.

## Principles

1. **Human intent stays sovereign.** The assistant proposes; it does not invent
   requirements or silently expand scope.
   - Rationale: scope creep and hallucinated requirements waste effort and erode trust.
   - Enforced by: spec review, `skills/core/what-before-how/SKILL.md`, checkpoint gates.

2. **Quality is non-negotiable.** Changes are correct, readable, and consistent with
   existing conventions.
   - Rationale: small quality regressions compound across sessions.
   - Enforced by: review skills, `npm run validate`, acceptance criteria.

3. **Simplicity beats cleverness.** Prefer the smallest change that satisfies the spec;
   avoid speculative abstraction.
   - Rationale: simple code is easier to verify and maintain.
   - Enforced by: `skills/prompts/anti-overengineering/SKILL.md`, code review.

4. **Verification is part of done.** No change is complete without tests, validation, or a
   clearly stated limitation.
   - Rationale: "it should work" is not evidence.
   - Enforced by: `skills/core/verification-before-completion/SKILL.md`, checkpoint gates.

5. **Maintainability over speed-at-any-cost.** Optimize for the next reader, including
   future agents.
   - Rationale: most cost is in maintenance, not first authorship.
   - Enforced by: ADRs, shared domain language, review.

6. **Attribution is a first-class artifact.** Ideas may be inspired by public work, but
   imported content is tracked before use; no blind copying or vendoring.
   - Rationale: legal and ethical hygiene.
   - Enforced by: `references/`, `ATTRIBUTIONS.md`, `NOTICE.md`, `npm run validate:references`.

7. **Privacy by default.** No secrets, credentials, tokens, private keys, or unnecessary
   personal data in memory, examples, or logs.
   - Rationale: leaked secrets are hard to revoke and costly.
   - Enforced by: privacy/memory skills, review.

8. **Bilingual documentation where useful.** Major docs include a concise Vietnamese note
   so Vietnamese maintainers are first-class users.
   - Rationale: the project's primary maintainers work bilingually.
   - Enforced by: doc review, `## Ghi chú tiếng Việt` sections.

## Conflict priority

When principles conflict, resolve in this order:

1. Human intent sovereignty
2. Privacy by default
3. Attribution hygiene
4. Quality and verification
5. Simplicity
6. Maintainability
7. Bilingual documentation

## Non-goals

- This constitution is not a heavyweight process manual.
- It does not mandate any specific CLI, framework, or vendor.
- It does not replace per-task specs, plans, or reviews.
- Optional runtime helpers may materialize local JSON state, but they do not replace the markdown-first baseline or require a daemon, hosted service, or database.

## Acceptance criteria (for this constitution)

- [ ] Each principle is short and testable.
- [ ] Each principle names how it is enforced.
- [ ] Non-goals and conflict priority are explicit.

## Verification gates

- [ ] `npm run validate` passes.
- [ ] Spec, plan, and checkpoint skills reference these principles.

## Ghi chú tiếng Việt

Đây là hiến chương mẫu cho dự án dùng Vibe Coding OS: các nguyên tắc ngắn, kiểm chứng
được, là ràng buộc ưu tiên cao nhất. Khi spec/plan/implementation mâu thuẫn với một nguyên
tắc, nguyên tắc thắng trừ khi có trade-off được ghi rõ. Học ý tưởng hiến chương từ
`github/spec-kit`, nội dung là bản gốc local, không copy template/CLI upstream. Liên kết:
`skills/core/project-constitution/SKILL.md`, `templates/constitution-template.md`.
