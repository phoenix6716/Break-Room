/* Build-time public URLs. Never derive canonical/share URLs from account callbacks. */
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const PUBLIC_PAGES=new Map([
 ['index.html',['Break Room — Daily games','Ten daily puzzle and trivia games. Take a little break with a fresh challenge every day.']],
 ['pricing.html',['Plans · Break Room','Daily games, monthly membership and individual game plans for Break Room.']],
 ['privacy.html',['Privacy · Break Room','How Break Room handles browser saves, accounts, cloud progress and private score sharing.']],
 ['terms.html',['Terms of play · Break Room','Rules, accounts, scores and service terms for Break Room.']],
 ['contact.html',['Contact & data help · Break Room','Get help with Break Room games, accounts, saves and data requests.']]
]);
function siteURL(value){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('SITE_URL must be a clean HTTPS URL without credentials, query or fragment');
 url.pathname=url.pathname.replace(/\/?$/,'/');return url;
}
function publicPages(games){
 const pages=new Map(PUBLIC_PAGES);
 for(const game of games.filter(g=>g.status==='live'))pages.set('games/'+game.id+'/index.html',[game.title+' — Break Room',game.description]);
 return pages;
}
function metadata(html,relative,site,pages){
 // Replaces stale standalone-engine previews as well as repeated build output.
 html=html.replace(/<meta\b(?=[^>]*(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'])[^>]*>/gi,'').replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/gi,'');
 const info=pages.get(relative),engine=relative==='games/lowball/engine/index.html';
 const parent=engine?'games/lowball/index.html':relative;
 const url=new URL(parent==='index.html'?'./':parent,site).href;
 const tags=['<meta name="robots" content="'+(info?'index,follow':'noindex,follow')+'">'];
 if(info||engine)tags.push('<link rel="canonical" href="'+escape(url)+'">');
 if(info){
  const [title,description]=info;
  const match=relative.match(/^games\/([^/]+)\/index\.html$/);
  const image=new URL(match?'assets/cards/'+match[1]+'-pixel.webp':'assets/break-room-wordmark.png',site).href;
  for(const [name,content]of [['description',description],['og:type','website'],['og:site_name','Break Room'],['og:locale','en_AU'],['og:title',title],['og:description',description],['og:url',url],['og:image',image],['og:image:alt',match?title+' game artwork':'Break Room'],['twitter:card',match?'summary_large_image':'summary'],['twitter:title',title],['twitter:description',description],['twitter:image',image]])tags.push('<meta '+(name.startsWith('og:')?'property':'name')+'="'+name+'" content="'+escape(content)+'">');
 }else if(engine){
  // The iframe is not a search landing page, but old share controls read these.
  tags.push('<meta property="og:url" content="'+escape(url)+'">','<meta property="og:image" content="'+escape(new URL('games/lowball/engine/og-image.png',site).href)+'">','<meta name="twitter:image" content="'+escape(new URL('games/lowball/engine/og-image.png',site).href)+'">');
 }
 if(relative==='404.html'){
  html=html.replace(/<base\b[^>]*>/gi,'');
  // GitHub serves this file at the missing URL, including arbitrarily deep paths.
  html=html.replace(/<head>/i,'<head><base href="'+escape(site.href)+'">');
 }
 return html.replace(/<\/head>/i,tags.join('')+'</head>');
}
function sitemap(site,pages){return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...pages.keys()].map(p=>'  <url><loc>'+escape(new URL(p==='index.html'?'./':p,site).href)+'</loc></url>').join('\n')+'\n</urlset>\n';}
module.exports={siteURL,publicPages,metadata,sitemap};
