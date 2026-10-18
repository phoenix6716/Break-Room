/* Keep engine dialogs inside the visible part of the embedded game. */
(() => {
  const frame = document.getElementById('lowball-game-frame');
  let queued = false;
  const updateViewport = () => {
    queued = false;
    const root = frame.contentDocument && frame.contentDocument.documentElement;
    if (!root) return;
    const rect = frame.getBoundingClientRect();
    const top = Math.max(0, -rect.top);
    const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top));
    root.style.setProperty('--embed-visible-top', `${top}px`);
    root.style.setProperty('--embed-visible-height', `${height}px`);
  };
  const scheduleUpdate = () => {
    if (!queued) { queued = true; requestAnimationFrame(updateViewport); }
  };
  frame.addEventListener('load', updateViewport);
  window.addEventListener('scroll', scheduleUpdate, {passive: true});
  window.addEventListener('resize', scheduleUpdate);
  updateViewport();
})();
