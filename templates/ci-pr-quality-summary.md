## Vibe Quality Gate Summary

![quality-score](https://img.shields.io/badge/quality-{{qualityScore}}%25-{{#if allPassed}}brightgreen{{else}}orange{{/if}})

**PR:** `{{prTitle}}`  
**Commit:** `{{commitSha}}`  
**Run:** [Workflow run link](https://github.com/actions/workflows)

---

### Gate Results

| Gate | Status | Duration |
| --- | --- | --- |
{{#each gates}}
| {{this.name}} | {{this.statusIcon}} {{this.status}} | {{this.duration}} |
{{/each}}

---

### Warnings

{{#if warnings.length}}
{{#each warnings}}
- {{this}}
{{/each}}
{{else}}
- None
{{/if}}

---

### Action items

{{#if actionItems.length}}
{{#each actionItems}}
- {{this}}
{{/each}}
{{else}}
- No action required.
{{/if}}

---

### Notes

- If secret scanning flagged false positives, review the allowlist patterns in `scripts/validate-secrets.mjs`.
- Upload the `{{artifactName}}` artifact for full logs and telemetry.
