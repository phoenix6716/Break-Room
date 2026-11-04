"""Prepare explicit assignments and review evidence; does not activate a release.

The bounded selection favours familiar source concepts while retaining a
deterministic spread of the long tail. Selection hashes never influence points.
"""
import argparse,collections,functools,gzip,hashlib,json,math,pathlib,re
from wordfreq import zipf_frequency
from build_candidates import ROOT,load
from import_sources import normal

@functools.lru_cache(maxsize=500000)
def frequency(name):return zipf_frequency(name,'en')

def base_rating(r,evidence):
 ids=r['sourceIds'];name=r['name'];why='English-language familiarity'
 db=[evidence[x]['languageLinkCount'] for x in ids if x in evidence]
 if db or any(x.startswith(('dbpedia:','wd:')) for x in ids):
  links=max([r.get('sitelinks',0),*db]);points=round(97-12*math.log2(links+1)) if links else 82
  why='Named-entity language-link evidence' if links else 'Uncertain named-entity prior; no absence-as-rarity inference'
 elif any(x.startswith('hgnc:') for x in ids):
  # APP/CAT are gene symbols here, not ordinary words. They must not inherit
  # the everyday popularity of app/cat or a claim of clinical test frequency.
  points=86;why='Technical human-locus prior; symbol word frequencies excluded'
 elif any(x.startswith('gn:') for x in ids):
  z=frequency(name.split(',')[0]);lex=max(0,min(1,(z-1.3)/4.8)) if z else .12
  population=max(0,min(1,(math.log10(max(1,r.get('population',0)))-3)/5))
  points=round(96-90*(.85*lex+.15*population));why='Place-name language familiarity with a weak population prior'
 else:
  # Recompute after alias ownership is resolved. A removed homonymous alias
  # cannot lend its frequency to an unrelated concept.
  z=max(frequency(x) for x in [name,*r['aliases']] if not x.startswith('#'))
  if z:
   points=round(98-20*max(0,z-1));why='Accepted-form language familiarity'
  else:points=86;why='Uncertain language-coverage prior; never an automatic maximum'
 return max(1,min(98,points)),why

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidates',default='.artifacts/sleeper-candidates');p.add_argument('--out',default='.artifacts/sleeper-reviewed');p.add_argument('--limit',type=int,default=20000);a=p.parse_args()
 specs=json.loads((ROOT/'content/sleeper-data/question-selections.json').read_text())['questions'];out=ROOT/a.out;out.mkdir(parents=True,exist_ok=True)
 evidence={r['id']:r for r in load('dbpedia-evidence.json.gz')};words=load('english-words.json.gz');word_forms={normal(n):r for r in words for n in [r['name'],*r['aliases']]}
 old=json.loads((ROOT/'content/archive/2026-11-02-pre-large-banks/hidden-gem-questions.json').read_text())['questions']
 proposals=[];report=[]
 for spec in specs:
  data=json.loads(gzip.decompress((ROOT/a.candidates/(spec['id']+'.json.gz')).read_bytes()));answers=data['answers'];anchors={normal(n):i for i,n in enumerate(spec['familiar'])}
  # Attested plurals, inflections and regional spellings remain aliases, never
  # additional canonical concepts. Word constraints have already filtered forms.
  if spec['topic']!='WORDS' and not any(k in json.dumps(spec['selector']) for k in ['"films"','"dbpedia"','"places"','"features"','"genes"','"colours"']):
   taken={normal(n) for r in answers for n in [r['name'],*r['aliases']]}
   for r in answers:
    extra=[]
    for name in [r['name'],*r['aliases']]:
     lex=word_forms.get(normal(name))
     if lex:
      for form in [lex['name'],*lex['aliases']]:
       key=normal(form)
       if key not in taken and len(r['aliases'])+len(extra)<512:extra.append(form);taken.add(key)
    r['aliases'].extend(extra)
  rows=[]
  for r in answers:
   points,why=base_rating(r,evidence);matches=[anchors[normal(n)] for n in [r['name'],*r['aliases']] if normal(n) in anchors]
   if matches:points=[3,8,12,16][min(matches)%4];why='Explicit question-specific familiar starting answer'
   rows.append({**r,'points':points,'ratingEvidence':why})
  if len(rows)>a.limit:
   mandatory=[r for r in rows if any(x.startswith('editorial:') for x in r['sourceIds']) or any(normal(n) in anchors for n in [r['name'],*r['aliases']])]
   mandatory_ids={id(r) for r in mandatory};others=[r for r in rows if id(r) not in mandatory_ids]
   familiar_count=max(0,int(a.limit*.8)-len(mandatory));familiar=sorted(others,key=lambda r:(r['points'],-r.get('population',0),normal(r['name'])))[:familiar_count]
   used=mandatory_ids|{id(r) for r in familiar};tail=sorted((r for r in rows if id(r) not in used),key=lambda r:hashlib.sha256('|'.join(r['sourceIds']).encode()).hexdigest())[:a.limit-len(used)]
   rows=mandatory+familiar+tail
  rows.sort(key=lambda r:normal(r['name']))
  if len(rows)<300:raise ValueError(spec['id']+' has only '+str(len(rows))+' genuine concepts')
  # Propose actual uncommon entries for the separate editorial anchor review.
  rare=sorted((r for r in rows if r['points']>=75 and not any(normal(n) in anchors for n in [r['name'],*r['aliases']])),key=lambda r:(-r['points'],-len(r['name']),normal(r['name'])))
  picks=[r for r in rare if 9<=len(r['name'])<=70][:3]
  proposals.append({'id':spec['id'],'prompt':spec['prompt'],'proposedMaximums':[r['name'] for r in picks]})
  question={k:spec[k] for k in ['id','topic','prompt','scope','source']}
  # Blank scope is preferable to repeating a hidden accepted word in a hint.
  if any(len(normal(n))>=3 and (' '+normal(n)+' ') in (' '+normal(question['scope'])+' ') for r in rows for n in [r['name'],*r['aliases']]):question['scope']=''
  doc={'format':'sleeper-bank-v1','question':question,'answers':[{k:r[k] for k in ['name','points','aliases','sourceIds','ratingEvidence']} for r in rows]}
  raw=(json.dumps(doc,ensure_ascii=False,separators=(',',':'))+'\n').encode();(out/(spec['id']+'.json.gz')).write_bytes(gzip.compress(raw,mtime=0))
  samples=[rows[i]['name'] for i in sorted(set([0,len(rows)//5,len(rows)//2,len(rows)*4//5,len(rows)-1]))]
  report.append({'id':spec['id'],'prompt':spec['prompt'],'count':len(rows),'familiar':spec['familiar'],'samples':samples,'ratingLevels':len(set(r['points'] for r in rows)),'maximumProposals':[r['name'] for r in picks]})
  print(spec['id'],len(rows),'prepared',flush=True)
 (out/'review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(out/'maximum-proposals.json').write_text(json.dumps(proposals,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
