# Research-to-Code Pipeline — Design Rationale

## Why this pattern exists

ByteDance's Deer-Flow (71k★) implements a structured deep-research-to-code-generation pipeline where sub-agents first gather context, then produce code, then validate. This prevents the common failure mode of agents guessing implementation details and needing costly rework.

## What we adapted

Vibe Coding OS adopts the **four-phase pipeline** concept — Deep Research, Synthesis, Code Generation, Validation — each with its own artifact and checkpoint gate. This formalizes what `context-rich-implementation` already did informally: separate learning from doing.

Key portable ideas:
- Research produces structured findings (not random notes) that are citable in later phases.
- Synthesis maps findings to concrete design decisions before coding starts.
- Code generation consults research findings during implementation.
- Validation cross-checks against research to catch blind spots.

## What we did not adapt

- **Runtime pipeline engine**: Deer-Flow's agent harness manages pipeline state programmatically. Vibe Coding OS uses markdown checkpoints.
- **Automated agent handoffs**: No cross-agent message passing or mailbox system.
- **Research executor agents**: The researcher, synthesizer, coder, and validator are roles, not separate runtime processes.

## When to use

Use the full four-phase pipeline when:
- The task requires learning a new API, library, domain, or codebase area.
- Incorrect implementation would cause significant rework.
- Multiple sources must be reconciled before coding.
- You want a documented chain from "what we learned" to "what we built" to "it works."

Use a lightweight version (research → implement) when the implementation path is mostly clear but a quick confirmation read would prevent a wrong turn.

## Design principles

1. **Separate learning from doing**: research before synthesis, synthesis before code, validation after code.
2. **Each phase gates the next**: low confidence in research blocks synthesis; missing decisions in synthesis block coding.
3. **Research is citable**: findings are structured with source citations so decisions are traceable.
4. **Validation cross-checks research**: don't just validate the code validates itself — validate it matches what research said.
