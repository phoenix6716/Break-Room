import {billing} from '../_shared/billing-live-runtime.ts';
Deno.serve(billing.handler);
