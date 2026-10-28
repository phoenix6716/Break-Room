/* Existing gameplay checks use returning-player profiles; first-visit-help.cjs
   uses clean profiles and validates first-time behaviour separately. Lowball
   keeps its existing per-test pc_help_seen setup, including the smoke first visit. */
const {chromium}=require('playwright'),launch=chromium.launch.bind(chromium);
chromium.launch=async function(...args){const browser=await launch(...args),create=browser.newContext.bind(browser);
 browser.newContext=async function(...options){const context=await create(...options);await context.addInitScript(()=>{try{for(const id of ['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','inner-clock'])localStorage.setItem('break-room:help-seen:'+id,'1');}catch{}});return context;};return browser;};
