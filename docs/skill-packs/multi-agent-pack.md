# Multi-Agent Orchestration Pack

> Phân công việc cho team agent — có roles, handoff, ownership rõ ràng.

## Khi Nào Dùng Pack Này

- Task phức tạp, cần nhiều chuyên gia
- Muốn chia việc song song cho subagents
- Cần review independent giữa các role
- Project lớn cần architecture + implementation + testing + review riêng

## Skills Trong Pack

| # | Skill | Path | Khi Dùng |
|---|-------|------|----------|
| 1 | Team Agent Orchestration | `skills/core/team-agent-orchestration/SKILL.md` | Thiết kế team architecture |
| 2 | Subagent Driven Development | `skills/core/subagent-driven-development/SKILL.md` | Giao việc cho subagents |
| 3 | Agent Handoff | `skills/memory/agent-handoff/SKILL.md` | Handoff context giữa agents |
| 4 | Team Agent Architecture | `skills/core/team-agent-orchestration/SKILL.md` | Define roles, write scopes, handoff contracts |

## Team Roles

| Role | Responsibility | Write Scope | Read Scope |
|------|---------------|-------------|------------|
| **Architect** | Thiết kế hướng kỹ thuật | Design docs, ADR, interfaces | Everything |
| **Implementer** | Code theo plan | `src/` assigned modules | Types, interfaces, docs |
| **Tester** | Viết & chạy tests | `__tests__/`, test fixtures | All source code |
| **Reviewer** | Review correctness | Review reports | Everything |
| **Memory Architect** | Quản lý context | Memory/handoff docs | Session state |

## Workflow

```
1. vibe-team (team architecture)
   → Define roles, write scopes, handoff contracts
   → Output: team-spec.json

2. vibe-team-generate (scaffold)
   → Generate role briefs from team spec
   → Output: role-brief-*.md files
   → Command doc: `commands/vibe-team-generate.md`

3. vibe-subagents (execute)
   → Spawn subagents per role
   → Parallel execution where possible
   → Output: artifacts per role

4. Independent Review
   → Each role reviews others' work
   → No self-review allowed

5. vibe-verify (final verification)
   → Cross-check all artifacts
   → Output: verification report
```

## Commands对应

| Phase | Command |
|-------|---------|
| Design team | `vibe-team` |
| Generate briefs | `vibe-team-generate` |
| Spawn agents | `vibe-subagents` |
| Handoff | `vibe-handoff` |
| Review | `vibe-request-review` |
| Verify | `vibe-verify` |

## Ownership Rules

- Mỗi file chỉ MỘT role được write
- Reviewer không được review code của chính mình
- Memory Architect giữ context chung, không code
- Architect define interfaces, không implement

## Ví Dụ Workflow

```
Task: "Xây notification system"

1. vibe-team → Define 4 roles: Architect, Implementer, Tester, Reviewer
2. vibe-team-generate → Scaffold role briefs
3. Parallel:
   - Architect: design data model + interfaces
   - Implementer: build pipeline + providers
   - Tester: write integration tests
4. Reviewer: independent security + reliability review
5. vibe-verify: cross-check all artifacts
6. vibe-finish-branch: merge-ready
```

## Cách Kích Hoạt

```bash
# Bắt đầu multi-agent task:
# 1. "Use vibe-team skill to design team architecture"
# 2. "Use vibe-team-generate to scaffold role briefs"
# 3. "Use vibe-subagents to execute parallel work"
```
