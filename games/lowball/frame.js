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

/* Fit the redesigned board to its content, including results and phone layouts. */
(() => {
  const frame = document.getElementById('lowball-game-frame');
  let observer;
  frame.addEventListener('load', () => {
    observer?.disconnect();
    const body = frame.contentDocument.body;
    const wrap = body.querySelector('.wrap');
    const resize = () => {
      const style = frame.contentWindow.getComputedStyle(body);
      const height = Math.ceil(wrap.getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + 8);
      if (Math.abs(frame.getBoundingClientRect().height - height) > 2) frame.style.height = `${height}px`;
    };
    observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
  });
})();
