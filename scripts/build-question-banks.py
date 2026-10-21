"""Build sourced question banks from the checked-in factual reference snapshot."""
from pathlib import Path
from fractions import Fraction
import ast,itertools,json,math,random
ROOT=Path(__file__).resolve().parents[1]
R=json.loads((ROOT/'content/reference-data.json').read_text())

def calc(expr):
    tree=ast.parse(expr,mode='eval')
    funcs={'factorial':math.factorial,'gcd':math.gcd,'lcm':math.lcm,'sqrt':math.sqrt}
    def visit(n):
        if isinstance(n,ast.Constant) and isinstance(n.value,(int,float)):return Fraction(str(n.value))
        if isinstance(n,ast.BinOp):
            a,b=visit(n.left),visit(n.right)
            if isinstance(n.op,ast.Add):return a+b
            if isinstance(n.op,ast.Sub):return a-b
            if isinstance(n.op,ast.Mult):return a*b
            if isinstance(n.op,ast.Div):return a/b
            if isinstance(n.op,ast.Pow):return a**int(b)
        if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id in funcs:
            return funcs[n.func.id](*[int(visit(a)) for a in n.args])
        raise ValueError('Unsupported calculation '+expr)
    result=visit(tree.body)
    return int(result) if int(result)==result else float(result)

def groups(names,count,seed,min_gap=0,table=None,field=None):
    """Unique five-card comparisons, with ties and unstable near-ties excluded."""
    options=[]
    for g in itertools.combinations(names,5):
        if table:
            vals=sorted(table[x][field] for x in g)
            if len(set(vals))<5 or any(b-a<min_gap for a,b in zip(vals,vals[1:])):continue
        options.append(g)
    return random.Random(seed).sample(options,count)

def movie_label(n):
    # Distinguish remakes and same-title films without disclosing release dates.
    if n in ['Titanic','Jaws','Braveheart','Rocky']:
        return n+' — '+R['movies'][n]['director']
    if n=='The Lion King':return 'The Lion King — hand-drawn Disney film'
    if n=='Up':return 'Up — Pixar film'
    return n

stacks=[];audit=[]
def add_stack(category,prompt,ends,table,field,names,unit,symbol='◇',kind='expanded',label=None):
    rows=sorted([(n,table[n][field]) for n in names],key=lambda t:t[1])
    assert len(rows)==5 and len({v for _,v in rows})==5
    number=len(stacks)+1;id=f'stack-{number:03}'
    label=label or (lambda n:n+' — '+R['books'][n]['author'] if table is R['books'] else movie_label(n) if table is R['movies'] else n)
    fmt=lambda v:f'{v:,.4f}'.rstrip('0').rstrip('.') if isinstance(v,float) else f'{v:,}'
    values='; '.join(f'{label(n)}: {fmt(v)} {unit}'.rstrip() for n,v in rows)
    source='math' if category=='NUMBER SENSE' else 'elements' if table is R['elements'] else 'countries' if table is R['countries'] else 'books' if table is R['books'] else 'movies' if table is R['movies'] else 'airports'
    stack={'id':id,'difficulty':'hard','category':category,'prompt':prompt,'ends':ends,'fact':values+'.','cards':[{'name':label(n),'detail':'','value':i+1,'symbol':symbol} for i,(n,v) in enumerate(rows)],'source':source}
    stacks.append(stack);audit.append({'id':id,'kind':kind,'source':source,'measure':field,'unit':unit,'ordered':[{'key':n,'name':label(n),'value':v} for n,v in rows]})

chem='Magnesium Aluminium Titanium Vanadium Chromium Manganese Iron Cobalt Nickel Copper Zinc Zirconium Niobium Molybdenum Palladium Silver Cadmium Tin Antimony Tungsten Platinum Gold Lead Bismuth'.split()
countryNames=['Portugal','Hungary','Austria','Czechia','Ireland','Iceland','Greece','Bulgaria','Romania','Poland','Finland','Sweden','Spain','Germany','Italy','United Kingdom','New Zealand','Japan','Vietnam','Malaysia','Ecuador','Colombia','Peru','Bolivia','Chile','Argentina','Mongolia','Kazakhstan']
countryNames=[n for n in countryNames if n in R['countries']]
bookNames=['Pride and Prejudice','Wuthering Heights','Moby Dick','Madame Bovary','Dead Souls','The Red and the Black','Hunger','Buddenbrooks','Sons and Lovers','Ulysses','The Magic Mountain','The Trial','The Castle','Mrs Dalloway','To the Lighthouse','The Sound and the Fury','The Stranger','Invisible Man','The Old Man and the Sea','Lolita','Things Fall Apart','The Tin Drum','The Golden Notebook','One Hundred Years of Solitude','Love in the Time of Cholera','Beloved','Blindness']
airportCodes=list(R['airports'])
elevationCodes='DEN JNB BOG MEX UIO LPB ADD NBO KTM SCL LAS PHX ABQ RNO YYC SLC MAD PRG ZRH GRU'.split()
airLabel=lambda n:f"{R['airports'][n]['city']} ({n})"

# Replace the twelve earlier beginner/ambiguous stacks with harder comparisons.
core_specs=[
 ('PERIODIC TABLE','Order these elements by increasing atomic number.',['LOWER','HIGHER'],R['elements'],'number',['Titanium','Vanadium','Chromium','Manganese','Iron'],'','⚛',None),
 ('METALS','Order these pure metals by increasing melting point at standard pressure.',['LOWER','HIGHER'],R['elements'],'melt',['Silver','Gold','Copper','Nickel','Iron'],'K','▦',None),
 ('MATERIALS','Order these pure solid elements by increasing density near room temperature.',['LESS DENSE','DENSER'],R['elements'],'density_g_cm3',['Titanium','Zinc','Tin','Iron','Silver'],'g/cm³','■',None),
 ('GEOGRAPHY','Order these countries from smallest to largest total area.',['SMALLER','LARGER'],R['countries'],'area',['Portugal','Hungary','Austria','Ireland','Iceland'],'km²','◇',None),
 ('BOOKS','Order these novels by their first complete book publication, earliest first (original language).',['EARLIER','LATER'],R['books'],'year',['The Trial','The Castle','To the Lighthouse','The Sound and the Fury','The Stranger'],'','Aa',None),
 ('CINEMA','Order these films by US release year, earliest first.',['EARLIER','LATER'],R['movies'],'year',['Alien','Blade Runner','The Terminator','Back to the Future','Jurassic Park'],'','▣',None),
 ('AIRPORTS','Order these airports from south to north by latitude.',['SOUTH','NORTH'],R['airports'],'latitude',['FCO','VIE','CDG','FRA','LHR'],'° latitude','↑',airLabel),
 ('AIRPORTS','Order these airports west to east by signed longitude, from 180°W to 180°E.',['WEST','EAST'],R['airports'],'longitude',['LHR','CDG','AMS','FRA','VIE'],'° longitude','→',airLabel),
 ('AIRPORTS','Order these airports from lowest to highest field elevation above sea level.',['LOWER','HIGHER'],R['airports'],'elevation_ft',['SLC','DEN','JNB','MEX','BOG'],'ft','△',airLabel),
 ('PERIODIC TABLE','Order these elements by increasing atomic number.',['LOWER','HIGHER'],R['elements'],'number',['Zirconium','Niobium','Molybdenum','Palladium','Silver'],'','⚛',None),
 ('METALS','Order these pure metals by increasing melting point at standard pressure.',['LOWER','HIGHER'],R['elements'],'melt',['Tin','Bismuth','Cadmium','Lead','Zinc'],'K','▦',None),
 ('MATERIALS','Order these pure solid elements by increasing density near room temperature.',['LESS DENSE','DENSER'],R['elements'],'density_g_cm3',['Tin','Iron','Bismuth','Silver','Lead'],'g/cm³','■',None)
]
for category,prompt,ends,table,field,names,unit,symbol,label in core_specs:add_stack(category,prompt,ends,table,field,names,unit,symbol,'replacement',label)

# Ten different card sets for each factual measure; no answer values appear on cards.
families=[
 ('PERIODIC TABLE','Order these elements by increasing atomic number.',['LOWER','HIGHER'],R['elements'],'number',chem,'','⚛',1,None,0),
 ('METALS','Order these pure metals by increasing melting point at standard pressure.',['LOWER','HIGHER'],R['elements'],'melt',chem,'K','▦',2,None,20),
 ('MATERIALS','Order these pure solid elements by increasing density near room temperature.',['LESS DENSE','DENSER'],R['elements'],'density_g_cm3',chem,'g/cm³','■',3,None,.2),
 ('GEOGRAPHY','Order these countries from smallest to largest total area.',['SMALLER','LARGER'],R['countries'],'area',countryNames,'km²','◇',4,None,1500),
 ('BOOKS','Order these novels by their first complete book publication, earliest first (original language).',['EARLIER','LATER'],R['books'],'year',bookNames,'','Aa',5,None,1),
 ('CINEMA','Order these films by US release year, earliest first.',['EARLIER','LATER'],R['movies'],'year',list(R['movies']),'','▣',6,None,1),
 ('AIRPORTS','Order these airports from south to north by latitude.',['SOUTH','NORTH'],R['airports'],'latitude',airportCodes,'° latitude','↑',7,airLabel,1),
 ('AIRPORTS','Order these airports west to east by signed longitude, from 180°W to 180°E.',['WEST','EAST'],R['airports'],'longitude',airportCodes,'° longitude','→',8,airLabel,2),
 ('AIRPORTS','Order these airports from lowest to highest field elevation above sea level.',['LOWER','HIGHER'],R['airports'],'elevation_ft',elevationCodes,'ft','△',9,airLabel,150)
]
seen={(a['measure'],tuple(x['key'] for x in a['ordered'])) for a in audit}
for category,prompt,ends,table,field,names,unit,symbol,seed,label,gap in families:
    candidates=groups(names,30,seed,gap,table,field);added=0
    for names in candidates:
        sig=(field,tuple(sorted(names,key=lambda n:table[n][field])))
        if sig in seen:continue
        seen.add(sig);add_stack(category,prompt,ends,table,field,names,unit,symbol,label=label);added+=1
        if added==10:break
    assert added==10

mathGroups=[
 ('Order these powers from smallest to largest.',{'2⁸':'2**8','3⁵':'3**5','5³':'5**3','6³':'6**3','7²':'7**2'}),
 ('Order these fractions from smallest to largest.',{'7/12':'7/12','5/8':'5/8','8/15':'8/15','11/20':'11/20','9/16':'9/16'}),
 ('Order the results of these percentages from smallest to largest.',{'18% of 250':'18/100*250','12% of 400':'12/100*400','35% of 120':'35/100*120','8% of 550':'8/100*550','20% of 230':'20/100*230'}),
 ('Order these expressions from smallest to largest.',{'√200':'sqrt(200)','4²':'4**2','3³ − 10':'3**3-10','2⁴ − 3':'2**4-3','5 × 3':'5*3'}),
 ('Order these powers from smallest to largest.',{'2¹⁰':'2**10','6⁴':'6**4','12³':'12**3','10³':'10**3','3⁶':'3**6'}),
 ('Order these fractions from smallest to largest.',{'13/17':'13/17','7/9':'7/9','10/13':'10/13','3/4':'3/4','14/19':'14/19'}),
 ('Order these expressions from smallest to largest. The ! symbol means factorial.',{'4!':'factorial(4)','5!':'factorial(5)','3⁴':'3**4','2⁶':'2**6','7²':'7**2'}),
 ('Order these polygons by number of diagonals, fewest first.',{'Pentagon':'5*(5-3)/2','Hexagon':'6*(6-3)/2','Heptagon':'7*(7-3)/2','Octagon':'8*(8-3)/2','Nonagon':'9*(9-3)/2'}),
 ('Order these regular polygons by the size of one interior angle, smallest first.',{'Pentagon':'(5-2)*180/5','Hexagon':'(6-2)*180/6','Octagon':'(8-2)*180/8','Nonagon':'(9-2)*180/9','Decagon':'(10-2)*180/10'}),
 ('Order these cuboids by volume, smallest first. Each card gives length × width × height in cm.',{'3 × 7 × 4':'3*7*4','5 × 5 × 3':'5*5*3','2 × 6 × 8':'2*6*8','4 × 4 × 5':'4*4*5','3 × 3 × 9':'3*3*9'})
]
mathRefs={}
for i,(prompt,expressions) in enumerate(mathGroups,1):
    table={n:{'result':calc(e)} for n,e in expressions.items()}
    add_stack('NUMBER SENSE',prompt,['SMALLER','LARGER'],table,'result',list(table),'','∑')
    audit[-1]['calculations']=expressions
assert len(stacks)==112 and len(audit)==112

trivia=[];triviaAudit=[]
def add_trivia(category,q,answer,wrong,fact,source,key,field,calculation=None):
    assert len(wrong)==2 and len(set([answer,*wrong]))==3
    id=f'stake-added-{len(trivia)+1:03}'
    trivia.append({'id':id,'c':category,'q':q,'o':[answer,*wrong],'f':fact,'source':source})
    row={'id':id,'source':source,'key':key,'field':field,'answer':answer}
    if calculation:row['calculation']=calculation
    triviaAudit.append(row)

symbols='Tungsten Antimony Tin Lead Mercury Potassium Silver Copper Cobalt Nickel Zinc Platinum Palladium Xenon Krypton Rubidium Strontium Molybdenum Niobium Zirconium'.split()
for i,name in enumerate(symbols):
    e=R['elements'][name];wrong=[symbols[(i+3)%20],symbols[(i+7)%20]]
    add_trivia('Chemistry',f'Which element has the chemical symbol {e["symbol"]}?',name,wrong,f'{e["symbol"]} is the symbol for {name.lower()}, atomic number {e["number"]}.','elements',name,'symbol')
for names in groups(chem,10,24,1,R['elements'],'number'):
    ordered=sorted(names,key=lambda n:R['elements'][n]['number']);right=ordered[-1];wrong=[ordered[1],ordered[3]]
    add_trivia('Chemistry','Which has the highest atomic number: '+', '.join(sorted([right,*wrong]))+'?',right,wrong,'Their atomic numbers are '+', '.join(f'{n}: {R["elements"][n]["number"]}' for n in [right,*wrong])+'.','elements',right,'number')

capitals=['Portugal','Norway','Finland','Iceland','Ireland','Austria','Czechia','Hungary','Poland','Slovenia','Croatia','Estonia','Latvia','Lithuania','Slovakia','Romania','Bulgaria','Mongolia','Namibia','Senegal']
for i,name in enumerate(capitals):
    c=R['countries'][name];answer=c['capital'][0];wrong=[R['countries'][capitals[(i+3)%20]]['capital'][0],R['countries'][capitals[(i+7)%20]]['capital'][0]]
    add_trivia('Geography',f'What is the capital of {name}?',answer,wrong,f'{answer} is the capital of {name}.','countries',name,'capital')

authors=['Things Fall Apart','Invisible Man','Beloved','The Stranger','Blindness','The Tin Drum','Lolita','Madame Bovary','The Red and the Black','Dead Souls','To the Lighthouse','Mrs Dalloway','The Golden Notebook','The Old Man and the Sea','The Sound and the Fury','The Trial','The Castle','Buddenbrooks','The Magic Mountain','Sons and Lovers']
for i,title in enumerate(authors):
    a=R['books'][title]['author'];other=[R['books'][t]['author'] for t in authors if R['books'][t]['author']!=a];wrong=list(dict.fromkeys(other))[i%7:i%7+2]
    add_trivia('Literature',f'Who wrote {title}?',a,wrong,f'{title} is a work by {a}.','books',title,'author')

films=['Alien','The Matrix','Jurassic Park','Back to the Future','Toy Story','Titanic','Shrek','Finding Nemo','The Incredibles','The Dark Knight']
for title in films:
    y=R['movies'][title]['year'];add_trivia('Cinema',f'In which year was {movie_label(title)} released in the United States?',str(y),[str(y-2),str(y+2)],f'{movie_label(title)} was released in the United States in {y}.','movies',title,'year')

mathQs=[
 ('What is 17 × 19?','17*19',['313','333']),('What is 23 squared?','23**2',['519','539']),('What is 2 to the power of 10?','2**10',['512','2048']),('What is 7 factorial (7!)?','factorial(7)',['720','40320']),('What is the sum of the integers from 1 to 20?','20*21/2',['190','220']),('What is the least common multiple of 12 and 18?','lcm(12,18)',['24','72']),('What is the greatest common divisor of 84 and 126?','gcd(84,126)',['21','28']),('What is 11 × 13?','11*13',['133','153']),('How many diagonals does a heptagon have?','7*(7-3)/2',['12','21']),('How many degrees is one interior angle of a regular decagon?','(10-2)*180/10',['135','150']),('What is 9 squared plus 12 squared?','9**2+12**2',['215','245']),('What is the cube of 5?','5**3',['25','625']),('What is the positive square root of 625?','sqrt(625)',['15','35']),('What is 3/8 as a percentage?','3/8*100',['32.5','42.5']),('What is the decimal value of binary 101101?','2**5+2**3+2**2+1',['43','47']),('What is 1/3 + 1/6?','1/3+1/6',['1/9','2/9']),('How many hours are in three days?','3*24',['48','96']),('A right triangle has legs of 5 cm and 12 cm. How long is its hypotenuse?','sqrt(5**2+12**2)',['15','17']),('What is 30% of 150?','30/100*150',['35','55']),('What is the area of a circle with radius 7, expressed as a multiple of π?','7**2',['14π','98π'])
]
for i,(q,expression,wrong) in enumerate(mathQs):
    value=calc(expression)
    answer='1/2' if i==15 else '49π' if i==19 else str(value)
    fact='1/3 + 1/6 = 2/6 + 1/6 = 1/2.' if i==15 else 'A = πr², so a radius of 7 gives 49π square units.' if i==19 else f'The calculation gives {value}.'
    add_trivia('Maths',q,answer,wrong,fact,'math',f'math-{i+1}','result',expression)
assert len(trivia)==100
assert len({q['q'] for q in trivia})==100

def dump(path,value,prefix):
    (ROOT/path).write_text('// Generated by scripts/build-question-banks.py; factual audit: content/question-audit.json\n'+prefix+' = '+json.dumps(value,ensure_ascii=False,indent=2)+';\n')
dump(Path('games/stack-up/stacks.js'),stacks,'window.STACK_UP_STACKS')
dump(Path('games/stake/questions.js'),trivia,'window.STAKE_QUESTION_ADDITIONS')
(ROOT/'content/question-audit.json').write_text(json.dumps({'stack_up':audit,'stake':triviaAudit},ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(stacks)} harder Stack Up sets (12 replacements + 100 additions) and {len(trivia)} Stake additions.')

# Append exact/reference-backed launch comparisons after rebuilding the frozen baseline.
import subprocess
subprocess.run(['node',str(ROOT/'scripts/build-launch-content.cjs'),'stack-up'],cwd=ROOT,check=True)
