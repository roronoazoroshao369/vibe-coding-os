#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const indexPath = 'references/index.json';
if (!existsSync(indexPath)) {
  console.error(`Missing ${indexPath}`);
  process.exit(1);
}

const index = JSON.parse(await readFile(indexPath, 'utf8'));
if (!Array.isArray(index.sources)) {
  console.error('references/index.json must contain a sources array.');
  process.exit(1);
}

const missing = [];
for (const source of index.sources) {
  if (!source.reference_doc || !existsSync(source.reference_doc)) missing.push(source.reference_doc || `${source.id}: missing reference_doc`);
  if (!source.changelog || !existsSync(source.changelog)) missing.push(source.changelog || `${source.id}: missing changelog`);
}

if (missing.length > 0) {
  console.error('Cannot build reference index because files are missing:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

index.last_built = new Date().toISOString();
index.sources.sort((a, b) => a.id.localeCompare(b.id));
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`Rebuilt ${indexPath} with ${index.sources.length} sources.`);
