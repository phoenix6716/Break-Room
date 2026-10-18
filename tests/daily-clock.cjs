const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = {Intl, Date, Object, String, Number, Math};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../daily-clock.js'), 'utf8'), context);
const clock = context.MIDNIGHT_ARCADE_CLOCK;
const cases = [
 ['2026-10-18T12:59:59.000Z','2026-10-18','2026-10-18T13:00:00.000Z','00:00:01'],
 ['2026-10-18T13:00:00.000Z','2026-10-19','2026-10-19T13:00:00.000Z','24:00:00'],
 ['2026-04-04T13:00:00.000Z','2026-04-05','2026-04-05T14:00:00.000Z','25:00:00'],
 ['2026-10-03T14:00:00.000Z','2026-10-04','2026-10-04T13:00:00.000Z','23:00:00'],
 ['2026-12-31T12:59:59.999Z','2026-12-31','2026-12-31T13:00:00.000Z','00:00:01'],
 ['2026-12-31T13:00:00.000Z','2027-01-01','2027-01-01T13:00:00.000Z','24:00:00'],
 ['2026-04-04T16:00:00.000Z','2026-04-05','2026-04-05T14:00:00.000Z','22:00:00']
];
for (const [iso, day, reset, display] of cases) {
 const now = new Date(iso);
 assert.equal(clock.dayKey(now), day);
 assert.equal(new Date(clock.nextResetAt(now)).toISOString(), reset);
 assert.equal(clock.countdown(now), display);
}
assert.equal(clock.previousDay('2024-03-01'),'2024-02-29');
assert.equal(clock.previousDay('2027-01-01'),'2026-12-31');
console.log('PASS: shared calendar, midnight, year/leap boundaries, 23-hour/25-hour DST days, countdown precision.');
