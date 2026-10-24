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

// Menü paneli: bölüm bağlantılarını açar/kapatır (JS yoksa düğme gizli kalır)
// Açılınca odak ilk bağlantıya, Escape/düğmeyle kapanınca düğmeye döner.
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.menu'), nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.hidden = false;
  function set(v, focus) {
    if (nav.classList.contains('open') === v) return;
    nav.classList.toggle('open', v); btn.setAttribute('aria-expanded', v);
    if (!focus) return;
    var to = v ? nav.querySelector('a[aria-current]') || nav.querySelector('a') : btn;
    if (to) to.focus({ preventScroll: true });
  }
  btn.addEventListener('click', function () { set(!nav.classList.contains('open'), true); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  nav.addEventListener('focusout', function (e) {
    if (e.relatedTarget && !nav.contains(e.relatedTarget) && !btn.contains(e.relatedTarget)) set(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false, true); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !btn.contains(e.target)) set(false); });
});

// Menüde yön: bulunulan sayfanın bağlantısı aria-current="page" (alt sayfada üst bağlantı "true"),
// sayfa içi bölümlerde o an okunan bölümün bağlantısı aria-current="location" alır.
document.addEventListener('DOMContentLoaded', function () {
  function yol(u) { return u.pathname.replace(/index\.html$/, ''); }
  var here = yol(location), spy = [];
  [].forEach.call(document.querySelectorAll('.top a, .toc a'), function (a) {
    var u; try { u = new URL(a.href); } catch (e) { return; }
    if (u.origin !== location.origin || a.classList.contains('lang')) return;
    var p = yol(u);
    if (p === here && u.hash) {
      var t = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (t) spy.push({ a: a, t: t });
    } else if (p === here) a.setAttribute('aria-current', 'page');
    else if (/\.html$/.test(p) && here.indexOf(p.replace(/\.html$/, '/')) === 0) a.setAttribute('aria-current', 'true');
  });
  if (!spy.length || !('IntersectionObserver' in window)) return;
  // Okuma çizgisi: görünür alanın üstten %30'u; çizgiyi en son geçen bölüm "o anki" bölümdür.
  function mark() {
    var line = innerHeight * 0.3, end = innerHeight + scrollY >= document.documentElement.scrollHeight - 2, cur = null;
    spy.forEach(function (s) { if (end || s.t.getBoundingClientRect().top <= line) cur = s.t; });
    spy.forEach(function (s) {
      if (s.t === cur) s.a.setAttribute('aria-current', 'location'); else s.a.removeAttribute('aria-current');
    });
  }
  var io = new IntersectionObserver(mark, { rootMargin: '0px 0px -70% 0px' });
  spy.forEach(function (s) { io.observe(s.t); });
  addEventListener('scrollend', mark);
  mark();
});
