/**
 * Maya — ATLAS'ın Kızı · Asistan
 * Serbest Gezen 3B Avatar (Blender 5.1.0 GLB + Three.js WebGL + 60fps Kanvas)
 * ve Sayfayı Otomatik Kaydıran, Eğitim Bilgisinden Kısa Özet Veren Site Rehberi.
 */
(function () {
  "use strict";

  if (document.getElementById("maya-carrier")) return;

  // 1. Kritik CSS'i doğrudan <head> içine göm (Stil dosyası gecikse veya önbellekte kalsa bile ASLA sayfa altında veya tam ekran açılmaz)
  var inlineStyle = document.createElement("style");
  inlineStyle.id = "maya-inline-css";
  inlineStyle.textContent = [
    ":root{--maya-bg:rgba(11,17,30,0.92);--maya-border:rgba(0,229,255,0.38);--maya-cyan:#00e5ff;--maya-emerald:#10b981;--maya-text:#f1f5f9;--maya-shadow:0 14px 36px rgba(0,0,0,0.52),0 0 22px rgba(0,229,255,0.16);}",
    ".maya-carrier{position:fixed!important;left:0;top:0;z-index:9998!important;display:flex!important;align-items:flex-end;gap:10px;pointer-events:none;transition:transform 0.72s cubic-bezier(0.22,1,0.36,1);will-change:transform;font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,sans-serif;max-width:96vw;}",
    ".maya-carrier.is-dragging{transition:none!important;}",
    ".maya-carrier.bubble-left{flex-direction:row-reverse;}",
    ".maya-orb-wrap{position:relative;width:74px!important;height:74px!important;min-width:74px;min-height:74px;max-width:74px;max-height:74px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#162238,#090e1a);border:2px solid var(--maya-cyan);box-shadow:var(--maya-shadow);cursor:grab;pointer-events:auto;flex-shrink:0;user-select:none;touch-action:none;transition:transform 0.22s ease,box-shadow 0.22s ease;}",
    ".maya-orb-wrap:hover{transform:scale(1.05);}",
    ".maya-orb-clip{width:100%!important;height:100%!important;border-radius:50%;overflow:hidden;position:relative;}",
    ".maya-orb-clip canvas,.maya-orb-clip img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover;display:block;}",
    ".maya-orb-badge{position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);background:rgba(11,17,30,0.96);border:1px solid rgba(0,229,255,0.48);color:var(--maya-cyan);font-size:9.5px;font-weight:700;letter-spacing:0.03em;padding:1px 6px;border-radius:999px;white-space:nowrap;pointer-events:none;}",
    ".maya-orb-status{position:absolute;top:2px;right:2px;width:10px;height:10px;border-radius:50%;background:var(--maya-emerald);border:2px solid #0b111e;}",
    ".maya-mini-pill{pointer-events:auto;display:inline-flex;align-items:center;gap:7px;background:var(--maya-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--maya-border);border-radius:999px;padding:7px 12px;color:var(--maya-text);font-size:11.5px;font-weight:600;cursor:pointer;box-shadow:var(--maya-shadow);}",
    ".maya-mini-pill[hidden],.maya-bubble[hidden],.maya-routes[hidden],.maya-topics[hidden]{display:none!important;}",
    ".maya-mini-pill .maya-pill-sub{color:var(--maya-cyan);font-weight:600;font-size:11px;}",
    ".maya-bubble{pointer-events:auto;width:290px!important;max-width:calc(100vw - 104px)!important;background:var(--maya-bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--maya-border);border-radius:15px;padding:10px 12px;color:var(--maya-text);box-shadow:var(--maya-shadow);}",
    ".maya-b-head{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:5px;}",
    ".maya-b-title{font-size:10.5px;font-weight:700;color:var(--maya-cyan);letter-spacing:0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
    ".maya-b-controls{display:flex;align-items:center;gap:3px;flex-shrink:0;}",
    ".maya-icon-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#cbd5e1;border-radius:6px;padding:2px 5px;font-size:10px;cursor:pointer;line-height:1.25;}",
    ".maya-icon-btn:hover,.maya-icon-btn.active{border-color:var(--maya-cyan);color:#fff;background:rgba(0,229,255,0.16);}",
    ".maya-routes,.maya-topics{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:7px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.09);max-height:125px;overflow-y:auto;}",
    ".maya-route-chip{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#cbd5e1;border-radius:7px;padding:3px 6px;font-size:10px;cursor:pointer;flex:1 1 calc(50% - 4px);text-align:left;}",
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
    "@media(max-width:680px){.maya-orb-wrap{width:60px!important;height:60px!important;min-width:60px;min-height:60px;max-width:60px;max-height:60px;}.maya-bubble{width:250px!important;padding:8px 10px;}}"
  ].join("\n");
  document.head.appendChild(inlineStyle);

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0 ||
    /\/(en|autonomy|spark|privacy)\.html/i.test(location.pathname);

  var STORAGE_KEY = "atlas_maya_tour_v4";

  // Eğitimde verilen bilgilerin sayfa/bölüm hedefleri ve 1-2 cümlelik sıkıcı olmayan özeti
  var ROUTES = {
    tr: [
      {
        id: "full",
        label: "1. Tam Tur (10 Durak)",
        stops: [
          {
            page: "index.html",
            sel: ".hero",
            tag: "Durak 1 / 10 · Giriş",
            h: "Atlas Dijital Gülüş Tasarımı",
            p: "İki fotoğraftan 441 formluk kütüphaneden gerekçeli diş formu önerisi, kılavuzlu önizleme ve ExoCAD iş paketi hazırlıyoruz."
          },
          {
            page: "index.html",
            sel: "#nasil .pipe",
            tag: "Durak 2 / 10 · 5 Adım",
            h: "Fotoğraftan ExoCAD'e İş Akışı",
            p: "Tam yüz ve ekartörlü iki telefon fotoğrafıyla başlayan süreç 5 adımda ölçüm, form seçimi ve önizlemeyle tamamlanır."
          },
          {
            page: "index.html",
            sel: ".sk",
            tag: "Durak 3 / 10 · 3B Sefalometri",
            h: "478 Noktalı 3B Yüz Analizi & QLoRA",
            p: "Yüz genişliği ve alt çene açılarını 3B ağ ile ölçüp yüz tipine en uygun diş morfolojisini seçen modülümüzü buradan deneyebilirsiniz."
          },
          {
            page: "index.html",
            sel: "#ornek",
            tag: "Durak 4 / 10 · Önce / Sonra",
            h: "Kılavuzlu Önizleme Kaydırıcısı",
            p: "Kaydırıcıyı hareket ettirerek mevcut dişler ile seçilen formun uygulanmış halini aynı kare üzerinde karşılaştırabilirsiniz."
          },
          {
            page: "index.html",
            sel: "#otomasyon",
            tag: "Durak 5 / 10 · Otomasyon",
            h: "441 Form ve Kapı Denetimi",
            p: "Ölçüm ve form sıralamasını otomasyon hızlandırır; kontur denetiminden geçmeyen hiçbir önizleme hekime sunulmaz."
          },
          {
            page: "index.html",
            sel: "#studyo",
            tag: "Durak 6 / 10 · Araştırma",
            h: "Stüdyo Mimarisi ve 7 Yaşayan Yazı",
            p: "Yüzden Dişe 3B Sefalometri, Kim Kimi Eğitiyor ve Türkiye Viski Analizi dahil tüm araştırma yazılarımıza buradan ulaşabilirsiniz."
          },
          {
            page: "otonomi.html",
            sel: "#sayac",
            tag: "Durak 7 / 10 · Otonomi",
            h: "Saatlik Doğrulanan Canlı Sayaçlar",
            p: "Ajanların ürettiği hipotezler, çalışan bekçiler ve doğrulama istatistikleri doğrudan canlı kütüklerden okunur."
          },
          {
            page: "otonomi.html",
            sel: "#ablasyon",
            tag: "Durak 8 / 10 · Ablasyon",
            h: "3 Kollu Bağlam ve Maliyet Deneyi",
            p: "Üç farklı bağlam kolunun aynı doğrulama kapısından hangi süre ve maliyetle geçtiğini gösteren ölçüm şemamız."
          },
          {
            page: "otonomi.html",
            sel: "#halka",
            tag: "Durak 9 / 10 · Evrim",
            h: "4 Adımlı Kapalı Evrim Halkası",
            p: "Yapıcı ses Enki ile kör yargıç Enlil birbirini duymadan kuralları sınar; istatistik kapısını geçen kurallar yaşar."
          },
          {
            page: "otonomi.html",
            sel: "#maya",
            tag: "Durak 10 / 10 · Maya",
            h: "Maya: ATLAS'ın Kızı ve Asistanı",
            p: "Eğitim öncesi 3.600 olan doğrulama kaybımın 0.015'e inişini ve gelişim tablosunu bu bölümde inceleyebilirsiniz."
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
            tag: "Klinik 1 / 5 · Şema",
            h: "Orta Hat ve Diş Oranı Kılavuzu",
            p: "Altı ön diş üzerinde orta hat, diş eti zenit noktaları ve kesici kenar eğrisinin şematik yerleşimi."
          },
          {
            page: "index.html",
            sel: "#nasil .pipe",
            tag: "Klinik 2 / 5 · Süreç",
            h: "5 Adımda Klinik Teslim",
            p: "İki fotoğrafla başlayan akış, hekim onayından sonra doğrudan ExoCAD iş paketine dönüşür."
          },
          {
            page: "index.html",
            sel: ".sk",
            tag: "Klinik 3 / 5 · 3B Modül",
            h: "Canlı 3B Sefalometri Simülasyonu",
            p: "Modül üzerindeki düğmelerle 3B sefalometrik ağı, eğitimsiz modeli ve QLoRA modelimizi karşılaştırabilirsiniz."
          },
          {
            page: "index.html",
            sel: "#ornek",
            tag: "Klinik 4 / 5 · Karşılaştır",
            h: "Önce / Sonra Görsel Simülasyon",
            p: "Ekartörlü ve ağız kırpımı karelerinde tasarım öncesi ve sonrası farkı kaydırıcıyla inceleyin."
          },
          {
            page: "index.html",
            sel: "#sss",
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
            tag: "Otonomi 1 / 5 · Sayaçlar",
            h: "Canlı Sistem Sayaçları",
            p: "Saatlik doğrulanan görev, hipotez ve bekçi sayaçları."
          },
          {
            page: "otonomi.html",
            sel: "#ajanlar",
            tag: "Otonomi 2 / 5 · Karneler",
            h: "Ajan Karneleri",
            p: "Enkidu, Enki, Enlil, Kalfa ve Kıvılcım ajanlarının görev ve başarı karneleri."
          },
          {
            page: "otonomi.html",
            sel: "#ablasyon",
            tag: "Otonomi 3 / 5 · Ablasyon",
            h: "Maliyet ve Bağlam Ablasyonu",
            p: "Aynı sonucu yarı sürede üreten bağlam ablasyonu deneyimiz."
          },
          {
            page: "otonomi.html",
            sel: "#halka",
            tag: "Otonomi 4 / 5 · Evrim",
            h: "Kapalı Evrim Halkası",
            p: "Çürüyen kuralları kör yargıç ve gölge sınamayla yenileyen 4 adımlı döngü."
          },
          {
            page: "otonomi.html",
            sel: "#maya",
            tag: "Otonomi 5 / 5 · Maya",
            h: "Maya Gelişim Eğrisi",
            p: "Eğitim öncesi ve sonrası doğrulama kaybı (3.600 → 0.015) ve karşılaştırma tablosu."
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
            tag: "Kıvılcım 1 / 4 · Yordam",
            h: "7 Basamaklı Kıvılcım Yordamı",
            p: "Birbirini duymayan model ailelerinden tez, karşı tez ve düşer testi üretme yöntemi."
          },
          {
            page: "kivilcim.html",
            sel: "#karne",
            tag: "Kıvılcım 2 / 4 · Karne",
            h: "49 Turun Gerçek Karnesi",
            p: "Hangi model ailesinin kaç turda en güçlü tezi ürettiğinin ölçülmüş tablosu."
          },
          {
            page: "kivilcim.html",
            sel: "#makaleler",
            tag: "Kıvılcım 3 / 4 · Deneyler",
            h: "Deneysel Kıvılcım Yazıları",
            p: "Sefalometrik QLoRA ve Ajan Evrimi deneylerinin özet bulguları."
          },
          {
            page: "blog.html",
            sel: "main",
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
            tag: "Stop 1 / 10 · Intro",
            h: "Atlas Digital Smile Design",
            p: "From two photos, we prepare reasoned form proposals from a 441-form library, guided mockups, and ExoCAD packages."
          },
          {
            page: "en.html",
            sel: "#how .pipe",
            tag: "Stop 2 / 10 · 5 Steps",
            h: "5-Step Clinical Workflow",
            p: "Photos → Measurement → Form Proposal → Guided Preview → ExoCAD, starting from two smartphone photographs."
          },
          {
            page: "en.html",
            sel: ".sk",
            tag: "Stop 3 / 10 · 3D Cephalometry",
            h: "478-Point 3D Facial Analysis & QLoRA",
            p: "Test our interactive module measuring bizygomatic and mandibular vectors to match tooth morphology."
          },
          {
            page: "en.html",
            sel: "#ornek",
            tag: "Stop 4 / 10 · Before / After",
            h: "Guided Preview Slider",
            p: "Slide left and right to compare pre-design teeth with the accepted morphology on the same case."
          },
          {
            page: "en.html",
            sel: "#automation",
            tag: "Stop 5 / 10 · Automation",
            h: "441 Forms & Gate Verification",
            p: "Automation ranks 5 primary and 3 alternative forms; every preview passes contour gates before delivery."
          },
          {
            page: "en.html",
            sel: "#studio",
            tag: "Stop 6 / 10 · Research",
            h: "Studio Architecture & 7 Living Essays",
            p: "Access our living research papers including Face-to-Tooth 3D Cephalometry and Who Trains Whom."
          },
          {
            page: "autonomy.html",
            sel: "#sayac",
            tag: "Stop 7 / 10 · Autonomy",
            h: "Hourly Verified Live Counters",
            p: "Live task, hypothesis, and watchdog counters read directly from production logs."
          },
          {
            page: "autonomy.html",
            sel: "#ablasyon",
            tag: "Stop 8 / 10 · Ablation",
            h: "3-Arm Context & Cost Ablation",
            p: "Compare duration and context load across three arms passing through the same verification gate."
          },
          {
            page: "autonomy.html",
            sel: "#halka",
            tag: "Stop 9 / 10 · Evolution",
            h: "4-Step Closed Evolution Loop",
            p: "Constructive voice Enki and blind judge Enlil test rule candidates without direct communication."
          },
          {
            page: "autonomy.html",
            sel: "#maya",
            tag: "Stop 10 / 10 · Maya",
            h: "Maya: Daughter of ATLAS & Assistant",
            p: "Review how my validation loss dropped 240-fold from 3.600 down to 0.015."
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
            tag: "Clinical 1 / 5 · Guides",
            h: "Midline & Proportion Guides",
            p: "Schematic guide lines across the six anterior teeth showing midline, zeniths, and tooth proportions."
          },
          {
            page: "en.html",
            sel: "#how .pipe",
            tag: "Clinical 2 / 5 · Workflow",
            h: "From Photos to ExoCAD",
            p: "Two photographs turn into guided previews and an ExoCAD work package upon dentist approval."
          },
          {
            page: "en.html",
            sel: ".sk",
            tag: "Clinical 3 / 5 · 3D Module",
            h: "Live 3D Cephalometric Simulation",
            p: "Compare the 3D cephalometric mesh, untrained AI, and our QLoRA model."
          },
          {
            page: "en.html",
            sel: "#ornek",
            tag: "Clinical 4 / 5 · Compare",
            h: "Before / After Slider",
            p: "Inspect the before and after morphology on retracted and mouth-crop views."
          },
          {
            page: "en.html",
            sel: "#faq",
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
            tag: "Autonomy 1 / 5 · Counters",
            h: "Live System Counters",
            p: "Hourly updated counters tracking hypotheses and verification gates."
          },
          {
            page: "autonomy.html",
            sel: "#ajanlar",
            tag: "Autonomy 2 / 5 · Scorecards",
            h: "Agent Scorecards",
            p: "Performance scorecards for Enkidu, Enki, Enlil, Kalfa, and Spark."
          },
          {
            page: "autonomy.html",
            sel: "#ablasyon",
            tag: "Autonomy 3 / 5 · Ablation",
            h: "Context & Cost Ablation",
            p: "Halving execution time while preserving the exact same gate decision."
          },
          {
            page: "autonomy.html",
            sel: "#halka",
            tag: "Autonomy 4 / 5 · Evolution",
            h: "Closed Evolution Loop",
            p: "Four-step closed loop evolving the rule set with blind verification."
          },
          {
            page: "autonomy.html",
            sel: "#maya",
            tag: "Autonomy 5 / 5 · Maya",
            h: "Maya Training Curve",
            p: "Pre-training vs. post-training validation loss (3.600 → 0.015)."
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
            tag: "Spark 1 / 4 · Procedure",
            h: "7-Step Spark Procedure",
            p: "Generating theses, counter-theses, and falsification tests across independent models."
          },
          {
            page: "spark.html",
            sel: "#karne",
            tag: "Spark 2 / 4 · Scorecard",
            h: "49-Round Scorecard",
            p: "Measured performance across 49 multi-agent collision rounds."
          },
          {
            page: "spark.html",
            sel: "#makaleler",
            tag: "Spark 3 / 4 · Experiments",
            h: "Experimental Spark Papers",
            p: "Cephalometric QLoRA and Agent Evolution ablation findings."
          },
          {
            page: "blog.html",
            sel: "main",
            tag: "Spark 4 / 4 · Archive",
            h: "All 7 Living Essays",
            p: "Browse the complete collection of our living research papers."
          }
        ]
      }
    ]
  };

  // Eğitimden gelen hızlı konu başlıkları (Tıklanınca doğrudan o bölüme/yazıya götürür ve kısaca özetler)
  var QUICK_TOPICS = {
    tr: [
      { label: "📐 3B Sefalometri", page: "index.html", sel: ".sk", h: "3B Sefalometrik Morfoloji", p: "478 noktalı 3B yüz ağıyla ZY-ZY ve Go-Go oranlarını ölçer; n=32 testte %100 hedef hat isabeti sağlar." },
      { label: "🦷 441 Diş Formu", page: "index.html", sel: "#otomasyon", h: "441 Doğal Form Kütüphanesi", p: "Yüz oranlarına göre 441 formluk kütüphaneden 5 öncelikli ve 3 alternatif diş formu gerekçesiyle sıralanır." },
      { label: "🔒 KVKK & Gizlilik", page: "index.html", sel: "#sss", h: "Kimliksiz Ağız Kırpımı", p: "Tam yüz fotoğrafları cihazdan çıkmaz; dış görsel modele yalnızca kimliksiz ağız kırpımı ve maske gönderilir." },
      { label: "⚡ Kıvılcım (49 Tur)", page: "kivilcim.html", sel: "#algoritma", h: "7 Basamaklı Kıvılcım Yordamı", p: "Farklı model aileleri birbirini duymadan tez ve düşer testi üretir; uydurma kaynaklar otomatik elenir." },
      { label: "🧬 Evrim Halkası", page: "otonomi.html", sel: "#halka", h: "4 Adımlı Kapalı Evrim", p: "Enkidu, Enki ve kör yargıç Enlil ile kuralları gölge sınamadan geçirerek evrimleştiren döngü." },
      { label: "🤖 Maya Eğitimi", page: "otonomi.html", sel: "#maya", h: "Maya: 3.600 → 0.015 Kayıp Düşüşü", p: "Atlas tarafından eğitilen asistanınız; 240 kat kayıp düşüşüyle proje ilkelerini ve ölçüm disiplinini taşır." },
      { label: "📄 Yüzden Dişe Yazısı", page: "blog/yuzden-dise-sefalometrik-lora.html", sel: "main", h: "Yüzden Dişe: 3B Sefalometrik QLoRA", p: "Eğitimsiz modelin kare çene yanılgısını 478 noktalı 3B ağ ve QLoRA eğitimiyle nasıl çözdüğümüzün makalesi." },
      { label: "🪞 Kim Kimi Eğitiyor", page: "blog/kim-kimi-egitiyor.html", sel: "main", h: "Kim Kimi Eğitiyor? (96 Deney)", p: "Mekanik kapılar olmadan yalnız promtla davranışın değişmediğini gösteren 96 deneylik araştırmamız." },
      { label: "🥃 Viski Analizi", page: "blog/turkiye-viski-dunya-markasi.html", sel: "main", h: "Türkiye'nin Viski Markası Analizi", p: "1963 Ankara Viskisi'nden bugüne vergi asimetrisi, maliyet tabanı ve çıkış yolunu inceleyen 8 sesli Kıvılcım yazısı." }
    ],
    en: [
      { label: "📐 3D Cephalometry", page: "en.html", sel: ".sk", h: "3D Cephalometric Morphology", p: "Measures ZY-ZY and Go-Go ratios on a 478-point 3D mesh, reaching 100% target line accuracy on n=32 test faces." },
      { label: "🦷 441 Tooth Forms", page: "en.html", sel: "#automation", h: "441 Natural Form Library", p: "Ranks 5 primary and 3 alternative tooth forms with clinical rationale based on facial proportions." },
      { label: "🔒 Privacy & Security", page: "en.html", sel: "#faq", h: "Anonymous Mouth-Crop Architecture", p: "Full faces never leave studio devices; only de-identified mouth crops and masks are processed." },
      { label: "⚡ Spark (49 Rounds)", page: "spark.html", sel: "#algoritma", h: "7-Step Spark Procedure", p: "Independent model families generate theses and falsification tests blindly without hearing each other." },
      { label: "🧬 Evolution Loop", page: "autonomy.html", sel: "#halka", h: "4-Step Closed Evolution", p: "Closed loop where Enkidu, Enki, and blind judge Enlil evolve rules through shadow testing." },
      { label: "🤖 Maya Training", page: "autonomy.html", sel: "#maya", h: "Maya: 3.600 → 0.015 Loss Drop", p: "Trained by Atlas with a 240-fold validation loss reduction to guide visitors across the site." }
    ]
  };

  var routeList = isEn ? ROUTES.en : ROUTES.tr;
  var topicList = isEn ? QUICK_TOPICS.en : QUICK_TOPICS.tr;

  var state = {
    open: false,
    routeId: "full",
    stepIdx: 0,
    showRoutes: false,
    showTopics: false,
    autoPlay: false,
    posX: Math.max(16, window.innerWidth - 385),
    posY: Math.max(70, window.innerHeight - 100)
  };

  var autoTimer = null;
  var currentSpotEl = null;
  var lookTargetX = 0;
  var lookTargetY = 0;
  var exprPulse = 0;

  function getRoute(id) {
    for (var i = 0; i < routeList.length; i++) {
      if (routeList[i].id === id) return routeList[i];
    }
    return routeList[0];
  }

  function currentPageRel() {
    var path = location.pathname.replace(/^\/+/, "");
    if (!path || path === "") return "index.html";
    return path;
  }

  function resolveHref(targetPage) {
    var inBlogSubdir = /\/blog\//i.test(location.pathname);
    if (inBlogSubdir) {
      if (targetPage.indexOf("blog/") === 0) return targetPage.slice(5);
      return "../" + targetPage;
    }
    return targetPage;
  }

  function saveState(customOverride) {
    try {
      var payload = customOverride || {
        open: state.open,
        routeId: state.routeId,
        stepIdx: state.stepIdx,
        autoPlay: state.autoPlay,
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
      if (Date.now() - (parsed.ts || 0) > 15 * 60 * 1000) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  var assetPrefix = /\/blog\//i.test(location.pathname) ? "../" : "";

  var carrier = document.createElement("div");
  carrier.className = "maya-carrier bubble-left";
  carrier.id = "maya-carrier";

  carrier.innerHTML =
    '<div class="maya-orb-wrap" id="maya-orb" title="' + (isEn ? "Maya — Daughter of ATLAS · Assistant (Drag or click)" : "Maya — ATLAS\'ın Kızı · Asistan (Sürükle veya tıkla)") + '">' +
      '<div class="maya-orb-clip" id="maya-orb-clip">' +
        '<canvas id="maya-sprite-canvas" width="220" height="220"></canvas>' +
      '</div>' +
      '<span class="maya-orb-status"></span>' +
      '<span class="maya-orb-badge">Maya · 3B</span>' +
    '</div>' +
    '<button type="button" class="maya-mini-pill" id="maya-mini-pill">' +
      '<span>' + (isEn ? "Maya · ATLAS Assistant" : "Maya · ATLAS Asistanı") + '</span>' +
      '<span class="maya-pill-sub">' + (isEn ? "▶ Tour & Guide" : "▶ Tur & Rehber") + '</span>' +
    '</button>' +
    '<div class="maya-bubble" id="maya-bubble" hidden>' +
      '<div class="maya-b-head">' +
        '<div class="maya-b-title">' + (isEn ? "Maya · ATLAS Assistant" : "Maya · ATLAS\'ın Kızı · Asistan") + '</div>' +
        '<div class="maya-b-controls">' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-topics" title="' + (isEn ? "Jump to Topic" : "Konuya Git") + '">' + (isEn ? "Topics" : "Konular") + '</button>' +
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
        '<button type="button" class="maya-btn-sm" id="maya-btn-ask">' + (isEn ? "Jump to Topic ▾" : "Konu Seç ▾") + '</button>' +
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
  var btnTopics = document.getElementById("maya-btn-topics");
  var btnRoutes = document.getElementById("maya-btn-routes");
  var btnAuto = document.getElementById("maya-btn-auto");
  var btnClose = document.getElementById("maya-btn-close");
  var btnPrev = document.getElementById("maya-btn-prev");
  var btnAsk = document.getElementById("maya-btn-ask");
  var btnNext = document.getElementById("maya-btn-next");

  function setCarrierPos(x, y, bubbleOnLeft) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var rect = carrier.getBoundingClientRect();
    var w = rect.width || (state.open ? 375 : 250);
    var h = rect.height || (state.open ? 185 : 78);

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
    var w = state.open ? Math.min(378, vw - 20) : 255;
    var h = state.open ? (bubbleEl.offsetHeight || 190) : 78;
    setCarrierPos(vw - w - 16, vh - h - 16, true);
  }

  // Sürükle & Bırak
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
        goToCurrentStop(true);
      });
      routesBar.appendChild(b);
    });
  }

  function renderTopicChips() {
    topicsBar.innerHTML = "";
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
      topicsBar.appendChild(b);
    });
  }

  function jumpToQuickTopic(tp) {
    var curPage = currentPageRel();
    if (tp.page && tp.page !== curPage) {
      saveState({
        open: true,
        routeId: state.routeId,
        stepIdx: state.stepIdx,
        quickTopic: tp,
        ts: Date.now()
      });
      location.href = resolveHref(tp.page);
      return;
    }
    tagEl.textContent = isEn ? "Selected Topic" : "Seçilen Konu — Detaylar Sayfada";
    hEl.textContent = tp.h;
    pEl.textContent = tp.p;
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
      var carrierW = Math.min(378, vw - 20);
      var carrierH = bubbleEl.offsetHeight || 190;

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
        lookTargetX = -0.35;
      } else if (r.left - carrierW - 20 > 0) {
        targetX = r.left - carrierW - 14;
        bubbleOnLeft = true;
        lookTargetX = 0.35;
      } else {
        targetX = vw - carrierW - 18;
        bubbleOnLeft = true;
        lookTargetX = -0.28;
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
          goToCurrentStop(true);
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

    if (stop.page && stop.page !== curPage) {
      if (allowPageNav) {
        saveState();
        location.href = resolveHref(stop.page) + (stop.sel && stop.sel.charAt(0) === "#" ? stop.sel.split(" ")[0] : "");
        return;
      } else {
        // Kullanıcı üst menüden başka bir sayfaya geçtiyse o sayfadaki ilk durağı bul
        var foundIdx = -1;
        for (var i = 0; i < route.stops.length; i++) {
          if (route.stops[i].page === curPage) {
            foundIdx = i;
            break;
          }
        }
        if (foundIdx >= 0) {
          state.stepIdx = foundIdx;
          stop = route.stops[state.stepIdx];
        } else {
          // Bu sayfada durak yoksa turu sessizce küçült ki sayfa gezintisini bölmesin
          minimizeTour();
          return;
        }
      }
    }

    renderRouteChips();
    renderTopicChips();
    renderDots(route.stops.length, state.stepIdx);

    tagEl.textContent = stop.tag;
    hEl.textContent = stop.h;
    pEl.textContent = stop.p;

    saveState();

    if (scrollAndGlide) {
      var targetEl = stop.sel ? document.querySelector(stop.sel) : null;
      glideToElement(targetEl);
    }
  }

  function startOrOpenTour(optionalRouteId) {
    if (optionalRouteId) {
      state.routeId = optionalRouteId;
      state.stepIdx = 0;
    }
    state.open = true;
    miniPill.hidden = true;
    bubbleEl.hidden = false;
    goToCurrentStop(true, !!optionalRouteId);
  }

  function minimizeTour() {
    state.open = false;
    state.autoPlay = false;
    if (autoTimer) {
      clearInterval(autoTimer);
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

  function toggleAutoPlay() {
    state.autoPlay = !state.autoPlay;
    btnAuto.classList.toggle("active", state.autoPlay);
    btnAuto.textContent = state.autoPlay ? (isEn ? "Auto ⏸" : "Oto ⏸") : (isEn ? "Auto ▶" : "Oto ▶");
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    if (state.autoPlay) {
      autoTimer = setInterval(function () {
        var route = getRoute(state.routeId);
        if (state.stepIdx + 1 < route.stops.length) {
          state.stepIdx++;
          goToCurrentStop(true, true);
        } else {
          toggleAutoPlay();
        }
      }, 5800);
    }
    saveState();
  }

  function toggleTopicsMenu() {
    state.showTopics = !state.showTopics;
    if (state.showTopics) {
      state.showRoutes = false;
      routesBar.hidden = true;
      btnRoutes.classList.remove("active");
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

  // 1) 60 FPS Kanvas Sprite Katmanı
  var spriteCanvas = document.getElementById("maya-sprite-canvas");
  var sCtx = spriteCanvas.getContext("2d");
  var spriteImg = new Image();
  var spriteLoaded = false;
  spriteImg.onload = function () {
    spriteLoaded = true;
  };
  spriteImg.src = assetPrefix + "ornek/maya/maya-sprite.jpg";

  // 2) Blender 5.1.0 (maya-3d.glb) + Three.js WebGL 3B Canlı Avatar Motoru
  var threeReady = false;
  var threeMesh = null;
  var threeRenderer = null;
  var threeScene = null;
  var threeCamera = null;

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
        var w = 148, h = 148;
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
        camera.position.set(0, 0.02, 2.65);

        scene.add(new THREE.AmbientLight(0xffffff, 1.35));
        var keyLight = new THREE.DirectionalLight(0xfff7ed, 0.95);
        keyLight.position.set(1.2, 1.4, 2.2);
        scene.add(keyLight);

        var rimLight = new THREE.DirectionalLight(0x00e5ff, 0.55);
        rimLight.position.set(-1.5, 0.6, 1.0);
        scene.add(rimLight);

        var loader = new GLTFLoader();
        loader.load(assetPrefix + "ornek/maya/maya-3d.glb", function (gltf) {
          var root = gltf.scene;
          scene.add(root);
          root.traverse(function (node) {
            if (node.isMesh && node.morphTargetInfluences) {
              threeMesh = node;
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

  function animateAvatar(now) {
    requestAnimationFrame(animateAvatar);
    var t = now * 0.001;

    var blinkVal = 0;
    if (now >= blinkNextAt) {
      blinkEndAt = now + 150;
      blinkNextAt = now + 2600 + Math.random() * 2400;
    }
    if (now < blinkEndAt) {
      var p = 1 - (blinkEndAt - now) / 150;
      blinkVal = Math.sin(p * Math.PI);
    }

    if (exprPulse > 0.01) {
      exprPulse *= 0.95;
    } else {
      exprPulse = 0;
    }

    if (threeReady && threeMesh && threeRenderer) {
      var dict = threeMesh.morphTargetDictionary || {};
      var infl = threeMesh.morphTargetInfluences;
      if (infl) {
        if (dict.Blink !== undefined) infl[dict.Blink] = blinkVal;
        if (dict.MouthSmile !== undefined) infl[dict.MouthSmile] = 0.25 + 0.45 * exprPulse + 0.08 * Math.sin(t * 1.7);
        if (dict.BrowRaise !== undefined) infl[dict.BrowRaise] = 0.35 * exprPulse + 0.06 * Math.sin(t * 1.1);
        if (dict.JawOpen !== undefined) infl[dict.JawOpen] = 0.08 * exprPulse;
      }
      var targetYaw = (lookTargetX * 0.55) + (mouseNormX * 0.12) + Math.sin(t * 0.9) * 0.04;
      var targetPitch = (lookTargetY * 0.25) + (mouseNormY * 0.08) + Math.cos(t * 0.7) * 0.03;
      threeMesh.rotation.y += (targetYaw - threeMesh.rotation.y) * 0.08;
      threeMesh.rotation.x += (targetPitch - threeMesh.rotation.x) * 0.08;
      threeMesh.position.y = Math.sin(t * 1.6) * 0.012;
      threeRenderer.render(threeScene, threeCamera);
      return;
    }

    if (spriteLoaded) {
      var frameW = spriteImg.width / 6;
      var frameH = spriteImg.height;
      var frameIdx = 0;
      if (blinkVal > 0.45) {
        frameIdx = 1;
      } else if (exprPulse > 0.25) {
        frameIdx = 4;
      }
      sCtx.clearRect(0, 0, 220, 220);
      var breathe = Math.sin(t * 1.8) * 2.2;
      sCtx.drawImage(spriteImg, frameIdx * frameW, 0, frameW, frameH, -3, breathe - 3, 226, 226);
    }
  }

  parkBottomRight();
  initThreeAvatar();
  requestAnimationFrame(animateAvatar);

  var saved = loadState();
  if (saved && saved.open) {
    state.routeId = saved.routeId || "full";
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
        renderTopicChips();
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

  window.AtlasMaya = {
    startTour: function (routeId) {
      startOrOpenTour(routeId || "full");
    },
    minimize: minimizeTour
  };
})();
