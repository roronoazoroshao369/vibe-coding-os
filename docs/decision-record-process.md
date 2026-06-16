# Decision Record Process

Decision records capture important choices that future maintainers should not have to rediscover from commit history. Use them for durable decisions, not every small edit.

## When to Write ADRs

Write an Architecture Decision Record (ADR) when a change:

- changes the core workflow contract, task tiers, or required artifacts;
- changes registry schema shape, validation strictness, or compatibility guarantees;
- introduces, removes, or substantially changes an adapter or runtime surface;
- chooses between meaningful architectural alternatives;
- adds a dependency, external integration, or upstream adoption with long-term maintenance impact;
- creates a compatibility, deprecation, migration, security, privacy, or licensing trade-off;
- resolves a repeated disagreement or ambiguous policy question.

Do not write an ADR for typo fixes, routine documentation updates, straightforward registry additions, or implementation details that can be understood from the PR.

## ADR Lifecycle

ADRs move through these states:

1. **Proposed** — the decision is being discussed. Alternatives and consequences may still change.
2. **Accepted** — maintainers agree this is the current decision. Implementation may proceed or already be complete.
3. **Superseded** — a newer ADR replaces this decision. Link to the replacement ADR.
4. **Deprecated** — the decision is no longer recommended, but may still describe historical behavior. Link to current guidance when possible.

ADRs are append-only in spirit. Fix typos and links, but do not rewrite accepted history to hide the original trade-offs. If the decision changes materially, create a new ADR and mark the old one superseded or deprecated.

## Naming Convention

Store ADRs in:

```text
docs/adr/NNNN-title.md
```

Rules:

- `NNNN` is a zero-padded sequence number, e.g. `0003`.
- `title` is short, descriptive, and kebab-case.
- Use the next available number in `docs/adr/`.
- Keep one decision per ADR.

Example:

```text
docs/adr/0003-registry-schema-versioning.md
```

## Template Pointer

Start from `templates/adr-template.md`. At minimum, include:

- title and status;
- context/problem;
- decision;
- alternatives considered;
- consequences and trade-offs;
- links to related docs, issues, PRs, or superseding ADRs.

For workflow decisions, also link `docs/core-workflow-contract.md`. For compatibility decisions, link `docs/compatibility-support-policy.md`. For releases, link `docs/release-checklist.md`.
