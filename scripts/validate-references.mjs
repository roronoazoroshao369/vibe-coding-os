#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const errors = [];
const validImportModes = new Set(['none', 'inspiration', 'adapted', 'vendored', 'tracked_inspiration', 'candidate_inspiration']);
const requiredFeatureDocs = [
  'spec-driven-development.md',
  'persistent-memory.md',
  'skill-orchestration.md',
  'multi-agent-workflow.md',
  'anti-overengineering.md',
  'tdd-loop.md',
  'review-before-merge.md',
  'agent-alignment.md',
  'architecture-decision-records.md',
  'diagnosis-loop.md',
  'prd-from-context.md',
  'issue-slicing.md',
  'triage-workflow.md',
  'architecture-improvement.md',
  'agent-handoff.md',
  'git-guardrails.md',
  'compressed-technical-communication.md',
  'agent-memory-engine.md',
  'memory-ingestion.md',
  'memory-retrieval.md',
  'memory-search.md',
  'memory-privacy.md',
  'memory-evaluation.md',
  'memory-provider-adapter.md',
  'local-first-memory.md'
].map((file) => path.join('references', 'features', file));
const requiredMappingDocs = [
  'source-to-local-skills.md',
  'feature-to-local-files.md',
  'update-impact-map.md',
  'adoption-classification.md'
].map((file) => path.join('references', 'mappings', file));
const requiredPolicyDocs = [
  'docs/UPSTREAM_ADOPTION_POLICY.md',
  'docs/workflows/core-vs-optional-runtime.md'
];
const requiredReferenceCommands = [
  'vibe-reference-add.md',
  'vibe-reference-audit.md',
  'vibe-reference-update.md',
  'vibe-reference-index.md',
  'vibe-upstream-sync.md'
].map((file) => path.join('commands', file));
const requiredSuperpowersFiles = [
  'references/sources/obra-superpowers.md',
  'references/changelogs/obra-superpowers.md',
  'docs/workflows/superpowers-inspired-workflow.md',
  'skills/core/brainstorming/SKILL.md',
  'skills/core/using-git-worktrees/SKILL.md',
  'skills/core/writing-plans/SKILL.md',
  'skills/core/executing-plans/SKILL.md',
  'skills/core/subagent-driven-development/SKILL.md',
  'skills/core/requesting-code-review/SKILL.md',
  'skills/core/receiving-code-review/SKILL.md',
  'skills/core/finishing-a-development-branch/SKILL.md',
  'skills/core/systematic-debugging/SKILL.md',
  'skills/core/verification-before-done/SKILL.md',
  'skills/meta/using-vibe-coding-os/SKILL.md',
  'commands/vibe-brainstorm.md',
  'commands/vibe-worktree.md',
  'commands/vibe-write-plan.md',
  'commands/vibe-execute-plan.md',
  'commands/vibe-subagents.md',
  'commands/vibe-request-review.md',
  'commands/vibe-receive-review.md',
  'commands/vibe-finish-branch.md',
  'commands/vibe-debug.md',
  'commands/vibe-verify.md',
  'commands/vibe-write-skill.md',
  'references/sources/mattpocock-skills.md',
  'references/changelogs/mattpocock-skills.md',
  'docs/workflows/real-engineering-skills-workflow.md',
  'docs/workflows/grill-to-prd-to-issues.md',
  'docs/workflows/debug-diagnose-tdd.md',
  'docs/workflows/domain-language-and-adrs.md',
  'docs/workflows/architecture-improvement-loop.md',
  'references/sources/supermemoryai-supermemory.md',
  'references/changelogs/supermemoryai-supermemory.md',
  'docs/workflows/memory-lifecycle.md',
  'docs/workflows/memory-retrieval-before-work.md',
  'docs/workflows/privacy-safe-memory.md',
  'docs/workflows/memory-provider-adapter.md',
  'skills/memory/memory-ingestion/SKILL.md',
  'skills/memory/memory-search/SKILL.md',
  'commands/vibe-memory-ingest.md',
  'commands/vibe-memory-search.md',
  'commands/vibe-memory-retrieve.md',
  'commands/vibe-memory-audit.md',
  'commands/vibe-memory-privacy-check.md',
  'commands/vibe-memory-provider-plan.md',
  'templates/memory-entry-template.md',
  'templates/memory-retrieval-report-template.md',
  'templates/memory-privacy-review-template.md',
  'templates/memory-provider-adapter-template.md',
  'templates/memory-evaluation-template.md',
  'adapters/memory/README.md',
  'adapters/memory/supermemory-adapter-plan.md',
  'adapters/memory/local-memory-adapter.md'
];

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

function indexRegistrySources(registry) {
  const byUrl = new Map();
  const byName = new Map();
  if (!registry) return { byUrl, byName };
  if (!Array.isArray(registry.sources)) {
    errors.push('registry/sources.json must contain a sources array.');
    return { byUrl, byName };
  }

  for (const [position, source] of registry.sources.entries()) {
    const label = source?.name || `registry/sources.json source at index ${position}`;
    validateLicense(source, label);
    validateImportMode(source, label);

    if (!isNonEmptyString(source?.name)) {
      errors.push(`${label} is missing required string field: name`);
    } else if (byName.has(source.name)) {
      errors.push(`Duplicate registry source name: ${source.name}`);
    } else {
      byName.set(source.name, source);
    }

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
  return { byUrl, byName };
}

function matchingRegistrySource(registrySources, referenceSource) {
  const referenceName = trackedReferenceName(referenceSource);
  if (isNonEmptyString(referenceName) && registrySources.byName.has(referenceName)) {
    return registrySources.byName.get(referenceName);
  }
  if (isNonEmptyString(referenceSource?.url)) {
    return registrySources.byUrl.get(normalizeSourceUrl(referenceSource.url));
  }
  return null;
}

function validateRegistryReferenceConsistency(index, registry) {
  const registrySources = indexRegistrySources(registry);
  if (!index || !Array.isArray(index.sources) || (registrySources.byUrl.size === 0 && registrySources.byName.size === 0)) return;

  for (const [position, source] of index.sources.entries()) {
    const label = source?.id || `references/index.json source at index ${position}`;
    validateLicense(source, label);
    validateImportMode(source, label);

    const registrySource = matchingRegistrySource(registrySources, source);
    if (!registrySource) {
      errors.push(`${label} is missing from registry/sources.json: ${trackedReferenceName(source) || source?.url || 'unknown source'}`);
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
for (const file of [...requiredFeatureDocs, ...requiredMappingDocs, ...requiredReferenceCommands, ...requiredSuperpowersFiles]) requireFile(file);

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
