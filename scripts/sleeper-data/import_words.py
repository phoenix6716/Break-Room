"""Import English lexical families; inflections/spelling variants never pad counts."""
import argparse,collections,gzip,hashlib,json,pathlib,re,unicodedata,zipfile
from import_sources import normal,write,update_manifest

VARIANTS=[['color','colour'],['favor','favour'],['honor','honour'],['flavor','flavour'],['odor','odour'],['labor','labour'],['neighbor','neighbour'],['behavior','behaviour'],['harbor','harbour'],['rumor','rumour'],['humor','humour'],['center','centre'],['theater','theatre'],['meter','metre'],['liter','litre'],['fiber','fibre'],['defense','defence'],['offense','offence'],['license','licence'],['practice','practise'],['analyze','analyse'],['organize','organise'],['realize','realise'],['recognize','recognise'],['apologize','apologise'],['program','programme'],['gray','grey'],['jewelry','jewellery'],['traveler','traveller'],['pajamas','pyjamas'],['tire','tyre'],['check','cheque'],['aluminum','aluminium'],['sulfur','sulphur'],['plow','plough'],['draft','draught']]

def spelling(word):return re.sub('[\u0300-\u036f]','',unicodedata.normalize('NFKD',word))

def main():
    p=argparse.ArgumentParser();p.add_argument('--gzip',required=True);p.add_argument('--cmu-zip');p.add_argument('--out',default='content/sleeper-data/catalogues/english-words.json.gz');a=p.parse_args();records={};skipped=collections.Counter()
    with gzip.open(a.gzip,'rt') as f:
        for line in f:
            r=json.loads(line)
            if r.get('lang_code')!='en' or not r.get('word') or r.get('pos') in ['name','prefix','suffix','symbol','abbrev']:
                skipped['nonlexical or proper-name entries']+=1;continue
            word=r['word'];canonical=next((x['form'] for x in r.get('forms',[]) if 'canonical' in x.get('tags',[]) or 'Singular' in x.get('raw_tags',[])),word)
            if not re.fullmatch(r"[A-Za-z][A-Za-z'’-]*",spelling(canonical)):skipped['multiword or unsupported orthography']+=1;continue
            key='lex:'+normal(canonical);record=records.setdefault(key,{'id':key,'name':canonical,'aliases':[],'partsOfSpeech':[],'pronunciations':[],'simpleWiktionaryPages':[]})
            record['simpleWiktionaryPages'].extend([word,canonical]);record['partsOfSpeech'].append(r['pos'])
            record['aliases'].extend(x for x in [word,*[x['form'] for x in r.get('forms',[])]] if isinstance(x,str) and len(x)<=240 and re.fullmatch(r"[A-Za-z][A-Za-z'’-]*",spelling(x)) and normal(x)!=normal(canonical))
            record['pronunciations'].extend(x['ipa'] for x in r.get('sounds',[]) if x.get('ipa'))
    wn_file=pathlib.Path(a.out).parent/'wordnet.json.gz';wn=json.loads(gzip.decompress(wn_file.read_bytes()))['records']
    # Word prompts count lexical words, not conceptual synonyms such as car/automobile.
    for concept in wn:
        for label in [concept['name'],*concept['aliases']]:
            if not label[:1].islower() or not re.fullmatch(r"[A-Za-z][A-Za-z'’-]*",spelling(label)):continue
            key='lex:'+normal(label)
            records.setdefault(key,{'id':key,'name':label,'aliases':[],'partsOfSpeech':['noun'],'pronunciations':[],'wordnetSources':[]}).setdefault('wordnetSources',[]).append(concept['id'])
    def variant_key(word):
        word=normal(word)
        for old,new in [('isation','ization'),('ising','izing'),('iser','izer'),('ise','ize'),('our','or'),('re','er')]:
            if word.endswith(old):return word[:-len(old)]+new
        return word
    for concept in wn:
        labels=[label for label in [concept['name'],*concept['aliases']] if 'lex:'+normal(label) in records]
        variants=collections.defaultdict(list)
        for label in labels:variants[variant_key(label)].append(label)
        for group in variants.values():
            if len(group)<2:continue
            key='lex:'+normal(group[0]);primary=records.get(key)
            if not primary:continue
            for label in group[1:]:
                other=records.get('lex:'+normal(label))
                if other and other is not primary:
                    primary['aliases'].extend([other['name'],*other['aliases']]);primary['partsOfSpeech'].extend(other['partsOfSpeech']);primary['pronunciations'].extend(other['pronunciations']);primary.setdefault('wordnetSources',[]).extend(other.get('wordnetSources',[]));primary.setdefault('simpleWiktionaryPages',[]).extend(other.get('simpleWiktionaryPages',[]));del records[other['id']]
    # Explicit regional variants share a lexical family if both are attested.
    for group in VARIANTS:
        present=[records.get('lex:'+normal(x)) for x in group];present=[x for x in present if x]
        if len(present)>1:
            primary=present[0]
            for other in present[1:]:primary['aliases'].extend([other['name'],*other['aliases']]);primary['partsOfSpeech'].extend(other['partsOfSpeech']);primary['pronunciations'].extend(other['pronunciations']);primary.setdefault('wordnetSources',[]).extend(other.get('wordnetSources',[]));primary.setdefault('simpleWiktionaryPages',[]).extend(other.get('simpleWiktionaryPages',[]));del records[other['id']]
    for r in records.values():
        r['aliases']=list(dict.fromkeys(r['aliases']));r['partsOfSpeech']=sorted(set(r['partsOfSpeech']));r['pronunciations']=list(dict.fromkeys(r['pronunciations']));r['simpleWiktionaryPages']=list(dict.fromkeys(r.get('simpleWiktionaryPages',[])));r['wordnetSources']=sorted(set(r.get('wordnetSources',[])))
    if a.cmu_zip:
        cmu=collections.defaultdict(list)
        with zipfile.ZipFile(a.cmu_zip) as z:
            for line in z.read('cmudict/cmudict').decode().splitlines():
                parts=line.split()
                if len(parts)>2:cmu[normal(parts[0])].append(parts[2:])
            notice=pathlib.Path(a.out).parent.parent/'licenses/CMUdict-README.txt';notice.write_bytes(z.read('cmudict/README'))
        for r in records.values():r['phonemesByForm']={normal(n):cmu[normal(n)] for n in [r['name'],*r['aliases']] if normal(n) in cmu}
    out=pathlib.Path(a.out);meta=write(out,{'source':'English lexical families: Simple English Wiktionary via Kaikki/Wiktextract and Princeton WordNet','license':'CC-BY-SA-4.0','records':list(records.values())});meta.update({'concepts':len(records),'sourceUrl':'https://kaikki.org/simplewiktionary/rawdata.html','rawSha256':hashlib.file_digest(open(a.gzip,'rb'),'sha256').hexdigest(),'attribution':'Simple English Wiktionary contributors; extracted by Tatu Ylonen / Wiktextract / Kaikki.org; CC BY-SA. Source pages and author histories: https://simple.wiktionary.org/','sourceDump':'2026-10-02','wordnetCompressedSha256':hashlib.sha256(wn_file.read_bytes()).hexdigest(),'wordnetLexicalSource':'Princeton WordNet 3.0, included licence; conceptual synonyms remain different lexical words','cmudictSource':'Carnegie Mellon Pronouncing Dictionary, included redistribution notice' if a.cmu_zip else None,'cmudictSha256':hashlib.file_digest(open(a.cmu_zip,'rb'),'sha256').hexdigest() if a.cmu_zip else None,'status':'lexical candidates; question constraints and contextual ratings still require review','excluded':dict(skipped)});update_manifest(out.parent.parent/'sources.json',[meta]);print(json.dumps({'lexicalFamilies':len(records),'excluded':dict(skipped)},indent=2))
if __name__=='__main__':main()
