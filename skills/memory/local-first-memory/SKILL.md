---
name: local-first-memory
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Local-first Memory

## Purpose

Choose the smallest local memory surface that preserves useful project context without introducing hosted storage, background daemons, or hidden data flows. Use a decision rubric to evaluate cloud vs local trade-offs.

## When to use

Use when deciding where memory should live, whether an external provider is acceptable, or how to scope memory by project, worktree, session, or user opt-out. Use when evaluating the privacy, latency, offline, sovereignty, or cost implications of a memory choice.

## Inputs

- Memory goal and expected lifetime.
- Repository, worktree, branch, and session scope.
- Candidate storage location or provider.
- Privacy exclusions, retention needs, and user opt-out constraints.
- Decision criteria: privacy, latency, offline needs, sovereignty, cost.

## Cloud-vs-Local Decision Rubric

When deciding between local memory and a provider-backed solution, evaluate against these criteria:

| Criterion | Local Memory | Cloud/Provider Memory | Tiebreaker |
|---|---|---|---|
| **Privacy** | Data never leaves the machine. No network access required. Best for sensitive code, credentials, personal data. | Data is transmitted and stored externally. Requires provider trust, encryption, and privacy policy review. | Default to local if the data is sensitive, regulated, or contains secrets. |
| **Latency** | Near-zero: file reads and template fills. No network hop. | Network-dependent: RTT, provider processing, auth overhead. May be faster for large-scale retrieval. | Default to local for interactive response. Consider cloud only if local search is too slow for the task. |
| **Offline** | Works fully offline. No connectivity, API keys, or provider auth required. | Requires network access. Fails gracefully with local fallback if pre-configured. | Default to local if the work environment is offline, air-gapped, or unreliable. |
| **Sovereignty** | Full control: retention, deletion, export, audit are local file operations. | Provider controls retention policy, data location, and access. Export/delete depend on provider API. | Default to local if data must remain under user control. |
| **Cost** | Zero marginal cost. Storage is file-system space already available. | Per-operation or per-storage pricing. May have free tier for small volumes. | Default to local unless cloud provider offers unique capability unavailable locally. |

### Decision Flow

1. **Check sensitivity**: if data contains secrets, personal data, or regulated content → use local memory. Cloud is blocked.
2. **Check offline need**: if the task runs offline, behind a firewall, or on intermittent connectivity → use local memory.
3. **Check sovereignty**: if retention, deletion, or export must be fully under user control → use local memory.
4. **Check latency requirement**: if sub-100ms response is needed → use local memory.
5. **Check cost sensitivity**: if zero marginal cost is required → use local memory.
6. **Only then consider cloud**: if all criteria above are satisfied (data is non-sensitive, online, low sovereignty concern, latency-tolerant, cost-budgeted) AND the cloud provider offers capability unavailable locally (e.g., large-scale semantic search, cross-repository memory, collaborative access), then cloud may be chosen — with an explicit local fallback on every operation.

## Workflow

1. Classify scope: session-only, worktree, project, global user, or external provider.
2. Apply the cloud-vs-local decision rubric. Default to local unless all gates pass.
3. Prefer local project/worktree storage for repo facts; use session memory for transient coordination.
4. Apply opt-out rules before creating or loading memory; record the opt-out marker at the same scope it protects so future sessions do not re-enable it accidentally.
5. Keep project facts in project memory, worktree-specific facts in worktree/session memory, and never promote branch-only decisions to global memory without review.
6. Define retention: keep, expire, archive, or delete on branch cleanup.
7. If a provider is requested, require a local fallback and document what leaves the machine.
8. Record scope, retention, source, confidence, stale-risk, and opt-out labels.

## Outputs

- Storage/scoping decision with rubric evaluation.
- Local fallback plan when a provider is optional or rejected by rubric.
- Retention and opt-out notes.

## Failure modes

- Treating cloud memory as required.
- Mixing worktree-specific facts into global memory.
- Loading stale global notes into an unrelated project.
- Ignoring explicit opt-out or privacy constraints.
- Skipping the decision rubric and defaulting to cloud without evaluation.

## Verification checklist

- [ ] Scope is explicit: session, worktree, project, user, or provider.
- [ ] Cloud-vs-local decision rubric was evaluated (privacy, latency, offline, sovereignty, cost).
- [ ] Default was local unless all rubric gates cleared for cloud.
- [ ] Worktree-only facts are not leaking into project/global memory.
- [ ] Local-first behavior remains available.
- [ ] Opt-out marker and retention rules are documented at the protected scope.
- [ ] Provider use, if any, states exactly what data leaves local storage.
- [ ] Rubric evaluation is documented in the output.

## Applied / Not Applied

Applied as original wording from claude-mem-inspired persistent-context design: project/worktree memory scoping, opt-out tracking recorded at the scope they protect, and cloud-vs-local decision rubric with five criteria. Not applied: hosted services, background daemons, SQLite/vector storage, installers, or copied upstream text.

## Ghi chú tiếng Việt

Ưu tiên bộ nhớ cục bộ theo phạm vi rõ ràng. Dùng bảng quyết định cloud-vs-local với 5 tiêu chí (privacy, latency, offline, sovereignty, cost). Mặc định là local; chỉ dùng cloud khi tất cả các tiêu chí cho phép và có khả năng đặc biệt không có ở local.
