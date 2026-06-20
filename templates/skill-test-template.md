---
description: "Template for per-skill regression test file (smoke test that the skill is still working)."
---

# Skill Test Template

## When to fill

When you author or maintain a skill, attach a regression test that proves the skill still works. This template is the canonical structure for `tests/skills/<skill-name>.test.mjs`.

## Structure

```javascript
#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';

const SKILL_PATH = 'skills/<category>/<skill-name>/SKILL.md';

if (!existsSync(SKILL_PATH)) {
  console.error('SKILL.md missing');
  process.exit(1);
}
const content = readFileSync(SKILL_PATH, 'utf8');
if (!content.includes('## Purpose') || !content.includes('## Workflow')) {
  console.error('Required sections missing');
  process.exit(1);
}
console.log('PASS');
```

## Run

```bash
node tests/skills/<skill-name>.test.mjs
```
