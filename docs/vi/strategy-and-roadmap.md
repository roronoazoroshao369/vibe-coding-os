# Status, Goal chiến lược và Roadmap — Bản tiếng Việt

> Cập nhật cho v1.4.2. Tài liệu này tóm tắt trạng thái repo hiện tại và hướng đi chiến lược.

## 1. Status hiện tại

Vibe Coding OS v1.4.2 là framework AI coding discipline layer với optional runtime kernel đã được harden. Core vẫn giữ nguyên triết lý markdown-first, zero-deps. Runtime là layer tùy chọn, inspection-friendly.

Trạng thái v1.4.2:

- workflow mặc định `Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`;
- 90 skills trong các nhóm core, agents, memory, meta, prompts;
- 68 command prompts cho init/spec/plan/implement/review/memory/merge/doctor/reference;
- 56 templates cho spec, plan, task, review, memory, upstream audit, scorecard, redaction, governance, ADR;
- adapters cho Claude Code, Codex CLI, Cursor, Gemini CLI;
- Reference Intelligence Layer với 14 upstream sources được theo dõi;
- Validation: `validate:all` **20/20 gates PASS**, 0 broken refs, 0 orphan commands/skills;
- CLI smoke tests: **70/70 PASS**;
- Runtime behavioral tests: **18/18 PASS**;
- Optional runtime kernel: config layer, task state machine, event store v2 (sequence numbers, correlation/causation, idempotency);
- Hardening runtime: `claimTask()` từ chối terminal states, `maxTaskLease` được áp dụng trên tất cả lease paths;
- README giảm từ 618 → 250 dòng, `docs/README.md` là docs navigation hub mới.

## 2. Điều chỉnh strategic focus

Sau v1.4.0 → v1.4.2, strategic focus được xác nhận lại:

| Vấn đề | Phân tích | Hành động |
|---------|-----------|-----------|
| Quá nhiều thứ trong README | README 618 dòng làm loãng thông điệp core | ✅ README diet xong, còn 250 dòng |
| Runtime hardening chưa đủ | Warnings từ Expert Council v1.4.2 | ✅ lease caps, terminal state guard, process.exit thrown |
| New user onboarding chưa rõ | INSTALL/QUICKSTART/FIRST-WORKFLOW overlap | ✅ doc roles đã clear, docs/README.md là hub |
| Runtime lock freeze | Chưa có freeze declaration | ⏳ Tuyên bố freeze runtime sau v1.4.3 |
| Stale VI docs | v1.4.0 strategy doc cũ | ✅ updated lên v1.4.2 |

## 3. Goal chiến lược hiện tại

**Mục tiêu:** Vibe Coding OS là **portable workflow contract + discipline layer** số 1 cho AI-assisted coding. Runtime là optional companion.

Ba trụ cột:

1. **Core workflow contract** — spec → plan → implement → verify → memory → merge, portable mọi tool.
2. **Adoption trust** — docs rõ, onboarding nhanh, product identity sắc nét.
3. **Optional runtime** — hardened nhưng frozen: không thêm feature mới, chỉ bảo trì.

## 4. Version roadmap

| Version | Scope | Status | Ghi chú |
|---------|-------|--------|---------|
| v1.0.0 | Foundation: structure, commands, skills, templates | ✅ Released | n/a |
| v1.1.0 | Reference Intelligence Layer, X% more reach | ✅ Released | mở rộng inventory |
| v1.4.0 | Runtime kernel + core stabilization | ✅ Released | P0: runtime không phá validate |
| v1.4.1 | Release polish: CLI cleanup, docs trust fix | ✅ Released | CHANGELOG retroactive, support-matrix version-neutral |
| v1.4.2 | Runtime hardening: lease caps, terminal guard, tmux safety | ✅ Released | State machine fix, absolute lease cap |
| **v1.4.3** | **Operational hygiene: shell safety, docs hub, config validation** | 🔄 **In progress** | *Sprint hiện tại* |
| v1.5.0 | Core contract expansion / adoption push | ⏳ Sau v1.4.3 | Runtime frozen từ đây |

## 5. Metrics

| Metric | v1.4.0 | v1.4.2 | Trend |
|--------|--------|--------|-------|
| validate:all | 20/20 | 20/20 | ✅ ổn định |
| Skills | 90 | 90 | Giữ nguyên |
| Commands | 68 | 68 | Giữ nguyên |
| Templates | 56 | 56 | Giữ nguyên |
| Sources tracked | 14 | 14 | Giữ nguyên |
| Runtime tests | 14/14 | 18/18 | ✅ +4 tests |
| CLI smoke tests | 70/70 | 70/70 | ✅ ổn định |
| README dòng | 618 | 250 | ✅ giảm 60% |
| Orphan templates | 11 | — | ⏳ cần classify |

## 6. Rủi ro hiện tại

- **Runtime lock-in perception:** cần tuyên bố freeze public — runtime không thêm feature mới kể từ v1.5.0.
- **README chỉ có tiếng Anh:** README.vi.md vẫn còn dài (533 dòng), cần sync sau khi README diet hoàn tất.
- **11 orphan templates:** các template có status `draft` từ v1.1. Cần quyết định: archive hoặc implement.
- **Tài liệu cho người mới:** `docs/vi/TUTORIAL.vi.md` và `docs/vi/FIRST-WORKFLOW.md` cần kiểm tra đồng bộ với bản EN.

## 7. Next steps

1. ✅ Hoàn thành v1.4.3: operational hygiene + config validation + docs hub
2. ⏳ Tuyên bố runtime freeze
3. ⏳ Quyết định số phận 11 orphan templates
4. ⏳ Mở v1.5.0 planning — core contract hoặc adoption push

> **Nguyên tắc:** Workflow contract first. Runtime optional. Human intent stays sovereign.
