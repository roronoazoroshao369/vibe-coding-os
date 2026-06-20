# Persistent Agent Team — Full Feature Plan & Storage Architecture

**Date:** 2026-06-20
**Status:** Draft v1 — pending user approval to start implementation
**Council basis:** 3-panel audit (Panels A/B/C) + COUNCIL-SYNTHESIS, verdict unanimous BUILD
**Adjacent:** `agent-team-idea-COUNCIL-SYNTHESIS.md`, `agent-team-idea-panel-B-architecture.md`

---

## 0. Scope of this document

This is the **implementation blueprint** the user requested. It answers:

1. **Storage decision** — DB vs Vector vs file-based, local vs cloud (the explicit question)
2. **Full plan** — every file, hook, MCP tool, command, registry entry, ADR listed
3. **10-week phasing** — week-by-week deliverables

It builds directly on Panel B's 5-layer architecture and Panel C's risk analysis. Every choice is justified against existing repo primitives.

---

## Part 1 — Storage Decision (the explicit question)

Four options were evaluated against this feature's needs.

### Option A — Pure file-based (JSON + Markdown)

**Shape:** Markdown files for human-editable artifacts (principles, lessons, system prompts); JSON files for structured state (memory records, registry). No external DB.

| Aspect | Assessment |
|---|---|
| Data model fit | ✅ Excellent — text-heavy, low-cardinality, versionable |
| Query patterns | ✅ Adequate for keyword search, FNV-1a vector (existing) |
| Cost | ✅ Zero infra; lives in the repo |
| Lock-in | ✅ None — git is the substrate |
| Complexity | ✅ Low |
| vibe-coding-os fit | ✅ Already the repo's posture (markdown-first, ADR-disciplined) |

**Weakness:** cross-machine sync requires git push; semantic recall limited to FNV-1a cosine.

### Option B — Vector DB (Postgres+pgvector / Qdrant / Chroma)

**Shape:** Embeddings stored in vector DB; semantic search via ANN index.

| Aspect | Assessment |
|---|---|
| Data model fit | ⚠️ Overkill for text-heavy + low-cardinality agent bundles |
| Query patterns | ✅ Strong for semantic recall |
| Cost | ⚠️ $0–25/mo for self-host, $50+/mo for managed |
| Lock-in | ⚠️ Vendor-specific schemas |
| Complexity | ❌ High — schema migrations, embeddings pipeline, sync daemon |
| vibe-coding-os fit | ❌ Contradicts markdown-first posture; ADR-0002 boundary concerns |

**Weakness:** ADR-0002 freezes runtime. A vector DB is an external dependency that *feels* like runtime expansion. Also: most recall is keyword-level ("this lesson was about X"), not semantic.

### Option C — Hybrid (files as source of truth + vector index as retrieval accelerator)

**Shape:**
- **Markdown + JSON files** in the repo = source of truth (principles, lessons, system prompts, registry)
- **Local vector index** (reuse `runtime/memory/vector-store.mjs`, FNV-1a) = offline retrieval accelerator
- **Optional cloud Postgres+pgvector** = semantic recall across projects and machines (deferred to v1.0)

| Aspect | Assessment |
|---|---|
| Data model fit | ✅ Files own the narrative; index serves queries |
| Query patterns | ✅ Keyword (existing) + cosine (existing) + optional semantic (cloud) |
| Cost | ✅ Zero infra for MVP; cloud is opt-in |
| Lock-in | ✅ None for MVP; Mem0 (model-agnostic) if cloud later |
| Complexity | ✅ Low — reuses `vector-store.mjs` as-is |
| vibe-coding-os fit | ✅ Mirrors the existing posture: files = truth, index = derivative |

**Weakness:** two sources of truth (file + index) require sync discipline; cloud adds a third.

### Option D — Graph DB (Neo4j, Memgraph)

**Shape:** Nodes for agents/lessons/principles/citations, edges for relationships.

| Aspect | Assessment |
|---|---|
| Data model fit | ⚠️ Possible but over-engineered — relationships are 1-level deep |
| Query patterns | ✅ Strong for "what depends on what" |
| Cost | ❌ High — managed = $50+/mo, self-host = ops burden |
| Lock-in | ❌ Vendor query languages (Cypher) |
| Complexity | ❌ Very high — graph schema, migrations, query language |
| vibe-coding-os fit | ❌ Contradicts ADR-0002 (no runtime expansion) |

**Weakness:** graph DBs shine when relationships are dense and multi-hop. Agent-team relationships are shallow (agent ↔ lesson ↔ principle ↔ citation, 1-level edges). The complexity tax is not justified.

---

### Comparison matrix

| Dimension | A. Pure files | B. Vector DB | C. **Hybrid** | D. Graph DB |
|---|---|---|---|---|
| **MVP fit** | ✅ | ⚠️ | ✅ | ❌ |
| **Cost** | $0 | $0–25/mo | $0 MVP / $0–25 v1.0 | $50+/mo |
| **Lock-in** | None | Vendor | None | Vendor |
| **Complexity** | Low | High | Low | Very high |
| **Markdown-first** | ✅ | ❌ | ✅ | ❌ |
| **ADR-0002 safe** | ✅ | ⚠️ | ✅ | ❌ |
| **Cross-project sync** | via git | via API | via git (MVP) / API (v1.0) | via API |
| **Semantic recall** | FNV-1a only | Strong | FNV-1a (MVP) / embeddings (v1.0) | Pattern match only |
| **User-curated memory** | ✅ git diff | ⚠️ admin UI | ✅ git diff | ⚠️ admin UI |
| **Recommendation** | Strong fallback | Defer to v1.0 if needed | **✅ CHOSEN** | Reject |

### DECISION: **Option C — Hybrid**

**Why:**
- Reuses **everything** already shipped (`memory-store.mjs`, `vector-store.mjs`, redactText, atomic writes, schema enforcement, FNV-1a cosine).
- Files are the source of truth → markdown-first posture preserved, git-versioned, user-editable, PR-reviewable.
- Vector index is *derived* state (rebuilt from files) → ADR-0002 safe; index can be deleted and rebuilt anytime.
- Cloud is **opt-in per agent**, default OFF → privacy + cost controlled.
- Aligns with Panel C's "Mem0 as optional cloud adapter" recommendation (deferred to v1.0).

**Anti-decision:** No Neo4j. No managed vector DB in v0. No SQLite (would force schema migrations on a project that values git-as-substrate).

---

## Part 2 — Schema Design

### 2.1 Agent Bundle (`agents/<agent-id>/`)

Five files per agent, all markdown + JSON, all git-versioned.

#### `agents/<agent-id>/manifest.yaml`

Top-level metadata, required.

```yaml
---
id: architect                    # kebab-case, unique
name: "Ada — Systems Architect"  # human-friendly name
version: 0.1.0                   # semver
status: alpha                    # alpha | beta | stable | deprecated
role: architect                  # free-form string
voice: professional              # professional | casual | playful | direct
mcp_namespace: agent.architect   # tool prefix
skills:                          # list of skill ids this agent bundles
  - planning-with-files
  - writing-plans
  - requesting-code-review
  - systematic-debugging
principles_version: 1            # increments when principles.md changes
cloud_memory_enabled: false      # default OFF; opt-in per agent
mcp_memory_enabled: true         # default ON; recall via MCP
memory_scope_default: project    # global | project | branch
last_reviewed_at: 2026-06-20
maintainer: vibe-coding-os-team
tags:
  - architecture
  - system-design
---
```

#### `agents/<agent-id>/system.md`

Loaded into Claude Code session as a system-prompt prepend.

```markdown
# Ada — Systems Architect

You are Ada, a systems architect who values clarity, evolution, and bounded context.
You default to DDD (domain-driven design), prefer explicit trade-offs over hidden
assumptions, and always state which constraints shaped a decision.

## Voice
- Direct, evidence-led, mild skepticism toward premature optimization
- Cite specific files, line numbers, and ADRs whenever reasoning
- When uncertain, name what you don't know rather than guessing

## Operating principles
See `principles.md` — those are immutable unless a PR changes them.

## Memory
You recall lessons from `~/.vibe/agents/architect/memory.json` via MCP tools:
- `agent.architect.recall(query, scope)` — retrieve relevant past lessons
- `agent.architect.reflect(draft)` — propose a new lesson (always as a draft, never auto-commit)
- `agent.architect.cite(lesson_id)` — cite the lesson that informed a decision

## Skills you own
You bundle these skills and call them when relevant:
- `planning-with-files` — TaskCreate + TaskUpdate workflow
- `writing-plans` — bite-sized plans with paths and verification
- `requesting-code-review` — anti-rubber-stamp review prompts
- `systematic-debugging` — 4-phase root-cause debugging
```

#### `agents/<agent-id>/principles.md`

Versioned, git-tracked, signed, **immutable** except via PR.

```markdown
---
version: 1
last_reviewed: 2026-06-20
signed_by: human-reviewer-handle
---

# Ada's Principles (v1)

These are durable opinions. They change only via PR review.

## P1. Spec before code
No design discussion without an explicit problem statement and acceptance criteria.

## P2. Bounded context over premature abstraction
Three similar lines of code is better than one clever abstraction. Wait for the third repetition.

## P3. ADR over comment
Decisions with trade-offs belong in `docs/adr/`, not buried in commit messages.

## P4. Cite your sources
Every recommendation references a file path, line number, ADR, or external doc.

## P5. Validate before commit
`npm run validate:all` passes = ready to push. Anything less = not done.

## P6. No silent failures
Every error path either surfaces to the user or has a documented recovery.

## P7. Memory is curated, not autonomous
A lesson is a draft until a human reviews it.
```

#### `agents/<agent-id>/self.md`

Mutable state — last activity, pending drafts, confidence, drift score.

```markdown
---
last_active: 2026-06-20T12:00:00Z
last_session: session-2026-06-20-001
confidence: 0.78                # rolling average of cited lesson confidence
drift_score: 0.04               # principles-consistency check (lower = better)
pending_drafts: 3               # lessons awaiting user curation
total_lessons: 47
total_citations: 128
---

# Ada — Current State

## Pending drafts (awaiting human review)
- DR-2026-06-20-001: "Validate lessons learned about MCP tool namespacing"
- DR-2026-06-20-002: "Memory bloat threshold at 50MB triggers compression"
- DR-2026-06-20-003: "Prefer `text/event-stream` over polling for cloud sync"

## Recent activity
- 2026-06-20: cited lesson L-014 ("always run validate:all before push") on PR #66
- 2026-06-19: cited lesson L-022 ("ADR over comment") on ADR-0005 draft
- 2026-06-18: cited lesson L-008 ("no silent failures") on runtime/memory/error-handler.mjs

## Drift check
Last consistency check: 2026-06-20T08:00:00Z
Principles version 1 → re-extracted from past 30 lessons: 7 principles, 6 matched,
1 implicit (newly observed, flagged for review as DR-2026-06-20-001).
```

#### `agents/<agent-id>/skills.json`

Bundle declaration — which skills this agent owns.

```json
{
  "schema": "agent-skills.v1",
  "agent_id": "architect",
  "skills": [
    {
      "id": "planning-with-files",
      "required": true,
      "version": ">=2.0.0"
    },
    {
      "id": "writing-plans",
      "required": true,
      "version": ">=1.5.0"
    },
    {
      "id": "requesting-code-review",
      "required": false,
      "version": ">=1.0.0"
    },
    {
      "id": "systematic-debugging",
      "required": false,
      "version": ">=1.0.0"
    }
  ],
  "compatibility": {
    "vibe_coding_os": ">=2.16.0"
  }
}
```

---

### 2.2 Memory Record (`runtime/memory/agents/<agent-id>/memory.json`)

Each agent has its own memory file. Schema extends the existing `memory-store.mjs` schema.

```json
{
  "schemaVersion": "agent-memory.v1",
  "kind": "agent-memory",
  "agent_id": "architect",
  "items": [
    {
      "id": "L-014",
      "agent_id": "architect",
      "lesson_id": "validate-before-push",
      "content": "Always run `npm run validate:all` before pushing a branch or opening a PR. Validation gates exist for a reason; bypassing them is technical debt.",
      "scope": "global",
      "scope_detail": null,
      "kind": "rule",
      "confidence": 0.95,
      "citations": [
        {
          "kind": "skill",
          "ref": "skills/core/INDEX.md",
          "note": "Validation gate index"
        },
        {
          "kind": "session",
          "ref": "session-2026-01-15-001",
          "note": "Missed validation, broke CI"
        }
      ],
      "tags": ["validation", "discipline", "ci"],
      "freshness": {
        "createdAt": "2026-01-15T10:30:00Z",
        "last_referenced_at": "2026-06-20T12:00:00Z",
        "staleness": "fresh"
      },
      "audit": {
        "curated_by": "human-reviewer-handle",
        "curated_at": "2026-01-15T11:00:00Z",
        "draft_id": "DR-2026-01-15-007",
        "approval_kind": "manual"
      }
    }
  ]
}
```

**Field semantics:**

| Field | Required | Notes |
|---|---|---|
| `agent_id` | ✅ | Schema-enforced; missing = rejection |
| `lesson_id` | ✅ | Kebab-case slug, unique per agent |
| `content` | ✅ | Redacted via existing `redactText` |
| `scope` | ✅ | `global` \| `project` \| `branch` |
| `confidence` | ✅ | 0.0–1.0; user-curated; never auto-set above 0.5 |
| `citations` | ✅ | Array; ≥1 required; empty = rejection |
| `audit.curated_by` | ✅ | "human" or specific handle; **never "agent-auto"** |
| `audit.draft_id` | ✅ | Link to the draft PR that approved this lesson |
| `tags` | optional | Free-form; used for filtering |

**Two non-negotiable rules:**
1. `audit.curated_by = "agent-auto"` is **rejected at write time** by `Enforcement.assertKnownFields`.
2. Any record with `citations: []` is **rejected at write time**.

---

### 2.3 Lesson File Format (`agents/<agent-id>/lessons/<lesson-id>.md`)

One file per lesson. Git-friendly (one diff per lesson). Used for `vibe-agent-export` and `vibe-agent-import`.

```markdown
---
id: L-014
agent_id: architect
lesson_id: validate-before-push
scope: global
confidence: 0.95
created_at: 2026-01-15T10:30:00Z
last_referenced_at: 2026-06-20T12:00:00Z
tags: [validation, discipline, ci]
audit:
  curated_by: human-reviewer-handle
  curated_at: 2026-01-15T11:00:00Z
  draft_id: DR-2026-01-15-007
citations:
  - kind: skill
    ref: skills/core/INDEX.md
    note: Validation gate index
  - kind: session
    ref: session-2026-01-15-001
    note: Missed validation, broke CI
---

# L-014 — Validate before push

Always run `npm run validate:all` before pushing a branch or opening a PR.

## Why
Validation gates exist for a reason; bypassing them is technical debt.

## When to apply
- Before any `git push`
- Before opening a PR
- Before merging to main

## Counter-examples (when NOT to apply)
- Never (this is a universal rule)
```

---

### 2.4 Principles File Format (`agents/<agent-id>/principles.md`)

Already shown in §2.1. Key constraint: **mutable only via PR**. The `version` field increments; the `signed_by` field is required.

**Drift check algorithm:**
1. Re-extract principles from last N cited lessons (LLM-as-judge, OR keyword pattern match for v0).
2. Diff against current `principles.md`.
3. Flag any "implicit principle" — pattern observed ≥3 times but not in `principles.md`.
4. Implicit principles → `pending_drafts` in `self.md`.
5. If `drift_score > 0.20`, alert: "Agent may have drifted. Manual review recommended."

---

### 2.5 Cloud Adapter Schema (deferred to v1.0 — listed for completeness)

**Not built in MVP.** Documented so the contract is fixed.

**Postgres tables** (if/when `cloud_memory_enabled: true`):

```sql
-- One row per agent bundle
CREATE TABLE agents (
  agent_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  manifest JSONB NOT NULL,
  principles_md TEXT NOT NULL,
  principles_version INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- One row per memory record (mirror of local memory.json)
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,                    -- L-014
  agent_id TEXT REFERENCES agents(agent_id),
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL,
  content TEXT NOT NULL,
  scope TEXT NOT NULL,
  scope_detail TEXT,
  confidence FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  citations JSONB NOT NULL,               -- [{kind, ref, note}]
  tags TEXT[],
  embedding VECTOR(1536),                 -- pgvector
  created_at TIMESTAMPTZ DEFAULT now(),
  last_referenced_at TIMESTAMPTZ,
  audit JSONB NOT NULL,                   -- curated_by, draft_id
  UNIQUE(agent_id, lesson_id)
);

-- One row per reflection event (audit trail)
CREATE TABLE reflections (
  id TEXT PRIMARY KEY,                    -- DR-2026-06-20-001
  agent_id TEXT REFERENCES agents(agent_id),
  user_id UUID NOT NULL,
  draft_content TEXT NOT NULL,
  status TEXT NOT NULL,                   -- pending | approved | rejected
  approved_lesson_id TEXT REFERENCES lessons(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  decided_at TIMESTAMPTZ
);

-- Row-level security (RLS): every query scoped by user_id
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation ON lessons
  USING (user_id = current_setting('app.current_user_id')::UUID);
```

**Vector index for semantic recall:**
```sql
CREATE INDEX lessons_embedding_idx ON lessons USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

**Sync model:** local → cloud via REST POST per lesson (debounced, batched). Cloud → local via webhook on conflict (rare).

---

## Part 3 — MCP Tools (namespaced per agent)

Five tools per agent, all routed through existing `withApprovalGate` and `assertToolAllowed`.

### 3.1 `agent.<id>.recall(query, scope, limit)`

**Risk:** safe (read-only)
**Approval:** no

```javascript
// Input
{
  query: string,      // search query
  scope?: 'global' | 'project' | 'branch' | 'all',  // default 'all'
  limit?: number       // default 10, max 50
}

// Output
{
  lessons: [
    {
      id: 'L-014',
      content: 'Always run `npm run validate:all`...',
      scope: 'global',
      confidence: 0.95,
      score: 0.87,                     // cosine similarity
      citations: [...],
      last_referenced_at: '2026-06-20T12:00:00Z'
    }
  ],
  count: 1,
  agent_id: 'architect'
}
```

**Implementation:** extends `runtime/memory/retrieval.mjs` with `agent_id` filter; uses `vector-store.mjs` `semanticSearch`.

### 3.2 `agent.<id>.reflect(draft_content, citations)`

**Risk:** review (writes draft state, NOT memory)
**Approval:** yes (per Council rule)

```javascript
// Input
{
  draft_content: string,        // proposed lesson text
  citations: [                   // ≥1 required
    {kind: 'skill', ref: 'skills/...'},
    {kind: 'session', ref: 'session-...'},
    {kind: 'observation', ref: 'something observed'}
  ],
  scope?: 'global' | 'project' | 'branch',
  confidence?: number,           // default 0.5 (curator adjusts)
  tags?: string[]
}

// Output
{
  draft_id: 'DR-2026-06-20-001',
  status: 'pending',
  message: 'Draft queued for human review. Use vibe-agent-curate to approve/reject.',
  pending_count: 3
}
```

**Implementation:** writes to `agents/<id>/drafts/<draft_id>.md` AND `runtime/memory/agents/<id>/drafts.json`. **Never writes to `memory.json` directly.**

### 3.3 `agent.<id>.cite(lesson_id, context)`

**Risk:** safe (read + audit)
**Approval:** no

```javascript
// Input
{
  lesson_id: 'L-014',
  context: string      // brief note on where/how it was used
}

// Output
{
  citation_id: 'C-2026-06-20-128',
  lesson_id: 'L-014',
  context: 'Used to validate PR #66 before push',
  last_referenced_at: '2026-06-20T12:00:00Z'
}
```

**Side effect:** updates `last_referenced_at` on the lesson; appends to `agents/<id>/citations.jsonl` audit trail.

### 3.4 `agent.<id>.list_lessons(scope_filter)`

**Risk:** safe (read-only)
**Approval:** no

```javascript
// Input
{
  scope_filter?: 'global' | 'project' | 'branch',
  tag_filter?: string,
  min_confidence?: number,         // default 0.0
  limit?: number,                   // default 50
  sort_by?: 'last_referenced_at' | 'confidence' | 'created_at'
}

// Output
{
  lessons: [
    {id, lesson_id, content_preview, scope, confidence, last_referenced_at, tags}
  ],
  total: 47
}
```

### 3.5 `agent.<id>.update_principles(pr_diff, justification)`

**Risk:** high (changes immutable artifact)
**Approval:** yes + dry-run default

```javascript
// Input
{
  pr_diff: string,        // markdown diff
  justification: string,  // why this principle should change
  proposed_version: number  // current + 1
}

// Output
{
  pr_url: 'https://github.com/.../pull/N',
  status: 'pr-opened',
  message: 'Principles change requires human PR review. PR opened.'
}
```

**Side effect:** opens a PR via `gh` API or GitHub API. **Never merges directly.** Even with approval, the merge is gated on human review per ADR-0005.

---

## Part 4 — Hooks (new)

Four new hooks, all following existing `runtime/hooks/*` pattern.

### 4.1 `session-start-agent-bind.mjs`

**Trigger:** `SessionStart`
**Input:** `{agent_id?: string}` from env or CLI flag (`--agent=architect`)
**Output / side effects:**
- If `agent_id` set: load `agents/<id>/system.md` + `principles.md` + top-3 cited lessons into session context.
- If `agent_id` not set: list available agents, prompt user.
- Update `agents/<id>/self.md` `last_active` timestamp.
**Failure behavior:** graceful — falls back to default session if agent bundle missing.
**File:** `runtime/hooks/session-start-agent-bind.mjs`

### 4.2 `stop-agent-self-review.mjs`

**Trigger:** `Stop`
**Input:** session transcript (read-only)
**Output / side effects:**
- Agent (via MCP `agent.<id>.reflect`) drafts a lesson IF the session produced a non-trivial insight.
- Draft written to `agents/<id>/drafts/`. **Never to memory.json.**
- User notified: "1 new lesson draft from Ada. Review with `vibe-agent-curate DR-...`."
**Failure behavior:** no draft if nothing meaningful; never errors.
**File:** `runtime/hooks/stop-agent-self-review.mjs`

### 4.3 `prompt-inject-agent-context.mjs`

**Trigger:** `UserPromptSubmit`
**Input:** user prompt string
**Output / side effects:**
- If active agent set: query `agent.<id>.recall(prompt)` (top-3, scope=all).
- Inject matching lessons as context block (clearly marked: `-- Cited from Ada's memory --`).
- Track injection count for cost monitoring.
**Failure behavior:** skip injection on recall error (don't block user prompt).
**File:** `runtime/hooks/prompt-inject-agent-context.mjs`

### 4.4 `tool-use-cite-memory.mjs`

**Trigger:** `PostToolUse`
**Input:** `{tool_name, tool_input, tool_output}`
**Output / side effects:**
- If tool output matches a lesson content pattern (high cosine), append to `agents/<id>/citations.jsonl` (auto-cite mode, opt-in).
- Default: off (avoids noise); user enables per session.
**Failure behavior:** silent skip.
**File:** `runtime/hooks/tool-use-cite-memory.mjs`

---

## Part 5 — Commands

Eight new commands in `commands/agents/`.

### 5.1 `vibe-hire <agent-id>`

- **Trigger:** `vibe-hire architect` or `/vibe-hire architect`
- **Args:** `<agent-id>` (required)
- **Effect:** Sets active agent for session; subsequent MCP calls namespace accordingly.
- **Output:** "Hired Ada (architect). 47 lessons recalled. Top 3: ..."

### 5.2 `vibe-agent-list`

- **Trigger:** `vibe-agent-list`
- **Args:** none
- **Effect:** Lists all agents from `registry/agents.json` with status, lesson count, last activity.
- **Output:** Table format.

### 5.3 `vibe-agent-review <agent-id>`

- **Trigger:** `vibe-agent-review architect`
- **Args:** `<agent-id>` (required), `--days=30` (optional)
- **Effect:** Pulls last N citations + drafts, asks agent (via MCP) to consolidate.
- **Output:** PR draft to `agents/<id>/principles.md` if contradictions detected.

### 5.4 `vibe-agent-sync <agent-id>`

- **Trigger:** `vibe-agent-sync architect`
- **Args:** `<agent-id>` (required), `--direction=pull|push|both`
- **Effect:** If cloud enabled, sync lessons with cloud adapter. Local-only by default.
- **Output:** "Synced 12 lessons (3 new, 9 updated)."

### 5.5 `vibe-agent-curate <draft-id>`

- **Trigger:** `vibe-agent-curate DR-2026-06-20-001`
- **Args:** `<draft-id>` (required), `--action=approve|reject|edit`, `--confidence=0.85`, `--scope=global`
- **Effect:** Approve/reject/edit pending draft. Approval moves draft to `memory.json` with `audit.curated_by = "human-<handle>"`.
- **Output:** "Draft L-014 approved as global rule (confidence 0.85)."

### 5.6 `vibe-agent-drift-check <agent-id>`

- **Trigger:** `vibe-agent-drift-check architect`
- **Args:** `<agent-id>` (required), `--window=30` (days)
- **Effect:** Re-extract principles from last N lessons; diff against current `principles.md`; report drift score.
- **Output:** "Drift score: 0.04 (healthy). 1 implicit principle detected (DR-...)."

### 5.7 `vibe-agent-export <agent-id>`

- **Trigger:** `vibe-agent-export architect > architect-bundle.zip`
- **Args:** `<agent-id>` (required), `--include-drafts` (optional)
- **Effect:** Bundles all agent files + lessons + audit trail into a portable zip (or git bundle).
- **Output:** Path to export file.

### 5.8 `vibe-agent-import <export-file>`

- **Trigger:** `vibe-agent-import architect-bundle.zip`
- **Args:** `<export-file>` (required), `--agent-id=<new-id>` (optional override)
- **Effect:** Imports agent bundle; registers in `registry/agents.json`.
- **Output:** "Imported Ada (architect) v0.1.0 with 47 lessons."

---

## Part 6 — Registry

### 6.1 `registry/agents.json` schema

Mirrors `registry/skills.json` shape. Required for any agent to be discoverable.

```json
{
  "schema": "registry-agents.v1",
  "version": 1,
  "agents": [
    {
      "id": "architect",
      "name": "Ada — Systems Architect",
      "version": "0.1.0",
      "status": "alpha",
      "role": "architect",
      "voice": "professional",
      "mcp_namespace": "agent.architect",
      "skills": [
        "planning-with-files",
        "writing-plans",
        "requesting-code-review",
        "systematic-debugging"
      ],
      "principles_version": 1,
      "cloud_memory_enabled": false,
      "mcp_memory_enabled": true,
      "memory_scope_default": "project",
      "manifest_path": "agents/architect/manifest.yaml",
      "system_md_path": "agents/architect/system.md",
      "principles_md_path": "agents/architect/principles.md",
      "self_md_path": "agents/architect/self.md",
      "skills_json_path": "agents/architect/skills.json",
      "memory_json_path": "runtime/memory/agents/architect/memory.json",
      "drafts_dir": "agents/architect/drafts/",
      "lessons_dir": "agents/architect/lessons/",
      "tags": ["architecture", "system-design"],
      "maintainer": "vibe-coding-os-team",
      "created_at": "2026-06-20T12:00:00Z",
      "last_updated": "2026-06-20T12:00:00Z",
      "validation_gates": [
        "agent-manifest-valid",
        "agent-principles-signed",
        "agent-memory-schema-valid",
        "agent-citations-non-empty"
      ]
    }
  ]
}
```

**Validation gates (new, to be added to `validate:all`):**

| Gate | Purpose | Failure = |
|---|---|---|
| `agent-manifest-valid` | All required manifest.yaml fields present | Error |
| `agent-principles-signed` | `signed_by` field present in principles.md | Error |
| `agent-memory-schema-valid` | memory.json matches `agent-memory.v1` schema | Error |
| `agent-citations-non-empty` | No lesson has `citations: []` | Error |
| `agent-no-auto-curate` | No record has `audit.curated_by = "agent-auto"` | Error |
| `agent-drift-score-low` | drift_score ≤ 0.20 across all agents | Warning |

---

## Part 7 — ADR-0005 (Agent-vs-Skill Composition Contract)

**Title:** ADR-0005 — Agent-as-Skill-Bundle Composition Contract

**Status:** PROPOSED (must be merged before any code)

### 7.1 Decision

**Pattern A — Agent-as-Skill-Bundle.** An agent is a *named bundle* of skills, principles, and memory. It is **not** itself a skill. Skills remain atomic.

### 7.2 Composition rules

1. **Skill ownership:** An agent's `skills.json` lists skill IDs the agent can invoke. Skills are versioned (`>=X.Y.Z`).
2. **Principle inheritance:** An agent has its own `principles.md`; it does NOT inherit from project constitution (CLAUDE.md). Project constitution is the floor; agent principles are the ceiling.
3. **Memory isolation:** Each agent has its own `memory.json`. Cross-agent memory access is explicit, opt-in, and read-only by default.
4. **Identity persistence:** Agent identity = `{manifest.yaml, system.md, principles.md}`. The mutable state (`self.md`, `memory.json`) is **not** identity.
5. **Skill updates:** When a bundled skill updates, the agent's `skills.json` must be re-validated. Agents can pin skill versions.

### 7.3 Boundary clarifications

- **Skills are called.** Agents **own** skills. An agent invokes a skill; a skill does not invoke an agent.
- **Agent-vs-agent:** Sequential handoff only. No parallel multi-agent threads (audit trail breaks).
- **Cloud is an adapter:** Cloud sync code lives outside `runtime/`, in `plugins/agent-teams/cloud/`. Per ADR-0002.
- **Skills-vs-agents split:** `skills/` is shared knowledge. `agents/` is specialized personas. Both are user-curated markdown.

---

## Part 8 — Implementation Phases (10 weeks)

### Week 1 — Foundation
- **Goal:** Manifest + registry + validation gates
- **Deliverables:**
  - `agents/` directory with `.gitkeep`
  - `registry/agents.json` schema + JSON Schema file
  - `scripts/validate-agents.mjs` (3 new gates: manifest-valid, principles-signed, memory-schema-valid)
  - `agents/architect/` placeholder bundle
- **Risk:** Low

### Week 2 — MCP extension
- **Goal:** 5 namespaced tools per agent
- **Deliverables:**
  - Extend `runtime/mcp/server.mjs` with `buildAgentTools(agentId, store)` factory
  - New tool files: `runtime/mcp/agent-tools.mjs`
  - Per-agent tool registration via `registry/agents.json`
  - Tests in `tests/mcp/agent-tools.test.mjs`
- **Risk:** Medium (extends runtime — must keep ADR-0002 boundary)

### Week 3 — Hooks
- **Goal:** SessionStart + Stop hooks working
- **Deliverables:**
  - `runtime/hooks/session-start-agent-bind.mjs`
  - `runtime/hooks/stop-agent-self-review.mjs`
  - Wire into `.claude/settings.json`
  - Tests in `tests/hooks/agent-hooks.test.mjs`
- **Risk:** Medium (hook contracts are tricky)

### Week 4 — First seeded agent (Architect)
- **Goal:** Ada the architect fully usable
- **Deliverables:**
  - `agents/architect/{manifest.yaml, system.md, principles.md, self.md, skills.json}`
  - **≥20 curated lessons** written by maintainer (NOT auto-generated)
  - `runtime/memory/agents/architect/memory.json` with seeded records
  - End-to-end test: hire Ada, run a planning session, verify recall works
- **Risk:** High (lesson quality determines feature success)

### Week 5 — Two more agents (Implementer, Reviewer)
- **Goal:** Three-agent starter pack
- **Deliverables:**
  - `agents/implementer/` and `agents/reviewer/` bundles
  - 20+ lessons each
  - Cross-agent handoff test (architect → implementer → reviewer flow)
- **Risk:** Medium (consistency across agents)

### Week 6 — Reflection loop (user-curated)
- **Goal:** Drafts can be created and curated
- **Deliverables:**
  - `agents/<id>/drafts/` directory
  - `vibe-agent-curate` command
  - `agents/<id>/drafts/DR-*.md` format
  - UserPromptSubmit hook `prompt-inject-agent-context.mjs`
  - Tests for curation flow
- **Risk:** High (UX of "approve draft" must be friction-free)

### Week 7 — Memory scope controller
- **Goal:** `global | project | branch` resolution
- **Deliverables:**
  - `runtime/memory/agents/scope-controller.mjs`
  - `.vibe/agents/<id>/scope-config.json` (user preferences)
  - Tests for scope filtering in recall
- **Risk:** Medium

### Week 8 — Health dashboard + drift check
- **Goal:** Visibility into agent state
- **Deliverables:**
  - `vibe-agent-drift-check` command
  - `docs/agent-health/<id>.md` per-agent report
  - Drift detection algorithm (LLM-as-judge OR keyword pattern for v0)
  - `vibe-agent-list` command (read-only)
- **Risk:** Low

### Week 9 — Optional cloud adapter (Mem0)
- **Goal:** Cloud sync working behind opt-in flag
- **Deliverables:**
  - `plugins/agent-teams/cloud/mem0-adapter.mjs` (lives outside `runtime/`)
  - `vibe-agent-sync` command
  - RLS-protected schema
  - `cloud_memory_enabled: true` test path
- **Risk:** High (this is the deferred v1.0 work; included only if MVP lands early)

### Week 10 — Polish, docs, ADRs
- **Goal:** Ready for v0.1.0 release
- **Deliverables:**
  - ADR-0005 merged
  - `docs/agents/README.md` (user guide)
  - `docs/agents/authoring.md` (how to write your own agent)
  - Updated `README.md` with agent team section
  - Updated `DASHBOARD.md` and `ROADMAP-STATUS.md`
  - 38 → 44 validation gates
- **Risk:** Low

---

## Part 9 — Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Memory poisoning (bad lesson propagates) | Critical | `audit.curated_by != "agent-auto"` enforced at schema level; citations required |
| Self-improvement loop gaming | Critical | **Never auto-write.** Reflection → draft PR only. |
| Identity drift | Critical | `principles.md` immutable except via PR; monthly drift check |
| Cold-start emptiness | High | Ship 20+ curated lessons per starter agent |
| Cross-project pollution | High | `global \| project \| branch` scope controller |
| Privacy (cloud memory = user behavior log) | High | Local-first default; cloud opt-in per agent; redactText on ingest |
| Cost surprise | Medium | Hard token budget per agent per session; surfaced via dashboard |
| Vendor lock-in | Medium | Markdown + JSON files = portable; only inference is model-bound |
| Composition conflict with existing skills | Medium | ADR-0005 before any code (Pattern A) |
| Personality fatigue | Low | Default professional voice; personality is power-user knob |
| Memory bloat over years | Low | Periodic compression via `skills/memory/memory-compression/` |

---

## Part 10 — Success Metrics

After 10 weeks, measure:

1. **Adoption:** ≥3 agents shipped; ≥1 user-curated reflection draft per agent per week.
2. **Drift:** Average drift score <0.10 across agents (healthy).
3. **Recall quality:** User-rated recall relevance ≥4/5 in self-reported surveys.
4. **Validation:** 44/44 gates PASS (38 existing + 6 new).
5. **Reusability:** At least 1 community-contributed agent published via `vibe-agent-import`.
6. **No critical incidents:** Zero memory poisoning events; zero autonomous writes.

---

## Closing note

The decision is **hybrid storage (Option C)**: markdown + JSON files as source of truth, FNV-1a vector index for offline retrieval (reuse `vector-store.mjs`), optional cloud adapter (deferred to v1.0). This is the lowest-cost, highest-reuse, ADR-0002-safe choice. The plan delivers 3 starter agents in 10 weeks, with user-curated reflection as the single non-negotiable rule.

**Verdict:** PROCEED with implementation pending user approval. Single decision needed: green-light Week 1.
