# Working With Legacy Code

## Purpose

Distill the core discipline of Working Effectively with Legacy Code (Michael Feathers) into actionable rules for AI-assisted coding: characterization tests, finding seams, breaking dependencies, change-point analysis, and the legacy change rhythm. Legacy code is simply code without tests — code you cannot change with confidence. These techniques exist because the most dangerous AI failure mode in an existing codebase is editing untested code and silently altering behavior nobody captured. The cure is to freeze behavior, find a safe place to insert testability, and change in small, verified steps.

## When to use

Apply whenever you must modify existing code that lacks tests, or whose behavior you have not personally verified. Reach for the matching technique by symptom: about to edit unverified code → characterization tests; cannot test because of a hard dependency → find seams and break dependencies; unsure how far a change reaches → change-point analysis; tempted to just make the edit → follow the legacy change rhythm instead.

## Inputs

The existing (legacy) code, the change being requested, the test harness or lack of one, the dependencies that make the code hard to test, and the boundaries of the area you intend to touch.

## Workflow

### 1. Characterization Tests — Freeze current behavior before changing it

*A characterization test documents what the code actually does, not what it should do. It pins the current state so any change that alters behavior fails loudly.*

**Concrete rules for AI:**

1. Before editing existing code you have not verified, write tests that capture its current observable behavior — including quirks and apparent bugs.
2. Do not assert "correct" values from your assumptions. Run the code, observe the real output, and assert that. The test's job is to detect change, not to judge correctness.
3. Write characterization tests for the specific area you are about to change, not the whole system. Cover the inputs your change will touch.
4. When a characterization test reveals surprising behavior, surface it to the user rather than silently "fixing" it — that behavior may be load-bearing.
5. Keep the characterization suite after the change. It becomes the regression guard for the next edit.
6. If you genuinely cannot run the code to capture behavior, say so explicitly and treat every edit as higher-risk.

### 2. Find Seams — Locate where behavior can be altered without editing in place

*A seam is a place where you can change behavior without editing at that point. Every seam is an opening to insert a test double or alternate behavior.*

**Concrete rules for AI:**

1. Before modifying tangled code, identify its seams: object seams (override a method via subclass/injection), link seams (swap a dependency at build/link time), preprocessor seams (substitute at compile time), and parameter seams (pass a collaborator in).
2. Prefer object seams in modern OO/typed codebases — inject an interface or pass a collaborator so tests can substitute a fake.
3. Each seam has an enabling point — the place where you decide which behavior is active. Identify it before relying on the seam.
4. Use seams to get the code under test without rewriting it. The seam is the wedge; the test comes through it.
5. When no seam exists, your first job is to create one (see Break Dependencies) — not to test through real databases, networks, or clocks.

### 3. Break Dependencies — Separate code from what makes it untestable

*When legacy code is welded to its dependencies, add new behavior beside it rather than untangling everything at once.*

**Concrete rules for AI:**

1. **Sprout Method/Function** — when adding new logic to an untested method, write the new logic as a separate, tested method and call it from the old one. The new code is born tested.
2. **Sprout Class** — when the change needs new state or doesn't fit the existing class, put it in a new, fully tested class and reference it from the legacy code.
3. **Wrap Method** — to run behavior before/after existing logic without modifying it, rename the original and create a wrapper that calls it plus the new step.
4. **Wrap Class** — to add behavior across many call sites, wrap the legacy class in a decorator that adds the behavior and delegates the rest.
5. Choose sprout/wrap over a full untangle: it minimizes edits to untested code and isolates the part you can verify.
6. Break only the dependencies blocking the current change. Do not refactor the whole dependency graph.

### 4. Change-Point Analysis — Find all the places before changing any

*Identifying where a change must be made is a separate step from making it. Do the finding first, completely.*

**Concrete rules for AI:**

1. Before editing, locate every change point — all the places the change must touch. Use search, type information, and call-site analysis to find them all.
2. Treat "find all change points" and "make the changes" as two distinct phases. Finish finding before you start editing.
3. Map the impact: what calls into the change points, what they call, and what tests (if any) cover them. Identify test points — the places where effects become observable.
4. If change points are scattered widely, surface the scope to the user before proceeding — broad scope is a signal, not just a workload.
5. Do not start editing the first change point and discover the rest mid-stream. Partial edits across an untested surface are how silent breakage happens.

### 5. Legacy Change Rhythm — The fixed sequence, never skip ahead

*Legacy change follows a strict order. The danger is jumping straight to "make the change."*

**Concrete rules for AI:**

1. Follow the rhythm in order: (a) identify the change point, (b) find the test points, (c) break dependencies, (d) write characterization tests, (e) make the change, (f) refactor the extracted code.
2. Never skip to step (e). Editing before steps (a)–(d) is the defining mistake of unsafe legacy work.
3. Each step is small and verified. Run tests after breaking dependencies and after writing characterization tests, before making the real change.
4. Step (f) — refactoring — happens only after the change is in and tests are green. Refactor under the protection of the tests you just wrote.
5. If a step is impossible (e.g., cannot break a dependency safely), stop and escalate rather than skipping it.
6. The rhythm is the same regardless of change size. A one-line edit to untested code still earns a characterization test.

## Outputs

A change made safely to previously untested code: behavior frozen by characterization tests, dependencies broken via sprout/wrap, every change point identified up front, and the edit applied through the legacy change rhythm. The codebase leaves the interaction with more test coverage than it started with.

## Failure modes

- Writing "correctness" tests instead of characterization tests — asserting what you think the code should do rather than what it does, and missing the behavior change you introduced.
- Skipping to step (e) of the rhythm: making the edit before freezing behavior, the single most common cause of silent regressions.
- Over-untangling: refactoring the whole dependency graph when a sprout method would have isolated the change safely.
- Finding some change points but not all, then editing piecemeal across an untested surface.
- Testing through real dependencies (DB, network, clock, filesystem) instead of creating a seam, producing slow, flaky, non-deterministic tests.
- "Fixing" surprising legacy behavior discovered during characterization without confirming it isn't relied upon elsewhere.
- Treating the absence of a runnable harness as permission to edit freely — it is the opposite, a signal to slow down.

## Verification checklist

- [ ] Did I write characterization tests capturing the real current behavior of the area before changing it?
- [ ] Did I identify the seams and break only the dependencies blocking this change (via sprout/wrap, not a full untangle)?
- [ ] Did I find all change points before editing any of them?
- [ ] Did I follow the legacy change rhythm (a→f) without skipping to "make the change"?
- [ ] Do the characterization tests still pass (where behavior should be unchanged) and fail meaningfully (where it intentionally changed)?
- [ ] Did I surface surprising behavior and broad scope to the user instead of acting silently?
- [ ] Is the codebase better tested after the change than before?

## Related skills

- `skills/prompts/pragmatic-programmer/SKILL.md` — Broken windows and orthogonality (complements safe, contained legacy change)
- `skills/prompts/software-engineering-at-google/SKILL.md` — Testing culture and review (the test-level discipline that keeps code from becoming legacy)
- `skills/prompts/anti-overengineering/SKILL.md` — Smallest viable change (counterweight to over-untangling dependencies)
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — Surgical changes, think before editing (reinforces change-point analysis)
- `skills/core/checkpoint-validation/SKILL.md` — Gated phases (mirrors the never-skip-ahead legacy change rhythm)

## Constitution alignment

This skill serves the project's prime directive of preserving correctness and verification while moving quickly. Characterization tests and the legacy change rhythm directly enforce the project's verification rules — "never claim tests passed when they were not run" becomes "freeze behavior with real, executed tests before editing." The brownfield guidance in CLAUDE.md (add characterization tests before changing behavior in existing systems) is exactly this skill's core. The techniques are language- and framework-agnostic, so they adapt to any project without overriding its constraints.

## Ghi chú tiếng Việt

Năm kỹ thuật xử lý code cũ (legacy = code chưa có test): Characterization Tests (viết test ghi lại hành vi hiện tại trước khi sửa — test để phát hiện thay đổi, không phán xét đúng/sai), Find Seams (tìm "đường nối" để chèn test mà không sửa tại chỗ — object/link/preprocessor/parameter seam), Break Dependencies (tách phụ thuộc bằng sprout method/class, wrap method/class thay vì gỡ rối toàn bộ), Change-Point Analysis (tìm hết mọi điểm cần sửa trước khi sửa bất kỳ điểm nào — tìm và sửa là hai bước riêng), Legacy Change Rhythm (theo đúng thứ tự a→f: xác định điểm sửa → tìm điểm test → tách phụ thuộc → viết test → sửa → refactor; tuyệt đối không nhảy thẳng tới bước sửa). Khi AI sửa code chưa kiểm chứng: luôn characterize vùng sẽ sửa trước.

*Tracked via Working Effectively with Legacy Code (Michael Feathers, Prentice Hall) — ideas adapted, original wording.*
