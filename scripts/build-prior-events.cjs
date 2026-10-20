/* Authoritative, scoped historical events. Keep snapshots stable when editing the bank. */
const fs=require('node:fs');require('../prior-model.js');const M=global.BREAK_ROOM_PRIOR,source=JSON.parse(fs.readFileSync('content/prior-events.json','utf8')),events=source.events;
if(source.version!==1||events.length<100||new Set(events.map(e=>e.id)).size!==events.length||new Set(events.map(e=>e.title)).size!==events.length||!events.every(M.event))throw Error('Invalid or insufficient Prior bank.');
for(const e of events)if(/\b(?:1\d{3}|20\d{2})\b/.test(e.title))throw Error('Year leaks into event title: '+e.id);
for(const tier of ['easy','medium','hard'])if(M.candidates(events,tier).length<50)throw Error('Not enough '+tier+' pairs.');
fs.writeFileSync('games/prior/events.js','/* Generated from content/prior-events.json. Years/facts/sources are revealed only after a choice. */\nwindow.PRIOR_EVENTS='+JSON.stringify(events)+';\n');console.log('Built '+events.length+' scoped events with easy/medium/hard pair coverage.');
