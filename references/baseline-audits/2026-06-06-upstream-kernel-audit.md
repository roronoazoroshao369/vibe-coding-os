# 2026-06-06 Upstream Kernel Audit

This baseline audit inspected shallow local clones of the eight tracked reference repositories under `references/upstreams/`. The clones are ignored working copies used only for analysis; no upstream source tree is vendored into Vibe Coding OS.

## Baseline commits

| Source id | Commit | Date | License status | Local lesson |
| --- | --- | --- | --- | --- |
| `affaan-m-ecc` | `7113b5bf63694b716f8b2413c5919824a82fc095` | 2026-06-06 | MIT verified from root `LICENSE` | Broad agent-harness ecosystems need command registries, placement policy, security guide rails, and cross-tool adapters. |
| `github-spec-kit` | `7106858c4e636098815fffa23f6c6b99eb0e156b` | 2026-06-05 | MIT verified from root `LICENSE` | Spec-driven work benefits from explicit command packages, workflow definitions, templates, and integration tests. |
| `mattpocock-skills` | `aaf2453fbdfe7a15c07f11d861224f34ab4b53cb` | 2026-05-31 | MIT verified from root `LICENSE` | Small composable skills should be easy to list, link, verify, and adapt without over-orchestration. |
| `multica-ai-andrej-karpathy-skills` | `2c606141936f1eeef17fa3043a72095b4765b9c2` | 2026-04-20 | No root license found in clone; treat as inspiration only | Guardrails should force assumptions, simplicity, surgical changes, and goal-driven execution. |
| `obra-superpowers` | `6fd4507659784c351abbd2bc264c7162cfd386dc` | 2026-05-29 | MIT verified from root `LICENSE` | Mature skill systems need explicit plan execution, verification before completion, code review exchange, and skill authoring rules. |
| `supermemoryai-supermemory` | `1b1bd4d2214f7dcf80f95646ae4ea0e46bb6cb2a` | 2026-06-06 | MIT verified from root `LICENSE` | Memory systems should emphasize retrieval, structured operations, and integration surfaces rather than transcript hoarding. |
| `thedotmack-claude-mem` | `671de5e3e20544f1d50e7488088063ffb5275646` | 2026-06-05 | Apache-2.0 verified from root `LICENSE` | Persistent agent memory needs observability, opt-out/disable paths, installation safety, and tests for unintended recording. |
| `yeachan-heo-oh-my-claudecode` | `3e945671dcf3ed1c1bcc422862815f92c1999143` | 2026-06-04 | MIT verified from root `LICENSE` | Multi-agent packs need boundary guidance, skill budgets, memory merge behavior, and adapter/plugin compatibility tests. |

## Cross-source distillation

### 1. The kernel should optimize for workflow gates

The strongest upstream projects do not rely on a single giant prompt. They define gates: clarify intent, specify behavior, plan execution, implement small changes, verify, review, record memory, and merge. Vibe Coding OS should keep these gates explicit and lightweight.

### 2. Skills should stay small and composable

A skill is most useful when it has a narrow trigger, clear inputs, an execution checklist, failure modes, and verification steps. Large workflows should compose skills instead of becoming monolithic instructions.

### 3. Reference intelligence is a product surface

Maintaining upstream inspiration requires more than URLs. Each source needs a commit baseline, license status, feature mapping, local targets, audit changelog, and a repeatable clone/update command.

### 4. Memory must be safe by design

Memory should retrieve durable decisions, constraints, commands, and gotchas. It should avoid secrets, noisy transcripts, and self-recording loops. Any memory workflow should include privacy filtering and stale-context handling.

### 5. Multi-agent power requires boundaries

Parallel agents are useful only when ownership is explicit, write scopes are disjoint, review gates are mandatory, and the main agent keeps responsibility for integration.

### 6. Verification is the strongest anti-hallucination mechanism

Every source points back to the same operational truth: success claims need executable checks, review evidence, or a clear limitation. Vibe Coding OS should make verification status visible in commands, skills, templates, and final reports.

## Adopted now

- Added an ignored `references/upstreams/` clone workspace.
- Added `npm run references:clone` to refresh tracked upstream working copies.
- Added an upstream audit workflow document and template.
- Added `upstream-intelligence-loop` as a core skill.
- Added `vibe-upstream-sync` as a reusable command prompt.
- Updated reference metadata with baseline commit hashes and license status.

## Deferred

- Full schema validation for every new reference field.
- Automated GitHub star/fork/activity scoring.
- Adapter-specific install snippets derived from audited repos.
- Redaction tests for memory workflows.

## Ignored

- Vendoring upstream source trees.
- Copying upstream prompts or documentation blocks.
- Importing implementation-specific app code from product repositories.
