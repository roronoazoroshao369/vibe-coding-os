# Vibe Review and Verify Rules for Cursor

Use this file during the review, verification, and merge-readiness stages.

## Review checklist
- Verify the change matches the spec and plan.
- Check diff for correctness, scope creep, safety, and maintainability.
- Look for secrets, credentials, tokens, keys, or unnecessary personal data.
- Confirm file ownership and unrelated changes were preserved.
- Confirm related docs, registries, or schemas were updated if required.
- Note limitations, workarounds, and unresolved follow-ups.

## Test requirements
- Prefer fast validation before deep inspection.
- Run targeted checks for the files you changed, then run `npm run validate` if appropriate.
- If you cannot run a check, state the reason and the manual verification you performed.
- Record which tests or validation commands you ran and their outcome.

## Diff review
- Review additions for clarity, brevity, and consistency with repo conventions.
- Check for copy-heavy changes that should have been condensed or attributed.
- Flag risky changes to security-sensitive areas such as auth, data, shell commands, files, or network behavior.
- Prefer small revertible commits over large mixed changes.

## Signoff format
End the review with a structured summary:

- **Status:** Ready / Needs changes / Needs human review
- **What changed:** short list
- **What was verified:** commands run or manual checks done
- **Remaining risk or limitation:** concise note
- **Next action:** commit, fix, escalate, or ask user question
