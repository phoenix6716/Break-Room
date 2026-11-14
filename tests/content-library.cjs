const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
 const {createContentHandler}=await import('../supabase/functions/content-library/handler.mjs');let received;
 const handler=createContentHandler({user:async token=>token==='Bearer signed'?{id:'verified'}:null,db:async(action,data)=>{received={action,data};return{ids:[],seen:[]}}});
 const post=body=>new Request('https://test.invalid',{method:'POST',headers:{authorization:'Bearer signed'},body:JSON.stringify(body)});
 assert.equal((await handler(new Request('https://test.invalid',{method:'POST',body:'{}'}))).status,401);
 assert.equal((await handler(post({action:'activate',game:'laser'}))).status,400);
 assert.equal((await handler(post({action:'sync',game:'laser',user_id:'victim',seen:['a']}))).status,200);assert.equal(received.data.user_id,'verified');
 assert.equal((await handler(post({action:'shown',game:'laser',id:{evil:true}}))).status,400);
 const source=fs.readFileSync('unlimited-library.js','utf8'),history=new Set(),batch=['a','b','c'];let fail=false,actor='alice',delay;
 function device(){const data=new Map([['br:cloud:owner','alice']]),store={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
  const box={localStorage:store,sessionStorage:{getItem:()=>null,setItem:()=>{}},Event,dispatchEvent:()=>{},Intl,Date,BREAK_ROOM_ACCOUNTS:{getUser:()=>({id:actor}),ready:Promise.resolve(),contentRequest:async body=>{
   if(delay)await delay;if(fail)throw Error('offline');for(const id of body.seen||[])history.add(id);
   const replay=history.has(body.id);if(body.action==='shown')history.add(body.id);
   return{week:'2026-11-09',ids:body.allocate?batch:[],seen:[...history],replay};
  }}};box.window=box;vm.runInNewContext(source,box);return{box,L:box.BREAK_ROOM_UNLIMITED_LIBRARY.create('laser'),data};}
 const a=device(),b=device(),bank=batch.map(id=>({id}));
 a.L.seed(['legacy']);await a.L.prepare();assert(history.has('legacy'));assert.equal(a.L.select(bank).length,3);
 a.L.draw('a');await a.L.prepare();await b.L.prepare();assert.deepEqual(Array.from(b.L.unseen(bank),x=>x.id),['b','c'],'New device avoids a shown question');
 let advanced=false;assert.equal(b.L.advance(()=>{advanced=b.L.advance(()=>{});}),false);await new Promise(r=>setTimeout(r,0));assert(advanced,'Next hydrates before invoking native selection');
 fail=true;advanced=false;b.L.advance(()=>{advanced=true});await new Promise(r=>setTimeout(r,0));assert.equal(advanced,false,'Offline Next preserves the current round');
 fail=false;let release;delay=new Promise(r=>release=r);advanced=false;b.L.advance(()=>{advanced=true});b.L.cancelPending();release();await new Promise(r=>setTimeout(r,0));assert.equal(advanced,false,'Returning to Daily fences a pending Unlimited Next');delay=null;
 let resolve;delay=new Promise(r=>resolve=r);const pending=b.L.prepare();actor='bob';resolve();await assert.rejects(pending,/Account changed/);delay=null;
 console.log('Authenticated API, account fences, retained imports, cross-device freshness and offline round preservation passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
