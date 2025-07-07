import axios from 'axios';

// OpenData Service - Gerçek zamanlı açık kaynak veri entegrasyonu
class OpenDataService {
  constructor() {
    this.apis = {
      // Türkiye açık veri portali
      dataGovTr: 'https://api.data.gov.tr/v1',
      // Küresel açık veri platformu
      openDataSoft: 'https://public.opendatasoft.com/api/records/1.0',
      // Eventbrite API
      eventbrite: 'https://www.eventbriteapi.com/v3',
      // OpenStreetMap Overpass API
      overpass: 'https://overpass-api.de/api/interpreter',
      // GeoNames API
      geonames: 'https://api.geonames.org',
      // Nominatim for geocoding
      nominatim: 'https://nominatim.openstreetmap.org'
    };
    
    this.setupAxiosInstances();
  }

  setupAxiosInstances() {
    // Genel axios yapılandırması
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Hata yönetimi
    this.client.interceptors.response.use(
      response => response.data,
      error => {
        console.warn('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  // Türkiye kültürel veri setlerini getir
  async getTurkishCulturalData() {
    try {
      // Müzeler ve kültürel mekanlar
      const museums = await this.getMuseumsData();
      const culturalSites = await this.getCulturalSitesData();
      const events = await this.getTurkishEvents();
      
      return {
        museums,
        culturalSites,
        events,
        source: 'data.gov.tr'
      };
    } catch (error) {
      console.error('Türkiye kültürel veri hatası:', error);
      return this.getFallbackTurkishData();
    }
  }

  // Müze verilerini getir
  async getMuseumsData() {
    try {
      // OpenDataSoft'tan müze verisi
      const response = await this.client.get(
        `${this.apis.openDataSoft}/search/`,
        {
          params: {
            dataset: 'museums-of-the-world',
            q: 'Turkey OR Türkiye',
            rows: 50,
            facet: 'country',
            facet: 'city'
          }
        }
      );
      
      return response.records?.map(record => ({
        id: record.recordid,
        title: record.fields.name_of_museum || record.fields.name,
        location: `${record.fields.city}, ${record.fields.country}`,
        category: 'Müze',
        coordinates: {
          lat: record.fields.coordinates?.[0] || 41.0082,
          lng: record.fields.coordinates?.[1] || 28.9784
        },
        description: record.fields.description || 'Müze bilgisi',
        image: `https://source.unsplash.com/600x400/?museum,${record.fields.city}`,
        source: 'OpenDataSoft'
      })) || [];
    } catch (error) {
      console.error('Müze verisi hatası:', error);
      return [];
    }
  }

  // Kültürel alanlar verisi
  async getCulturalSitesData() {
    try {
      // OpenStreetMap'ten kültürel alanları çek
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["tourism"="museum"](country:"TR");
          node["tourism"="attraction"](country:"TR");
          node["historic"](country:"TR");
          node["amenity"="theatre"](country:"TR");
        );
        out geom;
      `;
      
      const response = await this.client.post(
        this.apis.overpass,
        `data=${encodeURIComponent(overpassQuery)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      return response.elements?.slice(0, 30).map(element => ({
        id: element.id,
        title: element.tags?.name || element.tags?.tourism || 'Kültürel Alan',
        location: `${element.tags?.city || 'Türkiye'}`,
        category: this.categorizeCulturalSite(element.tags),
        coordinates: {
          lat: element.lat,
          lng: element.lon
        },
        description: element.tags?.description || 'Kültürel mekan',
        image: `https://source.unsplash.com/600x400/?${element.tags?.tourism || 'culture'}`,
        source: 'OpenStreetMap'
      })) || [];
    } catch (error) {
      console.error('Kültürel alan verisi hatası:', error);
      return [];
    }
  }

  // Türkiye etkinlikleri
  async getTurkishEvents() {
    try {
      // Eventbrite'tan Türkiye etkinlikleri
      const response = await this.client.get(
        `${this.apis.eventbrite}/events/search/`,
        {
          params: {
            'location.address': 'Turkey',
            'categories': '103,105,110', // Müzik, Sanat, Kültür
            'sort_by': 'date',
            'page': 1,
            'expand': 'venue'
          },
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_EVENTBRITE_API_KEY || 'demo'}`
          }
        }
      );
      
      return response.events?.map(event => ({
        id: event.id,
        title: event.name.text,
        location: event.venue?.name || 'Türkiye',
        category: 'Etkinlik',
        date: event.start.local,
        coordinates: {
          lat: event.venue?.latitude || 41.0082,
          lng: event.venue?.longitude || 28.9784
        },
        description: event.description?.text || 'Etkinlik açıklaması',
        image: event.logo?.url || `https://source.unsplash.com/600x400/?event,${event.name.text}`,
        url: event.url,
        source: 'Eventbrite'
      })) || [];
    } catch (error) {
      console.error('Etkinlik verisi hatası:', error);
      return [];
    }
  }

  // Coğrafi bilgi servisi
  async getGeoData(city = 'Ankara') {
    try {
      const response = await this.client.get(
        `${this.apis.geonames}/searchJSON`,
        {
          params: {
            q: city,
            country: 'TR',
            maxRows: 10,
            username: import.meta.env.VITE_GEONAMES_USERNAME || 'demo'
          }
        }
      );
      
      return response.geonames?.map(place => ({
        id: place.geonameId,
        title: place.name,
        location: `${place.adminName1}, Türkiye`,
        category: 'Coğrafi Konum',
        coordinates: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lng)
        },
        population: place.population,
        description: `${place.fcodeName} - Nüfus: ${place.population?.toLocaleString()}`,
        image: `https://source.unsplash.com/600x400/?${place.name},turkey`,
        source: 'GeoNames'
      })) || [];
    } catch (error) {
      console.error('Coğrafi veri hatası:', error);
      return [];
    }
  }

  // Ulaşım bilgileri
  async getTransportationData(city = 'Ankara') {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["public_transport"="station"](around:25000,39.92,32.85);
          node["amenity"="bus_station"](around:25000,39.92,32.85);
          node["railway"="station"](around:25000,39.92,32.85);
        );
        out geom;
      `;
      
      const response = await this.client.post(
        this.apis.overpass,
        `data=${encodeURIComponent(overpassQuery)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      return response.elements?.slice(0, 20).map(element => ({
        id: element.id,
        title: element.tags?.name || 'Ulaşım Durağı',
        location: city,
        category: 'Ulaşım',
        type: element.tags?.public_transport || element.tags?.amenity || 'station',
        coordinates: {
          lat: element.lat,
          lng: element.lon
        },
        description: `${element.tags?.public_transport || 'Ulaşım'} durağı`,
        image: `https://source.unsplash.com/600x400/?transport,${element.tags?.public_transport || 'station'}`,
        source: 'OpenStreetMap'
      })) || [];
    } catch (error) {
      console.error('Ulaşım verisi hatası:', error);
      return [];
    }
  }

  // Acil durum servisleri
  async getEmergencyServices(city = 'Ankara') {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:25000,39.92,32.85);
          node["amenity"="police"](around:25000,39.92,32.85);
          node["amenity"="fire_station"](around:25000,39.92,32.85);
          node["amenity"="pharmacy"](around:25000,39.92,32.85);
        );
        out geom;
      `;
      
      const response = await this.client.post(
        this.apis.overpass,
        `data=${encodeURIComponent(overpassQuery)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      return response.elements?.slice(0, 15).map(element => ({
        id: element.id,
        title: element.tags?.name || 'Acil Servis',
        location: city,
        category: 'Acil Durum',
        type: element.tags?.amenity,
        coordinates: {
          lat: element.lat,
          lng: element.lon
        },
        description: this.getEmergencyDescription(element.tags?.amenity),
        image: `https://source.unsplash.com/600x400/?${element.tags?.amenity}`,
        phone: element.tags?.phone || '112',
        source: 'OpenStreetMap'
      })) || [];
    } catch (error) {
      console.error('Acil durum verisi hatası:', error);
      return [];
    }
  }

  // Tüm kategorilerdeki verileri getir
  async getAllCategories(city = 'Ankara') {
    try {
      const [
        cultural,
        geo,
        transportation,
        emergency
      ] = await Promise.all([
        this.getTurkishCulturalData(),
        this.getGeoData(city),
        this.getTransportationData(city),
        this.getEmergencyServices(city)
      ]);

      return {
        cultural,
        geo,
        transportation,
        emergency,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Kategori verisi hatası:', error);
      return this.getFallbackAllData();
    }
  }

  // Yardımcı fonksiyonlar
  categorizeCulturalSite(tags) {
    if (tags?.tourism === 'museum') return 'Müze';
    if (tags?.tourism === 'attraction') return 'Turistik Mekan';
    if (tags?.historic) return 'Tarihi Yer';
    if (tags?.amenity === 'theatre') return 'Tiyatro';
    return 'Kültürel Alan';
  }

  getEmergencyDescription(type) {
    const descriptions = {
      'hospital': 'Hastane - Acil tıbbi müdahale',
      'police': 'Polis - Güvenlik ve asayiş',
      'fire_station': 'İtfaiye - Yangın ve kurtarma',
      'pharmacy': 'Eczane - İlaç ve sağlık malzemeleri'
    };
    return descriptions[type] || 'Acil durum servisi';
  }

  // Fallback veriler
  getFallbackTurkishData() {
    return {
      museums: [
        {
          id: 'fallback_1',
          title: 'Anadolu Medeniyetleri Müzesi',
          location: 'Ankara, Türkiye',
          category: 'Müze',
          coordinates: { lat: 39.9208, lng: 32.8541 },
          description: 'Anadolu medeniyetlerinin eşsiz eserlerini barındıran müze',
          image: 'https://source.unsplash.com/600x400/?museum,ankara',
          source: 'Fallback'
        }
      ],
      culturalSites: [],
      events: [],
      source: 'Fallback Data'
    };
  }

  getFallbackAllData() {
    return {
      cultural: this.getFallbackTurkishData(),
      geo: [],
      transportation: [],
      emergency: [],
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton instance
export const openDataService = new OpenDataService();
export default openDataService; 