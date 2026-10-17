(() => {
  "use strict";

  // 0. Çok Dilli (TR / EN / AR) Sayfa Gezinme Sürekliliği
  //    - Ana sayfalar (index/tr/en/ar.html) kendi dilini belirler.
  //    - Alt sayfalarda dil ?lang=en|ar ile (yoksa oturumdan) gelir; menü, alt bar, şube/iletişim
  //      başlıkları ve temel arayüz öğeleri çevrilir, AR'da dir="rtl" uygulanır.
  //    - ?lang ve ?ekip=gokhan|seyit|emrah|uzel parametreleri tüm iç bağlantılarda korunur.
  const DILLER = ["tr", "en", "ar"];
  const ANA_SAYFALAR = { "": "tr", "index.html": "tr", "tr.html": "tr", "en.html": "en", "ar.html": "ar" };
  const EV_SAYFASI = { tr: "index.html", en: "en.html", ar: "ar.html" };
  const params = new URLSearchParams(window.location.search);
  const sayfa = decodeURIComponent((window.location.pathname.split("/").pop() || "").toLowerCase());
  const anaSayfaMi = Object.prototype.hasOwnProperty.call(ANA_SAYFALAR, sayfa);

  const oturumOku = (k) => { try { return sessionStorage.getItem(k) || ""; } catch (_) { return ""; } };
  const oturumYaz = (k, v) => { try { v ? sessionStorage.setItem(k, v) : sessionStorage.removeItem(k); } catch (_) {} };

  let dil = (params.get("lang") || "").toLowerCase();
  if (anaSayfaMi) {
    dil = ANA_SAYFALAR[sayfa];
  } else if (!DILLER.includes(dil)) {
    const kayitli = oturumOku("evdis_dil");
    dil = DILLER.includes(kayitli) ? kayitli : "tr";
  }
  oturumYaz("evdis_dil", dil);

  let ekip = (params.get("ekip") || "").toLowerCase();
  if (!/^(gokhan|seyit|emrah|uzel)$/.test(ekip)) ekip = oturumOku("evdis_ekip");
  if (ekip) oturumYaz("evdis_ekip", ekip);

  const htmlEl = document.documentElement;
  if (!anaSayfaMi && dil !== "tr") {
    htmlEl.setAttribute("lang", dil);
    htmlEl.setAttribute("dir", dil === "ar" ? "rtl" : "ltr");
  }

  const SOZLUK = {
    "Kurumsal": ["Corporate", "المؤسسة"],
    "Misyon, Vizyon ve Değerlerimiz": ["Mission, Vision & Values", "الرسالة والرؤية والقيم"],
    "Tıbbi Hizmetler Direktörlüğümüz": ["Medical Services Directorate", "إدارة الخدمات الطبية"],
    "Yönetim Kurulu & Mesul Müdürlük": ["Board & Responsible Management", "مجلس الإدارة والمدير المسؤول"],
    "Organizasyon Şeması": ["Organization Chart", "الهيكل التنظيمي"],
    "Hasta Hakları ve Sorumlulukları": ["Patient Rights & Responsibilities", "حقوق المريض ومسؤولياته"],
    "KVKK Politikası": ["Data Protection (KVKK) Policy", "سياسة حماية البيانات (KVKK)"],
    "Aydınlatma Metni": ["Privacy Notice", "نص الإفصاح"],
    "Çerez ve Gizlilik Politikası": ["Cookie & Privacy Policy", "سياسة ملفات الارتباط والخصوصية"],
    "Veri Saklama ve İmha Politikası": ["Data Retention & Disposal Policy", "سياسة الاحتفاظ بالبيانات وإتلافها"],
    "Özel Nitelikli Kişisel Veri Politikası": ["Sensitive Personal Data Policy", "سياسة البيانات الشخصية الحساسة"],
    "Hizmetlerimiz": ["Treatments", "خدماتنا"],
    "İmplant ve Çene Cerrahisi": ["Implants & Oral Surgery", "زراعة الأسنان وجراحة الفم والفكين"],
    "Endodonti (Kanal Tedavisi)": ["Endodontics (Root Canal)", "علاج العصب (قناة الجذر)"],
    "Ortodonti ve Şeffaf Plak": ["Orthodontics & Clear Aligners", "تقويم الأسنان والمصففات الشفافة"],
    "Ortodonti": ["Orthodontics", "تقويم الأسنان"],
    "Periodontoloji (Diş Eti & GBT)": ["Periodontology (Gums & GBT)", "أمراض اللثة و GBT"],
    "Periodontoloji (Diş Eti Sağlığı)": ["Periodontology (Gum Health)", "أمراض اللثة"],
    "Protetik ve Estetik Diş Tedavileri": ["Prosthodontics & Smile Design", "التركيبات وتصميم الابتسامة"],
    "Protetik Diş Tedavileri": ["Prosthodontics", "التركيبات السنية"],
    "Çocuk Diş Hekimliği (Pedodonti)": ["Pediatric Dentistry", "طب أسنان الأطفال"],
    "Dijital Dolgu & Kompozit Lamine": ["Digital Fillings & Composite Veneers", "الحشوات الرقمية والقشور المركبة"],
    "Dijital ve Restoratif Diş Hekimliği": ["Digital & Restorative Dentistry", "طب الأسنان الرقمي والترميمي"],
    "Sedasyon ve Genel Anestezi Birimi": ["Sedation & General Anesthesia", "وحدة التخدير الواعي والتخدير العام"],
    "Hekimlerimiz": ["Our Doctors", "أطباؤنا"],
    "Kalite Yönetimi": ["Quality Management", "إدارة الجودة"],
    "Kalite Politikamız & Sorumlumuz": ["Quality Policy & Officer", "سياسة الجودة ومسؤولها"],
    "SKS Komitelerimiz (5 Komite)": ["Quality Committees (5)", "لجان الجودة (5)"],
    "SKS Kalite ve Kod Ekiplerimiz (12 Ekip)": ["Quality & Code Teams (12)", "فرق الجودة والطوارئ (12)"],
    "Öz Değerlendirme & Sürekli İyileştirme": ["Self-Assessment & Continuous Improvement", "التقييم الذاتي والتحسين المستمر"],
    "📋 Gökhan Bey İdari & İçerik Eksik Listesi": ["📋 Admin & Content Checklist", "📋 قائمة المراجعة الإدارية والمحتوى"],
    "📋 Gökhan Bey Eksik & Blog Listesi": ["📋 Content & Blog Checklist", "📋 قائمة المحتوى والمدونة"],
    "📋 Gökhan Bey Kriter & Eksik Listesi": ["📋 Criteria & Checklist", "📋 قائمة المعايير والمراجعة"],
    "Blog & Rehber": ["Blog & Guide", "المدونة والدليل"],
    "İletişim": ["Contact", "تواصل معنا"],
    "Serdivan Merkez Şubesi (18 Hekim)": ["Serdivan Main Branch (18 Doctors)", "فرع سرديفان الرئيسي (18 طبيباً)"],
    "Adapazarı Şubesi (2 Hekim)": ["Adapazarı Branch (2 Doctors)", "فرع أدابازاري (طبيبان)"],
    "Dilek · Öneri · Şikayet Formu": ["Feedback & Complaint Form", "نموذج الاقتراحات والشكاوى"],
    "İnsan Kaynakları (Başvuru)": ["Careers (Apply)", "الموارد البشرية (التقديم)"],
    "✨ E-Randevu": ["✨ Appointment", "✨ حجز موعد"],
    "Özel Evdiş Ağız ve Diş Sağlığı Merkezi · Sakarya": ["Evdiş Oral & Dental Health Center · Sakarya", "مركز إيف ديش لصحة الفم والأسنان · ساكاريا"],
    "Serdivan Merkez Şubesi": ["Serdivan Main Branch", "فرع سرديفان الرئيسي"],
    "Serdivan Şubesi": ["Serdivan Branch", "فرع سرديفان"],
    "Adapazarı Şubesi": ["Adapazarı Branch", "فرع أدابازاري"],
    "Şube Detayı ve 18 Hekimimiz →": ["Branch details & our 18 doctors →", "تفاصيل الفرع وأطباؤنا الـ18 ←"],
    "Şube Detayı ve 2 Hekimimiz →": ["Branch details & our 2 doctors →", "تفاصيل الفرع وطبيبانا ←"],
    "Kurumsal & Zorunlu Belgeler": ["Corporate & Legal Documents", "الوثائق المؤسسية والقانونية"],
    "Tel:": ["Phone:", "هاتف:"],
    "GSM:": ["Mobile / WhatsApp:", "جوال / واتساب:"],
    "Kurumsal (Misyon, Vizyon, Yönetim, Organizasyon)": ["Corporate (Mission, Vision, Management, Organization)", "المؤسسة (الرسالة، الرؤية، الإدارة، التنظيم)"],
    "Kalite Yönetimi (SKS Komite ve Ekiplerimiz)": ["Quality Management (Committees & Teams)", "إدارة الجودة (اللجان والفرق)"],
    "KVKK, Aydınlatma, Çerez ve İmha Politikaları": ["KVKK, Privacy, Cookie & Disposal Policies", "سياسات حماية البيانات والخصوصية وملفات الارتباط والإتلاف"],
    "Dilek / Öneri / Şikayet": ["Feedback / Complaints", "الاقتراحات / الشكاوى"],
    "İnsan Kaynakları": ["Careers", "الموارد البشرية"],
    "📞 Ara": ["📞 Call", "📞 اتصال"],
    "💬 WhatsApp": ["💬 WhatsApp", "💬 واتساب"],
    "🦷 Rehber": ["🦷 Guide", "🦷 الدليل"],
    "📍 Şubeler": ["📍 Branches", "📍 الفروع"],
    "Serdivan Merkez Şubesi Kadrosu": ["Serdivan Main Branch Team", "فريق فرع سرديفان الرئيسي"],
    "Adapazarı Şubesi Hekimlerimiz": ["Adapazarı Branch Doctors", "أطباء فرع أدابازاري"],
    "Evdiş Sakarya · Merkez Şube (18 Aktif Hekim)": ["Evdiş Sakarya · Main Branch (18 Active Doctors)", "إيف ديش ساكاريا · الفرع الرئيسي (18 طبيباً)"],
    "Evdiş Sakarya · Adapazarı Şubesi": ["Evdiş Sakarya · Adapazarı Branch", "إيف ديش ساكاريا · فرع أدابازاري"],
    "Serdivan Şubemizde Görev Yapan Hekimlerimiz (18 Hekim)": ["Doctors at Our Serdivan Branch (18)", "الأطباء العاملون في فرع سرديفان (18)"],
    "Adapazarı Şubemizde Görev Yapan Hekimlerimiz (2 Hekim)": ["Doctors at Our Adapazarı Branch (2)", "الأطباء العاملون في فرع أدابازاري (2)"],
    "Serdivan Şubemiz Hakkında Sıkça Sorulanlar": ["Serdivan Branch FAQ", "الأسئلة الشائعة عن فرع سرديفان"],
    "Adapazarı Şubemiz Hakkında Sıkça Sorulanlar": ["Adapazarı Branch FAQ", "الأسئلة الشائعة عن فرع أدابازاري"],
    "Hekimlerimiz ve Uzmanlık Alanlarımız": ["Our Doctors & Specialties", "أطباؤنا وتخصصاتنا"],
    "Serdivan (18 Hekim) · Adapazarı (2 Hekim)": ["Serdivan (18 Doctors) · Adapazarı (2 Doctors)", "سرديفان (18 طبيباً) · أدابازاري (طبيبان)"],
    "Tüm Hekimlerimiz (20)": ["All Doctors (20)", "جميع الأطباء (20)"],
    "Serdivan Şubesi (18)": ["Serdivan Branch (18)", "فرع سرديفان (18)"],
    "Adapazarı Şubesi (2)": ["Adapazarı Branch (2)", "فرع أدابازاري (2)"],
    "Tanı, Süreç ve Klinik Uygulama Bilgilendirmesi": ["Diagnosis, Process & Clinical Information", "التشخيص والإجراءات والمعلومات السريرية"],
    "Kurumsal Yapımız ve Resmi Politikalarımız": ["Our Corporate Structure & Official Policies", "هيكلنا المؤسسي وسياساتنا الرسمية"],
    "Sakarya Serdivan & Adapazarı · Özel Evdiş": ["Sakarya Serdivan & Adapazarı · Evdiş", "ساكاريا سرديفان وأدابازاري · إيف ديش"]
  };
  const DESENLER = [
    [/^Uzman Hekim Bilgilendirme Rehberi \((\d+) Makale\)$/, ["Specialist Patient Guide ($1 Articles)", "دليل الأطباء المختصين ($1 مقالات)"]],
    [/^Bu Branştaki Uzman ve İlgili Hekimlerimiz \((\d+) Hekim\)$/, ["Specialists in This Branch ($1 Doctors)", "الأطباء المختصون في هذا الفرع ($1)"]],
    [/^(İmplant & Çene Cerrahisi|Endodonti · Kanal Tedavisi|Protetik & Estetik Diş|Ortodonti|Çocuk Diş · Pedodonti|Periodontoloji · Diş Eti|Anestezi & Sedasyon|Restoratif & Dijital Diş Hekimliği) \((\d+)\)$/, null]
  ];
  const SEKME_ADLARI = {
    "İmplant & Çene Cerrahisi": ["Implants & Oral Surgery", "الزراعة وجراحة الفم"],
    "Endodonti · Kanal Tedavisi": ["Endodontics · Root Canal", "علاج العصب"],
    "Protetik & Estetik Diş": ["Prosthodontics & Aesthetics", "التركيبات والتجميل"],
    "Ortodonti": ["Orthodontics", "تقويم الأسنان"],
    "Çocuk Diş · Pedodonti": ["Pediatric Dentistry", "طب أسنان الأطفال"],
    "Periodontoloji · Diş Eti": ["Periodontology · Gums", "أمراض اللثة"],
    "Anestezi & Sedasyon": ["Anesthesia & Sedation", "التخدير والتهدئة"],
    "Restoratif & Dijital Diş Hekimliği": ["Restorative & Digital Dentistry", "طب الأسنان الترميمي والرقمي"]
  };
  const YASAL = {
    en: "Medical Disclaimer: All content on this website is for informational purposes only and does not replace professional diagnosis or treatment. Outcomes of any surgical or interventional procedure vary from person to person; please consult your dentist in detail before treatment. (Ministry of Health Regulation RG 12.11.2025 / 33075)",
    ar: "تنويه طبي وقانوني: جميع المحتويات الواردة في هذا الموقع لأغراض إعلامية فقط ولا تغني عن التشخيص أو العلاج الطبي المباشر. قد تختلف نتائج أي إجراء جراحي أو تداخلي من شخص لآخر، ويُنصح باستشارة طبيب الأسنان بالتفصيل قبل الإجراء. (لائحة وزارة الصحة رقم 33075 بتاريخ 12.11.2025)"
  };
  const ICERIK_NOTU = {
    en: { metin: "This page's detailed medical content is currently in Turkish. Menus and contact details are shown in English.", link: "English home page →" },
    ar: { metin: "المحتوى الطبي التفصيلي لهذه الصفحة متاح حالياً باللغة التركية، بينما تظهر القوائم ومعلومات التواصل بالعربية.", link: "الصفحة الرئيسية بالعربية ←" }
  };

  const ORIJINAL = new WeakMap();
  function ceviriBul(metin, hedef) {
    const i = hedef === "ar" ? 1 : 0;
    if (SOZLUK[metin]) return SOZLUK[metin][i];
    for (const [desen, karsilik] of DESENLER) {
      const m = metin.match(desen);
      if (!m) continue;
      if (karsilik) return karsilik[i].replace("$1", m[1]);
      const ad = SEKME_ADLARI[m[1]];
      if (ad) return `${ad[i]} (${m[2]})`;
    }
    return null;
  }

  function kromuCevir(hedef) {
    const alanlar = document.querySelectorAll("header.ust, footer.alt, nav.alt-eylem, .mobil-menu-cekmece, main h1, main h2, main .ust-etiket, main .bolum-etiket, main [data-sekme]");
    alanlar.forEach((alan) => {
      const yuruyucu = document.createTreeWalker(alan, NodeFilter.SHOW_TEXT);
      let dugum;
      while ((dugum = yuruyucu.nextNode())) {
        if (!ORIJINAL.has(dugum)) ORIJINAL.set(dugum, dugum.nodeValue);
        const asil = ORIJINAL.get(dugum);
        if (hedef === "tr") { dugum.nodeValue = asil; continue; }
        const kirpik = asil.trim();
        if (!kirpik) continue;
        const ceviri = ceviriBul(kirpik, hedef);
        if (ceviri) dugum.nodeValue = asil.replace(kirpik, ceviri);
      }
    });
    document.querySelectorAll("footer.alt .alt-yasal p").forEach((p) => {
      if (!p.dataset.evdisTr) p.dataset.evdisTr = p.textContent;
      if (!/^Yasal Bilgi/.test(p.dataset.evdisTr.trim())) return;
      p.textContent = hedef === "tr" ? p.dataset.evdisTr : YASAL[hedef];
    });
    let not = document.getElementById("evdis-dil-notu");
    if (hedef === "tr") { if (not) not.remove(); return; }
    const header = document.querySelector("header.ust");
    if (!header) return;
    if (!not) {
      not = document.createElement("div");
      not.id = "evdis-dil-notu";
      not.style.cssText = "background:#FDF6E3;color:#5B4A1E;font-size:13px;padding:8px 16px;text-align:center;border-bottom:1px solid #EADFC3;";
      header.insertAdjacentElement("afterend", not);
    }
    const n = ICERIK_NOTU[hedef];
    not.innerHTML = `${n.metin} <a href="${EV_SAYFASI[hedef]}" style="font-weight:700;text-decoration:underline;color:inherit;">${n.link}</a>`;
  }

  function icBaglantiMi(href) {
    return href && !/^(https?:|mailto:|tel:|javascript:|#|data:)/i.test(href) && /\.html(\?|#|$)/i.test(href);
  }

  function baglantilariGuncelle(hedef) {
    document.querySelectorAll("a[href]").forEach((a) => {
      if (a.closest(".dil-secici")) return;
      if (!a.dataset.evdisHref) a.dataset.evdisHref = a.getAttribute("href");
      const asil = a.dataset.evdisHref;
      if (!icBaglantiMi(asil)) return;
      const url = new URL(asil, window.location.href);
      const dosya = (url.pathname.split("/").pop() || "").toLowerCase();
      if (Object.prototype.hasOwnProperty.call(ANA_SAYFALAR, dosya) && dosya !== "en.html" && dosya !== "ar.html") {
        url.pathname = url.pathname.replace(/[^/]*$/, EV_SAYFASI[hedef]);
      }
      const yeniDosya = (url.pathname.split("/").pop() || "").toLowerCase();
      if (hedef !== "tr" && !Object.prototype.hasOwnProperty.call(ANA_SAYFALAR, yeniDosya)) url.searchParams.set("lang", hedef);
      else url.searchParams.delete("lang");
      if (ekip) url.searchParams.set("ekip", ekip);
      a.setAttribute("href", url.pathname.split("/").pop() + url.search + url.hash);
    });
    document.querySelectorAll(".dil-secici a").forEach((a) => {
      const hedefDil = (a.getAttribute("hreflang") || a.textContent || "").trim().slice(0, 2).toLowerCase();
      if (!DILLER.includes(hedefDil)) return;
      const q = new URLSearchParams();
      let adres;
      if (anaSayfaMi) {
        adres = EV_SAYFASI[hedefDil];
      } else {
        adres = sayfa;
        if (hedefDil !== "tr") q.set("lang", hedefDil);
      }
      if (ekip) q.set("ekip", ekip);
      const qs = q.toString();
      a.setAttribute("href", adres + (qs ? "?" + qs : ""));
      if (hedefDil === hedef) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
      if (!anaSayfaMi) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          window.evdisDilUygula(hedefDil);
        });
      }
    });
  }

  window.evdisDilUygula = function (hedef) {
    if (!DILLER.includes(hedef)) return;
    if (anaSayfaMi) {
      if (hedef !== dil) {
        const q = ekip ? "?ekip=" + encodeURIComponent(ekip) : "";
        window.location.href = EV_SAYFASI[hedef] + q;
      }
      return;
    }
    dil = hedef;
    oturumYaz("evdis_dil", dil);
    htmlEl.setAttribute("lang", dil === "tr" ? "tr" : dil);
    htmlEl.setAttribute("dir", dil === "ar" ? "rtl" : "ltr");
    const url = new URL(window.location.href);
    if (dil === "tr") url.searchParams.delete("lang");
    else url.searchParams.set("lang", dil);
    if (ekip) url.searchParams.set("ekip", ekip);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    kromuCevir(dil);
    baglantilariGuncelle(dil);
    document.dispatchEvent(new CustomEvent("evdis:dil", { detail: { dil: dil, kaynak: "site" } }));
  };
  window.evdisAktifDil = function () { return dil; };

  // Widget kendi TR | EN | AR seçicisinden dil değiştirirse alt sayfa arayüzünü de eşle
  document.addEventListener("evdis:dil", (e) => {
    const d = e.detail || {};
    if (d.kaynak === "widget" && !anaSayfaMi && d.dil && d.dil !== dil) window.evdisDilUygula(d.dil);
  });

  const sayfaDili = (htmlEl.getAttribute("lang") || "tr").toLowerCase();
  const isEN = sayfaDili.startsWith("en");
  const isAR = sayfaDili.startsWith("ar");

  // 0b. Hareket azaltma tercihi (prefers-reduced-motion) — koreografi bu tercihe saygı duyar
  const azHareketMql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const azHareket = () => !!(azHareketMql && azHareketMql.matches);

  // 1. Uzmanlık ve Şube Sekmeleri (Hekim Filtreleme) — View Transitions API ile ipeksi geçiş
  const sekmeler = document.querySelectorAll("[data-sekme]");
  const kartlar = document.querySelectorAll("[data-hekim-kart]");
  if (sekmeler.length && kartlar.length) {
    sekmeler.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filtre = btn.getAttribute("data-sekme");
        sekmeler.forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
        const uygulaFiltre = () => {
          kartlar.forEach((k) => {
            if (filtre === "tumu") {
              k.hidden = false;
            } else if (filtre === "serdivan" || filtre === "adapazari") {
              k.hidden = !(k.getAttribute("data-sube") || "").includes(filtre);
            } else {
              k.hidden = !(k.getAttribute("data-grup") || "").includes(filtre);
            }
          });
        };
        if (typeof document.startViewTransition === "function" && !azHareket()) {
          document.startViewTransition(uygulaFiltre);
        } else {
          uygulaFiltre();
        }
      });
    });
  }

  // 2. Video Diyalog Kontrolü
  const vd = document.querySelector("[data-video-diyalog]");
  const ac = document.querySelectorAll("[data-video-ac]");
  const kapat = document.querySelectorAll("[data-video-kapat]");
  if (vd) {
    const vid = vd.querySelector("video");
    ac.forEach((b) => b.addEventListener("click", () => {
      vd.showModal();
      if (vid) vid.play().catch(() => {});
    }));
    kapat.forEach((b) => b.addEventListener("click", () => {
      if (vid) vid.pause();
      vd.close();
    }));
    vd.addEventListener("click", (e) => {
      if (e.target === vd) {
        if (vid) vid.pause();
        vd.close();
      }
    });
  }

  // 3. Alt Sabit Bar ve Sayfa İçi [data-ajan-ac] / [data-evdis-ajan-ac] Tıklamalarını Dijital Rehbere Bağla
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ajan-ac], [data-evdis-ajan-ac]");
    if (btn && window.evdisAjanAc) {
      e.preventDefault();
      window.evdisAjanAc();
    }
  });

  // 4. Mobil Gezinme Menüsü (1024px altı ekranlar için tam kapsamlı çekmece)
  const headerEl = document.querySelector("header.ust");
  const ustSag = document.querySelector(".ust-sag");
  if (headerEl && ustSag && !document.querySelector(".mobil-menu-tetik")) {
    const btnLabel = isAR ? "☰ القائمة" : isEN ? "☰ Menu" : "☰ Menü";
    const links = isAR
      ? [
          { href: "ar.html#konfor", text: "بيئة العيادة" },
          { href: "ar.html#tedaviler", text: "مجالات العلاج" },
          { href: "hekimler.html", text: "أطباؤنا (20)" },
          { href: "serdivan.html", text: "📍 فرع سرديفان الرئيسي" },
          { href: "adapazari.html", text: "📍 فرع أدابازاري" },
          { href: "kurumsal.html", text: "المؤسسة وحقوق المريض" },
          { href: "blog.html", text: "دليل المريض والمدونة" },
          { href: "ar.html#iletisim", text: "✨ الموعد والتواصل" }
        ]
      : isEN
      ? [
          { href: "en.html#konfor", text: "Clinic Comfort" },
          { href: "en.html#tedaviler", text: "Treatments" },
          { href: "hekimler.html", text: "Our Doctors (20)" },
          { href: "serdivan.html", text: "📍 Serdivan Main Branch" },
          { href: "adapazari.html", text: "📍 Adapazarı Branch" },
          { href: "kurumsal.html", text: "Corporate & KVKK" },
          { href: "blog.html", text: "Patient Guide & Blog" },
          { href: "en.html#iletisim", text: "✨ Appointment & Contact" }
        ]
      : [
          { href: "index.html", text: "🏠 Ana Sayfa" },
          { href: "kurumsal.html", text: "🏛️ Kurumsal & KVKK" },
          { href: "index.html#tedaviler", text: "🦷 Hizmetlerimiz (8 Branş)" },
          { href: "hekimler.html", text: "👨‍⚕️ Hekimlerimiz (20)" },
          { href: "serdivan.html", text: "📍 Serdivan Merkez Şube" },
          { href: "adapazari.html", text: "📍 Adapazarı Şubesi" },
          { href: "kalite-yonetim.html", text: "🛡️ Kalite Yönetimi (SKS)" },
          { href: "blog.html", text: "📖 Blog & Hasta Rehberi" },
          { href: "ziyaretler-ve-galeri.html", text: "📸 Ziyaretler & Galeri" },
          { href: "dilek-oneri.html", text: "✉️ Dilek & Öneri Formu" },
          { href: "gokhan-eksik-listesi.html", text: "📋 Kriter & Eksik Listesi" },
          { href: "index.html#iletisim", text: "✨ E-Randevu & İletişim" }
        ];

    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "mobil-menu-tetik";
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = btnLabel;
    ustSag.appendChild(menuBtn);

    const drawer = document.createElement("nav");
    drawer.className = "mobil-menu-cekmece";
    drawer.setAttribute("aria-label", isAR ? "قائمة التنقل" : isEN ? "Mobile navigation" : "Mobil gezinme");
    drawer.innerHTML = `<ul>${links.map(l => `<li><a href="${l.href}">${l.text}</a></li>`).join("")}</ul>`;
    headerEl.appendChild(drawer);

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const acik = drawer.classList.toggle("acik");
      menuBtn.setAttribute("aria-expanded", acik ? "true" : "false");
    });
    drawer.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        drawer.classList.remove("acik");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", (e) => {
      if (drawer.classList.contains("acik") && !drawer.contains(e.target) && e.target !== menuBtn) {
        drawer.classList.remove("acik");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 5. Eksik Sayfalarda Mobil Alt Sabit Eylem Çubuğunu (.alt-eylem) Otomatik Enjekte Et
  if (!document.querySelector(".alt-eylem")) {
    const altNav = document.createElement("nav");
    altNav.className = "alt-eylem";
    altNav.setAttribute("aria-label", isAR ? "إجراءات سريعة" : isEN ? "Quick actions" : "Hızlı işlemler");
    altNav.innerHTML = isAR
      ? `<a href="tel:+902646060060"><span>📞 اتصال</span></a><a href="https://wa.me/905456060069" target="_blank" rel="noopener"><span>💬 واتساب</span></a><button type="button" data-ajan-ac><span>🦷 الدليل</span></button><a href="ar.html#subeler"><span>📍 الفروع</span></a>`
      : isEN
      ? `<a href="tel:+902646060060"><span>📞 Call</span></a><a href="https://wa.me/905456060069" target="_blank" rel="noopener"><span>💬 WhatsApp</span></a><button type="button" data-ajan-ac><span>🦷 Guide</span></button><a href="en.html#subeler"><span>📍 Branches</span></a>`
      : `<a href="tel:+902646060060"><span>📞 Ara</span></a><a href="https://wa.me/905456060069" target="_blank" rel="noopener"><span>💬 WhatsApp</span></a><button type="button" data-ajan-ac><span>🦷 Rehber</span></button><a href="index.html#subeler"><span>📍 Şubeler</span></a>`;
    document.body.appendChild(altNav);
  }

  // 6. Dil sürekliliğini uygula (alt sayfa arayüz çevirisi + ?lang / ?ekip korumalı bağlantılar)
  if (!anaSayfaMi && dil !== "tr") kromuCevir(dil);
  baglantilariGuncelle(dil);
})();

// 7. v22 · Fare izleyen ışık kırılması (--mouse-x / --mouse-y) — yalnız fareli cihazlar, kare başına tek ölçüm
(() => {
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const SECICI = ".atelier-kart, .pavilyon-kart, .tedavi-kart, .konfor-kart, .hekim-kart, .sube-kart, .kart, #teknoloji-ameliyathane, #teknoloji-mikroskop, #teknoloji-yapay-zeka, #teknoloji-cerec";
  let son = null;
  let kare = 0;
  document.addEventListener("pointermove", (e) => {
    const kart = e.target instanceof Element ? e.target.closest(SECICI) : null;
    if (!kart) return;
    son = { kart, x: e.clientX, y: e.clientY };
    if (kare) return;
    kare = requestAnimationFrame(() => {
      kare = 0;
      const r = son.kart.getBoundingClientRect();
      son.kart.style.setProperty("--mouse-x", `${son.x - r.left}px`);
      son.kart.style.setProperty("--mouse-y", `${son.y - r.top}px`);
    });
  }, { passive: true });
})();

// 8. Scroll-Reveal Gözlemcisi (IntersectionObserver · prefers-reduced-motion saygılı · site.css'ten bağımsız)
(() => {
  "use strict";
  const HEDEF = ".bolum-baslik, .ust-etiket, .bolum-etiket, .tedavi-kart, .konfor-kart, .hekim-kart, .sube-kart, #teknoloji-vitrin > div";
  const hedefler = document.querySelectorAll(HEDEF);
  if (!hedefler.length) return;

  // Reveal stilini yalnızca bir kez ve namespace'li enjekte et (site.css'e dokunmadan kendi kendine yeten)
  if (!document.getElementById("evdis-reveal-stil")) {
    const st = document.createElement("style");
    st.id = "evdis-reveal-stil";
    st.textContent = [
      '[data-evdis-reveal]{transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);will-change:opacity,transform;}',
      '[data-evdis-reveal="gizli"]{opacity:0;transform:translateY(18px);}',
      '[data-evdis-reveal="acik"]{opacity:1;transform:none;}',
      '@media (prefers-reduced-motion: reduce){[data-evdis-reveal]{opacity:1 !important;transform:none !important;transition:none !important;}}',
      '::view-transition-old(root),::view-transition-new(root){animation-duration:.42s;}'
    ].join("");
    (document.head || document.documentElement).appendChild(st);
  }

  const azHareket = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (azHareket || !("IntersectionObserver" in window)) {
    hedefler.forEach((el) => el.setAttribute("data-evdis-reveal", "acik"));
    return;
  }

  hedefler.forEach((el) => {
    if (!el.hasAttribute("data-evdis-reveal")) el.setAttribute("data-evdis-reveal", "gizli");
  });

  const gozlemci = new IntersectionObserver((girisler, g) => {
    girisler.forEach((giris) => {
      if (giris.isIntersecting) {
        giris.target.setAttribute("data-evdis-reveal", "acik");
        g.unobserve(giris.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  hedefler.forEach((el) => gozlemci.observe(el));
})();

// 9. v25 · 3B Biyometrik Nokta Bulutu & CBCT Sahne Motoru (#evdis-hero-canvas)
(() => {
  "use strict";
  const canvas = document.getElementById("evdis-hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mode = "arch"; // "arch" | "helix" | "wave"
  let targetRotX = 0.28;
  let targetRotY = -0.32;
  let rotX = 0.28;
  let rotY = -0.32;
  let t = 0;

  const COUNT = 540;
  const points = [];
  for (let i = 0; i < COUNT; i++) {
    const u = i / COUNT;
    const angle = (u - 0.5) * Math.PI * 1.42;
    const ring = (i % 9) / 8 - 0.5;
    points.push({
      u,
      angle,
      ring,
      phase: (i * 1.6180339) % (Math.PI * 2),
      gold: i % 4 === 0,
      size: i % 7 === 0 ? 2.3 : 1.35,
      x: 0,
      y: 0,
      z: 0
    });
  }

  function computeTarget(p, time) {
    if (mode === "arch") {
      // 3B Parabolik Dental Ark + CBCT Volumetrik Kesit Halkaları
      const r = 215 + p.ring * 48 + Math.sin(time * 1.8 + p.phase) * 6;
      const tx = Math.sin(p.angle) * r * 1.25;
      const tz = Math.cos(p.angle) * r * 0.92 - 40;
      const crownWave = Math.sin(p.angle * 7) * 18;
      const ty = p.ring * 115 + crownWave * (1 - Math.abs(p.ring));
      return { tx, ty, tz };
    }
    if (mode === "helix") {
      // CEREC 3B Optik Tarama Çift Sarmal Kafesi
      const strand = p.ring > 0 ? 1 : -1;
      const theta = p.u * Math.PI * 4 + time * 0.9 + (strand > 0 ? 0 : Math.PI);
      const radius = 165 + (Math.abs(p.ring) - 0.25) * 90;
      const tx = (p.u - 0.5) * 680;
      const ty = Math.sin(theta) * radius;
      const tz = Math.cos(theta) * radius;
      return { tx, ty, tz };
    }
    // "wave" — Akustik Konfor & Biyometrik Dalga Yüzeyi
    const cols = 27;
    const rows = 20;
    const gx = (Math.floor(p.u * COUNT) % cols) / (cols - 1) - 0.5;
    const gz = Math.floor((p.u * COUNT) / cols) / (rows - 1) - 0.5;
    const tx = gx * 740;
    const tz = gz * 460;
    const dist = Math.hypot(gx * 3.2, gz * 3.2);
    const ty = Math.sin(dist * 3.4 - time * 2.2) * 58 + Math.cos(gx * 5 + time) * 18;
    return { tx, ty, tz };
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(320, rect.width);
    height = Math.max(420, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const heroSection = canvas.closest("section.kahraman");
  if (heroSection) {
    heroSection.addEventListener("pointermove", (e) => {
      const r = heroSection.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      targetRotY = nx * 0.85;
      targetRotX = 0.22 + ny * 0.55;
    }, { passive: true });
  }

  document.querySelectorAll("[data-canvas-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.getAttribute("data-canvas-mode") || "arch";
      document.querySelectorAll("[data-canvas-mode]").forEach((b) => b.classList.toggle("aktif", b === btn));
    });
  });

  const azHareket = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    t += azHareket ? 0.002 : 0.014;
    rotX += (targetRotX - rotX) * 0.06;
    rotY += (targetRotY + Math.sin(t * 0.45) * 0.18 - rotY) * 0.06;

    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.54;
    const cy = height * 0.48;
    const fov = 560;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // 1. Arka Plan Volumetrik CBCT Tarama Halkaları
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = "rgba(212, 175, 122, 0.11)";
    ctx.lineWidth = 1;
    for (let r = 130; r <= 370; r += 80) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.58, t * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    const projected = [];
    for (let i = 0; i < COUNT; i++) {
      const p = points[i];
      const { tx, ty, tz } = computeTarget(p, t);
      p.x += (tx - p.x) * 0.09;
      p.y += (ty - p.y) * 0.09;
      p.z += (tz - p.z) * 0.09;

      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.z * cosY + p.x * sinY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + p.y * sinX;

      const scale = fov / (fov + z2 + 340);
      if (scale <= 0.1) continue;
      const sx = cx + x1 * scale;
      const sy = cy + y2 * scale;
      projected.push({ sx, sy, z2, scale, gold: p.gold, size: p.size, idx: i });
    }

    // 2. Biyometrik Komşu Bağlantı Filamentleri
    ctx.lineWidth = 0.75;
    for (let i = 0; i < projected.length - 1; i += 2) {
      const a = projected[i];
      const b = projected[i + 1];
      const dx = a.sx - b.sx;
      const dy = a.sy - b.sy;
      const d2 = dx * dx + dy * dy;
      if (d2 < 3400) {
        const alpha = (1 - d2 / 3400) * 0.24 * a.scale;
        ctx.strokeStyle = a.gold
          ? `rgba(226, 195, 145, ${alpha})`
          : `rgba(52, 211, 153, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }

    // 3. Lazer Tarama Düzlemi (CBCT Axial Sweep)
    const scanY = cy + Math.sin(t * 1.35) * 145;
    const grad = ctx.createLinearGradient(cx - 320, scanY, cx + 320, scanY);
    grad.addColorStop(0, "rgba(52, 211, 153, 0)");
    grad.addColorStop(0.5, "rgba(52, 211, 153, 0.28)");
    grad.addColorStop(1, "rgba(212, 175, 122, 0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - 320, scanY);
    ctx.lineTo(cx + 320, scanY);
    ctx.stroke();

    // 4. 3B Nokta Bulutu Parçacıkları
    for (let i = 0; i < projected.length; i++) {
      const pt = projected[i];
      const nearScan = Math.max(0, 1 - Math.abs(pt.sy - scanY) / 36);
      const alpha = Math.min(1, (0.32 + nearScan * 0.55) * pt.scale * 1.15);
      const r = pt.size * pt.scale * (1 + nearScan * 0.55);
      ctx.fillStyle = pt.gold
        ? `rgba(236, 206, 154, ${alpha})`
        : `rgba(82, 232, 176, ${alpha})`;
      ctx.beginPath();
      ctx.arc(pt.sx, pt.sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!azHareket) requestAnimationFrame(render);
  }

  render();
})();

// 10. v25 · İnteraktif 5-Protokollü Klinik Kokpit Motoru (#interaktif-kokpit) + 3B Perspektif Tilt
(() => {
  "use strict";
  const VERI = {
    cbct: {
      kod: "PROTOKOL // 01 · CBCT & AI RADYOLOJİ",
      baslik: "Panoramik ve 3 Boyutlu Tomografide (CBCT) Yapay Zekâ Destekli Tanı",
      metin: "Serdivan merkez şubemizde 3B volumetrik dental tomografi (CBCT) ve her iki şubemizde dijital panoramik görüntüleme üzerinde çalışan yapay zekâ destekli görüntü analiz sistemi; mandibular sinir kanalı, maksiller sinüs septaları ve kemik yoğunluğunu kesitsel olarak haritalandırır.",
      m1: ["GÖRÜNTÜLEME", "3B CBCT + OPG"],
      m2: ["ANALİZ KATMANI", "Yapay Zekâ Destekli"],
      m3: ["BİLİMSEL DAYANAK", "Springer Q1 Yayın"],
      link: "implant-ve-cene-cerrahisi.html",
      path: "M110 205 C115 110, 245 110, 250 205"
    },
    cerec: {
      kod: "PROTOKOL // 02 · CEREC 3B CAD/CAM",
      baslik: "CEREC 3B Optik Tarayıcılar ve Klinik İçi Mikron Kazıma (CAD/CAM)",
      metin: "Geleneksel kaşık ölçüsü ve öğürme refleksi olmadan, 3 boyutlu ağız içi optik kameralarla saniyeler içinde dijital ölçü alınır. Klinik içi bilgisayar destekli kazıyıcı (milling) ünitelerimizde porselen inley/onley, zirkonyum ve estetik restorasyonlar mikron hassasiyetinde üretilir.",
      m1: ["ÖLÇÜ TEKNOLOJİSİ", "3B Optik Kamera"],
      m2: ["ÜRETİM", "CEREC CAD/CAM"],
      m3: ["HASSASİYET", "Mikron Kenar Uyumu"],
      link: "tedavi-dijital-dolgu.html",
      path: "M95 160 L150 110 L210 110 L265 160 L210 210 L150 210 Z"
    },
    mikroskop: {
      kod: "PROTOKOL // 03 · MİKRO-ENDODONTİ",
      baslik: "Elektronik Yüksek Çözünürlüklü Operasyon Mikroskobu ile Diş Koruma",
      metin: "Prof. Dr. Fuat Ahmetoğlu ve Dr. Dt. Elshad Salmanov yönetimindeki endodonti kliniğimizde; çıplak gözle görülemeyen kalsifiye mikro-kanallar, kırık alet çıkarımı ve kanal yenileme (retreatment) işlemleri elektronik operasyon mikroskobu altında yüksek büyütmeyle uygulanır.",
      m1: ["OPTİK BÜYÜTME", "Elektronik Mikroskop"],
      m2: ["KLİNİK DİREKTÖRLÜK", "Prof. Dr. F. Ahmetoğlu"],
      m3: ["ODAK", "Doğal Dişin Korunması"],
      link: "tedavi-endodonti.html",
      path: "M180 95 L180 225 M135 140 C155 185, 205 185, 225 140"
    },
    ameliyathane: {
      kod: "PROTOKOL // 04 · AMELİYATHANE & SEDASYON",
      baslik: "Tam Donanımlı Ameliyathane, Bilinçli Sedasyon ve Genel Anestezi",
      metin: "Anesteziyoloji ve Reanimasyon Uzmanımız Uzm. Dr. Gökhan Gedikli değerlendirmesi ve gözetiminde; dental fobisi olan yetişkin hastalarımız, özel gereksinimli bireyler ve kapsamlı çocuk diş tedavileri tam donanımlı ameliyathane ortamında güvenle gerçekleştirilir.",
      m1: ["ANESTEZİ UZMANI", "Uzm. Dr. G. Gedikli"],
      m2: ["ALTYAPI", "Ameliyathane & Derlenme"],
      m3: ["KAPSAM", "Çocuk & Yetişkin"],
      link: "tedavi-sedasyon.html",
      path: "M85 160 L135 160 L152 120 L174 205 L196 135 L212 160 L275 160"
    },
    cerrahi: {
      kod: "PROTOKOL // 05 · ZAGA & KHOURY CERRAHİSİ",
      baslik: "İleri Çene Cerrahisi: ZAGA Zigomatik İmplant & Khoury Kemik Nakli",
      metin: "Çene Cerrahisi Uzmanımız Dr. Dt. Seyit Yılmaz yönetiminde; ileri üst çene kemik erimelerinde ZAGA protokolüyle zigomatik implant, Khoury otojen kemik blok nakli, sinüs lifting ve gömülü diş cerrahisi 3B CBCT rehberliğinde uygulanır.",
      m1: ["CERRAHİ UZMANI", "Dr. Dt. Seyit Yılmaz"],
      m2: ["İLERİ PROTOKOL", "ZAGA & Khoury Blok"],
      m3: ["PLANLAMA", "3B CBCT Kılavuzlu"],
      link: "implant-ve-cene-cerrahisi.html",
      path: "M120 115 L165 198 M240 115 L195 198 M115 205 C145 225, 215 225, 245 205"
    }
  };

  const sekmeler = document.querySelectorAll("[data-kokpit-id]");
  if (sekmeler.length) {
    const kodEl = document.getElementById("kokpit-kod");
    const baslikEl = document.getElementById("kokpit-detay-baslik");
    const metinEl = document.getElementById("kokpit-detay-metin");
    const metrikEl = document.getElementById("kokpit-metrikler");
    const linkEl = document.getElementById("kokpit-detay-link");
    const arkPath = document.querySelector(".kokpit-ark-cizgi");

    sekmeler.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-kokpit-id");
        const v = VERI[id];
        if (!v) return;
        sekmeler.forEach((b) => {
          const aktif = b === btn;
          b.classList.toggle("aktif", aktif);
          b.setAttribute("aria-selected", aktif ? "true" : "false");
        });
        if (kodEl) kodEl.textContent = v.kod;
        if (baslikEl) baslikEl.textContent = v.baslik;
        if (metinEl) metinEl.textContent = v.metin;
        if (metrikEl) {
          metrikEl.innerHTML = [v.m1, v.m2, v.m3]
            .map(([k, val]) => `<div class="kokpit-metrik"><span>${k}</span><strong>${val}</strong></div>`)
            .join("");
        }
        if (linkEl) linkEl.setAttribute("href", v.link);
        if (arkPath) arkPath.setAttribute("d", v.path);
      });
    });
  }

  // Hero 3B Perspektif Tilt (Fare ile hafif derinlik eğimi)
  const tiltBox = document.querySelector(".kahraman-hud-cerceve");
  if (tiltBox && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    tiltBox.addEventListener("pointermove", (e) => {
      const r = tiltBox.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tiltBox.style.transform = `rotateY(${(nx * 7).toFixed(2)}deg) rotateX(${(-ny * 7).toFixed(2)}deg)`;
    }, { passive: true });
    tiltBox.addEventListener("pointerleave", () => {
      tiltBox.style.transform = "none";
    });
  }
})();

