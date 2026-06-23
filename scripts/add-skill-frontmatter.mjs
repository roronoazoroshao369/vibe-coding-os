#!/usr/bin/env node
// scripts/add-skill-frontmatter.mjs
// v2.15.0 — Wave B: Bulk add YAML frontmatter to skills missing it.

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.resolve(ROOT, 'skills');

async function findSkillFiles(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        results.push(...await findSkillFiles(full));
      } else if (e.name === 'SKILL.md') {
        results.push(full);
      }
    }
  } catch { /* intentionally empty */ }
  return results;
}

function slugToName(slug) {
  return slug.split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

function deriveCategory(relPath) {
  // relPath looks like "skills/core/foo/SKILL.md"
  const parts = relPath.split('/');
  return parts[1] || 'core';
}

function deriveTags(name, category) {
  const tags = [category];
  // Add common tag based on name keywords
  const nameLower = name.toLowerCase();
  if (nameLower.includes('test')) tags.push('testing');
  if (nameLower.includes('review')) tags.push('review');
  if (nameLower.includes('debug')) tags.push('debugging');
  if (nameLower.includes('plan')) tags.push('planning');
  if (nameLower.includes('memory')) tags.push('memory');
  if (nameLower.includes('security') || nameLower.includes('secure')) tags.push('security');
  if (nameLower.includes('quality')) tags.push('quality');
  if (nameLower.includes('agent')) tags.push('agents');
  return [...new Set(tags)].slice(0, 4);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const skillFiles = await findSkillFiles(SKILLS_DIR);
  let added = 0, skipped = 0;

  for (const file of skillFiles) {
    const content = await readFile(file, 'utf8');
    // Skip if already has frontmatter
    if (content.startsWith('---\n')) {
      skipped++;
      continue;
    }

    // Extract name from first H1 heading
    const h1Match = content.match(/^# (.+)$/m);
    if (!h1Match) {
      console.warn(`  ⚠️  No H1 heading in ${file}, skipping`);
      continue;
    }
    const fullName = h1Match[1].replace(/^#+\s*/, '').replace(/^Skill:\s*/i, '').trim();
    const slugName = path.basename(path.dirname(file));
    const relPath = file.replace(ROOT + '/', '');
    const category = deriveCategory(relPath);
    const tags = deriveTags(slugName, category);
    const tagsYaml = tags.map(t => `  - ${t}`).join('\n');
    const desc = `Skill in the ${category} category. See skill content for purpose and workflow.`;

    const frontmatter = `---
name: ${slugName}
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: ${category}
tags:
${tagsYaml}
status: stable
---

`;

    const newContent = frontmatter + content;
    if (!dryRun) {
      await writeFile(file, newContent, 'utf8');
    }
    added++;
    if (added <= 5) {
      console.log(`  ${dryRun ? '[DRY]' : '✅'} ${relPath} (${slugName})`);
    }
  }

  console.log(`\n${dryRun ? '[DRY RUN] Would add' : 'Added'} frontmatter to ${added} skills, skipped ${skipped} (already had frontmatter)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
