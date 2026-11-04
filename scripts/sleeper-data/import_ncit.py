"""Import the licensed current NCI concept graph, excluding retired concepts."""
import argparse,csv,hashlib,io,json,pathlib,zipfile
from import_sources import normal,write,update_manifest

def main():
    p=argparse.ArgumentParser();p.add_argument('--zip',required=True);p.add_argument('--out',default='content/sleeper-data/catalogues/ncit.json.gz');a=p.parse_args();records=[]
    with zipfile.ZipFile(a.zip) as z:
        for r in csv.reader(io.TextIOWrapper(z.open('Thesaurus.txt'),encoding='utf-8-sig'),delimiter='\t'):
            if len(r)!=9:raise ValueError('Review the current NCI schema')
            if any(word in r[6].lower() for word in ['retired','obsolete']):continue
            names=list(dict.fromkeys(n for n in r[3].split('|') if 0<len(n)<=240 and 0<len(normal(n))<=240))
            if not names:continue
            records.append({'id':'ncit:'+r[0],'name':names[0],'aliases':names[1:],'parents':['ncit:'+x for x in r[2].split('|') if x],'definition':r[4],'status':r[6],'semanticTypes':r[7].split('|')})
    out=pathlib.Path(a.out);meta=write(out,{'source':'Concepts derived from NCI Thesaurus 26.10d','license':'CC-BY-4.0','status':'source candidates; question-specific eligibility and ratings require review','records':records});meta.update({'concepts':len(records),'sourceUrl':'https://evs.nci.nih.gov/thesaurus-downloads','rawSha256':hashlib.file_digest(open(a.zip,'rb'),'sha256').hexdigest(),'sourceVersion':'26.10d','attribution':'NCI Enterprise Vocabulary Services, Center for Biomedical Informatics and Information Technology, National Cancer Institute, Maryland, USA. CC BY 4.0. Transformed source candidates; not an official NCI Thesaurus distribution.'});update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'concepts':len(records),'compressedBytes':meta['compressedBytes']},indent=2))
if __name__=='__main__':main()
