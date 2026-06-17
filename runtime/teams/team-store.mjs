import { readFile } from 'node:fs/promises';
import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
import { Enforcement } from '../core/enforcement.mjs';
const FILE='teams.json';

const enforcement = new Enforcement();
const ALLOWED_TEAM_SPEC_FIELDS = [
  'name', 'pattern', 'goal', 'roles', 'tasks', 'orchestration_pattern',
  'orchestration', 'reviewGates', 'stop_conditions', 'metadata',
  'extensions', 'createdBy', 'trace',
];

export async function listTeams(store){return (await readJson(store,FILE,emptyCollection('teams'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:CURRENT_SCHEMA_VERSION,kind:'teams',items},{enforcement,source:'runtime-team'});}

export async function importTeamSpec(store,file){
  const spec=JSON.parse(await readFile(file,'utf8'));
  enforcement.assertKnownFields(spec, ALLOWED_TEAM_SPEC_FIELDS, 'team spec');
  return withLock(store,'teams',async()=>{
    const items=await listTeams(store);
    const item={
      schemaVersion:CURRENT_SCHEMA_VERSION,
      id:makeId('team'),
      name:spec.name||'Imported Team',
      pattern:spec.pattern||null,
      goal:spec.goal||'',
      roles:spec.roles||[],
      tasks:spec.tasks||[],
      orchestration_pattern:spec.orchestration_pattern||null,
      orchestration:spec.orchestration||null,
      reviewGates:spec.reviewGates||[],
      stop_conditions:spec.stop_conditions||[],
      source:file,
      createdBy:spec.createdBy||null,
      trace:spec.trace||null,
      createdAt:nowIso(),
      metadata:spec.metadata||{},
      extensions:spec.extensions||{}
    };
    items.push(item);
    await save(store,items);
    await appendEvent(store,'team.imported',{id:item.id,name:item.name,source:file});
    return item;
  });
}
