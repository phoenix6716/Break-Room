"""Import primary EltonTraits observations; retain inference/certainty flags.

Diet and habitat membership must be selected from actual measured/cited fields,
never inferred from a whole animal class. Original scientific labels stay visible
as source evidence even when a current accepted taxon supplies a common name.
"""
import argparse,collections,csv,gzip,hashlib,json,pathlib
from import_sources import normal,write,update_manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('--directory',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues/animal-traits.json.gz');a=p.parse_args();directory=pathlib.Path(a.directory)
 primary=json.loads((directory/'elton-primary.json').read_text())
 if primary['license']['name']!='CC0':raise ValueError('Unreviewed source licence')
 species=json.loads(gzip.decompress(pathlib.Path('content/sleeper-data/catalogues/species-candidates.json.gz').read_bytes()))['records'];index=collections.defaultdict(list)
 for r in species:index[normal(r['scientificName'])].append(r)
 records=[]
 for filename,group in [('BirdFuncDat.txt','bird'),('MamFuncDat.txt','mammal')]:
  metadata=next(f for f in primary['files'] if f['name']==filename);raw=(directory/filename).read_bytes()
  if hashlib.md5(raw).hexdigest()!=metadata['computed_md5']:raise ValueError('Primary source checksum differs')
  for row in csv.DictReader(raw.decode('cp1252').splitlines(),delimiter='\t'):
   latin=row['Scientific'].replace('_',' ').strip()
   if not latin:continue
   joined=index.get(normal(latin),[]);english=row.get('English','').strip()
   names=list(dict.fromkeys(n for n in [english,*[n for r in joined for n in [r['name'],*r['aliases']]],latin] if n and normal(n)))
   animal=sum(float(row.get('Diet-'+key) or 0) for key in ['Inv','Vend','Vect','Vfish','Vunk','Scav']);plant=sum(float(row.get('Diet-'+key) or 0) for key in ['Fruit','Nect','Seed','PlantO'])
   # Some empty rows in the source lack traits. They cannot establish membership.
   if not 99.9<=animal+plant<=100.1:continue
   nocturnal=row.get('Nocturnal') if group=='bird' else row.get('Activity-Nocturnal')
   tree=float(row.get('ForStrat-understory') or 0)+float(row.get('ForStrat-midhigh') or 0)+float(row.get('ForStrat-canopy') or 0) if group=='bird' else 100 if row.get('ForStrat-Value') in ['A','Ar'] else 0
   water=float(row.get('ForStrat-watbelowsurf') or 0)+float(row.get('ForStrat-wataroundsurf') or 0) if group=='bird' else 100 if row.get('ForStrat-Value') in ['M','S'] else 0
   source='elton2014:'+group+':'+normal(latin)
   records.append({'id':source,'name':names[0],'aliases':names[1:],'scientificName':latin,'group':group,'animalDietPercent':animal,'plantDietPercent':plant,'dietCertainty':row['Diet-Certainty'],'dietSource':row['Diet-Source'],'nocturnal':nocturnal=='1','activityCertainty':row.get('Activity-Certainty'),'treeForagingPercent':tree,'waterForagingPercent':water,'foragingCertainty':row.get('ForStrat-Certainty',row.get('ForStrat-SpecLevel')),'sourceIds':[source,*[r['id'] for r in joined]]})
 out=pathlib.Path(a.out);meta=write(out,{'source':'EltonTraits 1.0 primary archived species traits, Wilman et al. 2014','license':'CC0-1.0','records':records})
 meta.update({'concepts':len(records),'sourceUrl':primary['url'] if primary.get('url') else 'https://doi.org/10.6084/m9.figshare.c.3306933','attribution':'Wilman H., Belmaker J., Simpson J., de la Rosa C., Rivadeneira M.M. and Jetz W. (2014), EltonTraits 1.0, Ecology 95:2027. Primary archived data under CC0. Current GBIF common-name joins are CC BY 4.0.','reviewed':'2026-11-02','rawFiles':[{k:f[k] for k in ['name','computed_md5','download_url']} for f in primary['files']],'primaryMetadataSha256':hashlib.sha256((directory/'elton-primary.json').read_bytes()).hexdigest(),'limitation':'Trait source taxonomy predates 2026; unresolved scientific-name joins remain explicit. Inferred diet values cannot establish an observed-trait question.'})
 update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'records':len(records),'observedOmnivores':sum(r['animalDietPercent']>=5 and r['plantDietPercent']>=5 and r['dietCertainty'] in ['A','B','ABC'] for r in records)},indent=2))
if __name__=='__main__':main()
