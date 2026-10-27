/* Legacy launcher: only current games can be opened. Never initialise a native engine. */
(() => {
  if (!document.querySelector('[data-game-launcher]')) return;
  const id=new URLSearchParams(location.search).get('id');
  const game=(window.MIDNIGHT_ARCADE_GAMES||[]).find(game=>game.id===id&&game.status==='live');
  const base=new URL('.',document.currentScript.src);
  location.replace(new URL(game?'games/'+game.id+'/index.html':'index.html',base));
})();
