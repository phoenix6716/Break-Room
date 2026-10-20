/* Native-save adapters. No credentials, DOM, engine initialization or storage writes. */
(root => {
 'use strict';
 const games=['stake','stack-up','lowball','pack'];
 const lowKeys=['pc_history','pc_progress','pc_last','pc_last_avg','pc_last_share','pc_streak','pc_best','pc_played','pc_country'];
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const parse=v=>{try{return JSON.parse(v);}catch{return null;}};
 function belongs(game,key){return game==='pack'?/^break-room:pack:daily:\d{4}-\d{2}-\d{2}$/.test(key):game==='stake'?/^stake:d:\d{4}-\d{2}-\d{2}$/.test(key)||key==='stake:streak':game==='stack-up'?/^break-room:stack-up:daily:\d{4}-\d{2}-\d{2}$/.test(key):game==='lowball'&&lowKeys.includes(key);}
 function clean(game,data){
  if(!games.includes(game)||!object(data))throw Error('Invalid cloud save.');
  const out={};
  for(const [key,value]of Object.entries(data)){
   if(!belongs(game,key)||typeof value!=='string'||value.length>250000)throw Error('Unsupported cloud save entry.');
   out[key]=value;
  }
  if(Object.keys(out).length>2000||JSON.stringify(out).length>1500000)throw Error('Cloud save is too large. Export a backup before continuing.');
  return out;
 }
 function capture(storage,validate=true){
  const out=Object.fromEntries(games.map(g=>[g,{}]));
  for(let i=0;i<storage.length;i++){const key=storage.key(i);for(const game of games)if(belongs(game,key)){const value=storage.getItem(key);if(value!==null)out[game][key]=value;}}
  if(validate)for(const game of games)clean(game,out[game]);return out;
 }
 function rank(game,raw,key){
  const v=parse(raw);if(!object(v))return -1;
  if(game==='pack')return root.BREAK_ROOM_PACK?.valid(v,key.slice(-10))?v.picks.length===3?999999:v.round*100+(v.phase==='review'?20:10):-1;
  if(game==='stake')return Array.isArray(v.p)&&Array.isArray(v.b)?v.p.length*10+v.b.length:-1;
  return Array.isArray(v.results)&&Number.isInteger(v.round)?(v.status==='complete'?999999:v.round*1000+(v.status==='review'?20:10))+(v.status==='complete'?0:(Number(v.mistakes)||0)/1000):-1;
 }
 const day=s=>{if(typeof s!=='string'||!/^\d{4}-\d{1,2}-\d{1,2}$/.test(s))return '';const [y,m,d]=s.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d?dt.toISOString().slice(0,10):'';};
 function lowMerge(local,remote){
  const out={...remote},history={};
  for(const source of [local,remote]){const h=parse(source.pc_history);if(object(h))for(const [k,v]of Object.entries(h))if(/^-?\d+$/.test(k)&&Number.isFinite(v)&&v>=0&&v<=100)history[k]=v;}
  const latest=day(local.pc_last)>day(remote.pc_last)||!Object.keys(remote).length?local:remote;
  // Preserve first cloud result for a date, never choose the higher score.
  for(const source of [local,remote]){const date=day(source.pc_last),n=Number(source.pc_last_avg);if(date&&source.pc_last_avg!=null&&Number.isFinite(n)&&n>=0&&n<=100){const key=String((Date.parse(date+'T00:00:00Z')-Date.UTC(2026,9,1))/86400000);if(!(key in history))history[key]=n;}}
  if(Object.keys(history).length)out.pc_history=JSON.stringify(history);
  for(const key of ['pc_last','pc_last_avg','pc_last_share','pc_country'])if(latest[key]!==undefined)out[key]=latest[key];
  const a=parse(local.pc_progress),b=parse(remote.pc_progress);
  const progressRank=p=>object(p)&&day(p.day)&&Number.isInteger(p.idx)?day(p.day)+':'+String(p.idx).padStart(2,'0')+':'+(p.pending?'1':'0'):'';
  const progress=progressRank(a)>progressRank(b)?a:b;
  if(progress){out.pc_progress=JSON.stringify(progress);if(progress===a&&local.pc_country)out.pc_country=local.pc_country;}
  for(const key of ['pc_best','pc_played']){const n=Math.max(Number(local[key])||0,Number(remote[key])||0,key==='pc_played'?Object.keys(history).length:0);if(n)out[key]=String(n);}
  // Streaks are derived from distinct dated results, not added across devices.
  const days=Object.keys(history).map(Number).sort((a,b)=>a-b);let streak=0,best=0,prev=null;
  for(const n of days){streak=n===prev+1?streak+1:1;best=Math.max(best,streak);prev=n;}
  if(days.length){
   out.pc_streak=String(streak);out.pc_best=String(Math.max(best,Number(out.pc_best)||0));
   const latestNumber=days.at(-1),date=new Date(Date.UTC(2026,9,1)+latestNumber*86400000);
   if(Number.isFinite(date.getTime())){
    const key=date.toISOString().slice(0,10),n=history[String(latestNumber)];
    if(day(out.pc_last)!==key||Number(out.pc_last_avg)!==n)delete out.pc_last_share;
    out.pc_last=date.getUTCFullYear()+'-'+(date.getUTCMonth()+1)+'-'+date.getUTCDate();out.pc_last_avg=String(n);
   }
  }
  return out;
 }
 function merge(game,local,remote){
  local=clean(game,local);remote=clean(game,remote);
  if(game==='lowball')return clean(game,lowMerge(local,remote));
  const out={...remote};
  for(const [key,value]of Object.entries(local))if(out[key]===undefined||rank(game,value,key)>rank(game,out[key],key))out[key]=value;
  if(game==='stake'){
   const days=Object.keys(out).filter(k=>k.startsWith('stake:d:')&&parse(out[k])?.p?.length===5).map(k=>k.slice(8)).sort();
   if(days.length){let n=1;for(let i=days.length-1;i>0&&Date.parse(days[i]) - Date.parse(days[i-1])===86400000;i--)n++;out['stake:streak']=JSON.stringify({last:days.at(-1),n});}
  }
  return clean(game,out);
 }
 function install(storage,snapshot){
  for(const game of games)clean(game,snapshot[game]||{});
  const previous=capture(storage);
  const replace=saves=>{const keys=[];for(let i=0;i<storage.length;i++){const k=storage.key(i);if(games.some(g=>belongs(g,k)))keys.push(k);}for(const k of keys)storage.removeItem(k);for(const game of games)for(const [k,v]of Object.entries(saves[game]||{}))storage.setItem(k,v);};
  try{replace(snapshot);}catch(error){try{replace(previous);}catch{}throw error;}
 }
 root.BREAK_ROOM_CLOUD_SAVES=Object.freeze({games,belongs,clean,capture,merge,install});
})(typeof window==='undefined'?globalThis:window);
