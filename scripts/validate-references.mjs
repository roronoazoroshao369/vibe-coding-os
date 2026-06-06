#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const errors = [];
const validImportModes = new Set(['none', 'inspiration', 'adapted', 'vendored']);
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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

async function readJson(file) {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${file}: ${error.message}`);
    return null;
  }
}

function normalizeSourceUrl(url) {
  if (!isNonEmptyString(url)) return '';
  return url.trim().replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();
}

function trackedReferenceName(source) {
  if (isNonEmptyString(source?.owner) && isNonEmptyString(source?.name)) {
    return `${source.owner}/${source.name}`;
  }
  return source?.name;
}

function validateImportMode(source, label) {
  if (!isNonEmptyString(source?.import_mode)) {
    errors.push(`${label} is missing required string field: import_mode`);
  } else if (!validImportModes.has(source.import_mode)) {
    errors.push(`${label} has invalid import_mode: ${source.import_mode}`);
  }
}

function validateLicense(source, label) {
  if (!isNonEmptyString(source?.license)) {
    errors.push(`${label} is missing required string field: license`);
  }
}

function indexRegistrySourcesByUrl(registry) {
  const byUrl = new Map();
  if (!registry) return byUrl;
  if (!Array.isArray(registry.sources)) {
    errors.push('registry/sources.json must contain a sources array.');
    return byUrl;
  }

  for (const [position, source] of registry.sources.entries()) {
    const label = source?.name || `registry/sources.json source at index ${position}`;
    validateLicense(source, label);
    validateImportMode(source, label);

    if (!isNonEmptyString(source?.name)) errors.push(`${label} is missing required string field: name`);
    if (!isNonEmptyString(source?.url)) {
      errors.push(`${label} is missing required string field: url`);
      continue;
    }

    const normalizedUrl = normalizeSourceUrl(source.url);
    if (byUrl.has(normalizedUrl)) {
      errors.push(`Duplicate registry source URL: ${source.url}`);
    } else {
      byUrl.set(normalizedUrl, source);
    }
  }
  return byUrl;
}

function validateRegistryReferenceConsistency(index, registry) {
  const registryByUrl = indexRegistrySourcesByUrl(registry);
  if (!index || !Array.isArray(index.sources) || registryByUrl.size === 0) return;

  for (const [position, source] of index.sources.entries()) {
    const label = source?.id || `references/index.json source at index ${position}`;
    validateLicense(source, label);
    validateImportMode(source, label);
    if (!isNonEmptyString(source?.url)) continue;

    const registrySource = registryByUrl.get(normalizeSourceUrl(source.url));
    if (!registrySource) {
      errors.push(`${label} is missing from registry/sources.json: ${source.url}`);
      continue;
    }

    const registryName = registrySource.name;
    const referenceName = trackedReferenceName(source);
    if (registrySource.url !== source.url) {
      errors.push(`${label} URL differs between registry/sources.json (${registrySource.url}) and references/index.json (${source.url}).`);
    }
    if (registryName !== referenceName) {
      errors.push(`${label} name differs between registry/sources.json (${registryName}) and references/index.json (${referenceName}).`);
    }
  }
}

requireFile('references/index.json');
requireFile('registry/sources.json');
for (const file of [...requiredFeatureDocs, ...requiredMappingDocs, ...requiredReferenceCommands]) requireFile(file);

const index = await readJson('references/index.json');
const sourceRegistry = await readJson('registry/sources.json');

if (index) {
  if (!Array.isArray(index.sources)) {
    errors.push('references/index.json must contain a sources array.');
  } else {
    const seen = new Set();
    const requiredFields = ['id', 'name', 'owner', 'url', 'category', 'status', 'import_mode', 'license', 'reference_doc', 'changelog'];
    for (const [position, source] of index.sources.entries()) {
      const label = source?.id || `source at index ${position}`;
      for (const field of requiredFields) {
        if (!isNonEmptyString(source?.[field])) {
          errors.push(`${label} is missing required string field: ${field}`);
        }
      }
      validateImportMode(source, label);
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
            if (!isNonEmptyString(target)) {
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

validateRegistryReferenceConsistency(index, sourceRegistry);

if (errors.length > 0) {
  console.error('Reference Intelligence Layer validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Reference Intelligence Layer validation passed.');
console.log(`Checked ${index.sources.length} sources, ${requiredFeatureDocs.length} feature docs, ${requiredMappingDocs.length} mapping docs, and ${requiredReferenceCommands.length} reference commands.`);
