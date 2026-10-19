/* Lowball's artwork is assembled from reusable SVG shapes. No image files or fonts.
   New items are classified by name, or can opt into a family with { art: 'book' }.
   Unmatched names get a price-tag parcel automatically. */
(() => {
  'use strict';
  const ink = '#17263a', blue = '#91c7dc', lime = '#b8d957', yellow = '#f9d883', coral = '#ee8578', paper = '#fffdf5', purple = '#d9c9e8';
  const rect = (x,y,w,h,fill=paper,r=3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  const path = (d,fill='none') => `<path d="${d}" fill="${fill}"/>`;
  const circle = (x,y,r,fill=paper) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const line = (x,y,X,Y) => `<path d="M${x} ${y}L${X} ${Y}"/>`;
  const label = (x,y,w=26) => rect(x,y,w,15,paper,0)+line(x+5,y+6,x+w-5,y+6);
  const drawings = {
    parcel: () => path('M27 40L64 25 101 40 64 57Z',yellow)+path('M27 40V86L64 104 101 86V40L64 57Z',paper)+path('M64 57V104M46 33L83 49V65')+rect(76,73,17,13,coral,0),
    burger: () => path('M24 52C25 13 103 13 104 52Z',yellow)+path('M23 61L36 56 49 63 63 56 79 63 95 56 105 61V71H23Z',lime)+rect(23,74,82,13,coral,6)+path('M24 91H104Q103 106 87 106H41Q25 106 24 91Z',yellow)+path('M45 36L48 32M62 32L65 28M80 36L83 32'),
    screen: () => rect(18,27,92,65,blue)+rect(25,34,78,49,paper)+path('M57 45L76 58 57 71Z',coral)+path('M64 92V103M44 104H84'),
    headphones: () => path('M29 72V55C29 10 99 10 99 55V72','none')+rect(22,58,19,38,blue,7)+rect(87,58,19,38,blue,7)+path('M38 53C38 20 90 20 90 53'),
    earbuds: () => rect(28,60,72,44,paper,14)+line(29,74,99,74)+rect(39,24,14,30,blue,6)+rect(75,24,14,30,blue,6)+circle(47,35,3,ink)+circle(83,35,3,ink),
    phone: () => rect(39,15,50,94,purple,7)+rect(45,24,38,66,paper)+path('M49 68L62 48 79 68Z',blue)+circle(70,39,5,yellow)+line(58,100,70,100),
    tablet: () => rect(27,15,74,94,blue,5)+rect(34,23,60,73,paper)+path('M42 46H85M42 56H85M42 66H79M42 76H73')+circle(64,102,2,ink),
    console: () => rect(23,34,82,60,paper,13)+rect(44,42,40,43,blue,0)+path('M34 49V66M26 57H42')+circle(94,56,3,coral)+circle(94,73,3,lime),
    controller: () => path('M39 40H89Q105 42 109 86Q109 107 91 94L77 80H51L37 94Q18 107 19 86Q23 42 39 40Z',blue)+path('M38 51V71M28 61H48')+circle(86,54,5,coral)+circle(97,66,5,yellow)+circle(59,69,3,ink)+circle(69,69,3,ink),
    beer: () => path('M38 38H88L82 107H44Z',yellow)+path('M38 47H88M47 89H79')+circle(47,33,12,paper)+circle(64,29,14,paper)+circle(81,34,12,paper),
    board: () => rect(20,22,88,88,lime,0)+rect(35,37,58,58,paper,0)+path('M20 37H35M20 54H35M20 73H35M20 95H35M93 37H108M93 54H108M93 73H108M93 95H108M35 22V37M54 22V37M74 22V37M93 22V37M35 95V110M54 95V110M74 95V110M93 95V110')+rect(48,48,31,18,coral,0)+circle(57,81,4,blue)+circle(73,80,4,yellow),
    bottle: () => rect(50,17,28,13,blue,1)+path('M52 30V40L38 55V103Q64 111 90 103V55L76 40V30Z',paper)+rect(39,62,50,27,coral,0)+line(48,74,78,74),
    carton: () => path('M39 36L48 19H78L89 36V106H39Z',paper)+path('M39 36H89M48 19L57 36V106')+rect(58,54,30,33,blue,0)+circle(73,70,8,paper),
    can: () => rect(43,24,42,84,blue,8)+rect(43,43,42,41,coral,0)+path('M44 31H84M44 100H84')+path('M57 58L71 58 59 72H73'),
    jar: () => rect(37,34,54,72,yellow,9)+rect(36,24,56,16,coral,2)+label(39,61,50),
    tube: () => path('M40 26H88L82 93H46Z',blue)+rect(48,94,32,14,paper,1)+rect(44,23,40,7,paper,0)+label(47,51,34),
    pump: () => rect(39,48,50,59,coral,6)+rect(53,29,22,19,paper,0)+path('M64 29V21H91V30')+label(42,70,44),
    box: () => rect(32,23,64,84,yellow,1)+rect(32,23,64,14,coral,0)+rect(40,49,48,33,paper,0)+circle(64,65,10,blue)+path('M42 94H76'),
    bag: () => path('M37 22H91L88 35 96 105H32L40 35Z',yellow)+line(39,32,89,32)+rect(40,53,48,33,paper,0)+circle(64,69,9,lime),
    eggs: () => rect(21,55,86,43,yellow,5)+[39,64,89].map(x=>`<ellipse cx="${x}" cy="55" rx="11" ry="19" fill="${paper}"/>`).join('')+path('M21 76H107M47 77V97M80 77V97'),
    bread: () => path('M29 97V53C8 31 34 17 64 22 98 17 119 35 99 53V97Z',yellow)+path('M39 86V53Q64 37 89 53V86Z',paper),
    fries: () => [36,50,64,78,91].map((x,i)=>rect(x,23+(i%2)*8,9,54,yellow,0)).join('')+path('M27 56H103L91 108H39Z',coral)+circle(65,80,12,yellow),
    popcorn: () => [35,51,67,83,96].map((x,i)=>circle(x,43-(i%2)*9,12,paper)).join('')+path('M25 52H103L91 108H37Z',yellow)+path('M44 53L49 106M65 53V107M85 53L80 106'),
    cup: () => path('M34 37H89L82 106H42Z',paper)+rect(29,29,66,12,ink,2)+rect(36,64,50,23,blue,0)+path('M53 20L50 12M73 20L70 12'),
    pizza: () => path('M29 27L105 48 47 108Z',yellow)+path('M29 27Q69 21 105 48L99 59Q66 35 33 39Z',coral)+circle(54,54,7,coral)+circle(79,63,7,coral)+circle(53,83,6,coral),
    avocado: () => path('M63 20C48 20 49 43 33 63 10 101 52 120 80 106 113 91 91 57 80 38 75 25 73 20 63 20Z',lime)+circle(62,80,19,yellow)+circle(62,80,12,coral),
    banana: () => path('M32 30Q42 85 96 59Q75 115 36 89 14 71 24 34Z',yellow)+path('M34 47Q43 91 84 76')+path('M24 34L23 23 32 21 32 30',lime),
    meat: () => path('M35 31C77 6 118 49 96 87 86 111 31 115 22 79 18 60 19 44 35 31Z',coral)+path('M39 42C72 25 101 50 86 80 76 98 40 99 34 76 29 62 29 49 39 42Z',paper)+circle(64,66,12,coral),
    cheese: () => path('M25 62L84 27 105 63V103H25Z',yellow)+path('M25 62H105')+circle(45,79,6,paper)+circle(81,87,7,paper)+circle(73,51,4,paper),
    chocolate: () => rect(29,29,70,79,coral,1)+rect(35,18,58,62,yellow,1)+[41,65].map(x=>[25,49].map(y=>rect(x,y,18,19,'#a47b66',0)).join('')).join('')+path('M29 68L64 86 99 68',paper),
    icecream: () => path('M26 51H102L93 108H35Z',blue)+rect(22,41,84,13,paper,3)+circle(47,34,15,purple)+circle(76,32,18,yellow)+label(42,73,44),
    ticket: () => path('M20 38H108V56C92 56 92 76 108 76V94H20V76C36 76 36 56 20 56Z',yellow)+path('M45 43V50M45 57V64M45 71V78M45 85V89')+path('M73 48L78 58 89 59 81 67 83 78 73 73 63 78 65 67 57 59 68 58Z',coral),
    stamp: () => rect(32,26,64,80,paper,0)+rect(41,36,46,49,blue,0)+path('M47 74L63 47 81 74Z',lime)+path('M43 95H83')+[40,55,70,85].map(x=>circle(x,26,3,paper)+circle(x,106,3,paper)).join(''),
    car: () => path('M22 64L34 42H85L102 64 112 72V94H16V73Z',coral)+path('M38 47L29 65H92L81 47Z',blue)+circle(37,95,11,ink)+circle(91,95,11,ink)+path('M23 79H34M95 79H105'),
    fuel: () => rect(26,26,51,82,coral,2)+rect(33,34,37,30,paper,0)+path('M77 43H87V83Q87 99 99 90V43L90 32M23 108H82')+path('M49 74V94M39 84H59'),
    dumbbell: () => path('M32 64H96')+rect(24,39,15,50,blue)+rect(14,49,10,30,paper)+rect(89,39,15,50,blue)+rect(104,49,10,30,paper),
    scissors: () => circle(38,87,15,coral)+circle(90,87,15,blue)+path('M48 76L91 22M80 76L37 22')+circle(64,56,4,paper),
    umbrella: () => path('M19 62C22 10 106 10 109 62Q95 49 80 62Q64 49 48 62Q33 49 19 62Z',blue)+path('M64 62V101Q64 119 82 106M64 25V17M48 62Q49 37 64 25Q80 38 80 62'),
    shirt: () => path('M44 25L26 35 12 61 32 71 40 58V107H88V58L96 71 116 61 102 35 84 25Q64 45 44 25Z',blue)+path('M49 28Q64 53 79 28'),
    jeans: () => path('M39 20H89L95 107H70L64 60 58 107H33Z',blue)+path('M39 34H89M64 34V59M45 35V49H55M74 35V49H84'),
    shoe: () => path('M29 39L53 52 70 69 98 73Q112 78 109 96H20V67Z',paper)+path('M20 88H109M46 57L58 51M55 64L66 57M64 71L74 65')+path('M34 72L53 81 86 78',blue),
    socks: () => path('M34 22H57V75L74 89Q82 108 62 110L30 90V22Z',purple)+path('M70 22H93V70L108 84Q117 101 100 104L88 97')+path('M34 36H57M70 36H93'),
    glasses: () => rect(17,49,40,30,blue,9)+rect(71,49,40,30,blue,9)+path('M57 58Q64 51 71 58M17 54L11 40M111 54L117 40'),
    backpack: () => rect(30,30,68,79,coral,12)+path('M50 30V19H78V30M30 43H22V90M98 43H106V90')+rect(40,67,48,31,yellow)+line(42,75,86,75),
    mouse: () => rect(37,23,54,86,blue,25)+path('M37 57H91M64 24V56')+rect(61,36,6,12,ink,2),
    cable: () => path('M38 43V76Q38 98 64 98T90 76V54')+rect(28,20,20,26,blue,1)+rect(30,14,16,8,paper,0)+rect(80,32,20,25,coral,1)+rect(84,25,12,9,paper,0),
    speaker: () => rect(31,20,66,91,purple,6)+circle(64,78,22,blue)+circle(64,78,8,paper)+circle(64,39,10,paper),
    watch: () => rect(49,12,30,104,blue,6)+rect(35,38,58,53,ink,9)+rect(42,45,44,39,paper,3)+path('M64 51V66L76 73'),
    drive: () => rect(30,25,68,82,blue,5)+circle(64,62,22,paper)+circle(64,62,7,coral)+path('M64 62L85 79M40 98H61'),
    appliance: () => rect(29,24,70,84,blue,9)+rect(38,31,52,21,ink,2)+circle(64,41,5,yellow)+rect(38,61,52,37,paper,5)+rect(51,66,26,6,coral,1),
    kettle: () => path('M42 34H81L94 102H30Z',blue)+path('M37 53L16 42 31 78M86 46Q120 41 105 79H91')+rect(43,27,37,9,paper,0)+line(28,107,98,107),
    toaster: () => path('M43 50V32Q43 19 64 21 85 19 85 32V50',yellow)+rect(22,47,84,59,blue,10)+path('M31 107H99M95 60V83M91 69H103')+circle(40,87,5,paper),
    vacuum: () => circle(64,68,43,blue)+circle(64,68,30,paper)+circle(64,57,12,coral)+path('M40 89H88M49 27V21H79V27'),
    pillow: () => path('M25 34Q64 42 103 34Q96 64 103 99Q64 91 25 99Q32 64 25 34Z',purple)+path('M36 45Q64 51 92 45M36 88Q64 82 92 88'),
    fan: () => circle(64,48,34,blue)+path('M64 82V105M44 107H84')+path('M64 48Q29 28 57 22Q75 17 64 48Q94 28 94 50Q93 68 64 48Q68 82 49 72Q34 61 64 48',paper)+circle(64,48,6,coral),
    book: () => rect(30,22,69,87,purple,2)+path('M40 22V109M40 101H99')+rect(50,37,38,31,paper,0)+line(53,80,85,80),
    puzzle: () => path('M27 29H52C43 9 83 9 74 29H101V56C121 47 121 85 101 77V103H75C84 123 45 123 53 103H27V77C7 86 7 47 27 56Z',purple),
    bricks: () => rect(24,52,80,50,coral,0)+[37,70].map(x=>rect(x,41,21,11,yellow,0)).join('')+path('M24 68H104M64 68V102'),
    ball: () => circle(64,65,43,lime)+path('M64 45L83 60 76 83H52L45 60Z',paper)+path('M64 22V45M23 53L45 60M83 60L105 52M76 83L90 100M52 83L37 100'),
    mat: () => path('M27 36H89Q107 36 107 51V97H37Q22 97 22 82V51Q22 36 37 36Z',purple)+path('M37 36Q52 36 52 51V97M22 51Q22 65 37 65T52 51M62 51H95M62 64H95M62 77H95'),
    battery: () => rect(41,28,46,78,lime,3)+rect(52,20,24,8,paper,0)+path('M54 50H74M64 40V60M54 88H74'),
    bulb: () => path('M48 81C48 65 32 65 32 45 32 3 96 3 96 45 96 65 80 65 80 81Z',yellow)+rect(48,81,32,22,blue)+path('M49 91H79M57 104V110H71V104M58 80L52 45 64 54 76 45 70 80'),
    roll: () => path('M27 45Q27 24 64 24T101 45V103H47V53',paper)+`<ellipse cx="64" cy="45" rx="37" ry="20" fill="${paper}"/>`+`<ellipse cx="64" cy="45" rx="12" ry="7" fill="${yellow}"/>`+path('M47 70H101M47 84H101'),
    tissue: () => rect(24,60,80,45,blue,1)+path('M44 60L38 33 59 39 76 19 90 60Z',paper)+line(42,65,88,65),
    brush: () => rect(57,54,13,57,blue,6)+rect(51,18,25,42,paper,4)+path('M51 25H75M51 33H75M51 41H75M51 49H75'),
    razor: () => rect(57,49,14,61,blue,6)+rect(35,24,58,28,paper,4)+path('M41 32H87M41 40H87'),
    bandage: () => rect(16,47,96,33,coral,14)+rect(48,47,32,33,paper,0)+path('M28 57H32M28 69H32M96 57H100M96 69H100'),
    trophy: () => path('M38 24H90V52Q90 81 64 84 38 81 38 52Z',yellow)+path('M38 32H21V46Q21 66 43 66M90 32H107V46Q107 66 85 66M64 84V103M46 106H82')+path('M64 36L70 47 82 49 73 57 75 70 64 64 53 70 55 57 46 49 58 47Z',paper),
    lock: () => path('M42 55V36C42 7 86 7 86 36V55',paper)+rect(30,51,68,58,blue,5)+circle(64,75,8,paper)+path('M64 83V94')
  };
  // Rules are ordered: specific products before the broader packaging families.
  const rules = [
    [/airpods/, 'earbuds'], [/spotify/, 'headphones'], [/netflix|disney/, 'screen'], [/iphone|phone case/, 'phone'], [/ipad|kindle/, 'tablet'], [/switch/, 'console'], [/playstation|ps5 game/, 'controller'],
    [/big mac|sub sandwich/, 'burger'], [/popcorn/, 'popcorn'], [/fries|fish and chips/, 'fries'], [/pizza/, 'pizza'], [/avocado/, 'avocado'], [/banana/, 'banana'], [/eggs/, 'eggs'], [/bread/, 'bread'], [/chicken|beef/, 'meat'], [/cheese|^butter$/, 'cheese'], [/chocolate/, 'chocolate'], [/ice cream/, 'icecream'], [/latte|flat white/, 'cup'],
    [/petrol/, 'fuel'], [/uber|car wash|dry cleaning/, 'car'], [/transport/, 'ticket'], [/gym/, 'dumbbell'], [/haircut/, 'scissors'], [/umbrella/, 'umbrella'], [/stamp/, 'stamp'], [/ticket|parking/, 'ticket'],
    [/jeans/, 'jeans'], [/socks/, 'socks'], [/t-shirt|hoodie/, 'shirt'], [/nike/, 'shoe'], [/sunglasses/, 'glasses'], [/backpack/, 'backpack'], [/mouse/, 'mouse'], [/cable/, 'cable'], [/speaker/, 'speaker'], [/watch/, 'watch'], [/ssd/, 'drive'], [/air fryer/, 'appliance'], [/kettle/, 'kettle'], [/toaster/, 'toaster'], [/vacuum/, 'vacuum'], [/pillow/, 'pillow'], [/fan/, 'fan'],
    [/novel/, 'book'], [/jigsaw/, 'puzzle'], [/monopoly/, 'board'], [/lego/, 'bricks'], [/soccer|tennis/, 'ball'], [/yoga/, 'mat'], [/batteries/, 'battery'], [/light bulb/, 'bulb'], [/toilet paper/, 'roll'], [/tissues/, 'tissue'], [/toothbrush/, 'brush'], [/razor/, 'razor'], [/band-aid/, 'bandage'],
    [/shampoo|hand soap/, 'pump'], [/toothpaste|sunscreen|deodorant|lip balm/, 'tube'], [/peanut butter/, 'jar'], [/milk|orange juice/, 'carton'], [/pint/, 'beer'], [/energy drink|six-pack/, 'can'], [/coca-cola|bottled water|wine|dishwashing|detergent/, 'bottle'], [/food|rice|pasta|potato chips/, 'bag'], [/capsules|cereal|tea bags/, 'box']
  ];
  function kind(item) {
    if (item && drawings[item.art]) return item.art;
    const name = String(typeof item === 'string' ? item : item?.name || '').toLowerCase();
    return rules.find(([pattern]) => pattern.test(name))?.[1] || 'parcel';
  }
  function markup(item) {
    const family = kind(item);
    return `<svg class="lowball-art" data-art-kind="${family}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><ellipse cx="66" cy="116" rx="43" ry="5" fill="${ink}" opacity=".1"/><g stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${drawings[family]()}</g></svg>`;
  }
  function gem(score, index) {
    const colour = score >= 95 ? lime : score >= 80 ? yellow : score >= 50 ? '#e9a16a' : coral;
    return `<svg class="gem" style="--i:${index}" viewBox="0 0 32 32" aria-hidden="true"><path d="M7 2H25L30 7V25L25 30H7L2 25V7Z" fill="${colour}" stroke="${ink}" stroke-width="2"/><path d="M7 2L11 9H21L25 2M30 7L23 11V21L30 25M25 30L21 23H11L7 30M2 25L9 21V11L2 7" fill="none" stroke="${ink}" stroke-opacity=".4"/><path d="M11 9H21V23H9V11Z" fill="${paper}" opacity=".22"/></svg>`;
  }
  window.LOWBALL_ART = Object.freeze({ kind, markup, gem, families: Object.freeze(Object.keys(drawings)) });
})();
