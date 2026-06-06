#!/usr/bin/env node
import { mkdirSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const indexPath = 'references/index.json';
const upstreamRoot = 'references/upstreams';
const maxAttempts = 3;
const transientNetworkPatterns = [
  /could not resolve host/i,
  /failed to connect/i,
  /connection (timed out|timeout|reset|refused|closed)/i,
  /network is unreachable/i,
  /temporary failure/i,
  /tls|ssl/i,
  /http\/2 stream/i,
  /the remote end hung up unexpectedly/i,
  /early eof/i,
  /rpc failed/i,
  /unable to access .* (502|503|504)/i,
  /operation timed out/i,
];

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const sources = Array.isArray(index.sources) ? index.sources : [];
const args = parseArgs(process.argv.slice(2));

mkdirSync(upstreamRoot, { recursive: true });

function parseArgs(argv) {
  const parsed = {
    all: false,
    sources: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--all') {
      parsed.all = true;
      continue;
    }

    if (arg === '--source') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--source requires a source id or owner/repo value');
      }
      parsed.sources.push(value);
      index += 1;
      continue;
    }

    if (arg.startsWith('--source=')) {
      const value = arg.slice('--source='.length);
      if (!value) throw new Error('--source requires a source id or owner/repo value');
      parsed.sources.push(value);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function slug(source) {
  return `${source.owner}-${source.name}`.replaceAll('/', '-');
}

function sourceKey(source) {
  return `${source.owner}/${source.name}`;
}

function sourceMatches(source, requested) {
  const normalizedRequested = requested.toLowerCase();
  const aliases = [
    source.id,
    sourceKey(source),
    slug(source),
    source.url,
  ].filter(Boolean);

  return aliases.some((alias) => alias.toLowerCase() === normalizedRequested);
}

function shouldCloneAll() {
  return args.all || args.sources.length === 0;
}

function selectedSource(source) {
  if (shouldCloneAll()) return true;
  return args.sources.some((requested) => sourceMatches(source, requested));
}

function isTransientNetworkError(output) {
  return transientNetworkPatterns.some((pattern) => pattern.test(output));
}

function printCommandOutput(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

function run(command, commandArgs, options = {}) {
  const label = `${command} ${commandArgs.join(' ')}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = spawnSync(command, commandArgs, {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      ...options,
    });
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    printCommandOutput(result);

    if (result.status === 0) return { ok: true };

    const status = result.status ?? 1;
    const transient = isTransientNetworkError(output);
    if (transient && attempt < maxAttempts) {
      console.warn(
        `Transient network error while running "${label}". Retrying ${attempt + 1}/${maxAttempts}...`,
      );
      continue;
    }

    return {
      ok: false,
      status,
      transient,
      attempts: attempt,
    };
  }

  return { ok: false, status: 1, transient: true, attempts: maxAttempts };
}

function cloneSource(source, target) {
  console.log(`Cloning ${sourceKey(source)} into ${target}`);
  return run('git', ['clone', '--depth=1', source.url, target]);
}

function updateSource(source, target) {
  console.log(`Updating ${sourceKey(source)} in ${target}`);
  const fetchResult = run('git', ['-C', target, 'fetch', '--depth=1', 'origin']);
  if (!fetchResult.ok) return fetchResult;
  return run('git', ['-C', target, '-c', 'advice.detachedHead=false', 'checkout', 'FETCH_HEAD']);
}

function printSummary(summary) {
  console.log('\nSummary');
  for (const status of ['cloned', 'updated', 'failed', 'skipped']) {
    console.log(`${status}: ${summary[status].length}`);
    for (const item of summary[status]) {
      console.log(`  - ${item}`);
    }
  }
}

const summary = {
  cloned: [],
  updated: [],
  failed: [],
  skipped: [],
};

const unknownSources = args.sources.filter(
  (requested) => !sources.some((source) => sourceMatches(source, requested)),
);
for (const requested of unknownSources) {
  summary.failed.push(`${requested} (unknown source)`);
}

for (const source of sources) {
  const target = `${upstreamRoot}/${slug(source)}`;
  const label = `${sourceKey(source)} -> ${target}`;

  if (!selectedSource(source)) {
    summary.skipped.push(label);
    continue;
  }

  const existed = existsSync(`${target}/.git`);
  const result = existed ? updateSource(source, target) : cloneSource(source, target);

  if (result.ok) {
    summary[existed ? 'updated' : 'cloned'].push(label);
  } else {
    summary.failed.push(`${label} (exit ${result.status})`);
  }
}

printSummary(summary);

if (summary.failed.length > 0) {
  process.exit(1);
}
