#!/usr/bin/env node
import { createStore } from '../runtime/core/fs-store.mjs';
import { createTask, listTasks, updateTaskStatus, nextReadyTask, importTasksFromMarkdown } from '../runtime/tasks/task-store.mjs';
function parseArgs(argv) {
  const positionals = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) { flags[k] = true; } else { flags[k] = n; i++; }
    } else positionals.push(a);
  }
  return { positionals, flags };
}

const { positionals, flags } = parseArgs(process.argv.slice(2));
const store = createStore(process.cwd());
const cmd = positionals[0];
if (cmd === 'create') console.log(JSON.stringify(await createTask(store, { title: flags.title, description: flags.description, owner: flags.owner, phase: flags.phase, priority: flags.priority, dependsOn: flags.dependsOn ? String(flags.dependsOn).split(',') : [], parentTaskId: flags.parentTaskId, actor: flags.actor }), null, 2));
else if (cmd === 'list') console.log(JSON.stringify(await listTasks(store), null, 2));
else if (cmd === 'status') {
  const actor = flags.actor || 'cli';
  const blockedReason = flags.reason || null;
  console.log(JSON.stringify(await updateTaskStatus(store, flags.id, flags.to, { actor, blockedReason }), null, 2));
}
else if (cmd === 'next') console.log(JSON.stringify(await nextReadyTask(store), null, 2));
else if (cmd === 'import') console.log(JSON.stringify(await importTasksFromMarkdown(store, flags.file), null, 2));
else { console.error('usage: runtime-task <create|list|status|next|import> [--title --description --owner --phase --priority --dependsOn --parentTaskId --actor --id --to --reason --file]'); process.exit(1); }
