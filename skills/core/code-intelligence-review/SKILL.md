---
name: code-intelligence-review
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - review
status: stable
---

# Skill: Code Intelligence Review

## Purpose

Produce a structure-aware code review by first building a lightweight code intelligence map — scope, call graph, data and import dependencies, test coverage gaps — and then analysing the diff against that map. This surfaces impact that a flat line-by-line review would miss: ripple effects through callers, untested dependency chains, and structural gaps in the change.

## When to use

Use before or during review of any non-trivial change (multiple files, cross-module touch points, risky refactors, or changes to shared interfaces). Use when the reviewer is unfamiliar with the code region. Use when the review requires understanding how the change propagates through the system.

Do not use for trivial single-file changes where the overhead of graph construction outweighs the insight. A one-line bug fix in a leaf function, for instance, does not need a full intelligence map — a focused look at its callers is sufficient.

## Inputs

- The diff and its fixed point (branch, commit, or `main`).
- The project source tree (readable).
- Previously known code intelligence maps (if this is an incremental run).
- The spec, plan, or issue that motivated the change.
- A language-aware tool or manual reading to resolve imports and call sites.

## Workflow

### Step 1: Scope the review region

Identify which files, modules, or packages the diff touches. Determine the boundary of the intelligence map: include the touched modules plus their immediate dependency neighbourhood (imported modules, direct callers, and commonly co-changed files).

Record the scope in the intelligence map template.

**Practical example:** If the diff modifies `services/checkout.ts` and `models/cart.ts`, the scope includes both files plus any modules they import (e.g., `utils/tax.ts`, `types/order.ts`), and any modules known to import them (e.g., `api/checkout-handler.ts`). Do not traverse beyond one hop unless a particular dependency chain is flagged as risky.

### Step 2: Enumerate dependencies

For each file in the diff, enumerate:

- **Direct imports** — what modules does this file import? List them.
- **Transitive imports** — do any of the direct imports pull in large or risky dependency chains (e.g., network, database, filesystem)?
- **Callers** — what functions or modules call the changed functions? Identify callers within the scope and notable callers outside it.
- **Callees** — what functions or modules does the changed code call? Flag external or expensive callees.
- **Data flow** — what data structures, types, or interfaces cross the change boundary? Trace how they are constructed, passed, and consumed.

This step is mandatory. Without it, the map has no structural anchor and the review reverts to a flat line-by-line read.

### Step 3: Build the call graph

Construct a focused call graph for the changed region:

1. List each changed function or method.
2. For each, list the functions it calls (direct calls only, within scope).
3. For each, list the functions that call it (direct callers only, within scope).
4. Flag any recursive, async, callback-heavy, or error-path chains.
5. Note any polymorphic dispatch or interface implementations that make the call graph incomplete without runtime information.

**Practical example:** For a change in `CartService.addItem()`, the call graph shows that `addItem()` calls `validateItem()`, `calculateTax()`, and `saveCart()`, and is called by `CheckoutController.checkout()` and `CartApi.addItemHandler()`. The reviewer can now see that a bug in `addItem()` would affect both checkout and the API handler.

### Step 4: Map test coverage

For each changed function and its dependencies:

- Does a unit test exist? If not, flag a test gap.
- Does the test cover the changed code path (not just the function signature)?
- Does an integration test cover the dependency chain?
- Does a regression test exist for the scenario being changed?

Record coverage gaps in the intelligence map. Prioritise: untested error paths > untested dependency chains > untested happy paths.

**Practical example:** `calculateTax()` has a unit test but it only covers the standard 10% rate. The diff adds a new tax exemption path — that path has no test. The change also affects `saveCart()`, which has no integration test covering its interaction with the database. Both gaps are flagged.

### Step 5: Analyse the diff against the map

With the intelligence map built, read the diff:

1. **Impact analysis** — for each changed line, consult the call graph and data flow. Which callers are affected? Does the change alter a shared interface or type? Does it introduce a new dependency?
2. **Dependency risk** — does the change add, remove, or upgrade a dependency? Does it change the shape of data flowing between modules?
3. **Test gap risk** — are changed functions or their callers missing tests? Are existing tests likely to break?
4. **Structural concern** — does the change violate layering (a module importing from a layer it should not depend on)? Does it create a circular dependency?

### Step 6: Produce the intelligence-enhanced review

Write the review as usual (blockers, suggestions, verification evidence), but preface it with a **Code Intelligence Summary** section drawn from the map. This summary gives the author and subsequent reviewers a shared structural understanding of the change's reach.

**Example summary:** "This change touches the checkout pipeline at two points: `CartService.addItem()` and a new `TaxExemptionValidator`. The call graph shows that `addItem()` is shared between the `CheckoutController` and the `CartApi` — any breakage there affects both web and API users. The `TaxExemptionValidator` is a new leaf with no callers yet, but it pulls in a `RegulatoryApi` client (new external dependency). Test coverage is solid on the existing `calculateTax()` path but missing entirely on the new exemption path and on the `saveCart()` database interaction. The two highest-risk areas are the shared `addItem()` interface and the new external dependency."

## Outputs

- A completed Code Intelligence Map (use `templates/code-intelligence-review-template.md`).
- A review note with the standard blockers/suggestions/verification sections plus the Code Intelligence Summary.

## MCP adapter option

If your agent harness supports the Model Context Protocol (MCP), you may delegate Steps 2–4 to an MCP-enabled code intelligence tool that exposes call graphs, dependency graphs, and test gap analysis as structured resources. See `adapters/mcp/code-intelligence-tool-pattern.md` for the adapter contract. The markdown-first skill defined here is the default portable approach; the MCP path is an acceleration for agents that have the protocol available.

## Related skills

- `skills/core/requesting-code-review/SKILL.md` — request a review with optional intelligence map generation.
- `skills/core/receiving-code-review/SKILL.md` — use an intelligence map to triage and classify feedback by structural impact.
- `skills/core/incremental-review/SKILL.md` — combine with intelligence maps for token-efficient re-review.
- `skills/core/review-before-merge/SKILL.md` — the two-axis review that the intelligence map feeds into.
- `skills/core/dependency-aware-task-ordering/SKILL.md` — related dependency-graph skill for task planning rather than review.

## Failure modes

- Building a map so large it consumes the entire review budget without actionable findings. Keep the scope tight to the change region.
- Treating the map as a substitute for reading the diff. The map enhances line-by-line review; it does not replace it.
- Over-indexing on call graph completeness in dynamic languages where runtime dispatch cannot be statically resolved. Flag uncertainty rather than guessing.
- Skipping test gap analysis when no tests exist at all — the absence of a test suite is itself a finding.
- Forgetting to update the map when the diff changes mid-review, leading to analysis of stale structure.

## Verification checklist

- [ ] Intelligence map scope is bounded to the changed region plus immediate neighbours.
- [ ] Direct imports, callers, callees, and data flow are enumerated for each changed file.
- [ ] Call graph covers changed functions and their direct relationships.
- [ ] Test coverage gaps are identified per function and per dependency chain.
- [ ] Diff analysis references the map (impact, dependency risk, test gap risk, structural concern).
- [ ] Review output includes a Code Intelligence Summary section.
- [ ] Map scope and limitations are documented (e.g., dynamic dispatch not fully resolved).

## Ghi chú tiếng Việt

Code Intelligence Review xây bản đồ cấu trúc code (phạm vi, đồ thị gọi hàm, phụ thuộc import/data, lỗ hổng kiểm thử) trước khi review diff. Có 6 bước: xác định phạm vi, liệt kê phụ thuộc, xây đồ thị gọi hàm, lập bản đồ kiểm thử, phân tích diff dựa trên bản đồ, và tạo review có Code Intelligence Summary. Bước 2 (liệt kê phụ thuộc) là bắt buộc — không có bước này thì bản đồ mất neo cấu trúc. Có thể dùng MCP adapter để tăng tốc nếu môi trường hỗ trợ. Liên kết: `incremental-review` (review lặp lại hiệu quả), `requesting-code-review` (yêu cầu review có bản đồ), `review-before-merge` (review hai trục). Cảm hứng: `tirth8205/code-review-graph` (MIT) — ý tưởng về đồ thị thông minh cho code review; diễn đạt nguyên gốc, không sao chép.
