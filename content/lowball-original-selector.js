/* Frozen v1 selector for historical/snapshotless-save compatibility checks only. */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const cycleCache = {};
function cycleOrder(cycle, n) {
  const key = cycle + ":" + n;
  if (cycleCache[key]) return cycleCache[key];
  const rnd = mulberry32(cycle * 7919 + 13);
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (cycle > 0) {
    // Keep recently used items away from the start of the next cycle so repeats stay far apart.
    const recent = new Set(cycleOrder(cycle - 1, n).slice(-12));
    const out = arr.filter(x => !recent.has(x)).concat(arr.filter(x => recent.has(x)));
    return (cycleCache[key] = out);
  }
  return (cycleCache[key] = arr);
}
function pickDailyItems() {
  // Every item appears once per cycle, so no repeats until the whole pool has been used.
  const n = ITEMS.length;
  const day = Math.max(0, dayNumber());
  const picks = [];
  for (let g = day * ROUNDS_PER_DAY; picks.length < ROUNDS_PER_DAY; g++) {
    const idx = cycleOrder(Math.floor(g / n), n)[g % n];
    if (!picks.includes(idx)) picks.push(idx);
  }
  return picks.map(i => ITEMS[i]);
}
