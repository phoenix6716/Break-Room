/* Stage a canonical game shell without publishing an unfinished game. */
const fs=require('node:fs'),path=require('node:path');
function scaffold(slug,title,root=path.resolve(__dirname,'..')){
 if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug||'')||slug.length>48)throw Error('Use a lowercase game slug such as word-ladder.');
 if(typeof title!=='string'||!title.trim()||title.length>80||/[<>\x00-\x1f]/.test(title))throw Error('Provide a plain-text title of 1 to 80 characters.');
 const dir=path.join(root,'game-drafts',slug);if(fs.existsSync(dir)||fs.existsSync(path.join(root,'games',slug)))throw Error('That game or draft already exists; nothing was overwritten.');
 fs.mkdirSync(path.dirname(dir),{recursive:true});fs.cpSync(path.join(root,'games/_template'),dir,{recursive:true,errorOnExist:true,force:false});
 const file=path.join(dir,'index.html'),safe=title.trim().replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;');fs.writeFileSync(file,fs.readFileSync(file,'utf8').replaceAll('[TITLE]',safe).replace('Game Layout Template — Break Room',safe+' — Break Room'));
 fs.writeFileSync(path.join(dir,'IMPLEMENTATION.md'),`# ${title.trim()}\n\nDevelopment draft: not registered or published.\n\n- [ ] Implement the engine, real Daily/Unlimited flow, input/accessibility and completion.\n- [ ] Keep the canonical centred Stake shell, left menu, header stats/tools and Sydney reset.\n- [ ] Define v1 Arcade scoring alongside native scores; add read-only profile and cloud adapters.\n- [ ] Extend database game allowlists and private friend scoring with tested migration/compatibility.\n- [ ] Add sourced content, generated artwork and complete save/reset/mode/sharing tests.\n- [ ] Validate 320/390/768/1100/1440px and dialog/keyboard/touch behavior.\n- [ ] Once playable, move this folder to games/${slug}, register homepage/navigation/game-config metadata and remove template notices/noindex.\n- [ ] Run npm test and verify the deployed game.\n\nRead ../../design/GAME-LAYOUT.md, ../../SCORING.md, ../../ACCOUNTS.md and ../../FRIENDS.md before integration. No fake results or automatic registration.\n`);
 return dir;
}
if(require.main===module)try{console.log('Created development draft: '+scaffold(process.argv[2],process.argv[3]));}catch(error){console.error(error.message);process.exitCode=1;}
module.exports={scaffold};
