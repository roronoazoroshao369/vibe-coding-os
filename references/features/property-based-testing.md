# Feature: Property-Based Testing

## Goal

Define how Vibe Coding OS supports property-based testing (PBT) as a native capability: a methodology where invariant assertions about skills, commands, and templates are verified through systematic fuzz testing with randomized inputs, catching structural defects and edge cases that example-based tests miss.

## Reference sources

This is an **original local capability** — no upstream source is directly adapted. The approach draws inspiration from:

- **Hypothesis (Python PBT library)**: Property-based testing methodology and invariant-driven verification philosophy.
- **QuickCheck (Haskell)**: Original property-based testing framework concepts of random generation and shrinking.
- **fast-check (TypeScript)**: Modern PBT patterns for input space definition and combinatorial testing.

All design and implementation is original; no upstream code, prompts, or templates are vendored.

## Local implementation

- `schemas/property-based-test.schema.json` — JSON Schema defining property-based test definition structure.
- `scripts/property-test-runner.mjs` — Runner that fuzz-tests skills, commands, and templates with randomized inputs.
- `docs/property-based-testing.md` — User guide explaining the methodology, how to write property tests, and examples.
- `property-tests/` (optional directory) — Custom property test definition files.

## Core concepts

### Properties / Invariants

A property is a statement that must always hold true about a skill, command, or template. Properties are categorized as:

| Category | Description | Example |
|----------|-------------|---------|
| **structural** | File and section structure | "Every skill has a ## Purpose section" |
| **format** | Markdown formatting rules | "No broken links, unclosed code fences" |
| **content** | Text content quality | "No TODO or FIXME placeholders" |
| **consistency** | Cross-document consistency | "Skills referenced in registry exist as files" |
| **completeness** | Required content presence | "Workflow section has numbered steps" |

### Generators / Input Space

Generators define the input space dimensions for fuzz testing. Each dimension has:
- A name, type (integer, string, boolean, enum, text_block)
- Constraints (min, max, allowed values)
- Nullability flag

The runner samples this space and generates random input combinations to test invariants against.

### Built-in Invariants

The runner includes 10 built-in invariants that apply to all targets:
1. `file_exists` — Target file exists on disk
2. `has_content` — Body content is non-empty
3. `has_heading` — At least one markdown heading
4. `has_valid_front_matter` — Front matter is well-formed (if present)
5. `no_placeholder_content` — No TODO/FIXME/Lorem Ipsum
6. `no_markdown_issues` — No broken links, unclosed fences, etc.
7. `section_exists_purpose` — Skills have ## Purpose
8. `section_exists_workflow` — Skills have ## Workflow
9. `valid_section_ordering` — Heading levels don't skip
10. `reasonable_length` — Not too short or excessively long

## Applied patterns

- **Automatic discovery**: Runner discovers all skills, commands, and templates automatically.
- **Built-in + custom**: 10 built-in invariants run on everything; custom tests can add more.
- **Fuzz generation**: Random input generation with configurable dimensions and iteration counts.
- **JSON output**: Structured results suitable for CI pipelines and dashboards.
- **Zero third-party dependencies**: Pure Node.js implementation using only built-in modules.
- **Vietnamese output**: Summary in Vietnamese when appropriate.

## Not applied

- **Shrinking**: Minimal failing input reduction is not yet implemented (future enhancement).
- **Runtime state fuzzing**: The runner tests static markdown artifacts, not live runtime state.
- **External PBT libraries**: No Hypothesis, QuickCheck, or fast-check dependency.
- **CI integration**: No automatic CI integration — use `npm run test:property` manually or in workflows.

## Must-have behavior

- A property test definition validates against its JSON Schema.
- The runner discovers all skills (via `skills/*/SKILL.md`), commands (`commands/*.md`), and templates (`templates/*.md`).
- Built-in invariants run on every discovered artifact.
- Custom test definitions in `property-tests/*.json` are loaded and executed.
- Output is valid JSON with `tests_run`, `failures`, `errors`, `invariants_checked` fields.
- Exit code 0 = all pass, 1 = failures/errors, 2 = fatal error.

## Future enhancements

- Input shrinking to find minimal failing cases
- Property test generation from skill/command/template schemas
- Statistical profiling of input space coverage
- Integration with quality engine for gate-based property testing
- Test result history and trend tracking
