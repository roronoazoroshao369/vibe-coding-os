# Skill: Vertical Slicing

## Purpose

Build features as **complete vertical slices** through every layer of the stack (DB → API → UI → tests) rather than horizontal layer-by-layer development. Each slice is a thin end-to-end increment that demonstrates the full path, runs against real (or realistic) data, and can be independently verified, demoed, and rolled back. Counter the anti-pattern "build all the models, then all the API, then all the UI" by enforcing the 5-step increment cycle: Implement → Test → Verify → Commit → Next.

## When to use

Use when planning any non-trivial feature with more than one architectural layer, when the team is tempted to build layer-by-layer (schema → API → UI in separate PRs), when feedback cycles are slow because the slice isn't demoable until the end, or when the user asks for "vertical slices" or "end-to-end increments" explicitly. Triggers include:

- Feature touches DB + API + UI (or any 2+ layers)
- Team planning 3+ layer-separated PRs
- "Build the backend first, then we'll do the UI"
- User explicitly asks for vertical slices
- Feedback cycle > 1 day because nothing is demoable

## Inputs

- Feature spec or user story
- Architectural layers list (DB, API, UI, async, etc.)
- Acceptance criteria
- Test strategy (unit, integration, e2e)
- Demo environment (or local + staging)

## Workflow

1. **Identify the vertical paths.** Map all the user-facing or system-facing paths through the stack that the feature requires. A path is a complete flow: data source → service → API → UI (or any subset). Examples:
   - User signs up → DB row created → API returns user → UI shows welcome
   - User submits form → validation → DB write → confirmation email → success UI
   - Background job processes data → result written → API exposes status → UI shows progress
2. **Slice the feature into end-to-end increments.** Each slice is a complete path through every layer it touches. Do NOT slice by layer (DB-only slice, API-only slice). Do NOT slice by file. Slice by **user-visible or system-visible outcome**.
3. **Apply the 5-step increment cycle per slice.** For each slice:
   - **Implement** — write the minimum code at each layer to make the slice work. Stub layers you don't need yet.
   - **Test** — write the test that proves the slice works end-to-end. Prefer integration/e2e over unit for the slice test.
   - **Verify** — run the slice manually (or via e2e test) against realistic data. Confirm the user-visible outcome.
   - **Commit** — commit the slice as a single atomic unit. Do not commit mid-slice.
   - **Next** — only after the slice is verified and committed, move to the next slice.
4. **Sequence slices by value, not by layer.** Order slices so the highest-value path ships first. A working "read" slice is more valuable than a partially-built "write" slice.
5. **Stub the unknown.** For layers outside the current slice (e.g. a future email service), use a stub that returns a fixed value. Replace the stub in a later slice.
6. **Plan for rollback.** Each slice must be independently rollback-able. If slice 3 breaks production, slices 1-2 stay live.
7. **Demo each slice.** After each slice, the user can see and interact with the new capability. If they can't demo it, the slice is incomplete.

## Outputs

- Series of committed, independently-verifiable slices
- Each slice: implementation + test + manual verification + commit
- Updated `templates/slice-spec-template.md` for each slice
- A demoable state after every slice

## Failure modes

- Slicing by layer (DB-only, API-only) — produces un-demoable code
- Slicing by file (per-component PRs) — produces hard-to-review changes
- Skipping the Test step (assuming the implementation works)
- Skipping the Verify step (assuming the test passes)
- Mid-slice commits (splits the slice across commits)
- Stubbing too much (stubs become permanent debt)
- Slices that can't be independently rolled back
- "We'll do the UI later" — vertical slice doctrine violation

## Common rationalizations to reject

| Rationalization | Why it's wrong | Counter |
| --- | --- | --- |
| "Backend first, UI later" | UI later = no feedback on the UX = wasted backend work. | Build UI for slice 1; iterate. |
| "Schema changes are risky, do them in one PR" | One giant schema PR is riskier than small migrations. | Slice migrations: add column, backfill, use, in 3 slices. |
| "Tests slow us down" | Tests catch the bugs that slow teams down MORE. | Slice test = integration/e2e of the slice path. |
| "We can stub the email service forever" | Stubs become permanent debt; reality diverges. | Track stubs; replace before feature "done". |
| "The slice is too small to commit" | Tiny atomic commits are the whole point. | Commit per slice, even if small. |
| "We need to finish the whole feature to demo" | Demoing slices gets feedback 5x faster. | Demo after every slice. |
| "Atomic = big commit" | Atomic = smallest independently-meaningful commit. | Slice by outcome, not by layer. |
| "PRs need to be reviewed, small slices = more review burden" | Small slices = faster review = less burden overall. | Slice by outcome, keep each reviewable. |

## Red flags (must produce remediation)

- Slice touches only one architectural layer (not a vertical slice)
- Slice has no end-to-end test
- Slice can't be demoed to a user
- Slice is mid-flight in the working tree (not committed)
- Stub is still in place 2+ slices after the real implementation should have landed
- "We'll do the UI in a follow-up PR" (slice doctrine violation)

## Verification checklist

- [ ] Slicing by outcome (not by layer or file)
- [ ] Each slice is end-to-end (DB → API → UI if applicable)
- [ ] Each slice has a Test step
- [ ] Each slice has a manual Verify step
- [ ] Each slice is committed atomically
- [ ] Each slice can be independently rolled back
- [ ] Each slice is demoable
- [ ] Stubs are tracked for replacement
- [ ] Slices sequenced by value (highest first)

## Source alignment

Inspired by `addyosmani/agent-skills` `incremental-implementation` category (MIT, verified 2026-06-20). Adapted into Vibe Coding OS with original wording, vertical-slice doctrine, 5-step increment cycle (Implement→Test→Verify→Commit→Next), and bilingual maintainability notes. Pairs with `skills/core/task-breakdown-from-plan` (which decomposes by file/layer) by providing the "build the slice end-to-end" discipline.

## Ghi chú tiếng Việt

Kỹ năng này dạy **vertical slice doctrine**: slice theo outcome (user-visible path), KHÔNG slice theo layer (DB-only, API-only) hay theo file. Mỗi slice phải chạy 5-step cycle: Implement → Test → Verify → Commit → Next. Mỗi slice phải demo được cho user. Stubs cho layer ngoài slice hiện tại OK, nhưng phải track để replace. Sequence slices theo VALUE, không theo layer. "Backend trước, UI sau" là vi phạm doctrine — UI của slice 1 phải có để user feedback UX.
