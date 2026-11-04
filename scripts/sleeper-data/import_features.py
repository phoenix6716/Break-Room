"""Bounded GeoNames feature candidates with documented physical feature codes.

The cap is a candidate-download budget, never a claim of exhaustive coverage.
Named places are real source entities, not generated combinations of words.
"""
import argparse,collections,hashlib,heapq,io,json,pathlib,re,zipfile
from import_sources import normal,write,update_manifest

GROUPS={
 'regions':'ADM1 ADM2',
 'mountains':'MT MTS PK PKS HLL HLLS VLC',
 'islands':'ISL ISLS ISLET ATOL',
 'beaches':'BCH BCHS',
 'valleys':'VAL VALS CNYN GRGE',
 'deserts':'DSRT ERG HMDA REG',
 'rivers':'STM STMS',
 'lakes':'LK LKS LKN',
 'waterfalls':'FLLS FLLSX',
 'bays':'BAY BAYS GULF',
 'parks':'PRK RESN RESW',
 'forests':'FRST FRSTF',
 'castles':'CSTL FT',
 'bridges':'BDG',
 'museums':'MUS',
 'stadiums':'STDM',
 'universities':'UNIV',
 'airports':'AIRP',
 'religious-buildings':'CH MSQE TMPL PGDA SYG',
 'towers':'TOWR LTHSE',
 'theatres':'THTR OPRA AMTH',
 'stations':'RSTN MTRO',
 'gardens':'GDN',
 'zoos':'ZOO',
 'monuments':'MNMT',
 'hotels':'HTL',
 'buildings':'BLDG PAL',
 'dams':'DAM',
}

def main():
 p=argparse.ArgumentParser();p.add_argument('--zip',required=True);p.add_argument('--feature-codes',required=True);p.add_argument('--limit-per-group',type=int,default=30000);p.add_argument('--out',default='content/sleeper-data/catalogues/geonames-features.json.gz');a=p.parse_args()
 codes={line.split('\t')[0]:line.rstrip('\n').split('\t')[1:] for line in pathlib.Path(a.feature_codes).read_text().splitlines() if line.strip()}
 groups={code:group for group,values in GROUPS.items() for code in values.split()};heaps=collections.defaultdict(list);totals=collections.Counter();quarantine=collections.Counter()
 with zipfile.ZipFile(a.zip) as z:
  with io.TextIOWrapper(z.open('allCountries.txt'),encoding='utf8') as f:
   for line in f:
    r=line.rstrip('\n').split('\t')
    if len(r)!=19:raise ValueError('Unexpected GeoNames schema')
    group=groups.get(r[7]);feature=r[6]+'.'+r[7]
    if not group:continue
    if feature not in codes:raise ValueError('Feature code missing official definition: '+feature)
    if re.fullmatch(r'(?i)(unnamed|unknown|no name|unidentified|[0-9 -]+)',r[1].strip()):quarantine['unlabelled/placeholder']+=1;continue
    names=list(dict.fromkeys(n for n in [r[1],r[2],*r[3].split(',')] if 0<len(n)<=200 and 0<len(normal(n))<=200))
    if not names:continue
    totals[group]+=1
    # Alias coverage is only a source-sampling heuristic, never a player score.
    # Stable hash breaks ties, avoiding a single-country prefix of the dump.
    rank=(int(r[14] or 0),len(names),int(hashlib.sha256(r[0].encode()).hexdigest()[:16],16))
    record={'id':'gn:'+r[0],'name':names[0],'aliases':names[1:],'country':r[8],'admin1':r[10],'admin2':r[11],'population':int(r[14] or 0),'latitude':float(r[4]),'longitude':float(r[5]),'featureCode':r[7],'featureDefinition':codes[feature][1] if len(codes[feature])>1 else codes[feature][0],'group':group,'modified':r[18]}
    item=(rank,int(r[0]),record);heap=heaps[group]
    if len(heap)<a.limit_per_group:heapq.heappush(heap,item)
    elif rank>heap[0][0]:heapq.heapreplace(heap,item)
 rows=[r for group in sorted(heaps) for _,_,r in sorted(heaps[group],key=lambda item:item[1])]
 out=pathlib.Path(a.out);meta=write(out,{'source':'GeoNames allCountries feature capture','license':'CC-BY-4.0','records':rows})
 meta.update({'concepts':len(rows),'sourceUrl':'https://download.geonames.org/export/dump/allCountries.zip','rawSha256':hashlib.file_digest(open(a.zip,'rb'),'sha256').hexdigest(),'featureCodesSha256':hashlib.sha256(pathlib.Path(a.feature_codes).read_bytes()).hexdigest(),'attribution':'GeoNames, CC BY 4.0; physical feature code definitions retained. Bounded candidate selection, not an exhaustive world inventory.','reviewed':'2026-11-02','limitPerGroup':a.limit_per_group,'availableByGroup':dict(totals),'selectedByGroup':dict(collections.Counter(r['group'] for r in rows)),'quarantined':dict(quarantine)})
 update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'concepts':len(rows),'compressedBytes':meta['compressedBytes'],'selectedByGroup':meta['selectedByGroup']},indent=2))
if __name__=='__main__':main()
