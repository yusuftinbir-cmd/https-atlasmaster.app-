// Reaper karne ve durum tabloları — sayılar /data/reaper_karne.json dosyasından okunur; 6 sa/tur koşusu bu dosyaya yeni satır ekler.
(function () {
  var karneKok = document.getElementById('reaper-karne-tablo');
  var durumKok = document.getElementById('reaper-tablo');
  if (!karneKok && !durumKok) return;

  function hucre(tr, txt, cls) {
    var td = document.createElement('td');
    if (cls) td.className = cls;
    td.textContent = txt;
    tr.appendChild(td);
  }

  fetch('/data/reaper_karne.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('/data/reaper_karne.json');
      return r.json();
    })
    .then(function (veri) {
      if (karneKok && Array.isArray(veri.satirlar) && veri.satirlar.length > 0) {
        var dil = karneKok.dataset.dil || 'tr';
        var basliklar = [
          karneKok.dataset.hTarih || 'Tarih',
          karneKok.dataset.hTur || 'Tur / Kapsam',
          karneKok.dataset.hAtif || 'Atıf',
          karneKok.dataset.hDogrulandi || 'Doğrulandı',
          karneKok.dataset.hUydurma || 'Uydurma',
          karneKok.dataset.hElenen || 'Elenen ses / Sonuç'
        ];
        karneKok.innerHTML = '';
        var tb = document.createElement('table');
        tb.className = 'tbl';
        var th = document.createElement('thead');
        var hr = document.createElement('tr');
        basliklar.forEach(function (b) {
          var c = document.createElement('th');
          c.textContent = b;
          hr.appendChild(c);
        });
        th.appendChild(hr);
        tb.appendChild(th);
        var body = document.createElement('tbody');
        veri.satirlar.forEach(function (s) {
          var tr = document.createElement('tr');
          var turMetin = (dil === 'en' && s.tur_en) ? s.tur_en : ((dil === 'ar' && s.tur_ar) ? s.tur_ar : s.tur);
          var elenenMetin = (dil === 'en' && s.elenen_ses_en) ? s.elenen_ses_en : ((dil === 'ar' && s.elenen_ses_ar) ? s.elenen_ses_ar : s.elenen_ses);
          var dogrulanamadiEk = (s.dogrulanamadi && s.dogrulanamadi > 0) ? (' (+' + s.dogrulanamadi + ')') : '';
          hucre(tr, String(s.tarih || ''), 'mono');
          hucre(tr, String(turMetin || ''));
          hucre(tr, String(s.atif != null ? s.atif : ''));
          hucre(tr, String(s.dogrulandi != null ? s.dogrulandi : '') + dogrulanamadiEk);
          hucre(tr, String(s.uydurma != null ? s.uydurma : ''));
          hucre(tr, String(elenenMetin || ''));
          body.appendChild(tr);
        });
        tb.appendChild(body);
        karneKok.appendChild(tb);
      }

      if (durumKok && veri.gun1_taban && veri.gun1_taban.sayim) {
        var g = veri.gun1_taban;
        var d = durumKok.dataset;
        var bos = document.getElementById('reaper-bos');
        if (bos) bos.remove();
        durumKok.innerHTML = '';
        var p = document.createElement('p');
        p.textContent = (d.gun || 'Ölçüm günü') + ': ' + g.gun + ' (' + (g.ts || '') + ' · ' + (g.denetci || 'GECERLI') + ')';
        durumKok.appendChild(p);
        var tb2 = document.createElement('table');
        tb2.className = 'tbl';
        var th2 = document.createElement('thead');
        var hr2 = document.createElement('tr');
        [d.tblH0 || 'Sınıf', d.tblH1 || 'Yöntem sayısı'].forEach(function (x) {
          var c = document.createElement('th');
          c.textContent = x;
          hr2.appendChild(c);
        });
        th2.appendChild(hr2);
        tb2.appendChild(th2);
        var body2 = document.createElement('tbody');
        ['CANLI', 'AKSAK', 'ÖLÜ', 'İDDİA', 'ÖLÇÜLEMEDİ'].forEach(function (k) {
          if (g.sayim[k] != null) {
            var r = document.createElement('tr');
            hucre(r, k, 'mono');
            hucre(r, String(g.sayim[k]));
            body2.appendChild(r);
          }
        });
        var tt = document.createElement('tr');
        hucre(tt, d.toplam || 'Toplam');
        hucre(tt, String(g.yontem_n || 58));
        body2.appendChild(tt);
        tb2.appendChild(body2);
        durumKok.appendChild(tb2);
        if (g.yusuf && isFinite(g.yusuf.bekleyen) && isFinite(g.yusuf.en_eski_gun)) {
          var y = document.createElement('p');
          y.className = 'mono';
          y.textContent = (d.yusuf || 'Yusuf · bekleyen %N · en eski %M gün')
            .replace('%N', String(g.yusuf.bekleyen))
            .replace('%M', String(g.yusuf.en_eski_gun));
          durumKok.appendChild(y);
        }
      }
    })
    .catch(function () {
      /* Çevrimdışı veya okuma hatasında sayfadaki statik HTML tabloları korunur */
    });
})();
