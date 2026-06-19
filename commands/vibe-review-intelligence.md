---
description: "Run a code-intelligence-aware review: build a structural map of the change and analyse impact through dependencies, call graph, and test gaps."
---

# vibe-review-intelligence

## Purpose

Produce a structure-aware code review that builds a lightweight code intelligence map before analysing the diff. Catches ripple effects, untested dependency chains, and structural issues that line-by-line review misses.

## When to use

Use for non-trivial changes touching multiple files, cross-module boundaries, shared interfaces, or risky refactors. Not needed for trivial single-file changes.

## Required inputs

The diff and fixed point; project source tree; optional previous intelligence map for incremental mode.

## Step-by-step behavior

1. **Scope the review region.** Identify touched files and modules. Bounds the intelligence map to changed region plus immediate dependency neighbourhood.

2. **Enumerate dependencies.** For each changed file: direct imports, transitive risk, callers, callees, data flow across the change boundary.

3. **Build the call graph.** Map changed functions to their callers and callees. Flag recursion, async chains, or dynamic dispatch.

4. **Map test coverage.** Per function and dependency chain: does a test exist? Does it cover the changed path? Record gaps prioritised by risk.

5. **Analyse the diff against the map.** Impact analysis (who is affected), dependency risk (new/changed deps), test gap risk, structural concerns (layering violations, circular deps).

6. **Produce intelligence-enhanced review.** Standard blockers/suggestions/verification plus a Code Intelligence Summary drawn from the map.

## Options

- `--incremental` — Load a previous intelligence map baseline and only re-analyse changed regions. Reduces overhead for repeated reviews of the same area. Requires a prior run that produced a baseline.
- `--mcp` — Delegate dependency enumeration and call graph construction to an MCP-enabled code intelligence tool (requires adapter setup; see `adapters/mcp/code-intelligence-tool-pattern.md`). Falls back to manual reading if the MCP tool is unavailable.
- `--scope <modules>` — Restrict the intelligence map to a specific set of modules instead of auto-detecting. Useful when the diff spans many files but only a subset is structurally interesting.

## Practical example

Given a diff modifying `services/checkout.ts` and `models/cart.ts`:

1. Scope: the two changed files plus `utils/tax.ts`, `types/order.ts`, and `api/checkout-handler.ts` (one-hop neighbours).
2. Dependencies: `checkout.ts` imports `cart.ts`, `tax.ts`; `cart.ts` imports `types/order.ts`; no risky transitive dependencies detected.
3. Call graph: `CartService.addItem()` calls `validateItem()`, `calculateTax()`, `saveCart()`; is called by `CheckoutController.checkout()` and `CartApi.addItemHandler()`.
4. Test gaps: `calculateTax()` has unit tests but the new tax exemption path is untested; `saveCart()` has no integration test.
5. Analysis: changing `addItem()` affects both web and API callers; the new `TaxExemptionValidator` pulls in a new external dependency (`RegulatoryApi`).
6. Summary: two risk concentrations — shared `addItem()` interface and the new external dependency.

## Outputs

A completed Code Intelligence Map (`templates/code-intelligence-review-template.md`) and a review note with Code Intelligence Summary plus standard review sections.

## Workflow diagram

```
Diff → Step 1: Scope → Step 2: Dependencies → Step 3: Call graph
                                                      ↓
                                              Step 4: Test gaps
                                                      ↓
                                              Step 5: Analyse diff
                                                      ↓
                                              Step 6: Review + Summary
```

## Related

- `skills/core/code-intelligence-review/SKILL.md` — the skill this command invokes.
- `skills/core/requesting-code-review/SKILL.md` — requesting a review with intelligence-map option.
- `skills/core/incremental-review/SKILL.md` — incremental mode workflow.
- `adapters/mcp/code-intelligence-tool-pattern.md` — MCP adapter contract.
- `templates/code-intelligence-review-template.md` — structured map template.
- `templates/incremental-review-template.md` — incremental findings template.

## Verification or stopping conditions

Stop if the diff touches files outside the review scope without re-scoping. Stop if the map becomes larger than the review budget (keep scope tight). Stop if the previous intelligence map baseline is missing and `--incremental` was passed. Stop if the MCP tool is unavailable and `--mcp` was requested without a fallback path.
