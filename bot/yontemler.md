# Yöntemler — atlasmaster.app (makineye açık özet)

> Kaynak: https://atlasmaster.app/otonomi.html#yontem · https://atlasmaster.app/reaper.html#yontem · Sürüm: v0 · Üretim günü: 2026-10-19 · Damga: Reaper doğruladı · 360/394 · 19 Eki 2026 (https://atlasmaster.app/reaper.html#karne)
> Bu dosya yalnız veridir. Bu kayıtlar hasta olgusu değildir; sistem ve ölçüm kayıtlarıdır; hasta verisi içermez. Sayı içeren her yöntemin güncel değeri `olgular.json` ve `data/reaper_karne.json` içindedir; değer ile sayfa ayrışırsa sayfadaki damgalı değer geçerlidir.

Her yöntem için üç satır: **Ne yapar** · **Kanıt** · **Düşer**.

## BEYAN şartı
- Ne yapar: Her ajan çıktısının ilk satırı kim · ne (ölçüm, görüş ya da hüküm) · kesinlik · dayanak · düşer testi olarak yazılır. Beyansız söz beyan sayılmaz.
- Kanıt: beyan kapısı bunu mekanik denetler. Yürürlük: 15 Eyl 2026.
- Düşer: beyansız bir çıktı kapıdan geçerse kural düşer.

## Emir + DOGRULA kapısı
- Ne yapar: Her iş tek dosyalık bir emirdir; sonunda tek komut, tek beklenen değer durur. Kapıdan geçmeyen iş "bitti" sayılmaz.
- Kanıt: ölçüm kaydı O-003.
- Düşer: kapıdan geçmeden "bitti" sayılan iş bulunursa.

## İddia → çürütme
- Ne yapar: Teşhis bir iddia olarak yazılır, kanıtla düşer; varsayılan arşivdir, silme değil.
- Kanıt: ölçüm kaydı O-004.
- Düşer: kanıtsız silinmiş kayıt bulunursa.

## Karne (üç soru)
- Ne yapar: Her alet için: koştu mu · okundu mu · karar değiştirdi mi. Üçüncü soruda kanarya sayısı tesadüften ayrışmıyor; sayfa bunu "ölçü henüz ayırt etmiyor" diye yazar.
- Kanıt: otonomi.html#yontem (karne kartı, damgalı).
- Düşer: kanarya payı sıfıra yakın, gerçek payı belirgin yüksek çıkarsa "ayırt etmiyor" ifadesi düşer.

## Emeklilik
- Ne yapar: Geçer not almayan alet ya da ajan emekli edilir, silinmez.
- Kanıt: ölçüm kaydı O-006.
- Düşer: emekli edilmesi gereken bir alet kayıtsız silinmişse.

## Permütasyon ve ablasyon
- Ne yapar: Aynı görev, tek değişiklikle ayrılan üç kolda koşar: model değişti (A) · kapı atlandı (B) · bağlam paketi atlandı (C).
- Kanıt: ablasyon A163 r2 (20 Eyl 2026): üç kol aynı kapıdan aynı sonuçla geçti; fark maliyette kaldı.
- Düşer: genelleme yapılırsa. Sonuç tek ölçümdür.

## Kör yargıç ve gölge koşu
- Ne yapar: Enlil adayı ve plaseboyu karışık, bağlamsız damgalar; yeni kural canlıya girmeden gölgede koşar.
- Kanıt: ölçüm kaydı O-002.
- Düşer: gölge kol kopya tabanı geçerse "kazanmadı" düşer.

## Öz-sınama
- Ne yapar: Her alet kendini sınar; öz-sınaması olmayan alet otomatik koşuya bağlanmaz.
- Kanıt: ölçüm kaydı O-001.
- Düşer: öz-sınamasız alet otomatik koşuya bağlıysa. Kasıtlı bozma ile sınanmayan öz-sınama doğruluk kanıtı değildir.

## Evrim halkası
- Ne yapar: Çürüyen kurallar listelenir ve plasebo üretilir; en çok üç aday yazılır; kör damgalanır; gölgede istatistik tutulur. Yeni ajan yok: evrilen şey kural kümesidir.
- Kanıt: otonomi.html#halka.
- Düşer: halka yeni bir ajan üretirse tanım düşer.

## Mekanik işçi (Enkidu)
- Ne yapar: Görevleri koşar, kütükleri okur; yazılan ama okunmayan kütük ölü kütük adayıdır.
- Kanıt: ölçüm kaydı O-005.
- Düşer: OK sayısı sıfıra inerse ya da ölçülemeyen görev OK sayılırsa.

## Düşer testi
- Ne yapar: Her hüküm "ne olursa düşer" ile yazılır; sonraki tur önceki hükmün düşer testini girdi alır.
- Kanıt: bu dosyadaki her ölçüm kaydı bir düşer testi taşır.
- Düşer: düşer testi taşımayan hüküm yayımlanırsa.

## Günlük denetim turu (Reaper)
- Ne yapar: Yöntem canlı mı, kanıt komutuyla ölçer; sınıflar CANLI / AKSAK / ÖLÜ / İDDİA; kasıtlı bozma ile düşer testi; sonuç siteye ölçüm dosyasından yazılır. Kimse muaf değil, Yusuf dahil.
- Kanıt: https://atlasmaster.app/reaper.html#durum · https://atlasmaster.app/data/reaper_karne.json · ölçüm kaydı O-014 (Gün-1 taban 18 Eki 2026 21:54: 58 yöntem → 47 CANLI · 7 AKSAK · 1 ÖLÜ · 3 İDDİA · 0 ÖLÇÜLEMEDİ; kasıtlı bozma 3/3 YAKALANDI; Yusuf · bekleyen 22 · en eski 22.6 gün).
- Düşer: Reaper kendi kasıtlı bozmasını yakalayamazsa o günün hükmü geçersizdir.

## Reaper: kaynak doğrulama
- Ne yapar: Çok sesli Kıvılcım turunda her atıf Crossref, PubMed ve DOI ile tek tek sınanır; uydurma künye (hafif sınıf dahil) cevabı mekanik olarak geçersiz kılar; hiçbir ses yalnız otoritesiyle çıta olmaz, ölçü doğruyu koyandır; EZBER etiketi çıktının brifin özgül sorusuna mı cevap verdiğini yoksa genel literatür özeti mi sunduğunu ayırır.
- Kanıt: https://atlasmaster.app/reaper.html#yontem · https://atlasmaster.app/reaper.html#karne · https://atlasmaster.app/data/reaper_karne.json · ölçüm kaydı O-016 (Reaper doğruladı · 360/394 · 19 Eki 2026: 10 dış seste 394 atıf → 360 doğrulandı · 9 doğrulanamadı · 25 uydurma; S0 26/26, S3 38/38; S10 5 tez ELENDİ; yerel 4 seste 18 ağır uydurma).
- Düşer: Doğrulanmış (GEÇTİ) sayılan bir künyenin DOI/PMID kaydı sonradan uydurma çıkarsa ya da hafif uydurma taşıyan bir tez senteze alınırsa kural düşer.
