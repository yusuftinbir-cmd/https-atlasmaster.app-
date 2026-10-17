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

  // 1. Uzmanlık ve Şube Sekmeleri (Hekim Filtreleme)
  const sekmeler = document.querySelectorAll("[data-sekme]");
  const kartlar = document.querySelectorAll("[data-hekim-kart]");
  if (sekmeler.length && kartlar.length) {
    sekmeler.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filtre = btn.getAttribute("data-sekme");
        sekmeler.forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
        kartlar.forEach((k) => {
          if (filtre === "tumu") {
            k.hidden = false;
          } else if (filtre === "serdivan" || filtre === "adapazari") {
            k.hidden = !(k.getAttribute("data-sube") || "").includes(filtre);
          } else {
            k.hidden = !(k.getAttribute("data-grup") || "").includes(filtre);
          }
        });
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
