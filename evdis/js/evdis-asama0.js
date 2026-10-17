/* EvDiş AŞAMA 0 (17 Eki) — çerezsiz anonim etkileşim sayacı + mobil branş sekmeleri.
   Sayaç: IP / User-Agent / çerez / kimlik GÖNDERMEZ; yalnız {olay, hedef, dil} yollar, gün sunucuda eklenir. */
(function () {
  'use strict';
  var UC = '/api/evdis-anonim-sayac';
  var DIL = ((document.documentElement.getAttribute('lang') || 'tr').slice(0, 2)).toLowerCase();

  function evdisSay(olay, hedef) {
    try {
      if (!navigator.sendBeacon) return;
      var veri = JSON.stringify({ olay: olay, hedef: String(hedef || '').slice(0, 60), dil: DIL });
      navigator.sendBeacon(UC, new Blob([veri], { type: 'text/plain;charset=UTF-8' }));
    } catch (e) { /* sayaç asla sayfayı bozmaz */ }
  }
  window.evdisSay = evdisSay;

  // Randevu / arama / WhatsApp düğmeleri
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/randevu\.evdis/i.test(h)) evdisSay('randevu_tik', 'online-randevu');
    else if (/randevu/i.test(h)) evdisSay('randevu_tik', 'randevu-sayfa');
    else if (/^tel:/i.test(h)) evdisSay('randevu_tik', 'telefon');
    else if (/wa\.me|whatsapp/i.test(h)) evdisSay('randevu_tik', 'whatsapp');
  }, { capture: true, passive: true });

  // Branş sekmeleri (ana sayfa uzmanlık düğmeleri + EN/AR hekim filtreleri)
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.av-services-cat-btn, .sekme-dugme') : null;
    if (b) evdisSay('brans_sekme', (b.dataset.sekme || b.textContent || '').trim());
  }, { capture: true, passive: true });

  // EN/AR: tedavi kartlarının üstüne branş seçici sekme çubuğu (yalnız mobilde görünür, CSS ile)
  function bransCubugu() {
    var izgara = document.querySelector('.tedavi-izgara');
    if (!izgara || izgara.classList.contains('a0-sekmeli')) return;
    var kartlar = Array.prototype.slice.call(izgara.querySelectorAll(':scope > .tedavi-kart'));
    if (kartlar.length < 2) return;
    var TUMU = { tr: 'Tümü', en: 'All', ar: 'الكل' }[DIL] || 'Tümü';
    var cubuk = document.createElement('div');
    cubuk.className = 'a0-brans-cubugu';
    cubuk.setAttribute('role', 'tablist');
    cubuk.setAttribute('aria-label', DIL === 'ar' ? 'اختيار التخصص' : (DIL === 'en' ? 'Choose a specialty' : 'Branş seçin'));
    function sec(i, say) {
      var tumu = i < 0;
      izgara.classList.toggle('a0-tumu', tumu);
      kartlar.forEach(function (k, j) { k.classList.toggle('a0-acik', j === i); });
      Array.prototype.forEach.call(cubuk.children, function (d) {
        d.setAttribute('aria-selected', String(+d.dataset.i === i));
      });
      if (say) evdisSay('brans_sekme', tumu ? 'tumu' : (kartlar[i].id || ('kart' + i)));
    }
    kartlar.forEach(function (k, i) {
      var h = k.querySelector('h3');
      var ad = (h ? h.textContent : 'Branş ' + (i + 1)).replace(/\s*\(.*?\)\s*/g, ' ').trim();
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'a0-brans-sekme'; d.setAttribute('role', 'tab');
      d.dataset.i = i; d.textContent = ad;
      d.addEventListener('click', function () { sec(i, true); });
      cubuk.appendChild(d);
    });
    var t = document.createElement('button');
    t.type = 'button'; t.className = 'a0-brans-sekme'; t.setAttribute('role', 'tab');
    t.dataset.i = -1; t.textContent = TUMU;
    t.addEventListener('click', function () { sec(-1, true); });
    cubuk.appendChild(t);
    izgara.classList.add('a0-sekmeli');
    izgara.parentNode.insertBefore(cubuk, izgara);
    sec(0, false);
  }

  // Ana sayfa: organizasyon şemasında branş/birim detayını mobilde "aç" düğmesine bağla
  function semaAcKapa() {
    var w = document.querySelector('#organizasyon-semasi .avo-wrap');
    if (!w || w.querySelector('.a0-sema-ac')) return;
    var kollar = w.querySelector('.avo-kollar');
    if (!kollar) return;
    var ACIK = '8 klinik branş ve destek birimlerini aç ▾', KAPALI = 'Şemayı daralt ▴';
    var d = document.createElement('button');
    d.type = 'button'; d.className = 'a0-sema-ac'; d.textContent = ACIK;
    d.setAttribute('aria-expanded', 'false');
    d.addEventListener('click', function () {
      var kapali = w.classList.toggle('a0-kapali');
      d.textContent = kapali ? ACIK : KAPALI;
      d.setAttribute('aria-expanded', String(!kapali));
    });
    kollar.parentNode.insertBefore(d, kollar.nextSibling);
    w.classList.add('a0-kapali');
  }

  function kur() { bransCubugu(); semaAcKapa(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();
})();
