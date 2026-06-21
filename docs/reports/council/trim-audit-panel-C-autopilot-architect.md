# Council Panel C — Auto-Pilot System Architect

**Auditor role:** AUTO-PILOT SYSTEM ARCHITECT
**Target:** `/home/devops/vibe-coding-os/` (v2.16.x)
**Date:** 2026-06-21
**Mission:** Identify blockers to full AI autonomy (read spec → write code → run tests → fix bugs → commit → PR → merge, all without asking user permission, while staying safe and accurate).

---

## EXECUTIVE VERDICT

**Current state:** The repo is **deliberately human-in-the-loop**. The prime directive (`CLAUDE.md`) is "build software quickly while preserving clarity, correctness, verification, and attribution hygiene." Every layer of the runtime — approval gate, risk levels, council escalation, review-before-merge — assumes a human is the ultimate accountability holder. The runtime literally has `ACTION_FORCE_APPROVAL` for `file.write`, `shell.command`, `tmux.launch`, `mcp.call` and any `review`/`dangerous`/`blocked` risk (`runtime/core/approval-gate.mjs:27-32`). The `v2.16.1-explained/SOLUTIONS.md` (line 599) explicitly classifies "Human-on-loop (auto-approve)" as *medium* risk, and "No-loop (fully autonomous)" as *high* risk, recommended only for "Demo, throwaway experiment."

**Target state:** "AI in the loop until done" — AI reads spec, picks tier via `adaptive-flow`, writes code, runs tests, fixes its own bugs, commits locally, opens PR, merges (when green), all without surfacing a question unless an objective ambiguity gate trips.

**Gap:** The runtime already *has* all the pieces for a trust-but-verify autopilot. What is missing is (a) a default `auto-approve` policy that whitelists non-destructive ops, (b) a self-review layer that decides "I need to ask" vs "I can proceed," and (c) a loop driver (the existing `runtime/daemon/daemon.mjs` is generic — needs an autopilot handler). The biggest blocker is **cultural/defaulting**, not missing infrastructure.

**Bottom line:** Safe autopilot is achievable in 3 phases, with NO new skills invented — only re-wiring of features that already exist. Estimated trim: ~15% of current core skills become optional/deferrable; ~85% of "ask the user" moments can become "ask the test suite."

---

## TOP 10 AUTONOMY BLOCKERS

These are the features/design choices that **force a human prompt** when an AI self-resolve would suffice.

### 1. `grill-user-before-building` is interactive-only by design
- **File:** `skills/core/grill-user-before-building/SKILL.md:44` — *"Continuing the interview in CI/loop contexts … produces nothing. This skill is interactive-only."*
- **Block:** Forces pause for every ambiguous task. In a loop, the only sane resolution is to **bake in defaults** and proceed.
- **Fix:** Make it `grill-with-defaults` — produce 2–3 candidate specs ranked by confidence, pick top one, log alternatives, proceed. Only escalate to user when confidence < 0.5 (down from 0.95). Add `auto-grill-defaults` with repo-local priors.

### 2. `approval-gate.mjs` force-approves on action NAME, not risk
- **File:** `runtime/core/approval-gate.mjs:27-32` — `ACTION_FORCE_APPROVAL = {file.write, shell.command, tmux.launch, mcp.call}`. Every shell command and every file write waits for human approval. In an autopilot, `npm test`, `git add`, `git commit` are the **vast majority** of calls and they should be auto-approved.
- **Block:** Even a 2-line fix stops for approval after every file write.
- **Fix:** Invert the gate. Default-deny **destructive** actions (`git push`, `npm publish`, `rm -rf`, `kubectl delete`, `terraform destroy` per SOLUTIONS.md line 578–582). Auto-approve everything else with audit log. Add `autoApproveActions` config matching the SOLUTIONS.md sketch.

### 3. `vibe-review` requires human-readable acceptance check
- **File:** `commands/vibe-review.md:13` — *"Use this command after implementation and before merge … when validation passed but human-readable acceptance criteria still need to be checked."*
- **Block:** Review is the autopilot's biggest stopping point. It assumes a human eyes the diff.
- **Fix:** Replace with `vibe-self-review` that runs the same checklist against a programmatic rubric (`skills/prompts/quality-rubric`) and auto-resolves when ALL blocks pass. Reserve human review for `risky` tier (auth/data/infra) per `adaptive-flow`.

### 4. `vibe-orchestrate` escalation path always includes the human
- **File:** `commands/vibe-orchestrate.md:111-126` — Council escalation: writer/critic/verifier/council. In an autopilot, writer and verifier are the **same model context**, which the skill itself flags as the bias case (see `guard-bypass-protocol` line 378 "self-judging legitimacy").
- **Block:** Multi-agent "council" was designed for parallel human review. When the autopilot IS the writer and reviewer, the council is theater.
- **Fix:** Auto-council = spawn N independent context windows (different temperature/seed), compare outputs, only escalate to human if they disagree on a `blocker`-severity finding. Otherwise majority-wins.

### 5. `checkpoint-validation` requires human-recorded evidence
- **File:** `skills/core/checkpoint-validation/SKILL.md:34-36` — *"Record evidence: what was checked, the result, and any open issues."* The default is for a human to paste the evidence.
- **Block:** Pause at every phase boundary waiting for an evidence write.
- **Fix:** Make evidence auto-collected: `appendEvidence(phase, check, command, exitCode, stdoutHash)` called by the runtime. Phase advances when `assertExitCode==0 && assertAllChecksRun`.

### 6. `brainstorming` is non-deterministic in loop
- **File:** `skills/core/brainstorming/SKILL.md:30` — *"List the smallest set of clarifying questions … Offer 2-4 viable approaches."* A looping AI asking itself 2-4 approaches and ranking them is fine — but the *output* is currently a human-facing decision brief.
- **Block:** The "recommend one approach" step is an end-of-loop hand-off, not a re-entry point.
- **Fix:** Add `brainstorm → auto-pick`. Highest-confidence option + 1-line rationale gets logged as a decision, the loop continues. Reserve user-facing brainstorm for `tier=risky`.

### 7. `quality-execution-contract` 5-step workflow — now merged from quality-shield
- **File:** `skills/core/quality-execution-contract/SKILL.md:49` (previously `skills/core/quality-execution-contract/SKILL.md (merged):49`) — *"Create a Contract — Write a one-paragraph quality execution contract."* A contract authored by the AI is non-binding.
- **Block:** If the contract is the only thing keeping the AI honest, it will rationalize any contract it wrote. The "scorecard" step is a checklist, not a gate.
- **Fix:** Replace the scorecard with a hard gate: contract fields are validated against a JSON schema, file scope is enforced by `git diff --name-only` cross-check, and missing acceptance criteria block the commit hash from being written.

### 8. `guard-bypass-protocol` requires user authorization
- **File:** `skills/core/guard-bypass-protocol/SKILL.md:36-40` — *"User Confirmation: Require explicit user confirmation before starting bypass session."* In an autopilot, the AI IS the user.
- **Block:** Every blocked request by the upstream model triggers a stop. The autopilot cannot recover.
- **Fix:** For coding tasks, auto-attempt 2-3 reframings internally (debugging frame, few-shot priming) and only surface the bypass to user if all fail AND the request was on the user's explicit allowlist. Mark `guard-bypass-protocol` as a **defensive** skill (catalog patterns) rather than offensive (try to bypass).

### 9. `claude-code-hooks-pack` and `claude-code-hooks` not visible in core
- **File:** `skills/core/claude-code-hooks-pack/` (not read but referenced in skills list)
- **Block:** Without hook integration, the autopilot cannot intercept `PreToolUse`/`PostToolUse` to auto-approve. The approval gate exists in `runtime/core/` but the trigger into Claude Code / Hermes / Codex requires adapter wiring.
- **Fix:** Add an autopilot hook in `adapters/hermes/` (and `adapters/codex/`, `adapters/claude-code/`) that reads `.omc/config.json` and, when `autopilot.enabled=true`, wraps every tool call in `withApprovalGate` with `autoApprove` policy loaded.

### 10. `vibe-tasks` and `task-state-tracking` are stopping points
- **File:** `commands/vibe-tasks.md:40-42` — *"Stop and ask when the plan is missing, when dependencies form a cycle that cannot be broken, or when an acceptance criterion has no feasible task."*
- **Block:** Cycle detection is a normal AI skill; missing plans can be regenerated from the spec. Both are stop conditions that don't need human input.
- **Fix:** Make stop conditions resolvable: cycle → break at lowest-cost edge + log; missing plan → derive from spec automatically. Only stop for "no feasible task" (genuine semantic impossibility).

---

## MINIMAL VIABLE AUTOPILOT STACK

Five to eight features that MUST stay for safe autonomy. Everything else becomes deferrable or option.

1. **`goal-driven-execution`** — Every autopilot step needs an observable success condition. This is the spine.
2. **`adaptive-flow`** — Tier classifier (tiny → risky). Prevents over-process on tiny fixes and under-process on auth. The autopilot IS this loop.
3. **`verification-before-completion`** — The evidence bar. Every "done" claim must point to a runnable check.
4. **`task-state-tracking` + `runtime/daemon/daemon.mjs`** — The loop driver. `nextReadyTask` → execute → `done`. Already built.
5. **`runtime/core/approval-gate.mjs` (inverted policy)** — Default-deny destructive; default-approve safe. With audit log.
6. **`runtime/core/enforcement.mjs`** — `assertRiskWithin` + `assertKnownFields` = machine-checkable invariants. Already shipped.
7. **`runtime/core/tool-contract.mjs`** — Adapter allowlist. Prevents the autopilot from calling `mcp.call` on a tool it doesn't have permission for. Already shipped.
8. **A new thin layer: `runtime/autopilot/policy.mjs`** (proposed) — Loads `.omc/config.json → autopilot.policy`, exposes `shouldAskUser(action, risk, ambiguity)` and `shouldAutoApprove(action, risk)`. ~80 lines.

**Drop or defer:** `quality-shield` (replace with auto-contract), `grill-user-before-building` (replace with auto-defaults), `brainstorming` (auto-pick top option), `grill-with-docs` (only on tier=risky), `vibe-orchestrate` council (auto-council only), `guard-bypass-protocol` (defensive-only mode).

---

## THE TRUST-BUT-VERIFY LOOP

Architecture for "AI in the loop until done" — no human, no hallucination-amplification.

```
┌────────────────────────────────────────────────────────────┐
│  1. SPEC INTAKE                                            │
│     - Read .omc/specs/<name>.md OR user prompt             │
│     - Classify tier via adaptive-flow (tiny/small/medium/  │
│       large/risky)                                         │
│     - Confidence check → if <0.5 ambiguity, surface to user│
│     - Else: generate goal-driven-execution plan with check │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  2. CODE                                                   │
│     - Apply smallest safe diff per plan                    │
│     - Every file.write / shell.command → approval-gate     │
│       (auto-approve if not destructive + audited)          │
│     - Run file.context-pack if blast radius > 5 files      │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  3. TEST                                                   │
│     - Run npm run validate + targeted test suite           │
│     - If red: parse failure → restart at step 2 with the   │
│       failing test as the new check (regression-first)     │
│     - Cap retries at 3 per step; on overflow, escalate     │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  4. FIX                                                    │
│     - On test failure: re-read the failure, generate a     │
│       new hypothesis, write smallest patch                 │
│     - Update plan with a new sub-goal + check              │
│     - Re-loop from step 3                                 │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  5. COMMIT (local)                                         │
│     - git add + commit with plan reference                 │
│     - Destructive ops (push, publish, rm) → human          │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  6. REVIEW (auto-council if tier ≥ medium)                 │
│     - Spawn N=3 independent context windows:               │
│         A) code-reviewer (correctness, attribution)        │
│         B) security-reviewer (injection, secrets)          │
│         C) scope-reviewer (contract compliance)            │
│     - Merge findings; escalate to human iff majority-block │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  7. MERGE / PR (tier-dependent)                            │
│     - tier ≤ small: local merge (squash)                   │
│     - tier = medium: open PR, wait for CI                 │
│     - tier = risky: human approval required                │
└────────────────────────────────────────────────────────────┘
```

The **trust-but-verify** keys are: (a) **observable success conditions** from `goal-driven-execution` (no claim without a check), (b) **red-test-first** discipline (a passing build is not proof), and (c) **independent context windows** for the review (kills the "same model judges itself" bias that `guard-bypass-protocol` warns about in line 378).

---

## DELETION CANDIDATES

These are features that BLOCK or SLOW the loop. They can be **removed from the default path** and re-introduced as opt-in:

| Feature | Why it blocks | Replacement |
|---|---|---|
| `grill-user-before-building` (interactive-only mode) | Forces pause for every ambiguous task | `grill-with-auto-defaults` — proceed with 90% confidence |
| `guard-bypass-protocol` (offensive mode) | Stops on model refusal; user must approve | Defensive-only — catalog patterns, don't auto-attempt bypass |
| `vibe-orchestrate` multi-team council | Same model in 3 roles = theater | `auto-council` (N independent contexts) |
| `quality-shield` 5-step contract | Human-bound contract | Auto-contract (JSON schema + git diff enforcement) |
| `brainstorming` hand-off brief | End-of-loop delivery, not re-entry | `brainstorm → auto-pick` |
| `checkpoint-validation` human evidence paste | Every phase boundary pauses | Auto-evidence via runtime appendEvent |
| `claude-code-hooks-pack` (no autopilot adapter) | Hooks don't talk to approval-gate | New `adapters/*/autopilot-hook.mjs` |
| Manual `task-state-tracking` transitions | `--transition` requires a human | `nextReadyTask` already returns the next task; the human-typed CLI is decoration |
| `commands/vibe-grill-me.md` (referenced in `grill-user-before-building` line 71) | Pauses the loop | Remove or alias to `vibe-brainstorm --auto` |

---

## CONCRETE AUTOPILOT IMPLEMENTATION PROPOSAL

### Phase 1 — Wire the existing runtime (1–2 days, ~120 lines of new code)

1. **Add `runtime/autopilot/policy.mjs`** (~80 lines)
   - `loadAutopilotPolicy()` reads `.omc/config.json → autopilot.policy`
   - `shouldAutoApprove(action, risk, context)` returns boolean
   - `shouldAskUser(action, risk, ambiguity)` returns boolean
   - Default policy: auto-approve anything in `whitelistActions` (file.write, shell.command for non-destructive subcommands, task.update, checkpoint.create); default-deny `git push`, `npm publish`, `rm`, `kubectl delete`, `terraform destroy`.
2. **Add `runtime/autopilot/loop.mjs`** (~60 lines)
   - Drives `runtime/daemon/daemon.mjs` with handler: `readNextTask → applyGoalDrivenPlan → writeCode → runTests → onFail fix → onPass review → onPass commit → markDone`.
   - Returns when `nextReadyTask === null` OR `failureCount > 3`.
3. **Add `vibe-autopilot`** (~30 lines)
   - Single entry point: `vibe-autopilot [--spec <path>] [--max-iterations 50]`.
4. **Add `adapters/hermes/autopilot-hook.mjs`** (~40 lines)
   - Pre-tool hook: wraps every `task.update` / `file.write` / `shell.command` with `withApprovalGate` + autopilot policy.

**Total new code:** ~210 lines. No new skills. No breaking changes to existing core.

### Phase 2 — Auto-council and auto-evidence (3–5 days)

1. **Add `runtime/autopilot/auto-council.mjs`** (~100 lines)
   - Spawns 3 child contexts (different temperature/seed). Aggregates findings. Escalates iff `blocker_count > majority`.
2. **Add `runtime/autopilot/evidence.mjs`** (~50 lines)
   - `collectEvidence(phase, check, command, exitCode, stdoutHash)` writes to `runtime/checkpoints/evidence.jsonl` via existing `appendEvent` machinery.
3. **Refactor `vibe-review` to call `auto-council` first** (modifies `commands/vibe-review.md` only, no skill changes).
4. **Refactor `commands/vibe-tasks.md` "Stop and ask"** → resolve in-loop, only stop on `no-feasible-task`.

### Phase 3 — Tier-aware human gate (1 week)

1. **Wire `adaptive-flow` tier output** into the autopilot policy:
   - `tier ∈ {tiny, small}`: no human touch.
   - `tier = medium`: human-touch only at PR-open time.
   - `tier = large`: human-touch at spec sign-off.
   - `tier = risky`: human-touch at every checkpoint gate (current default).
2. **Add `runtime/autopilot/risk-tier.mjs`** (~80 lines)
   - Auto-classify via `adaptive-prompt-selection` matrix: `feature` → medium, `security` → risky, `migration` → risky, `bugfix` → small, `refactor` → small, `docs` → tiny.
3. **Add `vibe-autopilot-status`** (~20 lines) for human inspection: shows current task, evidence log, retries used, council findings.
4. **Document `docs/autopilot.md`** (~200 lines) — the new user-facing guide. Replaces the "human-in-the-loop" framing in `CLAUDE.md` workflow with a tiered "AI-in-the-loop-by-default" framing.

**End state:** A user runs `vibe-autopilot --spec specs/auth-fix.md` and walks away. The AI does the loop. A `destructive` op or a `risky`-tier disagreement pings them. Everything else is silent.

---

## Closing note

The repo is **architecturally ready** for autopilot. The blockers are: (1) inverted default in `approval-gate.mjs`, (2) interactive-only `grill-user-before-building`, (3) missing autopilot adapter in hooks, and (4) a few `vibe-*` commands that bake in human prompts as a feature rather than a fallback. None of these are deep rewrites. The longest pole is the new evidence-collection layer (Phase 2) so the autopilot's "done" claims are falsifiable post-hoc.
