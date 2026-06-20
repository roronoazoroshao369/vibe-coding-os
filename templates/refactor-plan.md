# Refactor Plan Worksheet

> Used by `/vibe-refactor`. Copy this file to `docs/refactors/<timestamp>-<slug>.md` and fill in each section before the first commit.

## Header

- **Slug:** `<short-kebab-case-id>`
- **Started:** `<ISO timestamp>`
- **Owner:** `<name or handle>`
- **Rollback commit:** `<commit-hash-on-main-before-refactor-starts>`

## 1. Smell or trigger

What is wrong with the current code? Cite a specific code location.

- **Smell:** `<long function | deep coupling | leaky abstraction | repeated logic | ...>`
- **Location:** `path/to/file.ts:LINE-LINE`
- **Symptom:** `<what makes this smell painful in practice>`
- **Trigger:** `<what made this smell urgent now>`

## 2. Target shape

What does "good" look like?

- **Public surface:** `<unchanged | renamed: ... | moved to: ...>`
- **Internal structure:** `<describe the new module/class/function layout>`
- **Behavior:** `<must be byte-equivalent on the characterization inputs>`

## 3. Characterization

Capture behavior BEFORE any structural change.

- **Existing tests:** `<list test files and what they cover>`
- **Characterization tests to add:** `<list new test cases that pin behavior>`
- **Coverage target:** `≥ 80%` of `<files/dirs>`
- **Verification command:** `<npm test | pytest | go test ./... | ...>`

## 4. Coverage gate

Confirm before proceeding.

- [ ] Coverage of refactored area is ≥ 80%.
- [ ] All existing tests pass on the current code.
- [ ] Characterization tests written and passing.
- [ ] No flaky tests in the area.

## 5. Commit chain

One structural change per commit. Each commit must leave tests green.

| # | Commit message | Files touched | Structural change | Verification |
| - | -------------- | ------------- | ----------------- | ------------ |
| 1 | `refactor(scope): characterize` | `<test files>` | Add characterization tests | `<test cmd>` |
| 2 | `refactor(scope): extract X` | `<source files>` | Move Y into X | `<test cmd>` |
| 3 | `refactor(scope): rename X to Y` | `<files>` | Rename for clarity | `<test cmd>` |
| 4 | `refactor(scope): invert dependency` | `<files>` | Move import direction | `<test cmd>` |
| 5 | `refactor(scope): cleanup dead code` | `<files>` | Remove temporary branches | `<test cmd>` |

## 6. Rollback strategy

If the refactor must be abandoned mid-flight:

- **Rollback commit:** `<hash>` (the commit on `main` before commit #1).
- **Per-commit revert:** each commit is independently revertible via `git revert <hash>`.
- **If commit #N breaks tests:** stop, do NOT commit #N+1; revert #N; re-characterize.

## 7. Verification

After all commits:

- [ ] Characterization tests pass on the new code (proves no behavior change).
- [ ] New tests for the new shape pass.
- [ ] `npm run validate:all` exits 0.
- [ ] `npm run validate:traceability -- --strict-new` exits 0.
- [ ] No `// TODO: remove` or commented-out blocks left.
- [ ] Registry paths updated (skills/commands/templates indexes reflect new locations).
- [ ] PR description cites the smell, the target shape, and the rollback hash.

## 8. Sign-off

- [ ] User approved the plan BEFORE commit #1.
- [ ] User approved each commit before the next.
- [ ] User approved the cleanup commit.
