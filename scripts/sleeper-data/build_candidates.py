"""Build traceable candidates. Unreviewed pools never replace the active bank.

Alias strings are merged before counting. Passing a count alone cannot pass publication.
"""
import argparse, collections, gzip, hashlib, json, pathlib, re, sys
from import_sources import normal

ROOT=pathlib.Path(__file__).resolve().parents[2]

def load(name):
    return json.loads(gzip.decompress((ROOT/'content/sleeper-data/catalogues'/name).read_bytes()))['records']

def descendants(records, roots):
    children=collections.defaultdict(list);uris={r['uri']:r['id'] for r in records if r.get('uri')}
    for r in records:
        for p in r.get('parents',r.get('parentUris',[])):children[uris.get(p,p)].append(r['id'])
    identifiers={r['id'] for r in records};root_ids=[x if x in identifiers else 'wn:'+x for x in roots]
    selected=set();todo=list(root_ids)
    while todo:
        key=todo.pop()
        if key in selected:continue
        selected.add(key);todo.extend(children[key])
    return [r for r in records if r['id'] in selected and r['id'] not in set(root_ids)]

def merge(records,preferred=()):
    """Collapse synonym-connected concepts; an alias can never inflate the count."""
    parents=list(range(len(records)));owners={}
    def find(i):
        while parents[i]!=i:parents[i]=parents[parents[i]];i=parents[i]
        return i
    taxon_sets=[{x for x in r.get('sourceIds',[r['id']]) if x.startswith('gbif:')} for r in records]
    taxon_names=[{normal(x) for x in [*r.get('scientificNames',[]),r.get('scientificName','')] if x} for r in records]
    all_names=[{normal(x) for x in [r['name'],*r.get('aliases',[])]} for r in records] if any(taxon_sets) else None
    def union(i,j):
        i,j=find(i),find(j)
        if i==j:return
        if all_names is not None:
            if taxon_sets[i] and taxon_sets[j] and taxon_sets[i]!=taxon_sets[j] and not taxon_names[i]&taxon_names[j]:return
            if bool(taxon_sets[i])!=bool(taxon_sets[j]):
                taxon,other=(i,j) if taxon_sets[i] else (j,i)
                if not taxon_names[taxon]&all_names[other]:return
            taxon_sets[i].update(taxon_sets[j]);taxon_names[i].update(taxon_names[j]);all_names[i].update(all_names[j])
        parents[j]=i
    # A shared ambiguous alias is not proof that two source entities are synonyms.
    # Join a canonical label to another attested canonical/alias, then assign any
    # remaining ambiguous alias to one owner without merging distinct identities.
    canonical=collections.defaultdict(list)
    for i,r in enumerate(records):canonical[normal(r['name'])].append(i)
    for i,r in enumerate(records):
        for n in [r['name'],*r.get('aliases',[])]:
            for j in canonical.get(normal(n),[]):union(i,j)
    if all_names is not None:
        scientific_owners=collections.defaultdict(list)
        for i,names in enumerate(taxon_names):
            for name in names:scientific_owners[name].append(i)
        for i,names in enumerate(all_names):
            for name in list(names):
                for j in scientific_owners.get(name,[]):union(i,j)
    groups=collections.defaultdict(list)
    for i,r in enumerate(records):groups[find(i)].append(r)
    preferred={normal(n):n for n in preferred};answers=[];anchor_groups=collections.defaultdict(set)
    for group_id,group in groups.items():
        for r in group:
            for name in [r['name'],*r.get('aliases',[])]:
                key=normal(name)
                if key in preferred:anchor_groups[key].add(group_id)
    for group in groups.values():
        names=list(dict.fromkeys(n for r in group for n in [r['name'],*r.get('aliases',[])] if 0<len(n)<=240 and 0<len(normal(n))<=240))
        unique={}
        for n in names:unique.setdefault(normal(n),n)
        if not unique:continue
        anchors=[n for n in unique if n in preferred and len(anchor_groups[n])==1]
        # Preserve source canonical labels, favouring corpus-covered concepts.
        best=max(group,key=lambda r:(r.get('zipf',r.get('frequency',0)),r.get('sitelinks',0),r.get('population',0),-len(r['name'])))
        name=preferred[anchors[0]] if anchors else best['name']
        aliases=[n for key,n in unique.items() if key!=normal(name)]
        answers.append({'name':name,'aliases':aliases,'sourceIds':sorted(set(x for r in group for x in r.get('sourceIds',[r['id']]))),'frequency':max((r.get('zipf',r.get('frequency',0)) for r in group),default=0),'sitelinks':max((r.get('sitelinks',0) for r in group),default=0),'population':max((r.get('population',0) for r in group),default=0),'scientificNames':sorted({x for r in group for x in [*r.get('scientificNames',[]),r.get('scientificName','')] if x})})
    by_name=collections.defaultdict(list)
    for r in answers:by_name[normal(r['name'])].append(r)
    for duplicates in by_name.values():
        if len(duplicates)<2:continue
        duplicates.sort(key=lambda r:(bool(r['scientificNames']),-r['frequency'],r['sourceIds'][0]))
        for r in duplicates[1:]:
            if not r['scientificNames']:raise ValueError('Unresolved canonical identity: '+r['name'])
            r['aliases'].append(r['name']);r['name']=r['name']+' ('+r['scientificNames'][0]+')'
            if len(r['name'])>240:r['name']=r['scientificNames'][0]
    taken={normal(r['name']) for r in answers}
    # Prefer the most familiar source concept for an otherwise ambiguous input.
    for r in sorted(answers,key=lambda r:(-r['frequency'],-r['sitelinks'],-r['population'],normal(r['name']))):
        aliases=[]
        for name in r['aliases']:
            key=normal(name)
            if key not in taken:aliases.append(name);taken.add(key)
        r['aliases']=aliases
    return sorted(answers,key=lambda r:normal(r['name']))

def qualify_places(records):
    # Different locations with the same name remain different playable answers.
    # Unqualified names still work and go to the largest matching settlement.
    groups=collections.defaultdict(list)
    for r in records:groups[normal(r['name'])].append(r)
    result=[]
    for values in groups.values():
        for r in sorted(values,key=lambda r:-r.get('population',0)):
            if len(values)==1:result.append(r);continue
            regions=list(dict.fromkeys(x for x in [r.get('admin1Name'),r.get('countryName',r.get('country',''))] if x))
            name=r['name']+', '+', '.join(regions)
            if len(name)>240:continue
            aliases=[r['name'],*r.get('aliases',[])]
            aliases.extend(r['name']+' '+region for region in regions)
            result.append({**r,'name':name,'aliases':list(dict.fromkeys(aliases))})
    return result

def select(spec,pools):
    s=spec['selector'];kind=s['kind']
    if kind=='onet':
        records=pools['onet-'+s['collection']]
        if s.get('contexts'):
            eligible={r['soc'] for r in pools['onet-occupations'] if all(r['contexts'].get(k,{}).get('value',0)>=v for k,v in s['contexts'].items())}
            records=[r for r in records if set(r.get('socCodes',[r.get('soc','')]))&eligible]
        if s.get('socPrefixes'):records=[r for r in records if any(code.startswith(tuple(s['socPrefixes'])) for code in r.get('socCodes',[r.get('soc','')]))]
    elif kind=='words':
        records=pools['words']
    elif kind in ['ncit','anatomy']:
        records=descendants(pools[kind],s['roots']) if s.get('roots') else pools[kind]
    elif kind=='pairs':
        records=pools['pairs']
    elif kind in ['wikidata','dbpedia']:
        records=pools[kind+'-'+s['collection']]
    elif kind in ['genes','music-making']:
        records=pools[kind]
    elif kind=='colours':
        records=pools['colours']
    elif kind=='features':
        records=[r for r in pools['features'] if (not s.get('groups') or r['group'] in s['groups']) and (not s.get('featureCodes') or r['featureCode'] in s['featureCodes']) and (not s.get('countries') or r['country'] in s['countries'])]
    elif kind=='union':
        records=[r for child in s['sources'] for r in select({**spec,'selector':child},pools)]
        records=[{**r,'id':r['sourceIds'][0]} for r in records]
    elif kind=='curated':
        records=[{**r,'id':r['sourceIds'][0]} for r in s['answers']]
    elif kind=='editorial':
        q=pools['legacy'][s['question']-1]
        records=[{'id':'editorial:revision15:'+q['id']+':'+normal(r['name']),'name':r['name'],'aliases':r['aliases'],'editorialPoints':r['points']} for r in q['answers'] if not s.get('names') or r['name'] in s['names']]
    elif kind=='exercises':
        records=pools['exercises']
    elif kind=='traits':
        records=pools['traits']
        if s.get('animalFood'):records=[r for r in records if r['animalDietPercent']>0 and r['dietCertainty'] in ['A','B','ABC']]
        if s.get('plantFood'):records=[r for r in records if r['plantDietPercent']>0 and r['dietCertainty'] in ['A','B','ABC']]
        if s.get('omnivore'):records=[r for r in records if r['animalDietPercent']>=5 and r['plantDietPercent']>=5 and r['dietCertainty'] in ['A','B','ABC']]
        if s.get('nocturnal'):records=[r for r in records if r['nocturnal'] and (r['group']=='bird' or r['activityCertainty'] in ['A','B','ABC'])]
        if s.get('treeForaging'):records=[r for r in records if r['treeForagingPercent']>=10]
        if s.get('waterForaging'):records=[r for r in records if r['waterForagingPercent']>=10]
    elif kind=='species':
        records=[r for r in pools['species'] if not s.get('groups') or set(r['groups'])&set(s['groups'])]
    elif kind=='usda':
        records=[r for r in pools['usda'] if (not s.get('categories') or r['category'] in s['categories']) and r['category'] not in s.get('excludeCategories',[]) and (not s.get('ingredientsPattern') or re.search(s['ingredientsPattern'],r['ingredients'],re.I))]
    elif kind=='wordnet':
        records=descendants(pools['wordnet'],s['roots'])
        if s.get('excludeRoots'):
            excluded={r['id'] for r in descendants(pools['wordnet'],s['excludeRoots'])}|{'wn:'+x for x in s['excludeRoots']}
            records=[r for r in records if r['id'] not in excluded]
    elif kind=='places':
        records=[r for r in pools['places'] if r['population']>=s.get('minimumPopulation',5000) and (not s.get('featureCodes') or r.get('featureCode') in s['featureCodes']) and (not s.get('countries') or r['country'] in s['countries'])]
        records=qualify_places(records)
    elif kind=='films':
        # A source label alone is insufficient: require a released film and its type fact.
        records=[r for r in pools['films'] if ('Q11424' in r['types'] or r.get('filmClassProof')=='P31/P279* Q11424') and any(d[:10]<=s['reviewDate'] for d in r['releaseDates']) and (not s.get('genres') or set(r['genres'])&set(s['genres']) or r['id'] in s.get('includeIds',[]))]
    else:raise ValueError('Unknown selector '+kind)
    if s.get('predicate'):
        predicate=s['predicate'];evidence=pools.get('dbpedia-evidence',{})
        records=[r for r in records if any(re.search(predicate['pattern'],v['value'],re.I) for v in evidence.get(r['id'],{}).get('facts',{}).get(predicate['property'],[]))]
    if s.get('types') and kind=='films':records=[r for r in records if set(r['types'])&set(s['types'])]
    if s.get('includeIds'):
        ids=set(s['includeIds']);records=records+[r for key in ['wordnet','films'] for r in pools.get(key,[]) if r['id'] in ids]
    if s.get('commonNamesOnly'):
        genera={r['name'] for r in descendants(pools['wordnet'],['genus.n.02']) if r['name'][:1].isupper() and ' ' not in r['name']}
        filtered=[]
        for r in records:
            names=[n for n in [r['name'],*r.get('aliases',[])] if not (len(n.split())>=2 and n.split()[0] in genera)]
            if names:filtered.append({**r,'name':names[0],'aliases':names[1:]})
        records=filtered
    if s.get('namePattern'):records=[r for r in records if any(re.search(s['namePattern'],normal(n)) for n in [r['name'],*r.get('aliases',[])])]
    if s.get('formsPattern') or s.get('syllables') or s.get('rhymeTail') or s.get('doubleLetter'):
        def eligible(name,r):
            n=normal(name)
            if s.get('formsPattern') and not re.search(s['formsPattern'],n):return False
            if s.get('doubleLetter') and not re.search(r'([a-z])\1',n):return False
            if s.get('syllables') and not any(sum(bool(re.search('[012]$',p)) for p in seq)==s['syllables'] for seq in r.get('phonemesByForm',{}).get(n,[])):return False
            if s.get('rhymeTail'):
                def tail(seq):
                    indices=[i for i,p in enumerate(seq) if re.search('[12]$',p)]
                    return [re.sub('[012]$','',p) for p in seq[indices[-1]:]] if indices else []
                if n in s.get('excludeForms',[]) or not any(tail(seq)==s['rhymeTail'] for seq in r.get('phonemesByForm',{}).get(n,[])):return False
            return True
        filtered=[]
        for r in records:
            names=list(dict.fromkeys(n for n in [r['name'],*r.get('aliases',[])] if eligible(n,r)))
            if names:filtered.append({**r,'name':names[0],'aliases':names[1:]})
        records=filtered
    if s.get('excludeNamePattern'):records=[r for r in records if not re.search(s['excludeNamePattern'],normal(r['name']))]
    return merge(records,spec['familiar'])

def main():
    p=argparse.ArgumentParser();p.add_argument('--out',default='.artifacts/sleeper-candidates');p.add_argument('--publish',action='store_true');a=p.parse_args()
    source=json.loads((ROOT/'content/sleeper-data/question-selections.json').read_text());out=ROOT/a.out;out.mkdir(parents=True,exist_ok=True)
    pools={'wordnet':load('wordnet.json.gz'),'places':load('places.json.gz'),'films':load('films-candidates.json.gz')}
    pools['legacy']=json.loads((ROOT/'content/archive/2026-11-02-pre-large-banks/hidden-gem-questions.json').read_text())['questions']
    if any('species' in json.dumps(q['selector']) for q in source['questions']):pools['species']=load('species-candidates.json.gz')
    if any('usda' in json.dumps(q['selector']) for q in source['questions']):pools['usda']=load('usda-candidates.json.gz')
    for collection in ['occupations','job-titles','activities','software']:
        if any('onet' in json.dumps(q['selector']) for q in source['questions']):pools['onet-'+collection]=load('onet-'+collection+'.json.gz')
    if any('words' in json.dumps(q['selector']) for q in source['questions']):pools['words']=load('english-words.json.gz')
    selectors=json.dumps([q['selector'] for q in source['questions']])
    for kind,file in [('genes','human-genes.json.gz'),('music-making','music-making.json.gz'),('ncit','ncit.json.gz'),('anatomy','fma-anatomy.json.gz'),('pairs','fma-pairs.json.gz'),('features','geonames-features.json.gz'),('traits','animal-traits.json.gz'),('exercises','exercises.json.gz'),('colours','colours.json.gz')]:
        if kind in selectors:pools[kind]=load(file)
    for q in source['questions']:
        def visit(s):
            if s['kind'] in ['wikidata','dbpedia']:
                name=s['kind']+'-'+s['collection']
                if name not in pools:pools[name]=load(name+'.json.gz')
            for child in s.get('sources',[]):visit(child)
        visit(q['selector'])
    if '"predicate"' in selectors:
        file=ROOT/'content/sleeper-data/catalogues/dbpedia-evidence.json.gz'
        pools['dbpedia-evidence']={r['id']:r for r in load('dbpedia-evidence.json.gz')} if file.exists() else {}
    report=[];issues=[]
    for spec in source['questions']:
        answers=select(spec,pools);forms={normal(n) for r in answers for n in [r['name'],*r['aliases']]}
        missing=[n for n in spec['familiar'] if normal(n) not in forms];errors=[]
        if len(answers)>250000:errors.append('candidate pool exceeds the immutable runtime maximum; curate a bounded release selection')
        if len(answers)<300:errors.append('fewer than 300 canonical answers')
        if missing:errors.append('missing familiar starting answers: '+', '.join(missing))
        if any(len(r['aliases'])>512 for r in answers):errors.append('alias groups exceed runtime limit')
        if spec['membershipReview']!='complete':errors.append('membership review incomplete')
        if spec['ratingReview']!='complete':errors.append('contextual rating review incomplete')
        if spec.get('spacingReview')!='complete':errors.append('rotation overlap review incomplete')
        print(spec['id'],len(answers),'canonical candidates; missing probes: '+', '.join(missing),flush=True)
        raw=(json.dumps({'question':spec,'status':'candidates, not accepted answers','answers':answers},ensure_ascii=False,separators=(',',':'))+'\n').encode()
        (out/(spec['id']+'.json.gz')).write_bytes(gzip.compress(raw,mtime=0))
        report.append({'id':spec['id'],'prompt':spec['prompt'],'canonicalCandidates':len(answers),'aliases':sum(len(r['aliases']) for r in answers),'sourceConcepts':sum(len(r['sourceIds']) for r in answers),'sha256':hashlib.sha256(raw).hexdigest(),'missingFamiliar':missing,'publicationErrors':errors})
        issues.extend(spec['id']+': '+e for e in errors)
    if len(report)!=240:issues.append('complete replacement requires 240 reviewed questions; selected '+str(len(report)))
    summary={'status':'not publishable' if issues else 'ready','activeBankChanged':False,'selectedQuestions':len(report),'canonicalCandidateRange':[min(r['canonicalCandidates'] for r in report),max(r['canonicalCandidates'] for r in report)],'questions':report,'publicationErrors':issues}
    (out/'report.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items() if k not in ['questions','publicationErrors']},indent=2))
    if a.publish:
        if issues:sys.exit('Publication blocked: '+str(len(issues))+' unresolved content gates. See '+str(out/'report.json'))
        sys.exit('Publication requires the reviewed explicit points/export stage; no active files were changed.')
if __name__=='__main__':main()
