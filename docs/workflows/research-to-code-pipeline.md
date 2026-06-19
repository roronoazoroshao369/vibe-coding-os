# Research-to-Code Pipeline

## Purpose

Execute a structured four-phase pipeline — Deep Research → Synthesis → Code Generation → Validation — that transforms an ambiguous goal into a verified implementation. Each phase produces a concrete artifact that feeds the next, and each phase boundary includes a checkpoint gate that prevents incomplete or low-confidence work from progressing.

## When to use

Use when the task requires significant domain learning before coding, when acceptance depends on accurate understanding of external systems or data, or when the cost of guessing (rework, incorrect designs, missed constraints) is high. Skip for tasks where the implementation path is already clear and the context is fully known.

## Required inputs

- Task goal or spec with acceptance criteria.
- Reference sources, documentation, or data sources to research.
- Known constraints, non-goals, and sensitivity limits.
- Validation tooling and test infrastructure.

## Phase 1: Deep Research

### Goal

Gather all context needed to make correct implementation decisions. Research is systematic, not random browsing.

### Steps

1. **Scope the research**: define what questions the research must answer. List specific unknowns: API behavior, library semantics, domain concepts, existing patterns in the repo, prior art to mimic and avoid.
2. **Read primary sources**: official docs, API references, spec links, prior ADRs, relevant source files in the repo. Note exact sections that settle decisions.
3. **Examine prior art**: find the closest existing implementation in the repo — positive examples to follow and negative examples to avoid. Record file paths and one-line reasons for each.
4. **Document findings**: produce a structured research findings document covering:
   - questions answered (with source citations);
   - positive prior art (paths and rationale);
   - negative prior art (paths and rationale);
   - unresolved questions that block implementation;
   - confidence score (1–10) that the research is sufficient.

### Checkpoint

Research is complete when:
- All blocking questions are answered.
- Confidence score is 7 or higher.
- Findings document is structured and citable.
- If below 7, record exactly what is missing before proceeding.

## Phase 2: Synthesis

### Goal

Distill research findings into actionable design decisions and an implementation plan. Synthesis is where context becomes direction.

### Steps

1. **Map findings to decisions**: for each research finding, record what it means for the implementation. Example: "Library X does not support streaming → we must buffer the full response."
2. **Resolve contradictions**: if research sources disagree, document the conflict and the resolution (which source to trust and why).
3. **Produce the implementation brief**: using `templates/implementation-brief-template.md`, write a brief that includes:
   - objective and acceptance criteria traceable to research;
   - in-scope change list and explicit non-goals;
   - technical context from research (API contracts, constraints, patterns);
   - file changes required, mapped to research findings;
   - ordered validation gates with observable pass conditions;
   - confidence score from research, updated if synthesis changed it.
4. **Identify risks and rollback points**: what could go wrong, what mitigations exist, how to roll back.

### Checkpoint

Synthesis is complete when:
- Every acceptance criterion is traced to a research finding.
- Implementation brief has a confidence score of 7 or higher.
- Risks and rollback points are documented.
- Brief is ready for execution.

## Phase 3: Code Generation

### Goal

Implement the brief in the smallest correct change set, following the patterns identified during research and the plan from synthesis.

### Steps

1. **Select the next ready task** from the brief's task list.
2. **Re-read the relevant research findings** before touching any file.
3. **Implement one slice at a time**, matching the positive examples and avoiding the negative ones identified in research.
4. **Run validation gates** in order (cheapest first), after each slice.
5. **Iterate until green**: if a gate fails, fix the root cause in the code — never weaken the check.

### Checkpoint

Code generation is complete when:
- All implementation slices are done.
- All validation gates pass on a fresh run.
- The diff matches the planned changes.
- Research findings were consulted during implementation to prevent guesswork.

## Phase 4: Validation

### Goal

Prove the implementation meets acceptance criteria using evidence from execution, not assertion.

### Steps

1. **Run the ordered validation gates** from the implementation brief. Every gate must pass.
2. **Validate against research**: cross-check the implementation against the research findings. Did we handle the API behavior documented in research? Did we follow the positive patterns? Did we avoid the known pitfalls?
3. **Validate acceptance criteria**: for each acceptance criterion in the spec or brief, produce a pass/fail verdict with evidence (command output, screenshot, log excerpt).
4. **Review the diff** for unrelated churn, secrets, attribution issues, and scope creep.
5. **Record assumptions discovered**: any behavior or constraint discovered during coding that was not in research or synthesis.
6. **Report**: changed files, validation results, assumptions, follow-ups.

### Checkpoint

Validation is complete when:
- Every acceptance criterion passes with evidence.
- Every validation gate is green.
- Research cross-check confirms no research blind spots caused errors.
- Diff is clean and scoped.

## Failure modes

- Skipping research and guessing API behavior or library semantics.
- Research that is broad but shallow — many links, no settled decisions.
- Synthesis disconnected from research — decisions that contradict findings.
- Code generation ignoring research findings (repeating known anti-patterns).
- Validation that only checks new code, not integration with existing code.
- Treating the pipeline as strictly sequential when iteration between phases is valuable (research → synthesis → code → research → ...).

## Related skills and templates

- `skills/core/context-rich-implementation/SKILL.md` — context-rich brief pattern that feeds the synthesis phase.
- `templates/research-findings-template.md` — structured research output format.
- `templates/implementation-brief-template.md` — synthesis artifact.
- `commands/vibe-brief.md` — creates the brief that drives phases 2–4.
- `commands/vibe-brief-execute.md` — executes with validation gates (phases 3–4).
- `docs/workflows/context-engineering.md` — context gathering workflow that pairs with deep research.
- `references/features/research-to-code-pipeline.md` — design rationale.

## Ghi chú tiếng Việt

Pipeline bốn pha: Nghiên cứu sâu (Deep Research) → Tổng hợp (Synthesis) → Sinh mã (Code Generation) → Kiểm thử (Validation). Mỗi pha có checkpoint và tạo artifact riêng. Nghiên cứu trả lời câu hỏi cụ thể, tổng hợp biến câu trả lời thành quyết định thiết kế, code theo brief, và kiểm thử đối chiếu với nghiên cứu. Không skip research nếu implementation path chưa rõ.
