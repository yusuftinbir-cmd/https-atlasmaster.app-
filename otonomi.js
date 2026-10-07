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
  });
  all('[data-g]').forEach(function (el) { el.style.flexGrow = get(el.getAttribute('data-g')); });
  all('[data-w]').forEach(function (el) {
    var q = el.getAttribute('data-w').split('/');
    el.style.width = (num(q[0]) / num(q[1]) * 100) + '%';
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
