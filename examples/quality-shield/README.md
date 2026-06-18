# Quality Shield Example: Small Bug Fix

This example shows how to copy-paste the Quality Shield workflow for a small bug fix without using the optional Quality Engine runtime.

## Scenario

A CLI command prints `Done` even when the underlying operation fails. Fix it so failures produce a non-zero exit and a clear error message.

## 1. Contract

```md
## Quality Execution Contract

- Goal: Make the CLI report failed operations honestly instead of always printing `Done`.
- Acceptance criteria:
  - [ ] When the operation succeeds, the CLI still prints the existing success message.
  - [ ] When the operation fails, the CLI exits non-zero and prints the error message.
  - [ ] Existing tests still pass; add or update a regression test for the failure path.
- Non-goals: Do not redesign the CLI, rename commands, or change unrelated output.
- Risk tier: small
- Files to inspect:
  - src/cli/*
  - tests/cli/*
- Files likely to change:
  - src/cli/run-command.*
  - tests/cli/run-command.test.*
- Files not to touch:
  - package manager files
  - unrelated commands
- New dependencies: none
- Public API changes: no
- Test commands:
  - npm test -- --runInBand tests/cli/run-command.test.*
  - npm run lint
- Manual fallback if tests cannot run: invoke the command once with a stubbed success input and once with a stubbed failure input; record outputs and exit codes.

Commitments:
- [x] Smallest correct change
- [x] Verification before claiming done
- [x] No unrelated refactor
- [x] Honest verification report
```

## 2. Context pack

```md
## Code Context Pack

- Task area: CLI command execution and error handling.
- Similar implementation inspected: another CLI command that catches errors, writes to stderr, and sets exit code 1.
- Related tests inspected: CLI tests that assert stdout, stderr, and exit code behavior.
- Error handling pattern: catch at command boundary; do not swallow errors; format user-facing message once.
- Naming/style pattern: tests use `describe`, `it`, and helper `runCli()`.
- Type/API/data shape: command handler returns a promise; CLI wrapper owns process exit code.
- Known gotchas: avoid throwing after setting stderr in tests if the harness treats thrown errors as test failures.
- Build/test commands for this area: targeted CLI test, then lint.
- Notes that constrain the implementation: preserve existing success message exactly.
```

## 3. Implement smallest safe diff

```md
Smallest safe diff statement:
I will update the CLI command boundary to catch operation failures, write the existing error message to stderr, and set a non-zero exit code. I will add one regression test for the failure path. I will not change command names, success output, or unrelated commands.
```

Implementation checklist:

- Add the missing failure branch at the command boundary.
- Preserve the success path exactly.
- Add or update the smallest regression test that fails before the fix and passes after it.
- Run the targeted test before any broader validation.

## 4. Self-review

```md
## Self-Review

- [x] Changed lines trace to the original request
- [x] No unrelated files, formatting churn, or drive-by refactors
- [x] No invented behavior or unapproved assumptions
- [x] Error path for operation failure is covered by a regression test
- [x] Tests updated only where needed
- [x] No secrets, credentials, or unnecessary personal data
- [x] Verification commands run and results recorded honestly
```

If any checkbox is not true, fix the patch or record the item as a deferred risk before final response.

## 5. Scorecard

```md
## Quality Scorecard

- Scope discipline: pass — only CLI command boundary and its test changed.
- Minimal diff: pass — one failure branch and one regression assertion added.
- Tests or checks: pass — targeted CLI test passed; lint passed.
- Verification honesty: pass — no unrun required checks.
- Residual risk: low — behavior depends on existing error message formatting.
- Recommendation: proceed
```

## Final response example

```md
Summary:
- Fixed the CLI failure path so failed operations report an error and exit non-zero.
- Added a regression test for the failure case.

Verification:
- npm test -- --runInBand tests/cli/run-command.test.*: passed
- npm run lint: passed

Quality Shield:
- Contract: completed
- Context pack: completed
- Self-review: completed
- Scorecard: proceed

Risks or follow-up:
- None.
```

## Reusable workflow

For the full copy-paste workflow, see [`docs/quality-shield-workflow.md`](../../docs/quality-shield-workflow.md).
