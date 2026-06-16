# Registry Schemas

Stable schema contracts define the shape of Vibe Coding OS registries and markdown artifacts.
They exist to make contribution expectations explicit and to support lightweight automated checks without a large schema engine.

## Schemas in this repository

- `schemas/reference-index.schema.json`
  - Contract for `references/index.json`
  - Requires `version`, `last_built`, and a `sources` array
  - Each source must include at least:
    - `id`
    - `name`
    - `owner`
    - `url`
    - `category`
    - `status`
    - `import_mode`
    - `license`
    - `reference_doc`
    - `changelog`

- `schemas/skill.schema.json`
  - Contract for skills under `skills/*/SKILL.md`
  - A valid skill must be a markdown file with:
    - a top-level `# Name` heading
    - a `## Purpose` section
  - The schema also documents optional sections such as `## When to use`, `## Inputs`, `## Workflow`, `## Outputs`, `## Failure modes`, and `## Verification checklist`

- `schemas/command.schema.json`
  - Contract for command prompts under `commands/`
  - Each command should have:
    - a `vibe-*` slug/filename
    - a short description (from front matter or prose)
    - non-empty markdown body content
  - Optional YAML front matter is allowed

- `schemas/template-manifest.schema.json`
  - Contract for reusable templates under `templates/`
  - Expected fields include:
    - `filename`
    - `description`
    - `sections`
  - Useful for documenting what a template is for and which headings readers should expect

## How these schemas are enforced

Schemas are **contract documents first**.
They do not replace human review, but they make expected structure explicit.

Lightweight validation is provided by:

- `scripts/validate-schemas.mjs`
- `npm run validate:schemas`

This validator:

1. Confirms the schema JSON files are valid JSON
2. Validates `references/index.json` against the reference index contract
3. Checks that skills have a `# Name` heading and a `## Purpose` section
4. Checks that commands exist and contain meaningful body content

The validator intentionally avoids external dependencies.
For this repository, pragmatic structural checks are more appropriate than a generic JSON Schema engine.

## Where to add new schemas

Add a new `*.schema.json` file in `schemas/` when a new registry or artifact family gains a stable shape.
Use a matching validator or extend `validate-schemas.mjs` only when the check is meaningful and low-churn.

Keep schemas focused on:

- required fields
- important enums or allowed values
- expected file conventions
- non-obvious structural expectations

Avoid schemas that become brittle documentation of every optional markdown subsection unless those subsections are enforced.
