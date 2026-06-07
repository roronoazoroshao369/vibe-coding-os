import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
const FILE='sessions.json';
export async function listSessions(store){return (await readJson(store,FILE,emptyCollection('sessions'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:1,kind:'sessions',items});}
export async function createSession(store,input){return withLock(store,'sessions',async()=>{const items=await listSessions(store); const item={schemaVersion:1,id:makeId('sess'),goal:input.goal||'',summary:input.summary||'',createdAt:nowIso(),updatedAt:nowIso()}; items.push(item); await save(store,items); await appendEvent(store,'session.created',{id:item.id,goal:item.goal}); return item;});}
