const fs=require('node:fs'),path=require('node:path'),api=require('./content-lib.cjs');
try{
 const [command='check',file]=process.argv.slice(2),catalog=api.load();
 if(command==='check'||command==='report'){
  const result=api.report(catalog);const prior=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/prior-events.json'),'utf8'));result.additionalBanks={prior:prior.events.length,laser:160};result.warnings.push('Prior: '+prior.events.length+' scoped historical events use a dedicated JSON bank. Reference articles were not retrieved during implementation; independent source verification and human difficulty review remain required before launch.');if(file){const draft=JSON.parse(fs.readFileSync(file,'utf8')),checked=api.validate(draft,catalog,{reviewed:process.argv.includes('--reviewed')});result.errors.push(...checked.errors);result.warnings.push(...checked.warnings);}
  console.log(JSON.stringify(result,null,2));if(command==='report'){fs.mkdirSync('.artifacts',{recursive:true});fs.writeFileSync('.artifacts/content-report.json',JSON.stringify(result,null,2)+'\n');fs.writeFileSync('.artifacts/content-report.md','# Content review report\n\n'+Object.entries(result.counts).map(([g,n])=>`- ${g}: ${n} records`).join('\n')+'\n\n## Review gaps\n\n'+result.warnings.map(s=>'- '+s).join('\n')+'\n');}if(result.errors.length)process.exitCode=1;
 }else if(command==='export'){
  if(!file)throw Error('Use content:export -- path/to/draft.json');const draft=JSON.parse(fs.readFileSync(file,'utf8')),checked=api.validate(draft,catalog,{reviewed:true});if(checked.errors.length)throw Error(checked.errors.join('\n'));
  const target=path.resolve('.artifacts','content-review-'+draft.id+'.json');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify({...draft,notice:'Reviewed proposal, not published. Preserve frozen banks, existing snapshots and Lowball date-seeded compatibility when integrating.',validation:checked},null,2)+'\n');console.log('Review bundle: '+target);
 }else throw Error('Use check, report or export.');
}catch(error){console.error(error.message);process.exitCode=1;}
