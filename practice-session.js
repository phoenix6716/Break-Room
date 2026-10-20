/* Tab-local practice helpers. Never read or write Daily/account storage. */
(root=>{'use strict';
 function deck(id=x=>x.id,random=Math.random){const seen=new Set();let recent=[];return{pick(items){if(!items.length)throw Error('Practice pool is empty');let available=items.filter(x=>!seen.has(id(x)));if(!available.length){items.forEach(x=>seen.delete(id(x)));available=items.filter(x=>!recent.slice(-Math.min(8,items.length-1)).includes(id(x)));if(!available.length)available=items;}
  const item=available[Math.min(available.length-1,Math.floor(random()*available.length))];seen.add(id(item));recent.push(id(item));recent=recent.slice(-8);return item;
 }};}
 function panel({id,label='Next challenge',options,value,onChange,summary,note='Changes apply to the next round. Session totals stay in this tab; Daily records are separate.'}){
  const box=document.createElement('section');box.className='practice-panel';box.setAttribute('aria-label','Unlimited practice settings');const top=document.createElement('div');top.className='practice-panel-top';const title=document.createElement('strong');title.textContent='UNLIMITED · FREE PRACTICE';top.append(title);
  if(options){const field=document.createElement('label');field.htmlFor=id;field.textContent=label;const select=document.createElement('select');select.id=id;for(const [key,text]of options){const option=document.createElement('option');option.value=key;option.textContent=text;select.append(option);}select.value=value;select.onchange=()=>{onChange(select.value);notice.textContent=label+': '+select.selectedOptions[0].textContent+'. Applies to the next round.';};field.append(select);top.append(field);}
  const stats=document.createElement('p');stats.className='practice-summary';stats.textContent=summary;const notice=document.createElement('p');notice.className='practice-note';notice.textContent=note;notice.setAttribute('role','status');box.append(top,stats,notice);return box;
 }
 root.BREAK_ROOM_PRACTICE=Object.freeze({deck,panel,levels:[['mixed','Mixed'],['easy','Easy'],['medium','Medium'],['hard','Hard']]});
})(typeof window==='undefined'?globalThis:window);
