/* Full source notices travel with downloaded offline banks. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function attributionHistory(){
 const file=path.join(root,'content/sleeper-data/attribution-history.json'),history=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{version:1,sources:[],notices:[]},manifest=JSON.parse(fs.readFileSync(path.join(root,'content/sleeper-data/sources.json'),'utf8')),dir=path.join(root,'content/sleeper-data/licenses');
 const sources=new Map(history.sources.map(s=>[s.file+':'+s.compressedSha256,s]));for(const s of manifest.sources)sources.set(s.file+':'+s.compressedSha256,s);
 const notices=new Map(history.notices.map(n=>[n.file+':'+n.text,n]));for(const file of fs.readdirSync(dir).sort()){const n={file,text:fs.readFileSync(path.join(dir,file),'utf8')};notices.set(n.file+':'+n.text,n);}
 return{version:1,sources:[...sources.values()],notices:[...notices.values()]};
}
function buildNotice(){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'content/sleeper-data/sources.json'),'utf8'));
 const history=attributionHistory();
 const sources=history.sources.map(s=>'<li><a href="'+escape(s.sourceUrl)+'">'+escape(s.attribution)+'</a><br>Snapshot: '+escape(s.sourceRelease||s.sourceDump||s.reviewed||manifest.reviewed)+'. Licence: '+escape(s.license||'See notice below')+'.<br>Source archive: <code>'+escape(s.file)+'</code>; SHA-256: <code>'+escape(s.compressedSha256)+'</code>.</li>').join('\n');
 const notices=history.notices.map(n=>'<details><summary>'+escape(n.file)+'</summary><pre>'+escape(n.text)+'</pre></details>').join('\n');
 return '<!doctype html>\n<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sleeper answer data credits</title><style>body{max-width:70rem;margin:2rem auto;padding:0 1rem;font:16px/1.5 system-ui}pre{white-space:pre-wrap;overflow-wrap:anywhere}li{margin:1rem 0}code{overflow-wrap:anywhere}summary{cursor:pointer}</style><h1>Sleeper answer data credits</h1><p>Answer membership, aliases and ratings are curated adaptations of the sources below. Ratings are editorial and corpus-assisted estimates, not measured player-answer popularity. Wordfreq-derived familiarity data and Wiktionary-derived lexical data are distributed under CC BY-SA 4.0. Other source licences are retained below.</p><p>Reviewed source documents, transformation scripts and snapshot history: <a href="https://github.com/phoenix6716/Break-Room/tree/main/content/sleeper-data">Break Room source repository</a>. <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>; <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>; <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>.</p><ul>'+sources+'</ul><h2>Included notices</h2>'+notices+'</html>\n';
}
module.exports={buildNotice,attributionHistory};
if(require.main===module)process.stdout.write(buildNotice());
