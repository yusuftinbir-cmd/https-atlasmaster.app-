/**
 * Maya — ATLAS'ın Kızı · Asistan
 * Serbest Gezen 3B Avatar (Blender 5.1.0 GLB + Three.js WebGL + 60fps Kanvas)
 * ve Sayfayı Otomatik Kaydıran Çok Rotalı Etkileşimli Site Rehberi.
 * Not: Robotik ses olmaması için sesli okuma tamamen kapatılmıştır; görsel ve 3B mimiklerle sessiz rehberlik yapar.
 */
(function () {
  "use strict";

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0 ||
    /\/(en|autonomy|spark|privacy)\.html/i.test(location.pathname);

  var STORAGE_KEY = "atlas_maya_tour_v3";

  // 4 Seçilebilir Tur Rotası (TR ve EN)
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
            p: "İki fotoğraftan 441 formluk kütüphaneden gerekçeli form önerisi, kılavuz çizgili önizleme ve ExoCAD iş paketi üretiyoruz.",
            deep: "Sağdaki şematik çizimde orta hat, diş eti zenit noktaları, kesici kenar eğrisi ve diş oranı ölçüm kılavuzlarını görebilirsiniz."
          },
          {
            page: "index.html",
            sel: "#nasil .pipe",
            tag: "Durak 2 / 10 · İşleyiş",
            h: "5 Adımlı Klinik İş Akışı",
            p: "Fotoğraf → Ölçüm → Form Önerisi → Kılavuzlu Önizleme → ExoCAD. Telefon kamerasıyla çekilen iki kare yeterlidir.",
            deep: "Her adımda hekim kontrolü esastır; sistem tanı koymaz, hekimin seçtiği formu milimetrik kılavuzlarla hazırlar."
          },
          {
            page: "index.html",
            sel: ".sk",
            tag: "Durak 3 / 10 · 3B Sefalometri",
            h: "478 Noktalı 3B Yüz Analizi & QLoRA",
            p: "%100 sentetik yüz üzerinde ZY-ZY elmacık ve Go-Go çene vektörleriyle yüz tipini ölçüp uygun diş morfolojisini seçiyoruz.",
            deep: "Eğitimsiz model kare çeneyi 'oval' sanıp yuvarlak diş seçerken, 3B sefalometriyle eğitilen QLoRA modelimiz n=32 testte %100 hedef hat isabetine ulaştı."
          },
          {
            page: "index.html",
            sel: "#ornek",
            tag: "Durak 4 / 10 · Önce / Sonra",
            h: "Ekartörlü & Ağız Kırpımı Önizlemesi",
            p: "Kaydırıcıyı sağa-sola çekerek tasarım öncesi ve kabul edilen tasarım sonrası görünümü aynı dişler üzerinde karşılaştırın.",
            deep: "Bulut görsel modele yalnızca kimliksiz ağız kırpımı gider; hastanın tam yüzü ve kimliği cihazdan dışarı çıkmaz."
          },
          {
            page: "index.html",
            sel: "#otomasyon",
            tag: "Durak 5 / 10 · 441 Form",
            h: "Otomasyon ve Kapı Denetimi",
            p: "441 formluk kütüphaneden 5 öncelikli ve 3 alternatif form gerekçesiyle sıralanır; diş sayısı ve kontur kapıdan geçmeden sunulmaz.",
            deep: "Otomasyon yalnızca ölçüm ve sıralamayı hızlandırır; son onay ve klinik karar her zaman diş hekiminindir."
          },
          {
            page: "index.html",
            sel: "#studyo",
            tag: "Durak 6 / 10 · Stüdyo & Yazılar",
            h: "Yaşayan Araştırma Yazıları",
            p: "Yüzden Dişe 3B Sefalometri, Kim Kimi Eğitiyor ve Türkiye'nin Viski Analizi dahil 7 yaşayan araştırma yazımız burada yer alır.",
            deep: "Yazılarımız statik değildir; yeni deney ve ölçüm sonuçları çıktıkça tablolar ve bulgular güncellenir."
          },
          {
            page: "otonomi.html",
            sel: "#sayac",
            tag: "Durak 7 / 10 · Otonomi",
            h: "Saatlik Doğrulanan Canlı Sayaçlar",
            p: "Çok ajanlı sistemimizin görev, hipotez ve doğrulama sayaçları her saat gerçek kütüklerden okunarak güncellenir.",
            deep: "Doğrulanmamış hiçbir sayı sayfaya girmez; her sayaç doğrudan diskteki görev ve deney kayıtlarına bağlıdır."
          },
          {
            page: "otonomi.html",
            sel: "#ablasyon",
            tag: "Durak 8 / 10 · Ablasyon",
            h: "3 Kollu Bağlam ve Maliyet Ablasyonu",
            p: "Aynı doğrulama kapısından geçen üç farklı bağlam kolunun süre (11 / 8 / 5 dk) ve yük farkını canlı şemada izleyin.",
            deep: "Bu deneyde bağlam paketini atlamak kararı değiştirmedi ama süreyi yarıdan fazla indirdi."
          },
          {
            page: "otonomi.html",
            sel: "#halka",
            tag: "Durak 9 / 10 · Evrim Halkası",
            h: "4 Adımlı Kapalı Evrim Halkası",
            p: "Çürüyen kurallar → Aday üretimi (Enki) → Kör yargıç damgası (Enlil) → Gölge sınama (Enkidu).",
            deep: "Yapıcı ses Enki ile kör yargıç Enlil birbirini doğrudan duymaz; iltimas ve grup düşüncesi mimari olarak engellenir."
          },
          {
            page: "otonomi.html",
            sel: "#maya",
            tag: "Durak 10 / 10 · Maya",
            h: "Maya: ATLAS'ın Kızı ve Asistanı",
            p: "Eğitim öncesi 3.600 olan doğrulama kaybımın 240 kat düşerek 0.015'e inişini ve gelişim tablosunu burada inceleyebilirsiniz.",
            deep: "Her gün yeni sınamalarla kendimi güncelliyorum; istediğiniz zaman beni sürükleyebilir veya başka bir tur rotası seçebilirsiniz."
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
            tag: "Klinik 1 / 5 · Kılavuz",
            h: "Orta Hat, Zenit ve Kesici Kenar",
            p: "Altı ön diş üzerinde orta hat, diş eti zenit noktaları, kesici kenar eğrisi ve diş oranı ölçüm şeması.",
            deep: "Kılavuz çizgileri, tasarımın hastanın doğal yüz simetrisiyle ve alt dudak eğrisiyle uyumunu denetler."
          },
          {
            page: "index.html",
            sel: "#nasil .pipe",
            tag: "Klinik 2 / 5 · 5 Adım",
            h: "Fotoğraftan ExoCAD İş Paketine",
            p: "Tam yüz gülüş ve ekartörlü iki kareyle başlayan süreç, onayınızdan sonra doğrudan ExoCAD iş paketine dönüşür.",
            deep: "ExoCAD kullanmayan klinikler de form önerisi ve kılavuzlu önce/sonra önizlemesini tek başına kullanabilir."
          },
          {
            page: "index.html",
            sel: ".sk",
            tag: "Klinik 3 / 5 · 3B Sefalometri",
            h: "Canlı 3B Sefalometrik Simülasyon",
            p: "478 anatomik nokta üzerinden yüz genişliği (ZY-ZY) ve alt çene (Go-Go) oranlarını ölçen etkileşimli modül.",
            deep: "Modül üzerindeki düğmelerle 3B sefalometrik ağı, eğitimsiz modeli ve QLoRA modelimizin önerisini canlı karşılaştırabilirsiniz."
          },
          {
            page: "index.html",
            sel: "#ornek",
            tag: "Klinik 4 / 5 · Önce / Sonra",
            h: "Ekartörlü ve Ağız Kırpımı Karşılaştırması",
            p: "Canlı kaydırıcıyla mevcut diş formu ve önerilen yeni form arasındaki farkı milimetrik olarak inceleyin.",
            deep: "Diş eti sınırları ve dudak dokusu korunur; yalnızca diş morfolojisi kılavuz çizgilerine göre yenilenir."
          },
          {
            page: "index.html",
            sel: "#sss",
            tag: "Klinik 5 / 5 · Mahremiyet",
            h: "Veri Güvenliği ve Klinik Sorular",
            p: "Hangi fotoğraflar gerekir, elinize ne geçer ve hasta verisi nasıl korunur sorularının net yanıtları.",
            deep: "Tam yüz fotoğrafları stüdyo cihazlarından dışarı çıkmaz; dış görsel modele yalnız kimliksiz ağız kırpımı gönderilir."
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
            p: "Ajanların ürettiği hipotezler, çalışan bekçiler ve doğrulama istatistikleri saatlik olarak güncellenir.",
            deep: "Her rakam doğrudan çalışan süreçlerin ürettiği JSON kütüklerinden okunur."
          },
          {
            page: "otonomi.html",
            sel: "#ajanlar",
            tag: "Otonomi 2 / 5 · Karneler",
            h: "Ajan Karneleri (Enkidu, Enki, Enlil)",
            p: "Mekanik işçi Enkidu, yapıcı ses Enki, kör yargıç Enlil ve Kalfa'nın görev tanımları ve başarı karneleri.",
            deep: "Her ajanın yetkisi ve sınırı ayrılmıştır; hiçbir ajan kendi ürettiği çıktının hakemi olamaz."
          },
          {
            page: "otonomi.html",
            sel: "#ablasyon",
            tag: "Otonomi 3 / 5 · Ablasyon",
            h: "Maliyet ve Bağlam Ablasyonu",
            p: "Üç farklı bağlam paketinin aynı doğrulama kapısından geçiş süresi ve bağlam yükü karşılaştırması.",
            deep: "Gereksiz bağlam yükünü azaltmak doğruluktan ödün vermeden hızı iki katına çıkarır."
          },
          {
            page: "otonomi.html",
            sel: "#halka",
            tag: "Otonomi 4 / 5 · Evrim",
            h: "Kapalı Evrim Halkası",
            p: "Yeni ajan eklemek yerine mevcut kural kümesini sınayarak evrimleştiren dört adımlı kapalı döngü.",
            deep: "İstatistik kapısı (240 epizot / 28 gün) dolmadan hiçbir aday kural canlı sisteme alınmaz."
          },
          {
            page: "otonomi.html",
            sel: "#maya",
            tag: "Otonomi 5 / 5 · Maya",
            h: "Maya Gelişim Eğrisi (3.600 → 0.015)",
            p: "Atlas tarafından eğitilen asistanınız Maya'nın eğitim öncesi ve sonrası doğrulama kaybı ve kazanımları.",
            deep: "240 katlık kayıp düşüşüyle kanıtsız iddialara direnç ve tam proje hâkimiyeti kazanıldı."
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
            p: "Ön beklenti, ölçüm, kimliksiz brif, bağımsız sesler, kaynak doğrulama, sentez ve karne adımları.",
            deep: "Farklı model aileleri birbirini duymadan aynı soruya yanıt üretir; uydurma kaynaklar otomatik elenir."
          },
          {
            page: "kivilcim.html",
            sel: "#karne",
            tag: "Kıvılcım 2 / 4 · 49 Tur",
            h: "49 Kıvılcım Turunun Gerçek Karnesi",
            p: "Hangi sesin kaç turda en güçlü tezi veya karşı tezi ürettiğinin ölçülmüş dağılımı.",
            deep: "Her hüküm kendi düşer testini (hangi veri gelirse bu hükmün geçersiz sayılacağını) taşımak zorundadır."
          },
          {
            page: "kivilcim.html",
            sel: "#makaleler",
            tag: "Kıvılcım 3 / 4 · Deneyler",
            h: "Sefalometrik QLoRA ve Ajan Evrimi",
            p: "Kıvılcım turlarından doğan deneysel makalelerimiz ve 4 kollu ablasyon sonuçları.",
            deep: "Teorik tartışmalar doğrudan yerel GPU deneylerine dönüştürülerek doğrulanır."
          },
          {
            page: "blog.html",
            sel: "main",
            tag: "Kıvılcım 4 / 4 · Arşiv",
            h: "Atlas Stüdyo · Tüm Yazılar (7 Makale)",
            p: "Diş hekimliği, yapay zekâ eğitimi ve strateji üzerine yayınlanan tüm kapsamlı incelemelerimiz.",
            deep: "İstediğiniz yazıya tıklayarak tam metni, deney tablolarını ve birincil kaynakçayı okuyabilirsiniz."
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
            tag: "Stop 1 / 10 · Overview",
            h: "Atlas Digital Smile Design",
            p: "From two photographs, we prepare reasoned tooth form proposals from a 441-form library, guided mockups, and ExoCAD packages.",
            deep: "The schematic on the right illustrates midline, gingival zeniths, incisal curve, and tooth proportion guides."
          },
          {
            page: "en.html",
            sel: "#how .pipe",
            tag: "Stop 2 / 10 · Workflow",
            h: "5-Step Clinical Workflow",
            p: "Photos → Measurement → Form Proposal → Guided Preview → ExoCAD. Two smartphone photos are sufficient.",
            deep: "The dentist remains in full control at every step; Atlas provides quantitative measurements and guided previews."
          },
          {
            page: "en.html",
            sel: ".sk",
            tag: "Stop 3 / 10 · 3D Cephalometry",
            h: "478-Point 3D Facial Analysis & QLoRA",
            p: "On a 100% synthetic face, we measure ZY-ZY bizygomatic and Go-Go mandibular vectors to match tooth morphology.",
            deep: "While an untrained model confuses square jaws for oval, our 3D-cephalometry QLoRA model achieved 100% target line accuracy across n=32 test faces."
          },
          {
            page: "en.html",
            sel: "#ornek",
            tag: "Stop 4 / 10 · Before / After",
            h: "Retracted & Mouth-Crop Preview",
            p: "Drag the interactive slider to compare the pre-design teeth and the accepted smile design on the exact same case.",
            deep: "Only anonymous mouth crops are sent to cloud visual models; full patient faces never leave studio devices."
          },
          {
            page: "en.html",
            sel: "#automation",
            tag: "Stop 5 / 10 · 441 Forms",
            h: "Automation and Gate Verification",
            p: "5 primary and 3 alternative forms are ranked from our 441-form library; tooth count and contours pass automated gates before delivery.",
            deep: "Automation accelerates measurement and ranking while clinical judgment stays strictly with the dentist."
          },
          {
            page: "en.html",
            sel: "#studio",
            tag: "Stop 6 / 10 · Studio & Essays",
            h: "Living Research Essays",
            p: "Explore our 7 living research papers including Face-to-Tooth 3D Cephalometry, Who Trains Whom, and market analyses.",
            deep: "Our essays update dynamically as new experimental runs and measurements are completed."
          },
          {
            page: "autonomy.html",
            sel: "#sayac",
            tag: "Stop 7 / 10 · Autonomy",
            h: "Hourly Verified Live Counters",
            p: "Task, hypothesis, and verification counters across our multi-agent system, read directly from live logs every hour.",
            deep: "No unmeasured figure enters the site; every counter is bound to verifiable disk logs."
          },
          {
            page: "autonomy.html",
            sel: "#ablasyon",
            tag: "Stop 8 / 10 · Ablation",
            h: "3-Arm Context and Cost Ablation",
            p: "Compare duration (11 / 8 / 5 min) and context load across three arms passing through the exact same verification gate.",
            deep: "Skipping the extra context pack preserved the exact same decision while cutting duration by more than half."
          },
          {
            page: "autonomy.html",
            sel: "#halka",
            tag: "Stop 9 / 10 · Evolution Loop",
            h: "4-Step Closed Evolution Loop",
            p: "Decaying rules → Candidate (Enki) → Blind stamp (Enlil) → Shadow test (Enkidu).",
            deep: "Constructive voice Enki and blind judge Enlil have no direct channel, preventing bias and sycophancy."
          },
          {
            page: "autonomy.html",
            sel: "#maya",
            tag: "Stop 10 / 10 · Maya",
            h: "Maya: Daughter of ATLAS & Assistant",
            p: "See how my validation loss dropped 240-fold from 3.600 down to 0.015 and review the pre/post-training table.",
            deep: "You can drag me anywhere on the screen or pick any tour route to explore the site."
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
            h: "Midline, Zenith & Incisal Curve",
            p: "Schematic guide lines across the six anterior teeth showing midline, gingival zeniths, and tooth proportions.",
            deep: "Guide lines ensure the proposed morphology harmonizes with natural facial symmetry."
          },
          {
            page: "en.html",
            sel: "#how .pipe",
            tag: "Clinical 2 / 5 · 5 Steps",
            h: "From Smartphone Photos to ExoCAD",
            p: "Starting from two photographs, the workflow produces guided previews and an ExoCAD work package upon approval.",
            deep: "Clinics without ExoCAD can still use our form proposals and guided before/after mockups."
          },
          {
            page: "en.html",
            sel: ".sk",
            tag: "Clinical 3 / 5 · 3D Cephalometry",
            h: "Live 3D Cephalometric Simulation",
            p: "Interactive 478-point 3D mesh measuring bizygomatic and mandibular proportions on a 100% synthetic portrait.",
            deep: "Use the module buttons to compare the 3D cephalometric mesh, untrained AI, and our QLoRA model."
          },
          {
            page: "en.html",
            sel: "#ornek",
            tag: "Clinical 4 / 5 · Before / After",
            h: "Retracted & Mouth-Crop Slider",
            p: "Slide left and right to inspect the before and after morphology on the same dentition.",
            deep: "Gingival margins and lips remain untouched while tooth morphology is reconstructed."
          },
          {
            page: "en.html",
            sel: "#faq",
            tag: "Clinical 5 / 5 · Privacy & FAQ",
            h: "Patient Privacy & Clinical FAQ",
            p: "Clear answers on required photographs, deliverables, and strict local privacy protection.",
            deep: "Full faces never leave studio hardware; only de-identified mouth crops are processed."
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
            p: "Hourly updated counters tracking hypotheses, watchdogs, and verification gates.",
            deep: "Every metric is read directly from production JSON logs."
          },
          {
            page: "autonomy.html",
            sel: "#ajanlar",
            tag: "Autonomy 2 / 5 · Scorecards",
            h: "Agent Scorecards",
            p: "Performance scorecards for Enkidu, Enki, Enlil, Kalfa, and Spark.",
            deep: "No agent is permitted to grade its own output."
          },
          {
            page: "autonomy.html",
            sel: "#ablasyon",
            tag: "Autonomy 3 / 5 · Ablation",
            h: "Context & Cost Ablation",
            p: "Measuring duration and token load across three context configurations.",
            deep: "Trimming redundant context halved execution time without altering the gate decision."
          },
          {
            page: "autonomy.html",
            sel: "#halka",
            tag: "Autonomy 4 / 5 · Evolution",
            h: "Closed Evolution Loop",
            p: "Four-step closed loop evolving the rule set rather than spawning unchecked agents.",
            deep: "Candidates must pass the 240-episode / 28-day statistical gate before going live."
          },
          {
            page: "autonomy.html",
            sel: "#maya",
            tag: "Autonomy 5 / 5 · Maya",
            h: "Maya Training Curve (3.600 → 0.015)",
            p: "Pre-training vs. post-training validation loss and daily self-iteration benchmarks.",
            deep: "Trained by Atlas to require verifiable measurements and guide visitors across the lab."
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
            h: "7-Step Spark Thesis Procedure",
            p: "Pre-expectation, measurement, anonymous brief, independent voices, source check, synthesis, and scorecard.",
            deep: "Independent model families answer without hearing one another; fabricated citations are eliminated."
          },
          {
            page: "spark.html",
            sel: "#karne",
            tag: "Spark 2 / 4 · 49 Rounds",
            h: "Scorecard Across 49 Rounds",
            p: "Measured distribution of thesis and counter-thesis performance across model families.",
            deep: "Every claim must carry an explicit falsification condition."
          },
          {
            page: "spark.html",
            sel: "#makaleler",
            tag: "Spark 3 / 4 · Experiments",
            h: "Cephalometric QLoRA & Evolution",
            p: "Experimental papers born from Spark rounds and 4-arm ablation studies.",
            deep: "Hypotheses are tested directly on local GPU benchmarks."
          },
          {
            page: "blog.html",
            sel: "main",
            tag: "Spark 4 / 4 · Archive",
            h: "All Studio Essays (7 Papers)",
            p: "Complete collection of our living research papers and strategic analyses.",
            deep: "Click any essay to inspect full tables, methodology, and primary sources."
          }
        ]
      }
    ]
  };

  var routeList = isEn ? ROUTES.en : ROUTES.tr;

  // Durum değişkenleri
  var state = {
    open: false,
    routeId: "full",
    stepIdx: 0,
    showDeep: false,
    showRoutes: false,
    autoPlay: false,
    userDragged: false,
    posX: window.innerWidth - 395,
    posY: window.innerHeight - 105
  };

  var autoTimer = null;
  var currentSpotEl = null;
  var lookTargetX = 0; // -1 (sola bak) .. +1 (sağa bak)
  var lookTargetY = 0;
  var exprPulse = 0; // Yeni durağa gelince 3B gülümseme/kaş mimiği

  function getRoute(id) {
    for (var i = 0; i < routeList.length; i++) {
      if (routeList[i].id === id) return routeList[i];
    }
    return routeList[0];
  }

  function currentPageFile() {
    var p = location.pathname.split("/").pop();
    if (!p || p === "") return "index.html";
    return p;
  }

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        open: state.open,
        routeId: state.routeId,
        stepIdx: state.stepIdx,
        autoPlay: state.autoPlay,
        ts: Date.now()
      }));
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

  // DOM Kurulumu
  var carrier = document.createElement("div");
  carrier.className = "maya-carrier";
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
      '<span class="maya-pill-sub">' + (isEn ? "▶ Start Tour" : "▶ Turu Başlat") + '</span>' +
    '</button>' +
    '<div class="maya-bubble" id="maya-bubble" hidden>' +
      '<div class="maya-b-head">' +
        '<div class="maya-b-title">' +
          '<span>' + (isEn ? "Maya — Daughter of ATLAS · Assistant" : "Maya — ATLAS\'ın Kızı · Asistan") + '</span>' +
        '</div>' +
        '<div class="maya-b-controls">' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-routes" title="' + (isEn ? "Choose Tour Route" : "Tur Rotası Seç") + '">' + (isEn ? "Routes" : "Rotalar") + '</button>' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-auto" title="' + (isEn ? "Auto-scroll & advance" : "Otomatik kaydır ve ilerle") + '">' + (isEn ? "Auto ▶" : "Oto ▶") + '</button>' +
          '<button type="button" class="maya-icon-btn" id="maya-btn-close" title="' + (isEn ? "Minimize" : "Küçült") + '">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="maya-routes" id="maya-routes-bar" hidden></div>' +
      '<div class="maya-dots" id="maya-dots"></div>' +
      '<div class="maya-step-tag" id="maya-step-tag"></div>' +
      '<h4 class="maya-step-h" id="maya-step-h"></h4>' +
      '<p class="maya-step-p" id="maya-step-p"></p>' +
      '<div class="maya-step-deep" id="maya-step-deep" hidden></div>' +
      '<div class="maya-b-foot">' +
        '<button type="button" class="maya-btn-sm" id="maya-btn-prev">◀</button>' +
        '<button type="button" class="maya-btn-sm" id="maya-btn-deep">' + (isEn ? "Details" : "Detay") + '</button>' +
        '<button type="button" class="maya-btn-sm pri" id="maya-btn-next">' + (isEn ? "Next Stop ▶" : "Sonraki ▶") + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(carrier);

  var orbEl = document.getElementById("maya-orb");
  var orbClip = document.getElementById("maya-orb-clip");
  var miniPill = document.getElementById("maya-mini-pill");
  var bubbleEl = document.getElementById("maya-bubble");
  var routesBar = document.getElementById("maya-routes-bar");
  var dotsEl = document.getElementById("maya-dots");
  var tagEl = document.getElementById("maya-step-tag");
  var hEl = document.getElementById("maya-step-h");
  var pEl = document.getElementById("maya-step-p");
  var deepEl = document.getElementById("maya-step-deep");
  var btnRoutes = document.getElementById("maya-btn-routes");
  var btnAuto = document.getElementById("maya-btn-auto");
  var btnClose = document.getElementById("maya-btn-close");
  var btnPrev = document.getElementById("maya-btn-prev");
  var btnDeep = document.getElementById("maya-btn-deep");
  var btnNext = document.getElementById("maya-btn-next");

  // Taşıyıcı konumlandırma (Ekran dışına taşmayı önler)
  function setCarrierPos(x, y, bubbleOnLeft) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var rect = carrier.getBoundingClientRect();
    var w = rect.width || (state.open ? 388 : 260);
    var h = rect.height || (state.open ? 210 : 80);

    var clampedX = Math.max(12, Math.min(vw - w - 12, x));
    var clampedY = Math.max(64, Math.min(vh - h - 12, y));

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
    carrier.classList.add("bubble-left");
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var w = state.open ? Math.min(390, vw - 24) : 265;
    var h = state.open ? 225 : 84;
    setCarrierPos(vw - w - 18, vh - h - 18, true);
  }

  // Sürükle & Bırak (Kullanıcı Maya'yı sitede istediği yere serbestçe taşıyabilir)
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
      state.userDragged = true;
    }
    if (dragInfo.moved) {
      var onLeft = (dragInfo.origX + dx) > window.innerWidth * 0.48;
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

  // Rota Seçici Çubuğu Oluşturma
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
        state.showDeep = false;
        state.showRoutes = false;
        routesBar.hidden = true;
        btnRoutes.classList.remove("active");
        goToCurrentStop(true);
      });
      routesBar.appendChild(b);
    });
  }

  function clearSpotlight() {
    if (currentSpotEl) {
      currentSpotEl.classList.remove("maya-spot-target");
      currentSpotEl = null;
    }
  }

  // Maya'yı hedef bölümün yanına taşı ve sayfayı otomatik kaydır
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
    var targetScrollY = Math.max(0, absTop - Math.max(110, (window.innerHeight - Math.min(rect.height, 420)) * 0.38));

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });

    // Kaydırma tamamlanırken Maya'yı hedef kutunun sağ veya sol kenarına uçur
    setTimeout(function () {
      if (!state.open) return;
      var r = el.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var carrierW = Math.min(390, vw - 24);
      var carrierH = bubbleEl.offsetHeight || 210;

      var targetY = Math.max(76, Math.min(vh - carrierH - 18, r.top + Math.min(40, r.height * 0.15)));
      var targetX;
      var bubbleOnLeft = true;

      if (vw < 760) {
        // Mobil ekranda içeriği kapatmamak için sağ alt köşeye zarifçe yanaş
        targetX = vw - carrierW - 12;
        targetY = vh - carrierH - 12;
        bubbleOnLeft = true;
        lookTargetX = 0;
      } else if (r.right + carrierW + 24 < vw) {
        // Hedefin sağında boşluk varsa sağına kon, sola (içeriğe) bak
        targetX = r.right + 16;
        bubbleOnLeft = false;
        lookTargetX = -0.35;
      } else if (r.left - carrierW - 24 > 0) {
        // Hedefin solunda boşluk varsa soluna kon, sağa (içeriğe) bak
        targetX = r.left - carrierW - 16;
        bubbleOnLeft = true;
        lookTargetX = 0.35;
      } else {
        // Geniş bölümse sağ kenara zarifçe kon, içeriğe doğru bak
        targetX = vw - carrierW - 20;
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
          state.showDeep = false;
          goToCurrentStop(true);
        });
        dotsEl.appendChild(d);
      })(i);
    }
  }

  function goToCurrentStop(scrollAndGlide) {
    var route = getRoute(state.routeId);
    if (!route || !route.stops.length) return;
    if (state.stepIdx < 0) state.stepIdx = 0;
    if (state.stepIdx >= route.stops.length) state.stepIdx = 0;

    var stop = route.stops[state.stepIdx];
    var curPage = currentPageFile();

    // Durak başka sayfadaysa durumu kaydet ve o sayfaya geç (sayfa açılınca kaldığı yerden devam eder)
    if (stop.page && stop.page !== curPage) {
      saveState();
      location.href = stop.page + (stop.sel && stop.sel.charAt(0) === "#" ? stop.sel.split(" ")[0] : "");
      return;
    }

    renderRouteChips();
    renderDots(route.stops.length, state.stepIdx);

    tagEl.textContent = stop.tag;
    hEl.textContent = stop.h;
    pEl.textContent = stop.p;
    deepEl.textContent = stop.deep || "";
    deepEl.hidden = !state.showDeep;
    btnDeep.classList.toggle("active", state.showDeep);

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
    goToCurrentStop(true);
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
          state.showDeep = false;
          goToCurrentStop(true);
        } else {
          toggleAutoPlay();
        }
      }, 6200);
    }
    saveState();
  }

  btnRoutes.addEventListener("click", function () {
    state.showRoutes = !state.showRoutes;
    routesBar.hidden = !state.showRoutes;
    btnRoutes.classList.toggle("active", state.showRoutes);
  });

  btnAuto.addEventListener("click", function () {
    toggleAutoPlay();
  });

  btnClose.addEventListener("click", function () {
    minimizeTour();
  });

  btnPrev.addEventListener("click", function () {
    var route = getRoute(state.routeId);
    state.stepIdx = (state.stepIdx - 1 + route.stops.length) % route.stops.length;
    state.showDeep = false;
    goToCurrentStop(true);
  });

  btnDeep.addEventListener("click", function () {
    state.showDeep = !state.showDeep;
    deepEl.hidden = !state.showDeep;
    btnDeep.classList.toggle("active", state.showDeep);
    exprPulse = 0.85;
  });

  btnNext.addEventListener("click", function () {
    var route = getRoute(state.routeId);
    state.stepIdx = (state.stepIdx + 1) % route.stops.length;
    state.showDeep = false;
    goToCurrentStop(true);
  });

  window.addEventListener("resize", function () {
    if (!state.open) {
      parkBottomRight();
    } else {
      setCarrierPos(state.posX, state.posY, carrier.classList.contains("bubble-left"));
    }
  });

  // =========================================================================
  // 1) 60 FPS Kanvas Sprite Katmanı (Anında Açılış + Doğal Göz Kırpma & Mimik)
  // =========================================================================
  var spriteCanvas = document.getElementById("maya-sprite-canvas");
  var sCtx = spriteCanvas.getContext("2d");
  var spriteImg = new Image();
  var spriteLoaded = false;
  spriteImg.onload = function () {
    spriteLoaded = true;
  };
  spriteImg.src = "/ornek/maya/maya-sprite.jpg";

  // =========================================================================
  // 2) Blender 5.1.0 (maya-3d.glb) + Three.js WebGL 3B Canlı Avatar Motoru
  // =========================================================================
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
        var w = 156, h = 156;
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
        camera.position.set(0, 0.02, 2.15);

        var amb = new THREE.AmbientLight(0xffffff, 1.35);
        scene.add(amb);

        var keyLight = new THREE.DirectionalLight(0xfff7ed, 0.95);
        keyLight.position.set(1.2, 1.4, 2.2);
        scene.add(keyLight);

        var rimLight = new THREE.DirectionalLight(0x00e5ff, 0.55);
        rimLight.position.set(-1.5, 0.6, 1.0);
        scene.add(rimLight);

        var loader = new GLTFLoader();
        loader.load("/ornek/maya/maya-3d.glb", function (gltf) {
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

  // Fare takibi (Maya imlece ve vurgulanan bölüme hafifçe başını çevirir)
  var mouseNormX = 0;
  var mouseNormY = 0;
  window.addEventListener("pointermove", function (ev) {
    mouseNormX = ((ev.clientX / Math.max(1, window.innerWidth)) - 0.5) * 2;
    mouseNormY = ((ev.clientY / Math.max(1, window.innerHeight)) - 0.5) * 2;
  }, { passive: true });

  var blinkNextAt = performance.now() + 2600;
  var blinkEndAt = 0;

  function animateAvatar(now) {
    requestAnimationFrame(animateAvatar);
    var t = now * 0.001;

    // Doğal göz kırpma zamanlayıcısı
    var blinkVal = 0;
    if (now >= blinkNextAt) {
      blinkEndAt = now + 150;
      blinkNextAt = now + 2800 + Math.random() * 2600;
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

    // 1) Three.js 3B Blender GLB Sahnesi Aktifse
    if (threeReady && threeMesh && threeRenderer) {
      var dict = threeMesh.morphTargetDictionary || {};
      var infl = threeMesh.morphTargetInfluences;
      if (infl) {
        if (dict.Blink !== undefined) infl[dict.Blink] = blinkVal;
        if (dict.MouthSmile !== undefined) infl[dict.MouthSmile] = 0.25 + 0.45 * exprPulse + 0.08 * Math.sin(t * 1.7);
        if (dict.BrowRaise !== undefined) infl[dict.BrowRaise] = 0.35 * exprPulse + 0.06 * Math.sin(t * 1.1);
        if (dict.JawOpen !== undefined) infl[dict.JawOpen] = 0.08 * exprPulse;
      }
      var targetYaw = (lookTargetX * 0.65) + (mouseNormX * 0.12) + Math.sin(t * 0.9) * 0.04;
      var targetPitch = (lookTargetY * 0.3) + (mouseNormY * 0.08) + Math.cos(t * 0.7) * 0.03;
      threeMesh.rotation.y += (targetYaw - threeMesh.rotation.y) * 0.08;
      threeMesh.rotation.x += (targetPitch - threeMesh.rotation.x) * 0.08;
      threeMesh.position.y = Math.sin(t * 1.6) * 0.012;
      threeRenderer.render(threeScene, threeCamera);
      return;
    }

    // 2) Yedek 60 FPS Kanvas Sprite Katmanı
    if (spriteLoaded) {
      var frameW = spriteImg.width / 6;
      var frameH = spriteImg.height;
      var frameIdx = 0; // neutral
      if (blinkVal > 0.45) {
        frameIdx = 1; // blink
      } else if (exprPulse > 0.25) {
        frameIdx = 4; // smile
      }
      sCtx.clearRect(0, 0, 220, 220);
      var breathe = Math.sin(t * 1.8) * 2.2;
      sCtx.drawImage(spriteImg, frameIdx * frameW, 0, frameW, frameH, -3, breathe - 3, 226, 226);
    }
  }

  // Başlangıç
  parkBottomRight();
  initThreeAvatar();
  requestAnimationFrame(animateAvatar);

  // Eğer sayfalar arası tur devam ediyorsa otomatik aç ve ilgili durağa kaydır
  var saved = loadState();
  if (saved && saved.open) {
    state.routeId = saved.routeId || "full";
    state.stepIdx = saved.stepIdx || 0;
    state.autoPlay = !!saved.autoPlay;
    setTimeout(function () {
      startOrOpenTour();
      if (state.autoPlay) {
        state.autoPlay = false;
        toggleAutoPlay();
      }
    }, 350);
  }

  // Dışarıdan erişim API'si
  window.AtlasMaya = {
    startTour: function (routeId) {
      startOrOpenTour(routeId || "full");
    },
    minimize: minimizeTour
  };
})();
