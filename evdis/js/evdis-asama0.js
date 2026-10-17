/* Evdiş Aşama 0+2: Mobil 3x2 Teknoloji Izgarası, 3x3 Branş Izgarası, 2 Sütun Hekim Izgarası (Sağa Kaydırmasız) & Çerezsiz Sayaç */
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
        'Radyoloji & 3B CBCT',
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
  }

  /* B2) YATAY MEDYA GALERİLERİ (.av-ig-life-grid, .konfor-izgara)
     Hekim ızgaralarında (.av-experts-cols, .hekim-izgara) sağa kaydırma YOKTUR (2 sütun dikey ızgara) */
  function yatayGalerileriIlklendir() {
    if (window.innerWidth > 768) return;
    var dil = (document.documentElement.lang || 'tr').toLowerCase();
    var etiket = dil.indexOf('en') === 0 ? 'Swipe cards' : (dil.indexOf('ar') === 0 ? 'اسحب البطاقات' : 'Sağa kaydırın');

    var seciciler = ['.av-ig-life-grid', '.konfor-izgara'];
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
    dd2HudVeKodeksIlklendir();
    nirengiVeTiklamalariIlklendir();
    tiklamaIzle();
    window.addEventListener('resize', function () {
      teknolojiIzgarasiIlklendir();
      bransSekmeleriIlklendir();
      yatayGalerileriIlklendir();
    }, { passive: true });
  }



  // #organizasyon-semasi bağlantısına tıklandığında katlanır yönetim şemasını otomatik aç
  function openOrgIfTargeted() {
    if (location.hash === '#organizasyon-semasi' || location.hash === '#avo-katlanir-sema') {
      var d = document.querySelector('details.avo-master-details');
      if (d) d.open = true;
    }
  }
  window.addEventListener('hashchange', openOrgIfTargeted);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#organizasyon-semasi"]');
    if (a) {
      var d = document.querySelector('details.avo-master-details');
      if (d) d.open = true;
    }
  });
  openOrgIfTargeted();


  // =========================================================================
  // DRAGON'S DOGMA 2 / AAA RPG HUD & INTERACTIVE CODEX (v5 · 17 Eki 2026)
  // Hiçbir şey aramadan tek dokunuşla 9 Branş, 20 Hekim ve Konu Kodeksine geçiş
  // =========================================================================
  var DD2_VOCATIONS = [
    { roman: 'I',   name: 'İmplant & Cerrahi', href: 'implant-ve-cene-cerrahisi.html' },
    { roman: 'II',  name: 'Endodonti (25×)',   href: 'tedavi-endodonti.html' },
    { roman: 'III', name: '3B CBCT Radyoloji', href: 'tedavi-radyoloji.html' },
    { roman: 'IV',  name: 'Dijital & Estetik', href: 'tedavi-dijital-dolgu.html' },
    { roman: 'V',   name: 'Protetik CAD/CAM',  href: 'tedavi-protetik.html' },
    { roman: 'VI',  name: 'Ortodonti & Plak',  href: 'tedavi-ortodonti.html' },
    { roman: 'VII', name: 'Periodontoloji',    href: 'tedavi-periodontoloji.html' },
    { roman: 'VIII',name: 'Pedodonti (Çocuk)', href: 'tedavi-pedodonti.html' },
    { roman: 'IX',  name: 'Genel Anestezi',    href: 'tedavi-sedasyon.html' }
  ];

  var DD2_DOCTORS = [
    ['Dr. Dt. Seyit Yılmaz', 'Ağız, Diş ve Çene Cerrahisi Uzm.', 'img/doctors/dr_2069194eac7792f1.webp', 'hekim-dr--dt--seyit-yilmaz.html'],
    ['Dt. Emrah Özdemir', 'Kurucu Ortak · Estetik & Dijital', 'img/doctors/dr_bc424d42e0f89752.webp', 'hekim-dt--emrah-ozdemir.html'],
    ['Prof. Dr. Fuat Ahmetoğlu', 'Tıbbi Direktör · Endodonti Uzm.', 'img/doctors/dr_77b8934990a0ad18.webp', 'hekim-prof--dr--fuat-ahmetoglu.html'],
    ['Dr. Dt. Gökhan Uzel', 'Protetik Diş Tedavisi Uzmanı', 'img/doctors/dr_bcd5ea1fdb8624ba.webp', 'hekim-dr--dt--gokhan-uzel.html'],
    ['Dr. Dt. Elshad Salmanov', 'Endodonti (Mikroskop) Uzmanı', 'img/doctors/dr_ded915b570268091.webp', 'hekim-dr--dt--elshad-salmanov.html'],
    ['Uzm. Dt. Şenol Gülşen', 'Ortodonti Uzmanı', 'img/doctors/dr_98f5890894321a26.webp', 'hekim-uzm--dt--senol-gulsen.html'],
    ['Dr. Dt. Zuhal Metin', 'Periodontoloji Uzmanı', 'img/doctors/dr_c1af2b63b6f5ff29.webp', 'hekim-dr--dt--zuhal-metin.html'],
    ['Dr. Dt. Neslihan Çalışkan', 'Periodontoloji Uzmanı', 'img/doctors/dr_d8a6e78711a6e1b1.webp', 'hekim-dr--dt--neslihan-caliskan.html'],
    ['Dr. Dt. Serhat Çalışkan', 'Pedodonti Uzmanı', 'img/doctors/dr_23d49279cd7c9f34.webp', 'hekim-dr--dt--serhat-caliskan.html'],
    ['Uzm. Dt. Nilüfer S. Yıldırım', 'Pedodonti Uzmanı', 'img/doctors/dr_1ea45321d28bc9e4.jpeg', 'hekim-uzm--dt--nilufer-sumeyra-yildirim.html'],
    ['Uzm. Dr. Gökhan Gedikli', 'Anesteziyoloji Uzmanı', 'img/doctors/dr_925bfd72db9f31ea.webp', 'hekim-uzm--dr--gokhan-gedikli.html'],
    ['Dt. Burak Eren', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_96a00774e03947a6.webp', 'hekim-dt--burak-eren.html'],
    ['Dt. Davut Kayhan', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_0506dd2bef27e5c5.webp', 'hekim-dt--davut-kayhan.html'],
    ['Dt. Seyfullah H. Özkutlu', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_3803917f9822fe4e.webp', 'hekim-dt--seyfullah-h--ozkutlu.html'],
    ['Dt. Betül Durmaz Enginler', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_3d06bc845be07647.webp', 'hekim-dt--betul-durmaz-enginler.html'],
    ['Dt. Sıla Nur Çay', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_a98f55d22829b00e.webp', 'hekim-dt--sila-nur-cay.html'],
    ['Dt. Elif Yıldız', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_e09d81ad5c2cb886.webp', 'hekim-dt--elif-yildiz.html'],
    ['Dt. Sena Özdemir', 'Estetik & Restoratif (Serdivan)', 'img/doctors/dr_3ea237db235b3a99.webp', 'hekim-dt--sena-ozdemir.html'],
    ['Dt. Mehmet Emre Türkhan', 'Diş Hekimi (Adapazarı Şubesi)', 'img/doctors/dr_1100861f15834507.webp', 'hekim-dt--mehmet-emre-turkhan.html'],
    ['Dt. Yasa Akdoğan', 'Diş Hekimi (Adapazarı Şubesi)', 'img/doctors/dr_9d0516ed11be0366.webp', 'hekim-dt--yasa-akdogan.html']
  ];

  function dd2RosterModalAc() {
    var modal = document.getElementById('dd2RosterBackdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dd2RosterBackdrop';
      modal.className = 'dd2-roster-backdrop';
      var cardsHtml = DD2_DOCTORS.map(function (d) {
        return '<a href="' + d[3] + '" class="dd2-roster-card">' +
          '<img src="' + d[2] + '" alt="' + d[0] + '" loading="lazy"/>' +
          '<div><strong>' + d[0] + '</strong><small>' + d[1] + '</small></div>' +
        '</a>';
      }).join('');
      modal.innerHTML =
        '<div class="dd2-roster-dialog" role="dialog" aria-label="Hekim Kadromuz Hızlı Seçici">' +
          '<div class="dd2-roster-head">' +
            '<div>' +
              '<div style="font-size:0.72rem;color:#C8A45D;letter-spacing:0.1em;text-transform:uppercase;">◆ EVDİŞ KARAKTER & UZMAN KODEKSİ ◆</div>' +
              '<strong style="font-family:var(--font-display,serif);font-size:1.45rem;color:#FFFFFF;">20 Hekim Kadromuz — Anında Profil Geçişi</strong>' +
            '</div>' +
            '<button type="button" class="dd2-roster-close" id="dd2RosterCloseBtn">✕ Kapat</button>' +
          '</div>' +
          '<div class="dd2-roster-grid">' + cardsHtml + '</div>' +
        '</div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.id === 'dd2RosterCloseBtn') {
          modal.classList.remove('open');
        }
      });
    }
    modal.classList.add('open');
  }
  window.dd2RosterModalAc = dd2RosterModalAc;

  function dd2HudVeKodeksIlklendir() {
    // 1) Alt sayfalarda <main> içine 9 Branş + 20 Hekim Hızlı Geçiş HUD Şeridi ekle
    var mainKapsayici = document.querySelector('main .kapsayici') || document.querySelector('#hizmetler');
    if (mainKapsayici && !document.querySelector('.dd2-hud-ribbon')) {
      var curFile = (location.pathname.split('/').pop() || 'index.html');
      var vocHtml = DD2_VOCATIONS.map(function (v) {
        var cls = (curFile === v.href) ? 'dd2-vocation-slot active' : 'dd2-vocation-slot';
        return '<a href="' + v.href + '" class="' + cls + '">' +
          '<span class="dd2-voc-roman">' + v.roman + '</span>' +
          '<span class="dd2-voc-name">' + v.name + '</span>' +
        '</a>';
      }).join('');
      var hud = document.createElement('nav');
      hud.className = 'dd2-hud-ribbon';
      hud.setAttribute('aria-label', 'Branş ve Hekim Hızlı Geçiş Kodeksi');
      hud.innerHTML =
        '<div class="dd2-hud-top">' +
          '<span class="dd2-hud-title">◆ Hızlı Geçiş Kodeksi · 9 Uzmanlık Branşı</span>' +
          '<div class="dd2-hud-actions">' +
            '<button type="button" class="dd2-hud-action-btn" onclick="window.dd2RosterModalAc()">👑 20 Hekim Seçici</button>' +
            '<a href="index.html#teknoloji" class="dd2-hud-action-btn">🔬 6 Teknoloji</a>' +
            '<a href="serdivan.html" class="dd2-hud-action-btn">🏛️ Serdivan</a>' +
            '<a href="adapazari.html" class="dd2-hud-action-btn">🏛️ Adapazarı</a>' +
          '</div>' +
        '</div>' +
        '<div class="dd2-vocation-grid">' + vocHtml + '</div>';
      mainKapsayici.insertBefore(hud, mainKapsayici.firstChild);
    }

    // 2) Branş sayfalarındaki .klinik-konu-blok listesini interaktif RPG Kodeks sekmelerine dönüştür
    var konuBloklari = [].slice.call(document.querySelectorAll('.klinik-konu-blok')).filter(function (el) {
      return el.id !== 'konu-english-overview';
    });
    var klinikSurecBaslik = document.getElementById('klinik-surec');
    if (konuBloklari.length >= 3 && klinikSurecBaslik && !document.querySelector('.dd2-codex-wrap')) {
      var anaKutu = klinikSurecBaslik.parentElement;
      anaKutu.classList.add('dd2-codex-active-mode');

      var ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];
      var codexWrap = document.createElement('div');
      codexWrap.className = 'dd2-codex-wrap';

      var chipsHtml = konuBloklari.map(function (blok, idx) {
        var h3 = blok.querySelector('h3');
        var baslik = h3 ? h3.textContent.replace(/\s*Nedir\?\s*$/i, '').trim() : ('Konu ' + (idx + 1));
        var r = ROMANS[idx] || (idx + 1);
        return '<button type="button" class="dd2-codex-chip' + (idx === 0 ? ' active' : '') + '" data-konu-idx="' + idx + '">' +
          '<span class="dd2-chip-num">' + r + '</span>' +
          '<span>' + baslik + '</span>' +
        '</button>';
      }).join('');

      codexWrap.innerHTML =
        '<div class="dd2-codex-header">' +
          '<span class="dd2-codex-kicker">◆ Branş Tedavi Kodeksi (' + konuBloklari.length + ' Başlık — Anında Seçin)</span>' +
          '<button type="button" class="dd2-codex-toggle-all" id="dd2ToggleAllBtn">✦ Tüm Başlıkları Alt Alta Aç</button>' +
        '</div>' +
        '<div class="dd2-codex-chips">' + chipsHtml + '</div>' +
        '<div id="dd2CodexStageSlot"></div>';

      if (klinikSurecBaslik.nextSibling) {
        klinikSurecBaslik.parentNode.insertBefore(codexWrap, klinikSurecBaslik.nextSibling);
      } else {
        klinikSurecBaslik.parentNode.appendChild(codexWrap);
      }

      var stageSlot = document.getElementById('dd2CodexStageSlot');
      var chipBtns = [].slice.call(codexWrap.querySelectorAll('.dd2-codex-chip'));
      function konuSec(secIdx) {
        anaKutu.classList.add('dd2-codex-active-mode');
        var toggleBtn = document.getElementById('dd2ToggleAllBtn');
        if (toggleBtn) toggleBtn.textContent = '✦ Tüm Başlıkları Alt Alta Aç';
        chipBtns.forEach(function (b, i) { b.classList.toggle('active', i === secIdx); });
        konuBloklari.forEach(function (blk, i) { blk.classList.toggle('dd2-konu-secili', false); });
        if (stageSlot && konuBloklari[secIdx]) {
          stageSlot.innerHTML = '<div class="klinik-konu-blok dd2-konu-secili" style="display:block !important;">' + konuBloklari[secIdx].innerHTML + '</div>';
        }
      }

      chipBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = parseInt(btn.getAttribute('data-konu-idx') || '0', 10);
          konuSec(idx);
        });
      });

      var toggleAllBtn = document.getElementById('dd2ToggleAllBtn');
      if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', function () {
          var hepsiAcik = !anaKutu.classList.contains('dd2-codex-active-mode');
          if (hepsiAcik) {
            konuSec(0);
          } else {
            anaKutu.classList.remove('dd2-codex-active-mode');
            if (stageSlot) stageSlot.innerHTML = '';
            toggleAllBtn.textContent = '◆ Tekli Kodeks Görünümüne Dön';
          }
        });
      }
      konuSec(0);

      window.dd2KonuAcById = function (hedefId) {
        var temizId = String(hedefId || '').replace(/^#/, '');
        var bulunanIdx = -1;
        konuBloklari.forEach(function (blk, i) {
          if (blk.id === temizId) bulunanIdx = i;
        });
        if (bulunanIdx !== -1) {
          konuSec(bulunanIdx);
          return stageSlot || codexWrap;
        }
        return null;
      };

      // URL hash ile doğrudan belirli bir #konu-... hedeflendiyse onu otomatik seç
      if (location.hash) {
        window.dd2KonuAcById(location.hash.slice(1));
      }

      // Branş İmza Kartlarına (.brans-imza-kart) tıklanınca ilgili Kodeks başlığını aç ve sahneye kaydır
      document.querySelectorAll('.brans-imza-kart').forEach(function (kart, kIdx) {
        kart.addEventListener('click', function () {
          var hedefKonu = kart.getAttribute('data-hedef-konu');
          if (hedefKonu && window.dd2KonuAcById) {
            window.dd2KonuAcById(hedefKonu);
          } else {
            var hedefIdx = Math.min(kIdx, konuBloklari.length - 1);
            konuSec(hedefIdx);
          }
          var hedefEl = document.getElementById('dd2CodexStageSlot') || codexWrap;
          if (hedefEl) {
            hedefEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      });
    }
  }



  // =========================================================================
  // 3) DİJİTAL NİRENGİ & KOMPOZİT LAMİNE SLIDER ETKİLEŞİMİ + TÜM TIKLANABİLİR ÖĞELER
  // =========================================================================
  function nirengiVeTiklamalariIlklendir() {
    // a) Dijital Nirengi & Kompozit Slider (#nirengi-kompozit-sahne)
    document.querySelectorAll('.nirengi-kompozit-sahne').forEach(function (sahne) {
      if (sahne.dataset.nkInit === '1') return;
      sahne.dataset.nkInit = '1';

      var svgStage = sahne.querySelector('.nk-svg-stage');
      var guideBtns = sahne.querySelectorAll('.nk-guide-btn');
      guideBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var g = btn.getAttribute('data-guide') || 'all';
          guideBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
          if (svgStage) svgStage.setAttribute('data-active-guide', g);
        });
      });

      var viewport = sahne.querySelector('.nk-ba-viewport');
      var range = sahne.querySelector('.nk-ba-range');
      var imgBefore = sahne.querySelector('.nk-ba-before');
      var imgAfter = sahne.querySelector('.nk-ba-after');
      if (range && viewport) {
        var guncelleSlider = function () {
          viewport.style.setProperty('--nk-pos', range.value + '%');
        };
        range.addEventListener('input', guncelleSlider);
        range.addEventListener('change', guncelleSlider);
      }

      var viewBtns = sahne.querySelectorAll('.nk-view-btn');
      viewBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          viewBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
          var bSrc = btn.getAttribute('data-before');
          var aSrc = btn.getAttribute('data-after');
          if (imgBefore && bSrc) imgBefore.src = bSrc;
          if (imgAfter && aSrc) imgAfter.src = aSrc;
        });
      });
    });

    // b) Kurumsal Organizasyon Şeması "Tümünü Aç" / "Tümünü Kapat" düğmeleri (.org-dugme)
    document.querySelectorAll('.org-dugme').forEach(function (btn) {
      if (btn.dataset.orgBound === '1') return;
      btn.dataset.orgBound = '1';
      btn.addEventListener('click', function () {
        var txt = (btn.textContent || '').toLowerCase();
        var ac = txt.indexOf('aç') !== -1 || txt.indexOf('ac') !== -1 || txt.indexOf('open') !== -1;
        var kapsayici = btn.closest('#organizasyon-semasi, section, main') || document;
        kapsayici.querySelectorAll('details').forEach(function (d) {
          d.open = ac;
        });
      });
    });

    // c) Ana sayfa kubbe metrik halkaları (.av-metric-circle) tıklanınca ilgili bölüme geçsin
    var kubbeHedefleri = [
      'tedavi-radyoloji.html',
      'tedavi-endodonti.html',
      'tedavi-protetik.html',
      'tedavi-sedasyon.html',
      'serdivan.html',
      '#ajan'
    ];
    document.querySelectorAll('.av-metric-circle').forEach(function (el, idx) {
      if (el.dataset.bound === '1') return;
      el.dataset.bound = '1';
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () {
        var h = kubbeHedefleri[idx];
        if (!h) return;
        if (h === '#ajan') {
          if (window.evdisAjanAc) window.evdisAjanAc();
        } else {
          window.location.href = h;
        }
      });
    });

    // d) Mobilde (<=768px) ana sayfa Teknoloji (.av-tech-row) ve Branş (.av-services-cat-btn) kartlarına dokunulunca
    //    güncellenen görsel/başlık sahnesi ekran dışındaysa yumuşakça görünür alana kaydır
    document.querySelectorAll('.av-tech-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        if (window.innerWidth <= 768) {
          var vis = document.querySelector('.av-tech-visual-col') || document.getElementById('techCounter');
          if (vis) {
            var r = vis.getBoundingClientRect();
            if (r.top < 50 || r.bottom > window.innerHeight) {
              vis.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      });
    });
    document.querySelectorAll('.av-services-cat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          var rightCol = document.querySelector('.av-services-right');
          if (rightCol) {
            var r = rightCol.getBoundingClientRect();
            if (r.top > window.innerHeight * 0.78 || r.top < 40) {
              rightCol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', baslat);
  } else {
    baslat();
  }
})();
