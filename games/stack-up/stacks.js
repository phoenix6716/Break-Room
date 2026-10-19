const dailyStacks = [
  {
    category: "SPEED",
    prompt: "Put these things from slowest to fastest.",
    ends: ["SLOWER", "FASTER"],
    fact: "A commercial jet travels roughly 25 times faster than a cheetah can sprint.",
    cards: [
      { name: "Walking", detail: "a brisk walk", value: 1, symbol: "→" },
      { name: "Cheetah", detail: "top sprint", value: 2, symbol: "≋" },
      { name: "Tennis serve", detail: "fastest serves", value: 3, symbol: "✦" },
      { name: "Bullet train", detail: "top service speed", value: 4, symbol: "═" },
      { name: "Commercial jet", detail: "cruising speed", value: 5, symbol: "⌁" }
    ]
  },
  {
    category: "LIFESPAN",
    prompt: "Put these animals from shortest to longest average lifespan.",
    ends: ["SHORTER", "LONGER"],
    fact: "Some tortoises can live for well over a century, while a mayfly may only have a day as an adult.",
    cards: [
      { name: "Mayfly", detail: "adult life", value: 1, symbol: "·" },
      { name: "Hamster", detail: "average life", value: 2, symbol: "○" },
      { name: "Dog", detail: "average life", value: 3, symbol: "⌂" },
      { name: "Horse", detail: "average life", value: 4, symbol: "♞" },
      { name: "Tortoise", detail: "average life", value: 5, symbol: "◒" }
    ]
  },
  {
    category: "HISTORY",
    prompt: "Put these inventions from oldest to newest.",
    ends: ["OLDER", "NEWER"],
    fact: "The bicycle arrived decades before the first practical television, even though both feel fairly modern.",
    cards: [
      { name: "Bicycle", detail: "early design", value: 1, symbol: "◎" },
      { name: "Telephone", detail: "patented 1876", value: 2, symbol: "☎" },
      { name: "Television", detail: "public demos", value: 3, symbol: "▣" },
      { name: "Microwave", detail: "home use", value: 4, symbol: "▤" },
      { name: "Smartphone", detail: "first iPhone", value: 5, symbol: "▯" }
    ]
  },
  {
    category: "WEIGHT",
    prompt: "Put these things from lightest to heaviest.",
    ends: ["LIGHTER", "HEAVIER"],
    fact: "A typical car weighs about a thousand times more than a bicycle.",
    cards: [
      { name: "Paperclip", detail: "about 1 gram", value: 1, symbol: "⌇" },
      { name: "Apple", detail: "about 180 grams", value: 2, symbol: "●" },
      { name: "Bowling ball", detail: "about 7 kg", value: 3, symbol: "◉" },
      { name: "Bicycle", detail: "about 12 kg", value: 4, symbol: "◎" },
      { name: "Small car", detail: "about 1 tonne", value: 5, symbol: "▰" }
    ]
  },
  {
    category: "DISTANCE",
    prompt: "Put these trips from shortest to longest.",
    ends: ["CLOSER", "FARTHER"],
    fact: "The Moon is far enough away that every Apollo trip took several days, even at huge speeds.",
    cards: [
      { name: "School lap", detail: "around an oval", value: 1, symbol: "□" },
      { name: "City commute", detail: "across town", value: 2, symbol: "⌘" },
      { name: "Road trip", detail: "Sydney to Melbourne", value: 3, symbol: "↠" },
      { name: "Flight overseas", detail: "across an ocean", value: 4, symbol: "⌁" },
      { name: "Trip to Moon", detail: "from Earth", value: 5, symbol: "☾" }
    ]
  }
];

const infiniteStacks = [
  dailyStacks[3],
  {
    category: "HEIGHT",
    prompt: "Put these things from shortest to tallest.",
    ends: ["SHORTER", "TALLER"],
    fact: "The tallest redwood trees are taller than a 30-storey building.",
    cards: [
      { name: "Skateboard", detail: "deck height", value: 1, symbol: "═" },
      { name: "Golden retriever", detail: "standing", value: 2, symbol: "⌂" },
      { name: "Basketball hoop", detail: "regulation", value: 3, symbol: "⊓" },
      { name: "Giraffe", detail: "adult", value: 4, symbol: "♙" },
      { name: "Redwood tree", detail: "tallest kind", value: 5, symbol: "↟" }
    ]
  },
  {
    category: "TIME",
    prompt: "Put these things from quickest to slowest.",
    ends: ["QUICKER", "SLOWER"],
    fact: "A blink lasts around a tenth of a second. A microwave meal takes several thousand times longer.",
    cards: [
      { name: "A blink", detail: "an instant", value: 1, symbol: "–" },
      { name: "A song", detail: "one track", value: 2, symbol: "♫" },
      { name: "Microwave meal", detail: "from frozen", value: 3, symbol: "▦" },
      { name: "A school class", detail: "one lesson", value: 4, symbol: "▤" },
      { name: "A movie", detail: "feature length", value: 5, symbol: "▷" }
    ]
  },
  {
    category: "SUGAR",
    prompt: "Put these snacks from least to most sugar.",
    ends: ["LESS", "MORE"],
    fact: "A can of soft drink can contain around ten teaspoons of sugar.",
    cards: [
      { name: "Plain yoghurt", detail: "one tub", value: 1, symbol: "◒" },
      { name: "Banana", detail: "one medium", value: 2, symbol: "⌒" },
      { name: "Chocolate bar", detail: "one bar", value: 3, symbol: "▥" },
      { name: "Soft drink", detail: "one can", value: 4, symbol: "▯" },
      { name: "Milkshake", detail: "large cup", value: 5, symbol: "♜" }
    ]
  }
];


window.STACK_UP_STACKS = [...new Map([...dailyStacks,...infiniteStacks].filter(s=>s.category!=="SUGAR").map(s=>[s.category,s])).values()];

// Additional stacks use a clear, single interpretation of the requested measure.
window.STACK_UP_STACKS.push(
 {category:'PLANETS',prompt:'Order these planets from smallest to largest diameter.',ends:['SMALLER','LARGER'],fact:'Mercury is the smallest planet. Neptune is almost four times Earth’s diameter.',cards:[{name:'Mercury',detail:'the nearest planet to the Sun',value:1,symbol:'☀'},{name:'Mars',detail:'the red planet',value:2,symbol:'●'},{name:'Venus',detail:'our bright neighbour',value:3,symbol:'✦'},{name:'Earth',detail:'our home planet',value:4,symbol:'⊕'},{name:'Neptune',detail:'a blue ice giant',value:5,symbol:'≈'}]},
 {category:'MOUNTAINS',prompt:'Order these summits from lowest to highest above sea level.',ends:['LOWER','HIGHER'],fact:'Snowdon is 1,085 m, Ben Nevis 1,345 m, Kosciuszko 2,228 m, Fuji 3,776 m and Kilimanjaro 5,895 m.',cards:[{name:'Snowdon',detail:'Wales',value:1,symbol:'△'},{name:'Ben Nevis',detail:'Scotland',value:2,symbol:'△'},{name:'Kosciuszko',detail:'Australia',value:3,symbol:'△'},{name:'Mount Fuji',detail:'Japan',value:4,symbol:'△'},{name:'Kilimanjaro',detail:'Tanzania',value:5,symbol:'△'}]},
 {category:'CALENDAR',prompt:'Order these periods from shortest to longest.',ends:['SHORTER','LONGER'],fact:'A fortnight is 14 days, a decade is 10 years and a century is 100 years.',cards:[{name:'A week',detail:'a familiar routine',value:1,symbol:'□'},{name:'A fortnight',detail:'two weekly cycles',value:2,symbol:'▣'},{name:'A year',detail:'one trip around the Sun',value:3,symbol:'○'},{name:'A decade',detail:'a bigger milestone',value:4,symbol:'◇'},{name:'A century',detail:'a long stretch',value:5,symbol:'✦'}]},
 {category:'TEMPERATURE',prompt:'Order these temperatures from coldest to hottest.',ends:['COLDER','HOTTER'],fact:'Water freezes at 0°C and boils at about 100°C at sea level. The Sun’s visible surface is about 5,500°C.',cards:[{name:'Water freezes',detail:'fresh water at normal pressure',value:1,symbol:'❄'},{name:'Human body',detail:'typical healthy temperature',value:2,symbol:'♥'},{name:'Water boils',detail:'at sea level',value:3,symbol:'≈'},{name:'Baking a cake',detail:'a typical oven setting',value:4,symbol:'▦'},{name:'Sun’s surface',detail:'the visible photosphere',value:5,symbol:'☀'}]},
 {category:'COUNTRIES',prompt:'Order these countries by total area, smallest to largest.',ends:['SMALLER','LARGER'],fact:'By total area, Australia is followed by Brazil, China, Canada and Russia. Russia covers more than twice Australia’s area.',cards:[{name:'Australia',detail:'Oceania',value:1,symbol:'◇'},{name:'Brazil',detail:'South America',value:2,symbol:'◇'},{name:'China',detail:'Asia',value:3,symbol:'◇'},{name:'Canada',detail:'North America',value:4,symbol:'◇'},{name:'Russia',detail:'Europe and Asia',value:5,symbol:'◇'}]}
);
