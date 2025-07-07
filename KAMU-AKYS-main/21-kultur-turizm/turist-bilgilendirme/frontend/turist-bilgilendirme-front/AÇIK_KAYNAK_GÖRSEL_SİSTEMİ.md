# Açık Kaynak Görsel Sistemi

## 🎯 Amaç
Türkiye Turizm Bilgilendirme Platformu'nda her sayfa için içeriklerle uyumlu, açık lisanslı görselleri otomatik olarak çekmek ve göstermek.

## 📁 Entegre Edilen API'ler ve Veri Kaynakları

### 1. 🏛️ Metropolitan Museum of Art API
- **URL**: `https://collectionapi.metmuseum.org/public/collection/v1/`
- **Lisans**: CC0 1.0 Universal (Public Domain)
- **İçerik**: Sanat eserleri, kültürel objeler, antika eserler
- **Özellikler**: 
  - 450,000+ yüksek kaliteli görsel
  - JSON metadata desteği
  - Ücretsiz kullanım

### 2. 🏛️ Europeana API
- **URL**: `https://api.europeana.eu/record/v2/`
- **Lisans**: Çeşitli Creative Commons lisansları
- **İçerik**: Avrupa'nın dijital kültürel mirası
- **Özellikler**:
  - 50+ milyon kültürel obje
  - Çoklu dil desteği
  - Thumbnail desteği

### 3. 🏛️ Smithsonian Institution API
- **URL**: `https://api.si.edu/openaccess/api/v1.0/`
- **Lisans**: CC0 1.0 Universal (Public Domain)
- **İçerik**: Müze koleksiyonları, tarihi objeler
- **Özellikler**:
  - 11+ milyon açık erişim görseli
  - Detaylı metadata
  - Yüksek çözünürlük

### 4. 🌍 Wikimedia Commons API
- **URL**: `https://commons.wikimedia.org/w/api.php`
- **Lisans**: Creative Commons ve Public Domain
- **İçerik**: Özgür kullanım görselleri
- **Özellikler**:
  - 80+ milyon medya dosyası
  - Çoklu format desteği
  - Dinamik thumbnail üretimi

## 🔧 Teknik Yapı

### Ana Bileşenler

#### 1. `imageService.js`
Ana görsel çekme servisi:
```javascript
import imageService from '../services/imageService';

// Tek görsel çekme
const image = await imageService.getSingleImage('İstanbul müze', 'museum');

// Çoklu görsel çekme
const images = await imageService.fetchImagesForContent('Kapadokya', 'tourism', 5);
```

#### 2. `ImageComponent.jsx`
Tek görsel gösterimi için React bileşeni:
```jsx
<ImageComponent
  query="İstanbul Ayasofya"
  category="museum"
  showAttribution={true}
  showInfo={true}
  count={1}
  aspectRatio="aspect-video"
/>
```

#### 3. `ImageGallery.jsx`
Çoklu görsel galerisi bileşeni:
```jsx
<ImageGallery
  query="Kapadokya balon"
  category="tourism"
  count={8}
  showThumbnails={true}
  showAttribution={true}
/>
```

#### 4. `useImages.js`
React hook for easy image management:
```javascript
const { images, loading, error, refreshImages } = useImages(
  'İstanbul müze', 
  'museum', 
  6
);
```

## 🎨 Özellikler

### ✅ Otomatik Görsel Çekme
- İçerik başlığı ve açıklamasına göre otomatik arama
- Kategori bazlı görsel filtreleme
- Akıllı arama terimi geliştirme

### ✅ Fallback Sistemi
1. **Birincil**: Açık kaynak API'lerden gerçek görseller
2. **İkincil**: Unsplash Source API'den kategori bazlı görseller
3. **Üçüncül**: Varsayılan placeholder görseller

### ✅ Görsel Optimizasyonu
- Otomatik thumbnail üretimi
- Lazy loading desteği
- Progressive image loading
- Error handling ile fallback

### ✅ Lisans ve Atıf Yönetimi
- Otomatik atıf bilgisi ekleme
- Lisans türü gösterimi
- Kaynak bilgileri
- Orijinal görsel bağlantıları

### ✅ Önbellek Sistemi
- 1 saatlik görsel önbelleği
- Performans optimizasyonu
- Gereksiz API çağrılarını önleme

## 📖 Kullanım Kılavuzu

### Temel Kullanım
```jsx
// Basit görsel gösterimi
<ImageComponent 
  query="İstanbul Galata Kulesi" 
  category="architecture" 
/>

// Galeri görünümü
<ImageGallery 
  query="Pamukkale travertenler" 
  category="nature" 
  count={6} 
/>
```

### Gelişmiş Kullanım
```jsx
// Özelleştirilmiş görsel bileşeni
<ImageComponent
  query="Efes Antik Tiyatro"
  category="history"
  className="w-full h-64"
  aspectRatio="aspect-[4/3]"
  showAttribution={true}
  showInfo={true}
  fallbackText="Tarih görseli bulunamadı"
/>

// Tam özellikli galeri
<ImageGallery
  query="Kapadokya peribacaları"
  category="nature"
  count={12}
  showThumbnails={true}
  showAttribution={true}
  className="custom-gallery"
/>
```

### Hook Kullanımı
```javascript
const MyComponent = () => {
  const { 
    images, 
    loading, 
    error, 
    refreshImages, 
    getSingleImage 
  } = useImages('İstanbul müze', 'museum', 4);

  const handleRefresh = () => {
    refreshImages();
  };

  return (
    <div>
      {loading && <p>Yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}
      {images.map(image => (
        <img key={image.url} src={image.url} alt={image.title} />
      ))}
      <button onClick={handleRefresh}>Yenile</button>
    </div>
  );
};
```

## 🎯 Kategori Sistemi

### Desteklenen Kategoriler
- `museum` - Müzeler ve kültürel mekanlar
- `culture` - Kültürel etkinlikler ve gelenekler
- `nature` - Doğal güzellikler ve peyzajlar
- `architecture` - Mimari yapılar ve anıtlar
- `art` - Sanat eserleri ve sergiler
- `history` - Tarihi yerler ve objeler
- `tourism` - Turizm ve seyahat
- `event` - Etkinlikler ve festivaller
- `food` - Yemek ve mutfak kültürü
- `general` - Genel içerik

### Kategori Bazlı Arama Optimizasyonu
```javascript
// Kategori bazlı arama terimi geliştirme
const enhancedQuery = imageService.enhanceQueryForCategory(
  'İstanbul', 
  'museum'
);
// Sonuç: "İstanbul museum artifact culture"
```

## 🔄 Entegrasyon

### Mevcut Sayfalarda Entegrasyon

#### 1. Ana Sayfa (Home.jsx)
```jsx
// Hero section'da dinamik görseller
<ImageComponent
  query={`${destination.title} ${destination.location}`}
  category="tourism"
  aspectRatio="aspect-[4/5]"
/>
```

#### 2. Destinasyon Sayfası (Destinations.jsx)
```jsx
// Destinasyon kartlarında otomatik görseller
<ImageComponent
  query={`${destination.name.tr} ${destination.location.city}`}
  category="tourism"
  className="w-full h-full"
/>
```

#### 3. Destinasyon Detay (DestinationDetail.jsx)
```jsx
// Detay sayfasında galeri
<ImageGallery
  query={`${destination.name.tr} ${destination.location.city}`}
  category="tourism"
  count={8}
  showThumbnails={true}
/>
```

#### 4. Etkinlik Sayfaları (Events.jsx)
```jsx
// Etkinlik kartlarında tema görselleri
<ImageComponent
  query={`${event.title} ${event.category}`}
  category="event"
/>
```

### Kart Bileşenlerinde Entegrasyon

#### DataCard.jsx
```jsx
// Dinamik görsel entegrasyonu
<div className="h-48 overflow-hidden">
  <ImageComponent
    query={`${item.name || item.title} ${item.location || item.city}`}
    category={type}
    className="w-full h-full"
    aspectRatio="aspect-[4/3]"
    showAttribution={false}
  />
</div>
```

## 🎮 Demo ve Test

### Demo Sayfası
`/image-demo` adresinde kapsamlı demo sayfası:
- Canlı arama ve test
- Kategori bazlı filtreleme
- API durumu kontrolü
- Görsel indirme
- Atıf bilgileri

### Test Komutları
```bash
# Geliştirme sunucusunu başlat
npm run dev

# Demo sayfasını ziyaret et
http://localhost:5173/image-demo

# Test sorguları
- "İstanbul Ayasofya"
- "Kapadokya balon"
- "Efes antik tiyatro"
- "Pamukkale travertenler"
```

## 🔍 API Kullanım İstatistikleri

### Günlük Limitler
- **Metropolitan Museum**: Sınırsız (rate limiting var)
- **Europeana**: 10,000 istek/gün (ücretsiz tier)
- **Smithsonian**: 1,000 istek/saat
- **Wikimedia Commons**: Rate limiting ile sınırlı

### Performans Optimizasyonu
- Paralel API çağrıları
- 1 saatlik cache sistemi
- Lazy loading
- Progressive enhancement

## 🚀 Avantajlar

### 1. **Otomatik İçerik Eşleştirme**
- İçerik başlığına göre otomatik görsel bulma
- Kategori bazlı akıllı filtreleme
- Çoklu dil desteği

### 2. **Yüksek Kaliteli Görseller**
- Profesyonel müze koleksiyonları
- Yüksek çözünürlüklü görseller
- Kültürel ve sanatsal değer

### 3. **Yasal Güvenlik**
- Açık lisans garantisi
- Otomatik atıf sistemi
- Telif hakkı sorunu yok

### 4. **Performans**
- Hızlı yükleme
- Önbellek sistemi
- Fallback desteği

### 5. **Kolay Entegrasyon**
- React hook desteği
- Hazır bileşenler
- Minimal kod değişikliği

## 🎯 Sonuç

Bu sistem sayesinde:
- ✅ Tüm sayfalarda otomatik, kaliteli görseller
- ✅ Açık lisanslı içerik güvencesi
- ✅ Kültürel ve sanatsal değer
- ✅ Performans optimizasyonu
- ✅ Kolay bakım ve geliştirme

Artık platformunuzun her sayfasında içeriklerle uyumlu, yüksek kaliteli görseller otomatik olarak görüntülenecektir!

---

## 📧 Destek
Herhangi bir sorun veya öneriniz için lütfen geliştirici ekibi ile iletişime geçin. 