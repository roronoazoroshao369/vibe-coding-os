# Implementation Brief: <title>

> Vietnamese usage note / Ghi chú sử dụng: Đây là bản tóm tắt thực thi gom đủ ngữ cảnh
> cho một task (hoặc cụm task) trước khi code, để người/agent thực thi không phải đoán.
> Học ý tưởng "context-rich brief" (spec + ví dụ tuyển chọn + link tài liệu + cổng kiểm
> thử chạy được + tự chấm độ tự tin) làm nguồn cảm hứng, viết lại bằng ngôn ngữ riêng;
> không copy template hay prompt upstream.

## Source

- Spec: `<path or link>` (acceptance criteria covered: <AC ids>)
- Plan: `<path or link>` (step(s): <step ids>)
- Tasks: `<path or link>` (task ids: <T ids>)

## Objective

One or two sentences: the observable change this brief delivers and why it matters.

## Scope

- In scope: <smallest set of behavior/files this brief covers>
- Out of scope: <explicitly excluded work so the executor does not drift>

## Research findings

Capture what was actually discovered before coding, so the executor inherits the research
instead of repeating it. Be concrete: name files, symbols, and decisions.

- Codebase patterns found: <pattern> — observed in `<path>`; follow this for naming, error
  handling, imports, and test layout.
- Conventions to honor: <e.g., how this repo registers a new module, where config lives,
  how results are validated>.
- Documentation gathered: `<doc title or URL>` — <the one thing it settles> (note the exact
  section; prefer a stable link or local doc path).
- Prior decisions / constraints: `<ADR / spec / constitution path>` — <constraint that
  bounds this work>.
- Known gotchas: <edge case, race, version pin, platform quirk discovered during research>.

## Relevant context

- Files to read first: `<path>` — <why it matters>
- Patterns to follow: <naming, error handling, imports, test style observed in the repo>
- Constraints: <constitution rules, perf/security limits, compatibility needs>

## Examples to mimic

Point at the closest prior art so the executor matches the house style. Separate what to
copy from what to avoid — negative examples prevent repeating known mistakes.

| Type | File / location | What to imitate or avoid |
| --- | --- | --- |
| Positive | `<path>` | Mimic this structure/approach because <reason>. |
| Positive | `<path>` | Reuse this helper/pattern instead of writing a new one. |
| Negative | `<path>` | Do NOT copy this pattern — <why it is wrong or deprecated here>. |

If a needed example does not exist yet, say so explicitly and note what the executor should
establish as the new pattern.

## Required changes

| Area | File(s) | Change | Acceptance criteria covered |
| --- | --- | --- | --- |
| <component> | `<path>` | <what changes and why> | AC<id> |

## Validation gates

List the executable checks that MUST pass before this brief is considered done. Each gate is
a real command with an observable pass condition, ordered cheap-to-expensive. Run them, read
the output, fix the root cause, and re-run until every gate is green. Do not edit a check to
make it pass.

| Order | Gate (command) | Pass condition |
| --- | --- | --- |
| 1 | `<lint/format command>` | No errors. |
| 2 | `<type/build command>` | Builds clean. |
| 3 | `<targeted test command>` | Listed tests pass. |
| 4 | `<broader check, e.g. npm run validate>` | Passes when structure/registries changed. |

Iterate-until-green: if a gate fails, diagnose the cause in the implementation (not the
test), fix it, and re-run the full ordered list. Stop only when all gates pass or a gate
exposes an ambiguity that must go back to the spec/plan.

## Tests to add or update

- `<path>` — <what behavior it asserts and which AC it covers>.

## Risks and rollback

- Risk: <what could break> → Mitigation: <how to contain it>
- Rollback: <how to undo if verification fails>

## Open questions

- <Anything that, if answered differently, changes the work. Resolve before coding when material.>

## Confidence score

Rate 1-10 how confident you are that this brief contains enough context for a one-pass,
validation-green implementation without further questions.

- Score: <1-10>
- Rationale: <what is solid vs thin; which sections carry the risk>.
- If below 7: list exactly what to add (missing example, undocumented dependency, unread
  file, unresolved open question) before handing the brief to an executor.

## Ghi chú tiếng Việt

Brief phải đủ để thực thi mà không cần hỏi lại: nguồn (spec/plan/tasks), mục tiêu quan sát
được, scope rõ ràng, kết quả nghiên cứu (pattern, tài liệu, ràng buộc đã tìm được), ví dụ
nên bắt chước và ví dụ cần tránh, thay đổi cần làm truy vết về acceptance criteria, cổng
kiểm thử chạy được (lặp đến khi xanh), rủi ro/rollback, câu hỏi mở, và điểm tự tin 1-10.
Nếu điểm dưới 7, bổ sung ngữ cảnh còn thiếu trước khi giao cho executor. Liên kết:
`commands/vibe-brief.md`, `commands/vibe-brief-execute.md`, `templates/tasks-template.md`,
`templates/plan-template.md`, `docs/workflows/context-engineering.md`.
