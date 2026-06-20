---
name: memory-architecture
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Architecture

## Purpose

Design the memory model: what kinds of observations exist, how they relate, how recency is represented, and which skills own each lifecycle step.

## When to use

Use when adding or reorganizing memory workflows, defining schemas, splitting memory responsibilities, or resolving overlap between ingestion/search/evaluation/provider skills.

## Inputs

- Memory use cases and non-goals.
- Existing memory skill layout and templates.
- Candidate observation types, relationship types, confidence labels, and recency rules.
- Privacy and local-first constraints.

## Workflow

1. Separate lifecycle roles: capture, ingest, search, inject, compress, cite, evaluate, configure, troubleshoot.
2. Define observation fields: source, scope, timestamp, confidence, stale-risk, sensitivity, and follow-up.
3. Model relationships explicitly with local-only relation types: `updates` (replaces a prior claim), `extends` (adds detail without replacing), `derives_from` (summarizes or infers from evidence), `contradicts`, and `supersedes`.
4. Mark current knowledge with an `isLatest` or equivalent recency note when older entries remain useful history; only latest non-contradicted entries should drive current work.
5. Keep the relation schema provider-neutral and storage-free; adapters may persist links, but the skill owns the meaning.
6. Map each responsibility to one skill to prevent duplicate workflows.
7. Add a **harness-scoped memory layer** for orchestrator-managed, session-bound
   ephemeral state. Unlike durable project memory or provider-backed storage, harness
   memory lives only for the duration of a SuperAgent orchestration session. It captures:
   - subtask lifecycle states (queued, planning, executing, reviewing, merging, complete);
   - inter-subtask handoff summaries and integration notes;
   - ephemeral findings that are too granular for durable memory but too important to
     lose mid-session;
   - orchestrator decisions, rescoping events, and stall flags.
   Harness memory is managed by the orchestrator, cleared at session end (unless
   explicitly promoted to durable memory), and follows the same observation field
   conventions (source, scope, timestamp, confidence, stale-risk) as other memory
   layers.

## Outputs

- Memory schema or responsibility map.
- Relationship and recency conventions.
- Notes on overlaps removed or deferred.

## Failure modes

- Designing a runtime engine instead of a prompt-portable workflow.
- Letting multiple skills own the same lifecycle step.
- Missing contradiction or supersession semantics.
- Treating recency as truth without confidence/source checks.

## Verification checklist

- [ ] Each lifecycle role has one clear owning skill.
- [ ] Relationship types and recency labels are documented.
- [ ] Provider/storage choices are not hardcoded into the architecture.
- [ ] Privacy and local-first constraints are preserved.

## Applied / Not Applied

Applied as original wording from Supermemory-inspired agent-memory design and claude-mem-inspired persistent-context design: explicit relation typing, temporal latest markers, and provider-neutral memory architecture. Not applied: hosted memory services, SDK clients, hook daemons, storage engines, database schemas, or copied upstream text.

## Ghi chú tiếng Việt

Dùng kỹ năng này để thiết kế mô hình bộ nhớ: loại quan sát, quan hệ, độ mới, phạm vi, và skill nào chịu trách nhiệm. Không biến nó thành engine runtime.
