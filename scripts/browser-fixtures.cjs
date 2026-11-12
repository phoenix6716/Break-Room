/* Gameplay-only fixtures bypass billing; dedicated membership-ui and pricing checks use the shipped guard unchanged. */
/* Existing gameplay checks use returning-player profiles; first-visit-help.cjs
   uses clean profiles and validates first-time behaviour separately. Lowball
   keeps its existing per-test pc_help_seen setup, including the smoke first visit. */
const path=require('node:path'),fs=require('node:fs');
const purchaseChecks=new Set(['membership-ui.cjs','pricing.cjs','account-purchases.cjs','access-check.cjs','billing-checkout-ui.cjs']);
const {chromium}=require('playwright'),launch=chromium.launch.bind(chromium);
chromium.launch=async function(...args){const browser=await launch(...args),create=browser.newContext.bind(browser);
 browser.newContext=async function(...options){const context=await create(...options);if(!purchaseChecks.has(path.basename(process.argv[1]||'')))await context.route('**/account-purchases.js*',r=>r.fulfill({contentType:'text/javascript',body:'/* Billing is exercised by dedicated purchase checks. */'}));if(!purchaseChecks.has(path.basename(process.argv[1]||'')))await context.route('**/membership.js*',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(__dirname,'../membership.js'),'utf8').replace('enforce:true','enforce:false')}));await context.addInitScript(()=>{try{for(const id of ['laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','hidden-gem','stack-up','pack','inner-clock'])localStorage.setItem('break-room:help-seen:'+id,'1');}catch{}});return context;};return browser;};
