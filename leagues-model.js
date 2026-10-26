/* Display metadata only. Membership and scoring are authoritative on the server. */
(root=>{'use strict';
const games=[['laser','Laser'],['time-drop','Time Drop'],['clue-ladder','Clue Ladder'],['seating-chart','Seating Chart'],['shift-work','Desk Jam'],['hidden-gem','Sleeper'],['stack-up','Stack Up'],['pack','Pack'],['lowball','Lowball'],['inner-clock','Time Sense']];
const name=id=>games.find(g=>g[0]===id)?.[1]||'Unknown game';
const invite=value=>{const v=String(value).trim();if(/^[a-f0-9]{32}$/.test(v))return v;try{const u=new URL(v);const token=new URLSearchParams(u.hash.slice(1)).get('join');return /^[a-f0-9]{32}$/.test(token)?token:null;}catch{return null;}};
root.BREAK_ROOM_LEAGUES=Object.freeze({games,name,invite});
})(typeof window==='undefined'?globalThis:window);
