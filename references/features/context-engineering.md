# Feature: Context engineering

## Goal

Define how Vibe Coding OS supports context engineering as an original local capability: the
deliberate assembly of enough verified context — spec, repo patterns, curated examples,
decision-settling docs, and executable validation — that an implementation succeeds in one
pass with all gates green, instead of guessing and iterating blindly.

## Reference sources

- coleam00/context-engineering-intro (primary)
- github/spec-kit (composes with the spec → plan → tasks → implement flow)

## Local implementation

- `templates/implementation-brief-template.md`
- `commands/vibe-brief.md`, `commands/vibe-brief-execute.md`
- `skills/core/context-rich-implementation/SKILL.md`
- `docs/workflows/context-engineering.md`

## Applied upstream ideas

- A context-rich brief: spec + research + curated examples + doc links + validation + score.
- Research before writing to discover existing repo patterns.
- An examples library with both positive (mimic) and negative (avoid) entries.
- Per-project rules every brief inherits rather than restates.
- Executable validation gates with an iterate-until-green loop.
- A 1-10 confidence self-score that gates handoff to execution.

## Not applied upstream ideas

- A PRP-runner or any command-runner tooling.
- Upstream prompt, template, or example text (no vendoring).
- A required directory layout or CLI dependency.

## Must-have behavior

- A brief gathers task-relevant context only and traces required changes to acceptance criteria.
- Examples are named with file paths and labeled positive or negative.
- Validation gates are executable, ordered, and have observable pass conditions.
- Execution iterates until every gate is green, fixing root causes rather than checks.
- Confidence is self-scored 1-10; below 7 blocks handoff until context is gathered.

## Failure modes

- Copying upstream wording instead of adapting the idea.
- Listing documentation that does not change any decision (context bloat).
- Naming only positive examples, so known-bad patterns recur.
- Vague gates with no command or pass condition.
- Weakening a failing check instead of fixing the implementation.
- Inflating the confidence score to skip gathering missing context.
- Letting the brief grow into a runtime or CLI.

## Update signals

- Upstream changes the blueprint structure, research guidance, examples/rules conventions,
  validation model, or confidence rubric.
- Local users repeatedly hit rework because briefs lacked patterns, examples, or gates.
- A local skill, command, or template changes enough that mappings need refreshing.

## Evaluation ideas

- Can an executor finish a briefed task in one pass with all gates green?
- Does the brief reduce mid-implementation questions without adding ceremony?
- Are research findings, examples, gates, and the confidence score all present and concrete?

## Ghi chú tiếng Việt

Context engineering: gom đủ ngữ cảnh đã kiểm chứng (spec, pattern repo, ví dụ tuyển chọn, tài
liệu cần thiết, cổng kiểm thử chạy được) để code một lần là xanh. Trụ cột: brief giàu ngữ
cảnh, thư viện ví dụ (nên bắt chước/cần tránh), project rules (chỉ tham chiếu). Lặp đến khi
mọi cổng xanh, tự chấm tự tin 1-10 (dưới 7 thì bổ sung). Học từ
`coleam00/context-engineering-intro`, không copy text/PRP-runner; tất cả là markdown.
