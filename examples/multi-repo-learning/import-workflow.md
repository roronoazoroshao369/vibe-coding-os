# Import Workflow: Cross-Repo Lesson to Golden Example

This workflow describes how a receiving repository imports an exported lesson, reviews it for privacy and relevance, and optionally promotes it to a golden example.

## Step 1: Receive the export

The source repo provides a lesson exchange JSON file like [`exported-lesson-sample.json`](exported-lesson-sample.json). It contains an envelope header (version, exporter info, source repo) and an array of lesson objects.

**Verify the envelope:**

- Check that `version` matches the receiving repo's lesson-exchange version (currently `2.3.0`).
- Note the source `repoId` and `repoName` — these become the provenance record.
- Confirm that `exportedAt` is recent enough to trust (lessons tied to stale model behavior or old dependencies should be flagged).

## Step 2: Privacy review

Before any lesson enters the local system, a maintainer or automated scan must confirm it contains no sensitive data.

**Run the checklist:**

- [ ] No secrets, credentials, tokens, or keys present in any lesson field.
- [ ] No private URLs, internal hostnames, or non-public identifiers.
- [ ] No raw stack traces, log excerpts, or code snippets that reveal internal structure.
- [ ] No proprietary paths, file names, or project-specific identifiers.
- [ ] Every description uses synthetic or generic examples where real data would have appeared.
- [ ] If the lesson includes a `fix` field, the fix is a pattern-level description, not a verbatim diff or patched file.

**If privacy review fails:**

1. Reject the lesson.
2. Notify the source repo maintainer with the specific concern (but do not forward the sensitive content itself).
3. Request a sanitized resubmission.

## Step 3: Relevance review

A lesson that passes privacy review still needs a relevance assessment. Each lesson carries metadata to help with this:

| Field | Evaluation question |
|---|---|
| `scope` | `global` lessons are broadly applicable; `language` applies to the same language; `framework` only if the receiving repo uses the same framework; `local` should generally be rejected. |
| `tags` | Do coverage, tooling, or domain tags overlap with the receiving repo's tech stack? |
| `confidence` | Treat < 0.7 as weak signal — requires stronger validation before import. |
| `crossRepoVerified` | If `true`, another repo has already validated the pattern. If `false`, add an internal verification step. |
| `expiry` | If set, the lesson will need review after that date. Lessons with past or very near expiry should be rejected or marked for immediate renewal. |
| `source` | `quality-engine` and `telemetry-analysis` lessons have machine evidence; `user` lessons rely on self-reporting and need extra scrutiny. |

**Decision outcomes:**

| Outcome | Action |
|---|---|
| **Reject** | Record why and discard. Notify the source only if pattern quality or misidentified scope caused the rejection. |
| **Import as lesson** | Add to the local lessons-learned DB with full provenance and a link back to the source export. Run matching prevention rules on the next similar task. |
| **Promote to golden example** | See Step 4. Requires a maintainer willing to write a safe, concrete example with validation evidence. |

## Step 4: Promote to golden example

Promotion upgrades a cross-repo lesson from a pattern description to a reusable, validated golden example that can be saved as `templates/golden-example-entry.md`.

**Preparation:**

1. Choose one lesson from the import that has clear value and is safe to illustrate concretely.
2. Write a full golden entry using `templates/golden-example-entry.md`. Replace the abstract pattern with a concrete, runnable or printable example that uses synthetic names.
3. Add evidence — a test snippet, a before-and-after comparison, or a quality-gate manifest entry that captures the rule.
4. Cross-reference the source export so readers can trace provenance.

**Validation (required before committing a promoted entry):**

- [ ] The entry contains no private or sensitive data.
- [ ] The example code compiles, parses, or is syntactically correct for its language.
- [ ] The prevention rule is specific enough to check mechanically (or at checklist level).
- [ ] The provenance links back to the source lesson export.
- [ ] If `crossRepoVerified` is `false`, an internal verification has been completed.

**Add the promotion to the inventory:**

- Save the file in `templates/` as a `.md` file following the `golden-example-entry.md` template.
- Update the repo's quality rubric, review checklist, or adaptive prompt matrix to reference the new example if it changes required checks.
- Run `npm run validate:traceability` to confirm any new internal links are valid.

## Step 5: Close the loop (optional but recommended)

Send a brief acknowledgment to the source repo maintainer:

- Which lessons were imported.
- Which (if any) were promoted.
- Whether the prevention rule is now part of an automated gate or workflow.
- General feedback on lesson structure or annotation quality.

This builds trust and encourages more cross-repo sharing.

## Quick decision flowchart

```
Receive export → Verify envelope
                     ↓
              Privacy review ──→ fail → Reject + notify source
                     ↓ pass
              Relevance review ──→ reject → Record reason, discard
                     ↓ pass
              Decision ──→ import as lesson only
                     ↓
              Promote to golden example ──→ Write entry, add evidence, validate
                     ↓
              Close the loop (optional)
```
