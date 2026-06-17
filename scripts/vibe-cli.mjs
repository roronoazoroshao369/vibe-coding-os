#!/usr/bin/env node
// vibe-cli.mjs — Lightweight CLI helper for Vibe Coding OS
// Usage: node scripts/vibe-cli.mjs <command> [options]

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Colors ───
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
};
const ok = `${c.green}✓${c.reset}`;
const fail = `${c.red}✗${c.reset}`;
const info = `${c.cyan}→${c.reset}`;

// ─── Helpers ───
function readJSON(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function getSubdirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => {
    try { return statSync(join(dir, f)).isDirectory(); } catch { return false; }
  });
}
function countFiles(dir, ext) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const f of readdirSync(dir)) {
    const fp = join(dir, f);
    try {
      if (statSync(fp).isDirectory()) count += countFiles(fp, ext);
      else if (!ext || f.endsWith(ext)) count++;
    } catch {}
  }
  return count;
}

// ─── Commands ───

export function cmdHelp() {
  const pkg = readJSON(join(ROOT, 'package.json'));
  const version = pkg.version || '0.0.0';
  console.log(`
${c.bold}${c.cyan}Vibe Coding OS CLI${c.reset} v${version}

${c.bold}Usage:${c.reset}  node scripts/vibe-cli.mjs <command> [options]

${c.bold}Commands:${c.reset}
  ${c.green}init${c.reset} [tool]         Initialize a project with the selected adapter
                            Tools: claude-code (default), codex, cursor, gemini
  ${c.green}doctor${c.reset}              Check if vibe-coding-os is properly installed
  ${c.green}list-skills${c.reset} [cat]  List available skills (optional: core|memory|meta|prompts)
  ${c.green}list-commands${c.reset}       List all vibe-* commands
  ${c.green}stats${c.reset}              Show repository statistics
  ${c.green}spec${c.reset} [name]        Show spec template (use --copy to copy to cwd)
  ${c.green}plan${c.reset} [name]        Show plan template (use --copy to copy to cwd)
  ${c.green}memory${c.reset} [name]      Show memory entry template (use --copy to copy to cwd)
  ${c.green}task${c.reset} [name]        Show task template (use --copy to copy to cwd)
  ${c.green}templates${c.reset}          List all available templates
  ${c.green}workflow${c.reset} status    Show optional runtime workflow status
  ${c.green}help${c.reset}               Show this help message

${c.bold}Examples:${c.reset}
  node scripts/vibe-cli.mjs init claude-code
  node scripts/vibe-cli.mjs doctor
  node scripts/vibe-cli.mjs list-skills memory
  node scripts/vibe-cli.mjs stats
  node scripts/vibe-cli.mjs spec my-feature
  node scripts/vibe-cli.mjs plan my-feature --copy
  node scripts/vibe-cli.mjs templates
`);
}

export function cmdInit(tool = 'claude-code') {
  const validTools = ['claude-code', 'codex', 'cursor', 'gemini'];
  if (!validTools.includes(tool)) {
    console.error(`${fail} Unknown tool: ${tool}. Valid: ${validTools.join(', ')}`);
    process.exit(1);
  }

  console.log(`${info} Initializing project with ${c.bold}${tool}${c.reset} adapter...\n`);

  const adapters = {
    'claude-code': { file: 'CLAUDE.md', src: 'CLAUDE.md' },
    'codex': { file: 'AGENTS.md', src: 'AGENTS.md' },
    'cursor': { file: '.cursorrules', src: 'AGENTS.md' },
    'gemini': { file: 'GEMINI.md', src: 'AGENTS.md' },
  };

  const adapter = adapters[tool];
  const src = join(ROOT, adapter.src);
  const dest = resolve(adapter.file);

  if (!existsSync(src)) {
    console.error(`${fail} Source file not found: ${adapter.src}`);
    console.error(`  Run this command from the vibe-coding-os directory or after cloning.`);
    process.exit(1);
  }

  if (existsSync(dest)) {
    console.log(`${c.yellow}⚠ File already exists: ${adapter.file}${c.reset}`);
    console.log(`  Skipping copy. Delete it first if you want to re-initialize.`);
  } else {
    const content = readFileSync(src, 'utf8');
    writeFileSync(dest, content, 'utf8');
    console.log(`${ok} Copied ${adapter.src} → ${adapter.file}`);
  }

  console.log(`\n${c.green}${c.bold}Done!${c.reset} Your project is ready for ${tool}.`);
  console.log(`  Next: Open your project in ${tool} and start vibing! 🚀\n`);
}

export function cmdDoctor() {
  console.log(`${c.bold}${c.cyan}Vibe Coding OS — Health Check${c.reset}\n`);

  const checks = [
    { name: 'package.json', path: 'package.json', required: true },
    { name: 'node_modules', path: 'node_modules', required: true, isDir: true },
    { name: 'skills/', path: 'skills', required: true, isDir: true },
    { name: 'commands/', path: 'commands', required: true, isDir: true },
    { name: 'templates/', path: 'templates', required: true, isDir: true },
    { name: 'adapters/', path: 'adapters', required: true, isDir: true },
    { name: 'scripts/', path: 'scripts', required: true, isDir: true },
    { name: 'references/', path: 'references', required: true, isDir: true },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    const fullPath = join(ROOT, check.path);
    const exists = existsSync(fullPath);
    if (exists) {
      console.log(`${ok} ${check.name}`);
      passed++;
    } else {
      console.log(`${fail} ${check.name} ${c.red}— not found${c.reset}`);
      failed++;
    }
  }

  // Check package.json validity
  if (existsSync(join(ROOT, 'package.json'))) {
    try {
      const pkg = readJSON(join(ROOT, 'package.json'));
      if (pkg.name && pkg.scripts?.validate) {
        console.log(`${ok} package.json is valid with validate script`);
        passed++;
      } else {
        console.log(`${c.yellow}⚠ package.json missing name or validate script${c.reset}`);
      }
    } catch {
      console.log(`${fail} package.json is invalid JSON`);
      failed++;
    }
  }

  console.log(`\n${c.bold}Results: ${c.green}${passed} passed${c.reset}, ${failed > 0 ? c.red : c.green}${failed} failed${c.reset}`);
  if (failed === 0) {
    console.log(`${c.green}✅ All checks passed! Vibe Coding OS is ready.${c.reset}\n`);
  } else {
    console.log(`${c.red}⚠ Some checks failed. Try running: npm install${c.reset}\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

export function cmdListSkills(category = null) {
  const skillsDir = join(ROOT, 'skills');
  if (!existsSync(skillsDir)) {
    console.error(`${fail} skills/ directory not found`);
    process.exit(1);
  }

  console.log(`${c.bold}${c.cyan}Available Skills${c.reset}${category ? ` (${category})` : ''}\n`);

  const categories = category ? [category] : getSubdirs(skillsDir);
  let totalCount = 0;

  for (const cat of categories) {
    const catDir = join(skillsDir, cat);
    if (!existsSync(catDir)) {
      console.log(`${c.yellow}Category '${cat}' not found${c.reset}`);
      continue;
    }

    const skills = getSubdirs(catDir);
    if (skills.length === 0) continue;

    console.log(`${c.bold}${c.magenta}${cat.toUpperCase()}${c.reset}`);
    for (const skill of skills) {
      const skillFile = join(catDir, skill, 'SKILL.md');
      let desc = '';
      if (existsSync(skillFile)) {
        const content = readFileSync(skillFile, 'utf8');
        const match = content.match(/^description:\s*(.+)/m);
        if (match) desc = match[1].trim();
      }
      console.log(`  ${c.green}${skill}${c.reset}${desc ? c.dim + ` — ${desc.slice(0, 80)}` : ''}${c.reset}`);
      totalCount++;
    }
    console.log('');
  }

  console.log(`${c.dim}Total: ${totalCount} skills${c.reset}\n`);
}

export function cmdListCommands() {
  const cmdsDir = join(ROOT, 'commands');
  if (!existsSync(cmdsDir)) {
    console.error(`${fail} commands/ directory not found`);
    process.exit(1);
  }

  console.log(`${c.bold}${c.cyan}Available Commands${c.reset}\n`);

  let total = 0;
  for (const f of readdirSync(cmdsDir).sort()) {
    if (!f.endsWith('.md')) continue;
    const content = readFileSync(join(cmdsDir, f), 'utf8');
    const match = content.match(/^(?:purpose|description):\s*(.+)/m);
    const desc = match ? match[1].trim() : '';
    const name = f.replace('.md', '');
    console.log(`  ${c.green}${name}${c.reset}${desc ? c.dim + ` — ${desc.slice(0, 80)}` : ''}${c.reset}`);
    total++;
  }

  console.log(`\n${c.dim}Total: ${total} commands${c.reset}\n`);
}

export function cmdStats() {
  console.log(`${c.bold}${c.cyan}Vibe Coding OS — Repository Stats${c.reset}\n`);

  const skills = getSubdirs(join(ROOT, 'skills')).reduce((acc, cat) => acc + getSubdirs(join(ROOT, 'skills', cat)).length, 0);
  const cmds = readdirSync(join(ROOT, 'commands')).filter(f => f.endsWith('.md')).length;
  const templates = readdirSync(join(ROOT, 'templates')).filter(f => f.endsWith('.md') || f.endsWith('.json')).length;

  let upstreams = 0;
  const refIndex = join(ROOT, 'references', 'index.json');
  if (existsSync(refIndex)) {
    const data = readJSON(refIndex);
    upstreams = data.sources?.length || data.upstream_sources?.length || 0;
  }

  const stats = [
    ['Skills', skills, c.green],
    ['Commands', cmds, c.cyan],
    ['Templates', templates, c.magenta],
    ['Upstream Sources', upstreams, c.yellow],
  ];

  for (const [label, count, color] of stats) {
    console.log(`  ${color}${String(count).padStart(4)}${c.reset}  ${label}`);
  }
  console.log('');
}

export function cmdSpec(args) {
  const templatePath = join(ROOT, 'templates/spec-template.md');
  if (!existsSync(templatePath)) {
    console.error(`${fail} Spec template not found: templates/spec-template.md`);
    process.exit(1);
  }

  const taskName = args.filter(a => !a.startsWith('--'))[0] || 'my-feature';
  const copy = args.includes('--copy');

  console.log(`${c.bold}${c.cyan}Vibe Spec${c.reset} — Specification for: ${taskName}\n`);
  console.log(`${info} Template: templates/spec-template.md`);
  console.log(`${info} Purpose: Define what you're building before writing code\n`);

  if (copy) {
    const dest = resolve('SPEC.md');
    const content = readFileSync(templatePath, 'utf8');
    writeFileSync(dest, content, 'utf8');
    console.log(`${ok} Copied template → SPEC.md`);
    console.log(`\n  Next steps:`);
    console.log(`  1. Edit SPEC.md with your task details`);
    console.log(`  2. Run: node scripts/vibe-cli.mjs plan ${taskName}`);
  } else {
    console.log(`  Tip: Add --copy to copy template to current directory\n`);
    console.log(`  Copy template:`);
    console.log(`    cp templates/spec-template.md SPEC.md`);
  }
  console.log('');
}

export function cmdPlan(args) {
  const templatePath = join(ROOT, 'templates/plan-template.md');
  if (!existsSync(templatePath)) {
    console.error(`${fail} Plan template not found: templates/plan-template.md`);
    process.exit(1);
  }

  const taskName = args.filter(a => !a.startsWith('--'))[0] || 'my-feature';
  const copy = args.includes('--copy');

  console.log(`${c.bold}${c.cyan}Vibe Plan${c.reset} — Implementation plan for: ${taskName}\n`);
  console.log(`${info} Template: templates/plan-template.md`);
  console.log(`${info} Purpose: Break down a spec into concrete tasks and risks\n`);

  if (copy) {
    const dest = resolve('PLAN.md');
    const content = readFileSync(templatePath, 'utf8');
    writeFileSync(dest, content, 'utf8');
    console.log(`${ok} Copied template → PLAN.md`);
    console.log(`\n  Next steps:`);
    console.log(`  1. Edit PLAN.md with your implementation plan`);
    console.log(`  2. Run: node scripts/vibe-cli.mjs task ${taskName}`);
  } else {
    console.log(`  Tip: Add --copy to copy template to current directory\n`);
    console.log(`  Copy template:`);
    console.log(`    cp templates/plan-template.md PLAN.md`);
  }
  console.log('');
}

export function cmdMemory(args) {
  const templatePath = join(ROOT, 'templates/memory-entry-template.md');
  if (!existsSync(templatePath)) {
    console.error(`${fail} Memory template not found: templates/memory-entry-template.md`);
    process.exit(1);
  }

  const taskName = args.filter(a => !a.startsWith('--'))[0] || 'general';
  const copy = args.includes('--copy');

  console.log(`${c.bold}${c.cyan}Vibe Memory${c.reset} — Memory entry for: ${taskName}\n`);
  console.log(`${info} Template: templates/memory-entry-template.md`);
  console.log(`${info} Purpose: Capture a durable memory item with source, sensitivity, and expiry\n`);

  if (copy) {
    const dest = resolve('MEMORY.md');
    const content = readFileSync(templatePath, 'utf8');
    writeFileSync(dest, content, 'utf8');
    console.log(`${ok} Copied template → MEMORY.md`);
    console.log(`\n  Next steps:`);
    console.log(`  1. Edit MEMORY.md with your observation details`);
    console.log(`  2. Review for privacy (no secrets, no tokens)`);
  } else {
    console.log(`  Tip: Add --copy to copy template to current directory\n`);
    console.log(`  Copy template:`);
    console.log(`    cp templates/memory-entry-template.md MEMORY.md`);
  }
  console.log('');
}

export function cmdTask(args) {
  const templatePath = join(ROOT, 'templates/task-template.md');
  if (!existsSync(templatePath)) {
    console.error(`${fail} Task template not found: templates/task-template.md`);
    process.exit(1);
  }

  const taskName = args.filter(a => !a.startsWith('--'))[0] || 'my-task';
  const copy = args.includes('--copy');

  console.log(`${c.bold}${c.cyan}Vibe Task${c.reset} — Task breakdown for: ${taskName}\n`);
  console.log(`${info} Template: templates/task-template.md`);
  console.log(`${info} Purpose: Define scope, steps, and verification for a single task\n`);

  if (copy) {
    const dest = resolve('TASK.md');
    const content = readFileSync(templatePath, 'utf8');
    writeFileSync(dest, content, 'utf8');
    console.log(`${ok} Copied template → TASK.md`);
    console.log(`\n  Next steps:`);
    console.log(`  1. Edit TASK.md with your task details`);
    console.log(`  2. Start implementing with verification steps`);
  } else {
    console.log(`  Tip: Add --copy to copy template to current directory\n`);
    console.log(`  Copy template:`);
    console.log(`    cp templates/task-template.md TASK.md`);
  }
  console.log('');
}

export function cmdTemplates() {
  const templatesDir = join(ROOT, 'templates');
  if (!existsSync(templatesDir)) {
    console.error(`${fail} templates/ directory not found`);
    process.exit(1);
  }

  console.log(`${c.bold}${c.cyan}Available Templates${c.reset}\n`);

  let total = 0;
  for (const f of readdirSync(templatesDir).sort()) {
    const fp = join(templatesDir, f);
    try {
      if (!statSync(fp).isFile()) continue;
    } catch { continue; }

    let desc = '';
    if (f.endsWith('.md')) {
      const content = readFileSync(fp, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.replace(/^#+\s*/, '').trim();
        if (trimmed && !trimmed.startsWith('>')) {
          desc = trimmed.slice(0, 80);
          break;
        }
      }
    }

    console.log(`  ${c.green}${f}${c.reset}${desc ? c.dim + ` — ${desc}` : ''}${c.reset}`);
    total++;
  }

  console.log(`\n${c.dim}Total: ${total} templates${c.reset}\n`);
}

// ─── Main ───
const isMainModule = (() => {
  const entry = process.argv[1];
  try {
    return entry && (resolve(entry) === resolve(fileURLToPath(import.meta.url)));
  } catch {
    return false;
  }
})();

if (isMainModule) {
  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case 'init': cmdInit(args[0]); break;
    case 'doctor': cmdDoctor(); break;
    case 'list-skills': cmdListSkills(args[0] || null); break;
    case 'list-commands': cmdListCommands(); break;
    case 'stats': cmdStats(); break;
    case 'spec': cmdSpec(args); break;
    case 'plan': cmdPlan(args); break;
    case 'memory': cmdMemory(args); break;
    case 'task': cmdTask(args); break;
    case 'templates': cmdTemplates(); break;
    case 'workflow': {
      const { spawnSync } = await import('node:child_process');
      const result = spawnSync(process.execPath, [join(__dirname, 'workflow-status.mjs'), ...args], {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['inherit', 'inherit', 'inherit'],
      });
      process.exit(result.status ?? 1);
      break;
    }
    case 'help': case '--help': case '-h': case undefined: cmdHelp(); break;
    default:
      console.error(`${fail} Unknown command: ${cmd}`);
      console.log(`Run ${c.cyan}node scripts/vibe-cli.mjs help${c.reset} for usage.\n`);
      process.exit(1);
  }
}
