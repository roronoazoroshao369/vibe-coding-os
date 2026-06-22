#!/usr/bin/env node
// vibe-cli.mjs — Lightweight CLI helper for Vibe Coding OS
// Usage: node scripts/vibe-cli.mjs <command> [options]

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { realpathSync } from 'node:fs';
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
const warn = `${c.yellow}⚠${c.reset}`;
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

import { runDoctor, formatDoctorReport } from '../runtime/core/doctor.mjs';
import { listEventsV2, getEventMetadata } from '../runtime/core/event-store.mjs';

export function cmdHelp() {
  const pkg = readJSON(join(ROOT, 'package.json'));
  const version = pkg.version || '0.0.0';
  console.log(`
${c.bold}${c.cyan}Vibe Coding OS CLI${c.reset} v${version}

${c.bold}Usage:${c.reset}  node scripts/vibe-cli.mjs <command> [options]

${c.bold}Commands:${c.reset}
  ${c.green}init${c.reset} [tool] [flags] Initialize a project with the selected adapter
                            Tools: claude-code (default), codex, cursor, gemini (alias: claude), cline, continue, aider, windsurf
                            Flags: --scope <minimal|recommended|full|runtime|team>
                                   --dry-run, --force, --current-terminal, --project <path>
  ${c.green}export${c.reset} [tool]      Generate tool-specific instructions in cwd
                            Tools: cursor, claude, codex, gemini, cline, continue, aider, windsurf
  ${c.green}doctor${c.reset} [--project <path>] Check runtime health (add --json for output)
  ${c.green}events${c.reset} [--json] [--limit=N] Show event store metadata and recent events
  ${c.green}install-pack${c.reset} <name> [--dry-run] [--force] Install a skill pack into .vibe/skills/<name>
                            --dry-run to preview; --force to overwrite existing installs
  ${c.green}version${c.reset}            Show version number
  ${c.green}list-skills${c.reset} [cat]  List available skills (optional: core|memory|meta|prompts)
  ${c.green}list-commands${c.reset}       List all vibe-* commands
  ${c.green}stats${c.reset}              Show repository statistics
  ${c.green}spec${c.reset} [name]        Show spec template (use --copy to copy to cwd)
  ${c.green}plan${c.reset} [name]        Show plan template (use --copy to copy to cwd)
  ${c.green}memory${c.reset} [name]      Show memory entry template (use --copy to copy to cwd)
  ${c.green}task${c.reset} [name]        Show task template (use --copy to copy to cwd)
  ${c.green}templates${c.reset}          List all available templates
  ${c.green}runtime-task${c.reset}       Manage optional runtime tasks
  ${c.green}workflow${c.reset} status    Show optional runtime workflow status
  ${c.green}runtime-audit${c.reset}      Run safety audit on runtime state
  ${c.green}help${c.reset}               Show this help message

${c.bold}Examples:${c.reset}
  vibe init claude-code
  vibe init --tool claude-code --scope recommended --current-terminal
  vibe init claude-code --scope minimal --dry-run
  vibe init cursor --scope full --force
  vibe export cursor
  vibe install-pack core-solo
  vibe install-pack core-solo --dry-run
  vibe doctor
  vibe doctor --project ~/my-app
  vibe version
  vibe list-skills memory
  vibe stats
  vibe spec my-feature
  vibe plan my-feature --copy
  vibe templates
`);
}

export function cmdInitHelp() {
  console.log(`
${c.bold}${c.cyan}vibe init${c.reset} — Set up Vibe Coding OS in a project

${c.bold}Usage:${c.reset}
  vibe init [tool] [options]
  vibe init --tool <tool> [options]

${c.bold}Tools:${c.reset}
  claude-code (default), codex, cursor, gemini (alias: claude), cline, continue, aider, windsurf

${c.bold}Options:${c.reset}
  --tool <tool>              Adapter to configure
  --scope <scope>            minimal | recommended | full | runtime | team
  --current-terminal         Record that setup targets this terminal/session
  --project <path>           Project directory to initialize (default: cwd)
  --dry-run                  Preview planned writes without changing files
  --force                    Overwrite existing generated files
  -h, --help                 Show this help

${c.bold}Examples:${c.reset}
  vibe init --tool claude-code --scope recommended --current-terminal
  vibe init codex --scope minimal --project .
  vibe init cursor --scope full --dry-run
  vibe init gemini --scope team --force

${c.dim}Runtime note: core setup is project-local. Optional runtime state is not installed or started unless you explicitly opt in.${c.reset}
`);
}

function formatToolName(tool) {
  return ({ 'claude-code': 'Claude Code', claude: 'Claude Code', codex: 'Codex', cursor: 'Cursor', gemini: 'Gemini', cline: 'Cline', continue: 'Continue.dev', aider: 'Aider', windsurf: 'Windsurf' })[tool] || tool;
}

function projectGuidance(projectDir) {
  const signals = [
    { path: 'CLAUDE.md', tool: 'claude-code', next: 'Open this folder in Claude Code; it reads CLAUDE.md automatically.' },
    { path: 'AGENTS.md', tool: 'codex', next: 'Open this repo with Codex; it reads AGENTS.md as repository guidance.' },
    { path: '.cursorrules', tool: 'cursor', next: 'Open this folder in Cursor; .cursorrules provides project guidance.' },
    { path: '.cursor/rules', tool: 'cursor', next: 'Open this folder in Cursor; rules under .cursor/rules provide project guidance.' },
    { path: 'GEMINI.md', tool: 'gemini', next: 'Open this repo with Gemini Code Assist; it reads GEMINI.md.' },
    { path: '.clinerules', tool: 'cline', next: 'Open this folder in Cline; .clinerules provides project guidance.' },
    { path: 'CONVENTIONS.md', tool: 'aider', next: 'Open this repo with Aider; it reads CONVENTIONS.md.' },
    { path: '.windsurfrules', tool: 'windsurf', next: 'Open this folder in Windsurf; .windsurfrules provides project guidance.' },
  ].filter((signal) => existsSync(join(projectDir, signal.path)));
  let manifest = null;
  const manifestPath = join(projectDir, '.vibe', 'setup.json');
  if (existsSync(manifestPath)) {
    try {
      manifest = readJSON(manifestPath);
    } catch (err) {
      if (process.env.VIBE_DEBUG) {
        console.warn(`${c.yellow}Warning:${c.reset} could not read .vibe/setup.json: ${err.message}`);
      }
    }
  }
  return { signals, manifest };
}

export async function cmdInit(toolOrArg = 'claude-code', rawArgs = []) {
  if ([toolOrArg, ...rawArgs].some((arg) => arg === '--help' || arg === '-h')) { cmdInitHelp(); return; }
  const { parseSetupProjectArgs, planProjectSetup, applyProjectSetup, SETUP_TOOLS } = await import('./setup-project.mjs');
  let options;
  try {
    options = parseSetupProjectArgs([toolOrArg, ...rawArgs]);
  } catch (err) {
    console.error(`${fail} ${err.message}`);
    process.exit(1);
  }
  const validTools = Object.keys(SETUP_TOOLS).filter((t) => t !== 'claude');
  if (!SETUP_TOOLS[options.tool]) {
    console.error(`${fail} Unknown tool: ${options.tool}. Valid: ${validTools.join(', ')} (alias: claude)`);
    process.exit(1);
  }
  if (!options.scope || !options.scope.trim()) {
    console.error(`${fail} Missing --scope value.`);
    process.exit(1);
  }
  try {
    const plan = planProjectSetup({ rootDir: ROOT, projectDir: options.projectDir, tool: options.tool, scope: options.scope, force: options.force, dryRun: options.dryRun, currentTerminal: options.currentTerminal });
    if (options.dryRun) {
      console.log(`${info} Dry run — planned actions:`);
      for (const action of plan.actions) {
        const status = action.skip ? action.reason : 'write';
        console.log(`  ${c.cyan}${status}${c.reset} ${action.displayPath}`);
      }
      console.log(`\n  Scope: ${plan.scope}${plan.currentTerminal ? ' (current-terminal)' : ''}`);
      return;
    }
    const result = applyProjectSetup(plan);
    console.log(`${info} Initializing project with ${c.bold}${plan.tool}${c.reset} adapter (scope: ${plan.scope})...\n`);
    for (const entry of result.results) {
      if (entry.status === 'skipped') {
        console.log(`${c.yellow}⚠ ${entry.displayPath} ${entry.reason}${c.reset}`);
      } else {
        console.log(`${ok} ${entry.displayPath} (${entry.type})`);
      }
    }
    console.log(`${info} Global settings modified: ${plan.manifest.globalSettingsModified ? 'yes' : 'no'}`);
    console.log(`${info} Project-local manifest written to: ${join(plan.targetDir, '.vibe', 'setup.json')}`);
    console.log(`\n${c.green}${c.bold}Done!${c.reset} Your project is ready for ${formatToolName(plan.tool)}.`);
    console.log(`  Next: Open your project in ${formatToolName(plan.tool)} and run ${c.cyan}vibe doctor --project .${c.reset} to verify setup.`);
    console.log(`  Runtime: optional; this setup did not start a daemon or require .omc/runtime.\n`);
  } catch (err) {
    console.error(`${fail} ${err.message}`);
    process.exit(1);
  }
}

export function cmdVersion() {
  const pkg = readJSON(join(ROOT, 'package.json'));
  console.log(pkg.version || '0.0.0');
}

export function cmdExport(tool) {
  if (!tool || tool === '--help' || tool === '-h') {
    console.log(`Usage: vibe export <tool>

Export adapter configuration files for an AI coding tool.

Valid tools: cursor, claude, codex, gemini (alias: claude-code → claude)`);
    return;
  }
  const aliases = { 'claude-code': 'claude', 'claude': 'claude', 'codex': 'codex', 'cursor': 'cursor', 'gemini': 'gemini' };
  const validTools = ['cursor', 'claude', 'codex', 'gemini'];
  if (!tool || !aliases[tool]) {
    console.error(`${fail} Usage: vibe export <tool>`);
    console.error(`  Valid tools: ${validTools.join(', ')} (alias: claude-code → claude)`);
    process.exit(1);
  }

  console.log(`${info} Exporting Vibe Coding OS instructions for ${c.bold}${tool}${c.reset}...\n`);

  const adapters = {
    'cursor': {
      files: [
        { src: 'AGENTS.md', dest: '.cursorrules' },
      ],
      note: 'Tip: For Cursor project rules, move .cursorrules to .cursor/rules/vibe-coding-os.md',
    },
    'claude': {
      files: [
        { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
      ],
      note: 'CLAUDE.md is read directly by Claude Code as project instructions.',
    },
    'codex': {
      files: [
        { src: 'AGENTS.md', dest: 'AGENTS.md' },
      ],
      note: 'AGENTS.md is read by Codex as repository-level instructions.',
    },
    'gemini': {
      files: [
        { src: 'AGENTS.md', dest: 'GEMINI.md' },
      ],
      note: 'GEMINI.md is read by Gemini Code Assist as project instructions.',
    },
  };

  const adapter = adapters[aliases[tool]];
  for (const { src, dest } of adapter.files) {
    const srcPath = join(ROOT, src);
    const destPath = resolve(dest);
    if (!existsSync(srcPath)) {
      console.error(`${fail} Source not found: ${src}`);
      process.exit(1);
    }
    if (existsSync(destPath)) {
      console.log(`${c.yellow}⚠ ${dest} already exists — skipping (delete it first to overwrite)${c.reset}`);
    } else {
      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, readFileSync(srcPath, 'utf8'), 'utf8');
      console.log(`${ok} ${src} → ${dest}`);
    }
  }

  console.log(`\n${c.green}${c.bold}Export complete!${c.reset} Instructions written for ${tool}.`);
  console.log(`  ${c.dim}${adapter.note}${c.reset}\n`);
}

export function cmdInstallPack(packName, args = []) {
  const packsDir = join(ROOT, 'packs');
  let force = false;
  let dryRun = false;

  // Parse flags from args
  while (args.length > 0 && args[0].startsWith('--')) {
    const flag = args.shift();
    if (flag === '--dry-run') {
      dryRun = true;
    } else if (flag === '--force') {
      force = true;
    } else {
      console.error(`${fail} Unknown flag: ${flag}. Known flags: --dry-run, --force`);
      process.exit(1);
    }
  }

  // Allow --dry-run or --force as first arg instead of pack name
  if (!packName || packName.startsWith('--')) {
    if (packName === '--dry-run') {
      packName = args.shift() || null;
      dryRun = true;
    } else if (packName === '--force') {
      packName = args.shift() || null;
      force = true;
    }
  }
  if (!packName || packName.startsWith('--')) {
    const packs = existsSync(packsDir) ? getSubdirs(packsDir) : [];
    console.error(`${fail} Usage: vibe install-pack <pack-name> [--dry-run] [--force]`);
    console.error(`  Available packs: ${packs.join(', ') || '(none found)'}`);
    process.exit(1);
  }

  // W1: Validate pack name is a safe slug
  if (!/^[a-z0-9][a-z0-9-]*$/.test(packName)) {
    console.error(`${fail} Invalid pack name: ${packName}. Pack names must be lowercase alphanumeric with hyphens.`);
    process.exit(1);
  }

  const packFile = join(packsDir, packName, 'pack.json');
  if (!existsSync(packFile)) {
    const packs = existsSync(packsDir) ? getSubdirs(packsDir) : [];
    console.error(`${fail} Unknown pack: ${packName}`);
    console.error(`  Available packs: ${packs.join(', ') || '(none found)'}`);
    process.exit(1);
  }

  const pack = readJSON(packFile);

  // W1: Validate all skill names are safe slugs
  for (const skill of pack.skills || []) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(skill.name)) {
      console.error(`${fail} Invalid skill name in pack: ${skill.name}. Must be lowercase alphanumeric with hyphens.`);
      process.exit(1);
    }
  }

  const targetDir = resolve('.vibe', 'skills', pack.name);
  console.log(`${info} Installing skill pack ${c.bold}${pack.name}${c.reset}${dryRun ? ' (dry run)' : ''}...\n`);
  console.log(`${c.dim}${pack.description || ''}${c.reset}\n`);

  // B3: Check for overwrite
  if (!dryRun && existsSync(targetDir) && !force) {
    console.error(`${warn} Target directory already exists: ${targetDir}`);
    console.error(`  Use --force to overwrite existing files.`);
    process.exit(1);
  }

  const installed = [];
  for (const skill of pack.skills || []) {
    const srcPath = join(ROOT, 'skills', skill.source);
    const destPath = join(targetDir, `${skill.name}.md`);
    if (!existsSync(srcPath)) {
      console.error(`${fail} Missing skill source: ${skill.source}`);
      process.exit(1);
    }
    installed.push({ name: skill.name, source: skill.source, dest: destPath });
    if (!dryRun) {
      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, readFileSync(srcPath, 'utf8'), 'utf8');
    }
    console.log(`${ok} ${skill.name}`);
  }

  const manifest = {
    installedAt: new Date().toISOString(),
    pack: pack.name,
    version: pack.version || '1.0.0',
    description: pack.description || '',
    skills: installed.map(({ name, source }) => ({ name, source })),
    commands: pack.commands || [],
  };

  if (!dryRun) {
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, 'pack-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    writeFileSync(join(targetDir, 'README.md'), renderInstalledPackReadme(manifest), 'utf8');
  }

  console.log(`\n${c.green}${c.bold}${dryRun ? 'Dry run complete!' : 'Pack installed!'}${c.reset}`);
  console.log(`  Target: ${targetDir}`);
  console.log(`  Skills: ${(pack.skills || []).length}`);
  if ((pack.commands || []).length) console.log(`  Suggested commands: ${(pack.commands || []).join(', ')}`);
}

function renderInstalledPackReadme(manifest) {
  return `# Installed Vibe Skill Pack: ${manifest.pack}\n\n${manifest.description}\n\n- Version: ${manifest.version}\n- Installed at: ${manifest.installedAt}\n- Skills: ${manifest.skills.length}\n\n## Skills\n\n${manifest.skills.map((skill) => `- ${skill.name} — source: ${skill.source}`).join('\n')}\n\n## Suggested commands\n\n${manifest.commands.map((command) => `- ${command}`).join('\n') || '- None'}\n`;
}

export async function cmdDoctor(args = []) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: vibe doctor [options]

Options:
  --project <path>   Check a project directory for vibe readiness
  --json             Output as JSON
  --runtime          Check runtime health
  -h, --help         Show this help`);
    return;
  }
  const json = args.includes('--json');
  const runtime = args.includes('--runtime') || json;
  // Support both --project <path> and --project=<path> syntax
  let projectDir = null;
  const projectFlagIndex = args.indexOf('--project');
  if (projectFlagIndex >= 0) {
    const next = args[projectFlagIndex + 1];
    if (next && !next.startsWith('--')) {
      projectDir = resolve(next);
    } else {
      console.error(`${fail} --project requires a directory path. Usage: vibe doctor --project <path>`);
      process.exit(1);
    }
  } else {
    // Check --project=<path> syntax
    const eqArg = args.find(a => a.startsWith('--project='));
    if (eqArg) {
      projectDir = resolve(eqArg.split('=')[1]);
    }
  }
  if (projectDir && !existsSync(projectDir)) {
    console.error(`${fail} Project directory not found: ${projectDir}`);
    process.exit(1);
  }

  if (json) { const report = await runDoctor(projectDir || ROOT); console.log(JSON.stringify(report, null, 2)); return; }

  if (projectDir) {
    console.log(`${c.bold}${c.cyan}Vibe Coding OS — Project Readiness${c.reset}\n`);
    console.log(`${info} Checking: ${c.bold}${projectDir}${c.reset}\n`);
    let adapterFound = false;
    for (const signal of ['CLAUDE.md', 'AGENTS.md', '.cursorrules', 'GEMINI.md', '.cursor/rules']) {
      if (existsSync(join(projectDir, signal))) {
        adapterFound = true;
        console.log(`${ok} ${signal}`);
      }
    }
      if (!adapterFound) {
        console.log(`${c.yellow}⚠ No adapter instruction file found${c.reset}`);
        console.log(`  Tip: Run ${c.cyan}vibe init <tool>${c.reset} in this project directory.`);
      } else {
        console.log(`\n${c.green}${c.bold}Project is ready!${c.reset} Your AI coding assistant can read the instruction file.`);
        const { signals, manifest } = projectGuidance(projectDir);
        if (signals.length) {
          console.log(`\n${c.bold}Next steps:${c.reset}`);
          const seen = new Set();
          for (const signal of signals) {
            const key = `${signal.tool}:${signal.next}`;
            if (seen.has(key)) continue;
            seen.add(key);
            console.log(`  - ${formatToolName(signal.tool)}: ${signal.next}`);
          }
          console.log(`  - Re-run setup safely with ${c.cyan}vibe init --tool <tool> --project . --dry-run${c.reset} before overwriting anything.`);
        }
        const runtimeIntent = manifest?.optionalRuntime === true || manifest?.scope === 'runtime' || manifest?.scope === 'team';
        console.log(`\n${c.bold}Runtime:${c.reset} optional. ${runtimeIntent ? 'This project records runtime/team intent, but runtime state is still opt-in and no daemon is required.' : 'Adapter files work without .omc/runtime, daemons, or MCP servers.'}`);
      }
    if (projectDir) {
      const report = await runDoctor(projectDir);
      console.log('\n' + formatDoctorReport(report));
    }
    return;
  }

  console.log(`${c.bold}${c.cyan}Vibe Coding OS — Health Check${c.reset}\n`);

  const checks = [
    { name: 'package.json', path: 'package.json', required: true },
    { name: 'node_modules', path: 'node_modules', required: false, isDir: true },
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
    } else if (check.required === false) {
      console.log(`${c.yellow}⚠ ${check.name} — not found (optional)${c.reset}`);
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

  if (runtime) {
    const report = await runDoctor(ROOT);
    console.log('\n' + formatDoctorReport(report));
    if (json) { console.log(JSON.stringify(report, null, 2)); return; }
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
  let catNotFound = false;

  for (const cat of categories) {
    const catDir = join(skillsDir, cat);
    if (!existsSync(catDir)) {
      console.log(`${c.yellow}Category '${cat}' not found${c.reset}`);
      catNotFound = true;
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

  if (catNotFound) process.exit(1);
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

export function cmdPrompt(name, fileName, description) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`Usage: vibe ${name}\n\nOptions:\n  --help, -h  Show this help\n\nDescription:\n  ${description}\n\nThis command is a prompt file — paste it into your AI assistant (Claude Code, Codex, Cursor)\nvia the commands/ directory or MCP tools.`);
    process.exit(0);
  }
  const cmdPath = join(ROOT, 'commands', fileName);
  if (!existsSync(cmdPath)) {
    console.error(`${fail} Command file not found: commands/${fileName}`);
    process.exit(1);
  }
  console.log(`${c.bold}${c.cyan}Vibe ${name.charAt(0).toUpperCase() + name.slice(1)}${c.reset} — ${description}\n`);
  console.log(`${info} Prompt file: commands/${fileName}`);
  console.log(`${info} Purpose: Paste into your AI assistant to execute this workflow step\n`);
  console.log(`  Usage with your AI assistant:`);
  console.log(`    1. Open your AI tool (Claude Code, Codex, Cursor)`);
  console.log(`    2. Paste the contents of commands/${fileName}`);
  console.log(`    3. Follow the instructions in the prompt\n`);
  console.log(`  Usage with MCP tools (if runtime enabled):`);
  console.log(`    The vibe.${name} tool is available via the MCP server`);
  console.log('');
}

export function cmdSpec(args) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: vibe spec [name] [--copy]\n\nOptions:\n  --copy    Copy template to current directory as SPEC.md\n  -h, --help  Show this help\n\nExample:\n  vibe spec my-feature\n  vibe spec my-feature --copy`);
    return;
  }
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
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: vibe plan [name] [--copy]\n\nOptions:\n  --copy    Copy template to current directory as PLAN.md\n  -h, --help  Show this help\n\nExample:\n  vibe plan my-feature\n  vibe plan my-feature --copy`);
    return;
  }
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
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: vibe memory [name] [--copy]\n\nOptions:\n  --copy    Copy template to current directory as MEMORY.md\n  -h, --help  Show this help\n\nExample:\n  vibe memory my-observation\n  vibe memory my-observation --copy`);
    return;
  }
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
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: vibe task [name] [--copy]\n\nOptions:\n  --copy    Copy template to current directory as TASK.md\n  -h, --help  Show this help\n\nExample:\n  vibe task my-task\n  vibe task my-task --copy`);
    return;
  }
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
export async function cmdEvents(args = []) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: vibe events [options]\n\nOptions:\n  --json             Output as JSON\n  --limit=N          Max events to show (default: 10, max: 1000)\n  -h, --help         Show this help`);
    return;
  }
  const json = args.includes('--json');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  let limit = limitArg ? Number(limitArg.split('=')[1]) : 10;
  if (!Number.isFinite(limit) || limit < 1 || limit > 1000) limit = 10;
  const { createStore } = await import('../runtime/core/fs-store.mjs');
  const store = createStore(process.cwd());

  const meta = await getEventMetadata(store);
  const events = await listEventsV2(store, { tail: true, limit });
  const result = { meta, events };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`${c.bold}${c.cyan}Event Store${c.reset}\n`);
  console.log(`${info} Total events: ${meta.totalEvents}`);
  console.log(`${info} Last sequence: ${meta.nextSeq - 1}`);
  console.log(`${info} File size: ${meta.fileSize} bytes`);
  if (Object.keys(meta.typeCounts || {}).length) {
    console.log(`\n${c.bold}Event types:${c.reset}`);
    for (const [type, count] of Object.entries(meta.typeCounts)) console.log(`  ${type}: ${count}`);
  }
  if (events.length) {
    console.log(`\n${c.bold}Recent events:${c.reset}`);
    for (const e of events.slice(-limit)) console.log(`  #${e.seq ?? '?'} ${e.type} ${e.id}`);
  }
}

const isMainModule = (() => {
  const entry = process.argv[1];
  try {
    return entry && (realpathSync(entry) === realpathSync(fileURLToPath(import.meta.url)));
  } catch {
    return false;
  }
})();

if (isMainModule) {
  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case 'init': await cmdInit(args[0], args.slice(1)); break;
    case 'doctor': await cmdDoctor(args); break;
    case 'version': case '--version': case '-V': cmdVersion(); break;
    case 'export': cmdExport(args[0]); break;
    case 'install-pack': cmdInstallPack(args[0], args.slice(1)); break;
    case 'events': await cmdEvents(args); break;
    case 'list-skills': cmdListSkills(args[0] || null); break;
    case 'list-commands': cmdListCommands(); break;
    case 'stats': cmdStats(); break;
    case 'verify': cmdPrompt('verify', 'vibe-verify.md', 'Verify implementation against spec'); break;
    case 'review': cmdPrompt('review', 'vibe-review.md', 'Request code review'); break;
    case 'merge': cmdPrompt('merge', 'vibe-merge.md', 'Merge with review gate'); break;
    case 'tasks': cmdPrompt('tasks', 'vibe-tasks.md', 'Break plan into tasks'); break;
    case 'implement': cmdPrompt('implement', 'vibe-implement.md', 'Implement from tasks'); break;
    case 'spec': cmdSpec(args); break;
    case 'plan': cmdPlan(args); break;
    case 'memory': cmdMemory(args); break;
    case 'task': cmdTask(args); break;
    case 'templates': cmdTemplates(); break;
    case 'runtime-task': {
      if (args.includes('--help') || args.includes('-h')) {
        console.log('Usage: vibe runtime-task <command> [options]\n\nCommands:\n  list                          List all tasks\n  list-pending [limit]          List pending tasks\n  list-claimed [profile]        List claimed tasks\n  next [profile]                Claim the next pending task\n  status <id> [--to <state>]    Update task status\n  claim <id> [--profile <p>]    Claim a specific task\n  release <id>                  Release a claimed task\n  heartbeat <id>                Heartbeat a claimed task\n  help                          Show this help\n\nOptions:\n  --profile <name>              Agent profile\n  --to <new-state>              Target state for status update\n  -h, --help                    Show this help');
        process.exit(0);
      }
      const { spawnSync } = await import('node:child_process');
      const result = spawnSync(process.execPath, [join(__dirname, 'runtime-task.mjs'), ...args], {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['inherit', 'inherit', 'inherit'],
      });
      process.exit(result.status ?? 1);
      break;
    }
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
    case 'runtime-audit': {
      if (args.includes('--help') || args.includes('-h')) {
        console.log(`Usage: vibe runtime-audit [options]\n\nRun safety audit on runtime state.\n\nOptions:\n  --json           Output as JSON\n  --root <dir>     Project root directory\n  -h, --help       Show this help`);
        process.exit(0);
      }
      const { spawnSync } = await import('node:child_process');
      const result = spawnSync(process.execPath, [join(__dirname, 'runtime-audit.mjs'), ...args], {
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
