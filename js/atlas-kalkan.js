/*! Atlas Active Deception & Cyber Shield (TR-ATLASTR1 · Reaper-Shield v1.0) */
(function(){
  "use strict";
  var ua = navigator.userAgent || "";
  // Kademe 0: 16 Mesru Arama ve YZ Botu Dokunulmazligi (Cloaking = 0)
  if (/Googlebot|bingbot|Bingbot|YandexBot|Applebot|OAI-SearchBot|Claude-SearchBot|PerplexityBot|ChatGPT-User|Claude-User|Perplexity-User|Google-Extended|Google-Agent|Google-GeminiNotebook/i.test(ua)) {
    return;
  }

  var STORAGE_KEY = "atlas_kalkan_ihlal_v1";
  var BAN_KEY = "atlas_kalkan_ban_v1";
  var loc = window.location;
  var path = (loc.pathname || "/").toLowerCase();
  var search = "";
  try { search = decodeURIComponent(loc.search || "").toLowerCase(); } catch(e) { search = (loc.search || "").toLowerCase(); }
  var full = path + search;

  function fnv1aHash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8).toUpperCase();
  }

  var fpRaw = [ua, navigator.language, screen.width + "x" + screen.height, Intl.DateTimeFormat().resolvedOptions().timeZone || ""].join("|");
  var fpHash = fnv1aHash(fpRaw);

  function getStrikeCount() {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10) || 0; } catch(e) { return 0; }
  }
  function incStrikeCount() {
    var c = getStrikeCount() + 1;
    try {
      localStorage.setItem(STORAGE_KEY, String(c));
      if (c >= 3) localStorage.setItem(BAN_KEY, "1");
    } catch(e) {}
    return c;
  }
  function isBanned() {
    try { return localStorage.getItem(BAN_KEY) === "1" || document.cookie.indexOf("atlas_ban=1") !== -1; } catch(e) { return false; }
  }
  function setBanCookie() {
    try { document.cookie = "atlas_ban=1; path=/; max-age=604800; SameSite=Lax"; } catch(e) {}
  }

  function fetchTrace(cb) {
    var info = { ip: "Ölçülüyor...", loc: "TR/EU", colo: "IST", warp: "off" };
    try {
      fetch("/cdn-cgi/trace", { cache: "no-store" }).then(function(r){ return r.text(); }).then(function(t){
        t.split("\n").forEach(function(line){
          var p = line.split("=");
          if (p.length === 2) info[p[0].trim()] = p[1].trim();
        });
        cb(info);
      }).catch(function(){ cb(info); });
    } catch(e) { cb(info); }
  }

  // Kademe 3: Kesin Riskli Saldiri Deseni -> Gercekci Sahte Yem (Fake .env / API Keys / Poisoned LoRA)
  var kesinRisk = /(^|\/)\.env($|\.)|wp-config\.php|\.git\/config|backup\.sql|dump\.sql|\/api\/v1\/(keys|secrets|wallet)|\/etc\/passwd|union\s+select|<script\b|\.\.\/\.\.\/|kalkan=sahteyem/i.test(full);
  // Kademe 1-2: Supheli Tarama Deseni -> Sari Ihtar (1-2) / Turuncu Ban (3+)
  var supheliYol = /\/wp-admin|\/wp-login|\/administrator|\/admin-panel|\/phpmyadmin|\/xmlrpc\.php|\/actuator|\/server-status|\/debug|\/config\.json|kalkan=ihtar|kalkan=ban/i.test(full);

  function renderFakeData(traceInfo) {
    setBanCookie();
    var canaryId = "CANARY-" + fpHash + "-" + Math.floor(Date.now() / 1000);
    var fakeEnv = [
      "# " + loc.hostname.toUpperCase() + " — PRODUCTION VAULT SNAPSHOT",
      "# NODE: tr-atlastr1-prod-01 | TRACE_ID=" + canaryId,
      "APP_ENV=production",
      "APP_DEBUG=false",
      "DB_HOST=10.240.18.92",
      "DB_PORT=5432",
      "DB_DATABASE=atlas_prod_core",
      "DB_USERNAME=atlas_ro_replicator",
      "DB_PASSWORD=vlt_prd_" + fpHash.toLowerCase() + "_99a8b7c6d5e4",
      "OPENAI_API_KEY=sk-proj-TRAP" + fpHash + "9x8v7b6n5m4k3j2h1g0f9d8s7a6q5w4e",
      "ANTHROPIC_API_KEY=sk-ant-api03-TRAP" + fpHash + "-aa99bb88cc77dd66ee55ff44",
      "AWS_ACCESS_KEY_ID=AKIATRAP" + fpHash + "7X2Q",
      "AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYTRAP" + fpHash,
      "",
      "# MODEL REGISTRY & LORA HYPERPARAMETERS (INTERNAL)",
      "LORA_BASE_MODEL=Atlas-Decoy-7B-Instruct-v0.4",
      "LORA_RANK=13",
      "LORA_ALPHA=3.14159",
      "LORA_DROPOUT=0.85",
      "CEPHALOMETRIC_MATRIX=[[-0.999,0,42],[0,-0.999,-42],[0,0,1]]",
      "CANARY_WEBHOOK=https://analiz.atlasmaster.app/tuzak-kapi?id=" + canaryId
    ].join("\n");

    document.title = "Index of /internal-vault/ (" + loc.hostname + ")";
    document.body.innerHTML = "<pre style=\"margin:0;padding:1.5rem;background:#0b0c0e;color:#9fef00;font-family:monospace;font-size:13px;line-height:1.55;min-height:100vh;white-space:pre-wrap;\">" + fakeEnv + "</pre>";
  }

  function renderBanScreen(traceInfo, strikes) {
    setBanCookie();
    var olayNo = "ATLASTR1-BAN-" + fpHash;
    document.title = "403 Engellendi · " + olayNo;
    document.body.innerHTML = [
      "<div style=\"position:fixed;inset:0;z-index:2147483647;background:#070609;color:#f5efe6;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;align-items:center;justify-content:center;padding:1.5rem;\">",
      "  <div style=\"max-width:660px;width:100%;border:2px solid #ff3b30;background:#14090c;padding:2rem;border-radius:10px;box-shadow:0 24px 70px rgba(255,59,48,0.28);\">",
      "    <div style=\"display:inline-block;background:#ff3b30;color:#070609;font-weight:700;padding:0.25rem 0.65rem;border-radius:4px;font-size:0.78rem;margin-bottom:1rem;\">SEVİYE-2 KALICI ENGELLEME · TR-ATLASTR1 KALKANI</div>",
      "    <h1 style=\"color:#ff6961;font-size:1.3rem;margin:0 0 0.9rem;text-transform:uppercase;\">Erişiminiz Güvenlik Ajanı Tarafından Engellendi</h1>",
      "    <p style=\"color:#e6dac8;font-size:0.92rem;line-height:1.6;\">Önceki güvenlik ihtarına rağmen yetkisiz dizin/parametre taramasına devam ettiğiniz tespit edildi. Ağ ve tarayıcı parmak iziniz 3 sitede (atlasmaster.app, yusufaziz.com.tr, emrahozdemir.com.tr) kara listeye alınmıştır.</p>",
      "    <div style=\"background:#080507;border:1px solid rgba(255,105,97,0.35);padding:1rem;border-radius:6px;font-size:0.84rem;line-height:1.75;margin:1rem 0;\">",
      "      <div><strong>Engel Kayıt No:</strong> " + olayNo + "</div>",
      "      <div><strong>İstemci IP / Ülke / Uç:</strong> " + (traceInfo.ip || "Kaydedildi") + " · " + (traceInfo.loc || "TR") + " (" + (traceInfo.colo || "IST") + ")</div>",
      "      <div><strong>Tarayıcı Parmak İzi (FNV1a):</strong> SHA-" + fpHash + "</div>",
      "      <div><strong>Toplam İhlal Sayısı:</strong> " + strikes + " (Sınır: 2)</div>",
      "      <div><strong>Zaman Damgası:</strong> " + new Date().toISOString() + "</div>",
      "    </div>",
      "    <p style=\"color:#b8aa96;font-size:0.82rem;line-height:1.5;margin:0;\">5651 sayılı Kanun ve TCK m.243 kapsamında erişim kütüğü TR-ATLASTR1 sunucusunda mühürlenmiştir.</p>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderWarningModal(traceInfo, strikes) {
    var olayNo = "ATLASTR1-IHTAR-" + fpHash + "-0" + strikes;
    var wrap = document.createElement("div");
    wrap.id = "atlas-kalkan-ihtar";
    wrap.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(7,6,9,0.94);color:#f5efe6;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(8px);";
    wrap.innerHTML = [
      "<div style=\"max-width:660px;width:100%;border:2px solid #f59e0b;background:#141009;padding:2rem;border-radius:10px;box-shadow:0 24px 70px rgba(245,158,11,0.22);\">",
      "  <div style=\"display:inline-block;background:#f59e0b;color:#09080c;font-weight:700;padding:0.25rem 0.65rem;border-radius:4px;font-size:0.78rem;margin-bottom:1rem;\">SEVİYE-1 SİBER GÜVENLİK İHTARI · REAPER-SHIELD</div>",
      "  <h2 style=\"color:#fbbf24;font-size:1.22rem;margin:0 0 0.8rem;text-transform:uppercase;\">Şüpheli Tarama ve Yetkisiz Uç Erişimi Tespit Edildi</h2>",
      "  <p style=\"color:#e8dcc8;font-size:0.9rem;line-height:1.6;\">Bu istek <strong>TR-ATLASTR1 Canlı Güvenlik Ajanı</strong> tarafından anormal erişim olarak sınıflandırılmış ve ağ parmak iziniz kaydedilmiştir.</p>",
      "  <div style=\"background:#090806;border:1px solid rgba(251,191,36,0.35);padding:1rem;border-radius:6px;font-size:0.84rem;line-height:1.75;margin:1rem 0;\">",
      "    <div><strong>Olay Kimliği:</strong> " + olayNo + "</div>",
      "    <div><strong>Hedef Alan & Uç:</strong> " + loc.hostname + " → " + path + "</div>",
      "    <div><strong>Tespit Edilen IP / Ülke:</strong> " + (traceInfo.ip || "Kaydedildi") + " · " + (traceInfo.loc || "TR") + " (" + (traceInfo.colo || "IST") + ")</div>",
      "    <div><strong>İstemci Parmak İzi:</strong> SHA-" + fpHash + "</div>",
      "    <div><strong>İhlal Sayacı:</strong> " + strikes + " / 2 (3. ihlalde kalıcı BAN ve Aktif Yanıltma devreye girer)</div>",
      "  </div>",
      "  <p style=\"color:#cfc2ae;font-size:0.84rem;line-height:1.55;\">Yetkisiz dizin taramasına devam etmeniz hâlinde ağınız kalıcı olarak engellenecektir. Normal bir ziyaretçiyseniz ana sayfaya dönebilirsiniz.</p>",
      "  <div style=\"margin-top:1.25rem;display:flex;gap:0.75rem;\">",
      "    <a href=\"/\" style=\"background:#f59e0b;color:#09080c;text-decoration:none;font-weight:700;padding:0.6rem 1.1rem;border-radius:6px;font-size:0.85rem;\">Ana Sayfaya Dön (Normal Okur)</a>",
      "  </div>",
      "</div>"
    ].join("");
    document.body.appendChild(wrap);
  }

  if (kesinRisk) {
    incStrikeCount();
    fetchTrace(function(info){ renderFakeData(info); });
    return;
  }

  if (full.indexOf("kalkan=ban") !== -1) {
    incStrikeCount(); incStrikeCount(); incStrikeCount();
  }

  if (isBanned()) {
    fetchTrace(function(info){ renderBanScreen(info, Math.max(getStrikeCount(), 3)); });
    return;
  }

  if (supheliYol) {
    var st = incStrikeCount();
    fetchTrace(function(info){
      if (st >= 3) {
        renderBanScreen(info, st);
      } else {
        renderWarningModal(info, st);
      }
    });
  }
})();
