"""Import public-domain gene nomenclature and core musical instrument names.

MusicBrainz tags, annotations, descriptions and search scores are deliberately
excluded: they are neither core name data nor estimates of answer familiarity.
"""
import argparse,csv,hashlib,json,pathlib
from import_sources import normal,write,update_manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('--hgnc');p.add_argument('--musicbrainz',nargs='*');a=p.parse_args();out=pathlib.Path('content/sleeper-data/catalogues');entries=[]
 if a.hgnc:
  raw=pathlib.Path(a.hgnc).read_bytes();records=[]
  for r in csv.DictReader(raw.decode('utf-8-sig').splitlines(),delimiter='\t'):
   if r['status']!='Approved' or r['locus_group']!='protein-coding gene':continue
   name=r['symbol']+' gene';aliases=[r['symbol'],r['name'],r['name']+' gene',*r['alias_symbol'].split('|'),*r['alias_name'].split('|'),*r['prev_symbol'].split('|'),*r['prev_name'].split('|')]
   aliases=list(dict.fromkeys(x for x in aliases if x and normal(x)!=normal(name) and len(x)<=240 and normal(x)))
   records.append({'id':'hgnc:'+r['hgnc_id'].split(':')[-1],'name':name,'aliases':aliases,'approvedName':r['name'],'symbol':r['symbol'],'location':r['location'],'modified':r['date_modified']})
  meta=write(out/'human-genes.json.gz',{'source':'HGNC approved human protein-coding genes','license':'CC0-1.0','records':records})
  meta.update({'concepts':len(records),'sourceUrl':'https://www.genenames.org/','rawSha256':hashlib.sha256(raw).hexdigest(),'attribution':'HGNC, HUGO Gene Nomenclature Committee, RRID:SCR_002827, CC0. Approved human protein-coding loci, names and former symbols; no nonhuman homologues.','licenseUrl':'https://www.genenames.org/about/license/','reviewed':'2026-11-02','limitation':'DNA features that can be tested by sequencing, not a claim that every gene has a dedicated approved clinical test.'});entries.append(meta)
 if a.musicbrainz:
  records={};digest=hashlib.sha256()
  for file in sorted(a.musicbrainz):
   raw=pathlib.Path(file).read_bytes();digest.update(raw);data=json.loads(raw)
   for r in data['instruments']:
    aliases=[x['name'] for x in r.get('aliases',[]) if x.get('name') and len(x['name'])<=240]
    records[r['id']]={'id':'musicbrainz:'+r['id'],'name':r['name'],'aliases':aliases,'type':r.get('type','')}
  meta=write(out/'music-making.json.gz',{'source':'MusicBrainz core instrument-name search capture','license':'CC0-1.0','records':list(records.values())})
  meta.update({'concepts':len(records),'sourceUrl':'https://musicbrainz.org/','rawSha256':digest.hexdigest(),'attribution':'MusicBrainz / MetaBrainz Foundation and contributors, core names and identifiers under CC0. Supplementary tags, annotations, descriptions and search scores excluded.','licenseUrl':'https://musicbrainz.org/doc/About/Data_License','reviewed':'2026-11-02','limitation':'Bounded 500-result core-name capture; includes instrument families and ensembles, for the broad music-making prompt.'});entries.append(meta)
 update_manifest(out.parent/'sources.json',entries);print([(e['file'],e['concepts']) for e in entries])
if __name__=='__main__':main()
