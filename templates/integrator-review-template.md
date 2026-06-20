---
title: Integrator Review Template
type: template
name: integrator-review-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: review
tags:
  - template
  - review
status: stable
---

# Integrator Review Template

> Template for multi-agent integrator review artifacts.

## Review Metadata
- **Run ID**: `{{run_id}}`
- **Date**: `{{review_date}}`
- **Integrator**: `{{integrator}}`
- **Status**: `{{status}}`

## Agent Submissions
{{#each submissions}}
### {{this.agent_role}}
- **Task**: {{this.task}}
- **Status**: {{this.status}}
- **Confidence**: {{this.confidence}}

#### Deliverables
{{#each this.deliverables}}
  - `{{this.path}}` — {{this.description}}
{{/each}}

#### Issues Raised
{{#each this.issues}}
  - {{this.message}}
{{/each}}

---

{{/each}}

## Integration Conflicts
{{#each conflicts}}
- **Between**: `{{this.agent_a}}` ↔ `{{this.agent_b}}`
- **File**: `{{this.file}}`
- **Description**: {{this.description}}
- **Resolution**: {{this.resolution}}

{{/each}}

## Overall Assessment
{{assessment}}

## Recommendations
{{#each recommendations}}
- {{this}}
{{/each}}
