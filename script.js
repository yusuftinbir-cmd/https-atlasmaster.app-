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

// Önce/sonra kaydırıcı (örnek bloğu) — JS yoksa iki kare yan yana/alt alta görünür
document.addEventListener('DOMContentLoaded', function () {
  var st = document.querySelector('[data-ba]');
  if (!st) return;
  var tr = document.documentElement.lang === 'tr';
  st.classList.add('js');
  var bar = document.createElement('div'); bar.className = 'ba-bar'; bar.setAttribute('aria-hidden', 'true');
  var r = document.createElement('input'); r.type = 'range'; r.min = 0; r.max = 100; r.value = 50; r.className = 'ba-range';
  r.setAttribute('aria-label', tr ? 'Önce / sonra kaydırıcı' : 'Before / after slider');
  st.appendChild(bar); st.appendChild(r);
  function set() { st.style.setProperty('--p', r.value + '%'); }
  r.addEventListener('input', set); set();
});

// Mobil menü: dar ekranda bölüm bağlantılarını açar/kapatır (JS yoksa düğme gizli kalır)
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.menu'), nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.hidden = false;
  function set(v) { nav.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); }
  btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !btn.contains(e.target)) set(false); });
});
