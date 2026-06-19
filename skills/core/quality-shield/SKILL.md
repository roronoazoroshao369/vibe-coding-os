# Quality Shield

> Five-step copy-paste workflow for making safe, verified changes to an existing codebase. Prevents scope creep, hallucination, and untested changes.

## Purpose

Provide a disciplined, repeatable process for making safe changes to existing code. The workflow ensures every production-quality change has a written contract, a minimal context pack, a reviewed diff, and a verifiable scorecard before it is considered done.

## When to use

- Bug fixes with unclear root cause
- Feature additions where safety matters more than speed
- Any change touching production-adjacent code
- When the user explicitly asks to **protect quality** or **avoid breaking things**
- During code review before merging

## Inputs

- Existing codebase with a known file structure
- Change request or bug report from the user
- Access to `docs/quality-shield-workflow.md`
- Access to `skills/core/quality-execution-contract/SKILL.md`
- Access to `skills/core/code-context-pack/SKILL.md`

## Outputs

- A written **Quality Execution Contract** (use `templates/quality-contract.md`)
- A **Context Pack** with only the relevant files/code (use `templates/code-context-pack-template.md`)
- The **Smallest Safe Diff** that satisfies the contract
- A **Self-Review** confirming every acceptance criterion is met
- A **Scorecard** documenting verification results (use `templates/quality-scorecard.md`)

## Workflow

Follow the five steps documented in `docs/quality-shield-workflow.md`:

1. **Create a Contract** — Write a one-paragraph quality execution contract: goal, acceptance criteria, risk tier, files to touch/not touch.
   - Use `skills/core/quality-execution-contract/SKILL.md` for the full contract format.
   - Use `templates/quality-contract.md` for the fillable form.

2. **Right-Size Context** — Build a minimal context pack: only the files and lines relevant to the change.
   - Use `skills/core/code-context-pack/SKILL.md` for the context-pack protocol.
   - Use `templates/code-context-pack-template.md` for the fillable form. (Replace all `__` placeholders)

3. **Smallest Safe Diff** — Apply the smallest diff that satisfies the contract. No refactoring, no scope creep.

4. **Self-Review Against Criteria** — Re-read the contract and verify every acceptance criterion. Check for edge cases, side effects, regressions.

5. **Write the Scorecard** — Use `templates/quality-scorecard.md` to produce the verification scorecard. Append to runbook or share.

## Key terms

- **Contract**: Binding agreement between AI and user about what will/won't be changed.
- **Scorecard**: Audit trail showing which acceptance criteria passed and which (if any) failed.
- **Quality Diff**: Side-by-side comparison of the generated diff against expected behavior.

## Failure modes

- **No contract written**: Changes proceed without agreement on scope → scope creep, regressions.
- **Context pack too large**: AI suffers context window pressure → misses details, hallucinates.
- **Diff exceeds contract scope**: Refactoring or cleanup sneaks in → untested changes, risk.
- **Skipped self-review**: Acceptance criteria not checked → bugs reach production.
- **No scorecard**: No audit trail → hard to verify or roll back.

## Verification checklist

- [ ] Contract written before any code change
- [ ] Contract lists files NOT to touch
- [ ] Context pack contains only relevant lines
- [ ] Diff changes nothing outside contract scope
- [ ] Every acceptance criterion checked
- [ ] Scorecard created for every change

## Related

- `docs/quality-shield.md` — Canonical guide and artifact audit map
- `docs/quality-shield-workflow.md` — Copy-paste five-step workflow
- `examples/quality-shield/README.md` — Concrete bug-fix scenario
- `skills/core/quality-execution-contract/SKILL.md` — Contract protocol
- `skills/core/code-context-pack/SKILL.md` — Context pack protocol
- `skills/prompts/quality-rubric/SKILL.md` — Quality evaluation rubric
