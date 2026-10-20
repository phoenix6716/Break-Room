/* Local authoring only. Never exposed by the public-site builder. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),api=require('./content-lib.cjs');
function createStudio({root=api.ROOT,draftDir=path.join(root,'content/drafts')}={}){
 const token=crypto.randomBytes(32).toString('hex');
 const server=http.createServer(async(req,res)=>{
  const origin='http://'+req.headers.host,host=req.headers.host||'';
  const send=(status,data,type='application/json')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; form-action 'none'"});res.end(type==='application/json'?JSON.stringify(data):data);};
  try{
   if(!/^(127\.0\.0\.1|localhost):\d+$/.test(host))return send(403,{error:'Use the local studio address.'});
   const url=new URL(req.url,origin),route=url.pathname;
   if(req.method==='GET'){
    if(route==='/api/catalog'){const catalog=api.load(root);return send(200,{catalog,report:api.report(catalog,root),token});}
    if(route.startsWith('/art/')){const name=route.slice(5);if(!/^[a-z0-9-]+\.png$/.test(name))return send(404,{error:'No image.'});return send(200,fs.readFileSync(path.join(root,'games/lowball/engine/icons/generated',name)),'image/png');}
    const file={'/':'index.html','/studio.js':'studio.js','/studio.css':'studio.css'}[route];if(!file)return send(404,{error:'Not found.'});return send(200,fs.readFileSync(path.join(root,'tools/content-studio',file)),file.endsWith('js')?'text/javascript':file.endsWith('css')?'text/css':'text/html');
   }
   if(req.method!=='POST')return send(405,{error:'Method not allowed.'});
   if(req.headers.origin!==origin||req.headers['x-content-token']!==token||!/^application\/json(?:;|$)/.test(req.headers['content-type']||''))return send(403,{error:'Reload the studio before saving.'});
   let body='',large=false;for await(const chunk of req){if(Buffer.byteLength(body)+chunk.length>1000000){large=true;continue;}body+=chunk;}if(large)return send(413,{error:'Draft exceeds 1 MB.'});
   const draft=JSON.parse(body),catalog=api.load(root),validation=api.validate(draft,catalog,{root});
   if(route==='/api/validate')return send(200,validation);
   if(route==='/api/draft'){
    if(!draft||draft.format!=='break-room-content-draft')return send(400,{error:'Invalid draft format.'});
    fs.mkdirSync(draftDir,{recursive:true});const id=crypto.randomUUID(),file=path.join(draftDir,id+'.json');fs.writeFileSync(file,JSON.stringify(draft,null,2)+'\n',{flag:'wx'});return send(201,{saved:'content/drafts/'+id+'.json',...validation});
   }
   return send(404,{error:'Not found.'});
  }catch(error){send(error instanceof SyntaxError?400:error.code==='ENOENT'?404:500,{error:error.code==='ENOENT'?'File not found.':error.message});}
 });return server;
}
if(require.main===module){const server=createStudio(),port=Number(process.env.CONTENT_STUDIO_PORT||9030);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Use a port from 1024 to 65535.');server.listen(port,'127.0.0.1',()=>console.log(`Content Studio: http://127.0.0.1:${port}\nDrafts stay local. Nothing is published automatically.`));}
module.exports={createStudio};
