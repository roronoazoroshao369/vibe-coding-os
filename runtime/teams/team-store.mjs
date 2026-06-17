import { readFile } from 'node:fs/promises';
import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { CURRENT_SCHEMA_VERSION } from '../core/validation.mjs';
const FILE='teams.json';
export async function listTeams(store){return (await readJson(store,FILE,emptyCollection('teams'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:CURRENT_SCHEMA_VERSION,kind:'teams',items});}
export async function importTeamSpec(store,file){const spec=JSON.parse(await readFile(file,'utf8')); return withLock(store,'teams',async()=>{const items=await listTeams(store); const item={schemaVersion:CURRENT_SCHEMA_VERSION,id:makeId('team'),name:spec.name||'Imported Team',pattern:spec.pattern||null,goal:spec.goal||'',roles:spec.roles||[],tasks:spec.tasks||[],source:file,createdAt:nowIso()}; items.push(item); await save(store,items); await appendEvent(store,'team.imported',{id:item.id,name:item.name,source:file}); return item;});}
