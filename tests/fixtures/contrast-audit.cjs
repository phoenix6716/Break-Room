/* Evaluate actual rendered text/background pairs; never changes engine state. */
module.exports=()=>{
 const parse=s=>{const a=s.match(/[\d.]+/g)?.map(Number);return a&&[a[0],a[1],a[2],a[3]??1];},over=(a,b)=>{const alpha=a[3]+b[3]*(1-a[3]);return [...a.slice(0,3).map((v,i)=>(v*a[3]+b[i]*b[3]*(1-a[3]))/(alpha||1)),alpha];},lum=a=>a.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0),failures=[];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  const text=node.textContent.trim();if(!text||!node.parentElement)continue;const e=node.parentElement;
  if(e.closest('script,style,noscript,svg,[hidden],[inert],.scene-set-dressing,[aria-hidden=true]'))continue;
  const style=getComputedStyle(e);if(style.visibility!=='visible'||!e.getClientRects().length)continue;
  const chain=[];let hidden=false;for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||Number(s.opacity)===0){hidden=true;break;}chain.push(s);}if(hidden)continue;
  let bg=[255,255,255,1];for(const s of [...chain].reverse()){const c=parse(s.backgroundColor);if(c)bg=over(c,bg);}
  let fg=parse(style.color);if(!fg)continue;fg=over(fg,bg);const a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),size=parseFloat(style.fontSize),large=size>=24||size>=18.66&&Number(style.fontWeight)>=700,disabled=!!e.closest(':disabled,[aria-disabled=true]'),minimum=disabled?3:large?3:4.5;
  if(ratio+.03<minimum)failures.push({text:text.slice(0,85),selector:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+String(e.className).trim().replace(/\s+/g,'.'),foreground:style.color,background:bg.slice(0,3).map(Math.round),ratio:Math.round(ratio*100)/100,minimum});
 }
 return [...new Map(failures.map(x=>[x.selector+'|'+x.text,x])).values()];
};
