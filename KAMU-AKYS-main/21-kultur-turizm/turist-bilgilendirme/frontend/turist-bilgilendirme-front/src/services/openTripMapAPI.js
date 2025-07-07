// OpenTripMap API Service
const OPENTRIPMAP_API_BASE_URL = 'https://api.opentripmap.com/0.1/en/places';

class OpenTripMapAPI {
  constructor() {
    // OpenTripMap API free tier - API key gerektirmez
    this.baseURL = OPENTRIPMAP_API_BASE_URL;
  }

  // Fallback sample data
  getFallbackData() {
    return {
      total: 20,
      places: [
        {
          id: 'sample-1',
          name: 'Ayasofya Müzesi',
          description: 'İstanbul\'da bulunan ve dünyaca ünlü olan tarihi yapı, hem müze hem de ibadethane olarak kullanılan muhteşem bir eser.',
          image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop',
          location: {
            lat: 41.0086,
            lon: 28.9802,
            address: 'Sultanahmet, İstanbul'
          },
          category: 'Müze',
          rating: 5,
          url: 'https://www.kulturportali.gov.tr'
        },
        {
          id: 'sample-2',
          name: 'Anıtkabir',
          description: 'Türkiye Cumhuriyeti\'nin kurucusu Mustafa Kemal Atatürk\'ün mezarı ve anıt-müze kompleksi.',
          image: 'https://images.unsplash.com/photo-1583338272664-0a3f38e9e1bf?w=400&h=300&fit=crop',
          location: {
            lat: 39.9254,
            lon: 32.8368,
            address: 'Anıttepe, Ankara'
          },
          category: 'Anıt',
          rating: 5,
          url: 'https://www.anitkabir.gov.tr'
        },
        {
          id: 'sample-3',
          name: 'Kapadokya',
          description: 'Büyüleyici doğal güzellikleri, kaya oluşumları ve sıcak hava balonlarıyla ünlü bölge.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          location: {
            lat: 38.6431,
            lon: 34.8284,
            address: 'Nevşehir, Türkiye'
          },
          category: 'Doğa',
          rating: 5,
          url: 'https://www.kapadokya.gov.tr'
        },
        {
          id: 'sample-4',
          name: 'Pamukkale',
          description: 'Beyaz kalsiyum karbonat terasları ile ünlü, UNESCO Dünya Mirası listesinde yer alan doğal harika.',
          image: 'https://images.unsplash.com/photo-1583055942906-c9bc0d2d4b2b?w=400&h=300&fit=crop',
          location: {
            lat: 37.9200,
            lon: 29.1200,
            address: 'Denizli, Türkiye'
          },
          category: 'Doğa',
          rating: 5,
          url: 'https://www.pamukkale.gov.tr'
        },
        {
          id: 'sample-5',
          name: 'Efes Antik Kenti',
          description: 'Antik çağın en iyi korunmuş şehirlerinden biri olan tarihi alan.',
          image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0dd4d?w=400&h=300&fit=crop',
          location: {
            lat: 37.9792,
            lon: 27.3413,
            address: 'Selçuk, İzmir'
          },
          category: 'Tarihi',
          rating: 5,
          url: 'https://www.efes.gov.tr'
        },
        {
          id: 'sample-6',
          name: 'Galata Kulesi',
          description: 'İstanbul\'un panoramik manzarasını sunan tarihi kule.',
          image: 'https://images.unsplash.com/photo-1524231757912-21518d32cce5?w=400&h=300&fit=crop',
          location: {
            lat: 41.0256,
            lon: 28.9744,
            address: 'Galata, İstanbul'
          },
          category: 'Tarihi',
          rating: 4,
          url: 'https://www.galatakulesi.gov.tr'
        },
        {
          id: 'sample-7',
          name: 'Hierapolis',
          description: 'Pamukkale\'nin yanında bulunan antik şehir kalıntıları.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          location: {
            lat: 37.9244,
            lon: 29.1250,
            address: 'Denizli, Türkiye'
          },
          category: 'Tarihi',
          rating: 4,
          url: 'https://www.hierapolis.gov.tr'
        },
        {
          id: 'sample-8',
          name: 'Topkapı Sarayı',
          description: 'Osmanlı padişahlarının yaşadığı tarihi saray kompleksi.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          location: {
            lat: 41.0115,
            lon: 28.9833,
            address: 'Sultanahmet, İstanbul'
          },
          category: 'Müze',
          rating: 5,
          url: 'https://www.topkapisarayi.gov.tr'
        },
        {
          id: 'sample-9',
          name: 'Hasankeyf',
          description: 'Dicle Nehri kıyısında bulunan tarihi yerleşim yeri.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          location: {
            lat: 37.7175,
            lon: 41.4092,
            address: 'Batman, Türkiye'
          },
          category: 'Tarihi',
          rating: 4,
          url: 'https://www.hasankeyf.gov.tr'
        },
        {
          id: 'sample-10',
          name: 'Nemrut Dağı',
          description: 'Kommagene Krallığı\'ndan kalan anıt mezar ve heykeller.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          location: {
            lat: 37.9800,
            lon: 38.7411,
            address: 'Adıyaman, Türkiye'
          },
          category: 'Anıt',
          rating: 4,
          url: 'https://www.nemrutdagi.gov.tr'
        }
      ],
      regions: []
    };
  }

  // Türkiye'nin major şehirlerinin koordinatları
  turkeyRegions = [
    { name: 'İstanbul', lat: 41.0082, lon: 28.9784, radius: 50000 },
    { name: 'Ankara', lat: 39.9334, lon: 32.8597, radius: 30000 },
    { name: 'İzmir', lat: 38.4192, lon: 27.1287, radius: 30000 },
    { name: 'Antalya', lat: 36.8969, lon: 30.7133, radius: 40000 },
    { name: 'Bursa', lat: 40.1826, lon: 29.0665, radius: 25000 },
    { name: 'Adana', lat: 37.0000, lon: 35.3213, radius: 25000 },
    { name: 'Gaziantep', lat: 37.0662, lon: 37.3833, radius: 20000 },
    { name: 'Konya', lat: 37.8713, lon: 32.4846, radius: 25000 },
    { name: 'Trabzon', lat: 41.0015, lon: 39.7178, radius: 20000 },
    { name: 'Erzurum', lat: 39.9000, lon: 41.2700, radius: 20000 },
    { name: 'Kapadokya', lat: 38.6431, lon: 34.8284, radius: 30000 },
    { name: 'Pamukkale', lat: 37.9200, lon: 29.1200, radius: 15000 }
  ];

  // Gezilecek yerleri kategorilere göre çek
  async getPlacesByRegion(region, kinds = 'interesting_places,museums,monuments') {
    try {
      const url = `${this.baseURL}/radius?radius=${region.radius}&lon=${region.lon}&lat=${region.lat}&kinds=${kinds}&format=json&limit=50`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Her yer için detaylı bilgi al
      const detailedPlaces = await Promise.all(
        data.features?.slice(0, 20).map(async (place) => {
          try {
            return await this.getPlaceDetails(place.properties.xid);
          } catch (error) {
            console.warn(`Failed to get details for place ${place.properties.xid}:`, error);
            return null;
          }
        }) || []
      );

      return {
        region: region.name,
        places: detailedPlaces.filter(place => place !== null)
      };
    } catch (error) {
      console.error(`Error fetching places for ${region.name}:`, error);
      return { region: region.name, places: [] };
    }
  }

  // Spesifik yer detaylarını çek
  async getPlaceDetails(xid) {
    try {
      const url = `${this.baseURL}/xid/${xid}?format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch place details: ${response.status}`);
      }
      
      const place = await response.json();
      
      return {
        id: place.xid,
        name: place.name || 'Bilinmeyen Yer',
        description: this.cleanDescription(place.info?.descr || place.wikipedia_extracts?.text || 'Açıklama bulunamadı'),
        image: place.preview?.source || place.image || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop`,
        location: {
          lat: place.point?.lat || 0,
          lon: place.point?.lon || 0,
          address: place.address?.road || place.address?.city || 'Türkiye'
        },
        category: this.getCategoryFromKinds(place.kinds),
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 arası random rating
        url: place.otm || place.url
      };
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  }

  // Türkiye'nin tüm bölgelerinden gezilecek yerleri çek
  async getAllTurkeyPlaces() {
    try {
      console.log('Türkiye gezilecek yerleri yükleniyor...');
      
      // Önce fallback data'yı döndür, API'yi daha sonra entegre ederiz
      console.log('Fallback data kullanılıyor...');
      return this.getFallbackData();

      // API kodu - şimdilik kapalı (CORS sorunu olabilir)
      /*
      const allRegionsData = await Promise.all(
        this.turkeyRegions.map(region => this.getPlacesByRegion(region))
      );

      // Tüm bölgelerdeki yerleri birleştir
      const allPlaces = allRegionsData.reduce((acc, regionData) => {
        return [...acc, ...regionData.places];
      }, []);

      // Dublika yerleri filtrele (aynı isimli yerler)
      const uniquePlaces = this.removeDuplicates(allPlaces);

      console.log(`${uniquePlaces.length} gezilecek yer bulundu`);
      
      return {
        total: uniquePlaces.length,
        places: uniquePlaces,
        regions: allRegionsData
      };
      */
    } catch (error) {
      console.error('Error fetching all Turkey places:', error);
      console.log('Fallback data kullanılıyor...');
      return this.getFallbackData();
    }
  }

  // Açıklamaları temizle (HTML tagları vs.)
  cleanDescription(description) {
    if (!description) return 'Açıklama bulunamadı';
    
    // HTML taglarını kaldır
    const cleaned = description.replace(/<[^>]*>/g, '');
    
    // İlk 200 karakteri al
    return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
  }

  // Kategori belirle
  getCategoryFromKinds(kinds) {
    if (!kinds) return 'Genel';
    
    if (kinds.includes('museums')) return 'Müze';
    if (kinds.includes('monuments')) return 'Anıt';
    if (kinds.includes('churches')) return 'Dini Yapı';
    if (kinds.includes('castles')) return 'Kale';
    if (kinds.includes('natural')) return 'Doğa';
    if (kinds.includes('historic')) return 'Tarihi';
    if (kinds.includes('architecture')) return 'Mimari';
    
    return 'Gezilecek Yer';
  }

  // Dublika yerleri kaldır
  removeDuplicates(places) {
    const seen = new Set();
    return places.filter(place => {
      const key = `${place.name.toLowerCase()}-${Math.round(place.location.lat * 100)}-${Math.round(place.location.lon * 100)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Belirli bir şehir yakınındaki yerleri çek
  async getPlacesByCity(cityName, radius = 25000) {
    const city = this.turkeyRegions.find(region => 
      region.name.toLowerCase().includes(cityName.toLowerCase())
    );
    
    if (!city) {
      throw new Error(`Şehir bulunamadı: ${cityName}`);
    }
    
    return await this.getPlacesByRegion({ ...city, radius });
  }
}

// Singleton instance
const openTripMapAPI = new OpenTripMapAPI();

export default openTripMapAPI; 