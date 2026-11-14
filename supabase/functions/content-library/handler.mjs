/* Authenticated history only. Never accepts a caller-selected account or billing proof. */
export function createContentHandler({user,db}){
 return async request=>{
  const origin=request.headers.get('origin'),origins=['https://breakroomdaily.com','https://break-room.phillipsphoenix09.workers.dev','https://phoenix6716.github.io'];
  const headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:origins[0],'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
  const reply=(body,status=200)=>Response.json(body,{status,headers});
  if(origin&&!origins.includes(origin))return reply({error:'Origin not allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST')return reply({error:'POST required'},405);
  try{
   const actor=await user(request.headers.get('authorization'));
   if(!actor?.id||actor.is_anonymous===true)return reply({error:'Sign in again to sync question history.'},401);
   if(Number(request.headers.get('content-length'))>300000)return reply({error:'History too large'},413);
   const raw=await request.text();if(raw.length>300000)return reply({error:'History too large'},413);
   let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid request'},400);}
   if(!body||!['sync','shown'].includes(body.action)||typeof body.game!=='string'||body.game.length>32||
    (body.seen!==undefined&&(!Array.isArray(body.seen)||body.seen.length>20000||!body.seen.every(x=>typeof x==='string'&&x.length>0&&x.length<=200)))||
    (body.action==='shown'&&(typeof body.id!=='string'||body.id.length<1||body.id.length>200)))return reply({error:'Invalid history operation'},400);
   return reply(await db(body.action,{user_id:actor.id,game:body.game,seen:body.seen||[],allocate:body.allocate===true,...(body.action==='shown'?{id:body.id}:{})}));
  }catch{return reply({error:'Question history could not sync. Your current round is safe.'},503);}
 };
}
