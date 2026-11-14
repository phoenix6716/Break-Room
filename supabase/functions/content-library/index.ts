import {createContentHandler} from './handler.mjs';
const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),anon=Deno.env.get('SUPABASE_ANON_KEY');
Deno.serve(createContentHandler({
 user:async(authorization:string|null)=>{
  if(!authorization?.startsWith('Bearer ')||!url||!anon)return null;
  const r=await fetch(url+'/auth/v1/user',{headers:{apikey:anon,Authorization:authorization},signal:AbortSignal.timeout(10000)});
  return r.ok?r.json():null;
 },
 db:async(action:string,data:Record<string,unknown>)=>{
  if(!url||!key)throw Error('Configuration unavailable');
  const r=await fetch(url+'/rest/v1/rpc/content_library_server',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_data:data}),signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('Storage unavailable');return r.json();
 }
}));
