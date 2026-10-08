// Atlas — Kıvılcım sayfası. Şekil bir turu sırayla oynatır; sayı taşımaz, ölçüler şeklin kendi özniteliklerinden okunur.
document.addEventListener('DOMContentLoaded', function () {
  var root = document.documentElement;
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var NS = 'http://www.w3.org/2000/svg';
  root.classList.add('js');

  function all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function u(t, a, b) { return Math.max(0, Math.min((t - a) / (b - a), 1)); }

  // tur: brif seslere ayrı ayrı gider; atıflar süzgece düşer; bulunan geçer, bulunamayan süzgeçte kalır
  function tur(svg) {
    if (RM) return { set: function () {} };
    var cx = +svg.getAttribute('data-cx'), Y = svg.getAttribute('data-y').split(' ').map(Number);
    var yBrif = Y[0], ySesUst = Y[1], ySesAlt = Y[2], yElek = Y[3], ySentez = Y[4], ySentezAlt = Y[5], yKarne = Y[6];
    var adim = all('.stp', svg), sesler = all('[data-ses]', svg), etiket = svg.querySelector('.tagx'), katman = svg.querySelector('.pts');
    var X = sesler.map(function (g) { return +g.getAttribute('data-x'); });
    function nokta() {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', 4); c.setAttribute('class', 'p'); c.style.opacity = 0;
      katman.appendChild(c);
      return c;
    }
    var gid = X.map(nokta), atif = X.map(nokta), son = nokta();
    function kon(c, x, y, gor, sinif) {
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1));
      c.style.opacity = gor ? 1 : 0;
      if (sinif) c.setAttribute('class', sinif);
    }
    svg.classList.add('live');
    var SURE = 12500, kalan = sesler.length - 2;

    function ciz(t) {
      var s = t < 900 ? 1 : t < 1800 ? 2 : t < 3500 ? 3 : t < 6000 ? 4 : t < 8000 ? 5 : t < 9500 ? 6 : 7;
      adim.forEach(function (g) {
        var ac = +g.getAttribute('data-s') === s, i = sesler.indexOf(g);
        if (ac && i >= 0) ac = t >= 3500 + i * 300;
        g.setAttribute('class', ac ? 'stp on' : 'stp');
      });
      X.forEach(function (x, i) {
        var a = u(t, 2700, 3500);
        kon(gid[i], cx + (x - cx) * a, yBrif + (ySesUst - yBrif) * a, t > 2700 && t < 3500);
        var kaldi = i === kalan, d = u(t, 5000, 6000), g = kaldi ? 0 : u(t, 7000, 8000);
        var px = x, py = ySesAlt + (yElek - ySesAlt) * d * d;
        if (g > 0) {
          var g1 = Math.min(g / 0.2, 1), g2 = Math.max((g - 0.2) / 0.8, 0), yGec = yElek + 14;
          px = x + (cx - x) * g2; py = yElek + (yGec - yElek) * g1 + (ySentez - yGec) * g2;
        }
        kon(atif[i], px, py, t >= 5000 && (kaldi ? t < 11500 : t < 8000), t < 6300 ? 'p' : kaldi ? 'p kal' : 'p gec');
      });
      etiket.setAttribute('transform', 'translate(' + X[kalan] + ' 0)');
      etiket.style.opacity = t >= 6300 && t < 11500 ? 1 : 0;
      var k = u(t, 9000, 9500);
      kon(son, cx, ySentezAlt + (yKarne - ySentezAlt) * k, t > 9000 && t < 9500, 'p gec');
    }

    var kos = false, t = 0, once = 0;
    ciz(0);
    function kare(now) {
      if (!kos) { once = 0; return; }
      t += once ? Math.min(now - once, 100) : 0; once = now;
      if (t > SURE) { t = 0; kalan = (kalan + 1) % X.length; }
      ciz(t);
      requestAnimationFrame(kare);
    }
    return { set: function (v) { if (v && !kos) { kos = true; requestAnimationFrame(kare); } else if (!v) kos = false; } };
  }

  var surucu = {}, s1 = document.getElementById('tur');
  if (s1) surucu.tur = tur(s1);

  // görünce başlar, çıkınca durur
  function gir(el, v) {
    var d = surucu[el.getAttribute('data-anim')];
    if (d) d.set(v);
    if (v) el.classList.add('in');
  }
  var hedef = all('.obs');
  if (!('IntersectionObserver' in window)) { hedef.forEach(function (el) { gir(el, true); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { gir(e.target, e.isIntersecting); });
  }, { threshold: 0.15 });
  hedef.forEach(function (el) { io.observe(el); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) for (var k in surucu) surucu[k].set(false);
    else hedef.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) gir(el, true); });
  });
});
