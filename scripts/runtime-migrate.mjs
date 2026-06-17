#!/usr/bin/env node
/**
 * runtime-migrate.mjs — Migration engine for Vibe Coding OS runtime collections
 *
 * Accepts --from <version> --to <version> --collection <kind> (optional) --dry-run (flag)
 *
 * Supports v1→v2 migration for any collection kind:
 *   - Adds schemaVersion:2 if missing
 *   - Ensures metadata/extensions objects if missing
 *   - Validates each item (v2 strict mode)
 *
 * Dry-run mode generates a migration plan manifest without modifying collections.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';
import { loadSchemas, validate } from './schema-validator.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RUNTIME_ROOT = resolve(process.cwd(), '.omc', 'runtime');
const MIGRATIONS_ROOT = resolve(RUNTIME_ROOT, 'migrations');

const KIND_ENUM = ['tasks', 'memory', 'checkpoints', 'teams', 'sessions', 'workflow-runs', 'actions', 'events', 'approvals'];

const SCHEMA_MAP = {
  tasks: 'runtime-task.schema.json',
  memory: 'runtime-memory.schema.json',
  checkpoints: 'runtime-checkpoint.schema.json',
  teams: 'runtime-team.schema.json',
  sessions: 'runtime-session.schema.json',
  'workflow-runs': 'workflow-run.schema.json',
  actions: 'runtime-action.schema.json',
  events: 'runtime-event.schema.json',
  approvals: 'runtime-approval.schema.json',
};

function generateMigrationId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `mig-${ts}-${rand}`;
}

function nowIso() {
  return new Date().toISOString();
}

function loadCollection(kind) {
  const file = resolve(RUNTIME_ROOT, `${kind}.json`);
  if (!existsSync(file)) {
    return { schemaVersion: CURRENT_SCHEMA_VERSION, kind, items: [] };
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

function saveCollection(kind, collection) {
  const file = resolve(RUNTIME_ROOT, `${kind}.json`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
}

function createManifest(sourceVersion, targetVersion, dryRun) {
  return {
    id: generateMigrationId(),
    sourceVersion,
    targetVersion,
    status: dryRun ? 'dry-run' : 'pending',
    steps: [],
    errors: [],
    createdAt: nowIso(),
    completedAt: null,
    summary: { totalItems: 0, migrated: 0, skipped: 0, errors: 0, durationMs: 0 },
  };
}

function saveManifest(manifest) {
  mkdirSync(MIGRATIONS_ROOT, { recursive: true });
  const file = resolve(MIGRATIONS_ROOT, `${manifest.id}.json`);
  writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return file;
}

/**
 * Migrate a single v1 item to v2.
 * Returns the transformed item, or the original if already v2.
 */
function migrateItemV1ToV2(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item; // skip non-object items
  }

  const needsMigration = !item.schemaVersion || item.schemaVersion < CURRENT_SCHEMA_VERSION;
  if (!needsMigration) {
    return null; // already at current version
  }

  const migrated = { ...item };
  migrated.schemaVersion = CURRENT_SCHEMA_VERSION;
  if (!migrated.metadata || typeof migrated.metadata !== 'object') {
    migrated.metadata = {};
  }
  if (!migrated.extensions || typeof migrated.extensions !== 'object') {
    migrated.extensions = {};
  }

  return migrated;
}

/**
 * Batch migrate a collection.
 * Returns { migratedItems, summary, errors }
 */
function batchMigrate(collection, kind, schemas, dryRun) {
  const itemSchemaKey = SCHEMA_MAP[kind];
  const itemSchema = itemSchemaKey ? schemas.get(itemSchemaKey) : null;

  const result = {
    migratedItems: [],
    summary: { totalItems: collection.items.length, migrated: 0, skipped: 0, errors: 0, durationMs: 0 },
    errors: [],
    stepErrors: [],
  };

  for (let i = 0; i < collection.items.length; i++) {
    const item = collection.items[i];
    const id = item?.id || `index-${i}`;

    // If already at target version, skip
    if (item?.schemaVersion === CURRENT_SCHEMA_VERSION) {
      result.migratedItems.push(item);
      result.summary.skipped++;
      continue;
    }

    // Migrate
    const migrated = migrateItemV1ToV2(item);
    if (migrated === null) {
      // Item is already at current version — shouldn't happen given the check above
      result.migratedItems.push(item);
      result.summary.skipped++;
      continue;
    }

    // Validate if schema available
    if (itemSchema) {
      const validation = validate(migrated, itemSchema, schemas, `${kind}.items[${i}]`);
      if (!validation.valid) {
        result.stepErrors.push({
          stepId: 'schema-update',
          itemId: id,
          message: `Validation failed: ${validation.errors.join('; ')}`,
        });
        result.summary.errors++;
        result.errors.push({ stepId: 'schema-update', itemId: id, message: `Validation failed: ${validation.errors.join('; ')}` });
        // Keep original item unchanged
        result.migratedItems.push(item);
        continue;
      }
    }

    result.migratedItems.push(migrated);
    result.summary.migrated++;
  }

  return result;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { from: null, to: null, collection: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--from':
        args.from = parseInt(argv[++i], 10);
        break;
      case '--to':
        args.to = parseInt(argv[++i], 10);
        break;
      case '--collection':
        args.collection = argv[++i];
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
    }
  }
  return args;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const startTime = Date.now();

  if (!args.from || !args.to) {
    console.error('Usage: node scripts/runtime-migrate.mjs --from <version> --to <version> [--collection <kind>] [--dry-run]');
    console.error('  --from <version>        Source schema version (e.g., 1)');
    console.error('  --to <version>          Target schema version (e.g., 2)');
    console.error('  --collection <kind>     Collection kind to migrate (optional; migrates all if omitted)');
    console.error('  --dry-run               Generate migration plan without modifying collections');
    process.exit(1);
  }

  if (!existsSync(RUNTIME_ROOT)) {
    console.error('Runtime not initialized. Run: npm run runtime:init -- --force');
    process.exit(1);
  }

  // Load schemas for validation
  let schemas;
  try {
    schemas = await loadSchemas(resolve(ROOT, 'schemas'));
  } catch (e) {
    console.error(`Failed to load schemas: ${e.message}`);
    process.exit(1);
  }

  const collectionsToMigrate = args.collection
    ? [args.collection]
    : KIND_ENUM;

  const manifest = createManifest(args.from, args.to, args.dryRun);

  for (const kind of collectionsToMigrate) {
    if (!KIND_ENUM.includes(kind)) {
      console.error(`Unknown collection kind: ${kind}. Valid kinds: ${KIND_ENUM.join(', ')}`);
      process.exit(1);
    }

    const collection = loadCollection(kind);
    const stepId = `migrate-${kind}-v${args.from}-v${args.to}`;

    // Skip if collection has no items
    if (!collection.items || collection.items.length === 0) {
      console.log(`  [${kind}] No items to migrate (empty collection)`);
      manifest.steps.push({
        id: stepId,
        action: 'schema-update',
        target: kind,
        params: { from: args.from, to: args.to },
        dryRunSafe: true,
        reversible: true,
        status: 'skipped',
      });
      continue;
    }

    console.log(`  [${kind}] Processing ${collection.items.length} items...`);

    // Record the step
    const step = {
      id: stepId,
      action: 'schema-update',
      target: kind,
      params: { from: args.from, to: args.to },
      dryRunSafe: true,
      reversible: true,
      status: args.dryRun ? 'dry-run-ok' : 'pending',
    };
    manifest.steps.push(step);

    // Execute migration
    const result = batchMigrate(collection, kind, schemas, args.dryRun);

    // Update summary
    manifest.summary.totalItems += result.summary.totalItems;
    manifest.summary.migrated += result.summary.migrated;
    manifest.summary.skipped += result.summary.skipped;
    manifest.summary.errors += result.summary.errors;

    // Update step status
    if (result.summary.errors > 0) {
      step.status = args.dryRun ? 'dry-run-ok' : 'done';
    } else if (result.summary.migrated > 0) {
      step.status = args.dryRun ? 'dry-run-ok' : 'done';
    } else {
      step.status = args.dryRun ? 'dry-run-ok' : 'skipped';
    }

    // Collect errors
    for (const err of result.errors) {
      manifest.errors.push(err);
    }

    // Apply changes (skip in dry-run mode)
    if (!args.dryRun && result.summary.migrated > 0) {
      collection.items = result.migratedItems;
      collection.schemaVersion = CURRENT_SCHEMA_VERSION;
      saveCollection(kind, collection);
      console.log(`    → ${result.summary.migrated} migrated, ${result.summary.skipped} skipped, ${result.summary.errors} errors`);
    } else if (!args.dryRun) {
      // No items migrated but we might still have a v1 collection wrapper
      if (collection.schemaVersion < CURRENT_SCHEMA_VERSION) {
        collection.schemaVersion = CURRENT_SCHEMA_VERSION;
        saveCollection(kind, collection);
        console.log(`    → collection schemaVersion updated to ${CURRENT_SCHEMA_VERSION}`);
      } else {
        console.log(`    → nothing to update`);
      }
    } else {
      console.log(`    [dry-run] Would migrate: ${result.summary.migrated}, skip: ${result.summary.skipped}, errors: ${result.summary.errors}`);
    }
  }

  // Finalize manifest
  manifest.summary.durationMs = Date.now() - startTime;
  if (!args.dryRun) {
    manifest.status = manifest.summary.errors > 0 ? 'completed' : 'completed';
    if (manifest.errors.length > 0) {
      // Still completed if at least some items migrated
      const hasMigrated = manifest.summary.migrated > 0;
      manifest.status = hasMigrated ? 'completed' : 'failed';
    }
  }
  manifest.completedAt = nowIso();

  const manifestPath = saveManifest(manifest);

  if (args.dryRun) {
    console.log(`\n📋 Dry-run complete. Manifest saved to ${manifestPath}`);
    console.log(`   Summary: ${manifest.summary.totalItems} total, ${manifest.summary.migrated} to migrate, ${manifest.summary.skipped} to skip, ${manifest.summary.errors} errors`);
    console.log(`   Duration: ${manifest.summary.durationMs}ms`);
  } else {
    console.log(`\n✅ Migration complete. Manifest: ${manifestPath}`);
    console.log(`   Summary: ${manifest.summary.totalItems} total, ${manifest.summary.migrated} migrated, ${manifest.summary.skipped} skipped, ${manifest.summary.errors} errors`);
    console.log(`   Duration: ${manifest.summary.durationMs}ms`);
  }

  // Exit with error if migration had errors
  if (manifest.errors.length > 0 && manifest.summary.migrated === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
