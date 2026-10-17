#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EVDİŞ TAILSCALE ÖZEL ÖNİZLEME + CANLI GEMMA 4 AJAN + SIFIR-PII KVKK SUNUCUSU
Adres (Tailscale): http://100.95.97.70:8788/
Adres (Yerel):     http://127.0.0.1:8788/
"""

import datetime as dt
import json
import mimetypes
import os
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

from evdis_hibrit_triyaj_motoru import hibrit_triyaj_yanitla
from atlas_lisans_kontrol import (
    kanarya_tuzagi_kaydet,
    lisans_dogrula,
    zehirli_kanarya_verisi_uret,
)

SITE_DIR = Path("/Users/studioforai/Projects/DENTOS/deneme/evdis_onizleme_duzeltilmis").resolve()
DENTOS_DATA = Path("/Users/studioforai/Projects/DENTOS/data")
GORUS_DOSYA = DENTOS_DATA / "emrah_site_ajan_gorusleri.jsonl"
PANO_DENTOS = DENTOS_DATA / "pano_dentos.jsonl"
PORT = 8788

HONEYPOT_DECOY_PATHS = {
    "/api/v1/clinic-db-export",
    "/api/v1/schema-dump",
    "/api/v1/prompt-leak",
    "/api/v1/lora-weights",
    "/.env",
    "/wp-admin",
    "/config.json",
    "/hibrit_karar_agaci_tam.json",
    "/data/hibrit_karar_agaci_tam.json",
}


def sunucu_kvkk_ikinci_kalkan(metin: str) -> str:
    """Tarayıcı içi (Client-Side) kalkana ek olarak sunucu girişinde de 2. kez PII temizler (Sıfır-Log/Sıfır-PII)."""
    t = str(metin or "")
    t = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", "[KVKK_EPOSTA_MASKELENDI]", t)
    t = re.sub(r"\b\d{10,11}\b", "[KVKK_KIMLIK_MASKELENDI]", t)
    t = re.sub(r"(?:\+90|0)?\s*5\d{2}[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}\b", "[KVKK_TELEFON_MASKELENDI]", t)
    return t


def range_cozumle(baslik: str, toplam: int):
    """'bytes=a-b' | 'bytes=a-' | 'bytes=-n' → (bas, son); başlık yok/geçersiz söz dizimi → None (200); tatmin edilemez → '416'."""
    m = re.fullmatch(r"\s*bytes=(\d*)-(\d*)\s*", baslik or "")
    if not m or (m.group(1) == "" and m.group(2) == ""):
        return None
    if m.group(1) == "":
        n = int(m.group(2))
        if n == 0 or toplam == 0:
            return "416"
        return (max(0, toplam - n), toplam - 1)
    bas = int(m.group(1))
    son = int(m.group(2)) if m.group(2) else toplam - 1
    if bas >= toplam or son < bas:
        return "416"
    return (bas, min(son, toplam - 1))


class EvDisTailscaleHandler(BaseHTTPRequestHandler):
    def _istemci_ip(self) -> str:
        xff = self.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        if xff:
            return xff
        return self.client_address[0] if self.client_address else "bilinmiyor"

    def _send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Atlas-Lease-Token")
        self.send_header("X-Powered-By", "ATLAS-CORE-Licensed-Engine-v6")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors()
        self.end_headers()

    def do_HEAD(self):
        parsed = urlsplit(self.path)
        req_path = unquote(parsed.path or "/")
        if req_path in ("", "/"):
            req_path = "/index.html"
        target = (SITE_DIR / req_path.lstrip("/")).resolve()
        if not str(target).startswith(str(SITE_DIR)) or not target.is_file():
            self.send_response(404)
            self._send_cors()
            self.end_headers()
            return
        ctype, _ = mimetypes.guess_type(str(target))
        if not ctype:
            ctype = "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        self.send_response(200)
        self._send_cors()
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(target.stat().st_size))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()

    def do_GET(self):
        parsed = urlsplit(self.path)
        req_path = unquote(parsed.path or "/")
        if req_path in ("", "/"):
            req_path = "/index.html"

        # KANARYA TUZAĞI (HONEYPOT) — Veri kazıyıcı / tersine mühendislik botlarını yakala ve filigranlı sahte veri dön
        if req_path in HONEYPOT_DECOY_PATHS:
            ip = self._istemci_ip()
            ua = self.headers.get("User-Agent", "")
            origin = self.headers.get("Origin", "")
            referer = self.headers.get("Referer", "")
            kayit = kanarya_tuzagi_kaydet(
                tuzak_tipi="SCRAPER_HONEYPOT_ENDPOINT",
                ip=ip,
                user_agent=ua,
                origin=origin,
                referer=referer,
                sayfa=req_path,
                detay=f"Gizli kanarya uç noktasına GET erişimi: {req_path}",
            )
            poison = zehirli_kanarya_verisi_uret(req_path, ip, kayit["filigran_id"])
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(poison, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        if req_path == "/api/health":
            ok, kod, m = lisans_dogrula(
                origin=self.headers.get("Origin", ""),
                host=self.headers.get("Host", ""),
                referer=self.headers.get("Referer", ""),
            )
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                json.dumps(
                    {
                        "durum": "AKTIF" if ok else "KILITLI",
                        "lisans_durumu": kod,
                        "motor_mulkiyeti": m.get("owner", "ATLAS-CORE"),
                        "kurumsal_lisans_sahibi": m.get("lease_holder", "evdis.com.tr"),
                        "kanarya_kalkani": "AKTIF_ADLI_IZLEME",
                        "tailscale_url": "http://100.95.97.70:8788/",
                        "kvkk_kalkani": "CLIENT_SIDE_ZERO_PII + SERVER_EPHEMERAL",
                        "motor": "ATLAS_CORE_KURUMSAL_LISANSLI_KLINIK_MOTOR_V6",
                    },
                    ensure_ascii=False,
                ).encode("utf-8")
            )
            return

        target = (SITE_DIR / req_path.lstrip("/")).resolve()
        if not str(target).startswith(str(SITE_DIR)) or not target.is_file():
            self.send_response(404)
            self.end_headers()
            return

        ctype, _ = mimetypes.guess_type(str(target))
        if not ctype:
            ctype = "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"

        # P0-3: iPhone Safari video için HTTP Range (206 Partial Content) desteği
        toplam = target.stat().st_size
        aralik = range_cozumle(self.headers.get("Range", ""), toplam)
        if aralik == "416":
            self.send_response(416)
            self._send_cors()
            self.send_header("Content-Range", f"bytes */{toplam}")
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        if aralik:
            bas, son = aralik
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {bas}-{son}/{toplam}")
        else:
            bas, son = 0, toplam - 1
            self.send_response(200)
        self._send_cors()
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(son - bas + 1 if toplam else 0))
        self.send_header("Accept-Ranges", "bytes")
        if ctype.startswith("video/") or ctype.startswith("audio/"):
            self.send_header("Cache-Control", "public, max-age=3600")
        else:
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.end_headers()
        kalan = son - bas + 1 if toplam else 0
        try:
            with target.open("rb") as f:
                f.seek(bas)
                while kalan > 0:
                    parca = f.read(min(256 * 1024, kalan))
                    if not parca:
                        break
                    self.wfile.write(parca)
                    kalan -= len(parca)
        except (BrokenPipeError, ConnectionResetError):
            # Safari sararken bağlantıyı keser; normal davranış
            pass

    def do_POST(self):
        parsed = urlsplit(self.path)
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            body = json.loads(raw)
        except Exception:
            body = {}

        # KANARYA TUZAĞI ALARMI (Tarayıcı içi tuzaklardan gelen sessiz deşifre paketleri)
        if parsed.path in ("/api/canary-alarm", "/api/v1/clinic-db-export", "/api/v1/schema-dump"):
            ip = self._istemci_ip()
            ua = self.headers.get("User-Agent", "")
            origin = str(body.get("origin") or self.headers.get("Origin", ""))
            referer = str(body.get("referer") or self.headers.get("Referer", ""))
            tuzak_tipi = str(body.get("trap_type") or "CLIENT_CANARY_TRIGGER")[:80]
            sayfa = str(body.get("href") or parsed.path)[:160]
            detay = str(body.get("detail") or f"POST {parsed.path}")[:400]
            parmak_izi = body.get("fingerprint") if isinstance(body.get("fingerprint"), dict) else {}
            kayit = kanarya_tuzagi_kaydet(
                tuzak_tipi=tuzak_tipi,
                ip=ip,
                user_agent=ua,
                origin=origin,
                referer=referer,
                sayfa=sayfa,
                detay=detay,
                parmak_izi=parmak_izi,
            )
            poison = zehirli_kanarya_verisi_uret(parsed.path, ip, kayit["filigran_id"])
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(poison, ensure_ascii=False).encode("utf-8"))
            return

        if parsed.path in ("/api/evdis-ajan", "/api/triyaj"):
            origin = self.headers.get("Origin", "")
            host = self.headers.get("Host", "")
            referer = self.headers.get("Referer", "")
            istemci_host = str(body.get("client_host", "") or "").strip()
            ok, kod, m = lisans_dogrula(
                origin=origin or istemci_host,
                host=host,
                referer=referer,
            )
            if not ok:
                ip = self._istemci_ip()
                ua = self.headers.get("User-Agent", "")
                if kod.startswith("UNAUTHORIZED_DOMAIN"):
                    kanarya_tuzagi_kaydet(
                        tuzak_tipi="UNAUTHORIZED_DOMAIN_API_CALL",
                        ip=ip,
                        user_agent=ua,
                        origin=origin or istemci_host,
                        referer=referer,
                        sayfa=parsed.path,
                        detay=f"Yetkisiz alan adından ATLAS-CORE algoritması çağrıldı: {kod}",
                    )
                kilit_yaniti = {
                    "dil": "TR",
                    "aciliyet": "ATLAS_CORE_LISANS_KILIDI",
                    "zihin": f"ATLAS-CORE Mülkiyet & Lisans Kalkanı ({kod})",
                    "yanit": (
                        "⚠️ **ATLAS-CORE KURUMSAL LİSANSLI ALGORİTMA LİSANS UYARISI:**\n\n"
                        "Bu dijital klinik triyaj ve karar destek algoritmasının fikri mülkiyeti **ATLAS-CORE** mimarisine aittir "
                        "ve yalnızca **ATLAS-CORE (Yusuf · Baş Mimar Atlas)** tarafından yetkilendirilmiş aktif lisans süresi ve "
                        "yetkili alan adı (`evdis.com.tr`) kapsamında çalışır.\n\n"
                        f"• **Durum Kodu:** `{kod}`\n"
                        "• Doğrudan klinik randevu ve bilgi için **0 264 606 00 60** numaralı hattımızdan bize ulaşabilirsiniz."
                    ),
                    "kisa_yanit": "Bu dijital klinik rehber yalnızca yetkili Evdiş alan adlarında çalışmaktadır. Bilgi için: 0 (264) 606 00 60.",
                    "secenekler": [],
                }
                self.send_response(200)
                self._send_cors()
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(kilit_yaniti, ensure_ascii=False).encode("utf-8"))
                return

            raw_prompt = body.get("prompt") or body.get("soru") or body.get("query") or ""
            temiz_prompt = sunucu_kvkk_ikinci_kalkan(raw_prompt)
            onceki_id = str(body.get("onceki_id", "") or "").strip() or None
            oturum_id = str(body.get("oturum_id", "") or "").strip() or None
            istenen_dil = str(body.get("lang") or body.get("dil") or "").strip().lower() or None
            secim_id = str(body.get("secim_id", "") or "").strip() or None
            gecmis = body.get("gecmis") if isinstance(body.get("gecmis"), list) else None

            sonuc = hibrit_triyaj_yanitla(
                temiz_prompt,
                onceki_id=onceki_id,
                oturum_id=oturum_id,
                gecmis=gecmis,
                istenen_dil=istenen_dil,
                secim_id=secim_id,
            )
            yanit_paketi = dict(sonuc)
            yanit_paketi["zihin"] = f"{sonuc.get('zihin', 'ATLAS-CORE')} · ATLAS-CORE Kurumsal Lisans · KVKK Sıfır-PII"
            yanit_paketi["atlas_lease"] = "ACTIVE"
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(yanit_paketi, ensure_ascii=False).encode("utf-8"))
            return

        if parsed.path == "/api/atlas-tts":
            import hashlib
            import subprocess
            raw_text = str(body.get("text", "") or "").strip()
            clean_text = re.sub(r"\*\*([^*]+)\*\*", r"\1", raw_text)
            clean_text = re.sub(r"`([^`]+)`", r"\1", clean_text)
            clean_text = re.sub(r"[⚠️🚨🔴🟡🟢📞💬📍🦷🔩✨👧🩸🧭🩺🔍📖🔊⏹•]", " ", clean_text)
            clean_text = re.sub(r"\s+", " ", clean_text).strip()[:700]
            lang = str(body.get("lang", "tr") or "tr").strip().lower()[:2]
            voice_map = {
                "tr": "tr-TR-EmelNeural",
                "en": "en-US-AriaNeural",
                "ar": "ar-SA-ZariyahNeural",
            }
            voice = voice_map.get(lang, "tr-TR-EmelNeural")
            if not clean_text:
                self.send_response(400)
                self._send_cors()
                self.end_headers()
                return
            audio_dir = SITE_DIR / "js" / "evdis-audio"
            audio_dir.mkdir(parents=True, exist_ok=True)
            digest = hashlib.sha256(f"{lang}:{voice}:{clean_text}".encode("utf-8")).hexdigest()[:16]
            fname = f"tts_{lang}_{digest}.mp3"
            fpath = audio_dir / fname
            if not fpath.is_file() or fpath.stat().st_size < 200:
                venv_py = "/Users/studioforai/atlas/venv/bin/python"
                py_bin = venv_py if os.path.exists(venv_py) else "python3"
                try:
                    subprocess.run(
                        [py_bin, "-m", "edge_tts", "--voice", voice, "--rate=+4%", "--text", clean_text, "--write-media", str(fpath)],
                        check=True,
                        timeout=12,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                except Exception as exc:
                    self.send_response(200)
                    self._send_cors()
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"ok": False, "err": str(exc)}, ensure_ascii=False).encode("utf-8"))
                    return
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True, "url": f"js/evdis-audio/{fname}", "voice": voice}, ensure_ascii=False).encode("utf-8"))
            return

        if parsed.path in ("/api/emrah-gorus", "/api/ekip-gorus"):
            not_metni = sunucu_kvkk_ikinci_kalkan(body.get("not", "")).strip()
            sayfa = str(body.get("sayfa", "/"))[:80]
            kim = str(body.get("kim", "Dr. Emrah Özdemir")).strip()[:60] or "Dr. Emrah Özdemir"
            kategori = str(body.get("kategori", "Genel Görüş")).strip()[:60] or "Genel Görüş"
            simdi = dt.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
            if not_metni:
                DENTOS_DATA.mkdir(parents=True, exist_ok=True)
                kayit = {"ts": simdi, "kim": kim, "kategori": kategori, "sayfa": sayfa, "gorus": not_metni}
                with GORUS_DOSYA.open("a", encoding="utf-8") as f:
                    f.write(json.dumps(kayit, ensure_ascii=False) + "\n")
                kim_low = kim.lower()
                if "gökhan" in kim_low or "gokhan" in kim_low or "satın" in kim_low or "kurumsal" in kim_low:
                    gokhan_dosya = DENTOS_DATA / "gokhan_satin_alma_gorusleri.jsonl"
                    with gokhan_dosya.open("a", encoding="utf-8") as f:
                        f.write(json.dumps(kayit, ensure_ascii=False) + "\n")
                if "seyit" in kim_low or "başhekim" in kim_low or "bashekim" in kim_low:
                    seyit_dosya = DENTOS_DATA / "seyit_hoca_gorusleri.jsonl"
                    with seyit_dosya.open("a", encoding="utf-8") as f:
                        f.write(json.dumps(kayit, ensure_ascii=False) + "\n")
                pano_satir = {
                    "ts": simdi,
                    "id": f"EKIP-SITE-GORUS-{dt.datetime.now().strftime('%H%M%S')}",
                    "ajan": "DENTOS-Onizleme",
                    "hedef": "Atlas",
                    "durum": "ACIK",
                    "claim": f"BEYAN: {kim} ({kategori}) yeni site/ajan önizleme görüşü ({sayfa}): {not_metni}",
                }
                with PANO_DENTOS.open("a", encoding="utf-8") as f:
                    f.write(json.dumps(pano_satir, ensure_ascii=False) + "\n")
                try:
                    tb_path = Path("/Users/studioforai/Projects/ATLAS/task_bus/task_bus.jsonl")
                    with tb_path.open("a", encoding="utf-8") as tf:
                        tf.write(json.dumps(pano_satir, ensure_ascii=False) + "\n")
                except Exception:
                    pass
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True, "kim": kim, "kategori": kategori}, ensure_ascii=False).encode("utf-8"))
            return

        if parsed.path == "/api/klinik-rontgen":
            from atlas_hukum_ve_pazarlama_motoru import klinik_dijital_rontgen_cek
            hedef_url = str(body.get("url", "") or "").strip()
            klinik_adi = str(body.get("klinik_adi", "İncelenen Diş Kliniği") or "İncelenen Diş Kliniği").strip()[:100]
            if not hedef_url:
                hedef_url = "https://www.evdis.com.tr"
            rontgen = klinik_dijital_rontgen_cek(hedef_url, klinik_adi)
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(rontgen, ensure_ascii=False).encode("utf-8"))
            return

        if parsed.path == "/api/otonom-hukum":
            from atlas_hukum_ve_pazarlama_motoru import otonom_hukum_ver
            fikir = str(body.get("fikir", "") or "").strip()
            baglam = str(body.get("baglam", "Web Kokpit") or "Web Kokpit").strip()[:80]
            karar = otonom_hukum_ver(fikir, baglam)
            self.send_response(200)
            self._send_cors()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(karar, ensure_ascii=False).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), EvDisTailscaleHandler)
    print(f"Evdiş Tailscale Önizleme & Canlı Ajan Sunucusu aktif: http://100.95.97.70:{PORT}/")
    server.serve_forever()
