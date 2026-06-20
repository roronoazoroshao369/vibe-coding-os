# Slice Spec

Use this template for each vertical slice. One file per slice. Commit the slice atomically (impl + test + verify + this spec).

## Slice metadata

- **Slice ID:** `<NN>` (e.g. `01`)
- **Slice name:** `<short, outcome-based>`
- **Owner:** `<persona or name>`
- **Estimated effort:** `<hours or story points>`

## Outcome

`<One sentence: what user-visible or system-visible outcome does this slice deliver?>`

## Vertical path

`<List every layer this slice touches, in order>`

- Data source: `<DB, queue, external API>`
- Service / business logic: `<module name>`
- API: `<endpoint, route, event>`
- UI: `<component, page, view>` (if applicable)
- Test: `<unit, integration, e2e>`

## Acceptance criteria

- [ ] `<criterion 1>`
- [ ] `<criterion 2>`
- [ ] `<criterion 3>`

## Stubs introduced (track for replacement)

| Stub | Replaced in slice | Notes |
| --- | --- | --- |
|  |  |  |

## 5-step cycle

### 1. Implement

`<What code was written at each layer?>`

- Data: `<schema change, migration, seed>`
- Service: `<function, class, module>`
- API: `<endpoint, route, event handler>`
- UI: `<component, page>`

### 2. Test

`<What test was written? Unit? Integration? E2E?>`

- Test file: `<path>`
- Test name: `<describe/it>`
- Coverage: `<which acceptance criteria this test covers>`

### 3. Verify

`<How was the slice manually verified? Demo script? Real data?>`

- Demo command: `<command to run>`
- Manual steps: `<list>`
- Pass criteria: `<observed outcome>`

### 4. Commit

`<Atomic commit message and SHA>`

- Commit: `<hash>`
- Message: `<conventional commit message>`

### 5. Next

`<What is the next slice? When does it start?>`

- Next slice ID: `<NN+1>`
- Dependency on this slice: `<stub to replace | direct call | none>`

## Rollback plan

`<How to roll back this slice independently?>`

- Revert commit: `<hash>`
- Schema rollback: `<migration down or backout>`
- Feature flag: `<flag name + default>`

## Quality gate

- [ ] Outcome is user-visible or system-visible
- [ ] End-to-end path documented
- [ ] Acceptance criteria testable
- [ ] Stubs tracked
- [ ] 5-step cycle completed
- [ ] Slice demoed to user
- [ ] Commit atomic
- [ ] Rollback plan exists
