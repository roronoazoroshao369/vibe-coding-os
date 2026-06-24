# Status, Goal chiến lược và Roadmap — Bản tiếng Việt

> Cập nhật cho v2.18.0 ngày 2026-06-23. Tài liệu này là bản tóm tắt tiếng Việt; source-of-truth chính là `ROADMAP.md`, `docs/ROADMAP-STATUS.md`, `CHANGELOG.md` và `scripts/repo-metadata.mjs`.

## 1. Status hiện tại

Vibe Coding OS v2.18.0 là framework markdown-first cho AI-assisted coding discipline. Core vẫn là workflow portable `spec → plan → implement → verify → remember`; runtime là local-only optional companion, không phải platform bắt buộc.

Trạng thái v2.18.0:

- `validate:all` **14/14 gates PASS**;
- **112 skills**, **115 commands**, **107 templates**;
- **22 tracked sources**, **9 adapters**;
- Core 10 golden path đã được đưa lên làm entrypoint chính trong `docs/CORE-10.md`;
- README và README.vi đã được rút gọn để chỉ giữ release hiện tại, entrypoint chính và link tới CHANGELOG;
- `scripts/repo-metadata.mjs` là source-of-truth cho release-facing counts;
- `scripts/validate-docs-sync.mjs` bắt lệch giữa README, README.vi, ROADMAP, ROADMAP-STATUS, DASHBOARD và command manifest;
- long-term roadmap v2.19 → v3.0 đã được promote thành canonical plan tại `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md`.

## 2. Goal chiến lược hiện tại

**Mục tiêu:** Vibe Coding OS là portable workflow contract + discipline layer cho AI-assisted software work. Runtime chỉ là helper local tùy chọn.

Bốn trụ cột:

1. **Core workflow contract** — intent → spec → plan → implement → test → review → memory → merge.
2. **Surface simplification** — người mới bắt đầu bằng Core 10, không bị lạc trong kho prompt/tool quá lớn.
3. **Verification-oriented quality** — green gate phải đi kèm evidence, không chỉ metadata đúng hình thức.
4. **Sustainability** — giảm bus-factor risk, giữ release cadence lành mạnh, đưa quyết định bền vững vào living docs.

Công thức nền tảng: **Agent Quality = Model Capability × Context Quality × Workflow Discipline × Verification Feedback.**

## 3. Roadmap hiện tại

| Mốc | Theme | Status | Ghi chú |
|---|---|---|---|
| v2.18.0 | Surface Simplification | ✅ Complete / maintain | Core 10, privacy coverage, maintainer runbook, docs/source sync |
| v2.19.0 | Behavior over Shape | Planned | Runtime e2e behavior tests, FTQS baseline |
| v2.20.0 | One Front Door | Planned | Discovery command, surface reduction, count drift prevention |
| v2.21.0 | Structural Uniformity | Planned | Single persistence choke-point, approval/privacy consistency, init-path consolidation |
| v2.22.0 | Two Hands on the Wheel | Planned | Co-maintainer on-ramp, fixed cadence, bus-factor metrics |
| v3.0.0 | Proven Discipline | Planned | Consolidated, behavior-proven, maintainable framework |

Chi tiết roadmap nằm ở:

- `ROADMAP.md` — mission, principles, active roadmap;
- `docs/ROADMAP-STATUS.md` — status summary đến v2.18.0;
- `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md` — kế hoạch chất lượng dài hạn.

## 4. Source-of-truth policy

| Dữ liệu | Source |
|---|---|
| Version | `package.json` |
| Validation gates | `package.json:scripts.validate:all` |
| Skills | filesystem `skills/<category>/<name>/SKILL.md`, không tính root aggregator |
| Commands | `commands/manifest.json` active public list |
| Templates | `templates/manifest.json` active list |
| Dashboard/status sync | `scripts/repo-metadata.mjs`, `scripts/validate-docs-sync.mjs`, `scripts/check-dashboard-sync.mjs` |

Command count trong headline là active public command count. File compatibility cũ có thể còn tồn tại trên disk để tránh phá workflow cũ, nhưng không tính vào public inventory.

## 5. Rủi ro hiện tại

| Rủi ro | Trạng thái | Hành động |
|---|---|---|
| Docs/stat drift | Đang được guard | `validate:docs-sync` fail nếu release-facing docs lệch metadata |
| Surface quá lớn | Đã giảm, còn cần tiếp tục | Core 10 là entrypoint; v2.20 nhắm tới one front door và surface reduction |
| Behavior chưa được chứng minh đủ | Còn mở | v2.19 ưu tiên behavior tests và FTQS |
| Bus factor | Còn rủi ro | MAINTAINERS có runbook; v2.22 tập trung co-maintainer/on-ramp |
| Runtime consistency | Còn deferred item | v2.21/v2.22 xử lý init-path và cross-cutting uniformity |

## 6. Next steps

1. Giữ `README.md`, `README.vi.md`, `ROADMAP.md`, `docs/ROADMAP-STATUS.md`, `docs/DASHBOARD.md` đồng bộ với `scripts/repo-metadata.mjs`.
2. Khi thay đổi count/gate/version, chạy `npm run count:all`, `npm run dashboard:check`, `npm run validate:docs-sync`.
3. Tiếp tục v2.19 theo hướng **Behavior over Shape**: runtime e2e tests, doctor edge cases, FTQS benchmark.
4. Không thêm surface mới nếu chưa có lý do rõ và chưa offset bằng merge/delete/demotion.

> Nguyên tắc: Workflow contract first. Runtime optional. Human intent stays sovereign.
