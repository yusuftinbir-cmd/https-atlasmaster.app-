// Atlas — otonomi sayfası. Bütün sayılar #olcum JSON'undan okunur; burada sayı yazılmaz.
document.addEventListener('DOMContentLoaded', function () {
  var kaynak = document.getElementById('olcum');
  if (!kaynak) return;
  var D = JSON.parse(kaynak.textContent);
  var root = document.documentElement, en = root.lang === 'en';
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var NS = 'http://www.w3.org/2000/svg';
  root.classList.add('js');

  function get(p) { return p.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D); }
  function num(p) { return isNaN(p) ? get(p) : +p; }
  function fmt(v, f) {
    if (v === 'kaynak yok' && en) return 'no source';
    if (typeof v !== 'number') return String(v);
    var s = String(Math.abs(v)).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+$)/g, en ? ',' : '.');
    var t = (v < 0 ? '−' : '') + s.join(en ? '.' : ',');
    if (f === 'pct') return en ? t + '%' : '%' + t;
    if (f === 'k') return t + 'k';
    return t;
  }
  function all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function ease(u) { return 1 - Math.pow(1 - u, 3); }

  // yer tutucular: sayı, oran, pay
  all('[data-n]').forEach(function (el) {
    var v = get(el.getAttribute('data-n'));
    el.textContent = v == null ? '?' : fmt(v, el.getAttribute('data-f'));
    if (v === 'kaynak yok') el.classList.add('yok');
  });
  // damga yaşı: yeniden ölçülemeyen bölümün damgası yürümez; eskiyen damga 'son ölçüm' diye okunur, değer değişmez
  var AYLAR = en ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                 : ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  var ESKI_GUN = 2;
  all('.stamp[data-n]').forEach(function (el) {
    var m = /^(\d{1,2}) (\S+) (\d{4})/.exec(el.textContent), ay = m ? AYLAR.indexOf(m[2]) : -1;
    if (ay < 0) return;
    if (Date.now() - new Date(+m[3], ay, +m[1]).getTime() < ESKI_GUN * 864e5) return;
    el.textContent = (en ? 'last measured · ' : 'son ölçüm · ') + el.textContent;
    el.classList.add('eski');
  });
  all('[data-g]').forEach(function (el) { var g = get(el.getAttribute('data-g')); el.style.flexGrow = typeof g === 'number' ? g : 0; if (typeof g !== 'number') el.style.minWidth = '0'; });
  all('[data-w]').forEach(function (el) {
    var q = el.getAttribute('data-w').split('/');
    el.style.width = (num(q[0]) / num(q[1]) * 100) + '%';
  });
  // renk ölçümden: data-renk="dolu/gerek/gerileme" → dolu≥gerek ve gerileme 0 ise ok, dolu>0 ise acc; etiket rengi belirlemez
  all('[data-renk]').forEach(function (el) {
    var q = el.getAttribute('data-renk').split('/'), a = num(q[0]), b = num(q[1]), r = q[2] ? num(q[2]) : 0;
    if (typeof a !== 'number' || typeof b !== 'number') return;
    el.classList.add(a >= b && r === 0 ? 'c-ok' : a > 0 ? 'c-acc' : 'c-dim');
  });

  // sayaç: gerçek değere sayar
  function say(el) {
    var v = get(el.getAttribute('data-n')), f = el.getAttribute('data-f'), t0 = null;
    if (typeof v !== 'number' || v % 1) return;
    el.parentNode.style.minWidth = el.parentNode.offsetWidth + 'px';
    el.textContent = fmt(0, f);
    requestAnimationFrame(function adim(now) {
      if (t0 === null) t0 = now;
      var u = Math.min((now - t0) / 1100, 1);
      el.textContent = fmt(Math.round(v * ease(u)), f);
      if (u < 1) requestAnimationFrame(adim);
    });
  }

  // ajan ağı: emir gider, kanıt kapıdan döner; sonuç dizisi öz-sınama sayımıyla aynı oranda
  function ag(svg) {
    var S = D.selftest, toplam = S.alet, katman = svg.querySelector('.pts');
    var C = { x: +svg.getAttribute('data-cx'), y: +svg.getAttribute('data-cy') };
    var dugum = all('[data-node]', svg).map(function (g) {
      var n = { x: +g.getAttribute('data-x'), y: +g.getAttribute('data-y') };
      var dx = n.x - C.x, dy = n.y - C.y, L = Math.sqrt(dx * dx + dy * dy);
      n.px = -dy / L * 4; n.py = dx / L * 4;
      n.gx = C.x + dx / 2; n.gy = C.y + dy / 2;
      return n;
    });
    var dizi = [];
    [['g', S.gecti], ['r', S.dustu], ['n', S.selftestsiz]].forEach(function (c) {
      for (var j = 0; j < c[1]; j++) dizi.push([(j + 0.5) * toplam / c[1], c[0]]);
    });
    dizi.sort(function (a, b) { return a[0] - b[0]; });
    var kutu = {}, sayim;
    all('[data-t]').forEach(function (el) { kutu[el.getAttribute('data-t')] = el; });
    function yaz() { for (var k in kutu) kutu[k].textContent = fmt(sayim[k]); }
    sayim = { g: S.gecti, r: S.dustu, n: S.selftestsiz }; yaz();
    if (RM) return { set: function () {} };

    var ADIM = 160, T1 = 900, T2 = 650, T3 = 700;
    var parca = [], i = 0, birikim = 0, son = 0, kos = false, bekle = 0;
    function sifir() { sayim = { g: 0, r: 0, n: 0 }; yaz(); i = 0; birikim = 0; bekle = 0; }
    function koy(p, x, y) { p.c.setAttribute('cx', x.toFixed(1)); p.c.setAttribute('cy', y.toFixed(1)); }
    function kare(now) {
      if (!kos) { son = 0; return; }
      var dt = son ? Math.min(now - son, 100) : 0; son = now;
      if (i < toplam) {
        birikim += dt;
        while (birikim >= ADIM && i < toplam) {
          birikim -= ADIM;
          var c = document.createElementNS(NS, 'circle');
          c.setAttribute('r', 3); c.setAttribute('class', 'p');
          katman.appendChild(c);
          parca.push({ c: c, n: dugum[i % dugum.length], o: dizi[i][1], t: 0 });
          i++;
        }
      }
      parca = parca.filter(function (p) {
        p.t += dt;
        var n = p.n, t = p.t, u;
        if (t < T1) {
          u = ease(t / T1);
          koy(p, C.x + (n.x - C.x) * u + n.px, C.y + (n.y - C.y) * u + n.py);
        } else if (t < T1 + T2) {
          u = (t - T1) / T2;
          if (!p.b) { p.b = 1; p.c.setAttribute('class', 'p b'); }
          koy(p, n.x + (n.gx - n.x) * u - n.px, n.y + (n.gy - n.y) * u - n.py);
        } else {
          u = Math.min((t - T1 - T2) / T3, 1);
          if (!p.h) { p.h = 1; p.c.setAttribute('class', 'p ' + p.o); sayim[p.o]++; yaz(); }
          if (p.o === 'g') koy(p, n.gx + (C.x - n.gx) * u - n.px, n.gy + (C.y - n.gy) * u - n.py);
          else {
            if (p.o === 'r') koy(p, n.gx - n.px, n.gy - n.py + u * u * 46);
            p.c.setAttribute('opacity', (1 - u).toFixed(2));
          }
          if (u >= 1) { katman.removeChild(p.c); return false; }
        }
        return true;
      });
      if (i >= toplam && !parca.length) {
        if (!bekle) bekle = now + 5000;
        else if (now > bekle) sifir();
      }
      requestAnimationFrame(kare);
    }
    sifir();
    return { set: function (v) { if (v && !kos) { kos = true; requestAnimationFrame(kare); } else if (!v) kos = false; } };
  }

  // emeklilik hunisi: şerit kalınlığı kayıt sayısıyla orantılı
  function huni(svg) {
    var E = D.emekli, y0 = 30, H = 300, olcek = H / E.kayit;
    var x0 = 22, w0 = 14, x1 = 196, w1 = 10, ara = 14, xa = x0 + w0, mx = (xa + x1) / 2;
    var ys = y0, yt = y0;
    var src = svg.querySelector('.src');
    src.setAttribute('x', x0); src.setAttribute('y', y0); src.setAttribute('width', w0); src.setAttribute('height', H);
    all('[data-bin]', svg).forEach(function (g) {
      var h = E[g.getAttribute('data-bin')] * olcek, hh = Math.max(h, 4), my = yt + hh / 2;
      g.querySelector('.rib').setAttribute('d',
        'M' + xa + ',' + ys + 'C' + mx + ',' + ys + ' ' + mx + ',' + yt + ' ' + x1 + ',' + yt +
        'V' + (yt + hh) + 'C' + mx + ',' + (yt + hh) + ' ' + mx + ',' + (ys + h) + ' ' + xa + ',' + (ys + h) + 'Z');
      g.querySelector('.flow').setAttribute('d',
        'M' + xa + ',' + (ys + h / 2) + 'C' + mx + ',' + (ys + h / 2) + ' ' + mx + ',' + my + ' ' + x1 + ',' + my);
      var b = g.querySelector('.bin');
      b.setAttribute('x', x1); b.setAttribute('y', yt); b.setAttribute('width', w1); b.setAttribute('height', hh);
      var lab = g.querySelector('.lab'), sub = g.querySelector('.sub');
      lab.setAttribute('x', x1 + w1 + 12); lab.setAttribute('y', my + (sub ? -3 : 4.5));
      if (sub) { sub.setAttribute('x', x1 + w1 + 12); sub.setAttribute('y', my + 13); }
      ys += h; yt += hh + ara;
    });
  }

  // ablasyon: noktacığın yolu ve süre çubuğu kolun dakikasıyla orantılı
  function ablasyon(svg) {
    var K = D.ablasyon.kol, mdk = 0, myuk = 0, W = 200, BIRIM = 500;
    for (var a in K) { mdk = Math.max(mdk, K[a].dk); myuk = Math.max(myuk, K[a].yuk_k); }
    var kol = all('[data-kol]', svg).map(function (g) {
      var k = K[g.getAttribute('data-kol')], o = {
        dk: k.dk, wd: k.dk / mdk * W, wy: k.yuk_k / myuk * W,
        x0: +g.getAttribute('data-x0'), x1: +g.getAttribute('data-x1'),
        dot: g.querySelector('.dot'), d: g.querySelector('.dbar'), y: g.querySelector('.ybar'),
        chk: g.querySelector('.chk'), gate: g.querySelector('.gate')
      };
      g.querySelector('.dl').setAttribute('x', o.x0 + Math.max(o.wd, o.wy) + 8);
      return o;
    });
    function ciz(o, u) {
      o.dot.setAttribute('cx', (o.x0 + (o.x1 - o.x0) * u).toFixed(1));
      o.d.setAttribute('width', (o.wd * u).toFixed(1));
      o.y.setAttribute('width', (o.wy * u).toFixed(1));
      o.chk.setAttribute('class', u >= 1 ? 'chk on' : 'chk');
      o.gate.setAttribute('class', u >= 1 ? 'gate on' : 'gate');
    }
    kol.forEach(function (o) { ciz(o, 1); });
    if (RM) return { set: function () {} };
    var kos = false, t = 0, son = 0, tur = mdk * BIRIM + 3000;
    function kare(now) {
      if (!kos) { son = 0; return; }
      t += son ? Math.min(now - son, 100) : 0; son = now;
      if (t > tur) t = 0;
      kol.forEach(function (o) { ciz(o, Math.min(t / (o.dk * BIRIM), 1)); });
      requestAnimationFrame(kare);
    }
    return { set: function (v) { if (v && !kos) { kos = true; requestAnimationFrame(kare); } else if (!v) kos = false; } };
  }

  // ajan karneleri: kart iskeleti sayfada, sayılar #olcum.ajanlar'dan; kütüğü okunamayan ajanın kartı bunu söyler
  var L = en
    ? { yok: 'not measured', son: 'last run', kosu: 'runs · 7 days', oran: 'success', olcusuz: 'not scored', hic: 'no record',
        dk: ' min ago', sa: ' h ago', gun: ' days ago', eski: '6 days ago', bugun: 'today', ciz: 'Runs per day over the last seven days: ' }
    : { yok: 'ölçülemedi', son: 'son koşu', kosu: 'koşu · 7 gün', oran: 'başarı', olcusuz: 'puanlanmıyor', hic: 'kayıt yok',
        dk: ' dk önce', sa: ' sa önce', gun: ' gün önce', eski: '6 gün önce', bugun: 'bugün', ciz: 'Son yedi günde günlük koşu: ' };
  function el(ad, sinif, metin) {
    var e = document.createElement(ad);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    return e;
  }
  function sv(ad, oz) {
    var e = document.createElementNS(NS, ad);
    for (var k in oz) e.setAttribute(k, oz[k]);
    return e;
  }
  function once(dk) {
    if (dk < 0) return L.hic;
    if (dk < 60) return fmt(dk) + L.dk;
    if (dk < 2880) return fmt(Math.round(dk / 60)) + L.sa;
    return fmt(Math.round(dk / 1440)) + L.gun;
  }
  // son_ts (ISO +03:00) varsa yaş GÖRÜNTÜLEME anında hesaplanır; yoksa ölçüm anındaki son_dk (eski davranış)
  function mutlak(t) {
    var d = new Date(t + 3 * 36e5), z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getUTCDate() + ' ' + AYLAR[d.getUTCMonth()] + ' ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes());
  }
  function sonKosu(a) {
    var t = typeof a.son_ts === 'string' && a.son_ts ? Date.parse(a.son_ts) : NaN;
    if (isNaN(t)) return [once(a.son_dk), L.son];
    return [once(Math.max(0, Math.floor((Date.now() - t) / 6e4))), L.son + ' · ' + mutlak(t)];
  }
  function dizi(s) { return s ? s.split(',').map(Number) : []; }
  function spark(g, o) {
    var W = 148, H = 44, x0 = 5, y0 = 38, dx = (W - 2 * x0) / (g.length - 1), tepe = Math.max.apply(null, g.concat(1));
    function yol(d) {
      return d.map(function (v, i) { return (i ? 'L' : 'M') + (x0 + i * dx).toFixed(1) + ',' + (y0 - v / tepe * 30).toFixed(1); }).join('');
    }
    var svg = sv('svg', { 'class': 'spark', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': L.ciz + g.map(function (v) { return fmt(v); }).join(' · ') });
    svg.appendChild(sv('path', { 'class': 'sb', d: 'M' + x0 + ',' + y0 + 'H' + (W - x0) }));
    svg.appendChild(sv('path', { 'class': 'sa', d: yol(g) + 'V' + y0 + 'H' + x0 + 'Z' }));
    svg.appendChild(sv('path', { 'class': 'sg', d: yol(g), pathLength: 1 }));
    if (o.length === g.length) svg.appendChild(sv('path', { 'class': 'so', d: yol(o), pathLength: 1 }));
    svg.appendChild(sv('circle', { 'class': 'sn', r: 3, cx: (W - x0).toFixed(1), cy: (y0 - g[g.length - 1] / tepe * 30).toFixed(1) }));
    return svg;
  }
  function karne(kart) {
    var a = (D.ajanlar || {})[kart.getAttribute('data-ajan')], govde = kart.querySelector('.abody');
    if (!govde) return;
    govde.textContent = '';
    if (!a || a.olculdu !== 1) { kart.classList.add('yok'); govde.appendChild(el('p', 'ayok', L.yok)); return; }
    var puanli = a.ok7 >= 0, ul = el('ul', 'astat');
    [sonKosu(a),
     [fmt(a.k7), L.kosu],
     [puanli && a.k7 > 0 ? fmt(Math.round(a.ok7 / a.k7 * 100), 'pct') : '—',
      puanli ? (govde.getAttribute('data-ok') || L.oran) + ' · ' + fmt(a.ok7) : L.olcusuz]
    ].forEach(function (c) {
      var li = el('li');
      li.appendChild(el('b', null, c[0])); li.appendChild(el('span', null, c[1]));
      ul.appendChild(li);
    });
    govde.appendChild(ul);
    var g = dizi(a.g);
    if (g.length > 1) {
      govde.appendChild(spark(g, puanli ? dizi(a.o) : []));
      var alt = el('p', 'acap');
      alt.appendChild(el('span', null, L.eski)); alt.appendChild(el('span', null, L.bugun + ' · ' + fmt(a.bugun)));
      govde.appendChild(alt);
    }
    var s = govde.getAttribute('data-s');
    if (s) govde.appendChild(el('p', 'aday', s.replace(/\{(\w+)\}/g, function (m, k) { return typeof a[k] === 'number' && a[k] >= 0 ? fmt(a[k]) : '?'; })));
  }
  all('[data-ajan]').forEach(karne);
  // kök ts (ajan_karne_olc üretim anı): kartların altına 'ölçüm: <tarih saat>'
  var oz = D.ajanlar && typeof D.ajanlar.ts === 'string' ? Date.parse(D.ajanlar.ts) : NaN, kartlar = all('[data-ajan]');
  if (!isNaN(oz) && kartlar.length) {
    var sat = el('p', 'acap olcum-ts', (en ? 'measured: ' : 'ölçüm: ') + mutlak(oz) + (en ? ' (Turkey time)' : ' (TSİ)'));
    var sonKart = kartlar[kartlar.length - 1];
    sonKart.parentNode.parentNode.insertBefore(sat, sonKart.parentNode.nextSibling);
  }

  var surucu = {};
  var s1 = document.getElementById('ag'), s2 = document.getElementById('hn'), s3 = document.getElementById('ab');
  if (s1) surucu.ag = ag(s1);
  if (s2) huni(s2);
  if (s3) surucu.ab = ablasyon(s3);

  // görünce başlar, çıkınca durur
  function gir(el, v) {
    var d = surucu[el.getAttribute('data-anim')];
    if (d) d.set(v);
    if (v && !el.classList.contains('in')) {
      el.classList.add('in');
      if (!RM) all('[data-c]', el).forEach(say);
    }
  }
  var hedef = all('.obs');
  if (!('IntersectionObserver' in window)) { hedef.forEach(function (el) { gir(el, true); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { gir(e.target, e.isIntersecting); });
  }, { threshold: 0.25 });
  hedef.forEach(function (el) { io.observe(el); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) for (var k in surucu) surucu[k].set(false);
    else hedef.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) gir(el, true); });
  });
});
