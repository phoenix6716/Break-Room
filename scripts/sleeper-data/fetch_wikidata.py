"""Save complete, validated SPARQL JSON only; HTTP 200 alone is not success."""
import argparse,json,pathlib,time,urllib.parse,urllib.request
AGENT='BreakRoomContentResearch/1.0 (https://github.com/phoenix6716/Break-Room)'
PROPERTIES=['<http://wikiba.se/ontology#sitelinks>','wdt:P577','wdt:P31','wdt:P136']
def query(text):
    request=urllib.request.Request('https://query.wikidata.org/sparql',data=urllib.parse.urlencode({'query':text,'format':'json'}).encode(),headers={'User-Agent':AGENT,'Accept':'application/sparql-results+json'})
    with urllib.request.urlopen(request,timeout=55) as response:data=response.read()
    payload=json.loads(data)
    if not isinstance(payload.get('results',{}).get('bindings'),list):raise ValueError('Incomplete SPARQL result')
    return data

def main():
    p=argparse.ArgumentParser();p.add_argument('--query');p.add_argument('--out',required=True);p.add_argument('--facts-for');a=p.parse_args()
    out=pathlib.Path(a.out)
    if a.query:out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(query(pathlib.Path(a.query).read_text()));return
    if not a.facts_for:raise ValueError('Specify a query or a label collection')
    rows=json.loads(pathlib.Path(a.facts_for).read_text())['results']['bindings'];ids=list(dict.fromkeys(r['item']['value'].rsplit('/',1)[-1] for r in rows));out.mkdir(parents=True,exist_ok=True)
    if any(not key.startswith('Q') or not key[1:].isdigit() for key in ids):raise ValueError('Invalid entity ID')
    for start in range(0,len(ids),500):
        file=out/(str(start//500).zfill(3)+'.json')
        if file.exists():json.loads(file.read_text());continue
        text='SELECT ?item ?property ?value WHERE { VALUES ?item {'+' '.join('wd:'+key for key in ids[start:start+500])+'} VALUES ?property {'+' '.join(PROPERTIES)+'} ?item ?property ?value }'
        file.write_bytes(query(text));print(file.name,flush=True);time.sleep(.2)
if __name__=='__main__':main()
