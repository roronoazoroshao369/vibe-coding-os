# Property-Based Testing in Vibe Coding OS

## Overview

Property-based testing (PBT) is a testing methodology where you define **properties** or **invariants** that must always hold true for your system, then use **randomized input generation** to verify those properties across a wide range of inputs. Unlike example-based testing (asserting specific input→output pairs), property-based testing explores the input space automatically to find edge cases you hadn't thought of.

In Vibe Coding OS, property-based testing is applied to **skills**, **commands**, and **templates** — the markdown artifacts that define agent behavior. The goal is to catch structural defects, content gaps, and invariant violations before they reach production.

## Key Concepts

### Properties / Invariants

A **property** is a statement that must always be true about your artifact. Examples:

- "Every skill has a `## Purpose` section."
- "Every command file has a non-empty body after front matter."
- "No markdown file contains broken link syntax."
- "All templates have at least one heading."
- "Every section is properly ordered (H1 before H2 before H3)."

### Generators / Input Space

Generators define the **universe of possible inputs** to test with. For markdown artifacts, the input space includes dimensions like:

- Heading levels (1-6)
- Section counts (0-20)
- Line lengths (0-1000 characters)
- Front matter presence (with/without)
- Content with special characters

The runner samples this input space randomly and checks invariants for each sample.

### Fuzz Testing

Fuzz testing is property-based testing with the goal of **finding crashes and edge cases**. The runner generates random variations of valid inputs and verifies that:

1. No crashes occur (runtime errors, unhandled exceptions)
2. Invariants still hold
3. Output structure is consistent

## Writing Property Tests

### Built-in Tests

The property test runner automatically runs built-in tests on every skill, command, and template in the repository. These tests include:

| Invariant | Description |
|-----------|-------------|
| `file_exists` | The target file exists on disk |
| `has_content` | The file has non-empty body content |
| `has_heading` | The file contains at least one markdown heading |
| `has_valid_front_matter` | Front matter (if present) is well-formed |
| `no_placeholder_content` | No TODO, FIXME, or Lorem Ipsum placeholders |
| `no_markdown_issues` | No broken links, unclosed code fences, etc. |
| `section_exists_purpose` | Skills have a `## Purpose` section |
| `section_exists_workflow` | Skills have a `## Workflow` section |
| `valid_section_ordering` | Heading levels don't skip (e.g., H1→H3 without H2) |
| `reasonable_length` | Content is not too short or excessively long |

### Custom Property Test Definitions

To write custom property tests, create a JSON file in the `property-tests/` directory with the following structure:

```json
{
  "name": "my-skill-structural-test",
  "description": "Validates structural properties of my skill file",
  "target": {
    "type": "skill",
    "path": "property-tests/skill-structural-test.json",
    "required_sections": ["Purpose", "Workflow", "Inputs", "Outputs"]
  },
  "properties": [
    {
      "name": "has_all_sections",
      "description": "All required sections are present",
      "category": "structural"
    },
    {
      "name": "workflow_has_steps",
      "description": "Workflow section contains numbered steps",
      "category": "content"
    }
  ],
  "generators": {
    "input_space": {
      "dimensions": [
        {
          "name": "heading_level",
          "type": "integer",
          "min": 1,
          "max": 6,
          "description": "Markdown heading level to test"
        },
        {
          "name": "section_name",
          "type": "enum",
          "values": ["Purpose", "Workflow", "Inputs", "Outputs", "Failure modes"],
          "description": "Section name to look for"
        }
      ],
      "generation_strategy": "random",
      "iterations": 50
    }
  },
  "invariants": [
    {
      "name": "section_count_minimum",
      "assertion": "artifact must have at least 3 sections",
      "category": "structural"
    },
    {
      "name": "no_empty_sections",
      "assertion": "no section body may be empty",
      "category": "content"
    }
  ],
  "tags": ["skill", "structural", "critical"],
  "enabled": true
}
```

## Running Property Tests

### Run all property tests

```bash
npm run test:property
```

### Run with verbose output

```bash
node scripts/property-test-runner.mjs --verbose
```

### Filter by target type

```bash
node scripts/property-test-runner.mjs --target skill
node scripts/property-test-runner.mjs --target command
node scripts/property-test-runner.mjs --target template
```

### Dry run (list tests without executing)

```bash
node scripts/property-test-runner.mjs --dry-run
```

## Output Format

The runner outputs a JSON object with:

```json
{
  "runner": "property-test-runner",
  "version": "1.0.0",
  "startedAt": "2026-06-19T...",
  "finishedAt": "2026-06-19T...",
  "durationMs": 1234,
  "tests_run": 42,
  "failures": 1,
  "errors": 0,
  "invariants_checked": 420,
  "results": [
    {
      "name": "skill:test-driven-development",
      "target": { "type": "skill", "path": "skills/core/test-driven-development/SKILL.md" },
      "builtin": true,
      "passed": true,
      "invariants": [
        { "name": "file_exists", "passed": true, "detail": null },
        { "name": "has_content", "passed": true, "detail": null },
        ...
      ],
      "iterations": 100,
      "durationMs": 12
    }
  ]
}
```

## Best Practices

1. **Start with built-in tests** — they cover the most common structural issues.
2. **Add custom tests for domain-specific properties** — if your skill requires specific sections or content patterns.
3. **Use diverse input dimensions** — cover boundaries (empty, very long, special characters).
4. **Set appropriate iteration counts** — 100 iterations for broad coverage, 500+ for thorough fuzzing.
5. **Tag tests by category** — use tags like `critical`, `structural`, `content` for filtering.
6. **Keep invariants simple** — each invariant should test exactly one property.
7. **Run before release** — add `npm run test:property` to your release pipeline.

## Integration with CI

Add a property test step to your CI workflow:

```yaml
- name: Run property-based tests
  run: npm run test:property
```

The runner exits with code 0 if all tests pass, 1 if any failures occur, and 2 on fatal errors.

## Invariant Categories

| Category | Description | Example |
|----------|-------------|---------|
| structural | File structure, sections, heading hierarchy | "Every skill has ## Purpose" |
| format | Markdown formatting, link validity | "No broken markdown links" |
| content | Text content, placeholders, completeness | "No TODO markers in production files" |
| consistency | Cross-file consistency | "All skills named in registry exist" |
| behavioral | Runtime behavior properties | "Running a command produces expected output format" |

## Examples

### Example 1: Validating all commands have valid markdown

The built-in runner automatically checks every command file for:
- Non-empty body content
- At least one heading
- No broken markdown links
- No unclosed code fences

### Example 2: Testing a skill's workflow completeness

Create `property-tests/skill-workflow-test.json`:

```json
{
  "name": "skill-workflow-completeness",
  "description": "Ensures all skills have complete workflow sections",
  "target": {
    "type": "skill",
    "path": "property-tests/skill-workflow-test.json"
  },
  "properties": [
    {
      "name": "workflow_has_steps",
      "description": "Workflow contains numbered steps",
      "category": "content"
    }
  ],
  "generators": {
    "input_space": {
      "dimensions": [
        {
          "name": "min_step_count",
          "type": "integer",
          "min": 1,
          "max": 20,
          "description": "Minimum expected workflow steps"
        }
      ],
      "generation_strategy": "boundary",
      "iterations": 50
    }
  },
  "invariants": [
    {
      "name": "section_not_empty",
      "assertion": "workflow section is not empty",
      "category": "content"
    }
  ]
}
```

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| All tests fail with "file does not exist" | Path in `target.path` is wrong | Check the relative path from repo root |
| "has_content" fails but file exists | File contains only YAML front matter | Add markdown body content |
| "no_markdown_issues" finds broken links | URL is empty or `#` placeholder | Fix or remove broken links |
| "valid_section_ordering" fails | Heading level jumps (H1→H3) | Restructure headings sequentially |
| Fuzz tests time out | Too many iterations or complex generators | Reduce `iterations` or simplify dimensions |
