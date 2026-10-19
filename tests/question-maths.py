"""Independent expected answers for the numerical questions (no generator import)."""
import json,math
from fractions import Fraction
from pathlib import Path
audit=json.loads(Path('content/question-audit.json').read_text())
answers=[323,529,1024,5040,210,36,42,143,14,144,225,125,25,37.5,45,'1/2',72,13,45,'49π']
rows=[r for r in audit['stake'] if r['source']=='math']
assert len(rows)==20
for row,answer in zip(rows,answers):assert row['answer']==str(answer),(row,answer)
values={
 '2⁸':256,'3⁵':243,'5³':125,'6³':216,'7²':49,
 '7/12':Fraction(7,12),'5/8':Fraction(5,8),'8/15':Fraction(8,15),'11/20':Fraction(11,20),'9/16':Fraction(9,16),
 '18% of 250':45,'12% of 400':48,'35% of 120':42,'8% of 550':44,'20% of 230':46,
 '√200':math.sqrt(200),'4²':16,'3³ − 10':17,'2⁴ − 3':13,'5 × 3':15,
 '2¹⁰':1024,'6⁴':1296,'12³':1728,'10³':1000,'3⁶':729,
 '13/17':Fraction(13,17),'7/9':Fraction(7,9),'10/13':Fraction(10,13),'3/4':Fraction(3,4),'14/19':Fraction(14,19),
 '4!':24,'5!':120,'3⁴':81,'2⁶':64,
 '3 × 7 × 4':84,'5 × 5 × 3':75,'2 × 6 × 8':96,'4 × 4 × 5':80,'3 × 3 × 9':81
}
for row in audit['stack_up']:
 if row['source']!='math':continue
 for item in row['ordered']:
  key=item['key']
  if 'diagonals' in row.get('calculations',{}).get(key,''):raise AssertionError()
  if key in ['Pentagon','Hexagon','Heptagon','Octagon','Nonagon','Decagon']:
   n={'Pentagon':5,'Hexagon':6,'Heptagon':7,'Octagon':8,'Nonagon':9,'Decagon':10}[key]
   expected=n*(n-3)//2 if '/2' in row['calculations'][key] else 180-360/n
  else:expected=values[key]
  assert math.isclose(float(expected),item['value'],rel_tol=1e-12),(key,expected,item['value'])
print('PASS: independent expected answers confirm all 20 numerical trivia questions and 10 numerical sorting sets.')
