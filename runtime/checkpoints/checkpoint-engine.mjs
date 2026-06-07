import { makeId, nowIso } from '../core/ids.mjs';
import { readJson, writeJsonAtomic, withLock, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { assertString } from '../core/validation.mjs';
const FILE='checkpoints.json';
export async function listCheckpoints(store){return (await readJson(store,FILE,emptyCollection('checkpoints'))).items;}
async function save(store,items){await writeJsonAtomic(store,FILE,{schemaVersion:1,kind:'checkpoints',items});}
export async function createCheckpoint(store,input){assertString(input.type,'type'); assertString(input.result,'result'); return withLock(store,'checkpoints',async()=>{const items=await listCheckpoints(store); const item={schemaVersion:1,id:makeId('chk'),type:input.type,result:input.result,subject:input.subject||null,notes:input.notes||'',createdAt:nowIso()}; items.push(item); await save(store,items); await appendEvent(store,'checkpoint.recorded',{id:item.id,type:item.type,result:item.result,subject:item.subject}); return item;});}
