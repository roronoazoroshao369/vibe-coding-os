#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const errors = [];
const requiredFeatureDocs = [
  'spec-driven-development.md',
  'persistent-memory.md',
  'skill-orchestration.md',
  'multi-agent-workflow.md',
  'anti-overengineering.md',
  'tdd-loop.md',
  'review-before-merge.md'
].map((file) => path.join('references', 'features', file));
const requiredMappingDocs = [
  'source-to-local-skills.md',
  'feature-to-local-files.md',
  'update-impact-map.md'
].map((file) => path.join('references', 'mappings', file));
const requiredReferenceCommands = [
  'vibe-reference-add.md',
  'vibe-reference-audit.md',
  'vibe-reference-update.md',
  'vibe-reference-index.md',
  'vibe-upstream-sync.md'
].map((file) => path.join('commands', file));

function requireFile(file) {
  if (!existsSync(file)) errors.push(`Missing required file: ${file}`);
}

requireFile('references/index.json');
for (const file of [...requiredFeatureDocs, ...requiredMappingDocs, ...requiredReferenceCommands]) requireFile(file);

let index = null;
if (existsSync('references/index.json')) {
  try {
    index = JSON.parse(await readFile('references/index.json', 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in references/index.json: ${error.message}`);
  }
}

if (index) {
  if (!Array.isArray(index.sources)) {
    errors.push('references/index.json must contain a sources array.');
  } else {
    const seen = new Set();
    const requiredFields = ['id', 'name', 'owner', 'url', 'category', 'status', 'import_mode', 'reference_doc', 'changelog'];
    for (const [position, source] of index.sources.entries()) {
      const label = source?.id || `source at index ${position}`;
      for (const field of requiredFields) {
        if (!source || typeof source[field] !== 'string' || source[field].trim() === '') {
          errors.push(`${label} is missing required string field: ${field}`);
        }
      }
      if (source?.id) {
        if (seen.has(source.id)) errors.push(`Duplicate source id: ${source.id}`);
        seen.add(source.id);
      }
      if (source?.reference_doc) requireFile(source.reference_doc);
      if (source?.changelog) requireFile(source.changelog);
      if (source?.local_targets !== undefined) {
        if (!Array.isArray(source.local_targets)) {
          errors.push(`${label} local_targets must be an array.`);
        } else {
          for (const target of source.local_targets) {
            if (typeof target !== 'string' || target.trim() === '') {
              errors.push(`${label} has an invalid local target entry.`);
            } else if (!existsSync(target)) {
              errors.push(`${label} local target does not exist: ${target}`);
            }
          }
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Reference Intelligence Layer validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Reference Intelligence Layer validation passed.');
console.log(`Checked ${index.sources.length} sources, ${requiredFeatureDocs.length} feature docs, ${requiredMappingDocs.length} mapping docs, and ${requiredReferenceCommands.length} reference commands.`);
