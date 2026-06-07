# Feature: Project constitution

## Goal

Provide a durable, short set of governing principles that constrain every later phase of
work, so decisions stay consistent across sessions and agents.

## Reference sources

- github/spec-kit

## Local implementation

- `CONSTITUTION.md`
- `skills/core/project-constitution/SKILL.md`
- `commands/vibe-constitution.md`
- `templates/constitution-template.md`
- `docs/workflows/constitution-to-spec-to-plan.md`

## Applied upstream ideas

- An explicit principles artifact that governs spec, plan, tasks, and implementation.
- Principles as the highest-priority constraint when phases conflict.

## Not applied upstream ideas

- Upstream constitution file format or command names.
- Any CLI that generates or enforces the constitution.

## Must-have behavior

- Principles are short, testable, and each names how it is enforced.
- Non-goals are explicit so the constitution does not become process bloat.
- A stated priority order resolves conflicts between principles.

## Failure modes

- Principles are slogans that cannot be verified.
- The constitution grows into a heavyweight document.
- It is written once and never consulted.

## Update signals

- Upstream changes its constitution/principles model.
- Recurring disagreements reveal a missing principle.
- A principle becomes unenforceable after tooling changes.

## Evaluation ideas

- Can a new contributor act on the constitution without further explanation?
- Does each principle have a visible enforcement mechanism?
- Are conflicts resolvable via the stated priority order?

## Ghi chú tiếng Việt

Hiến chương dự án: bộ nguyên tắc ngắn, kiểm chứng được, chi phối mọi pha. Mỗi nguyên tắc
nêu cách thực thi; có non-goals và thứ tự ưu tiên khi xung đột. Học ý tưởng từ `spec-kit`,
viết lại bằng ngôn ngữ local, không copy định dạng/CLI.
