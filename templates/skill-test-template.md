---
description: "Template for per-skill regression test file (smoke test that the skill is still working)."
---

# Skill Test Template

## When to fill

When you author or maintain a skill, attach a regression test that proves the skill still works. This template is the canonical structure for `tests/skills/<skill-name>.test.mjs`.

## Structure

```javascript
#!/usr/bin/env node
// tests/skills/<skill-name>.test.mjs
//
// v2.15.0 — Per-skill regression test for <skill-name>.
// Per Wave B Deliverable 4: "Write 1 test file per top-20 priority skill".

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_PATH = resolve(__dirname, '../../skills/<category>/<skill-name>/SKILL.md');

let pass = 0, fail = 0;

// Test 1: SKILL.md exists
if (existsSync(SKILL_PATH)) {
  console.log('  ✅ SKILL.md exists');
  pass++;
} else {
  console.error('  ❌ SKILL.md missing');
  fail++;
}

// Test 2: Required sections present
const content = readFileSync(SKILL_PATH, 'utf8');
const required = ['## Purpose', '## When to use', '## Outputs'];
for (const sec of required) {
  if (content.includes(sec)) {
    console.log(`  ✅ ${sec} present`);
    pass++;
  } else {
    console.error(`  ❌ ${sec} missing`);
    fail++;
  }
}

console.log(`\nTotal: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
```

## Run

```bash
node tests/skills/<skill-name>.test.mjs
```

## See also

- `tests/hooks/` — example of regression tests for security hooks
- `tests/security/` — example of security regression tests
