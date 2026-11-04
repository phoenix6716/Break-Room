"""Import independent reference concepts; never publish a game bank from an unreviewed source pool."""
import argparse, collections, fcntl, gzip, hashlib, importlib.metadata, json, pathlib, re, unicodedata, zipfile

def normal(s):
    s=re.sub('[\u0300-\u036f]','',unicodedata.normalize('NFKD',s)).lower().replace('&',' and ')
    return re.sub(r'\s+',' ',re.sub(r'[^a-z0-9 ]',' ',s)).strip().removeprefix('the ')

def write(path, data):
    raw=(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n').encode()
    path.parent.mkdir(parents=True,exist_ok=True)
    temporary=path.with_suffix(path.suffix+'.tmp');temporary.write_bytes(gzip.compress(raw,mtime=0));temporary.replace(path)
    return {'file':str(path),'sha256':hashlib.sha256(raw).hexdigest(),'compressedSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':len(raw),'compressedBytes':path.stat().st_size}

def update_manifest(path,entries):
    # Independent collectors must not overwrite each other's completed source metadata.
    lock=path.parent/'.sources.lock'
    with lock.open('a') as handle:
        fcntl.flock(handle,fcntl.LOCK_EX)
        data=json.loads(path.read_text()) if path.exists() else {'reviewed':'2026-11-02','status':'source candidates, not published answer banks','sources':[]}
        files={s['file'] for s in entries};data['sources']=[s for s in data['sources'] if s['file'] not in files]+entries
        temporary=path.with_suffix('.json.tmp');temporary.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');temporary.replace(path)

def main():
    p=argparse.ArgumentParser();p.add_argument('--nltk-data',required=True);p.add_argument('--geonames');p.add_argument('--country-info');p.add_argument('--admin1-names');p.add_argument('--films');p.add_argument('--film-facts',action='append',default=[]);p.add_argument('--film-seeds');p.add_argument('--gbif',action='append',default=[]);p.add_argument('--out',default='content/sleeper-data/catalogues');a=p.parse_args()
    import nltk
    from nltk.corpus import wordnet as w
    from wordfreq import zipf_frequency
    nltk.data.path.insert(0,a.nltk_data)
    out=pathlib.Path(a.out);sources=[];records=[]
    for s in w.all_synsets('n'):
        names=list(dict.fromkeys(l.name().replace('_',' ') for l in s.lemmas()))
        names=[n for n in names if normal(n) and len(n)<=240]
        if not names: continue
        records.append({'id':'wn:'+s.name(),'name':names[0],'aliases':names[1:],'parents':sorted('wn:'+x.name() for x in s.hypernyms()+s.instance_hypernyms()),'domain':s.lexname(),'definition':s.definition(),'zipf':round(max(zipf_frequency(n,'en') for n in names),3),'tagCount':sum(l.count() for l in s.lemmas())})
    meta=write(out/'wordnet.json.gz',{'source':'Princeton WordNet 3.0','license':'WordNet','records':records});meta.update({'rawSha256':hashlib.sha256((pathlib.Path(a.nltk_data)/'corpora/wordnet.zip').read_bytes()).hexdigest(),'concepts':len(records),'sourceUrl':'https://wordnet.princeton.edu/','attribution':'WordNet 3.0 Copyright 2006 Princeton University','frequencySource':'wordfreq '+importlib.metadata.version('wordfreq'),'frequencyAttribution':'Robyn Speer; see NOTICE and source-specific credits','frequencyLicense':'CC-BY-SA-4.0'});sources.append(meta)
    if a.geonames:
        country_names={r[0]:r[4] for line in pathlib.Path(a.country_info).read_text().splitlines() if line and not line.startswith('#') and len(r:=line.split('\t'))>4} if a.country_info else {}
        admin_names={r[0]:r[1] for line in pathlib.Path(a.admin1_names).read_text().splitlines() if len(r:=line.split('\t'))>1} if a.admin1_names else {}
        places=[]
        with zipfile.ZipFile(a.geonames) as z:
            for raw in z.read(next(n for n in z.namelist() if n.endswith('.txt'))).decode().splitlines():
                f=raw.split('\t')
                if len(f)<19 or f[6]!='P':continue
                names=list(dict.fromkeys([f[1],f[2],*f[3].split(',')]))
                names=[n for n in names if normal(n) and len(n)<=200]
                places.append({'id':'gn:'+f[0],'name':names[0],'aliases':names[1:],'featureCode':f[7],'country':f[8],'countryName':country_names.get(f[8],f[8]),'admin1Name':admin_names.get(f[8]+'.'+f[10],''),'admin1':f[10],'admin2':f[11],'population':int(f[14]),'latitude':float(f[4]),'longitude':float(f[5]),'modified':f[18]})
        meta=write(out/'places.json.gz',{'source':'GeoNames cities5000','license':'CC-BY-4.0','records':places});meta.update({'concepts':len(places),'sourceUrl':'https://download.geonames.org/export/dump/cities5000.zip','rawSha256':hashlib.sha256(pathlib.Path(a.geonames).read_bytes()).hexdigest(),'attribution':'GeoNames, CC BY 4.0'});sources.append(meta)
    if a.films:
        payload=json.loads(pathlib.Path(a.films).read_text());seed_ids=set()
        if a.film_seeds:
            seeds=json.loads(pathlib.Path(a.film_seeds).read_text())['results']['bindings'];payload['results']['bindings'].extend(seeds);seed_ids={r['item']['value'].rsplit('/',1)[-1] for r in seeds}
        films={};facts=collections.defaultdict(lambda:collections.defaultdict(set))
        if a.film_facts:
            for file in sorted(f for folder in a.film_facts for f in pathlib.Path(folder).glob('*.json')):
                for row in json.loads(file.read_text())['results']['bindings']:
                    facts[row['item']['value'].rsplit('/',1)[-1]][row['property']['value'].rsplit('/',1)[-1]].add(row['value']['value'])
        for row in payload['results']['bindings']:
            key=row['item']['value'].rsplit('/',1)[-1];name=row['name']['value'];f=facts[key]
            if key in films:
                if name!=films[key]['name']:films[key]['aliases'].append(name)
                continue
            dates=sorted(f['P577']);types=sorted(x.rsplit('/',1)[-1] for x in f['P31']);genres=sorted(x.rsplit('/',1)[-1] for x in f['P136'])
            films[key]={'id':'wd:'+key,'name':name,'aliases':[],'sitelinks':max([int(x) for x in f['ontology#sitelinks']]+[0]),'releaseDates':dates,'types':types,'genres':genres,'type':'film','filmClassProof':'P31/P279* Q11424' if key in seed_ids else 'P31 Q11424'}
        films=list(films.values())
        meta=write(out/'films-candidates.json.gz',{'source':'Wikidata film query','license':'CC0-1.0','status':'candidate collection; release dates and question membership not yet reviewed','records':films});meta.update({'seedLabelsSha256':hashlib.sha256(pathlib.Path(a.film_seeds).read_bytes()).hexdigest() if a.film_seeds else None,'factsSha256':hashlib.sha256(b''.join(f.name.encode()+f.read_bytes() for f in sorted(f for folder in a.film_facts for f in pathlib.Path(folder).glob('*.json')))).hexdigest() if a.film_facts else None,'properties':['P31','P577','P136','wikibase:sitelinks'],'labelQuery':'SELECT ?item ?name WHERE { ?item wdt:P31 wd:Q11424; rdfs:label ?name. FILTER(LANG(?name)="en") } LIMIT 30000','concepts':len(films),'sourceUrl':'https://query.wikidata.org/','rawSha256':hashlib.sha256(pathlib.Path(a.films).read_bytes()).hexdigest(),'attribution':'Wikidata structured data, CC0'});sources.append(meta)
    if a.gbif:
        species={};captures=[];quarantine=[]
        for folder in a.gbif:
            folder=pathlib.Path(folder);capture=json.loads((folder/'capture.json').read_text());captures.append(capture)
            if capture['license']!='http://creativecommons.org/licenses/by/4.0/legalcode':raise ValueError('Unreviewed source license')
            for file in sorted(folder.glob('[0-9]*.json')):
                for r in json.loads(file.read_text())['results']:
                    if r.get('taxonomicStatus')!='ACCEPTED' or r.get('rank')!='SPECIES' or r['datasetKey']!=capture['dataset']:raise ValueError('Nonaccepted species')
                    english=list(dict.fromkeys(v['vernacularName'] for v in r.get('vernacularNames',[]) if v.get('language') in ['eng','en'] and normal(v['vernacularName'])))
                    if not r.get('canonicalName') or not re.fullmatch(r'[A-Z][A-Za-z-]+ [a-z][a-z-]+',r.get('canonicalName','')):
                        quarantine.append({'key':r['key'],'reason':'accepted record lacks a parseable canonical name'});continue
                    # COL XR puts this protozoan genus under bats. The pinned
                    # independent GBIF-backbone check confirms Trypanosomatida;
                    # accepted status alone is not evidence that it is a mammal.
                    if r.get('genus')=='Trypanosoma' and capture['taxon']=='Mammalia':
                        quarantine.append({'key':r['key'],'reason':'inconsistent mammal placement: Trypanosoma is a protozoan genus; backbone 8938149'});continue
                    canonical=r['canonicalName'];names=list(dict.fromkeys([*english,canonical]))
                    names=[n for n in names if 0<len(n)<=240 and 0<len(normal(n))<=240]
                    if not names:continue
                    key='gbif:'+r['datasetKey']+':'+str(r['key'])
                    species[key]={'id':key,'name':names[0],'aliases':names[1:],'scientificName':canonical,'kingdom':r.get('kingdom'),'phylum':r.get('phylum'),'class':r.get('class'),'order':r.get('order'),'family':r.get('family'),'genus':r.get('genus'),'habitats':r.get('habitats',[]),'taxonID':r.get('taxonID'),'nubKey':r.get('nubKey'),'groups':[capture['taxon']],'zipf':round(max(zipf_frequency(n,'en') for n in names),3)}
        meta=write(out/'species-candidates.json.gz',{'source':'Catalogue of Life XR via GBIF','license':'CC-BY-4.0','status':'accepted taxon candidates; question membership not yet reviewed','records':list(species.values())});meta.update({'concepts':len(species),'sourceUrl':'https://www.gbif.org/dataset/7ddf754f-d193-4cc9-b351-99906754a03b','attribution':'Catalogue of Life / GBIF, CC BY 4.0','captures':captures,'quarantinedRecords':quarantine});sources.append(meta)
    update_manifest(out.parent/'sources.json',sources)
    print(json.dumps({'sources':[{'file':s['file'],'concepts':s['concepts'],'compressedBytes':s['compressedBytes']} for s in sources]},indent=2))
if __name__=='__main__':main()
