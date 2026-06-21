# Memory Safe Pack

> Quản lý memory/context an toàn — không leak secrets, không mất context.

## Khi Nào Dùng Pack Này

- Session dài, cần giữ context giữa các phiên
- Muốn lưu quyết định project bền vững
- Cần đảm bảo không lưu secrets/PII vào memory
- Working với team — cần handoff context

## Skills Trong Pack

| # | Skill | Path | Khi Dùng |
|---|-------|------|----------|
| 1 | Session Capture | `skills/memory/session-capture/SKILL.md` | Lưu session state trước khi context bị mất |
| 2 | Session Summarizer | `skills/memory/session-capture/SKILL.md` | Tóm tắt session ngắn gọn cho handoff |
| 3 | Privacy Filter | `skills/memory/project-memory/SKILL.md` | Lọc secrets/PII trước khi lưu memory |
| 4 | Observation Citations | `skills/memory/session-capture/SKILL.md` | Trích dẫn nguồn khi dùng memory cũ |
| 5 | Progressive Memory Disclosure | `skills/memory/session-capture/SKILL.md` | Load memory theo tầng, không load hết 1 lần |
| 6 | Memory Search | `skills/memory/memory-search/SKILL.md` | Tìm memory relevant trước khi làm task mới |
| 7 | Context Retrieval | `skills/memory/memory-search/SKILL.md` | Retrieve context theo progressive strategy |
| 8 | Agent Handoff | `skills/memory/session-capture/SKILL.md` | Handoff context giữa agents/sessions |
| 9 | Local First Memory | `skills/memory/project-memory/SKILL.md` | Ưu tiên memory local, fallback external |
| 10 | Project Memory | `skills/memory/project-memory/SKILL.md` | Lưu quyết định project bền vững |

## Commands对应

| Action | Command |
|--------|---------|
| Capture session | `vibe-session-capture` |
| Summarize | `vibe-session-summary` |
| Privacy check | `vibe-memory-privacy-check` |
| Search memory | `vibe-memory-search` |
| Ingest memory | `vibe-memory-ingest` |
| Retrieve context | `vibe-memory-retrieve` |
| Handoff | `vibe-handoff` |

## Memory Safety Checklist

Trước khi lưu bất kỳ memory entry nào:

- [ ] Không có API keys, passwords, tokens
- [ ] Không có PII (email, phone, address)
- [ ] Không có internal URLs/sensitive paths
- [ ] Có citation đến source/session
- [ ] Entry là factual, không phải TODO/temporary state

## Ví Dụ Workflow

```
Session bắt đầu:
    ↓ vibe-memory-retrieve (tìm context cũ)
    ↓ vibe-session-capture (lưu context mới)
    ↓ vibe-memory-privacy-check (lọc secrets)
    ↓ vibe-session-summary (tóm tắt cho session sau)
```

## Cách Kích Hoạt

```bash
# Load privacy filter TRƯỚC KHI bắt đầu bất kỳ session mới nào:
# "Load skills/memory/project-memory/SKILL.md trước khi làm việc"
```
