#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { listTeams } from '../runtime/teams/team-store.mjs';
import * as taskStore from '../runtime/tasks/task-store.mjs';
import {
  checkTmux, prepareTeamRun, launchSession, collectOutputs, mapResults, sessionName,
} from '../runtime/teams/tmux-runner.mjs';

function parseArgs(argv) {
  const positionals = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else positionals.push(a);
  }
  return { positionals, flags };
}

const HELP = `runtime-team-run — opt-in tmux team runner

USAGE
  node scripts/runtime-team-run.mjs <command> [options]

COMMANDS
  check                  Report whether tmux is available
  list                   List imported team specs (id + name + roles)
  run <teamId>           Prepare prompts and launch a tmux session (one window per role)
  collect <teamId>       Read role output logs and map results into the task-store

OPTIONS
  --team <id>            Team id (alternative to positional)
  --dry-run              Print tmux commands without executing them
  --command <cmd>        Command piped the prompt in each pane (default: claude)
  --no-map               (collect) skip writing results into the task-store
  -h, --help             Show this help

EXAMPLES
  node scripts/runtime-team-run.mjs check
  node scripts/runtime-team-run.mjs list
  node scripts/runtime-team-run.mjs run team_abc123 --dry-run
  node scripts/runtime-team-run.mjs run team_abc123
  node scripts/runtime-team-run.mjs collect team_abc123
`;

async function findTeam(store, teamId) {
  const teams = await listTeams(store);
  const team = teams.find(t => t.id === teamId);
  if (!team) throw new Error(`team not found: ${teamId} (run "list" to see available teams)`);
  return team;
}

async function main() {
  const { positionals, flags } = parseArgs(process.argv.slice(2));
  const cmd = positionals[0];

  if (!cmd || flags.help || flags.h) { console.log(HELP); process.exit(cmd ? 0 : (flags.help || flags.h ? 0 : 1)); }

  const store = createStore(process.cwd());

  if (cmd === 'check') {
    const r = checkTmux();
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.available ? 0 : 1);
  }

  if (cmd === 'list') {
    const teams = await listTeams(store);
    const summary = teams.map(t => ({ id: t.id, name: t.name, roles: (t.roles || []).map(r => r.name) }));
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (cmd === 'run') {
    const teamId = positionals[1] || flags.team;
    if (!teamId) { console.error('error: team id required (positional or --team)'); process.exit(1); }
    const team = await findTeam(store, teamId);
    const teamRun = await prepareTeamRun(store, team);
    launchSession(store, teamRun, {
      dryRun: flags['dry-run'] === true,
      command: typeof flags.command === 'string' ? flags.command : 'claude',
    });
    console.log(JSON.stringify({ runId: teamRun.runId, sessionName: teamRun.sessionName, roles: teamRun.roles.map(r => r.name) }, null, 2));
    return;
  }

  if (cmd === 'collect') {
    const teamId = positionals[1] || flags.team;
    if (!teamId) { console.error('error: team id required (positional or --team)'); process.exit(1); }
    const team = await findTeam(store, teamId);
    // Rebuild a minimal teamRun descriptor for collection
    const teamRun = await prepareTeamRun(store, team);
    const results = await collectOutputs(store, teamRun);
    let mapped = [];
    if (flags['no-map'] !== true) mapped = await mapResults(store, teamRun, results, taskStore);
    console.log(JSON.stringify({
      session: sessionName(teamId),
      results: results.map(r => ({ role: r.role, bytes: r.output.length, file: r.file })),
      mappedTasks: mapped.map(t => t.id),
    }, null, 2));
    return;
  }

  console.error(`unknown command: ${cmd}\n`);
  console.error(HELP);
  process.exit(1);
}

main().catch(err => { console.error(`error: ${err.message}`); process.exit(1); });
