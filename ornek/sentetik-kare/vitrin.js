// Atlas · Sentetik kare vitrini — 3B sefalometrik tel-kafes (478 nokta, 2.556 kenar) + A/B morfoloji kaydırıcısı.
// Kullanım: <div class="sk" data-sk-base="ornek/sentetik-kare/" data-sk-lang="tr" data-sk-van="Eğitimsiz AI">[JS'siz panel]</div>
// Bağımlılık yok. Renkler style.css değişkenlerinden okunur (açık/koyu tema). Görseller %100 sentetik; gerçek hasta değildir.
(function () {
  'use strict';
  var S = {
    tr: {
      h3d: '3B Sefalometrik Tel-Kafes · 478 nokta', s3d: 'Sentetik portreden çıkarılan 3B (x, y, z) koordinatlar ve 2.556 kenar. Turkuaz: ZY-ZY (elmacık genişliği) · Yeşil: Go-Go (alt çene köşeleri). Fare ya da parmakla döndürün.',
      spin: 'Döndür', vec: 'Vektörler', on: 'Ön', sol: 'Sol', sag: 'Sağ', yuk: '3B ağ yükleniyor…', hata: '3B ağ yüklenemedi; statik panel için sayfayı yenileyin.',
      olcu: '<i>ZY-ZY = 629,7 px</i> · <b>Go-Go = 526,9 px</b> · Go-Go / ZY-ZY = <b>0,837</b> (≥ 0,82 → geniş / kare çene)',
      hab: 'Foto-gerçekçi sentetik morfoloji kaydırıcısı', sim: 'Simülasyon', kay: 'Karşılaştırma kaydırıcısı',
      tabs: [
        { id: 'makro_vl', t: '2x Makro: {van} (Ovoid) ↔ ATLAS QLoRA (Kuboidal)', l: '{van} · Feminen Ovoid Hat', r: 'ATLAS QLoRA · Maskülen Kuboidal Hat', a: 'makro-vanilya.jpg', b: 'makro-lora.jpg', dik: 0,
          n: '<b>Aynı sentetik yüz, aynı dudak kilidi (4.686 piksel değişmedi); yalnız form seçimi farklı.</b> Sol: yuvarlak köşe, açık V kama aralığı, kısa yan kesici. Sağ: 90° dik köşe, düz yatay kesici kenar, kapalı kama aralığı.' },
        { id: 'agiz_vl', t: '1x Yakın Ağız: {van} ↔ ATLAS QLoRA', l: '{van} · 1x yakın ağız', r: 'ATLAS QLoRA · 1x yakın ağız', a: 'agiz-vanilya.jpg', b: 'agiz-lora.jpg', dik: 0,
          n: 'Aynı karenin 1x kırpımı: dudak, diş eti ve alt dişler iki tarafta pikseli pikseline aynı; yalnız üst ön altı dişin hattı değişti.' },
        { id: 'tam_vl', t: 'Tam Portre: 3B Sefalometri (Go-Go/ZY-ZY = 0,837)', l: '{van} · tam portre', r: 'ATLAS QLoRA · tam portre', a: 'tamkare-vanilya.jpg', b: 'tamkare-lora.jpg', dik: 1,
          n: 'Brakisefal (geniş / kare) sentetik yüz: Go-Go / ZY-ZY = 0,837. Eğitimsiz model bu yüzü “oval” sınıflayıp yuvarlak hat seçti; QLoRA modeli “kare / geniş” okuyup kuboidal hat seçti.' },
        { id: 'makro_ol', t: '2x Makro Simülasyon: Özgün ↔ Tasarım Sonrası', l: 'Özgün sentetik diş · Simülasyon', r: 'ATLAS QLoRA · Simülasyon', a: 'makro-ozgun.jpg', b: 'makro-lora.jpg', dik: 0, sim: 1,
          n: '<b>Simülasyon:</b> tedavi öncesi / sonrası değildir. Sentetik modelin özgün dişi ile algoritmik form önerisinin aynı karede karşılaştırmasıdır.' }
      ]
    },
    en: {
      h3d: '3D Cephalometric Wireframe · 478 landmarks', s3d: '3D (x, y, z) coordinates and 2,556 edges extracted from the synthetic portrait. Cyan: ZY-ZY (bizygomatic width) · Green: Go-Go (gonial angles). Drag with mouse or finger to rotate.',
      spin: 'Spin', vec: 'Vectors', on: 'Front', sol: 'Left', sag: 'Right', yuk: 'Loading 3D mesh…', hata: 'The 3D mesh could not be loaded; reload the page for the static panel.',
      olcu: '<i>ZY-ZY = 629.7 px</i> · <b>Go-Go = 526.9 px</b> · Go-Go / ZY-ZY = <b>0.837</b> (≥ 0.82 → wide / square jaw)',
      hab: 'Photo-realistic synthetic morphology slider', sim: 'Simulation', kay: 'Comparison slider',
      tabs: [
        { id: 'makro_vl', t: '2x Macro: {van} (Ovoid) ↔ ATLAS QLoRA (Cuboidal)', l: '{van} · Feminine Ovoid Line', r: 'ATLAS QLoRA · Masculine Cuboidal Line', a: 'makro-vanilya.jpg', b: 'makro-lora.jpg', dik: 0,
          n: '<b>Same synthetic face, same lip lock (4,686 pixels unchanged); only the form choice differs.</b> Left: rounded corners, open V embrasures, short laterals. Right: 90° corners, flat horizontal incisal edge, closed embrasures.' },
        { id: 'agiz_vl', t: '1x Close-up Mouth: {van} ↔ ATLAS QLoRA', l: '{van} · 1x close-up', r: 'ATLAS QLoRA · 1x close-up', a: 'agiz-vanilya.jpg', b: 'agiz-lora.jpg', dik: 0,
          n: '1x crop of the same frame: lips, gingiva and lower teeth are pixel-identical on both sides; only the line of the upper six anterior teeth changed.' },
        { id: 'tam_vl', t: 'Full Portrait: 3D Cephalometry (Go-Go/ZY-ZY = 0.837)', l: '{van} · full portrait', r: 'ATLAS QLoRA · full portrait', a: 'tamkare-vanilya.jpg', b: 'tamkare-lora.jpg', dik: 1,
          n: 'Brachyfacial (wide / square) synthetic face: Go-Go / ZY-ZY = 0.837. The untrained model classified it as “oval” and chose a rounded line; the QLoRA model read “square / wide” and chose a cuboidal line.' },
        { id: 'makro_ol', t: '2x Macro Simulation: Original ↔ After Design', l: 'Original synthetic tooth · Simulation', r: 'ATLAS QLoRA · Simulation', a: 'makro-ozgun.jpg', b: 'makro-lora.jpg', dik: 0, sim: 1,
          n: '<b>Simulation:</b> not a before / after treatment. The synthetic model’s original tooth compared with the algorithmic form proposal in the same frame.' }
      ]
    }
  };
  function cssVar(n, d) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || d; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function kur(root) {
    var base = root.getAttribute('data-sk-base') || '', lang = (root.getAttribute('data-sk-lang') || 'tr').toLowerCase();
    var T = S[lang] || S.tr, van = root.getAttribute('data-sk-van') || (lang === 'en' ? 'Untrained AI' : 'Eğitimsiz AI');
    var vt = function (s) { return s.replace(/\{van\}/g, van); };
    root.classList.add('js');
    var grid = el('div', 'sk-grid');

    /* ---- 3B tel-kafes ---- */
    var f3 = el('figure', 'sheet sk-3d');
    f3.appendChild(el('p', 'idx', '<span>' + T.h3d + '</span><span>MediaPipe FaceMesh</span>'));
    f3.appendChild(el('p', 'sk-sub', T.s3d));
    var cw = el('div', 'sk-canvas-wrap'); var cv = document.createElement('canvas'); cv.setAttribute('aria-label', T.h3d); cv.setAttribute('role', 'img');
    var yk = el('div', 'sk-yukleniyor', T.yuk); cw.appendChild(cv); cw.appendChild(yk); f3.appendChild(cw);
    var btns = el('div', 'sk-btns');
    function btn(txt, pressed) { var b = el('button', 'sk-btn', txt); b.type = 'button'; if (pressed != null) b.setAttribute('aria-pressed', String(pressed)); return b; }
    var bSpin = btn(T.spin, true), bVec = btn(T.vec, true), bOn = btn(T.on), bSol = btn(T.sol), bSag = btn(T.sag);
    [bSpin, bVec, bOn, bSol, bSag].forEach(function (b) { btns.appendChild(b); }); f3.appendChild(btns);
    f3.appendChild(el('p', 'sk-olcu', T.olcu));
    grid.appendChild(f3);

    /* ---- A/B kaydırıcı ---- */
    var fa = el('figure', 'sheet sk-ab');
    var hd = el('p', 'idx', '<span>' + T.hab + '</span><span class="sk-sim" hidden>' + T.sim + '</span>'); fa.appendChild(hd);
    var tabs = el('div', 'sk-tabs'); tabs.setAttribute('role', 'tablist');
    var stage = el('div', 'sk-stage');
    var pa = el('div', 'sk-pane'), pb = el('div', 'sk-pane');
    var ia = new Image(), ib = new Image(); ia.decoding = 'async'; ib.decoding = 'async';
    var la = el('span', 'sk-lab'), lb = el('span', 'sk-lab');
    pa.appendChild(ia); pa.appendChild(la); pb.appendChild(ib); pb.appendChild(lb);
    var bar = el('div', 'sk-bar'); bar.setAttribute('aria-hidden', 'true');
    var rg = document.createElement('input'); rg.type = 'range'; rg.min = 0; rg.max = 100; rg.value = 50; rg.className = 'sk-range'; rg.setAttribute('aria-label', T.kay);
    stage.appendChild(pa); stage.appendChild(pb); stage.appendChild(bar); stage.appendChild(rg);
    var not = el('p', 'sk-not');
    fa.appendChild(tabs); fa.appendChild(stage); fa.appendChild(not);
    grid.appendChild(fa);
    root.appendChild(grid);

    function setP() { stage.style.setProperty('--p', rg.value + '%'); }
    rg.addEventListener('input', setP); setP();
    // Yalnız kaydırıcıda fare basılıyken görsel kayar; sayfa kaydırması (dikey dokunma) serbest.
    var tabBtns = [];
    function sec(i) {
      var t = T.tabs[i];
      tabBtns.forEach(function (b, j) { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      ia.src = base + t.a; ib.src = base + t.b; ia.alt = vt(t.l); ib.alt = vt(t.r);
      la.textContent = vt(t.l); lb.textContent = vt(t.r);
      stage.classList.toggle('dik', !!t.dik);
      hd.lastChild.hidden = !t.sim;
      not.innerHTML = t.n; rg.value = 50; setP();
    }
    T.tabs.forEach(function (t, i) {
      var b = el('button', 'sk-tab', vt(t.t)); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'sk-tab-' + t.id;
      b.addEventListener('click', function () { sec(i); });
      b.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var k = (i + (e.key === 'ArrowRight' ? 1 : -1) + T.tabs.length) % T.tabs.length; sec(k); tabBtns[k].focus(); e.preventDefault(); } });
      tabBtns.push(b); tabs.appendChild(b);
    });
    sec(0); // VARSAYILAN: 2x Makro Vanilya/Eğitimsiz (Ovoid) ↔ ATLAS QLoRA (Kuboidal) — Özgün sekmesi hiçbir zaman varsayılan değildir.
    T.tabs.forEach(function (t) { var p = new Image(); p.src = base + t.a; var q = new Image(); q.src = base + t.b; });

    /* ---- 3B çizim ---- */
    var ctx = cv.getContext('2d'), LM = null, norm = null, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var yaw = 0.28, pitch = -0.06, spin = true, vec = true, st = 0, drag = false, lx = 0, ly = 0, gorunur = true, raf = 0;
    function boyut() { var r = cw.getBoundingClientRect(); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
    boyut();
    if (window.ResizeObserver) new ResizeObserver(boyut).observe(cw); else window.addEventListener('resize', boyut);
    function spinSet(v) { spin = v; bSpin.setAttribute('aria-pressed', String(v)); }
    bSpin.addEventListener('click', function () { spinSet(!spin); });
    bVec.addEventListener('click', function () { vec = !vec; bVec.setAttribute('aria-pressed', String(vec)); });
    bOn.addEventListener('click', function () { yaw = 0; pitch = 0; spinSet(false); });
    bSol.addEventListener('click', function () { yaw = -0.75; pitch = 0.05; spinSet(false); });
    bSag.addEventListener('click', function () { yaw = 0.75; pitch = 0.05; spinSet(false); });
    function pd(e) { drag = true; spinSet(false); lx = e.clientX; ly = e.clientY; cw.setPointerCapture && cw.setPointerCapture(e.pointerId); }
    function pm(e) { if (!drag) return; yaw += (e.clientX - lx) * 0.009; pitch = Math.max(-0.7, Math.min(0.7, pitch + (e.clientY - ly) * 0.009)); lx = e.clientX; ly = e.clientY; }
    function pu() { drag = false; }
    cw.addEventListener('pointerdown', pd); cw.addEventListener('pointermove', pm); cw.addEventListener('pointerup', pu); cw.addEventListener('pointercancel', pu);
    cw.addEventListener('keydown', function (e) { var k = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key]; if (k) { yaw += k[0]; pitch += k[1]; spinSet(false); e.preventDefault(); } });
    cw.tabIndex = 0;

    function proj(p, W, H) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var x = p[0] * cy - p[2] * sy, z = p[0] * sy + p[2] * cy;
      var y = p[1] * cp - z * sp, z2 = p[1] * sp + z * cp;
      var f = (H * 1.04) / (1.55 + z2);
      return [W * 0.5 + x * f, H * 0.5 + y * f, z2];
    }
    var renk = { t: 0 };
    function renkler() { var n = Date.now(); if (n - renk.t < 800) return renk; renk.t = n; renk.fg = cssVar('--fg', '#0f172a'); renk.acc = cssVar('--acc', '#1d4ed8'); renk.ok = cssVar('--ok', '#0d9488'); renk.mut = cssVar('--mut', '#475569'); renk.koyu = document.documentElement.getAttribute('data-theme') === 'dark' || (matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.getAttribute('data-theme') !== 'light'); return renk; }
    function ciz() {
      raf = 0; if (!LM) return;
      if (spin) { st += 0.016; yaw = Math.sin(st) * 0.52; pitch = Math.cos(st * 0.7) * 0.10; }
      var W = cv.width, H = cv.height, R = renkler();
      ctx.clearRect(0, 0, W, H);
      var P = new Array(norm.length); for (var i = 0; i < norm.length; i++) P[i] = proj(norm[i], W, H);
      var tel = R.koyu ? '100,180,255' : '29,78,216';
      ctx.lineWidth = 0.85 * dpr;
      var E = LM.edges;
      for (var k = 0; k < E.length; k++) {
        var a = P[E[k][0]], b = P[E[k][1]], d = (a[2] + b[2]) * 0.5;
        var al = Math.max(0.08, Math.min(0.55, 0.33 - d * 0.8));
        ctx.strokeStyle = 'rgba(' + tel + ',' + al.toFixed(2) + ')';
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      ctx.fillStyle = R.koyu ? 'rgba(186,230,253,.65)' : 'rgba(15,23,42,.55)';
      var s = 2 * dpr; for (i = 0; i < P.length; i++) ctx.fillRect(P[i][0] - 1, P[i][1] - 1, s, s);
      if (vec) {
        var zyL = P[234], zyR = P[454], goL = P[172], goR = P[397], ch = P[152], cyan = '#06b6d4';
        ctx.strokeStyle = cyan; ctx.lineWidth = 3.2 * dpr; ctx.beginPath(); ctx.moveTo(zyL[0], zyL[1]); ctx.lineTo(zyR[0], zyR[1]); ctx.stroke();
        ctx.strokeStyle = R.ok; ctx.lineWidth = 4 * dpr; ctx.beginPath(); ctx.moveTo(goL[0], goL[1]); ctx.lineTo(goR[0], goR[1]); ctx.stroke();
        ctx.strokeStyle = R.ok; ctx.globalAlpha = .6; ctx.lineWidth = 2.2 * dpr; ctx.setLineDash([5 * dpr, 4 * dpr]);
        ctx.beginPath(); ctx.moveTo(zyL[0], zyL[1]); ctx.lineTo(goL[0], goL[1]); ctx.lineTo(ch[0], ch[1]); ctx.lineTo(goR[0], goR[1]); ctx.lineTo(zyR[0], zyR[1]); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
        var L = lang === 'en' ? ['ZY', 'ZY (629.7 px)', 'Go', 'Go (526.9 px · 0.837)'] : ['ZY', 'ZY (629,7 px)', 'Go', 'Go (526,9 px · 0,837)'];
        ctx.font = 'bold ' + (11 * dpr) + 'px ui-monospace, Menlo, monospace';
        [[zyL, cyan, L[0]], [zyR, cyan, L[1]], [goL, R.ok, L[2]], [goR, R.ok, L[3]]].forEach(function (q) {
          ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(q[0][0], q[0][1], 5.5 * dpr, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = R.fg; ctx.fillText(q[2], q[0][0] + 8 * dpr, q[0][1] + 4 * dpr);
        });
      }
      if (gorunur) raf = requestAnimationFrame(ciz);
    }
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { gorunur = es[0].isIntersecting; if (gorunur && !raf) raf = requestAnimationFrame(ciz); }, { rootMargin: '80px' }).observe(cw);
    fetch(base + 'landmarks-3d.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      LM = j; var p = j.pts, cx = 0, cy = 0, cz = 0, n = p.length;
      for (var i = 0; i < n; i++) { cx += p[i][0]; cy += p[i][1]; cz += p[i][2]; } cx /= n; cy /= n; cz /= n;
      norm = p.map(function (q) { return [(q[0] - cx) * 1.45, (q[1] - cy) * 1.85, (q[2] - cz) * 1.65]; });
      yk.remove(); if (!raf) raf = requestAnimationFrame(ciz);
    }).catch(function () { yk.textContent = T.hata; });
  }
  function basla() { var ks = document.querySelectorAll('.sk[data-sk-base]'); for (var i = 0; i < ks.length; i++) kur(ks[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
