# 🖼️ Görsel Dosyaları Organizasyon Kılavuzu

Bu klasör yapısı, turist bilgilendirme platformundaki tüm görselleri organize etmek için tasarlanmıştır.

## 📁 Klasör Yapısı

### 🏛️ `heroes/`
**Amaç:** Ana sayfa hero bölümleri ve büyük arka plan görselleri
- Ana sayfa hero görselleri
- Sayfa başlık görselleri
- Büyük tanıtım görselleri
- **Önerilen boyut:** 1920x1080px (Full HD)
- **Format:** JPG, PNG, WebP

### 🏞️ `destinations/`
**Amaç:** Gezilecek yerler ile ilgili görseller
- Şehir ve bölge fotoğrafları
- Tarihi mekanlar
- Doğal güzellikler
- Turistik yerler
- **Önerilen boyut:** 800x600px
- **Format:** JPG, PNG, WebP

### 🏨 `accommodations/`
**Amaç:** Konaklama tesisleri görselleri
- Otel fotoğrafları
- Pansiyon görselleri
- Kamp alanları
- Tatil köyleri
- **Önerilen boyut:** 600x400px
- **Format:** JPG, PNG

### 🍽️ `restaurants/`
**Amaç:** Yeme-içme mekanları görselleri
- Restoran fotoğrafları
- Yemek görselleri
- Kafe ve bar fotoğrafları
- Mutfak ve şef görselleri
- **Önerilen boyut:** 600x400px
- **Format:** JPG, PNG

### 🎉 `events/`
**Amaç:** Etkinlik ve festival görselleri
- Konser fotoğrafları
- Festival görselleri
- Kültürel etkinlikler
- Spor organizasyonları
- **Önerilen boyut:** 800x600px
- **Format:** JPG, PNG

### 🎨 `icons/`
**Amaç:** İkonlar ve küçük grafikler
- UI ikonları
- Kategori ikonları
- Sosyal medya ikonları
- Navigasyon ikonları
- **Önerilen boyut:** 24x24px, 32x32px, 64x64px
- **Format:** SVG, PNG (şeffaf arka plan)

### 🌅 `backgrounds/`
**Amaç:** Arka plan görselleri ve desenler
- Sayfa arka planları
- Desen ve tekstürler
- Gradient efektleri
- Dekoratif elemanlar
- **Önerilen boyut:** Değişken
- **Format:** JPG, PNG, SVG

### 🏷️ `logos/`
**Amaç:** Logo ve marka görselleri
- Site logosu
- Partner logoları
- Sponsor görselleri
- Marka kimlikleri
- **Önerilen boyut:** Değişken (SVG tercih edilir)
- **Format:** SVG, PNG (şeffaf arka plan)

### 📸 `gallery/`
**Amaç:** Galeri ve çok amaçlı görseller
- Kullanıcı yüklemeleri
- Genel galeri görselleri
- Koleksiyon fotoğrafları
- Diğer kategorilere uymayan görseller
- **Önerilen boyut:** 800x600px
- **Format:** JPG, PNG

### 🔧 `common/`
**Amaç:** Ortak kullanılan görseller
- Placeholder görselleri
- Loading animasyonları
- Hata sayfa görselleri
- Genel UI elemanları
- **Önerilen boyut:** Değişken
- **Format:** SVG, PNG, GIF

## 📋 Dosya Adlandırma Kuralları

### ✅ İyi Örnekler:
- `istanbul-bogazici-sunset.jpg`
- `ankara-castle-main.png`
- `restaurant-turkish-cuisine.jpg`
- `hotel-luxury-room-view.jpg`
- `event-music-festival-2024.jpg`

### ❌ Kötü Örnekler:
- `IMG_001.jpg`
- `photo.png`
- `untitled.jpg`
- `download.jpeg`

## 🎯 Optimizasyon Önerileri

### 📏 Boyut Standartları:
- **Hero görselleri:** 1920x1080px
- **Kart görselleri:** 800x600px veya 600x400px
- **Thumbnail'lar:** 300x200px
- **İkonlar:** 24x24px, 32x32px, 64x64px

### 🗜️ Dosya Boyutu:
- **Hero görselleri:** Max 500KB
- **Kart görselleri:** Max 200KB
- **Thumbnail'lar:** Max 50KB
- **İkonlar:** Max 10KB

### 📱 Responsive Çözünürlükler:
Her görsel için farklı boyutlarda versiyonlar hazırlayın:
- `image-name.jpg` (orijinal)
- `image-name-medium.jpg` (tablet)
- `image-name-small.jpg` (mobil)

## 🚀 Kullanım Örnekleri

### React Component'te Kullanım:
```jsx
// Hero görseli
import heroImage from './images/heroes/istanbul-bosphorus-hero.jpg';

// Destination kartı
import destinationImg from './images/destinations/cappadocia-balloons.jpg';

// Restaurant görseli
import restaurantImg from './images/restaurants/turkish-breakfast.jpg';
```

### CSS'te Background olarak:
```css
.hero-section {
  background-image: url('./images/heroes/turkey-panorama.jpg');
}
```

## 📝 Görselleri Eklerken Dikkat Edilecekler:

1. **Telif hakları:** Sadece özgür kullanımlı veya sahip olduğunuz görselleri ekleyin
2. **Kalite:** Yüksek çözünürlük ve kaliteli görseller tercih edin
3. **Boyut:** Dosya boyutunu optimize edin (web için uygun)
4. **Format:** Modern tarayıcılar için WebP formatını tercih edin
5. **İsimlendirme:** Açıklayıcı ve SEO uyumlu isimler kullanın
6. **Alt metni:** Erişilebilirlik için alt text ekleyin

## 🎨 Renk Paleti ve Stil Rehberi:

Site temasına uygun görseller seçin:
- **Ana renkler:** Mor (#8B5CF6), Mavi (#3B82F6), Cyan (#06B6D4)
- **Aksent renkler:** Turuncu (#F97316), Kırmızı (#EF4444)
- **Nötr renkler:** Gri tonları (#374151, #6B7280, #9CA3AF)

---

💡 **İpucu:** Görselleri ekledikten sonra, performans için ImageComponent bileşenini kullanarak lazy loading ve otomatik optimizasyon özelliklerinden yararlanın. 