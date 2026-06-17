#!/usr/bin/env node
/**
 * runtime-migrate.mjs — Migration engine for Vibe Coding OS runtime collections
 *
 * Commands:
 *   dry-run    Generate migration plan without modifying collections
 *   apply      Execute the migration (modifies collections)
 *   backup     Create a backup of current state before migration
 *   rollback   Restore from backup after failed migration
 *   status     Show applied migrations and current version
 *
 * Legacy positional args (--from --to --collection --dry-run) still supported.
 *
 * Supports v1→v2 migration for any collection kind:
 *   - Adds schemaVersion:2 if missing
 *   - Ensures metadata/extensions objects if missing
 *   - Validates each item (v2 strict mode)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRENT_SCHEMA_VERSION } from '../runtime/core/validation.mjs';
import { loadSchemas, validate } from './schema-validator.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RUNTIME_ROOT = resolve(process.cwd(), '.omc', 'runtime');
const MIGRATIONS_ROOT = resolve(RUNTIME_ROOT, 'migrations');
const BACKUPS_ROOT = resolve(RUNTIME_ROOT, 'backups');

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

function createManifest(sourceVersion, targetVersion, cmd) {
  return {
    id: generateMigrationId(),
    sourceVersion,
    targetVersion,
    status: cmd === 'dry-run' ? 'dry-run' : 'pending',
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

// ── Backup / Rollback ──────────────────────────────────────────────────────

function backupDirPath() {
  const ts = Date.now().toString(36);
  const path = resolve(BACKUPS_ROOT, `backup-${ts}`);
  return path;
}

function doBackup() {
  if (!existsSync(RUNTIME_ROOT)) {
    return { ok: false, error: 'Runtime not initialized. Run: npm run runtime:init -- --force' };
  }

  const backupPath = backupDirPath();
  mkdirSync(backupPath, { recursive: true });
  mkdirSync(MIGRATIONS_ROOT, { recursive: true });
  const backupFile = resolve(backupPath, 'backup.json');

  const backup = {
    createdAt: nowIso(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    collections: {},
  };

  for (const kind of KIND_ENUM) {
    const file = resolve(RUNTIME_ROOT, `${kind}.json`);
    if (existsSync(file)) {
      backup.collections[kind] = JSON.parse(readFileSync(file, 'utf8'));
    }
  }

  writeFileSync(backupFile, `${JSON.stringify(backup, null, 2)}\n`, 'utf8');

  // Also copy actual files so rollback can just overwrite
  for (const kind of KIND_ENUM) {
    const src = resolve(RUNTIME_ROOT, `${kind}.json`);
    if (existsSync(src)) {
      cpSync(src, resolve(backupPath, `${kind}.json`), { force: true });
    }
  }

  return { ok: true, path: backupPath, file: backupFile, backupId: basename(backupPath) };
}

function doRollback(backupId) {
  let backupDir;
  if (backupId) {
    backupDir = resolve(BACKUPS_ROOT, backupId);
  } else {
    // Find the most recent backup
    if (!existsSync(BACKUPS_ROOT)) return { ok: false, error: 'No backups found' };
    const dirs = readdirSync(BACKUPS_ROOT)
      .filter((d) => d.startsWith('backup-'))
      .sort()
      .reverse();
    if (dirs.length === 0) return { ok: false, error: 'No backups found' };
    backupDir = resolve(BACKUPS_ROOT, dirs[0]);
  }

  if (!existsSync(backupDir)) return { ok: false, error: `Backup not found: ${backupId || backupDir}` };
  const backupFile = resolve(backupDir, 'backup.json');
  if (!existsSync(backupFile)) return { ok: false, error: `Backup manifest not found in ${backupDir}` };

  const backup = JSON.parse(readFileSync(backupFile, 'utf8'));

  // Restore each collection from the backup JSON in memory + file copies
  let restored = 0;
  for (const kind of KIND_ENUM) {
    if (backup.collections[kind]) {
      const collection = backup.collections[kind];
      saveCollection(kind, collection);
      restored++;
    } else {
      // Collection didn't exist at backup time — remove the current file if any
      const file = resolve(RUNTIME_ROOT, `${kind}.json`);
      if (existsSync(file)) {
        rmSync(file, { force: true });
      }
    }
  }

  // Record rollback in migration log
  const rollbackManifest = {
    id: `rollback-${Date.now().toString(36)}`,
    type: 'rollback',
    backupId: basename(backupDir),
    restoredAt: nowIso(),
    collectionsRestored: restored,
  };
  mkdirSync(MIGRATIONS_ROOT, { recursive: true });
  writeFileSync(
    resolve(MIGRATIONS_ROOT, `${rollbackManifest.id}.json`),
    `${JSON.stringify(rollbackManifest, null, 2)}\n`,
    'utf8'
  );

  return { ok: true, backupId: basename(backupDir), restored };
}

// ── Status ─────────────────────────────────────────────────────────────────

function doStatus() {
  const result = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    runtimeInitialized: existsSync(RUNTIME_ROOT),
    migrationsRoot: MIGRATIONS_ROOT,
    backupsRoot: BACKUPS_ROOT,
    appliedMigrations: [],
    collections: {},
    currentVersion: CURRENT_SCHEMA_VERSION,
  };

  if (!result.runtimeInitialized) return result;

  // Read migration logs
  if (existsSync(MIGRATIONS_ROOT)) {
    const files = readdirSync(MIGRATIONS_ROOT).filter((f) => f.endsWith('.json')).sort();
    for (const file of files) {
      try {
        const manifest = JSON.parse(readFileSync(resolve(MIGRATIONS_ROOT, file), 'utf8'));
        if (manifest.type !== 'rollback') {
          result.appliedMigrations.push({
            id: manifest.id,
            status: manifest.status,
            sourceVersion: manifest.sourceVersion,
            targetVersion: manifest.targetVersion,
            createdAt: manifest.createdAt,
            completedAt: manifest.completedAt,
            summary: manifest.summary,
          });
        }
      } catch { /* skip corrupt */ }
    }
  }

  // Read current collection versions
  for (const kind of KIND_ENUM) {
    const file = resolve(RUNTIME_ROOT, `${kind}.json`);
    if (existsSync(file)) {
      try {
        const collection = JSON.parse(readFileSync(file, 'utf8'));
        result.collections[kind] = {
          schemaVersion: collection.schemaVersion,
          itemCount: collection.items?.length || 0,
        };
      } catch {
        result.collections[kind] = { error: 'corrupt' };
      }
    }
  }

  // Check for latest backup
  if (existsSync(BACKUPS_ROOT)) {
    const dirs = readdirSync(BACKUPS_ROOT).filter((d) => d.startsWith('backup-')).sort().reverse();
    result.latestBackup = dirs.length > 0 ? dirs[0] : null;
  } else {
    result.latestBackup = null;
  }

  // Check for pending backups
  result.hasOutdatedBackups = result.collections && Object.values(result.collections).some(
    (c) => typeof c === 'object' && c.schemaVersion !== undefined && c.schemaVersion < CURRENT_SCHEMA_VERSION
  );

  return result;
}

// ── CLI ─────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { from: null, to: null, collection: null, dryRun: false, backupId: null, command: null };
  let i = 0;

  // First positional argument is the command
  const cmdKeywords = new Set(['dry-run', 'dryrun', 'apply', 'backup', 'rollback', 'status']);
  if (argv.length > 0 && cmdKeywords.has(argv[0])) {
    args.command = argv[0].replace('-', '');  // normalize dry-run → dryrun
    if (args.command === 'dryrun') args.command = 'dry-run';
    i = 1;
  }

  for (; i < argv.length; i++) {
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
        if (!args.command) args.command = 'dry-run';
        break;
      case '--backup-id':
        args.backupId = argv[++i];
        break;
    }
  }

  // If no command was given but dry-run flag was, set it
  if (!args.command && args.dryRun) args.command = 'dry-run';
  // If no command given, default to dry-run with legacy args
  if (!args.command) args.command = 'dry-run';

  return args;
}

function usage() {
  console.error('Usage: npm run runtime:migrate -- <command> [options]');
  console.error();
  console.error('Commands:');
  console.error('  dry-run              Generate migration plan without modifying collections (default)');
  console.error('  apply                Execute migration (modifies collections)');
  console.error('  backup               Create a full backup of all collections');
  console.error('  rollback [--backup-id <id>]  Restore from backup (default: latest)');
  console.error('  status               Show applied migrations, current versions, and backup info');
  console.error();
  console.error('Options (dry-run / apply):');
  console.error('  --from <version>       Source schema version (e.g., 1)');
  console.error('  --to <version>         Target schema version (e.g., 2)');
  console.error('  --collection <kind>    Collection kind to migrate (optional; migrates all if omitted)');
  console.error('  --dry-run              Force dry-run mode');
  console.error('  --backup-id <id>       Specific backup to restore (rollback only)');
  process.exit(1);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const startTime = Date.now();

  switch (args.command) {
    // ── Backup ───────────────────────────────────────────────
    case 'backup': {
      const result = doBackup();
      if (!result.ok) {
        console.error(`❌ Backup failed: ${result.error}`);
        process.exit(1);
      }
      console.log(`✅ Backup created at: ${result.path}`);
      console.log(`   Manifest: ${result.file}`);
      console.log(`   Backup ID: ${result.backupId}`);
      return;
    }

    // ── Rollback ─────────────────────────────────────────────
    case 'rollback': {
      const result = doRollback(args.backupId);
      if (!result.ok) {
        console.error(`❌ Rollback failed: ${result.error}`);
        process.exit(1);
      }
      console.log(`✅ Rollback complete from backup: ${result.backupId}`);
      console.log(`   Collections restored: ${result.restored}`);
      return;
    }

    // ── Status ───────────────────────────────────────────────
    case 'status': {
      const status = doStatus();
      console.log(JSON.stringify(status, null, 2));
      return;
    }

    // ── Apply / Dry-run ──────────────────────────────────────
    case 'dry-run':
    case 'apply': {
      const isDryRun = args.command === 'dry-run';

      if (!args.from || !args.to) {
        usage();
        return;
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

      // Auto-backup before apply
      if (!isDryRun) {
        const backupResult = doBackup();
        if (backupResult.ok) {
          console.log(`📦 Auto-backup created: ${backupResult.path}`);
        } else {
          console.warn(`⚠️  Auto-backup failed: ${backupResult.error}`);
        }
      }

      const collectionsToMigrate = args.collection ? [args.collection] : KIND_ENUM;
      const manifest = createManifest(args.from, args.to, args.command);

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
          status: isDryRun ? 'dry-run-ok' : 'pending',
        };
        manifest.steps.push(step);

        // Execute migration
        const result = batchMigrate(collection, kind, schemas, isDryRun);

        // Update summary
        manifest.summary.totalItems += result.summary.totalItems;
        manifest.summary.migrated += result.summary.migrated;
        manifest.summary.skipped += result.summary.skipped;
        manifest.summary.errors += result.summary.errors;

        // Update step status
        if (result.summary.errors > 0) {
          step.status = isDryRun ? 'dry-run-ok' : 'done';
        } else if (result.summary.migrated > 0) {
          step.status = isDryRun ? 'dry-run-ok' : 'done';
        } else {
          step.status = isDryRun ? 'dry-run-ok' : 'skipped';
        }

        // Collect errors
        for (const err of result.errors) {
          manifest.errors.push(err);
        }

        // Apply changes (skip in dry-run mode)
        if (!isDryRun && result.summary.migrated > 0) {
          collection.items = result.migratedItems;
          collection.schemaVersion = CURRENT_SCHEMA_VERSION;
          saveCollection(kind, collection);
          console.log(`    → ${result.summary.migrated} migrated, ${result.summary.skipped} skipped, ${result.summary.errors} errors`);
        } else if (!isDryRun) {
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
      if (!isDryRun) {
        manifest.status = manifest.summary.errors > 0 ? 'completed' : 'completed';
        if (manifest.errors.length > 0) {
          const hasMigrated = manifest.summary.migrated > 0;
          manifest.status = hasMigrated ? 'completed' : 'failed';
        }
      }
      manifest.completedAt = nowIso();

      const manifestPath = saveManifest(manifest);

      if (isDryRun) {
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
      return;
    }

    default:
      usage();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
