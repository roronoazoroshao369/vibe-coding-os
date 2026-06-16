#!/usr/bin/env node
// release.mjs — release validation and tagging dry-run automation for Vibe Coding OS

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

function usage(exitCode = 1) {
  console.log(`Usage: node scripts/release.mjs [--dry-run] [--version <semver>] [--allow-dirty] [--tag]

Options:
  --dry-run       Validate and print release commands without creating tags (default)
  --version       Release version to validate and print, for example 1.0.0-rc.1
  --allow-dirty   Allow release validation with uncommitted changes
  --tag           Create the local annotated git tag after validation; does not push

Default behavior is dry-run unless --tag is passed.`);
  process.exit(exitCode);
}

function fail(message, details = '') {
  console.error(`\n❌ ${message}`);
  if (details) console.error(details.trim());
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024
  });

  return {
    status: typeof result.status === 'number' ? result.status : 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error
  };
}

function runChecked(label, command, args, options = {}) {
  console.log(`\n▶ ${label}`);
  console.log(`$ ${[command, ...args].join(' ')}`);
  const result = run(command, args, options);
  if (result.error) fail(`${label} failed to start`, result.error.message);
  if (result.status !== 0) fail(`${label} failed`, `${result.stdout}${result.stderr}`);
  console.log(`✅ ${label} passed`);
  return result;
}

function parseArgs(argv) {
  const parsed = {
    dryRun: true,
    version: null,
    allowDirty: false,
    tag: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') parsed.dryRun = true;
    else if (arg === '--allow-dirty') parsed.allowDirty = true;
    else if (arg === '--tag') {
      parsed.tag = true;
      parsed.dryRun = false;
    } else if (arg === '--version') {
      const version = argv[i + 1];
      if (!version || version.startsWith('--')) fail('--version requires a semver value');
      parsed.version = version;
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      usage(0);
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function packageVersion() {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}

function assertCleanGitStatus(allowDirty) {
  const status = run('git', ['status', '--porcelain']);
  if (status.status !== 0) fail('Unable to read git status', `${status.stdout}${status.stderr}`);
  if (status.stdout.trim() && !allowDirty) {
    fail('Working tree is not clean. Commit/stash changes or pass --allow-dirty.', status.stdout);
  }
  if (status.stdout.trim() && allowDirty) {
    console.log('⚠️  Working tree has uncommitted changes; continuing because --allow-dirty was passed.');
  } else {
    console.log('✅ Git working tree is clean');
  }
}

function assertTagDoesNotExist(tagName) {
  const result = run('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tagName}`]);
  if (result.status === 0) fail(`Tag already exists: ${tagName}`);
}

function printNextSteps(version, tagName) {
  console.log('\n════════════════════════════════════════════════════════');
  console.log(`Release dry-run complete for ${tagName}`);
  console.log('════════════════════════════════════════════════════════');
  console.log('\nExact next steps after the release commit is merged to the target branch:');
  console.log('\n1. Verify the target branch and latest commit:');
  console.log('   git checkout main');
  console.log('   git pull --ff-only origin main');
  console.log('\n2. Re-run release validation:');
  console.log(`   node scripts/release.mjs --dry-run --version ${version}`);
  console.log('\n3. Create the local annotated tag when ready:');
  console.log(`   node scripts/release.mjs --tag --version ${version}`);
  console.log('\n4. Push the tag only after reviewing it:');
  console.log(`   git show ${tagName}`);
  console.log(`   git push origin ${tagName}`);
  console.log('\n5. Create the GitHub release:');
  console.log(`   gh release create ${tagName} --title "${tagName}" --generate-notes`);
  console.log('   or open: https://github.com/roronoazoroshao369/vibe-coding-os/releases/new');
  console.log('\n6. Mark pre-release status in GitHub for rc/beta/alpha versions.');
}

const args = parseArgs(process.argv.slice(2));
const version = args.version ?? packageVersion();
const tagName = `v${version}`;

if (!SEMVER_RE.test(version)) fail(`Invalid semver: ${version}`);

console.log('=== Vibe Coding OS Release Automation ===');
console.log(`Mode: ${args.tag ? 'tag' : 'dry-run'}`);
console.log(`Version: ${version}`);
console.log(`Tag: ${tagName}`);

assertCleanGitStatus(args.allowDirty);
assertTagDoesNotExist(tagName);
runChecked('Full validation gate', 'npm', ['run', 'validate:all'], { inherit: true });
runChecked('Dashboard data validation', 'node', ['scripts/dashboard-data.mjs'], { inherit: true });

if (args.tag) {
  runChecked('Create local annotated tag', 'git', ['tag', '-a', tagName, '-m', `Release ${tagName}`], { inherit: true });
  console.log(`\n✅ Created local tag ${tagName}`);
  console.log('No push was performed by this script. Push explicitly with:');
  console.log(`   git push origin ${tagName}`);
} else {
  console.log('\n✅ Dry-run mode: no tag was created and nothing was pushed.');
}

printNextSteps(version, tagName);
