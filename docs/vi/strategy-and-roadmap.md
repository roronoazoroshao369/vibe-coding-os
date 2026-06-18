# Status, Goal chiến lược và Roadmap — Bản tiếng Việt

> Cập nhật cho v1.6.0. Tài liệu này tóm tắt trạng thái repo hiện tại và hướng đi chiến lược.

## 1. Status hiện tại

Vibe Coding OS v1.5.0 là framework AI coding discipline layer với optional runtime kernel đã được harden và freeze scope. Core vẫn giữ nguyên triết lý markdown-first, zero-deps. Runtime là layer tùy chọn, inspection-friendly, chỉ bảo trì theo ADR 0002 trừ khi có exception rõ ràng.

Trạng thái v1.5.0:

- workflow mặc định `Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`;
- 90 skills trong các nhóm core, agents, memory, meta, prompts;
- 68 command prompts cho init/spec/plan/implement/review/memory/merge/doctor/reference;
- 56 templates cho spec, plan, task, review, memory, upstream audit, scorecard, redaction, governance, ADR;
- adapters cho Claude Code, Codex CLI, Cursor, Gemini CLI;
- Reference Intelligence Layer với 14 upstream sources được theo dõi;
- Validation: `validate:all` **20/20 gates PASS**, 0 broken refs, 0 orphan commands/skills;
- CLI smoke tests: **70/70 PASS**;
- Runtime behavioral tests: **14/14 test files PASS**;
- Optional runtime kernel: config layer, task state machine, event store v2 (sequence numbers, correlation/causation, idempotency);
- Hardening runtime: `claimTask()` từ chối terminal states, `maxTaskLease` được áp dụng trên tất cả lease paths;
- README giảm từ 618 → 268 dòng, README.vi.md giảm từ 536 → 194 dòng, `docs/README.md` là docs navigation hub.

## 2. Điều chỉnh strategic focus

Sau v1.4.0 → v1.5.0, strategic focus được xác nhận lại:

| Vấn đề | Phân tích | Hành động |
|---------|-----------|-----------|
| Quá nhiều thứ trong README | README 618 dòng làm loãng thông điệp core | ✅ README diet xong, còn ~268 dòng |
| Runtime hardening chưa đủ | Warnings từ Expert Council v1.4.2 | ✅ lease caps, terminal state guard, process.exit thrown |
| New user onboarding chưa rõ | INSTALL/QUICKSTART/FIRST-WORKFLOW overlap | ✅ doc roles đã clear, docs/README.md là hub |
| Runtime lock freeze | Cần tránh perception runtime lock-in | ✅ ADR 0002 tuyên bố runtime scope freeze từ v1.5.0 |
| Stale VI docs | Strategy doc còn ở mốc v1.4.x | ✅ updated lên v1.5.0 |

## 3. Goal chiến lược hiện tại

**Mục tiêu:** Vibe Coding OS là **portable workflow contract + discipline layer** số 1 cho AI-assisted coding. Runtime là optional companion.

Bốn trụ cột:

1. **Core workflow contract** — spec → plan → implement → verify → memory → merge, portable mọi tool.
2. **Adoption trust** — docs rõ, onboarding nhanh, product identity sắc nét.
3. **Optional runtime** — hardened nhưng frozen: không thêm feature mới, chỉ bảo trì.
4. **Quality Elevation** — nâng chất lượng AI coding agent ngay cả khi dùng model trung bình/mid-tier bằng prompt discipline, rules, skills, quản lý knowledge/context, workflow discipline, verification gates, self-review, adversarial review và model-adaptive intelligence.

**Công thức chất lượng:** Agent Quality = Model Capability × Context Quality × Workflow Discipline × Verification Feedback.

## 4. Version roadmap

| Version | Scope | Status | Ghi chú |
|---------|-------|--------|---------|
| v1.0.0 | Foundation: structure, commands, skills, templates | ✅ Released | n/a |
| v1.1.0 | Reference Intelligence Layer, X% more reach | ✅ Released | mở rộng inventory |
| v1.4.0 | Runtime kernel + core stabilization | ✅ Released | P0: runtime không phá validate |
| v1.4.1 | Release polish: CLI cleanup, docs trust fix | ✅ Released | CHANGELOG retroactive, support-matrix version-neutral |
| v1.4.2 | Runtime hardening: lease caps, terminal guard, tmux safety | ✅ Released | State machine fix, absolute lease cap |
| v1.4.3 | Operational hygiene: shell safety, docs hub, config validation | ✅ Released | docs hub, 0 orphan templates |
| **v1.5.0** | **Core adoption + runtime scope freeze** | ✅ **Released** | ADR 0002, README.vi diet, QUICKSTART tiếng Việt |
| **v1.6.0** | **Adoption Trust + Quality Elevation kick-off** | 🔄 **In progress** | docs/onboarding/landing improvements (Sprint 1) |
| **v1.7.0** | **Quality Shield** | 🔄 **In progress** | Quality Rubric, Quality Execution Contract, Self-Review, AGENTS.md Template, Code Context Pack, Pattern Library, Quality Diff Audit Script |
| **v1.8.0** | **Expert Mode** | 📋 **Planned** | Adversarial Code Review, Critique Pass Protocol, Task-Specific Quality Packs, Writer-Critic Pair / Quality Council |
| **v1.9.0** | **Smart Adapt** | 📋 **Planned** | Model Weakness Memory, Adaptive Prompt Selection, Quality Score Card, Lessons Learned DB / Golden Example Library v2 |

## 5. Metrics

| Metric | v1.4.0 | v1.5.0 | Trend |
|--------|--------|--------|-------|
| validate:all | 20/20 | 20/20 | ✅ ổn định |
| Skills | 90 | 90 | Giữ nguyên |
| Commands | 68 | 68 | Giữ nguyên |
| Templates | 56 | 56 | Giữ nguyên |
| Sources tracked | 14 | 14 | Giữ nguyên |
| Runtime tests | 14/14 | 14/14 test files | ✅ aggregate reconciled |
| CLI smoke tests | 70/70 | 70/70 | ✅ ổn định |
| README dòng | 618 | 268 | ✅ giảm ~57% |
| README.vi.md dòng | 536 | 194 | ✅ giảm ~64% |
| Orphan templates | 11 | 0 | ✅ đã resolve qua docs hub |

## 6. Rủi ro hiện tại

- **Runtime lock-in perception:** đã giảm bằng ADR 0002 và freeze language trong docs; tiếp tục giữ runtime ở chế độ bảo trì.
- **Docs drift:** cần duy trì sync cho tài liệu release-facing khi có thay đổi inventory, validator hoặc roadmap.
- **Onboarding adoption:** cần đo feedback từ người dùng mới sau README diet và QUICKSTART tiếng Việt.
- **Runtime exception creep:** mọi mở rộng runtime phải qua ADR 0002 exception process + Engine Adoption Gate.

## 7. Next steps

1. ✅ Hoàn thành v1.4.3: operational hygiene + config validation + docs hub
2. ✅ Tuyên bố runtime scope freeze qua ADR 0002 trong v1.5.0
3. ✅ Resolve orphan templates bằng docs hub
4. 🔄 **v1.6.0 Adoption Trust** — cải thiện docs/onboarding/landing (đang tiến hành Sprint 1)
5. ✅ **v1.7.0 Quality Shield** — Canonical guide [`docs/quality-shield.md`](../quality-shield.md) đã hoàn tất; tài liệu Quality Shield hiện tại gồm rubric, execution contract, self-review, code context pack, compact AGENTS.md template, repo map starter, quality diff audit, evaluation scenarios, và scorecard. Boundary giữa **Quality Shield** (portable markdown discipline) và **Quality Engine** (orchestration/future) đã được xác nhận trong tài liệu trung tâm.
6. ⏭️ **v1.8.0 Expert Mode** — Adversarial Code Review, Critique Pass Protocol, Task-Specific Quality Packs, Writer-Critic Pair / Quality Council
7. ⏭️ **v1.9.0 Smart Adapt** — Model Weakness Memory, Adaptive Prompt Selection, Quality Score Card, Lessons Learned DB / Golden Example Library v2

**Công thức nền tảng:** Agent Quality = Model Capability × Context Quality × Workflow Discipline × Verification Feedback.

> **Nguyên tắc:** Workflow contract first. Runtime optional. Human intent stays sovereign.
