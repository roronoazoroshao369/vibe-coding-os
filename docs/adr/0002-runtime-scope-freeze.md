# ADR 0002: Runtime Scope Freeze

**Status:** Accepted for v1.5.0
**Date:** 2026-01-10
**Deciders:** @roronoazoroshao369

## Status

Accepted for v1.5.0.

## Context

Vibe Coding OS is a **portable workflow contract + discipline layer**. The durable product surface is markdown-first: skills, commands, templates, docs, adapters, examples, and governance.

The optional runtime added useful local JSON state for tasks, memory, checkpoints, teams, sessions, events, MCP, and tmux team runs. After v1.4.3, the runtime is stable enough for local opt-in use, but its surface is large enough to create product gravity. Without an explicit freeze, contributors may treat runtime expansion as the default path for new ideas.

That would conflict with the core product strategy:

- workflow contract first;
- runtime optional;
- human intent sovereign;
- no hosted service, required daemon, database, or engine lock-in.

## Decision

Freeze the runtime scope after v1.4.3 / for v1.5.0.

The runtime remains an **optional companion**, not the product center. New capability ideas must land in the portable core first whenever possible:

- skills;
- commands;
- templates;
- docs;
- examples;
- adapters;
- reference intelligence;
- validation/reporting for those surfaces.

Runtime changes are allowed only when they fit one of these categories:

1. **Bug fix** — correct existing behavior without expanding scope.
2. **Security/safety hardening** — reduce risk in existing runtime boundaries.
3. **Compatibility maintenance** — keep existing runtime commands working across supported environments.
4. **Validation/test coverage** — improve confidence in existing behavior.
5. **Documentation** — clarify existing runtime use, limits, and non-goals.

## Frozen runtime surface

The frozen runtime surface includes:

- task store and task state machine;
- memory store and redaction;
- checkpoint evidence;
- team/session metadata;
- event store v2 and audit/replay/snapshot/migration helpers;
- config and policy helpers;
- MCP wrapper for existing tools;
- tmux team runner;
- validation and doctor/audit commands.

These modules may be maintained but should not grow into new product areas.

## Non-goals

Do not add, unless a future ADR explicitly overrides this freeze:

- hosted sync;
- remote scheduler;
- database-backed runtime;
- vector service as a required runtime dependency;
- GitHub issue sync engine;
- queue/worker daemon;
- browser automation runtime;
- live collaborative state server;
- additional MCP write tools beyond existing scope;
- runtime-first onboarding.

## Exception process

A runtime expansion requires a new ADR that passes the Engine Adoption Gate from `docs/UPSTREAM_ADOPTION_POLICY.md`.

The ADR must answer:

1. Why can this not be a skill, command, template, doc, example, adapter, or validation rule?
2. What existing runtime surface cannot represent it?
3. What new state, dependency, daemon, or security boundary does it introduce?
4. How will it remain optional and local-first?
5. What tests and rollback path exist?
6. How does it avoid making runtime the product center?

Default decision: reject runtime expansion.

## Consequences

Positive:

- Product identity stays clear.
- Contributors get a guardrail against feature sprawl.
- Adoption work focuses on portable workflows.
- Runtime remains maintainable.

Trade-offs:

- Some automation ideas will be expressed as docs/templates/examples instead of engines.
- Advanced users may need custom local integrations outside the core repo.
- Future runtime additions require higher governance overhead.

## Verification

Before release, run:

```bash
npm run validate:all
npm run runtime:behavior-tests
```

Expected:

- `validate:all`: 20/20 PASS
- runtime behavior aggregate: PASS
- traceability: 0 broken refs, 0 orphan commands/skills/templates

## Ghi chú tiếng Việt

Runtime đã đủ ổn định để dùng như lớp phụ trợ local, nhưng từ v1.5.0 sẽ **freeze scope**. Ý tưởng mới mặc định phải đi qua markdown core trước: skill, command, template, docs, example, adapter hoặc validation. Runtime chỉ sửa bug, hardening, compatibility, test và docs; không mở rộng thành product center.
