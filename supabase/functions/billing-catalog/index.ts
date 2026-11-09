// Read-only sandbox catalogue check. Secret keys never leave the Edge Function.
import catalog from './catalog.json' with { type: 'json' };
const publicKey='sb_publishable_ni-2Cu5-N1xQaMtgyVu0Pg_PpaUBg0D';
let cached: {at:number;data:unknown}|null=null;
let pending:Promise<unknown>|null=null;
async function verify(){
 const key=Deno.env.get('STRIPE_SECRET_KEY');
 if(!key||!key.startsWith('sk_test_'))throw Error('Configure a Stripe sandbox secret key in STRIPE_SECRET_KEY.');
 const entries=[['monthly',catalog.subscription],...Object.entries(catalog.games)] as Array<[string,{price_id:string;unit_amount:number}]>;
 const verified=[];
 for(let i=0;i<entries.length;i+=4){verified.push(...await Promise.all(entries.slice(i,i+4).map(async([id,expected])=>{
  const response=await fetch('https://api.stripe.com/v1/prices/'+encodeURIComponent(expected.price_id)+'?expand[]=product',{headers:{Authorization:'Bearer '+key}});
  if(!response.ok)throw Error('Could not read the sandbox price for '+id+'. Check that the key and prices belong to the same Stripe sandbox.');
  const p=await response.json();
  if(p.livemode!==false||p.active!==true||p.currency!=='aud'||p.unit_amount!==expected.unit_amount||!p.product||p.product.active!==true)throw Error('The sandbox price for '+id+' does not match the approved active AUD price.');
  if(id==='monthly'?(p.type!=='recurring'||p.recurring?.interval!=='month'||p.recurring?.interval_count!==1||p.product.id!==catalog.subscription.product_id):(p.type!=='one_time'||p.recurring!==null))throw Error('Incorrect billing type for '+id+'.');
  return {id,price_id:p.id,amount:p.unit_amount,currency:p.currency,type:p.type,product:p.product.id};
 })));}
 return {environment:'sandbox',verified:true,prices:verified,checkout_enabled:false};
}
Deno.serve(async req=>{
 const origin=req.headers.get('origin'),allowed=['https://breakroomdaily.com','https://break-room.phillipsphoenix09.workers.dev','https://phoenix6716.github.io'];
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Origin':origin&&allowed.includes(origin)?origin:'https://breakroomdaily.com','Access-Control-Allow-Headers':'apikey, authorization, content-type','Access-Control-Allow-Methods':'GET, OPTIONS'};
 const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers});
 if(origin&&!allowed.includes(origin))return json({error:'Origin not allowed'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='GET')return json({error:'Method not allowed'},405);
 if(req.headers.get('apikey')!==publicKey)return json({error:'Project API key required'},401);
 try{if(cached&&Date.now()-cached.at<300000)return json(cached.data);if(!pending)pending=verify().then(data=>{cached={at:Date.now(),data};return data;}).finally(()=>{pending=null;});return json(await pending);}catch(e){return json({error:e instanceof Error?e.message:'Sandbox configuration could not be verified.'},503);}
});
