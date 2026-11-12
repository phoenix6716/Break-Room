/* Shared plans shortcut beside the appearance toggle. No account or save writes. */
(()=>{
 'use strict';
 const plans=new URL('pricing.html',document.currentScript.src).href;
 function mount(){for(const header of document.querySelectorAll('header')){const toggle=header.querySelector('.br-theme-toggle');if(!toggle)continue;let link=header.querySelector('.br-subscribe');if(!link){link=document.createElement('a');link.className='br-subscribe';link.href=plans;link.textContent='Subscribe';}if(toggle.nextElementSibling!==link)toggle.after(link);}}
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
})();
