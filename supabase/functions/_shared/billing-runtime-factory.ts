import {BillingError,createBilling} from './billing-core.mjs';
export function createRuntime(catalog:any,environment:'sandbox'|'live'){
const live=environment==='live';
const key=Deno.env.get(live?'STRIPE_LIVE_RESTRICTED_KEY':'STRIPE_SECRET_KEY');
const validKey=()=>live?!!key?.startsWith('rk_live_'):!!key?.startsWith('sk_test_');
let accountCheck:Promise<void>|null=null;
const webhookSecret=Deno.env.get(live?'STRIPE_LIVE_WEBHOOK_SECRET':'STRIPE_WEBHOOK_SECRET');
const url=Deno.env.get('SUPABASE_URL');
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const anon=Deno.env.get('SUPABASE_ANON_KEY');
return createBilling({
 environment,
 // Live activation requires a reviewed source change as well as private credentials.
 checkoutEnabled:()=>!live,
 returnURL:live?'https://breakroomdaily.com/account':'https://breakroomdaily.com/billing-test',
 catalog,
 configured:()=>!!(validKey()&&webhookSecret?.startsWith('whsec_')&&url&&service&&anon),
 stripe:async(method:string,path:string,params?:Record<string,string>,idempotency?:string)=>{
  if(!validKey())throw new BillingError('Correct billing environment key required');
  if(live&&!accountCheck){accountCheck=(async()=>{const r=await fetch('https://api.stripe.com/v1/account',{headers:{Authorization:'Bearer '+key},signal:AbortSignal.timeout(10000)});if(!r.ok)throw new BillingError('Could not verify the live Stripe account');const a=await r.json();if(a.id!==catalog.stripe_account_id)throw new BillingError('Live Stripe account mismatch');})();accountCheck.catch(()=>{accountCheck=null;});}
  if(accountCheck)await accountCheck;
  const headers:Record<string,string>={Authorization:'Bearer '+key,'Stripe-Version':'2025-02-24.acacia'};
  if(idempotency)headers['Idempotency-Key']=idempotency;
  if(params)headers['Content-Type']='application/x-www-form-urlencoded';
  const response=await fetch('https://api.stripe.com/v1/'+path,{method,headers,body:params?new URLSearchParams(params):undefined,signal:AbortSignal.timeout(15000)});
  // Do not forward raw Stripe errors: an invalid-key message can contain a key.
  if(!response.ok){
   const details=await response.json().catch(()=>({}));
   const safe=(value:unknown)=>typeof value==='string'&&/^[a-zA-Z0-9_.\[\]-]{1,100}$/.test(value)?value:undefined;
   // Only fixed resource names and machine codes: never log raw error messages,
   // request bodies, customer IDs, authorization headers or secret values.
   console.error(JSON.stringify({event:'stripe_request_failed',environment,method,
    resource:path.startsWith('checkout/sessions')?'checkout/sessions':path.split('/')[0],
    status:response.status,type:safe(details.error?.type),code:safe(details.error?.code),
    param:safe(details.error?.param),request_id:safe(response.headers.get('request-id'))}));
   throw new BillingError('Stripe request failed. Please retry or contact support.');
  }
  return response.json();
 },
 db:async(action:string,data:Record<string,unknown>)=>{
  if(!url||!service)throw new BillingError('Billing storage is unavailable');
  const response=await fetch(url+'/rest/v1/rpc/billing_'+environment+'_server',{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_data:data}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new BillingError('Billing is busy or unavailable. Please retry shortly.');
  return response.json();
 },
 user:async(authorization:string|null)=>{
  if(!authorization?.startsWith('Bearer ')||!url||!anon)throw new BillingError('Please sign in to test checkout',401);
  const response=await fetch(url+'/auth/v1/user',{headers:{apikey:anon,Authorization:authorization},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new BillingError('Please sign in again',401);
  return response.json();
 }
});

}
