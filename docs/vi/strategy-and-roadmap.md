# Status, Goal chiến lược và Roadmap — Bản tiếng Việt

Tài liệu này tổng hợp review trạng thái repo và plan chiến lược để hoàn thiện Vibe Coding OS trong tương lai.

## 1. Status hiện tại

Vibe Coding OS hiện là framework v1.1.0 tập trung vào disciplined AI-assisted coding. Repo đã vượt qua nhiều chu kỳ release và đạt trạng thái ổn định với inventory validation đầy đủ:

- workflow mặc định `Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`;
- 68 command prompts cho init/spec/plan/implement/review/memory/merge/doctor/reference và các workflow mở rộng;
- 90 skills trong các nhóm core, agents, memory, meta, prompts và runtime-adjacent workflow;
- 54 templates cho spec, plan, task, review, memory, upstream audit, reference scorecard, memory redaction, release/governance, ADR và spec-driven development;
- adapters cho Claude Code, Codex, Cursor;
- Reference Intelligence Layer để học upstream có kiểm soát;
- 14 upstream sources được theo dõi và audit;
- package scripts cho validation và reference maintenance;
- CLI helper (`vibe init`, `vibe doctor`, `vibe stats`, `vibe list-skills`, `vibe list-commands`);
- behavioral eval scenarios và eval runner cơ bản;
- `validate:all` pass 18/18 gates, 0 broken refs, 0 orphan commands/skills, 11 orphan templates;
- trạng thái kế tiếp: v1.2 — runtime contracts v2, adoption UX, positioning.

## 2. Điểm mạnh

- Triết lý rõ: human intent sovereign, small correct changes, specs vừa đủ, verification trước done, memory an toàn, attribution sạch.
- Artifact coverage end-to-end: 90 skills + 68 commands + 54 templates + registries + examples.
- Reference Intelligence Layer là khác biệt mạnh vì giúp học upstream mà không copy/vendor bừa.
- Memory/privacy đã có conventions và redaction checklist.
- Adapter matrix giúp framework portable qua nhiều assistant.
- Validation kernel mạnh: 18/18 gates, traceability checks, reference integrity.
- CLI helper và doctor command hỗ trợ setup và health check.

## 3. Điểm yếu/rủi ro

- Templates còn skeleton, cần ví dụ điền thực tế cho người mới.
- Adapters còn lightweight, chưa có install snippets đủ cụ thể cho từng tool; cần snippets sâu hơn theo từng adapter.
- Một số upstream inspiration có license caveat; không được import nếu license/attribution chưa rõ.
- Orphan templates (11) cần review — có thể là legitimate standalone hoặc thiếu linking.
- Behavioral eval cần runner/report tự động hoàn chỉnh hơn.
- Adoption UX chưa tối ưu cho người mới bắt đầu.

## 4. Goal chiến lược 12–18 tháng

Biến Vibe Coding OS từ framework v1.1.0 đã có inventory/validation đầy đủ thành một framework vận hành AI coding mature, có thể cài đặt, kiểm chứng, đo lường và mở rộng — với trọng tâm:

- v1.1 → v1.2: runtime contracts v2, adoption UX cải thiện, positioning rõ ràng hơn cho thị trường AI coding framework.
- v1.2+: ecosystem mở rộng với contribution governance, marketplace/registry, và community adoption.

Nói ngắn:

```text
Vibe Coding OS = disciplined workflow layer for AI coding agents.
```

## 5. North Star Metric

**Verified Change Rate**: tỷ lệ task dùng Vibe Coding OS hoàn tất với spec/plan rõ ràng, test/check được chạy, review pass hoặc blockers rõ ràng, và merge readiness minh bạch.

```text
Verified Change Rate =
# tasks có Spec + Plan + Verification evidence + Review/Merge checklist
/
# tasks thực hiện bằng AI coding assistant
```

## 6. Roadmap đề xuất

### v0.1.1 — Validation Recovery & Vietnamese Onboarding ✅ Complete

Outcome: repo validate được, người dùng Việt có entrypoint rõ. **Trạng thái: đã hoàn tất.**

Deliverables:

- `npm run validate` pass.
- Tài liệu `docs/vi/` có index, commands/skills reference, folder/workflow guide, strategy roadmap.
- README link tới docs tiếng Việt.
- Known validation scope được report rõ trong PR/final message.

### v0.2 — Adoption MVP ✅ Complete

Outcome: người dùng mới setup và chạy workflow đầu tiên trong khoảng 10 phút. **Trạng thái: đã hoàn tất ở mức MVP.**

Deliverables:

- Quickstart 10 phút cho Claude Code, Codex, Cursor.
- Adapter-specific install snippets.
- 3–5 examples end-to-end có exact verification commands.
- `vibe-doctor` documented như health check chính.
- Memory redaction examples pass/fail.

### v0.3 — Evidence & Safety ✅ Complete

Outcome: framework có evidence về chất lượng/safety, không chỉ là artifact collection. **Trạng thái: đã hoàn tất nền tảng evidence/safety.**

Deliverables:

- Behavioral eval scenarios:
  - request mơ hồ → agent hỏi;
  - task non-trivial → spec trước implement;
  - chưa test → không claim done;
  - memory có secret → reject/redact;
  - upstream copy attempt → attribution/license gate block.
- Memory redaction tests.
- Import review scorecard mandatory.
- Reference report workflow ổn định.

### v0.4.0 — Packaging & Skill Packs ✅ Complete

Outcome: framework dễ dùng hơn, ít context overload. **Trạng thái: đã hoàn tất.**

Deliverables:

- Optional CLI helper MVP:
  - `vibe init --tool codex`
  - `vibe doctor`
  - `vibe spec --template`
  - `vibe plan --template`
  - `vibe memory --template`
- Curated skill packs:
  - Core Solo Developer Pack
  - Memory-Safe Pack
  - Multi-Agent Review Pack
  - Upstream Intelligence Pack
- Adapter smoke tests và versioned compatibility matrix.

### v1.0 — Trusted Workflow Framework ✅ Complete

Outcome: framework ổn định cho cá nhân/team nhỏ với governance rõ. **Trạng thái: đã hoàn tất.**

Deliverables:

- Stable core workflow contract.
- Stable registry schemas.
- Contribution governance cơ bản.
- Compatibility support policy.
- Safety/eval dashboard và release report.
- Release checklist.

### v1.1 — Current Release ✅

Outcome: inventory validation đầy đủ, 18/18 gates, 0 broken refs. **Trạng thái: release hiện tại v1.1.0 (2026-06-17).**

Deliverables:

- Inventory hoàn chỉnh: 90 skills, 68 commands, 54 templates.
- Validation kernel mở rộng: 18/18 gates pass.
- Traceability checks: 0 broken refs, 0 orphan commands/skills.
- 14 upstream sources tracked trong Reference Intelligence Layer.
- Orphan templates audit (11 orphan templates được identify và review).

### v1.2 — Runtime Contracts v2, Adoption UX & Positioning 🔄 Next

Outcome: runtime layer mature hơn, trải nghiệm người mới tốt hơn, positioning rõ ràng. **Trạng thái: planned — v1.2 roadmap đang được xây dựng.**

Deliverables (preview):

- Runtime contracts v2: interface rõ ràng hơn giữa Core và Runtime layer.
- Adoption UX improvements: onboarding flow mượt hơn, fewer friction points.
- Positioning: clearer value proposition cho AI coding framework market.
- Template examples: ví dụ điền thực tế cho người mới.
- Eval automation: runner/report tự động hoàn chỉnh hơn.

## 7. Priority stack

1. P0: giữ `npm run validate` pass 100% — 18/18 gates luôn xanh.
2. P1: v1.2 runtime contracts v2 — interface rõ ràng giữa Core và Runtime.
3. P1: adoption UX — onboarding flow mượt, fewer friction points.
4. P1: positioning — value proposition rõ ràng cho thị trường.
5. P1: template examples — ví dụ thực tế cho người mới.
6. P1: eval automation — runner/report tự động hoàn chỉnh.
7. P2: adapter snippets sâu hơn theo từng tool.
8. P2: orphan templates resolution — link hoặc justify standalone.
9. P2: compatibility smoke tests mở rộng.
10. P3: community contribution model và marketplace/registry ecosystem.

## 8. Metrics đề xuất

| Nhóm | Metric |
| --- | --- |
| Adoption | Time to first workflow, workflow completion rate, adapter adoption, pack usage |
| Quality | Verified Change Rate, spec coverage, plan coverage, verification evidence rate, review blocker catch rate |
| Safety | memory redaction pass rate, secret leakage count = 0, attribution completeness, unknown-license import count = 0 |
| Maintainability | validation pass rate (18/18 gates), registry drift count = 0, adapter drift count, audit freshness |

## 9. Tham mưu chiến lược

Nếu chỉ chọn 3 việc tiếp theo, nên chọn:

1. **Runtime contracts v2**: định nghĩa rõ interface giữa Core (skills/commands/templates/docs, zero deps) và Runtime (runtime/*.mjs, opt-in) để tránh scope creep.
2. **Adoption UX**: người mới phải hiểu folder/feature/workflow và chạy được một workflow trong 10 phút, ít friction hơn v1.0.
3. **Positioning**: xác định rõ Vibe Coding OS là gì, không phải là gì, và tại sao khác biệt so với alternatives — cần trước khi mở rộng ecosystem.
