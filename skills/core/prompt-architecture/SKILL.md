# Skill: Prompt Architecture

## Purpose

Provide a structural recipe for authoring multi-section prompts (Persona, Context, Constraints, Toolset, Output Schema, Examples, Anti-patterns) that compose cleanly across our `prompts/`, `agents/`, and `skills/core/` layers. The recipe is **load-bearing**: the Anti-patterns section is the single biggest predictor of prompt quality because it blocks the most common failure modes before the model generates.

## When to use

Use when authoring a new prompt, refactoring a sprawling prompt that drifts in quality, or migrating a hard-coded prompt into the `prompts/` skill layer. Choose this skill when you need a documented structure with concrete section contracts — not a freeform "be a good prompt engineer" hand-wave.

## Inputs

- The prompt's purpose (one sentence, verb-first).
- The model profile (`lean` = short, `standard` = balanced, `heavy` = structured).
- The agent or skill that will invoke the prompt.
- The output schema the caller expects (markdown, JSON, YAML, plain text).
- Known failure modes to block in the Anti-patterns section.

## Workflow

1. Write the **Persona** section in one or two sentences: who is the model in this prompt, and what is its scope. Avoid role-playing a real person.
2. Write the **Context** section: the inputs the model has, the inputs it does not have, and the assumptions it should make. List them — do not bury them in prose.
3. Write the **Constraints** section: hard limits (token budget, time, scope), soft preferences (style, verbosity), and non-goals (what the prompt explicitly does not try to do).
4. Write the **Toolset** section: which tools the model may call, in what order, and with what guard rails (e.g., `npm run validate:all` before declaring done).
5. Write the **Output Schema** section: the exact shape the caller expects. Use a fenced block with a worked example.
6. Write the **Examples** section: at least one positive example (desired output) and one negative example (a common wrong output to avoid).
7. Write the **Anti-patterns** section: at least 3 concrete failure modes the prompt is known to fall into, with the corrective action for each. This section is load-bearing.
8. Verify the prompt under the `verification-before-done` 5-axis framework: DOM (output structure), Console (errors/warnings), Network (tool calls), Performance (latency), Visual (rendered output).

## Outputs

- A prompt artifact with the 7 sections in order: Persona, Context, Constraints, Toolset, Output Schema, Examples, Anti-patterns.
- A short rationale comment at the top documenting why each section was included.
- A passing run under `verification-before-done` with all 5 axes captured.

## Failure modes

- Skipping the Anti-patterns section (the model falls into known failure modes with no corrective action).
- Writing Constraints as prose instead of bullet points (the model ignores soft prose).
- Writing Output Schema without a worked example (the model invents a slightly different shape).
- Persona written as "You are a helpful assistant" (no scope, no differentiation).
- Mixing multiple personas in one prompt (the model averages them and produces mush).

## Verification checklist

- [ ] All 7 sections present and in order.
- [ ] Persona states scope in one sentence, not a role-play.
- [ ] Context lists inputs and assumptions as bullets, not prose.
- [ ] Constraints distinguish hard limits from soft preferences.
- [ ] Toolset lists tool names, order, and guard rails.
- [ ] Output Schema includes a worked example.
- [ ] Examples section has ≥ 1 positive and ≥ 1 negative example.
- [ ] Anti-patterns section has ≥ 3 concrete failure modes with corrective actions.
- [ ] Prompt verified under `verification-before-done` 5-axis framework.

## Related skills

- `skills/core/writing-skills/SKILL.md` — author skill files (the sister skill to this one for prompts)
- `skills/core/clarify-before-code/SKILL.md` — restate goal + assumptions before authoring
- `skills/core/grill-user-before-building/SKILL.md` — interview loop until 95% confidence

## Attribution

Inspired by [RohitG00/awesome-claude-code-toolkit](https://github.com/RohitG00/awesome-claude-code-toolkit) (Apache-2.0). Adapted in original wording with Vibe Coding OS-specific 5-axis verification.


## See also

- [`templates/prompt-template-7-section.md`](../../../templates/prompt-template-7-section.md) — drop-in 7-section prompt template.
