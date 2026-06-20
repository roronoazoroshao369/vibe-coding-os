# Command: /vibe-refactor

## Purpose

Start a safe refactor session using the 5-phase protocol from `skills/core/safe-refactor/SKILL.md`. The command writes a refactor plan to `docs/refactors/<timestamp>-<slug>.md`, links the characterization tests, and asks for explicit user sign-off before any structural change.

## Usage

```
/vibe-refactor <path-or-pattern> [target-shape]
```

## Examples

```
/vibe-refactor src/legacy/auth.ts "split into auth-validate, auth-token, auth-session modules"
/vibe-refactor skills/core/ --extract-purposes
/vibe-refactor commands/ "flatten by category"
```

## What this command does

1. Read `skills/core/safe-refactor/SKILL.md` to load the 5-phase protocol.
2. Identify the file(s) to refactor from the path argument.
3. Capture current behavior: list existing tests, run them, record pass/fail.
4. If coverage of the area is below 80%, surface that fact and ask the user whether to add coverage first.
5. Write a refactor plan to `docs/refactors/<timestamp>-<slug>.md` using `templates/refactor-plan.md` as the body.
6. List the proposed commit chain (one structural change per commit) and the rollback hash.
7. Ask for explicit sign-off: "Proceed? (yes / adjust / cancel)".
8. On `yes`: execute commit 1 (characterization tests), pause, ask again, repeat.
9. On `adjust`: revise the plan, re-present.
10. On `cancel`: write the plan but mark it `cancelled`; do not commit.

## Refusal conditions

This command will refuse if:
- The path does not exist.
- The target shape would change observable behavior (a refactor must be behavior-preserving — that's what makes it a refactor).
- The area has < 80% test coverage and the user declines to add coverage first.
- The diff includes a `package.json` version bump or any change outside the refactored files (refactor PRs are scoped).

## Outputs

- `docs/refactors/<timestamp>-<slug>.md` — the refactor plan (5 phases + commit chain + rollback).
- Each commit in the chain has a message following Conventional Commits (`refactor(scope): ...`).
- `registry/commands.json` is updated if the refactor renames or moves a registered path.

## Related commands

- `/vibe-plan` — for new features (not refactors).
- `/vibe-fix-bug` — for bug fixes (not refactors).
- `/vibe-validate` — runs after each refactor commit.

## Related skills

- `skills/core/safe-refactor/SKILL.md` — the protocol this command implements.
- `skills/core/bug-fix-lifecycle/SKILL.md` — for the "fix bug first" rule.
- `skills/core/verification-before-done/SKILL.md` — verification framework.

## Attribution

Pattern adapted from Michael Feathers' *Working Effectively with Legacy Code* and Martin Fowler's *Refactoring*, in original wording.
