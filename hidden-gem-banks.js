/* Integrity-checked, immutable answer banks. No timer starts while a new bank loads. */
(root=>{'use strict';
const M=root.BREAK_ROOM_HIDDEN_GEM,pending=new Map(),base=new URL('games/hidden-gem/banks/',document.currentScript.src),DB='break-room:sleeper-banks:v1';
let connection;
function database(){if(connection)return connection;connection=new Promise(resolve=>{try{const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>request.result.createObjectStore('banks');request.onsuccess=()=>resolve(request.result);request.onerror=request.onblocked=()=>resolve(null);}catch{resolve(null);}});return connection;}
async function cached(id){const db=await database();if(!db)return null;return new Promise(resolve=>{try{const request=db.transaction('banks').objectStore('banks').get(id);request.onsuccess=()=>resolve(typeof request.result==='string'?request.result:null);request.onerror=()=>resolve(null);}catch{resolve(null);}});}
async function cache(id,raw){const db=await database();if(!db)return;try{const tx=db.transaction('banks','readwrite');tx.objectStore('banks').put(raw,id);tx.onerror=()=>{};}catch{/* Private browsing and quota failures never discard a captured round. */}}
async function verify(id,raw){const bytes=new TextEncoder().encode(raw),digest=await crypto.subtle.digest('SHA-256',bytes),actual=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');if(actual!==id)throw Error('Answer bank integrity check failed');}
async function rawQuestion(q){const id=q.bankRef.id;if(!pending.has(id)){const request=(async()=>{const local=await cached(id);if(local){try{await verify(id,local);return local;}catch{/* Replace an invalid cache only with a verified download. */}}
 const response=await fetch(new URL(id+'.json',base),{signal:AbortSignal.timeout(20000),credentials:'same-origin',cache:'force-cache'});if(!response.ok)throw Error('Answer bank unavailable ('+response.status+')');const raw=await response.text();await verify(id,raw);void cache(id,raw);return raw;
 })().finally(()=>pending.delete(id));pending.set(id,request);}return pending.get(id);}
async function loadQuestion(q){if(!q?.bankRef||M.bankReady(q))return;const raw=await rawQuestion(q);if(!M.bankReady(q))M.registerBank(q.bankRef.id,JSON.parse(raw));if(!M.bankReady(q))throw Error('Answer bank does not match the captured question');}
// Verify and cache future downloads without building large match indexes during
// an active thirty-second round. Next prepares its own index before its timer.
async function loadRun(run){await Promise.all(run.questions.slice(run.round+1).filter(q=>q.bankRef).map(rawQuestion));}
root.BREAK_ROOM_HIDDEN_GEM_BANKS=Object.freeze({loadQuestion,loadRun});
})(window);
