# ATLAS Ağız Kırpma Aracı (KVKK Seçenek B)

Bu araç, estetik gülüş tasarımı vakalarında hekimin tam yüz hasta fotoğrafını klinik dışına çıkarmadan, doğrudan kendi tarayıcısında kırparak yalnızca kimliksiz ağız-diş görselini ve vaka meta verilerini elde etmesini sağlar.

---

## 1. Ne Yapar?

- **%100 Çevrimdışı ve Yerel Çalışır:** Tarayıcı ortamında, herhangi bir ağ bağlantısı veya harici kütüphane/CDN gerekmeksizin tek başına çalışır.
- **EXIF Yön Bilgisini Uygular ve Meta Verileri Atar:** Yüklenen fotoğrafın çekim açısı düzeltilir; cihaz modeli, GPS konumu, çekim saati ve hasta adına işaret edebilecek tüm EXIF meta verileri sıfırlanır.
- **Kaba Ağız Bölgesi Önerir:** Dış model veya sunucuya ihtiyaç duymadan, görselin alt-orta alanındaki diş beyazı ve dudak kırmızısı renk kümesini analiz ederek kaba bir 16:9 ağız çerçevesi önerir.
- **Hassas Kontrol ve Boyutlandırma Sağlar:** Hekim 16:9 en-boy oranını koruyarak kutuyu taşıyabilir, köşelerden boyutlandırabilir veya hassas yön/ölçek tuşlarını kullanabilir. Hem masaüstü fare hem mobil dokunmatik ekranları destekler.
- **Köprü Standardında Çıktı Üretir:** Kırpılan bölgeyi tam olarak **1304 × 734 px** boyutunda, JPEG 92 kalitesinde, EXIF'siz olarak hazırlar.
- **Rastgele Kimlik Ataması:** Dosya adı için rastgele 8 haneli onaltılık (hex) kimlik üretir (`agiz_<8hex>.jpg` ve `vaka_<8hex>.json`). Dosya adında hekim, hasta veya tarih bilgisi bulunmaz.
- **Kimliksiz Vaka Formu Oluşturur:** Hekimin girdiği klinik parametreleri (cinsiyet, yaş bandı, yüz biçimi, gülüş hattı ve istek notu) içeren JSON dosyasını üretir ve tek tıkla her iki dosyayı hekimin cihazına indirir.
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

Görsel ve algoritmik işlevler, gerçek hasta verisi kullanılmaksızın sentetik olarak çizilen canvas yüzü üzerinden `araclar/kirp_test.html` dosyasında test edilir:
- Otomatik ağız kutusu tespiti
- 1304 × 734 px çıktı ebadı
- 8 haneli rastgele hex dosya adı deseni
- Kimliksiz JSON şeması
- EXIF verisi yokluğu
- Tarayıcı depolama temizliği
