# Skill: Shared Domain Language

## Purpose

Keep a small, durable vocabulary that makes humans, agents, docs, and code use the same domain terms — including an explicit list of synonyms to avoid and a running log of ambiguities and how they were resolved.

## When to use

Use when terms are ambiguous, when a project has repeated concepts that get named inconsistently, when a change introduces new nouns or workflows, or when two words are quietly being used for the same thing.

## Inputs

Current terminology, code names, docs, user language, and conflicts between competing terms.

## CONTEXT glossary format

Maintain the vocabulary in `CONTEXT.md` (or the project-context doc) using a fixed shape so entries stay scannable and enforceable:

- **Term entry.** The canonical term in bold, a one-to-two sentence definition by *behavior and boundaries* (what it is, what holds it, what it does), and an `_Avoid:_` line listing the banned synonyms for that term. Cross-link other canonical terms in the definition so relationships are visible.

  ```markdown
  **Issue tracker**
  The tool that hosts a repo's issues (GitHub Issues, Linear, a local markdown convention).
  Holds many **Issues**.
  _Avoid:_ backlog, backlog manager, backlog backend, issue host

  **Issue**
  A single tracked unit of work inside an **Issue tracker** — a bug, task, or slice.
  _Avoid:_ ticket (only when quoting an external system that calls them tickets)
  ```

- **Relationships block.** A few lines stating how the canonical terms relate ("an **Issue tracker** holds many **Issues**"; "an **Issue** carries one **Triage role** at a time"). This is what keeps definitions consistent with each other.

- **Flagged ambiguities / resolved log.** A running list of terms that were once used two ways, each with its resolution. Keep resolved entries rather than deleting them — they explain *why* a synonym is banned and stop the ambiguity from quietly returning.

  ```markdown
  ## Flagged ambiguities
  - "backlog" meant both the tool hosting issues and the body of work inside it
    → resolved: the tool is the **Issue tracker**; "backlog" is no longer a domain term.
  - [open] "session" — runtime session vs. saved work session; not yet resolved.
  ```

The `_Avoid:_` lists and the resolved log are the enforcement surface: when reviewing docs or code, a banned synonym is a flaggable inconsistency, and an unresolved `[open]` ambiguity is a prompt to settle the term before more code hardens around it.

## Workflow

1. Inventory the important terms from conversation and code.
2. Prefer existing local names unless they actively mislead.
3. Define each term by behavior and boundaries, not by slogan.
4. For each term, list banned synonyms on an `_Avoid:_` line and link related canonical terms.
5. Record every ambiguity in the flagged-ambiguities log; mark it `[open]` until resolved, then keep the resolution.
6. Update `CONTEXT.md` (or the project-context doc) with concise entries and link affected docs or ADRs.

## Outputs

Glossary updates with `_Avoid:_` synonym lists, a relationships block, a flagged-ambiguities/resolved log, naming guidance, and links to affected docs or ADRs.

## Failure modes

Creating a giant dictionary nobody maintains, using marketing language, defining terms by slogan instead of behavior, omitting the `_Avoid:_` synonyms so banned words creep back, deleting resolved ambiguities so they recur, changing names without following through in code, or storing sensitive details.

## Verification checklist

Definitions are actionable and behavior-based; every term carries an `_Avoid:_` synonym list; relationships are stated; the flagged-ambiguities log shows open items and resolutions; affected files are linked; maintainers can update entries later.

## Ghi chú tiếng Việt

Ngôn ngữ chung giúp agent không hiểu sai domain. Dùng định dạng glossary trong `CONTEXT.md`: mỗi thuật ngữ có định nghĩa theo hành vi/ranh giới, một dòng `_Avoid:_` liệt kê từ đồng nghĩa bị cấm, một khối quan hệ giữa các thuật ngữ, và một nhật ký "ambiguity được gắn cờ / đã giải quyết" (giữ lại mục đã giải quyết để tránh tái diễn). Danh sách `_Avoid:_` chính là bề mặt để bắt lỗi không nhất quán khi review. Nguồn cảm hứng: `mattpocock/skills` (MIT, Matt Pocock) — định dạng CONTEXT với `_Avoid:_` và log ambiguity; viết lại nguyên gốc, không sao chép. Khi upstream đổi cách quản lý context, cập nhật mapping và giữ văn phong địa phương.
