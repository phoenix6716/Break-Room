/* Shared drawer for every game route. Keep it outside header stacking contexts. */
(() => {
  const button = document.getElementById('game-menu-toggle');
  const menu = document.getElementById('game-menu');
  if (!button || !menu) return;
  // Shelved games keep their routes/saves, but are absent from the active drawer.
  menu.querySelectorAll('a[href]').forEach(link => {
    if (/\/games\/(?:alibi|bouncer|prior|stake)\//.test(new URL(link.href).pathname)) link.remove();
  });
  if(!menu.querySelector('a[href*="/games/time-drop/"]')){const link=document.createElement('a');link.href=new URL('games/time-drop/index.html',new URL('.',document.currentScript.src)).href;link.textContent='Time Drop';const laser=menu.querySelector('a[href*="/games/laser/"]');if(laser)laser.after(link);}
  if(!menu.querySelector('a[href*="/games/clue-ladder/"]')){const link=document.createElement('a');link.href=new URL('games/clue-ladder/index.html',new URL('.',document.currentScript.src)).href;link.textContent='Clue Ladder';const after=menu.querySelector('a[href*="/games/time-drop/"]');if(after)after.after(link);}
  if(!menu.querySelector('a[href*="/games/seating-chart/"]')){const link=document.createElement('a');link.href=new URL('games/seating-chart/index.html',new URL('.',document.currentScript.src)).href;link.textContent='Seating Chart';const after=menu.querySelector('a[href*="/games/clue-ladder/"]');if(after)after.after(link);}
  if(!menu.querySelector('a[href*="/games/shift-work/"]')){const link=document.createElement('a');link.href=new URL('games/shift-work/index.html',new URL('.',document.currentScript.src)).href;link.textContent='Shift Work';const after=menu.querySelector('a[href*="/games/seating-chart/"]');if(after)after.after(link);}
  if(!menu.querySelector('a[href*="/games/hidden-gem/"]')){const link=document.createElement('a');link.href=new URL('games/hidden-gem/index.html',new URL('.',document.currentScript.src)).href;link.textContent='Hidden Gem';const after=menu.querySelector('a[href*="/games/shift-work/"]');if(after)after.after(link);}
  document.body.appendChild(menu);
  const backdrop = document.createElement('div');
  backdrop.className = 'game-menu-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);
  let background = [];
  const closeMenu = (restoreFocus = true) => {
    menu.hidden = true;
    menu.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('game-menu-open');
    background.forEach(([element, wasInert]) => { element.inert = wasInert; });
    background = [];
    if (restoreFocus) button.focus();
  };
  const openMenu = () => {
    menu.hidden = false;
    menu.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('game-menu-open');
    background = [...document.body.children]
      .filter(element => element !== menu && element !== backdrop && !['SCRIPT', 'STYLE'].includes(element.tagName))
      .map(element => [element, element.inert]);
    background.forEach(([element]) => { element.inert = true; });
    menu.querySelector('#game-menu-close').focus();
  };
  button.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
  menu.querySelector('#game-menu-close').addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key !== 'Tab') return;
    const items = [...menu.querySelectorAll('button, a[href]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
