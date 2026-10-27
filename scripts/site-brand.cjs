/* Static shared branding for the owner-selected option 05. */
const fs=require('node:fs'),path=require('node:path');
const VERSION='tile05-20261025',wordmark=fs.readFileSync(path.resolve(__dirname,'../assets/break-room-wordmark.png')),width=wordmark.readUInt32BE(16),height=wordmark.readUInt32BE(20);
function applyBrand(html,relative){
 const prefix='../'.repeat(Math.max(0,relative.replaceAll('\\','/').split('/').length-1));
 let branded=false;
 html=html.replace(/<a\b([^>]*)>[\s\S]*?<\/a>/g,(full,attributes)=>{
  const classes=attributes.match(/\bclass=(["'])(.*?)\1/);
  if(!classes||!classes[2].split(/\s+/).includes('brand'))return full;
  branded=true;
  attributes=attributes.replace(/class=(["'])(.*?)\1/,(_,quote,value)=>'class="'+value.split(/\s+/).filter(x=>x!=='br-brand').concat('br-brand').join(' ')+'"');
  if(!/\baria-label=/.test(attributes))attributes+=' aria-label="Break Room home"';
  return '<a'+attributes+'><img class="br-brand__image" src="'+prefix+'assets/break-room-wordmark.png?v='+VERSION+'" alt="Break Room" width="'+width+'" height="'+height+'" decoding="async"></a>';
 });
 if(branded){
  html=html.replace(/<link\b[^>]*href=(["'])(?:[^"']*\/)?brand\.css(?:\?[^"']*)?\1[^>]*>/g,'');
  html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="'+prefix+'brand.css?v='+VERSION+'"></head>');
 }
 // All root/nested pages share the approved icon, including JavaScript-free pages.
 html=html.replace(/<link\b[^>]*rel=(["'])(?:(?:shortcut )?icon|apple-touch-icon)\1[^>]*>/gi,'');
 html=html.replace(/<\/head>/i,'<link rel="icon" type="image/svg+xml" href="'+prefix+'assets/break-room-icon.svg?v='+VERSION+'"><link rel="apple-touch-icon" href="'+prefix+'assets/break-room-touch-icon.png?v='+VERSION+'"></head>');
 return html;
}
module.exports={applyBrand,VERSION};
