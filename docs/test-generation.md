# Test Generation — Automatic Test Generator Guide

## Overview

The test generator (`scripts/test-generator.mjs`) analyzes existing `SKILL.md` files and command documentation to automatically generate property-based test scaffolds. It extracts:

- **Input parameters** from command docs (flags, arguments, options)
- **Decision points** from SKILL workflows (conditional logic, branching)
- **Edge cases** from documented constraints (failure modes, limitations)

The generated tests serve as a starting point for property-based testing, providing structured placeholders that document what should be tested.

## How It Works

### Extraction Pipeline

```
SKILL.md / command.md
    │
    ▼
┌─────────────────────────────┐
│  Section Extraction          │
│  (Purpose, Inputs, Workflow, │
│   Constraints, Failure Modes)│
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│  Pattern Matching            │
│  • Decision points (if/when) │
│  • Constraints (must/only)   │
│  • Parameters (--flags)      │
└──────────┬──────────────────┘
           ▼
┌─────────────────────────────┐
│  Test Generation             │
│  • describe/it blocks        │
│  • Assertion stubs           │
│  • Metadata comments         │
└──────────┬──────────────────┘
           ▼
     test/generated/*.test.mjs
```

### Source: SKILL.md Analysis

The generator scans each `SKILL.md` and extracts:

1. **Title** — from `# Heading` at top of file.
2. **Purpose** — from the `## Purpose` or `## Goal` section.
3. **Decision points** — regex patterns matching `if`, `when`, `unless`, `check`, `validate`, `ensure`, and conditional language in the workflow/body sections.
4. **Constraints / Edge cases** — regex patterns matching `must not`, `cannot`, `only valid for`, `error if`, `minimum/maximum`, and limitation language in constraints/failure-modes sections.
5. **Input parameters** — from `## Inputs` section, detected by markdown patterns like `--flag` or `**param**: description`.

### Source: Command Doc Analysis

The generator scans each command `.md` file and extracts:

1. **Title** — from `# Heading`.
2. **Usage** — from `## Usage` or `## Synopsis` section code block.
3. **Options** — from `## Options` or `## Flags` section, detecting `--flag` patterns with descriptions.

### Generated Test Format

Each test file follows this structure:

```javascript
// Auto-generated property test for: Skill Name
// Source: skills/core/grill-user-before-building/SKILL.md
// Generated: 2026-06-19T...

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

describe('Skill Name', () => {
  // Property: purpose must be defined
  it('should have a defined purpose', () => {
    assert.ok(true, 'Purpose description...');
  });

  // Decision point: when the input is invalid
  it('should handle decision: when the input is invalid', () => {
    // TODO: implement property-based test for "when the input is invalid"
    assert.ok(true, 'Decision point identified');
  });

  // Edge case: must not accept empty strings
  it('should respect constraint: must not accept empty strings', () => {
    // TODO: implement edge case test for "must not accept empty strings"
    assert.ok(true, 'Constraint identified');
  });

  // Input parameter: --verbose
  it('should accept parameter --verbose', () => {
    // TODO: implement parameter validation for --verbose
    assert.ok(typeof 'verbose' === 'string', 'Parameter name is string');
  });
});
```

## Usage

### Generate Tests

```bash
node scripts/test-generator.mjs [options]
```

**Options:**
| Flag | Description |
| --- | --- |
| `--output <path>` | Output directory (default: `test/generated/`) |
| `--force` | Overwrite existing files |
| `--verbose` | Print detailed extraction info |

### NPM Script

```json
{
  "test:generate": "node scripts/test-generator.mjs"
}
```

```bash
npm run test:generate
```

### Running Generated Tests

```bash
node --test test/generated/*.test.mjs
```

## Output Structure

```
test/generated/
├── index.md                          # Index of all generated tests
├── skills-core-example.test.mjs      # Skill property test
├── commands-vibe-example.test.mjs    # Command test
└── ...

registry/generated-tests.json         # Test registry with metadata
```

## Generated Test Registry

A JSON registry is written to `registry/generated-tests.json` containing:

```json
{
  "version": "2.7.0",
  "generated": "2026-06-19T...",
  "stats": {
    "totalSkillFiles": 45,
    "totalCommandFiles": 60,
    "totalTestsGenerated": 105,
    "totalDecisionPoints": 230,
    "totalEdgeCases": 85,
    "totalInputParameters": 180
  },
  "tests": [
    {
      "path": "test/generated/skills-core-example.test.mjs",
      "source": "skills/core/grill-user-before-building/SKILL.md",
      "type": "skill",
      "title": "Example Skill",
      "decisionCount": 3,
      "constraintCount": 2,
      "inputParamCount": 1
    }
  ]
}
```

## Best Practices

1. **Review generated tests.** They contain placeholder assertions (`assert.ok(true, ...)`) that must be replaced with real property-based assertions.
2. **Use fast-check for property-based testing.** The generated tests are designed to work with `fast-check` or similar libraries:

   ```javascript
   import fc from 'fast-check';
   
   it('should handle decision: when input is invalid', () => {
     fc.assert(
       fc.property(fc.string(), (input) => {
         // Test property holds for all strings
       })
     );
   });
   ```

3. **Don't re-generate over hand-written tests.** The generator creates new files in `test/generated/` and won't overwrite existing files unless `--force` is used.
4. **Commit generated tests.** They serve as documentation of known decision points and constraints, even before real assertions are written.
5. **Update when source files change.** Run `npm run test:generate` after adding or modifying skills/commands to keep tests in sync.

## Regeneration Strategy

The generator is idempotent: running it multiple times produces the same output for the same source files. However:

- New source files produce new test files.
- Changed source files produce updated test files (with `--force`).
- Removed source files do not automatically clean up old test files (manual cleanup needed).

## Vietnamese Summary (tóm tắt tiếng Việt)

Script test-generator phân tích file SKILL.md và command docs để tự động tạo các bài kiểm thử dạng property-based. Nó trích xuất tham số đầu vào, điểm quyết định (decision points) trong workflow, và các ràng buộc (edge cases). Kết quả được lưu trong `test/generated/` với index và registry. Các assertion placeholder cần được thay thế bằng assertion thực tế.
