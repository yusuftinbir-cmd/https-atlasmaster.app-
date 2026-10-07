// Atlas — tema düğmesi (sistem tercihi varsayılan; seçim cihazda saklanır)
(function () {
  var root = document.documentElement, key = 'atlas-tema', saved = null;
  try { saved = localStorage.getItem(key); } catch (e) {}
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function current() {
    return root.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme');
    if (!btn) return;
    btn.hidden = false;
    btn.setAttribute('aria-pressed', current() === 'dark');
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      btn.setAttribute('aria-pressed', next === 'dark');
      try { localStorage.setItem(key, next); } catch (e) {}
    });
  });
})();
