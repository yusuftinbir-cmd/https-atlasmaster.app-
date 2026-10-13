# ATLAS Ağız Kırpma ve Birleştirme Araçları (KVKK Seçenek B)

Bu araç takımı, estetik gülüş tasarımı vakalarında hekimin tam yüz hasta fotoğrafını klinik dışına çıkarmadan, doğrudan kendi tarayıcısında kırparak kimliksiz ağız görselini stüdyoya iletmesini ve stüdyodan dönen tasarım mockup kırpımını yine kendi cihazında tam kareye geri birleştirmesini sağlar.

---

## 1. Ağız Kırpma Aracı (`araclar/kirp.html`) Ne Yapar?

- **%100 Çevrimdışı ve Yerel Çalışır:** Tarayıcı ortamında, herhangi bir ağ bağlantısı veya harici kütüphane/CDN gerekmeksizin tek başına çalışır.
- **EXIF Yön Bilgisini Uygular ve Meta Verileri Atar:** Yüklenen fotoğrafın çekim açısı düzeltilir; cihaz modeli, GPS konumu, çekim saati ve hasta adına işaret edebilecek tüm EXIF meta verileri sıfırlanır.
- **Kaba Ağız Bölgesi Önerir:** Dış model veya sunucuya ihtiyaç duymadan, görselin alt-orta alanındaki diş beyazı ve dudak kırmızısı renk kümesini analiz ederek kaba bir 16:9 ağız çerçevesi önerir.
- **Hassas Kontrol ve Boyutlandırma Sağlar:** Hekim 16:9 en-boy oranını koruyarak kutuyu taşıyabilir, köşelerden boyutlandırabilir veya hassas yön/ölçek tuşlarını kullanabilir. Hem masaüstü fare hem mobil dokunmatik ekranları destekler.
- **Yerli Çözünürlükte Çıktı Üretir:** Kırpım artık yerli çözünürlükte hazırlanır (küçültme yok; kutu genişliği 2048 px'i aşarsa 2048'e küçültülür ve ölçek faktörü JSON'a yazılır; 1000 px altındaysa kullanıcı 'fotoğraf yakın/çözünürlük düşük' uyarısı alır). Çıktı: JPEG 94 kalitesinde, ≤3 MB boyutunda, EXIF'siz `agiz_<8hex>.jpg`.
- **Rastgele Kimlik Ataması:** Dosya adı için rastgele 8 haneli onaltılık (hex) kimlik üretir (`agiz_<8hex>.jpg` ve `vaka_<8hex>.json`). Dosya adında hekim, hasta veya tarih bilgisi bulunmaz.
- **Genişletilmiş Kimliksiz Vaka JSON'u:** Hekimin girdiği klinik parametrelerin yanında şu meta verileri içerir:
  - `kutu`: `{x, y, w, h}` (EXIF yönü uygulanmış özgün piksel koordinatları)
  - `ozgun_boyut`: `{w, h}` (tam karenin genişlik ve yüksekliği)
  - `exif_yon`: uygulanan EXIF yön kodu (1-8)
  - `olcek`: kırpım genişliği / kutu genişliği oranı
  - `kirpim_sha256`: kırpılan görselin SHA-256 özeti
  - `arac_surum`: `"2.0"`
- **İki Dilli Arayüz:** Tek tuşla Türkçe (TR) ve İngilizce (EN) arasında geçiş yapılabilir.

---

## 2. Ne Yapmaz?

- **Ağ Çağrısı Yapmaz:** `fetch`, `XMLHttpRequest`, `WebSocket` veya harici kaynak yüklemesi kesinlikle içermez. Sayfa açıkken internet bağlantısı kesilse bile eksiksiz çalışır.
- **Sunucuya Yükleme Yapmaz:** Fotoğraflar veya form verileri hiçbir harici sunucuya veya bulut sistemine aktarılmaz.
- **Hasta Verisi Saklamaz:** Tarayıcıda `localStorage`, `sessionStorage`, `IndexedDB` veya çerez (cookie) kullanılmaz; sayfa kapatıldığında veya yenilendiğinde veriler bellekten tamamen silinir.
- **Yüz Tanıma Modeli İndirmez:** Tarayıcıya harici ağırlık dosyası veya yapay zeka tespit kütüphanesi indirmez.
- **E-postaya Ekleme / Otomatik İletim Yapmaz:** İletişim kanalı ayrılmıştır; hekim elde ettiği iki dosyayı kendi tercih ettiği güvenli kanal üzerinden iletir.

---

## 3. Kısıtlar ve Sorumluluk

- **Yapay Zeka Yüz Tespiti Yoktur:** Otomatik kutu tespiti, basit bir piksel renk heuristiğidir. Çerçevenin doğruluğu, konumu ve boyutunun nihai kontrolü **hekimin sorumluluğundadır**.
- **Göz ve Burun Yasağı:** Sayfa hekimi açıkça uyarır: Kırpma kutusu içine hastanın gözleri, burnu, dövme veya ayırt edici izleri kesinlikle girmemelidir.

---

## 4. KVKK ve Hukuki Statü Notu

- **Seçenek B Yaklaşımı:** Tam kare hasta fotoğrafının klinik sınırlarında (hekimin kendi cihazında) tutulması ve stüdyoya hiç gönderilmemesi, veri sorumlusu ve veri işleyen açısından en büyük risk azaltım yöntemidir.
- **Kimliksizleştirme vs. Anonimlik:** Kırpılmış ağız görüntüsü stüdyoya ulaştığında doğrudan kimlik bilgisi (isim, yüz bütünü) içermez. Ancak sağlık hukuku ve KVKK mevzuatı kapsamında bu görselin mutlak "anonim veri" sayılıp sayılmayacağı ve hekimin hasta aydınlatma/onam gereklilikleri kurumun hukuk danışmanı ve KVKK avukatı teyidine tabidir.

---

## 5. Doğrulama ve Testler

Görsel ve algoritmik işlevler, gerçek hasta verisi kullanılmaksızın sentetik olarak çizilen canvas yüzü üzerinden test edilir:
- `araclar/kirp_test.html`: Otomatik ağız kutusu tespiti, 16:9 oranı, dosya adı deseni, JSON şeması, EXIF yokluğu ve depolama temizliği (`KIRP_OK`).
- `araclar/birlestir_test.html`: Sentetik tam kare birleştirme, kutu dışı piksel farkının tam 0 olması, kutu içi mockup yerleşimi, 28 px feather tekdüzeliği, çıktı boyutu eşitliği ve tek dosya kaydırıcı üretimi (`BIRLESTIR_OK 8/8`).

---

## 6. Birleştirme Aracı (`araclar/birlestir.html`) ve Hekim İş Akışı

Yusuf'un 13 Ekim 2026 tarihli sorusu ("Kırpma aracı tamam ama birleştirme aracı nasıl olacak?") doğrultusunda geliştirilen birleştirme aracı, stüdyodan dönen mockup kırpımlarını hekimin cihazında duran özgün tam kareye pürüzsüzce geri yerleştirir.

### 4 Adımlı Hekim Akışı

1. **1. Adım — Kırp (`kirp.html`):** Hekim özgün hasta fotoğrafını tarayıcısında açar, 16:9 ağız çerçevesini ayarlar. İndir butonuna basarak iki dosya alır:
   - `agiz_<hex>.jpg` (kimliksiz 16:9 ağız görseli, yerli çözünürlükte)
   - `vaka_<hex>.json` (kutu koordinatları ve klinik veriler)
2. **2. Adım — Yükle:** Hekim yalnızca bu iki dosyayı sisteme yükler. **Tam kare hiçbir zaman stüdyoya gitmez.**
3. **3. Adım — Mockup Kırpımını Al:** Tasarım stüdyosu vakayı işler ve hekime tasarım kırpımlarını iletir:
   - `mockup_<hex>_<FORM>.jpg` (örneğin `mockup_a1b2c3d4_dogal.jpg`, `mockup_a1b2c3d4_hollywood.jpg`)
4. **4. Adım — Birleştir (`birlestir.html`):** Hekim kendi cihazında `birlestir.html` sayfasını açar:
   - Özgün tam kare fotoğrafı seçer (cihazındaki aynı dosya; boyut ve sha JSON ile karşılaştırılır).
   - `vaka_<hex>.json` dosyasını seçer.
   - Stüdyodan gelen `mockup_<hex>_<FORM>.jpg` dosyalarını seçer (birden fazla seçilebilir).
   - "Tam Kareye Birleştir ve Önizle" tuşuna basar.
   - Mockup kırpımı `kutu` koordinatlarına 24–32 px yumuşak geçiş (feather) ile yerleştirilir.

### Stüdyoya Giden ve Gelen Dosyalar Listesi

| Dosya Adı | Yön | Açıklama |
| :--- | :--- | :--- |
| `agiz_<hex>.jpg` | **Stüdyoya GİDER** | Yalnızca kimliksiz 16:9 ağız bölgesi |
| `vaka_<hex>.json` | **Stüdyoya GİDER** | Cinsiyet, yaş, gülüş hattı ve kutu koordinatları |
| `mockup_<hex>_<FORM>.jpg` | **Stüdyodan GELİR** | Stüdyonun ürettiği estetik tasarım kırpımı |
| *Özgün Fotoğraf (`IMG_*.jpg`)* | **Hekimde KALIR** | Cihazdan asla çıkmaz |
| `sonra_<hex>_<FORM>.jpg` | **Hekimde ÜRETİLİR** | Tam kare, özgün çözünürlükte (JPEG 94) birleştirilmiş görsel |
| `kaydirici_<hex>_<FORM>.html` | **Hekimde ÜRETİLİR** | Tek dosya, ağ istemeyen, önce↔sonra interaktif kaydırıcı |

> [!IMPORTANT]
> **tam kare hiçbir zaman stüdyoya gitmez.** Tüm tam kare birleştirme işlemi hekimin tarayıcısındaki yerel HTML5 canvas üzerinde gerçekleşir.

### Çıktı Dosyaları

- **`sonra_<hex>_<FORM>.jpg`:** Özgün fotoğrafın tam çözünürlüğünde, EXIF yönü düzeltilmiş, mockup kırpımı 28 px yumuşak kenar geçişiyle `kutu` alanına monte edilmiş, JPEG 94 kalitesinde tam kare hasta görseli. Kutu dışındaki pikseller özgün fotoğraf ile birebir aynıdır (fark = 0).
- **`kaydirici_<hex>_<FORM>.html`:** `kaydirici_tekdosya.py` ile birebir aynı şablonda, iki kareyi içine gömmüş (base64 JPEG), hiçbir dış CDN, script veya CSS bağlantısı içermeyen, mobilde ve Telegram'da doğrudan açılan tek dosyalık interaktif gülüş tasarımı önizleme sayfası.

### Not: Portal Boyut Kuralı
> [!NOTE]
> portal kuralı güncellenecek: `portal_yukle` (ayrı koşu) kırpım boyut kuralını '1304×734 sabit' yerine '16:9, genişlik 1000–2048' yapacaktır. Bu emir kapsamında `portal_yukle` deposuna dokunulmamıştır.
