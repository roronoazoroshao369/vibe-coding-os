#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const indexPath = 'references/index.json';
if (!existsSync(indexPath)) {
  console.error(`Missing ${indexPath}`);
  process.exit(1);
}

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const sources = Array.isArray(index.sources) ? index.sources : [];
const unchecked = sources.filter((source) => source.last_checked === null || source.last_checked === undefined);
const unknownCommit = sources.filter((source) => source.last_known_commit === null || source.last_known_commit === undefined);

const lines = [];
lines.push('# Reference Update Report');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Tracked sources');
lines.push('');
for (const source of sources) {
  lines.push(`### ${source.owner}/${source.name}`);
  lines.push('');
  lines.push(`- ID: \`${source.id}\``);
  lines.push(`- URL: ${source.url}`);
  lines.push(`- Category: ${source.category}`);
  lines.push(`- Status: ${source.status}`);
  lines.push(`- Import mode: ${source.import_mode}`);
  lines.push(`- Features: ${source.features?.length ? source.features.map((feature) => `\`${feature}\``).join(', ') : 'None listed'}`);
  lines.push(`- Local targets: ${source.local_targets?.length ? source.local_targets.map((target) => `\`${target}\``).join(', ') : 'None listed'}`);
  lines.push('');
}

lines.push('## Sources with null last_checked');
lines.push('');
for (const source of unchecked) lines.push(`- ${source.id}`);
if (unchecked.length === 0) lines.push('- None');
lines.push('');

lines.push('## Sources with null last_known_commit');
lines.push('');
for (const source of unknownCommit) lines.push(`- ${source.id}`);
if (unknownCommit.length === 0) lines.push('- None');
lines.push('');

lines.push('## Next recommended audit steps');
lines.push('');
lines.push('1. Pick one unchecked source with high feature overlap.');
lines.push('2. Read its source doc, feature docs, and mapping entries.');
lines.push('3. Inspect upstream manually and record only relevant changes in the local changelog.');
lines.push('4. Update `last_checked` and `last_known_commit` when known.');
lines.push('5. Update local files only when the change improves Vibe Coding OS without copying upstream content.');
lines.push('6. Run `npm run validate:references` and `npm run validate`.');
lines.push('');

await writeFile('references/update-report.md', `${lines.join('\n')}\n`, 'utf8');
console.log('Wrote references/update-report.md');
