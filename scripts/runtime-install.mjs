#!/usr/bin/env node
import { planInstall, runInstall, nextSteps } from '../runtime/install/installer.mjs';

function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) {
        flags[k] = true;
      } else {
        flags[k] = n;
        i++;
      }
    } else positionals.push(a);
  }
  return { positionals, flags };
}

const { flags } = parseArgs(process.argv.slice(2));
const root = process.cwd();
const dryRun = Boolean(flags['dry-run']);
const force = Boolean(flags.force);
const withMcp = 'mcp' in flags ? Boolean(flags.mcp) : false;

async function main() {
  if (dryRun) {
    const plan = await planInstall(root, { force, withMcp });
    console.log(`[dry-run] Runtime install plan for ${root}\n`);
    for (let i = 0; i < plan.steps.length; i++) {
      const s = plan.steps[i];
      console.log(`  ${i + 1}. [${s.kind}] ${s.summary}`);
    }
    console.log(`\n${nextSteps({ withMcp })}`);
    return;
  }

  const plan = await runInstall(root, { force, withMcp });
  console.log(`Runtime installed at ${plan.store.runtimeDir}`);
  for (const s of plan.steps) {
    if (s.kind !== 'mkdir') console.log(`  - ${s.summary}`);
  }
  console.log(`\n${nextSteps({ withMcp })}`);
}

main().catch(err => {
  console.error('Install failed:', err.message);
  process.exit(1);
});
