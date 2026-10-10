// Atlas — blog yazıları: mobil içindekiler (≤900 px; görünüm blog.css'te)
// Yazının başında kapalı başlayan açılır liste; aşağı kaydırınca ekranın altında beliren "Bölümler"
// düğmesi aynı listeyi alt panelde açar. JS yoksa liste açık kalır; masaüstü yan listeye dokunmaz.
document.addEventListener('DOMContentLoaded', function () {
  var toc = document.querySelector('.toc'), list = toc && toc.querySelector('ol');
  if (!list) return;
  if (!list.id) list.id = 'toc-liste';
  var mq = matchMedia('(max-width: 900px)'), by = null; // by: listeyi açmış olan düğme

  function dugme(cls, text) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = text;
    b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', list.id);
    return b;
  }
  var ac = dugme('toc-ac', 'İçindekiler'), fab = dugme('toc-fab', 'Bölümler');
  toc.insertBefore(ac, list); toc.appendChild(fab); toc.classList.add('js');

  // Kapanınca odak, istenirse, açan düğmeye döner.
  function kapat(focus) {
    if (!by) return;
    var b = by; by = null;
    toc.classList.remove('open', 'alt'); b.setAttribute('aria-expanded', 'false');
    if (focus) b.focus({ preventScroll: true });
  }
  // Alt panelde odak o an okunan bölümün bağlantısına geçer; baştaki açılır listede düğmede kalır.
  function ac_(b) {
    kapat(); by = b;
    toc.classList.add('open'); toc.classList.toggle('alt', b === fab); b.setAttribute('aria-expanded', 'true');
    if (b !== fab) return;
    var a = list.querySelector('a[aria-current]') || list.querySelector('a');
    if (a) { a.focus({ preventScroll: true }); a.scrollIntoView({ block: 'nearest' }); }
  }
  [ac, fab].forEach(function (b) {
    b.addEventListener('click', function () { if (by === b) kapat(true); else ac_(b); });
  });
  list.addEventListener('click', function (e) { if (e.target.closest('a')) kapat(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mq.matches) kapat(true); });
  document.addEventListener('click', function (e) { if (by === fab && !toc.contains(e.target)) kapat(); });
  toc.addEventListener('focusout', function (e) {
    if (by === fab && e.relatedTarget && !toc.contains(e.relatedTarget)) kapat();
  });

  // "Bölümler" düğmesi, baştaki liste ekranın üstünden çıkınca görünür.
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (es) {
    var e = es[es.length - 1], gor = !e.isIntersecting && e.boundingClientRect.top < 0;
    fab.classList.toggle('gor', gor);
    if (!gor && by === fab) kapat();
  }).observe(ac);
});
