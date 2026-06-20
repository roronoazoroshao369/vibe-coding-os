#!/usr/bin/env node
// scripts/add-template-frontmatter.mjs
// v2.15.0 — Wave B: Bulk add YAML frontmatter to templates missing it.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.resolve(ROOT, 'templates');

function deriveCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('test')) return 'testing';
  if (lower.includes('review')) return 'review';
  if (lower.includes('plan')) return 'planning';
  if (lower.includes('spec')) return 'spec';
  if (lower.includes('security') || lower.includes('threat')) return 'security';
  if (lower.includes('api') || lower.includes('db') || lower.includes('migration')) return 'engineering';
  if (lower.includes('memory')) return 'memory';
  if (lower.includes('agent') || lower.includes('subagent')) return 'agents';
  return 'template';
}

function deriveTags(name) {
  const tags = [];
  const lower = name.toLowerCase();
  if (lower.includes('template')) tags.push('template');
  if (lower.includes('test')) tags.push('testing');
  if (lower.includes('review')) tags.push('review');
  if (lower.includes('plan')) tags.push('planning');
  if (lower.includes('spec')) tags.push('specification');
  if (lower.includes('api')) tags.push('api');
  if (lower.includes('db') || lower.includes('database')) tags.push('database');
  if (lower.includes('migration')) tags.push('migration');
  if (lower.includes('security') || lower.includes('threat')) tags.push('security');
  if (lower.includes('memory')) tags.push('memory');
  if (lower.includes('agent')) tags.push('agents');
  if (lower.includes('quality')) tags.push('quality');
  if (lower.includes('red-team') || lower.includes('bypass')) tags.push('red-team');
  if (lower.includes('skill')) tags.push('skills');
  if (lower.includes('adr')) tags.push('architecture');
  if (lower.includes('brownfield') || lower.includes('greenfield')) tags.push('specification');
  return [...new Set(tags)].slice(0, 4);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const entries = await readdir(TEMPLATES_DIR);
  let added = 0, skipped = 0;

  for (const name of entries) {
    if (!name.endsWith('.md')) continue;
    const file = path.join(TEMPLATES_DIR, name);
    const content = await readFile(file, 'utf8');

    if (content.startsWith('---\n')) {
      skipped++;
      continue;
    }

    // Extract H1 heading
    const h1Match = content.match(/^#\s+(.+)$/m);
    const title = h1Match ? h1Match[1].replace(/^#+\s*/, '').trim() : name.replace('.md', '');
    const slug = name.replace('.md', '');
    const category = deriveCategory(slug);
    const tags = deriveTags(slug);
    const tagsYaml = tags.map(t => `  - ${t}`).join('\n');

    const frontmatter = `---
title: ${title}
type: template
name: ${slug}
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
    if (added <= 3) {
      console.log(`  ${dryRun ? '[DRY]' : '✅'} ${name} (${slug})`);
    }
  }

  console.log(`\n${dryRun ? '[DRY RUN] Would add' : 'Added'} frontmatter to ${added} templates, skipped ${skipped} (already had frontmatter)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
