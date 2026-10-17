/* Evdiş Aşama 0+2: Mobil 3x2 Teknoloji Izgarası, 3x3 Branş Izgarası, 3 Katmanlı Galeri Kaydırma Kontrolü, Tıkla-Oynat Video & Çerezsiz Sayaç */
(function () {
  'use strict';

  function sayacGonder(olay, hedef) {
    try {
      var veri = JSON.stringify({
        olay: olay,
        sayfa: (location.pathname.split('/').pop() || 'index.html'),
        hedef: hedef || '',
        dil: document.documentElement.lang || 'tr',
        ekran: window.innerWidth <= 768 ? 'mobil' : 'masaustu'
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/evdis-anonim-sayac', new Blob([veri], { type: 'application/json' }));
      } else {
        fetch('/api/evdis-anonim-sayac', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: veri, keepalive: true }).catch(function () {});
      }
    } catch (e) {}
  }

  function videoArenaIlklendir() {
    var kartlar = document.querySelectorAll('#videoArena .v-card');
    kartlar.forEach(function (kart) {
      var v = kart.querySelector('video');
      if (!v) return;
      var merkezMi = kart.classList.contains('pos-0');
      if (!merkezMi) {
        v.preload = 'none';
        try { v.pause(); } catch (e) {}
      }
      kart.addEventListener('click', function () {
        var vid = kart.querySelector('video');
        if (!vid) return;
        if (!vid.getAttribute('src') && vid.dataset.src) {
          vid.src = vid.dataset.src;
          vid.load();
        }
        vid.play().catch(function () {});
        sayacGonder('video_oynat', vid.dataset.src || vid.currentSrc || 'v-card');
      });
    });
  }

  /* A) SONUÇ ODAKLI TEKNOLOJİ (.av-tech-rows) — 3x2 Kompakt Çip Izgarası & Numara Rozeti */
  function teknolojiIzgarasiIlklendir() {
    var tImg = document.getElementById('techImg');
    if (tImg) { tImg.loading = 'eager'; }
    var satirlar = document.querySelectorAll('.av-tech-rows .av-tech-row');
    if (!satirlar.length) return;
    var kisaBasliklar = [
      'CEREC 3B Optik Tarama',
      '25× Operasyon Mikroskobu',
      '3B CBCT Tomografi',
      'CAD/CAM Protez Lab.',
      'Genel Anestezi Birimi',
      'Dijital Hasta Rehberi'
    ];
    var mobilMi = window.innerWidth <= 768;
    satirlar.forEach(function (satir, idx) {
      var no = idx < 9 ? '0' + (idx + 1) : String(idx + 1);
      satir.setAttribute('data-no', no);
      var baslikEl = satir.querySelector('.av-tech-row-title');
      if (!baslikEl) return;
      if (!baslikEl.dataset.tamBaslik) {
        baslikEl.dataset.tamBaslik = baslikEl.textContent.trim();
      }
      if (mobilMi && kisaBasliklar[idx]) {
        baslikEl.textContent = kisaBasliklar[idx];
      } else if (!mobilMi && baslikEl.dataset.tamBaslik) {
        baslikEl.textContent = baslikEl.dataset.tamBaslik;
      }
    });
  }

  /* B1) KLİNİK UZMANLIK BRANŞLARI (.av-services-cat-nav) — 3x3 Kompakt Çip Izgarası */
  function bransSekmeleriIlklendir() {
    var nav = document.querySelector('.av-services-cat-nav');
    if (nav && !nav.querySelector('[data-tumu="1"]')) {
      var tumuBtn = document.createElement('button');
      tumuBtn.type = 'button';
      tumuBtn.className = 'av-services-cat-btn a0-mobil';
      tumuBtn.dataset.tumu = '1';
      tumuBtn.textContent = 'Tümü (8)';
      tumuBtn.addEventListener('click', function () {
        nav.querySelectorAll('.av-services-cat-btn').forEach(function (b) { b.classList.remove('active'); });
        tumuBtn.classList.add('active');
        var baslik = document.getElementById('srvUnifiedTitle');
        if (baslik) baslik.textContent = 'Tüm Uzmanlık Branşlarımız (8 Branş · 20 Hekim)';
        sayacGonder('brans_secim', 'tumu');
      });
      nav.appendChild(tumuBtn);
    }

    if (nav) {
      var dugmeler = nav.querySelectorAll('.av-services-cat-btn');
      var kisaBranslar = [
        'Estetik & Dijital',
        'Çene Cerrahisi',
        'Protetik Tedavi',
        'Endodonti',
        'Radyoloji',
        'Ortodonti',
        'Periodontoloji',
        'Pedodonti & Anestezi',
        'Tümü (8)'
      ];
      var mobilMi = window.innerWidth <= 768;
      dugmeler.forEach(function (btn, idx) {
        if (!btn.dataset.tamBrans) {
          btn.dataset.tamBrans = btn.textContent.trim();
        }
        if (mobilMi && kisaBranslar[idx]) {
          btn.textContent = kisaBranslar[idx];
        } else if (!mobilMi && btn.dataset.tamBrans) {
          btn.textContent = btn.dataset.tamBrans;
        }
      });
    }

    var izgaralar = document.querySelectorAll('.hekim-izgara');
    izgaralar.forEach(function (izgara) {
      var kartlar = Array.prototype.slice.call(izgara.querySelectorAll('.hekim-kart'));
      if (kartlar.length <= 6 || izgara.dataset.a0Islendi) return;
      izgara.dataset.a0Islendi = '1';
    });
  }

  /* B2) YATAY KART GALERİLERİ (.av-experts-cols, .av-ig-life-grid, .konfor-izgara, .hekim-izgara)
     Üstte "‹ Kaydırın · 1/N ›" kontrol şeridi, altta canlı altın ilerleme çubuğu */
  function yatayGalerileriIlklendir() {
    if (window.innerWidth > 768) return;
    var dil = (document.documentElement.lang || 'tr').toLowerCase();
    var etiket = dil.indexOf('en') === 0 ? 'Swipe cards' : (dil.indexOf('ar') === 0 ? 'اسحب البطاقات' : 'Sağa kaydırın');

    var seciciler = ['.av-experts-cols', '.av-ig-life-grid', '.konfor-izgara', '.hekim-izgara'];
    seciciler.forEach(function (secici) {
      document.querySelectorAll(secici).forEach(function (galeri) {
        if (galeri.dataset.a0GaleriBar === '1') return;
        var kartlar = galeri.children;
        if (!kartlar || kartlar.length < 2) return;
        galeri.dataset.a0GaleriBar = '1';
        var toplam = kartlar.length;

        var ustBar = document.createElement('div');
        ustBar.className = 'a0-galeri-ust-bar a0-mobil';
        ustBar.innerHTML =
          '<span class="a0-galeri-sayac">↔ ' + etiket + ' · <strong>1 / ' + toplam + '</strong></span>' +
          '<span class="a0-galeri-oklar">' +
            '<button type="button" class="a0-galeri-ok" data-yon="-1" aria-label="Önceki kart">‹</button>' +
            '<button type="button" class="a0-galeri-ok" data-yon="1" aria-label="Sonraki kart">›</button>' +
          '</span>';

        var altIz = document.createElement('div');
        altIz.className = 'a0-galeri-alt-iz a0-mobil';
        var altDolgu = document.createElement('div');
        altDolgu.className = 'a0-galeri-alt-dolgu';
        altIz.appendChild(altDolgu);

        galeri.parentNode.insertBefore(ustBar, galeri);
        if (galeri.nextSibling) {
          galeri.parentNode.insertBefore(altIz, galeri.nextSibling);
        } else {
          galeri.parentNode.appendChild(altIz);
        }

        var sayacStrong = ustBar.querySelector('strong');
        function guncelle() {
          var maxScroll = Math.max(1, galeri.scrollWidth - galeri.clientWidth);
          var oran = Math.min(1, Math.max(0, galeri.scrollLeft / maxScroll));
          var aktifNo = Math.min(toplam, Math.max(1, Math.round(oran * (toplam - 1)) + 1));
          if (sayacStrong) {
            sayacStrong.textContent = aktifNo + ' / ' + toplam;
          }
          var minGenislik = Math.max(18, Math.round(100 / toplam));
          var genislik = minGenislik + Math.round(oran * (100 - minGenislik));
          altDolgu.style.width = genislik + '%';
        }

        galeri.addEventListener('scroll', guncelle, { passive: true });
        ustBar.querySelectorAll('.a0-galeri-ok').forEach(function (okBtn) {
          okBtn.addEventListener('click', function () {
            var yon = parseInt(okBtn.getAttribute('data-yon') || '1', 10);
            var ilkKart = galeri.children[0];
            var adim = ilkKart ? (ilkKart.getBoundingClientRect().width + 12) : 260;
            galeri.scrollBy({ left: yon * adim, behavior: 'smooth' });
          });
        });
        guncelle();
      });
    });
  }

  function tiklamaIzle() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a, button');
      if (!a) return;
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
        sayacGonder('whatsapp_tik', href);
      } else if (href.indexOf('tel:') === 0) {
        sayacGonder('telefon_tik', href);
      } else if (a.id === 'evdis-ajan-fab' || a.hasAttribute('data-evdis-ajan-ac')) {
        sayacGonder('rehber_ac', a.id || 'data-evdis-ajan-ac');
      } else if (a.classList.contains('av-services-cat-btn') || a.classList.contains('sekme-dugme')) {
        sayacGonder('brans_secim', (a.textContent || '').trim().slice(0, 32));
      }
    }, { passive: true });
  }

  function baslat() {
    sayacGonder('sayfa_acilis', document.title.slice(0, 40));
    videoArenaIlklendir();
    teknolojiIzgarasiIlklendir();
    bransSekmeleriIlklendir();
    yatayGalerileriIlklendir();
    tiklamaIzle();
    window.addEventListener('resize', function () {
      teknolojiIzgarasiIlklendir();
      bransSekmeleriIlklendir();
      yatayGalerileriIlklendir();
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', baslat);
  } else {
    baslat();
  }
})();
