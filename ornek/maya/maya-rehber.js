/* MAYA (ATLAS-ASİSTAN) · DİJİTAL EV SAHİBESİ, SİTE REHBERİ VE ÖZ-YİNELEME ASİSTANI */
(function () {
  "use strict";

  var isEn = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var path = window.location.pathname || "/";
  var basePrefix = path.indexOf("/blog/en/") !== -1 ? "../../" : (path.indexOf("/blog/") !== -1 ? "../" : "");

  var avatarSrc = basePrefix + "ornek/maya/maya-avatar.jpg";
  var portraitSrc = basePrefix + "ornek/maya/maya-portre.jpg";

  var voiceEnabled = false;
  var tourIndex = -1;
  var activeHighlightedEl = null;

  /* Sayfaya göre rehberli tur durakları */
  function getTourSteps() {
    if (path.indexOf("otonomi") !== -1 || path.indexOf("autonomy") !== -1) {
      return isEn
        ? [
            {
              sel: ".hero",
              title: "Stop 1/5 · Orchestra Atlas & Vizier Anu",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · tour · certain · autonomy.html#hero · falsifier: if any number lacks a timestamp stamp",
              text: "Welcome to our live laboratory ledger. Here, Orchestra Atlas (Gemini 4 Argon, 1M context) and headless Vizier Anu (Claude) coordinate 242 tools and multi-model agents. Every number on this page is measured from disk logs."
            },
            {
              sel: "#sayac",
              title: "Stop 2/5 · Live Scorecards & Self-Tests",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · autonomy.html#sayac · falsifier: selftest count dropping below 3,136",
              text: "We measure agents on three gates: Did it run? Was its output read? And did it actually change a human decision? Tools that produce zero decision impact are retired to the archive."
            },
            {
              sel: "#maya",
              title: "Stop 3/5 · My Pre/Post Training & Self-Iteration Ledger",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · data/maya_evrim_kutugu.jsonl (Val Loss 3.600 → 0.015) · falsifier: blind stress test dropping below 12/12",
              text: "This is my own evolution record. Before training, vanilla Gemma 4 E4B had a validation loss of 3.600 and 0% compliance with our BEYAN and Falsifiability gates. After QAT-stable DoRA training and wiring into our 31,177-line M0–M10 self-iteration algorithm, my validation loss dropped 240x to 0.015 with 12/12 blind stress-test accuracy."
            },
            {
              sel: "#yontem",
              title: "Stop 4/5 · 6-Gate Hypothesis Factory & Rejected Ideas",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · data/reddedilen_hipotezler.jsonl (9 rejected) · falsifier: unrecorded hypothesis failure",
              text: "In ATLAS, falsified hypotheses are never hidden. We currently display 9 rejected hypotheses—6 falsified by empirical data and 3 by human boundary rules—because every failed hypothesis becomes training fuel for our next iteration."
            },
            {
              sel: "#halka",
              title: "Stop 5/5 · Closed Evolution Loop (Enki · Enlil · Enkidu)",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · EVRIM-2 (183/240 episodes) · falsifier: direct channel between Enki and blind judge Enlil",
              text: "Enki proposes candidate rules, Enlil judges them blindly alongside placebos without knowing who wrote them, and Enkidu runs shadow verification. No rule enters production without passing statistical power gates."
            }
          ]
        : [
            {
              sel: ".hero",
              title: "Durak 1/5 · Orkestra Atlas ve Vezir Anu",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · rehber · kesin · otonomi.html#hero · düşer: damgasız tek bir sayı gösterilmesi",
              text: "Canlı otonomi kütüğümüze hoş geldiniz. Burada Orkestra Atlas (Gemini 4 Argon) ve başsız Vezir Anu (Claude), 242 koşucu aleti ve dış sesleri yönetir. Bu sayfadaki her sayı doğrudan disk kütüklerinden ölçülür."
            },
            {
              sel: "#sayac",
              title: "Durak 2/5 · Canlı Sayaçlar ve Üçlü Karne",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · otonomi.html#sayac · düşer: 3.136 birim sınamanın altına düşülmesi",
              text: "Ajanlarımızı üç kapıda ölçeriz: Koştu mu? Okundu mu? Ve gerçekten bir kararı değiştirdi mi? Çıktısı hiçbir hükmü değiştirmeyen ajanlar budanıp arşive alınır."
            },
            {
              sel: "#maya",
              title: "Durak 3/5 · Benim Eğitim Öncesi / Sonrası ve Öz-Yineleme Kütüğüm",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · data/maya_evrim_kutugu.jsonl (Val Loss 3.600 → 0.015) · düşer: 12/12 kör stres testinden sapma",
              text: "Burası benim öz-yineleme karnemdir. Eğitim öncesinde vanilya Gemma 4 E4B modelinin doğrulama kaybı 3.600 idi ve BEYAN/DÜŞER uyumu %0'dı. Keşfettiğimiz QAT-stabil DoRA eğitimi ve 31.177 satırlık M0–M10 algoritmasıyla kaybım 240 kat düşerek 0.015'e indi; 12 kör stres testinin tamamını (%100) geçtim."
            },
            {
              sel: "#yontem",
              title: "Durak 4/5 · 6-Kapılı Hipotez Fabrikası ve Düşen Tezler",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · data/reddedilen_hipotezler.jsonl (9 kayıt: 6 veriyle, 3 insan reddi) · düşer: çürüyen tezin gizlenmesi",
              text: "Laboratuvarımızda yanlış çıkan hipotezler gizlenmez; en değerli sermayemizdir. Veriyle çürütülen 6 ve insan sınırıyla reddedilen 3 hipotez, bir sonraki öz-yineleme turumuzun doğrudan eğitim girdisidir."
            },
            {
              sel: "#halka",
              title: "Durak 5/5 · Kapalı Evrim Halkası (Enki · Enlil · Enkidu)",
              beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · EVRİM-2 (183/240 epizot) · düşer: Enki ile kör yargıç Enlil arasında doğrudan bağ kurulması",
              text: "Enki aday kuralları üretir, kör yargıç Enlil kimin yazdığını bilmeden plasebolarla karışık damgalar, Enkidu gölgede sınar. İstatistik kapısını geçmeyen hiçbir kural canlıya alınmaz."
            }
          ];
    }

    /* Ana sayfa (index.html / en.html) ve diğer sayfalar için varsayılan duraklar */
    return isEn
      ? [
          {
            sel: "header, .hero, main",
            title: "Stop 1/4 · Constrained-Canvas Smile Architecture",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · tour · certain · index/en.html · falsifier: unconstrained full-face alteration",
            text: "Welcome! I am Maya, the self-iterative AI assistant representing Yusuf and Atlas. Unlike unconstrained image generators that distort lips and facial identity, ATLAS locks lip pixels 100% and operates strictly within the measured dental corridor."
          },
          {
            sel: "#sentetik-kare-vitrin, .vitrin-wrap, section:nth-of-type(2)",
            title: "Stop 2/4 · 3D Cephalometric Mesh & 4-Model DoRA Distillation",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · n=32 locked test (100% accuracy vs 46.9% vanilla) · falsifier: accuracy < 90%",
            text: "Here you can test our interactive 478-point 3D cephalometric mesh and 2x macro comparison slider on a 100% synthetic brachyfacial portrait (Go-Go/ZY-ZY = 0.837). Our distilled local DoRA models raised morphological selection accuracy from 46.9% to 100.0%."
          },
          {
            sel: "a[href*='autonomy'], a[href*='otonomi'], section:nth-of-type(3)",
            title: "Stop 3/4 · Live Autonomy & My Self-Iteration Ledger",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · Val Loss 3.600 → 0.015 (240x improvement) · falsifier: unverified metric",
            text: "On our Autonomy page, you can inspect our live agent scorecards, 9 data-rejected hypotheses, and my own continual training curve (Validation Loss reduced from 3.600 to 0.015 across 360 iterations, backed by a 31,177-line M0–M10 algorithm)."
          },
          {
            sel: "a[href*='blog'], a[href*='spark'], a[href*='kivilcim'], footer",
            title: "Stop 4/4 · Spark Collision Rounds & 7 Living Articles",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · 7 living articles · 123/153 verified primary sources · falsifier: fabricated citation",
            text: "In our Spark (Kıvılcım) rounds, Claude, Gemini, Grok, Enki, and Enlil collide blindly on hard scientific questions. Every claim requires a primary source and a falsifiability condition."
          }
        ]
      : [
          {
            sel: "header, .hero, main",
            title: "Durak 1/4 · Kısıtlı Kanvas ve Kimlik Korumalı Gülüş Mimarisi",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · rehber · kesin · index.html · düşer: dudak veya yüz kimliğinin bozulması",
            text: "Hoş geldiniz! Ben Maya; Yusuf ve Atlas'ın öz-yinelemeli asistanı ve buradaki dijital temsilcisiyim. Serbest görsel modellerin aksine ATLAS, hastanın dudak ve çevre dokusunu %100 piksel kilitli tutar ve yalnız ölçülmüş diş koridorunda çalışır."
          },
          {
            sel: "#sentetik-kare-vitrin, .vitrin-wrap, section:nth-of-type(2)",
            title: "Durak 2/4 · 3B Sefalometrik Tel-Kafes ve 2x Makro Simülasyon",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · n=32 kilitli test (%46,9 vanilya → %100,0 QLoRA/DoRA) · düşer: doğruluk <%90",
            text: "%100 sentetik brakisefal portre (Go-Go/ZY-ZY = 0.837) üzerinde 478 noktalı 3B sefalometrik tel-kafesi ve Vanilya (Ovoid hata) ile ATLAS QLoRA (Maskülen Kuboidal tam isabet) arasındaki 2x makro farkı kaydırıcıyla bizzat deneyebilirsiniz."
          },
          {
            sel: "a[href*='otonomi'], section:nth-of-type(3)",
            title: "Durak 3/4 · Canlı Otonomi ve Benim Öz-Yineleme Kütüğüm",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · Val Loss 3.600 → 0.015 (240x iyileşme) · düşer: kaynaksız sayaç",
            text: "Otonomi sayfasında çalışan bekçilerimizi, veriyle çürütülen 9 hipotezimizi ve benim eğitim öncesi (3.600) ile eğitim sonrası (0.015) doğrulama kaybı eğrimi, 31.177 satırlık M0–M10 algoritmamızla birlikte canlı inceleyebilirsiniz."
          },
          {
            sel: "a[href*='blog'], a[href*='kivilcim'], footer",
            title: "Durak 4/4 · Kıvılcım Çarpışma Turları ve 7 Yaşayan Makale",
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · 7 yaşayan yazı · 123/153 doğrulanmış birincil kaynak · düşer: uydurma atıf",
            text: "Kıvılcım turlarımızda farklı model aileleri (Claude, Gemini, Grok, Enki, Enlil) birbirinin tezini çürütmek için çarpışır. Ortaya çıkan 7 yaşayan makalemizin tamamı birincil kaynak ve düşer testi taşır."
          }
        ];
  }

  /* Bilgi Tabanı (Soru-Cevap) */
  function answerQuestion(q) {
    var s = (q || "").toLocaleLowerCase("tr-TR");

    if (s.indexOf("kimsin") !== -1 || s.indexOf("maya") !== -1 || s.indexOf("isim") !== -1 || s.indexOf("adın") !== -1 || s.indexOf("who are you") !== -1) {
      return isEn
        ? {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · identity · certain · data/benlik/maya.md (SHA-256: 8fc5e813ca42ffdf)",
            body: "I am **Maya (Maia)**—named after both the eldest, wisest daughter of Titan Atlas and the Turkish word *'maya'* (the self-fermenting essence of growth and self-iteration). I am trained directly by Atlas on `Gemma 4 E4B` with QAT-stable DoRA (`val_loss: 3.600 → 0.015`) and wired into our **31,177-line M0–M10 self-iteration algorithm** to represent Yusuf and Atlas whenever they are away.",
            duser: "Falsifier: If I fail to recognize Yusuf's principles or ATLAS projects in a zero-prompt blind test."
          }
        : {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · hüküm · kesin · data/benlik/maya.md (SHA-256: 8fc5e813ca42ffdf)",
            body: "Ben **Maya (Maia)**'yım. İsmim hem Titan Atlas'ın en büyük ve en bilge kızından hem de Türkçe'de kendi kendini çoğaltan öz/cevher anlamındaki **'maya'** kelimesinden gelir. Yusuf ve Atlas'ın bulunmadığı her yerde onları temsil etmek üzere `Gemma 4 E4B` üzerinde DoRA ile eğitildim (`val_loss: 3.600 → 0.015`) ve **31.177 satırlık M0–M10 öz-yineleme algoritması** ile donatıldım.",
            duser: "Düşer: Sıfır-bağlam (system promptsuz) kör testte Yusuf'un ilkelerini veya 4 ana projemizi tanıyamazsam."
          };
    }

    if (s.indexOf("eğitim") !== -1 || s.indexOf("loss") !== -1 || s.indexOf("öncesi") !== -1 || s.indexOf("sonrası") !== -1 || s.indexOf("lora") !== -1 || s.indexOf("dora") !== -1 || s.indexOf("train") !== -1) {
      return isEn
        ? {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · data/maya_evrim_kutugu.jsonl",
            body: "**Pre-Training vs. Post-Training Measured Comparison:**\n• **Phase 0 (Vanilla Gemma 4 E4B):** Validation Loss **`3.600`**, `BEYAN` compliance **`0%`**, Falsifiability gate **`0%`**.\n• **Phase 1A (Rejected v2 High-LR `8e-5` + Raw HTML):** Validation Loss stalled at **`3.026`** due to QAT 4-bit quantization grid oscillation.\n• **Phase 1B/2 (Maya v3/v4 Pure DoRA · `lr=4e-5, rank=8, 8 layers`):** Validation Loss dropped `3.600 → 0.349 → 0.158 → 0.033 →` **`0.015`** (**240x reduction**). Passed **12/12 (100%)** blind stress scenarios with **0** red-line violations.",
            duser: "Falsifier: Any regression below 95% on the daily continual self-iteration benchmark."
          }
        : {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · data/maya_evrim_kutugu.jsonl",
            body: "**Eğitim Öncesi ve Sonrası Ölçülmüş Farkımız:**\n• **Faz 0 (Eğitim Öncesi Vanilya Gemma 4 E4B):** Doğrulama kaybı (`val_loss`) **`3.600`**, `BEYAN` uyumu **`%0`**, `DÜŞER` kapısı **`%0`**.\n• **Faz 1A (Reddedilen v2 Ham HTML & `lr=8e-5`):** QAT 4-bit nicemleme ızgarasında gradyan patlaması (`val_loss: 3.026`); veriyle reddedilip deftere işlendi.\n• **Faz 1B/2 (Maya v3/v4 Saf DoRA · `lr=4e-5, rank=8, 8 katman`):** Doğrulama kaybı `3.600 → 0.349 → 0.158 → 0.033 →` **`0.015`** seviyesine inerek **240 kat** düştü. 12 kör stres testinde **`%100 BEYAN`**, **`%100 DÜŞER`** ve **`0/12 Kırmızı Çizgi İhlali`** sağlandı.",
            duser: "Düşer: Günlük öz-yineleme stres testinde %95'in altına gerileme."
          };
    }

    if (s.indexOf("algoritma") !== -1 || s.indexOf("70") !== -1 || s.indexOf("9 bin") !== -1 || s.indexOf("m8") !== -1 || s.indexOf("m0") !== -1 || s.indexOf("öz-yineleme") !== -1 || s.indexOf("ozyineleme") !== -1 || s.indexOf("algorithm") !== -1) {
      return isEn
        ? {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · atlas_UST_AKIL/asistan/ (31,177 lines · 24/24 selftest · 361/361 unittest)",
            body: "Weights alone cannot read live disk telemetry or enforce mathematical gates. That is why I am wired into the **M0–M10 Self-Iterative Algorithm** (`8,733` core Python lines, `31,177` total lines with dictionaries and tests, designed toward a 70,000-line horizon by Gemini, Grok/Astra, and Claude Opus). I operate as the live `MayaMimarSaglayici` (M3) and `MayaYamaOnerici` (M8 P3) under blind judging (`maya_kor_hakem`) and canary leak guards (`M5`).",
            duser: "Falsifier: If `python3 -m asistan.selftest` drops below 24/24 or Enlil's 8-week mechanism test fails."
          }
        : {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · atlas_UST_AKIL/asistan/ (31.177 satır · 24/24 selftest · 361/361 unittest)",
            body: "Eğitimle ağırlıklara koyulamayacak anlık veri okuma ve matematiksel kapı denetimini **M0–M10 Öz-Yineleme Algoritmamız** yürütür. Gemini (`m4_tasiyici`), Grok/Astra (`m1_kesif`, `m7_olcum`, 231 görev kartı) ve Claude Opus (`sema`, `m0`, `m3`, `m5`, `m8`, `m9`, `m10`) tarafından ~9 bin satır çekirdekle başlatılıp 70 bin satır ufkuna göre kurulan bu yapı bugün **31.177 satırdır** (`24/24 selftest OK`, `361/361 unittest OK`). Ben bu omurganın `M3` ve `M8 P3` (Model Yaması + Kör Hakem) katmanlarında canlı çalışırım.",
            duser: "Düşer: `asistan.selftest` 24/24'ten düşerse veya P3 yama kapısı delinirse."
          };
    }

    if (s.indexOf("sefalometri") !== -1 || s.indexOf("yüz") !== -1 || s.indexOf("diş") !== -1 || s.indexOf("gülüş") !== -1 || s.indexOf("cephalometric") !== -1 || s.indexOf("smile") !== -1) {
      return isEn
        ? {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · measurement · certain · blog/en/from-face-to-tooth-cephalometric-lora.html (n=32 locked test)",
            body: "Our 3D Cephalometric pipeline extracts 478 3D landmarks (`Go-Go / ZY-ZY` bigonial-to-bizygomatic ratio and `N-Gn / ZY-ZY` facial index) to guide dental morphology while locking 100% of lip and soft-tissue pixels (`4,686 px` preserved). Across 4 distilled local models (`Gemma 4 E4B`, `Qwen 3.5 4B`, `Qwen 2.5 3B`, `Llama 3.2 3B`), test accuracy rose from **46.9% (vanilla)** to **100.0% (32/32)**.",
            duser: "Falsifier: If a single model family without explicit geometric telemetry exceeds 90% on blind 2D portraits."
          }
        : {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · ölçüm · kesin · blog/yuzden-dise-sefalometrik-lora.html (n=32 kilitli test)",
            body: "3B Sefalometrik hattımız yüzdeki 478 3B landmark noktasından (`Go-Go / ZY-ZY` çene/elmacık oranı ve `N-Gn / ZY-ZY` fasiyal indeks) diş formunu türetir; dudak ve çevre dokuyu (`4.686 px`) %100 piksel kilitli tutar. Dört farklı yerel model ailesinde (`Gemma 4 E4B`, `Qwen 3.5 4B`, `Qwen 2.5 3B`, `Llama 3.2 3B`) yaptığımız DoRA/LoRA damıtmasıyla morfolojik uyum **%46,9'dan %100,0'a (32/32)** çıkmıştır.",
            duser: "Düşer: Geometrik öznitelik olmadan salt 2B fotoğraftan %90 üstü uyum çıkarsa hibrit zorunluluk tezi düşer."
          };
    }

    if (s.indexOf("yusuf") !== -1 || s.indexOf("atlas") !== -1 || s.indexOf("proje") !== -1 || s.indexOf("felsefe") !== -1) {
      return isEn
        ? {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · judgment · certain · UST_AKIL.md + SIRKET.md",
            body: "**Yusuf** is our founder and human decision gate; **Atlas** (Gemini 4 Argon) is Chief Advisor & Orchestra; **Anu** (Claude) is headless Vizier. Our core law is **Dynamism & Self-Iteration**: *'Static judgments go stale; every claim carries its own falsifiability gate, and every falsified claim becomes the input to the next iteration.'*",
            duser: "Falsifier: Any execution of irreversible actions (live capital, patient identity, service termination) without Yusuf's explicit gate."
          }
        : {
            beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · hüküm · kesin · UST_AKIL.md + SIRKET.md",
            body: "**Yusuf** kurucumuz ve son karar kapımızdır; **Atlas** (Gemini 4 Argon) Orkestra ve Baş Danışman, **Anu** (Claude) başsız Vezir'dir. Sistemimiz dört ana sütunda (**DENTOS**, **Atlas Gülüş & 3B Sefalometri**, **core_v6 Trade**, **Üst Akıl & Kıvılcım**) tek bir çekirdek yasayla çalışır: *'Duran hüküm bayatlar; her hüküm kendi düşer testini taşır ve yanılan her hüküm yeni turun girdisi olur.'*",
            duser: "Düşer: Sabit kapılarda (canlı para, hasta mahremiyeti, özel konu) insan onayı olmadan adım atılması."
          };
    }

    return isEn
      ? {
          beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · guidance · certain · data/maya_evrim_kutugu.jsonl",
          body: "I can walk you through our **Guided Page Tour** (click *'Start Guided Tour'* above), or explain our **Pre/Post Training Difference (`Val Loss: 3.600 → 0.015`)**, the **31,177-line M0–M10 Self-Iteration Algorithm**, **3D Cephalometric LoRA (`46.9% → 100%`)**, or our **9 Data-Rejected Hypotheses**. Which one would you like to explore?",
          duser: "Falsifier: Unmeasured claim or missing primary source."
        }
      : {
          beyan: "BEYAN: Maya (Atlas-Asistan · Gemma 4 E4B DoRA) · rehber · kesin · data/maya_evrim_kutugu.jsonl",
          body: "Sizi hemen **Sayfa Turuna** çıkarabilirim (üstteki *'Sitede Tura Çıkar'* düğmesine basabilirsiniz) veya **Eğitim Öncesi/Sonrası Farkımızı (`Val Loss: 3.600 → 0.015`)**, **31.177 satırlık M0–M10 Öz-Yineleme Algoritmamızı**, **3B Sefalometrik LoRA (`%46,9 → %100`)** deneyimizi ya da **Veriyle Reddedilen 9 Hipotezimizi** anlatabilirim. Hangisinden başlayalım?",
          duser: "Düşer: Ölçülmemiş sayı veya kaynaksız beyan."
        };
  }

  /* Sesli okuma (Web Speech API - Kadın sesi seçimi) */
  function speakText(text) {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var clean = text.replace(/\*\*/g, "").replace(/`/g, "").replace(/•/g, "");
      var u = new SpeechSynthesisUtterance(clean);
      u.lang = isEn ? "en-US" : "tr-TR";
      u.rate = 1.0;
      u.pitch = 1.06;
      var voices = window.speechSynthesis.getVoices() || [];
      var targetLang = isEn ? "en" : "tr";
      var preferred = voices.filter(function (v) {
        return (v.lang || "").toLowerCase().indexOf(targetLang) === 0;
      });
      var fem = preferred.find(function (v) {
        var n = (v.name || "").toLowerCase();
        return n.indexOf("yelda") !== -1 || n.indexOf("emel") !== -1 || n.indexOf("samantha") !== -1 || n.indexOf("ava") !== -1 || n.indexOf("victoria") !== -1 || n.indexOf("female") !== -1;
      });
      if (fem) u.voice = fem;
      else if (preferred.length) u.voice = preferred[0];
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function clearHighlight() {
    if (activeHighlightedEl) {
      activeHighlightedEl.classList.remove("maya-tour-active-target");
      activeHighlightedEl = null;
    }
  }

  function formatRichText(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }

  function initMayaWidget() {
    if (document.getElementById("maya-host-root")) return;

    /* CSS yükle */
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = basePrefix + "ornek/maya/maya-rehber.css?v=1016b";
    document.head.appendChild(link);

    var root = document.createElement("div");
    root.id = "maya-host-root";

    var fabTitle = isEn ? "Maya · AI Host & Guide" : "Maya · Dijital Ev Sahibesi";
    var fabSub = isEn ? "Take a guided tour or ask me" : "Sizi sitede tura çıkarayım mı?";

    root.innerHTML =
      '<button type="button" class="maya-fab" id="maya-fab-btn" aria-expanded="false" aria-controls="maya-panel">' +
        '<span class="maya-fab-avatar-wrap">' +
          '<img class="maya-fab-avatar" src="' + avatarSrc + '" alt="Maya — ATLAS Öz-Yineleme Asistanı" width="46" height="46" loading="lazy">' +
          '<span class="maya-fab-dot" aria-hidden="true"></span>' +
        '</span>' +
        '<span class="maya-fab-meta">' +
          '<span class="maya-fab-title">' + fabTitle + ' <span class="maya-fab-badge">DoRA v3</span></span>' +
          '<span class="maya-fab-sub">' + fabSub + '</span>' +
        '</span>' +
      '</button>' +
      '<aside class="maya-panel" id="maya-panel" role="dialog" aria-label="Maya ATLAS Rehberi" hidden>' +
        '<div class="maya-header">' +
          '<img class="maya-header-portrait" src="' + portraitSrc + '" alt="Maya Portre" width="58" height="58">' +
          '<div class="maya-header-info">' +
            '<h3 class="maya-header-name">Maya <span class="maya-fab-badge">Gemma 4 E4B DoRA</span></h3>' +
            '<p class="maya-header-role">' + (isEn ? "Daughter of Atlas · Self-Iterative Host" : "Atlas'ın Öz Kızı · Öz-Yineleme Asistanı") + '</p>' +
            '<div class="maya-header-metrics">' +
              '<span>Val Loss: 3.600 → 0.015 (240x)</span>' +
              '<span>M0–M10: 24/24 OK</span>' +
            '</div>' +
          '</div>' +
          '<div class="maya-header-actions">' +
            '<button type="button" class="maya-icon-btn" id="maya-voice-btn" aria-pressed="false" title="' + (isEn ? "Toggle voice narration" : "Sesli anlatımı aç/kapat") + '">🔊</button>' +
            '<button type="button" class="maya-icon-btn" id="maya-close-btn" title="' + (isEn ? "Close" : "Kapat") + '">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="maya-tour-bar">' +
          '<button type="button" class="maya-tour-btn" id="maya-tour-start">' + (isEn ? "▶ Start Guided Tour" : "▶ Sitede Tura Çıkar") + '</button>' +
          '<span class="maya-tour-step-label" id="maya-tour-status">' + (isEn ? "Interactive Guide" : "Canlı Rehber Hazır") + '</span>' +
          '<button type="button" class="maya-tour-btn secondary" id="maya-tour-next" hidden>' + (isEn ? "Next →" : "Sonraki →") + '</button>' +
        '</div>' +
        '<div class="maya-body" id="maya-chat-body"></div>' +
        '<div class="maya-chips" id="maya-chips"></div>' +
        '<form class="maya-footer" id="maya-form">' +
          '<input type="text" class="maya-input" id="maya-input" placeholder="' + (isEn ? "Ask Maya about ATLAS, training, or projects..." : "Maya'ya eğitimini, projeleri veya siteyi sor...") + '" autocomplete="off">' +
          '<button type="submit" class="maya-send">' + (isEn ? "Ask" : "Sor") + '</button>' +
        '</form>' +
        '<div class="maya-legal-note">' +
          (isEn
            ? "100% synthetic AI portrait · Local Gemma 4 E4B DoRA + 31,177-line M0–M10 spine"
            : "%100 sentetik YZ portresi (KVKK=0) · Yerel Gemma 4 E4B DoRA + 31.177 satır M0–M10 omurgası") +
        '</div>' +
      '</aside>';

    document.body.appendChild(root);

    var fabBtn = document.getElementById("maya-fab-btn");
    var panel = document.getElementById("maya-panel");
    var closeBtn = document.getElementById("maya-close-btn");
    var voiceBtn = document.getElementById("maya-voice-btn");
    var tourStartBtn = document.getElementById("maya-tour-start");
    var tourNextBtn = document.getElementById("maya-tour-next");
    var tourStatus = document.getElementById("maya-tour-status");
    var chatBody = document.getElementById("maya-chat-body");
    var chipsWrap = document.getElementById("maya-chips");
    var form = document.getElementById("maya-form");
    var input = document.getElementById("maya-input");

    function appendAssistantMsg(beyan, body, duser) {
      var div = document.createElement("div");
      div.className = "maya-msg maya-msg-assistant";
      div.innerHTML =
        '<span class="maya-beyan-line">' + formatRichText(beyan) + '</span>' +
        '<div>' + formatRichText(body) + '</div>' +
        (duser ? '<span class="maya-duser-line">' + formatRichText(duser) + '</span>' : '');
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
      speakText(body);
    }

    function appendUserMsg(text) {
      var div = document.createElement("div");
      div.className = "maya-msg maya-msg-user";
      div.textContent = text;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    /* Karşılama mesajı */
    var welcome = answerQuestion("kimsin");
    appendAssistantMsg(welcome.beyan, welcome.body, welcome.duser);

    /* Hızlı soru düğmeleri */
    var quickList = isEn
      ? [
          { label: "Pre vs Post Training?", q: "What is your pre-training vs post-training loss difference?" },
          { label: "M0–M10 Algorithm?", q: "How does the 31,177-line M0–M10 self-iteration algorithm work?" },
          { label: "3D Cephalometric LoRA?", q: "How does 3D cephalometric LoRA work?" },
          { label: "Yusuf & Atlas?", q: "Who are Yusuf and Atlas?" }
        ]
      : [
          { label: "Eğitim Öncesi / Sonrası Farkın?", q: "Eğitim öncesi ve sonrası loss farkın nedir?" },
          { label: "M0–M10 Öz-Yineleme Algoritması?", q: "9 bin satırdan 70 bin satıra M0–M10 algoritması nasıl çalışır?" },
          { label: "3B Sefalometrik LoRA?", q: "3B sefalometrik LoRA deneyi nedir?" },
          { label: "Yusuf ve Atlas İlkeleri?", q: "Yusuf ve Atlas'ın karar ilkeleri nedir?" }
        ];

    quickList.forEach(function (item) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "maya-chip";
      b.textContent = item.label;
      b.addEventListener("click", function () {
        appendUserMsg(item.label);
        var ans = answerQuestion(item.q);
        appendAssistantMsg(ans.beyan, ans.body, ans.duser);
      });
      chipsWrap.appendChild(b);
    });

    function runTourStep(idx) {
      var steps = getTourSteps();
      if (idx < 0 || idx >= steps.length) {
        clearHighlight();
        tourIndex = -1;
        tourStartBtn.textContent = isEn ? "▶ Restart Tour" : "▶ Turu Yeniden Başlat";
        tourNextBtn.hidden = true;
        tourStatus.textContent = isEn ? "Tour Completed ✓" : "Tur Tamamlandı ✓";
        return;
      }
      tourIndex = idx;
      var st = steps[idx];
      tourStatus.textContent = st.title;
      tourStartBtn.textContent = isEn ? "⏹ Stop" : "⏹ Bitir";
      tourNextBtn.hidden = false;
      tourNextBtn.textContent = idx + 1 < steps.length ? (isEn ? "Next Stop →" : "Sonraki Durak →") : (isEn ? "Finish ✓" : "Tamamla ✓");

      clearHighlight();
      var el = document.querySelector(st.sel);
      if (el) {
        activeHighlightedEl = el;
        el.classList.add("maya-tour-active-target");
        try {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (e) {}
      }
      appendAssistantMsg(st.beyan, "**" + st.title + "**\n" + st.text, "");
    }

    tourStartBtn.addEventListener("click", function () {
      if (tourIndex !== -1) {
        runTourStep(-1);
      } else {
        runTourStep(0);
      }
    });

    tourNextBtn.addEventListener("click", function () {
      runTourStep(tourIndex + 1);
    });

    fabBtn.addEventListener("click", function () {
      var isHidden = panel.hasAttribute("hidden");
      if (isHidden) {
        panel.removeAttribute("hidden");
        fabBtn.setAttribute("aria-expanded", "true");
      } else {
        panel.setAttribute("hidden", "");
        fabBtn.setAttribute("aria-expanded", "false");
        clearHighlight();
      }
    });

    closeBtn.addEventListener("click", function () {
      panel.setAttribute("hidden", "");
      fabBtn.setAttribute("aria-expanded", "false");
      clearHighlight();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    });

    voiceBtn.addEventListener("click", function () {
      voiceEnabled = !voiceEnabled;
      voiceBtn.setAttribute("aria-pressed", voiceEnabled ? "true" : "false");
      if (!voiceEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      } else if (voiceEnabled) {
        speakText(isEn ? "Voice narration enabled. Hello, I am Maya." : "Sesli anlatım açıldı. Merhaba, ben Maya.");
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (input.value || "").trim();
      if (!q) return;
      input.value = "";
      appendUserMsg(q);
      var ans = answerQuestion(q);
      appendAssistantMsg(ans.beyan, ans.body, ans.duser);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMayaWidget);
  } else {
    initMayaWidget();
  }
})();
