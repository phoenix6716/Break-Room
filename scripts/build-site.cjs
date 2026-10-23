/* Build a plain static artifact; preserve routes, engines and image bytes. */
const fs=require('node:fs'),path=require('node:path');
require('./bundle-auth.cjs');
const root=path.resolve(__dirname,'..'),output=path.join(root,'dist');
const web=new Set(['.html','.css','.js','.json','.webmanifest','.svg','.png','.jpg','.jpeg','.gif','.webp','.ico','.ttf','.woff','.woff2','.mp3','.wav','.ogg']);
const excluded=new Set(['node_modules','.git','source','_template','__pycache__']);
let count=0,total=0;
function copy(file,relative){
 const target=path.join(output,relative);fs.mkdirSync(path.dirname(target),{recursive:true});if(path.extname(file).toLowerCase()==='.html'){
  const html=fs.readFileSync(file,'utf8').replace(/<nav\b[^>]*class="[^"]*\bgame-menu\b[^"]*"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/<a\b[^>]*href="[^"]*games\/(?:alibi|bouncer|prior)\/index\.html"[^>]*>[\s\S]*?<\/a>/g,'').replace(/(<a\b[^>]*href="([^"]*)games\/laser\/index\.html"[^>]*>[\s\S]*?<\/a>)/,(_,link,prefix)=>link+'<a href="'+prefix+'games/time-drop/index.html">Time Drop</a><a href="'+prefix+'games/clue-ladder/index.html">Clue Ladder</a>'));
  fs.writeFileSync(target,html);
 }else fs.copyFileSync(file,target);
 count++;total+=fs.statSync(target).size;
}
function tree(dir,relative){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(entry.name.startsWith('.')||excluded.has(entry.name))continue;
 const file=path.join(dir,entry.name),next=path.join(relative,entry.name);
 if(entry.isDirectory())tree(file,next);else if(entry.isFile()&&web.has(path.extname(entry.name).toLowerCase()))copy(file,next);
}}
fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
for(const entry of fs.readdirSync(root,{withFileTypes:true})){
 if(entry.isFile()&&['.html','.css','.js'].includes(path.extname(entry.name)))copy(path.join(root,entry.name),entry.name);
}
for(const dir of ['assets','games'])tree(path.join(root,dir),dir);
// Replace archived standalone social placeholders only in the published artifact.
const site=new URL(process.env.SITE_URL||'https://phoenix6716.github.io/Break-Room/');
if(site.protocol!=='https:')throw Error('SITE_URL must be an HTTPS public URL');
site.pathname=site.pathname.replace(/\/?$/,'/');site.search='';site.hash='';
const engine=path.join(output,'games/lowball/engine/index.html');
let html=fs.readFileSync(engine,'utf8');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const [property,relative]of [['og:url','games/lowball/index.html'],['og:image','games/lowball/engine/og-image.png'],['twitter:image','games/lowball/engine/og-image.png']]){
 const pattern=new RegExp('(<meta (?:property|name)="'+property+'" content=")[^"]*(">)');
 html=html.replace(pattern,(_,before,after)=>before+escape(new URL(relative,site).href)+after);
}
fs.writeFileSync(engine,html);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Built ${count} web files (${(total/1024/1024).toFixed(1)} MiB) in dist/; development docs, tests, templates and source atlases excluded.`);
