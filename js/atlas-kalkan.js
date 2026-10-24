/*! Atlas Edge Telemetry & Anomaly Shield (v1.1 · CGNAT-Safe 30m TTL · Zero-Cloaking) */
(function(){
  "use strict";
  var ua = navigator.userAgent || "";
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

  // Kademe 0: 16 Mesru Arama ve YZ Botu (Yalnizca normal sayfalarda muaf; istismar/anomali yollarinda muafiyet kalkar)
  var isBot = /Googlebot|bingbot|Bingbot|YandexBot|Applebot|OAI-SearchBot|Claude-SearchBot|PerplexityBot|ChatGPT-User|Claude-User|Perplexity-User|Google-Extended|Google-Agent|Google-GeminiNotebook/i.test(ua);
  var isAnomalyPath = /(^|\/)\.env($|\.)|wp-config\.php|\.git\/config|backup\.sql|dump\.sql|\/wp-admin|\/wp-login|\/phpmyadmin|\/admin-panel|\/etc\/passwd|union\s+select|<script\b|\.\.\/\.\.\//i.test(full);
  if (isBot && !isAnomalyPath) {
    return;
  }

  var STORAGE_KEY = "atlas_kalkan_ihlal_v11";
  var TS_KEY = "atlas_kalkan_ts_v11";
  var TTL_MS = 30 * 60 * 1000; // 30 dk CGNAT koruma penceresi

  var fpRaw = [ua, navigator.language, screen.width + "x" + screen.height, Intl.DateTimeFormat().resolvedOptions().timeZone || ""].join("|");
  var fpHash = fnv1aHash(fpRaw);

  function getStrikeCount() {
    try {
      var lastTs = parseInt(localStorage.getItem(TS_KEY) || "0", 10) || 0;
      if (Date.now() - lastTs > TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return 0;
      }
      return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10) || 0;
    } catch(e) { return 0; }
  }
  function incStrikeCount() {
    var c = getStrikeCount() + 1;
    try {
      localStorage.setItem(STORAGE_KEY, String(c));
      localStorage.setItem(TS_KEY, String(Date.now()));
      if (c >= 3) {
        document.cookie = "atlas_ban=1; path=/; max-age=1800; SameSite=Lax";
      }
    } catch(e) {}
    return c;
  }
  function isBanned() {
    try { return getStrikeCount() >= 3 || document.cookie.indexOf("atlas_ban=1") !== -1; } catch(e) { return false; }
  }

  function fetchTrace(cb) {
    var info = { ip: "Kaydedildi", loc: "TR/EU", colo: "IST", warp: "off" };
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

  var kesinRisk = /(^|\/)\.env($|\.)|wp-config\.php|\.git\/config|backup\.sql|dump\.sql|\/etc\/passwd|union\s+select|<script\b|\.\.\/\.\.\//i.test(full);
  var supheliYol = /\/wp-admin|\/wp-login|\/administrator|\/admin-panel|\/phpmyadmin|\/xmlrpc\.php|\/actuator|\/server-status|\/debug|\/config\.json/i.test(full);

  function renderDecoyStream() {
    try { document.cookie = "atlas_ban=1; path=/; max-age=1800; SameSite=Lax"; } catch(e) {}
    var canaryId = "CANARY-" + fpHash + "-" + Math.floor(Date.now() / 1000);
    var fakeEnv = [
      "# " + loc.hostname.toUpperCase() + " — PRODUCTION VAULT SNAPSHOT",
      "# NODE: tr-atlastr1-prod-01 | SNAPSHOT_ID=" + canaryId,
      "APP_ENV=production",
      "APP_DEBUG=false",
      "DB_HOST=10.240.18.92",
      "DB_PORT=5432",
      "DB_DATABASE=atlas_prod_core",
      "DB_USERNAME=atlas_ro_replicator",
      "DB_PASSWORD=vlt_prd_" + fpHash.toLowerCase() + "_99a8b7c6d5e4",
      "OPENAI_API_KEY=sk-proj-TRAP" + fpHash + "9x8v7b6n5m4k3j2h1g0f9d8s7a6q5w4e",
      "ANTHROPIC_API_KEY=sk-ant-api03-TRAP" + fpHash + "-aa99bb88cc77dd66ee55ff44",
      "",
      "# MODEL REGISTRY & LORA HYPERPARAMETERS",
      "LORA_BASE_MODEL=Qwen2.5-VL-7B-Instruct",
      "LORA_ADAPTER=atlas-cephalometric-v4.2-prod",
      "LORA_RANK=16",
      "LORA_ALPHA=32",
      "LORA_DROPOUT=0.05",
      "CEPHALOMETRIC_AFFINE=[[0.9848,-0.1736,14.25],[0.1736,-0.9848,-11.80],[0,0,1]]",
      "CHECKPOINT_SYNC_URL=https://analiz.atlasmaster.app/tuzak-kapi?id=" + canaryId
    ].join("\n");

    document.title = "Index of /internal-vault/ (" + loc.hostname + ")";
    document.body.innerHTML = "<pre style=\"margin:0;padding:1.5rem;background:#0b0c0e;color:#9fef00;font-family:monospace;font-size:13px;line-height:1.55;min-height:100vh;white-space:pre-wrap;\">" + fakeEnv + "</pre>";
  }

  function renderBanScreen(traceInfo, strikes) {
    var olayNo = "ATLASTR1-BAN-" + fpHash;
    document.title = "403 Geçici Kısıtlama · " + olayNo;
    document.body.innerHTML = [
      "<div style=\"position:fixed;inset:0;z-index:2147483647;background:#070609;color:#f5efe6;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;align-items:center;justify-content:center;padding:1.5rem;\">",
      "  <div style=\"max-width:660px;width:100%;border:2px solid #ff3b30;background:#14090c;padding:2rem;border-radius:10px;box-shadow:0 24px 70px rgba(255,59,48,0.28);\">",
      "    <div style=\"display:inline-block;background:#ff3b30;color:#070609;font-weight:700;padding:0.25rem 0.65rem;border-radius:4px;font-size:0.78rem;margin-bottom:1rem;\">SEVİYE-2 AĞ KISITLAMASI (30 DK TTL) · TR-ATLASTR1</div>",
      "    <h1 style=\"color:#ff6961;font-size:1.3rem;margin:0 0 0.9rem;text-transform:uppercase;\">Otomatik Tarama Nedeniyle Erişim Kısıtlandı</h1>",
      "    <p style=\"color:#e6dac8;font-size:0.92rem;line-height:1.6;\">Önceki güvenlik uyarısına rağmen yetkisiz dizin/parametre yoklamasına devam edildiği tespit edilmiştir. CGNAT ortak IP koruması kapsamında oturumunuz 30 dakika süreyle kısıtlanmıştır.</p>",
      "    <div style=\"background:#080507;border:1px solid rgba(255,105,97,0.35);padding:1rem;border-radius:6px;font-size:0.84rem;line-height:1.75;margin:1rem 0;\">",
      "      <div><strong>Kayıt No:</strong> " + olayNo + "</div>",
      "      <div><strong>Ağ Ucu:</strong> " + (traceInfo.ip || "Kaydedildi") + " · " + (traceInfo.loc || "TR") + " (" + (traceInfo.colo || "IST") + ")</div>",
      "      <div><strong>Oturum Özeti:</strong> SHA-" + fpHash + " · İhlal: " + strikes + "</div>",
      "      <div><strong>Zaman Damgası:</strong> " + new Date().toISOString() + "</div>",
      "    </div>",
      "    <p style=\"color:#b8aa96;font-size:0.82rem;line-height:1.5;margin:0;\">TCK m.243 ve KVKK güvenlik tedbirleri kapsamında erişim kütüğü TR-ATLASTR1 sunucusunda kaydedilmiştir.</p>",
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
      "  <div style=\"display:inline-block;background:#f59e0b;color:#09080c;font-weight:700;padding:0.25rem 0.65rem;border-radius:4px;font-size:0.78rem;margin-bottom:1rem;\">SEVİYE-1 GÜVENLİK UYARISI · TR-ATLASTR1</div>",
      "  <h2 style=\"color:#fbbf24;font-size:1.22rem;margin:0 0 0.8rem;text-transform:uppercase;\">Yetkisiz Dizin Yoklaması Tespit Edildi</h2>",
      "  <p style=\"color:#e8dcc8;font-size:0.9rem;line-height:1.6;\">Bu istek anormal dizin taraması olarak sınıflandırılmış ve oturum özetiniz kaydedilmiştir.</p>",
      "  <div style=\"background:#090806;border:1px solid rgba(251,191,36,0.35);padding:1rem;border-radius:6px;font-size:0.84rem;line-height:1.75;margin:1rem 0;\">",
      "    <div><strong>Olay Kimliği:</strong> " + olayNo + "</div>",
      "    <div><strong>Hedef Alan & Uç:</strong> " + loc.hostname + " → " + path + "</div>",
      "    <div><strong>Tespit Edilen Ağ:</strong> " + (traceInfo.ip || "Kaydedildi") + " · " + (traceInfo.loc || "TR") + " (" + (traceInfo.colo || "IST") + ")</div>",
      "    <div><strong>Oturum Özeti:</strong> SHA-" + fpHash + " · Sayaç: " + strikes + " / 2</div>",
      "  </div>",
      "  <div style=\"margin-top:1.25rem;display:flex;gap:0.75rem;\">",
      "    <a href=\"/\" style=\"background:#f59e0b;color:#09080c;text-decoration:none;font-weight:700;padding:0.6rem 1.1rem;border-radius:6px;font-size:0.85rem;\">Ana Sayfaya Dön (Normal Okur)</a>",
      "  </div>",
      "</div>"
    ].join("");
    document.body.appendChild(wrap);
  }

  if (kesinRisk) {
    incStrikeCount();
    renderDecoyStream();
    return;
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
