#!/usr/bin/env node
import { mkdirSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const indexPath = 'references/index.json';
const upstreamRoot = 'references/upstreams';
const index = JSON.parse(await readFile(indexPath, 'utf8'));
const sources = Array.isArray(index.sources) ? index.sources : [];

mkdirSync(upstreamRoot, { recursive: true });

function slug(source) {
  return `${source.owner}-${source.name}`.replaceAll('/', '-');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

for (const source of sources) {
  const target = `${upstreamRoot}/${slug(source)}`;
  if (existsSync(`${target}/.git`)) {
    console.log(`Updating ${source.owner}/${source.name} in ${target}`);
    run('git', ['-C', target, 'fetch', '--depth=1', 'origin']);
    run('git', ['-C', target, '-c', 'advice.detachedHead=false', 'checkout', 'FETCH_HEAD']);
  } else {
    console.log(`Cloning ${source.owner}/${source.name} into ${target}`);
    run('git', ['clone', '--depth=1', source.url, target]);
  }
}
