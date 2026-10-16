/**
 * Maya — ATLAS'ın Kızı · Asistan
 * Birleşik 3B Rölyef Portre (Blender 5.1.0 GLB + Three.js WebGL + 60fps Kanvas)
 * Akıcı Stüdyo Nöral Ses (.mp3 + WebAudio Gerçek Zamanlı Dudak Senkronu)
 * ve Sayfayı Otomatik Kaydıran, Eğitim Bilgisinden Kısa Özet Veren Site Rehberi.
 */
(function () {
  "use strict";

  if (document.getElementById("maya-carrier")) return;

  // 1. Kritik CSS'i doğrudan <head> içine göm (Önbellek ne olursa olsun sayfa altına düşmez veya ekranı kaplamaz)
  var inlineStyle = document.createElement("style");
  inlineStyle.id = "maya-inline-css";
  inlineStyle.textContent = [
    ":root{--maya-bg:rgba(11,17,30,0.93);--maya-border:rgba(0,229,255,0.40);--maya-cyan:#00e5ff;--maya-emerald:#10b981;--maya-text:#f1f5f9;--maya-shadow:0 14px 36px rgba(0,0,0,0.52),0 0 22px rgba(0,229,255,0.16);}",
    ".maya-carrier{position:fixed!important;left:0;top:0;z-index:9998!important;display:flex!important;align-items:flex-end;gap:10px;pointer-events:none;transition:transform 0.72s cubic-bezier(0.22,1,0.36,1);will-change:transform;font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,sans-serif;max-width:96vw;}",
    ".maya-carrier.is-dragging{transition:none!important;}",
    ".maya-carrier.bubble-left{flex-direction:row-reverse;}",
    ".maya-orb-wrap{position:relative;width:76px!important;height:76px!important;min-width:76px;min-height:76px;max-width:76px;max-height:76px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#162238,#090e1a);border:2.5px solid var(--maya-cyan);box-shadow:var(--maya-shadow);cursor:grab;pointer-events:auto;flex-shrink:0;user-select:none;touch-action:none;transition:transform 0.22s ease,box-shadow 0.22s ease,border-color 0.22s ease;}",
    ".maya-orb-wrap:hover{transform:scale(1.05);}",
    ".maya-orb-wrap.is-speaking{border-color:var(--maya-emerald);box-shadow:0 0 0 4px rgba(16,185,129,0.24),0 0 26px rgba(0,229,255,0.42);}",
    ".maya-orb-clip{width:100%!important;height:100%!important;border-radius:50%;overflow:hidden;position:relative;background:#0b111e;}",
    ".maya-orb-clip canvas,.maya-orb-clip img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover;display:block;border-radius:50%;}",
    ".maya-orb-badge{position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);background:rgba(11,17,30,0.96);border:1px solid rgba(0,229,255,0.48);color:var(--maya-cyan);font-size:9px;font-weight:700;letter-spacing:0.03em;padding:1px 6px;border-radius:999px;white-space:nowrap;pointer-events:none;z-index:4;}",
    ".maya-orb-status{position:absolute;top:2px;right:2px;width:10px;height:10px;border-radius:50%;background:var(--maya-emerald);border:2px solid #0b111e;z-index:4;}",
    ".maya-mini-pill{pointer-events:auto;display:inline-flex;align-items:center;gap:7px;background:var(--maya-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--maya-border);border-radius:999px;padding:7px 12px;color:var(--maya-text);font-size:11.5px;font-weight:600;cursor:pointer;box-shadow:var(--maya-shadow);}",
    ".maya-mini-pill[hidden],.maya-bubble[hidden],.maya-routes[hidden],.maya-topics[hidden]{display:none!important;}",
    ".maya-mini-pill .maya-pill-sub{color:var(--maya-cyan);font-weight:600;font-size:11px;}",
    ".maya-bubble{pointer-events:auto;width:302px!important;max-width:calc(100vw - 98px)!important;background:var(--maya-bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--maya-border);border-radius:15px;padding:10px 12px;color:var(--maya-text);box-shadow:var(--maya-shadow);}",
    ".maya-b-head{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:5px;}",
    ".maya-b-title{font-size:10.5px;font-weight:700;color:var(--maya-cyan);letter-spacing:0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
    ".maya-b-controls{display:flex;align-items:center;gap:3px;flex-shrink:0;}",
    ".maya-icon-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#cbd5e1;border-radius:6px;padding:2px 5px;font-size:10px;cursor:pointer;line-height:1.25;}",
    ".maya-icon-btn:hover,.maya-icon-btn.active{border-color:var(--maya-cyan);color:#fff;background:rgba(0,229,255,0.16);}",
    ".maya-routes,.maya-topics{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:7px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.09);max-height:145px;overflow-y:auto;}",
    ".maya-search-input{width:100%;background:rgba(255,255,255,0.07);border:1px solid rgba(0,229,255,0.32);color:#fff;border-radius:7px;padding:4px 8px;font-size:10.5px;margin-bottom:4px;outline:none;}",
    ".maya-search-input::placeholder{color:#94a3b8;}",
    ".maya-route-chip{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#cbd5e1;border-radius:7px;padding:3px 6px;font-size:10px;cursor:pointer;flex:1 1 calc(50% - 4px);text-align:left;}",
    ".maya-route-chip.full-row{flex:1 1 100%;}",
    ".maya-route-chip:hover,.maya-route-chip.active{background:rgba(0,229,255,0.15);border-color:var(--maya-cyan);color:#fff;font-weight:600;}",
    ".maya-dots{display:flex;align-items:center;gap:3px;margin-bottom:6px;}",
    ".maya-dot{height:4px;flex:1;border-radius:999px;background:rgba(255,255,255,0.15);cursor:pointer;}",
    ".maya-dot.done{background:rgba(0,229,255,0.45);}",
    ".maya-dot.active{background:var(--maya-cyan);}",
    ".maya-step-tag{display:block;font-size:9.5px;font-weight:700;color:var(--maya-emerald);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;}",
    ".maya-step-h{font-size:12.5px;font-weight:700;color:#fff;margin:0 0 3px 0;line-height:1.28;}",
    ".maya-step-p{font-size:11.5px;line-height:1.45;color:#dbeafe;margin:0 0 8px 0;}",
    ".maya-b-foot{display:flex;align-items:center;justify-content:space-between;gap:4px;}",
    ".maya-btn-sm{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);color:#e2e8f0;border-radius:7px;padding:4px 8px;font-size:10.5px;font-weight:600;cursor:pointer;white-space:nowrap;}",
    ".maya-btn-sm:hover{border-color:var(--maya-cyan);color:#fff;}",
    ".maya-btn-sm.pri{background:linear-gradient(135deg,rgba(0,229,255,0.22),rgba(16,185,129,0.22));border-color:rgba(0,229,255,0.55);color:#fff;}",
    ".maya-spot-target{outline:2px solid rgba(0,229,255,0.55)!important;outline-offset:6px!important;border-radius:10px;box-shadow:0 0 26px rgba(0,229,255,0.15)!important;transition:outline-color 0.3s ease,box-shadow 0.3s ease;}",
    "@media(max-width:680px){.maya-orb-wrap{width:64px!important;height:64px!important;min-width:64px;min-height:64px;max-width:64px;max-height:64px;}.maya-bubble{width:258px!important;padding:8px 10px;}}"
  ].join("\n");
  document.head.appendChild(inlineStyle);

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0 ||
    /\/(en|autonomy|spark|privacy)(\.html)?$/i.test(location.pathname);

  var STORAGE_KEY = "atlas_maya_tour_v5";
  var assetPrefix = /\/blog\//i.test(location.pathname) ? "../" : "";

  function normalizePage(p) {
    var clean = (p || "").replace(/^\/+/, "").replace(/\/+$/, "");
    if (!clean || clean === "") return isEn ? "en.html" : "index.html";
    if (!/\.html$/i.test(clean)) clean += ".html";
    return clean;
  }

  function currentPageRel() {
    return normalizePage(location.pathname);
  }

  function samePage(a, b) {
    return normalizePage(a) === normalizePage(b);
  }

  function resolveHref(targetPage) {
    var normTarget = normalizePage(targetPage);
    var inBlogSubdir = /\/blog\//i.test(location.pathname);
    if (inBlogSubdir) {
      if (normTarget.indexOf("blog/") === 0) return normTarget.slice(5);
      return "../" + normTarget;
    }
    return normTarget;
  }

  // Ana Rotalar (Her durağın kendi stüdyo nöral .mp3 ses dosyası vardır)
  var ROUTES = {
    tr: [
      {
        id: "full",
        label: "1. Tam Tur (10 Durak)",
        stops: [
          {
            page: "index.html",
            sel: ".hero",
            audio: "full_0_tr.mp3",
            tag: "Durak 1 / 10 · Giriş",
            h: "Atlas Dijital Gülüş Tasarımı",
            p: "İki fotoğraftan 441 formluk kütüphaneden gerekçeli diş formu önerisi, kılavuzlu önizleme ve ExoCAD iş paketi hazırlıyoruz."
          },
          {
            page: "index.html",
            sel: "#nasil .pipe",
            audio: "full_1_tr.mp3",
            tag: "Durak 2 / 10 · 5 Adım",
            h: "Fotoğraftan ExoCAD'e İş Akışı",
            p: "Tam yüz ve ekartörlü iki telefon fotoğrafıyla başlayan süreç 5 adımda ölçüm, form seçimi ve önizlemeyle tamamlanır."
          },
          {
            page: "index.html",
            sel: ".sk",
            audio: "full_2_tr.mp3",
            tag: "Durak 3 / 10 · 3B Sefalometri",
            h: "478 Noktalı 3B Yüz Analizi & QLoRA",
            p: "Yüz genişliği ve alt çene açılarını 3B ağ ile ölçüp yüz tipine en uygun diş morfolojisini seçen modülümüzü buradan deneyebilirsiniz."
          },
          {
            page: "index.html",
            sel: "#ornek",
            audio: "full_3_tr.mp3",
            tag: "Durak 4 / 10 · Önce / Sonra",
            h: "Kılavuzlu Önizleme Kaydırıcısı",
            p: "Kaydırıcıyı hareket ettirerek mevcut dişler ile seçilen formun uygulanmış halini aynı kare üzerinde karşılaştırabilirsiniz."
          },
          {
            page: "index.html",
            sel: "#otomasyon",
            audio: "full_4_tr.mp3",
            tag: "Durak 5 / 10 · Otomasyon",
            h: "441 Form ve Kapı Denetimi",
            p: "Ölçüm ve form sıralamasını otomasyon hızlandırır; kontur denetiminden geçmeyen hiçbir önizleme hekime sunulmaz."
          },
          {
            page: "index.html",
            sel: "#studyo",
            audio: "full_5_tr.mp3",
            tag: "Durak 6 / 10 · Araştırma",
            h: "Stüdyo Mimarisi ve 7 Yaşayan Yazı",
            p: "Yüzden Dişe 3B Sefalometri, Kim Kimi Eğitiyor ve Türkiye Viski Analizi dahil tüm araştırma yazılarımıza buradan ulaşabilirsiniz."
          },
          {
            page: "otonomi.html",
            sel: "#sayac",
            audio: "full_6_tr.mp3",
            tag: "Durak 7 / 10 · Otonomi",
            h: "Saatlik Doğrulanan Canlı Sayaçlar",
            p: "Ajanların ürettiği hipotezler, çalışan bekçiler ve doğrulama istatistikleri doğrudan canlı kütüklerden okunur."
          },
          {
            page: "otonomi.html",
            sel: "#ablasyon",
            audio: "full_7_tr.mp3",
            tag: "Durak 8 / 10 · Ablasyon",
            h: "3 Kollu Bağlam ve Maliyet Deneyi",
            p: "Üç farklı bağlam kolunun aynı doğrulama kapısından hangi süre ve maliyetle geçtiğini gösteren ölçüm şemamız."
          },
          {
            page: "otonomi.html",
            sel: "#halka",
            audio: "full_8_tr.mp3",
            tag: "Durak 9 / 10 · Evrim",
            h: "4 Adımlı Kapalı Evrim Halkası",
            p: "Yapıcı ses Enki ile kör yargıç Enlil birbirini duymadan kuralları sınar; istatistik kapısını geçen kurallar yaşar."
          },
          {
            page: "otonomi.html",
            sel: "#maya",
            audio: "full_9_tr.mp3",
            tag: "Durak 10 / 10 · Maya",
            h: "Maya: ATLAS'ın Kızı · Asistan",
            p: "Eğitim öncesi ve sonrası doğrulama performansımı ve örnek soru karşılaştırmalarını bu bölümde inceleyebilirsiniz."
          }
        ]
      },
      {
        id: "clinic",
        label: "2. Klinik & Gülüş (5 Durak)",
        stops: [
          {
            page: "index.html",
            sel: ".hero figure",
            audio: "clinic_0_tr.mp3",
            tag: "Klinik 1 / 5 · Şema",
            h: "Orta Hat ve Diş Oranı Kılavuzu",
            p: "Altı ön diş üzerinde orta hat, diş eti zenit noktaları ve kesici kenar eğrisinin şematik yerleşimi."
          },
          {
            page: "index.html",
            sel: "#nasil .pipe",
            audio: "clinic_1_tr.mp3",
            tag: "Klinik 2 / 5 · Süreç",
            h: "5 Adımda Klinik Teslim",
            p: "İki fotoğrafla başlayan akış, hekim onayından sonra doğrudan ExoCAD iş paketine dönüşür."
          },
          {
            page: "index.html",
            sel: ".sk",
            audio: "clinic_2_tr.mp3",
            tag: "Klinik 3 / 5 · 3B Modül",
            h: "Canlı 3B Sefalometri Simülasyonu",
            p: "Modül üzerindeki düğmelerle 3B sefalometrik ağı, eğitimsiz modeli ve QLoRA modelimizi karşılaştırabilirsiniz."
          },
          {
            page: "index.html",
            sel: "#ornek",
            audio: "clinic_3_tr.mp3",
            tag: "Klinik 4 / 5 · Karşılaştır",
            h: "Önce / Sonra Görsel Simülasyon",
            p: "Ekartörlü ve ağız kırpımı karelerinde tasarım öncesi ve sonrası farkı kaydırıcıyla inceleyin."
          },
          {
            page: "index.html",
            sel: "#sss",
            audio: "clinic_4_tr.mp3",
            tag: "Klinik 5 / 5 · SSS & Veri",
            h: "Sık Sorulan Sorular ve Gizlilik",
            p: "Fotoğraf standartları, teslim paketi ve hasta mahremiyeti hakkındaki tüm soruların kısa yanıtları."
          }
        ]
      },
      {
        id: "ai",
        label: "3. Otonomi & Evrim (5 Durak)",
        stops: [
          {
            page: "otonomi.html",
            sel: "#sayac",
            audio: "ai_0_tr.mp3",
            tag: "Otonomi 1 / 5 · Sayaçlar",
            h: "Canlı Sistem Sayaçları",
            p: "Saatlik doğrulanan görev, hipotez ve bekçi sayaçları."
          },
          {
            page: "otonomi.html",
            sel: "#ajanlar",
            audio: "ai_1_tr.mp3",
            tag: "Otonomi 2 / 5 · Karneler",
            h: "Ajan Karneleri",
            p: "Enkidu, Enki, Enlil, Kalfa ve Kıvılcım ajanlarının görev ve başarı karneleri."
          },
          {
            page: "otonomi.html",
            sel: "#ablasyon",
            audio: "ai_2_tr.mp3",
            tag: "Otonomi 3 / 5 · Ablasyon",
            h: "Maliyet ve Bağlam Ablasyonu",
            p: "Aynı sonucu yarı sürede üreten bağlam ablasyonu deneyimiz."
          },
          {
            page: "otonomi.html",
            sel: "#halka",
            audio: "ai_3_tr.mp3",
            tag: "Otonomi 4 / 5 · Evrim",
            h: "Kapalı Evrim Halkası",
            p: "Çürüyen kuralları kör yargıç ve gölge sınamayla yenileyen 4 adımlı döngü."
          },
          {
            page: "otonomi.html",
            sel: "#maya",
            audio: "ai_4_tr.mp3",
            tag: "Otonomi 5 / 5 · Maya",
            h: "Maya Eğitim ve Karşılaştırma",
            p: "Eğitim öncesi ham model ile eğitim sonrası yanıtlarımın karşılaştırma tablosu."
          }
        ]
      },
      {
        id: "spark",
        label: "4. Kıvılcım & Yazılar (4 Durak)",
        stops: [
          {
            page: "kivilcim.html",
            sel: "#algoritma",
            audio: "spark_0_tr.mp3",
            tag: "Kıvılcım 1 / 4 · Yordam",
            h: "7 Basamaklı Kıvılcım Yordamı",
            p: "Birbirini duymayan model ailelerinden tez, karşı tez ve düşer testi üretme yöntemi."
          },
          {
            page: "kivilcim.html",
            sel: "#karne",
            audio: "spark_1_tr.mp3",
            tag: "Kıvılcım 2 / 4 · Karne",
            h: "49 Turun Gerçek Karnesi",
            p: "Hangi model ailesinin kaç turda en güçlü tezi ürettiğinin ölçülmüş tablosu."
          },
          {
            page: "kivilcim.html",
            sel: "#makaleler",
            audio: "spark_2_tr.mp3",
            tag: "Kıvılcım 3 / 4 · Deneyler",
            h: "Deneysel Kıvılcım Yazıları",
            p: "Sefalometrik QLoRA ve Ajan Evrimi deneylerinin özet bulguları."
          },
          {
            page: "blog.html",
            sel: "#yazilar",
            audio: "spark_3_tr.mp3",
            tag: "Kıvılcım 4 / 4 · Yazılar",
            h: "Tüm Araştırma Yazıları (7 Makale)",
            p: "Stüdyonun yayınladığı 7 yaşayan makalenin tamamına buradan geçebilirsiniz."
          }
        ]
      }
    ],
    en: [
      {
        id: "full",
        label: "1. Full Tour (10 Stops)",
        stops: [
          {
            page: "en.html",
            sel: ".hero",
            audio: "full_0_en.mp3",
            tag: "Stop 1 / 10 · Intro",
            h: "Atlas Digital Smile Design",
            p: "From two photos, we prepare reasoned form proposals from a 441-form library, guided mockups, and ExoCAD packages."
          },
          {
            page: "en.html",
            sel: "#how .pipe",
            audio: "full_1_en.mp3",
            tag: "Stop 2 / 10 · 5 Steps",
            h: "5-Step Clinical Workflow",
            p: "Five-step clinical workflow starting from two smartphone photographs through measurement, form proposal, and ExoCAD delivery."
          },
          {
            page: "en.html",
            sel: ".sk",
            audio: "full_2_en.mp3",
            tag: "Stop 3 / 10 · 3D Cephalometry",
            h: "478-Point 3D Facial Analysis & QLoRA",
            p: "Test our interactive module measuring bizygomatic and mandibular vectors to match tooth morphology."
          },
          {
            page: "en.html",
            sel: "#ornek",
            audio: "full_3_en.mp3",
            tag: "Stop 4 / 10 · Before / After",
            h: "Guided Preview Slider",
            p: "Slide left and right to compare pre-design teeth with the accepted morphology on the same case."
          },
          {
            page: "en.html",
            sel: "#automation",
            audio: "full_4_en.mp3",
            tag: "Stop 5 / 10 · Automation",
            h: "441 Forms & Gate Verification",
            p: "Automation ranks 5 primary and 3 alternative forms; every preview passes contour gates before delivery."
          },
          {
            page: "en.html",
            sel: "#studio",
            audio: "full_5_en.mp3",
            tag: "Stop 6 / 10 · Research",
            h: "Studio Architecture & 7 Living Essays",
            p: "Access our living research papers including Face-to-Tooth 3D Cephalometry and Who Trains Whom."
          },
          {
            page: "autonomy.html",
            sel: "#sayac",
            audio: "full_6_en.mp3",
            tag: "Stop 7 / 10 · Autonomy",
            h: "Hourly Verified Live Counters",
            p: "Live task, hypothesis, and watchdog counters read directly from production logs."
          },
          {
            page: "autonomy.html",
            sel: "#ablasyon",
            audio: "full_7_en.mp3",
            tag: "Stop 8 / 10 · Ablation",
            h: "3-Arm Context & Cost Ablation",
            p: "Compare duration and context load across three arms passing through the same verification gate."
          },
          {
            page: "autonomy.html",
            sel: "#halka",
            audio: "full_8_en.mp3",
            tag: "Stop 9 / 10 · Evolution",
            h: "4-Step Closed Evolution Loop",
            p: "Constructive voice Enki and blind judge Enlil test rule candidates without direct communication."
          },
          {
            page: "autonomy.html",
            sel: "#maya",
            audio: "full_9_en.mp3",
            tag: "Stop 10 / 10 · Maya",
            h: "Maya: Daughter of ATLAS · Assistant",
            p: "Review my pre-training and post-training verification benchmarks and response comparisons in this section."
          }
        ]
      },
      {
        id: "clinic",
        label: "2. Clinical & Smile (5 Stops)",
        stops: [
          {
            page: "en.html",
            sel: ".hero figure",
            audio: "clinic_0_en.mp3",
            tag: "Clinical 1 / 5 · Guides",
            h: "Midline & Proportion Guides",
            p: "Schematic guide lines across the six anterior teeth showing midline, zeniths, and tooth proportions."
          },
          {
            page: "en.html",
            sel: "#how .pipe",
            audio: "clinic_1_en.mp3",
            tag: "Clinical 2 / 5 · Workflow",
            h: "From Photos to ExoCAD",
            p: "Two photographs turn into guided previews and an ExoCAD work package upon dentist approval."
          },
          {
            page: "en.html",
            sel: ".sk",
            audio: "clinic_2_en.mp3",
            tag: "Clinical 3 / 5 · 3D Module",
            h: "Live 3D Cephalometric Simulation",
            p: "Compare the 3D cephalometric mesh, untrained AI, and our QLoRA model."
          },
          {
            page: "en.html",
            sel: "#ornek",
            audio: "clinic_3_en.mp3",
            tag: "Clinical 4 / 5 · Compare",
            h: "Before / After Slider",
            p: "Inspect the before and after morphology on retracted and mouth-crop views."
          },
          {
            page: "en.html",
            sel: "#faq",
            audio: "clinic_4_en.mp3",
            tag: "Clinical 5 / 5 · FAQ & Privacy",
            h: "Clinical FAQ & Privacy",
            p: "Answers on required photos, deliverables, and local privacy protection."
          }
        ]
      },
      {
        id: "ai",
        label: "3. Autonomy & Evolution (5 Stops)",
        stops: [
          {
            page: "autonomy.html",
            sel: "#sayac",
            audio: "ai_0_en.mp3",
            tag: "Autonomy 1 / 5 · Counters",
            h: "Live System Counters",
            p: "Hourly updated counters tracking hypotheses and verification gates."
          },
          {
            page: "autonomy.html",
            sel: "#ajanlar",
            audio: "ai_1_en.mp3",
            tag: "Autonomy 2 / 5 · Scorecards",
            h: "Agent Scorecards",
            p: "Performance scorecards for Enkidu, Enki, Enlil, Kalfa, and Spark."
          },
          {
            page: "autonomy.html",
            sel: "#ablasyon",
            audio: "ai_2_en.mp3",
            tag: "Autonomy 3 / 5 · Ablation",
            h: "Context & Cost Ablation",
            p: "Halving execution time while preserving the exact same gate decision."
          },
          {
            page: "autonomy.html",
            sel: "#halka",
            audio: "ai_3_en.mp3",
            tag: "Autonomy 4 / 5 · Evolution",
            h: "Closed Evolution Loop",
            p: "Four-step closed loop evolving the rule set with blind verification."
          },
          {
            page: "autonomy.html",
            sel: "#maya",
            audio: "ai_4_en.mp3",
            tag: "Autonomy 5 / 5 · Maya",
            h: "Maya Training Benchmark",
            p: "Pre-training vs. post-training benchmark and side-by-side response comparison."
          }
        ]
      },
      {
        id: "spark",
        label: "4. Spark & Essays (4 Stops)",
        stops: [
          {
            page: "spark.html",
            sel: "#algoritma",
            audio: "spark_0_en.mp3",
            tag: "Spark 1 / 4 · Procedure",
            h: "7-Step Spark Procedure",
            p: "Generating theses, counter-theses, and falsification tests across independent models."
          },
          {
            page: "spark.html",
            sel: "#karne",
            audio: "spark_1_en.mp3",
            tag: "Spark 2 / 4 · Scorecard",
            h: "49-Round Scorecard",
            p: "Measured performance across 49 multi-agent collision rounds."
          },
          {
            page: "spark.html",
            sel: "#makaleler",
            audio: "spark_2_en.mp3",
            tag: "Spark 3 / 4 · Experiments",
            h: "Experimental Spark Papers",
            p: "Cephalometric QLoRA and Agent Evolution ablation findings."
          },
          {
            page: "blog.html",
            sel: "#yazilar",
            audio: "spark_3_en.mp3",
            tag: "Spark 4 / 4 · Archive",
            h: "All 7 Living Essays",
            p: "Browse the complete collection of our living research papers."
          }
        ]
      }
    ]
  };

  // Eğitimden gelen hızlı konu başlıkları
  var QUICK_TOPICS = {
    tr: [
      { label: "📐 3B Sefalometri", page: "index.html", sel: ".sk", audio: "topic_0_tr.mp3", h: "3B Sefalometrik Morfoloji", p: "478 noktalı 3B yüz ağıyla ZY-ZY ve Go-Go oranlarını ölçer; n=32 testte %100 hedef hat isabeti sağlar." },
      { label: "🦷 441 Diş Formu", page: "index.html", sel: "#otomasyon", audio: "topic_1_tr.mp3", h: "441 Doğal Form Kütüphanesi", p: "Yüz oranlarına göre 441 formluk kütüphaneden 5 öncelikli ve 3 alternatif diş formu gerekçesiyle sıralanır." },
      { label: "🔒 KVKK & Gizlilik", page: "index.html", sel: "#sss", audio: "topic_2_tr.mp3", h: "Kimliksiz Ağız Kırpımı", p: "Tam yüz fotoğrafları cihazdan çıkmaz; dış görsel modele yalnızca kimliksiz ağız kırpımı ve maske gönderilir." },
      { label: "⚡ Kıvılcım (49 Tur)", page: "kivilcim.html", sel: "#algoritma", audio: "topic_3_tr.mp3", h: "7 Basamaklı Kıvılcım Yordamı", p: "Farklı model aileleri birbirini duymadan tez ve düşer testi üretir; uydurma kaynaklar otomatik elenir." },
      { label: "🧬 Evrim Halkası", page: "otonomi.html", sel: "#halka", audio: "topic_4_tr.mp3", h: "4 Adımlı Kapalı Evrim", p: "Enkidu, Enki ve kör yargıç Enlil ile kuralları gölge sınamadan geçirerek evrimleştiren döngü." },
      { label: "🤖 Maya Eğitimi", page: "otonomi.html", sel: "#maya", audio: "topic_5_tr.mp3", h: "Maya: Eğitim Öncesi vs. Sonrası", p: "Atlas tarafından eğitilen asistanınızım; eğitim öncesi ve sonrası yanıt farklarımı bu bölümde görebilirsiniz." },
      { label: "📄 Yüzden Dişe Yazısı", page: "blog/yuzden-dise-sefalometrik-lora.html", sel: "#canli-modul", audio: "topic_6_tr.mp3", h: "Yüzden Dişe: 3B Sefalometrik QLoRA", p: "Eğitimsiz modelin kare çene yanılgısını 478 noktalı 3B ağ ve QLoRA eğitimiyle nasıl çözdüğümüzün makalesi." },
      { label: "🪞 Kim Kimi Eğitiyor", page: "blog/kim-kimi-egitiyor.html", sel: "#bolum-7", audio: "topic_7_tr.mp3", h: "Kim Kimi Eğitiyor? (96 Deney)", p: "Mekanik kapılar olmadan yalnız komutla davranışın değişmediğini gösteren 96 deneylik araştırmamız." },
      { label: "🥃 Viski Analizi", page: "blog/turkiye-viski-dunya-markasi.html", sel: "#bolum-3", audio: "topic_8_tr.mp3", h: "Türkiye'nin Viski Markası Analizi", p: "1963 Ankara Viskisi'nden bugüne vergi asimetrisi, maliyet tabanı ve çıkış yolunu inceleyen 8 sesli Kıvılcım yazısı." }
    ],
    en: [
      { label: "📐 3D Cephalometry", page: "en.html", sel: ".sk", audio: "topic_0_en.mp3", h: "3D Cephalometric Morphology", p: "Measures facial ratios on a 478-point 3D mesh, reaching 100% target line accuracy on 32 test faces." },
      { label: "🦷 441 Tooth Forms", page: "en.html", sel: "#automation", audio: "topic_1_en.mp3", h: "441 Natural Form Library", p: "Ranks 5 primary and 3 alternative tooth forms with clinical rationale based on facial proportions." },
      { label: "🔒 Privacy & Security", page: "en.html", sel: "#faq", audio: "topic_2_en.mp3", h: "Anonymous Mouth-Crop Architecture", p: "Full faces never leave studio devices; only de-identified mouth crops and masks are processed." },
      { label: "⚡ Spark (49 Rounds)", page: "spark.html", sel: "#algoritma", audio: "topic_3_en.mp3", h: "7-Step Spark Procedure", p: "Independent model families generate theses and falsification tests blindly without hearing each other." },
      { label: "🧬 Evolution Loop", page: "autonomy.html", sel: "#halka", audio: "topic_4_en.mp3", h: "4-Step Closed Evolution", p: "Closed loop where Enkidu, Enki, and blind judge Enlil evolve rules through shadow testing." },
      { label: "🤖 Maya Training", page: "autonomy.html", sel: "#maya", audio: "topic_5_en.mp3", h: "Maya: Trained Assistant", p: "Trained by Atlas to guide visitors concisely across the site and leave detailed reading to you." }
    ]
  };

  // Ziyaretçi bir blog makalesi sayfasındaysa o makalenin alt başlıklarından otomatik "Bu Yazıyı Gez" rotası üret
  function buildCurrentArticleRoute() {
    var cur = currentPageRel();
    if (cur.indexOf("blog/") !== 0) return null;
    var heads = document.querySelectorAll("main h2[id], main h3[id], article h2[id], article h3[id]");
    if (!heads || heads.length < 2) return null;
    var stops = [];
    var stepIndices = [0, Math.floor(heads.length * 0.33), Math.floor(heads.length * 0.66), heads.length - 1];
    var used = {};
    for (var i = 0; i < stepIndices.length; i++) {
      var idx = stepIndices[i];
      if (used[idx]) continue;
      used[idx] = true;
      var hEl = heads[idx];
      var id = hEl.getAttribute("id");
      if (!id || id === "kaynaklar" || id === "kaynakca" || id === "sorumluluk") continue;
      var titleText = (hEl.textContent || "").trim();
      var nextP = hEl.nextElementSibling;
      while (nextP && nextP.tagName !== "P" && nextP.tagName !== "DIV") {
        nextP = nextP.nextElementSibling;
      }
      var rawP = nextP ? (nextP.textContent || "").trim().replace(/\s+/g, " ") : "";
      var firstSent = rawP.split(/(?<=[.!?])\s+/)[0] || "Bu bölümdeki ölçüm ve bulguları aşağıda detaylı inceleyebilirsiniz.";
      if (firstSent.length > 165) firstSent = firstSent.slice(0, 162) + "...";
      stops.push({
        page: cur,
        sel: "#" + id,
        audio: cur.indexOf("yuzden-dise") >= 0 ? "topic_6_tr.mp3" : (cur.indexOf("kim-kimi") >= 0 ? "topic_7_tr.mp3" : "topic_8_tr.mp3"),
        tag: "Bölüm " + (stops.length + 1) + " · Makale Turu",
        h: titleText.slice(0, 68),
        p: firstSent
      });
    }
    if (!stops.length) return null;
    return {
      id: "article_local",
      label: "📄 Bu Yazıyı Gez (" + stops.length + " Bölüm)",
      stops: stops
    };
  }

  var baseRoutes = isEn ? ROUTES.en.slice() : ROUTES.tr.slice();
  var articleRoute = buildCurrentArticleRoute();
  if (articleRoute) {
    baseRoutes.unshift(articleRoute);
  }
  var routeList = baseRoutes;
  var topicList = isEn ? QUICK_TOPICS.en : QUICK_TOPICS.tr;

  var state = {
    open: false,
    routeId: articleRoute ? "article_local" : "full",
    stepIdx: 0,
    showRoutes: false,
    showTopics: false,
    autoPlay: false,
    voiceEnabled: true,
    posX: Math.max(16, window.innerWidth - 385),
    posY: Math.max(70, window.innerHeight - 100)
  };

  var autoTimer = null;
  var currentSpotEl = null;
  var lookTargetX = 0;
  var lookTargetY = 0;
  var exprPulse = 0;
  var knowledgeIndex = null;

  function getRoute(id) {
    for (var i = 0; i < routeList.length; i++) {
      if (routeList[i].id === id) return routeList[i];
    }
    return routeList[0];
  }

  function findBestRouteAndStepForCurrentPage() {
    var cur = currentPageRel();
    var curHash = (location.hash || "").trim();
    if (articleRoute && samePage(cur, articleRoute.stops[0].page)) {
      if (curHash) {
        for (var a = 0; a < articleRoute.stops.length; a++) {
          if (articleRoute.stops[a].sel === curHash) return { routeId: articleRoute.id, stepIdx: a };
        }
      }
      return { routeId: articleRoute.id, stepIdx: 0 };
    }
    if (curHash) {
      for (var rh = 0; rh < routeList.length; rh++) {
        var hStops = routeList[rh].stops;
        for (var sh = 0; sh < hStops.length; sh++) {
          if (samePage(hStops[sh].page, cur) && hStops[sh].sel === curHash) {
            return { routeId: routeList[rh].id, stepIdx: sh };
          }
        }
      }
    }
    for (var r = 0; r < routeList.length; r++) {
      var stops = routeList[r].stops;
      for (var s = 0; s < stops.length; s++) {
        if (samePage(stops[s].page, cur)) {
          return { routeId: routeList[r].id, stepIdx: s };
        }
      }
    }
    return { routeId: routeList[0].id, stepIdx: 0 };
  }

  function saveState(customOverride) {
    try {
      var payload = customOverride || {
        open: state.open,
        routeId: state.routeId,
        stepIdx: state.stepIdx,
        autoPlay: state.autoPlay,
        voiceEnabled: state.voiceEnabled,
        ts: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
  }

  function loadState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - (parsed.ts || 0) > 20 * 60 * 1000) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  // DOM Kurulumu
  var carrier = document.createElement("div");
  carrier.className = "maya-carrier bubble-left";
  carrier.id = "maya-carrier";

  carrier.innerHTML =
    '<div class="maya-orb-wrap" id="maya-orb" title="' + (isEn ? "Maya — Daughter of ATLAS · Assistant (Drag or click)" : "Maya — ATLAS\'ın Kızı · Asistan (Sürükle veya tıkla)") + '">' +
      '<div class="maya-orb-clip" id="maya-orb-clip">' +
        '<canvas id="maya-sprite-canvas" width="256" height="256"></canvas>' +
      '</div>' +
      '<span class="maya-orb-status"></span>' +
      '<span class="maya-orb-badge">' + (isEn ? "Maya · AI" : "Maya · Asistan") + '</span>' +
    '</div>' +
    '<button type="button" class="maya-mini-pill" id="maya-mini-pill">' +
      '<span>' + (isEn ? "Maya · ATLAS Assistant" : "Maya · ATLAS Asistanı") + '</span>' +
      '<span class="maya-pill-sub">' + (isEn ? "▶ Tour & Guide" : "▶ Tur & Rehber") + '</span>' +
    '</button>' +
    '<div class="maya-bubble" id="maya-bubble" hidden>' +
      '<div class="maya-b-head">' +
        '<div class="maya-b-title">' + (isEn ? "Maya · ATLAS Assistant" : "Maya — ATLAS\'ın Kızı · Asistan") + '</div>' +
        '<div class="maya-b-controls">' +
          '<button type="button" class="maya-icon-btn active" id="maya-btn-voice" title="' + (isEn ? "Voice On/Off" : "Sesli Anlatım Aç/Kapat") + '">🔊</button>' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-topics" title="' + (isEn ? "Jump to Topic" : "Konuya Git / Ara") + '">' + (isEn ? "Topics" : "Konular") + '</button>' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-routes" title="' + (isEn ? "Choose Route" : "Tur Rotası") + '">' + (isEn ? "Routes" : "Rotalar") + '</button>' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-auto" title="' + (isEn ? "Auto-scroll tour" : "Otomatik gezdir") + '">' + (isEn ? "Auto ▶" : "Oto ▶") + '</button>' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-close" title="' + (isEn ? "Minimize" : "Küçült") + '">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="maya-routes" id="maya-routes-bar" hidden></div>' +
      '<div class="maya-topics" id="maya-topics-bar" hidden></div>' +
      '<div class="maya-dots" id="maya-dots"></div>' +
      '<div class="maya-step-tag" id="maya-step-tag"></div>' +
      '<h4 class="maya-step-h" id="maya-step-h"></h4>' +
      '<p class="maya-step-p" id="maya-step-p"></p>' +
      '<div class="maya-b-foot">' +
        '<button type="button" class="maya-btn-sm" id="maya-btn-prev">◀</button>' +
        '<button type="button" class="maya-btn-sm" id="maya-btn-ask">' + (isEn ? "Search / Topics ▾" : "Konu Seç / Ara ▾") + '</button>' +
        '<button type="button" class="maya-btn-sm pri" id="maya-btn-next">' + (isEn ? "Next Stop ▶" : "Sonraki ▶") + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(carrier);

  var orbEl = document.getElementById("maya-orb");
  var orbClip = document.getElementById("maya-orb-clip");
  var miniPill = document.getElementById("maya-mini-pill");
  var bubbleEl = document.getElementById("maya-bubble");
  var routesBar = document.getElementById("maya-routes-bar");
  var topicsBar = document.getElementById("maya-topics-bar");
  var dotsEl = document.getElementById("maya-dots");
  var tagEl = document.getElementById("maya-step-tag");
  var hEl = document.getElementById("maya-step-h");
  var pEl = document.getElementById("maya-step-p");
  var btnVoice = document.getElementById("maya-btn-voice");
  var btnTopics = document.getElementById("maya-btn-topics");
  var btnRoutes = document.getElementById("maya-btn-routes");
  var btnAuto = document.getElementById("maya-btn-auto");
  var btnClose = document.getElementById("maya-btn-close");
  var btnPrev = document.getElementById("maya-btn-prev");
  var btnAsk = document.getElementById("maya-btn-ask");
  var btnNext = document.getElementById("maya-btn-next");

  // 2. Stüdyo Nöral Ses (.mp3) + WebAudio Gerçek Zamanlı Dudak Senkronu Motoru
  var audioEl = new Audio();
  audioEl.preload = "auto";
  audioEl.crossOrigin = "anonymous";
  var audioCtx = null;
  var analyser = null;
  var freqData = null;
  var sourceConnected = false;
  var isSpeaking = false;
  var speechLevel = 0;
  var currentAudioFile = null;

  function ensureAudioGraph() {
    if (sourceConnected) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.65;
      var src = audioCtx.createMediaElementSource(audioEl);
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
      freqData = new Uint8Array(analyser.frequencyBinCount);
      sourceConnected = true;
    } catch (e) {}
  }

  function stopVoice() {
    try {
      audioEl.pause();
      audioEl.currentTime = 0;
    } catch (e) {}
    isSpeaking = false;
    speechLevel = 0;
    orbEl.classList.remove("is-speaking");
  }

  function playStepAudio(audioFile) {
    currentAudioFile = audioFile || null;
    stopVoice();
    if (!state.voiceEnabled || !state.open || !audioFile) return;
    try {
      ensureAudioGraph();
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(function () {});
      }
      audioEl.src = assetPrefix + "ornek/maya/audio/" + audioFile;
      var pr = audioEl.play();
      if (pr && typeof pr.then === "function") {
        pr.then(function () {
          isSpeaking = true;
          orbEl.classList.add("is-speaking");
        }).catch(function () {
          isSpeaking = false;
          orbEl.classList.remove("is-speaking");
        });
      }
    } catch (e) {}
  }

  audioEl.addEventListener("play", function () {
    isSpeaking = true;
    orbEl.classList.add("is-speaking");
  });

  audioEl.addEventListener("ended", function () {
    isSpeaking = false;
    speechLevel = 0;
    orbEl.classList.remove("is-speaking");
    if (state.autoPlay && state.open) {
      if (autoTimer) clearTimeout(autoTimer);
      autoTimer = setTimeout(function () {
        if (!state.autoPlay || !state.open) return;
        advanceAutoStep();
      }, 1700);
    }
  });

  audioEl.addEventListener("pause", function () {
    isSpeaking = false;
    speechLevel = 0;
    orbEl.classList.remove("is-speaking");
  });

  btnVoice.addEventListener("click", function () {
    state.voiceEnabled = !state.voiceEnabled;
    btnVoice.classList.toggle("active", state.voiceEnabled);
    btnVoice.textContent = state.voiceEnabled ? "🔊" : "🔇";
    saveState();
    if (state.voiceEnabled && currentAudioFile) {
      playStepAudio(currentAudioFile);
    } else {
      stopVoice();
    }
  });

  // 3. Taşıyıcı Konumlandırma ve Sürükleme
  function setCarrierPos(x, y, bubbleOnLeft) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var rect = carrier.getBoundingClientRect();
    var w = rect.width || (state.open ? 385 : 250);
    var h = rect.height || (state.open ? 190 : 80);

    var clampedX = Math.max(10, Math.min(vw - w - 10, x));
    var clampedY = Math.max(62, Math.min(vh - h - 12, y));

    state.posX = clampedX;
    state.posY = clampedY;

    if (bubbleOnLeft) {
      carrier.classList.add("bubble-left");
    } else {
      carrier.classList.remove("bubble-left");
    }
    carrier.style.transform = "translate3d(" + Math.round(clampedX) + "px, " + Math.round(clampedY) + "px, 0)";
  }

  function parkBottomRight() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var w = state.open ? Math.min(390, vw - 20) : 255;
    var h = state.open ? (bubbleEl.offsetHeight || 195) : 80;
    setCarrierPos(vw - w - 16, vh - h - 16, true);
  }

  var dragInfo = null;
  orbEl.addEventListener("pointerdown", function (ev) {
    dragInfo = {
      startX: ev.clientX,
      startY: ev.clientY,
      origX: state.posX,
      origY: state.posY,
      moved: false
    };
    orbEl.setPointerCapture(ev.pointerId);
    carrier.classList.add("is-dragging");
  });

  orbEl.addEventListener("pointermove", function (ev) {
    if (!dragInfo) return;
    var dx = ev.clientX - dragInfo.startX;
    var dy = ev.clientY - dragInfo.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragInfo.moved = true;
    }
    if (dragInfo.moved) {
      var onLeft = (dragInfo.origX + dx) > window.innerWidth * 0.45;
      setCarrierPos(dragInfo.origX + dx, dragInfo.origY + dy, onLeft);
    }
  });

  orbEl.addEventListener("pointerup", function (ev) {
    if (!dragInfo) return;
    var wasMoved = dragInfo.moved;
    dragInfo = null;
    carrier.classList.remove("is-dragging");
    try { orbEl.releasePointerCapture(ev.pointerId); } catch (e) {}
    if (!wasMoved) {
      if (!state.open) {
        startOrOpenTour();
      } else {
        minimizeTour();
      }
    }
  });

  miniPill.addEventListener("click", function () {
    startOrOpenTour();
  });

  // 4. Rotalar ve Eğitim Ağacından Anlık Arama (131 Düğüm)
  function renderRouteChips() {
    routesBar.innerHTML = "";
    routeList.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "maya-route-chip" + (r.id === state.routeId ? " active" : "");
      b.textContent = r.label;
      b.addEventListener("click", function () {
        state.routeId = r.id;
        state.stepIdx = 0;
        state.showRoutes = false;
        routesBar.hidden = true;
        btnRoutes.classList.remove("active");
        // Rota seçildiğinde başka sayfadaysa oraya doğrudan geç (allowPageNav = true)
        goToCurrentStop(true, true);
      });
      routesBar.appendChild(b);
    });
  }

  function normTr(s) {
    return (s || "").toLowerCase()
      .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9\s]/g, " ").trim();
  }

  function ensureKnowledgeLoaded(cb) {
    if (knowledgeIndex) {
      cb(knowledgeIndex);
      return;
    }
    fetch(assetPrefix + "ornek/maya/maya-bilgi-haritasi.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        knowledgeIndex = Array.isArray(data) ? data : [];
        cb(knowledgeIndex);
      })
      .catch(function () {
        knowledgeIndex = [];
        cb(knowledgeIndex);
      });
  }

  function renderTopicChips(filterQuery) {
    var existingInput = document.getElementById("maya-topic-search");
    var qVal = typeof filterQuery === "string" ? filterQuery : (existingInput ? existingInput.value : "");
    topicsBar.innerHTML = "";

    var input = document.createElement("input");
    input.type = "search";
    input.id = "maya-topic-search";
    input.className = "maya-search-input";
    input.placeholder = isEn ? "🔍 Search any topic on the site..." : "🔍 Sitede konu ara (ör. kare çene, viski, Enlil, KVKK)...";
    input.value = qVal;
    input.addEventListener("input", function () {
      var val = input.value;
      if (val.trim().length >= 2) {
        ensureKnowledgeLoaded(function () {
          renderSearchResults(val);
        });
      } else {
        renderDefaultTopicButtons();
      }
    });
    topicsBar.appendChild(input);

    var resultsWrap = document.createElement("div");
    resultsWrap.id = "maya-topic-results";
    resultsWrap.style.display = "flex";
    resultsWrap.style.flexWrap = "wrap";
    resultsWrap.style.gap = "4px";
    resultsWrap.style.width = "100%";
    topicsBar.appendChild(resultsWrap);

    function renderDefaultTopicButtons() {
      resultsWrap.innerHTML = "";
      topicList.forEach(function (tp) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "maya-route-chip";
        b.textContent = tp.label;
        b.addEventListener("click", function () {
          state.showTopics = false;
          topicsBar.hidden = true;
          btnTopics.classList.remove("active");
          jumpToQuickTopic(tp);
        });
        resultsWrap.appendChild(b);
      });
    }

    function renderSearchResults(q) {
      resultsWrap.innerHTML = "";
      var nq = normTr(q);
      var words = nq.split(/\s+/).filter(Boolean);
      var scored = [];

      // Önce hızlı konular
      topicList.forEach(function (tp) {
        var hay = normTr(tp.label + " " + tp.h + " " + tp.p);
        var sc = 0;
        words.forEach(function (w) {
          if (hay.indexOf(w) >= 0) sc += 3;
        });
        if (sc > 0) scored.push({ score: sc + 1, item: tp });
      });

      // Ardından 131 düğümlü eğitim haritası
      (knowledgeIndex || []).forEach(function (entry) {
        var hay = entry.kw || normTr(entry.h + " " + entry.p);
        var sc = 0;
        words.forEach(function (w) {
          if (normTr(entry.h).indexOf(w) >= 0) sc += 3;
          else if (hay.indexOf(w) >= 0) sc += 1;
        });
        if (sc > 0) {
          scored.push({
            score: sc,
            item: {
              label: "📍 " + entry.h,
              page: entry.page,
              sel: entry.sel,
              audio: null,
              h: entry.h,
              p: entry.p
            }
          });
        }
      });

      scored.sort(function (a, b) { return b.score - a.score; });
      var top = scored.slice(0, 5);
      if (!top.length) {
        var empty = document.createElement("div");
        empty.style.fontSize = "10.5px";
        empty.style.color = "#94a3b8";
        empty.style.padding = "2px 4px";
        empty.textContent = isEn ? "No matching section found." : "Eşleşen bölüm bulunamadı; yakın konular için anahtar kelimeyi kısaltın.";
        resultsWrap.appendChild(empty);
        return;
      }

      top.forEach(function (entry) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "maya-route-chip full-row";
        b.textContent = entry.item.label;
        b.addEventListener("click", function () {
          state.showTopics = false;
          topicsBar.hidden = true;
          btnTopics.classList.remove("active");
          jumpToQuickTopic(entry.item);
        });
        resultsWrap.appendChild(b);
      });
    }

    renderDefaultTopicButtons();
  }

  function jumpToQuickTopic(tp) {
    var curPage = currentPageRel();
    if (tp.page && !samePage(tp.page, curPage)) {
      saveState({
        open: true,
        routeId: state.routeId,
        stepIdx: state.stepIdx,
        voiceEnabled: state.voiceEnabled,
        quickTopic: tp,
        ts: Date.now()
      });
      location.href = resolveHref(tp.page) + (tp.sel && tp.sel.charAt(0) === "#" ? tp.sel.split(" ")[0] : "");
      return;
    }
    tagEl.textContent = isEn ? "Selected Topic" : "Seçilen Bölüm — Detaylar Sayfada";
    hEl.textContent = tp.h;
    pEl.textContent = tp.p;
    playStepAudio(tp.audio);
    var targetEl = tp.sel ? document.querySelector(tp.sel) : null;
    glideToElement(targetEl);
  }

  function clearSpotlight() {
    if (currentSpotEl) {
      currentSpotEl.classList.remove("maya-spot-target");
      currentSpotEl = null;
    }
  }

  function glideToElement(el) {
    if (!el) {
      parkBottomRight();
      return;
    }
    clearSpotlight();
    currentSpotEl = el;
    el.classList.add("maya-spot-target");

    var rect = el.getBoundingClientRect();
    var absTop = window.pageYOffset + rect.top;
    var targetScrollY = Math.max(0, absTop - Math.max(105, (window.innerHeight - Math.min(rect.height, 400)) * 0.36));

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });

    setTimeout(function () {
      if (!state.open) return;
      var r = el.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var carrierW = Math.min(390, vw - 20);
      var carrierH = bubbleEl.offsetHeight || 195;

      var targetY = Math.max(72, Math.min(vh - carrierH - 16, r.top + Math.min(36, r.height * 0.14)));
      var targetX;
      var bubbleOnLeft = true;

      if (vw < 760) {
        targetX = vw - carrierW - 10;
        targetY = vh - carrierH - 12;
        bubbleOnLeft = true;
        lookTargetX = 0;
      } else if (r.right + carrierW + 20 < vw) {
        targetX = r.right + 14;
        bubbleOnLeft = false;
        lookTargetX = -0.45;
      } else if (r.left - carrierW - 20 > 0) {
        targetX = r.left - carrierW - 14;
        bubbleOnLeft = true;
        lookTargetX = 0.45;
      } else {
        targetX = vw - carrierW - 18;
        bubbleOnLeft = true;
        lookTargetX = -0.32;
      }

      exprPulse = 1.0;
      setCarrierPos(targetX, targetY, bubbleOnLeft);
    }, 260);
  }

  function renderDots(total, activeIdx) {
    dotsEl.innerHTML = "";
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var d = document.createElement("span");
        d.className = "maya-dot" + (idx < activeIdx ? " done" : "") + (idx === activeIdx ? " active" : "");
        d.title = (isEn ? "Stop " : "Durak ") + (idx + 1);
        d.addEventListener("click", function () {
          state.stepIdx = idx;
          // Noktaya tıklandığında farklı sayfadaysa oraya git (allowPageNav = true)
          goToCurrentStop(true, true);
        });
        dotsEl.appendChild(d);
      })(i);
    }
  }

  function goToCurrentStop(scrollAndGlide, allowPageNav) {
    var route = getRoute(state.routeId);
    if (!route || !route.stops.length) return;
    if (state.stepIdx < 0) state.stepIdx = 0;
    if (state.stepIdx >= route.stops.length) state.stepIdx = 0;

    var curPage = currentPageRel();
    var stop = route.stops[state.stepIdx];

    if (stop.page && !samePage(stop.page, curPage)) {
      if (allowPageNav) {
        saveState();
        location.href = resolveHref(stop.page) + (stop.sel && stop.sel.charAt(0) === "#" ? stop.sel.split(" ")[0] : "");
        return;
      } else {
        // Bu rotada mevcut sayfaya (ve varsa #hash hedefine) ait durak var mı?
        var curHash = (location.hash || "").trim();
        var foundIdx = -1;
        if (curHash) {
          for (var hIdx = 0; hIdx < route.stops.length; hIdx++) {
            if (samePage(route.stops[hIdx].page, curPage) && route.stops[hIdx].sel === curHash) {
              foundIdx = hIdx;
              break;
            }
          }
        }
        if (foundIdx < 0) {
          for (var i = 0; i < route.stops.length; i++) {
            if (samePage(route.stops[i].page, curPage)) {
              foundIdx = i;
              break;
            }
          }
        }
        if (foundIdx >= 0) {
          state.stepIdx = foundIdx;
          stop = route.stops[state.stepIdx];
        } else {
          // Mevcut sayfaya uygun en iyi rotaya ve durağa otomatik geç (ASLA turu kapatma)
          var best = findBestRouteAndStepForCurrentPage();
          state.routeId = best.routeId;
          state.stepIdx = best.stepIdx;
          route = getRoute(state.routeId);
          stop = route.stops[state.stepIdx];
        }
      }
    }

    renderRouteChips();
    if (!topicsBar.hidden) renderTopicChips();
    renderDots(route.stops.length, state.stepIdx);

    tagEl.textContent = stop.tag;
    hEl.textContent = stop.h;
    pEl.textContent = stop.p;

    saveState();

    if (scrollAndGlide) {
      playStepAudio(stop.audio);
      var targetEl = stop.sel ? document.querySelector(stop.sel) : null;
      glideToElement(targetEl);
    }
  }

  function startOrOpenTour(optionalRouteId) {
    if (optionalRouteId) {
      state.routeId = optionalRouteId;
      state.stepIdx = 0;
    } else {
      var curRoute = getRoute(state.routeId);
      var curStop = curRoute.stops[state.stepIdx] || curRoute.stops[0];
      if (!samePage(curStop.page, currentPageRel())) {
        var best = findBestRouteAndStepForCurrentPage();
        state.routeId = best.routeId;
        state.stepIdx = best.stepIdx;
      }
    }
    state.open = true;
    miniPill.hidden = true;
    bubbleEl.hidden = false;
    goToCurrentStop(true, !!optionalRouteId);
  }

  function minimizeTour() {
    state.open = false;
    state.autoPlay = false;
    stopVoice();
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
    btnAuto.classList.remove("active");
    btnAuto.textContent = isEn ? "Auto ▶" : "Oto ▶";
    bubbleEl.hidden = true;
    miniPill.hidden = false;
    clearSpotlight();
    saveState();
    parkBottomRight();
  }

  function advanceAutoStep() {
    var route = getRoute(state.routeId);
    if (state.stepIdx + 1 < route.stops.length) {
      state.stepIdx++;
      goToCurrentStop(true, true);
      if (!state.voiceEnabled) {
        autoTimer = setTimeout(advanceAutoStep, 5200);
      }
    } else {
      state.autoPlay = false;
      btnAuto.classList.remove("active");
      btnAuto.textContent = isEn ? "Auto ▶" : "Oto ▶";
      saveState();
    }
  }

  function toggleAutoPlay() {
    state.autoPlay = !state.autoPlay;
    btnAuto.classList.toggle("active", state.autoPlay);
    btnAuto.textContent = state.autoPlay ? (isEn ? "Auto ⏸" : "Oto ⏸") : (isEn ? "Auto ▶" : "Oto ▶");
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
    if (state.autoPlay) {
      if (!isSpeaking) {
        var route = getRoute(state.routeId);
        var stop = route.stops[state.stepIdx];
        if (state.voiceEnabled && stop && stop.audio) {
          playStepAudio(stop.audio);
        } else {
          autoTimer = setTimeout(advanceAutoStep, 4800);
        }
      }
    }
    saveState();
  }

  function toggleTopicsMenu() {
    state.showTopics = !state.showTopics;
    if (state.showTopics) {
      state.showRoutes = false;
      routesBar.hidden = true;
      btnRoutes.classList.remove("active");
      renderTopicChips("");
      setTimeout(function () {
        var inp = document.getElementById("maya-topic-search");
        if (inp) inp.focus();
      }, 40);
    }
    topicsBar.hidden = !state.showTopics;
    btnTopics.classList.toggle("active", state.showTopics);
  }

  btnTopics.addEventListener("click", toggleTopicsMenu);
  btnAsk.addEventListener("click", toggleTopicsMenu);

  btnRoutes.addEventListener("click", function () {
    state.showRoutes = !state.showRoutes;
    if (state.showRoutes) {
      state.showTopics = false;
      topicsBar.hidden = true;
      btnTopics.classList.remove("active");
      renderRouteChips();
    }
    routesBar.hidden = !state.showRoutes;
    btnRoutes.classList.toggle("active", state.showRoutes);
  });

  btnAuto.addEventListener("click", toggleAutoPlay);
  btnClose.addEventListener("click", minimizeTour);

  btnPrev.addEventListener("click", function () {
    var route = getRoute(state.routeId);
    state.stepIdx = (state.stepIdx - 1 + route.stops.length) % route.stops.length;
    goToCurrentStop(true, true);
  });

  btnNext.addEventListener("click", function () {
    var route = getRoute(state.routeId);
    state.stepIdx = (state.stepIdx + 1) % route.stops.length;
    goToCurrentStop(true, true);
  });

  window.addEventListener("resize", function () {
    if (!state.open) {
      parkBottomRight();
    } else {
      setCarrierPos(state.posX, state.posY, carrier.classList.contains("bubble-left"));
    }
  });

  // 5. Birleşik Fotogerçekçi Portre + 6 Kare Viseme Kanvası + Blender 5.1.0 Birleşik 3B Rölyef Ağı
  // ("Avatar ve resim farklı gibi" sorununu kökten çözer: ayrı yüz maskesi yoktur; portreyle %100 aynı dokuyu taşır)
  var spriteCanvas = document.getElementById("maya-sprite-canvas");
  var sCtx = spriteCanvas.getContext("2d");
  var spriteImg = new Image();
  var spriteLoaded = false;
  spriteImg.onload = function () {
    spriteLoaded = true;
  };
  spriteImg.src = assetPrefix + "ornek/maya/maya-sprite.jpg";

  var threeReady = false;
  var threeMesh = null;
  var threeRenderer = null;
  var threeScene = null;
  var threeCamera = null;
  var canvasTex = null;

  function initThreeAvatar() {
    var scriptMap = document.createElement("script");
    scriptMap.type = "importmap";
    scriptMap.textContent = JSON.stringify({
      imports: {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
      }
    });
    document.head.appendChild(scriptMap);

    var modScript = document.createElement("script");
    modScript.type = "module";
    modScript.textContent = [
      'import * as THREE from "three";',
      'import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";',
      'window.__initMayaThree && window.__initMayaThree(THREE, GLTFLoader);'
    ].join("\n");

    window.__initMayaThree = function (THREE, GLTFLoader) {
      try {
        var w = 152, h = 152;
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
        camera.position.set(0, 0.0, 4.15);

        scene.add(new THREE.AmbientLight(0xffffff, 1.55));
        var keyLight = new THREE.DirectionalLight(0xfffaf0, 0.45);
        keyLight.position.set(1.0, 1.2, 2.5);
        scene.add(keyLight);

        canvasTex = new THREE.CanvasTexture(spriteCanvas);
        canvasTex.colorSpace = THREE.SRGBColorSpace;
        canvasTex.flipY = false;

        var loader = new GLTFLoader();
        loader.load(assetPrefix + "ornek/maya/maya-3d.glb?v=1016f", function (gltf) {
          var root = gltf.scene;
          scene.add(root);
          root.traverse(function (node) {
            if (node.isMesh) {
              threeMesh = node;
              node.material = new THREE.MeshBasicMaterial({
                map: canvasTex,
                morphTargets: true
              });
            }
          });
          renderer.domElement.style.zIndex = "2";
          orbClip.appendChild(renderer.domElement);
          spriteCanvas.style.opacity = "0";
          threeRenderer = renderer;
          threeScene = scene;
          threeCamera = camera;
          threeReady = true;
        });
      } catch (e) {}
    };

    document.head.appendChild(modScript);
  }

  var mouseNormX = 0;
  var mouseNormY = 0;
  window.addEventListener("pointermove", function (ev) {
    mouseNormX = ((ev.clientX / Math.max(1, window.innerWidth)) - 0.5) * 2;
    mouseNormY = ((ev.clientY / Math.max(1, window.innerHeight)) - 0.5) * 2;
  }, { passive: true });

  var blinkNextAt = performance.now() + 2400;
  var blinkEndAt = 0;

  function sampleVoiceLevel(now) {
    if (!isSpeaking) {
      speechLevel *= 0.82;
      return speechLevel;
    }
    if (analyser && freqData) {
      analyser.getByteFrequencyData(freqData);
      var sum = 0;
      for (var i = 2; i < 24; i++) {
        sum += freqData[i];
      }
      var avg = sum / (22 * 255);
      var target = Math.min(1.0, avg * 2.4);
      speechLevel = speechLevel * 0.55 + target * 0.45;
      return speechLevel;
    }
    speechLevel = 0.35 + 0.35 * Math.abs(Math.sin(now * 0.014)) * Math.cos(now * 0.009);
    return speechLevel;
  }

  function animateAvatar(now) {
    requestAnimationFrame(animateAvatar);
    var t = now * 0.001;
    var vLevel = sampleVoiceLevel(now);

    var blinkVal = 0;
    if (now >= blinkNextAt) {
      blinkEndAt = now + 155;
      blinkNextAt = now + 2800 + Math.random() * 2400;
    }
    if (now < blinkEndAt) {
      var p = 1 - (blinkEndAt - now) / 155;
      blinkVal = Math.sin(p * Math.PI);
    }

    if (exprPulse > 0.01) {
      exprPulse *= 0.95;
    } else {
      exprPulse = 0;
    }

    // 1. Fotogerçekçi 6 Kare Sprite Kanvasını (maya-sprite.jpg) Ses ve Göz Kırpmaya Göre Çiz
    if (spriteLoaded) {
      var frameW = spriteImg.width / 6;
      var frameH = spriteImg.height;
      sCtx.clearRect(0, 0, 256, 256);

      // Taban kare: Nötr Portre (Kare 0 — otonomi.html'deki portre ile %100 aynı)
      sCtx.globalAlpha = 1.0;
      sCtx.drawImage(spriteImg, 0, 0, frameW, frameH, 0, 0, 256, 256);

      if (isSpeaking && vLevel > 0.06) {
        // Konuşurken ses şiddetine göre viseme karelerini (Kare 2: hafif açık, Kare 4: orta açık, Kare 3: tam açık) yumuşak harmanla
        var talkFrame = vLevel > 0.46 ? 3 : (vLevel > 0.22 ? 4 : 2);
        sCtx.globalAlpha = Math.min(0.95, 0.35 + vLevel * 0.85);
        sCtx.drawImage(spriteImg, talkFrame * frameW, 0, frameW, frameH, 0, 0, 256, 256);
      } else if (exprPulse > 0.22) {
        // Yeni durağa vardığında sıcak tebessüm (Kare 5)
        sCtx.globalAlpha = Math.min(0.85, exprPulse * 0.9);
        sCtx.drawImage(spriteImg, 5 * frameW, 0, frameW, frameH, 0, 0, 256, 256);
      }

      if (blinkVal > 0.25) {
        // Göz kırpma (Kare 1)
        sCtx.globalAlpha = Math.min(1.0, blinkVal);
        sCtx.drawImage(spriteImg, 1 * frameW, 0, frameW, frameH, 0, 0, 256, 256);
      }
      sCtx.globalAlpha = 1.0;

      if (canvasTex) {
        canvasTex.needsUpdate = true;
      }
    }

    // 2. Birleşik 3B Blender Ağı (MayaUnifiedHead) üzerinde kenarları sabit tutarak 3B Baş Dönüşü ve Çene Hareketi
    if (threeReady && threeMesh && threeRenderer) {
      var dict = threeMesh.morphTargetDictionary || {};
      var infl = threeMesh.morphTargetInfluences;
      if (infl) {
        if (dict.Blink !== undefined) infl[dict.Blink] = blinkVal * 0.5;
        if (dict.JawOpen !== undefined) infl[dict.JawOpen] = isSpeaking ? (vLevel * 0.65) : (0.06 * exprPulse);
        if (dict.MouthSmile !== undefined) infl[dict.MouthSmile] = 0.20 + 0.45 * exprPulse + 0.08 * Math.sin(t * 1.5);
        if (dict.BrowRaise !== undefined) infl[dict.BrowRaise] = (isSpeaking ? vLevel * 0.35 : 0) + 0.30 * exprPulse;
        if (dict.HeadTurn !== undefined) {
          var targetTurn = (lookTargetX * 0.55) + (mouseNormX * 0.35) + Math.sin(t * 0.85) * 0.15;
          infl[dict.HeadTurn] += (targetTurn - infl[dict.HeadTurn]) * 0.08;
        }
        if (dict.HeadNod !== undefined) {
          var targetNod = (lookTargetY * 0.35) + (mouseNormY * 0.25) + Math.cos(t * 1.3) * 0.12;
          infl[dict.HeadNod] += (targetNod - infl[dict.HeadNod]) * 0.08;
        }
      }
      threeRenderer.render(threeScene, threeCamera);
    }
  }

  parkBottomRight();
  initThreeAvatar();
  requestAnimationFrame(animateAvatar);

  var saved = loadState();
  if (saved) {
    if (typeof saved.voiceEnabled === "boolean") {
      state.voiceEnabled = saved.voiceEnabled;
      btnVoice.classList.toggle("active", state.voiceEnabled);
      btnVoice.textContent = state.voiceEnabled ? "🔊" : "🔇";
    }
    if (saved.open) {
      state.routeId = saved.routeId || (articleRoute ? "article_local" : "full");
      state.stepIdx = saved.stepIdx || 0;
      state.autoPlay = !!saved.autoPlay;
      setTimeout(function () {
        if (saved.quickTopic) {
          var qt = saved.quickTopic;
          saveState();
          state.open = true;
          miniPill.hidden = true;
          bubbleEl.hidden = false;
          renderRouteChips();
          jumpToQuickTopic(qt);
        } else {
          state.open = true;
          miniPill.hidden = true;
          bubbleEl.hidden = false;
          goToCurrentStop(true, false);
          if (state.autoPlay) {
            state.autoPlay = false;
            toggleAutoPlay();
          }
        }
      }, 320);
    }
  }

  window.AtlasMaya = {
    startTour: function (routeId) {
      startOrOpenTour(routeId || "full");
    },
    minimize: minimizeTour
  };
})();
