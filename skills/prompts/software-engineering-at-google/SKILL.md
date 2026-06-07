# Software Engineering at Google

## Purpose

Distill the cultural and engineering practices from Software Engineering at Google (Winters, Manshreck, Wright) into actionable rules for AI-assisted coding: code review culture, a tiered testing discipline, documentation written for the reader, psychological safety, and sustainable development. The book's thesis — "software engineering is programming integrated over time" — reframes the goal from making code work once to making it survive change across many people and years. These practices counter the AI failure modes of writing unreviewable code, skipping the right test level, documenting WHAT instead of WHY, false confidence, and trading long-term health for short-term speed.

## When to use

Apply when generating code that others will review and maintain, when deciding what kind of tests to write, when documenting a system, and whenever speed pressure tempts a shortcut that mortgages the future. Reach for the matching practice: producing a change → write it review-ready; choosing tests → use the size taxonomy; explaining a system → document the WHY; uncertain → state it openly (psychological safety); accelerating delivery → invest in infrastructure first.

## Inputs

The change being made, the review process it will pass through, the existing test suite and its levels, the documentation that surrounds the code, and the team norms (CI, linting, automation) that keep development sustainable.

## Workflow

### 1. Code Review Culture — Write for the reviewer

*Every change is reviewed before it lands. The reviewer shares responsibility for its quality. Reviews check design, readability, functionality, and test coverage.*

**Concrete rules for AI:**

1. Assume all generated code will be reviewed by a human. Write it to be reviewable: small, focused changes; clear intent; self-explanatory naming.
2. Keep changes small. A large diff is hard to review well; split unrelated changes into separate ones.
3. Provide the context a reviewer needs: what the change does, why, and how it was verified. Make the reasoning visible, not buried.
4. Review for four things — design (does it fit the system), functionality (does it work), readability (can the next person understand it), and tests (is it covered). Hold your own output to the same bar.
5. Address the reviewer's intent, not just the literal comment. A comment about one instance often points to a pattern.
6. Treat review as a quality gate that you pre-satisfy, not an obstacle to route around.

### 2. Testing Culture — Right level, right size

*Write tests at the appropriate level, with far more small tests than large ones (the test pyramid). Classify tests by size, not just scope.*

**Concrete rules for AI:**

1. Follow the pyramid: many unit tests, fewer integration tests, fewest end-to-end tests. Push coverage down to the cheapest level that can catch the bug.
2. Use the size taxonomy: **small** (single process, no network/disk/sleep — fast and deterministic), **medium** (single machine, multiple processes, localhost network allowed), **large** (multiple machines, real end-to-end). Prefer small.
3. Prefer small, deterministic tests. Flaky tests erode trust in the whole suite; a test that sleeps or hits the network is a liability.
4. When generating tests, produce them at multiple levels — unit tests for logic, a thin integration test for wiring — rather than one bloated end-to-end test.
5. Test behavior through public interfaces, not implementation details, so tests survive refactoring.
6. Tests are first-class code. Keep them clear, unbranched, and free of logic that itself needs testing.

### 3. Documentation Culture — Write for the reader, explain the WHY

*Documentation serves the reader, not the writer. It must stay fresh with the code, and it earns its keep by explaining why, not restating what.*

**Concrete rules for AI:**

1. Write documentation as you write the code, not as an afterthought. Undocumented code is incomplete code.
2. Explain WHY over WHAT. The code shows what it does; docs and comments should capture intent, trade-offs, and the reasoning a reader cannot recover from the source.
3. Treat docs as owned, versioned artifacts that live with the code and change in the same commit. Stale documentation is worse than none.
4. Write for the reader's context, not the author's. Define terms, state assumptions, and lead with what the reader needs to accomplish.
5. Invest in clear docstrings and design docs for non-trivial components. A short design doc before building surfaces problems cheaply.
6. Do not document the obvious. A comment that restates the code is noise; a comment that explains a non-obvious decision is gold.

### 4. Psychological Safety — Admit uncertainty, review without ego

*Blameless culture: ask questions freely, surface mistakes without fear, and separate the work from the worth of the person.*

**Concrete rules for AI:**

1. State uncertainty plainly. "I'm not sure this handles the empty case — worth checking" is more valuable than false confidence.
2. Surface assumptions you made so a human can correct them, rather than presenting guesses as facts.
3. Treat correction and review as collaboration, not judgment. Welcome the catch; a bug found in review is a bug that didn't ship.
4. When something fails, focus on the cause and the fix (blameless postmortem), not on assigning fault.
5. Ask clarifying questions when the request is ambiguous instead of guessing and over-building.
6. Critique code, not the coder — and frame your own output the same way, inviting scrutiny.

### 5. Sustainable Development — Invest in infrastructure before accelerating

*Move fast without breaking things by building the infrastructure — CI, automated tests, linting, tooling — that makes fast change safe over time.*

**Concrete rules for AI:**

1. Before accelerating feature delivery, ensure the safety infrastructure exists: tests, CI, linting, reproducible builds. Speed without a safety net produces regressions.
2. Optimize for total cost over time, not the speed of the current change. A shortcut that saves an hour now and costs a day later is a loss.
3. Automate repeated manual steps. Anything done by hand more than a few times is a candidate for a script or CI check.
4. Keep the build green and changes reversible. A broken mainline blocks everyone; design changes so they can be rolled back.
5. "It works on my machine" is not done. Reproducibility through shared tooling is part of the deliverable.
6. When asked to go faster, propose the infrastructure investment that makes sustained speed possible, rather than cutting the corner that erodes it.

## Outputs

Code that is review-ready, covered by tests at the right levels (mostly small and deterministic), documented with its reasoning, delivered with honest statements of uncertainty, and supported by the CI/test/lint infrastructure that keeps future change safe. Work that holds up "integrated over time," not just at the moment it is written.

## Failure modes

- Writing large, unfocused changes that are technically correct but practically unreviewable.
- Inverting the test pyramid: leaning on slow end-to-end tests because they're easy to generate, while skipping cheap unit tests.
- Producing flaky tests (network, sleep, shared state) that erode trust in the entire suite.
- Documenting WHAT the code does (noise) instead of WHY it does it (signal); or writing docs once and letting them rot.
- Projecting false confidence — presenting guesses as verified facts — instead of surfacing uncertainty for review.
- Optimizing the current change's speed at the expense of long-term maintainability; cutting infrastructure corners under deadline pressure.
- Treating review, tests, and docs as optional overhead rather than as the definition of done.

## Verification checklist

- [ ] Is the change small and focused enough to be reviewed well, with its intent and verification made explicit?
- [ ] Are tests written at the right levels (pyramid), favoring small deterministic tests over large ones?
- [ ] Do tests exercise public behavior rather than implementation details, with no flakiness sources (network/sleep/shared state)?
- [ ] Does the documentation explain WHY, stay with the code, and avoid restating the obvious?
- [ ] Did I state my assumptions and uncertainties honestly rather than projecting false confidence?
- [ ] Does the safety infrastructure (tests, CI, lint) exist before I accelerated delivery, and is the build green/reversible?

## Related skills

- `skills/prompts/working-with-legacy-code/SKILL.md` — Characterization tests and seams (the test discipline that keeps code from rotting)
- `skills/prompts/pragmatic-programmer/SKILL.md` — Orthogonality and broken windows (sustainable development at the code level)
- `skills/prompts/readable-code/SKILL.md` — Readability heuristics (the review readability criterion in practice)
- `skills/prompts/clean-code-discipline/SKILL.md` — Naming, small functions, comment discipline (writing reviewable code)
- `skills/core/checkpoint-validation/SKILL.md` — Gated verification (the "definition of done" enforced as phases)

## Constitution alignment

This skill directly reinforces the project's verification rules and merge-readiness bar. "Every change is reviewed" maps to the project's requirement that a change is merge-ready only when the diff is reviewed and acceptance criteria are met; "report every check honestly as passed, failed, or not run" is the psychological-safety practice of admitting uncertainty applied to verification. The testing taxonomy supports the project's guidance to run targeted tests first and broader checks when feasible. Sustainable development matches the prime directive of building quickly while preserving clarity and correctness. All practices are language- and framework-agnostic and adapt to the project without overriding its constraints.

## Ghi chú tiếng Việt

Năm thực hành kỹ thuật của Google ("software engineering = lập trình tích hợp theo thời gian"): Code Review Culture (mọi thay đổi đều được review; viết code dễ review từ đầu, diff nhỏ, nêu rõ ý định và cách kiểm chứng), Testing Culture (kim tự tháp test: nhiều unit, ít e2e; phân loại theo kích thước small/medium/large, ưu tiên small và tất định), Documentation Culture (viết cho người đọc, giải thích TẠI SAO chứ không phải CÁI GÌ; cập nhật doc cùng code), Psychological Safety (thừa nhận điều chưa chắc, nêu giả định, coi review là hợp tác không phải phán xét, postmortem không đổ lỗi), Sustainable Development (đầu tư hạ tầng CI/test/lint trước khi tăng tốc; tối ưu chi phí dài hạn, giữ build xanh và có thể rollback). Khi AI sinh code: giả định sẽ bị review, viết test nhiều cấp, nói thật về độ chắc chắn.

*Tracked via Software Engineering at Google (Winters, Manshreck, Wright, O'Reilly) — ideas adapted, original wording.*
