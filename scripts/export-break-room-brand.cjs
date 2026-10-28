/* Export the approved closed B cube and its lettering; no art is redrawn. */
const fs=require('node:fs'),sharp=require('sharp');
(async()=>{
 const source='assets/source/break-room-cube-b.png',{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(info.width!==1312||info.height!==1199)throw Error('Unexpected approved master dimensions');
 // The approved transparent master has one blank separator row at y=790.
 function bounds(top,bottom){let l=info.width,t=bottom,r=-1,b=-1;for(let y=top;y<bottom;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>=64){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}if(r<0)throw Error('Missing brand component');l=Math.max(0,l-2);t=Math.max(top,t-2);r=Math.min(info.width-1,r+2);b=Math.min(bottom-1,b+2);return{left:l,top:t,width:r-l+1,height:b-t+1};}
 const icon=bounds(0,790),letters=bounds(791,info.height),transparent={r:0,g:0,b:0,alpha:0},outputs={};
 const cube=await sharp(source).extract(icon).resize({height:280}).png().toBuffer(),text=await sharp(source).extract(letters).resize({height:220}).png().toBuffer();
 const c=await sharp(cube).metadata(),t=await sharp(text).metadata();
 outputs['assets/break-room-wordmark.png']=await sharp({create:{width:c.width+28+t.width+8,height:288,channels:4,background:transparent}}).composite([{input:cube,left:4,top:4},{input:text,left:c.width+32,top:34}]).resize({width:960}).png({compressionLevel:9}).toBuffer();
 outputs['assets/break-room-mark.png']=await sharp(source).extract(icon).resize(480,480,{fit:'contain',background:transparent}).extend({top:16,bottom:16,left:16,right:16,background:transparent}).png({compressionLevel:9}).toBuffer();
 outputs['assets/break-room-touch-icon.png']=await sharp(outputs['assets/break-room-mark.png']).resize(160,160).extend({top:10,bottom:10,left:10,right:10,background:'#f4eddc'}).flatten({background:'#f4eddc'}).png({compressionLevel:9}).toBuffer();
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image x="0" y="0" width="64" height="64" href="data:image/png;base64,'+outputs['assets/break-room-mark.png'].toString('base64')+'"/></svg>\n';
 for(const file of ['assets/break-room-icon.svg','assets/favicon.svg','assets/logo.svg'])outputs[file]=Buffer.from(svg);
 for(const[file,buffer]of Object.entries(outputs))fs.writeFileSync(file,buffer);
 console.log('BRAND_BOUNDS '+JSON.stringify({source:{width:info.width,height:info.height},icon,letters,files:Object.keys(outputs)}));
})().catch(e=>{console.error(e);process.exitCode=1;});
