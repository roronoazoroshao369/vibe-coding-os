# Skill: Plugin Bundle System — Defining, Composing, and Activating Skill Bundles

## Purpose

Define and use domain-organized skill bundles that group complementary skills for common development scenarios. Bundles are discovery groupings, not runtime loaders — they help agents and humans quickly activate the right skill stack for web development, data science, security review, or other recurring domains.

## When to use

Use when starting work in a well-defined domain (web dev, data science, security review), when proposing a new bundle for a recurring workflow pattern, when adding a skill that belongs to an existing bundle, or when a session needs a focused set of skills without loading every available skill.

## Inputs

`registry/bundles.json` for existing bundle definitions, `registry/skills.json` for individual skill entries, the target domain scenario, and the list of skills needed to cover that scenario.

## Core principle: bundles are playlists, not packages

A bundle is a curated list of skills that work well together for a specific domain. It does not install, execute, or configure anything. It is a suggestion — "start here if you are doing web development." The agent reads the bundle manifest and decides which skills to actually load based on the specific task.

## Bundle manifest structure

Bundles live in `registry/bundles.json`. Each bundle entry has:

- **name**: short kebab-case identifier
- **description**: one-line summary of the domain scenario
- **skills[]**: list of skill names matching entries in `registry/skills.json`
- **dependencies[]**: other bundles that should be considered before or alongside this one
- **category**: "domain" for scenario bundles; reserved for future use

Example:

```json
{
  "name": "web-dev",
  "description": "Full-stack web development: API, frontend state, DB migrations, auth, and review.",
  "skills": ["api-endpoint-quality", "frontend-state-quality", "db-migration-quality", "auth-quality"],
  "dependencies": [],
  "category": "domain"
}
```

## Defining a new bundle

1. Identify a domain scenario that recurs across projects (e.g., "security review", "data pipeline", "frontend feature").
2. List the skills that an agent should consider for that scenario. Start with 3-5 skills; a bundle should be focused, not exhaustive.
3. Check each skill in `registry/skills.json` to confirm it exists and the name matches.
4. Add the bundle entry to `registry/bundles.json`. Use the alphabetical ordering convention.
5. Update each member skill's `registry/skills.json` entry to include the `bundle` field.
6. Update mapping docs and run validation.

## Composing bundles

Bundles can be composed for complex workflows:

- A "web-dev" bundle plus a "security-review" bundle covers a full-stack feature with security gates.
- A "data-science" bundle plus a "memory-workflow" bundle covers an ML experiment with full traceability.
- A "cli-tools" bundle plus a "web-dev" bundle covers a CLI tool that serves a web API.

When composing bundles, check for skill overlap (a skill in both bundles is fine) and potential conflicts (two bundles that recommend contradictory approaches).

## Activating a bundle

Activation is a selection, not an execution:

1. Detect the task domain from the user's goal, file paths, or explicit request.
2. Look up the matching bundle in `registry/bundles.json`.
3. Read the listed skills from `registry/skills.json` and load the relevant SKILL.md files.
4. Check each skill's composability metadata (Works with, Conflicts with, Depends on) to build a coherent stack.
5. Optionally present the selected bundle to the user for confirmation before loading skills.

The `vibe-init` command supports a `--bundle` option for explicit bundle activation at session start:

```
# Activate the web-dev bundle
vibe-init --bundle web-dev

# Activate multiple bundles
vibe-init --bundle web-dev,security-review
```

## Bundle lifecycle

- **Creation**: define the bundle in `registry/bundles.json`, tag member skills
- **Maintenance**: update the bundle when member skills change or new relevant skills appear
- **Deprecation**: mark a bundle as deprecated by adding `"status": "deprecated"` — do not delete it immediately, as existing sessions may reference it
- **Removal**: remove after a transition period, update all affected skills, and run validation

## Workflow

1. **Detect domain.** Identify the task domain from the user's goal, file paths, or explicit request.
2. **Look up bundle.** Find the matching bundle in `registry/bundles.json`.
3. **Read member skills.** Load each listed skill's SKILL.md. Check composability metadata (Works with, Conflicts with, Depends on).
4. **Confirm with user.** Present the selected bundle for confirmation before loading skills.
5. **Activate selectively.** Load only the skills that match the current task phase, not the entire bundle.

## Outputs

A defined or updated bundle manifest, updated skill entries with bundle tags, and validation passes confirming referential integrity.

## Failure modes

- Creating bundles that are too broad ("everything" is not a useful bundle).
- Creating bundles that are too narrow (a bundle with one skill is just the skill).
- Forgetting to update bundles when member skills are renamed or removed.
- Treating bundles as required loading groups instead of optional suggestions.
- Letting bundles accumulate without periodic review — stale bundles mislead agents.

## Verification checklist

- [ ] Bundle name is kebab-case and unique.
- [ ] All listed skills exist in `registry/skills.json`.
- [ ] Each member skill has the corresponding `bundle` field in its registry entry.
- [ ] Bundle description clearly states the domain scenario.
- [ ] Bundle has at least 3 skills and no more than 12.
- [ ] `npm run validate` passes after bundle changes.

## Ghi chú tiếng Việt

Bundle là danh sách kỹ năng theo tình huống (playlist), không phải gói cài đặt. Không có engine hay runtime. Định nghĩa trong `registry/bundles.json`, mỗi skill thành viên có trường `bundle` trong registry. Kích hoạt bằng cách đọc manifest và tải các skill được liệt kê. `vibe-init --bundle web-dev` để kích hoạt tường minh.
