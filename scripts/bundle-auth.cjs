/* Pinned official browser client, served locally rather than from a third-party CDN. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/vendor');fs.mkdirSync(dir,{recursive:true});
require('esbuild').buildSync({stdin:{contents:"export { createClient } from '@supabase/supabase-js';",resolveDir:root},bundle:true,platform:'browser',format:'iife',globalName:'BREAK_ROOM_SUPABASE',target:['es2022'],minify:true,legalComments:'inline',outfile:path.join(dir,'supabase.js'),banner:{js:'/*! @supabase/supabase-js 2.118.0 — MIT License\n'+fs.readFileSync(path.join(root,'node_modules/@supabase/supabase-js/LICENSE'),'utf8')+' */'}});
