// Fallback Data - Offline durumlar için örnek veriler
export const fallbackData = {
  museums: [
    {
      id: 'museum_1',
      title: 'Anadolu Medeniyetleri Müzesi',
      location: 'Ankara, Türkiye',
      category: 'Müze',
      coordinates: { lat: 39.9208, lng: 32.8541 },
      description: 'Anadolu medeniyetlerinin eşsiz eserlerini barındıran müze. Hitit, Frig, Urartu gibi antik medeniyetlerin eserleri.',
      image: 'https://source.unsplash.com/600x400/?museum,ankara',
      source: 'Fallback'
    },
    {
      id: 'museum_2',
      title: 'Ayasofya Müzesi',
      location: 'İstanbul, Türkiye',
      category: 'Müze',
      coordinates: { lat: 41.0086, lng: 28.9802 },
      description: 'Bizans ve Osmanlı dönemlerinin büyüleyici eserlerini barındıran tarihi yapı.',
      image: 'https://source.unsplash.com/600x400/?hagia,sofia',
      source: 'Fallback'
    },
    {
      id: 'museum_3',
      title: 'Mevlana Müzesi',
      location: 'Konya, Türkiye',
      category: 'Müze',
      coordinates: { lat: 37.8691, lng: 32.5046 },
      description: 'Mevlana Celaleddin Rumi\'nin türbesi ve Mevlevi kültürü müzesi.',
      image: 'https://source.unsplash.com/600x400/?mevlana,konya',
      source: 'Fallback'
    }
  ],

  culturalSites: [
    {
      id: 'cultural_1',
      title: 'Kapadokya Peribacaları',
      location: 'Nevşehir, Türkiye',
      category: 'Doğal Güzellik',
      coordinates: { lat: 38.6431, lng: 34.8331 },
      description: 'Volkanik kayaların oluşturduğu eşsiz peribacaları ve yeraltı şehirleri.',
      image: 'https://source.unsplash.com/600x400/?cappadocia,fairy',
      source: 'Fallback'
    },
    {
      id: 'cultural_2',
      title: 'Efes Antik Kenti',
      location: 'İzmir, Türkiye',
      category: 'Tarihi Alan',
      coordinates: { lat: 37.9397, lng: 27.3411 },
      description: 'Antik dönemin en önemli şehirlerinden biri. Celsus Kütüphanesi ve Büyük Tiyatro.',
      image: 'https://source.unsplash.com/600x400/?ephesus,ancient',
      source: 'Fallback'
    },
    {
      id: 'cultural_3',
      title: 'Pamukkale Travertenleri',
      location: 'Denizli, Türkiye',
      category: 'Doğal Güzellik',
      coordinates: { lat: 37.9205, lng: 29.1202 },
      description: 'Kireçtaşı travertenlerinin oluşturduğu beyaz pamuk görünümlü termal havuzlar.',
      image: 'https://source.unsplash.com/600x400/?pamukkale,white',
      source: 'Fallback'
    }
  ],

  events: [
    {
      id: 'event_1',
      title: 'Ankara Müzik Festivali',
      location: 'Ankara, Türkiye',
      category: 'Müzik',
      date: '2024-06-15T19:00:00',
      coordinates: { lat: 39.9208, lng: 32.8541 },
      description: 'Klasik ve modern müziğin buluştuğu büyük festival. Yerli ve yabancı sanatçılar.',
      image: 'https://source.unsplash.com/600x400/?music,festival',
      source: 'Fallback'
    },
    {
      id: 'event_2',
      title: 'İstanbul Sanat Bienali',
      location: 'İstanbul, Türkiye',
      category: 'Sanat',
      date: '2024-09-10T14:00:00',
      coordinates: { lat: 41.0082, lng: 28.9784 },
      description: 'Çağdaş sanatın en önemli eserlerinin sergilendiği uluslararası bienal.',
      image: 'https://source.unsplash.com/600x400/?art,biennale',
      source: 'Fallback'
    },
    {
      id: 'event_3',
      title: 'Antalya Film Festivali',
      location: 'Antalya, Türkiye',
      category: 'Sinema',
      date: '2024-10-05T20:00:00',
      coordinates: { lat: 36.8969, lng: 30.7133 },
      description: 'Türk ve dünya sinemasının prestijli buluşması. Altın Portakal ödülleri.',
      image: 'https://source.unsplash.com/600x400/?film,festival',
      source: 'Fallback'
    }
  ],

  destinations: [
    {
      id: 'dest_1',
      title: 'Boğaziçi Köprüsü',
      location: 'İstanbul, Türkiye',
      category: 'Landmark',
      coordinates: { lat: 41.0396, lng: 29.0349 },
      description: 'İstanbul\'un simgesi, Avrupa ve Asya\'yı birleştiren muhteşem köprü.',
      image: 'https://source.unsplash.com/600x400/?bosphorus,bridge',
      source: 'Fallback'
    },
    {
      id: 'dest_2',
      title: 'Galata Kulesi',
      location: 'İstanbul, Türkiye',
      category: 'Tarihi Yapı',
      coordinates: { lat: 41.0256, lng: 28.9744 },
      description: 'Bizans döneminden kalma tarihi kule. İstanbul\'un panoramik manzarası.',
      image: 'https://source.unsplash.com/600x400/?galata,tower',
      source: 'Fallback'
    },
    {
      id: 'dest_3',
      title: 'Anıtkabir',
      location: 'Ankara, Türkiye',
      category: 'Anıt',
      coordinates: { lat: 39.9250, lng: 32.8369 },
      description: 'Mustafa Kemal Atatürk\'ün anıt mezarı. Türkiye Cumhuriyeti\'nin kurucu lideri.',
      image: 'https://source.unsplash.com/600x400/?anitkabir,ankara',
      source: 'Fallback'
    }
  ],

  transportation: [
    {
      id: 'trans_1',
      title: 'Ankara Garı',
      location: 'Ankara, Türkiye',
      category: 'Ulaşım',
      type: 'railway',
      coordinates: { lat: 39.9334, lng: 32.8597 },
      description: 'Ana tren istasyonu - Şehirler arası tren bağlantıları',
      image: 'https://source.unsplash.com/600x400/?train,station',
      source: 'Fallback'
    },
    {
      id: 'trans_2',
      title: 'Kızılay Metro İstasyonu',
      location: 'Ankara, Türkiye',
      category: 'Ulaşım',
      type: 'metro',
      coordinates: { lat: 39.9208, lng: 32.8541 },
      description: 'Ana metro istasyonu - Şehir içi ulaşım merkezi',
      image: 'https://source.unsplash.com/600x400/?metro,station',
      source: 'Fallback'
    },
    {
      id: 'trans_3',
      title: 'Esenboğa Havalimanı',
      location: 'Ankara, Türkiye',
      category: 'Ulaşım',
      type: 'airport',
      coordinates: { lat: 40.1281, lng: 32.9951 },
      description: 'Ankara\'nın ana havalimanı - İç ve dış hat uçuşları',
      image: 'https://source.unsplash.com/600x400/?airport,ankara',
      source: 'Fallback'
    }
  ],

  emergency: [
    {
      id: 'emergency_1',
      title: 'Ankara Şehir Hastanesi',
      location: 'Ankara, Türkiye',
      category: 'Acil Durum',
      type: 'hospital',
      coordinates: { lat: 39.9334, lng: 32.8597 },
      description: 'Hastane - Acil tıbbi müdahale',
      phone: '0312 552 60 00',
      image: 'https://source.unsplash.com/600x400/?hospital,medical',
      source: 'Fallback'
    },
    {
      id: 'emergency_2',
      title: 'Ankara Emniyet Müdürlüğü',
      location: 'Ankara, Türkiye',
      category: 'Acil Durum',
      type: 'police',
      coordinates: { lat: 39.9208, lng: 32.8541 },
      description: 'Polis - Güvenlik ve asayiş',
      phone: '155',
      image: 'https://source.unsplash.com/600x400/?police,security',
      source: 'Fallback'
    },
    {
      id: 'emergency_3',
      title: 'Ankara İtfaiye Merkezi',
      location: 'Ankara, Türkiye',
      category: 'Acil Durum',
      type: 'fire_station',
      coordinates: { lat: 39.9180, lng: 32.8540 },
      description: 'İtfaiye - Yangın ve kurtarma',
      phone: '110',
      image: 'https://source.unsplash.com/600x400/?fire,station',
      source: 'Fallback'
    }
  ],

  restaurants: [
    {
      id: 'rest_1',
      title: 'Ankara Lokantası',
      location: 'Ankara, Türkiye',
      category: 'Restoran',
      cuisine: 'Türk Mutfağı',
      coordinates: { lat: 39.9208, lng: 32.8541 },
      description: 'Geleneksel Türk mutfağının lezzetli örnekleri. Ev yemekleri ve kebaplar.',
      image: 'https://source.unsplash.com/600x400/?turkish,restaurant',
      rating: 4.5,
      source: 'Fallback'
    },
    {
      id: 'rest_2',
      title: 'Bosphorus Cafe',
      location: 'İstanbul, Türkiye',
      category: 'Cafe',
      cuisine: 'Kahve & Tatlı',
      coordinates: { lat: 41.0082, lng: 28.9784 },
      description: 'Boğaz manzaralı cafe. Özel kahve çeşitleri ve ev yapımı tatlılar.',
      image: 'https://source.unsplash.com/600x400/?cafe,bosphorus',
      rating: 4.8,
      source: 'Fallback'
    }
  ],

  accommodations: [
    {
      id: 'hotel_1',
      title: 'Ankara Palace Hotel',
      location: 'Ankara, Türkiye',
      category: 'Otel',
      type: '5 Yıldız',
      coordinates: { lat: 39.9208, lng: 32.8541 },
      description: 'Lüks konaklama. Spa, fitness merkezi ve konferans salonları.',
      image: 'https://source.unsplash.com/600x400/?luxury,hotel',
      rating: 4.7,
      priceRange: '₺800-1500',
      source: 'Fallback'
    },
    {
      id: 'hotel_2',
      title: 'Kapadokya Cave Hotel',
      location: 'Nevşehir, Türkiye',
      category: 'Butik Otel',
      type: 'Mağara Otel',
      coordinates: { lat: 38.6431, lng: 34.8331 },
      description: 'Tarihi mağara oteli. Eşsiz Kapadokya deneyimi.',
      image: 'https://source.unsplash.com/600x400/?cave,hotel',
      rating: 4.9,
      priceRange: '₺1200-2000',
      source: 'Fallback'
    }
  ],

  weather: [
    {
      id: 'weather_1',
      city: 'Ankara',
      temperature: 22,
      condition: 'Güneşli',
      humidity: 45,
      windSpeed: 12,
      description: 'Hava açık ve güneşli. Gezilecek yerler için ideal.',
      icon: '☀️',
      source: 'Fallback'
    },
    {
      id: 'weather_2',
      city: 'İstanbul',
      temperature: 25,
      condition: 'Parçalı Bulutlu',
      humidity: 60,
      windSpeed: 8,
      description: 'Hafif bulutlu. Yürüyüş ve açık hava aktiviteleri için uygun.',
      icon: '⛅',
      source: 'Fallback'
    }
  ],

  news: [
    {
      id: 'news_1',
      title: 'Ankara\'da Yeni Müze Açılışı',
      category: 'Kültür',
      date: '2024-05-15',
      description: 'Şehir merkezinde yeni çağdaş sanat müzesi ziyaretçilerini bekliyor.',
      image: 'https://source.unsplash.com/600x400/?museum,opening',
      source: 'Fallback'
    },
    {
      id: 'news_2',
      title: 'Kapadokya\'da Balon Festivali',
      category: 'Etkinlik',
      date: '2024-07-20',
      description: 'Uluslararası sıcak hava balonu festivali büyük ilgi görüyor.',
      image: 'https://source.unsplash.com/600x400/?hot,air,balloon',
      source: 'Fallback'
    }
  ]
};

// Kategorilere göre veri getirme fonksiyonları
export const getFallbackDataByCategory = (category) => {
  switch (category) {
    case 'museums':
    case 'müzeler':
      return fallbackData.museums;
    case 'cultural':
    case 'kültürel':
      return fallbackData.culturalSites;
    case 'events':
    case 'etkinlikler':
      return fallbackData.events;
    case 'destinations':
    case 'destinasyonlar':
      return fallbackData.destinations;
    case 'transportation':
    case 'ulaşım':
      return fallbackData.transportation;
    case 'emergency':
    case 'acil':
      return fallbackData.emergency;
    case 'restaurants':
    case 'restoranlar':
      return fallbackData.restaurants;
    case 'accommodations':
    case 'konaklama':
      return fallbackData.accommodations;
    case 'weather':
    case 'hava':
      return fallbackData.weather;
    case 'news':
    case 'haberler':
      return fallbackData.news;
    default:
      return [];
  }
};

// Tüm kategorileri getir
export const getAllFallbackData = () => {
  return {
    museums: fallbackData.museums,
    culturalSites: fallbackData.culturalSites,
    events: fallbackData.events,
    destinations: fallbackData.destinations,
    transportation: fallbackData.transportation,
    emergency: fallbackData.emergency,
    restaurants: fallbackData.restaurants,
    accommodations: fallbackData.accommodations,
    weather: fallbackData.weather,
    news: fallbackData.news,
    timestamp: new Date().toISOString(),
    source: 'Fallback Data'
  };
};

// Rastgele veri getir
export const getRandomFallbackData = (count = 5) => {
  const allData = [
    ...fallbackData.museums,
    ...fallbackData.culturalSites,
    ...fallbackData.events,
    ...fallbackData.destinations
  ];
  
  return allData
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

export default fallbackData; 