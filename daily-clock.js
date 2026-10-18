/* One daily boundary for every Midnight Arcade game, independent of device timezone. */
(root => {
  const timeZone = 'Australia/Sydney';
  const calendar = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const parts = (date = new Date()) => {
    const values = Object.fromEntries(calendar.formatToParts(date).map(part => [part.type, part.value]));
    return {year: Number(values.year), month: Number(values.month), day: Number(values.day)};
  };
  const pad = number => String(number).padStart(2, '0');
  const dayKey = (date = new Date()) => {
    const p = parts(date);
    return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
  };
  const previousDay = key => {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
  };
  let cachedKey, cachedReset;
  const nextResetAt = (date = new Date()) => {
    const key = dayKey(date);
    if (cachedKey === key) return cachedReset;
    // Find the next calendar boundary. A fixed 24-hour offset fails on DST days.
    let low = Math.floor(date.getTime() / 1000);
    let high = low + 27 * 60 * 60;
    while (high - low > 1) {
      const middle = Math.floor((low + high) / 2);
      if (dayKey(new Date(middle * 1000)) === key) low = middle;
      else high = middle;
    }
    cachedKey = key;
    cachedReset = high * 1000;
    return cachedReset;
  };
  const secondsUntilReset = (date = new Date()) => Math.max(0, Math.ceil((nextResetAt(date) - date.getTime()) / 1000));
  const countdown = (date = new Date()) => {
    const seconds = secondsUntilReset(date);
    return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds % 3600 / 60))}:${pad(seconds % 60)}`;
  };
  root.MIDNIGHT_ARCADE_CLOCK = Object.freeze({timeZone, parts, dayKey, previousDay, nextResetAt, secondsUntilReset, countdown});
  if (!root.document) return;
  const bind = () => {
    const outputs = [...root.document.querySelectorAll('[data-daily-countdown]')];
    if (!outputs.length) return;
    const update = () => {
      const now = new Date();
      outputs.forEach(output => { output.textContent = countdown(now); });
    };
    update();
    root.setInterval(update, 1000);
    root.document.addEventListener('visibilitychange', update);
    root.addEventListener('pageshow', update);
  };
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', bind, {once: true});
  else bind();
})(typeof window === 'undefined' ? globalThis : window);
