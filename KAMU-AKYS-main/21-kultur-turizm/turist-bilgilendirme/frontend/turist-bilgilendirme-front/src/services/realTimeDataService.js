import axios from 'axios';

// Enhanced Real-Time Data Service - Spesifik açık kaynak veri entegrasyonu
class RealTimeDataService {
  constructor() {
    this.client = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // API endpoints
    this.endpoints = {
      // AFAD - Toplanma Alanları
      afadShelters: 'https://tamp.afad.gov.tr/ToplanmaAlanlari.json',
      
      // İBB Open Data
      ibbCultural: 'https://data.ibb.gov.tr/api/action/datastore_search',
      ibbTransport: 'https://data.ibb.gov.tr/api/action/datastore_search',
      ibbHealth: 'https://data.ibb.gov.tr/api/action/datastore_search',
      
      // OpenStreetMap Overpass API
      overpass: 'https://overpass-api.de/api/interpreter',
      
      // GeoNames
      geonames: 'https://api.geonames.org',
      
      // OpenTripMap
      opentripmap: 'https://api.opentripmap.com/0.1/tr',
      
      // Cultural Events
      culturalEvents: 'https://public.opendatasoft.com/api/records/1.0/search/',
      
      // Natural Earth Data (Backup)
      naturalEarth: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA'
    };

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.response.use(
      response => response.data,
      error => {
        console.warn(`API Error (${error.config?.url}):`, error.message);
        return Promise.reject(error);
      }
    );
  }

  // 1. AFAD Toplanma Alanları
  async getAfadShelterAreas() {
    try {
      console.log('🚨 AFAD toplanma alanları getiriliyor...');
      const response = await this.client.get(this.endpoints.afadShelters);
      
      return response.map(area => ({
        id: area.ID || `afad_${Math.random()}`,
        title: area.ALAN_ADI || 'Toplanma Alanı',
        location: `${area.ILCE_ADI}, ${area.IL_ADI}`,
        category: 'Acil Durum',
        type: 'toplanma_alani',
        coordinates: {
          lat: parseFloat(area.ENLEM),
          lng: parseFloat(area.BOYLAM)
        },
        description: `Kapasite: ${area.KISI_KAPASITESI} kişi - ${area.ALAN_TIPI}`,
        capacity: area.KISI_KAPASITESI,
        area: area.ALAN_BUYUKLUGU,
        district: area.ILCE_ADI,
        city: area.IL_ADI,
        image: 'https://source.unsplash.com/600x400/?emergency,shelter',
        source: 'AFAD'
      })).filter(area => area.coordinates.lat && area.coordinates.lng);
    } catch (error) {
      console.error('AFAD veri hatası:', error);
      return [];
    }
  }

  // 2. İBB Kültür Sanat Etkinlikleri
  async getIbbCulturalEvents() {
    try {
      console.log('🎭 İBB kültür sanat etkinlikleri getiriliyor...');
      const response = await this.client.get(this.endpoints.ibbCultural, {
        params: {
          resource_id: 'f4261c73-4b6e-4c1e-a8e1-24d9c9bb8c0e', // İBB kültür etkinlikleri dataset ID
          limit: 50
        }
      });
      
      return response.result?.records?.map(event => ({
        id: event._id || `ibb_event_${Math.random()}`,
        title: event.ETKINLIK_ADI || 'Kültürel Etkinlik',
        location: `${event.MEKAN_ADI}, İstanbul`,
        category: 'Etkinlik',
        type: 'kultur_sanat',
        date: event.BASLANGIC_TARIHI,
        endDate: event.BITIS_TARIHI,
        venue: event.MEKAN_ADI,
        district: event.ILCE,
        description: event.ACIKLAMA || 'İBB kültür sanat etkinliği',
        isFree: event.UCRET_DURUMU === 'Ücretsiz',
        price: event.UCRET_BILGISI,
        image: `https://source.unsplash.com/600x400/?${event.ETKINLIK_TURU || 'culture'}`,
        source: 'İBB'
      })) || [];
    } catch (error) {
      console.error('İBB kültür etkinlikleri hatası:', error);
      return [];
    }
  }

  // 3. İBB Sağlık Kuruluşları
  async getIbbHealthFacilities() {
    try {
      console.log('🏥 İBB sağlık kuruluşları getiriliyor...');
      const response = await this.client.get(this.endpoints.ibbHealth, {
        params: {
          resource_id: 'a1b8ec14-5669-4e1b-a0b5-bc5c3c4f1d23', // Sağlık kuruluşları dataset ID
          limit: 100
        }
      });
      
      return response.result?.records?.map(facility => ({
        id: facility._id || `ibb_health_${Math.random()}`,
        title: facility.KURUM_ADI || 'Sağlık Kuruluşu',
        location: `${facility.ILCE}, İstanbul`,
        category: 'Acil Durum',
        type: 'saglik_kurumu',
        coordinates: {
          lat: parseFloat(facility.ENLEM),
          lng: parseFloat(facility.BOYLAM)
        },
        address: facility.ADRES,
        phone: facility.TELEFON,
        facilityType: facility.KURUM_TURU,
        district: facility.ILCE,
        description: `${facility.KURUM_TURU} - ${facility.ADRES}`,
        image: 'https://source.unsplash.com/600x400/?hospital,medical',
        source: 'İBB'
      })).filter(facility => facility.coordinates.lat && facility.coordinates.lng) || [];
    } catch (error) {
      console.error('İBB sağlık kuruluşları hatası:', error);
      return [];
    }
  }

  // 4. İBB Otobüs Hatları
  async getIbbBusRoutes() {
    try {
      console.log('🚌 İBB otobüs hatları getiriliyor...');
      const response = await this.client.get(this.endpoints.ibbTransport, {
        params: {
          resource_id: 'a1b8ec14-5669-4e1b-a0b5-bc5c3c4f1d23', // Otobüs hatları dataset ID
          limit: 50
        }
      });
      
      return response.result?.records?.map(route => ({
        id: route._id || `ibb_bus_${Math.random()}`,
        title: `${route.HAT_KODU} - ${route.HAT_ADI}`,
        location: 'İstanbul',
        category: 'Ulaşım',
        type: 'otobus_hatti',
        routeCode: route.HAT_KODU,
        routeName: route.HAT_ADI,
        startPoint: route.GUZERGAH_BASLANGIC,
        endPoint: route.GUZERGAH_BITIS,
        description: `${route.GUZERGAH_BASLANGIC} - ${route.GUZERGAH_BITIS}`,
        image: 'https://source.unsplash.com/600x400/?bus,transport',
        source: 'İBB'
      })) || [];
    } catch (error) {
      console.error('İBB otobüs hatları hatası:', error);
      return [];
    }
  }

  // 5. OpenStreetMap POI'ler (Müzeler, Restoranlar, vs.)
  async getOpenStreetMapPOIs(city = 'Istanbul', poiTypes = ['museum', 'restaurant', 'attraction']) {
    try {
      console.log('🗺️ OpenStreetMap POI\'lar getiriliyor...');
      
      const queries = poiTypes.map(type => {
        switch (type) {
          case 'museum':
            return 'node["tourism"="museum"](area:3600223474);';
          case 'restaurant':
            return 'node["amenity"="restaurant"](area:3600223474);';
          case 'attraction':
            return 'node["tourism"="attraction"](area:3600223474);';
          case 'hotel':
            return 'node["tourism"="hotel"](area:3600223474);';
          default:
            return '';
        }
      }).filter(Boolean);

      const overpassQuery = `
        [out:json][timeout:25];
        (
          ${queries.join('\n          ')}
        );
        out geom 200;
      `;

      const response = await this.client.post(
        this.endpoints.overpass,
        `data=${encodeURIComponent(overpassQuery)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.elements?.map(element => ({
        id: element.id,
        title: element.tags?.name || element.tags?.tourism || 'POI',
        location: `${element.tags?.city || city}`,
        category: this.categorizePOI(element.tags),
        type: element.tags?.tourism || element.tags?.amenity,
        coordinates: {
          lat: element.lat,
          lng: element.lon
        },
        description: this.generatePOIDescription(element.tags),
        website: element.tags?.website,
        phone: element.tags?.phone,
        openingHours: element.tags?.opening_hours,
        cuisine: element.tags?.cuisine,
        rating: element.tags?.stars,
        image: `https://source.unsplash.com/600x400/?${element.tags?.tourism || element.tags?.amenity || 'place'}`,
        source: 'OpenStreetMap'
      })) || [];
    } catch (error) {
      console.error('OpenStreetMap POI hatası:', error);
      return [];
    }
  }

  // 6. OpenTripMap Turistik Yerler
  async getOpenTripMapAttractions(lat = 41.0082, lng = 28.9784, radius = 10000) {
    try {
      console.log('🏛️ OpenTripMap turistik yerler getiriliyor...');
      
      // OpenTripMap API key gerekiyor, demo için simulated data
      const mockAttractions = [
        {
          id: 'otm_1',
          title: 'Hagia Sophia',
          location: 'Istanbul, Turkey',
          category: 'Müze',
          type: 'historic_site',
          coordinates: { lat: 41.0086, lng: 28.9802 },
          description: 'Historic architectural marvel',
          rating: 4.8,
          image: 'https://source.unsplash.com/600x400/?hagia,sophia',
          source: 'OpenTripMap'
        },
        {
          id: 'otm_2',
          title: 'Blue Mosque',
          location: 'Istanbul, Turkey',
          category: 'Tarihi Yer',
          type: 'religious_site',
          coordinates: { lat: 41.0054, lng: 28.9768 },
          description: 'Beautiful Ottoman mosque',
          rating: 4.7,
          image: 'https://source.unsplash.com/600x400/?blue,mosque',
          source: 'OpenTripMap'
        }
      ];

      return mockAttractions;
    } catch (error) {
      console.error('OpenTripMap hatası:', error);
      return [];
    }
  }

  // 7. Kültürel Etkinlikler (OpenDataSoft)
  async getCulturalEventsFromOpenData() {
    try {
      console.log('🎨 Kültürel etkinlikler getiriliyor...');
      const response = await this.client.get(this.endpoints.culturalEvents, {
        params: {
          dataset: 'cultural-events',
          q: 'Turkey OR Istanbul OR Ankara',
          rows: 30,
          facet: 'country',
          facet: 'city'
        }
      });
      
      return response.records?.map(record => ({
        id: record.recordid,
        title: record.fields.event_name || record.fields.title,
        location: `${record.fields.city}, ${record.fields.country}`,
        category: 'Etkinlik',
        type: 'cultural_event',
        date: record.fields.start_date,
        endDate: record.fields.end_date,
        coordinates: {
          lat: record.fields.coordinates?.[0] || 41.0082,
          lng: record.fields.coordinates?.[1] || 28.9784
        },
        description: record.fields.description || 'Kültürel etkinlik',
        venue: record.fields.venue,
        category_detail: record.fields.category,
        image: `https://source.unsplash.com/600x400/?cultural,event,${record.fields.city}`,
        source: 'OpenDataSoft'
      })) || [];
    } catch (error) {
      console.error('Kültürel etkinlikler hatası:', error);
      return [];
    }
  }

  // 8. GeoNames şehir bilgileri
  async getGeoNamesPlaces(query = 'Istanbul', country = 'TR') {
    try {
      console.log('🌍 GeoNames yer bilgileri getiriliyor...');
      const response = await this.client.get(`${this.endpoints.geonames}/searchJSON`, {
        params: {
          q: query,
          country: country,
          maxRows: 20,
          username: 'demo' // Gerçek projede API key kullanın
        }
      });
      
      return response.geonames?.map(place => ({
        id: place.geonameId,
        title: place.name,
        location: `${place.adminName1}, ${place.countryName}`,
        category: 'Coğrafi Konum',
        type: 'geographic_location',
        coordinates: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lng)
        },
        population: place.population,
        elevation: place.elevation,
        timezone: place.timezone,
        description: `${place.fcodeName} - Nüfus: ${place.population?.toLocaleString() || 'N/A'}`,
        image: `https://source.unsplash.com/600x400/?${place.name},${place.countryName}`,
        source: 'GeoNames'
      })) || [];
    } catch (error) {
      console.error('GeoNames hatası:', error);
      return [];
    }
  }

  // Ana veri toplama fonksiyonu
  async getAllRealTimeData(city = 'Istanbul') {
    try {
      console.log('🔄 Tüm gerçek zamanlı veriler toplanıyor...');
      
      const [
        afadShelters,
        ibbEvents,
        ibbHealth,
        ibbTransport,
        osmPOIs,
        tripMapAttractions,
        culturalEvents,
        geoPlaces
      ] = await Promise.allSettled([
        this.getAfadShelterAreas(),
        this.getIbbCulturalEvents(),
        this.getIbbHealthFacilities(),
        this.getIbbBusRoutes(),
        this.getOpenStreetMapPOIs(city, ['museum', 'restaurant', 'hotel']),
        this.getOpenTripMapAttractions(),
        this.getCulturalEventsFromOpenData(),
        this.getGeoNamesPlaces(city)
      ]);

      return {
        emergency: [
          ...(afadShelters.status === 'fulfilled' ? afadShelters.value : []),
          ...(ibbHealth.status === 'fulfilled' ? ibbHealth.value : [])
        ],
        events: [
          ...(ibbEvents.status === 'fulfilled' ? ibbEvents.value : []),
          ...(culturalEvents.status === 'fulfilled' ? culturalEvents.value : [])
        ],
        cultural: [
          ...(osmPOIs.status === 'fulfilled' ? osmPOIs.value.filter(poi => poi.category === 'Müze') : []),
          ...(tripMapAttractions.status === 'fulfilled' ? tripMapAttractions.value : [])
        ],
        transportation: [
          ...(ibbTransport.status === 'fulfilled' ? ibbTransport.value : []),
          ...(osmPOIs.status === 'fulfilled' ? osmPOIs.value.filter(poi => poi.category === 'Ulaşım') : [])
        ],
        restaurants: [
          ...(osmPOIs.status === 'fulfilled' ? osmPOIs.value.filter(poi => poi.type === 'restaurant') : [])
        ],
        accommodations: [
          ...(osmPOIs.status === 'fulfilled' ? osmPOIs.value.filter(poi => poi.type === 'hotel') : [])
        ],
        geographic: [
          ...(geoPlaces.status === 'fulfilled' ? geoPlaces.value : [])
        ],
        timestamp: new Date().toISOString(),
        source: 'Real-Time APIs'
      };
    } catch (error) {
      console.error('Gerçek zamanlı veri toplama hatası:', error);
      throw error;
    }
  }

  // Yardımcı fonksiyonlar
  categorizePOI(tags) {
    if (tags?.tourism === 'museum') return 'Müze';
    if (tags?.tourism === 'attraction') return 'Turistik Mekan';
    if (tags?.amenity === 'restaurant') return 'Restoran';
    if (tags?.tourism === 'hotel') return 'Otel';
    if (tags?.amenity === 'hospital') return 'Acil Durum';
    return 'Genel';
  }

  generatePOIDescription(tags) {
    const parts = [];
    if (tags?.cuisine) parts.push(`Mutfak: ${tags.cuisine}`);
    if (tags?.opening_hours) parts.push(`Açık: ${tags.opening_hours}`);
    if (tags?.website) parts.push('Website mevcut');
    if (tags?.phone) parts.push('Telefon mevcut');
    
    return parts.length > 0 
      ? parts.join(' • ') 
      : tags?.amenity || tags?.tourism || 'Yer bilgisi';
  }
}

// Singleton instance
export const realTimeDataService = new RealTimeDataService();
export default realTimeDataService; 