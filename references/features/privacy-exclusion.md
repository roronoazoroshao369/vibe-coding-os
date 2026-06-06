# Feature: Privacy Exclusion

## Goal

Block secrets and unnecessary sensitive data from memory before storage, retrieval, or sharing.

## Reference sources

- `references/sources/thedotmack-claude-mem.md` for `claude-mem`-inspired persistent context lifecycle ideas.
- `references/changelogs/thedotmack-claude-mem.md` for audit history and applied/not-applied decisions.
- Existing Supermemory-inspired local docs such as `references/features/memory-retrieval.md`, `references/features/memory-search.md`, `references/features/memory-privacy.md`, and `references/features/local-first-memory.md` for overlap control.

## Local implementation

Local implementation is documentation-first and runtime-neutral. It uses skills, commands, templates, workflows, mappings, and optional adapter contracts rather than importing upstream services or schemas. Related local files are mapped in `references/mappings/feature-to-local-files.md`.

## Applied upstream ideas

- Apply privacy tags and opt-out/exclusion concepts as original Vibe Coding OS procedures.
- Keep memory local-first, concise, source-aware, and useful to future agents.
- Require explicit privacy review before storing or injecting memory.
- Prefer IDs, summaries, and citations over raw transcript storage.

## Not applied upstream ideas

- No `claude-mem` dependency, worker service, installer clone, database schema, vector database, local web UI clone, gateway integration, beta/endless mode, copied hook scripts, or vendored upstream docs/code.
- No assumption that one harness owns memory; Vibe Coding OS keeps Claude, Codex, Cursor, and IDE use portable.

## Must-have behavior

- Record source, scope, confidence, staleness risk, sensitivity, and follow-up owner where applicable.
- Preserve privacy exclusions before storage and before context injection.
- Avoid full transcripts unless a human explicitly approves and privacy review passes.
- Make retrieval progressive and citation-backed.
- Document applied and not-applied upstream ideas whenever the feature changes.

## Failure modes

- Saving secrets, tokens, private keys, credentials, or unnecessary personal data.
- Injecting too much stale memory into a task.
- Treating compressed memory as certain when it is inferred or outdated.
- Duplicating existing memory skills instead of cross-linking them.
- Building runtime infrastructure without a separate approved task.

## Update signals

- Upstream changes lifecycle hooks, compression, search, progressive disclosure, privacy controls, context configuration, observation citations, plugin packaging, or storage/search architecture.
- Local memory skills, commands, templates, or adapter contracts change names or semantics.

## Evaluation ideas

- Can a new agent resume a task with only safe, relevant context?
- Are memory entries concise and supported by IDs or source citations?
- Are stale, contradictory, or uncertain memories labeled?
- Does the process work without network access or external providers?
- Can privacy exclusions be audited before and after compression?

## Ghi chú tiếng Việt

Tính năng này biến ý tưởng từ `claude-mem` thành quy trình cục bộ của Vibe Coding OS. Hãy ghi nhớ ngắn gọn, có nguồn, có mức tin cậy, và không lưu bí mật; chỉ xây runtime thật trong một PR/tác vụ riêng khi người dùng yêu cầu rõ ràng.
