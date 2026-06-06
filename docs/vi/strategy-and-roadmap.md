# Status, Goal chiến lược và Roadmap — Bản tiếng Việt

Tài liệu này tổng hợp review trạng thái repo và plan chiến lược để hoàn thiện Vibe Coding OS trong tương lai.

## 1. Status hiện tại

Vibe Coding OS hiện là một framework v0.1 tập trung vào disciplined AI-assisted coding. Repo đã có:

- workflow mặc định `Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`;
- command prompts cho init/spec/plan/implement/review/memory/merge/doctor/reference;
- 19 skills trong các nhóm core, agents, memory, prompts;
- templates cho spec, plan, task, review, memory, upstream audit, reference scorecard, memory redaction;
- adapters cho Claude Code, Codex, Cursor;
- Reference Intelligence Layer để học upstream có kiểm soát;
- package scripts cho validation và reference maintenance.

## 2. Điểm mạnh

- Triết lý rõ: human intent sovereign, small correct changes, specs vừa đủ, verification trước done, memory an toàn, attribution sạch.
- Artifact coverage end-to-end: commands + skills + templates + registries + examples.
- Reference Intelligence Layer là khác biệt mạnh vì giúp học upstream mà không copy/vendor bừa.
- Memory/privacy đã có conventions và redaction checklist.
- Adapter matrix giúp framework portable qua nhiều assistant.

## 3. Điểm yếu/rủi ro

- Validation repo-level từng bị blocker do syntax error trong `scripts/validate-repo.mjs`; validation phải là P0 vì framework claim reliability dựa vào nó.
- Adapters còn lightweight, chưa có install snippets đủ cụ thể cho từng tool.
- Templates còn skeleton, cần ví dụ điền thực tế cho người mới.
- Chưa có CLI helper hoặc packaging giúp setup nhanh.
- Chưa có behavioral eval để đo agent có thật sự hỏi khi mơ hồ, spec trước code, verify trước done hay không.
- Một số upstream inspiration có license caveat; không được import nếu license/attribution chưa rõ.
- Trước thay đổi này, chưa có tài liệu tiếng Việt làm entrypoint cho người dùng Việt.

## 4. Goal chiến lược 12–18 tháng

Biến Vibe Coding OS từ một kernel prompt/skill v0.1 thành một framework vận hành AI coding có thể cài đặt, kiểm chứng, đo lường và mở rộng qua nhiều assistant/toolchain — với trọng tâm giảm lỗi do ambiguity, thiếu verification, context/memory sai và scope creep.

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

### v0.1.1 — Validation Recovery & Vietnamese Onboarding

Outcome: repo validate được, người dùng Việt có entrypoint rõ.

Deliverables:

- `npm run validate` pass.
- Tài liệu `docs/vi/` có index, commands/skills reference, folder/workflow guide, strategy roadmap.
- README link tới docs tiếng Việt.
- Known validation scope được report rõ trong PR/final message.

### v0.2 — Adoption MVP

Outcome: người dùng mới setup và chạy workflow đầu tiên trong khoảng 10 phút.

Deliverables:

- Quickstart 10 phút cho Claude Code, Codex, Cursor.
- Adapter-specific install snippets.
- 3–5 examples end-to-end có exact verification commands.
- `vibe-doctor` documented như health check chính.
- Memory redaction examples pass/fail.

### v0.3 — Evidence & Safety

Outcome: framework có evidence về chất lượng/safety, không chỉ là artifact collection.

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

### v0.4 — Packaging & Skill Packs

Outcome: framework dễ dùng hơn, ít context overload.

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

### v1.0 — Trusted Workflow Framework

Outcome: có thể dùng bền vững cho cá nhân/team nhỏ với governance rõ.

Deliverables:

- Stable core workflow contract.
- Stable registry schemas.
- Contribution governance.
- Compatibility support policy.
- Safety/eval dashboard hoặc release report.
- Release checklist.

## 7. Priority stack

1. P0: giữ `npm run validate` pass 100%.
2. P1: quickstart + adapter install snippets.
3. P1: examples có thể kiểm chứng.
4. P1: memory safety/redaction tests.
5. P1: reference intake scorecard + import review.
6. P2: optional CLI helpers.
7. P2: compatibility smoke tests.
8. P2: skill packs giảm context overload.
9. P3: governance/contribution model.
10. P3: marketplace/registry ecosystem nếu framework public/team-scale.

## 8. Metrics đề xuất

| Nhóm | Metric |
| --- | --- |
| Adoption | Time to first workflow, workflow completion rate, adapter adoption, pack usage |
| Quality | Verified Change Rate, spec coverage, plan coverage, verification evidence rate, review blocker catch rate |
| Safety | memory redaction pass rate, secret leakage count = 0, attribution completeness, unknown-license import count = 0 |
| Maintainability | validation pass rate, registry drift count = 0, adapter drift count, audit freshness |

## 9. Tham mưu chiến lược

Nếu chỉ chọn 3 việc tiếp theo, nên chọn:

1. **Bảo vệ validation kernel**: mọi registry/script/docs structural change phải chạy `npm run validate`.
2. **Biến docs thành onboarding proof**: người mới phải hiểu folder/feature/workflow và chạy được một workflow trong 10 phút.
3. **Đóng gói evidence loop**: examples + redaction tests + import scorecards + adapter smoke checks để chứng minh framework giúp vibe coding có kỷ luật hơn.
