/* Keep engine dialogs inside the visible part of the embedded game. */
(() => {
  const frame = document.getElementById('lowball-game-frame');
  let queued = false;
  const updateViewport = () => {
    queued = false;
    const root = frame.contentDocument && frame.contentDocument.documentElement;
    if (!root) return;
    const rect = frame.getBoundingClientRect();
    const viewportTop = window.visualViewport?.offsetTop || 0;
    const viewportBottom = viewportTop + (window.visualViewport?.height || window.innerHeight);
    const top = Math.max(0, viewportTop - rect.top);
    const height = Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(viewportTop, rect.top));
    root.style.setProperty('--embed-visible-top', `${top}px`);
    root.style.setProperty('--embed-visible-height', `${height}px`);
  };
  const scheduleUpdate = () => {
    if (!queued) { queued = true; requestAnimationFrame(updateViewport); }
  };
  frame.addEventListener('load', updateViewport);
  window.addEventListener('scroll', scheduleUpdate, {passive: true});
  window.addEventListener('resize', scheduleUpdate);
  window.visualViewport?.addEventListener('resize', scheduleUpdate);
  window.visualViewport?.addEventListener('scroll', scheduleUpdate);
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

/* Dialog focus cannot escape the iframe into the outer header/footer. */
(() => {
  const frame = document.getElementById('lowball-game-frame');
  let background = [], overflow = null;
  function setDialog(open) {
    if (open && overflow === null) {
      overflow = document.body.style.overflow;
      background = [...document.body.children].filter(el => !el.contains(frame) && !['SCRIPT','STYLE','LINK'].includes(el.tagName)).map(el => [el, el.inert]);
      background.forEach(([el]) => { el.inert = true; });
      document.body.style.overflow = 'hidden';
    } else if (!open && overflow !== null) {
      background.forEach(([el, inert]) => { el.inert = inert; }); background = [];
      document.body.style.overflow = overflow; overflow = null;
    }
  }
  frame.addEventListener('load', () => {
    setDialog(false);
    frame.contentWindow.addEventListener('lowball:dialog', event => setDialog(event.detail.open));
    setDialog(!!frame.contentDocument.querySelector('.modal.show'));
  });
})();
