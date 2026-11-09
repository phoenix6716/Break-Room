import {createHandler} from './handler.mjs';

Deno.serve(createHandler({
 secret:Deno.env.get('STRIPE_WEBHOOK_SECRET'),
 enqueue:async (event:Record<string,unknown>) => {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const url = Deno.env.get('SUPABASE_URL');
  if (!key || !url) throw Error('Server configuration unavailable');
  const response = await fetch(url + '/rest/v1/rpc/billing_receive_sandbox_event', {
   method:'POST',headers:{apikey:key,Authorization:'Bearer ' + key,'Content-Type':'application/json'},
   body:JSON.stringify(event),signal:AbortSignal.timeout(10000)
  });
  if (!response.ok) throw Error('Event persistence failed');
 }
}));
