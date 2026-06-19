# Skill: Incremental Review

## Purpose

Re-review code efficiently after iterative changes by capturing a baseline of the previous review state and analysing only what changed — the diff, its dependency neighbourhood, and impacted test results — instead of re-reading the entire change surface. Token-efficient re-analysis that scales with iteration frequency.

## When to use

Use during active development when a region receives multiple review rounds. Use when the reviewer already reviewed a previous version of the same change and needs to confirm fixes without re-examining everything. Use when the change is part of a larger feature that goes through several review cycles.

Do not use for first-time reviews (no baseline exists) or when the diff is entirely new code with no prior review history.

## Inputs

- Previous review output (the baseline).
- Previous intelligence map (if code-intelligence-review was used).
- Current diff.
- Diff since last baseline.
- Fixed point (branch, commit, or tag).
- Validation results (before and after changes).

## Workflow

### Step 1: Capture or load the baseline

If this is the first review of this region, create a baseline by running a full review (use `requesting-code-review` and optionally `code-intelligence-review`). The baseline records:

- The set of files reviewed.
- The diff that was reviewed.
- The review findings (blockers, suggestions, questions, deferred items).
- The intelligence map (if generated).

If a baseline exists, load it. Confirm the baseline diff can be compared to the current diff.

### Step 2: Diff analysis — what changed since baseline

Compute the difference between the current state and the baseline:

1. **Added files** — files in the current diff that were not in the baseline.
2. **Removed files** — files in the baseline that are no longer part of the change.
3. **Modified files** — files that changed since baseline. For each, identify the specific functions, blocks, or lines that changed.
4. **Unchanged files** — files carried over from the baseline with no modifications.

For each category, note whether the unchanged files are still relevant to the current scope.

### Step 3: Dependency-impact analysis

For each changed function or block (from Step 2), consult the baseline intelligence map or build a fresh dependency slice:

- **Direct impact** — does this change affect a caller or callee that was already reviewed? Re-check those relationships.
- **New dependency** — does the change introduce a new import, call, or data flow? Evaluate the new dependency.
- **Removed dependency** — does the change remove an import, call, or data flow? Confirm the removal is safe and intentional.
- **Broadcast impact** — does the change alter a shared interface, type, or module export? Check all known callers (from the map).

### Step 4: Regression checklist

Compile a targeted regression checklist from the baseline intelligence map and the current impact analysis:

- [ ] Previously reviewed code paths that the current change touches — re-verify correctness.
- [ ] Previously identified blockers or suggestions — confirm they were addressed.
- [ ] Previously suggested tests — confirm they were added or document the decision not to add.
- [ ] Tests that exercise the changed functions — re-run and confirm they pass.
- [ ] Tests that exercise dependent functions (callers/callees) — re-run to catch regressions.
- [ ] Integration tests covering the changed dependency chains — confirm they still pass.
- [ ] Any new error paths introduced — verify they are tested.
- [ ] Any behavioural changes to shared interfaces — confirm backwards compatibility or document the break.

### Step 5: Incremental findings

Produce the incremental review output:

1. **Resolved items** — baseline findings that are now addressed. Mark them closed.
2. **New findings** — issues introduced by the current round of changes.
3. **Persistent items** — baseline findings that remain unresolved. Renew the recommendation or downgrade if the risk is accepted.
4. **Regression risks** — specific tests or paths at risk from the changes, based on dependency impact.

### Step 6: Update the baseline

Save the current state as the new baseline for the next incremental review. Include:

- The current diff and file list.
- The updated intelligence map (with dependency-impact annotations from Step 3).
- The resolved and persistent findings.
- The regression checklist status.

## Outputs

- Incremental review report with resolved, new, and persistent findings.
- Updated regression checklist.
- Updated baseline for the next incremental cycle.

## Failure modes

- Running incremental review without a valid baseline — produces false negatives because the reviewer assumes unchanged code is still correct.
- Skipping dependency-impact analysis — misses regressions in callers or dependants that do not appear in the diff.
- Accumulating stale baseline state — if the change direction shifts significantly, discard the baseline and start a fresh full review.
- Treating resolved items as fully closed without re-running tests — a fix may introduce its own regressions.

## Verification checklist

- [ ] Baseline exists and is loaded.
- [ ] Diff since baseline is computed (added, removed, modified, unchanged files).
- [ ] Dependency-impact analysis covers direct, new, removed, and broadcast impacts.
- [ ] Regression checklist is compiled from baseline map and current impacts.
- [ ] Incremental findings separate resolved, new, and persistent items.
- [ ] Baseline is updated for next cycle.
- [ ] Validation was re-run on the full change, not just the incremental diff.

## Ghi chú tiếng Việt

Incremental Review giúp review lại code hiệu quả sau nhiều vòng lặp: chụp baseline, phân tích diff từ baseline, đánh giá tác động phụ thuộc (dependency-impact), lập checklist hồi quy, và tạo báo cáo gồm mục đã giải quyết/mới/còn tồn đọng. Không chạy incremental nếu chưa có baseline. Cảm hứng: `tirth8205/code-review-graph` (MIT) — ý tưởng incremental re-analysis; diễn đạt nguyên gốc, không sao chép.
