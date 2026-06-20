#!/usr/bin/env node
// tests/skills/bug-fix-lifecycle.test.mjs
// v2.15.0 — Wave B Deliverable 3: Regression test for bug-fix-lifecycle skill

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_PATH = resolve(__dirname, '../../skills/core/bug-fix-lifecycle/SKILL.md');

let pass = 0, fail = 0;
const check = (label, ok) => { if (ok) { console.log(`  ✅ ${label}`); pass++; } else { console.error(`  ❌ ${label}`); fail++; } };

if (existsSync(SKILL_PATH)) {
  check('SKILL.md exists', true);
  const content = readFileSync(SKILL_PATH, 'utf8');
  check('Has YAML frontmatter', content.startsWith('---\n'));
  check('Has ## Purpose section', content.includes('## Purpose'));
  check('Has ## When to use section', content.includes('## When to use'));
  check('Has ## Workflow section', content.includes('## Workflow'));
  check('Has ## Failure modes section', content.includes('## Failure modes'));
  check('Has ## Verification checklist section', content.includes('## Verification checklist'));
  // TDD phases
  check('Mentions RED phase (failing test)', /RED|failing test/i.test(content));
  check('Mentions GREEN phase (fix)', /GREEN|fix/i.test(content));
  check('Mentions regression', /regression/i.test(content));
} else {
  check('SKILL.md exists', false);
}

console.log(`\nTotal: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
