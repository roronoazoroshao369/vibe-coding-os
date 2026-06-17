     1|# Skill Packs
     2|
     3|Skill packs are curated bundles of Vibe Coding OS skills for a specific working style. They help a project start with a small, coherent `.vibe/skills/<pack>/` directory instead of copying the whole framework.
     4|
     5|## Install
     6|
     7|From your target project directory:
     8|
     9|```bash
    10|vibe install-pack core-solo
    11|```
    12|
    13|Preview without writing files:
    14|
    15|```bash
    16|vibe install-pack core-solo --dry-run
    17|```
    18|
    19|Installed files are written to:
    20|
    21|```text
    22|.vibe/skills/<pack-name>/
    23|├── pack-manifest.json
    24|├── README.md
    25|└── <skill-name>.md
    26|```
    27|
    28|## Available packs
    29|
    30|### core-solo
    31|
    32|Essential skills for solo AI coding: bootstrap, plan, TDD, debug, review, verify.
    33|
    34|Use when:
    35|- You are one developer working with one AI coding assistant.
    36|- You want a disciplined spec → plan → implement → review → verify loop.
    37|- You do not need memory systems or multi-agent orchestration yet.
    38|
    39|Install:
    40|
    41|```bash
    42|vibe install-pack core-solo
    43|```
    44|
    45|### react-nextjs
    46|
    47|React / Next.js focused pack: component quality, planning, testing, anti-overengineering, and clean-code discipline.
    48|
    49|Use when:
    50|- You are building a React or Next.js app.
    51|- You want practical safeguards against AI-generated UI/UX drift.
    52|- You need small-slice implementation with tests and review.
    53|
    54|Install:
    55|
    56|```bash
    57|vibe install-pack react-nextjs
    58|```
    59|
    60|### memory-safe
    61|
    62|Memory-safe workflow pack: context budget, session capture, project memory, local-first memory, and privacy filters.
    63|
    64|Use when:
    65|- Your project spans many sessions.
    66|- You want memory without leaking sensitive details.
    67|- You need repeatable context handoffs and project-level memory hygiene.
    68|
    69|Install:
    70|
    71|```bash
    72|vibe install-pack memory-safe
    73|```
    74|
    75|### multi-agent
    76|
    77|Multi-agent coordination pack: orchestration, delegation, specialized roles, review gates, and task state tracking.
    78|
    79|Use when:
    80|- You want an architect / implementer / tester / reviewer split.
    81|- You run parallel workstreams.
    82|- You need explicit handoffs and verification gates.
    83|
    84|Install:
    85|
    86|```bash
    87|vibe install-pack multi-agent
    88|```
    89|
    90|## Choosing a pack
    91|
    92|- Start with `core-solo` if unsure.
    93|- Use `frontend-discipline` for frontend/product apps.
    94|- Add `memory-safe` when project continuity and privacy matter.
    95|- Add `multi-agent` only when coordination overhead is worth it.
    96|
    97|## Relationship to adapters
    98|
    99|Adapters (`vibe init` / `vibe export`) install tool instructions like `CLAUDE.md`, `AGENTS.md`, or `.cursorrules`.
   100|
   101|Skill packs install curated workflow skills under `.vibe/skills/`.
   102|
   103|A typical project uses both:
   104|
   105|```bash
   106|vibe init claude-code
   107|vibe install-pack core-solo
   108|vibe doctor --project .
   109|```
   110|

## After install

The installed skills are available in `.vibe/skills/<pack-name>/`.

For AI coding assistants:
- The skills are referenced by the assistant when it reads the project context.
- Reference `.vibe/skills/<pack-name>/README.md` for the pack overview.
- Each `<skill-name>.md` file can be loaded on demand.

For `vibe doctor`:
```bash
vibe doctor --project .
```
This verifies the installed pack skills are valid and well-formed.
