# Contributing to Vibe Coding OS

Thank you for your interest in contributing to Vibe Coding OS! This is a markdown-first AI coding skill framework, and we welcome contributions of all kinds — from bug reports and documentation improvements to new skills, commands, and templates.

Whether you're fixing a typo, adding a skill inspired by your workflow, or improving the onboarding experience, every contribution helps make disciplined AI-assisted coding more accessible.

## Ways to Contribute

- **Report bugs** — Found something broken or inconsistent? [Open an issue](https://github.com/roronoazoroshao369/vibe-coding-os/issues/new?template=bug_report.md) using the bug report template.
- **Suggest features or skills** — Have an idea for a new skill, command, or workflow? [Open a feature request](https://github.com/roronoazoroshao369/vibe-coding-os/issues/new?template=feature_request.md).
- **Submit pull requests** — Ready to contribute code or documentation? See the [Pull Request Process](#pull-request-process) below.
- **Improve documentation** — Clarify guides, fix examples, add translations, or improve onboarding.
- **Add examples** — Share real-world workflow examples that demonstrate the framework in action.

## Development Setup

Getting started is straightforward — this is a markdown-first project with minimal tooling:

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/vibe-coding-os.git
   cd vibe-coding-os
   ```

2. **No build step needed** — the framework is markdown-first. Skills, commands, and templates are pure markdown files.

3. **Install dependencies** (for validation scripts only):
   ```bash
   npm install
   ```

4. **Run validation** to confirm the repo is in a clean state:
   ```bash
   npm run validate
   ```

## Adding a New Skill

Skills are the core operating procedures in Vibe Coding OS. Each skill is a portable, self-contained markdown file.

### Steps

1. **Create a directory** under the appropriate category:
   ```
   skills/{category}/{skill-name}/
   ```
   Categories: `core`, `prompts`, `memory`, `meta`, `agents`

2. **Create `SKILL.md`** with the standard structure:
   ```markdown
   # Skill Name

   ## Purpose
   What this skill accomplishes.

   ## When to use
   Scenarios where this skill applies.

   ## Inputs
   What information or context the skill requires.

   ## Workflow
   Step-by-step operating procedure.

   ## Outputs
   What the skill produces.

   ## Failure modes
   What can go wrong and how to handle it.

   ## Verification checklist
   How to confirm the skill worked correctly.
   ```

3. **Register the skill** by adding an entry to `registry/skills.json`:
   ```json
   {
     "name": "skill-name",
     "category": "core",
     "path": "skills/core/skill-name/SKILL.md",
     "description": "Brief description of what this skill does."
   }
   ```

4. **Update `ATTRIBUTIONS.md`** if your skill was inspired by upstream work.

5. **Run validation:**
   ```bash
   npm run validate
   ```

## Adding a New Command

Commands are short, reusable prompts that trigger a specific workflow phase.

### Steps

1. **Create a command file** named `vibe-{name}.md` in the `commands/` directory:
   ```
   commands/vibe-{name}.md
   ```

2. **Register the command** by adding an entry to `registry/prompts.json`:
   ```json
   {
     "name": "vibe-{name}",
     "path": "commands/vibe-{name}.md",
     "description": "Brief description of what this command does."
   }
   ```

3. **Run validation:**
   ```bash
   npm run validate
   ```

## Adding a New Template

Templates help users create consistent project artifacts (specs, plans, reviews, etc.).

### Steps

1. **Create a template file** in the `templates/` directory:
   ```
   templates/{name}-template.md
   ```

2. **Update relevant documentation** to reference the new template where appropriate.

3. **Run validation:**
   ```bash
   npm run validate
   ```

## Adding an Upstream Reference

Vibe Coding OS learns from upstream projects through its Reference Intelligence Layer. When adopting ideas from external sources, follow this process to maintain clean attribution.

### Steps

1. **Read the adoption policy** — Start with [`docs/UPSTREAM_ADOPTION_POLICY.md`](docs/UPSTREAM_ADOPTION_POLICY.md) to understand classification and the 7-point adoption gate.

2. **Create a source document** in `references/sources/`:
   ```
   references/sources/{source-name}.md
   ```

3. **Create feature documents** in `references/features/` for each adopted pattern:
   ```
   references/features/{feature-name}.md
   ```

4. **Create mappings** in `references/mappings/` linking upstream features to local skills:
   ```
   references/mappings/{mapping-name}.md
   ```

5. **Create a changelog** in `references/changelogs/`:
   ```
   references/changelogs/{source-name}-changelog.md
   ```

6. **Update `references/index.json`** with the new source entry.

7. **Update `ATTRIBUTIONS.md`** to record the attribution decision.

8. **Run validation:**
   ```bash
   npm run validate
   ```

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** — keep them small, correct, and reviewable.

3. **Run validation** — this must pass before submitting:
   ```bash
   npm run validate
   ```

4. **Update documentation** if your change affects user-facing behavior, adds a new skill/command/template, or changes workflows.

5. **Update registries** — if you added a skill, command, or template, update the corresponding registry file (`skills.json`, `prompts.json`, etc.).

6. **Submit your PR** with a clear description of what changed and why.

7. **Fill out the PR template checklist** — confirm validation passes, documentation is updated, and attribution is clean.

## Style Guide

Follow these conventions to keep the framework consistent:

- **Markdown-first** — no unnecessary dependencies or build steps.
- **Kebab-case** for all directories and filenames (e.g., `spec-first-development`, `vibe-spec.md`).
- **Skill files** are always named `SKILL.md` inside their directory.
- **Commands** are always prefixed with `vibe-` (e.g., `vibe-spec.md`, `vibe-plan.md`).
- **Templates** are suffixed with `-template` (e.g., `spec-template.md`, `plan-template.md`).
- **English** for skills, commands, and templates. Vietnamese is welcome in `docs/vi/`.
- **No secrets** — never commit credentials, tokens, private keys, or sensitive personal data.
- **Attribution is a first-class artifact** — record upstream inspiration before importing.

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Questions?

- **GitHub Discussions** — for questions, ideas, and conversations about the framework.
- **GitHub Issues** — for bug reports, feature requests, and specific problems.

Open a discussion or issue at: https://github.com/roronoazoroshao369/vibe-coding-os

## Governance and maintainer process

- Read [`docs/governance.md`](docs/governance.md) for maintainer roles, change categories, review requirements, safety review rules, upstream import governance, and deprecation policy.
- Use [`docs/decision-record-process.md`](docs/decision-record-process.md) for architecture or policy decisions that should be recorded as ADRs.
- Review [`docs/maintainer-guide.md`](docs/maintainer-guide.md) for weekly and monthly maintenance checks, PR review expectations, validation/eval/dashboard commands, release flow, and compatibility change handling.

---

*Lời nhắn ngắn: Cảm ơn bạn đã quan tâm đến Vibe Coding OS! Mọi đóng góp — dù lớn hay nhỏ — đều giúp framework tốt hơn. Nếu bạn có thắc mắc, đừng ngần ngại mở issue hoặc discussion trên GitHub.* 🙏
