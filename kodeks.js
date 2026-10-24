/* atlasmaster.app — Kodeks Seçmeli Sistem Motoru (v1.0)
   Kipler: bolum · otonomi · secici
   Mobil (<1024px): tetik altında akordeon (0…24px), scrollY/tetik sabit.
   Masaüstü (≥1024px): sol tetik sütunu (300px) + sağ hizalı panel (±24px), scrollY farkı 0. */
/* KALFA UYGULAMA NOTU (22 Eki): am html{scroll-behavior:smooth} telafiyi animasyonlu yapıyordu → tüm scrollBy/scrollTo behavior:"instant". */
(function () {
  "use strict";

  var MASAUSTU_SINIR = 1024;
  var grupSayac = 0;
  var bolumKayitlari = [];
  var otonomiKayitlari = [];
  var seciciKayitlari = [];
  var boyutZamanlayici = null;

  document.documentElement.classList.add("kodeks-js");

  function masaustuMu() {
    return window.innerWidth >= MASAUSTU_SINIR;
  }

  function rtlMi() {
    return (document.documentElement.getAttribute("dir") || "").toLowerCase() === "rtl";
  }

  function azHareketMi() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function odaklaKaydirmadan(el) {
    if (!el || typeof el.focus !== "function") return;
    try {
      el.focus({ preventScroll: true });
    } catch (_) {
      var x = window.scrollX;
      var y = window.scrollY;
      el.focus();
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({ left: x, top: y, behavior: "instant" });
    }
  }

  function klavyeHedefIndis(e, idx, toplam) {
    var ters = rtlMi() ? -1 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      return (idx + (e.key === "ArrowRight" ? ters : 1) + toplam) % toplam;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      return (idx + (e.key === "ArrowLeft" ? -ters : -1) + toplam) % toplam;
    }
    if (e.key === "Home") return 0;
    if (e.key === "End") return toplam - 1;
    return -1;
  }

  function hizalaAltSeciciler(kapsayici) {
    if (!kapsayici) return;
    for (var i = 0; i < seciciKayitlari.length; i++) {
      if (kapsayici.contains(seciciKayitlari[i].kapsayici)) {
        yerlestirSeciciPanel(seciciKayitlari[i]);
      }
    }
  }

  /* ==========================================================================
     1. BÖLÜM KİPİ ([data-kodeks-secmeli="bolum"] — ör. reaper.html)
     ========================================================================== */

  function bolumDurdurucuMu(dugum) {
    if (!dugum || dugum.nodeType !== 1) return false;
    var ad = dugum.tagName;
    return ad === "FOOTER" || ad === "NAV" || ad === "ASIDE" || dugum.classList.contains("paylas");
  }

  function hizalaMasaustuBolum(kayit) {
    if (!kayit || !masaustuMu() || kayit.aktifIndis < 0) return;
    var kalem = kayit.kalemler[kayit.aktifIndis];
    if (!kalem) return;
    kalem.panel.style.marginTop = "0px";
    var sagTop = kayit.sagSutun.getBoundingClientRect().top;
    var tetikTop = kalem.tetik.getBoundingClientRect().top;
    kalem.panel.style.marginTop = Math.max(0, Math.round(tetikTop - sagTop)) + "px";
  }

  function hizalaMobilTetikAlti(tetik, panel) {
    if (!tetik || !panel) return;
    panel.style.marginTop = "6px";
    var bosluk = Math.round(panel.getBoundingClientRect().top - tetik.getBoundingClientRect().bottom);
    if (bosluk < 0 || bosluk > 24) {
      panel.style.marginTop = Math.max(0, 6 + (6 - bosluk)) + "px";
    }
  }

  function uygulaKalemDurumu(kalemler, aktifIndis, animasyonlu) {
    for (var i = 0; i < kalemler.length; i++) {
      var k = kalemler[i];
      var acik = (i === aktifIndis);
      k.tetik.setAttribute("aria-expanded", acik ? "true" : "false");
      k.tetik.setAttribute("aria-selected", acik ? "true" : "false");
      k.tetik.classList.toggle("active", acik);
      k.tetik.classList.toggle("is-open", acik);
      if (k.h2) k.h2.classList.toggle("is-open", acik);
      if (k.sec) k.sec.classList.toggle("is-open", acik);
      k.panel.classList.toggle("is-open", acik);
      k.panel.setAttribute("data-kodeks-acik", acik ? "1" : "0");
      k.panel.setAttribute("aria-hidden", acik ? "false" : "true");
      k.panel.style.display = acik ? "block" : "none";
      if (acik && animasyonlu && !azHareketMi()) {
        k.panel.classList.remove("kodeks-panel-anim");
        void k.panel.offsetWidth;
        k.panel.classList.add("kodeks-panel-anim");
      }
    }
  }

  function yerlestirBolum(kayit) {
    var masaustu = masaustuMu();
    if (masaustu) {
      for (var i = 0; i < kayit.kalemler.length; i++) {
        if (kayit.kalemler[i].panel.parentElement !== kayit.sagSutun) {
          kayit.sagSutun.appendChild(kayit.kalemler[i].panel);
        }
      }
      if (kayit.aktifIndis === -1 && kayit.kalemler.length > 0) kayit.aktifIndis = 0;
      uygulaKalemDurumu(kayit.kalemler, kayit.aktifIndis, true);
      hizalaMasaustuBolum(kayit);
    } else {
      for (var j = 0; j < kayit.kalemler.length; j++) {
        var klm = kayit.kalemler[j];
        klm.panel.style.marginTop = "6px";
        if (klm.h2.nextElementSibling !== klm.panel) {
          klm.h2.insertAdjacentElement("afterend", klm.panel);
        }
      }
      uygulaKalemDurumu(kayit.kalemler, kayit.aktifIndis, false);
      if (kayit.aktifIndis >= 0 && kayit.kalemler[kayit.aktifIndis]) {
        hizalaMobilTetikAlti(kayit.kalemler[kayit.aktifIndis].tetik, kayit.kalemler[kayit.aktifIndis].panel);
      }
    }
  }

  function degistirDurum(kayit, indis, kullaniciMi, otonomiMi) {
    if (!kayit || indis < 0 || indis >= kayit.kalemler.length) return;
    var hedef = kayit.kalemler[indis];
    var y0 = window.scrollY;
    var x0 = window.scrollX;
    var tetikTop0 = hedef.tetik.getBoundingClientRect().top;
    var masaustu = masaustuMu();
    var ayniAcik = (kayit.aktifIndis === indis);
    var otoAcik = hedef.tetik.getAttribute("data-kodeks-oto-acik") === "1";
    var ustKapandi = (!masaustu || otonomiMi) && kayit.aktifIndis !== -1 && kayit.aktifIndis < indis && !ayniAcik;

    if (kullaniciMi) {
      for (var i = 0; i < kayit.kalemler.length; i++) {
        kayit.kalemler[i].tetik.removeAttribute("data-kodeks-oto-acik");
      }
    }

    if (ayniAcik) {
      kayit.aktifIndis = (otoAcik && kullaniciMi) ? indis : -1;
    } else {
      kayit.aktifIndis = indis;
    }

    uygulaKalemDurumu(kayit.kalemler, kayit.aktifIndis, masaustu);

    if (!otonomiMi && masaustu) {
      if (kayit.aktifIndis >= 0) hizalaMasaustuBolum(kayit);
      if (window.scrollY !== y0 || window.scrollX !== x0) window.scrollTo({ left: x0, top: y0, behavior: "instant" });
    } else {
      if (kayit.aktifIndis >= 0) {
        var aktifKlm = kayit.kalemler[kayit.aktifIndis];
        if (!masaustu) hizalaMobilTetikAlti(aktifKlm.tetik, aktifKlm.panel);
        else aktifKlm.panel.style.marginTop = "0px";
        hizalaAltSeciciler(aktifKlm.panel);
      }
      if (ustKapandi && y0 > 0) {
        var delta = Math.round(hedef.tetik.getBoundingClientRect().top - tetikTop0);
        if (Math.abs(delta) > 1) window.scrollBy({ top: delta, left: 0, behavior: "instant" });
      } else if (window.scrollY !== y0 || window.scrollX !== x0) {
        window.scrollTo({ left: x0, top: y0, behavior: "instant" });
      }
    }
  }

  function hashKalemIndisi(kalemler, hash) {
    if (!hash || hash.length <= 1) return -1;
    var id = "";
    try { id = decodeURIComponent(hash.slice(1)); } catch (_) { id = hash.slice(1); }
    if (!id) return -1;
    for (var i = 0; i < kalemler.length; i++) {
      var k = kalemler[i];
      if ((k.sec && k.sec.id === id) || (k.h2 && k.h2.id === id) || k.panel.id === id || k.tetik.id === id) return i;
      if (k.panel.querySelector("#" + CSS.escape(id))) return i;
    }
    return -1;
  }

  function kurBolumKapsayici(kapsayici) {
    if (!kapsayici || kapsayici.getAttribute("data-kodeks-hazir") === "1") return;
    var h2ler = [];
    for (var c = 0; c < kapsayici.children.length; c++) {
      if (kapsayici.children[c].tagName === "H2") h2ler.push(kapsayici.children[c]);
    }
    if (h2ler.length < 2) return;

    grupSayac += 1;
    kapsayici.setAttribute("data-kodeks-hazir", "1");

    var iskelet = document.createElement("div");
    iskelet.className = "kodeks-bolum-duzen";
    iskelet.setAttribute("data-kodeks-uretilen", "1");

    var solSutun = document.createElement("div");
    solSutun.className = "kodeks-bolum-sol kodeks-cubugu";
    solSutun.setAttribute("role", "tablist");
    solSutun.setAttribute("aria-label", kapsayici.getAttribute("aria-label") || "Bölümler");
    solSutun.setAttribute("data-kodeks-uretilen", "1");

    var sagSutun = document.createElement("div");
    sagSutun.className = "kodeks-bolum-sag";
    sagSutun.setAttribute("data-kodeks-uretilen", "1");

    iskelet.appendChild(solSutun);
    iskelet.appendChild(sagSutun);
    kapsayici.insertBefore(iskelet, h2ler[0]);

    var kalemler = [];
    for (var i = 0; i < h2ler.length; i++) {
      var h2 = h2ler[i];
      var bazId = h2.id || ("kodeks-bolum-" + grupSayac + "-" + (i + 1));
      h2.id = bazId;
      h2.classList.add("kodeks-bolum-baslik");

      var kardesler = [];
      var d = h2.nextSibling;
      while (d) {
        var sonraki = d.nextSibling;
        if (d.nodeType === 1 && d.tagName === "H2") break;
        if (bolumDurdurucuMu(d)) break;
        kardesler.push(d);
        d = sonraki;
      }

      var tetik = document.createElement("button");
      tetik.type = "button";
      tetik.id = bazId + "-tetik";
      tetik.className = "kodeks-bolum-tetik kodeks-sekme-btn";
      tetik.setAttribute("role", "tab");
      tetik.setAttribute("data-kodeks-uretilen", "1");
      tetik.setAttribute("data-kodeks-kontrol", "bolum");
      tetik.setAttribute("data-sekme", bazId);
      tetik.setAttribute("data-kodeks-indis", String(i));
      tetik.setAttribute("aria-controls", bazId + "-panel");

      while (h2.firstChild) tetik.appendChild(h2.firstChild);
      h2.appendChild(tetik);

      var panel = document.createElement("div");
      panel.id = bazId + "-panel";
      panel.className = "kodeks-bolum-panel";
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tetik.id);
      panel.setAttribute("data-kodeks-uretilen", "1");

      /* Düğümler kopyalanmaz, taşınır (#reaper-karne-tablo vb. JS referansları korunur) */
      for (var m = 0; m < kardesler.length; m++) panel.appendChild(kardesler[m]);

      solSutun.appendChild(h2);
      kalemler.push({ indis: i, h2: h2, tetik: tetik, panel: panel });
    }

    var basIndis = hashKalemIndisi(kalemler, location.hash);
    if (basIndis === -1) {
      basIndis = 0;
      kalemler[0].tetik.setAttribute("data-kodeks-oto-acik", "1");
    }

    var kayit = { kapsayici: kapsayici, iskelet: iskelet, solSutun: solSutun, sagSutun: sagSutun, kalemler: kalemler, aktifIndis: basIndis };

    solSutun.addEventListener("click", function (e) {
      var btn = e.target.closest(".kodeks-bolum-tetik[data-kodeks-kontrol='bolum']");
      if (!btn || !solSutun.contains(btn)) return;
      e.preventDefault();
      degistirDurum(kayit, parseInt(btn.getAttribute("data-kodeks-indis"), 10), true, false);
    });

    solSutun.addEventListener("keydown", function (e) {
      var btn = e.target.closest(".kodeks-bolum-tetik[data-kodeks-kontrol='bolum']");
      if (!btn || !solSutun.contains(btn)) return;
      var hedefIdx = klavyeHedefIndis(e, parseInt(btn.getAttribute("data-kodeks-indis"), 10), kayit.kalemler.length);
      if (hedefIdx !== -1) {
        e.preventDefault();
        kayit.aktifIndis = -1;
        degistirDurum(kayit, hedefIdx, true, false);
        odaklaKaydirmadan(kayit.kalemler[hedefIdx].tetik);
      }
    });

    yerlestirBolum(kayit);
    bolumKayitlari.push(kayit);
  }

  /* ==========================================================================
     2. OTONOMİ KİPİ (main[data-kodeks-secmeli="otonomi"])
     ========================================================================== */

  function kurOtonomiKapsayici(mainEl) {
    if (!mainEl || mainEl.getAttribute("data-kodeks-hazir") === "1") return;
    var secList = mainEl.querySelectorAll("section.sec[id]:not(.hero), section#kaynaklar, section#okuma-yolu");
    if (!secList.length) return;

    mainEl.setAttribute("data-kodeks-hazir", "1");
    mainEl.setAttribute("role", "tablist");
    var kalemler = [];

    for (var i = 0; i < secList.length; i++) {
      var sec = secList[i];
      var icKap = sec.querySelector(".wrap") || sec;
      var h2 = icKap.querySelector("h2");
      if (!h2) continue;

      var idx = kalemler.length;
      var bazId = sec.id || h2.id || ("kodeks-otonomi-" + (idx + 1));
      h2.classList.add("kodeks-bolum-baslik");
      sec.classList.add("kodeks-otonomi-sec");

      var duzen = document.createElement("div");
      duzen.className = "kodeks-otonomi-duzen";
      duzen.setAttribute("data-kodeks-uretilen", "1");
      h2.parentElement.insertBefore(duzen, h2);

      var kardesler = [];
      var d = h2.nextSibling;
      while (d) {
        var sonraki = d.nextSibling;
        kardesler.push(d);
        d = sonraki;
      }

      var tetik = document.createElement("button");
      tetik.type = "button";
      tetik.id = bazId + "-tetik";
      tetik.className = "kodeks-bolum-tetik kodeks-sekme-btn";
      tetik.setAttribute("role", "tab");
      tetik.setAttribute("data-kodeks-uretilen", "1");
      tetik.setAttribute("data-kodeks-kontrol", "bolum");
      tetik.setAttribute("data-sekme", bazId);
      tetik.setAttribute("data-kodeks-indis", String(idx));
      tetik.setAttribute("aria-controls", bazId + "-panel");

      while (h2.firstChild) tetik.appendChild(h2.firstChild);
      h2.appendChild(tetik);

      var panel = document.createElement("div");
      panel.id = bazId + "-panel";
      panel.className = "kodeks-bolum-panel";
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tetik.id);
      panel.setAttribute("data-kodeks-uretilen", "1");

      for (var m = 0; m < kardesler.length; m++) panel.appendChild(kardesler[m]);

      duzen.appendChild(h2);
      duzen.appendChild(panel);

      kalemler.push({ indis: idx, sec: sec, h2: h2, tetik: tetik, panel: panel });
    }

    if (!kalemler.length) return;

    var basIndis = hashKalemIndisi(kalemler, location.hash);
    if (basIndis === -1) {
      basIndis = 0;
      kalemler[0].tetik.setAttribute("data-kodeks-oto-acik", "1");
    }

    var kayit = { kapsayici: mainEl, kalemler: kalemler, aktifIndis: basIndis };
    uygulaKalemDurumu(kalemler, basIndis, masaustuMu());
    if (!masaustuMu() && kalemler[basIndis]) {
      hizalaMobilTetikAlti(kalemler[basIndis].tetik, kalemler[basIndis].panel);
    }

    mainEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".kodeks-bolum-tetik[data-kodeks-kontrol='bolum']");
      if (!btn || !mainEl.contains(btn)) return;
      var indis = parseInt(btn.getAttribute("data-kodeks-indis"), 10);
      if (isNaN(indis) || !kalemler[indis] || kalemler[indis].tetik !== btn) return;
      e.preventDefault();
      degistirDurum(kayit, indis, true, true);
    });

    mainEl.addEventListener("keydown", function (e) {
      var btn = e.target.closest(".kodeks-bolum-tetik[data-kodeks-kontrol='bolum']");
      if (!btn || !mainEl.contains(btn)) return;
      var indis = parseInt(btn.getAttribute("data-kodeks-indis"), 10);
      if (isNaN(indis) || !kalemler[indis] || kalemler[indis].tetik !== btn) return;
      var hedefIdx = klavyeHedefIndis(e, indis, kalemler.length);
      if (hedefIdx !== -1) {
        e.preventDefault();
        kayit.aktifIndis = -1;
        degistirDurum(kayit, hedefIdx, true, true);
        odaklaKaydirmadan(kalemler[hedefIdx].tetik);
      }
    });

    otonomiKayitlari.push(kayit);
  }

  /* ==========================================================================
     3. SEÇİCİ KİPİ (#maya-qa-switcher[data-kodeks-secmeli="secici"] ve .qa)
     ========================================================================== */

  function ustOtonomiAcikTut(el) {
    for (var i = 0; i < otonomiKayitlari.length; i++) {
      var oKayit = otonomiKayitlari[i];
      for (var j = 0; j < oKayit.kalemler.length; j++) {
        if (oKayit.kalemler[j].panel.contains(el) && oKayit.aktifIndis !== j) {
          oKayit.aktifIndis = j;
          uygulaKalemDurumu(oKayit.kalemler, j, false);
        }
      }
    }
  }

  function yerlestirSeciciPanel(kayit) {
    if (!kayit) return;
    for (var i = 0; i < kayit.sekmeler.length; i++) {
      var acik = (i === kayit.aktifIndis);
      var sekme = kayit.sekmeler[i];
      var panel = kayit.paneller[i];
      sekme.classList.toggle("active", acik);
      sekme.classList.toggle("is-selected", acik);
      sekme.setAttribute("aria-selected", acik ? "true" : "false");
      sekme.setAttribute("aria-expanded", acik ? "true" : "false");
      panel.setAttribute("data-kodeks-acik", acik ? "1" : "0");
      panel.setAttribute("aria-hidden", acik ? "false" : "true");
      panel.style.display = "none";
      if (panel.parentElement !== kayit.kapsayici) {
        kayit.kapsayici.appendChild(panel);
      }
    }

    if (kayit.aktifIndis < 0 || !kayit.paneller[kayit.aktifIndis]) return;

    var aktifSekme = kayit.sekmeler[kayit.aktifIndis];
    var aktifPanel = kayit.paneller[kayit.aktifIndis];

    /* Sekmeler sarılıyorsa aktif sekmenin bulunduğu görsel satırın son sekmesini bul */
    var hedefTop = aktifSekme.offsetTop;
    var satirSonuSekme = aktifSekme;
    for (var k = 0; k < kayit.sekmeler.length; k++) {
      if (Math.abs(kayit.sekmeler[k].offsetTop - hedefTop) <= 10) {
        satirSonuSekme = kayit.sekmeler[k];
      }
    }

    satirSonuSekme.insertAdjacentElement("afterend", aktifPanel);
    aktifPanel.style.display = "block";
    aktifPanel.style.marginTop = "6px";

    var fark = Math.round(aktifPanel.getBoundingClientRect().top - aktifSekme.getBoundingClientRect().bottom);
    if (fark < 0 || fark > 24) {
      aktifPanel.style.marginTop = Math.max(0, 6 + (6 - fark)) + "px";
    }
  }

  function seciciSec(kayit, indis, kullaniciMi, zorlaAc) {
    if (!kayit || indis < 0 || indis >= kayit.sekmeler.length) return;
    ustOtonomiAcikTut(kayit.kapsayici);

    var hedefSekme = kayit.sekmeler[indis];
    var y0 = window.scrollY;
    var x0 = window.scrollX;
    var top0 = hedefSekme.getBoundingClientRect().top;
    var ayniAcik = (kayit.aktifIndis === indis);
    var otoAcik = hedefSekme.getAttribute("data-kodeks-oto-acik") === "1";

    if (kullaniciMi) {
      for (var i = 0; i < kayit.sekmeler.length; i++) {
        kayit.sekmeler[i].removeAttribute("data-kodeks-oto-acik");
      }
    }

    if (zorlaAc) {
      kayit.aktifIndis = indis;
    } else if (ayniAcik) {
      kayit.aktifIndis = (otoAcik && kullaniciMi) ? indis : -1;
    } else {
      kayit.aktifIndis = indis;
    }

    yerlestirSeciciPanel(kayit);

    var top1 = hedefSekme.getBoundingClientRect().top;
    if (y0 > 0 && Math.abs(top1 - top0) > 2) {
      window.scrollBy({ top: Math.round(top1 - top0), left: 0, behavior: "instant" });
    } else if (window.scrollY !== y0 || window.scrollX !== x0) {
      window.scrollTo({ left: x0, top: y0, behavior: "instant" });
    }
  }

  function kurSeciciKapsayici(kapsayici) {
    if (!kapsayici || kapsayici.getAttribute("data-kodeks-hazir") === "1") return;
    var tabCubugu = kapsayici.querySelector(".maya-qa-tabs, [role='tablist']");
    var sekmeler = kapsayici.querySelectorAll(".maya-qa-tab, [role='tab']");
    var paneller = kapsayici.querySelectorAll(".maya-qa-panel, [data-maya-panel]");
    if (!tabCubugu || !sekmeler.length || sekmeler.length !== paneller.length) return;

    grupSayac += 1;
    kapsayici.setAttribute("data-kodeks-hazir", "1");
    tabCubugu.setAttribute("role", "tablist");

    var sekmeDizi = Array.prototype.slice.call(sekmeler);
    var panelDizi = Array.prototype.slice.call(paneller);

    for (var i = 0; i < sekmeDizi.length; i++) {
      var s = sekmeDizi[i];
      var p = panelDizi[i];
      var bazId = (kapsayici.id || ("kodeks-secici-" + grupSayac)) + "-" + i;
      s.id = s.id || (bazId + "-tab");
      p.id = p.id || (bazId + "-panel");
      p.removeAttribute("hidden");
      s.removeAttribute("onclick");
      s.setAttribute("role", "tab");
      s.setAttribute("data-kodeks-kontrol", "secici");
      s.setAttribute("data-sekme", String(i));
      s.setAttribute("data-kodeks-indis", String(i));
      s.setAttribute("aria-controls", p.id);
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", s.id);
    }

    sekmeDizi[0].setAttribute("data-kodeks-oto-acik", "1");
    var kayit = { kapsayici: kapsayici, tabCubugu: tabCubugu, sekmeler: sekmeDizi, paneller: panelDizi, aktifIndis: 0 };

    tabCubugu.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-kodeks-kontrol='secici']");
      if (!btn || !tabCubugu.contains(btn)) return;
      e.preventDefault();
      seciciSec(kayit, parseInt(btn.getAttribute("data-kodeks-indis"), 10), true, false);
    });

    tabCubugu.addEventListener("keydown", function (e) {
      var btn = e.target.closest("[data-kodeks-kontrol='secici']");
      if (!btn || !tabCubugu.contains(btn)) return;
      var hedefIdx = klavyeHedefIndis(e, parseInt(btn.getAttribute("data-kodeks-indis"), 10), sekmeDizi.length);
      if (hedefIdx !== -1) {
        e.preventDefault();
        seciciSec(kayit, hedefIdx, true, true);
        odaklaKaydirmadan(sekmeDizi[hedefIdx]);
      }
    });

    yerlestirSeciciPanel(kayit);
    seciciKayitlari.push(kayit);

    if (kapsayici.id === "maya-qa-switcher") {
      window.__switchMayaTab = function (idx) {
        seciciSec(kayit, Number(idx) || 0, true, false);
      };
    }
  }

  /* ==========================================================================
     4. BAŞLATMA VE OLAYLAR
     ========================================================================== */

  function baslat() {
    var bolumler = document.querySelectorAll('[data-kodeks-secmeli="bolum"]');
    for (var i = 0; i < bolumler.length; i++) kurBolumKapsayici(bolumler[i]);

    var otonomiler = document.querySelectorAll('main[data-kodeks-secmeli="otonomi"], [data-kodeks-secmeli="otonomi"]');
    for (var j = 0; j < otonomiler.length; j++) kurOtonomiKapsayici(otonomiler[j]);

    var seciciler = document.querySelectorAll('[data-kodeks-secmeli="secici"]');
    for (var k = 0; k < seciciler.length; k++) kurSeciciKapsayici(seciciler[k]);
  }

  window.addEventListener("resize", function () {
    if (boyutZamanlayici) clearTimeout(boyutZamanlayici);
    boyutZamanlayici = setTimeout(function () {
      for (var i = 0; i < bolumKayitlari.length; i++) yerlestirBolum(bolumKayitlari[i]);
      for (var j = 0; j < otonomiKayitlari.length; j++) {
        var ok = otonomiKayitlari[j];
        uygulaKalemDurumu(ok.kalemler, ok.aktifIndis, false);
      }
      for (var k = 0; k < seciciKayitlari.length; k++) yerlestirSeciciPanel(seciciKayitlari[k]);
    }, 60);
  });

  window.addEventListener("hashchange", function () {
    for (var i = 0; i < bolumKayitlari.length; i++) {
      var bIdx = hashKalemIndisi(bolumKayitlari[i].kalemler, location.hash);
      if (bIdx !== -1) degistirDurum(bolumKayitlari[i], bIdx, true, false);
    }
    for (var j = 0; j < otonomiKayitlari.length; j++) {
      var oIdx = hashKalemIndisi(otonomiKayitlari[j].kalemler, location.hash);
      if (oIdx !== -1) degistirDurum(otonomiKayitlari[j], oIdx, true, true);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
})();
