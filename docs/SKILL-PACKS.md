# Skill Packs

Skill packs are curated bundles of Vibe Coding OS skills for a specific working style. They help a project start with a small, coherent `.vibe/skills/<pack>/` directory instead of copying the whole framework.

## Install

From your target project directory:

```bash
vibe install-pack core-solo
```

Preview without writing files:

```bash
vibe install-pack core-solo --dry-run
```

Installed files are written to:

```text
.vibe/skills/<pack-name>/
├── pack-manifest.json
├── README.md
└── <skill-name>.md
```

## Available packs

### core-solo

Essential skills for solo AI coding: bootstrap, plan, TDD, debug, review, verify.

Use when:
- You are one developer working with one AI coding assistant.
- You want a disciplined spec → plan → implement → review → verify loop.
- You do not need memory systems or multi-agent orchestration yet.

Install:

```bash
vibe install-pack core-solo
```

### react-nextjs

React / Next.js focused pack: component quality, planning, testing, anti-overengineering, and clean-code discipline.

Use when:
- You are building a React or Next.js app.
- You want practical safeguards against AI-generated UI/UX drift.
- You need small-slice implementation with tests and review.

Install:

```bash
vibe install-pack react-nextjs
```

### memory-safe

Memory-safe workflow pack: context budget, session capture, project memory, local-first memory, and privacy filters.

Use when:
- Your project spans many sessions.
- You want memory without leaking sensitive details.
- You need repeatable context handoffs and project-level memory hygiene.

Install:

```bash
vibe install-pack memory-safe
```

### multi-agent

Multi-agent coordination pack: orchestration, delegation, specialized roles, review gates, and task state tracking.

Use when:
- You want an architect / implementer / tester / reviewer split.
- You run parallel workstreams.
- You need explicit handoffs and verification gates.

Install:

```bash
vibe install-pack multi-agent
```

## Choosing a pack

- Start with `core-solo` if unsure.
- Use `react-nextjs` for frontend/product apps.
- Add `memory-safe` when project continuity and privacy matter.
- Add `multi-agent` only when coordination overhead is worth it.

## Relationship to adapters

Adapters (`vibe init` / `vibe export`) install tool instructions like `CLAUDE.md`, `AGENTS.md`, or `.cursorrules`.

Skill packs install curated workflow skills under `.vibe/skills/`.

A typical project uses both:

```bash
vibe init claude-code
vibe install-pack core-solo
vibe doctor --project .
```
