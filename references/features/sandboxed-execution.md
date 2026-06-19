# Sandboxed Execution — Design Rationale

## Why this pattern exists

ByteDance's Deer-Flow (71k★) popularized sandboxed execution as a core primitive in SuperAgent harnesses: isolated environments prevent sub-agent side effects from leaking across task boundaries. Vibe Coding OS adapts this as a **coordination contract in markdown** — no containers, no runtimes, no daemons.

## What we adapted

The portable idea is **explicit scope declaration**: every sub-agent receives a declared write zone, read-only zone, forbidden zone, and side-effect list before starting. This prevents:

- Two sub-agents silently editing the same file.
- A sub-agent modifying configuration or schema it was only supposed to read.
- Undeclared test runs or network calls corrupting shared state.

## What we did not adapt

- **Runtime isolation**: Deer-Flow uses sandboxed Python/TypeScript execution environments. Vibe Coding OS does not vendor engine isolation.
- **Container or VM boundaries**: No Docker, Firecracker, or cloud backend is required or referenced.
- **Automated enforcement**: The sandbox is a human-readable contract verified during review, not a permission system.

## When to use

Use the sandboxed execution pattern whenever:

- Two or more sub-agents work on the same repository in parallel.
- A sub-agent's task involves risky bulk operations (rename, refactor, schema migration).
- Side effects beyond file writes (test execution, package install, network requests) need tracking.
- A reviewer needs to verify that every changed file is intentional and authorized.

## Design principles

1. **Document before execute**: the scope declaration is written and reviewed before any worker starts coding.
2. **Review after execute**: sandbox compliance is checked during integration review.
3. **Rollback is explicit**: every scope declaration includes a rollback plan.
4. **No false enforcement**: the sandbox does not prevent violations; it makes them visible when they occur.
