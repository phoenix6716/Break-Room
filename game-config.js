/* INSERT COIN game registry. Add a new entry here before building its engine. */
window.INSERT_COIN_GAMES = [
 {id:'stake',title:'Stake',category:'TRIVIA / RISK',description:'Bet your chips. Trust your knowledge. Win big or lose it.',instructions:'Choose a chip bet before each trivia question. Correct answers win your bet; wrong answers lose it.',accent:'green',status:'live',scoreMax:15,attemptsPerDay:1,engine:'stake'},
 {id:'lowball',title:'Lowball',category:'PRICE GUESSING',description:'Estimate the price. Trust your instincts. How close can you get?',instructions:'Guess the price of everyday items. Choose your region, enter your estimate, and aim for 100 points.',accent:'cyan',status:'live',scoreMax:100,attemptsPerDay:1,engine:'lowball'},
 {id:'pixel-pairs',title:'Pixel Pairs',category:'MEMORY',description:'Spot the matching pair before time runs out.',instructions:'Flip tiles two at a time and find every matching pair.',accent:'pink',status:'live',scoreMax:100,attemptsPerDay:1,engine:'placeholder'},
 {id:'word-forge',title:'Word Forge',category:'WORDPLAY',description:'Build the best word from six letters.',instructions:'Use the letters to build the highest-scoring word.',accent:'cyan',status:'live',scoreMax:100,attemptsPerDay:1,engine:'placeholder'},
 {id:'gridlock',title:'Gridlock',category:'LOGIC',description:'Find the missing tile in the pattern.',instructions:'Study the pattern and pick the tile that completes it.',accent:'green',status:'live',scoreMax:100,attemptsPerDay:1,engine:'placeholder'},
 {id:'number-drop',title:'Number Drop',category:'NUMBER',description:'Guess the hidden number in fewer moves.',instructions:'Guess a number from 1 to 20. You have 5 guesses.',accent:'orange',status:'demo',scoreMax:100,attemptsPerDay:1,engine:'number-guess'},
 {id:'memory-lane',title:'Memory Lane',category:'MEMORY',description:'Remember the sequence. Repeat it cleanly.',instructions:'A sequence game is planned for this cabinet.',accent:'purple',status:'coming-soon',scoreMax:100,attemptsPerDay:1,engine:'placeholder'},
 {id:'mystery-cabinet',title:'Mystery Cabinet',category:'???',description:'A new challenge is being prepared.',instructions:'This cabinet is not open yet.',accent:'yellow',status:'locked',scoreMax:100,attemptsPerDay:0,engine:'placeholder'}
];
window.INSERT_COIN_STORAGE = { // Demo only. Replace with server-side records before public launch.
 dayKey: () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; },
 key: id => `insert-coin:attempt:${window.INSERT_COIN_STORAGE.dayKey()}:${id}`,
 get: id => { try { return JSON.parse(localStorage.getItem(window.INSERT_COIN_STORAGE.key(id))||'null'); } catch { return null; } },
 save: (id,data) => localStorage.setItem(window.INSERT_COIN_STORAGE.key(id),JSON.stringify(data))
};
