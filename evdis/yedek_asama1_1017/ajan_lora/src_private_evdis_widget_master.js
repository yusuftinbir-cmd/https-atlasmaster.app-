/* ============================================================================
 * ÖZEL EVDİŞ AĞIZ VE DİŞ SAĞLIĞI MERKEZİ — MAYA STANDARDI DİJİTAL HASTA REHBERİ (v6.0)
 * FİKRİ MÜLKİYET & ALGORİTMA: ATLAS-CORE (Kurumsal Kullanım Lisansı ile Evdiş'e tahsis edilmiştir)
 * - Bu kaynak dosya YALNIZCA ATLAS-CORE özel sunucu dizininde tutulur.
 * - İstemciye (evdis_onizleme_duzeltilmis/js/evdis-ajan-widget.js) yalnızca polimorfik
 *   XOR+Base64 ile şifrelenmiş, Kanarya Tuzaklı (Canary Honeypot) derlenmiş kabuk verilir.
 * v6.0: 3 sekme (🩺 Rehber · 🧭 Rotalar · 🔍 Konular) · TR | EN | AR · sesli okuma (TTS) kaldırıldı,
 *       2–3 cümlelik kısa kartlar + "📖 Sayfada İncele" (glideToElement + Maya spot ışığı) ·
 *       T0→T3 daralan seçenekler · LAN / workers.dev / pages.dev alan izni · Seyit Hoca geri bildirim modu.
 * ============================================================================ */
(function () {
  "use strict";
  if (document.getElementById("evdis-ajan-root")) return;
  document.querySelectorAll(".ajan-tetik, section.ajan-panel").forEach(function (el) { el.remove(); });

  // ---------------------------------------------------------------------------
  // DİL (TR | EN | AR) — ?lang=en|ar > oturum > <html lang>
  // ---------------------------------------------------------------------------
  var DILLER = ["tr", "en", "ar"];
  var urlParams = new URLSearchParams(window.location.search);
  function oturumOku(k) { try { return sessionStorage.getItem(k) || ""; } catch (_) { return ""; } }
  function oturumYaz(k, v) { try { if (v) sessionStorage.setItem(k, v); else sessionStorage.removeItem(k); } catch (_) {} }
  function dilAlgila() {
    var p = (urlParams.get("lang") || "").toLowerCase();
    if (DILLER.indexOf(p) !== -1) return p;
    var h = (document.documentElement.getAttribute("lang") || "tr").slice(0, 2).toLowerCase();
    if (h === "en" || h === "ar") return h;
    var o = oturumOku("evdis_dil");
    return DILLER.indexOf(o) !== -1 ? o : "tr";
  }
  var aktifDil = dilAlgila();

  var PUBLIC_API_TUNNEL = "https://divine-question-want-jonathan.trycloudflare.com";
  var isStaticMirror = /atlasmaster\.app|workers\.dev|pages\.dev/i.test(String(window.location.hostname || ""));
  var API_BASE = isStaticMirror
    ? PUBLIC_API_TUNNEL
    : (window.location.protocol.indexOf("http") === 0 ? window.location.origin : "http://127.0.0.1:8788");
  var FALLBACK_TELEMETRY = "http://100.95.97.70:8788";

  // ---------------------------------------------------------------------------
  // KATMAN -1: KANARYA TUZAĞI (CANARY HONEYPOT) & ALAN ADI LİSANS KİLİDİ
  // ---------------------------------------------------------------------------
  function parmakIziTopla() {
    var glVendor = "unknown";
    try {
      var cv = document.createElement("canvas");
      var gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
      if (gl) {
        var dbg = gl.getExtension("WEBGL_debug_renderer_info");
        if (dbg) glVendor = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "webgl";
      }
    } catch (_) {}
    return {
      href: String(window.location.href || ""),
      host: String(window.location.hostname || ""),
      origin: String(window.location.origin || ""),
      referrer: String(document.referrer || ""),
      ua: String(navigator.userAgent || ""),
      lang: String(navigator.language || ""),
      platform: String(navigator.platform || ""),
      screen: (window.screen ? window.screen.width + "x" + window.screen.height : ""),
      tz: (window.Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""),
      gpu: glVendor
    };
  }

  function kanaryaAlarmGonder(tuzakTipi, detay) {
    var fp = parmakIziTopla();
    var payload = JSON.stringify({ trap_type: tuzakTipi, detail: detay, origin: fp.origin, referer: fp.referrer, href: fp.href, fingerprint: fp });
    var targets = [API_BASE + "/api/canary-alarm", PUBLIC_API_TUNNEL + "/api/canary-alarm"];
    if (API_BASE.indexOf("100.95.97.70") === -1) targets.push(FALLBACK_TELEMETRY + "/api/canary-alarm");
    targets.forEach(function (url) {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
        } else {
          fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(function () {});
        }
      } catch (_) {}
    });
  }

  // TUZAK 1: Global Sahte Anahtar & Karar Ağacı Tuzağı (DevTools / Scraper Yakalayıcı)
  try {
    var decoyObj = {};
    Object.defineProperty(decoyObj, "secretApiKey", {
      enumerable: true,
      get: function () {
        kanaryaAlarmGonder("DEVTOOLS_HONEYPOT_KEY_READ", "window.__EVDIS_CLINICAL_ENGINE_CONFIG__.secretApiKey okundu");
        return "ATLAS-POISON-KEY-9F8A7C6E-WATERMARKED-UNAUTHORIZED-ACCESS-LOGGED";
      }
    });
    Object.defineProperty(decoyObj, "decisionTreeDump", {
      enumerable: true,
      get: function () {
        kanaryaAlarmGonder("DEVTOOLS_DECISION_TREE_DUMP_ATTEMPT", "window.__EVDIS_CLINICAL_ENGINE_CONFIG__.decisionTreeDump okundu");
        return { status: "HONEYPOT_ACTIVE", watermark: "ATLAS-IP-SIGN-2026-EVDIS", notice: "İzinsiz erişim girişiminiz IP ve tarayıcı parmak izinizle ATLAS-CORE adli bilişim kütüğüne kaydedilmiştir." };
      }
    });
    decoyObj.exportClinicalBrain = function () {
      kanaryaAlarmGonder("DEVTOOLS_EXPORT_BRAIN_CALL", "exportClinicalBrain() fonksiyonu çağrıldı");
      return "ERR_ATLAS_CORE_FORENSIC_WATERMARK_LOGGED";
    };
    window.__EVDIS_CLINICAL_ENGINE_CONFIG__ = decoyObj;
    Object.defineProperty(window, "__ATLAS_INTERNAL_KEY__", {
      configurable: true,
      get: function () {
        kanaryaAlarmGonder("DEVTOOLS_ATLAS_INTERNAL_KEY_READ", "window.__ATLAS_INTERNAL_KEY__ okundu");
        return "ATLAS-CORE-SOVEREIGN-LOCK-2026";
      }
    });
  } catch (_) {}

  // TUZAK 2: Yetkisiz Alan Adı (Klon Site) Kontrolü — yerel ağ (LAN), Tailscale ve Cloudflare önizleme izinli
  var ALLOWED_HOSTS = [
    "evdis.com.tr", "www.evdis.com.tr", "atlasmaster.app", "www.atlasmaster.app",
    "100.95.97.70", "172.16.12.127", "127.0.0.1", "localhost",
    "evdis-onizleme.seyity.workers.dev", "evdis-onizleme-acik.seyity.workers.dev", "tansel-onizleme.seyity.workers.dev"
  ];
  function hostOk(host) {
    var h = String(host || "").toLowerCase();
    if (!h) return true; // file:// yerel önizleme
    if (ALLOWED_HOSTS.indexOf(h) !== -1) return true;
    return (
      h.startsWith("172.") || h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("100.") ||
      h.endsWith(".workers.dev") || h.endsWith(".pages.dev") || h.endsWith(".trycloudflare.com") ||
      h.endsWith(".evdis.com.tr") || h.endsWith(".atlasmaster.app")
    );
  }
  var isAuthorizedHost = hostOk(window.location.hostname);
  if (!isAuthorizedHost) {
    kanaryaAlarmGonder("UNAUTHORIZED_DOMAIN_CLONE", "Yetkisiz alan adında widget çalıştırıldı: " + window.location.href);
  }

  // ---------------------------------------------------------------------------
  // KATMAN 00: TARAYICI İÇİ (CLIENT-SIDE) SIFIR-PII KVKK KALKANI
  // ---------------------------------------------------------------------------
  function kvkkTarayiciMaskele(hamMetin) {
    var temiz = String(hamMetin || "");
    var engellenenler = [];
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(temiz)) {
      temiz = temiz.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[KVKK_EPOSTA_MASKELENDI]");
      engellenenler.push("E-posta");
    }
    if (/\b\d{10,11}\b/.test(temiz)) {
      temiz = temiz.replace(/\b\d{10,11}\b/g, "[KVKK_KIMLIK_NO_MASKELENDI]");
      engellenenler.push("TCKN/ID");
    }
    var telRegex = /(?:\+90|0)?\s*5\d{2}[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}\b/g;
    if (telRegex.test(temiz)) {
      temiz = temiz.replace(telRegex, "[KVKK_TELEFON_MASKELENDI]");
      engellenenler.push("Tel");
    }
    var isimRegex = /\b(benim\s+adım|ismim|adım\s+soyadım|my\s+name\s+is|اسمي)\s+([A-ZÇĞİÖŞÜa-zçğıöşü؀-ۿ]+\s+[A-ZÇĞİÖŞÜa-zçğıöşü؀-ۿ]+)/gi;
    if (isimRegex.test(temiz)) {
      temiz = temiz.replace(isimRegex, "$1 [KVKK_ISIM_MASKELENDI]");
      engellenenler.push("Ad Soyad");
    }
    return { temizMetin: temiz, maskelenenAlanlar: engellenenler };
  }

  // ---------------------------------------------------------------------------
  // ARAYÜZ METİNLERİ (TR | EN | AR) — Yazma Engelli Seçmeli Rehber + ATLAS-VOICE
  // ---------------------------------------------------------------------------
  var UI = {
    tr: {
      btnTitle: "Evdiş Dijital Rehber", btnSub: "Seçmeli Rehber · Rotalar · Konular",
      headerTitle: "Evdiş Dijital Hasta Rehberi", headerSub: "ATLAS-CORE Kurumsal Lisans · KVKK Sıfır-PII",
      tabs: ["🩺 Rehber", "🧭 Rotalar", "🔍 Konular"],
      welcome: "Merhaba, **Özel Evdiş Ağız ve Diş Sağlığı Merkezi**'ne hoş geldiniz. Size en yakın klinik kapıyı seçin; genişten daralan seçeneklerle sizi doğru uzmana ve sayfadaki ilgili bölüme yönlendireyim.",
      kapiHint: "👇 Size en yakın klinik kapıyı seçin (genişten daralan algoritmalı rehber):",
      readOnPage: "📖 Sayfada İncele", detailShow: "Ayrıntı ▾", detailHide: "Ayrıntıyı gizle ▴",
      listenBtn: "🔊 Dinle", stopAudioBtn: "⏹ Durdur",
      navHome: "🏠 Ana Kapılar", navBack: "⬅ Önceki Adım",
      voiceOn: "🔊 Ses: Açık", voiceOff: "🔇 Ses: Kapalı",
      noTypingNotice: "🔒 KVKK & Tıbbi Güvenlik: Kişisel veri girilmemesi için serbest yazım kapalıdır; yukarıdaki daralan klinik seçeneklerle ilerleyebilirsiniz.",
      optionsHint: "👇 Durumunuza en yakın alt seçeneği belirleyin:", wait: "Klinik karar ağacı değerlendiriyor…",
      resetTitle: "Baştan başlat", expandTitle: "Genişlet / Daralt", closeTitle: "Kapat",
      legal: "Bilgilendirme amaçlıdır; tanı ve tedavi planı yalnızca hekim muayenesiyle belirlenir (RG 12.11.2025/33075 · 6698 KVKK).",
      routesIntro: "Sayfa üzerinde ışıklı ve sesli, adım adım gezinti. Bir klinik rota seçin:",
      currentTour: "✨ Bu Sayfayı Gez", currentTourSub: "Bulunduğunuz sayfanın klinik başlıkları, adım adım",
      stepWord: "adım", prev: "◀ Önceki", next: "Sonraki ▶", finish: "Tamamla ✓", stop: "✕ Kapat",
      routeTag: "ROTA", pageTourName: "Bu Sayfa", searchPh: "Tedavi, işlem, teknoloji, hekim veya şube filtreleyin…",
      groups: { brans: "8 Uzmanlık Branşı", tedavi: "24 Klinik Tedavi & İşlem Başlığı", tek: "4 Klinik Teknoloji", hekim: "20 Hekim Kadromuz", sube: "2 Şube" },
      noResult: "Eşleşen başlık bulunamadı — Rehber sekmesindeki kapılardan ilerleyebilirsiniz.",
      offlineTitle: "Evdiş Klinik Rehberi", lockTitle: "⚠️ Lisans Kilidi",
      lockText: "Bu dijital rehber yalnızca yetkili Evdiş alan adlarında çalışır. Bilgi için: 0 (264) 606 00 60."
    },
    en: {
      btnTitle: "Evdiş Digital Guide", btnSub: "Guided Triage · Routes · Topics",
      headerTitle: "Evdiş Digital Patient Guide", headerSub: "ATLAS-CORE Enterprise License · Zero-PII",
      tabs: ["🩺 Guide", "🧭 Routes", "🔍 Topics"],
      welcome: "Welcome to **Evdiş Dental Center**. Choose the clinical category closest to your concern, and through step-by-step narrowing options I will guide you to the right specialist and page section.",
      kapiHint: "👇 Choose a clinical door (broad-to-narrow guided algorithm):",
      readOnPage: "📖 Read on Page", detailShow: "Details ▾", detailHide: "Hide details ▴",
      listenBtn: "🔊 Listen", stopAudioBtn: "⏹ Stop",
      navHome: "🏠 Main Doors", navBack: "⬅ Previous Step",
      voiceOn: "🔊 Voice: On", voiceOff: "🔇 Voice: Off",
      noTypingNotice: "🔒 Zero-PII & Clinical Safety: Free-text typing is disabled; please navigate using the guided clinical options above.",
      optionsHint: "👇 Choose the option closest to your situation:", wait: "Evaluating clinical pathway…",
      resetTitle: "Start over", expandTitle: "Expand / Collapse", closeTitle: "Close",
      legal: "For information only; diagnosis and treatment plans require an in-person examination (RG 12.11.2025/33075).",
      routesIntro: "A lit and voiced step-by-step tour across the site. Choose a route:",
      currentTour: "✨ Tour This Page", currentTourSub: "The clinical sections of the current page, step by step",
      stepWord: "steps", prev: "◀ Prev", next: "Next ▶", finish: "Finish ✓", stop: "✕ Close",
      routeTag: "ROUTE", pageTourName: "This Page", searchPh: "Filter treatments, procedures, technology, doctors or branches…",
      groups: { brans: "8 Specialties", tedavi: "24 Clinical Procedures & Topics", tek: "4 Technologies", hekim: "20 Doctors", sube: "2 Branches" },
      noResult: "No matching topic — you can use the guided doors in the Guide tab.",
      offlineTitle: "Evdiş Clinical Guide", lockTitle: "⚠️ License Lock",
      lockText: "This digital guide only runs on authorized Evdiş domains. Info: +90 264 606 00 60."
    },
    ar: {
      btnTitle: "دليل إيف ديش الرقمي", btnSub: "الدليل التفاعلي · المسارات · المواضيع",
      headerTitle: "دليل المريض الرقمي — إيف ديش", headerSub: "ترخيص مؤسسي ATLAS-CORE · حماية البيانات",
      tabs: ["🩺 الدليل", "🧭 المسارات", "🔍 المواضيع"],
      welcome: "أهلاً بكم في **مركز إيف ديش لصحة الفم والأسنان**. اختر القسم الأقرب لشكواك، وسأوجهك عبر خيارات متدرجة إلى الأخصائي المناسب والقسم المعني في الصفحة.",
      kapiHint: "👇 اختر قسماً سريرياً للبدء (خوارزمية التوجيه المتدرج):",
      readOnPage: "📖 اقرأ في الصفحة", detailShow: "التفاصيل ▾", detailHide: "إخفاء التفاصيل ▴",
      listenBtn: "🔊 استمع", stopAudioBtn: "⏹ إيقاف",
      navHome: "🏠 الأبواب الرئيسية", navBack: "⬅ الخطوة السابقة",
      voiceOn: "🔊 الصوت: مفعّل", voiceOff: "🔇 الصوت: متوقف",
      noTypingNotice: "🔒 حماية البيانات والسلامة الطبية: تم إيقاف الكتابة الحرة؛ يرجى المتابعة عبر الخيارات السريرية المتدرجة أعلاه.",
      optionsHint: "👇 اختر الخيار الأقرب لحالتك:", wait: "جارٍ تقييم المسار السريري…",
      resetTitle: "البدء من جديد", expandTitle: "توسيع / تصغير", closeTitle: "إغلاق",
      legal: "لأغراض إعلامية فقط؛ يتم التشخيص وخطة العلاج بعد الفحص السريري (RG 12.11.2025/33075).",
      routesIntro: "جولة مضيئة وناطقة خطوة بخطوة على الصفحة. اختر مساراً:",
      currentTour: "✨ تجوّل في هذه الصفحة", currentTourSub: "الأقسام السريرية للصفحة الحالية خطوة بخطوة",
      stepWord: "خطوات", prev: "◀ السابق", next: "التالي ▶", finish: "إنهاء ✓", stop: "✕ إغلاق",
      routeTag: "المسار", pageTourName: "هذه الصفحة", searchPh: "ابحث عن علاج أو إجراء أو تقنية أو طبيب أو فرع…",
      groups: { brans: "8 تخصصات", tedavi: "24 موضوعاً وإجراءً علاجياً", tek: "4 تقنيات", hekim: "20 طبيباً", sube: "فرعان" },
      noResult: "لا توجد نتائج مطابقة — يمكنك المتابعة عبر تبويب الدليل.",
      offlineTitle: "دليل إيف ديش السريري", lockTitle: "⚠️ قفل الترخيص",
      lockText: "يعمل هذا الدليل الرقمي فقط على نطاقات إيف ديش المعتمدة. للمعلومات: 0 (264) 606 00 60."
    }
  };
  function L() { return UI[aktifDil] || UI.tr; }

  // 6 net semptom / branş kapısı (T0) — deterministik secim_id ile
  var KAPILAR = {
    tr: [
      { id: "DIS_AGRISI_GENEL", label: "🦷 Ağrı & Kanal", q: "Diş ağrısı için ne yapabilirim?" },
      { id: "KAPI_IMPLANT_CERRAHI", label: "🔩 İmplant & Cerrahi", q: "İmplant ve çene cerrahisi hakkında bilgi almak istiyorum" },
      { id: "KAPI_GULUS_ZIRKONYUM", label: "✨ Gülüş & Zirkonyum", q: "Gülüş tasarımı ve zirkonyum kaplama hakkında bilgi almak istiyorum" },
      { id: "KAPI_COCUK_ORTODONTI", label: "👧 Çocuk & Ortodonti", q: "Çocuk diş hekimliği ve ortodonti hakkında bilgi almak istiyorum" },
      { id: "KAPI_DISETI_SEDASYON", label: "🩸 Diş Eti & Sedasyon", q: "Diş eti tedavisi ve sedasyon hakkında bilgi almak istiyorum" },
      { id: "SUBE_ADRES_SAAT_HEKIM", label: "📍 Şubeler & Randevu", q: "Şube adresleriniz ve çalışma saatleriniz nedir?" }
    ],
    en: [
      { id: "ML_ENDO", label: "🦷 Pain & Root Canal", q: "I have tooth pain — could I need a root canal?" },
      { id: "ML_IMPLANT", label: "🔩 Implants & Surgery", q: "How does your dental implant and oral surgery process work?" },
      { id: "ML_PROTEZ", label: "✨ Smile & Zirconia", q: "How do you plan crowns, veneers and smile design?" },
      { id: "ML_KAPI_COCUK_ORTO", label: "👧 Children & Orthodontics", q: "Children's dentistry and orthodontics" },
      { id: "ML_KAPI_DISETI_SED", label: "🩸 Gums & Sedation", q: "Gum care and sedation options" },
      { id: "ML_SUBE", label: "📍 Branches & Booking", q: "What are your branch addresses and opening hours?" }
    ],
    ar: [
      { id: "ML_ENDO", label: "🦷 الألم وعلاج العصب", q: "عندي ألم في السن، هل أحتاج إلى علاج عصب؟" },
      { id: "ML_IMPLANT", label: "🔩 الزراعة والجراحة", q: "كيف تتم زراعة الأسنان وجراحة الفم لديكم؟" },
      { id: "ML_PROTEZ", label: "✨ الابتسامة والزيركون", q: "كيف تخططون للتيجان والقشور وتصميم الابتسامة؟" },
      { id: "ML_KAPI_COCUK_ORTO", label: "👧 الأطفال والتقويم", q: "طب أسنان الأطفال والتقويم" },
      { id: "ML_KAPI_DISETI_SED", label: "🩸 اللثة والتهدئة", q: "العناية باللثة وخيارات التهدئة" },
      { id: "ML_SUBE", label: "📍 الفروع والمواعيد", q: "ما هي عناوين الفروع وساعات العمل؟" }
    ]
  };

  // ---------------------------------------------------------------------------
  // ATLASMASTER MAYA ROTALARI (5 klinik rota) — Birebir #konu-... ve ses dosyalarıyla
  // ---------------------------------------------------------------------------
  var ROTALAR = [
    {
      id: "agri", ikon: "🚑",
      ad: { tr: "1. Ağrı & Acil Triyaj Rotası", en: "1. Pain & Emergency Triage Route", ar: "1. مسار الألم والطوارئ" },
      ozet: { tr: "Ağrı karakteri, mikroskop destekli kanal tedavisi, kanal yenileme ve acil başvuru.", en: "Pain types, microscope-assisted root canal, retreatment and emergency care.", ar: "أنواع الألم وعلاج العصب بالمجهر وإعادة العصب والطوارئ." },
      adimlar: [
        { sayfa: "HOME", sel: ["#kart-endodonti", "#tedaviler"], audioIdx: 0,
          baslik: { tr: "Endodonti & Ağrı Triyajı", en: "Endodontics & Pain Triage", ar: "علاج العصب وفرز الألم" },
          metin: { tr: "Soğuk-sıcak sızlaması, gece başlayan zonklama veya çiğneme ağrısı Endodonti (kanal tedavisi) uzmanlığında değerlendirilir.", en: "Hot-cold sensitivity, throbbing night pain or biting pain are assessed under Endodontics (root canal care).", ar: "تُقيَّم حساسية البارد والساخن وألم النبض الليلي أو ألم المضغ ضمن تخصص علاج العصب." } },
        { sayfa: "tedavi-endodonti.html", sel: ["#konu-kanal-tedavisi"], audioIdx: 1,
          baslik: { tr: "Mikroskop Destekli Kanal Tedavisi", en: "Microscope-Assisted Root Canal", ar: "علاج العصب بمساعدة المجهر" },
          metin: { tr: "Operasyon mikroskobu ve 3 boyutlu görüntüleme desteğiyle enfekte kanal dokusu temizlenerek doğal dişin ağızda tutulması hedeflenir.", en: "With an operating microscope and 3D imaging, infected canal tissue is cleaned to preserve your natural tooth.", ar: "باستخدام المجهر الجراحي والتصوير ثلاثي الأبعاد يتم تنظيف القنوات للحفاظ على السن الطبيعي." } },
        { sayfa: "tedavi-endodonti.html", sel: ["#konu-retreatment"], audioIdx: 2,
          baslik: { tr: "Kanal Yenileme (Retreatment)", en: "Root Canal Retreatment", ar: "إعادة علاج العصب" },
          metin: { tr: "Daha önce kanal tedavisi görmüş ancak kök ucunda tekrar lezyon gelişmiş dişlerde çekim öncesi kanal yenileme değerlendirilir.", en: "Previously root-treated teeth with recurrent apical lesions are evaluated for retreatment before extraction.", ar: "الأسنان المعالجة سابقاً والتي التهبت مجدداً يتم تقييمها لإعادة علاج العصب قبل الخلع." } },
        { sayfa: "tedavi-endodonti.html", sel: ["#brans-hekimleri", ".hekim-izgara"], audioIdx: 3,
          baslik: { tr: "Endodonti Uzman Kadromuz", en: "Our Endodontic Specialists", ar: "أخصائيو علاج العصب" },
          metin: { tr: "Prof. Dr. Fuat Ahmetoğlu ve Dr. Dt. Elshad Salmanov endodonti ve mikro-cerrahi süreçlerini yürütür.", en: "Prof. Dr. Fuat Ahmetoğlu and Dr. Dt. Elshad Salmanov lead our endodontic and microsurgical procedures.", ar: "يقود البروفيسور د. فؤاد أحمد أوغلو و د. إلشاد سلمانوف علاجات العصب والجراحة المجهرية." } },
        { sayfa: "HOME", sel: ["#iletisim", "#subeler"], audioIdx: 4,
          baslik: { tr: "Acil Durum & Hızlı Randevu", en: "Emergency & Fast Appointment", ar: "الطوارئ والموعد السريع" },
          metin: { tr: "Yüz/boyun şişliği, ateş, nefes veya yutkunma güçlüğünde 112'yi arayın; diğer ağrılarda 08.30'dan itibaren 0 (264) 606 00 60.", en: "For facial/neck swelling, fever or breathing/swallowing difficulty call 112; otherwise call 0 (264) 606 00 60 from 08:30.", ar: "عند انتفاخ الوجه أو الرقبة أو الحرارة أو صعوبة التنفس والبلع اتصل بـ112؛ وفي غير ذلك اتصل على 0 (264) 606 00 60 من 08:30." } }
      ]
    },
    {
      id: "implant", ikon: "🔩",
      ad: { tr: "2. İmplant & İleri Cerrahi Rotası", en: "2. Implant & Advanced Surgery Route", ar: "2. مسار الزراعة والجراحة المتقدمة" },
      ozet: { tr: "3B CBCT planlama, sinüs lifting, ileri cerrahi ve ameliyathane altyapısı.", en: "3D CBCT planning, sinus lifting, advanced surgery and operating room.", ar: "التخطيط ثلاثي الأبعاد ورفع الجيب الأنفي والجراحة المتقدمة وغرفة العمليات." },
      adimlar: [
        { sayfa: "implant-ve-cene-cerrahisi.html", sel: ["#konu-implant-tedavisi"], audioIdx: 0,
          baslik: { tr: "3B CBCT ile İmplant Planlama", en: "3D CBCT Implant Planning", ar: "تخطيط الزراعة بالتصوير ثلاثي الأبعاد" },
          metin: { tr: "Her implant işleminden önce 3 boyutlu tomografi ile kemik hacmi, sinüs tabanı ve sinir kanalı mesafesi milimetrik ölçülür.", en: "Before every implant, 3D CBCT measures bone volume, sinus floor and nerve canal distance to the millimeter.", ar: "قبل كل زرعة يتم قياس حجم العظم وقاع الجيب الأنفي والمسافة من العصب بدقة مليمترية." } },
        { sayfa: "implant-ve-cene-cerrahisi.html", sel: ["#konu-sinus-lifting"], audioIdx: 1,
          baslik: { tr: "Sinüs Lifting & Kemik Grefti", en: "Sinus Lifting & Bone Grafting", ar: "رفع الجيب الأنفي وتطعيم العظم" },
          metin: { tr: "Üst çene arka bölgede sarkmış sinüs boşlukları ve kemik eksiklikleri sinüs lifting ve greftleme ile implant için hazırlanır.", en: "Sagging sinus cavities and bone deficiencies in the upper jaw are prepared for implants with sinus lifting and grafting.", ar: "يتم تحضير الجيوب الهابطة ونقص العظم في الفك العلوي للزراعة عبر رفع الجيب والتطعيم العظمي." } },
        { sayfa: "implant-ve-cene-cerrahisi.html", sel: ["#konu-ileri-cerrahi"], audioIdx: 2,
          baslik: { tr: "İleri Kemik Erimesinde Sabit Çözümler", en: "Fixed Solutions for Severe Bone Loss", ar: "حلول ثابتة لتآكل العظم المتقدم" },
          metin: { tr: "İleri kemik erimesi olan çenelerde sabit protetik rekonstrüksiyon seçenekleri cerrah ve protez uzmanınca birlikte planlanır.", en: "In jaws with severe bone loss, fixed reconstruction options are planned jointly by our surgeon and prosthodontist.", ar: "في حالات تآكل العظم الشديد يخطط الجراح وأخصائي التركيبات معاً لبروتوكولات الزراعة الثابتة." } },
        { sayfa: "implant-ve-cene-cerrahisi.html", sel: ["#brans-hekimleri", ".hekim-izgara"], audioIdx: 3,
          baslik: { tr: "Cerrahi Uzman Ekibimiz", en: "Our Oral Surgery Team", ar: "فريق جراحة الفم والفكين" },
          metin: { tr: "Cerrahi işlemler Başhekimimiz Ağız, Diş ve Çene Cerrahisi Uzmanı Dr. Dt. Seyit Yılmaz liderliğinde yürütülür.", en: "Surgical procedures are led by our Chief Physician, Oral & Maxillofacial Surgeon Dr. Dt. Seyit Yılmaz.", ar: "تُجرى العمليات الجراحية بقيادة رئيس الأطباء أخصائي جراحة الفم والفكين د. سيت يلماز." } },
        { sayfa: "HOME", sel: ["#teknoloji-ameliyathane", "#tedaviler"], audioIdx: 4,
          baslik: { tr: "Tam Donanımlı Ameliyathane & Anestezi", en: "Operating Room & General Anesthesia", ar: "غرفة العمليات والتخدير العام" },
          metin: { tr: "Kapsamlı cerrahi işlemler tam donanımlı ameliyathanemizde, Anestezi Uzmanımız Uzm. Dr. Gökhan Gedikli gözetiminde yapılabilir.", en: "Comprehensive surgeries can be performed in our operating room under Anesthesiologist Uzm. Dr. Gökhan Gedikli.", ar: "يمكن إجراء الجراحات الشاملة في غرفة العمليات بإشراف أخصائي التخدير د. غوكهان جديكلي." } }
      ]
    },
    {
      id: "gulus", ikon: "✨",
      ad: { tr: "3. Gülüş Tasarımı & Protetik Rotası", en: "3. Smile Design & Prosthodontics Route", ar: "3. مسار تصميم الابتسامة والتركيبات" },
      ozet: { tr: "CEREC dijital ölçü, zirkonyum & E-Max, porselen lamina ve bonding.", en: "CEREC digital scan, zirconia & E-Max, porcelain veneers and bonding.", ar: "المسح الرقمي سيريك والزيركون والإي ماكس والقشور الخزفية والبوندينغ." },
      adimlar: [
        { sayfa: "HOME", sel: ["#teknoloji-cerec", "#tedaviler"], audioIdx: 0,
          baslik: { tr: "CEREC 3B Dijital Ölçü & CAD/CAM", en: "CEREC 3D Digital Scan & CAD/CAM", ar: "المسح الرقمي سيريك و CAD/CAM" },
          metin: { tr: "Bulantı yapan kaşık ölçüsü yerine 3B optik kamerayla dakikalar içinde dijital ölçü alınır ve CAD/CAM ile üretilir.", en: "Instead of impression trays, a 3D optical scanner captures digital impressions in minutes for CAD/CAM production.", ar: "بدلاً من قوالب الطبعات التقليدية يتم أخذ مقاس رقمي ثلاثي الأبعاد خلال دقائق وتصنيعه رقمياً." } },
        { sayfa: "tedavi-protetik.html", sel: ["#konu-zirkonyum-emax"], audioIdx: 1,
          baslik: { tr: "Zirkonyum & E-Max Estetik Kuronlar", en: "Zirconia & E-Max Aesthetic Crowns", ar: "تيجان الزيركون والإي ماكس التجميلية" },
          metin: { tr: "Metal desteksiz tam seramik restorasyonlar diş eti uyumu ve doğal ışık geçirgenliğiyle dişin konumuna göre seçilir.", en: "Metal-free all-ceramic restorations are selected by tooth position for natural light transmission and gum harmony.", ar: "تُختار التركيبات الخزفية الخالية من المعدن حسب موقع السن لتوافقها مع اللثة وشفافيتها الطبيعية." } },
        { sayfa: "tedavi-protetik.html", sel: ["#konu-lamina-gulus"], audioIdx: 2,
          baslik: { tr: "Porselen Lamina & Dijital Gülüş Tasarımı", en: "Porcelain Veneers & Digital Smile Design", ar: "القشور الخزفية وتصميم الابتسامة الرقمي" },
          metin: { tr: "Mock-up (geçici ön prova) ile yeni gülüş formunuz işlem başlamadan önce ağız içinde canlı olarak deneyimlenir.", en: "With a mock-up trial, you preview and test your new smile shape in your mouth before permanent preparation.", ar: "عبر تجربة البروفة المؤقتة يمكنك معاينة شكل الابتسامة الجديدة في الفم قبل البدء بالتحضير." } },
        { sayfa: "tedavi-protetik.html", sel: ["#brans-hekimleri", ".hekim-izgara"], audioIdx: 3,
          baslik: { tr: "Protetik Uzman Kadromuz", en: "Our Prosthodontic Team", ar: "فريق التركيبات السنية" },
          metin: { tr: "Protetik ve estetik gülüş planlamaları Protetik Diş Tedavisi Uzmanı Dr. Dt. Gökhan Uzel liderliğinde yürütülür.", en: "Prosthodontic and smile design treatments are led by Prosthodontist Dr. Dt. Gökhan Uzel.", ar: "يقود علاجات التركيبات وتصميم الابتسامة أخصائي التركيبات د. غوكهان أوزيل." } },
        { sayfa: "tedavi-dijital-dolgu.html", sel: ["#konu-bonding"], audioIdx: 4,
          baslik: { tr: "Bonding & Konservatif Estetik", en: "Bonding & Conservative Aesthetics", ar: "البوندينغ والتجميل التحفظي" },
          metin: { tr: "Küçük diş arası boşluklar (diastema) ve uç kırıkları çoğu zaman dişten aşındırma yapılmadan tek seansta onarılır.", en: "Small gaps (diastema) and minor chips are often repaired in a single visit without drilling natural enamel.", ar: "يمكن غالباً إغلاق الفراغات البسيطة وإصلاح الكسور الصغيرة في جلسة واحدة دون برد السن." } }
      ]
    },
    {
      id: "cocuk", ikon: "👧",
      ad: { tr: "4. Çocuk & Ortodonti Rotası", en: "4. Children & Orthodontics Route", ar: "4. مسار الأطفال والتقويم" },
      ozet: { tr: "Çocuk oyun alanı, koruyucu pedodonti, şeffaf plak/ortodonti ve sedasyon.", en: "Play area, preventive pediatric dentistry, clear aligners/orthodontics and sedation.", ar: "منطقة اللعب وطب أسنان الأطفال الوقائي والتقويم والمصففات والتهدئة." },
      adimlar: [
        { sayfa: "HOME", sel: ["#konfor-cocuk-oyun", "#konfor"], audioIdx: 0,
          baslik: { tr: "Çocuklara Özel Oyun Alanı & Konfor", en: "Dedicated Kids' Play Area & Comfort", ar: "منطقة لعب مخصصة وراحة للأطفال" },
          metin: { tr: "Serdivan şubemizde çocuklarımızın klinik ortamına keyifle alışması için özel oyun ve bekleme alanı yer alır.", en: "Our Serdivan branch features a dedicated play and waiting area so children feel comfortable from the start.", ar: "يضم فرع سرديفان منطقة لعب وانتظار مخصصة ليعتاد الأطفال على العيادة براحة وطمأنينة." } },
        { sayfa: "tedavi-pedodonti.html", sel: ["#konu-fissur-ortucu-uygulamasi"], audioIdx: 1,
          baslik: { tr: "Fissür Örtücü & Koruyucu Pedodonti", en: "Fissure Sealants & Preventive Care", ar: "سد الشقوق والوقاية للأطفال" },
          metin: { tr: "Dr. Dt. Serhat Çalışkan ve Uzm. Dt. Nilüfer Sümeyra Yıldırım ilk muayenede tanışma ve koruyucu uygulamalarla başlar.", en: "Dr. Dt. Serhat Çalışkan and Uzm. Dt. Nilüfer Sümeyra Yıldırım start with a calm introduction and preventive care.", ar: "يبدأ د. سرهات تشاليشكان و د. نيلوفر سميرة يلدريم بتعارف هادئ وتطبيقات وقائية لحماية الأسنان." } },
        { sayfa: "tedavi-ortodonti.html", sel: ["#konu-telsiz-ortodontik"], audioIdx: 2,
          baslik: { tr: "Ortodonti & Şeffaf Plak (Uzm. Dt. Şenol Gülşen)", en: "Orthodontics & Clear Aligners", ar: "التقويم والمصففات الشفافة" },
          metin: { tr: "7 yaş civarı ilk ortodonti kontrolü önerilir; tel tedavisi ve telsiz şeffaf plak seçenekleri dijital simülasyonla sunulur.", en: "A first orthodontic check around age 7 is advised; braces and clear aligners are planned with 3D simulation.", ar: "يُنصح بأول فحص تقويم بعمر 7 سنوات؛ ونقدم التقويم الثابت والمصففات الشفافة بمحاكاة ثلاثية الأبعاد." } },
        { sayfa: "tedavi-sedasyon.html", sel: ["#konu-bilincli-sedasyon"], audioIdx: 3,
          baslik: { tr: "Bilinçli Sedasyon & Genel Anestezi", en: "Conscious Sedation & General Anesthesia", ar: "التهدئة الواعية والتخدير العام" },
          metin: { tr: "Yoğun korku yaşayan çocuk ve yetişkinlerde işlemler, Uzm. Dr. Gökhan Gedikli gözetiminde sedasyonla tamamlanabilir.", en: "For children and adults with strong anxiety, treatments can be completed under sedation with Uzm. Dr. Gökhan Gedikli.", ar: "للأطفال والبالغين الذين يعانون من قلق شديد يمكن إتمام العلاج تحت التهدئة بإشراف د. غوكهان جديكلي." } }
      ]
    },
    {
      id: "kurumsal", ikon: "🏥",
      ad: { tr: "5. 20 Hekim & İki Şube Tanıtım Rotası", en: "5. 20 Doctors & Two Branches Route", ar: "5. مسار الأطباء العشرين والفرعين" },
      ozet: { tr: "Hekim kadromuz, Serdivan ve Adapazarı şubeleri, çalışma saatleri ve iletişim.", en: "Our doctors, Serdivan and Adapazarı branches, opening hours and contact.", ar: "أطباؤنا وفرعا سرديفان وأدابازاري وساعات العمل والتواصل." },
      adimlar: [
        { sayfa: "HOME", sel: ["#hekimler"], audioIdx: 0,
          baslik: { tr: "8 Uzmanlık Branşı · 20 Hekim", en: "8 Specialties · 20 Doctors", ar: "8 تخصصات · 20 طبيباً" },
          metin: { tr: "Evdiş'te her tedavi ilgili uzmanlık branşının hekimleri tarafından multidisipliner konsey anlayışıyla yürütülür.", en: "At Evdiş, every treatment is handled by the relevant specialist team in a multidisciplinary approach.", ar: "في إيف ديش يتولى كل علاج أطباء التخصص المعني ضمن نهج طبي متكامل." } },
        { sayfa: "hekimler.html", sel: ["#hekimler-izgara", "main h1"], audioIdx: 1,
          baslik: { tr: "Hekim Kadromuz & Uzmanlık Filtreleri", en: "Our Doctors & Specialty Filters", ar: "كادرنا الطبي وفلاتر التخصص" },
          metin: { tr: "Branşa veya şubeye göre filtreleyerek 20 hekimimizin özgeçmiş ve çalışma alanlarını inceleyebilirsiniz.", en: "Filter by specialty or branch to view the profiles and clinical focus of all 20 doctors.", ar: "يمكنك التصفية حسب التخصص أو الفرع للاطلاع على السيرة الذاتية ومجالات عمل 20 طبيباً." } },
        { sayfa: "serdivan.html", sel: ["main .sube-kart", "main h1"], audioIdx: 2,
          baslik: { tr: "Serdivan Merkez Şubesi (18 Hekim)", en: "Serdivan Main Branch (18 Doctors)", ar: "فرع سرديفان الرئيسي (18 طبيباً)" },
          metin: { tr: "İstiklal Mah. 2. Cad. No: 13 · 3B CBCT tomografi, CEREC, ameliyathane/sedasyon birimi ve çocuk oyun alanı.", en: "İstiklal Mah. 2. Cad. No: 13 · 3D CBCT, CEREC, operating room/sedation unit and kids' play area.", ar: "İstiklal Mah. 2. Cad. No: 13 · تصوير ثلاثي الأبعاد وسيريك وغرفة عمليات ووحدة تهدئة ومنطقة لعب." } },
        { sayfa: "adapazari.html", sel: ["main .sube-kart", "main h1"], audioIdx: 3,
          baslik: { tr: "Adapazarı Şubesi (2 Hekim)", en: "Adapazarı Branch (2 Doctors)", ar: "فرع أدابازاري (طبيبان)" },
          metin: { tr: "Yenidoğan Mah. Fabrika Cad. No: 33 · Dt. Mehmet Emre Türkhan ve Dt. Yasa Akdoğan ile merkezi ulaşım.", en: "Yenidoğan Mah. Fabrika Cad. No: 33 · Central access with Dt. Mehmet Emre Türkhan and Dt. Yasa Akdoğan.", ar: "Yenidoğan Mah. Fabrika Cad. No: 33 · موقع مركزي مع د. محمد أمره تورخان و د. ياسا أكدوغان." } },
        { sayfa: "kurumsal.html", sel: ["#organizasyon-semasi", "#yonetim-kurulu"], audioIdx: 4,
          baslik: { tr: "Kurumsal Organizasyon Şeması & Yönetim", en: "Corporate Organization Chart & Management", ar: "الهيكل التنظيمي والإدارة" },
          metin: { tr: "Başhekim Dr. Dt. Seyit Yılmaz, Kurucu Ortak Dt. Emrah Özdemir, Genel Müdür Ozan Aydınlar, İşletme Direktörü Mustafa Gökhan Bulut, Tıbbi Direktör Prof. Dr. Fuat Ahmetoğlu ve SKS Kalite Birimi (Serap Ay).", en: "Chief Physician Dr. Dt. Seyit Yılmaz, Co-founder Dt. Emrah Özdemir, General Manager Ozan Aydınlar, Operations Director Mustafa Gökhan Bulut, Medical Director Prof. Dr. Fuat Ahmetoğlu and Quality Unit.", ar: "رئيس الأطباء د. سيت يلماز، الشريك المؤسس د. أمره أوزدمير، المدير العام أوزان آيدينلار، مدير العمليات مصطفى غوكهان بولوت ومدير الخدمات الطبية أ.د. فؤاد أحمد أوغلو." } },
        { sayfa: "HOME", sel: ["#subeler", "#iletisim"], audioIdx: 5,
          baslik: { tr: "Çalışma Saatlerimiz & İletişim", en: "Opening Hours & Contact", ar: "ساعات العمل والتواصل" },
          metin: { tr: "Hafta içi 08.30–19.00, Cumartesi 08.30–18.00 · Tel 0 (264) 606 00 60 · WhatsApp 0 (545) 606 00 69.", en: "Mon–Fri 08:30–19:00, Sat 08:30–18:00 · Phone 0 (264) 606 00 60 · WhatsApp 0 (545) 606 00 69.", ar: "الإثنين–الجمعة 08:30–19:00، السبت 08:30–18:00 · هاتف 0 (264) 606 00 60 · واتساب 0 (545) 606 00 69." } }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // KONULAR: 8 branş · 24 klinik tedavi/işlem · 4 teknoloji · 20 hekim · 2 şube + kurumsal şema
  // ---------------------------------------------------------------------------
  function k(ad, alt, sayfa, bolum, ek) { return { ad: ad, alt: alt, sayfa: sayfa, bolum: bolum || "#icerik", ek: ek || "" }; }
  var DT = { tr: "Diş Hekimi", en: "Dentist", ar: "طبيب أسنان" };
  var KONULAR = {
    brans: [
      k({ tr: "İmplant & Çene Cerrahisi", en: "Implants & Oral Surgery", ar: "الزراعة وجراحة الفم" }, { tr: "Dr. Dt. Seyit Yılmaz", en: "Dr. Dt. Seyit Yılmaz", ar: "د. سيت يلماز" }, "implant-ve-cene-cerrahisi.html", "#konu-implant-tedavisi", "implant cerrahi 20lik yirmilik gömülü surgery زراعة"),
      k({ tr: "Endodonti (Kanal Tedavisi)", en: "Endodontics (Root Canal)", ar: "علاج العصب" }, { tr: "Prof. Dr. Fuat Ahmetoğlu · Dr. Dt. Elshad Salmanov", en: "Prof. Dr. Fuat Ahmetoğlu · Dr. Dt. Elshad Salmanov", ar: "أ.د. فؤاد أحمد أوغلو · د. إلشاد سلمانوف" }, "tedavi-endodonti.html", "#konu-kanal-tedavisi", "ağrı kanal agri pain root canal ألم عصب"),
      k({ tr: "Ortodonti & Şeffaf Plak", en: "Orthodontics & Clear Aligners", ar: "التقويم والمصففات الشفافة" }, { tr: "Uzm. Dt. Şenol Gülşen", en: "Uzm. Dt. Şenol Gülşen", ar: "د. شنول غولشن" }, "tedavi-ortodonti.html", "#konu-ortodontik-tedavi", "tel plak braces aligner تقويم"),
      k({ tr: "Periodontoloji (Diş Eti & GBT)", en: "Periodontology (Gums & GBT)", ar: "أمراض اللثة و GBT" }, { tr: "Dr. Dt. Zuhal Metin", en: "Dr. Dt. Zuhal Metin", ar: "د. زهال متين" }, "tedavi-periodontoloji.html", "#konu-dis-eti-iltihabi-tedavileri", "diş eti kanama gum bleeding لثة"),
      k({ tr: "Protetik & Gülüş Tasarımı", en: "Prosthodontics & Smile Design", ar: "التركيبات وتصميم الابتسامة" }, { tr: "Dr. Dt. Gökhan Uzel", en: "Dr. Dt. Gökhan Uzel", ar: "د. غوكهان أوزيل" }, "tedavi-protetik.html", "#konu-zirkonyum-emax", "zirkonyum lamina kaplama zirconia veneer crown زيركون"),
      k({ tr: "Çocuk Diş Hekimliği", en: "Pediatric Dentistry", ar: "طب أسنان الأطفال" }, { tr: "Dr. Dt. Serhat Çalışkan · Uzm. Dt. Nilüfer Sümeyra Yıldırım", en: "Dr. Dt. Serhat Çalışkan · Uzm. Dt. Nilüfer Sümeyra Yıldırım", ar: "د. سرهات تشاليشكان · د. نيلوفر سميرة يلدريم" }, "tedavi-pedodonti.html", "#konu-curuklerden-koruyucu-uygulamalar", "çocuk pedodonti child kids أطفال"),
      k({ tr: "Dijital Dolgu & Kompozit Lamine", en: "Digital Filling & Composite Veneers", ar: "الحشوات الرقمية" }, { tr: "Restoratif & Dijital Diş Hekimliği", en: "Restorative & Digital Dentistry", ar: "طب الأسنان الترميمي والرقمي" }, "tedavi-dijital-dolgu.html", "#konu-cerec-dijital-olcu-ve-restorasyon-sureci", "dolgu çürük filling cavity bonding حشوة"),
      k({ tr: "Sedasyon & Genel Anestezi", en: "Sedation & General Anesthesia", ar: "التهدئة والتخدير العام" }, { tr: "Uzm. Dr. Gökhan Gedikli", en: "Uzm. Dr. Gökhan Gedikli", ar: "د. غوكهان جديكلي" }, "tedavi-sedasyon.html", "#konu-bilincli-sedasyon", "korku uyutarak sedation anxiety تخدير")
    ],
    tedavi: [
      k({ tr: "Gömülü 20 Yaş Dişi Çekimi", en: "Impacted Wisdom Tooth Extraction", ar: "خلع ضرس العقل المطمور" }, { tr: "3B CBCT ile sinir komşuluğu analizi", en: "3D CBCT nerve proximity analysis", ar: "تحليل القرب من العصب بالتصوير ثلاثي الأبعاد" }, "implant-ve-cene-cerrahisi.html", "#konu-20-yas-disleri", "20lik yirmilik gömülü wisdom tooth ضرس العقل"),
      k({ tr: "Sinüs Lifting (Sinüs Yükseltme)", en: "Sinus Lifting & Bone Graft", ar: "رفع الجيب الأنفي" }, { tr: "Üst çene arka bölge kemik hazırlığı", en: "Upper jaw bone preparation", ar: "تحضير عظم الفك العلوي" }, "implant-ve-cene-cerrahisi.html", "#konu-sinus-lifting", "sinüs lifting kemik tozu greft sinus"),
      k({ tr: "All-on-4 / All-on-6 Sabit İmplant", en: "All-on-4 / All-on-6 Fixed Implants", ar: "زراعة الفك الكامل All-on-4" }, { tr: "Tam dişsiz çenelerde sabit protez", en: "Fixed teeth for edentulous jaws", ar: "أسنان ثابتة للفك الكامل" }, "tedavi-protetik.html", "#konu-all-on-4", "all on 4 all on 6 sabit protez"),
      k({ tr: "Zygoma (Elmacık Kemiği) İmplantı", en: "Zygomatic Implants", ar: "زراعة عظم الوجنة" }, { tr: "İleri üst çene kemik erimesinde", en: "For severe upper jaw bone loss", ar: "لضمور عظم الفك العلوي الشديد" }, "implant-ve-cene-cerrahisi.html", "#konu-zygoma-implant", "zygoma zigoma elmacık"),
      k({ tr: "Çene Kisti Operasyonu", en: "Jaw Cyst Surgery", ar: "جراحة أكياس الفك" }, { tr: "Kök ucu ve çene kistlerinin temizlenmesi", en: "Enucleation of jaw cysts", ar: "إزالة أكياس الفك" }, "implant-ve-cene-cerrahisi.html", "#konu-kist-operasyonu", "kist tümör lezyon cyst"),
      k({ tr: "Masseter (Çene) Botoksu", en: "Masseter Botox (Bruxism)", ar: "بوتوكس الفك والشد" }, { tr: "Diş sıkma ve çene kası ağrısında", en: "For clenching and muscle pain", ar: "لصرير الأسنان وألم العضلات" }, "implant-ve-cene-cerrahisi.html", "#konu-botoks", "botoks diş sıkma bruksizm masseter"),
      k({ tr: "Kanal Yenileme (Retreatment)", en: "Root Canal Retreatment", ar: "إعادة علاج العصب" }, { tr: "Başarısız eski kanal tedavisinin yenilenmesi", en: "Renewing previous root canals", ar: "تجديد علاج العصب السابق" }, "tedavi-endodonti.html", "#konu-retreatment", "retreatment kanal yenileme eski kanal"),
      k({ tr: "Apikal Rezeksiyon (Kök Ucu Cerrahisi)", en: "Apical Resection", ar: "استئصال ذروة الجذر" }, { tr: "Kök ucu lezyonunun mikro-cerrahi ile çıkarılması", en: "Root-end microsurgery", ar: "جراحة ذروة الجذر المجهرية" }, "tedavi-endodonti.html", "#konu-endodontik-cerrahi-uygulamalar", "rezeksiyon kök ucu apikal"),
      k({ tr: "Zirkonyum & E-Max Estetik Kuron", en: "Zirconia & E-Max Crowns", ar: "تيجان الزيركون والإي ماكس" }, { tr: "Metal desteksiz tam seramik kaplama", en: "Metal-free all-ceramic crowns", ar: "تيجان خزفية خالية من المعدن" }, "tedavi-protetik.html", "#konu-zirkonyum-emax", "zirkonyum emax kaplama kuron"),
      k({ tr: "Porselen Lamina (Yaprak Porselen)", en: "Porcelain Veneers (Lamina)", ar: "القشور الخزفية (لومينير)" }, { tr: "Minimal aşındırmalı dijital gülüş tasarımı", en: "Minimal-prep digital smile design", ar: "تصميم الابتسامة الرقمي" }, "tedavi-protetik.html", "#konu-lamina-gulus", "lamina yaprak porselen gülüş tasarımı veneer"),
      k({ tr: "Çene Eklemi (TME) & Gece Plağı", en: "TMJ Disorder & Night Guard", ar: "مفصل الفك والجبيرة الليلية" }, { tr: "Eklem sesi, kilitlenme ve bruksizm splint tedavisi", en: "Jaw clicking, locking and splint therapy", ar: "طقطقة الفك والجبيرة" }, "tedavi-protetik.html", "#konu-tme-hastaliklari", "eklem tme gece plağı splint diş sıkma"),
      k({ tr: "Şeffaf Plak (Telsiz Ortodonti)", en: "Clear Aligners (Invisalign)", ar: "المصففات الشفافة بدون سلك" }, { tr: "Takıp çıkarılabilir 3B dijital plaklar", en: "Removable 3D digital aligners", ar: "تقويم شفاف متحرك" }, "tedavi-ortodonti.html", "#konu-telsiz-ortodontik", "şeffaf plak telsiz invisalign aligner"),
      k({ tr: "Porselen & Metal Braket (Tel Tedavisi)", en: "Ceramic & Metal Braces", ar: "التقويم الخزفي والمعدني" }, { tr: "Çapraşıklık ve kapanış düzeltimi", en: "Crowding and bite correction", ar: "تصحيح الازدحام والإطباق" }, "tedavi-ortodonti.html", "#konu-porselen-braket", "tel braket porselen ortodonti"),
      k({ tr: "GBT Rehberli Biyofilm & Diş Taşı Temizliği", en: "GBT Guided Biofilm & Scaling", ar: "تنظيف اللثة بتقنية GBT" }, { tr: "Boyama rehberli konforlu diş eti bakımı", en: "Dye-guided gentle gum care", ar: "تنظيف الجير الموجه بالصبغة" }, "tedavi-periodontoloji.html", "#konu-gbt-temizlik", "gbt diş taşı temizliği detertraj airflow"),
      k({ tr: "Diş Eti Çekilmesi & Bağ Dokusu Grefti", en: "Gum Recession & Tissue Graft", ar: "انحسار اللثة وترقيع الأنسجة" }, { tr: "Açık kök yüzeylerinin mikro-cerrahi ile örtülmesi", en: "Microsurgical root coverage", ar: "تغطية الجذور المكشوفة" }, "tedavi-periodontoloji.html", "#konu-dis-eti-cekilmesi-tedavisi", "diş eti çekilmesi greft hassasiyet"),
      k({ tr: "Gummy Smile (Pembe Estetik / Gingivektomi)", en: "Gummy Smile & Pink Aesthetics", ar: "تجميل اللثة والابتسامة اللثوية" }, { tr: "Diş eti seviyeleme ve kuron boyu uzatma", en: "Gum contouring and crown lengthening", ar: "تحديد مستوى اللثة" }, "tedavi-periodontoloji.html", "#konu-gumy-smile-estetik-dis-eti-operasyonlari", "gummy smile pembe estetik diş eti seviyeleme"),
      k({ tr: "CEREC 3B Dijital Ölçü & CAD/CAM", en: "CEREC 3D Scan & CAD/CAM", ar: "المسح الرقمي سيريك" }, { tr: "Kaşıksız optik tarama ve dijital üretim", en: "Tray-free optical scan and milling", ar: "مسح ضوئي بدون طبعة" }, "tedavi-dijital-dolgu.html", "#konu-cerec-dijital-olcu-ve-restorasyon-sureci", "cerec dijital ölçü cad cam"),
      k({ tr: "Inley & Onley Porselen Dolgu", en: "Inlay & Onlay Ceramic Fillings", ar: "حشوات الإنلاي والأونلاي الخزفية" }, { tr: "Geniş madde kayıplarında CAD/CAM porselen blok", en: "CAD/CAM ceramic blocks for large cavities", ar: "حشوات خزفية رقمية" }, "tedavi-dijital-dolgu.html", "#konu-inley-onley", "inley onley porselen dolgu"),
      k({ tr: "Bonding (Estetik Kompozit Lamine)", en: "Cosmetic Bonding & Diastema Closure", ar: "البوندينغ التجميلي وإغلاق الفراغات" }, { tr: "Tek seansta diş arası boşluk ve kırık onarımı", en: "Single-visit gap and chip repair", ar: "إغلاق الفراغات في جلسة واحدة" }, "tedavi-dijital-dolgu.html", "#konu-bonding", "bonding diastema boşluk kırık kompozit"),
      k({ tr: "Amalgam (Gri) Dolgu Değişimi", en: "Amalgam Filling Replacement", ar: "استبدال الحشوات المعدنية" }, { tr: "Yüksek vakum altında estetik kompozit dönüşüm", en: "Safe replacement with tooth-colored composite", ar: "استبدال آمن بحشوات تجميلية" }, "tedavi-dijital-dolgu.html", "#konu-amalgam-degisim", "amalgam siyah gri dolgu değişim"),
      k({ tr: "Diş Beyazlatma (Bleaching)", en: "Teeth Whitening (Bleaching)", ar: "تبييض الأسنان" }, { tr: "Klinik içi ofis ve ev tipi beyazlatma", en: "In-office and home whitening protocols", ar: "تبييض الأسنان في العيادة والمنزل" }, "tedavi-dijital-dolgu.html", "#konu-dis-beyazlatma", "beyazlatma bleaching sarı renk"),
      k({ tr: "Bilinçli Sedasyon & Genel Anestezi", en: "Conscious Sedation & General Anesthesia", ar: "التهدئة الواعية والتخدير العام" }, { tr: "Uzm. Dr. Gökhan Gedikli gözetiminde konforlu işlem", en: "Monitored sedation with Uzm. Dr. Gökhan Gedikli", ar: "علاج مريح تحت إشراف أخصائي التخدير" }, "tedavi-sedasyon.html", "#konu-bilincli-sedasyon", "sedasyon genel anestezi uyutarak"),
      k({ tr: "Diş Hekimi Korkusu (Dental Fobi) & Bulantı", en: "Dental Phobia & Gag Reflex", ar: "رهاب الأسنان ومنعكس الغثيان" }, { tr: "Korku ve öğürme refleksinde kademeli yaklaşım", en: "Gradual care for severe anxiety and gag reflex", ar: "رعاية خاصة للخوف الشديد" }, "tedavi-sedasyon.html", "#konu-dental-fobi", "fobi korku bulantı öğürme"),
      k({ tr: "Çocuk Fissür Örtücü, Florür & Yer Tutucu", en: "Pediatric Sealants, Fluoride & Space Maintainers", ar: "سد الشقوق والفلورايد وحافظ المسافة" }, { tr: "Çocuklarda çürük önleyici koruyucu uygulamalar", en: "Preventive pediatric dental care", ar: "الوقاية من التسوس للأطفال" }, "tedavi-pedodonti.html", "#konu-fissur-ortucu-uygulamasi", "fissür florür yer tutucu süt dişi çocuk")
    ],
    tek: [
      k({ tr: "Operasyon Mikroskobu", en: "Operating Microscope", ar: "المجهر الجراحي" }, { tr: "Endodonti · restoratif · estetik", en: "Endodontic · restorative · aesthetic", ar: "العصب · الترميم · التجميل" }, "HOME", "#teknoloji-mikroskop", "mikroskop microscope مجهر"),
      k({ tr: "Yapay Zekâ Radyoloji", en: "AI Radiology", ar: "الأشعة بالذكاء الاصطناعي" }, { tr: "Panoramik & 3B CBCT analizi", en: "Panoramic & 3D CBCT analysis", ar: "تحليل البانوراما والتصوير ثلاثي الأبعاد" }, "HOME", "#teknoloji-yapay-zeka", "yapay zeka röntgen tomografi ai x-ray ذكاء"),
      k({ tr: "Genel Anestezi & Ameliyathane", en: "General Anesthesia & Operating Room", ar: "التخدير العام وغرفة العمليات" }, { tr: "Uzm. Dr. Gökhan Gedikli", en: "Uzm. Dr. Gökhan Gedikli", ar: "د. غوكهان جديكلي" }, "HOME", "#teknoloji-ameliyathane", "ameliyathane anestezi operating room عمليات"),
      k({ tr: "CEREC Dijital Ölçü", en: "CEREC Digital Scan", ar: "المسح الرقمي سيريك" }, { tr: "3B tarayıcı · CAD/CAM kazıyıcı", en: "3D scanner · CAD/CAM milling", ar: "ماسح ثلاثي الأبعاد · CAD/CAM" }, "HOME", "#teknoloji-cerec", "cerec ölçü kazıyıcı scan milling سيريك")
    ],
    hekim: [
      k({ tr: "Dr. Dt. Seyit Yılmaz" }, { tr: "Başhekim · Ağız, Diş ve Çene Cerrahisi", en: "Chief Physician · Oral & Maxillofacial Surgery", ar: "رئيس الأطباء · جراحة الفم والفكين" }, "hekim-dr--dt--seyit-yilmaz.html", "#hekim-profil-karti", "seyit başhekim cerrahi"),
      k({ tr: "Dt. Emrah Özdemir" }, { tr: "Kurucu Ortak · Diş Hekimi", en: "Co-founder · Dentist", ar: "الشريك المؤسس · طبيب أسنان" }, "hekim-dt--emrah-ozdemir.html", "#hekim-profil-karti", "emrah kurucu"),
      k({ tr: "Prof. Dr. Fuat Ahmetoğlu" }, { tr: "Endodonti · Tıbbi Hizmetler Direktörü", en: "Endodontics · Medical Services Director", ar: "علاج العصب · مدير الخدمات الطبية" }, "hekim-prof--dr--fuat-ahmetoglu.html", "#hekim-profil-karti", "fuat kanal endodonti profesör"),
      k({ tr: "Dr. Dt. Elshad Salmanov" }, { tr: "Endodonti", en: "Endodontics", ar: "علاج العصب" }, "hekim-dr--dt--elshad-salmanov.html", "#hekim-profil-karti", "elshad kanal endodonti"),
      k({ tr: "Dr. Dt. Gökhan Uzel" }, { tr: "Protetik Diş Tedavisi", en: "Prosthodontics", ar: "التركيبات السنية" }, "hekim-dr--dt--gokhan-uzel.html", "#hekim-profil-karti", "gökhan uzel protez zirkonyum"),
      k({ tr: "Dr. Dt. Zuhal Metin" }, { tr: "Periodontoloji", en: "Periodontology", ar: "أمراض اللثة" }, "hekim-dr--dt--zuhal-metin.html", "#hekim-profil-karti", "zuhal diş eti periodontoloji"),
      k({ tr: "Uzm. Dt. Şenol Gülşen" }, { tr: "Ortodonti", en: "Orthodontics", ar: "تقويم الأسنان" }, "hekim-uzm--dt--senol-gulsen.html", "#hekim-profil-karti", "şenol ortodonti tel plak"),
      k({ tr: "Dr. Dt. Serhat Çalışkan" }, { tr: "Pedodonti", en: "Pediatric Dentistry", ar: "طب أسنان الأطفال" }, "hekim-dr--dt--serhat-caliskan.html", "#hekim-profil-karti", "serhat çocuk pedodonti"),
      k({ tr: "Uzm. Dt. Nilüfer Sümeyra Yıldırım" }, { tr: "Pedodonti", en: "Pediatric Dentistry", ar: "طب أسنان الأطفال" }, "hekim-uzm--dt--nilufer-sumeyra-yildirim.html", "#hekim-profil-karti", "nilüfer sümeyra çocuk pedodonti"),
      k({ tr: "Uzm. Dr. Gökhan Gedikli" }, { tr: "Anesteziyoloji ve Reanimasyon", en: "Anesthesiology", ar: "التخدير والإنعاش" }, "hekim-uzm--dr--gokhan-gedikli.html", "#hekim-profil-karti", "gökhan gedikli anestezi sedasyon"),
      k({ tr: "Dr. Dt. Neslihan Çalışkan" }, DT, "hekim-dr--dt--neslihan-caliskan.html", "#hekim-profil-karti", "neslihan"),
      k({ tr: "Dt. Burak Eren" }, DT, "hekim-dt--burak-eren.html", "#hekim-profil-karti", "burak"),
      k({ tr: "Dt. Davut Kayhan" }, DT, "hekim-dt--davut-kayhan.html", "#hekim-profil-karti", "davut"),
      k({ tr: "Dt. Seyfullah Hayri Özkutlu" }, DT, "hekim-dt--seyfullah-h--ozkutlu.html", "#hekim-profil-karti", "seyfullah hayri özkutlu"),
      k({ tr: "Dt. Betül Durmaz Enginler" }, DT, "hekim-dt--betul-durmaz-enginler.html", "#hekim-profil-karti", "betül"),
      k({ tr: "Dt. Sıla Nur Çay" }, DT, "hekim-dt--sila-nur-cay.html", "#hekim-profil-karti", "sıla"),
      k({ tr: "Dt. Elif Yıldız" }, DT, "hekim-dt--elif-yildiz.html", "#hekim-profil-karti", "elif"),
      k({ tr: "Dt. Sena Özdemir" }, DT, "hekim-dt--sena-ozdemir.html", "#hekim-profil-karti", "sena"),
      k({ tr: "Dt. Mehmet Emre Türkhan" }, { tr: "Diş Hekimi · Adapazarı", en: "Dentist · Adapazarı", ar: "طبيب أسنان · أدابازاري" }, "hekim-dt--mehmet-emre-turkhan.html", "#hekim-profil-karti", "mehmet emre adapazarı"),
      k({ tr: "Dt. Yasa Akdoğan" }, { tr: "Diş Hekimi · Adapazarı", en: "Dentist · Adapazarı", ar: "طبيب أسنان · أدابازاري" }, "hekim-dt--yasa-akdogan.html", "#hekim-profil-karti", "yasa adapazarı")
    ],
    sube: [
      k({ tr: "Serdivan Merkez Şubesi (18 Hekim)", en: "Serdivan Main Branch (18 Doctors)", ar: "فرع سرديفان الرئيسي (18 طبيباً)" }, { tr: "İstiklal Mah. 2. Cad. No: 13", en: "İstiklal Mah. 2. Cad. No: 13", ar: "İstiklal Mah. 2. Cad. No: 13" }, "serdivan.html", "main .sube-kart", "serdivan merkez"),
      k({ tr: "Adapazarı Şubesi (2 Hekim)", en: "Adapazarı Branch (2 Doctors)", ar: "فرع أدابازاري (طبيبان)" }, { tr: "Yenidoğan Mah. Fabrika Cad. No: 33", en: "Yenidoğan Mah. Fabrika Cad. No: 33", ar: "Yenidoğan Mah. Fabrika Cad. No: 33" }, "adapazari.html", "main .sube-kart", "adapazarı adapazari"),
      k({ tr: "Kurumsal Organizasyon Şeması & Yönetim", en: "Corporate Organization Chart & Management", ar: "الهيكل التنظيمي والإدارة" }, { tr: "Dr. Dt. Seyit Yılmaz · Dt. Emrah Özdemir · Ozan Aydınlar (GM) · Mustafa Gökhan Bulut · Prof. Dr. Fuat Ahmetoğlu · Serap Ay", en: "Board, General Manager Ozan Aydınlar, Operations Director Mustafa Gökhan Bulut, Medical Director & SKS Quality", ar: "مجلس الإدارة والمدير العام أوزان آيدينلار ومدير العمليات مصطفى غوكهان بولوت" }, "kurumsal.html", "#organizasyon-semasi", "organizasyon şeması yönetim kurulu genel müdür ozan aydınlar mustafa gökhan bulut esma özdemir serap ay sümeyra çokyüksel nagihan gür kezban durmaz yağmur birinci güler altun zeynep nihan özdemir serdar gümüşsoy burak bıçakcı")
    ]
  };
  function metinSec(obj) { if (!obj) return ""; return obj[aktifDil] || obj.tr || obj.en || ""; }

  // ---------------------------------------------------------------------------
  // STİL KATMANI (Maya orb · 3 sekmeli panel · Maya spot ışığı · rota barı)
  // ---------------------------------------------------------------------------
  var style = document.createElement("style");
  style.textContent = `
    #evdis-ajan-root { position: fixed; right: 18px; bottom: 18px; z-index: 99999; font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --evdis-keten: #F8F6F1; --evdis-keten-cam: rgba(248, 246, 241, 0.94); --evdis-orman: #0E261F; --evdis-orman-2: #15372C; --evdis-adacayi: #2A5C4D;
      --evdis-teal: #2DD4BF; --evdis-altin: #D4AF37; --evdis-bronz: #B8860B; --evdis-metin: #1F2D28; --evdis-metin-yumusak: #3B4A44;
      --evdis-serif: 'Cormorant Garamond', 'Hoefler Text', 'Iowan Old Style', Georgia, 'Times New Roman', serif;
      --evdis-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, monospace;
    }
    #evdis-ajan-root[dir="rtl"] { right: auto; left: 18px; }
    .evdis-ajan-fab { display: inline-flex; align-items: center; gap: 11px; background: linear-gradient(135deg, #102B23 0%, #1E463A 55%, #2A5C4D 100%); color: #F8F6F1; border: 1.5px solid rgba(45, 212, 191, 0.5); border-radius: 999px; padding: 7px 18px 7px 8px; cursor: pointer; box-shadow: 0 14px 34px rgba(16, 43, 35, 0.38), 0 0 22px rgba(212, 175, 55, 0.18); transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
    .evdis-ajan-fab:hover { transform: translateY(-2px) scale(1.02); border-color: #D4AF37; }
    .evdis-maya-orb { position: relative; width: 46px; height: 46px; border-radius: 50%; overflow: hidden; border: 2px solid #2DD4BF; background: radial-gradient(circle at 50% 35%, #1E3A5F, #09131C); flex-shrink: 0; }
    .evdis-maya-orb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .evdis-maya-orb-status { position: absolute; bottom: 2px; right: 2px; width: 10px; height: 10px; border-radius: 50%; background: #34D399; border: 2px solid #09131C; }
    .evdis-ajan-fab-text { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.22; }
    .evdis-ajan-fab-title { font-size: 14px; font-weight: 700; color: #FFFFFF; }
    .evdis-ajan-fab-sub { font-size: 11px; color: #A7F3D0; font-weight: 600; }
    .evdis-ajan-panel { width: min(460px, calc(100vw - 24px)); height: min(670px, calc(100vh - 96px)); background: var(--evdis-keten-cam); -webkit-backdrop-filter: blur(24px) saturate(180%); backdrop-filter: blur(24px) saturate(180%); color: var(--evdis-metin); border: 1px solid rgba(212, 175, 55, 0.28); border-radius: 24px; box-shadow: 0 32px 80px -24px rgba(11, 29, 23, 0.55), 0 6px 22px rgba(11, 29, 23, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 0 0 1px rgba(42, 92, 77, 0.06); overflow: hidden; margin-bottom: 12px; display: none; flex-direction: column; transition: width .3s cubic-bezier(.22,1,.36,1), height .3s cubic-bezier(.22,1,.36,1), opacity .3s ease, transform .3s cubic-bezier(.22,1,.36,1); }
    @supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) { .evdis-ajan-panel { background: #F6F3EC; } }
    .evdis-ajan-panel.open { display: flex; }
    .evdis-ajan-panel.expanded { width: min(720px, calc(100vw - 24px)); height: min(820px, calc(100vh - 64px)); }
    .evdis-ajan-head { position: relative; background: radial-gradient(130% 160% at 12% -10%, rgba(42, 92, 77, 0.55), transparent 55%), linear-gradient(135deg, #0B1F18 0%, #0E261F 42%, #16392D 100%); color: var(--evdis-keten); padding: 13px 15px 15px; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-shrink: 0; box-shadow: inset 0 -1px 0 rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06); overflow: hidden; }
    .evdis-ajan-head::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5) 50%, transparent); height: 1px; top: auto; bottom: 0; opacity: .55; }
    .evdis-head-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .evdis-head-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #2DD4BF; flex-shrink: 0; transition: box-shadow .25s ease; }
    .evdis-head-avatar.konusuyor { border-color: #D4AF37; animation: evdisMayaNabiz 1.8s ease-in-out infinite; }
    .evdis-head-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .evdis-maya-wave { position: absolute; left: 15px; right: 15px; bottom: 5px; height: 14px; display: flex; align-items: flex-end; justify-content: flex-start; gap: 3px; pointer-events: none; opacity: 0; transform: translateY(4px); transition: opacity .4s ease, transform .4s ease; z-index: 2; }
    .evdis-ajan-panel.maya-konusuyor .evdis-maya-wave { opacity: 1; transform: translateY(0); }
    .evdis-maya-wave i { display: block; width: 2.5px; border-radius: 3px; background: linear-gradient(to top, rgba(45, 212, 191, 0.25), var(--evdis-teal) 55%, var(--evdis-altin)); box-shadow: 0 0 8px rgba(45, 212, 191, 0.35); height: 3px; transform-origin: bottom; }
    .evdis-ajan-panel.maya-konusuyor .evdis-maya-wave i { animation: evdisDalga 1.25s ease-in-out infinite; }
    @keyframes evdisDalga {
      0%, 100% { height: 3px; opacity: .55; }
      25% { height: 11px; opacity: 1; }
      50% { height: 5px; opacity: .8; }
      75% { height: 9px; opacity: .95; }
    }
    .evdis-maya-wave i:nth-child(1) { animation-delay: -.08s; } .evdis-maya-wave i:nth-child(2) { animation-delay: -.42s; } .evdis-maya-wave i:nth-child(3) { animation-delay: -.19s; } .evdis-maya-wave i:nth-child(4) { animation-delay: -.63s; } .evdis-maya-wave i:nth-child(5) { animation-delay: -.31s; } .evdis-maya-wave i:nth-child(6) { animation-delay: -.74s; } .evdis-maya-wave i:nth-child(7) { animation-delay: -.12s; } .evdis-maya-wave i:nth-child(8) { animation-delay: -.55s; } .evdis-maya-wave i:nth-child(9) { animation-delay: -.27s; } .evdis-maya-wave i:nth-child(10) { animation-delay: -.68s; } .evdis-maya-wave i:nth-child(11) { animation-delay: -.04s; } .evdis-maya-wave i:nth-child(12) { animation-delay: -.49s; } .evdis-maya-wave i:nth-child(13) { animation-delay: -.22s; } .evdis-maya-wave i:nth-child(14) { animation-delay: -.6s; } .evdis-maya-wave i:nth-child(15) { animation-delay: -.35s; } .evdis-maya-wave i:nth-child(16) { animation-delay: -.78s; } .evdis-maya-wave i:nth-child(17) { animation-delay: -.15s; } .evdis-maya-wave i:nth-child(18) { animation-delay: -.52s; }
    @media (prefers-reduced-motion: reduce) {
      .evdis-head-avatar.konusuyor, .evdis-ajan-head small::before, .evdis-ajan-panel.maya-konusuyor .evdis-maya-wave i, .evdis-maya-spotlight { animation: none !important; }
    }
    .evdis-ajan-head h4 { margin: 0; font-family: var(--evdis-serif); font-size: 20px; font-weight: 600; letter-spacing: .005em; line-height: 1.12; color: #FBFAF6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.22); }
    .evdis-ajan-head small { display: flex; align-items: center; gap: 6px; font-family: var(--evdis-mono); font-size: 9px; color: #BCF3DE; margin-top: 4px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .evdis-ajan-head small::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--evdis-teal); box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.22); flex-shrink: 0; animation: evdisDurumNabiz 2.4s ease-in-out infinite; }
    @keyframes evdisDurumNabiz { 0%, 100% { opacity: 1; box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.22); } 50% { opacity: .65; box-shadow: 0 0 0 5px rgba(45, 212, 191, 0.08); } }
    .evdis-ajan-head-actions { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
    .evdis-dil-secici { display: inline-flex; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); border-radius: 999px; padding: 2px; margin-inline-end: 2px; }
    .evdis-dil-secici button { background: transparent; border: none; color: #E2E8F0; font-size: 11px; font-weight: 700; padding: 4px 7px; border-radius: 999px; cursor: pointer; letter-spacing: .02em; }
    .evdis-dil-secici button.aktif { background: #D4AF37; color: #1B1405; }
    .evdis-ajan-icon-btn { background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22); color: #fff; width: 30px; height: 30px; border-radius: 999px; cursor: pointer; font-size: 13px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; }
    .evdis-ajan-icon-btn:hover { background: rgba(45, 212, 191, 0.28); border-color: #2DD4BF; }
    .evdis-sekmeler { display: flex; gap: 6px; padding: 9px 12px; background: linear-gradient(180deg, rgba(237, 232, 221, 0.85), rgba(244, 240, 231, 0.7)); border-bottom: 1px solid rgba(42, 92, 77, 0.1); flex-shrink: 0; }
    .evdis-sekme { flex: 1; background: transparent; border: 1px solid transparent; border-radius: 11px; padding: 8px 6px; font-size: 12.5px; font-weight: 700; color: #4A5852; cursor: pointer; transition: background .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease; }
    .evdis-sekme:hover { color: #16392D; background: rgba(255, 255, 255, 0.5); }
    .evdis-sekme.aktif { background: #FFFFFF; border-color: rgba(212, 175, 55, 0.4); color: #13372C; box-shadow: 0 4px 12px -4px rgba(16, 57, 45, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.9); }
    .evdis-sekme-govde { flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 14px 14px 10px; display: none; flex-direction: column; gap: 11px; }
    .evdis-sekme-govde.aktif { display: flex; }
    .evdis-ajan-msg { padding: 12px 14px; border-radius: 15px; font-size: 14px; line-height: 1.55; white-space: pre-line; word-break: break-word; }
    .evdis-ajan-msg.bot { background: #FFFFFF; color: #1E2824; border: 1px solid #E2DDD2; box-shadow: 0 4px 14px rgba(34, 41, 38, 0.04); }
    .evdis-ajan-msg.bot.acil { border: 1.5px solid #DC2626; background: #FFF7F7; }
    .evdis-ajan-msg.user { background: #1E463A; color: #F8F6F1; align-self: flex-end; max-width: 86%; font-weight: 550; padding: 9px 13px; }
    #evdis-ajan-root[dir="rtl"] .evdis-ajan-msg.user { align-self: flex-start; }
    .evdis-kart-ust { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 7px; }
    .evdis-ajan-badge { display: inline-block; font-family: var(--evdis-mono); font-size: 9px; font-weight: 500; letter-spacing: .05em; text-transform: uppercase; color: #1E4438; background: rgba(42, 92, 77, 0.09); border: 1px solid rgba(42, 92, 77, 0.14); padding: 4px 9px; border-radius: 7px; max-width: 72%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .evdis-seviye { display: inline-flex; gap: 7px; align-items: center; font-family: var(--evdis-mono); font-size: 9.5px; font-weight: 600; letter-spacing: .06em; color: #8A6D12; }
    .evdis-seviye-iz { position: relative; display: inline-flex; align-items: center; gap: 0; }
    .evdis-seviye-iz::before { content: ""; position: absolute; left: 3px; right: 3px; top: 50%; height: 1.5px; transform: translateY(-50%); background: linear-gradient(90deg, rgba(212, 175, 55, 0.4), rgba(45, 212, 191, 0.4)); border-radius: 2px; }
    .evdis-seviye i { position: relative; z-index: 1; width: 8px; height: 8px; border-radius: 50%; background: #ECE4CF; box-shadow: inset 0 0 0 1px rgba(138, 109, 18, 0.25); display: inline-block; margin: 0 2px; transition: transform .25s ease, box-shadow .25s ease; }
    .evdis-seviye i.dolu { background: linear-gradient(135deg, var(--evdis-altin), var(--evdis-teal)); box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.14), 0 2px 6px rgba(212, 175, 55, 0.3); transform: scale(1.12); }
    .evdis-kisa { font-size: 14.5px; line-height: 1.55; }
    .evdis-kart-eylem { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
    .evdis-eylem-btn { background: linear-gradient(135deg, #15372C, #2A5C4D); color: #F8F6F1; border: none; border-radius: 10px; padding: 8px 12px; font-size: 12.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 12px -5px rgba(16, 57, 45, 0.5); transition: transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s ease, filter .18s ease; }
    .evdis-eylem-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -7px rgba(16, 57, 45, 0.55); filter: brightness(1.06); }
    .evdis-eylem-btn:active { transform: translateY(0); }
    .evdis-eylem-btn.ikincil { background: rgba(248, 246, 241, 0.8); color: #1E4438; border: 1px solid rgba(42, 92, 77, 0.2); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7); }
    .evdis-eylem-btn.ses-aktif { background: linear-gradient(135deg, var(--evdis-altin), #E6C35A); color: #1B1405; border-color: var(--evdis-bronz); }
    .evdis-ayrinti { display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #DCD5C6; font-size: 13px; line-height: 1.55; color: #33413B; max-height: 260px; overflow-y: auto; }
    .evdis-ayrinti.acik { display: block; }
    .evdis-ajan-chips-wrap { display: flex; flex-direction: column; gap: 9px; background: linear-gradient(180deg, rgba(241, 237, 228, 0.7), rgba(246, 243, 236, 0.55)); border: 1px solid rgba(42, 92, 77, 0.12); border-radius: 16px; padding: 11px 12px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6); }
    .evdis-ajan-chips-hint { font-family: var(--evdis-mono); font-size: 9.5px; font-weight: 500; letter-spacing: .05em; text-transform: uppercase; color: var(--evdis-adacayi); line-height: 1.45; }
    .evdis-ajan-chips { display: flex; flex-direction: column; gap: 7px; }
    .evdis-ajan-chip { position: relative; display: flex; align-items: center; gap: 11px; background: linear-gradient(180deg, #FFFFFF, #FBF9F3); color: #16392D; border: 1px solid rgba(42, 92, 77, 0.16); border-radius: 13px; padding: 11px 13px; font-size: 13px; font-weight: 600; text-align: start; line-height: 1.38; cursor: pointer; width: 100%; box-shadow: 0 1px 2px rgba(11, 29, 23, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9); transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease, border-color .2s ease, background .2s ease; }
    .evdis-chip-idx { flex-shrink: 0; width: 24px; height: 24px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-family: var(--evdis-mono); font-size: 10.5px; font-weight: 600; letter-spacing: .02em; color: var(--evdis-adacayi); background: rgba(42, 92, 77, 0.08); border: 1px solid rgba(42, 92, 77, 0.14); transition: color .2s ease, background .2s ease, border-color .2s ease; }
    .evdis-chip-label { flex: 1; min-width: 0; }
    .evdis-chip-arrow { flex-shrink: 0; font-size: 14px; line-height: 1; color: #9AA8A1; transform: translateX(-2px); opacity: .55; transition: transform .2s cubic-bezier(.22,1,.36,1), opacity .2s ease, color .2s ease; }
    #evdis-ajan-root[dir="rtl"] .evdis-chip-arrow { transform: scaleX(-1) translateX(-2px); }
    .evdis-ajan-chip:hover { transform: translateY(-2px); background: linear-gradient(180deg, #FFFFFF, #F1F7F3); border-color: var(--evdis-adacayi); box-shadow: 0 10px 22px -10px rgba(16, 57, 45, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9); }
    .evdis-ajan-chip:hover .evdis-chip-idx { color: #FFFFFF; background: linear-gradient(135deg, var(--evdis-adacayi), var(--evdis-teal)); border-color: transparent; }
    .evdis-ajan-chip:hover .evdis-chip-arrow { transform: translateX(1px); opacity: 1; color: var(--evdis-adacayi); }
    #evdis-ajan-root[dir="rtl"] .evdis-ajan-chip:hover .evdis-chip-arrow { transform: scaleX(-1) translateX(1px); }
    .evdis-ajan-chip:active { transform: translateY(0); }
    .evdis-ajan-chip:focus-visible { outline: 2px solid var(--evdis-teal); outline-offset: 2px; }
    .evdis-kapi-izgara { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .evdis-kapi { background: linear-gradient(180deg, #FFFFFF, #FBF9F3); border: 1px solid rgba(42, 92, 77, 0.16); border-radius: 14px; padding: 11px 11px; font-size: 13px; font-weight: 700; color: #13372C; cursor: pointer; text-align: start; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9); transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease, border-color .2s ease; }
    .evdis-kapi:hover { transform: translateY(-2px); border-color: var(--evdis-altin); box-shadow: 0 12px 24px -12px rgba(138, 109, 18, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.9); }
    .evdis-kapi:focus-visible { outline: 2px solid var(--evdis-altin); outline-offset: 2px; }
    .evdis-ajan-foot { padding: 9px 12px 11px; background: #FFFFFF; border-top: 1px solid #E4DFD4; flex-shrink: 0; }
    .evdis-nav-bar { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
    .evdis-nav-btn { flex: 1; background: #F1EDE4; color: #13372C; border: 1px solid #CFC6B5; border-radius: 9px; padding: 7px 9px; font-size: 12px; font-weight: 700; cursor: pointer; text-align: center; white-space: nowrap; transition: background .15s ease, border-color .15s ease; }
    .evdis-nav-btn:hover:not(:disabled) { background: #E6F0EC; border-color: #2A5C4D; }
    .evdis-nav-btn:disabled { opacity: 0.42; cursor: default; }
    .evdis-nav-btn.ses-acik { background: #13372C; color: #F8F6F1; border-color: #2DD4BF; }
    .evdis-no-typing { font-size: 10.5px; color: #2A5C4D; background: #EDF5F1; border: 1px solid #CFE3DA; border-radius: 8px; padding: 5px 8px; margin-top: 6px; line-height: 1.35; font-weight: 600; }
    .evdis-ajan-legal { font-size: 10px; color: #5C6762; margin-top: 5px; line-height: 1.32; }
    .evdis-rota-kart { display: flex; gap: 11px; align-items: flex-start; background: #FFFFFF; border: 1px solid #DDD5C6; border-radius: 14px; padding: 11px 12px; cursor: pointer; text-align: start; width: 100%; font: inherit; color: inherit; }
    .evdis-rota-kart:hover { border-color: #2DD4BF; box-shadow: 0 6px 18px rgba(45, 212, 191, 0.14); }
    .evdis-rota-kart.vurgu { background: linear-gradient(135deg, #0F2921, #1E463A); color: #F8F6F1; border-color: #D4AF37; }
    .evdis-rota-ikon { font-size: 22px; line-height: 1; }
    .evdis-rota-ad { font-size: 13.5px; font-weight: 800; }
    .evdis-rota-ozet { font-size: 12px; opacity: .85; margin-top: 2px; line-height: 1.4; }
    .evdis-rota-sayi { font-size: 10.5px; font-weight: 800; color: #8A6D12; margin-top: 4px; }
    .evdis-rota-kart.vurgu .evdis-rota-sayi { color: #FDE68A; }
    .evdis-ara { width: 100%; box-sizing: border-box; border: 1px solid #CFC9BC; border-radius: 11px; padding: 10px 12px; font-size: 14px; background: #FFFFFF; }
    .evdis-konu-grup h5 { margin: 4px 0 6px; font-size: 11.5px; letter-spacing: .04em; text-transform: uppercase; color: #6B5A1E; }
    .evdis-konu-etiketler { display: flex; flex-wrap: wrap; gap: 6px; }
    .evdis-konu { background: #FFFFFF; border: 1px solid #D5CDBD; border-radius: 10px; padding: 6px 10px; cursor: pointer; text-align: start; font: inherit; color: #13372C; }
    .evdis-konu b { display: block; font-size: 12.5px; }
    .evdis-konu span { display: block; font-size: 10.5px; color: #5C6762; margin-top: 1px; }
    .evdis-konu:hover { border-color: #D4AF37; background: #FFFBEB; }
    .klinik-konu-blok { transition: background-color .3s ease, padding .3s ease, border-radius .3s ease; }
    .klinik-konu-blok.evdis-maya-spotlight { background: rgba(254, 249, 235, 0.94); padding: 12px 16px; border-radius: 14px; }
    .evdis-maya-spotlight { outline: 3px solid #D4AF37 !important; outline-offset: 6px !important; border-radius: 14px; animation: evdisMayaNabiz 1.8s ease-in-out infinite; }
    @keyframes evdisMayaNabiz { 0%, 100% { box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.28), 0 0 26px rgba(212, 175, 55, 0.35); } 50% { box-shadow: 0 0 0 10px rgba(45, 212, 191, 0.12), 0 0 54px rgba(212, 175, 55, 0.55); } }
    #evdis-tour-dock { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 100000; width: min(560px, calc(100vw - 24px)); background: rgba(11, 23, 20, 0.95); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1.5px solid #D4AF37; border-radius: 16px; padding: 11px 14px; color: #F8FAFC; box-shadow: 0 22px 56px rgba(0, 0, 0, 0.5), 0 0 26px rgba(45, 212, 191, 0.22); display: none; font-family: 'Archivo', -apple-system, sans-serif; }
    #evdis-tour-dock.open { display: block; }
    .evdis-tour-tag { font-size: 10.5px; font-weight: 800; color: #2DD4BF; letter-spacing: .04em; text-transform: uppercase; }
    .evdis-tour-title { font-size: 14px; font-weight: 700; color: #FFFFFF; margin: 2px 0 3px; }
    .evdis-tour-desc { font-size: 12.8px; line-height: 1.45; color: #E2E8F0; margin: 0 0 9px; }
    .evdis-tour-controls { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
    .evdis-tour-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.22); color: #F8FAFC; border-radius: 9px; padding: 6px 11px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .evdis-tour-btn:disabled { opacity: .4; cursor: default; }
    .evdis-tour-btn.pri { background: linear-gradient(135deg, #0F766E, #B8860B); border-color: #D4AF37; color: #fff; }
    #evdis-emrah-bar { background: linear-gradient(90deg, #1E463A 0%, #2A5C4D 100%); color: #F8F6F1; padding: 9px 18px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.18); font-family: 'Archivo', -apple-system, sans-serif; }
    .evdis-emrah-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
    .evdis-emrah-btn { background: #F8F6F1; color: #1E463A; border: none; border-radius: 999px; padding: 6px 13px; font-size: 12px; font-weight: 700; cursor: pointer; }
    #evdis-emrah-drawer { display: none; max-width: 1200px; margin: 10px auto 4px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.22); border-radius: 12px; padding: 12px 14px; }
    #evdis-emrah-drawer.open { display: block; }
    /* EKRAN-DENETIM-1017 · sabit başlık (.av-header, top:0) yeşil şeridin altından başlar; şerit kayınca tepeye yapışır */
    body.has-evdis-topbar .av-header { top: var(--evdis-topbar-ofset, 0px) !important; }
    /* EKRAN-DENETIM-1017 · rehber düğmesi alt boşluğu JS'ten (--evdis-fab-alt): ilk ekranda metne, tablette alt çubuğa binmesin */
    #evdis-ajan-root { bottom: var(--evdis-fab-alt, 18px); transition: bottom .28s ease; }
    .evdis-emrah-row { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .evdis-emrah-inp { flex: 1; min-width: 220px; padding: 8px 12px; border-radius: 8px; border: none; font-size: 13px; color: #1F2D28; }
    .evdis-ekip-tabs { display: flex; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px; flex-wrap: wrap; }
    .evdis-ekip-tab { background: rgba(255,255,255,0.12); color: #E2E8F0; border: 1px solid rgba(255,255,255,0.24); border-radius: 999px; padding: 5px 13px; font-size: 12.5px; font-weight: 700; cursor: pointer; }
    .evdis-ekip-tab.active { background: #F59E0B; color: #111827; border-color: #FBBF24; }
    .evdis-ekip-select { padding: 8px 10px; border-radius: 8px; border: none; font-size: 12.5px; font-weight: 600; color: #1F2D28; background: #F8FAFC; }
    .evdis-ekip-log { margin-top: 8px; font-size: 12px; color: #D1FAE5; max-height: 90px; overflow-y: auto; }
    @media (max-width: 768px) {
      .evdis-emrah-desc-text { display: none; }
      .evdis-mobile-bar-toggle { display: inline-flex !important; }
      #evdis-emrah-bar:not(.mobile-open) .evdis-emrah-actions { display: none !important; }
      .evdis-ajan-fab-sub { display: none; }
      /* EKRAN-DENETIM-1017 · kompakt yuvarlak rehber düğmesi: metni kapatmasın (46×46, sağ 10px, alt 78px;
         ilk ekranda altı doluysa JS --evdis-fab-alt ile boş yere çıkarır). Sayfa içi !important kuralları da ezilir. */
      #evdis-ajan-root #evdis-ajan-fab { box-sizing: border-box !important; width: 46px !important; height: 46px !important; padding: 0 !important; gap: 0 !important; border-radius: 50% !important; justify-content: center; }
      #evdis-ajan-root #evdis-ajan-fab .evdis-ajan-fab-text { display: none !important; }
      .evdis-maya-orb { width: 40px; height: 40px; }
      #evdis-ajan-root { right: 10px; bottom: var(--evdis-fab-alt, 78px); transition: bottom .28s ease; }
      #evdis-ajan-root[dir="rtl"] { right: auto; left: 10px; }
      #evdis-tour-dock { bottom: 82px; }
      .evdis-kapi-izgara { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);

  // ---------------------------------------------------------------------------
  // YARDIMCILAR — güvenli biçimlendirme, URL kurma, sayfa tespiti
  // ---------------------------------------------------------------------------
  function kacis(metin) {
    var div = document.createElement("div");
    div.textContent = String(metin || "").replace(/Ev\s+Diş/g, "Evdiş").replace(/EV\s+DİŞ/g, "EVDİŞ");
    return div.innerHTML;
  }
  function guvenliBicimlendir(metin) {
    return kacis(metin).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "$1");
  }
  var EV_SAYFASI = { tr: "index.html", en: "en.html", ar: "ar.html" };
  function mevcutDosya() {
    var d = decodeURIComponent((window.location.pathname.split("/").pop() || "").toLowerCase());
    return d || "index.html";
  }
  function sayfaCoz(sayfa) {
    if (!sayfa || sayfa === "HOME") return EV_SAYFASI[aktifDil] || "index.html";
    return sayfa;
  }
  function ekipDegeri() {
    var e = (urlParams.get("ekip") || oturumOku("evdis_ekip") || "").toLowerCase();
    return /^(gokhan|seyit|emrah|uzel|ozan)$/.test(e) ? e : "";
  }
  function sayfaUrl(sayfa, ekler) {
    var dosya = sayfaCoz(sayfa);
    var q = new URLSearchParams();
    if (aktifDil !== "tr" && dosya !== "en.html" && dosya !== "ar.html") q.set("lang", aktifDil);
    var e = ekipDegeri();
    if (e) q.set("ekip", e);
    Object.keys(ekler || {}).forEach(function (key) { if (ekler[key] !== undefined && ekler[key] !== null && ekler[key] !== "") q.set(key, ekler[key]); });
    var qs = q.toString();
    return dosya + (qs ? "?" + qs : "");
  }
  function ayniSayfaMi(sayfa) {
    var hedef = sayfaCoz(sayfa).toLowerCase();
    var simdi = mevcutDosya();
    if (hedef === simdi) return true;
    return (hedef === "index.html" && (simdi === "tr.html")) || (hedef === "tr.html" && simdi === "index.html");
  }

  // ---------------------------------------------------------------------------
  // MAYA SPOT IŞIĞI + glideToElement (yumuşak kaydırma)
  // ---------------------------------------------------------------------------
  var sonSpotEl = null;
  var spotZamanlayici = null;
  function spotlightTemizle() {
    if (spotZamanlayici) { clearTimeout(spotZamanlayici); spotZamanlayici = null; }
    if (sonSpotEl) { sonSpotEl.classList.remove("evdis-maya-spotlight"); sonSpotEl = null; }
  }
  function spotlightUygula(el, sureMs) {
    spotlightTemizle();
    if (!el) return;
    sonSpotEl = el;
    el.classList.add("evdis-maya-spotlight");
    if (sureMs) spotZamanlayici = setTimeout(spotlightTemizle, sureMs);
  }
  function hedefBul(seciciler) {
    var liste = Array.isArray(seciciler) ? seciciler : [seciciler];
    for (var i = 0; i < liste.length; i++) {
      var s = liste[i];
      if (!s) continue;
      var el = null;
      var m = /^@(h1|h2|h3):(\d+)$/.exec(s);
      try {
        if (m) {
          el = document.querySelectorAll("main " + m[1])[parseInt(m[2], 10)] || null;
        } else {
          el = document.querySelector(s.charAt(0) === "#" || /[.\[\s>:]/.test(s) || /^(main|header|footer|section|h1|h2|h3)$/.test(s) ? s : "#" + s);
        }
      } catch (_) { el = null; }
      if (!el || el.closest("#evdis-ajan-root, #evdis-tour-dock, #evdis-emrah-bar")) continue;
      if (el.tagName === "MAIN" || el.getBoundingClientRect().height > window.innerHeight * 1.6) {
        var ic = el.querySelector("h1, h2");
        if (ic) el = ic;
      }
      return el;
    }
    return null;
  }
  function glideToElement(el, bitince) {
    if (!el) { if (bitince) bitince(false); return; }
    var rect = el.getBoundingClientRect();
    var yukseklik = Math.min(rect.height, window.innerHeight * 0.6);
    var hedefY = window.pageYOffset + rect.top - Math.max(90, (window.innerHeight - yukseklik) / 2);
    var maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    hedefY = Math.max(0, Math.min(hedefY, maxY));
    var baslangic = window.pageYOffset;
    var fark = hedefY - baslangic;
    var bitti = false;
    var kokStil = document.documentElement.style;
    var eskiDavranis = kokStil.scrollBehavior;
    kokStil.scrollBehavior = "auto"; // site.css'teki smooth davranışı kare kare kaydırmayla çakışmasın
    function son() {
      if (bitti) return;
      bitti = true;
      window.scrollTo(0, hedefY);
      kokStil.scrollBehavior = eskiDavranis;
      if (bitince) bitince(true);
    }
    if (Math.abs(fark) < 4) { son(); return; }
    var sure = Math.min(1100, Math.max(450, Math.abs(fark) * 0.45));
    var t0 = null;
    function adim(ts) {
      if (bitti) return;
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / sure);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo(0, baslangic + fark * e);
      if (p < 1) requestAnimationFrame(adim);
      else son();
    }
    requestAnimationFrame(adim);
    setTimeout(son, sure + 250); // arka plan sekmesinde rAF durursa da hedefe varılır
  }
  window.evdisGlideToElement = glideToElement;

  function sayfadaIncele(sayfa, bolum) {
    if (ayniSayfaMi(sayfa)) {
      var el = hedefBul([bolum, "main h1", "main"]);
      if (!el) return;
      if (window.innerWidth < 900) ajanKapat();
      spotlightUygula(el, 6500);
      glideToElement(el);
      return;
    }
    window.location.href = sayfaUrl(sayfa, { evdis_odak: String(bolum || "").replace(/^#/, "") || "icerik" });
  }

  // ---------------------------------------------------------------------------
  // ÜST GERİ BİLDİRİM BARI — Dr. Dt. Seyit Yılmaz (Başhekim) · Ozan Aydınlar (Genel Müdür) · Dt. Emrah Özdemir · Mustafa Gökhan Bulut (İşletme Direktörü) · Dr. Dt. Gökhan Uzel
  // ---------------------------------------------------------------------------
  var EKIP = {
    seyit: {
      tab: "👨‍⚕️ Dr. Dt. Seyit Yılmaz (Başhekim)", kim: "Dr. Dt. Seyit Yılmaz (Başhekim)",
      desc: "<strong>👨‍⚕️ Dr. Dt. Seyit Yılmaz — Başhekim · Ağız, Diş ve Çene Cerrahisi:</strong> Hocam, klinik içerik, hekim/branş eşleşmeleri, rehberin verdiği yanıtlar veya sayfa düzeni hakkındaki görüşlerinizi buradan doğrudan iletebilirsiniz:",
      ph: "Örn: İmplant sayfasında şu protokol de anlatılsın / Rehber şu soruya şöyle yanıt versin…"
    },
    ozan: {
      tab: "👔 Ozan Aydınlar (Genel Müdür)", kim: "Ozan Aydınlar (Genel Müdür)",
      desc: "<strong>👔 Ozan Aydınlar — Genel Müdür:</strong> Ozan Bey, kurumsal organizasyon şemamız, şube işleyişi, hasta deneyimi, Aventura esinli Zirkon/E-max tasarımımız veya sitede görmek istediğiniz tüm idari ve stratejik detayları buradan doğrudan iletebilirsiniz:",
      ph: "Örn: Kurumsal organizasyon şemasında / şube bilgilerinde / tasarım önerilerinde şu nokta da yer alsın…"
    },
    emrah: {
      tab: "💡 Dt. Emrah Özdemir", kim: "Dt. Emrah Özdemir",
      desc: "<strong>💡 Dt. Emrah Özdemir — Kurucu Ortak & Klinik Ufuk:</strong> Kliniğimizin fark yaratan uygulamaları, hasta deneyimi veya sitede görmek istediğiniz detayları buraya yazabilirsiniz:",
      ph: "Örn: Kliniğimizde şu uygulamayı da rehber mutlaka bilsin…"
    },
    gokhan: {
      tab: "📦 Mustafa Gökhan Bulut (İşletme Direktörü)", kim: "Mustafa Gökhan Bulut (İşletme Direktörü)",
      desc: "<strong>📦 Mustafa Gökhan Bulut — İşletme Direktörü:</strong> Cihaz/teknoloji adları (Mikroskop, Yapay Zekâ Radyoloji, Ameliyathane, CEREC), şube operasyonları, kurumsal metinler veya tasarım notlarınızı buradan iletebilirsiniz:",
      ph: "Örn: Serdivan şubemizdeki şu cihaz/operasyon detayı da eklensin…"
    },
    uzel: {
      tab: "🦷 Dr. Dt. Gökhan Uzel", kim: "Dr. Dt. Gökhan Uzel (Protetik Uzmanı)",
      desc: "<strong>🦷 Dr. Dt. Gökhan Uzel — Protetik Diş Tedavisi:</strong> Protetik/implant sayfaları, hekim branş eşleşmeleri veya yayınlanmasını istediğiniz uzman blog yazılarını buradan iletebilirsiniz:",
      ph: "Örn: Protetik sekmesinde şu detay yer alsın / Blog için şu konuyu ekleyelim…"
    }
  };
  var ekipParam = (urlParams.get("ekip") || "").toLowerCase();
  var hashParam = (window.location.hash || "").toLowerCase().replace("#", "");
  var defaultReviewer = "emrah";
  var ekipAcikBaslasin = false;
  ["seyit", "ozan", "gokhan", "uzel", "emrah"].forEach(function (anahtar) {
    if (!ekipAcikBaslasin && (ekipParam.indexOf(anahtar) !== -1 || hashParam === anahtar)) {
      defaultReviewer = anahtar;
      ekipAcikBaslasin = true;
    }
  });
  if (ekipAcikBaslasin) oturumYaz("evdis_ekip", defaultReviewer);

  var topBar = document.createElement("div");
  topBar.id = "evdis-emrah-bar";
  topBar.setAttribute("dir", "ltr");
  topBar.innerHTML = `
    <div class="evdis-emrah-inner">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:8px;flex-wrap:wrap;">
        <div>
          <strong id="evdis-bar-baslik">🛠️ Klinik Önizleme &amp; Dijital Rehber:</strong>
          <span class="evdis-emrah-desc-text" id="evdis-bar-metin">Yeni <strong>Evdiş</strong> sitemiz ve <strong>Maya Standardı Dijital Hasta Rehberi</strong> (Rehber · Rotalar · Konular, TR | EN | AR) aktif. Rotaları deneyebilir veya ekip görüşü bırakabilirsiniz.</span>
        </div>
        <button type="button" class="evdis-emrah-btn evdis-mobile-bar-toggle" id="evdis-mobile-bar-toggle" style="display:none;background:rgba(255,255,255,0.18);color:#fff;border:1px solid rgba(255,255,255,0.3);padding:4px 10px;font-size:11.5px;">Ekip Araçları ▾</button>
      </div>
      <div class="evdis-emrah-actions" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <a href="${sayfaUrl("tasarim-onerileri.html")}" class="evdis-emrah-btn" style="background:linear-gradient(135deg,#F6F4EE,#E2D0B0);color:#1E2422;border:1px solid #B07A3C;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,0.18);">🎨 Yeni Tasarım (Aventura &amp; Zirkon/E-max)</a>
        <a href="${sayfaUrl("tasarim-ve-ekip-raporu.html")}" class="evdis-emrah-btn" data-ekran-denetim-1017="rapor" style="background:#1F2937;color:#F8F6F1;border:1px solid #D4AF37;text-decoration:none;">📋 Tasarım &amp; Karar Raporu</a>
        <a href="${sayfaUrl("kurumsal.html#organizasyon-semasi")}" class="evdis-emrah-btn" style="background:#ECFDF5;color:#065F46;border:1px solid #34D399;text-decoration:none;">🏛️ Organizasyon Şeması</a>
        <button type="button" class="evdis-emrah-btn" id="evdis-open-tour-top" style="background:#2DD4BF;color:#0F172A;">🧭 Klinik Rotalar</button>
        <button type="button" class="evdis-emrah-btn" data-ekip-ac="seyit" style="background:#FDE68A;color:#713F12;">👨‍⚕️ Seyit Yılmaz (Başhekim)</button>
        <button type="button" class="evdis-emrah-btn" data-ekip-ac="ozan" style="background:#E0E7FF;color:#1E1B4B;">👔 Ozan Aydınlar (GM)</button>
        <button type="button" class="evdis-emrah-btn" data-ekip-ac="emrah">💡 Dt. Emrah Özdemir</button>
        <button type="button" class="evdis-emrah-btn" data-ekip-ac="gokhan" style="background:#FEF3C7;color:#92400E;">📦 Mustafa Gökhan Bulut (İşletme Dir.)</button>
        <button type="button" class="evdis-emrah-btn" data-ekip-ac="uzel" style="background:#DBEAFE;color:#1E3A8A;">🦷 Dr. Gökhan Uzel</button>
        <a href="${sayfaUrl("gokhan-eksik-listesi.html")}" class="evdis-emrah-btn" style="background:#FDE68A;color:#78350F;text-decoration:none;">📋 Eksik &amp; Blog Listesi</a>
        <button type="button" class="evdis-emrah-btn" id="evdis-open-ajan-top">💬 Dijital Rehber</button>
      </div>
    </div>
    <div id="evdis-emrah-drawer">
      <div class="evdis-ekip-tabs">
        <button type="button" class="evdis-ekip-tab" data-tab="seyit" id="seyit">${EKIP.seyit.tab}</button>
        <button type="button" class="evdis-ekip-tab" data-tab="ozan" id="ozan">${EKIP.ozan.tab}</button>
        <button type="button" class="evdis-ekip-tab" data-tab="emrah">${EKIP.emrah.tab}</button>
        <button type="button" class="evdis-ekip-tab" data-tab="gokhan">${EKIP.gokhan.tab}</button>
        <button type="button" class="evdis-ekip-tab" data-tab="uzel">${EKIP.uzel.tab}</button>
      </div>
      <div id="evdis-ekip-desc" style="font-size:12.5px;line-height:1.45;"></div>
      <form class="evdis-emrah-row" id="evdis-emrah-form">
        <select class="evdis-ekip-select" id="evdis-ekip-kategori">
          <option value="Tasarım Önerileri (Aventura & Zirkon/E-max)">Tasarım Önerileri (Aventura &amp; Zirkon/E-max)</option>
          <option value="Kurumsal Organizasyon Şeması & Yönetim">Kurumsal Organizasyon Şeması &amp; Yönetim</option>
          <option value="Şube / Kurumsal Yönetim & İdari Detay">Şube / Kurumsal Yönetim &amp; İdari Detay</option>
          <option value="Klinik İçerik & Tıbbi Doğruluk">Klinik İçerik &amp; Tıbbi Doğruluk</option>
          <option value="Dijital Rehber Ajan Yanıtı">Dijital Rehber Ajan Yanıtı</option>
          <option value="Rotalar & Konular Gezintisi">Rotalar &amp; Konular Gezintisi</option>
          <option value="Branş / Hekim Sekmesi & Site İncelemesi">Branş / Hekim Sekmesi &amp; Site İncelemesi</option>
          <option value="Uzman Hekim Blog Yazısı / Makale">Uzman Hekim Blog Yazısı / Makale</option>
          <option value="Donanım / Cihaz & Teknoloji Bilgisi">Donanım / Cihaz &amp; Teknoloji Bilgisi</option>
          <option value="Çok Dilli (EN / AR) Metinler">Çok Dilli (EN / AR) Metinler</option>
        </select>
        <input type="text" class="evdis-emrah-inp" id="evdis-emrah-inp" placeholder="" />
        <button type="submit" class="evdis-emrah-btn" id="evdis-ekip-submit">Kaydet &amp; İlet</button>
      </form>
      <div id="evdis-emrah-status" style="font-size:12px;margin-top:6px;color:#A7F3D0;display:none;"></div>
      <div id="evdis-ekip-log" class="evdis-ekip-log"></div>
    </div>
  `;
  document.body.insertBefore(topBar, document.body.firstChild);
  // EKRAN-DENETIM-1017 · şerit akışta kalır; sabit başlık (.av-header) şeridin alt kenarından başlar (kaydırınca 0'a iner).
  document.body.classList.add("has-evdis-topbar");
  if (document.querySelector(".av-header")) {
    var seritKare = 0;
    var seritHizala = function () {
      seritKare = 0;
      var alt = Math.max(0, Math.round(topBar.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty("--evdis-topbar-ofset", alt + "px");
    };
    var seritHizalaIste = function () { if (!seritKare) seritKare = window.requestAnimationFrame(seritHizala); };
    seritHizala();
    window.addEventListener("scroll", seritHizalaIste, { passive: true });
    window.addEventListener("resize", seritHizalaIste);
    window.addEventListener("load", seritHizala);
    if (window.ResizeObserver) new ResizeObserver(seritHizalaIste).observe(topBar);
  }
  var mobToggleBtn = topBar.querySelector("#evdis-mobile-bar-toggle");
  mobToggleBtn.addEventListener("click", function () {
    var open = topBar.classList.toggle("mobile-open");
    mobToggleBtn.textContent = open ? "Gizle ▴" : "Ekip Araçları ▾";
  });

  var aktifEkipSecimi = defaultReviewer;
  function ekipSekmesiGuncelle(secim) {
    if (!EKIP[secim]) secim = "emrah";
    aktifEkipSecimi = secim;
    topBar.querySelectorAll(".evdis-ekip-tab").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-tab") === secim); });
    topBar.querySelector("#evdis-ekip-desc").innerHTML = EKIP[secim].desc;
    topBar.querySelector("#evdis-emrah-inp").placeholder = EKIP[secim].ph;
    if (secim === "seyit") {
      topBar.querySelector("#evdis-bar-baslik").textContent = "👨‍⚕️ Hoş geldiniz Dr. Dt. Seyit Yılmaz (Başhekim) —";
      topBar.querySelector("#evdis-bar-metin").innerHTML = "Başhekim inceleme modu açık. Rehberi, rotaları ve sayfaları gezip görüşlerinizi aşağıdaki kutudan doğrudan iletebilirsiniz.";
    } else if (secim === "ozan") {
      topBar.querySelector("#evdis-bar-baslik").textContent = "👔 Hoş geldiniz Ozan Aydınlar (Genel Müdür) —";
      topBar.querySelector("#evdis-bar-metin").innerHTML = "Genel Müdür inceleme ve geri bildirim modu açık. <strong>🎨 Aventura &amp; Zirkon/E-max Tasarım Önerisi</strong>'ni ve <strong>🏛️ TRtek Tam Organizasyon Şeması</strong>'nı inceleyip görüşlerinizi doğrudan iletebilirsiniz.";
    } else if (secim === "gokhan") {
      topBar.querySelector("#evdis-bar-baslik").textContent = "📦 Hoş geldiniz Mustafa Gökhan Bulut (İşletme Direktörü) —";
      topBar.querySelector("#evdis-bar-metin").innerHTML = "İşletme Direktörü inceleme ve geri bildirim modu açık. Şube operasyonları, teknoloji altyapısı ve kurumsal şema hakkındaki notlarınızı iletebilirsiniz.";
    }
  }
  ekipSekmesiGuncelle(defaultReviewer);
  if (ekipAcikBaslasin) topBar.querySelector("#evdis-emrah-drawer").classList.add("open");

  topBar.querySelectorAll(".evdis-ekip-tab").forEach(function (b) {
    b.addEventListener("click", function () { ekipSekmesiGuncelle(b.getAttribute("data-tab")); });
  });
  topBar.querySelectorAll("[data-ekip-ac]").forEach(function (b) {
    b.addEventListener("click", function () {
      var secim = b.getAttribute("data-ekip-ac");
      var dr = topBar.querySelector("#evdis-emrah-drawer");
      if (dr.classList.contains("open") && aktifEkipSecimi === secim) { dr.classList.remove("open"); return; }
      ekipSekmesiGuncelle(secim);
      dr.classList.add("open");
      topBar.querySelector("#evdis-emrah-inp").focus();
    });
  });
  topBar.querySelector("#evdis-emrah-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var inp = topBar.querySelector("#evdis-emrah-inp");
    var katEl = topBar.querySelector("#evdis-ekip-kategori");
    var st = topBar.querySelector("#evdis-emrah-status");
    var logEl = topBar.querySelector("#evdis-ekip-log");
    var val = (inp.value || "").trim();
    if (!val) return;
    var kimAdi = EKIP[aktifEkipSecimi].kim;
    var kat = katEl ? katEl.value : "Genel Görüş";
    var bodyStr = JSON.stringify({ kim: kimAdi, kategori: kat, not: kvkkTarayiciMaskele(val).temizMetin, sayfa: window.location.pathname + " [" + aktifDil.toUpperCase() + "]" });
    var gorusUclar = [API_BASE + "/api/ekip-gorus"];
    if (gorusUclar.indexOf(PUBLIC_API_TUNNEL + "/api/ekip-gorus") === -1) gorusUclar.push(PUBLIC_API_TUNNEL + "/api/ekip-gorus");
    gorusUclar.forEach(function (u) {
      fetch(u, { method: "POST", headers: { "Content-Type": "application/json" }, body: bodyStr }).catch(function () {});
    });
    inp.value = "";
    st.style.display = "block";
    st.textContent = "✓ " + kimAdi + " notunuz (" + kat + ") kaydedildi ve ekibe iletildi.";
    var item = document.createElement("div");
    item.textContent = "• [" + kimAdi + " · " + kat + " · " + window.location.pathname + "] " + val;
    logEl.prepend(item);
  });

  // ---------------------------------------------------------------------------
  // ANA PANEL (başlık + TR | EN | AR + 3 sekme + YAZMA ENGELLİ SEÇMELİ ALT ÇUBUK) VE ROTA BARI
  // ---------------------------------------------------------------------------
  var root = document.createElement("div");
  root.id = "evdis-ajan-root";
  root.innerHTML = `
    <div class="evdis-ajan-panel" id="evdis-ajan-panel" role="dialog">
      <div class="evdis-ajan-head">
        <div class="evdis-head-left">
          <div class="evdis-head-avatar" id="evdis-head-avatar"><img src="images/evdis-maya-avatar.jpg" alt="" onerror="this.style.display='none'" /></div>
          <div style="min-width:0;"><h4 data-ui="headerTitle"></h4><small data-ui="headerSub"></small></div>
        </div>
        <div class="evdis-ajan-head-actions">
          <div class="evdis-dil-secici" role="group" aria-label="TR | EN | AR">
            <button type="button" data-dil="tr">TR</button><button type="button" data-dil="en">EN</button><button type="button" data-dil="ar">AR</button>
          </div>
          <button type="button" class="evdis-ajan-icon-btn" id="evdis-ajan-reset">↺</button>
          <button type="button" class="evdis-ajan-icon-btn" id="evdis-ajan-expand">⛶</button>
          <button type="button" class="evdis-ajan-icon-btn" id="evdis-ajan-close">×</button>
        </div>
        <div class="evdis-maya-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="evdis-sekmeler" role="tablist">
        <button type="button" class="evdis-sekme" data-sekme="rehber" role="tab"></button>
        <button type="button" class="evdis-sekme" data-sekme="rotalar" role="tab"></button>
        <button type="button" class="evdis-sekme" data-sekme="konular" role="tab"></button>
      </div>
      <div class="evdis-sekme-govde" id="evdis-govde-rehber"></div>
      <div class="evdis-sekme-govde" id="evdis-govde-rotalar"></div>
      <div class="evdis-sekme-govde" id="evdis-govde-konular"></div>
      <div class="evdis-ajan-foot" id="evdis-ajan-foot">
        <div class="evdis-nav-bar">
          <button type="button" class="evdis-nav-btn" id="evdis-nav-back" disabled data-ui="navBack"></button>
          <button type="button" class="evdis-nav-btn" id="evdis-nav-home" data-ui="navHome"></button>
          <button type="button" class="evdis-nav-btn" id="evdis-nav-voice"></button>
        </div>
        <div class="evdis-no-typing" data-ui="noTypingNotice"></div>
        <div class="evdis-ajan-legal" data-ui="legal"></div>
      </div>
    </div>
    <button type="button" class="evdis-ajan-fab" id="evdis-ajan-fab" aria-expanded="false">
      <span class="evdis-maya-orb"><img src="images/evdis-maya-avatar.jpg" alt="" onerror="this.style.display='none'" /><span class="evdis-maya-orb-status"></span></span>
      <span class="evdis-ajan-fab-text"><span class="evdis-ajan-fab-title" data-ui="btnTitle"></span><span class="evdis-ajan-fab-sub" data-ui="btnSub"></span></span>
    </button>
  `;
  document.body.appendChild(root);

  var tourDock = document.createElement("div");
  tourDock.id = "evdis-tour-dock";
  tourDock.innerHTML = `
    <div class="evdis-tour-tag" id="evdis-tour-tag"></div>
    <div class="evdis-tour-title" id="evdis-tour-title"></div>
    <p class="evdis-tour-desc" id="evdis-tour-desc"></p>
    <div class="evdis-tour-controls">
      <button type="button" class="evdis-tour-btn" id="evdis-tour-prev"></button>
      <button type="button" class="evdis-tour-btn" id="evdis-tour-voice"></button>
      <button type="button" class="evdis-tour-btn" id="evdis-tour-stop"></button>
      <button type="button" class="evdis-tour-btn pri" id="evdis-tour-next"></button>
    </div>
  `;
  document.body.appendChild(tourDock);

  var panel = root.querySelector("#evdis-ajan-panel");
  var fab = root.querySelector("#evdis-ajan-fab");
  var headAvatar = root.querySelector("#evdis-head-avatar");
  var govdeRehber = root.querySelector("#evdis-govde-rehber");
  var govdeRotalar = root.querySelector("#evdis-govde-rotalar");
  var govdeKonular = root.querySelector("#evdis-govde-konular");
  var footEl = root.querySelector("#evdis-ajan-foot");
  var navBackBtn = root.querySelector("#evdis-nav-back");
  var navHomeBtn = root.querySelector("#evdis-nav-home");
  var navVoiceBtn = root.querySelector("#evdis-nav-voice");
  var tourVoiceBtn = tourDock.querySelector("#evdis-tour-voice");
  var aktifSekme = "rehber";

  var sonAciliyetId = "";
  var oturumId = "evdis_" + Math.random().toString(36).slice(2, 10);
  var sohbetGecmisi = [];
  var adimYigini = []; // [{ soruMetni, secimId, oncekiId, data }]

  // ---------------------------------------------------------------------------
  // ATLAS-VOICE: NÖRAL SES MODÜLÜ (Pre-generated MP3 + /api/atlas-tts + Web Speech Yedek)
  // ---------------------------------------------------------------------------
  var sesAcik = oturumOku("evdis_ses") !== "0"; // Varsayılan açık
  var aktifAudio = null;
  var aktifSesBtn = null;
  var sesBellegi = {};

  function sesTetikDurumu(konusuyorMu) {
    if (headAvatar) headAvatar.classList.toggle("konusuyor", !!konusuyorMu);
    if (panel) panel.classList.toggle("maya-konusuyor", !!konusuyorMu);
    if (!konusuyorMu && aktifSesBtn) {
      aktifSesBtn.textContent = L().listenBtn;
      aktifSesBtn.classList.remove("ses-aktif");
      aktifSesBtn = null;
    }
  }

  function sesDurdur() {
    if (aktifAudio) {
      try { aktifAudio.pause(); aktifAudio.currentTime = 0; } catch (_) {}
      aktifAudio = null;
    }
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (_) {}
    sesTetikDurumu(false);
  }

  function sesButonuGuncelle() {
    var l = L();
    navVoiceBtn.textContent = sesAcik ? l.voiceOn : l.voiceOff;
    navVoiceBtn.classList.toggle("ses-acik", sesAcik);
    if (tourVoiceBtn && (!aktifSesBtn || aktifSesBtn !== tourVoiceBtn)) {
      tourVoiceBtn.textContent = l.listenBtn;
    }
  }

  function metinTemizleSesIcin(ham) {
    return String(ham || "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[⚠️🚨🔴🟡🟢📞💬📍🦷🔩✨👧🩸🧭🩺🔍📖🔊⏹•]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function webSpeechKonus(temizMetin, btnEl) {
    if (!window.speechSynthesis || !temizMetin) { sesTetikDurumu(false); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(temizMetin);
      var langMap = { tr: "tr-TR", en: "en-US", ar: "ar-SA" };
      var targetLang = langMap[aktifDil] || "tr-TR";
      u.lang = targetLang;
      u.rate = 1.03;
      var voices = window.speechSynthesis.getVoices() || [];
      var pref = voices.filter(function (v) { return String(v.lang || "").toLowerCase().indexOf(aktifDil) === 0; });
      if (pref.length) u.voice = pref[0];
      u.onstart = function () {
        if (btnEl) { aktifSesBtn = btnEl; btnEl.textContent = L().stopAudioBtn; btnEl.classList.add("ses-aktif"); }
        sesTetikDurumu(true);
      };
      u.onend = function () { sesTetikDurumu(false); };
      u.onerror = function () { sesTetikDurumu(false); };
      window.speechSynthesis.speak(u);
    } catch (_) {
      sesTetikDurumu(false);
    }
  }

  function mp3Cal(url, yedekMetin, btnEl) {
    sesDurdur();
    var a = new Audio(url);
    aktifAudio = a;
    if (btnEl) {
      aktifSesBtn = btnEl;
      btnEl.textContent = L().stopAudioBtn;
      btnEl.classList.add("ses-aktif");
    }
    sesTetikDurumu(true);
    a.onended = function () { aktifAudio = null; sesTetikDurumu(false); };
    a.onerror = function () {
      aktifAudio = null;
      if (yedekMetin) webSpeechKonus(yedekMetin, btnEl);
      else sesTetikDurumu(false);
    };
    var p = a.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        aktifAudio = null;
        sesTetikDurumu(false);
      });
    }
  }

  async function sesCal(hamMetin, sabitUrl, btnEl) {
    if (btnEl && aktifSesBtn === btnEl) {
      sesDurdur();
      return;
    }
    sesDurdur();
    var temiz = metinTemizleSesIcin(hamMetin);
    if (sabitUrl) {
      mp3Cal(sabitUrl, temiz, btnEl);
      return;
    }
    if (!temiz) return;
    var anahtar = aktifDil + ":" + temiz.slice(0, 180);
    if (sesBellegi[anahtar]) {
      mp3Cal(sesBellegi[anahtar], temiz, btnEl);
      return;
    }
    if (btnEl) {
      aktifSesBtn = btnEl;
      btnEl.textContent = L().stopAudioBtn;
      btnEl.classList.add("ses-aktif");
    }
    sesTetikDurumu(true);
    try {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, 6500);
      var res = await fetch(API_BASE + "/api/atlas-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: temiz, lang: aktifDil }),
        signal: ctrl.signal
      });
      clearTimeout(t);
      if (res.ok) {
        var j = await res.json();
        if (j && j.ok && j.url) {
          var tamUrl = j.url.indexOf("http") === 0 ? j.url : (window.location.protocol.indexOf("http") === 0 ? j.url : API_BASE + "/" + j.url.replace(/^\//, ""));
          sesBellegi[anahtar] = tamUrl;
          mp3Cal(tamUrl, temiz, btnEl);
          return;
        }
      }
    } catch (_) {}
    webSpeechKonus(temiz, btnEl);
  }

  navVoiceBtn.addEventListener("click", function () {
    sesAcik = !sesAcik;
    oturumYaz("evdis_ses", sesAcik ? "1" : "0");
    if (!sesAcik) sesDurdur();
    sesButonuGuncelle();
  });

  function statikMetinleriUygula() {
    var l = L();
    root.setAttribute("dir", aktifDil === "ar" ? "rtl" : "ltr");
    tourDock.setAttribute("dir", aktifDil === "ar" ? "rtl" : "ltr");
    root.querySelectorAll("[data-ui]").forEach(function (el) { el.textContent = l[el.getAttribute("data-ui")] || ""; });
    panel.setAttribute("aria-label", l.headerTitle);
    root.querySelectorAll(".evdis-sekme").forEach(function (b, i) { b.textContent = l.tabs[i]; });
    root.querySelectorAll(".evdis-dil-secici button").forEach(function (b) { b.classList.toggle("aktif", b.getAttribute("data-dil") === aktifDil); });
    root.querySelector("#evdis-ajan-reset").title = l.resetTitle;
    root.querySelector("#evdis-ajan-expand").title = l.expandTitle;
    root.querySelector("#evdis-ajan-close").title = l.closeTitle;
    tourDock.querySelector("#evdis-tour-prev").textContent = l.prev;
    tourDock.querySelector("#evdis-tour-stop").textContent = l.stop;
    sesButonuGuncelle();
  }

  function sekmeAc(ad) {
    aktifSekme = ad;
    root.querySelectorAll(".evdis-sekme").forEach(function (b) { b.classList.toggle("aktif", b.getAttribute("data-sekme") === ad); });
    govdeRehber.classList.toggle("aktif", ad === "rehber");
    govdeRotalar.classList.toggle("aktif", ad === "rotalar");
    govdeKonular.classList.toggle("aktif", ad === "konular");
    footEl.style.display = ad === "rehber" ? "" : "none";
    if (ad === "konular") {
      var ara = govdeKonular.querySelector(".evdis-ara");
      if (ara) setTimeout(function () { ara.focus(); }, 40);
    }
  }
  root.querySelectorAll(".evdis-sekme").forEach(function (b) {
    b.addEventListener("click", function () { sekmeAc(b.getAttribute("data-sekme")); });
  });

  // ---------------------------------------------------------------------------
  // SEKME 1: 🩺 REHBER — 6 kapı + T0→T3 daralan seçenekler + Önceki Adım yığını
  // ---------------------------------------------------------------------------
  function navDurumuGuncelle() {
    navBackBtn.disabled = adimYigini.length === 0;
  }

  function secenekKutusu(liste, ipucu) {
    var wrap = document.createElement("div");
    wrap.className = "evdis-ajan-chips-wrap";
    var hint = document.createElement("div");
    hint.className = "evdis-ajan-chips-hint";
    hint.textContent = ipucu || L().optionsHint;
    wrap.appendChild(hint);
    var chips = document.createElement("div");
    chips.className = "evdis-ajan-chips";
    var sira = 0;
    liste.forEach(function (item) {
      if (!item || !item.q) return;
      sira++;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "evdis-ajan-chip";
      var idx = ("0" + sira).slice(-2);
      b.innerHTML = "<span class=\"evdis-chip-idx\">" + idx + "</span><span class=\"evdis-chip-label\">" + kacis(item.label || item.q) + "</span><span class=\"evdis-chip-arrow\" aria-hidden=\"true\">→</span>";
      b.addEventListener("click", function () { soruyuGonder(item.q, item.id || ""); });
      chips.appendChild(b);
    });
    wrap.appendChild(chips);
    return wrap;
  }

  function rehberBaslat() {
    sesDurdur();
    govdeRehber.innerHTML = "";
    sonAciliyetId = "";
    oturumId = "evdis_" + Math.random().toString(36).slice(2, 10);
    sohbetGecmisi.length = 0;
    adimYigini.length = 0;
    navDurumuGuncelle();
    if (!isAuthorizedHost) {
      var kilit = document.createElement("div");
      kilit.className = "evdis-ajan-msg bot";
      kilit.innerHTML = "<div class=\"evdis-ajan-badge\">" + kacis(L().lockTitle) + "</div><div>" + kacis(L().lockText) + "</div>";
      govdeRehber.appendChild(kilit);
      return;
    }
    var hos = document.createElement("div");
    hos.className = "evdis-ajan-msg bot";
    var hosKisa = document.createElement("div");
    hosKisa.className = "evdis-kisa";
    hosKisa.innerHTML = guvenliBicimlendir(L().welcome);
    hos.appendChild(hosKisa);
    var hosEylem = document.createElement("div");
    hosEylem.className = "evdis-kart-eylem";
    var dinleHos = document.createElement("button");
    dinleHos.type = "button";
    dinleHos.className = "evdis-eylem-btn ikincil";
    dinleHos.textContent = L().listenBtn;
    dinleHos.addEventListener("click", function () {
      sesCal(L().welcome, "js/evdis-audio/welcome_" + aktifDil + ".mp3", dinleHos);
    });
    hosEylem.appendChild(dinleHos);
    hos.appendChild(hosEylem);
    govdeRehber.appendChild(hos);

    var kapiWrap = document.createElement("div");
    kapiWrap.className = "evdis-ajan-chips-wrap evdis-kapilar";
    var ipucu = document.createElement("div");
    ipucu.className = "evdis-ajan-chips-hint";
    ipucu.textContent = L().kapiHint;
    kapiWrap.appendChild(ipucu);
    var izgara = document.createElement("div");
    izgara.className = "evdis-kapi-izgara";
    (KAPILAR[aktifDil] || KAPILAR.tr).forEach(function (kapi) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "evdis-kapi";
      b.textContent = kapi.label;
      b.addEventListener("click", function () { soruyuGonder(kapi.q, kapi.id || ""); });
      izgara.appendChild(b);
    });
    kapiWrap.appendChild(izgara);
    govdeRehber.appendChild(kapiWrap);
    govdeRehber.scrollTop = 0;
  }

  function zihinKisalt(z) {
    return String(z || "")
      .replace(/\s*\(Eşleşme:[^)]*\)/g, "")
      .replace(/\s*·\s*ATLAS-CORE Kurumsal Lisans.*$/, "")
      .replace(/Gemma\s*4(\s*31B)?\s*·?\s*/gi, "")
      .replace(/Ev\s+Diş/g, "Evdiş");
  }

  function seviyeGostergesi(seviye) {
    var n = parseInt(String(seviye || "T0").replace(/\D/g, ""), 10) || 0;
    var span = document.createElement("span");
    span.className = "evdis-seviye";
    span.title = "T0 → T3";
    var h = "<span class=\"evdis-seviye-tn\">T" + n + "</span><span class=\"evdis-seviye-iz\">";
    for (var i = 0; i <= 3; i++) h += "<i class=\"" + (i <= n ? "dolu" : "") + "\"></i>";
    h += "</span>";
    span.innerHTML = h;
    return span;
  }

  function yanitBasinaOdakla(hedefEl) {
    if (!hedefEl) return;
    requestAnimationFrame(function () {
      var govdeRect = govdeRehber.getBoundingClientRect();
      var elRect = hedefEl.getBoundingClientRect();
      govdeRehber.scrollTo({ top: Math.max(0, govdeRehber.scrollTop + (elRect.top - govdeRect.top) - 10), behavior: "smooth" });
    });
  }

  var statikAgacYukleniyor = null;
  function statikAgacGetir() {
    if (window.__EVDIS_STATIC_TREE__) return Promise.resolve(window.__EVDIS_STATIC_TREE__);
    if (statikAgacYukleniyor) return statikAgacYukleniyor;
    statikAgacYukleniyor = new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = "js/evdis-karar-agaci-statik.js";
      s.onload = function () { resolve(window.__EVDIS_STATIC_TREE__ || {}); };
      s.onerror = function () { resolve({}); };
      document.head.appendChild(s);
    });
    return statikAgacYukleniyor;
  }

  async function cevrimdisiYedekMotor(soru, secimId) {
    var statikAgac = await statikAgacGetir();
    var d = secimId ? (statikAgac[secimId + "_" + aktifDil] || statikAgac[secimId]) : null;
    if (d) {
      return {
        zihin: d.z || L().headerTitle,
        aciliyet: secimId,
        seviye: d.s || "T1",
        kisa_yanit: d.k || d.y || "",
        yanit: d.y || d.k || "",
        sayfa_baglantisi: d.p === "HOME" ? sayfaCoz("HOME") : (d.p || sayfaCoz("HOME")),
        hedef_bolum: d.b || "#icerik",
        secenekler: Array.isArray(d.o) && d.o.length ? d.o : (KAPILAR[aktifDil] || KAPILAR.tr)
      };
    }
    var s = String(soru || "").toLowerCase();
    var acil = /(ateş|nefes|yutkun|boyun|şiş|kanama durmuyor|112|bayıl|fever|breath|swallow|swollen|انتفاخ|حرارة|تنفس|بلع)/.test(s);
    var metin = {
      tr: acil
        ? "⚠️ Yüz/boyun şişliği, ateş, nefes veya yutkunma güçlüğü ya da durmayan kanama varsa vakit kaybetmeden **112**'yi arayın veya en yakın acile başvurun."
        : "Serdivan Merkez (İstiklal Mah. 2. Cad. No: 13 · 18 hekim) ve Adapazarı (Yenidoğan Mah. Fabrika Cad. No: 33 · 2 hekim) şubelerimiz hafta içi 08.30–19.00, Cumartesi 08.30–18.00 açıktır. Tel: **0 (264) 606 00 60** · WhatsApp: **0 (545) 606 00 69**.",
      en: acil
        ? "⚠️ For facial/neck swelling, fever, breathing or swallowing difficulty, or bleeding that won't stop, call **112** or go to the nearest emergency room now."
        : "Serdivan Main Branch (İstiklal Mah. 2. Cad. No: 13 · 18 doctors) and Adapazarı Branch (Yenidoğan Mah. Fabrika Cad. No: 33 · 2 doctors) are open Mon–Fri 08:30–19:00, Sat 08:30–18:00. Phone **0 (264) 606 00 60** · WhatsApp **0 (545) 606 00 69**.",
      ar: acil
        ? "⚠️ عند انتفاخ الوجه أو الرقبة أو الحرارة أو صعوبة التنفس أو البلع أو النزيف المستمر اتصل فوراً بـ **112** أو توجه إلى أقرب طوارئ."
        : "فرع سرديفان الرئيسي (İstiklal Mah. 2. Cad. No: 13 · 18 طبيباً) وفرع أدابازاري (Yenidoğan Mah. Fabrika Cad. No: 33 · طبيبان) يعملان من الإثنين إلى الجمعة 08:30–19:00 والسبت 08:30–18:00. هاتف **0 (264) 606 00 60** · واتساب **0 (545) 606 00 69**."
    };
    var m = metin[aktifDil] || metin.tr;
    return {
      zihin: L().offlineTitle, aciliyet: acil ? "ACIL_CEVRIMDISI" : "CEVRIMDISI", seviye: "T0",
      kisa_yanit: m, yanit: m, sayfa_baglantisi: sayfaCoz("HOME"), hedef_bolum: acil ? "#iletisim" : "#subeler",
      secenekler: KAPILAR[aktifDil] || KAPILAR.tr
    };
  }

  function yanitKartiOlustur(data, otomatikSes) {
    var l = L();
    var acil = String(data.aciliyet || "").indexOf("ACIL") === 0;
    var kart = document.createElement("div");
    kart.className = "evdis-ajan-msg bot" + (acil ? " acil" : "");
    var ust = document.createElement("div");
    ust.className = "evdis-kart-ust";
    var badge = document.createElement("span");
    badge.className = "evdis-ajan-badge";
    badge.textContent = zihinKisalt(data.zihin) || l.headerTitle;
    ust.appendChild(badge);
    ust.appendChild(seviyeGostergesi(data.seviye));
    kart.appendChild(ust);
    var kisaMetin = data.kisa_yanit || data.yanit || "";
    var kisa = document.createElement("div");
    kisa.className = "evdis-kisa";
    kisa.innerHTML = guvenliBicimlendir(kisaMetin);
    kart.appendChild(kisa);
    var eylem = document.createElement("div");
    eylem.className = "evdis-kart-eylem";
    if (data.sayfa_baglantisi) {
      var oku = document.createElement("button");
      oku.type = "button";
      oku.className = "evdis-eylem-btn";
      oku.textContent = l.readOnPage;
      oku.addEventListener("click", function () { sayfadaIncele(data.sayfa_baglantisi, data.hedef_bolum || "#icerik"); });
      eylem.appendChild(oku);
    }
    var dinleBtn = document.createElement("button");
    dinleBtn.type = "button";
    dinleBtn.className = "evdis-eylem-btn ikincil";
    dinleBtn.textContent = l.listenBtn;
    dinleBtn.addEventListener("click", function () {
      sesCal(kisaMetin, "", dinleBtn);
    });
    eylem.appendChild(dinleBtn);

    var tamYanit = String(data.yanit || "");
    var ayrinti = null;
    if (tamYanit && tamYanit.trim() !== String(data.kisa_yanit || "").trim()) {
      ayrinti = document.createElement("div");
      ayrinti.className = "evdis-ayrinti" + (acil ? " acik" : "");
      ayrinti.innerHTML = guvenliBicimlendir(tamYanit);
      var ac = document.createElement("button");
      ac.type = "button";
      ac.className = "evdis-eylem-btn ikincil";
      ac.textContent = acil ? l.detailHide : l.detailShow;
      ac.addEventListener("click", function () {
        var acik = ayrinti.classList.toggle("acik");
        ac.textContent = acik ? l.detailHide : l.detailShow;
      });
      eylem.appendChild(ac);
    }
    if (eylem.children.length) kart.appendChild(eylem);
    if (ayrinti) kart.appendChild(ayrinti);
    if (otomatikSes && sesAcik) {
      setTimeout(function () { sesCal(kisaMetin, "", dinleBtn); }, 80);
    }
    return kart;
  }

  function adimCiz(kayit, otomatikSes) {
    govdeRehber.querySelectorAll(".evdis-ajan-chips-wrap").forEach(function (el) { el.remove(); });
    var tur = document.createElement("div");
    tur.className = "evdis-rehber-tur";
    tur.style.cssText = "display:flex;flex-direction:column;gap:9px;";
    var u = document.createElement("div");
    u.className = "evdis-ajan-msg user";
    u.textContent = kayit.soruMetni;
    tur.appendChild(u);
    var kart = yanitKartiOlustur(kayit.data, otomatikSes);
    tur.appendChild(kart);
    var secenekler = Array.isArray(kayit.data.secenekler) ? kayit.data.secenekler : [];
    if (secenekler.length) tur.appendChild(secenekKutusu(secenekler));
    govdeRehber.appendChild(tur);
    navDurumuGuncelle();
    yanitBasinaOdakla(kart);
  }

  function oncekiAdimaDon() {
    sesDurdur();
    if (adimYigini.length <= 1) {
      rehberBaslat();
      return;
    }
    adimYigini.pop(); // mevcut adımı çıkar
    var ust = adimYigini[adimYigini.length - 1];
    sonAciliyetId = ust.sonrakiId || "";
    var turlar = govdeRehber.querySelectorAll(".evdis-rehber-tur");
    if (turlar.length) turlar[turlar.length - 1].remove();
    govdeRehber.querySelectorAll(".evdis-ajan-chips-wrap").forEach(function (el) { el.remove(); });
    var secenekler = Array.isArray(ust.data.secenekler) ? ust.data.secenekler : [];
    var kalanTurlar = govdeRehber.querySelectorAll(".evdis-rehber-tur");
    var hedefTur = kalanTurlar.length ? kalanTurlar[kalanTurlar.length - 1] : govdeRehber;
    if (secenekler.length) hedefTur.appendChild(secenekKutusu(secenekler));
    navDurumuGuncelle();
    yanitBasinaOdakla(hedefTur);
  }

  navHomeBtn.addEventListener("click", function () { rehberBaslat(); });
  navBackBtn.addEventListener("click", function () { oncekiAdimaDon(); });

  async function soruyuGonder(metin, secimId) {
    var ham = String(metin || "").trim();
    if (!ham && !secimId) return;
    sesDurdur();
    sekmeAc("rehber");
    govdeRehber.querySelectorAll(".evdis-ajan-chips-wrap").forEach(function (el) { el.remove(); });
    var kvkk = kvkkTarayiciMaskele(ham);
    var q = kvkk.temizMetin;
    var gonderilenOncekiId = sonAciliyetId;

    var bekleTur = document.createElement("div");
    bekleTur.style.cssText = "display:flex;flex-direction:column;gap:9px;";
    var u = document.createElement("div");
    u.className = "evdis-ajan-msg user";
    u.textContent = q;
    bekleTur.appendChild(u);
    var bekle = document.createElement("div");
    bekle.className = "evdis-ajan-msg bot";
    bekle.style.opacity = "0.7";
    bekle.textContent = L().wait;
    bekleTur.appendChild(bekle);
    govdeRehber.appendChild(bekleTur);
    yanitBasinaOdakla(u);

    var data = null;
    if (isAuthorizedHost) {
      var uclar = [API_BASE + "/api/evdis-ajan"];
      if (uclar.indexOf(PUBLIC_API_TUNNEL + "/api/evdis-ajan") === -1) uclar.push(PUBLIC_API_TUNNEL + "/api/evdis-ajan");
      if (API_BASE.indexOf("100.95.97.70") === -1) uclar.push(FALLBACK_TELEMETRY + "/api/evdis-ajan");
      for (var i = 0; i < uclar.length && !data; i++) {
        try {
          var ctrl = new AbortController();
          var zaman = setTimeout(function () { ctrl.abort(); }, 4500);
          var res = await fetch(uclar[i], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: q,
              secim_id: secimId || "",
              onceki_id: gonderilenOncekiId,
              oturum_id: oturumId,
              gecmis: sohbetGecmisi.slice(-3),
              client_host: window.location.hostname,
              lang: aktifDil
            }),
            signal: ctrl.signal
          });
          clearTimeout(zaman);
          if (res.ok) data = await res.json();
        } catch (_) { data = null; }
      }
    }
    bekleTur.remove();
    if (!data || !(data.kisa_yanit || data.yanit)) data = await cevrimdisiYedekMotor(q, secimId);
    var aid = String(data.aciliyet || "");
    if (aid && aid.indexOf("BAGLAM_MIRASI") !== 0 && aid.indexOf("SECMELI") !== 0 && aid.indexOf("CEVRIMDISI") === -1) {
      sonAciliyetId = aid;
    }
    sohbetGecmisi.push(q);
    var kayit = { soruMetni: q, secimId: secimId || "", oncekiId: gonderilenOncekiId, sonrakiId: sonAciliyetId, data: data };
    adimYigini.push(kayit);
    adimCiz(kayit, true);
  }

  // ---------------------------------------------------------------------------
  // SEKME 2: 🧭 ROTALAR — "Bu Sayfayı Gez" + 5 klinik rota, sesli ve ışıklı yüzer bar
  // ---------------------------------------------------------------------------
  var aktifRota = null; // { id, ad, adimlar: [{sayfa, sel, baslik, metin, audioIdx}] }
  var aktifAdim = 0;

  function buSayfaAdimlari() {
    var adaylar = [];
    var h1 = document.querySelector("main h1");
    if (h1) adaylar.push(h1);
    document.querySelectorAll("main .klinik-konu-blok[id], main [id^='teknoloji-'], main [id^='konfor-'], main #brans-hekimleri, main #ilk-ziyaret, main #subeler, main #hekimler, main #iletisim, main article[id]").forEach(function (el) {
      adaylar.push(el);
    });
    adaylar.sort(function (x, y) { return x === y ? 0 : (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1); });
    var secilen = [];
    var adimlar = [];
    adaylar.forEach(function (el) {
      if (adimlar.length >= 10) return;
      if (el.closest("#evdis-ajan-root, #evdis-tour-dock, #evdis-emrah-bar, header, footer, nav")) return;
      if (secilen.some(function (g) { return g === el || g.contains(el) || el.contains(g); })) return;
      var baslikEl = /^H[123]$/.test(el.tagName) ? el : el.querySelector("h1, h2, h3");
      var baslik = baslikEl ? baslikEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!baslik) return;
      var p = null;
      if (/^H[123]$/.test(el.tagName)) {
        var kardes = el.nextElementSibling;
        for (var i = 0; i < 4 && kardes && !p; i++) { p = kardes.tagName === "P" ? kardes : kardes.querySelector && kardes.querySelector("p"); kardes = kardes.nextElementSibling; }
        if (!p && el.parentElement) p = el.parentElement.querySelector("p");
      } else {
        p = el.querySelector("p");
      }
      var metin = p ? p.textContent.replace(/\s+/g, " ").trim() : "";
      if (metin.length > 175) {
        var kes = metin.slice(0, 175);
        var nokta = kes.lastIndexOf(". ");
        metin = nokta > 60 ? kes.slice(0, nokta + 1) : kes.replace(/\s+\S*$/, "") + "…";
      }
      secilen.push(el);
      adimlar.push({ el: el, baslik: baslik.slice(0, 95), metin: metin });
    });
    return adimlar;
  }

  function rotaBaslat(rotaId, adim) {
    sesDurdur();
    if (rotaId === "sayfa") {
      var a = buSayfaAdimlari();
      if (!a.length) return;
      aktifRota = { id: "sayfa", ad: L().pageTourName, adimlar: a };
    } else {
      var r = ROTALAR.filter(function (x) { return x.id === rotaId; })[0];
      if (!r) return;
      aktifRota = { id: r.id, ad: metinSec(r.ad), adimlar: r.adimlar };
    }
    ajanKapat();
    tourDock.classList.add("open");
    rotaAdimiGoster(adim || 0);
  }

  function rotaAdimiSeslendir(step, zorla) {
    if (!step) return;
    if (!zorla && !sesAcik) return;
    var baslikTxt = step.el ? step.baslik : metinSec(step.baslik);
    var metinTxt = step.el ? step.metin : metinSec(step.metin);
    var tamMetin = (baslikTxt ? baslikTxt + ". " : "") + (metinTxt || "");
    var sabitMp3 = "";
    if (aktifRota && aktifRota.id !== "sayfa" && step.audioIdx !== undefined) {
      sabitMp3 = "js/evdis-audio/rota_" + aktifRota.id + "_" + step.audioIdx + "_" + aktifDil + ".mp3";
    }
    sesCal(tamMetin, sabitMp3, tourVoiceBtn);
  }

  function rotaAdimiGoster(idx) {
    if (!aktifRota) return;
    sesDurdur();
    if (idx < 0) idx = 0;
    if (idx >= aktifRota.adimlar.length) { rotaKapat(); return; }
    var step = aktifRota.adimlar[idx];
    if (step.sayfa && !ayniSayfaMi(step.sayfa)) {
      oturumYaz("evdis_rota", JSON.stringify({ id: aktifRota.id, adim: idx }));
      window.location.href = sayfaUrl(step.sayfa, { evdis_rota: aktifRota.id, evdis_adim: idx });
      return;
    }
    aktifAdim = idx;
    var l = L();
    var toplam = aktifRota.adimlar.length;
    tourDock.querySelector("#evdis-tour-tag").textContent = l.routeTag + " · " + aktifRota.ad + " · " + (idx + 1) + "/" + toplam;
    tourDock.querySelector("#evdis-tour-title").textContent = step.el ? step.baslik : metinSec(step.baslik);
    tourDock.querySelector("#evdis-tour-desc").textContent = step.el ? step.metin : metinSec(step.metin);
    tourDock.querySelector("#evdis-tour-prev").disabled = idx === 0;
    tourDock.querySelector("#evdis-tour-next").textContent = idx === toplam - 1 ? l.finish : l.next;
    tourVoiceBtn.textContent = l.listenBtn;
    var el = step.el || hedefBul(step.sel);
    spotlightTemizle();
    if (el) { spotlightUygula(el); glideToElement(el); }
    if (sesAcik) {
      setTimeout(function () { rotaAdimiSeslendir(step, false); }, 180);
    }
  }

  function rotaKapat() {
    sesDurdur();
    spotlightTemizle();
    tourDock.classList.remove("open");
    aktifRota = null;
    oturumYaz("evdis_rota", "");
  }

  tourDock.querySelector("#evdis-tour-prev").addEventListener("click", function () { rotaAdimiGoster(aktifAdim - 1); });
  tourDock.querySelector("#evdis-tour-next").addEventListener("click", function () { rotaAdimiGoster(aktifAdim + 1); });
  tourDock.querySelector("#evdis-tour-stop").addEventListener("click", rotaKapat);
  tourVoiceBtn.addEventListener("click", function () {
    if (!aktifRota || !aktifRota.adimlar[aktifAdim]) return;
    if (aktifSesBtn === tourVoiceBtn) { sesDurdur(); return; }
    rotaAdimiSeslendir(aktifRota.adimlar[aktifAdim], true);
  });
  document.addEventListener("keydown", function (e) {
    if (!tourDock.classList.contains("open")) return;
    if (e.key === "Escape") rotaKapat();
    else if (e.key === "ArrowRight") rotaAdimiGoster(aktifAdim + (aktifDil === "ar" ? -1 : 1));
    else if (e.key === "ArrowLeft") rotaAdimiGoster(aktifAdim + (aktifDil === "ar" ? 1 : -1));
  });

  function rotalariCiz() {
    var l = L();
    govdeRotalar.innerHTML = "";
    var giris = document.createElement("div");
    giris.className = "evdis-ajan-chips-hint";
    giris.textContent = l.routesIntro;
    govdeRotalar.appendChild(giris);
    function kart(ikon, ad, ozet, sayi, vurgu, tik) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "evdis-rota-kart" + (vurgu ? " vurgu" : "");
      b.innerHTML = "<span class=\"evdis-rota-ikon\">" + ikon + "</span><span><div class=\"evdis-rota-ad\">" + kacis(ad) + "</div><div class=\"evdis-rota-ozet\">" + kacis(ozet) + "</div>" + (sayi ? "<div class=\"evdis-rota-sayi\">" + sayi + " " + kacis(l.stepWord) + "</div>" : "") + "</span>";
      b.addEventListener("click", tik);
      govdeRotalar.appendChild(b);
    }
    kart("✨", l.currentTour, l.currentTourSub, buSayfaAdimlari().length, true, function () { rotaBaslat("sayfa"); });
    ROTALAR.forEach(function (r) {
      kart(r.ikon, metinSec(r.ad), metinSec(r.ozet), r.adimlar.length, false, function () { rotaBaslat(r.id); });
    });
  }

  // ---------------------------------------------------------------------------
  // SEKME 3: 🔍 KONULAR — 8 branş · 24 klinik tedavi · 4 teknoloji · 20 hekim · 2 şube
  // ---------------------------------------------------------------------------
  function katla(s) {
    return String(s || "").toLocaleLowerCase("tr").replace(/[çğıöşüâî]/g, function (c) { return { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i" }[c]; });
  }
  function konulariCiz() {
    var l = L();
    govdeKonular.innerHTML = "";
    var ara = document.createElement("input");
    ara.type = "search";
    ara.className = "evdis-ara";
    ara.placeholder = l.searchPh;
    govdeKonular.appendChild(ara);
    var liste = document.createElement("div");
    liste.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    govdeKonular.appendChild(liste);
    function ciz(sorgu) {
      liste.innerHTML = "";
      var s = katla(sorgu.trim());
      var toplam = 0;
      ["brans", "tedavi", "tek", "hekim", "sube"].forEach(function (grup) {
        var ogeler = (KONULAR[grup] || []).filter(function (o) {
          if (!s) return true;
          var havuz = katla([o.ad.tr, o.ad.en, o.ad.ar, metinSec(o.alt), o.alt && o.alt.tr, o.ek].join(" "));
          return havuz.indexOf(s) !== -1;
        });
        if (!ogeler.length) return;
        toplam += ogeler.length;
        var g = document.createElement("div");
        g.className = "evdis-konu-grup";
        g.innerHTML = "<h5>" + kacis(l.groups[grup]) + "</h5>";
        var kutu = document.createElement("div");
        kutu.className = "evdis-konu-etiketler";
        ogeler.forEach(function (o) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "evdis-konu";
          b.innerHTML = "<b>" + kacis(metinSec(o.ad)) + "</b>" + (o.alt ? "<span>" + kacis(metinSec(o.alt)) + "</span>" : "");
          b.addEventListener("click", function () { sayfadaIncele(o.sayfa, o.bolum); });
          kutu.appendChild(b);
        });
        g.appendChild(kutu);
        liste.appendChild(g);
      });
      if (!toplam) {
        var yok = document.createElement("div");
        yok.className = "evdis-ajan-chips-hint";
        yok.textContent = l.noResult;
        liste.appendChild(yok);
      }
    }
    ara.addEventListener("input", function () { ciz(ara.value); });
    ara.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var ilk = liste.querySelector(".evdis-konu");
        if (ilk) ilk.click();
      }
    });
    ciz("");
  }

  // ---------------------------------------------------------------------------
  // DİL DEĞİŞTİRİCİ (TR | EN | AR) — widget anında çevrilir, alt sayfa arayüzü site.js ile eşlenir
  // ---------------------------------------------------------------------------
  function dilUygula(yeni, kaynak) {
    if (DILLER.indexOf(yeni) === -1) return;
    var degisti = yeni !== aktifDil;
    aktifDil = yeni;
    oturumYaz("evdis_dil", yeni);
    statikMetinleriUygula();
    rehberBaslat();
    rotalariCiz();
    konulariCiz();
    if (aktifRota && aktifRota.id !== "sayfa" && tourDock.classList.contains("open")) {
      var r = ROTALAR.filter(function (x) { return x.id === aktifRota.id; })[0];
      if (r) aktifRota.ad = metinSec(r.ad);
      rotaAdimiGoster(aktifAdim);
    }
    if (degisti && kaynak !== "site") {
      document.dispatchEvent(new CustomEvent("evdis:dil", { detail: { dil: yeni, kaynak: "widget" } }));
    }
  }
  root.querySelectorAll(".evdis-dil-secici button").forEach(function (b) {
    b.addEventListener("click", function () { dilUygula(b.getAttribute("data-dil"), "widget"); });
  });
  document.addEventListener("evdis:dil", function (e) {
    var d = e.detail || {};
    if (d.kaynak === "site" && d.dil && d.dil !== aktifDil) dilUygula(d.dil, "site");
  });

  // ---------------------------------------------------------------------------
  // PANEL AÇ / KAPAT VE GENEL BAĞLANTILAR
  // ---------------------------------------------------------------------------
  function ajanAc(sekme) {
    panel.classList.add("open");
    fab.setAttribute("aria-expanded", "true");
    sekmeAc(sekme || aktifSekme || "rehber");
  }
  function ajanKapat() {
    sesDurdur();
    panel.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
  }
  window.evdisAjanAc = function () { ajanAc("rehber"); };
  window.evdisAjanKapat = ajanKapat;
  window.evdisRehberliTurBaslat = function () { rotaBaslat("sayfa"); };
  window.evdisRotaBaslat = rotaBaslat;

  fab.addEventListener("click", function () { if (panel.classList.contains("open")) ajanKapat(); else ajanAc(); });

  // EKRAN-DENETIM-1017 · yerleşim: rehber düğmesi ilk ekranda metne/düğmeye binmesin.
  // Varsayılan alt boşluk mobilde 78px, geniş ekranda 18px (sabit alt eylem çubuğu varsa onun üstü); ilk ekranda
  // (kaydırma < yarım ekran) altı doluysa 6px adımlarla yukarıdaki ilk boş yere çıkar (en çok ekranın %45'i).
  // Panel açıkken ve sayfa kaydırılınca varsayılana döner.
  var FAB_ALT = 78;
  function fabSutunuEngelleri(sol, gen) {
    // Düğme sütununda (ekranın alt yarısı) görünen metin satırları ve tıklanabilir öğe kutuları toplanır.
    // Sütunla kesişmeyen öğenin alt ağacına hiç inilmez; uzun sayfada da hızlıdır.
    var bandUst = window.innerHeight * 0.5 - 60, xL = sol - 2, xR = sol + gen + 2, metin = [], tik = [];
    var bantta = function (b) { return b.right > xL && b.left < xR && b.bottom > bandUst && b.top < window.innerHeight; };
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 3) return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        if (n.id === "evdis-ajan-root" || n.id === "evdis-tour-dock" || n.id === "evdis-emrah-bar") return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG|VIDEO|IMG|CANVAS|IFRAME)$/i.test(n.tagName)) return NodeFilter.FILTER_REJECT;
        var b = n.getBoundingClientRect();
        if (!b.width && !b.height) return NodeFilter.FILTER_SKIP;
        if (!bantta(b)) return NodeFilter.FILTER_REJECT;
        if (n.matches("a[href], button, [role=tab], input, select, textarea, label")) tik.push(b);
        return NodeFilter.FILTER_SKIP;
      }
    });
    var t, rg, rr, q;
    while ((t = tw.nextNode())) {
      if (getComputedStyle(t.parentElement).visibility === "hidden") continue;
      rg = document.createRange();
      rg.selectNodeContents(t);
      rr = rg.getClientRects();
      for (q = 0; q < rr.length; q++) if (bantta(rr[q])) metin.push(rr[q]);
    }
    return { metin: metin, tik: tik };
  }
  function kutuyaDeger(liste, sol, ust, gen, yuk) {
    for (var q = 0; q < liste.length; q++) {
      var d = liste[q];
      if (d.right > sol - 1 && d.left < sol + gen + 1 && d.bottom > ust - 1 && d.top < ust + yuk + 1) return true;
    }
    return false;
  }
  function rehberYerlestir() {
    var mobil = window.matchMedia("(max-width: 768px)").matches;
    var taban = mobil ? FAB_ALT : 18, kenar = mobil ? 10 : 18;
    // site.css'in <=1024px'te açtığı sabit alt eylem çubuğu (.alt-eylem) görünürse düğme onun üstünde durur
    var altCubuk = document.querySelector(".alt-eylem");
    if (altCubuk && getComputedStyle(altCubuk).position === "fixed" && altCubuk.getBoundingClientRect().height > 0) {
      taban = Math.max(taban, Math.round(window.innerHeight - altCubuk.getBoundingClientRect().top) + 8);
    }
    var hedef = taban;
    var baslik = root.querySelector('[data-ui="btnTitle"]');
    if (baslik && baslik.textContent) fab.setAttribute("aria-label", baslik.textContent);
    if (!panel.classList.contains("open") && window.scrollY < window.innerHeight * 0.5) {
      var r = fab.getBoundingClientRect(), gen = r.width || 46, yuk = r.height || 46;
      var fark = Math.max(0, Math.round(root.getBoundingClientRect().bottom - r.bottom)); // kapsayıcı altı ↔ düğme altı (taban çizgisi boşluğu)
      var sol = root.getAttribute("dir") === "rtl" ? kenar : window.innerWidth - kenar - gen;
      // 1. tur: altında ne metin ne tıklanabilir öğe olan ilk yer; 2. tur: en azından metne binmeyen ilk yer
      var tavan = Math.round(window.innerHeight * 0.45), alt, tur, bulundu = false, ust;
      var engel = fabSutunuEngelleri(sol, gen);
      for (tur = 0; tur < 2 && !bulundu; tur++) {
        for (alt = taban; alt <= tavan; alt += 6) {
          ust = window.innerHeight - alt - fark - yuk;
          if (kutuyaDeger(engel.metin, sol, ust, gen, yuk) || (tur === 0 && kutuyaDeger(engel.tik, sol, ust, gen, yuk))) continue;
          hedef = alt; bulundu = true; break;
        }
      }
    }
    root.style.setProperty("--evdis-fab-alt", hedef + "px");
  }
  var yerlesimZaman = 0;
  function rehberYerlestirIste() { clearTimeout(yerlesimZaman); yerlesimZaman = setTimeout(rehberYerlestir, 140); }
  window.addEventListener("scroll", rehberYerlestirIste, { passive: true });
  window.addEventListener("resize", rehberYerlestirIste);
  window.addEventListener("orientationchange", rehberYerlestirIste);
  window.addEventListener("load", function () { rehberYerlestir(); setTimeout(rehberYerlestir, 900); });
  if (window.MutationObserver) new MutationObserver(rehberYerlestirIste).observe(panel, { attributes: true, attributeFilter: ["class"] });
  setTimeout(rehberYerlestir, 300);
  root.querySelector("#evdis-ajan-close").addEventListener("click", ajanKapat);
  root.querySelector("#evdis-ajan-expand").addEventListener("click", function () { panel.classList.toggle("expanded"); });
  root.querySelector("#evdis-ajan-reset").addEventListener("click", function () { rehberBaslat(); sekmeAc("rehber"); });
  topBar.querySelector("#evdis-open-ajan-top").addEventListener("click", function () { ajanAc("rehber"); });
  topBar.querySelector("#evdis-open-tour-top").addEventListener("click", function () { ajanAc("rotalar"); });
  document.querySelectorAll("[data-evdis-ajan-ac]").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); ajanAc("rehber"); });
  });
  document.querySelectorAll("[data-evdis-tur-ac]").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); rotaBaslat("sayfa"); });
  });

  // ---------------------------------------------------------------------------
  // İLK KURULUM + URL PARAMETRELERİ (?ajan=ac · ?tur=ac · ?rota=<id> · evdis_odak · evdis_rota/evdis_adim)
  // ---------------------------------------------------------------------------
  statikMetinleriUygula();
  rehberBaslat();
  rotalariCiz();
  konulariCiz();
  sekmeAc("rehber");

  function parametreTemizle(anahtarlar) {
    try {
      var url = new URL(window.location.href);
      anahtarlar.forEach(function (a) { url.searchParams.delete(a); });
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (_) {}
  }
  var odak = urlParams.get("evdis_odak");
  var rotaParam = urlParams.get("evdis_rota");
  var adimParam = parseInt(urlParams.get("evdis_adim") || "0", 10) || 0;
  if (rotaParam) {
    parametreTemizle(["evdis_rota", "evdis_adim"]);
    setTimeout(function () { rotaBaslat(rotaParam, adimParam); }, 450);
  } else if (odak) {
    parametreTemizle(["evdis_odak"]);
    setTimeout(function () {
      var el = hedefBul(["#" + odak, "main h1", "main"]);
      if (el) { spotlightUygula(el, 6500); glideToElement(el); }
    }, 450);
  } else if (urlParams.get("rota")) {
    setTimeout(function () { rotaBaslat(urlParams.get("rota")); }, 450);
  } else if (window.location.search.indexOf("ajan=ac") !== -1 || window.location.hash === "#ajan") {
    ajanAc("rehber");
  } else if (window.location.search.indexOf("tur=ac") !== -1 || window.location.hash === "#tur") {
    setTimeout(function () { rotaBaslat("sayfa"); }, 300);
  }
})();
