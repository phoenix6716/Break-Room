/* Run the real account event handlers with navigation held in flight. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
 const listeners=new Map(),timers=[],redirects=[],data=new Map([['br:cloud:owner','player-a']]);
 const session={user:{id:'player-a',email:'player@example.com'}};let authChange;
 const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key),get length(){return data.size;},key:i=>[...data.keys()][i]};
 const query={select(){return this;},eq(){return this;},async maybeSingle(){return {error:{message:'Offline in navigation unit test'}};}};
 const context={URL,console,Event,CustomEvent:class{},navigator:{},localStorage:storage,
  location:{href:'https://example.com/Midnight-Arcade/games/stack-up/index.html',pathname:'/Midnight-Arcade/games/stack-up/index.html',replace:url=>redirects.push(url)},
  document:{currentScript:{src:'https://example.com/Midnight-Arcade/accounts.js'},hidden:false,getElementById:()=>null,querySelectorAll:()=>[],querySelector:()=>null},
  setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},setInterval(){},
  addEventListener:(type,fn)=>listeners.set(type,fn),dispatchEvent(){},
  BREAK_ROOM_ACCOUNT_CONFIG:{url:'https://example.supabase.co',publishableKey:'sb_publishable_test'},
  BREAK_ROOM_SUPABASE:{createClient:()=>({auth:{getSession:async()=>({data:{session}}),onAuthStateChange:fn=>{authChange=fn;}},from:()=>query})}
 };
 context.window=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync('cloud-saves.js','utf8'),context);
 vm.runInContext(fs.readFileSync('accounts.js','utf8'),context);
 await new Promise(resolve=>setImmediate(resolve));
 assert.ok(listeners.has('storage'),'Account boot installed storage handlers');
 // Keep the old document alive, like a slow destination page, while notifications arrive.
 for(let i=0;i<4;i++)listeners.get('storage')({key:'br:cloud:generation'});
 data.delete('br:cloud:owner');listeners.get('storage')({key:'br:cloud:owner'});
 data.set('br:cloud:owner','different-player');authChange('SIGNED_OUT',null);
 while(timers.length)timers.shift()();
 assert.deepEqual(redirects,['https://example.com/Midnight-Arcade/account.html'],'Save-generation, owner and auth events must request exactly one navigation');
 console.log('PASS account navigation: repeated storage and auth notifications cannot restart an in-flight redirect.');
})().catch(error=>{console.error(error);process.exitCode=1;});
