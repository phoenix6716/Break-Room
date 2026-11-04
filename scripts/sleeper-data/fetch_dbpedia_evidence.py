"""Freeze bounded public graph evidence, never player-answer statistics.

Cross-language links are an editorial familiarity signal for named works/people.
Genre/platform/species facts may establish a question predicate; category pages
alone cannot prove it. Every response is parsed before atomic persistence.
"""
import argparse,concurrent.futures,gzip,hashlib,json,pathlib,re,time,urllib.parse,urllib.request

PROPERTIES=['computingPlatform','genre','publisher','developer','species','occupation','industry']
BASE='http://dbpedia.org/resource/'

def fetch_batch(keys,out):
    digest=hashlib.sha256('\n'.join(keys).encode()).hexdigest();file=out/(digest+'.json')
    if file.exists():
        cached=json.loads(file.read_text())
        if cached.get('entities')!=keys:raise ValueError('Evidence cache identity mismatch')
        return len(keys)
    uris=' '.join('<'+BASE+key+'>' for key in keys)
    q='SELECT ?item ?property ?value WHERE { { SELECT ?item (<urn:break-room:cross-language-links> AS ?property) (COUNT(DISTINCT ?other) AS ?value) WHERE { VALUES ?item {'+uris+'} OPTIONAL { ?item <http://www.w3.org/2002/07/owl#sameAs> ?other. FILTER(REGEX(STR(?other),"^https?://[a-z-]+[.]dbpedia[.]org/resource/")) } } GROUP BY ?item } UNION { VALUES ?item {'+uris+'} VALUES ?property {'+' '.join('<http://dbpedia.org/ontology/'+p+'>' for p in PROPERTIES)+'} ?item ?property ?value } }'
    for attempt in range(3):
        try:
            request=urllib.request.Request('https://dbpedia.org/sparql',data=urllib.parse.urlencode({'query':q,'format':'application/sparql-results+json'}).encode(),headers={'User-Agent':'BreakRoomContentResearch/1.0','Accept-Encoding':'gzip'})
            with urllib.request.urlopen(request,timeout=40) as r:
                raw=r.read();raw=gzip.decompress(raw) if r.headers.get('Content-Encoding')=='gzip' else raw
            response=json.loads(raw);rows=response['results']['bindings']
            covered={r['item']['value'].removeprefix(BASE) for r in rows if r['property']['value']=='urn:break-room:cross-language-links'}
            if covered!=set(keys):raise ValueError('Evidence response is incomplete')
            payload={'entities':keys,'query':q,'response':response};temporary=file.with_suffix('.json.tmp');temporary.write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':'))+'\n');temporary.replace(file)
            return len(keys)
        except Exception:
            if attempt==2:raise
            time.sleep(1+attempt)

def main():
    p=argparse.ArgumentParser();p.add_argument('--out',required=True);p.add_argument('--batch-size',type=int,default=150);p.add_argument('--workers',type=int,default=2);a=p.parse_args();keys=set()
    for file in pathlib.Path('content/sleeper-data/catalogues').glob('dbpedia-*.json.gz'):
        if file.name=='dbpedia-evidence.json.gz':continue
        for r in json.loads(gzip.decompress(file.read_bytes()))['records']:keys.add(r['id'].removeprefix('dbpedia:'))
    def visit(value):
        if isinstance(value,dict):
            for item in value.values():visit(item)
        elif isinstance(value,list):
            for item in value:visit(item)
        elif isinstance(value,str) and value.startswith('dbpedia:'):keys.add(value.removeprefix('dbpedia:'))
    visit(json.loads(pathlib.Path('content/sleeper-data/question-selections.json').read_text()))
    if any(not re.fullmatch(r'[^\s<>"{}|^`\\]+',key) for key in keys):raise ValueError('Invalid source IRI')
    keys=sorted(keys);out=pathlib.Path(a.out);out.mkdir(parents=True,exist_ok=True);batches=[keys[i:i+a.batch_size] for i in range(0,len(keys),a.batch_size)];done=0
    with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as executor:
        futures=[executor.submit(fetch_batch,batch,out) for batch in batches]
        for future in concurrent.futures.as_completed(futures):
            done+=future.result()
            if done%1500==0 or done==len(keys):print('Frozen evidence',done,'/',len(keys),flush=True)
if __name__=='__main__':main()
