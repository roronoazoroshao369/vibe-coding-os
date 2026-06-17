# Status, Goal chiến lược và Roadmap — Bản tiếng Việt

> Cập nhật cho v1.4.0. Tài liệu này tóm tắt trạng thái repo hiện tại và hướng đi chiến lược.

## 1. Status hiện tại

Vibe Coding OS v1.4.0 là framework AI coding discipline layer với optional runtime kernel đã được harden. Core vẫn giữ nguyên triết lý markdown-first, zero-deps. Runtime là layer tùy chọn, inspection-friendly.

Trạng thái v1.4.0:

- workflow mặc định `Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`;
- 90 skills trong các nhóm core, agents, memory, meta, prompts;
- 68 command prompts cho init/spec/plan/implement/review/memory/merge/doctor/reference;
- 56 templates cho spec, plan, task, review, memory, upstream audit, scorecard, redaction, governance, ADR;
- adapters cho Claude Code, Codex CLI, Cursor, Gemini CLI;
- Reference Intelligence Layer với 14 upstream sources được theo dõi;
- Validation: `validate:all` **20/20 gates PASS**, 0 broken refs, 0 orphan commands/skills;
- CLI smoke tests: **70/70 PASS**;
- Runtime behavioral tests: **14/14 PASS**;
- Optional runtime kernel: config layer, task state machine, event store v2 (sequence numbers, correlation/causation, idempotency);
- Runtime observability: `vibe doctor --json`, `vibe events --json`;
- JSON contracts cho CLI automation surfaces.

## 2. Điểm mạnh

- Triết lý rõ: human intent sovereign, small correct changes, specs vừa đủ, verification trước done, memory an toàn, attribution sạch.
- Artifact coverage end-to-end: 90 skills + 68 commands + 56 templates + registries + examples.
- Reference Intelligence Layer là khác biệt mạnh vì giúp học upstream mà không copy/vendor bừa.
- Memory/privacy đã có conventions và redaction checklist.
- Adapter matrix giúp framework portable qua nhiều assistant.
- Validation kernel mạnh: 20/20 gates pass, traceability checks, reference integrity.
- CLI helper và doctor command hỗ trợ setup và health check.
- Runtime optional nhưng trustworthy: event store v2, state machine, observability.

## 3. Điểm yếu/rủi ro

- Runtime docs (RUNTIME-GUIDE.md) chưa cập nhật đầy đủ cho v1.4 features.
- Some runtime stores thiếu dedicated unit tests (session, team, memory, vector).
- tmux runner có shell escaping concern với `claudeCommand` interpolation.
- Schema validator hẹp — bỏ qua `format: "date-time"`, `uniqueItems`.
- Adoption UX cho người mới vẫn có thể cải thiện thêm.

## 4. Goal chiến lược

Biến Vibe Coding OS thành framework AI coding discipline layer mature: portable, trustworthy, inspectable.

- **Core identity:** markdown-first workflow contract + discipline layer (zero deps).
- **Runtime identity:** optional local JSON-first layer cho task tracking, event history, diagnostics.
- **v1.5+ direction:** adoption polish, ecosystem growth, community contribution model.

## 5. North Star Metric

**Verified Change Rate**: tỷ lệ task dùng Vibe Coding OS hoàn tất với spec/plan rõ ràng, test/check được chạy, review pass hoặc blockers rõ ràng, và merge readiness minh bạch.

## 6. Roadmap

### v1.0–v1.4 ✅ Released
- v1.0 — Trusted Workflow Framework
- v1.1 — Hardening (schema, workflow state, CLI, adapters, safety)
- v1.2 — Runtime schema v2, multi-agent contracts, migration tooling
- v1.3 — Runtime enforcement, claim/lease APIs, safety & recovery
- v1.4 — Runtime kernel, event store v2, observability, JSON contracts

### v1.5.0 — Next candidate
- Adoption polish: docs consistency, onboarding improvements, CLI UX
- Runtime boundary hardening: schema validation tightening, shell escaping fix
- Community model: contribution workflow, marketplace/registry exploration
