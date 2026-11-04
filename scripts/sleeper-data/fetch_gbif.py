"""Bounded, resumable species-source collection, never a published answer bank.

A higher-rank or fuzzy taxonomy match is rejected. Synonyms are not distinct species.
"""
import argparse, concurrent.futures, hashlib, http.client, json, pathlib, time, urllib.parse, urllib.request
DATASET='7ddf754f-d193-4cc9-b351-99906754a03b'
AGENT='BreakRoomContentResearch/1.0 (https://github.com/phoenix6716/Break-Room)'

def fetch(path,params=None):
    url='https://api.gbif.org/v1/'+path+('?' +urllib.parse.urlencode(params) if params else '')
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':AGENT}),timeout=40) as r:return json.load(r)
        except (OSError,ValueError,http.client.HTTPException) as error:
            if attempt==2:raise
            time.sleep(1+attempt)

def root(name,rank):
    payload=fetch('species/search',{'datasetKey':DATASET,'q':name,'rank':rank,'status':'ACCEPTED','limit':100})
    matches=[r for r in payload['results'] if r.get('canonicalName')==name and r.get('rank')==rank and r.get('taxonomicStatus')=='ACCEPTED']
    if len(matches)!=1:raise ValueError('No unique accepted '+rank+' root for '+name)
    return matches[0]

def main():
    p=argparse.ArgumentParser();p.add_argument('--name',required=True);p.add_argument('--rank',default='CLASS');p.add_argument('--limit',type=int,default=20000);p.add_argument('--start',type=int,default=0);p.add_argument('--page-size',type=int,default=300);p.add_argument('--workers',type=int,default=1);p.add_argument('--out',required=True);a=p.parse_args()
    if not 300<=a.limit<=30000:raise ValueError('Bounded source probe requires 300–30000 species')
    if not 0<=a.start<a.limit or not 1<=a.page_size<=300:raise ValueError('Invalid source page bounds')
    out=pathlib.Path(a.out);out.mkdir(parents=True,exist_ok=True);r=root(a.name,a.rank);(out/'root.json').write_text(json.dumps(r,ensure_ascii=False)+'\n')
    if not 1<=a.workers<=4:raise ValueError('Use at most four public-source workers')
    def page(offset):
        file=out/(str(offset).zfill(6)+'.json')
        if file.exists():data=json.loads(file.read_text())
        else:
            data=fetch('species/search',{'datasetKey':DATASET,'higherTaxonKey':r['key'],'rank':'SPECIES','status':'ACCEPTED','offset':offset,'limit':min(a.page_size,a.limit-offset)})
            file.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n');time.sleep(.15)
        if any(x.get('taxonomicStatus')!='ACCEPTED' or x.get('rank')!='SPECIES' or x.get('datasetKey')!=DATASET for x in data['results']):raise ValueError('Invalid or synonym record in accepted species source')
        return offset,data
    with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as executor:
        for offset,data in executor.map(page,range(a.start,a.limit,a.page_size)):
            print(a.name,offset,len(data['results']),flush=True)
            if data['endOfRecords']:break
    covered=0
    for file in sorted(out.glob('[0-9]*.json')):
        page=json.loads(file.read_text())
        if page['offset']>covered:raise ValueError('Source collection has missing pages')
        covered=max(covered,page['offset']+len(page['results']))
    if covered<min(a.limit,data['count']):raise ValueError('Source collection incomplete')
    metadata=fetch('dataset/'+DATASET);(out/'dataset.json').write_text(json.dumps(metadata,ensure_ascii=False)+'\n')
    digest=hashlib.sha256()
    for f in sorted(f for f in out.glob('*.json') if f.name!='capture.json'):digest.update(f.name.encode());digest.update(f.read_bytes())
    (out/'capture.json').write_text(json.dumps({'source':'GBIF species API, Catalogue of Life XR','dataset':DATASET,'taxon':a.name,'taxonKey':r['key'],'rank':a.rank,'limit':a.limit,'rawFilesSha256':digest.hexdigest(),'license':metadata.get('license'),'sourcePublicationDate':metadata.get('pubDate'),'retrieved':'2026-11-02'},indent=2)+'\n')
if __name__=='__main__':main()
