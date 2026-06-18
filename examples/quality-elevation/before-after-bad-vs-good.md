# Before / After: Bad vs Good Agent Output

## Task

Fix the login endpoint so that it returns 401 when the login phrase is wrong.

## Bad output

```text
Done! Updated the login handler. Everything should work now.
```

No file path mentioned. No test added. No output from a verification run. The claim is entirely unsupported.

What a reviewer sees:
- no evidence of what changed
- no new test that a wrong credential returns 401
- no verification output at all
- a vague "should work now" instead of a concrete report

## Good output

```text
Goal: make POST /api/login return 401 when the credential does not match.

Changes:
- updated src/auth/login.ts: compare the credential hash inside the existing handler
- added test: test/auth/login.test.ts "returns 401 on wrong credential"

Verification:
$ npm test -- --grep "login"
PASS test/auth/login.test.ts (1.2s)

All existing tests still pass.
```

What changed:
- the goal is restated in one clear sentence
- the files changed are listed by path
- a new test exists for the specific behavior
- verification ran and the result is reported honestly

## Why the difference matters

The weak version creates review friction and risk. A reviewer has to guess what happened, run their own checks, and may miss that nothing was actually verified.

The strong version gives the reviewer a testable summary. It proves the change was made, shows what tests cover it, and reports whether those tests pass. That is the difference between "someone said it works" and "there is evidence it works."
