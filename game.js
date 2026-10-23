/* Placeholder availability controller. The HTML retains the approved game template. */
(() => {
  const title = document.getElementById('game-title');
  // Lowball and Stake own their engines and must not initialize this template.
  if (!title) return;
  const route = location.pathname.match(/\/games\/([^/]+)(?:\/|$)/);
  const id = new URLSearchParams(location.search).get('id') || (route && route[1]) || 'pixel-pairs';
  const game = (window.MIDNIGHT_ARCADE_GAMES || []).find(game => game.id === id);
  if (!game) { title.textContent = 'Cabinet not found'; return; }
  if (['clue-ladder', 'time-drop', 'lowball', 'stake', 'stack-up', 'pack', 'prior', 'laser', 'alibi', 'bouncer', 'inner-clock'].includes(game.id)) {
    location.replace(new URL(`games/${game.id}/index.html`, location.href));
    return;
  }
  const text = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };
  document.title = `${game.title} · Coming soon · Break Room`;
  text('game-title', game.title);
  text('game-category', `${game.category} / COMING SOON`);
  text('game-description', game.description);
  text('game-instructions', 'This game is coming soon. A new daily challenge is on its way.');
  text('max-score', 'IN DEVELOPMENT');
  text('attempt-status', 'COMING SOON');
  text('start-game', 'COMING SOON');
  document.getElementById('start-game').disabled = true;
  ['game-playing', 'game-results', 'game-used'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.hidden = true;
  });
})();
